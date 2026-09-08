import { pageHead } from "@/lib/seo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { WorldRankingTable } from "@/components/dl/world-ranking-table";
import { useWorldRankings } from "@/hooks/useWorldRankings";
import { useT } from "@/lib/i18n";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/track")({
  head: () =>
    pageHead(
      "Track events",
      "The world's best in every track discipline, ranked by World Athletics points or by the model's rating for a championship final podium.",
    ),
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  component: TrackPage,
});

function TrackPage() {
  const { t } = useT();
  usePageTitle(t("track.title"));
  const state = useWorldRankings();
  const { disc } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const data = state.status === "ok" ? state.data : undefined;
  const count = data ? Object.values(data).filter((d) => !d.isField).length : undefined;

  return (
    <Shell
      title={t("track.title")}
      eyebrow={count !== undefined ? t("track.eyebrow", { n: count }) : undefined}
      description={t("track.description")}
    >
      {state.status === "loading" && <PanelSkeleton title={t("rankings.loading")} rows={10} />}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}
      {data && (
        <WorldRankingTable
          rankings={data}
          isField={false}
          activeId={disc ?? ""}
          onActiveChange={(id) => navigate({ search: { disc: id }, replace: true })}
        />
      )}
    </Shell>
  );
}
