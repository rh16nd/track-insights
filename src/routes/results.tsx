import { useMemo, useState } from "react";
import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, HeadFigure } from "@/components/dl/shell";
import { ResultComparison } from "@/components/dl/result-comparison";
import { usePredictions } from "@/hooks/usePredictions";
import { useT } from "@/lib/i18n";
import { discName } from "@/lib/dl-data";
import type { Discipline } from "@/lib/dl-data";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/results")({
  head: () =>
    pageHead(
      "How the last predictions turned out",
      "Every event at the 2026 Diamond League Final, with the model's projection frozen before the meet and the result that followed.",
    ),
  component: ResultsPage,
});

/** The site's own track record.
 *
 * Every other number here is a backtest -- honest, walk-forward, and still a
 * number the model produced about races it was scored on afterwards. This page
 * is the other kind of evidence: a projection published BEFORE a meeting, left
 * alone, and read against what happened. `outputs/predictions_prefinal.csv` is
 * frozen for exactly this reason and is never regenerated once a Final is run.
 *
 * The comparison view itself already existed and had lost its route when the
 * Ultimate pivot rewrote Track and Field. This is that route. */
function ResultsPage() {
  const { t } = useT();
  usePageTitle(t("results.title"));
  const state = usePredictions();

  const contested = useMemo(() => {
    if (state.status !== "ok") return [];
    const all: Discipline[] = [...state.data.trackDisciplines, ...state.data.fieldDisciplines];
    return all
      .filter((d) => d.result)
      .sort((a, b) => discName(t, a.id, a.label).localeCompare(discName(t, b.id, b.label)));
  }, [state, t]);

  const [active, setActive] = useState("");
  const current = contested.find((d) => d.id === active) ?? contested[0];

  const scored = useMemo(() => {
    const hits = contested.reduce((n, d) => n + (d.result?.podiumHits ?? 0), 0);
    const places = contested.reduce((n, d) => n + (d.result?.podiumSize ?? 0), 0);
    return { hits, places, pct: places ? Math.round((hits / places) * 1000) / 10 : 0 };
  }, [contested]);

  // The head band is where this site puts figures, and this page's whole
  // argument is four numbers: what the model called, what share that was, over
  // how many events, and the backtest it advertises. The last one matters most
  // -- a track record only means something next to the claim it is testing,
  // and a reader cannot check that unless both are on the same screen.
  const figures =
    state.status === "ok" && contested.length > 0 ? (
      <>
        <HeadFigure value={`${scored.hits}/${scored.places}`} label={t("results.figPodium")} gold />
        <HeadFigure value={scored.pct} unit="%" label={t("results.figShare")} />
        <HeadFigure value={String(contested.length)} label={t("results.figEvents")} />
        <HeadFigure
          value={state.data.modelAccuracy}
          unit="%"
          label={t("results.figBacktest")}
          hint={t("results.figBacktestHint")}
        />
      </>
    ) : undefined;

  return (
    <Shell
      title={t("results.title")}
      eyebrow={t("results.eyebrow")}
      description={t("results.description")}
      figures={figures}
    >
      {state.status === "loading" && <PanelSkeleton />}
      {state.status === "error" && <ErrorPanel message={t("results.error")} />}
      {state.status === "ok" && contested.length === 0 && (
        <Panel title={t("results.pendingTitle")} className="mt-4">
          <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
            {t("results.pendingBody")}
          </p>
        </Panel>
      )}

      {state.status === "ok" && contested.length > 0 && (
        <>
          {/* The headline is the whole argument of the page, so it leads. The
              second figure is the backtest the site advertises: the two being
              close is the only thing that makes either of them credible, and a
              reader cannot check that unless both are on the same screen. */}
          <Panel title={t("results.scorecardTitle")} className="mt-4">
            <p className="max-w-3xl text-[13.5px] leading-relaxed text-foreground">
              {t("results.scorecardNote")}
            </p>
          </Panel>

          {/* Same picker as the Ultimate and the rankings tables: a real select
              on a phone, pills on a desktop. */}
          <div className="mt-6 sm:hidden">
            <label className="label-caps mb-1.5 block text-muted-foreground" htmlFor="res-disc">
              {t("rankings.discipline")}
            </label>
            <select
              id="res-disc"
              value={current?.id ?? ""}
              onChange={(e) => setActive(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-3 text-[13.5px] font-medium text-foreground"
            >
              {contested.map((d) => (
                <option key={d.id} value={d.id}>
                  {discName(t, d.id, d.label)} · {d.result?.podiumHits}/{d.result?.podiumSize}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6 hidden flex-wrap gap-2 sm:flex">
            {contested.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActive(d.id)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                  d.id === current?.id
                    ? "border-transparent bg-terracotta text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
                }`}
              >
                {discName(t, d.id, d.label)}
                <span
                  className={`nums ml-2 ${
                    d.id === current?.id ? "text-primary-foreground/75" : "text-muted-foreground"
                  }`}
                >
                  {d.result?.podiumHits}/{d.result?.podiumSize}
                </span>
              </button>
            ))}
          </div>

          {current && <ResultComparison current={current} />}
        </>
      )}
    </Shell>
  );
}
