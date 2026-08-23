/** A quieter cousin of the landing page's TrackCircuit: not the full
 * animated stadium, just a sweeping curve in the corner of the viewport --
 * requested directly by the user for the app shell ("add an illustration
 * of a curve, like a track curve, so it doesn't feel bland"). Built from
 * concentric circles whose centers sit outside the SVG's own viewBox, so
 * the visible slice naturally reads as a track's corner curve without
 * hand-computing arc paths. Purely decorative, aria-hidden, static (no
 * motion -- the animated marker is the landing hero's thing specifically,
 * this is meant to sit quietly behind page content). */
const CENTER_X = 620;
const CENTER_Y = 620;
const RADII = [560, 508, 456, 404];

export function TrackCurveDecoration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {RADII.map((r, i) => (
        <circle
          key={r}
          cx={CENTER_X}
          cy={CENTER_Y}
          r={r}
          fill="none"
          stroke={i === 0 ? "var(--gold-light)" : "white"}
          strokeOpacity={i === 0 ? 0.16 : 0.08}
          strokeWidth={2}
        />
      ))}
    </svg>
  );
}
