import { useMemo } from "react";
import type { CSSProperties } from "react";
import { pageHead } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, HeadFigure } from "@/components/dl/shell";
import type { QualificationDiscipline, QualificationRow, QualStatus } from "@/lib/dl-data";
import { useQualification } from "@/hooks/useQualification";
import { useT, type TFunc } from "@/lib/i18n";
import { discName } from "@/lib/dl-data";

export const Route = createFileRoute("/qualification")({
  head: () =>
    pageHead(
      "Qualifying",
      "Diamond League standings, the points cut for each discipline, and who makes the Final in Brussels.",
    ),
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
function placesHeadline(limit: number, isField: boolean, t: TFunc): string {
  // t() returns the key itself when a string is missing, which is the signal
  // that this count has no spelled-out word -- fall back to digits.
  const numKey = `qual.num.${limit}`;
  const word = t(numKey) === numKey ? String(limit) : t(numKey);
  // A thrower does not have a lane.
  return t("qual.headline", { word, noun: t(isField ? "qual.places" : "qual.lanes") });
}

const STATUS_LABEL_KEY: Record<QualStatus, string> = {
  safe: "qual.status.safe",
  in: "qual.status.in",
  chasing: "qual.status.chasing",
  out: "qual.status.out",
  unknown: "qual.status.unknown",
};

const STATUS_CLASS: Record<QualStatus, string> = {
  safe: "bg-gold/15 text-gold-strong",
  in: "bg-terracotta/12 text-terracotta-strong",
  chasing: "bg-secondary text-foreground/80",
  out: "bg-secondary text-muted-foreground",
  unknown: "bg-secondary text-muted-foreground",
};

const STATUS_TITLE_KEY: Record<QualStatus, string> = {
  safe: "qual.statusTitle.safe",
  in: "qual.statusTitle.in",
  chasing: "qual.statusTitle.chasing",
  out: "qual.statusTitle.out",
  unknown: "qual.statusTitle.unknown",
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
const STATUS_LABEL_DECIDED_KEY: Record<QualStatus, string> = {
  ...STATUS_LABEL_KEY,
  in: "qual.statusDecided.in",
  chasing: "qual.statusDecided.chasing",
};

const STATUS_CLASS_DECIDED: Record<QualStatus, string> = {
  ...STATUS_CLASS,
  // Both sides of a tie share one fate, so they share one treatment --
  // identical labels in two different colours would read as a bug.
  chasing: STATUS_CLASS.in,
};

const STATUS_TITLE_DECIDED_KEY: Record<QualStatus, string> = {
  ...STATUS_TITLE_KEY,
  in: "qual.statusTitleDecided.in",
  chasing: "qual.statusTitleDecided.chasing",
};

/** Points behind the cut, phrased so the sign never has to be decoded. A
 * gap of zero means two different things either side of the line: the last
 * qualifier IS the cut, while the athlete below it is level on points and
 * separated only by World Athletics' tie-break. */
function gapLabel(row: QualificationRow, qualLimit: number, t: TFunc): string {
  if (row.gap === null) return "—";
  if (row.gap > 0) return t("qual.gapBehind", { n: row.gap });
  if (row.gap === 0) return row.rank <= qualLimit ? t("qual.gapOnLine") : t("qual.gapLevel");
  return t("qual.gapClear", { n: Math.abs(row.gap) });
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
  const { t, lang } = useT();
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
      title={
        current
          ? placesHeadline(current.qualLimit, current.isField, t)
          : t("qual.headlineFallback")
      }
      crumb={t("nav.qualifying")}
      eyebrow={
        data
          ? meetingsLeft > 0
            ? t(meetingsLeft === 1 ? "qual.eyebrowOne" : "qual.eyebrowMany", {
                n: meetingsLeft,
                pts: data.pointsForAWin,
              })
            : t("qual.eyebrowDecided")
          : t("qual.eyebrowBare")
      }
      description={t(decided ? "qual.descriptionDecided" : "qual.description")}
      figures={
        data && current ? (
          <>
            <HeadFigure value={current.qualLimit} label={t("qual.figQualify")} />
            <HeadFigure value={current.cutPoints ?? "—"} label={t("qual.figPoints")} />
            <HeadFigure value={meetingsLeft} label={t("qual.figMeetingsLeft")} />
            <HeadFigure value={data.pointsForAWin} label={t("qual.figPointsForWin")} />
          </>
        ) : undefined
      }
    >
      {state.status === "loading" && <PanelSkeleton title={t("qual.standingsSkeleton")} rows={10} />}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}

      {data && current && (
        <>
          {tight.length > 0 && (
            <Panel
              title={
                decided
                  ? t("qual.tightTitleDecided")
                  : nextMeet
                    ? t("qual.tightTitleNext", { city: nextMeet.city })
                    : t("qual.tightTitle")
              }
              subtitle={
                decided ? t("qual.tightSubtitleDecided") : t("qual.tightSubtitle")
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
                          {discName(t, d.discKey, d.disc)}
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
                            {t("qual.levelOnPoints")}
                          </span>
                        ) : (
                          <>
                            <span className="nums block text-[15px] font-semibold text-terracotta-strong">
                              {chaser.gap}
                            </span>
                            <span className="label-caps block text-muted-foreground">
                              {t("qual.behind")}
                            </span>
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
              {t("qual.disciplineLabel")}
            </label>
            <select
              id="qual-discipline"
              value={current.discKey}
              onChange={(e) => navigate({ search: { disc: e.target.value }, replace: true })}
              className="w-full rounded-md border border-border bg-card px-3 py-3 text-[13.5px] font-medium text-foreground"
            >
              {disciplines.map((d) => (
                <option key={d.discKey} value={d.discKey}>
                  {discName(t, d.discKey, d.disc)}
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
                {discName(t, d.discKey, d.disc)}
              </button>
            ))}
          </div>

          <Panel
            title={t("qual.standingsTitle", { disc: discName(t, current.discKey, current.disc) })}
            subtitle={
              current.cutPoints === null
                ? t("qual.standingsSubtitle", { n: current.qualLimit })
                : t("qual.standingsSubtitleCut", {
                    n: current.qualLimit,
                    pts: current.cutPoints,
                  })
            }
            className="mt-6"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <caption className="sr-only">
                  {t("qual.caption", { disc: discName(t, current.discKey, current.disc) })}
                </caption>
                <thead>
                  <tr className="label-caps text-muted-foreground">
                    <th scope="col" className="w-10 pb-3 text-left font-semibold">
                      #
                    </th>
                    <th scope="col" className="pb-3 pl-3 text-left font-semibold">
                      {t("table.colAthlete")}
                    </th>
                    <th scope="col" className="w-16 pb-3 pl-4 text-left font-semibold">
                      {t("table.colNat")}
                    </th>
                    <th scope="col" className="w-20 pb-3 pl-4 text-right font-semibold">
                      {t("qual.colMeets")}
                    </th>
                    <th scope="col" className="w-20 pb-3 pl-4 text-right font-semibold">
                      {t("qual.colPoints")}
                    </th>
                    <th scope="col" className="w-32 pb-3 pl-4 text-right font-semibold">
                      {t("qual.colGap")}
                    </th>
                    <th scope="col" className="w-28 pb-3 pl-4 text-right font-semibold">
                      {t("qual.colStatus")}
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
              {t("qual.footBefore")}
              {t(meetingsLeft > 0 ? "qual.footOpen" : "qual.footDecided")}
              {data.scrapedAt &&
                t("qual.footScraped", {
                  when: new Date(data.scrapedAt).toLocaleString(lang),
                })}
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
  const { t } = useT();
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
          {gapLabel(row, qualLimit, t)}
        </td>
        <td className="py-3 pl-4 text-right">
          <span
            title={t((decided ? STATUS_TITLE_DECIDED_KEY : STATUS_TITLE_KEY)[row.status]!)}
            className={`label-caps inline-flex items-center rounded-full px-2 py-1 ${(decided ? STATUS_CLASS_DECIDED : STATUS_CLASS)[row.status]}`}
          >
            {t((decided ? STATUS_LABEL_DECIDED_KEY : STATUS_LABEL_KEY)[row.status]!)}
          </span>
        </td>
      </tr>
      {cutAfter && (
        <tr>
          <td colSpan={7} className="px-0 py-0">
            <div className="flex items-center gap-3 py-2">
              <span className="label-caps whitespace-nowrap text-terracotta-strong">
                {t("qual.cutLine", { n: qualLimit })}
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
  const { t } = useT();
  const rows = current.standings ?? [];
  const onLine = rows.find((r) => r.rank === current.qualLimit);
  const firstOut = rows.find((r) => r.rank != null && r.rank > current.qualLimit);
  if (!onLine && !firstOut) return null;

  return (
    <Panel
      title={t("qual.howToRead.title")}
      subtitle={t("qual.howToRead.subtitle")}
      className="mt-6"
    >
      <p className="max-w-3xl text-[14px] leading-relaxed text-muted-foreground">
        {t("qual.howToRead.p1Before")}
        <span className="nums">{pointsForAWin}</span>
        {t("qual.howToRead.p1After")}
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
            {t("qual.howToRead.holdsBefore", { n: current.qualLimit })}
            <span className="nums">{onLine.points}</span>
            {t("qual.howToRead.holdsAfter")}
            {onLine.gap === 0 ? t("qual.howToRead.exactlyLevel") : ""}.
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
            {t("qual.howToRead.firstOutBefore")}
            <span className="nums">{Math.abs(firstOut.gap ?? 0)}</span>{" "}
            {t(
              Math.abs(firstOut.gap ?? 0) === 1
                ? "qual.howToRead.point"
                : "qual.howToRead.points",
            )}
            {t("qual.howToRead.short")}
            {t(decided ? "qual.howToRead.decidedTail" : "qual.howToRead.openTail")}.
          </>
        )}
      </p>
    </Panel>
  );
}
