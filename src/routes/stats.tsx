import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { pageHead } from "@/lib/seo";
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

const DESCRIPTION =
  "Which events are genuinely deep — and which are one athlete and a gap. Every 2026 mark scored on World Athletics' points table, then read as a spread: how far a discipline's leader sits above the median of its own ranked field. A tight spread is a crowd; a long one is a soloist with daylight behind.";

type Filter = "all" | "track" | "field" | "outdoor";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All events" },
  { id: "track", label: "Track" },
  { id: "field", label: "Field" },
  { id: "outdoor", label: "Outdoor only" },
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
      title="Performance Index"
      eyebrow={
        data && scale
          ? `${data.season} season · ${scale.rows.toLocaleString()} ranked marks · scores ${scale.min}–${scale.max}`
          : "World Athletics scoring points"
      }
      description={DESCRIPTION}
      figures={
        <>
          <HeadFigure value={scale ? scale.rows.toLocaleString() : "—"} label="Marks scored" />
          <HeadFigure
            value={scale ? scale.median.toLocaleString() : "—"}
            label="Field median (WA pts)"
          />
          <HeadFigure value={scale ? `${scale.min}–${scale.max}` : "—"} label="Scoring range" />
          <HeadFigure value={indoor ? indoor.share : "—"} unit="%" label="Set indoors" />
        </>
      }
    >
      {state.status === "loading" && <PanelSkeleton title="Best of the season" rows={10} />}
      {state.status === "error" && <ErrorPanel message={state.message} />}

      {data && scale && (
        <>
          <DepthLadder rows={data.disciplineDepth} />

          <Panel
            className="mt-6"
            title={`Best of ${data.season}, any event`}
            subtitle="Ranked by World Athletics points, so a discus throw and an 800m are directly comparable. The bar is scaled to the range this season actually covers, not to zero."
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
                  {f.label}
                </button>
              ))}
            </div>

            {performances.length === 0 ? (
              <p className="py-6 text-[13px] text-muted-foreground">No marks match this filter.</p>
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
                World Athletics lists indoor marks inside its outdoor season rankings, tagged only
                by a <span className="nums">(i)</span> on the venue —{" "}
                <span className="nums">{indoor.share}%</span> of the{" "}
                <span className="nums">{indoor.total.toLocaleString()}</span> marks here, and close
                to half of them in the vertical jumps. They are kept, because for a vault or a shot
                put indoors is arguably the truer measure, but every one is labelled. Use{" "}
                <em>Outdoor only</em> above to drop them.
              </p>
            )}
          </Panel>
        </>
      )}
    </Shell>
  );
}

function IndoorBadge() {
  return (
    <span
      title="Set indoors — World Athletics lists these inside the outdoor season rankings"
      className="label-caps inline-flex items-center rounded-full bg-secondary px-1.5 py-0.5 text-foreground/80"
    >
      Indoor
    </span>
  );
}
