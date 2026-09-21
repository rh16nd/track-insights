import { disciplineLabel, pageHead } from "@/lib/seo";
import { usePageTitle } from "@/lib/use-page-title";
import { createFileRoute } from "@tanstack/react-router";
import { Shell, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { BareFrame } from "@/components/dl/bare-frame";
import { InfoTip } from "@/components/dl/info-tip";
import { FieldAnalysisBlock } from "@/components/dl/field-analysis";
import { TrajectoryOverlayChart } from "@/components/dl/trajectory-overlay-chart";
import { WorldRankingTable } from "@/components/dl/world-ranking-table";
import { useDiscipline } from "@/hooks/useDiscipline";
import { useWorldRankings } from "@/hooks/useWorldRankings";
import type { DepthVerdict, DisciplineReport, FieldScore } from "@/lib/dl-data";
import { discName, eventOrder, ordinalIn } from "@/lib/dl-data";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/discipline/$discKey")({
  // head() runs before the data loads, so the label is derived from the
  // param rather than waiting for the API. 36 real pages, each previously
  // sharing one title with the whole site.
  head: ({ params }) => {
    const label = disciplineLabel(params.discKey);
    return pageHead(
      label,
      `How level is the ${label} among the world's best this season, or is one athlete clear of the rest? Field depth, season form and the model's ratings.`,
      `/discipline/${params.discKey}`,
    );
  },
  component: DisciplinePage,
});

/** Why the verdict is built on World Athletics' score, not the model ratings.
 *
 * Every event's top 20 share the same 300 points of rating, so the ratings say
 * who leads inside an event but not how far apart an event's athletes are.
 * WA's score does: it is scraped, present on every toplist row, and the one
 * figure in this data that compares a shot putter to a 1500m runner. (Until
 * 2026-09-17 the percentages were the Diamond League model's, which summed to
 * anything from 31 to 320 a field.) */
const VERDICT_TONE: Record<DepthVerdict["key"], string> = {
  level: "text-terracotta-strong",
  mixed: "text-foreground",
  topHeavy: "text-gold-strong",
};

