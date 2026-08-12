import { useState } from "react";
import type { Discipline } from "@/lib/dl-data";
import { Panel } from "./shell";

export function DisciplineTable({ disciplines }: { disciplines: Discipline[] }) {
  const [active, setActive] = useState(disciplines[0]?.id ?? "");
  const current = disciplines.find((d) => d.id === active) ?? disciplines[0]!;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {disciplines.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActive(d.id)}
            className={`rounded-md border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              d.id === active
                ? "border-terracotta bg-terracotta text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <Panel title={`Projected top 8 — ${current.label}`} className="mt-4">
        <table className="w-full">
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
            {current.athletes.map((a) => (
              <tr key={a.name}>
                <td className="nums py-3 text-[13px] text-muted-foreground">{a.rank}</td>
                <td className="py-3 text-[13.5px] font-medium text-foreground">
                  <a
                    href={`https://worldathletics.org/search?q=${encodeURIComponent(a.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-terracotta hover:underline transition-colors"
                  >
                    {a.name}
                  </a>
                </td>
                <td className="nums py-3 text-[12px] text-muted-foreground">{a.nat}</td>
                <td className="py-3">
                  {a.qualified && (
                    <span className="label-caps rounded-sm bg-terracotta/10 px-1.5 py-1 text-terracotta">
                      Q
                    </span>
                  )}
                </td>
                <td className="nums py-3 text-right text-[13.5px] font-medium text-foreground">
                  {a.mark}
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-3">
                    <div className="h-1.5 w-28 rounded-full bg-secondary">
                      <div
                        className="h-1.5 rounded-full bg-terracotta"
                        style={{ width: `${Math.min(100, a.prob * 1.4)}%` }}
                      />
                    </div>
                    <span className="nums w-9 text-right text-[12.5px] font-semibold text-foreground">
                      {a.prob}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
