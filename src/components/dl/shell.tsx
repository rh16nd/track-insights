import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
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
      <Sidebar />
      <div className="pl-[200px]">
        <header className="fixed inset-x-0 left-[200px] top-0 z-10 flex h-[72px] items-center justify-between border-b border-border bg-background px-8">
          <div>
            <h1 className="text-[19px] font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="nums mt-0.5 text-[12px] text-muted-foreground">
              {lastUpdated
                ? `Last updated ${lastUpdated} · ${daysToFinal} days to the Brussels final`
                : "Loading live data…"}
            </p>
          </div>
          <span className="label-caps flex items-center gap-1.5 rounded-md bg-terracotta px-2.5 py-1.5 text-primary-foreground">
            <span className="size-1.5 rounded-full bg-primary-foreground" />
            Live season
          </span>
        </header>
        <main className="px-8 pb-14 pt-[96px]">{children}</main>
      </div>
    </div>
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
    <section className={`rounded-lg border border-border bg-card ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="label-caps text-muted-foreground">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
