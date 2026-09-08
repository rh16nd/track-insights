import { pageHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { Shell, Panel, PanelSkeleton, ErrorPanel, HeadFigure } from "@/components/dl/shell";
import { discName } from "@/lib/dl-data";
import type { UltimateEvent, WorldRankings } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";
import { useUltimate } from "@/hooks/useUltimate";
import { useWorldRankings } from "@/hooks/useWorldRankings";
import { useCountUp } from "@/hooks/useCountUp";
import { NatFlag } from "@/components/dl/nat-flag";
import { AthleteCard } from "@/components/dl/athlete-card";
import { NewsFeed } from "@/components/dl/news-feed";
import { WelcomeLauncher } from "@/components/dl/welcome-modal";
import { useT } from "@/lib/i18n";
import { localeTag } from "@/lib/dates";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageHead(
      "Dashboard",
      "The model's read on the world's best across every event, with the next championship days away.",
    ),
  component: Dashboard,
});

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
  if (kind === "flag") {
    return (
      <svg {...common}>
        <path d="M5 2.5v15" />
        <path d="M5 3.5h11l-3.2 3.2 3.2 3.2H5" />
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

function CountUpValue({ value }: { value: number }) {
  return <>{Math.round(useCountUp(value))}</>;
}

function daysTo(startDate: string): number {
  const start = new Date(`${startDate}T00:00:00`);
  return Math.max(0, Math.ceil((start.getTime() - Date.now()) / 86_400_000));
}

type Favourite = {
  discKey: string;
  disc: string;
  name: string;
  nat: string | null;
  mark: string | null;
  ratingPct: number;
  photoUrl?: string | null;
  photoCredit?: { author?: string | null; license?: string | null } | null;
  photoFocus?: { x: number; y: number } | null;
};

function buildFavourites(
  rankings: WorldRankings,
  t: (k: string, v?: Record<string, string | number>) => string,
): Favourite[] {
  const rows: Favourite[] = [];
  for (const [key, r] of Object.entries(rankings)) {
    const top = r.model[0];
    if (!top) continue;
    rows.push({
      discKey: key,
      disc: discName(t, key, key),
      name: top.name,
      nat: top.nat,
      mark: top.mark,
      ratingPct: top.ratingPct,
      photoUrl: top.photoUrl ?? null,
      photoCredit: top.photoCredit ?? null,
      photoFocus: top.photoFocus ?? null,
    });
  }
  return rows.sort((a, b) => b.ratingPct - a.ratingPct);
}

/** Disciplines where the model's top pick is NOT the points leader — the
 * model's contrarian calls, the most interesting thing it says. */
function buildDisagreements(
  rankings: WorldRankings,
  t: (k: string, v?: Record<string, string | number>) => string,
) {
  const rows = [];
  for (const [key, r] of Object.entries(rankings)) {
    const m = r.model[0];
    const p = r.points[0];
    if (!m || !p || m.name === p.name) continue;
    rows.push({
      discKey: key,
      disc: discName(t, key, key),
      modelName: m.name,
      modelRating: m.ratingPct,
      pointsName: p.name,
    });
  }
  return rows.sort((a, b) => b.modelRating - a.modelRating);
}

/** The dashboard's favourite, as a photo card.
 *
 * Replaces a text-only tile at the user's request, after they pointed at World
 * Athletics' own rankings carousel: photo, event across the foot of it, name,
 * nation, then the one number. The shared component is used as-is rather than
 * restyled here, so this and the country pages cannot drift into two cards
 * that merely resemble each other. */
function FavouriteCard({ f, index }: { f: Favourite; index: number }) {
  const { t } = useT();
  return (
    <AthleteCard
      name={f.name}
      nat={f.nat}
      discipline={f.disc}
      stat={`${f.ratingPct}%`}
      statLabel={t("dashboard.fav.rating")}
      sub={f.mark}
      photoUrl={f.photoUrl}
      photoCredit={f.photoCredit}
      photoFocus={f.photoFocus}
      to={{ discKey: f.discKey, name: f.name }}
      index={index}
    />
  );
}

function Dashboard() {
  const { t, lang } = useT();
  usePageTitle(t("nav.dashboard"));
  const predictions = usePredictions();
  const ultimateState = useUltimate();
  const rankingsState = useWorldRankings();

  const ev: UltimateEvent | undefined =
    ultimateState.status === "ok" ? ultimateState.data : undefined;
  const rankings = rankingsState.status === "ok" ? rankingsState.data : undefined;
  const accuracy = predictions.status === "ok" ? Math.round(predictions.data.modelAccuracy) : null;
  const lastUpdated = predictions.status === "ok" ? predictions.data.lastUpdated : undefined;

  const favourites = rankings ? buildFavourites(rankings, t) : [];
  const disagreements = rankings ? buildDisagreements(rankings, t) : [];
  const discCount = rankings ? Object.keys(rankings).length : 0;

  const figures =
    ev && rankings ? (
      <>
        <HeadFigure
          value={<CountUpValue value={daysTo(ev.startDate)} />}
          label={t("ultimate.stat.days")}
          gold
          icon={<StatIcon kind="calendar" />}
        />
        <HeadFigure
          value={<CountUpValue value={ev.eventCount} />}
          label={t("ultimate.stat.events")}
          icon={<StatIcon kind="grid" />}
        />
        {accuracy !== null && (
          <HeadFigure
            value={<CountUpValue value={accuracy} />}
            unit="%"
            label={t("dashboard.stat.hitRate")}
            hint={t("dashboard.stat.hitRateHint")}
            icon={<StatIcon kind="target" />}
          />
        )}
        <HeadFigure
          value={<CountUpValue value={discCount} />}
          label={t("dashboard.stat.disciplines")}
          icon={<StatIcon kind="flag" />}
        />
      </>
    ) : (
      <>
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <span className="skeleton-pulse block h-10 w-16 rounded-md bg-white" />
            <span className="skeleton-pulse mt-3 block h-2.5 w-24 rounded-full bg-white" />
          </div>
        ))}
      </>
    );

  const loading = ultimateState.status === "loading" || rankingsState.status === "loading";
  const error =
    rankingsState.status === "error"
      ? rankingsState
      : ultimateState.status === "error"
        ? ultimateState
        : null;

  return (
    <Shell
      title={t("dashboard.titleBare")}
      eyebrow={ev ? t("dashboard.eventEyebrow", { short: ev.shortName, name: ev.name }) : undefined}
      crumb={t("nav.dashboard")}
      description={t("dashboard.description")}
      figures={figures}
      lastUpdated={lastUpdated}
    >
      {loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
          <PanelSkeleton title={t("dashboard.favourites.title")} rows={6} />
          <PanelSkeleton title={t("dashboard.disagree.title")} rows={6} />
        </div>
      )}
      {error && <ErrorPanel message={error.message} onRetry={error.retry} />}

      {ev && rankings && (
        <>
          {/* Event band — the dashboard leads with whatever championship is next */}
          <Panel
            title={t("dashboard.event.title")}
            className="mt-6"
            action={
              <Link to="/ultimate" className="label-caps text-terracotta-strong hover:underline">
                {t("dashboard.event.cta")}
              </Link>
            }
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="dg text-[22px] font-bold tracking-[-0.02em] text-foreground">
                  {ev.name}
                </div>
                <div className="mt-1 text-[13.5px] text-muted-foreground">
                  {t("dashboard.event.where", {
                    venue: ev.venue,
                    city: ev.city,
                    dates: `${new Date(`${ev.startDate}T00:00:00`).getDate()}–${new Date(`${ev.endDate}T00:00:00`).getDate()} ${new Intl.DateTimeFormat(localeTag(lang), { month: "long" }).format(new Date(`${ev.endDate}T00:00:00`))}`,
                  })}
                </div>
              </div>
              <div className="text-right">
                <span className="dg nums block text-[32px] font-bold leading-none text-gold-strong">
                  {daysTo(ev.startDate)}
                </span>
                <span className="label-caps text-muted-foreground">{t("ultimate.stat.days")}</span>
              </div>
            </div>
          </Panel>

          {/* The model's favourites across the world */}
          <Panel
            title={t("dashboard.favourites.title")}
            subtitle={t("dashboard.favourites.subtitle")}
            className="mt-6"
            action={
              <Link to="/track" className="label-caps text-terracotta-strong hover:underline">
                {t("dashboard.favourites.cta")}
              </Link>
            }
          >
            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
              {favourites.slice(0, 9).map((f, i) => (
                <FavouriteCard key={f.discKey} f={f} index={i} />
              ))}
            </div>
          </Panel>

          {/* Where the model's pick isn't the points leader */}
          {disagreements.length > 0 && (
            <Panel
              title={t("dashboard.disagree.title")}
              subtitle={t("dashboard.disagree.subtitle")}
              className="mt-6"
            >
              <ul className="divide-y divide-border">
                {disagreements.slice(0, 8).map((d, i) => (
                  <li
                    key={d.discKey}
                    className="stagger-item flex items-center gap-3 py-3"
                    style={{ "--stagger-i": i } as CSSProperties}
                  >
                    <Link
                      to="/discipline/$discKey"
                      params={{ discKey: d.discKey }}
                      className="w-40 shrink-0 truncate text-[13.5px] font-medium text-foreground hover:text-terracotta-strong hover:underline"
                    >
                      {d.disc}
                    </Link>
                    <span className="min-w-0 flex-1 truncate text-[13px]">
                      <span className="text-muted-foreground">
                        {t("dashboard.disagree.model")}{" "}
                      </span>
                      <span className="font-medium text-foreground">{d.modelName}</span>
                    </span>
                    <span className="hidden min-w-0 flex-1 truncate text-[13px] sm:block">
                      <span className="text-muted-foreground">
                        {t("dashboard.disagree.points")}{" "}
                      </span>
                      <span className="font-medium text-foreground">{d.pointsName}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </>
      )}

      {ev && rankings && <NewsFeed />}
      <WelcomeLauncher />
    </Shell>
  );
}
