import { useState, type CSSProperties } from "react";
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
import { Shell, Panel, ProbabilityBar, RankBadge } from "@/components/dl/shell";
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
        <div className="card-shadow flex h-64 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
          Loading...
        </div>
      </Shell>
    );
  if (state.status === "error")
    return (
      <Shell title="Projections">
        <div className="card-shadow rounded-xl border border-border bg-card p-6 text-destructive">
          {state.message}
        </div>
      </Shell>
    );
  const allDisciplines = [...state.data.trackDisciplines, ...state.data.fieldDisciplines];
  const active =
    (activeId ? allDisciplines.find((d) => d.id === activeId) : null) ?? allDisciplines[0];
  const pickerGroups = [
    { label: "Track", disciplines: state.data.trackDisciplines },
    { label: "Field", disciplines: state.data.fieldDisciplines },
  ];
  if (!active) return null;
  const storylines = [
    {
      label: "Model updated",
      text: "Predictions refresh automatically every time run.py runs — pulling live standings and top lists from World Athletics.",
    },
    {
      label: "Trajectory chart",
      text: "The curve is an illustrative model, not a per-meet results log — it doesn't reflect which meets an athlete actually competed in. Only the final point (Brussels) comes from the prediction model; everything before it is a smoothed illustrative path toward that projection.",
    },
    {
      label: "DL qualification",
      text: "Only athletes in the live Diamond League standings are shown. Top 8 for sprints, top 10 for distance, top 6 for field events.",
    },
    {
      label: "Model accuracy",
      text: `${Math.round(state.data.modelAccuracy)}% top-3 accuracy, walk-forward validated across three independent seasons (2023, 2024, 2025) against real Diamond League Final results.`,
    },
  ];
  const leader = active.athletes[0];
  const points = trajectoryFor(active);
  const domain = trajectoryDomain(points);
  return (
    <Shell
      title="Projections"
      lastUpdated={state.data.lastUpdated}
      daysToFinal={state.data.daysToFinal}
    >
      <div className="card-shadow space-y-2.5 rounded-xl border border-border bg-card p-4">
        {pickerGroups.map((group) => (
          <div key={group.label} className="flex flex-wrap items-center gap-2">
            <span className="label-caps w-14 shrink-0 text-muted-foreground">{group.label}</span>
            {group.disciplines.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveId(d.id)}
                className={[
                  "rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]",
                  d.id === active.id
                    ? "border-transparent text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground",
                ].join(" ")}
                style={
                  d.id === active.id
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
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title={`Modeled trajectory — ${active.label}`}>
          <div className="text-[14px] font-semibold text-foreground">{leader?.name}</div>
          <div className="nums text-[12px] text-muted-foreground">
            {leader?.nat} · projected {leader?.mark} · {leader?.prob}% win probability
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground/85">
            Illustrative curve toward the model's projection — not a per-meet results log
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
                    backgroundColor: "var(--popover)",
                    color: "var(--popover-foreground)",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "var(--popover-foreground)" }}
                  itemStyle={{ color: "var(--popover-foreground)" }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Illustrative trend"
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
            {state.data.confidence.map((c, i) => (
              <li
                key={c.disc}
                className="stagger-item flex items-center gap-3"
                style={{ "--stagger-i": Math.min(i, 10) } as CSSProperties}
              >
                <span
                  className={[
                    "w-28 shrink-0 text-[12.5px]",
                    c.disc === active.label
                      ? "font-semibold text-terracotta-strong"
                      : "text-foreground",
                  ].join(" ")}
                >
                  {c.disc}
                </span>
                <ProbabilityBar value={c.value} className="flex-1" trackHeight="h-2" />
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
          {active.athletes.slice(0, 5).map((a, i) => (
            <li
              key={a.name}
              className="stagger-item flex flex-wrap items-center gap-x-3 gap-y-1.5"
              style={{ "--stagger-i": i } as CSSProperties}
            >
              <RankBadge rank={a.rank} className="size-5 text-[10px]" />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground sm:w-48 sm:flex-none">
                {a.name}
              </span>
              <span className="nums w-10 shrink-0 text-[12px] text-muted-foreground">{a.nat}</span>
              <div className="order-last flex w-full items-center gap-3 pl-8 sm:order-none sm:w-auto sm:flex-1 sm:pl-0">
                <ProbabilityBar value={a.prob} className="min-w-[40px] flex-1" trackHeight="h-2" />
                <span className="nums w-20 shrink-0 text-right text-[12.5px] font-medium text-foreground">
                  {a.mark}
                </span>
                <span className="nums w-9 shrink-0 text-right text-[12px] font-semibold text-muted-foreground">
                  {a.prob}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <div className="card-shadow mt-4 grid grid-cols-1 gap-x-8 gap-y-5 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        {storylines.map((s) => (
          <div key={s.label}>
            <div className="label-caps text-terracotta-strong">{s.label}</div>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}
