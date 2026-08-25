import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import type { Athlete, Discipline } from "@/lib/dl-data";
import { Panel, ProbabilityBar, RankBadge, WatchBadge } from "./shell";

/** Which column the table is ordered by. "rank" is the API's own ordering
 * (season-best mark, ascending = fastest/furthest first); "prob" is the
 * model's podium chance. The two genuinely disagree -- Men's 100m has
 * #1 Lyles 9.79 at 16% sitting above #2 Seville 9.82 at 27% -- so instead of
 * the page picking one ordering and asserting it as *the* ranking, the
 * reader switches. Season best stays the default because it's a directly
 * verifiable fact; probability is the model's separate call.
 *
 * The `#` badge always means rank-by-season-best, so it deliberately reads
 * out of sequence once sorted by probability: it is an athlete's attribute,
 * not a row counter. */
type SortKey = "rank" | "prob";
type SortDir = "asc" | "desc";
type Sort = { key: SortKey; dir: SortDir };

const DEFAULT_SORT: Sort = { key: "rank", dir: "asc" };

/** Direction a column takes on its FIRST click -- whichever end of it is the
 * "good" one. Marks read best-first ascending (rank 1, 9.79s); probabilities
 * read best-first descending (27% before 16%). Clicking again reverses. */
const FIRST_DIR: Record<SortKey, SortDir> = { rank: "asc", prob: "desc" };

const SUBTITLE: Record<SortKey, string> = {
  rank: "Ranked by season best. Podium chance is the model's separate call and can disagree.",
  prob: "Sorted by the model's podium chance. The # column still ranks by season best, so it reads out of sequence.",
};

function sortAthletes(athletes: Athlete[], { key, dir }: Sort): Athlete[] {
  const sign = dir === "asc" ? 1 : -1;
  return [...athletes].sort((a, b) => {
    const diff = key === "rank" ? a.rank - b.rank : a.prob - b.prob;
    if (diff !== 0) return diff * sign;
    // Probabilities are whole percents, so ties are common and real. Break
    // them on season-best rank -- unsigned, so a tied group keeps the same
    // internal order in both directions instead of silently flipping.
    return a.rank - b.rank;
  });
}

function SortArrow({ dir, active }: { dir: SortDir; active: boolean }) {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden
      // An inactive arrow is dimmed but never hidden: hover-only affordances
      // don't exist on touch, and this table is horizontally scrolled on
      // small screens, so "you can sort this" has to be visible at rest.
      className={`size-[9px] shrink-0 transition-opacity duration-150 ${
        active ? "opacity-100" : "opacity-25 group-hover:opacity-60 group-focus-visible:opacity-60"
      } ${dir === "asc" ? "" : "rotate-180"}`}
    >
      <path d="M5 1.5 8.5 7h-7L5 1.5Z" fill="currentColor" />
    </svg>
  );
}

/** A right-aligned column header that doubles as the sort control. `aria-sort`
 * lives on the `th`, where assistive tech looks for it; the `button` carries
 * the click target and picks up the site-wide focus ring for free. */
function SortHeader({
  label,
  columnKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  columnKey: SortKey;
  sort: Sort;
  onSort: (key: SortKey) => void;
  className: string;
}) {
  const active = sort.key === columnKey;
  const dir = active ? sort.dir : FIRST_DIR[columnKey];
  return (
    <th
      scope="col"
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={className}
    >
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        // The label alone is a 17px-tall hit target. `py-2 -my-2` grows it
        // past the 24px WCAG 2.2 minimum without moving the header text or
        // changing the row's height -- the extra area reaches into padding
        // that was already empty.
        className={`group -my-2 ml-auto flex items-center gap-1.5 py-2 font-semibold transition-colors ${
          active ? "text-foreground" : "hover:text-foreground"
        }`}
      >
        <span>{label}</span>
        <SortArrow dir={dir} active={active} />
        <span className="sr-only">
          {active ? " — sorted, activate to reverse" : " — activate to sort by this column"}
        </span>
      </button>
    </th>
  );
}

/** The active discipline tab is controlled by the caller (track.tsx/
 * field.tsx put it in the URL's search params, not local state) so that
 * clicking into an athlete and hitting "back" restores the exact tab the
 * user was browsing, not just the page with its default tab reset. */
