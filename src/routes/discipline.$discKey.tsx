import type { CSSProperties } from "react";
import { disciplineLabel, pageHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, ProbabilityBar } from "@/components/dl/shell";
import { InfoTip } from "@/components/dl/info-tip";
import { FieldAnalysisBlock } from "@/components/dl/field-analysis";
import { TrajectoryOverlayChart } from "@/components/dl/trajectory-overlay-chart";
import { StorylineCards } from "@/components/dl/storyline-cards";
import { useDiscipline } from "@/hooks/useDiscipline";
import type { DepthVerdict, DisciplineReport, FieldScore } from "@/lib/dl-data";

export const Route = createFileRoute("/discipline/$discKey")({
  // head() runs before the data loads, so the label is derived from the
  // param rather than waiting for the API. 32 real pages, each previously
  // sharing one title with the whole site.
  head: ({ params }) => {
    const label = disciplineLabel(params.discKey);
    return pageHead(
      label,
      `Is the ${label} at the 2026 Diamond League Final a contest all the way down, or one athlete and a gap? Field depth, form and every head-to-head.`,
    );
  },
  component: DisciplinePage,
});

const DESCRIPTION =
  "One event read as a field rather than a list. Is this a genuine contest all the way down, or one athlete and a gap? Measured on World Athletics' own scoring points, so the answer can be compared against the other 31 finals.";

/** Why the verdict is not built on the model's probabilities.
 *
 * The model's target is top-three membership and each athlete is scored
 * independently, so a field's probabilities sum to no fixed total — across
 * the 32 real 2026 fields they run from 31 to 320. A discipline where nobody
 * clears 40% may be wide open or may just be one the model is unsure about,
 * and nothing in the number tells the two apart. WA's score has neither
 * problem: it is scraped, present on every toplist row, and the one figure in
 * this data that compares a shot putter to a 1500m runner. */
const WHY_SCORE =
  "This is measured on World Athletics' scoring points, not the model's probabilities. Probabilities rank athletes inside one event, but each athlete is scored on their own, so a field's percentages can add up to anything from 31 to 320 across the 32 finals. That's why they can't rank one event against another. A scraped score can.";

const VERDICT_TONE: Record<DepthVerdict["key"], string> = {
  level: "text-terracotta-strong",
  mixed: "text-foreground",
  topHeavy: "text-gold-strong",
};

function DisciplinePage() {
  const { discKey } = Route.useParams();
  const state = useDiscipline(discKey);
  const data = state.status === "ok" ? state.data : undefined;

  return (
    <Shell
      title={data ? data.disc : "Discipline"}
      eyebrow={
        data?.depth
          ? `Discipline vs discipline · ${ordinal(data.depth.spreadRank)} tightest of ${data.depth.of} finals`
          : "Discipline vs discipline"
      }
      description={DESCRIPTION}
    >
      {state.status === "loading" && <PanelSkeleton title="Depth of the field" rows={6} />}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}

      {data && (
        <>
          <DepthPanel data={data} />

          {/* Real per-meet marks and computed storylines, both moved here
              from the old Projections page. Order follows v0: the field and
              how level it is, then how they got here, then the matrix as the
              closing centrepiece. */}
          {data.trajectories && data.trajectories.length > 0 && (
            <Panel
              title={`Real season form — ${data.disc}`}
              subtitle="Every mark each contender actually recorded this season, on a real calendar. These aren't a smoothed trend; the dots are the meetings they turned up to."
              className="mt-6"
            >
              <TrajectoryOverlayChart trajectories={data.trajectories} discKey={data.discKey} />
            </Panel>
          )}

          {data.storylines && data.storylines.length > 0 && (
            <Panel
              title={`Storylines — ${data.disc}`}
              subtitle="Computed from the data, not written: each one is anchored on a real number, and the featured card is whichever most contradicts the model's own pick."
              className="mt-6"
            >
              <StorylineCards storylines={data.storylines} discKey={data.discKey} />
            </Panel>
          )}

          {data.fieldAnalysis && (
            <FieldAnalysisBlock
              analysis={data.fieldAnalysis}
              discKey={data.discKey}
              discLabel={data.disc}
              isField={data.isField}
            />
          )}
        </>
      )}
    </Shell>
  );
}

