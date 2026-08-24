import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/dl/shell";
import { DisciplineTable } from "@/components/dl/discipline-table";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  component: TrackPage,
});

function TrackPage() {
  const state = usePredictions();
  const { disc } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  if (state.status === "loading")
    return (
      <Shell title="Track events">
        <div className="card-shadow flex h-64 items-center justify-center card-surface rounded-[18px] bg-card text-muted-foreground">
          Loading...
        </div>
      </Shell>
    );
  if (state.status === "error")
    return (
      <Shell title="Track events">
        <div className="card-shadow card-surface rounded-[18px] bg-card p-6 text-destructive">
          {state.message}
        </div>
      </Shell>
    );
  return (
    <Shell
      title="Track events"
      eyebrow={`${state.data.trackDisciplines.length} track disciplines · 2026 Final`}
      description="Sprints through distance — every track discipline contested at the Final. Pick an event to see the model's win probability for each qualified athlete."
      lastUpdated={state.data.lastUpdated}
      daysToFinal={state.data.daysToFinal}
    >
      <DisciplineTable
        disciplines={state.data.trackDisciplines}
        activeId={disc ?? state.data.trackDisciplines[0]?.id ?? ""}
        onActiveChange={(id) => navigate({ search: { disc: id }, replace: true })}
      />
    </Shell>
  );
}
