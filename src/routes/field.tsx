import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/dl/shell";
import { DisciplineTable } from "@/components/dl/discipline-table";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/field")({
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  component: FieldPage,
});

function FieldPage() {
  const state = usePredictions();
  const { disc } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  if (state.status === "loading")
    return (
      <Shell title="Field events">
        <div className="card-shadow flex h-64 items-center justify-center card-surface rounded-[18px] bg-card text-muted-foreground">
          Loading...
        </div>
      </Shell>
    );
  if (state.status === "error")
    return (
      <Shell title="Field events">
        <div className="card-shadow card-surface rounded-[18px] bg-card p-6 text-destructive">
          {state.message}
        </div>
      </Shell>
    );
  return (
    <Shell
      title="Field events"
      eyebrow={`${state.data.fieldDisciplines.length} field disciplines · 2026 Final`}
      description="Jumps and throws — every field discipline contested at the Final. Pick an event to see the model's win probability for each qualified athlete."
      lastUpdated={state.data.lastUpdated}
      daysToFinal={state.data.daysToFinal}
    >
      <DisciplineTable
        disciplines={state.data.fieldDisciplines}
        activeId={disc ?? state.data.fieldDisciplines[0]?.id ?? ""}
        onActiveChange={(id) => navigate({ search: { disc: id }, replace: true })}
      />
    </Shell>
  );
}
