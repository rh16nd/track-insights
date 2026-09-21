import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useChampionshipSummary } from "@/hooks/useChampionship";
import { useDismiss } from "@/hooks/useDismiss";
import { championshipTheme } from "@/lib/championship-themes";
import { PodiumCallMark } from "./logo";
import { AthleteSearch } from "./athlete-search";
import { LanguageSwitcher } from "./language-switcher";
import { localizeDate } from "@/lib/dates";
import { useT } from "@/lib/i18n";

// "How it works" is deliberately NOT in the bar: it's an explainer, not a
// section of the board. It sits in the footer, the welcome dialog, and the
// foot of the phone menu.
const nav = [
  { to: "/dashboard", labelKey: "nav.dashboard" },
  { to: "/track", labelKey: "nav.track" },
  { to: "/field", labelKey: "nav.field" },
  // The tab follows whichever championship is current, in that competition's
  // own colour, the one colour in this bar that is not the site's. Its label
  // and accent come from /api/championship/summary, so when the next
  // championship takes the slot the tab moves with the data.
  { to: "/championship", labelKey: "nav.championship", championship: true },
  // The site's own track record, next to the projections: a forecast that is
  // never checked afterwards is a claim.
  { to: "/results", labelKey: "nav.results" },
  { to: "/stats", labelKey: "nav.stats" },
  { to: "/schedule", labelKey: "nav.schedule" },
] as const;

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`size-[18px] ${className}`}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13.5 13.5 17.5 17.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LiveDot() {
  return (
    <span className="relative flex size-1.5" aria-hidden="true">
      <span className="live-ping-ring absolute inset-0 rounded-full bg-gold-light" />
      <span className="relative size-1.5 rounded-full bg-gold-light" />
    </span>
  );
}

/** The site's menu, the landing's floating glass pill (the Terra re-theme,
 * 2026-09-21): the same sections, search, language and Live signal the old
 * cream bar carried, fixed at the top over each page's photo header.
 *
 * The links sit in the pill when they fit, which in French (the longer
 * language) is from 1280px. Below that they move behind a menu button, as on
 * the landing; on a phone that menu also holds the search, since the pill,
 * the button and the language switch already fill a 360px screen. */
export function TopNav({
  lastUpdated,
  daysToFinal,
}: {
  lastUpdated?: string | undefined;
  daysToFinal?: number | undefined;
}) {
  const { t, lang } = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const searchId = useId();
  const championshipState = useChampionshipSummary();
  const championship = championshipState.status === "ok" ? championshipState.data : undefined;
  const championshipAccent = {
    "--nav-accent": championshipTheme(championship?.theme)?.navAccent ?? "var(--violet-strong)",
  } as CSSProperties;

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useDismiss(menuOpen, closeMenu, wrapRef, menuButton);
  useDismiss(searchOpen, closeSearch, wrapRef, searchButton);

  // A new page closes whatever was open.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const label = (item: (typeof nav)[number]) =>
    t(
      "championship" in item && item.championship && championship?.navKey
        ? championship.navKey
        : item.labelKey,
    );

  const links = (inMenu: boolean) =>
    nav.map((item) => {
      const accent = "championship" in item && item.championship;
      return (
        <Link
          key={item.to}
          to={item.to}
          style={accent ? championshipAccent : undefined}
          className={`hero-nav-link whitespace-nowrap ${inMenu ? "block px-4 py-3 text-[15px]" : ""} ${
            accent ? "!text-[var(--nav-accent)]" : ""
          }`}
          activeProps={{ className: "nav-active" }}
        >
          {label(item)}
        </Link>
      );
    });

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-5">
      <div
        ref={wrapRef}
        className="relative mx-auto flex max-w-[1600px] items-start justify-between gap-2"
      >
        <nav
          aria-label="Main"
          className="glass pointer-events-auto flex min-w-0 items-center gap-1 rounded-2xl py-1.5 pl-3 pr-1.5"
        >
          <Link to="/" className="flex items-center gap-2 py-1.5 pr-2" aria-label="PodiumCall">
            <PodiumCallMark className="size-5" />
            <span
              className="text-[14px] font-bold uppercase tracking-[0.08em] text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PodiumCall
            </span>
          </Link>
          <div className="hidden items-center xl:flex">{links(false)}</div>
        </nav>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          {/* The search field sits in the bar where there is room for it. */}
          <div className="glass hidden w-56 rounded-full p-1 2xl:block">
            <AthleteSearch />
          </div>
          <button
            ref={searchButton}
            type="button"
            aria-label={t("nav.searchAthletes")}
            aria-expanded={searchOpen}
            aria-controls={searchId}
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen((o) => !o);
            }}
            className="glass hidden size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/20 sm:grid 2xl:hidden"
          >
            <SearchIcon />
          </button>
          <button
            ref={menuButton}
            type="button"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen((o) => !o);
            }}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={t("landing.nav.menu")}
            className="glass grid size-11 place-items-center rounded-full text-white xl:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="size-5"
              aria-hidden="true"
            >
              {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <LanguageSwitcher tone="dark" className="glass" />
          {lastUpdated && (
            <span className="nums hidden whitespace-nowrap text-[11.5px] text-white/80 2xl:block">
              {t("nav.updated", { date: localizeDate(lang, lastUpdated), days: daysToFinal ?? 0 })}
            </span>
          )}
          <span className="glass label-caps hidden items-center gap-1.5 rounded-full px-3 py-2.5 text-white sm:flex">
            <LiveDot />
            {t("nav.live")}
          </span>
        </div>

        {searchOpen && (
          <div
            id={searchId}
            className="landing-menu glass pointer-events-auto absolute right-0 top-[calc(100%+8px)] w-[min(24rem,100%)] rounded-2xl p-2"
          >
            <AthleteSearch autoFocus onDone={() => setSearchOpen(false)} />
          </div>
        )}

        {menuOpen && (
          <div
            id={menuId}
            className="landing-menu glass pointer-events-auto absolute right-0 top-[calc(100%+8px)] flex w-[min(20rem,100%)] flex-col rounded-2xl p-2"
          >
            {/* On a phone the search lives here: the bar has no room for it. */}
            <div className="p-2 sm:hidden">
              <AthleteSearch onDone={() => setMenuOpen(false)} />
            </div>
            <nav aria-label={t("landing.nav.menu")} className="flex flex-col">
              {links(true)}
              <Link
                to="/how-it-works"
                className="hero-nav-link block px-4 py-3 text-[15px]"
                activeProps={{ className: "nav-active" }}
              >
                {t("nav.howItWorks")}
              </Link>
            </nav>
            <div className="mt-1 flex items-center gap-2 border-t border-white/10 px-4 pb-2 pt-3 text-[12px] text-white/80">
              <LiveDot />
              {lastUpdated
                ? t("nav.updated", {
                    date: localizeDate(lang, lastUpdated),
                    days: daysToFinal ?? 0,
                  })
                : t("nav.live")}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
