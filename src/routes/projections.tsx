import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Shell, Panel } from "@/components/dl/shell";
import { formatMark, trajectoryDomain, trajectoryFor } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/projections")({
  component: ProjectionsPage,
});

function ProjectionsPage() {
  const state = usePredictions();
  const [activeId, setActiveId] = useState<string | null>(null);
  if (state.status === "loading")
    return (
      <Shell title="Projections">
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      </Shell>
    );
  if (state.status === "error")
    return (
      <Shell title="Projections">
        <div className="p-6 text-red-700">{state.message}</div>
      </Shell>
    );
  const allDisciplines = [...state.data.trackDisciplines, ...state.data.fieldDisciplines];
  const active =
    (activeId ? allDisciplines.find((d) => d.id === activeId) : null) ?? allDisciplines[0];
  if (!active) return null;
  const storylines = [
    {
      label: "Model updated",
      text: "Predictions refresh automatically every time run.py runs — pulling live standings and top lists from World Athletics.",
    },
    {
      label: "Trajectory model",
      text: "Each athlete's projected mark at the final is calculated from their historical peak timing fingerprint across 2021–2023 seasons.",
    },
    {
      label: "DL qualification",
      text: "Only athletes in the live Diamond League standings are shown. Top 8 for sprints, top 10 for distance, top 6 for field events.",
    },
    {
      label: "Model accuracy",
      text: `${Math.round(state.data.modelAccuracy)}% top-3 accuracy on 2023 backtesting, up from 44% after adding competition-level weighting, wind adjustment, and head-to-head win rates.`,
    },
  ];
  const leader = active.athletes[0];
  const points = trajectoryFor(active);
  const domain = trajectoryDomain(points);
  return (
    <Shell title="Projections">
      <div className="flex flex-wrap gap-2">
        {allDisciplines.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActiveId(d.id)}
            className={[
              "rounded-md border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              d.id === active.id
                ? "border-terracotta bg-terracotta text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Panel title={`Season trajectory — ${active.label}`}>
          <div className="text-[14px] font-semibold text-foreground">{leader?.name}</div>
          <div className="nums text-[12px] text-muted-foreground">
            {leader?.nat} · projected {leader?.mark} · {leader?.prob}% win probability
          </div>
          <div className="mt-3 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 10, right: 12, bottom: 0, left: -8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="meet"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={56}
                />
                <YAxis
                  domain={domain}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => formatMark(v, leader?.mark ?? "")}
                  width={62}
                />
                <Tooltip
                  formatter={(v: number) => formatMark(v, leader?.mark ?? "")}
                  contentStyle={{
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Season best"
                  stroke="var(--terracotta)"
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                  connectNulls
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  name="Projected"
                  stroke="var(--gold)"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={{ r: 2.5 }}
                  connectNulls
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Confidence by discipline">
          <ul className="space-y-3">
            {state.data.confidence.map((c) => (
              <li key={c.disc} className="flex items-center gap-3">
                <span
                  className={[
                    "w-28 shrink-0 text-[12.5px]",
                    c.disc === active.label ? "font-semibold text-terracotta" : "text-foreground",
                  ].join(" ")}
                >
                  {c.disc}
                </span>
                <div className="h-2 flex-1 rounded-full bg-secondary">
                  <div
                    className={`h-2 rounded-full ${c.disc === active.label ? "bg-gold" : "bg-terracotta"}`}
                    style={{ width: `${c.value}%` }}
                  />
                </div>
                <span className="nums w-9 text-right text-[12px] font-semibold text-muted-foreground">
                  {c.value}%
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel title={`Contenders — ${active.label}`} className="mt-4">
        <ul className="space-y-3">
          {active.athletes.slice(0, 5).map((a) => (
            <li key={a.name} className="flex items-center gap-3">
              <span className="nums w-5 text-[12px] text-muted-foreground">{a.rank}</span>
              <span className="w-48 shrink-0 text-[13px] font-medium text-foreground">
                {a.name}
              </span>
              <span className="nums w-10 text-[12px] text-muted-foreground">{a.nat}</span>
              <div className="h-2 flex-1 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-terracotta"
                  style={{ width: `${Math.min(100, a.prob * 1.4)}%` }}
                />
              </div>
              <span className="nums w-20 text-right text-[12.5px] font-medium text-foreground">
                {a.mark}
              </span>
              <span className="nums w-9 text-right text-[12px] font-semibold text-muted-foreground">
                {a.prob}%
              </span>
            </li>
          ))}
        </ul>
      </Panel>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {storylines.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-5">
            <div className="label-caps text-terracotta">{s.label}</div>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}
