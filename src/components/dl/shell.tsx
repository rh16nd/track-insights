import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { TopNav } from "./topnav";
import { TrackCurveDecoration } from "./track-curve";
import type { MeetStatus } from "@/lib/dl-data";
import { API_IS_LOCAL, warmApi } from "@/lib/api";
import { WaSourceLink } from "./wa-link";
import { JsonLd } from "./json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { InfoTip } from "./info-tip";
import { useT } from "@/lib/i18n";

export const dotClass: Record<MeetStatus, string> = {
  done: "bg-muted-foreground/40",
  next: "bg-terracotta",
  upcoming: "bg-border",
  final: "bg-gold",
};

export const badgeClass: Record<MeetStatus, string> = {
  done: "bg-secondary text-muted-foreground",
  next: "bg-terracotta/10 text-terracotta-strong",
  upcoming: "bg-secondary text-foreground/70",
  final: "bg-gold/15 text-gold-strong",
};

/** A ground a page brings with it, instead of the site's terracotta.
 *
 * The colours are the caller's problem, and they are not decoration: the site
 * paints white/90, white/92 and --gold-on-canvas straight onto this surface,
 * so `ground` has to carry all three at 4.5:1 with `glow` and the grain tile
 * composited on. The country pages get theirs from
 * scripts/make-flag-palette.py, which does that measurement and refuses to
 * emit a ground that fails it. The glow alphas are fixed here (10% and 9%,
 * the `1a`/`17` suffixes below) because that script clamps against those exact
 * numbers — change one and change the other. */
export type PageGround = {
  /** Opaque page canvas. */
  ground: string;
  /** One or two #rrggbb blooms. The second falls back to the first. */
  glow: string[];
  /** Optional ruling for the ground, keyed into MOTIF below. The country pages
   * pass the shape of the nation's flag, so a page is ruled the way its flag
   * is built. */
  motif?: keyof typeof MOTIF;
};

/** Rulings for a page's ground: 2px lines every 46px, in the direction the
 * page's own subject is built.
 *
 * Every one of these is BLACK at low alpha, which is not a stylistic choice.
 * A ground is signed off at exactly 4.5:1 against the text on it, so a ruling
 * that lightened it -- white lines, the obvious first instinct -- would eat
 * into a ratio with nothing to give. Darkening can only ever move contrast the
 * safe way, so these need no measurement of their own and cannot be broken by
 * a later change to the palette. */
const MOTIF = {
  horizontal: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.10) 0 2px, transparent 2px 30px)",
  vertical: "repeating-linear-gradient(to right, rgba(0,0,0,0.10) 0 2px, transparent 2px 30px)",
  diagonal: "repeating-linear-gradient(118deg, rgba(0,0,0,0.10) 0 2px, transparent 2px 30px)",
  // Both directions at once, because that is what a cross flag is.
  cross:
    "repeating-linear-gradient(to bottom, rgba(0,0,0,0.08) 0 2px, transparent 2px 34px)," +
    "repeating-linear-gradient(to right, rgba(0,0,0,0.08) 0 2px, transparent 2px 34px)",
  // Rings out of a single point, for the flags that are a device on a field.
  emblem:
    "repeating-radial-gradient(circle at 50% 20%, transparent 0 32px, rgba(0,0,0,0.10) 32px 34px)",
} as const;

