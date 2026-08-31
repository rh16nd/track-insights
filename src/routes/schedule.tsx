import type { CSSProperties } from "react";
import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, HeadFigure } from "@/components/dl/shell";
import { statusLabel } from "@/lib/dl-data";
import type { Meet } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";

export const Route = createFileRoute("/schedule")({
  head: () =>
    pageHead(
      "Schedule",
      "The full 2026 Wanda Diamond League calendar, from the season opener to the Final in Brussels.",
    ),
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

/** v0's headline is "Fourteen cities, then Brussels." — a real count of the
 * meetings that are not the Final. Spelled out to the point where a word
 * still reads better than a numeral, then it falls back to digits rather
 * than inventing vocabulary. */
const NUMBER_WORD: Record<number, string> = {
  10: "Ten",
  11: "Eleven",
  12: "Twelve",
  13: "Thirteen",
  14: "Fourteen",
  15: "Fifteen",
  16: "Sixteen",
};

function headline(meets: Meet[]): string {
  const final = meets.find((m) => m.status === "final");
  const others = meets.length - (final ? 1 : 0);
  if (others < 1) return "The road to the Final.";
  const word = NUMBER_WORD[others] ?? String(others);
  const host = final?.city.split("—")[0]?.trim().split("/")[0]?.trim();
  // Only promise a destination the data actually names.
  return host ? `${word} cities, then ${host}.` : `${word} cities, then the Final.`;
}

/** v0's timeline: a single rail with one node per meeting, rather than the
 * flat bulleted list this page used to be. The season is a route with an end
 * point, and a rail says that where a list of rows cannot — the Final gets a
 * bigger, haloed gold node so the thing everything leads to is visible at a
 * glance rather than being the row that happens to be last. */
function Timeline({ meets }: { meets: Meet[] }) {
  return (
    <ol className="relative pl-9">
      {/* Inset top and bottom so the rail starts and ends at the first and
          last node instead of overshooting into the panel padding. */}
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-0.5 bg-border" />
      {meets.map((m, i) => {
        const isFinal = m.status === "final";
        const done = m.status === "done";
        return (
          <li
            key={m.n}
            className="stagger-item relative grid grid-cols-[88px_1fr] items-center gap-x-3 py-3.5 sm:grid-cols-[120px_1fr_auto] sm:gap-x-5"
            style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
          >
            <span
              aria-hidden="true"
              className={
                isFinal
                  ? "absolute top-1/2 -left-[33px] z-[2] size-5 -translate-y-1/2 rounded-full border-2 border-gold-light bg-gold-strong shadow-[0_0_0_5px_oklch(0.8_0.11_68/0.25)]"
                  : `absolute top-1/2 -left-[30px] z-[2] size-3.5 -translate-y-1/2 rounded-full border-2 ${
                      done ? "border-terracotta bg-terracotta" : "border-border bg-secondary"
                    }`
              }
            />
            <span
              className={`dg nums text-[15px] font-bold tracking-[-0.01em] ${
                isFinal ? "text-gold-strong" : "text-muted-foreground"
              }`}
            >
              {meetDate(m)}
            </span>
            <span className="min-w-0">
              <span
                className={`dg block truncate font-semibold text-foreground ${
                  isFinal ? "text-[19px] sm:text-[22px]" : "text-[16px] sm:text-[17px]"
                }`}
              >
                {m.city}
              </span>
              <span className="dg block text-[12px] tracking-[0.06em] text-muted-foreground">
                Meeting {m.n} of {meets.length}
              </span>
            </span>
            <span
              className={`label-caps hidden shrink-0 rounded-full px-3 py-1.5 sm:inline-flex ${
                isFinal
                  ? "bg-[linear-gradient(100deg,var(--terracotta)_0%,var(--gold-strong)_100%)] text-card"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {statusLabel[m.status]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function SchedulePage() {
  const state = usePredictions();
  const data = state.status === "ok" ? state.data : undefined;
  const meets = data?.meets ?? [];
  const doneCount = meets.filter((m) => m.status === "done").length;
  const final = meets.find((m) => m.status === "final");

  // Header persists through loading/error -- see the note in track.tsx.
  return (
    <Shell
      title={data ? headline(meets) : "Schedule"}
      crumb="Schedule"
      eyebrow={data ? `2026 season · ${meets.length} meetings` : "2026 season"}
      description={
        data
          ? `The full Wanda Diamond League season, from the opener to the Final in Brussels. ${doneCount} of ${meets.length} meetings are scored.`
          : "The full Wanda Diamond League season, from the opener to the Final in Brussels."
      }
      figures={
        data ? (
          <>
            <HeadFigure value={meets.length} label="Meetings in the series" />
            <HeadFigure value={doneCount} label="Already run" />
            {final && <HeadFigure value={meetDate(final)} label="The Final" gold />}
          </>
        ) : undefined
      }
      lastUpdated={data?.lastUpdated}
      daysToFinal={data?.daysToFinal}
    >
      {state.status === "loading" && <PanelSkeleton title="The road to the Final" rows={8} />}
      {state.status === "error" && <ErrorPanel message={state.message} />}
      {data && (
        <Panel
          title="The road to the Final"
          subtitle="The 2026 Diamond League circuit, in order. Gold marks the Final — the only meeting on this list that decides anything."
        >
          <Timeline meets={meets} />
        </Panel>
      )}
    </Shell>
  );
}
