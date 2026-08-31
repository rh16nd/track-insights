import { useMemo } from "react";
import type { CSSProperties } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, HeadFigure } from "@/components/dl/shell";
import type { QualificationDiscipline, QualificationRow, QualStatus } from "@/lib/dl-data";
import { useQualification } from "@/hooks/useQualification";

export const Route = createFileRoute("/qualification")({
  // Same URL-as-state convention Track/Field use, so clicking into an
  // athlete and hitting Back restores the discipline you were reading.
  // Discipline switches navigate with `replace: true` for the same reason
  // they do there -- Back should leave the page, not walk back through
  // every event you glanced at.
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  component: QualificationPage,
});

/** v0's headline is "Eight lanes. The race to make the race." — hardcoded for
 * the 100m. The Final seats 6 in the field events and 10 over the long
 * distances, so both the number and the noun are read from the data. This is
 * the same hardcoded-count family that put "Projected top 8" on a six-man
 * shot put final. */
const NUMBER_WORD: Record<number, string> = {
  6: "Six",
  8: "Eight",
  10: "Ten",
};

function placesHeadline(limit: number, isField: boolean): string {
  const word = NUMBER_WORD[limit] ?? String(limit);
  // A thrower does not have a lane.
  return `${word} ${isField ? "places" : "lanes"}. The race to make the race.`;
}

const DESCRIPTION =
  "Who has actually earned a place at the Final. These are World Athletics' own Diamond League points — not a prediction — with the gap to the qualification cut worked out from what is still winnable.";

/* Nothing is winnable any more once the last scoring meeting is run, so the
 * clause explaining the gap that way has to go rather than quietly stay wrong. */
const DESCRIPTION_DECIDED =
  "Who has actually earned a place at the Final. These are World Athletics' own Diamond League points — not a prediction — with every scoring meeting of the 2026 season now run.";

const STATUS_LABEL: Record<QualStatus, string> = {
  safe: "Through",
  in: "In",
  chasing: "Chasing",
  out: "Out",
  unknown: "No points",
};

const STATUS_CLASS: Record<QualStatus, string> = {
  safe: "bg-gold/15 text-gold-strong",
  in: "bg-terracotta/12 text-terracotta-strong",
  chasing: "bg-secondary text-foreground/80",
  out: "bg-secondary text-muted-foreground",
  unknown: "bg-secondary text-muted-foreground",
};

const STATUS_TITLE: Record<QualStatus, string> = {
  safe: "Cannot be displaced — nobody below them can reach their total",
  in: "Above the cut line as it stands, but still catchable",
  chasing: "Below the line and still mathematically able to reach it",
  out: "Cannot reach the cut even by winning everything left",
  unknown: "World Athletics lists no points for this athlete",
};

/* Once the last scoring meeting is run, "in" and "chasing" can only be
 * produced by a points TIE across the cut line. With nothing left to gain,
 * `qualification_race` leaves an athlete unresolved exactly when someone on
 * the other side of the line is level with them on points — so the live
 * wording ("still catchable", "still mathematically able to reach it") would
 * be telling the reader a race is open that is actually over and now sits
 * with World Athletics' tie-break. Zurich (27 Aug) made this the live state:
 * 18 athletes across 7 disciplines. "safe"/"out"/"unknown" are unaffected —
 * those verdicts were already final by construction. */
const STATUS_LABEL_DECIDED: Record<QualStatus, string> = {
  ...STATUS_LABEL,
  in: "Tie-break",
  chasing: "Tie-break",
};

const STATUS_CLASS_DECIDED: Record<QualStatus, string> = {
  ...STATUS_CLASS,
  // Both sides of a tie share one fate, so they share one treatment --
  // identical labels in two different colours would read as a bug.
  chasing: STATUS_CLASS.in,
};

const STATUS_TITLE_DECIDED: Record<QualStatus, string> = {
  ...STATUS_TITLE,
  in: "Above the cut line, but level on points with an athlete below it — World Athletics' tie-break decides",
  chasing:
    "Level on points with the last qualifying place, with no scoring meetings left — World Athletics' tie-break decides",
};

/** Points behind the cut, phrased so the sign never has to be decoded. A
 * gap of zero means two different things either side of the line: the last
 * qualifier IS the cut, while the athlete below it is level on points and
 * separated only by World Athletics' tie-break. */
function gapLabel(row: QualificationRow, qualLimit: number): string {
  if (row.gap === null) return "—";
  if (row.gap > 0) return `${row.gap} behind`;
  if (row.gap === 0) return row.rank <= qualLimit ? "on the line" : "level with the cut";
  return `${Math.abs(row.gap)} clear`;
}

