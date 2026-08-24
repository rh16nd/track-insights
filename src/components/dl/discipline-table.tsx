import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import type { Discipline } from "@/lib/dl-data";
import { Panel, ProbabilityBar, RankBadge, WatchBadge } from "./shell";

/** The active discipline tab is controlled by the caller (track.tsx/
 * field.tsx put it in the URL's search params, not local state) so that
 * clicking into an athlete and hitting "back" restores the exact tab the
 * user was browsing, not just the page with its default tab reset. */
export function DisciplineTable({
  disciplines,
  activeId,
  onActiveChange,
}: {
  disciplines: Discipline[];
  activeId: string;
  onActiveChange: (id: string) => void;
}) {
  const current = disciplines.find((d) => d.id === activeId) ?? disciplines[0];

  if (!current) return null;

  return (
    <>
      {/* Mobile-only: a real <select> instead of the pill wall below --
       * same fix Projections' discipline picker needed (impeccable critique
       * skill, 2026-08-24): a flat wrapped list of pills at a real 44px
       * touch-target size gets tall fast (measured live: 358px for Track's
       * 18 disciplines at the old 32.75px pill height). This is shared by
       * both Track and Field, so one fix covers both pages. */}
      <div className="sm:hidden">
        {/* --muted-foreground is tuned for the light CARD surface, but this
            label sits directly on the colored canvas, where it measured
            1.62:1. On-canvas text has to be light, not dark. */}
        <label className="label-caps mb-1.5 block text-white/90" htmlFor="discipline-select">
          Discipline
        </label>
        <select
          id="discipline-select"
          value={current.id}
          onChange={(e) => onActiveChange(e.target.value)}
          className="w-full rounded-md border border-border bg-card px-3 py-3 text-[13.5px] font-medium text-foreground"
        >
          {disciplines.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden flex-wrap gap-2 sm:flex">
        {disciplines.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onActiveChange(d.id)}
            className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
              d.id === current?.id
                ? "border-transparent text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
            }`}
            style={
              d.id === current?.id
                ? {
                    backgroundImage:
                      "linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
                  }
                : undefined
            }
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* The "#" column ranks by season-best mark, which is NOT the same
          ordering as win probability (e.g. Men's 100m: #1 Lyles 9.79 at 16%
          sits above #2 Seville 9.82 at 27%). Stating that outright, since
          the two columns otherwise look like they should agree and don't. */}
      <Panel
        title={`Projected top 8 — ${current.label}`}
        subtitle="Ranked by season best. Win probability is the model's separate call and can disagree."
        className="mt-4"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="label-caps text-muted-foreground">
                <th className="w-10 pb-3 text-left font-semibold">#</th>
                <th className="pb-3 pl-3 text-left font-semibold">Athlete</th>
                <th className="w-16 pb-3 pl-4 text-left font-semibold">Nat</th>
                <th className="w-20 pb-3 pl-4 text-left font-semibold">Qualified</th>
                <th className="w-28 pb-3 pl-6 text-right font-semibold">Projected</th>
                <th className="w-56 pb-3 pl-8 text-right font-semibold">Win probability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {current.athletes.map((a, i) => (
                <tr
                  key={a.name}
                  className="stagger-item transition-colors hover:bg-secondary/40"
                  style={{ "--stagger-i": i } as CSSProperties}
                >
                  <td className="py-3 pr-2">
                    <RankBadge rank={a.rank} className="size-6" />
                  </td>
                  <td className="py-3 pl-3 text-[13.5px] font-medium text-foreground">
                    <Link
                      to="/athlete/$discKey/$name"
                      params={{ discKey: current.id, name: a.name }}
                      className="hover:text-terracotta-strong hover:underline transition-colors"
                    >
                      {a.name}
                    </Link>
                    {a.injuryWatch && (
                      <WatchBadge reason={a.injuryReason} url={a.injuryUrl} className="ml-2" />
                    )}
                  </td>
                  <td className="nums py-3 pl-4 text-[12px] text-muted-foreground">{a.nat}</td>
                  <td className="py-3 pl-4">
                    {/* "Q" per the user's preference over a check glyph. It
                        previously rendered at 10px with heavy label-caps
                        tracking, where it was easy to misread as a zero — so
                        it's set larger, at normal tracking, in the display
                        face (whose Q has a distinct tail). The column header
                        spells out "Qualified" and the sr-only text carries
                        the full definition. */}
                    {a.qualified && (
                      <span
                        title="Confirmed in World Athletics' own 2026 Diamond League standings for this discipline"
                        className="inline-flex size-6 items-center justify-center rounded-md bg-terracotta/12 text-[13px] font-semibold leading-none text-terracotta-strong"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Q
                        <span className="sr-only">
                          ualified — confirmed in World Athletics&apos; 2026 Diamond League
                          standings
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="nums py-3 pl-6 text-right text-[13.5px] font-medium text-foreground">
                    {a.mark}
                  </td>
                  <td className="py-3 pl-8">
                    <div className="flex items-center justify-end gap-3">
                      <ProbabilityBar value={a.prob} className="w-28" trackHeight="h-1.5" />
                      <span className="nums w-9 text-right text-[12.5px] font-semibold text-foreground">
                        {a.prob}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
