import { pageHead } from "@/lib/seo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { DisciplineTable } from "@/components/dl/discipline-table";
import { usePredictions } from "@/hooks/usePredictions";
import { useT } from "@/lib/i18n";

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

function FieldPage() {
  const { t } = useT();
  const state = usePredictions();
  const { disc } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const data = state.status === "ok" ? state.data : undefined;

  // Header persists through loading/error -- see the note in track.tsx.
  return (
    <Shell
      title={t("field.title")}
      eyebrow={
        data
          ? t("field.eyebrow", { n: data.fieldDisciplines.length })
          : t("common.final2026")
      }
      description={t("field.description")}
      lastUpdated={data?.lastUpdated}
      daysToFinal={data?.daysToFinal}
    >
      {state.status === "loading" && <PanelSkeleton title={t("common.projectedField")} rows={8} />}
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
