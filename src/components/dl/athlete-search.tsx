import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { apiFetch } from "@/lib/api";
import { useT } from "@/lib/i18n";
import { discName } from "@/lib/dl-data";
import type { CountryHit } from "@/lib/dl-data";
import { NatFlag } from "@/components/dl/nat-flag";

export type SearchHit = {
  name: string;
  disc: string;
  discKey: string;
  mark: string | null;
  worldRank: number | null;
};

/** One row in the dropdown. Countries and athletes are different kinds of
 * result but share one list, so arrow keys walk the whole thing rather than
 * skipping a group -- the input owns keyboard navigation for both. */
type SearchItem =
  { kind: "country"; country: CountryHit } | { kind: "athlete"; athlete: SearchHit };

/** Search across EVERY athlete in this season's worldwide toplists (~3,700),
 * not just the ~230 in the projected field.
 *
 * The point isn't convenience, it's answerability: before this, an athlete
 * who wasn't in the projected eight simply didn't exist anywhere on the
 * site, so "why isn't Lyles in the 100m?" had no answer. He's world #1 at
 * 9.79 and genuinely not eligible -- he has no Diamond League points in the
 * event -- which is a real and interesting fact the site was silently
 * swallowing. The profile page explains the actual reason (see the API's
 * athlete_field_status, which mirrors run.py's real selection order).
 */
export function AthleteSearch({
  autoFocus = false,
  onDone,
}: {
  /** Focus the input on mount — used by the mobile search row, which only
   * appears once the user has tapped to open it. */
  autoFocus?: boolean;
  /** Called after a result is chosen, so the mobile row can collapse itself. */
  onDone?: () => void;
} = {}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [countries, setCountries] = useState<CountryHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const navigate = useNavigate();
  const { t } = useT();

  // Debounced, and every in-flight request is abortable: typing quickly
  // otherwise lets an earlier, slower response land after a later one and
  // repaint the list with stale results.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setCountries([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      // Search does not retry: a keystroke supersedes the last query within
      // the debounce window anyway, so a retried request would race the one
      // the user actually wants. `retries: 0` is expressed by treating any
      // failure as an empty result set, which is what the UI already did.
      apiFetch<{ results?: SearchHit[]; countries?: CountryHit[] }>(
        `/api/search?q=${encodeURIComponent(q)}`,
        {
          signal: controller.signal,
        },
      )
        .then((d) => {
          setHits(d.results ?? []);
          setCountries(d.countries ?? []);
          setActive(0);
          setLoading(false);
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setHits([]);
            setCountries([]);
            setLoading(false);
          }
        });
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close on outside click / focus, not on blur: a blur handler fires the
  // instant focus moves toward a result, which makes the results
  // unreachable by keyboard or by mousedown. Same bug the WatchBadge
  // popover already had to fix.
  useEffect(() => {
    if (!open) return;
    const outside = (e: Event) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [open]);

  // Focus on mount when asked (the mobile search row opens on demand).
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Countries first: someone who typed a country name means the country, and
  // an athlete match on the same letters is the less likely intent.
  const items = useMemo<SearchItem[]>(
    () => [
      ...countries.map((country) => ({ kind: "country" as const, country })),
      ...hits.map((athlete) => ({ kind: "athlete" as const, athlete })),
    ],
    [countries, hits],
  );

  function go(item: SearchItem) {
    setOpen(false);
    setQuery("");
    onDone?.();
    if (item.kind === "country") {
      navigate({ to: "/country/$code", params: { code: item.country.code } });
      return;
    }
    navigate({
      to: "/athlete/$discKey/$name",
      params: { discKey: item.athlete.discKey, name: item.athlete.name },
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[active];
      if (item) go(item);
    }
  }

  const showList = open && query.trim().length >= 2;

  return (
    <div ref={wrapRef} className="relative">
      <label className="sr-only" htmlFor={`${listId}-input`}>
        {t("search.placeholder")}
      </label>
      <input
        id={`${listId}-input`}
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showList}
        /* Only while the list is actually rendered. It used to be set
           unconditionally, so with the combobox closed the IDREF pointed at
           an element that did not exist -- a dangling reference every ARIA
           validator flags. */
        aria-controls={showList ? `${listId}-list` : undefined}
        /* Without this, arrowing through results was SILENT to a screen
           reader: focus correctly stays in the input (that is the combobox
           pattern), so the only way to announce which option is current is
           to point at it. The visual highlight had no spoken equivalent. */
        aria-activedescendant={showList && items[active] ? `${listId}-opt-${active}` : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        value={query}
        placeholder={t("search.placeholder")}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="h-9 w-full min-w-0 rounded-full border border-border bg-card px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground"
      />

      {showList && (
        <ul
          id={`${listId}-list`}
          role="listbox"
          className="card-shadow absolute right-0 top-11 z-30 max-h-[60vh] w-[min(22rem,calc(100vw-3rem))] overflow-y-auto rounded-[14px] bg-card py-1"
        >
          {loading && items.length === 0 && (
            <li className="px-4 py-3 text-[12.5px] text-muted-foreground">
              {t("search.searching")}
            </li>
          )}
          {!loading && items.length === 0 && (
            <li className="px-4 py-3 text-[12.5px] text-muted-foreground">
              {t("search.noMatch", { query: query.trim() })}
            </li>
          )}
          {items.map((item, i) => (
            /* The option IS the li -- it used to wrap a <button>, and an
               element with role="option" must not contain a focusable
               control: it put the results in the tab order, competing with
               the arrow-key navigation the input already owns, and gave each
               option a nested control the pattern does not expect. Mouse
               click still works from here; keyboard goes through the input's
               ArrowUp/ArrowDown/Enter, which was always implemented. */
            <li
              key={
                item.kind === "country"
                  ? `c-${item.country.code}`
                  : `a-${item.athlete.discKey}-${item.athlete.name}`
              }
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(item)}
              className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                i === active ? "bg-secondary/60" : "hover:bg-secondary/40"
              }`}
            >
              {item.kind === "country" ? (
                <>
                  <NatFlag nat={item.country.code} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-foreground">
                      {item.country.name}
                    </span>
                    <span className="block text-[11.5px] text-muted-foreground">
                      {t("search.countryHint", {
                        n: item.country.athleteCount,
                        d: item.country.disciplineCount,
                      })}
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-foreground">
                      {item.athlete.name}
                    </span>
                    <span className="block text-[11.5px] text-muted-foreground">
                      {discName(t, item.athlete.discKey, item.athlete.disc)}
                    </span>
                  </span>
                  <span className="nums shrink-0 text-right">
                    <span className="block text-[12.5px] text-foreground">
                      {item.athlete.mark ?? "—"}
                    </span>
                    {item.athlete.worldRank != null && (
                      <span className="block text-[11px] text-muted-foreground">
                        {t("search.worldRank", { rank: item.athlete.worldRank })}
                      </span>
                    )}
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
