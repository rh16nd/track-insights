import { createFileRoute } from "@tanstack/react-router";
import {
  Shell,
  Panel,
  PanelSkeleton,
  ErrorPanel,
  dotClass,
  badgeClass,
} from "@/components/dl/shell";
import { statusLabel } from "@/lib/dl-data";
import type { Meet } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/schedule")({
  component: SchedulePage,
});

/** Four 2026 meetings run over two days. The list used to show a single
 * day for each and picked inconsistently -- day 2 for Lausanne, Silesia and
 * Zürich, day 1 for everything else -- so the span is now stated instead of
 * one of its days being chosen. The month is printed once when both days
 * share it, which is every real case this season. */
function meetDate(meet: Meet): string {
  if (!meet.dateEnd) return meet.date;
  const [startDay, startMonth] = meet.date.split(" ");
  const [endDay, endMonth] = meet.dateEnd.split(" ");
  return startMonth === endMonth
    ? `${startDay}–${endDay} ${endMonth}`
    : `${meet.date} – ${meet.dateEnd}`;
}

function SchedulePage() {
  const state = usePredictions();
  const data = state.status === "ok" ? state.data : undefined;
  const doneCount = data ? data.meets.filter((m) => m.status === "done").length : 0;

  // Header persists through loading/error -- see the note in track.tsx.
  return (
    <Shell
      title="Schedule"
      eyebrow={data ? `2026 season · ${data.meets.length} meetings` : "2026 season"}
      description={
        data
          ? `The full Wanda Diamond League season, from the opener to the Final in Brussels. ${doneCount} of ${data.meets.length} meetings are scored.`
          : "The full Wanda Diamond League season, from the opener to the Final in Brussels."
      }
      lastUpdated={data?.lastUpdated}
      daysToFinal={data?.daysToFinal}
    >
      {state.status === "loading" && (
        <PanelSkeleton title="2026 Diamond League calendar" rows={8} />
      )}
      {state.status === "error" && <ErrorPanel message={state.message} />}
      {data && (
        <Panel title="2026 Diamond League calendar">
          <ul className="divide-y divide-border">
            {data.meets.map((m) => (
              <li key={m.n} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4">
                <span className="nums w-6 shrink-0 text-[12px] text-muted-foreground">
                  {String(m.n).padStart(2, "0")}
                </span>
                <span className={`size-2 shrink-0 rounded-full ${dotClass[m.status]}`} />
                <span className="nums w-[76px] shrink-0 text-[13px] text-muted-foreground sm:w-24">
                  {meetDate(m)}
                </span>
                {/* min-w-0 so a long city name wraps instead of forcing the
                    row wider than the viewport -- a flex item will not
                    shrink below its content's width without it, and
                    "Shaoxing/Keqiao" is wide enough to matter at 375px. */}
                <span
                  className={[
                    "min-w-0 flex-1 text-[14px]",
                    m.status === "done" ? "text-muted-foreground" : "",
                    m.status === "final" ? "font-semibold text-gold-strong" : "",
                    m.status === "next" ? "font-semibold text-foreground" : "",
                    m.status === "upcoming" ? "text-foreground" : "",
                  ].join(" ")}
                >
                  {m.city}
                </span>
                <span className={`label-caps rounded-sm px-2 py-1 ${badgeClass[m.status]}`}>
                  {statusLabel[m.status]}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </Shell>
  );
}
