import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { PodiumCallMark } from "@/components/dl/logo";
import { LanguageSwitcher } from "@/components/dl/language-switcher";
import { useT } from "@/lib/i18n";

/** The sections of the landing the menu scrolls to, by element id. */
export const LANDING_SECTIONS = {
  features: "features",
  championship: "championship",
  numbers: "numbers",
} as const;

/** Scroll to a section of the landing and move focus there, as an in-page
 * link would, so a keyboard reader carries on from the section they picked.
 * Instant under reduced motion. */
function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.focus({ preventScroll: true });
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/** The landing's menu: a floating glass pill, fixed at the top as Terra's is.
 *
 * Its three links keep the reader on the landing and scroll to the section
 * about each page (the user, 2026-09-21): Dashboard to what the site shows,
 * the championship to its call, How it works to the numbers behind the model.
 * The pages themselves are reached from those sections, the closing band and
 * the footer.
 *
 * On a phone the links don't fit beside the logo, so they sit behind a menu
 * button. */
export function LandingNav({
  championshipNavKey,
}: {
  championshipNavKey: string | null | undefined;
}) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  const links = [
    { id: LANDING_SECTIONS.features, label: t("nav.dashboard") },
    { id: LANDING_SECTIONS.championship, label: t(championshipNavKey ?? "nav.championship") },
    { id: LANDING_SECTIONS.numbers, label: t("nav.howItWorks") },
  ];

  const pick = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    goTo(id);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 sm:pt-6">
      <div
        ref={wrapRef}
        className="relative mx-auto flex max-w-[1400px] items-start justify-between gap-3"
      >
        <nav
          aria-label="Main"
          className="hero-glass pointer-events-auto flex items-center gap-1 rounded-2xl py-1.5 pl-3 pr-1.5 sm:pr-2"
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
          <div className="hidden items-center sm:flex">
            {links.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={pick(l.id)} className="hero-nav-link">
                {l.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={t("landing.nav.menu")}
            className="hero-glass grid size-11 place-items-center rounded-full text-white sm:hidden"
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
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <LanguageSwitcher tone="dark" className="hero-glass" />
        </div>

        {open && (
          <div
            id={panelId}
            className="hero-glass landing-menu pointer-events-auto absolute right-0 top-[calc(100%+8px)] flex min-w-[220px] flex-col rounded-2xl p-2 sm:hidden"
          >
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={pick(l.id)}
                className="hero-nav-link block px-4 py-3 text-[15px]"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
