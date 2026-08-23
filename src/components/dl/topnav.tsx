import { Link } from "@tanstack/react-router";
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
 * the full width instead of losing 200px to a permanent side panel. Reuses
 * the sidebar's track-surface texture (brick + lane lines) as a strip
 * instead of a full-height panel -- same brand asset, different shape. */
export function TopNav({
  lastUpdated,
  daysToFinal,
}: {
  lastUpdated?: string | undefined;
  daysToFinal?: number | undefined;
}) {
  return (
    <header className="track-surface sticky top-0 z-20">
      <div className="relative flex h-16 items-center gap-1 px-6 sm:px-8">
        <Link to="/" className="mr-6 flex shrink-0 items-center gap-2">
          <PodiumCallMark variant="light" className="size-6" />
          <span className="hidden text-[15px] font-semibold text-white sm:block">PodiumCall</span>
        </Link>

        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="label-caps whitespace-nowrap rounded-full px-3.5 py-2 text-white/65 transition-colors hover:bg-white/10 hover:text-white"
              activeProps={{ className: "!bg-white/15 !text-white" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-4 pl-4">
          {lastUpdated && (
            <span className="nums hidden text-[11.5px] text-white/55 md:block">
              Updated {lastUpdated} · {daysToFinal}d to Brussels
            </span>
          )}
          <span className="label-caps flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1.5 text-white">
            <span className="size-1.5 rounded-full bg-gold" />
            Live
          </span>
        </div>
      </div>
    </header>
  );
}
