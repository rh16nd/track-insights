import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { chanceLabel, compareEvents, discName } from "@/lib/dl-data";
import type { WorldRankings } from "@/lib/dl-data";
import { useT } from "@/lib/i18n";

/** How long each event stays in the headline, as Terra swaps its word. */
const WORD_MS = 3800;
/** Eight events, one per kind, so "the javelin" never comes up twice in a row
 * when both javelin favourites rate highest. */
const MAX_EVENTS = 8;

/** The photo behind the hero: a start line with lane numbers, CC0 on Wikimedia
 * Commons (from Unsplash), saved to public/landing/ in two sizes. Credited
 * although CC0 does not ask for it. */
const HERO_PHOTO = {
  small: "/landing/hero-start-line-1200.webp",
  large: "/landing/hero-start-line-2400.webp",
  author: "Kolleen Gladden",
  license: "CC0",
  source: "https://commons.wikimedia.org/wiki/File:Starting_line_(Unsplash).jpg",
};

export type FavouriteEvent = {
  discKey: string;
  eventType: string;
  name: string;
  ratingPct: number;
};

/** The model's favourite in each kind of event ("PV", "400h"...), men and women
 * alike, highest rating first: the events the headline cycles through, each
 * with the athlete the caption names. */
function favouriteEvents(rankings: WorldRankings | undefined, max = MAX_EVENTS): FavouriteEvent[] {
  if (!rankings) return [];
  const rows: FavouriteEvent[] = [];
  for (const [discKey, lists] of Object.entries(rankings)) {
    const top = lists.model[0];
    if (!top || top.ratingPct == null) continue;
    rows.push({
      discKey,
      eventType: discKey.split("_")[1] ?? discKey,
      name: top.name,
      ratingPct: top.ratingPct,
    });
  }
  rows.sort(
    (a, b) => b.ratingPct - a.ratingPct || compareEvents(a.discKey, b.discKey, a.name, b.name),
  );
  const seen = new Set<string>();
  return rows.filter((r) => !seen.has(r.eventType) && seen.add(r.eventType)).slice(0, max);
}

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

/** The landing's first screen, after the Terra template the user picked
 * (2026-09-21): one full-screen photo of a start line drifting slowly under a
 * warm dark wash, a large serif headline whose second line swaps between the
 * events the model rates most sure favourites in, and one sentence. The menu
 * floats above it (LandingNav), and the two buttons wait at the foot of the
 * page, where the user wanted them once the reader has seen what is here.
 *
 * It replaced a flat terracotta field with a drawn track outline, reported as
 * bland and empty at the top, whose straight lines ran through the text on
 * phones. A first version cycled the favourites' own photos; the user preferred
 * something else, and chose a stadium-style photo.
 *
 * The headline changes on its own, so it can be paused (WCAG 2.2.2), and both
 * it and the photo hold still for anyone who asks for reduced motion. */
