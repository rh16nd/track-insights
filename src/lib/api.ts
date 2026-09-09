/** One place that knows where the API lives, and how to survive it being
 * briefly unavailable.
 *
 * Before this existed, eight call sites each hardcoded
 * `http://localhost:5000`. That is not a dev-only wart -- it is the whole
 * data layer, so the site fetched from the VIEWER's own machine anywhere
 * but the box running api.py, and every page showed its error state. A
 * `/impeccable critique` scored error recovery 1/4 for exactly this: five
 * separately-worded "not reachable" strings, no retries, and a base URL
 * that could not be pointed anywhere else without editing source.
 *
 * `VITE_API_BASE_URL` overrides the base at build time (see .env.example).
 * The localhost default is kept because it is genuinely right for the
 * development setup this project is normally run in -- the point is that it
 * is now a default rather than the only possibility. */
const RAW_BASE = import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:5000";

/** Trailing slashes are stripped so `${API_BASE}/api/x` cannot become a
 * double slash -- Flask treats `//api/x` as a different route and 404s. */
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

/** Whether the API is somewhere other than the developer's own machine.
 * The "is api.py running?" hint is good advice locally and nonsense in
 * production, so the copy branches on this rather than always saying it. */
export const API_IS_LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(API_BASE);

/** Paths whose response is a precomputed SNAPSHOT rather than a live
 * computation, and the static file each maps to.
 *
 * The API runs on Render's free tier, which spins down after ~15 minutes idle.
 * Measured 2026-09-06: a cold request took 32.7s to first byte, against 1.3s
 * warm and 1.2s for Vercel itself — so the first visitor after a quiet spell
 * watched skeletons for half a minute. Barely any of that is our code (the
 * whole Flask app imports in ~3s); it is Render's container start.
 *
 * These responses only change when a data refresh is run and pushed, so they
 * are written out as static JSON (src/build_static_api.py) and served from the
 * CDN alongside the app. That takes the server out of the critical path
 * entirely: there is no cold start to wait for, because there is no server.
 *
 * Athlete profiles are snapshotted too, keyed by name rather than listed here
 * (see ATHLETE_PATH). They are per-athlete rather than one payload, but no less
 * static — and serving them from the CDN also removes a live World Athletics
 * GraphQL call that api.py otherwise makes on every single profile view.
 *
 * /api/search stays on the live API, because its response depends on the query
 * and there is no fixed set of files to write. Nothing waits on it, though:
 * /api/search-index — the whole searchable set, one snapshot — is fetched
 * instead and matched in the browser (lib/search.ts), leaving the route as a
 * fallback. */
const SNAPSHOT_FILES: Record<string, string> = {
  "/api/predictions": "predictions.json",
  "/api/results": "results.json",
  "/api/stats": "stats.json",
  "/api/ultimate": "ultimate.json",
  "/api/world-rankings": "world-rankings.json",
  "/api/news": "news.json",
  "/api/qualification": "qualification.json",
  "/api/countries": "countries.json",
};

const DISCIPLINE_PATH = /^\/api\/discipline\/([A-Za-z0-9_]+)$/;
const ATHLETE_PATH = /^\/api\/athlete\/([A-Za-z0-9_]+)\/(.+)$/;
/** The "why isn't this athlete in the field?" page. Snapshotted for the same
 * reason profiles are, and it matters more: only ~240 athletes have a profile,
 * so this is what the other few thousand searchable names resolve to. */
const ATHLETE_STATUS_PATH = /^\/api\/athlete-status\/([A-Za-z0-9_]+)\/(.+)$/;
const COUNTRY_PATH = /^\/api\/country\/([A-Za-z]{2,3})$/;

/** Filename-safe key for an athlete name. MUST stay identical to
 * `athlete_slug()` in athletics-predictor/src/build_static_api.py, which names
 * the files this reads.
 *
 * Athlete names carry spaces, apostrophes and accents, and the request path is
 * percent-encoded, so the name itself makes a poor file name. Both sides fold
 * it to lowercase ASCII joined by hyphens.
 *
 * If the two ever disagreed on some exotic name, the failure is safe rather
 * than wrong: the file 404s and apiFetch falls back to the live API. It can
 * never serve a different athlete's profile, because the builder refuses to
 * write a file whenever two names in one discipline fold to the same slug. */
function athleteSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Prefer the snapshot in production; prefer the live API in development,
 * where api.py is the source of truth and the checked-in snapshot may be a
 * refresh behind. `VITE_STATIC_API=0` / `=1` overrides either way.
 *
 * Exported because search reads its own snapshot rather than going through
 * apiFetch (the query string means there is no one file to map a path to), and
 * it must make the same choice this does rather than a second, divergent one. */
export const PREFER_STATIC =
  (import.meta.env["VITE_STATIC_API"] ?? (import.meta.env.PROD ? "1" : "0")) !== "0";

function staticUrlFor(path: string): string | null {
  if (!PREFER_STATIC || path.includes("?")) return null;
  const file = SNAPSHOT_FILES[path];
  if (file) return `/data/${file}`;
  const m = DISCIPLINE_PATH.exec(path);
  if (m) return `/data/discipline/${m[1]}.json`;
  const co = COUNTRY_PATH.exec(path);
  // Country files are named by the upper-case IOC code the data uses, so a
  // lower-case URL still finds them.
  if (co) return `/data/country/${(co[1] ?? "").toUpperCase()}.json`;

  const a = ATHLETE_PATH.exec(path);
  if (a) return perAthleteFile("athlete", a[1] ?? "", a[2] ?? "");
  const st = ATHLETE_STATUS_PATH.exec(path);
  if (st) return perAthleteFile("athlete-status", st[1] ?? "", st[2] ?? "");
  return null;
}

