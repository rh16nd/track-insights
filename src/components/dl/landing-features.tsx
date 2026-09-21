import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { NatFlag } from "@/components/dl/nat-flag";
import { useResults } from "@/hooks/useResults";
import { championshipTheme, ASIAN_GAMES_STRIPE } from "@/lib/championship-themes";
import { dateRange, phaseOf } from "@/lib/championship-dates";
import { chanceLabel, discName } from "@/lib/dl-data";
import type { ChampionshipSummary, WorldRankings } from "@/lib/dl-data";
import { useT } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

type T = (k: string, v?: Record<string, string | number>) => string;

/** The event each card reads its athletes from. The men's 100m for Track and
 * Field; the men's 400m hurdles for the athlete page, whose favourite is the
 * athlete the item opens. */
const TRACK_EVENT = "men_100m";
const ATHLETE_EVENT = "men_400h";

type FeatureKey = "dashboard" | "track" | "championship" | "athlete" | "results";

/** One photo per item, from Wikimedia Commons, cropped to 16:10 and saved to
 * public/landing/ at 800 and 1600 px. Scenes rather than athletes, on purpose:
 * the cards name real athletes, and a stranger's face above a name would read
 * as that athlete. */
const PHOTOS: Record<FeatureKey, { author: string; license: string; source: string }> = {
  dashboard: {
    author: "cdephotos",
    license: "CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Athletics_at_the_2012_Summer_Olympics_(7925560204).jpg",
  },
  track: {
    author: "Marie-Lan Nguyen",
    license: "CC BY 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:French_Athletics_Championships_2013_t113118.jpg",
  },
  // The Asian Games' own athletics stadium in Nagoya, before its rebuild.
  championship: {
    author: "Kanko3131",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Mizuho_athletic_stadium130824-2.jpg",
  },
  athlete: {
    author: "Jamain",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Starting_block_J1.jpg",
  },
  results: {
    author: "Harry Pot / Anefo",
    license: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Atletiek_Nederland_tegen_Duitsland,_finish_100_m_heren,_Bestanddeelnr_907-2891.jpg",
  },
};

const ORDER: FeatureKey[] = ["dashboard", "track", "championship", "athlete", "results"];

const PAGES = {
  dashboard: "/dashboard",
  track: "/track",
  championship: "/championship",
  results: "/results",
} as const;

export type StripItem = { discKey: string; name: string; rating: number };

type Props = {
  rankings: WorldRankings | undefined;
  strip: StripItem[];
  summary: ChampionshipSummary | undefined;
};

/** What is on the site, beside a photo per page with a glass card of that
 * page's live numbers on it. It replaced screenshots of the pages (user,
 * 2026-09-21): pictures of the old cream pages clashed with the dark landing,
 * and the numbers on a card are the same ones the page itself shows.
 *
 * Terra's list auto-advances; this one changes only when the reader picks an
 * item, since a panel that swaps on a timer beside text being read is exactly
 * the movement WCAG 2.2.2 asks to be pausable. */
export function LandingFeatures({ rankings, strip, summary }: Props) {
  const { t } = useT();
  const [active, setActive] = useState<FeatureKey>("dashboard");
  const championshipName = t(summary?.navKey ?? "nav.championship");

  const title = (key: FeatureKey) =>
    key === "championship"
      ? t("landing.features.championship.title", { name: championshipName })
      : t(`landing.features.${key}.title`);

  const panel = (key: FeatureKey) => (
    <FeaturePanel key={key} featureKey={key} rankings={rankings} strip={strip} summary={summary} />
  );

  return (
    <div className="mt-12 grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
      <ul className="flex flex-col gap-3">
        {ORDER.map((key) => {
          const on = key === active;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => setActive(key)}
                onMouseEnter={() => setActive(key)}
                onFocus={() => setActive(key)}
                aria-pressed={on}
                className={`relative w-full overflow-hidden rounded-2xl border px-5 py-4 text-left transition-colors ${
                  on
                    ? "border-[oklch(1_0_0_/_0.22)] bg-[var(--terra-surface)]"
                    : "border-[var(--terra-border)] hover:bg-[oklch(1_0_0_/_0.03)]"
                }`}
              >
                <span className="block text-[16px] font-semibold text-[var(--terra-fg)]">
                  {title(key)}
                </span>
                <span className="mt-1 block text-[14px] leading-snug text-[var(--terra-muted)]">
                  {t(`landing.features.${key}.body`)}
                </span>
                {on && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--terra-gold)]"
                  />
                )}
              </button>
              {/* On a phone the picture opens under the item picked, rather
                  than in a column the phone has no room for. */}
              {on && <div className="mt-4 md:hidden">{panel(key)}</div>}
            </li>
          );
        })}
      </ul>
      <div className="hidden md:block">{panel(active)}</div>
    </div>
  );
}

