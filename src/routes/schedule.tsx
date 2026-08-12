import { createFileRoute } from "@tanstack/react-router";
import { Shell, Panel, dotClass, badgeClass } from "@/components/dl/shell";
import { statusLabel } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
  const state = usePredictions();
  if (state.status === "loading")
    return (
      <Shell title="Schedule">
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      </Shell>
    );
  if (state.status === "error")
    return (
      <Shell title="Schedule">
        <div className="p-6 text-red-700">{state.message}</div>
      </Shell>
    );
  return (
    <Shell title="Schedule">
      <Panel title="2026 Diamond League calendar">
        <ul className="divide-y divide-border">
          {state.data.meets.map((m) => (
            <li key={m.n} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <span className="nums w-6 text-[12px] text-muted-foreground">
                {String(m.n).padStart(2, "0")}
              </span>
              <span className={`size-2 shrink-0 rounded-full ${dotClass[m.status]}`} />
              <span className="nums w-20 text-[13px] text-muted-foreground">{m.date}</span>
              <span
                className={[
                  "flex-1 text-[14px]",
                  m.status === "done" ? "text-muted-foreground" : "",
                  m.status === "final" ? "font-semibold text-gold" : "",
                  m.status === "next" ? "font-semibold text-foreground" : "",
                  m.status === "upcoming" ? "text-foreground" : "",
                ].join(" ")}
              >
                {m.city}
              </span>
              <span className={`label-caps rounded-sm px-2 py-1 ${badgeClass[m.status]}`}>
                {statusLabel[m.status]}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </Shell>
  );
}
