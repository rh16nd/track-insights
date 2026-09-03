import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { Panel } from "./shell";
import type { DisciplineDepth } from "@/lib/dl-data";

/** The depth ladder — v0's Performance Index treatment, and the clearest
 * answer this data can give to "which events are genuinely deep, and which
 * are one athlete and a gap".
 *
 * Every discipline gets one bar running from its FIELD MEDIAN to its TOP
 * SCORE, all on a single shared axis. Because World Athletics' points put a
 * shot put and a 1500m on the same scale, the bars are directly comparable:
 * a short bar is a crowd, a long one is a soloist with daylight behind.
 *
 * This measure is the toplist's own spread (leader vs the median of the
 * ranked field) and is deliberately NOT the same as the discipline page's
 * spread, which measures the eight-or-so athletes in the actual Final.
 * They answer different questions — "is this event deep in the world?" vs
 * "is this final going to be a contest?" — so the labels say which is which
 * rather than letting one number stand in for both.
 *
 * All 32 read to the same depth (see the API's TOPLIST_DEPTH): two toplists
 * are scraped 500 rows deep rather than 100, and comparing those medians
 * untruncated put women's 5000m 29th of 32 when it is really 15th. */
type Sort = "depth" | "median" | "top";

const SORTS: { id: Sort; labelKey: string }[] = [
  { id: "depth", labelKey: "depth.sortDepth" },
  { id: "median", labelKey: "depth.sortMedian" },
  { id: "top", labelKey: "depth.sortTop" },
];

function sortRows(rows: DisciplineDepth[], sort: Sort): DisciplineDepth[] {
  const copy = [...rows];
  if (sort === "median") return copy.sort((a, b) => b.medianScore - a.medianScore);
  if (sort === "top") return copy.sort((a, b) => b.topScore - a.topScore);
  // Shortest spread first: the deepest events lead the ladder.
  return copy.sort((a, b) => a.topScore - a.medianScore - (b.topScore - b.medianScore));
}

export function DepthLadder({ rows }: { rows: DisciplineDepth[] }) {
  const { t } = useT();
  const [sort, setSort] = useState<Sort>("depth");
  const sorted = useMemo(() => sortRows(rows, sort), [rows, sort]);

  if (rows.length === 0) return null;

  // Axis snapped outward to the nearest 100 so the ticks are round numbers
  // and every bar sits inside the plot rather than touching its edge.
  const lo = Math.floor(Math.min(...rows.map((r) => r.medianScore)) / 100) * 100;
  const hi = Math.ceil(Math.max(...rows.map((r) => r.topScore)) / 100) * 100;
  const span = Math.max(hi - lo, 1);
  const pct = (v: number) => ((v - lo) / span) * 100;
  const ticks = [];
  for (let t = lo; t <= hi; t += 100) ticks.push(t);

  const deepest = sortRows(rows, "depth")[0];
  const widest = sortRows(rows, "depth")[rows.length - 1];

  return (
    <Panel
      title={t("depth.title", { n: rows.length })}
      subtitle={t("depth.subtitle")}
      action={
        <div className="flex flex-wrap gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSort(s.id)}
              aria-pressed={sort === s.id}
              className={`label-caps rounded-full border px-3 py-1.5 transition-colors ${
                sort === s.id
                  ? "border-terracotta/40 bg-secondary text-foreground"
                  : "border-border text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
              }`}
            >
              {t(s.labelKey)}
            </button>
          ))}
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-terracotta" />
          {t("depth.legendMedian")}
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-gold-strong" />
          {t("depth.legendTop")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-8 rounded-full bg-[linear-gradient(90deg,var(--terracotta),var(--gold-strong))]" />
          {t("depth.legendSpread")}
        </span>
      </div>

      {/* The axis is decorative on a phone -- at 375px the ticks collide --
          so it is hidden there and each row keeps its own numeric spread. */}
      <div
        aria-hidden="true"
        className="label-caps mb-1.5 hidden justify-between border-b border-border pb-2 sm:flex"
      >
        {ticks.map((tick) => (
          <span key={tick} className="nums text-muted-foreground">
            {tick}
          </span>
        ))}
      </div>

      <ol>
        {sorted.map((d, i) => {
          const spread = d.topScore - d.medianScore;
          return (
            <li
              key={d.discKey}
              className="stagger-item"
              style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
            >
              <Link
                to="/discipline/$discKey"
                params={{ discKey: d.discKey }}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 rounded-[10px] py-2 transition-colors hover:bg-secondary/40 sm:grid-cols-[190px_1fr_58px]"
              >
                <span className="truncate text-[13.5px] font-medium text-foreground transition-colors group-hover:text-terracotta-strong">
                  {d.disc}
                </span>

                <span className="relative order-3 col-span-2 h-3.5 sm:order-none sm:col-span-1">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
                  <span
                    className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,var(--terracotta),var(--gold-strong))]"
                    style={{
                      left: `${pct(d.medianScore)}%`,
                      width: `${Math.max(pct(d.topScore) - pct(d.medianScore), 0.6)}%`,
                    }}
                  />
                  <span
                    className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terracotta"
                    style={{ left: `${pct(d.medianScore)}%` }}
                  />
                  <span
                    className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-strong"
                    style={{ left: `${pct(d.topScore)}%` }}
                  />
                </span>

                <span className="nums text-right text-[13px] font-semibold text-foreground">
                  {sort === "median" ? d.medianScore : sort === "top" ? d.topScore : `+${spread}`}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
        {t("depth.noteBefore")}
        <span className="font-medium text-foreground">{deepest?.disc}</span>
        {t("depth.noteMid")}
        <span className="nums">{deepest ? deepest.topScore - deepest.medianScore : 0}</span>
        {t("depth.notePointsClear")}
        <span className="font-medium text-foreground">{widest?.disc}</span>
        {t("depth.noteAt")}
        <span className="nums">{widest ? widest.topScore - widest.medianScore : 0}</span>
        {t("depth.noteEnd")}
      </p>
    </Panel>
  );
}
