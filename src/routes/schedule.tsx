import type { CSSProperties } from "react";
import { pageHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, HeadFigure } from "@/components/dl/shell";
import type { Meet, UltimateEvent } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";
import { useUltimate } from "@/hooks/useUltimate";
import { useT, type Lang } from "@/lib/i18n";
import { localeTag, localizeDate, localizeMonth } from "@/lib/dates";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/schedule")({
  head: () =>
    pageHead(
      "Schedule",
      "The next big championship, and the 2026 Diamond League season that led up to it.",
    ),
  component: SchedulePage,
});

/** "16 May", or "04–05 Sep" when a meeting runs two days.
 *
 * The months are compared RAW, before translation: they arrive from the API in
 * English, and localising first would break the same-month test for every
 * French reader -- the same trap as the season-shape chart's best-month bar. */
function meetDate(meet: Meet, lang: Lang): string {
  if (!meet.dateEnd) return localizeDate(lang, meet.date);
  const [startDay, startMonth] = meet.date.split(" ");
  const [endDay, endMonth] = meet.dateEnd.split(" ");
  return startMonth === endMonth && endMonth
    ? `${startDay}–${endDay} ${localizeMonth(lang, endMonth)}`
    : `${localizeDate(lang, meet.date)} – ${localizeDate(lang, meet.dateEnd)}`;
}

function daysTo(startDate: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(`${startDate}T00:00:00`).getTime() - Date.now()) / 86_400_000),
  );
}

function eventDates(ev: UltimateEvent, lang: Lang): string {
  const start = new Date(`${ev.startDate}T00:00:00`);
  const end = new Date(`${ev.endDate}T00:00:00`);
  const month = new Intl.DateTimeFormat(localeTag(lang), {
    month: "long",
  }).format(end);
  return `${start.getDate()}–${end.getDate()} ${month} ${end.getFullYear()}`;
}

/** The marquee: the next championship, front and centre, linking through to the
 * immersive Ultimate tab. A light accented card here (the full dark treatment
 * lives on the Ultimate page itself). */
function UpcomingMarquee({ ev, lang }: { ev: UltimateEvent; lang: Lang }) {
  const { t } = useT();
  const days = daysTo(ev.startDate);
  return (
    <Link
      to="/ultimate"
      className="card-shadow group mb-6 block overflow-hidden rounded-[26px] border border-gold-light/60 bg-card p-6 transition-[transform,border-color] duration-150 hover:-translate-y-0.5 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="label-caps text-gold-strong">{t("schedule.upcoming.title")}</span>
          <div className="dg mt-1.5 text-[22px] font-bold tracking-[-0.02em] text-foreground sm:text-[26px]">
            {ev.name}
          </div>
          <div className="mt-1 text-[13.5px] text-muted-foreground">
            {t("schedule.upcoming.when", {
              dates: eventDates(ev, lang),
              venue: ev.venue,
              city: ev.city,
            })}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="dg nums block text-[40px] font-bold leading-none text-gold-strong">
              {days}
            </span>
            <span className="label-caps text-muted-foreground">{t("ultimate.stat.days")}</span>
          </div>
          <span className="label-caps shrink-0 rounded-full border border-border px-3 py-1.5 text-muted-foreground transition-colors group-hover:border-terracotta/40 group-hover:text-foreground">
            {t("schedule.upcoming.cta")}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Timeline({ meets }: { meets: Meet[] }) {
  const { t, lang } = useT();
  return (
    <ol className="relative pl-9">
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
              {meetDate(m, lang)}
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
  const { t, lang } = useT();
  usePageTitle(t("nav.schedule"));
  const state = usePredictions();
  const ultimateState = useUltimate();
  const data = state.status === "ok" ? state.data : undefined;
  const ev = ultimateState.status === "ok" ? ultimateState.data : undefined;
  const meets = data?.meets ?? [];
  const doneCount = meets.filter((m) => m.status === "done").length;

  return (
    <Shell
      title={t("schedule.titleNext")}
      crumb={t("nav.schedule")}
      eyebrow={
        ev ? t("schedule.eyebrowNext", { n: daysTo(ev.startDate) }) : t("schedule.eyebrowBare")
      }
      description={t("schedule.descriptionNext")}
      figures={
        ev || data ? (
          <>
            {ev && <HeadFigure value={daysTo(ev.startDate)} label={t("ultimate.stat.days")} gold />}
            {ev && <HeadFigure value={eventDates(ev, lang)} label={t("schedule.figNext")} />}
            {data && <HeadFigure value={doneCount} label={t("schedule.figSeasonRun")} />}
          </>
        ) : undefined
      }
    >
      {state.status === "loading" && <PanelSkeleton title={t("schedule.season.title")} rows={8} />}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}
      {data && (
        <>
          {ev && <UpcomingMarquee ev={ev} lang={lang} />}
          <Panel title={t("schedule.season.title")} subtitle={t("schedule.season.subtitle")}>
            <Timeline meets={meets} />
          </Panel>
        </>
      )}
    </Shell>
  );
}
