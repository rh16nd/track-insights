import { useState, type CSSProperties } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Shell,
  Panel,
  PanelSkeleton,
  ErrorPanel,
  ProbabilityBar,
  RankBadge,
} from "@/components/dl/shell";
import { RadialMeter } from "@/components/dl/radial-meter";
import { TrajectoryOverlayChart } from "@/components/dl/trajectory-overlay-chart";
import { StorylineCards } from "@/components/dl/storyline-cards";
import type { Discipline } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";
import { useProjectionsDetail } from "@/hooks/useProjectionsDetail";

export const Route = createFileRoute("/projections")({
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  component: ProjectionsPage,
});

/** Real hero moment for the selected discipline.
 *
 * Rebuilt 2026-08-24 after the impeccable critique skill found two real
 * problems with the previous version: (1) a P0 data bug -- it featured
 * `active.athletes[0]` (sorted by real season-best mark) as the "projected
 * leader" next to a win-probability meter, but that's not always the same
 * athlete the model actually favors (upsets are real), so the hero could
 * literally contradict the Contenders panel and the photo-finish stat two
 * sections later; (2) a design-specificity problem -- structurally this was
 * Dashboard's hero (title + subtitle + a generic 2-stat grid) with a bigger
 * gradient, not a page with its own visual idea.
 *
 * Fixed by leading with the thing this page is actually about -- how close
 * the real race is -- instead of a single athlete's card: a real top-3
 * ranked-by-probability list (RankBadge + ProbabilityBar, both already
 * established primitives, just never arranged as a vertical ranking inside
 * a hero before) replaces the old single-leader block, and the real gap to
 * 2nd sits directly under the meter instead of duplicated in the stat row
 * below. The meter itself is now correctly bound to the real top
 * win-probability pick (`byProb[0]`), not the top-ranked-by-mark athlete. */
