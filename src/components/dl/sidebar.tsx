import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const nav = [
  {
    section: "Overview",
    items: [
      { to: "/", label: "Dashboard" },
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
          <div className="mt-1 text-[17px] font-semibold leading-tight text-white">
            2026 DL
            <br />
            Predictor
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
                    activeOptions={{ exact: item.to === "/" }}
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

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex w-full items-center justify-between rounded-md border border-white/25 px-2.5 py-2 text-[12px] font-medium text-white/85 transition-colors hover:bg-white/10"
        >
          Refresh predictions
          <ArrowUpRight className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}
