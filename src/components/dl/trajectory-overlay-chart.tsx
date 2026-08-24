import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Trajectory } from "@/lib/dl-data";
import { formatMark } from "@/lib/dl-data";

const WIDTH = 640;
const HEIGHT = 240;
const PAD_X = 16;
const PAD_TOP = 20;
const PAD_BOTTOM = 32;
const PAD_RIGHT = 108; // room for end-of-line direct labels

// Fixed-order categorical palette for up to 4 real athletes -- the first
// two reuse the app's own terracotta/gold brand accents (already the
// identity color for rank #1/#2 elsewhere in the app); the other two are
// new cool hues added specifically for this multi-series chart, spaced far
// from the warm brand hues and from each other for real distinguishability
// (not validated against the full six-checks script, but chosen at a
// matching lightness/chroma band to the existing accents on purpose).
const SERIES_COLORS = [
  "var(--terracotta)",
  "var(--gold-strong)",
  "oklch(0.5 0.14 250)",
  "oklch(0.5 0.13 155)",
];

function parseDate(d: string): number {
  // "23 AUG 2026" -> real timestamp, so multiple athletes' actual meet
  // dates position correctly relative to each other on one shared timeline
  // instead of a false per-athlete ordinal alignment.
  return new Date(d).getTime();
}

/** Real per-meet trajectories for a discipline's top contenders, overlaid
 * on one real calendar timeline -- replaces the old single fabricated
 * "illustrative curve toward the model's projection." Only athletes whose
 * real data is from the SAME season are plotted together (comparing one
 * athlete's real 2026 form against another's stale 2024 fallback would
 * misrepresent both); athletes without comparable current data are named
 * below the chart instead of silently dropped. Lines only ever connect an
 * athlete's own real points -- never interpolated between athletes. */
