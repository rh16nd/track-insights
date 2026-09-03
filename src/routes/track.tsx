import { pageHead } from "@/lib/seo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { DisciplineTable } from "@/components/dl/discipline-table";
import { usePredictions } from "@/hooks/usePredictions";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/track")({
  head: () =>
    pageHead(
      "Track events",
      "Every track discipline at the 2026 Diamond League Final, with each qualified athlete's chance of finishing on the podium.",
    ),
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  component: TrackPage,
});

function TrackPage() {
  const { t } = useT();
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
      title={t("track.title")}
      eyebrow={
        data
          ? t("track.eyebrow", { n: data.trackDisciplines.length })
          : t("common.final2026")
      }
      description={t("track.description")}
      lastUpdated={data?.lastUpdated}
      daysToFinal={data?.daysToFinal}
    >
      {state.status === "loading" && <PanelSkeleton title={t("common.projectedField")} rows={8} />}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}
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
