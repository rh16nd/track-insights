import { useState, type CSSProperties } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell, Panel, ProbabilityBar, RankBadge } from "@/components/dl/shell";
import { TrajectoryOverlayChart } from "@/components/dl/trajectory-overlay-chart";
import { StorylineCards } from "@/components/dl/storyline-cards";
import { usePredictions } from "@/hooks/usePredictions";
import { useProjectionsDetail } from "@/hooks/useProjectionsDetail";

export const Route = createFileRoute("/projections")({
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  component: ProjectionsPage,
});

function ProjectionsPage() {
  const state = usePredictions();
  const { disc } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  if (state.status === "loading")
    return (
      <Shell title="Projections">
        <div className="card-shadow flex h-64 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
          Loading...
        </div>
      </Shell>
    );
  if (state.status === "error")
    return (
      <Shell title="Projections">
        <div className="card-shadow rounded-xl border border-border bg-card p-6 text-destructive">
          {state.message}
        </div>
      </Shell>
    );
  const allDisciplines = [...state.data.trackDisciplines, ...state.data.fieldDisciplines];
  const active = (disc ? allDisciplines.find((d) => d.id === disc) : null) ?? allDisciplines[0];
  const pickerGroups = [
    { label: "Track", disciplines: state.data.trackDisciplines },
    { label: "Field", disciplines: state.data.fieldDisciplines },
  ];
  if (!active) return null;

  return (
    <Shell
      title="Projections"
      lastUpdated={state.data.lastUpdated}
      daysToFinal={state.data.daysToFinal}
    >
      <div className="card-shadow space-y-2.5 rounded-xl border border-border bg-card p-4">
        {pickerGroups.map((group) => (
          <div key={group.label} className="flex flex-wrap items-center gap-2">
            <span className="label-caps w-14 shrink-0 text-muted-foreground">{group.label}</span>
            {group.disciplines.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => navigate({ search: { disc: d.id }, replace: true })}
                className={[
                  "rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97]",
                  d.id === active.id
                    ? "border-transparent text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground",
                ].join(" ")}
                style={
                  d.id === active.id
                    ? {
                        backgroundImage:
                          "linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
                      }
                    : undefined
                }
              >
                {d.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <DisciplineDetail discKey={active.id} discLabel={active.label} />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Confidence by discipline">
          <ul className="space-y-3">
            {[...state.data.trackDisciplines, ...state.data.fieldDisciplines]
              .map((d) => ({ disc: d.label, value: d.athletes[0]?.prob ?? 0 }))
              .sort((a, b) => b.value - a.value)
              .map((c, i) => (
                <li
                  key={c.disc}
                  className="stagger-item flex items-center gap-3"
                  style={{ "--stagger-i": Math.min(i, 10) } as CSSProperties}
                >
                  <span
                    className={[
                      "w-28 shrink-0 text-[12.5px]",
                      c.disc === active.label
                        ? "font-semibold text-terracotta-strong"
                        : "text-foreground",
                    ].join(" ")}
                  >
                    {c.disc}
                  </span>
                  <ProbabilityBar value={c.value} className="flex-1" trackHeight="h-2" />
                  <span className="nums w-9 text-right text-[12px] font-semibold text-muted-foreground">
                    {c.value}%
                  </span>
                </li>
              ))}
          </ul>
        </Panel>
        <Panel title={`Contenders — ${active.label}`}>
          <ul className="space-y-3">
            {active.athletes.slice(0, 5).map((a, i) => (
              <li
                key={a.name}
                className="stagger-item flex flex-wrap items-center gap-x-3 gap-y-1.5"
                style={{ "--stagger-i": i } as CSSProperties}
              >
                <RankBadge rank={a.rank} className="size-5 text-[10px]" />
                <Link
                  to="/athlete/$discKey/$name"
                  params={{ discKey: active.id, name: a.name }}
                  className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground hover:text-terracotta-strong hover:underline transition-colors sm:w-48 sm:flex-none"
                >
                  {a.name}
                </Link>
                <span className="nums w-10 shrink-0 text-[12px] text-muted-foreground">{a.nat}</span>
                <div className="order-last flex w-full items-center gap-3 pl-8 sm:order-none sm:w-auto sm:flex-1 sm:pl-0">
                  <ProbabilityBar value={a.prob} className="min-w-[40px] flex-1" trackHeight="h-2" />
                  <span className="nums w-20 shrink-0 text-right text-[12.5px] font-medium text-foreground">
                    {a.mark}
                  </span>
                  <span className="nums w-9 shrink-0 text-right text-[12px] font-semibold text-muted-foreground">
                    {a.prob}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Shell>
  );
}

/** Real trajectories + real storylines for whichever discipline is active,
 * fetched lazily per discipline (see useProjectionsDetail) rather than
 * embedded in the bulk predictions payload. */
function DisciplineDetail({ discKey, discLabel }: { discKey: string; discLabel: string }) {
  const detail = useProjectionsDetail(discKey);

  return (
    <>
      <Panel title={`Real season form — ${discLabel}`} className="mt-4">
        {detail.status === "loading" && (
          <div className="flex h-48 items-center justify-center text-[12.5px] text-muted-foreground">
            Loading real season form…
          </div>
        )}
        {detail.status === "error" && (
          <div className="text-[12.5px] text-destructive">{detail.message}</div>
        )}
        {detail.status === "ok" &&
          (detail.data.trajectories.length > 0 ? (
            <TrajectoryOverlayChart trajectories={detail.data.trajectories} discKey={discKey} />
          ) : (
            <div className="text-[12.5px] text-muted-foreground">
              No real per-meet history on record yet for this discipline's top contenders.
            </div>
          ))}
      </Panel>
      <Panel title={`Storylines — ${discLabel}`} className="mt-4">
        {detail.status === "ok" ? (
          <StorylineCards storylines={detail.data.storylines} />
        ) : (
          <div className="h-16" />
        )}
      </Panel>
    </>
  );
}
