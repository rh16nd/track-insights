import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/dl/shell";
import { DisciplineTable } from "@/components/dl/discipline-table";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/track")({
  component: TrackPage,
});

function TrackPage() {
  const state = usePredictions();
  if (state.status === "loading")
    return (
      <Shell title="Track events">
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      </Shell>
    );
  if (state.status === "error")
    return (
      <Shell title="Track events">
        <div className="p-6 text-red-700">{state.message}</div>
      </Shell>
    );
  return (
    <Shell title="Track events">
      <DisciplineTable disciplines={state.data.trackDisciplines} />
    </Shell>
  );
}