export function Shell({
  title,
  crumb,
  children,
  lastUpdated,
  daysToFinal,
  hero,
  figures,
  headTone = "canvas",
  headBackdrop,
  back,
  eyebrow,
  description,
  theme = "default",
}: {
  title: string;
  /** The page's NAME, for the breadcrumb — distinct from `title`, which is
   * the headline. The dashboard is called "Dashboard" in the crumb while its
   * headline reads "The board, 4 days out."; defaults to the title for pages
   * where the two are the same thing. */
  crumb?: string | undefined;
  children: ReactNode;
  lastUpdated?: string | undefined;
  daysToFinal?: number | undefined;
  /** Replaces the band's default title block with custom content — still
   * inside the same band, so a page with its own header (the athlete
   * profile) keeps the site's one head treatment instead of inventing a
   * second. */
  hero?: ReactNode;
  /** Figures that belong ON the head band rather than in a panel below it —
   * v0's `.figrow`. The dashboard's four stats are the only user today. */
  figures?: ReactNode;
  /** The head band's ground. "brick" is v0's athlete dossier: a darker,
   * heavier band that signals a different KIND of page — a file on one
   * person rather than a view over the field. */
  headTone?: "canvas" | "brick";
  /** A backdrop rendered behind the band's content (the athlete photo).
   * Sits under the lanes and the glow. */
  headBackdrop?: ReactNode;
  /** A back control, rendered above the breadcrumb. Optional because most
   * pages are top-level tabs with nowhere to go back to; the pages that are
   * reached FROM somewhere (an athlete, a country) pass one. */
  back?: ReactNode;
  /** Small caps line above the page title. */
  eyebrow?: string | undefined;
  /** One-line explanation under the page title. */
  description?: string | undefined;
  /** Per-page ground. "ultimate" swaps the site's terracotta track canvas for
   * the championship's own black-and-purple, matching how World Athletics
   * dresses the Ultimate. Deliberately a PAGE-level opt-in, not a site theme:
   * only the event tab wears it, and when the next championship takes that tab
   * this is the one switch that re-dresses it.
   *
   * A `PageGround` does the same thing with colours the page computes for
   * itself — the country pages pass their nation's, measured off its flag.
   * Same mechanism, same two layers, so there is one way to re-dress a page
   * rather than a growing list of named themes. */
  theme?: "default" | "ultimate" | PageGround;
}) {
  /* Mirrors the visible breadcrumb below. Read from the router rather than
     passed in, so the two cannot drift: a page that changes its crumb gets
     the structured data updated with it. Returns null until VITE_SITE_URL
     exists -- see lib/seo.ts. */
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useT();
  const isUltimate = theme === "ultimate";
  const custom = typeof theme === "object" ? theme : null;
  // Either way the page brings its own ground, so the site's terracotta must
  // not be painted underneath it.
  const ownGround = isUltimate || custom !== null;

  /* Every page renders through Shell, so this is the earliest moment we know
     a real person is here. Wake the API now (see warmApi) rather than when
     they click an athlete, since the wake-up takes longer than the reading. */
  useEffect(() => {
    warmApi();
  }, []);

  return (
    <div className={`relative min-h-screen ${ownGround ? "" : "bg-background"}`}>
      {/* A page's own ground is painted as a FIXED layer, not as this div's
          own background: the document body still carries the site's
          terracotta, which showed through at the edges of the scroll when the
          colour lived on the box. Fixed, it covers the viewport always. */}
      {ownGround && (
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
          style={{ backgroundColor: custom ? custom.ground : "#07050d" }}
        />
      )}
      {/* The ground's own ruling, under the grain so it reads as part of the
          surface rather than as something laid on top of it. */}
      {custom?.motif && (
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
          style={{ backgroundImage: MOTIF[custom.motif] }}
        />
      )}
      {/* Grain stays perfectly still -- it is a surface texture, and moving
          noise reads as television static. Only the glow breathes, on its own
          layer so the two can't drag each other. */}
      <div className="ambient-grain pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      {isUltimate || custom ? (
        /* The championship's ground: near-black with violet blooms, the look
           World Athletics gives the Ultimate. A country page's is the same
           shape in its own two flag colours. Fixed, like the default glow, so
           it holds still down a long page instead of stretching with it.

           The country blooms are weaker than the Ultimate's on purpose: they
           sit over a colour that carries body text, and every point of alpha
           here is paid for by darkening that ground (see
           scripts/make-flag-palette.py, which clamps against these exact
           numbers). */
        <div
          className="ambient-breath pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
          style={{
            backgroundImage: custom
              ? `radial-gradient(ellipse 1200px 720px at 84% -8%, ${custom.glow[0]}1a, transparent 62%),` +
                `radial-gradient(ellipse 1000px 640px at 2% 104%, ${custom.glow[1] ?? custom.glow[0]}17, transparent 58%)`
              : "radial-gradient(ellipse 1200px 720px at 84% -8%, rgba(150,74,224,0.40), transparent 62%)," +
                "radial-gradient(ellipse 1000px 640px at 2% 104%, rgba(96,42,178,0.34), transparent 58%)," +
                "radial-gradient(ellipse 760px 520px at 50% 46%, rgba(72,30,140,0.20), transparent 60%)",
          }}
        />
      ) : (
        <div
          className="ambient-glow ambient-breath pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
        />
      )}
      {/* The track curve is white and gold at 8-16% — hue-neutral, so it works
          on a nation's ground as well as on the site's own. Only the
          championship drops it: a warm arc reads as a stray on that black. */}
      {!isUltimate && (
        <TrackCurveDecoration className="pointer-events-none fixed bottom-0 right-0 z-0 h-[65vh] w-[65vh] opacity-80" />
      )}
      <div className="relative z-10">
        {/* Every page opens with the same nav, so without this a keyboard or
            screen-reader user tabs the whole thing again on each one before
            reaching the content. Visually hidden until it takes focus, which
            is the point -- it is the first thing Tab reaches. */}
        <a
          href="#main"
          className="skip-link label-caps rounded-full bg-card px-4 py-2.5 text-foreground shadow-lg"
        >
          {t("nav.skipToContent")}
        </a>
        <TopNav lastUpdated={lastUpdated} daysToFinal={daysToFinal} />

        {/* v0's `.page-head`: one full-bleed band that opens every app page.
            It replaces two different old treatments -- a bordered title card
            on some pages and the dashboard's textured `track-surface` hero
            box on another -- which is why the app read as several designs
            stitched together. The drifting lanes live HERE, inside a band
            with nothing but a title on it, so the motion never sits behind a
            number the reader is trying to hold. */}
        <section
          className={`relative overflow-hidden pt-9 pb-11 sm:pt-14 sm:pb-[68px] ${
            headTone === "brick" ? "bg-brick" : ""
          }`}
        >
          {headBackdrop}
          <div className="lanes" aria-hidden="true" />
          <div
            className="ambient-breath pointer-events-none absolute inset-0 origin-top bg-[radial-gradient(60%_80%_at_50%_-10%,oklch(0.8_0.11_68/0.18),transparent_62%)]"
            aria-hidden="true"
          />
          <div className="relative z-[2] mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
            {hero ?? (
              <>
                {/* A real breadcrumb, not a line that looks like one. It used
                    to be a <div> of plain text, so "PodiumCall" was dead --
                    the one affordance a breadcrumb exists to give -- and
                    assistive tech had no way to know this was navigation.
                    Now nav > ol > li with aria-current on the leaf. The
                    separator is aria-hidden: it is punctuation, and read
                    aloud it is noise between the two names that matter. */}
                <JsonLd
                  data={breadcrumbSchema([
                    { name: "PodiumCall", path: "/" },
                    { name: crumb ?? title, path: pathname },
                  ])}
                />
                {back}
                <nav
                  aria-label="Breadcrumb"
                  className="dg text-[12.5px] tracking-[0.04em] text-white/92"
                >
                  <ol className="flex items-center">
                    <li>
                      <Link to="/" className="transition-colors hover:text-white hover:underline">
                        PodiumCall
                      </Link>
                    </li>
                    <li aria-hidden="true" className="px-1.5">
                      /
                    </li>
                    <li className="text-gold-on-canvas" aria-current="page">
                      {crumb ?? title}
                    </li>
                  </ol>
                </nav>
                {eyebrow && <div className="label-caps mt-3 text-gold-on-canvas">{eyebrow}</div>}
                <h1
                  className="mt-3.5 max-w-[22ch] text-balance text-[clamp(30px,4vw,52px)] leading-[1.04] font-bold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h1>
                {description && (
                  <p className="mt-3.5 max-w-[64ch] text-[15px] leading-relaxed text-white/92 sm:text-[17px]">
                    {description}
                  </p>
                )}
                {figures && (
                  <div className="mt-7 flex flex-wrap gap-x-8 gap-y-5 sm:mt-8 sm:gap-x-11 sm:gap-y-6">
                    {figures}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Lifted so the first panel overlaps the band's lower padding --
            the seam between the two reads as one page rather than a header
            sitting on top of a body. */}
        <main
          id="main"
          // -1 so the skip link can move focus here without making the
          // region itself a tab stop on the way through.
          tabIndex={-1}
          className="relative z-[2] mx-auto -mt-[34px] max-w-[1600px] px-6 pb-[90px] sm:px-8 lg:px-12"
        >
          {children}
        </main>

        {/* The app pages had no footer landmark at all -- the landing has one,
            so the two disagreed. Also the only place the site states what it
            is not: a source, and not affiliated with anyone. */}
        <footer className="relative z-[2] border-t border-border/40 px-6 pb-10 sm:px-8 lg:px-12">
          {/* white/90, not /80: at 12px this is small text and needs 4.5:1.
              Over the grain-composited canvas /80 measured 3.80 before the
              2026-09-01 canvas change and 4.03 after -- failing either way, on
              all nine pages. /90 clears it at 4.65 and is visually the same
              line. Measured by compositing, not by eye; see styles.css. */}
          <div className="mx-auto flex max-w-[1600px] flex-col gap-1.5 pt-6 text-[12px] text-white/90 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {/* tone="canvas": this footer has no surface of its own, so it
                  sits on the terracotta like the landing's does. */}
              {t("footer.scrapedFrom")} <WaSourceLink tone="canvas" />. {t("footer.notAffiliated")}
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/how-it-works"
                className="underline decoration-white/40 underline-offset-2 transition-colors hover:decoration-white"
              >
                {t("nav.howItWorks")}
              </Link>
              <span className="text-white/70">{t("footer.disclaimer")}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/** A figure on the head band — v0's `.stat` inside `.figrow`. Big number,
 * small caps label under it, no icon and no card: on a coloured band the
 * band is already the container, and boxing each stat again was what made
 * the old dashboard hero read as a panel inside a panel. */
export function HeadFigure({
  icon,
  value,
  unit,
  label,
  hint,
  gold = false,
}: {
  /** The app's own hand-drawn glyph. v0's figrow has none; ours reads
   * better, so the icon stayed. */
  icon?: ReactNode;
  value: ReactNode;
  unit?: string | undefined;
  label: string;
  /** An optional one-line definition of what the figure measures, shown in a
   * tap-and-hover InfoTip so it works on a phone as well as a mouse. */
  hint?: string | undefined;
  /** v0's `.stat.gold` — the one figure on a band that is the point of the
   * page (the Final's date on the schedule). */
  gold?: boolean;
}) {
  const { t } = useT();
  return (
    <div>
      <b
        className={`dg nums block text-[40px] leading-none font-bold tracking-[-0.02em] whitespace-nowrap ${
          gold ? "text-gold-on-canvas" : "text-white"
        }`}
      >
        {value}
        {unit && <span className="ml-px text-[0.5em] font-semibold text-white/92">{unit}</span>}
      </b>
      <span className="label-caps mt-2.5 flex items-center gap-1.5 text-white/92">
        {icon}
        {label}
        {hint && (
          <InfoTip label={t("figure.about", { label })} tone="canvas">
            {hint}
          </InfoTip>
        )}
      </span>
    </div>
  );
}

/** Replaces the old 🥇🥈🥉🏅 emoji rank markers -- same podium palette as the
 * logo mark (gold = 1st, terracotta = 2nd, brick = 3rd), a real UI element
 * instead of a font-dependent emoji glyph. The rank>3 tier uses a fixed
 * neutral gray + white text (self-contained badge, independent of the page
 * theme) rather than --muted-foreground, which is a text-only token, not
 * meant as a badge background. */
export function RankBadge({ rank, className = "" }: { rank: number; className?: string }) {
  const tier =
    rank === 1
      ? "bg-gold-strong text-primary-foreground"
      : rank === 2
        ? "bg-terracotta text-primary-foreground"
        : rank === 3
          ? "bg-brick text-primary-foreground"
          : // Darkened from oklch(0.55 0 0) (measured ~2.9:1 against white text,
            // failing the 4.5:1 floor for this bold-but-not-"large" 11px badge
            // number, 2026-08-24 critique) -- 0.4 clears it with margin.
            "bg-[oklch(0.4_0_0)] text-white";
  return (
    <span
      className={`nums flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${tier} ${className}`}
    >
      {rank}
    </span>
  );
}

/** Loading placeholder shaped like the panel it replaces, so the page keeps
 * its real layout instead of collapsing to a centered "Loading..." box and
 * then jumping when data lands. Reuses `skeleton-pulse` (opacity-only, so it
 * works on any surface) over the dark foreground at low alpha, which reads as
 * a soft gray on the cream card. Deliberately shows NO numbers -- nothing
 * true is known yet. */
export function PanelSkeleton({
  title,
  rows = 5,
  className = "",
}: {
  title?: string;
  rows?: number;
  className?: string;
}) {
  const { t } = useT();
  return (
    <section
      className={`card-shadow card-surface rounded-[26px] bg-card ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="px-5 pt-5 sm:px-7 sm:pt-6">
        {title ? (
          <h2 className="label-caps text-muted-foreground">{title}</h2>
        ) : (
          <span className="skeleton-pulse block h-2.5 w-32 rounded-full bg-foreground" />
        )}
        <span className="sr-only">{t("common.loading")}</span>
      </div>
      <div className="space-y-4 px-5 pt-4 pb-5 sm:px-7 sm:pt-5 sm:pb-7">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="skeleton-pulse size-6 shrink-0 rounded-full bg-foreground" />
            <span
              className="skeleton-pulse h-3 rounded-full bg-foreground"
              style={{ width: `${38 + ((i * 13) % 26)}%` }}
            />
            <span className="skeleton-pulse ml-auto h-3 w-16 shrink-0 rounded-full bg-foreground" />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Error state that keeps the page's own shell/header rather than replacing
 * the whole page with a red box. */
/** The site's one failure surface.
 *
 * `onRetry` matters more than it looks: before it existed the only way out
 * of an error state was a full page reload, which is a poor answer when the
 * cause is usually an API that was restarting for two seconds. The hint is
 * suppressed when the API is remote -- telling a visitor to run api.py in a
 * folder they do not have is worse than saying nothing. */
export function ErrorPanel({
  message,
  hint,
  title,
  onRetry,
}: {
  message: string;
  hint?: ReactNode;
  title?: string;
  onRetry?: () => void;
}) {
  const { t } = useT();
  const fallbackHint = API_IS_LOCAL ? (
    <>
      {t("error.apiHintBefore")}
      <code className="nums">python api.py</code>
      {t("error.apiHintAfter")}
    </>
  ) : null;
  const shownHint = hint ?? fallbackHint;

  return (
    <section className="card-shadow card-surface rounded-[26px] bg-card p-6 sm:p-7">
      <div className="text-[14px] font-semibold text-destructive">
        {title ?? t("error.couldNotLoad")}
      </div>
      <p className="mt-1 text-[13.5px] text-foreground">{message}</p>
      {shownHint && <p className="mt-2 text-[12.5px] text-muted-foreground">{shownHint}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-terracotta-strong"
        >
          {t("common.tryAgain")}
        </button>
      )}
    </section>
  );
}

/** Athlete initials in a brand-gradient disc. Exists because RankBadge was
 * being used in places where its numbering was actively misleading: the
 * Dashboard's "Top predicted winners" list holds ONE athlete per discipline,
 * so a podium-coloured 1/2/3 implied those six were racing each other for a
 * podium they aren't. Position in the list already conveys the ordering, so
 * the marker only needs to identify the athlete. Reported by the user, not
 * inferred. */
export function AthleteAvatar({
  name,
  size = "sm",
  highlight = false,
  className = "",
}: {
  name: string;
  size?: "sm" | "lg";
  highlight?: boolean;
  className?: string;
}) {
  const words = name.split(" ").filter(Boolean);
  const initials =
    words.length === 1
      ? words[0]!.slice(0, 2).toUpperCase()
      : (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase();
  const box = size === "lg" ? "size-10 text-[13px]" : "size-6 text-[9.5px]";
  // The highlight (top pick) disc stays in the light-gold range and carries
  // DARK initials. White-on-gold was measured at 1.9:1 against the light end
  // of the gradient — a real AA failure — and darkening the gold enough to
  // rescue white text would have made it indistinguishable from the standard
  // terracotta disc. Dark-on-gold measures ~8:1 and reads like a medal.
  const tone = highlight
    ? "bg-[linear-gradient(135deg,var(--gold-light),oklch(0.72_0.13_66))] text-foreground"
    : "bg-[linear-gradient(135deg,var(--terracotta),var(--brick))] text-white";
  return (
    <span
      aria-hidden="true"
      className={`nums flex shrink-0 items-center justify-center rounded-full font-semibold ${box} ${tone} ${className}`}
    >
      {initials}
    </span>
  );
}

/** Every probability/percentage meter in the app (discipline-table rows,
 * dashboard's top winners, season progress, projections' contenders and
 * confidence list) used to be its own hand-rolled flat-terracotta sliver --
 * the single most repeated "generic dashboard" element per the 2026-08-23
 * critique. One shared bar: thicker, rounded, brand gradient fill (so a
 * short bar reads mostly terracotta and a near-full bar sweeps into gold --
 * the color itself hints at magnitude), animated on value change. */
export function ProbabilityBar({
  value,
  className = "",
  trackHeight = "h-2",
  trackClass = "bg-secondary",
}: {
  value: number;
  className?: string;
  trackHeight?: string;
  /** Track colour. Defaults to the app's light `--secondary`, which is right
   * on the cream card surfaces. The landing page passes its own translucent
   * white token instead -- `--secondary` is a light cream slab that would
   * glare against that dark tinted-glass card. A prop rather than an appended
   * class because two Tailwind `bg-*` utilities have equal specificity, so
   * which one wins depends on stylesheet order, not attribute order. */
  trackClass?: string;
}) {
  return (
    <div
      className={`w-full min-w-[32px] overflow-hidden rounded-full ${trackClass} ${trackHeight} ${className}`}
    >
      {/* transform: scaleX, not width -- animating width triggers layout on
          every frame (flagged live across all 7 bars on this page by the
          2026-08-24 critique's detector pass); scaleX is compositor-only,
          same fix already used by the landing page's .prob-fill. */}
      <div
        className="h-full origin-left rounded-full transition-transform duration-500 ease-out"
        style={{
          transform: `scaleX(${Math.max(0, Math.min(100, value)) / 100})`,
          backgroundImage: "linear-gradient(90deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
        }}
      />
    </div>
  );
}

/** The reason string comes straight from a scraped news/meet-recap match, not
 * a structured injury description -- it can be as generic as an article
 * headline ("Full Lausanne Diamond League Results..."). Framed here as
 * "flagged from" + the raw text, so the badge doesn't imply more diagnostic
 * detail than the scraper actually has. */
export function WatchBadge({
  reason,
  url,
  className = "",
  tone = "light",
  status = "watch",
}: {
  reason: string | null;
  url: string | null;
  className?: string;
  /** "watch" is an injury mention; "remove" is a reported withdrawal. Both
   * keep their place in the field -- the difference is what is known, so it
   * belongs on the label rather than in whether the row exists. */
  status?: "watch" | "remove";
  /** "light" is the app's cream card surface. "dark" is the landing page's
   * tinted-glass card, where the standard `--destructive` (oklch L=0.55) sits
   * almost on top of the surface's own lightness: measured 1.38:1 against the
   * real composited card, i.e. effectively invisible. Both tones below were
   * measured on that actual surface via canvas rather than eyeballed -- the
   * first dark attempt (L=0.88 text on a 0.22 fill) still only reached
   * 3.84:1. These values give 4.7:1, clearing the 4.5 floor for this small
   * bold label with a little margin. */
  tone?: "light" | "dark";
}) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const detail = reason ? t("watch.flaggedFrom", { reason }) : t("watch.fallback");
  const toneClass =
    tone === "dark"
      ? "bg-[oklch(0.7_0.19_27_/_0.16)] text-[oklch(0.93_0.09_27)]"
      : "bg-destructive/10 text-destructive";
  const badgeClassName = `label-caps shrink-0 rounded-sm px-1.5 py-1 ${toneClass} ${className}`;
  const popoverId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  // Real bug caught by the 2026-08-24 critique: an unconditional onBlur
  // closed the popover the instant focus left the trigger button -- including
  // a Tab press toward the "View source" link *inside* the popover, or a
  // mousedown on it -- so keyboard/screen-reader users (exactly who this
  // evidence link matters most to) could never actually reach it. Closes on
  // outside click/focus and Escape instead, which lets focus move into the
  // popover itself.
  useEffect(() => {
    if (!open) return;
    function handlePointer(e: PointerEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleFocus(e: FocusEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      <button
        type="button"
        title={detail}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={`${badgeClassName} transition-[background-color,transform] duration-150 hover:bg-destructive/20 active:scale-90`}
      >
        {t(status === "remove" ? "watch.badgeOut" : "watch.badge")}
      </button>
      {open && (
        <span
          id={popoverId}
          role="group"
          aria-label={t("watch.ariaLabel")}
          className="nums absolute left-0 top-full z-30 mt-1.5 w-64 max-w-[80vw] origin-top-left animate-[popover-in_140ms_ease-out] rounded-md border border-border bg-popover p-2.5 text-[12px] font-normal leading-snug text-popover-foreground shadow-lg"
        >
          {detail}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 block text-terracotta-strong hover:underline"
            >
              {t("watch.viewSource")}
            </a>
          )}
        </span>
      )}
    </span>
  );
}

/** A soft border + drop shadow, reintroduced 2026-08-23: the earlier
 * "de-boxing" pass (original light theme) dropped Panel's border in favor
 * of a bg-card-vs-bg-background tone difference alone. That held up while
 * both were dark tones close in lightness, but now --card (near-white) and
 * --background (a saturated medium terracotta) are worlds apart -- panels
 * need to read as light surfaces floating on a colored canvas, which is a
 * drop shadow's job, not an inset highlight's (an inset white highlight is
 * for simulating a glass edge on a DARK card; invisible on a near-white
 * one). Shadow is tinted toward --foreground's hue, not pure black. */
export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  /** Optional clarifying line under the title -- added so panels whose
   * meaning isn't self-evident from a 3-word heading (e.g. what a list is
   * actually sorted by) can say so, rather than leaving the reader to
   * infer it from the data. */
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    // 2026-08-31, the v0 "cleaner look" pass: radius 18 -> 26px and padding
    // 24 -> 28px, both taken from the direction's --radius-lg/--pad tokens.
    // Changed here rather than per route, so all nine pages move together --
    // a panel that is 26px on one page and 18px on the next is the exact
    // inconsistency this pass exists to remove. The subtitle also gains a
    // measure limit: several run long enough to stretch the full panel width,
    // which is what made dense pages read as walls of small text.
    <section className={`card-shadow card-surface rounded-[26px] bg-card ${className}`}>
      {/* 28px is right on a desktop panel and too much on a 375px phone,
          where it would spend 15% of the screen on gutters -- v0 steps its
          own band padding down on mobile for the same reason. */}
      {/* Stacks on mobile: with an action button (e.g. "How level is this
          field?") sharing the row, the title got squeezed into a narrow column
          and wrapped to three lines on a phone. On sm+ the title and action sit
          on one row again. */}
      <div className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-7 sm:pt-6">
        <div className="min-w-0">
          <h2 className="label-caps text-muted-foreground">{title}</h2>
          {subtitle && (
            <p className="mt-1.5 max-w-[70ch] text-[12px] leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="px-5 pt-4 pb-5 sm:px-7 sm:pt-5 sm:pb-7">{children}</div>
    </section>
  );
}