export function LandingHero({
  rankings,
  countdownLabel,
  disciplineCount,
}: {
  rankings: WorldRankings | undefined;
  countdownLabel: string;
  disciplineCount: number;
}) {
  const { t, lang } = useT();
  const events = useMemo(() => favouriteEvents(rankings), [rankings]);
  const reduce = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = events.length;
  const current = count ? events[index % count] : undefined;
  const playing = count > 1 && !paused && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), WORD_MS);
    return () => window.clearTimeout(id);
  }, [index, playing, count]);

  const eventLine = current
    ? t(`landing.hero.event.${current.eventType}`)
    : t("landing.hero.everyEvent");

  return (
    <section className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      {/* ── The photo ── */}
      <div className="absolute inset-0 -z-10 bg-[var(--terra-bg)]" aria-hidden="true">
        {/* `sizes` says how wide the photo is really drawn: on a tall phone
            screen, covering the height makes it half as wide again as the
            screen, so the phone gets the large file rather than a blurry
            small one. */}
        <img
          src={HERO_PHOTO.large}
          srcSet={`${HERO_PHOTO.small} 1200w, ${HERO_PHOTO.large} 2400w`}
          sizes="(orientation: portrait) 150vh, 100vw"
          alt=""
          decoding="async"
          fetchPriority="high"
          className="hero-photo absolute inset-0 h-full w-full object-cover object-[60%_50%]"
        />
        {/* A warm tint so the photo sits in the brand's colour, then a dark
            wash that is heaviest behind the type and at the foot, where the
            hero hands over to the page below. */}
        <div className="absolute inset-0 bg-[oklch(0.52_0.105_40_/_0.3)] mix-blend-multiply" />
        <div className="hero-scrim absolute inset-0" />
      </div>

      {/* ── Headline ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-10 pt-24 text-center sm:px-10 sm:pt-28">
        <span
          className="hero-reveal hero-glass label-caps inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-white"
          style={{ "--reveal-d": "50ms" } as CSSProperties}
        >
          <span className="kicker-dot size-2 rounded-full bg-[var(--gold-light)]" />
          {countdownLabel}
        </span>

        {/* Terra's stagger, done as two centred lines nudged apart rather than
            fixed left offsets, so a long event name ("du lancer du marteau")
            can never push past the edge. The event line keeps room for two
            lines on phones, where the longer names wrap, so the page does not
            jump each time the event changes. */}
        <h1
          className="hero-reveal hero-serif mt-7 w-full text-[clamp(44px,8.6vw,96px)] leading-[1.04] tracking-[-0.01em] text-white"
          style={{ "--reveal-d": "140ms" } as CSSProperties}
        >
          <span className="sr-only">{t("landing.hero.srTitle")}</span>
          <span aria-hidden="true" className="block">
            <span className="block -translate-x-[0.3em] sm:-translate-x-[1em]">
              {t("landing.hero.lineA")}
            </span>
            <span className="flex min-h-[2.08em] translate-x-[0.3em] items-start justify-center sm:min-h-0 sm:translate-x-[1em]">
              <span key={current?.discKey ?? "all"} className="hero-word text-balance">
                {eventLine}.
              </span>
            </span>
          </span>
        </h1>

        <p
          className="hero-reveal mx-auto mt-6 max-w-[44ch] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-white/88"
          style={{ "--reveal-d": "240ms" } as CSSProperties}
        >
          {t("landing.hero.lede", { n: disciplineCount })}
        </p>
      </div>

      {/* ── The favourite for the event in the headline, and the pause ──
          Sized up on the user's word (2026-09-21): at 14px the name read as a
          footnote. Not a live region: it changes every few seconds, and
          announcing each change would talk over whatever the reader is on. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-5 sm:px-10 sm:pb-7">
        <div className="flex items-end justify-between gap-4">
          {/* On a phone the rating takes its own line rather than being cut
              off, every time, so the block's height holds as events change. */}
          <div className="min-w-0 flex-1 text-left">
            {current && (
              <>
                <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-white/75">
                  {t("landing.hero.favourite")}
                </div>
                <Link
                  to="/athlete/$discKey/$name"
                  params={{ discKey: current.discKey, name: current.name }}
                  className="mt-0.5 block truncate text-[20px] font-semibold leading-tight text-white hover:underline"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {current.name}
                </Link>
                <div className="mt-0.5 flex flex-col text-[16px] leading-snug text-white/90 sm:flex-row sm:flex-wrap sm:gap-x-1.5">
                  <span>{discName(t, current.discKey, current.discKey)}</span>
                  <span aria-hidden="true" className="hidden sm:inline">
                    ·
                  </span>
                  <span className="font-semibold text-[var(--gold-light)]">
                    {t("landing.hero.rating", { rating: chanceLabel(lang, current.ratingPct) })}
                  </span>
                </div>
              </>
            )}
          </div>
          {count > 1 && !reduce && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={t(paused ? "landing.hero.play" : "landing.hero.pause")}
              className="hero-glass grid size-11 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                {paused ? (
                  <path d="M8 5.5v13l10.5-6.5z" />
                ) : (
                  <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                )}
              </svg>
            </button>
          )}
        </div>
        <div className="mt-3 text-right">
          <a
            href={HERO_PHOTO.source}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-white/60 hover:text-white/90 hover:underline"
          >
            {t("ath.photoCredit", { author: HERO_PHOTO.author, license: HERO_PHOTO.license })}
          </a>
        </div>
      </div>
    </section>
  );
}
