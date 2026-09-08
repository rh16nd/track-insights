import { pageHead } from "@/lib/seo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { WorldRankingTable } from "@/components/dl/world-ranking-table";
import { useWorldRankings } from "@/hooks/useWorldRankings";
import { useT } from "@/lib/i18n";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/field")({
  head: () =>
    pageHead(
      "Field events",
      "The world's best in every field discipline, ranked by World Athletics points or by the model's rating for a championship final podium.",
    ),
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  component: FieldPage,
});

function FieldPage() {
  const { t } = useT();
  usePageTitle(t("field.title"));
  const state = useWorldRankings();
  const { disc } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const data = state.status === "ok" ? state.data : undefined;
  const count = data ? Object.values(data).filter((d) => d.isField).length : undefined;

  return (
    <Shell
      title={t("field.title")}
      eyebrow={count !== undefined ? t("field.eyebrow", { n: count }) : undefined}
      description={t("field.description")}
    >
      {state.status === "loading" && <PanelSkeleton title={t("rankings.loading")} rows={10} />}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}
      {data && (
        <WorldRankingTable
          rankings={data}
          isField={true}
          activeId={disc ?? ""}
          onActiveChange={(id) => navigate({ search: { disc: id }, replace: true })}
        />
      )}
    </Shell>
  );
}
