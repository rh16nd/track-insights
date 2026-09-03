import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import type { Athlete, Discipline } from "@/lib/dl-data";
import { Panel, ProbabilityBar, RankBadge, WatchBadge } from "./shell";
import { useT } from "@/lib/i18n";
import { InfoTip } from "./info-tip";
import { NatFlag } from "./nat-flag";

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

/** Which sentence explains the current ordering. Keys, not prose: the copy
 * itself lives in the locale tables. */
const SUBTITLE_KEY: Record<SortKey, string> = {
  rank: "table.subtitle.rank",
  prob: "table.subtitle.prob",
};

/** Tint for the podium-chance number, RELATIVE to the strongest chance in the
 * field currently on screen. It must be relative, not a fixed % cut: the model's
 * per-discipline probabilities do not sum to a constant (across events the totals
 * run ~30–320), so a fixed "≥30% = gold" rule would paint a whole flat field gold
 * and leave a top-heavy one grey — reading as a cross-event comparison the numbers
 * cannot support. Scaling to this field's own leader keeps "who stands out" honest
 * within the one event the reader is looking at. Gold echoes the bar's own gradient
 * tip; gold-strong measured 5.89:1 on the card, past the 4.5 floor for this 12.5px
 * semibold number. Long shots recede to muted; the middle stays plain. */
