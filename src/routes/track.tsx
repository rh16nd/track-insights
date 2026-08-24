import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { DisciplineTable } from "@/components/dl/discipline-table";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  component: TrackPage,
});

const DESCRIPTION =
  "Sprints through distance — every track discipline contested at the Final. Pick an event to see the model's win probability for each qualified athlete.";

function TrackPage() {
  const state = usePredictions();
  const { disc } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const data = state.status === "ok" ? state.data : undefined;

  // The page header stays on screen through loading and error rather than
  // the route early-returning a bare Shell -- that fallback dropped the
  // eyebrow/description entirely and reverted to the old bordered title
  // card, so the page visibly changed identity while data was in flight.
  // The discipline count is only shown once it's actually known.
  return (
    <Shell
      title="Track events"
      eyebrow={
        data ? `${data.trackDisciplines.length} track disciplines · 2026 Final` : "2026 Final"
      }
      description={DESCRIPTION}
      lastUpdated={data?.lastUpdated}
      daysToFinal={data?.daysToFinal}
    >
      {state.status === "loading" && <PanelSkeleton title="Projected top 8" rows={8} />}
      {state.status === "error" && <ErrorPanel message={state.message} />}
      {data && (
        <DisciplineTable
          disciplines={data.trackDisciplines}
          activeId={disc ?? data.trackDisciplines[0]?.id ?? ""}
          onActiveChange={(id) => navigate({ search: { disc: id }, replace: true })}
        />
      )}
    </Shell>
  );
}
