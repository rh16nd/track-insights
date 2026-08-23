import { useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import type { Discipline } from "@/lib/dl-data";
import { Panel, ProbabilityBar, RankBadge, WatchBadge } from "./shell";

export function DisciplineTable({ disciplines }: { disciplines: Discipline[] }) {
  const [active, setActive] = useState(disciplines[0]?.id ?? "");
  const current = disciplines.find((d) => d.id === active) ?? disciplines[0];

  if (!current) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {disciplines.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActive(d.id)}
            className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
              d.id === active
                ? "border-transparent text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
            }`}
            style={
              d.id === active
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

      <Panel title={`Projected top 8 — ${current.label}`} className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="label-caps text-muted-foreground">
                <th className="w-10 pb-3 text-left font-semibold">#</th>
                <th className="pb-3 text-left font-semibold">Athlete</th>
                <th className="w-16 pb-3 text-left font-semibold">Nat</th>
                <th className="w-14 pb-3 text-left font-semibold">Q</th>
                <th className="w-28 pb-3 text-right font-semibold">Projected</th>
                <th className="w-52 pb-3 text-right font-semibold">Win probability</th>
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
                  <td className="py-3 text-[13.5px] font-medium text-foreground">
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
                  <td className="nums py-3 text-[12px] text-muted-foreground">{a.nat}</td>
                  <td className="py-3">
                    {a.qualified && (
                      <span className="label-caps rounded-sm bg-terracotta/10 px-1.5 py-1 text-terracotta-strong">
                        Q
                      </span>
                    )}
                  </td>
                  <td className="nums py-3 text-right text-[13.5px] font-medium text-foreground">
                    {a.mark}
                  </td>
                  <td className="py-3">
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