function FeaturePanel({
  featureKey,
  rankings,
  strip,
  summary,
}: {
  featureKey: FeatureKey;
  rankings: WorldRankings | undefined;
  strip: StripItem[];
  summary: ChampionshipSummary | undefined;
}) {
  const { t, lang } = useT();
  const photo = PHOTOS[featureKey];
  const athlete = rankings?.[ATHLETE_EVENT]?.model[0];
  const theme = featureKey === "championship" ? championshipTheme(summary?.theme) : null;

  // The item's page, with the athlete item opening the athlete its card names.
  const link =
    featureKey === "athlete" ? (
      athlete ? (
        <Link
          to="/athlete/$discKey/$name"
          params={{ discKey: ATHLETE_EVENT, name: athlete.name }}
          className="feature-open"
        >
          {t("landing.features.athlete.open")}
        </Link>
      ) : null
    ) : (
      <Link to={PAGES[featureKey]} className="feature-open">
        {t(`landing.features.${featureKey}.open`)}
      </Link>
    );

  return (
    <div className="feature-panel group relative overflow-hidden rounded-[22px] border border-[var(--terra-border)] shadow-[0_30px_80px_oklch(0.05_0.01_40/0.6)]">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] md:aspect-[5/4]">
        <img
          src={`/landing/feature-${featureKey}-800.webp`}
          srcSet={`/landing/feature-${featureKey}-800.webp 800w, /landing/feature-${featureKey}-1600.webp 1600w`}
          sizes="(min-width: 768px) 640px, 100vw"
          alt=""
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
          className="feature-photo absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[oklch(0.52_0.105_40_/_0.3)] mix-blend-multiply"
        />
        <div aria-hidden="true" className="feature-scrim absolute inset-0" />

        <a
          href={photo.source}
          target="_blank"
          rel="noreferrer"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/35 px-2.5 py-1 text-[11px] text-white/80 hover:text-white hover:underline"
        >
          {t("ath.photoCredit", { author: photo.author, license: photo.license })}
        </a>

        <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
          <div
            className={`feature-card max-w-[380px] rounded-2xl p-4 sm:p-5 ${theme ? "feature-card-themed" : ""}`}
            style={theme?.box}
          >
            {theme && summary?.theme === "asianGames" && <EmblemStripe />}
            {featureKey === "dashboard" && <DashboardCard strip={strip} lang={lang} t={t} />}
            {featureKey === "track" && <TrackCard rankings={rankings} lang={lang} t={t} />}
            {featureKey === "championship" && (
              <ChampionshipCard summary={summary} lang={lang} t={t} />
            )}
            {featureKey === "athlete" && <AthleteCard rankings={rankings} lang={lang} t={t} />}
            {featureKey === "results" && <ResultsCard t={t} lang={lang} />}
            {link && <div className="mt-4">{link}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/** The Aichi-Nagoya emblem's purple, gold and green line, as the Asian Games
 * page draws it. */
function EmblemStripe() {
  return (
    <div
      aria-hidden="true"
      className="-mx-4 -mt-4 mb-4 flex h-1 overflow-hidden rounded-t-2xl sm:-mx-5 sm:-mt-5"
    >
      {ASIAN_GAMES_STRIPE.map((color) => (
        <span key={color} className="flex-1" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

function CardLabel({ children }: { children: ReactNode }) {
  return <div className="feature-card-label label-caps">{children}</div>;
}

/** Placeholder rows while the numbers load, the height of the real ones. */
function Loading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mt-3 flex flex-col gap-2.5" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton-pulse h-5 rounded-md bg-white/10" />
      ))}
    </div>
  );
}

function RatingRow({
  lead,
  name,
  detail,
  value,
}: {
  lead?: ReactNode;
  name: string;
  detail: ReactNode;
  value: string;
}) {
  return (
    <li className="flex items-baseline gap-3">
      {lead}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-[var(--card-fg)]">
          {name}
        </span>
        <span className="block truncate text-[12.5px] text-[var(--card-muted)]">{detail}</span>
      </span>
      <span className="nums shrink-0 text-[16px] font-semibold text-[var(--card-accent)]">
        {value}%
      </span>
    </li>
  );
}

function DashboardCard({ strip, lang, t }: { strip: StripItem[]; lang: Lang; t: T }) {
  return (
    <>
      <CardLabel>{t("landing.features.card.dashboard")}</CardLabel>
      {strip.length === 0 ? (
        <Loading />
      ) : (
        <ol className="mt-3 flex flex-col gap-2.5">
          {strip.slice(0, 3).map((c) => (
            <RatingRow
              key={c.discKey}
              name={c.name}
              detail={discName(t, c.discKey, c.discKey)}
              value={chanceLabel(lang, c.rating)}
            />
          ))}
        </ol>
      )}
    </>
  );
}

function TrackCard({
  rankings,
  lang,
  t,
}: {
  rankings: WorldRankings | undefined;
  lang: Lang;
  t: T;
}) {
  const rows = rankings?.[TRACK_EVENT]?.model.slice(0, 3) ?? [];
  return (
    <>
      <CardLabel>
        {t("landing.features.card.track", { event: discName(t, TRACK_EVENT, TRACK_EVENT) })}
      </CardLabel>
      {rows.length === 0 ? (
        <Loading />
      ) : (
        <ol className="mt-3 flex flex-col gap-2.5">
          {rows.map((r, i) => (
            <RatingRow
              key={r.name}
              lead={
                <span className="nums w-4 shrink-0 text-[13px] text-[var(--card-muted)]">
                  {i + 1}
                </span>
              }
              name={r.name}
              detail={
                r.nat ? (
                  <NatFlag nat={r.nat} className="[&>span]:text-[var(--card-muted)]" />
                ) : (
                  (r.mark ?? "")
                )
              }
              value={r.ratingPct == null ? "—" : chanceLabel(lang, r.ratingPct)}
            />
          ))}
        </ol>
      )}
      <p className="mt-3 text-[12px] text-[var(--card-muted)]">
        {t("landing.features.card.ratingNote")}
      </p>
    </>
  );
}

function ChampionshipCard({
  summary,
  lang,
  t,
}: {
  summary: ChampionshipSummary | undefined;
  lang: Lang;
  t: T;
}) {
  if (!summary) {
    return (
      <>
        <CardLabel>{t("nav.championship")}</CardLabel>
        <Loading rows={2} />
      </>
    );
  }
  const { phase, days } = phaseOf(summary);
  const status =
    phase === "upcoming"
      ? t(days === 1 ? "landing.features.card.startsInOne" : "landing.features.card.startsIn", {
          n: days,
        })
      : t(phase === "live" ? "landing.features.card.live" : "landing.features.card.done");
  return (
    <>
      <CardLabel>{summary.shortName}</CardLabel>
      <div className="mt-2 text-[18px] font-semibold leading-snug text-[var(--card-fg)]">
        {summary.venue}, {summary.city}
      </div>
      <div className="mt-1 text-[14px] text-[var(--card-muted)]">{dateRange(summary, lang)}</div>
      <div className="mt-3 text-[14px] font-semibold text-[var(--card-accent)]">{status}</div>
    </>
  );
}

function AthleteCard({
  rankings,
  lang,
  t,
}: {
  rankings: WorldRankings | undefined;
  lang: Lang;
  t: T;
}) {
  const lists = rankings?.[ATHLETE_EVENT];
  const a = lists?.model[0];
  const pointsRank = a ? lists?.points.find((r) => r.name === a.name)?.rank : undefined;
  return (
    <>
      <CardLabel>
        {t("landing.features.card.athlete", { event: discName(t, ATHLETE_EVENT, ATHLETE_EVENT) })}
      </CardLabel>
      {!a ? (
        <Loading rows={2} />
      ) : (
        <>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="truncate text-[19px] font-semibold text-[var(--card-fg)]">
              {a.name}
            </span>
            {a.nat && <NatFlag nat={a.nat} className="[&>span]:text-[var(--card-muted)]" />}
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-3">
            <Stat label={t("ath.figSeasonBest")} value={a.mark ?? "—"} />
            <Stat label={t("ath.worldRank")} value={pointsRank ? `#${pointsRank}` : "—"} />
            <Stat
              label={t("ath.modelRating")}
              value={a.ratingPct == null ? "—" : `${chanceLabel(lang, a.ratingPct)}%`}
              accent
            />
          </dl>
        </>
      )}
    </>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11.5px] leading-tight text-[var(--card-muted)]">{label}</dt>
      <dd
        className={`nums mt-0.5 text-[17px] font-semibold ${accent ? "text-[var(--card-accent)]" : "text-[var(--card-fg)]"}`}
      >
        {value}
      </dd>
    </div>
  );
}

/** The Results page's own count: podium places the frozen calls named, over
 * the places there were, at every championship graded so far. Loaded only
 * once this item is picked, since nothing else on the landing needs it. */
function ResultsCard({ t, lang }: { t: T; lang: Lang }) {
  const state = useResults();
  const graded = useMemo(() => {
    if (state.status !== "ok") return null;
    const done = state.data.championships.filter((c) => c.status === "complete");
    const hits = done.reduce(
      (n, c) => n + c.events.reduce((m, e) => m + e.result.podiumHits, 0),
      0,
    );
    const places = done.reduce(
      (n, c) => n + c.events.reduce((m, e) => m + e.result.podiumSize, 0),
      0,
    );
    const next = state.data.championships.find((c) => c.status === "pending");
    return { hits, places, next };
  }, [state]);

  if (state.status === "error") {
    return (
      <>
        <CardLabel>{t("landing.features.card.results")}</CardLabel>
        <p className="mt-2 text-[14px] text-[var(--card-muted)]">{t("results.error")}</p>
      </>
    );
  }
  if (!graded) {
    return (
      <>
        <CardLabel>{t("landing.features.card.results")}</CardLabel>
        <Loading rows={2} />
      </>
    );
  }
  const pct = graded.places ? Math.round((graded.hits / graded.places) * 1000) / 10 : 0;
  return (
    <>
      <CardLabel>{t("landing.features.card.results")}</CardLabel>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="hero-serif nums text-[40px] leading-none text-[var(--card-fg)]">
          {graded.hits}
          <span className="text-[var(--card-muted)]">/{graded.places}</span>
        </span>
      </div>
      <div className="mt-2 text-[14px] text-[var(--card-muted)]">
        {t("landing.features.card.resultsLine", { pct: chanceLabel(lang, pct) })}
      </div>
      {graded.next && (
        <div className="mt-2 text-[14px] font-semibold text-[var(--card-accent)]">
          {t("landing.features.card.resultsNext", { city: graded.next.venue })}
        </div>
      )}
    </>
  );
}
