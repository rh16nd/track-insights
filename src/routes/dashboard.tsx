import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import {
  Shell,
  Panel,
  PanelSkeleton,
  ErrorPanel,
  ProbabilityBar,
  AthleteAvatar,
  WatchBadge,
  dotClass,
  badgeClass,
} from "@/components/dl/shell";
import { statusLabel, type TopWinner } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";
import { useCountUp } from "@/hooks/useCountUp";
import { NewsFeed } from "@/components/dl/news-feed";

const LAST_PROBS_KEY = "podiumcall:lastProbs";

/** Real, honest trend signal for a repeat visitor: compares today's
 * probabilities against whatever this browser last saw (localStorage, not
 * a fabricated number or a backend history endpoint that doesn't exist
 * yet). First-ever visit shows no deltas -- there's nothing true to compare
 * against -- and only genuinely-changed athletes get a chip. Added per the
 * 2026-08-24 critique: the product's whole premise is live, updating
 * predictions, but nothing on the page ever showed what moved. */
function useProbabilityDeltas(topWinners: TopWinner[] | undefined) {
  const [deltas, setDeltas] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!topWinners) return;
    let previous: Record<string, number> = {};
    try {
      previous = JSON.parse(localStorage.getItem(LAST_PROBS_KEY) ?? "{}");
    } catch {
      previous = {};
    }
    const computed: Record<string, number> = {};
    const next: Record<string, number> = {};
    for (const w of topWinners) {
      next[w.name] = w.prob;
      const prior = previous[w.name];
      if (typeof prior === "number" && prior !== w.prob) {
        computed[w.name] = w.prob - prior;
      }
    }
    setDeltas(computed);
    try {
      localStorage.setItem(LAST_PROBS_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable (private browsing, quota) -- delta signal
      // just won't persist to the next visit; not worth surfacing an error
      // for.
    }
  }, [topWinners]);
  return deltas;
}

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

/* Small hand-drawn 20x20 line icons, matching the landing page's existing
 * icon pattern (index.tsx) instead of pulling in an icon-library dependency
 * -- one glyph per stat, so the tile row reads at a glance instead of as
 * four identical generic number blocks. */
function StatIcon({ kind }: { kind: "flag" | "calendar" | "grid" | "target" }) {
  const common = {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-[18px]",
    "aria-hidden": true,
  };
  if (kind === "flag") {
    return (
      <svg {...common}>
        <path d="M5 2.5v15" />
        <path d="M5 3.5h11l-3.2 3.2 3.2 3.2H5" />
      </svg>
    );
  }
  if (kind === "calendar") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="14" height="13" rx="2" />
        <path d="M3 8h14M7 2.5v3M13 2.5v3" />
      </svg>
    );
  }
  if (kind === "grid") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="11" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="11" width="6" height="6" rx="1" />
        <rect x="11" y="11" width="6" height="6" rx="1" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="10" cy="10" r="6.5" />
      <circle cx="10" cy="10" r="3.5" />
      <circle cx="10" cy="10" r="0.6" fill="currentColor" />
    </svg>
  );
}

function StatTile({
  label,
  value,
  suffix = "",
  sub,
  icon,
  accent,
  index,
}: {
  label: string;
  value: number;
  suffix?: string;
  sub: string;
  icon: "flag" | "calendar" | "grid" | "target";
  accent: string;
  index: number;
}) {
  const animated = useCountUp(value);
  return (
    <div className="stagger-item" style={{ "--stagger-i": index } as CSSProperties}>
      <div className={`flex items-center gap-1.5 ${accent}`}>
        <StatIcon kind={icon} />
        <span className="label-caps text-white/75">{label}</span>
      </div>
      <div
        className="nums mt-2.5 text-[30px] font-semibold leading-none tracking-tight text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {Math.round(animated)}
        {suffix}
      </div>
      <div className="nums mt-1.5 text-[12px] text-white/75">{sub}</div>
    </div>
  );
}

