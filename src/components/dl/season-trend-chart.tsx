import { useState } from "react";
import type { MeetMark } from "@/lib/dl-data";

const WIDTH = 600;
const HEIGHT = 200;
const PAD_X = 28;
const PAD_TOP = 28;
const PAD_BOTTOM = 32;

/** Real per-meet marks only -- no interpolation between them. With 2-5 real
 * points (this data slice is DL circuit + major meets for one season, not
 * an athlete's full global race log -- see api.py's load_athlete_history),
 * a smooth "trend line" implying continuous progression between meets would
 * misrepresent what's actually known. The line here only connects real,
 * already-plotted points; nothing is invented between them. */
export function SeasonTrendChart({ history, year }: { history: MeetMark[]; year: number | null }) {
  const [hover, setHover] = useState<number | null>(null);

  const first = history[0];
  if (!first) return null;

  const isField = first.mark.endsWith("m");
  const values = history.map((h) => h.markValue ?? 0);
  const min = Math.min(...values);
  const max = Math.min(...values) === Math.max(...values) ? min + 1 : Math.max(...values);
  const pad = (max - min) * 0.3 || 1;
  const domainMin = min - pad;
  const domainMax = max + pad;

  const n = history.length;
  const xFor = (i: number) => (n === 1 ? WIDTH / 2 : PAD_X + (i / (n - 1)) * (WIDTH - PAD_X * 2));
  const yFor = (v: number) =>
    HEIGHT -
    PAD_BOTTOM -
    ((v - domainMin) / (domainMax - domainMin)) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

  const points = history.map((h, i) => ({ ...h, x: xFor(i), y: yFor(h.markValue ?? min) }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const baseline = HEIGHT - PAD_BOTTOM;
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPath =
    firstPoint && lastPoint
      ? `${path} L ${lastPoint.x} ${baseline} L ${firstPoint.x} ${baseline} Z`
      : "";
  const bestIndex = values.indexOf(isField ? Math.max(...values) : Math.min(...values));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="label-caps text-muted-foreground">{year ?? "Last"} season form</div>
        <div className="text-[11px] text-muted-foreground">
          {isField ? "Higher is farther" : "Lower is faster"}
        </div>
      </div>
      <div className="relative mt-2">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ height: "auto" }}>
          <line
            x1={PAD_X}
            y1={HEIGHT - PAD_BOTTOM}
            x2={WIDTH - PAD_X}
            y2={HEIGHT - PAD_BOTTOM}
            stroke="var(--border)"
            strokeWidth={1}
          />
          {areaPath && <path d={areaPath} fill="var(--terracotta)" opacity={0.1} stroke="none" />}
          <path
            d={path}
            fill="none"
            stroke="var(--terracotta)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={i === bestIndex ? 6 : 5}
                fill={i === bestIndex ? "var(--gold-strong)" : "var(--terracotta)"}
                stroke="var(--card)"
                strokeWidth={2}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                className="nums"
                fontSize={11}
                fill="var(--foreground)"
                fontWeight={i === bestIndex ? 600 : 400}
              >
                {p.mark}
              </text>
              <text
                x={p.x}
                y={HEIGHT - PAD_BOTTOM + 18}
                textAnchor="middle"
                fontSize={10}
                fill="var(--muted-foreground)"
              >
                {p.date.replace(/ \d{4}$/, "")}
              </text>
            </g>
          ))}
        </svg>
        {hover !== null && points[hover] && (
          <div
            className="card-shadow pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-border bg-popover px-2.5 py-1.5 text-[11px] text-popover-foreground"
            style={{
              left: `${(points[hover].x / WIDTH) * 100}%`,
              top: `${(points[hover].y / HEIGHT) * 100 - 18}%`,
            }}
          >
            <div className="font-medium">{points[hover].mark}</div>
            <div className="text-muted-foreground">{points[hover].venue}</div>
            {points[hover].resultsScore != null && (
              <div className="text-muted-foreground">{points[hover].resultsScore} pts</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
