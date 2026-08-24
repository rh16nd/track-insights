import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { TopNav } from "./topnav";
import { TrackCurveDecoration } from "./track-curve";
import type { MeetStatus } from "@/lib/dl-data";

export const dotClass: Record<MeetStatus, string> = {
  done: "bg-muted-foreground/40",
  next: "bg-terracotta",
  upcoming: "bg-border",
  final: "bg-gold",
};

export const badgeClass: Record<MeetStatus, string> = {
  done: "bg-secondary text-muted-foreground",
  next: "bg-terracotta/10 text-terracotta-strong",
  upcoming: "bg-secondary text-foreground/70",
  final: "bg-gold/15 text-gold-strong",
};

export function Shell({
  title,
  children,
  lastUpdated,
  daysToFinal,
  hero,
  eyebrow,
  description,
}: {
  title: string;
  children: ReactNode;
  lastUpdated?: string | undefined;
  daysToFinal?: number | undefined;
  /** Replaces the plain title with a custom banner (currently just
   * Dashboard's track-surface hero) -- `title` is still passed for the
   * document/route title, it just isn't rendered as the visible `<h1>`. */
  hero?: ReactNode;
  /** Small caps line above the page title, on the canvas. */
  eyebrow?: string | undefined;
  /** One-line explanation under the page title. Supplying this (or
   * `eyebrow`) switches the header from the old bordered title card to the
   * on-canvas treatment: the Dashboard earns a full banner because it IS an
   * overview, but on a browsing page a tall filled box just repeats a shape
   * and pushes the actual content down. Text sits directly on the canvas
   * (white measures 5.29:1 there, verified). */
  description?: string | undefined;
}) {
  const hasPageHeader = Boolean(eyebrow || description);
  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="ambient-glow ambient-grain pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      />
      <TrackCurveDecoration className="pointer-events-none fixed bottom-0 right-0 z-0 h-[65vh] w-[65vh] opacity-80" />
      <div className="relative z-10">
        <TopNav lastUpdated={lastUpdated} daysToFinal={daysToFinal} />
        <main className="mx-auto max-w-[1600px] px-6 pb-14 pt-8 sm:px-8 lg:px-12">
          {hero ??
            (hasPageHeader ? (
              <div className="pb-1 pt-1">
                {eyebrow && (
                  <div className="flex items-center gap-2">
                    <span className="size-[7px] shrink-0 rounded-full bg-gold-light" />
                    {/* /75 measured 3.75:1 on the canvas — under the 4.5
                        floor for 11px text. /92 clears it. */}
                    <span className="label-caps text-white/92">{eyebrow}</span>
                  </div>
                )}
                <h1
                  className="mt-2 text-[30px] font-bold tracking-tight text-white sm:text-[38px]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h1>
                {description && (
                  <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-white/90">
                    {description}
                  </p>
                )}
              </div>
            ) : (
              <div className="card-shadow card-surface rounded-[18px] bg-card px-5 py-4">
                <h1 className="text-[20px] font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
              </div>
            ))}
          <div className={hasPageHeader ? "mt-5" : "mt-6"}>{children}</div>
        </main>
      </div>
    </div>
  );
}

/** Replaces the old 🥇🥈🥉🏅 emoji rank markers -- same podium palette as the
 * logo mark (gold = 1st, terracotta = 2nd, brick = 3rd), a real UI element
 * instead of a font-dependent emoji glyph. The rank>3 tier uses a fixed
 * neutral gray + white text (self-contained badge, independent of the page
 * theme) rather than --muted-foreground, which is a text-only token, not
 * meant as a badge background. */
export function RankBadge({ rank, className = "" }: { rank: number; className?: string }) {
  const tier =
    rank === 1
      ? "bg-gold-strong text-primary-foreground"
      : rank === 2
        ? "bg-terracotta text-primary-foreground"
        : rank === 3
          ? "bg-brick text-primary-foreground"
          : // Darkened from oklch(0.55 0 0) (measured ~2.9:1 against white text,
            // failing the 4.5:1 floor for this bold-but-not-"large" 11px badge
            // number, 2026-08-24 critique) -- 0.4 clears it with margin.
            "bg-[oklch(0.4_0_0)] text-white";
  return (
    <span
      className={`nums flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${tier} ${className}`}
    >
      {rank}
    </span>
  );
}

/** Loading placeholder shaped like the panel it replaces, so the page keeps
 * its real layout instead of collapsing to a centered "Loading..." box and
 * then jumping when data lands. Reuses `skeleton-pulse` (opacity-only, so it
 * works on any surface) over the dark foreground at low alpha, which reads as
 * a soft gray on the cream card. Deliberately shows NO numbers -- nothing
 * true is known yet. */
