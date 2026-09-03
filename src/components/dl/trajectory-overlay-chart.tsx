import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import type { Trajectory } from "@/lib/dl-data";
import { formatMark } from "@/lib/dl-data";

const WIDTH = 640;
const HEIGHT = 240;
const PAD_X = 48; // room for the y-axis mark labels
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

// Series were previously separated by hue alone, which fails for colour-blind
// readers and in greyscale print: two of the four accents sit at a matching
// lightness/chroma band by design, so they converge without colour. Each
// series now also carries its own dash signature, and the same signature is
// mirrored in the table view's legend swatch so the two views agree.
const SERIES_DASH = ["", "7 4", "2 3", "10 3 2 3"];

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
  const { t } = useT();
  const [hover, setHover] = useState<{ series: number; point: number } | null>(null);
  const [tableView, setTableView] = useState(false);

  if (trajectories.length === 0) return null;

  const currentYear = Math.max(...trajectories.map((tr) => tr.historyYear ?? 0));
  const comparable = trajectories.filter((tr) => tr.historyYear === currentYear);
  const excluded = trajectories.filter((tr) => tr.historyYear !== currentYear);
  if (comparable.length === 0) return null;

  const first = comparable[0]?.history[0];
  const isField = first?.mark.endsWith("m") ?? false;

  const allValues = comparable.flatMap((tr) =>
    tr.history.map((h) => h.markValue).filter((v): v is number => v !== null),
  );
  const allDates = comparable.flatMap((tr) => tr.history.map((h) => parseDate(h.date)));
  const minV = Math.min(...allValues);
  const maxV = Math.max(...allValues);
  const padV = (maxV - minV) * 0.25 || 1;
  const domainMin = minV - padV;
  const domainMax = maxV + padV;
  const minD = Math.min(...allDates);
  const maxD = Math.max(...allDates);
  const spanD = maxD - minD || 1;

  const xFor = (ts: number) => PAD_X + ((ts - minD) / spanD) * (WIDTH - PAD_RIGHT - PAD_X);

  // "Better" always points UP. For field events that's the raw value (a
  // longer throw is a bigger number), but for track events a FASTER run is a
  // SMALLER number -- plotting raw seconds made an improving sprinter's line
  // descend, so a genuine improvement read visually as decline. The axis is
  // flipped for time events so the shape of the line matches the story the
  // numbers tell; the y-axis labels below still show the real marks, so
  // nothing is hidden by the flip.
  const yFor = (v: number) => {
    const t = (v - domainMin) / (domainMax - domainMin);
    const up = isField ? t : 1 - t;
    return HEIGHT - PAD_BOTTOM - up * (HEIGHT - PAD_TOP - PAD_BOTTOM);
  };

  // Real mark values along the y-axis, formatted the way the sport writes
  // them: distances as metres, sprints as seconds, and anything the API
  // returns as m:ss.xx converted back from raw seconds rather than printed
  // as a bare "477.25".
  const usesClockFormat = comparable.some((tr) => tr.history.some((h) => h.mark.includes(":")));
  const formatValue = (v: number) => {
    if (usesClockFormat) {
      const mins = Math.floor(v / 60);
      const secs = v - mins * 60;
      return `${mins}:${secs < 10 ? "0" : ""}${secs.toFixed(2)}`;
    }
    return isField ? `${v.toFixed(2)}m` : v.toFixed(2);
  };
  const valueTicks = Array.from({ length: 4 }, (_, i) => minV + ((maxV - minV) * i) / 3);

  const series = comparable.map((tr, i) => {
    const pts = tr.history.map((h) => ({
      ...h,
      x: xFor(parseDate(h.date)),
      y: yFor(h.markValue ?? minV),
    }));
    return {
      trajectory: tr,
      color: SERIES_COLORS[i % SERIES_COLORS.length],
      dash: SERIES_DASH[i % SERIES_DASH.length],
      pts,
    };
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
          {t("traj.header", { year: currentYear, n: comparable.length })}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-muted-foreground">
            {t(isField ? "traj.higherFarther" : "traj.higherFaster")}
          </div>
          <button
            type="button"
            aria-pressed={tableView}
            onClick={() => setTableView((v) => !v)}
            className="label-caps shrink-0 rounded-sm border border-border px-1.5 py-0.5 text-muted-foreground transition-colors hover:text-terracotta-strong"
          >
            {t(tableView ? "traj.chartView" : "traj.tableView")}
          </button>
        </div>
      </div>

      {tableView ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-[12.5px]">
            <caption className="sr-only">
              {t("traj.caption", { year: currentYear, n: comparable.length })}
            </caption>
            <thead>
              <tr className="label-caps text-muted-foreground">
                <th scope="col" className="py-1 pr-3 font-medium">
                  {t("table.colAthlete")}
                </th>
                <th scope="col" className="py-1 pr-3 font-medium">
                  {t("traj.colDate")}
                </th>
                <th scope="col" className="py-1 pr-3 font-medium">
                  {t("traj.colMark")}
                </th>
                <th scope="col" className="py-1 font-medium">
                  {t("traj.colVenue")}
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
            {/* Horizontal gridlines at real mark values. Without these the
                chart showed shape but not magnitude -- you could see a line
                rising without knowing whether that meant a hundredth or half
                a second. */}
            {valueTicks.map((v, i) => (
              <g key={`grid-${i}`}>
                <line
                  x1={PAD_X}
                  y1={yFor(v)}
                  x2={WIDTH - PAD_RIGHT}
                  y2={yFor(v)}
                  stroke="var(--border)"
                  strokeWidth={1}
                  opacity={0.6}
                />
                <text
                  x={PAD_X - 8}
                  y={yFor(v) + 3.5}
                  textAnchor="end"
                  fontSize={9.5}
                  fill="var(--muted-foreground)"
                >
                  {formatValue(v)}
                </text>
              </g>
            ))}
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
                    strokeLinecap={s.dash ? "butt" : "round"}
                    strokeDasharray={s.dash || undefined}
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
                      /* role="img", not "button". These are focusable so a
                         keyboard user can reach each data point and have
                         onFocus surface the same tooltip a mouse gets on
                         hover -- but nothing activates. Calling them buttons
                         announced an action to screen-reader users that
                         Enter and Space do not perform. They are labelled
                         graphics, and the label is the reading of the point.
                         The focus ring is unaffected: styles.css targets
                         [tabindex]:not([tabindex="-1"]), not the role. */
                      role="img"
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
            {/* Swatch shows the series' dash signature, not just its hue, so
                the legend still identifies each line without colour. */}
            <svg width="18" height="8" viewBox="0 0 18 8" aria-hidden="true" className="shrink-0">
              <line
                x1="0"
                y1="4"
                x2="18"
                y2="4"
                stroke={s.color}
                strokeWidth={2.5}
                strokeDasharray={s.dash || undefined}
                strokeLinecap={s.dash ? "butt" : "round"}
              />
            </svg>
            {s.trajectory.name}
          </Link>
        ))}
      </div>
      {excluded.length > 0 && (
        <div className="mt-2 text-[11px] text-muted-foreground/85">
          {t(excluded.length === 1 ? "traj.excludedOne" : "traj.excludedMany", {
            names: excluded.map((tr) => tr.name).join(", "),
            year: currentYear,
          })}
        </div>
      )}
    </div>
  );
}
