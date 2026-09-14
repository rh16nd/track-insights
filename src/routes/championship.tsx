import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { Shell, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { UltimateBody } from "@/components/dl/ultimate-body";
import { AsianGamesBody } from "@/components/dl/asian-games-body";
import { useChampionship } from "@/hooks/useChampionship";
import { useT } from "@/lib/i18n";
import { championshipTheme } from "@/lib/championship-themes";
import type { UltimateEvent } from "@/lib/dl-data";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/championship")({
  head: () =>
    pageHead(
      "The championship we are calling",
      "The next major athletics championship: its field, how each event is called, and the call itself, made before the first session.",
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

/** Whichever championship the backend registry names as current
 * (athletics-predictor/src/championships.py), dressed in that competition's own
 * colours. The tab moves on to the next championship with a data push. */
function ChampionshipPage() {
  const { t, lang } = useT();
  const state = useChampionship();
  const ev = state.status === "ok" ? state.data : undefined;
  const [themeId, setThemeId] = useState<string | null>(null);

  useEffect(() => {
    setThemeId((seen) => seen ?? rememberedTheme());
  }, []);
  const liveTheme = ev?.championship.theme;
  useEffect(() => {
    if (!liveTheme) return;
    setThemeId(liveTheme);
    try {
      window.localStorage.setItem(THEME_KEY, liveTheme);
    } catch {
      // Blocked storage costs the head start on the next visit, nothing more.
    }
  }, [liveTheme]);

  const copy = themeId === "asianGames" ? "asianGames" : "ultimate";
  const navKey = ev?.championship.navKey ?? "nav.championship";
  usePageTitle(t(navKey));
  const ground = championshipTheme(themeId)?.page;

  return (
    <Shell title={t(`${copy}.title`)} crumb={t(navKey)} theme={ground ?? "default"}>
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
