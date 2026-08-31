import type { CSSProperties } from "react";
import { Panel, ProbabilityBar } from "@/components/dl/shell";
import { startNoun } from "@/lib/dl-data";
import type { AthleteAnalytics, CareerSeason, SeasonForm } from "@/lib/dl-data";

/** The analyst block: what an athlete's RESULTS say, as opposed to what
 * their fastest afternoon says. Every number here comes from a real
 * scraped final — see src/athlete_analytics.py — and none of it feeds the
 * prediction model.
 *
 * The deliberate omission worth knowing about: no season best appears
 * anywhere in this component. The career progression panel owns that
 * figure, computed from World Athletics' toplist, which carries an
 * athlete's real best wherever it was set. This block only knows the races
 * that have been scraped, and the two disagree — showing both would put
 * two different "2018 best" figures on one page. */
export function AthleteAnalyticsBlock({
  analytics,
  isField,
  rivalNames = [],
  careerSeasons = [],
}: {
  analytics: AthleteAnalytics;
  isField: boolean;
  /** Opponents this athlete is projected to meet at the Final. Marked in
   * the list rather than split into their own panel: they are the same
   * records either way, and two panels of the same numbers was exactly the
   * duplication this replaced. */
  rivalNames?: string[];
  /** Season bests from the toplist. Folded into the form table as one
   * column rather than getting its own chart -- the profile already has a
   * season-form chart above, and a second line chart of nine points was
   * more decoration than information. */
  careerSeasons?: CareerSeason[];
}) {
  const { record, form, seasonShape, headToHead, coverage } = analytics;
  const rivals = new Set(rivalNames);
  const bestByYear = new Map<number, CareerSeason>(careerSeasons.map((s) => [s.year, s]));

  return (
    <>
      {record && (
        <Panel
          title="Competition record"
          subtitle={`Every scraped final: ${record.races} ${startNoun(isField)} across ${record.seasons} seasons. A season best is one afternoon — this is what happened the rest of the time.`}
          className="mt-6"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <BigStat label="Wins" value={`${record.wins}`} sub={`${record.winRate}% of starts`} />
            <BigStat
              label="Podiums"
              value={`${record.podiums}`}
              sub={`${record.podiumRate}% of starts`}
            />
            <BigStat
              label="Average finish"
              value={record.avgFinish.toFixed(2)}
              sub={`best: ${ordinalPlace(record.bestFinish)}`}
            />
            <BigStat
              label="Top-tier starts"
              value={`${record.topTierRaces}`}
              sub={`${record.topTierShare}% of ${startNoun(isField)}`}
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[460px] border-collapse text-left">
              <caption className="label-caps pb-2 text-left text-muted-foreground">
                By competition category
              </caption>
              <thead>
                <tr className="label-caps border-b border-border text-muted-foreground">
                  <th scope="col" className="pb-2 pr-2 font-semibold">
                    Category
                  </th>
                  <th scope="col" className="w-20 pb-2 pl-3 text-right font-semibold">
                    {isField ? "Comps" : "Races"}
                  </th>
                  <th scope="col" className="w-14 pb-2 pl-3 text-right font-semibold">
                    Won
                  </th>
                  <th scope="col" className="w-20 pb-2 pl-3 text-right font-semibold">
                    Podium
                  </th>
                  <th scope="col" className="w-24 pb-2 pl-3 text-right font-semibold">
                    Avg finish
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {record.byTier.map((t) => (
                  <tr key={t.label} className="transition-colors hover:bg-secondary/40">
                    <td className="py-2.5 pr-2 text-[13px] text-foreground">{t.label}</td>
                    <td className="nums py-2.5 pl-3 text-right text-[13px] text-muted-foreground">
                      {t.races}
                    </td>
                    <td className="nums py-2.5 pl-3 text-right text-[13px] font-semibold text-foreground">
                      {t.wins}
                    </td>
                    <td className="nums py-2.5 pl-3 text-right text-[13px] text-muted-foreground">
                      {t.podiums}
                    </td>
                    <td className="nums py-2.5 pl-3 text-right text-[13px] text-muted-foreground">
                      {t.avgFinish.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-3xl text-[11.5px] leading-snug text-muted-foreground">
            Categories are World Athletics&apos; own ranking labels, listed in a fixed order and
            deliberately not collapsed into a single quality score — a continental championship and
            a Continental Tour Gold meeting are not comparable on one axis. Read the rows against
            each other instead.
          </p>
        </Panel>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        {form.length > 0 && (
          <Panel
            title="Season by season"
            subtitle="Season best against the average of that year's best three — one lucky afternoon next to the level actually held."
          >
            <FormTable form={form} isField={isField} bestByYear={bestByYear} />
          </Panel>
        )}

        {seasonShape && seasonShape.byMonth.length > 0 && (
          <Panel
            title="Season shape"
            subtitle={`When they actually ${isField ? "compete" : "race"}, and when the best mark lands. An athlete who peaked in May is a different bet in September from one still climbing.`}
          >
            <SeasonShapeChart shape={seasonShape} isField={isField} />
          </Panel>
        )}
      </div>

      {headToHead.length > 0 && (
        <Panel
          title="Head-to-head record"
          subtitle={`Derived from actually sharing a ${startNoun(isField, 1)} — same meeting, same day, compared on finishing position. Nothing here is inferred.`}
          className="mt-6"
        >
          <ul className="divide-y divide-border">
            {headToHead.slice(0, 10).map((h, i) => (
              <li
                key={h.name}
                className="stagger-item flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
              >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="truncate text-[13.5px] text-foreground">{h.name}</span>
                  {rivals.has(h.name) && (
                    <span
                      title="Projected to be in the Final field"
                      className="label-caps shrink-0 rounded-full bg-terracotta/12 px-1.5 py-0.5 text-terracotta-strong"
                    >
                      In field
                    </span>
                  )}
                </span>
                <span className="nums w-20 shrink-0 text-right text-[13px] font-semibold text-foreground">
                  {h.wins}–{h.losses}
                  {h.draws > 0 && (
                    <span className="font-normal text-muted-foreground">–{h.draws}</span>
                  )}
                </span>
                <span className="hidden w-24 shrink-0 sm:block">
                  <ProbabilityBar value={h.winRate} trackHeight="h-1.5" />
                </span>
                <span className="nums w-24 shrink-0 text-right text-[11.5px] text-muted-foreground">
                  {h.meetings} {startNoun(isField, h.meetings)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11.5px] leading-snug text-muted-foreground">
            Sorted by how often they have met, not by record — the deepest rivalries are the
            informative ones. Losses are shown as plainly as wins. Opponents marked{" "}
            <span className="font-medium text-foreground">In field</span> are projected to line up
            in the Final.
          </p>
        </Panel>
      )}

      <p className="mt-3 text-[11.5px] leading-snug text-muted-foreground">
        Computed from {analytics.raceCount} scraped finals ({coverage.withPlace} with a recorded
        finishing position) across {coverage.seasons.length}{" "}
        {coverage.seasons.length === 1 ? "season" : "seasons"}: {coverage.seasons.join(", ")}. This
        is every meeting World Athletics publishes results for in the senior outdoor competition
        groups, not an athlete&apos;s complete career — a {startNoun(isField, 1)} outside those
        groups is not counted.
      </p>
    </>
  );
}

function BigStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="label-caps text-muted-foreground">{label}</div>
      <div className="nums mt-1 text-[24px] font-semibold leading-none text-foreground">
        {value}
      </div>
      {sub && <div className="mt-1 text-[11.5px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function ordinalPlace(n: number): string {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th";
  return `${n}${suffix}`;
}

function formatValue(value: number, isField: boolean): string {
  if (isField) return `${value.toFixed(2)}m`;
  if (value >= 60) {
    const m = Math.floor(value / 60);
    const s = value - m * 60;
    return `${m}:${s.toFixed(2).padStart(5, "0")}`;
  }
  return value.toFixed(2);
}

function FormTable({
  form,
  isField,
  bestByYear,
}: {
  form: SeasonForm[];
  isField: boolean;
  /** Season best comes from the toplist, never from the race log -- the log
   * only knows scraped races and the two disagree (Kovacs 2018: 20.36m
   * logged vs 21.02m real). One number, one owner. */
  bestByYear: Map<number, CareerSeason>;
}) {
  // Consistency is a coefficient of variation, so smaller is steadier
  // regardless of event. Scaled against the athlete's own worst season
  // rather than an absolute ceiling -- a 3% spread is enormous for a
  // sprinter and unremarkable for a thrower, and there is no honest
  // cross-event constant to compare against.
  const measured = form.filter((f) => f.consistency !== null);
  const worst = measured.length ? Math.max(...measured.map((f) => f.consistency as number)) : 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[460px] border-collapse text-left">
        <caption className="sr-only">
          Season by season: best mark, top-three average, and how consistent each campaign was
        </caption>
        <thead>
          <tr className="label-caps border-b border-border text-muted-foreground">
            <th scope="col" className="pb-2 pr-2 font-semibold">
              Season
            </th>
            <th scope="col" className="w-24 pb-2 pl-3 text-right font-semibold">
              Best
            </th>
            <th scope="col" className="w-24 pb-2 pl-3 text-right font-semibold">
              Top-3 avg
            </th>
            <th scope="col" className="w-20 pb-2 pl-3 text-right font-semibold">
              {isField ? "Comps" : "Races"}
            </th>
            <th scope="col" className="w-28 pb-2 pl-3 text-right font-semibold">
              Consistency
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[...form].reverse().map((f) => (
            <tr key={f.year} className="transition-colors hover:bg-secondary/40">
              <td className="nums py-2.5 pr-2 text-[13px] text-foreground">{f.year}</td>
              <td className="nums py-2.5 pl-3 text-right text-[13px] font-semibold text-foreground">
                {bestByYear.get(f.year)?.bestMark ?? "—"}
              </td>
              <td className="nums py-2.5 pl-3 text-right text-[13px] text-foreground">
                {formatValue(f.top3Average, isField)}
                {f.top3Count < 3 && (
                  <span className="ml-1 font-normal text-muted-foreground">(of {f.top3Count})</span>
                )}
              </td>
              <td className="nums py-2.5 pl-3 text-right text-[13px] text-muted-foreground">
                {f.marks}
              </td>
              <td className="py-2.5 pl-3 text-right">
                {f.consistency === null ? (
                  <span className="text-[11.5px] text-muted-foreground">
                    too few {startNoun(isField)}
                  </span>
                ) : (
                  <span className="flex items-center justify-end gap-2">
                    <span className="hidden w-12 sm:block">
                      {/* Inverted: a steadier season should read as a fuller bar. */}
                      <ProbabilityBar
                        value={worst ? 100 - (f.consistency / worst) * 100 : 100}
                        trackHeight="h-1.5"
                      />
                    </span>
                    <span className="nums text-[13px] text-foreground">
                      {f.consistency.toFixed(2)}%
                    </span>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11.5px] leading-snug text-muted-foreground">
        Consistency is the spread of a season&apos;s marks as a percentage of their average, so it
        reads the same for a 9.8-second sprinter and a 74-metre thrower. Lower is steadier. The bar
        compares a season only against this athlete&apos;s own others.
      </p>
    </div>
  );
}

function SeasonShapeChart({
  shape,
  isField,
}: {
  isField: boolean;
  shape: {
    byMonth: { month: string; races: number }[];
    bestMonth: string | null;
    firstRace: string;
    lastRace: string;
    races: number;
  };
}) {
  const peak = Math.max(...shape.byMonth.map((m) => m.races), 1);
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height: 120 }}>
        {shape.byMonth.map((m) => {
          const isBest = m.month === shape.bestMonth;
          return (
            <div key={m.month} className="flex flex-1 flex-col items-center justify-end gap-1.5">
              <span className="nums text-[11px] text-muted-foreground">{m.races}</span>
              <div
                className="w-full rounded-t-[4px] transition-[height] duration-500 ease-out"
                style={{
                  height: `${Math.max(6, (m.races / peak) * 84)}px`,
                  backgroundImage: isBest
                    ? "linear-gradient(180deg, var(--gold-strong), var(--terracotta))"
                    : "linear-gradient(180deg, var(--terracotta), var(--brick))",
                }}
                title={`${m.month}: ${m.races} ${startNoun(isField, m.races)}${isBest ? " — season best set here" : ""}`}
              />
              <span className="label-caps text-muted-foreground">{m.month}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[12px] leading-snug text-muted-foreground">
        {shape.races} {startNoun(isField, shape.races)} from {shape.firstRace} to {shape.lastRace}.
        {shape.bestMonth && (
          <>
            {" "}
            Their best mark of the season came in{" "}
            <span className="font-medium text-foreground">{shape.bestMonth}</span> (gold bar).
          </>
        )}
      </p>
    </div>
  );
}