function ProjectionsHero({
  active,
  byProb,
  probGap,
  daysToFinal,
}: {
  active: Discipline;
  byProb: Discipline["athletes"];
  probGap: number | null;
  daysToFinal: number;
}) {
  const top = byProb.slice(0, 3);
  const favorite = top[0];
  const runnerUp = top[1];
  return (
    <div className="track-surface relative overflow-hidden rounded-2xl">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(115deg, oklch(0.15 0.02 40 / 0.94) 0%, oklch(0.30 0.09 35 / 0.8) 52%, oklch(0.545 0.164 38.5 / 0.55) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(24deg, transparent 0 62px, white 62px 64px, transparent 64px 126px)",
        }}
        aria-hidden
      />
      <div className="relative flex flex-wrap items-start justify-between gap-6 px-6 pb-7 pt-8 sm:px-9 sm:pb-9 sm:pt-10">
        <div className="min-w-[240px] flex-1">
          <h1
            className="text-[32px] font-semibold tracking-tight text-white sm:text-[40px]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
          >
            {active.label}
          </h1>
          <p className="nums mt-1.5 text-[13px] text-white/80">
            {daysToFinal}d to Brussels Final · {active.athletes.length} qualified
          </p>

          {/* Editorial framing ported from the Figma redesign: state the
              model's actual pick as a sentence before showing the ranked
              field. The discipline stays the <h1> (it's what the page is
              about), so this is a statement line, not a competing heading. */}
          {favorite && (
            <div className="mt-6">
              <div className="label-caps text-gold-light">The model&apos;s call</div>
              <div
                className="mt-1.5 text-[26px] font-bold leading-tight tracking-tight text-white sm:text-[30px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {favorite.name}
              </div>
            </div>
          )}

          {top.length > 0 && (
            <div className="mt-5 max-w-md">
              <div className="label-caps text-terracotta-light">In contention</div>
              <ul className="mt-2 space-y-2">
                {top.map((a, i) => (
                  <li key={a.name} className="flex items-center gap-3">
                    <RankBadge rank={i + 1} className="size-6 shrink-0 text-[11px]" />
                    <Link
                      to="/athlete/$discKey/$name"
                      params={{ discKey: active.id, name: a.name }}
                      className="min-w-0 flex-1 truncate text-[14.5px] font-medium text-white transition-colors hover:text-gold-light"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {a.name}
                    </Link>
                    <div className="w-24 shrink-0">
                      <ProbabilityBar value={a.prob} trackHeight="h-1.5" />
                    </div>
                    <span className="nums w-9 shrink-0 text-right text-[12.5px] font-semibold text-white/85">
                      {a.prob}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {favorite && (
          <div className="shrink-0">
            <RadialMeter
              value={favorite.prob}
              label="Podium chance"
              dark
              size={132}
              strokeWidth={11}
            />
            {probGap !== null && runnerUp && (
              <p className="nums mt-3 max-w-[132px] text-center text-[11px] leading-snug text-white/70">
                {probGap}pt clear of {runnerUp.name.split(" ").pop()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Compact real-stat strip sitting between the picker and the chart grid.
 * Every value here is real and distinct from what the hero above already
 * shows (the top-3 ranked contenders, the gap to 2nd, the win-probability
 * meter) -- this row is about how much real data backs the page, not who's
 * winning: the qualified field size, how many real 2026 races the chart
 * below is built from, how many real storylines were found, and the
 * model's own honest accuracy so every probability on the page can be read
 * in context. One bordered container with internal dividers, not four
 * separate boxes -- avoids the generic repeated-card look the storyline
 * cards were already rebuilt away from. */
function StatCell({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="px-4 py-3.5 first:pl-5 last:pr-5 sm:px-5">
      <div className="label-caps text-muted-foreground">{label}</div>
      <div
        className="nums mt-1.5 text-[22px] font-semibold leading-none text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div className="nums mt-1.5 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function ProjectionStatRow({
  qualifiedCount,
  realRaces,
  storylineCount,
  modelAccuracy,
  detailLoaded,
}: {
  qualifiedCount: number;
  realRaces: number | null;
  storylineCount: number | null;
  modelAccuracy: number;
  detailLoaded: boolean;
}) {
  return (
    <div className="card-shadow card-surface mt-4 grid grid-cols-2 divide-x divide-y divide-border rounded-[18px] bg-card sm:grid-cols-4 sm:divide-y-0">
      <StatCell label="Qualified field" value={String(qualifiedCount)} sub="real DL standings" />
      <StatCell
        label="Real 2026 races"
        value={!detailLoaded ? "…" : String(realRaces ?? 0)}
        sub="across top contenders"
      />
      <StatCell
        label="Storylines found"
        value={!detailLoaded ? "…" : String(storylineCount ?? 0)}
        sub="computed, not written"
      />
      <StatCell
        label="Model accuracy"
        value={`${Math.round(modelAccuracy)}%`}
        sub="podium hit rate, real field"
      />
    </div>
  );
}

const CONFIDENCE_COLLAPSED_COUNT = 8;

/** Real per-discipline confidence, ranked. Two real bugs the impeccable
 * critique skill caught here, both fixed:
 * (1) it used `d.athletes[0]?.prob` -- rank-sorted-by-mark, same class of
 * bug as the old hero -- instead of that discipline's actual top real win
 * probability; (2) every row was a plain, non-interactive `<li>` duplicating
 * the picker's own 32 disciplines with no way to act on what you saw here,
 * a real dead end right where a click is the obvious next step. Rows are
 * now real buttons wired to the same onSelectDisc the picker uses, and the
 * list is capped to the top 8 by default (32 uncapped rows measured 1251px
 * tall on desktop, worse on mobile) with a real "Show all 32" disclosure
 * rather than silently truncating. */
function ConfidencePanel({
  allDisciplines,
  activeId,
  onSelectDisc,
}: {
  allDisciplines: Discipline[];
  activeId: string;
  onSelectDisc: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const ranked = allDisciplines
    .map((d) => ({
      id: d.id,
      disc: d.label,
      value: d.athletes.length > 0 ? Math.max(...d.athletes.map((a) => a.prob)) : 0,
    }))
    .sort((a, b) => b.value - a.value);
  const shown = expanded ? ranked : ranked.slice(0, CONFIDENCE_COLLAPSED_COUNT);

  return (
    <Panel title="Confidence by discipline">
      <ul className="space-y-1">
        {shown.map((c, i) => (
          <li
            key={c.id}
            className="stagger-item"
            style={{ "--stagger-i": Math.min(i, 10) } as CSSProperties}
          >
            <button
              type="button"
              onClick={() => onSelectDisc(c.id)}
              aria-label={`${c.disc}, ${c.value}% podium chance`}
              className="flex w-full items-center gap-3 rounded-md py-2 pl-1 pr-2 transition-colors hover:bg-secondary/40"
            >
              <span
                aria-hidden
                className={[
                  "w-28 shrink-0 text-left text-[12.5px]",
                  c.id === activeId ? "font-semibold text-terracotta-strong" : "text-foreground",
                ].join(" ")}
              >
                {c.disc}
              </span>
              <ProbabilityBar value={c.value} className="flex-1" trackHeight="h-2" />
              <span
                aria-hidden
                className="nums w-9 text-right text-[12px] font-semibold text-muted-foreground"
              >
                {c.value}%
              </span>
            </button>
          </li>
        ))}
      </ul>
      {ranked.length > CONFIDENCE_COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="label-caps mt-2 w-full rounded-md py-2 text-center text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-terracotta-strong"
        >
          {expanded ? "Show less" : `Show all ${ranked.length}`}
        </button>
      )}
    </Panel>
  );
}

function ProjectionsPage() {
  const state = usePredictions();
  const { disc } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  // Loading/error keep the page's own header instead of falling back to the
  // bare Shell, which reverted to the old bordered title card mid-load.
  // Projections' real header lives in its hero (which needs data), so these
  // states use the on-canvas header treatment as a stand-in.
  if (state.status === "loading")
    return (
      <Shell
        title="Projections"
        eyebrow="Race dossier"
        description="How the model reads each event — the call, the season's real form curves, and the storylines behind the numbers."
      >
        <PanelSkeleton title="Contenders" rows={6} />
      </Shell>
    );
  if (state.status === "error")
    return (
      <Shell
        title="Projections"
        eyebrow="Race dossier"
        description="How the model reads each event — the call, the season's real form curves, and the storylines behind the numbers."
      >
        <ErrorPanel message={state.message} />
      </Shell>
    );
  const allDisciplines = [...state.data.trackDisciplines, ...state.data.fieldDisciplines];
  const active = (disc ? allDisciplines.find((d) => d.id === disc) : null) ?? allDisciplines[0];
  const pickerGroups = [
    { label: "Track", disciplines: state.data.trackDisciplines },
    { label: "Field", disciplines: state.data.fieldDisciplines },
  ];
  if (!active) return null;

  const onSelectDisc = (id: string) => navigate({ search: { disc: id }, replace: true });

  return (
    <ProjectionsBody
      active={active}
      pickerGroups={pickerGroups}
      onSelectDisc={onSelectDisc}
      state={state}
    />
  );
}

function ProjectionsBody({
  active,
  pickerGroups,
  onSelectDisc,
  state,
}: {
  active: Discipline;
  pickerGroups: { label: string; disciplines: Discipline[] }[];
  onSelectDisc: (id: string) => void;
  state: Extract<ReturnType<typeof usePredictions>, { status: "ok" }>;
}) {
  const detail = useProjectionsDetail(active.id);

  // Sorted by podium chance, not rank -- rank is sorted by real season-best
  // mark, so the #1-ranked athlete isn't always the model's top probability
  // pick (upsets are real). Mirrors api.py's build_storylines fix for the
  // exact same bug (an earlier version of the photo-finish storyline
  // compared athletes[0]/[1] by rank and produced a real negative gap).
  const byProb = [...active.athletes].sort((a, b) => b.prob - a.prob);
  const probGap =
    byProb.length > 1 ? Math.round((byProb[0]?.prob ?? 0) - (byProb[1]?.prob ?? 0)) : null;

  let realRaces: number | null = null;
  let storylineCount: number | null = null;
  if (detail.status === "ok") {
    const currentYear =
      detail.data.trajectories.length > 0
        ? Math.max(...detail.data.trajectories.map((t) => t.historyYear ?? 0))
        : null;
    const comparable = detail.data.trajectories.filter((t) => t.historyYear === currentYear);
    realRaces = comparable.reduce((sum, t) => sum + t.history.length, 0);
    storylineCount = detail.data.storylines.length;
  }

  return (
    <Shell
      title="Projections"
      lastUpdated={state.data.lastUpdated}
      daysToFinal={state.data.daysToFinal}
      hero={
        <ProjectionsHero
          active={active}
          byProb={byProb}
          probGap={probGap}
          daysToFinal={state.data.daysToFinal}
        />
      }
    >
      {/* Mobile-only: a real <select> instead of the desktop pill wall.
       * The 44px touch-target fix (correct on its own) made every one of
       * the ~32 pills taller with nobody re-measuring the combined effect
       * -- the picker ballooned to 1136px tall on mobile, bigger than the
       * hero, caught live by the impeccable critique skill's re-run. A
       * native select collapses that to one ~44px control (already
       * correctly sized, natively accessible, no custom listbox needed)
       * without touching the desktop pill picker below, which was never
       * the problem. */}
      {/* De-boxed to match Track/Field, whose pickers already sit directly on
          the canvas. Wrapping this one in a card made Projections carry two
          extra boxes the other pages don't have. On-canvas labels must be
          light -- --muted-foreground is tuned for the light card surface. */}
      <div className="sm:hidden">
        <label className="label-caps mb-1.5 block text-white/92" htmlFor="disc-select">
          Discipline
        </label>
        <select
          id="disc-select"
          value={active.id}
          onChange={(e) => onSelectDisc(e.target.value)}
          className="w-full rounded-md border border-border bg-card px-3 py-3 text-[13.5px] font-medium text-foreground"
        >
          {pickerGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.disciplines.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="hidden space-y-2.5 sm:block">
        {pickerGroups.map((group) => (
          <div key={group.label} className="flex flex-wrap items-center gap-2">
            <span className="label-caps w-14 shrink-0 text-white/92">{group.label}</span>
            {group.disciplines.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onSelectDisc(d.id)}
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

      <ProjectionStatRow
        qualifiedCount={active.athletes.length}
        realRaces={realRaces}
        storylineCount={storylineCount}
        modelAccuracy={state.data.modelAccuracy}
        detailLoaded={detail.status === "ok"}
      />

      <DisciplineDetail discKey={active.id} discLabel={active.label} detail={detail} />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ConfidencePanel
          allDisciplines={[...state.data.trackDisciplines, ...state.data.fieldDisciplines]}
          activeId={active.id}
          onSelectDisc={onSelectDisc}
        />
        <ContendersPanel active={active} />
      </div>
    </Shell>
  );
}

const CONTENDERS_COLLAPSED_COUNT = 5;

/** Same top-N + "Show all" disclosure pattern as ConfidencePanel, applied
 * here for the same reason: capping at a fixed 5 with no way to see the
 * rest of the real qualified field is the identical "clutter vs. dead end"
 * problem the impeccable critique skill's re-run caught -- a storyline can
 * legitimately name an athlete (e.g. a real in-season improver) who isn't
 * in the top 5 by probability, with no way to find them on this panel. */
function ContendersPanel({ active }: { active: Discipline }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? active.athletes : active.athletes.slice(0, CONTENDERS_COLLAPSED_COUNT);

  return (
    <Panel title={`Contenders — ${active.label}`}>
      <ul className="space-y-3">
        {shown.map((a, i) => (
          <li
            key={a.name}
            className="stagger-item flex flex-wrap items-center gap-x-3 gap-y-1.5"
            style={{ "--stagger-i": Math.min(i, 10) } as CSSProperties}
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
      {active.athletes.length > CONTENDERS_COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="label-caps mt-3 w-full rounded-md py-2 text-center text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-terracotta-strong"
        >
          {expanded ? "Show less" : `Show all ${active.athletes.length}`}
        </button>
      )}
    </Panel>
  );
}

/** Real trajectories + real storylines for whichever discipline is active
 * (fetched lazily by the parent via useProjectionsDetail, passed in here so
 * the new stat row above can read the same response without a second
 * fetch). Chart wide-left, storylines narrow-right -- the same
 * `lg:grid-cols-[1.35fr_1fr]` pairing Dashboard already uses for its own
 * main-panel-plus-side-panel layout, rather than two full-width panels
 * stacked one under the other. That stacked layout was the biggest gap
 * next to the reference dashboards the user supplied: everything here
 * read as one column of large blocks instead of an actual multi-panel
 * dashboard grid. */
function DisciplineDetail({
  discKey,
  discLabel,
  detail,
}: {
  discKey: string;
  discLabel: string;
  detail: ReturnType<typeof useProjectionsDetail>;
}) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
      <Panel title={`Real season form — ${discLabel}`}>
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
      <Panel title={`Storylines — ${discLabel}`}>
        {detail.status === "ok" ? (
          <StorylineCards storylines={detail.data.storylines} discKey={discKey} />
        ) : (
          <div className="h-16" />
        )}
      </Panel>
    </div>
  );
}