function perAthleteFile(dir: string, discKey: string, encodedName: string): string | null {
  let name: string;
  try {
    // The caller encoded this; a malformed sequence is not worth throwing
    // over, so fall through to the live API and let it answer.
    name = decodeURIComponent(encodedName);
  } catch {
    return null;
  }
  const slug = athleteSlug(name);
  return slug ? `/data/${dir}/${discKey}/${slug}.json` : null;
}

/** Wake the API in the background, once per page session.
 *
 * The snapshots above take the server out of the critical path for every page
 * that has one -- but athlete profiles and search are per-request, so they
 * still call it, and on Render's free tier the first of those after an idle
 * spell pays the very ~32s container start the snapshots were added to remove.
 *
 * So the moment a page mounts (instantly, from the CDN) we poke /api/health
 * and throw the answer away. Reading a page takes a few seconds; a cold Render
 * container takes about thirty. Starting the clock at page load rather than at
 * the click means the container is usually up before anyone asks it for
 * anything.
 *
 * Fire-and-forget by design: no await, errors swallowed. It must never delay a
 * render or surface a failure -- if the wake-up doesn't work, the only cost is
 * the wait we would have had anyway. */
let warmed = false;
export function warmApi(): void {
  if (warmed || typeof window === "undefined") return;
  warmed = true;
  void fetch(`${API_BASE}/api/health`).catch(() => {});
}

export class ApiError extends Error {
  /** HTTP status, or 0 when the request never got an answer at all. */
  readonly status: number;
  /** True when retrying later could plausibly work: a network failure or a
   * server-side error. A 404 is not retryable -- it means the pipeline has
   * not produced that file yet, which waiting does not fix. */
  readonly retryable: boolean;

  constructor(message: string, status: number, retryable: boolean) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryable = retryable;
  }
}

const OFFLINE_MESSAGE = API_IS_LOCAL
  ? "Could not reach the prediction API."
  : "Could not reach the prediction API. It may be restarting, so try again in a moment.";

/** Wording used by every surface, so the site says one thing rather than
 * five. `notFound` lets a caller explain what is specifically missing,
 * since "no toplists yet" and "no such athlete" want different advice. */
export function describeApiError(e: unknown, notFound?: string): string {
  if (e instanceof ApiError) {
    if (e.status === 404 && notFound) return notFound;
    return e.message;
  }
  if (e instanceof Error && e.name === "AbortError") return "Request cancelled.";
  return OFFLINE_MESSAGE;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Backoff between attempts. Short on purpose: this is a local-first app and
 * a human is watching a spinner, so the goal is to ride out a server that is
 * mid-reload, not to survive a long outage. */
const RETRY_DELAYS_MS = [400, 1200];

/**
 * The CDN copy of a path, or null if there isn't one.
 *
 * Separate from `apiFetch` because some callers need to know a snapshot was
 * missing WITHOUT the live API being asked in the same breath. The athlete page
 * is the case that forced it: a name outside the projected field 404s on
 * `/api/athlete/...` and the page then asks `/api/athlete-status/...` why. Both
 * are snapshotted, but if the first miss went straight to Render the click
 * would still wait out the cold start — the one thing the snapshots exist to
 * prevent. So it checks both CDN files first, and only then gives up on them.
 *
 * A rejected fetch is a miss, not an error: the deploy simply may not carry
 * this file yet. An abort is the caller changing its mind and propagates.
 */
export async function staticFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const url = staticUrlFor(path);
  if (!url) return null;
  try {
    const res = await fetch(url, init);
    if (res.ok) return (await res.json()) as T;
  } catch (e) {
    // A caller cancelling (unmount, superseded keystroke) must not be
    // retried against the API -- that would fight the caller.
    if (e instanceof Error && e.name === "AbortError") throw e;
  }
  return null;
}

/**
 * Fetch a path from the API, retrying transient failures.
 *
 * `path` is API-relative and must start with "/" (e.g. "/api/stats").
 * Anything that already looks absolute is a caller bug and throws, rather
 * than silently reintroducing a hardcoded host.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (/^https?:\/\//i.test(path)) {
    throw new Error(`apiFetch expects an API-relative path, got an absolute URL: ${path}`);
  }
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  // The CDN copy first, when this path is a snapshot. A miss here is not an
  // error worth surfacing -- it just means the deploy has no snapshot yet, so
  // we fall through to the live API below and behave exactly as before.
  const hit = await staticFetch<T>(path, init);
  if (hit !== null) return hit;

  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) {
        // 5xx is the server having a bad moment; 4xx is a real answer about
        // this specific request, and repeating it just wastes the user's time.
        const retryable = res.status >= 500;
        throw new ApiError(
          retryable ? OFFLINE_MESSAGE : `The API answered ${res.status}.`,
          res.status,
          retryable,
        );
      }
      return (await res.json()) as T;
    } catch (e) {
      // An aborted request is the caller changing its mind (a superseded
      // search keystroke, an unmounting component). Retrying it would fight
      // the caller, so it propagates immediately.
      if (e instanceof Error && e.name === "AbortError") throw e;

      // A bare TypeError from fetch is the network layer: refused connection,
      // DNS, CORS, offline. Those are exactly the retryable ones.
      const retryable = e instanceof ApiError ? e.retryable : true;
      lastError = e instanceof ApiError ? e : new ApiError(OFFLINE_MESSAGE, 0, true);
      const delay = RETRY_DELAYS_MS[attempt];
      if (!retryable || delay === undefined) break;
      await sleep(delay);
    }
  }
  throw lastError;
}
