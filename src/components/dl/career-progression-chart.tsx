import { useState } from "react";
import type { CareerSeason } from "@/lib/dl-data";

const WIDTH = 600;
const HEIGHT = 190;
const PAD_X = 30;
const PAD_TOP = 26;
const PAD_BOTTOM = 34;

/** Season-by-season bests, the axis this site had no view of. The profile's
 * other chart is one season race by race; this is a career.
 *
 * Same two rules as SeasonTrendChart, for the same reasons:
 *  - Better points UP. Field marks are already bigger-is-better; times are
 *    not, so they are flipped, or an athlete getting faster every year draws
 *    a line that visibly falls.
 *  - Only real, plotted points are connected. A season an athlete did not
 *    contest is a GAP in the x-axis, not an interpolated dot -- the x
 *    position is the real year, so a missing 2021 leaves a visible stride in
 *    the line rather than quietly pretending the years were consecutive.
 */
export function CareerProgressionChart({
  seasons,
  isField,
}: {
  seasons: CareerSeason[];
  isField: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [tableView, setTableView] = useState(false);

  if (seasons.length === 0) return null;

  const values = seasons.map((s) => s.best);
  const min = Math.min(...values);
  const rawMax = Math.max(...values);
  const max = rawMax === min ? min + 1 : rawMax;
  const pad = (max - min) * 0.3 || 1;
  const domainMin = min - pad;
  const domainMax = max + pad;

  const years = seasons.map((s) => s.year);
  const firstYear = Math.min(...years);
  const lastYear = Math.max(...years);
  const span = lastYear - firstYear || 1;

  // x is the real year, not the array index -- see the note above.
  const xFor = (year: number) =>
    seasons.length === 1 ? WIDTH / 2 : PAD_X + ((year - firstYear) / span) * (WIDTH - PAD_X * 2);
  const yFor = (v: number) => {
    const t = (v - domainMin) / (domainMax - domainMin);
    const up = isField ? t : 1 - t;
    return HEIGHT - PAD_BOTTOM - up * (HEIGHT - PAD_TOP - PAD_BOTTOM);
  };

  const points = seasons.map((s) => ({ ...s, x: xFor(s.year), y: yFor(s.best) }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const bestValue = isField ? rawMax : min;
  const bestIndex = values.indexOf(bestValue);
  const totalMarks = seasons.reduce((sum, s) => sum + s.marks, 0);
  const indoorMarks = seasons.reduce((sum, s) => sum + s.indoorMarks, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="label-caps text-muted-foreground">
          {firstYear}–{lastYear} · {totalMarks} marks
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-muted-foreground">
            {isField ? "Higher is farther" : "Higher is faster"}
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
          <table className="w-full min-w-[300px] border-collapse text-left">
            <thead>
              <tr className="label-caps border-b border-border text-muted-foreground">
                <th scope="col" className="pb-2 pr-2 font-semibold">
                  Season
                </th>
                <th scope="col" className="pb-2 pl-3 text-right font-semibold">
                  Best
                </th>
                <th scope="col" className="pb-2 pl-3 text-right font-semibold">
                  Marks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...seasons].reverse().map((s) => (
                <tr key={s.year}>
                  <td className="nums py-2 pr-2 text-[13px] text-foreground">{s.year}</td>
                  <td className="nums py-2 pl-3 text-right text-[13px] font-semibold text-foreground">
                    {s.bestMark}
                  </td>
                  <td className="nums py-2 pl-3 text-right text-[12.5px] text-muted-foreground">
                    {s.marks}
                    {s.indoorMarks > 0 && (
                      <span className="text-muted-foreground"> ({s.indoorMarks} indoor)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="mt-2 w-full"
          role="img"
          aria-label={`Season bests from ${firstYear} to ${lastYear}. ${seasons
            .map((s) => `${s.year}: ${s.bestMark}`)
            .join(", ")}.`}
        >
          <path
            d={path}
            fill="none"
            stroke="var(--terracotta)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p, i) => (
            <g key={p.year}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hover === i ? 6 : i === bestIndex ? 5 : 3.5}
                fill={i === bestIndex ? "var(--gold-strong)" : "var(--terracotta)"}
                stroke="var(--card)"
                strokeWidth={1.5}
                className="transition-[r] duration-150"
              />
              {/* A generous invisible target: the real dots are 3.5px and
                  this chart is read on touch as well as with a mouse. */}
              <circle
                cx={p.x}
                cy={p.y}
                r={16}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
              <text
                x={p.x}
                y={HEIGHT - 12}
                textAnchor="middle"
                className="nums"
                fontSize={11}
                fill="var(--muted-foreground)"
              >
                {p.year}
              </text>
              {(hover === i || i === bestIndex) && (
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  className="nums"
                  fontSize={11.5}
                  fontWeight={600}
                  fill="var(--foreground)"
                >
                  {p.bestMark}
                </text>
              )}
            </g>
          ))}
        </svg>
      )}

      {indoorMarks > 0 && (
        <p className="mt-2 text-[11.5px] leading-snug text-muted-foreground">
          {indoorMarks} of these {totalMarks} marks {indoorMarks === 1 ? "was" : "were"} set
          indoors. They are included — World Athletics ranks them alongside outdoor marks — but a
          season best that came from one is not strictly an outdoor best.
        </p>
      )}
    </div>
  );
}