function DisciplinePage() {
  const { t, lang } = useT();
  const { discKey } = Route.useParams();
  // Off the URL param, not the loaded response, so the tab is already right
  // while the page loads -- the same reason the country page reads its theme
  // from the code in the URL.
  usePageTitle(discName(t, discKey, disciplineLabel(discKey)));
  // Every event reads the world's top athletes on points since 2026-09-17, so
  // one set of copy serves all 36 pages, including while the data loads.
  const state = useDiscipline(discKey);
  const data = state.status === "ok" ? state.data : undefined;

  return (
    <Shell
      title={data ? discName(t, data.discKey, data.disc) : t("disc.titleFallback")}
      // A track event opens on the track photo, a field event on the field one.
      photo={eventOrder(discKey)[0] === 0 ? "track" : "field"}
      eyebrow={
        data?.depth
          ? t("disc.eyebrow", {
              rank: ordinalIn(lang, data.depth.spreadRank),
              of: data.depth.of,
              n: data.depth.fieldSize,
              wider: data.depth.finalsWider ?? 0,
            })
          : t("disc.eyebrowBare")
      }
      description={t("disc.description")}
      layout="open"
    >
      {state.status === "loading" && <PanelSkeleton title={t("disc.depthSkeleton")} rows={6} />}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}

      {/* Every section straight on the page, with a hairline between them,
          like the Asian Games page (the user, 2026-09-21: "don't put them in
          a box"). */}
      {data && (
        <>
          <DepthPanel data={data} />

          {/* All of the world's top 20, the list Track and Field show, with the
              same points-or-rating toggle. It replaced a shorter list of the
              same comparison over the Final-sized field above (the user,
              2026-09-21: "all 20 athletes listed"). */}
          <TopTwenty discKey={data.discKey} isField={data.isField} />

          {/* Real per-meet marks, moved here from the old Projections page.
              Order follows v0: the field and how level it is, then how they
              got here, then the matrix as the closing centrepiece. The
              storylines went on 2026-09-17: each one read the Diamond League
              Final's projected field, which these pages no longer show. */}
          {data.trajectories && data.trajectories.length > 0 && (
            <BareFrame
              level={2}
              title={t("disc.seasonForm", { disc: discName(t, data.discKey, data.disc) })}
              subtitle={t("disc.seasonFormSubtitle")}
              className="mt-14 border-t border-border pt-12"
            >
              <TrajectoryOverlayChart trajectories={data.trajectories} discKey={data.discKey} />
            </BareFrame>
          )}

          {data.fieldAnalysis && (
            <FieldAnalysisBlock
              analysis={data.fieldAnalysis}
              discKey={data.discKey}
              discLabel={discName(t, data.discKey, data.disc)}
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
      <BareFrame level={2} title={t("disc.depthTitle")} subtitle={t("disc.depthNeeds")}>
        <p className="text-[13px] text-muted-foreground">{t("disc.depthNotEnough")}</p>
      </BareFrame>
    );
  }

  const verdict = depth.verdict;
  const headroom = depth.toplistMedian === null ? null : depth.bestScore - depth.toplistMedian;
  // Field events start 6 and the long-distance races 10, so every count in
  // the copy below is read from the data -- a hardcoded "eight athletes"
  // would be wrong on 20 of the 32 disciplines.
  const size = depth.fieldSize;

  return (
    <BareFrame
      level={2}
      title={t("disc.levelTitle")}
      subtitle={t("disc.levelSubtitle", { of: depth.of, n: size })}
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
                const basis = t(`disc.verdict.${verdict.key}.basis`, { of: depth.of });
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
            wider: depth.finalsWider ?? 0,
          })}
          hint={t("disc.statSpreadHint", { size })}
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
          hint={t("disc.statMedianHint", { size })}
        />
        <Stat
          label={t("disc.statScored")}
          value={`${depth.scored}/${size}`}
          note={depth.scored === size ? t("disc.statScoredEvery") : t("disc.statScoredSome")}
          hint={t("disc.statScoredHint", { size })}
        />
      </dl>

      <ScoreSpread scores={scores} />

      <p className="mt-5 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
        {t("disc.whyScore")}
      </p>
    </BareFrame>
  );
}

/** The event's own top 20, from the list Track and Field read. */
function TopTwenty({ discKey, isField }: { discKey: string; isField: boolean }) {
  const state = useWorldRankings();
  if (state.status !== "ok" || !state.data[discKey]) return null;
  return (
    <div className="mt-14 border-t border-border pt-12">
      <WorldRankingTable
        rankings={state.data}
        isField={isField}
        activeId={discKey}
        onActiveChange={() => undefined}
        onlyId={discKey}
      />
    </div>
  );
}

/** The spread drawn against its own range rather than against zero. WA scores
 * across a field sit between roughly 1000 and 1350, so a zero-anchored bar
 * would render every field as one flat block and show nothing. */
function ScoreSpread({ scores }: { scores: FieldScore[] }) {
  const topScore = scores[0]?.score ?? 0;
  const { t } = useT();
  const bottom = scores[scores.length - 1]?.score ?? 0;
  const range = Math.max(topScore - bottom, 1);

  return (
    <figure className="mt-6">
      <figcaption className="label-caps mb-3 text-muted-foreground">
        {t("disc.spreadCaption")}
      </figcaption>
      <div className="relative h-14 rounded-[12px] bg-secondary/50">
        {scores.map((s) => {
          const pct = ((s.score - bottom) / range) * 100;
          const best = s.score === topScore;
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
          {shortName(scores[0]?.name ?? "")} · {topScore}
        </span>
      </div>
      <p className="mt-2 text-[12px] text-muted-foreground">{t("disc.spreadNote")}</p>
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