function probTone(prob: number, maxProb: number): string {
  const r = prob / maxProb;
  if (r >= 0.6) return "text-gold-strong";
  if (r <= 0.25) return "text-muted-foreground";
  return "text-foreground";
}

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
  hint,
}: {
  label: string;
  columnKey: SortKey;
  sort: Sort;
  onSort: (key: SortKey) => void;
  className: string;
  /** A one-line definition of the column, shown in a tap-and-hover InfoTip
   * sitting beside the sort control. It's a real popover (portalled out of the
   * table's `overflow-x-auto` wrapper so it doesn't clip) rather than a native
   * `title`, because `title` never appears on a phone, where there's no hover. */
  hint?: string;
}) {
  const { t } = useT();
  const active = sort.key === columnKey;
  const dir = active ? sort.dir : FIRST_DIR[columnKey];
  return (
    <th
      scope="col"
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={className}
    >
      {/* -my-2 pulls the taller tap targets back into the header's own
          padding so the row height doesn't change. */}
      <div className="-my-2 flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => onSort(columnKey)}
          // py-2 grows the hit area past the 24px WCAG 2.2 minimum.
          className={`group flex items-center gap-1.5 py-2 font-semibold transition-colors ${
            active ? "text-foreground" : "hover:text-foreground"
          }`}
        >
          <span>{label}</span>
          <SortArrow dir={dir} active={active} />
          <span className="sr-only">
            {active ? t("table.sortedActivateReverse") : t("table.activateToSort")}
          </span>
        </button>
        {hint && <InfoTip label={t("figure.about", { label })}>{hint}</InfoTip>}
      </div>
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
  const { t } = useT();
  const current = disciplines.find((d) => d.id === activeId) ?? disciplines[0];
  // Sort is a view preference, so it deliberately survives a discipline
  // switch -- unlike `activeId`, which lives in the URL precisely so Back
  // restores the tab you were browsing (see the note above).
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT);
  const rows = useMemo(
    () => (current ? sortAthletes(current.athletes, sort) : []),
    [current, sort],
  );
  // Sorted by the SAME control as the real field, so the two sections stay
  // consistent when you switch columns -- but kept in their own list and
  // never merged into `rows`, because these athletes are not in the field
  // and must not be numbered alongside it. Their `rank` is a within-group
  // ordering the API supplies for exactly this; the UI never displays it.
  const nearMiss = useMemo(
    () => (current?.nearMiss ? sortAthletes(current.nearMiss, sort) : []),
    [current, sort],
  );
  // The field's strongest podium chance, the reference every row's tint is
  // scaled against. Includes the near-miss athletes so both groups read on one
  // shared scale — a near-miss athlete "what-if" is measured against the same
  // leader as the real field. Guarded to >=1 so an all-zero field never divides
  // by zero.
  const maxProb = useMemo(() => {
    const all = current ? [...current.athletes, ...(current.nearMiss ?? [])] : [];
    return Math.max(1, ...all.map((a) => a.prob));
  }, [current]);

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
      {/* "Projected top 8" was hardcoded, and 8 is only this Final's field
          size for 14 of the 32 disciplines -- the field events start 6 and
          the long-distance races 10, so the men's shot put page promised a
          top 8 of a 6-man final. qualLimit is the real number. */}
      <Panel
        title={t("table.projectedTop", { n: current.qualLimit, label: current.label })}
        subtitle={t(SUBTITLE_KEY[sort.key]!)}
        className="mt-4"
        action={
          <Link
            to="/discipline/$discKey"
            params={{ discKey: current.id }}
            className="label-caps shrink-0 rounded-full border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-terracotta/40 hover:text-foreground"
          >
            {t("table.howLevel")}
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <caption className="sr-only">
              {t("table.caption", { label: current.label })}
            </caption>
            <thead>
              <tr className="label-caps text-muted-foreground">
                <th scope="col" className="w-10 pb-3 text-left font-semibold">
                  #<span className="sr-only">{t("table.colRankSr")}</span>
                </th>
                <th scope="col" className="pb-3 pl-3 text-left font-semibold">
                  {t("table.colAthlete")}
                </th>
                <th scope="col" className="w-16 pb-3 pl-4 text-left font-semibold">
                  {t("table.colNat")}
                </th>
                <th scope="col" className="w-20 pb-3 pl-4 text-left font-semibold">
                  {t("table.colQualified")}
                </th>
                <SortHeader
                  label={t("table.colProjected")}
                  columnKey="rank"
                  sort={sort}
                  onSort={onSort}
                  className="w-28 pb-3 pl-6 text-right"
                  hint={t("table.colProjectedHint")}
                />
                <SortHeader
                  label={t("table.colPodiumChance")}
                  columnKey="prob"
                  sort={sort}
                  onSort={onSort}
                  className="w-56 pb-3 pl-8 text-right"
                  hint={t("table.colPodiumChanceHint")}
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
                  <td className="py-3 pl-4">
                    <NatFlag nat={a.nat} />
                  </td>
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
                        title={t("table.qTitle")}
                        className="inline-flex size-6 items-center justify-center rounded-md bg-terracotta/12 text-[13px] font-semibold leading-none text-terracotta-strong"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Q
                        <span className="sr-only">{t("table.qSr")}</span>
                      </span>
                    )}
                  </td>
                  <td className="nums py-3 pl-6 text-right text-[13.5px] font-medium text-foreground">
                    {a.mark}
                  </td>
                  <td className="py-3 pl-8">
                    <div className="flex items-center justify-end gap-3">
                      <ProbabilityBar value={a.prob} className="w-28" trackHeight="h-1.5" />
                      <span
                        className={`nums w-9 text-right text-[12.5px] font-semibold ${probTone(a.prob, maxProb)}`}
                      >
                        {a.prob}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Athletes who are NOT in WA's Diamond League standings, so
                  not eligible for the Final -- scored by the same model, but
                  kept below the real field, unnumbered, and marked. Noah
                  Lyles is the reason this exists: world #1 at 9.79 with no
                  DL points in the 100m, previously absent from the site with
                  no explanation. This list used to say Zurich could still
                  change it; Zurich ran 26-27 Aug and it was the last scoring
                  meeting, so who is in this group is now settled except
                  where World Athletics' tie-break decides it. */}
              {nearMiss.length > 0 && (
                <tr>
                  <td colSpan={6} className="pb-2 pt-6">
                    <div className="label-caps text-muted-foreground">
                      {t("table.notQualifiedHeading", { n: current.qualLimit })}
                    </div>
                    {/* Was "outside the Diamond League standings", which is
                        wrong for most of these athletes: they are IN the
                        standings, just below the qualifying places. Verified
                        2026-08-25 on the men's 1500m, where all four
                        near-miss athletes have real Diamond League points.
                        Same imprecision that made the athlete page tell
                        readers Noah Lyles had never scored. */}
                    <p className="mt-1 max-w-xl text-[12px] leading-snug text-muted-foreground">
                      {t("table.notQualifiedNote")}
                    </p>
                  </td>
                </tr>
              )}
              {nearMiss.map((a, i) => (
                <tr
                  key={`nm-${a.name}`}
                  className="stagger-item transition-colors hover:bg-secondary/40"
                  style={{ "--stagger-i": i } as CSSProperties}
                >
                  <td className="py-3 pr-2">
                    <span
                      aria-hidden
                      className="flex size-6 items-center justify-center rounded-full border border-dashed border-border text-[11px] text-muted-foreground"
                    >
                      –
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-[13.5px] font-medium text-foreground">
                    <Link
                      to="/athlete/$discKey/$name"
                      params={{ discKey: current.id, name: a.name }}
                      className="transition-colors hover:text-terracotta-strong hover:underline"
                    >
                      {a.name}
                    </Link>
                    {a.injuryWatch && (
                      <WatchBadge reason={a.injuryReason} url={a.injuryUrl} className="ml-2" />
                    )}
                  </td>
                  <td className="py-3 pl-4">
                    <NatFlag nat={a.nat} />
                  </td>
                  <td className="py-3 pl-4">
                    <span className="label-caps whitespace-nowrap text-muted-foreground">
                      {t("table.notQualified")}
                    </span>
                  </td>
                  <td className="nums py-3 pl-6 text-right text-[13.5px] font-medium text-foreground">
                    {a.mark}
                  </td>
                  <td className="py-3 pl-8">
                    <div className="flex items-center justify-end gap-3 opacity-70">
                      <ProbabilityBar value={a.prob} className="w-28" trackHeight="h-1.5" />
                      <span
                        className={`nums w-9 text-right text-[12.5px] font-semibold ${probTone(a.prob, maxProb)}`}
                      >
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
