import type { CSSProperties } from "react";
import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, HeadFigure } from "@/components/dl/shell";
import type { Meet } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";
import { useT, type TFunc } from "@/lib/i18n";

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
function headline(meets: Meet[], t: TFunc): string {
  const final = meets.find((m) => m.status === "final");
  const others = meets.length - (final ? 1 : 0);
  if (others < 1) return t("schedule.headlineRoad");
  // t() falls back to the key itself when a string is missing, which is the
  // signal that this count has no spelled-out word -- use digits then.
  const numKey = `schedule.num.${others}`;
  const word = t(numKey) === numKey ? String(others) : t(numKey);
  const host = final?.city.split("—")[0]?.trim().split("/")[0]?.trim();
  // Only promise a destination the data actually names.
  return host
    ? t("schedule.headlineCities", { word, host })
    : t("schedule.headlineCitiesFinal", { word });
}

/** v0's timeline: a single rail with one node per meeting, rather than the
 * flat bulleted list this page used to be. The season is a route with an end
 * point, and a rail says that where a list of rows cannot — the Final gets a
 * bigger, haloed gold node so the thing everything leads to is visible at a
 * glance rather than being the row that happens to be last. */
function Timeline({ meets }: { meets: Meet[] }) {
  const { t } = useT();
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
                {t("schedule.meetingOf", { n: m.n, total: meets.length })}
              </span>
            </span>
            <span
              className={`label-caps hidden shrink-0 rounded-full px-3 py-1.5 sm:inline-flex ${
                isFinal
                  ? "bg-[linear-gradient(100deg,var(--terracotta)_0%,var(--gold-strong)_100%)] text-card"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {t(`meet.status.${m.status}`)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function SchedulePage() {
  const { t } = useT();
  const state = usePredictions();
  const data = state.status === "ok" ? state.data : undefined;
  const meets = data?.meets ?? [];
  const doneCount = meets.filter((m) => m.status === "done").length;
  const final = meets.find((m) => m.status === "final");

  // Header persists through loading/error -- see the note in track.tsx.
  return (
    <Shell
      title={data ? headline(meets, t) : t("nav.schedule")}
      crumb={t("nav.schedule")}
      eyebrow={
        data ? t("schedule.eyebrow", { n: meets.length }) : t("schedule.eyebrowBare")
      }
      description={
        data
          ? t("schedule.descriptionWithCount", { done: doneCount, total: meets.length })
          : t("schedule.description")
      }
      figures={
        data ? (
          <>
            <HeadFigure value={meets.length} label={t("schedule.figMeetings")} />
            <HeadFigure value={doneCount} label={t("schedule.figAlreadyRun")} />
            {final && <HeadFigure value={meetDate(final)} label={t("schedule.figTheFinal")} gold />}
          </>
        ) : undefined
      }
      lastUpdated={data?.lastUpdated}
      daysToFinal={data?.daysToFinal}
    >
      {state.status === "loading" && <PanelSkeleton title={t("schedule.panelTitle")} rows={8} />}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}
      {data && (
        <Panel
          title={t("schedule.panelTitle")}
          subtitle={t("schedule.panelSubtitle")}
        >
          <Timeline meets={meets} />
        </Panel>
      )}
    </Shell>
  );
}
