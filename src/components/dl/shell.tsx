import { useState, type ReactNode } from "react";
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
}: {
  title: string;
  children: ReactNode;
  lastUpdated?: string;
  daysToFinal?: number;
  /** Replaces the plain title with a custom banner (currently just
   * Dashboard's track-surface hero) -- `title` is still passed for the
   * document/route title, it just isn't rendered as the visible `<h1>`. */
  hero?: ReactNode;
}) {
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
          {hero ?? (
            <div className="card-shadow rounded-xl border border-border bg-card px-5 py-4">
              <h1 className="text-[20px] font-semibold tracking-tight text-foreground">{title}</h1>
            </div>
          )}
          <div className="mt-6">{children}</div>
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
          : "bg-[oklch(0.55_0_0)] text-white";
  return (
    <span
      className={`nums flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${tier} ${className}`}
    >
      {rank}
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
}: {
  value: number;
  className?: string;
  trackHeight?: string;
}) {
  return (
    <div
      className={`w-full min-w-[32px] overflow-hidden rounded-full bg-secondary ${trackHeight} ${className}`}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
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
}: {
  reason: string | null;
  url: string | null;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const detail = reason
    ? `Flagged from: ${reason}`
    : "Recent injury or DNF mention — flagged for review";
  const badgeClassName = `label-caps shrink-0 rounded-sm bg-destructive/10 px-1.5 py-1 text-destructive ${className}`;

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        title={detail}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className={`${badgeClassName} hover:bg-destructive/20 transition-colors`}
      >
        Watch
      </button>
      {open && (
        <span
          role="status"
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
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card-shadow rounded-xl border border-border bg-card ${className}`}>
      <div className="flex items-center justify-between px-5 pt-4">
        <h2 className="label-caps text-muted-foreground">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
