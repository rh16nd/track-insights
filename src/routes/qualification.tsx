import { useMemo } from "react";
import type { CSSProperties } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
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

const DESCRIPTION =
  "Who has actually earned a place at the Final. These are World Athletics' own Diamond League points — not a prediction — with the gap to the qualification cut worked out from what is still winnable.";

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
 * a meaningless number. */
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

  return (
    <Shell
      title="Race for the Final"
      eyebrow={
        data
          ? meetingsLeft > 0
            ? `${meetingsLeft} scoring meeting${meetingsLeft === 1 ? "" : "s"} left · a win is worth ${data.pointsForAWin} points`
            : "Every scoring meeting is run — the standings are final"
          : "2026 Diamond League standings"
      }
      description={DESCRIPTION}
    >
      {state.status === "loading" && <PanelSkeleton title="Diamond League standings" rows={10} />}
      {state.status === "error" && <ErrorPanel message={state.message} />}

      {data && current && (
        <>
          {tight.length > 0 && (
            <Panel
              title={
                nextMeet ? `Closest to the line going into ${nextMeet.city}` : "Closest to the line"
              }
              subtitle="The smallest gap between the qualification cut and the first athlete below it — the disciplines the last meeting actually decides."
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
            className="mt-4"
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
                <>No scoring meetings remain, so these standings are the result.</>
              )}
              {data.scrapedAt && <> Scraped {new Date(data.scrapedAt).toLocaleString()}.</>}
            </p>
          </Panel>
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
}: {
  row: QualificationRow;
  index: number;
  discKey: string;
  cutAfter: boolean;
  qualLimit: number;
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
            title={STATUS_TITLE[row.status]}
            className={`label-caps inline-flex items-center rounded-full px-2 py-1 ${STATUS_CLASS[row.status]}`}
          >
            {STATUS_LABEL[row.status]}
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