/** Same footprint as a real StatTile (icon + label row, big number, sub
 * line) so the hero doesn't jump/reflow once real data arrives -- filled
 * with themed pulses instead of a fabricated number, since nothing true is
 * known yet. */
function StatTileSkeleton({ index }: { index: number }) {
  return (
    <div className="stagger-item" style={{ "--stagger-i": index } as CSSProperties}>
      <div className="flex items-center gap-1.5">
        <span className="skeleton-pulse size-[18px] rounded bg-white" />
        <span className="skeleton-pulse h-2.5 w-16 rounded-full bg-white" />
      </div>
      <span className="skeleton-pulse mt-2.5 block h-[26px] w-12 rounded-md bg-white" />
      <span className="skeleton-pulse mt-2 block h-2.5 w-20 rounded-full bg-white" />
    </div>
  );
}

function Dashboard() {
  const state = usePredictions();
  const data = state.status === "ok" ? state.data : undefined;
  const deltas = useProbabilityDeltas(data?.topWinners);

  const doneCount = data ? data.meets.filter((m) => m.status === "done").length : 0;
  const totalCount = data ? data.meets.length : 0;
  const progressPct = data && totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const stats = data
    ? [
        {
          label: "Meets done",
          value: doneCount,
          sub: `of ${totalCount}`,
          icon: "flag" as const,
          accent: "text-terracotta-light",
        },
        {
          label: "Days to final",
          value: data.daysToFinal,
          sub: "Brussels, 04 Sep",
          icon: "calendar" as const,
          accent: "text-gold-light",
        },
        {
          label: "Disciplines",
          value: data.trackDisciplines.length + data.fieldDisciplines.length,
          sub: "tracked",
          icon: "grid" as const,
          accent: "text-gold-light",
        },
        {
          label: "Model accuracy",
          value: Math.round(data.modelAccuracy),
          suffix: "%",
          // Says which of the two backtest numbers this is. The caption
          // used to read only "walk-forward '23-'25", which was true of
          // both and identified neither.
          sub: data.modelAccuracyBasis,
          icon: "target" as const,
          accent: "text-terracotta-light",
        },
      ]
    : null;

  // The branded track-surface hero now stays on screen through every state
  // (loading, error, success) instead of dropping to a generic gray box --
  // the 2026-08-24 critique found that exact swap happened at the worst
  // possible moment: a first-time visitor's or anxious daily-checker's
  // first paint. Stat tiles become themed skeleton pulses rather than
  // showing a fabricated number while real data is still in flight.
  const hero = (
    <div className="track-surface relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-background/85" />
      <div className="relative px-6 pb-6 pt-7 sm:px-8 sm:pt-8">
        <h1
          className="text-[24px] font-semibold tracking-tight text-white sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <p className="mt-1.5 max-w-lg text-[13.5px] leading-relaxed text-white/75">
          Live predictions for the 2026 Diamond League Final, updated straight from the model.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {stats
            ? stats.map((s, i) => <StatTile key={s.label} index={i} {...s} />)
            : [0, 1, 2, 3].map((i) => <StatTileSkeleton key={i} index={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <Shell
      title="Dashboard"
      hero={hero}
      lastUpdated={data?.lastUpdated}
      daysToFinal={data?.daysToFinal}
    >
      {state.status === "loading" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
          <PanelSkeleton title="Most likely to reach the podium" rows={6} />
          <PanelSkeleton title="Season progress" rows={3} />
        </div>
      )}

      {state.status === "error" && <ErrorPanel message={state.message} />}

      {/* The "Removed from predictions — injury/withdrawal" panel used to sit
          here, between the hero and the real content. It was deleted rather
          than moved: NewsFeed at the bottom of this page is a strict superset
          of it -- same athlete, disciplines, headline and source link, plus
          the keyword the checker matched on -- so the panel was duplicating
          the page's most valuable vertical space. api.py's build_news() now
          guarantees a row for every removed athlete even when the match has
          no usable headline, so nothing can go unlisted. `removedAthletes`
          is still on the API and still tested; it just has no UI. */}

      {data && (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
          <Panel
            title="Most likely to reach the podium"
            subtitle="The model's strongest pick in each discipline — chance of finishing top three, not of winning"
          >
            <ul className="divide-y divide-border">
              {data.topWinners.map((w, i) => {
                const delta = deltas[w.name];
                return (
                  <li
                    key={w.name}
                    className="stagger-item py-3 first:pt-0 last:pb-0"
                    style={{ "--stagger-i": i } as CSSProperties}
                  >
                    <Link
                      to="/athlete/$discKey/$name"
                      params={{ discKey: w.discKey, name: w.name }}
                      className="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md transition-[background-color,transform] duration-150 hover:bg-secondary/30 active:scale-[0.99]"
                    >
                      <AthleteAvatar name={w.name} highlight={i === 0} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[13.5px] font-medium text-foreground">
                            {w.name}
                          </span>
                          {w.injuryWatch && (
                            <WatchBadge reason={w.injuryReason} url={w.injuryUrl} />
                          )}
                        </div>
                        <div className="text-[11.5px] text-muted-foreground">{w.disc}</div>
                      </div>
                      <div className="flex w-full items-center justify-between gap-3 pl-9 sm:w-auto sm:justify-end sm:pl-0">
                        <div className="nums text-[13px] font-medium text-foreground sm:w-20 sm:text-right">
                          {w.mark}
                        </div>
                        <div className="w-24">
                          <div className="flex items-center justify-end gap-1.5">
                            {typeof delta === "number" && (
                              <span
                                className={`delta-chip nums text-[10.5px] font-semibold ${delta > 0 ? "text-gold-strong" : "text-muted-foreground"}`}
                                title={`${delta > 0 ? "Up" : "Down"} ${Math.abs(delta)} pt${Math.abs(delta) === 1 ? "" : "s"} since your last visit`}
                              >
                                {delta > 0 ? "▲" : "▼"}
                                {Math.abs(delta)}
                              </span>
                            )}
                            <span className="nums text-right text-[12px] font-semibold text-terracotta-strong">
                              {w.prob}%
                            </span>
                          </div>
                          <ProbabilityBar value={w.prob} className="mt-1.5" trackHeight="h-1.5" />
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <div className="space-y-4">
            <Panel title="Season progress">
              <div className="flex items-baseline justify-between">
                <span className="nums text-[28px] font-semibold leading-none text-foreground">
                  {progressPct}%
                </span>
                <span className="nums text-[12px] text-muted-foreground">
                  {doneCount} of {totalCount} meets scored
                </span>
              </div>
              <ProbabilityBar value={progressPct} className="mt-4" trackHeight="h-2" />
            </Panel>

            <Panel
              title="Upcoming calendar"
              action={
                <Link to="/schedule" className="label-caps text-terracotta-strong hover:underline">
                  View full schedule →
                </Link>
              }
            >
              <ul className="space-y-2.5">
                {data.meets.slice(-5).map((m) => (
                  <li key={m.n} className="flex items-center gap-3">
                    <span className={`size-1.5 shrink-0 rounded-full ${dotClass[m.status]}`} />
                    <span className="nums w-14 text-[12px] text-muted-foreground">{m.date}</span>
                    <span
                      className={[
                        "flex-1 truncate text-[13px]",
                        m.status === "done" ? "text-muted-foreground" : "text-foreground",
                        m.status === "next" ? "font-semibold" : "",
                        m.status === "final" ? "font-semibold text-gold-strong" : "",
                      ].join(" ")}
                    >
                      {m.city}
                    </span>
                    <span className={`label-caps rounded-sm px-1.5 py-1 ${badgeClass[m.status]}`}>
                      {statusLabel[m.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      )}

      {/* Bottom of the dashboard: the evidence behind every injury flag and
          every athlete missing from the field. Previously this only existed
          as a tooltip on a badge. */}
      {data && <NewsFeed />}
    </Shell>
  );
}
