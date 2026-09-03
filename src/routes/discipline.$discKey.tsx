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
import { ordinalIn } from "@/lib/dl-data";
import { useT } from "@/lib/i18n";

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

/** Why the verdict is not built on the model's probabilities.
 *
 * The model's target is top-three membership and each athlete is scored
 * independently, so a field's probabilities sum to no fixed total — across
 * the 32 real 2026 fields they run from 31 to 320. A discipline where nobody
 * clears 40% may be wide open or may just be one the model is unsure about,
 * and nothing in the number tells the two apart. WA's score has neither
 * problem: it is scraped, present on every toplist row, and the one figure in
 * this data that compares a shot putter to a 1500m runner. */
const VERDICT_TONE: Record<DepthVerdict["key"], string> = {
  level: "text-terracotta-strong",
  mixed: "text-foreground",
  topHeavy: "text-gold-strong",
};

function DisciplinePage() {
  const { t, lang } = useT();
  const { discKey } = Route.useParams();
  const state = useDiscipline(discKey);
  const data = state.status === "ok" ? state.data : undefined;

  return (
    <Shell
      title={data ? data.disc : t("disc.titleFallback")}
      eyebrow={
        data?.depth
          ? t("disc.eyebrow", {
              rank: ordinalIn(lang, data.depth.spreadRank),
              of: data.depth.of,
            })
          : t("disc.eyebrowBare")
      }
      description={t("disc.description")}
    >
      {state.status === "loading" && <PanelSkeleton title={t("disc.depthSkeleton")} rows={6} />}
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
              title={t("disc.seasonForm", { disc: data.disc })}
              subtitle={t("disc.seasonFormSubtitle")}
              className="mt-6"
            >
              <TrajectoryOverlayChart trajectories={data.trajectories} discKey={data.discKey} />
            </Panel>
          )}

          {data.storylines && data.storylines.length > 0 && (
            <Panel
              title={t("disc.storylines", { disc: data.disc })}
              subtitle={t("disc.storylinesSubtitle")}
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
  const { t, lang } = useT();
  const { depth, scores } = data;

  if (!depth || scores.length < 2) {
    return (
      <Panel
        title={t("disc.depthTitle")}
        subtitle={t("disc.depthNeeds")}
      >
        <p className="py-6 text-[13px] text-muted-foreground">{t("disc.depthNotEnough")}</p>
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
        title={t("disc.levelTitle")}
        subtitle={t("disc.levelSubtitle", { of: depth.of })}
      >
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          {verdict && (
            <p className={`dg text-[30px] leading-none font-semibold ${VERDICT_TONE[verdict.key]}`}>
              {t(`disc.verdict.${verdict.key}.label`)}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">
            {verdict && (
              <>
                {(() => {
                  const basis = t(`disc.verdict.${verdict.key}.basis`);
                  return basis.charAt(0).toUpperCase() + basis.slice(1);
                })()}
                {". "}
              </>
            )}
            <span className="nums font-medium text-foreground">{depth.spread}</span>
            {t("disc.spreadSentenceMid")}
            {shortName(depth.bestAthlete)}
            {t("disc.spreadSentenceDown")}
            <span className="nums">{depth.scored}</span>
            {t("disc.spreadSentenceEnd")}
          </p>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <Stat
            label={t("disc.statSpread")}
            value={t("disc.statSpreadValue", { n: depth.spread })}
            note={t("disc.statSpreadNote", {
              rank: ordinalIn(lang, depth.spreadRank),
              of: depth.of,
            })}
            hint={t("disc.statSpreadHint")}
          />
          <Stat
            label={t("disc.statStrongest")}
            value={String(depth.bestScore)}
            note={shortName(depth.bestAthlete)}
          />
          <Stat
            label={t("disc.statMedian")}
            value={depth.toplistMedian === null ? "—" : String(depth.toplistMedian)}
            note={
              headroom === null
                ? t("disc.statMedianNoScore")
                : t("disc.statMedianClear", { n: headroom })
            }
            hint={t("disc.statMedianHint")}
          />
          <Stat
            label={t("disc.statScored")}
            value={`${depth.scored}/${depth.fieldSize}`}
            note={
              depth.scored === depth.fieldSize
                ? t("disc.statScoredEvery")
                : t("disc.statScoredSome")
            }
            hint={t("disc.statScoredHint")}
          />
        </dl>

        <ScoreSpread scores={scores} />

        <p className="mt-5 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
          {t("disc.whyScore")}
        </p>
      </Panel>

      <Panel
        title={t("disc.disagreeTitle")}
        subtitle={t("disc.disagreeSubtitle", { n: scores.length })}
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
          {t("disc.disagreeNote")}
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
  const { t } = useT();
  const bottom = scores[scores.length - 1]?.score ?? 0;
  const range = Math.max(top - bottom, 1);

  return (
    <figure className="mt-6">
      <figcaption className="label-caps mb-3 text-muted-foreground">
        {t("disc.spreadCaption")}
      </figcaption>
      <div className="relative h-14 rounded-[12px] bg-secondary/50">
        {scores.map((s) => {
          const pct = ((s.score - bottom) / range) * 100;
          const best = s.score === top;
          return (
            <span
              key={s.name}
              title={`${s.name} · ${s.score}`}
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
        {t("disc.spreadNote")}
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
  const { t } = useT();
  return (
    <div>
      <dt className="label-caps flex items-center gap-1 text-muted-foreground">
        {label}
        {hint && <InfoTip label={t("figure.about", { label })}>{hint}</InfoTip>}
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
