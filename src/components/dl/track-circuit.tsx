/** A literal 400m running-track outline (two straights, two curves -- a real
 * stadium shape, not a plain oval) used as an ambient background layer in
 * the landing hero, with one lane carrying a small animated marker that
 * continuously laps the circuit. Requested directly by the user ("make the
 * landing page feel more track and field... a track circuit that's
 * animated"). Pure inline SVG + CSS `offset-path` -- no animation library,
 * consistent with this project's existing no-icon-library-dependency
 * convention (see index.tsx's hand-drawn Icon component). Decorative and
 * `aria-hidden`; the marker's motion freezes under `prefers-reduced-motion`
 * via the CSS in styles.css rather than JS, so there's no flash-of-motion
 * before a media-query listener could attach. */

const START_X = 170;
const END_X = 730;
const OUTER_R = 150;
const LANE_GAP = 15;
const LANE_COUNT = 5;

function laneD(index: number) {
  const r = OUTER_R - index * LANE_GAP;
  const top = 20 + index * LANE_GAP;
  const bottom = 320 - index * LANE_GAP;
  return `M${START_X},${top} L${END_X},${top} A${r},${r} 0 0 1 ${END_X},${bottom} L${START_X},${bottom} A${r},${r} 0 0 1 ${START_X},${top} Z`;
}

export function TrackCircuit({ className = "" }: { className?: string }) {
  const lanes = Array.from({ length: LANE_COUNT }, (_, i) => laneD(i));
  const markerLaneD = laneD(0);

  return (
    <svg
      viewBox="0 0 900 340"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Opacities are set so the circuit reads as the picture in the hero
          rather than as noise under it. At the original 0.07 the lanes
          resolved to roughly a 6% lift over the terracotta canvas -- close
          enough to invisible that the hero looked like a flat fill, which
          is exactly what it was reported as. 0.2 puts them at about a 20%
          lift, matching the design reference. */}
      {lanes.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={i === 0 ? "var(--gold)" : "white"}
          strokeOpacity={i === 0 ? 0.32 : 0.2}
          strokeWidth={1.5}
        />
      ))}
      {/* Straight-line "start" markers across all lanes, like real track
          start/finish lines -- a small concrete detail, not just abstract
          ovals. */}
      <line
        x1={START_X + 40}
        y1={20}
        x2={START_X + 40}
        y2={320}
        stroke="white"
        strokeOpacity={0.22}
        strokeWidth={1.5}
        strokeDasharray="3 5"
      />
      <g className="track-circuit-marker" style={{ offsetPath: `path('${markerLaneD}')` }}>
        <circle r={5} fill="var(--gold)" opacity={0.9} />
        <circle r={9} fill="var(--gold)" opacity={0.18} />
      </g>
    </svg>
  );
}
