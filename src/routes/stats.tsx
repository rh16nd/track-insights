import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { pageHead } from "@/lib/seo";
import { useT } from "@/lib/i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shell,
  Panel,
  PanelSkeleton,
  ErrorPanel,
  AthleteAvatar,
  ProbabilityBar,
} from "@/components/dl/shell";
import type { Performance } from "@/lib/dl-data";
import { useStats } from "@/hooks/useStats";
import { DepthLadder } from "@/components/dl/depth-ladder";
import { HeadFigure } from "@/components/dl/shell";

export const Route = createFileRoute("/stats")({
  head: () =>
    pageHead(
      "Performance Index",
      "Which athletics events are genuinely deep and which are one athlete and a gap, scored on World Athletics' own points table.",
    ),
  component: StatsPage,
});

type Filter = "all" | "track" | "field" | "outdoor";

const FILTERS: { id: Filter; labelKey: string }[] = [
  { id: "all", labelKey: "stats.filterAll" },
  { id: "track", labelKey: "stats.filterTrack" },
  { id: "field", labelKey: "stats.filterField" },
  { id: "outdoor", labelKey: "stats.filterOutdoor" },
];

function applyFilter(rows: Performance[], filter: Filter): Performance[] {
  if (filter === "track") return rows.filter((p) => !p.isField);
  if (filter === "field") return rows.filter((p) => p.isField);
  if (filter === "outdoor") return rows.filter((p) => !p.indoor);
  return rows;
}

/** The score bar is drawn against the range the season actually occupies,
 * not against zero. WA's scores start around 1007 here and top out at 1353,
 * so a 0-1353 scale would render every bar between 75% and 100% full and
 * show nothing. Anchored slightly below the real minimum so the weakest
 * entry still has a visible bar rather than an empty track. */
function scorePercent(score: number, min: number, max: number): number {
  const floor = min - 20;
  if (max <= floor) return 100;
  return ((score - floor) / (max - floor)) * 100;
}

function StatsPage() {
  const { t } = useT();
  const state = useStats();
  const data = state.status === "ok" ? state.data : undefined;
  const [filter, setFilter] = useState<Filter>("all");

  const performances = useMemo(
    () => applyFilter(data?.topPerformances ?? [], filter),
    [data, filter],
  );

  const scale = data?.scoreScale;
  const indoor = data?.indoor;

  return (
    <Shell
      title={t("stats.title")}
      eyebrow={
        data && scale
          ? t("stats.eyebrow", {
              season: data.season,
              rows: scale.rows.toLocaleString(),
              min: scale.min,
              max: scale.max,
            })
          : t("stats.eyebrowBare")
      }
      description={t("stats.description")}
      figures={
        <>
          <HeadFigure
            value={scale ? scale.rows.toLocaleString() : "—"}
            label={t("stats.figMarksScored")}
          />
          <HeadFigure
            value={scale ? scale.median.toLocaleString() : "—"}
            label={t("stats.figFieldMedian")}
          />
          <HeadFigure
            value={scale ? `${scale.min}–${scale.max}` : "—"}
            label={t("stats.figScoringRange")}
          />
          <HeadFigure
            value={indoor ? indoor.share : "—"}
            unit="%"
            label={t("stats.figSetIndoors")}
          />
        </>
      }
    >
      {state.status === "loading" && <PanelSkeleton title={t("stats.bestOfSeason")} rows={10} />}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}

      {data && scale && (
        <>
          <DepthLadder rows={data.disciplineDepth} />

          <Panel
            className="mt-6"
            title={t("stats.bestOfYear", { season: data.season })}
            subtitle={t("stats.bestSubtitle")}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                    filter === f.id
                      ? "border-transparent text-primary-foreground shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
                  }`}
                  style={
                    filter === f.id
                      ? {
                          backgroundImage:
                            "linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
                        }
                      : undefined
                  }
                >
                  {t(f.labelKey)}
                </button>
              ))}
            </div>

            {performances.length === 0 ? (
              <p className="py-6 text-[13px] text-muted-foreground">{t("stats.noMarks")}</p>
            ) : (
              <ol className="divide-y divide-border">
                {performances.map((p, i) => (
                  <li
                    key={`${p.discKey}-${p.athlete}`}
                    className="stagger-item flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
                  >
                    <span className="nums w-6 shrink-0 text-[12px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <AthleteAvatar name={p.athlete} highlight={i === 0} />
                    <span className="min-w-0 flex-1">
                      <Link
                        to="/athlete/$discKey/$name"
                        params={{ discKey: p.discKey, name: p.athlete }}
                        className="block truncate text-[13.5px] font-medium text-foreground transition-colors hover:text-terracotta-strong hover:underline"
                      >
                        {p.athlete}
                      </Link>
                      <span className="flex flex-wrap items-center gap-x-2 text-[12px] text-muted-foreground">
                        <span className="truncate">{p.disc}</span>
                        <span aria-hidden="true">·</span>
                        <span className="nums">{p.mark}</span>
                        {p.indoor && <IndoorBadge />}
                      </span>
                    </span>
                    <span className="hidden w-32 shrink-0 sm:block">
                      <ProbabilityBar
                        value={scorePercent(p.score, scale.min, scale.max)}
                        trackHeight="h-1.5"
                      />
                    </span>
                    <span className="nums w-12 shrink-0 text-right text-[13.5px] font-semibold text-foreground">
                      {p.score}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            {indoor && (
              <p className="mt-4 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
                {t("stats.indoorNoteBefore")}
                <span className="nums">(i)</span>
                {t("stats.indoorNoteMid")}
                <span className="nums">{indoor.share}</span>
                {t("stats.indoorNoteOf")}
                <span className="nums">{indoor.total.toLocaleString()}</span>
                {t("stats.indoorNoteAfter")}
                <em>{t("stats.indoorNoteOutdoorOnly")}</em>
                {t("stats.indoorNoteEnd")}
              </p>
            )}
          </Panel>
        </>
      )}
    </Shell>
  );
}

function IndoorBadge() {
  const { t } = useT();
  return (
    <span
      title={t("stats.indoorBadgeTitle")}
      className="label-caps inline-flex items-center rounded-full bg-secondary px-1.5 py-0.5 text-foreground/80"
    >
      {t("stats.indoorBadge")}
    </span>
  );
}
