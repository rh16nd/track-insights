/** Circular meter for a single ratio (podium chance) -- per the dataviz
 * skill's Meter spec: fill carries the value, the unfilled track is a
 * lighter/neutral step so state reads across the whole ring. Same
 * terracotta->gold accent ProbabilityBar already uses elsewhere in this
 * app, just in radial form instead of linear -- one consistent "this is
 * the model's confidence" visual language, not a second competing style. */
export function RadialMeter({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  dark = false,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  /** Set when placed on the app's dark hero surfaces (track-surface +
   * overlay) instead of a light card -- swaps text/track to the same
   * white-on-dark tokens the rest of each hero already uses. */
  dark?: boolean;
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);
  const gradientId = "radial-meter-gradient";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--terracotta)" />
            <stop offset="100%" stopColor="var(--gold-strong)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={dark ? "rgba(255,255,255,0.18)" : "var(--border)"}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 500ms cubic-bezier(0.23, 1, 0.32, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`nums text-[26px] font-semibold leading-none ${dark ? "text-white" : "text-foreground"}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {Math.round(value)}%
        </span>
        {label && (
          <span className={`label-caps mt-1 ${dark ? "text-white/70" : "text-muted-foreground"}`}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
