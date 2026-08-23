import { Link } from "@tanstack/react-router";
import { PodiumCallMark } from "./logo";

const nav = [
  {
    section: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/schedule", label: "Schedule" },
    ],
  },
  {
    section: "Predictions",
    items: [
      { to: "/track", label: "Track events" },
      { to: "/field", label: "Field events" },
    ],
  },
  {
    section: "Analysis",
    items: [{ to: "/projections", label: "Projections" }],
  },
] as const;

export function Sidebar() {
  return (
    <aside className="track-surface fixed inset-y-0 left-0 z-20 w-[200px] overflow-hidden">
      {/* lane numbers */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-8 items-center justify-around text-[9px] font-semibold text-white/45">
        {[1, 2, 3, 4, 5, 6, 7].map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      {/* finish line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[76px] h-[6px] bg-white/85" />

      <div className="relative flex h-full flex-col px-4 pb-4 pt-11">
        <div>
          <div className="label-caps text-white/50">Wanda Diamond League</div>
          <div className="mt-1.5 flex items-center gap-2">
            <PodiumCallMark className="size-6" variant="light" />
            <span className="text-[17px] font-semibold leading-tight text-white">PodiumCall</span>
          </div>
        </div>

        <nav className="mt-8 flex-1 space-y-6">
          {nav.map((group) => (
            <div key={group.section}>
              <div className="label-caps mb-2 text-white/40">{group.section}</div>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.to === "/dashboard" }}
                    className="block rounded-sm px-2 py-[7px] text-[13px] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    activeProps={{
                      className: "bg-white/15 !text-white font-medium",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