/** The closest race in each discipline: how far the first athlete below the
 * line is from it. That gap is the whole of what the last meeting decides,
 * and it is arithmetic, so it can be stated flatly. Disciplines where
 * nobody below the line is still alive are left out rather than listed with
 * a meaningless number. Once every meeting is run this same list is exactly
 * the tie-break cases -- a "chasing" row can then only be one that is level
 * on points with the cut -- which is why the panel's own wording switches
 * rather than the selection. */
function tightestRaces(disciplines: QualificationDiscipline[]) {
  return disciplines
    .map((d) => {
      const chaser = d.standings.find((r) => r.status === "chasing");
      return chaser ? { disc: d, chaser } : null;
    })
    .filter((x): x is { disc: QualificationDiscipline; chaser: QualificationRow } => x !== null)
    .sort((a, b) => (a.chaser.gap ?? 99) - (b.chaser.gap ?? 99))
    .slice(0, 6);
}

function QualificationPage() {
  const state = useQualification();
  const { disc } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const data = state.status === "ok" ? state.data : undefined;

  // Memoised because the `?? []` fallback is a fresh array on every render,
  // which would re-run the tightest-races pass on every keystroke elsewhere.
  const disciplines = useMemo(() => data?.disciplines ?? [], [data]);
  const current = disciplines.find((d) => d.discKey === disc) ?? disciplines[0];
  const tight = useMemo(() => tightestRaces(disciplines), [disciplines]);

  const meetingsLeft = data?.meetingsLeft ?? 0;
  const nextMeet = data?.nextMeet;
  // Only meaningful once the data has actually loaded -- the `?? 0` fallback
  // above would otherwise claim the season is over while it is still fetching.
  const decided = Boolean(data) && meetingsLeft === 0;

  return (
    <Shell
      title={current ? placesHeadline(current.qualLimit, current.isField) : "Race for the Final"}
      crumb="Qualifying"
      eyebrow={
        data
          ? meetingsLeft > 0
            ? `${meetingsLeft} scoring meeting${meetingsLeft === 1 ? "" : "s"} left · a win is worth ${data.pointsForAWin} points`
            : "Every scoring meeting is run — the standings are final"
          : "2026 Diamond League standings"
      }
      description={decided ? DESCRIPTION_DECIDED : DESCRIPTION}
      figures={
        data && current ? (
          <>
            <HeadFigure value={current.qualLimit} label="Qualify for the Final" />
            <HeadFigure value={current.cutPoints ?? "—"} label="Points to make it" />
            <HeadFigure value={meetingsLeft} label="Meetings left" />
            <HeadFigure value={data.pointsForAWin} label="Points for a win" />
          </>
        ) : undefined
      }
    >
      {state.status === "loading" && <PanelSkeleton title="Diamond League standings" rows={10} />}
      {state.status === "error" && <ErrorPanel message={state.message} />}

      {data && current && (
        <>
          {tight.length > 0 && (
            <Panel
              title={
                decided
                  ? "Level at the cut line"
                  : nextMeet
                    ? `Closest to the line going into ${nextMeet.city}`
                    : "Closest to the line"
              }
              subtitle={
                decided
                  ? "Every scoring meeting is run, and in these disciplines the athlete below the cut finished level on points with the athlete on it — World Athletics' tie-break decides them, not another race."
                  : "The smallest gap between the qualification cut and the first athlete below it — the disciplines the last meeting actually decides."
              }
            >
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {tight.map(({ disc: d, chaser }, i) => (
                  <li
                    key={d.discKey}
                    className="stagger-item"
                    style={{ "--stagger-i": i } as CSSProperties}
                  >
                    <button
                      type="button"
                      onClick={() => navigate({ search: { disc: d.discKey }, replace: true })}
                      className="flex w-full items-center justify-between gap-3 rounded-[10px] border border-border px-3 py-2.5 text-left transition-colors hover:border-terracotta/40 hover:bg-secondary/40"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-foreground">
                          {d.disc}
                        </span>
                        <span className="block truncate text-[12px] text-muted-foreground">
                          {chaser.name}
                        </span>
                      </span>
                      {/* A gap of 0 is the tightest case there is -- level
                          on points, separated only by World Athletics'
                          tie-break -- but rendering it as a bare "0" reads
                          as nothing at all, and several disciplines sit
                          exactly there. */}
                      <span className="shrink-0 text-right">
                        {chaser.gap === 0 ? (
                          <span className="label-caps block text-terracotta-strong">
                            Level on points
                          </span>
                        ) : (
                          <>
                            <span className="nums block text-[15px] font-semibold text-terracotta-strong">
                              {chaser.gap}
                            </span>
                            <span className="label-caps block text-muted-foreground">behind</span>
                          </>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <div className="mt-5 sm:hidden">
            <label className="label-caps mb-1.5 block text-white/90" htmlFor="qual-discipline">
              Discipline
            </label>
            <select
              id="qual-discipline"
              value={current.discKey}
              onChange={(e) => navigate({ search: { disc: e.target.value }, replace: true })}
              className="w-full rounded-md border border-border bg-card px-3 py-3 text-[13.5px] font-medium text-foreground"
            >
              {disciplines.map((d) => (
                <option key={d.discKey} value={d.discKey}>
                  {d.disc}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 hidden flex-wrap gap-2 sm:flex">
            {disciplines.map((d) => (
              <button
                key={d.discKey}
                type="button"
                onClick={() => navigate({ search: { disc: d.discKey }, replace: true })}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                  d.discKey === current.discKey
                    ? "border-transparent text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
                }`}
                style={
                  d.discKey === current.discKey
                    ? {
                        backgroundImage:
                          "linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
                      }
                    : undefined
                }
              >
                {d.disc}
              </button>
            ))}
          </div>

          <Panel
            title={`Diamond League standings — ${current.disc}`}
            subtitle={
              current.cutPoints === null
                ? `The top ${current.qualLimit} on points qualify for the Final.`
                : `The top ${current.qualLimit} on points qualify for the Final. The cut currently sits at ${current.cutPoints} points.`
            }
            className="mt-6"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="label-caps text-muted-foreground">
                    <th scope="col" className="w-10 pb-3 text-left font-semibold">
                      #
                    </th>
                    <th scope="col" className="pb-3 pl-3 text-left font-semibold">
                      Athlete
                    </th>
                    <th scope="col" className="w-16 pb-3 pl-4 text-left font-semibold">
                      Nat
                    </th>
                    <th scope="col" className="w-20 pb-3 pl-4 text-right font-semibold">
                      Meets
                    </th>
                    <th scope="col" className="w-20 pb-3 pl-4 text-right font-semibold">
                      Points
                    </th>
                    <th scope="col" className="w-32 pb-3 pl-4 text-right font-semibold">
                      Gap to cut
                    </th>
                    <th scope="col" className="w-28 pb-3 pl-4 text-right font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {current.standings.map((row, i) => (
                    <QualRow
                      key={`${row.rank}-${row.name}`}
                      row={row}
                      index={i}
                      discKey={current.discKey}
                      // The cut is drawn UNDER the last qualifying place, so
                      // it reads as a line dividing the table rather than a
                      // property of either athlete beside it.
                      cutAfter={row.rank === current.qualLimit}
                      qualLimit={current.qualLimit}
                      decided={decided}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
              Points are World Athletics&apos; own, scraped from the 2026 Diamond League standings.{" "}
              {meetingsLeft > 0 ? (
                <>
                  &ldquo;Out&rdquo; means the athlete cannot reach the cut even by winning
                  everything left; &ldquo;Through&rdquo; means nobody can displace them even if they
                  never score again. Anything in between is still open. This assumes the discipline
                  is on the remaining programme — if it is not contested again, these standings are
                  already final, which only makes &ldquo;Out&rdquo; more certain.
                </>
              ) : (
                <>
                  No scoring meetings remain, so these standings are the result.
                  &ldquo;Tie-break&rdquo; marks the one thing points alone cannot settle: two
                  athletes level on points either side of the cut, separated by World
                  Athletics&apos; own tie-break rules, which are not in this data.
                </>
              )}
              {data.scrapedAt && <> Scraped {new Date(data.scrapedAt).toLocaleString()}.</>}
            </p>
          </Panel>

          <HowToRead current={current} decided={decided} pointsForAWin={data.pointsForAWin} />
        </>
      )}
    </Shell>
  );
}

function QualRow({
  row,
  index,
  discKey,
  cutAfter,
  qualLimit,
  decided,
}: {
  row: QualificationRow;
  index: number;
  discKey: string;
  cutAfter: boolean;
  qualLimit: number;
  /** No scoring meetings left, so an unresolved row is a tie, not a race. */
  decided: boolean;
}) {
  // An eliminated athlete recedes rather than disappears: most of a long
  // standings table is already out of the race, and at equal weight the
  // rows that are still live stop standing out at all. This has to be set
  // on the cells themselves -- a color on the <tr> is overridden by every
  // child that carries its own, which is all of them.
  const dim = row.status === "out";
  return (
    <>
      <tr
        className="stagger-item transition-colors hover:bg-secondary/40"
        style={{ "--stagger-i": Math.min(index, 12) } as CSSProperties}
      >
        <td className="nums py-3 pr-2 text-[12.5px] text-muted-foreground">{row.rank}</td>
        <td
          className={`py-3 pl-3 text-[13.5px] font-medium ${dim ? "text-muted-foreground" : "text-foreground"}`}
        >
          <Link
            to="/athlete/$discKey/$name"
            params={{ discKey, name: row.name }}
            className="transition-colors hover:text-terracotta-strong hover:underline"
          >
            {row.name}
          </Link>
        </td>
        <td className="nums py-3 pl-4 text-[12px] text-muted-foreground">{row.country ?? "—"}</td>
        <td className="nums py-3 pl-4 text-right text-[12.5px] text-muted-foreground">
          {row.events ?? "—"}
        </td>
        <td
          className={`nums py-3 pl-4 text-right text-[13.5px] font-semibold ${dim ? "text-muted-foreground" : "text-foreground"}`}
        >
          {row.points ?? "—"}
        </td>
        <td className="nums py-3 pl-4 text-right text-[12.5px] text-muted-foreground">
          {gapLabel(row, qualLimit)}
        </td>
        <td className="py-3 pl-4 text-right">
          <span
            title={(decided ? STATUS_TITLE_DECIDED : STATUS_TITLE)[row.status]}
            className={`label-caps inline-flex items-center rounded-full px-2 py-1 ${(decided ? STATUS_CLASS_DECIDED : STATUS_CLASS)[row.status]}`}
          >
            {(decided ? STATUS_LABEL_DECIDED : STATUS_LABEL)[row.status]}
          </span>
        </td>
      </tr>
      {cutAfter && (
        <tr>
          <td colSpan={7} className="px-0 py-0">
            <div className="flex items-center gap-3 py-2">
              <span className="label-caps whitespace-nowrap text-terracotta-strong">
                Qualification cut · top {qualLimit}
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-[repeating-linear-gradient(90deg,var(--terracotta)_0px,var(--terracotta)_5px,transparent_5px,transparent_10px)]"
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/** v0's "How to read it · The margin, not the medal" panel.
 *
 * v0 wrote its version as prose naming specific athletes. That reads well and
 * goes stale the moment the standings move, so this one is GENERATED from the
 * same rows the table above renders: whoever actually holds the last
 * qualifying place, and whoever is first out. If the data can't support a
 * sentence, the sentence isn't written. */
function HowToRead({
  current,
  decided,
  pointsForAWin,
}: {
  current: QualificationDiscipline;
  decided: boolean;
  pointsForAWin: number;
}) {
  const rows = current.standings ?? [];
  const onLine = rows.find((r) => r.rank === current.qualLimit);
  const firstOut = rows.find((r) => r.rank != null && r.rank > current.qualLimit);
  if (!onLine && !firstOut) return null;

  return (
    <Panel title="How to read it" subtitle="The margin, not the medal." className="mt-6">
      <p className="max-w-3xl text-[14px] leading-relaxed text-muted-foreground">
        Points come from finishing position at each Diamond League meeting an athlete actually
        contested — <span className="nums">{pointsForAWin}</span> for a win, scaling down from
        there. Nothing here is a projection: it is the arithmetic of who has scored what.
        {onLine && (
          <>
            {" "}
            <Link
              to="/athlete/$discKey/$name"
              params={{ discKey: current.discKey, name: onLine.name }}
              className="font-medium text-foreground hover:text-terracotta-strong hover:underline"
            >
              {onLine.name}
            </Link>{" "}
            holds the {current.qualLimit}th and final place on{" "}
            <span className="nums">{onLine.points}</span> points
            {onLine.gap === 0 ? ", exactly level with the cut" : ""}.
          </>
        )}
        {firstOut && (
          <>
            {" "}
            <Link
              to="/athlete/$discKey/$name"
              params={{ discKey: current.discKey, name: firstOut.name }}
              className="font-medium text-foreground hover:text-terracotta-strong hover:underline"
            >
              {firstOut.name}
            </Link>{" "}
            is first out, <span className="nums">{Math.abs(firstOut.gap ?? 0)}</span>{" "}
            {Math.abs(firstOut.gap ?? 0) === 1 ? "point" : "points"} short
            {decided ? " with no meetings left to change it" : " with racing still to come"}.
          </>
        )}
      </p>
    </Panel>
  );
}