export function PanelSkeleton({
  title,
  rows = 5,
  className = "",
}: {
  title?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <section
      className={`card-shadow card-surface rounded-[18px] bg-card ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="px-6 pt-5">
        {title ? (
          <h2 className="label-caps text-muted-foreground">{title}</h2>
        ) : (
          <span className="skeleton-pulse block h-2.5 w-32 rounded-full bg-foreground" />
        )}
        <span className="sr-only">Loading…</span>
      </div>
      <div className="space-y-4 px-6 pb-6 pt-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="skeleton-pulse size-6 shrink-0 rounded-full bg-foreground" />
            <span
              className="skeleton-pulse h-3 rounded-full bg-foreground"
              style={{ width: `${38 + ((i * 13) % 26)}%` }}
            />
            <span className="skeleton-pulse ml-auto h-3 w-16 shrink-0 rounded-full bg-foreground" />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Error state that keeps the page's own shell/header rather than replacing
 * the whole page with a red box. */
export function ErrorPanel({
  message,
  hint,
  title = "Could not load predictions",
}: {
  message: string;
  hint?: ReactNode;
  title?: string;
}) {
  return (
    <section className="card-shadow card-surface rounded-[18px] bg-card p-6">
      <div className="text-[14px] font-semibold text-destructive">{title}</div>
      <p className="mt-1 text-[13.5px] text-foreground">{message}</p>
      <p className="mt-2 text-[12.5px] text-muted-foreground">
        {hint ?? (
          <>
            Make sure <code className="nums">python api.py</code> is running in your
            athletics-predictor folder.
          </>
        )}
      </p>
    </section>
  );
}

/** Athlete initials in a brand-gradient disc. Exists because RankBadge was
 * being used in places where its numbering was actively misleading: the
 * Dashboard's "Top predicted winners" list holds ONE athlete per discipline,
 * so a podium-coloured 1/2/3 implied those six were racing each other for a
 * podium they aren't. Position in the list already conveys the ordering, so
 * the marker only needs to identify the athlete. Reported by the user, not
 * inferred. */
export function AthleteAvatar({
  name,
  size = "sm",
  highlight = false,
  className = "",
}: {
  name: string;
  size?: "sm" | "lg";
  highlight?: boolean;
  className?: string;
}) {
  const words = name.split(" ").filter(Boolean);
  const initials =
    words.length === 1
      ? words[0]!.slice(0, 2).toUpperCase()
      : (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase();
  const box = size === "lg" ? "size-10 text-[13px]" : "size-6 text-[9.5px]";
  // The highlight (top pick) disc stays in the light-gold range and carries
  // DARK initials. White-on-gold was measured at 1.9:1 against the light end
  // of the gradient — a real AA failure — and darkening the gold enough to
  // rescue white text would have made it indistinguishable from the standard
  // terracotta disc. Dark-on-gold measures ~8:1 and reads like a medal.
  const tone = highlight
    ? "bg-[linear-gradient(135deg,var(--gold-light),oklch(0.72_0.13_66))] text-foreground"
    : "bg-[linear-gradient(135deg,var(--terracotta),var(--brick))] text-white";
  return (
    <span
      aria-hidden="true"
      className={`nums flex shrink-0 items-center justify-center rounded-full font-semibold ${box} ${tone} ${className}`}
    >
      {initials}
    </span>
  );
}

/** Every probability/percentage meter in the app (discipline-table rows,
 * dashboard's top winners, season progress, projections' contenders and
 * confidence list) used to be its own hand-rolled flat-terracotta sliver --
 * the single most repeated "generic dashboard" element per the 2026-08-23
 * critique. One shared bar: thicker, rounded, brand gradient fill (so a
 * short bar reads mostly terracotta and a near-full bar sweeps into gold --
 * the color itself hints at magnitude), animated on value change. */
export function ProbabilityBar({
  value,
  className = "",
  trackHeight = "h-2",
  trackClass = "bg-secondary",
}: {
  value: number;
  className?: string;
  trackHeight?: string;
  /** Track colour. Defaults to the app's light `--secondary`, which is right
   * on the cream card surfaces. The landing page passes its own translucent
   * white token instead -- `--secondary` is a light cream slab that would
   * glare against that dark tinted-glass card. A prop rather than an appended
   * class because two Tailwind `bg-*` utilities have equal specificity, so
   * which one wins depends on stylesheet order, not attribute order. */
  trackClass?: string;
}) {
  return (
    <div
      className={`w-full min-w-[32px] overflow-hidden rounded-full ${trackClass} ${trackHeight} ${className}`}
    >
      {/* transform: scaleX, not width -- animating width triggers layout on
          every frame (flagged live across all 7 bars on this page by the
          2026-08-24 critique's detector pass); scaleX is compositor-only,
          same fix already used by the landing page's .prob-fill. */}
      <div
        className="h-full origin-left rounded-full transition-transform duration-500 ease-out"
        style={{
          transform: `scaleX(${Math.max(0, Math.min(100, value)) / 100})`,
          backgroundImage: "linear-gradient(90deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
        }}
      />
    </div>
  );
}

/** The reason string comes straight from a scraped news/meet-recap match, not
 * a structured injury description -- it can be as generic as an article
 * headline ("Full Lausanne Diamond League Results..."). Framed here as
 * "flagged from" + the raw text, so the badge doesn't imply more diagnostic
 * detail than the scraper actually has. */
export function WatchBadge({
  reason,
  url,
  className = "",
  tone = "light",
}: {
  reason: string | null;
  url: string | null;
  className?: string;
  /** "light" is the app's cream card surface. "dark" is the landing page's
   * tinted-glass card, where the standard `--destructive` (oklch L=0.55) sits
   * almost on top of the surface's own lightness: measured 1.38:1 against the
   * real composited card, i.e. effectively invisible. Both tones below were
   * measured on that actual surface via canvas rather than eyeballed -- the
   * first dark attempt (L=0.88 text on a 0.22 fill) still only reached
   * 3.84:1. These values give 4.7:1, clearing the 4.5 floor for this small
   * bold label with a little margin. */
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const detail = reason
    ? `Flagged from: ${reason}`
    : "Recent injury or DNF mention — flagged for review";
  const toneClass =
    tone === "dark"
      ? "bg-[oklch(0.7_0.19_27_/_0.16)] text-[oklch(0.93_0.09_27)]"
      : "bg-destructive/10 text-destructive";
  const badgeClassName = `label-caps shrink-0 rounded-sm px-1.5 py-1 ${toneClass} ${className}`;
  const popoverId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  // Real bug caught by the 2026-08-24 critique: an unconditional onBlur
  // closed the popover the instant focus left the trigger button -- including
  // a Tab press toward the "View source" link *inside* the popover, or a
  // mousedown on it -- so keyboard/screen-reader users (exactly who this
  // evidence link matters most to) could never actually reach it. Closes on
  // outside click/focus and Escape instead, which lets focus move into the
  // popover itself.
  useEffect(() => {
    if (!open) return;
    function handlePointer(e: PointerEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleFocus(e: FocusEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      <button
        type="button"
        title={detail}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={`${badgeClassName} transition-[background-color,transform] duration-150 hover:bg-destructive/20 active:scale-90`}
      >
        Watch
      </button>
      {open && (
        <span
          id={popoverId}
          role="group"
          aria-label="Injury watch evidence"
          className="nums absolute left-0 top-full z-30 mt-1.5 w-64 max-w-[80vw] origin-top-left animate-[popover-in_140ms_ease-out] rounded-md border border-border bg-popover p-2.5 text-[12px] font-normal leading-snug text-popover-foreground shadow-lg"
        >
          {detail}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 block text-terracotta-strong hover:underline"
            >
              View source →
            </a>
          )}
        </span>
      )}
    </span>
  );
}

/** A soft border + drop shadow, reintroduced 2026-08-23: the earlier
 * "de-boxing" pass (original light theme) dropped Panel's border in favor
 * of a bg-card-vs-bg-background tone difference alone. That held up while
 * both were dark tones close in lightness, but now --card (near-white) and
 * --background (a saturated medium terracotta) are worlds apart -- panels
 * need to read as light surfaces floating on a colored canvas, which is a
 * drop shadow's job, not an inset highlight's (an inset white highlight is
 * for simulating a glass edge on a DARK card; invisible on a near-white
 * one). Shadow is tinted toward --foreground's hue, not pure black. */
export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  /** Optional clarifying line under the title -- added so panels whose
   * meaning isn't self-evident from a 3-word heading (e.g. what a list is
   * actually sorted by) can say so, rather than leaving the reader to
   * infer it from the data. */
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card-shadow card-surface rounded-[18px] bg-card ${className}`}>
      <div className="flex items-center justify-between px-6 pt-5">
        <div className="min-w-0">
          <h2 className="label-caps text-muted-foreground">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="px-6 pb-6 pt-4">{children}</div>
    </section>
  );
}
