/* PodiumCall's mark: a classic 2-1-3 podium (tallest bar in gold, the
   "winner" color already used elsewhere for rank #1 / the Final meet
   status) sitting on a shallow track-lane arc, tying the brand's two real
   ideas together -- predicting who's on the podium, built on a track &
   field identity -- rather than a generic abstract glyph. Uses the same
   --terracotta/--gold/--brick tokens as the rest of the app, so it stays
   in sync if the palette ever changes. */
export function PodiumCallMark({
  className = "size-6",
  variant = "brand",
}: {
  className?: string;
  /** "brand" (terracotta/gold/brick) reads fine on a plain dark or light
   * surface; "light" (white, opacity-differentiated) is for the sidebar's
   * own brick-toned track-surface texture, where the brand colors would
   * blend into a same-hue background instead of standing out. */
  variant?: "brand" | "light";
}) {
  const fills =
    variant === "light"
      ? { a: "rgba(255,255,255,0.65)", b: "#fff", c: "rgba(255,255,255,0.45)" }
      : { a: "var(--terracotta)", b: "var(--gold)", c: "var(--brick)" };
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M4 33 Q20 29 36 33"
        stroke={fills.a}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <rect x="5" y="15" width="9" height="16" rx="2" fill={fills.a} />
      <rect x="15.5" y="9" width="9" height="22" rx="2" fill={fills.b} />
      <rect x="26" y="19" width="9" height="12" rx="2" fill={fills.c} />
    </svg>
  );
}

export function PodiumCallLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <PodiumCallMark />
      <span className="text-[16px] font-semibold leading-none">PodiumCall</span>
    </div>
  );
}
