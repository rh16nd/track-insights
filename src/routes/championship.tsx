import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { Shell, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { UltimateBody } from "@/components/dl/ultimate-body";
import { AsianGamesBody } from "@/components/dl/asian-games-body";
import { useChampionship, useChampionshipSummary } from "@/hooks/useChampionship";
import { useT } from "@/lib/i18n";
import { championshipTheme } from "@/lib/championship-themes";
import type { UltimateEvent } from "@/lib/dl-data";
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
  const ground = championshipTheme(themeId)?.page;

  return (
    <Shell title={t(titleKey)} crumb={t(navKey)} theme={ground ?? "default"}>
      {state.status === "loading" && (
        <div className="mt-2 space-y-6">
          <div className="skeleton-pulse h-64 rounded-[28px] bg-white/60" />
          <PanelSkeleton rows={8} />
        </div>
      )}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}
      {ev && ev.championship.theme === "asianGames" && <AsianGamesBody ev={ev} lang={lang} t={t} />}
      {ev && ev.championship.theme !== "asianGames" && (
        // The Ultimate's payload is a whole UltimateEvent; the championship type
        // only marks its Ultimate-only parts optional.
        <UltimateBody ev={ev as UltimateEvent} lang={lang} t={t} />
      )}
    </Shell>
  );
}
