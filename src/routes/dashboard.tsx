import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import {
  Shell,
  Panel,
  ProbabilityBar,
  RankBadge,
  WatchBadge,
  dotClass,
  badgeClass,
} from "@/components/dl/shell";
import { statusLabel } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";
import { useCountUp } from "@/hooks/useCountUp";

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

function Dashboard() {
  const state = usePredictions();

  if (state.status === "loading") {
    return (
      <Shell title="Dashboard">
        <div className="card-shadow flex h-64 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
          Loading live predictions...
        </div>
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell title="Dashboard">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          <div className="font-semibold mb-1">Could not load predictions</div>
          <div>{state.message}</div>
          <div className="mt-2 text-xs">
            Make sure <code>python api.py</code> is running in your athletics-predictor folder.
          </div>
        </div>
      </Shell>
    );
  }

  const { data } = state;
  const doneCount = data.meets.filter((m) => m.status === "done").length;
  const totalCount = data.meets.length;
  const progressPct = Math.round((doneCount / totalCount) * 100);

  const stats = [
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
      sub: "walk-forward '23-'25",
      icon: "target" as const,
      accent: "text-terracotta-light",
    },
  ];

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
          {stats.map((s, i) => (
            <StatTile key={s.label} index={i} {...s} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Shell
      title="Dashboard"
      hero={hero}
      lastUpdated={data.lastUpdated}
      daysToFinal={data.daysToFinal}
    >
      {data.removedAthletes.length > 0 && (
        <Panel title="Removed from predictions — injury/withdrawal" className="mt-4">
          <ul className="divide-y divide-border">
            {data.removedAthletes.map((r) => (
              <li
                key={r.name}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium text-foreground">{r.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">
                    {r.disciplines.join(", ")}
                  </div>
                </div>
                {r.reason && (
                  <a
                    href={r.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 truncate text-[12px] text-destructive hover:underline max-w-[45%]"
                  >
                    {r.reason}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Panel title="Top predicted winners">
          <ul className="divide-y divide-border">
            {data.topWinners.map((w, i) => (
              <li
                key={w.name}
                className="stagger-item flex flex-wrap items-center gap-x-3 gap-y-1.5 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-secondary/30"
                style={{ "--stagger-i": i } as CSSProperties}
              >
                <RankBadge rank={w.rank} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={w.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-[13.5px] font-medium text-foreground hover:text-terracotta-strong hover:underline transition-colors"
                    >
                      {w.name}
                    </a>
                    {w.injuryWatch && <WatchBadge reason={w.injuryReason} url={w.injuryUrl} />}
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">{w.disc}</div>
                </div>
                <div className="flex w-full items-center justify-between gap-3 pl-9 sm:w-auto sm:justify-end sm:pl-0">
                  <div className="nums text-[13px] font-medium text-foreground sm:w-20 sm:text-right">
                    {w.mark}
                  </div>
                  <div className="w-24">
                    <div className="nums text-right text-[12px] font-semibold text-terracotta-strong">
                      {w.prob}%
                    </div>
                    <ProbabilityBar value={w.prob} className="mt-1.5" trackHeight="h-1.5" />
                  </div>
                </div>
              </li>
            ))}
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

          <Panel title="Upcoming calendar">
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
    </Shell>
  );
}
