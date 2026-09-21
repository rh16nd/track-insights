import { useEffect, useState, type ComponentType } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { Shell, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { UltimateBody } from "@/components/dl/ultimate-body";
import { ChampionshipArrival } from "@/components/dl/championship-arrival";
import { NagoyaCover, type CallSplit, type CoverInfo } from "@/components/dl/nagoya/nagoya-cover";
import { NagoyaPage, NAGOYA_WRAP } from "@/components/dl/nagoya/nagoya-page";
import { useChampionship, useChampionshipSummary } from "@/hooks/useChampionship";
import { useT, type Lang } from "@/lib/i18n";
import { championshipTheme, type ChampionshipThemeId } from "@/lib/championship-themes";
import type { ChampionshipEvent, UltimateEvent } from "@/lib/dl-data";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/championship")({
  head: () =>
    pageHead(
      "The championship we are calling",
      "The next major athletics championship: its field, how each event is called, and the call itself, made before the first session.",
      "/championship",
    ),
  component: ChampionshipPage,
});

/** The last championship theme this reader saw. A return visit then paints the
 * right ground at once, instead of the site's terracotta for as long as the
 * payload takes to arrive. A convenience only: the page themes itself from the
 * data either way. */
const THEME_KEY = "podiumcall:championship-theme";

function rememberedTheme(): string | null {
  try {
    return window.localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

/** Each championship's page title, by theme. Until the data names one, the
 * page is titled "Championship". */
const TITLE_KEYS: Record<string, string> = {
  ultimate: "ultimate.title",
  asianGames: "asianGames.title",
};

type T = (k: string, v?: Record<string, string | number>) => string;

/** The championships that are places of their own (the user, 2026-09-21):
 * visiting one should feel like going somewhere else. Each brings its own
 * cover and its own page between the site's menu and footer, and arrives in
 * its colours (the theme's `arrival`). Keyed by theme id; a championship not
 * listed keeps the site's frame and panels. */
const PLACES: Partial<
  Record<
    ChampionshipThemeId,
    {
      Cover: ComponentType<{ info: CoverInfo | undefined; split: CallSplit | undefined }>;
      Page: ComponentType<{ ev: ChampionshipEvent; lang: Lang; t: T }>;
      /** The page's column, for the loading and error states. */
      wrap: string;
    }
  >
> = {
  asianGames: { Cover: NagoyaCover, Page: NagoyaPage, wrap: NAGOYA_WRAP },
};

/** Whichever championship the backend registry names as current
 * (athletics-predictor/src/championships.py), dressed in that competition's own
 * colours. The tab moves on to the next championship with a data push. */
function ChampionshipPage() {
  const { t, lang } = useT();
  const state = useChampionship();
  // A few hundred bytes against the call's hundreds of kilobytes, so it names
  // the championship while the page body is still loading.
  const summary = useChampionshipSummary();
  const ev = state.status === "ok" ? state.data : undefined;
  const current = summary.status === "ok" ? summary.data : undefined;
  const [themeId, setThemeId] = useState<string | null>(null);

  useEffect(() => {
    setThemeId((seen) => seen ?? rememberedTheme());
  }, []);
  const liveTheme = ev?.championship.theme ?? current?.theme;
  useEffect(() => {
    if (!liveTheme) return;
    setThemeId(liveTheme);
    try {
      window.localStorage.setItem(THEME_KEY, liveTheme);
    } catch {
      // Blocked storage costs the head start on the next visit, nothing more.
    }
  }, [liveTheme]);

  // Titled from the data, never from the remembered theme. The loading screen
  // read "The Ultimate Championship" after the site had moved on to the Asian
  // Games (2026-09-15): any theme it did not know fell back to the Ultimate.
  const titleKey = (liveTheme && TITLE_KEYS[liveTheme]) || "nav.championship";
  const navKey = ev?.championship.navKey ?? current?.navKey ?? "nav.championship";
  usePageTitle(t(navKey));
  const theme = championshipTheme(themeId);
  const ground = theme?.page;
  const place = themeId ? PLACES[themeId as ChampionshipThemeId] : undefined;

  if (place) {
    // The call itself names everything the cover says; until it arrives, the
    // summary names all but the time zone and the entry counts.
    const source = ev ?? current;
    const info: CoverInfo | undefined = source && {
      name: source.name,
      shortName: source.shortName,
      city: source.city,
      venue: source.venue,
      startDate: source.startDate,
      endDate: source.endDate,
      timezone: ev?.timezone,
      entrants: ev?.entrants,
      federations: ev?.federations,
    };
    const split: CallSplit | undefined = ev && {
      model: (ev.projections ?? []).filter((p) => p.method === "model").length,
      points: (ev.projections ?? []).filter((p) => p.method === "points").length,
      none: (ev.notCalled ?? []).length,
    };
    return (
      <Shell
        title={t(titleKey)}
        crumb={t(navKey)}
        theme={ground ?? "default"}
        layout="bleed"
        cover={<place.Cover info={info} split={split} />}
      >
        {theme?.arrival && <ChampionshipArrival colours={theme.arrival} />}
        {state.status === "loading" && (
          <div className={`${place.wrap} py-20`}>
            <PanelSkeleton rows={8} />
          </div>
        )}
        {state.status === "error" && (
          <div className={`${place.wrap} py-20`}>
            <ErrorPanel message={state.message} onRetry={state.retry} />
          </div>
        )}
        {/* Only the call this place was built for: a remembered theme can be
            one championship behind the data for a moment. */}
        {ev && ev.championship.theme === themeId && <place.Page ev={ev} lang={lang} t={t} />}
      </Shell>
    );
  }

  return (
    <Shell title={t(titleKey)} crumb={t(navKey)} theme={ground ?? "default"}>
      {state.status === "loading" && (
        <div className="mt-2 space-y-6">
          <div className="skeleton-pulse h-64 rounded-[28px] bg-white/10" />
          <PanelSkeleton rows={8} />
        </div>
      )}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}
      {ev && !(ev.championship.theme in PLACES) && (
        // The Ultimate's payload is a whole UltimateEvent; the championship type
        // only marks its Ultimate-only parts optional.
        <UltimateBody ev={ev as UltimateEvent} lang={lang} t={t} />
      )}
    </Shell>
  );
}
