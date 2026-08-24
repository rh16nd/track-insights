import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { PodiumCallMark } from "./logo";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/track", label: "Track" },
  { to: "/field", label: "Field" },
  { to: "/schedule", label: "Schedule" },
  { to: "/projections", label: "Projections" },
] as const;

/** Replaced the old fixed left Sidebar per the user's request: the same
 * five sections now live as a single horizontal bar on top, so pages get
 * the full width instead of losing 200px to a permanent side panel.
 *
 * 2026-08-23: dropped the brick/lane track-surface texture that used to
 * fill this bar on every single page -- per the user, it read as heavy,
 * repetitive chrome once it appeared on all six routes rather than a
 * distinctive brand moment. The texture itself didn't disappear -- see
 * dashboard.tsx, which now gets its own hero banner built on it, a more
 * deliberate use of a strong asset instead of wallpaper.
 *
 * 2026-08-23, later same day: switched from a translucent DARK glass bar
 * (`bg-background/85`) to a translucent LIGHT one (`bg-card/90`) when
 * --background became a genuinely medium, saturated color rather than a
 * near-black one -- nav text (--muted-foreground/--foreground) is tuned
 * for card surfaces now, and a medium-terracotta-tinted glass bar can't
 * host it at readable contrast. */
export function TopNav({
  lastUpdated,
  daysToFinal,
}: {
  lastUpdated?: string | undefined;
  daysToFinal?: number | undefined;
}) {
  // Real bug caught via the impeccable critique skill's live DOM inspection
  // (2026-08-24): on mobile this nav is horizontally scrollable
  // (nav-scroll-mask), and on initial load it sits at scrollLeft 0 -- so
  // whichever page is actually active can load entirely outside the
  // visible window (confirmed live: Projections, the rightmost item, was
  // fully off-screen with no way to tell which page you were even on).
  // Scroll the current page's own link into view on every route change.
  const activeRef = useRef<HTMLAnchorElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="grid h-16 grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-2 px-6 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 justify-self-start">
          <PodiumCallMark className="size-6" />
          <span className="hidden text-[15px] font-semibold text-foreground sm:block">
            PodiumCall
          </span>
        </Link>

        <nav className="nav-scroll-mask flex min-w-0 items-center justify-center gap-1 overflow-x-auto">
          {nav.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                ref={isActive ? activeRef : undefined}
                className="label-caps whitespace-nowrap rounded-full px-3.5 py-3.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:py-2"
                activeProps={{ className: "!bg-secondary !text-foreground" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4 justify-self-end">
          {lastUpdated && (
            <span className="nums hidden text-[11.5px] text-muted-foreground md:block">
              Updated {lastUpdated} · {daysToFinal}d to Brussels
            </span>
          )}
          <span className="label-caps flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1.5 text-foreground">
            <span className="size-1.5 rounded-full bg-gold" />
            Live
          </span>
        </div>
      </div>
    </header>
  );
}
