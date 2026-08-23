import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/dl/shell";
import { DisciplineTable } from "@/components/dl/discipline-table";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/field")({
  component: FieldPage,
});

function FieldPage() {
  const state = usePredictions();
  if (state.status === "loading")
    return (
      <Shell title="Field events">
        <div className="card-shadow flex h-64 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
          Loading...
        </div>
      </Shell>
    );
  if (state.status === "error")
    return (
      <Shell title="Field events">
        <div className="card-shadow rounded-xl border border-border bg-card p-6 text-destructive">
          {state.message}
        </div>
      </Shell>
    );
  return (
    <Shell
      title="Field events"
      lastUpdated={state.data.lastUpdated}
      daysToFinal={state.data.daysToFinal}
    >
      <DisciplineTable disciplines={state.data.fieldDisciplines} />
    </Shell>
  );
}
