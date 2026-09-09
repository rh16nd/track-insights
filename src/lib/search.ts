/** Search, run in the browser against a snapshot instead of on the server.
 *
 * The site's data comes off Vercel's CDN as static JSON (see SNAPSHOT_FILES in
 * lib/api.ts) precisely so no page waits on Render's free tier, which spins the
 * instance down after ~15 minutes idle and then takes about thirty seconds to
 * come back. Two paths could not be snapshotted, and search was one of them:
 * its response depends on what you typed, so there is no fixed set of files to
 * write. The result was that everything on the site loaded instantly and then
 * the first search of the day sat there for half a minute.
 *
 * The response depends on the query. The *input* to it does not. So the API
 * publishes the whole searchable set as one snapshot -- /api/search-index,
 * about 4,000 athletes, 52 KB over the wire -- and the matching happens here.
 * Fetched once, lazily, on the first focus of the search box.
 *
 * The matching rules are duplicated from search_athletes/search_countries in
 * athletics-predictor/api.py, and the duplication is the reason both sides are
 * kept deliberately dumb: a lowercase substring and a three-way rank, nothing
 * that could plausibly drift. If this file is ever unavailable -- a deploy
 * without the snapshot, an offline moment -- searching falls back to the live
 * API and behaves exactly as it did before, slow first request and all.
 */
import { PREFER_STATIC, apiFetch } from "@/lib/api";
import type { CountryHit } from "@/lib/dl-data";

export type SearchHit = {
  name: string;
  disc: string;
  discKey: string;
  mark: string | null;
  worldRank: number | null;
};

export type SearchResponse = { results: SearchHit[]; countries: CountryHit[] };

/** One athlete row, as the index stores it: an array rather than an object,
 * because the four field names would otherwise repeat four thousand times.
 * `columns` in the file says what the positions mean; build_search_index()
 * writes them. */
type IndexRow = [string, string, string | null, number | null];

type SearchIndexFile = {
  columns: string[];
  disciplines: Record<string, string>;
  athletes: IndexRow[];
};

/** The country directory, which was already a snapshot for its own page — so
 * country search needs no new file, just this one read again. */
type CountryFile = { countries: (CountryHit & { topScore?: number })[] };

const ATHLETE_LIMIT = 25;
const COUNTRY_LIMIT = 5;

/** Both fetches are memoised as promises rather than as results, so a burst of
 * keystrokes during the first load shares one request instead of starting five.
 *
 * A failure is memoised too, as null. The realistic causes — a deploy with no
 * snapshot yet, a genuinely offline browser — do not resolve themselves between
 * one keystroke and the next, and retrying on every one of them would be a
 * request per character on the path we are trying to take off the network. */
let indexPromise: Promise<SearchIndexFile | null> | null = null;
let countryPromise: Promise<CountryFile | null> | null = null;

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function loadIndex(): Promise<SearchIndexFile | null> {
  indexPromise ??= fetchJson<SearchIndexFile>("/data/search-index.json").then((d) =>
    Array.isArray(d?.athletes) ? d : null,
  );
  return indexPromise;
}

function loadCountries(): Promise<CountryFile | null> {
  countryPromise ??= fetchJson<CountryFile>("/data/countries.json").then((d) =>
    Array.isArray(d?.countries) ? d : null,
  );
  return countryPromise;
}

/** Start both fetches without waiting for them. Called when the search box
 * takes focus: someone who has clicked into it is about to type, and 52 KB
 * arriving during the first two characters is 52 KB nobody waits for.
 *
 * Safe to call repeatedly — after the first, it is a no-op on a settled
 * promise. */
export function prefetchSearchIndex(): void {
  if (!PREFER_STATIC || typeof window === "undefined") return;
  void loadIndex();
  void loadCountries();
}

/** Mirrors `search_athletes`: a lowercase substring of the name, best world
 * rank first, unranked last. The sort must be stable — the index is in load
 * order (discipline by discipline, each toplist in its own order) and that is
 * what decides ties, here and in Python alike. */
function matchAthletes(index: SearchIndexFile, q: string): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const [name, discKey, mark, worldRank] of index.athletes) {
    if (!name.toLowerCase().includes(q)) continue;
    hits.push({
      name,
      disc: index.disciplines[discKey] ?? discKey,
      discKey,
      mark,
      worldRank,
    });
  }
  hits.sort(
    (a, b) =>
      Number(a.worldRank == null) - Number(b.worldRank == null) ||
      (a.worldRank ?? 9999) - (b.worldRank ?? 9999),
  );
  return hits.slice(0, ATHLETE_LIMIT);
}

/** Mirrors `search_countries`. An exact code ("JAM") outranks a name that
 * starts with the query, which outranks a match in the middle of one — because
 * someone typing three letters usually means the code. Ties go to the stronger
 * nation, by its best Results Score. */
function matchCountries(file: CountryFile, q: string): CountryHit[] {
  const ranked: { rank: number; score: number; country: CountryHit }[] = [];
  for (const c of file.countries) {
    const name = (c.name ?? "").toLowerCase();
    const code = (c.code ?? "").toLowerCase();
    let rank: number;
    if (code === q) rank = 0;
    else if (name.startsWith(q)) rank = 1;
    else if (name.includes(q) || code.includes(q)) rank = 2;
    else continue;
    ranked.push({
      rank,
      score: c.topScore ?? 0,
      country: {
        code: c.code,
        name: c.name,
        area: c.area,
        athleteCount: c.athleteCount,
        disciplineCount: c.disciplineCount,
      },
    });
  }
  ranked.sort((a, b) => a.rank - b.rank || b.score - a.score);
  return ranked.slice(0, COUNTRY_LIMIT).map((r) => r.country);
}

const EMPTY: SearchResponse = { results: [], countries: [] };

/** Two characters is the same floor the API applies. Below it a search matches
 * most of the field and means nothing. */
const MIN_QUERY = 2;

/**
 * Run a search, from the CDN snapshot when there is one and from the live API
 * when there is not.
 *
 * `signal` aborts the same way the API path does. It is deliberately NOT passed
 * to the snapshot fetch: that promise is shared between every caller, and one
 * component unmounting must not cancel the download the next keystroke is
 * waiting on. Instead the signal is checked after the await, and an aborted
 * caller gets the AbortError it expects — which matters, because the results of
 * a superseded keystroke must never land after the ones the user actually
 * wants.
 */
export async function searchAll(query: string, signal?: AbortSignal): Promise<SearchResponse> {
  const q = query.trim().toLowerCase();
  if (q.length < MIN_QUERY) return EMPTY;

  if (PREFER_STATIC) {
    const [index, countries] = await Promise.all([loadIndex(), loadCountries()]);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    if (index) {
      // Countries are best-effort on purpose. If only that file is missing the
      // reader loses a country row; sending the whole search back to a sleeping
      // server to recover it would cost them the thirty seconds this exists to
      // avoid.
      return {
        results: matchAthletes(index, q),
        countries: countries ? matchCountries(countries, q) : [],
      };
    }
  }

  const d = await apiFetch<{ results?: SearchHit[]; countries?: CountryHit[] }>(
    `/api/search?q=${encodeURIComponent(query.trim())}`,
    signal ? { signal } : undefined,
  );
  return { results: d.results ?? [], countries: d.countries ?? [] };
}
