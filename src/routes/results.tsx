import { useMemo, useState } from "react";
import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, HeadFigure } from "@/components/dl/shell";
import { ResultComparison } from "@/components/dl/result-comparison";
import { useResults } from "@/hooks/useResults";
import { useT } from "@/lib/i18n";
import { discName } from "@/lib/dl-data";
import type { Championship, Discipline } from "@/lib/dl-data";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/results")({
  head: () =>
    pageHead(
      "How the last predictions turned out",
      "Every championship the model called in advance, with the projection frozen before the meet and the result that followed.",
    ),
  component: ResultsPage,
});

function score(champ: Championship) {
  const hits = champ.events.reduce((n, e) => n + e.result.podiumHits, 0);
  const places = champ.events.reduce((n, e) => n + e.result.podiumSize, 0);
  return { hits, places, pct: places ? Math.round((hits / places) * 1000) / 10 : 0 };
}

/** The site's own track record, one championship at a time.
 *
 * Every other accuracy number here is a backtest -- honest, walk-forward, and
 * still the model being marked on races it was scored against afterwards. This
 * page is the other kind of evidence: a projection published BEFORE a meeting,
 * left alone, read against what happened.
 *
 * Collapsed, because the record is a LIST and one open meeting is a page about
 * that meeting rather than a record. Each championship carries its score in the
 * header, so the whole record reads without opening anything; opening one is
 * how you ask where exactly it was wrong. */
function ResultsPage() {
  const { t } = useT();
  usePageTitle(t("results.title"));
  const state = useResults();

  // Memoised because a fresh [] on every render would re-run the totals
  // below each time, and the identity is what the dependency array reads.
  const champs = useMemo(() => (state.status === "ok" ? state.data.championships : []), [state]);
  const overall = useMemo(() => {
    const done = champs.filter((c) => c.status === "complete");
    const hits = done.reduce((n, c) => n + score(c).hits, 0);
    const places = done.reduce((n, c) => n + score(c).places, 0);
    return {
      hits,
      places,
      pct: places ? Math.round((hits / places) * 1000) / 10 : 0,
      meets: done.length,
    };
  }, [champs]);

  const figures =
    state.status === "ok" && overall.places > 0 ? (
      <>
        <HeadFigure
          value={`${overall.hits}/${overall.places}`}
          label={t("results.figPodium")}
          gold
        />
        <HeadFigure value={overall.pct} unit="%" label={t("results.figShare")} />
        <HeadFigure value={String(overall.meets)} label={t("results.figMeets")} />
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
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}

      {state.status === "ok" && champs.length === 0 && (
        <Panel title={t("results.pendingTitle")} className="mt-4">
          <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
            {t("results.pendingBody")}
          </p>
        </Panel>
      )}

      {state.status === "ok" && champs.length > 0 && (
        <>
          <Panel title={t("results.scorecardTitle")} className="mt-4">
            <p className="max-w-3xl text-[13.5px] leading-relaxed text-foreground">
              {t("results.scorecardNote")}
            </p>
          </Panel>

          <div className="mt-6 flex flex-col gap-3">
            {champs.map((c, i) => (
              <ChampionshipBlock
                key={c.id}
                champ={c}
                t={t}
                // The newest completed meeting opens; the rest stay shut. A
                // record grows downward, so the bottom entry is the news.
                defaultOpen={i === champs.length - 1 && c.status === "complete"}
              />
            ))}
          </div>
        </>
      )}
    </Shell>
  );
}

function ChampionshipBlock({
  champ,
  t,
  defaultOpen,
}: {
  champ: Championship;
  t: (k: string, v?: Record<string, string | number>) => string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [active, setActive] = useState("");
  const s = score(champ);
  const pending = champ.status === "pending";
  const events = useMemo(
    () =>
      [...champ.events].sort((a, b) =>
        discName(t, a.id, a.label).localeCompare(discName(t, b.id, b.label)),
      ),
    [champ.events, t],
  );
  const current = events.find((e) => e.id === active) ?? events[0];

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => !pending && setOpen((v) => !v)}
        aria-expanded={pending ? undefined : open}
        disabled={pending}
        className={`flex w-full items-center gap-4 px-4 py-4 text-left transition-colors sm:px-5 ${
          pending ? "cursor-default" : "hover:bg-secondary/40"
        }`}
      >
        {/* Rotated rather than swapped, so the motion reads as one thing
            turning rather than two icons trading places. */}
        <span
          aria-hidden="true"
          className={`text-[11px] text-muted-foreground transition-transform duration-200 ease-out ${
            pending ? "opacity-0" : open ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-foreground">
            {t(champ.labelKey)}
          </span>
          <span className="label-caps mt-0.5 block text-muted-foreground">
            {champ.venue}
            {pending
              ? ` · ${t("results.notRunYet")}`
              : // Mid-championship the score covers only the finals run so far.
                // Say so, or "6 events" reads as the whole meeting.
                champ.events.length < champ.calledEvents
                ? ` · ${t("results.eventsSoFar", { done: champ.events.length, n: champ.calledEvents })}`
                : ` · ${t("results.eventsWord", { n: champ.events.length })}`}
          </span>
        </span>
        {pending ? (
          <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11.5px] font-semibold text-muted-foreground">
            {t("results.badgeCalled")}
          </span>
        ) : (
          <span className="shrink-0 text-right">
            <span className="nums block text-[17px] font-semibold text-foreground">
              {s.hits}/{s.places}
            </span>
            <span className="label-caps block text-muted-foreground">{s.pct}%</span>
          </span>
        )}
      </button>

      {/* A championship with a frozen call and no result yet is worth showing,
          not hiding: it is the only moment a reader can see the call was made
          BEFORE the event rather than assembled after it. */}
      {pending && (
        <div className="border-t border-border px-4 py-4 sm:px-5">
          <p className="max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
            {t("results.pendingMeet", { n: champ.calledEvents })}
          </p>
        </div>
      )}

      {open && !pending && current && (
        <div className="border-t border-border px-4 pb-5 pt-4 sm:px-5">
          <div className="sm:hidden">
            <label
              className="label-caps mb-1.5 block text-muted-foreground"
              htmlFor={`res-${champ.id}`}
            >
              {t("rankings.discipline")}
            </label>
            <select
              id={`res-${champ.id}`}
              value={current.id}
              onChange={(e) => setActive(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-3 text-[13.5px] font-medium text-foreground"
            >
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {discName(t, e.id, e.label)} · {e.result.podiumHits}/{e.result.podiumSize}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden flex-wrap gap-2 sm:flex">
            {events.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setActive(e.id)}
                className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                  e.id === current.id
                    ? "border-transparent bg-terracotta text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
                }`}
              >
                {discName(t, e.id, e.label)}
                <span
                  className={`nums ml-1.5 ${
                    e.id === current.id ? "text-primary-foreground/75" : "text-muted-foreground"
                  }`}
                >
                  {e.result.podiumHits}/{e.result.podiumSize}
                </span>
              </button>
            ))}
          </div>

          {/* ResultComparison takes a Discipline and reads three of its fields:
              id, label and result. An event here is exactly those three. */}
          <ResultComparison
            current={{ ...current, qualLimit: 0, athletes: [] } as unknown as Discipline}
          />
        </div>
      )}
    </section>
  );
}
