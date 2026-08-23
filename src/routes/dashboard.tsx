import { createFileRoute } from "@tanstack/react-router";
import { Shell, Panel, RankBadge, WatchBadge, dotClass, badgeClass } from "@/components/dl/shell";
import { statusLabel } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const state = usePredictions();

  if (state.status === "loading") {
    return (
      <Shell title="Dashboard">
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading live predictions...
        </div>
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell title="Dashboard">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
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
    { label: "Meets done", value: String(doneCount), sub: `of ${totalCount}` },
    { label: "Days to final", value: String(data.daysToFinal), sub: "Brussels, 04 Sep" },
    {
      label: "Disciplines",
      value: String(data.trackDisciplines.length + data.fieldDisciplines.length),
      sub: "tracked",
    },
    {
      label: "Model accuracy",
      value: `${Math.round(data.modelAccuracy)}%`,
      sub: "walk-forward '23-'25",
    },
  ];

  return (
    <Shell title="Dashboard" lastUpdated={data.lastUpdated} daysToFinal={data.daysToFinal}>
      <div className="grid grid-cols-2 divide-y divide-border rounded-xl bg-card sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {stats.map((s) => (
          <div key={s.label} className="p-5">
            <div className="label-caps text-muted-foreground">{s.label}</div>
            <div className="nums mt-3 text-[32px] font-semibold leading-none tracking-tight text-foreground">
              {s.value}
            </div>
            <div className="nums mt-2 text-[12px] text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

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
            {data.topWinners.map((w) => (
              <li key={w.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <RankBadge rank={w.rank} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={w.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-[13.5px] font-medium text-foreground hover:text-terracotta hover:underline transition-colors"
                    >
                      {w.name}
                    </a>
                    {w.injuryWatch && <WatchBadge reason={w.injuryReason} url={w.injuryUrl} />}
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">{w.disc}</div>
                </div>
                <div className="nums w-20 text-right text-[13px] font-medium text-foreground">
                  {w.mark}
                </div>
                <div className="w-24">
                  <div className="nums text-right text-[12px] font-semibold text-terracotta">
                    {w.prob}%
                  </div>
                  <div className="mt-1 h-1 w-full rounded-full bg-secondary">
                    <div
                      className="h-1 rounded-full bg-terracotta"
                      style={{ width: `${w.prob}%` }}
                    />
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
            <div className="mt-4 h-2 w-full rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-terracotta"
                style={{ width: `${progressPct}%` }}
              />
            </div>
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
                      m.status === "final" ? "font-semibold text-gold" : "",
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