export function TrajectoryOverlayChart({
  trajectories,
  discKey,
}: {
  trajectories: Trajectory[];
  discKey: string;
}) {
  const [hover, setHover] = useState<{ series: number; point: number } | null>(null);
  const [tableView, setTableView] = useState(false);

  if (trajectories.length === 0) return null;

  const currentYear = Math.max(...trajectories.map((t) => t.historyYear ?? 0));
  const comparable = trajectories.filter((t) => t.historyYear === currentYear);
  const excluded = trajectories.filter((t) => t.historyYear !== currentYear);
  if (comparable.length === 0) return null;

  const first = comparable[0]?.history[0];
  const isField = first?.mark.endsWith("m") ?? false;

  const allValues = comparable.flatMap((t) =>
    t.history.map((h) => h.markValue).filter((v): v is number => v !== null),
  );
  const allDates = comparable.flatMap((t) => t.history.map((h) => parseDate(h.date)));
  const minV = Math.min(...allValues);
  const maxV = Math.max(...allValues);
  const padV = (maxV - minV) * 0.25 || 1;
  const domainMin = minV - padV;
  const domainMax = maxV + padV;
  const minD = Math.min(...allDates);
  const maxD = Math.max(...allDates);
  const spanD = maxD - minD || 1;

  const xFor = (ts: number) => PAD_X + ((ts - minD) / spanD) * (WIDTH - PAD_RIGHT - PAD_X);
  const yFor = (v: number) =>
    HEIGHT -
    PAD_BOTTOM -
    ((v - domainMin) / (domainMax - domainMin)) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

  const series = comparable.map((t, i) => {
    const pts = t.history.map((h) => ({
      ...h,
      x: xFor(parseDate(h.date)),
      y: yFor(h.markValue ?? minV),
    }));
    return { trajectory: t, color: SERIES_COLORS[i % SERIES_COLORS.length], pts };
  });

  // A handful of evenly-spaced real date ticks along the shared timeline.
  const tickCount = Math.min(5, Math.max(2, new Set(allDates).size));
  const dateTicks = Array.from(
    { length: tickCount },
    (_, i) => minD + (spanD * i) / (tickCount - 1),
  );

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="label-caps text-muted-foreground">
          Real {currentYear} form — top {comparable.length}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-muted-foreground">
            {isField ? "Higher is farther" : "Lower is faster"}
          </div>
          <button
            type="button"
            aria-pressed={tableView}
            onClick={() => setTableView((v) => !v)}
            className="label-caps shrink-0 rounded-sm border border-border px-1.5 py-0.5 text-muted-foreground transition-colors hover:text-terracotta-strong"
          >
            {tableView ? "Chart view" : "Table view"}
          </button>
        </div>
      </div>

      {tableView ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-[12.5px]">
            <caption className="sr-only">
              Real {currentYear} meet-by-meet marks for the top {comparable.length} contenders, one
              row per meet
            </caption>
            <thead>
              <tr className="label-caps text-muted-foreground">
                <th scope="col" className="py-1 pr-3 font-medium">
                  Athlete
                </th>
                <th scope="col" className="py-1 pr-3 font-medium">
                  Date
                </th>
                <th scope="col" className="py-1 pr-3 font-medium">
                  Mark
                </th>
                <th scope="col" className="py-1 font-medium">
                  Venue
                </th>
              </tr>
            </thead>
            <tbody>
              {series
                .flatMap((s) =>
                  s.pts.map((p) => ({ ...p, name: s.trajectory.name, color: s.color })),
                )
                .sort((a, b) => parseDate(a.date) - parseDate(b.date))
                .map((p, i) => (
                  <tr key={i} className="border-t border-border/60">
                    <td className="py-1.5 pr-3 text-foreground">
                      <span
                        className="mr-1.5 inline-block size-2 rounded-full align-middle"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.name}
                    </td>
                    <td className="py-1.5 pr-3 text-muted-foreground">{p.date}</td>
                    <td className="nums py-1.5 pr-3 text-foreground">{p.mark}</td>
                    <td className="py-1.5 text-foreground">{p.venue}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative mt-2">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ height: "auto" }}>
            <line
              x1={PAD_X}
              y1={HEIGHT - PAD_BOTTOM}
              x2={WIDTH - PAD_RIGHT}
              y2={HEIGHT - PAD_BOTTOM}
              stroke="var(--border)"
              strokeWidth={1}
            />
            {dateTicks.map((ts, i) => (
              <text
                key={i}
                x={xFor(ts)}
                y={HEIGHT - PAD_BOTTOM + 16}
                textAnchor="middle"
                fontSize={9.5}
                fill="var(--muted-foreground)"
              >
                {new Date(ts).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
              </text>
            ))}
            {series.map((s, si) => {
              const path = s.pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
              const lastPt = s.pts[s.pts.length - 1];
              return (
                <g key={si}>
                  <path
                    d={path}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {s.pts.map((p, pi) => (
                    <circle
                      key={pi}
                      cx={p.x}
                      cy={p.y}
                      r={4}
                      fill={s.color}
                      stroke="var(--card)"
                      strokeWidth={1.5}
                      tabIndex={0}
                      role="button"
                      aria-label={`${s.trajectory.name}, ${p.mark}, ${p.date}, ${p.venue}`}
                      onMouseEnter={() => setHover({ series: si, point: pi })}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover({ series: si, point: pi })}
                      onBlur={() => setHover(null)}
                      style={{ cursor: "pointer", outlineColor: s.color }}
                    />
                  ))}
                  {lastPt && (
                    <text
                      x={lastPt.x + 8}
                      y={lastPt.y + 3}
                      fontSize={11}
                      fontWeight={600}
                      fill={s.color}
                    >
                      {s.trajectory.name.split(" ").pop()}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          {hover &&
            (() => {
              const hoveredSeries = series[hover.series];
              const hoveredPoint = hoveredSeries?.pts[hover.point];
              if (!hoveredSeries || !hoveredPoint) return null;
              return (
                <div
                  className="card-shadow pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-border bg-popover px-2.5 py-1.5 text-[11px] text-popover-foreground"
                  style={{
                    left: `${(hoveredPoint.x / WIDTH) * 100}%`,
                    top: `${(hoveredPoint.y / HEIGHT) * 100 - 18}%`,
                  }}
                >
                  <div className="font-medium" style={{ color: hoveredSeries.color }}>
                    {hoveredSeries.trajectory.name}
                  </div>
                  <div>{hoveredPoint.mark}</div>
                  <div className="text-muted-foreground">{hoveredPoint.venue}</div>
                </div>
              );
            })()}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {series.map((s, i) => (
          <Link
            key={i}
            to="/athlete/$discKey/$name"
            params={{ discKey, name: s.trajectory.name }}
            className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground transition-colors hover:text-terracotta-strong"
          >
            <span
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.trajectory.name}
          </Link>
        ))}
      </div>
      {excluded.length > 0 && (
        <div className="mt-2 text-[11px] text-muted-foreground/85">
          {excluded.map((t) => t.name).join(", ")} {excluded.length === 1 ? "has" : "have"} no{" "}
          {currentYear} meeting data on record yet — see their profile for their most recent season.
        </div>
      )}
    </div>
  );
}