export function DisciplineTable({
  disciplines,
  activeId,
  onActiveChange,
}: {
  disciplines: Discipline[];
  activeId: string;
  onActiveChange: (id: string) => void;
}) {
  const current = disciplines.find((d) => d.id === activeId) ?? disciplines[0];
  // Sort is a view preference, so it deliberately survives a discipline
  // switch -- unlike `activeId`, which lives in the URL precisely so Back
  // restores the tab you were browsing (see the note above).
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT);
  const rows = useMemo(
    () => (current ? sortAthletes(current.athletes, sort) : []),
    [current, sort],
  );

  if (!current) return null;

  const onSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: FIRST_DIR[key] },
    );

  return (
    <>
      {/* Mobile-only: a real <select> instead of the pill wall below --
       * same fix Projections' discipline picker needed (impeccable critique
       * skill, 2026-08-24): a flat wrapped list of pills at a real 44px
       * touch-target size gets tall fast (measured live: 358px for Track's
       * 18 disciplines at the old 32.75px pill height). This is shared by
       * both Track and Field, so one fix covers both pages. */}
      <div className="sm:hidden">
        {/* --muted-foreground is tuned for the light CARD surface, but this
            label sits directly on the colored canvas, where it measured
            1.62:1. On-canvas text has to be light, not dark. */}
        <label className="label-caps mb-1.5 block text-white/90" htmlFor="discipline-select">
          Discipline
        </label>
        <select
          id="discipline-select"
          value={current.id}
          onChange={(e) => onActiveChange(e.target.value)}
          className="w-full rounded-md border border-border bg-card px-3 py-3 text-[13.5px] font-medium text-foreground"
        >
          {disciplines.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden flex-wrap gap-2 sm:flex">
        {disciplines.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onActiveChange(d.id)}
            className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
              d.id === current?.id
                ? "border-transparent text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
            }`}
            style={
              d.id === current?.id
                ? {
                    backgroundImage:
                      "linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
                  }
                : undefined
            }
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* The "#" column ranks by season-best mark, which is NOT the same
          ordering as podium chance (e.g. Men's 100m: #1 Lyles 9.79 at 16%
          sits above #2 Seville 9.82 at 27%). The subtitle says which of the
          two the table is currently ordered by, because the columns
          otherwise look like they should agree and don't. */}
      <Panel
        title={`Projected top 8 — ${current.label}`}
        subtitle={SUBTITLE[sort.key]}
        className="mt-4"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="label-caps text-muted-foreground">
                <th scope="col" className="w-10 pb-3 text-left font-semibold">
                  #<span className="sr-only"> — rank by season best</span>
                </th>
                <th scope="col" className="pb-3 pl-3 text-left font-semibold">
                  Athlete
                </th>
                <th scope="col" className="w-16 pb-3 pl-4 text-left font-semibold">
                  Nat
                </th>
                <th scope="col" className="w-20 pb-3 pl-4 text-left font-semibold">
                  Qualified
                </th>
                <SortHeader
                  label="Projected"
                  columnKey="rank"
                  sort={sort}
                  onSort={onSort}
                  className="w-28 pb-3 pl-6 text-right"
                />
                <SortHeader
                  label="Podium chance"
                  columnKey="prob"
                  sort={sort}
                  onSort={onSort}
                  className="w-56 pb-3 pl-8 text-right"
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((a, i) => (
                <tr
                  key={a.name}
                  className="stagger-item transition-colors hover:bg-secondary/40"
                  style={{ "--stagger-i": i } as CSSProperties}
                >
                  <td className="py-3 pr-2">
                    <RankBadge rank={a.rank} className="size-6" />
                  </td>
                  <td className="py-3 pl-3 text-[13.5px] font-medium text-foreground">
                    <Link
                      to="/athlete/$discKey/$name"
                      params={{ discKey: current.id, name: a.name }}
                      className="hover:text-terracotta-strong hover:underline transition-colors"
                    >
                      {a.name}
                    </Link>
                    {a.injuryWatch && (
                      <WatchBadge reason={a.injuryReason} url={a.injuryUrl} className="ml-2" />
                    )}
                  </td>
                  <td className="nums py-3 pl-4 text-[12px] text-muted-foreground">{a.nat}</td>
                  <td className="py-3 pl-4">
                    {/* "Q" per the user's preference over a check glyph. It
                        previously rendered at 10px with heavy label-caps
                        tracking, where it was easy to misread as a zero — so
                        it's set larger, at normal tracking, in the display
                        face (whose Q has a distinct tail). The column header
                        spells out "Qualified" and the sr-only text carries
                        the full definition. */}
                    {a.qualified && (
                      <span
                        title="Confirmed in World Athletics' own 2026 Diamond League standings for this discipline"
                        className="inline-flex size-6 items-center justify-center rounded-md bg-terracotta/12 text-[13px] font-semibold leading-none text-terracotta-strong"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Q
                        <span className="sr-only">
                          ualified — confirmed in World Athletics&apos; 2026 Diamond League
                          standings
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="nums py-3 pl-6 text-right text-[13.5px] font-medium text-foreground">
                    {a.mark}
                  </td>
                  <td className="py-3 pl-8">
                    <div className="flex items-center justify-end gap-3">
                      <ProbabilityBar value={a.prob} className="w-28" trackHeight="h-1.5" />
                      <span className="nums w-9 text-right text-[12.5px] font-semibold text-foreground">
                        {a.prob}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
