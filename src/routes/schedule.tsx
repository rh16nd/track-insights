import { createFileRoute } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, dotClass, badgeClass } from "@/components/dl/shell";
import { statusLabel } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
  const state = usePredictions();
  const data = state.status === "ok" ? state.data : undefined;
  const doneCount = data ? data.meets.filter((m) => m.status === "done").length : 0;

  // Header persists through loading/error -- see the note in track.tsx.
  return (
    <Shell
      title="Schedule"
      eyebrow={data ? `2026 season · ${data.meets.length} meetings` : "2026 season"}
      description={
        data
          ? `The full Wanda Diamond League season, from the opener to the Final in Brussels. ${doneCount} of ${data.meets.length} meetings are scored.`
          : "The full Wanda Diamond League season, from the opener to the Final in Brussels."
      }
      lastUpdated={data?.lastUpdated}
      daysToFinal={data?.daysToFinal}
    >
      {state.status === "loading" && (
        <PanelSkeleton title="2026 Diamond League calendar" rows={8} />
      )}
      {state.status === "error" && <ErrorPanel message={state.message} />}
      {data && (
        <Panel title="2026 Diamond League calendar">
          <ul className="divide-y divide-border">
            {data.meets.map((m) => (
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
                    m.status === "final" ? "font-semibold text-gold-strong" : "",
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
      )}
    </Shell>
  );
}