function DepthPanel({ data }: { data: DisciplineReport }) {
  const { depth, scores } = data;

  if (!depth || scores.length < 2) {
    return (
      <Panel
        title="Depth of the field"
        subtitle="Needs a World Athletics score for at least two of the field."
      >
        <p className="py-6 text-[13px] text-muted-foreground">
          Not enough of this field carries a World Athletics score this season to measure how level
          it is. Nothing is estimated in its place.
        </p>
      </Panel>
    );
  }

  const verdict = depth.verdict;
  const headroom = depth.toplistMedian === null ? null : depth.bestScore - depth.toplistMedian;
  // Field events start 6 and the long-distance races 10, so every count in
  // the copy below is read from the data -- a hardcoded "eight athletes"
  // would be wrong on 20 of the 32 disciplines.

  return (
    <>
      <Panel
        title="How level this field is"
        subtitle={`Every finalist's best score this season, strongest to weakest. The distance between the two ends is what ranks this event against the other ${depth.of}.`}
      >
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          {verdict && (
            <p className={`dg text-[30px] leading-none font-semibold ${VERDICT_TONE[verdict.key]}`}>
              {verdict.label}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">
            {verdict && <>{verdict.basis.charAt(0).toUpperCase() + verdict.basis.slice(1)}. </>}
            <span className="nums font-medium text-foreground">{depth.spread}</span> points from{" "}
            {shortName(depth.bestAthlete)} down to the weakest of the{" "}
            <span className="nums">{depth.scored}</span> scored.
          </p>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <Stat
            label="Spread across the field"
            value={`${depth.spread} pts`}
            note={`${ordinal(depth.spreadRank)} tightest of ${depth.of}`}
            hint="The points gap from the strongest finalist's score down to the weakest. A small gap is a tight, level field; a big one means the leader has daylight."
          />
          <Stat
            label="Strongest finalist"
            value={String(depth.bestScore)}
            note={shortName(depth.bestAthlete)}
          />
          <Stat
            label="World top-100 median"
            value={depth.toplistMedian === null ? "—" : String(depth.toplistMedian)}
            note={
              headroom === null
                ? "not scored this season"
                : `strongest finalist is ${headroom} clear`
            }
            hint="The middle score of the world's top 100 in this event this year, as a yardstick. It shows how the Final's field sits against the wider world, not just against itself."
          />
          <Stat
            label="Field scored"
            value={`${depth.scored}/${depth.fieldSize}`}
            note={
              depth.scored === depth.fieldSize
                ? "every finalist"
                : "some carry no score this season"
            }
            hint="How many of the finalists have a World Athletics score this season. A few events have one or two who don't, and nothing is estimated in their place."
          />
        </dl>

        <ScoreSpread scores={scores} />

        <p className="mt-5 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
          {WHY_SCORE}
        </p>
      </Panel>

      <Panel
        title="Where the model disagrees with the marks"
        subtitle={`Podium probability against measured ability, for the same ${scores.length} athletes. These two orderings are not the same, and where they diverge is the argument worth having.`}
        className="mt-6"
      >
        <ol className="divide-y divide-border">
          {scores.map((s, i) => (
            <li
              key={s.name}
              className="stagger-item flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
            >
              <span className="nums w-6 shrink-0 text-[12px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Link
                to="/athlete/$discKey/$name"
                params={{ discKey: data.discKey, name: s.name }}
                className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-foreground transition-colors hover:text-terracotta-strong hover:underline"
              >
                {s.name}
              </Link>
              <span className="nums w-14 shrink-0 text-right text-[12.5px] text-muted-foreground">
                {s.score}
              </span>
              <span className="hidden w-28 shrink-0 sm:block">
                <ProbabilityBar value={s.prob} trackHeight="h-1.5" />
              </span>
              <span className="nums w-12 shrink-0 text-right text-[13.5px] font-semibold text-foreground">
                {s.prob}%
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
          Ordered by World Athletics score. The percentage is the model's chance of that athlete
          finishing in the top three. It isn&apos;t a win probability, and the two columns are
          allowed to disagree: a season best is one day, and the projection reads a whole season.
        </p>
      </Panel>
    </>
  );
}

/** The spread drawn against its own range rather than against zero. WA scores
 * across a field sit between roughly 1000 and 1350, so a zero-anchored bar
 * would render every field as one flat block and show nothing. */
function ScoreSpread({ scores }: { scores: FieldScore[] }) {
  const top = scores[0]?.score ?? 0;
  const bottom = scores[scores.length - 1]?.score ?? 0;
  const range = Math.max(top - bottom, 1);

  return (
    <figure className="mt-6">
      <figcaption className="label-caps mb-3 text-muted-foreground">
        Each finalist&apos;s World Athletics score
      </figcaption>
      <div className="relative h-14 rounded-[12px] bg-secondary/50">
        {scores.map((s) => {
          const pct = ((s.score - bottom) / range) * 100;
          const best = s.score === top;
          return (
            <span
              key={s.name}
              title={`${s.name} — ${s.score}`}
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card"
              style={{
                left: `calc(${pct}% * 0.9 + 5%)`,
                background: best ? "var(--gold-strong)" : "var(--terracotta)",
              }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-muted-foreground">
        <span className="nums">
          {bottom} · {shortName(scores[scores.length - 1]?.name ?? "")}
        </span>
        <span className="nums">
          {shortName(scores[0]?.name ?? "")} · {top}
        </span>
      </div>
      <p className="mt-2 text-[12px] text-muted-foreground">
        Gold marks the strongest score in the field. Dots that bunch mean a level field; a dot out
        on its own means someone is clear of the rest.
      </p>
    </figure>
  );
}

function Stat({
  label,
  value,
  note,
  hint,
}: {
  label: string;
  value: string;
  note: string;
  hint?: string;
}) {
  return (
    <div>
      <dt className="label-caps flex items-center gap-1 text-muted-foreground">
        {label}
        {hint && <InfoTip label={`About ${label}`}>{hint}</InfoTip>}
      </dt>
      <dd className="nums mt-1 text-[22px] leading-none font-semibold text-foreground">{value}</dd>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{note}</p>
    </div>
  );
}

/** World Athletics writes surnames in caps ("Oblique SEVILLE"), which reads
 * as shouting in running prose. */
function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1] ?? "";
  return last.length > 1 ? last.charAt(0) + last.slice(1).toLowerCase() : name;
}

function ordinal(n: number): string {
  const suffix =
    n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th");
  return `${n}${suffix}`;
}
