import type { CSSProperties } from "react";
import { Panel, ProbabilityBar } from "@/components/dl/shell";
import type { AthleteAnalytics, SeasonForm } from "@/lib/dl-data";

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
}: {
  analytics: AthleteAnalytics;
  isField: boolean;
}) {
  const { record, form, seasonShape, headToHead, coverage } = analytics;

  return (
    <>
      {record && (
        <Panel
          title="Competition record"
          subtitle={`Every scraped final: ${record.races} races across ${record.seasons} seasons. A season best is one afternoon — this is what happened the rest of the time.`}
          className="mt-4"
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
              sub={`${record.topTierShare}% of races`}
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
                  <th scope="col" className="w-16 pb-2 pl-3 text-right font-semibold">
                    Races
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

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        {form.length > 0 && (
          <Panel
            title="Form and consistency"
            subtitle="Average of an athlete's best three marks each season, which survives one lucky day in a way a season best does not."
          >
            <FormTable form={form} isField={isField} />
          </Panel>
        )}

        {seasonShape && seasonShape.byMonth.length > 0 && (
          <Panel
            title="Season shape"
            subtitle="When they actually race, and when the best mark lands. An athlete who peaked in May is a different bet in September from one still climbing."
          >
            <SeasonShapeChart shape={seasonShape} />
          </Panel>
        )}
      </div>

      {headToHead.length > 0 && (
        <Panel
          title="Most-raced opponents"
          subtitle="Derived from actually sharing a race — same meeting, same day, compared on finishing position. Nothing here is inferred."
          className="mt-4"
        >
          <ul className="divide-y divide-border">
            {headToHead.slice(0, 10).map((h, i) => (
              <li
                key={h.name}
                className="stagger-item flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
              >
                <span className="min-w-0 flex-1 truncate text-[13.5px] text-foreground">
                  {h.name}
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
                  {h.meetings} {h.meetings === 1 ? "race" : "races"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11.5px] leading-snug text-muted-foreground">
            Sorted by how often they have met, not by record — the deepest rivalries are the
            informative ones. Losses are shown as plainly as wins.
          </p>
        </Panel>
      )}

      <p className="mt-3 text-[11.5px] leading-snug text-muted-foreground">
        Computed from {analytics.raceCount} scraped finals ({coverage.withPlace} with a recorded
        finishing position) across {coverage.seasons.length}{" "}
        {coverage.seasons.length === 1 ? "season" : "seasons"}: {coverage.seasons.join(", ")}. This
        is every meeting World Athletics publishes results for in the senior outdoor competition
        groups, not an athlete&apos;s complete career — a race outside those groups is not counted.
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

function FormTable({ form, isField }: { form: SeasonForm[]; isField: boolean }) {
  // Consistency is a coefficient of variation, so smaller is steadier
  // regardless of event. Scaled against the athlete's own worst season
  // rather than an absolute ceiling -- a 3% spread is enormous for a
  // sprinter and unremarkable for a thrower, and there is no honest
  // cross-event constant to compare against.
  const measured = form.filter((f) => f.consistency !== null);
  const worst = measured.length ? Math.max(...measured.map((f) => f.consistency as number)) : 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[380px] border-collapse text-left">
        <thead>
          <tr className="label-caps border-b border-border text-muted-foreground">
            <th scope="col" className="pb-2 pr-2 font-semibold">
              Season
            </th>
            <th scope="col" className="w-24 pb-2 pl-3 text-right font-semibold">
              Top-3 avg
            </th>
            <th scope="col" className="w-16 pb-2 pl-3 text-right font-semibold">
              Races
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
                  <span className="text-[11.5px] text-muted-foreground">too few races</span>
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
}: {
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
                title={`${m.month}: ${m.races} ${m.races === 1 ? "race" : "races"}${isBest ? " — season best set here" : ""}`}
              />
              <span className="label-caps text-muted-foreground">{m.month}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[12px] leading-snug text-muted-foreground">
        {shape.races} {shape.races === 1 ? "race" : "races"} from {shape.firstRace} to{" "}
        {shape.lastRace}.
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
