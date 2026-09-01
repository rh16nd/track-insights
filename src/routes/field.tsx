import { pageHead } from "@/lib/seo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { DisciplineTable } from "@/components/dl/discipline-table";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/field")({
  head: () =>
    pageHead(
      "Field events",
      "Every field discipline at the 2026 Diamond League Final, with each qualified athlete's chance of finishing on the podium.",
    ),
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  component: FieldPage,
});

const DESCRIPTION =
  "Jumps and throws — every field discipline contested at the Final. Pick an event to see each qualified athlete's chance of finishing on the podium.";

function FieldPage() {
  const state = usePredictions();
  const { disc } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const data = state.status === "ok" ? state.data : undefined;

  // Header persists through loading/error -- see the note in track.tsx.
  return (
    <Shell
      title="Field events"
      eyebrow={
        data ? `${data.fieldDisciplines.length} field disciplines · 2026 Final` : "2026 Final"
      }
      description={DESCRIPTION}
      lastUpdated={data?.lastUpdated}
      daysToFinal={data?.daysToFinal}
    >
      {state.status === "loading" && <PanelSkeleton title="Projected field" rows={8} />}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}
      {data && (
        <DisciplineTable
          disciplines={data.fieldDisciplines}
          activeId={disc ?? data.fieldDisciplines[0]?.id ?? ""}
          onActiveChange={(id) => navigate({ search: { disc: id }, replace: true })}
        />
      )}
    </Shell>
  );
}
