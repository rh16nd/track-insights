import type { ReactNode } from "react";
import { TopNav } from "./topnav";
import type { MeetStatus } from "@/lib/dl-data";

export const dotClass: Record<MeetStatus, string> = {
  done: "bg-muted-foreground/40",
  next: "bg-terracotta",
  upcoming: "bg-border",
  final: "bg-gold",
};

export const badgeClass: Record<MeetStatus, string> = {
  done: "bg-secondary text-muted-foreground",
  next: "bg-terracotta/10 text-terracotta",
  upcoming: "bg-secondary text-foreground/70",
  final: "bg-gold/15 text-gold",
};

export function Shell({
  title,
  children,
  lastUpdated,
  daysToFinal,
}: {
  title: string;
  children: ReactNode;
  lastUpdated?: string;
  daysToFinal?: number;
}) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav lastUpdated={lastUpdated} daysToFinal={daysToFinal} />
      <main className="mx-auto max-w-6xl px-6 pb-14 pt-8 sm:px-8">
        <h1 className="text-[20px] font-semibold tracking-tight text-foreground">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

/** Replaces the old 🥇🥈🥉🏅 emoji rank markers -- same podium palette as the
 * logo mark (gold = 1st, terracotta = 2nd, brick = 3rd), a real UI element
 * instead of a font-dependent emoji glyph. The rank>3 tier deliberately uses
 * a fixed neutral (not --secondary/--muted-foreground) since this component
 * renders on both the light dashboard and the dark landing page, and those
 * tokens carry different, theme-specific values on each. */
export function RankBadge({ rank, className = "" }: { rank: number; className?: string }) {
  const tier =
    rank === 1
      ? "bg-gold text-primary-foreground"
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

export function WatchBadge({
  reason,
  url,
  className = "",
}: {
  reason: string | null;
  url: string | null;
  className?: string;
}) {
  const title = reason ?? "Recent injury or DNF mention — flagged for review";
  const badgeClassName = `label-caps shrink-0 rounded-sm bg-destructive/10 px-1.5 py-1 text-destructive ${className}`;

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className={`${badgeClassName} hover:bg-destructive/20 transition-colors`}
      >
        Watch
      </a>
    );
  }
  return (
    <span title={title} className={badgeClassName}>
      Watch
    </span>
  );
}

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
    <section className={`rounded-xl bg-card ${className}`}>
      <div className="flex items-center justify-between px-5 pt-4">
        <h2 className="label-caps text-muted-foreground">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
