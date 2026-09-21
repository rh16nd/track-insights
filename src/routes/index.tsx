import { pageHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { usePredictions } from "@/hooks/usePredictions";
import { useStats } from "@/hooks/useStats";
import { useChampionshipSummary } from "@/hooks/useChampionship";
import { useWorldRankings } from "@/hooks/useWorldRankings";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { PodiumCallMark } from "@/components/dl/logo";
import { WaSourceLink } from "@/components/dl/wa-link";
import { useT } from "@/lib/i18n";
import { FeedbackLink } from "@/components/dl/feedback-modal";
import { IntroVideo } from "@/components/dl/intro-video";
import { LandingHero } from "@/components/dl/landing-hero";
import { LandingNav, LANDING_SECTIONS } from "@/components/dl/landing-nav";
import { LandingFeatures } from "@/components/dl/landing-features";
import { LandingCall } from "@/components/dl/landing-call";
import { chanceLabel, discName } from "@/lib/dl-data";
import { localeTag } from "@/lib/dates";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "The world's best, read by the model",
      "Real-data athletics rankings across 36 disciplines and the model's rating of the world's top 20 in each, from results scraped from World Athletics. Plus a call on every event at the next major championship.",
      "/",
    ),
  component: Landing,
});

/* The landing, rebuilt after the Terra template the user picked on
   2026-09-21, top to bottom: a dark page, serif headings with one word in the
   brand's gold, a strip of favourites, big numbers, the current championship's
   call in that championship's colours, what is on the site beside a photo and
   a card of each page's live numbers, questions, and a closing band with the
   two ways in. The menu floats above it all and scrolls within the page.

   What it replaced, so it can be asked for back: the terracotta and cream
   bands, the three podium cards, the "raw signal to ranked field" demo, the
   five-step pipeline list and the dashboard preview panel. Every number and
   name on the new page still comes from the API; nothing is typed in. */

/** A section heading in the landing's serif, with the words between ** in the
 * brand's gold, as Terra colours one word per heading. The copy marks the
 * word so the translation can put the accent where French puts it. */
function AccentTitle({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split("**");
  return (
    <h2 className={`hero-serif text-balance text-[var(--terra-fg)] ${className}`}>
      {parts.map((part, i) =>
        i % 2 ? (
          <span key={i} className="text-[var(--terra-gold)]">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </h2>
  );
}

/** One of the big numbers. `value` is a number so it can count up from zero
 * when the section comes into view, and it keeps its decimal: 65.3 is the
 * test's figure, and rounding it would claim a tenth the model has not earned.
 * Null while the API is still answering. */
function BigNumber({
  value,
  unit = "",
  decimals = 0,
  label,
  run,
  delayMs = 0,
}: {
  value: number | null;
  unit?: string;
  decimals?: number;
  label: string;
  run: boolean;
  delayMs?: number;
}) {
  const { lang } = useT();
  const counted = useCountUp(run ? (value ?? 0) : 0, 1100, { from: 0, delayMs });
  const shown =
    value === null
      ? "—"
      : counted.toLocaleString(localeTag(lang), {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
  return (
    <div className="border-t border-[var(--terra-border)] pt-6 text-center">
      <div className="hero-serif nums text-[clamp(52px,8vw,96px)] leading-none text-[var(--terra-fg)]">
        {shown}
        {value !== null && unit ? (
          <span className="text-[0.5em] text-[var(--terra-gold)]">{unit}</span>
        ) : null}
      </div>
      <div className="mt-3 text-[13.5px] text-[var(--terra-muted)]">{label}</div>
    </div>
  );
}

const FAQ_KEYS = ["rating", "chance", "accuracy", "data", "injuries", "free", "affiliated"];

/** The closing band's photo: the Jāņa Daliņa stadium in Valmiera, Latvia, from
 * Wikimedia Commons under CC BY-SA 4.0, so it carries its credit. Saved to
 * public/landing/ in two sizes. Terra ends on a landscape; this page ends on a
 * real athletics stadium. */
const CLOSING_PHOTO = {
  small: "/landing/closing-stadium-1200.webp",
  large: "/landing/closing-stadium-2400.webp",
  author: "KristersHC",
  license: "CC BY-SA 4.0",
  source: "https://commons.wikimedia.org/wiki/File:J%C4%81%C5%86a_Dali%C5%86a_stadions.jpg",
};

function Landing() {
  const { t, lang } = useT();
  usePageTitle(t("seo.landing"));
  const state = usePredictions();
  const stats = useStats();
  const championshipState = useChampionshipSummary();
  const ev = championshipState.status === "ok" ? championshipState.data : undefined;
  const rankingsState = useWorldRankings();
  const rankings = rankingsState.status === "ok" ? rankingsState.data : undefined;

  // The headline figure belongs to the model that made the call this page
  // counts down to: the championship's own test when its call carries one.
  const test = ev?.callTest ?? null;
  const accuracy = test?.model ?? (state.status === "ok" ? state.data.modelAccuracy : null);
  const countdownLabel = (() => {
    if (!ev) return t("landing.badgeBare");
    const now = Date.now();
    const start = new Date(`${ev.startDate}T00:00:00`).getTime();
    const end = new Date(`${ev.endDate}T23:59:59`).getTime();
    if (now > end) return t("landing.badgeDone", { city: ev.city });
    if (now >= start) return t("landing.badgeLive", { city: ev.city });
    const days = Math.max(0, Math.ceil((start - now) / 86_400_000));
    return t(days === 1 ? "landing.badgeCountdownOne" : "landing.badgeCountdown", {
      n: days,
      city: ev.city,
    });
  })();
  const championshipName = t(ev?.navKey ?? "nav.championship");
  // Every event with a page, counted off the rankings rather than typed.
  const disciplineCount = rankings ? Object.keys(rankings).length : 36;

  // The strip: each event's favourite in the model rating, highest first.
  const strip = useMemo(() => {
    if (!rankings) return [];
    return Object.entries(rankings)
      .map(([discKey, r]) => ({ discKey, top: r.model[0] }))
      .filter((x) => x.top && x.top.ratingPct != null)
      .map((x) => ({ discKey: x.discKey, name: x.top!.name, rating: x.top!.ratingPct! }))
      .sort((a, b) => b.rating - a.rating);
  }, [rankings]);
  const stripRange =
    strip.length > 0
      ? {
          lo: chanceLabel(lang, Math.min(...strip.map((c) => c.rating))),
          hi: chanceLabel(lang, Math.max(...strip.map((c) => c.rating))),
        }
      : null;

  const marksScored =
    stats.status === "ok" && stats.data.scoreScale ? stats.data.scoreScale.rows : null;
  const numbersInView = useInView<HTMLElement>(0.3);

  const stripItem = (c: (typeof strip)[number], hidden = false) => (
    <span
      key={hidden ? `${c.discKey}-dup` : c.discKey}
      role={hidden ? undefined : "listitem"}
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-2.5 whitespace-nowrap px-6 text-[14px] text-[var(--terra-muted)]"
    >
      <span className="nums font-semibold text-[var(--terra-gold)]">
        {chanceLabel(lang, c.rating)}%
      </span>
      <span className="font-medium text-[var(--terra-fg)]">{c.name}</span>
      <span>{discName(t, c.discKey, c.discKey)}</span>
    </span>
  );

  return (
    <div className="landing landing-terra relative min-h-screen bg-[var(--terra-bg)] text-[var(--terra-fg)]">
      {/* The landing renders straight under <Outlet /> rather than through
          Shell, so it needs its own skip link and <main> landmark. */}
      <a
        href="#content"
        className="skip-link label-caps rounded-full bg-card px-4 py-2.5 text-foreground shadow-lg"
      >
        Skip to content
      </a>
      <LandingNav championshipNavKey={ev?.navKey} />
      <main id="content" tabIndex={-1} className="relative">
        <LandingHero
          rankings={rankings}
          countdownLabel={countdownLabel}
          disciplineCount={disciplineCount}
        />

        {/* ── The favourites strip, in the place Terra keeps its logos ── */}
        <section className="border-b border-[var(--terra-border)] py-6">
          <p className="mx-auto mb-4 max-w-6xl px-5 text-[13px] text-[var(--terra-muted)] sm:px-10">
            {stripRange
              ? t("landing.tickerWithRange", {
                  n: strip.length,
                  lo: stripRange.lo,
                  hi: stripRange.hi,
                })
              : t("landing.ticker")}
          </p>
          {strip.length > 0 ? (
            <div
              className="marquee-mask overflow-hidden"
              role="list"
              aria-label={t("landing.tickerAria")}
            >
              <div className="marquee-track flex w-max">
                {strip.map((c) => stripItem(c))}
                {strip.map((c) => stripItem(c, true))}
              </div>
            </div>
          ) : (
            <p className="mx-auto max-w-6xl px-5 text-[13px] text-[var(--terra-muted)] sm:px-10">
              {t("landing.confidenceFeedLoads")}
            </p>
          )}
        </section>

        {/* ── Big numbers ── */}
        <section
          ref={numbersInView.ref}
          id={LANDING_SECTIONS.numbers}
          tabIndex={-1}
          className="scroll-mt-16 px-5 py-24 outline-none sm:px-10 sm:py-32"
        >
          <div className="mx-auto max-w-5xl text-center">
            <AccentTitle
              text={t("landing.numbers.title")}
              className="text-[clamp(34px,5vw,58px)] leading-[1.08]"
            />
            <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-[var(--terra-muted)]">
              {t("landing.numbers.lede")}
            </p>
            <div className="mt-16 grid gap-x-16 gap-y-12 sm:grid-cols-2">
              <BigNumber
                value={accuracy}
                unit="%"
                decimals={1}
                run={numbersInView.inView}
                label={t("landing.numbers.hitRate")}
              />
              <BigNumber
                value={test?.finals ?? null}
                run={numbersInView.inView}
                delayMs={120}
                label={t("landing.numbers.finals", {
                  from: test?.from ?? "",
                  to: test?.to ?? "",
                })}
              />
              <BigNumber
                value={rankings ? disciplineCount : null}
                run={numbersInView.inView}
                delayMs={220}
                label={t("landing.numbers.events")}
              />
              <BigNumber
                value={marksScored}
                run={numbersInView.inView}
                delayMs={300}
                label={t("landing.statMarks")}
              />
            </div>
            {state.status === "error" && (
              <p className="mt-8 text-[13px] text-[var(--terra-muted)]">
                {t("landing.statsError")}
              </p>
            )}
          </div>
        </section>

        {/* ── The current championship's call, in its colours ── */}
        <LandingCall summary={ev} countdownLabel={countdownLabel} />

        {/* ── The one-minute walkthrough, for anyone new ── */}
        <section className="px-5 pb-24 pt-4 sm:px-10 sm:pb-32">
          <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div className="text-center md:text-left">
              <AccentTitle
                text={t("landing.walkthrough.title")}
                className="text-[clamp(30px,4vw,44px)] leading-[1.1]"
              />
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--terra-muted)]">
                {t("landing.walkthrough.lede")}
              </p>
            </div>
            <IntroVideo />
          </div>
        </section>

        {/* ── What is on the site ── */}
        <section
          id={LANDING_SECTIONS.features}
          tabIndex={-1}
          className="scroll-mt-24 px-5 pb-24 outline-none sm:px-10 sm:pb-32"
        >
          <div className="mx-auto max-w-6xl">
            <AccentTitle
              text={t("landing.features.title")}
              className="max-w-[18ch] text-[clamp(34px,5vw,58px)] leading-[1.08]"
            />
            <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-[var(--terra-muted)]">
              {t("landing.features.lede")}
            </p>
            <LandingFeatures rankings={rankings} strip={strip} summary={ev} />
          </div>
        </section>

        {/* ── Questions ── */}
        <section className="px-5 pb-24 sm:px-10 sm:pb-32">
          <div className="mx-auto max-w-3xl">
            <AccentTitle
              text={t("landing.faq.title")}
              className="text-center text-[clamp(34px,5vw,58px)] leading-[1.08]"
            />
            <div className="mt-12 flex flex-col gap-3">
              {FAQ_KEYS.map((key) => (
                <details
                  key={key}
                  className="group rounded-2xl border border-[var(--terra-border)] bg-[oklch(1_0_0_/_0.015)] open:bg-[var(--terra-surface)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-[16px] font-medium text-[var(--terra-fg)] sm:px-6">
                    {t(`landing.faq.${key}.q`)}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="size-4 shrink-0 text-[var(--terra-muted)] transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="px-5 pb-5 text-[15px] leading-relaxed text-[var(--terra-muted)] sm:px-6">
                    {key === "accuracy" && test && test.finals != null && test.points != null
                      ? t("landing.faq.accuracy.a", {
                          finals: test.finals.toLocaleString(localeTag(lang)),
                          from: test.from ?? "",
                          to: test.to ?? "",
                          model: test.model.toLocaleString(localeTag(lang), {
                            minimumFractionDigits: 1,
                          }),
                          points: test.points.toLocaleString(localeTag(lang), {
                            minimumFractionDigits: 1,
                          }),
                        })
                      : key === "accuracy"
                        ? t("landing.faq.accuracy.aFallback")
                        : t(`landing.faq.${key}.a`)}
                  </p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-center text-[14px] text-[var(--terra-muted)]">
              <Link
                to="/how-it-works"
                className="text-[var(--terra-fg)] underline underline-offset-4"
              >
                {t("landing.faq.more")}
              </Link>
            </p>
          </div>
        </section>

        {/* ── The closing band ── */}
        <section className="relative isolate overflow-hidden">
          <img
            src={CLOSING_PHOTO.large}
            srcSet={`${CLOSING_PHOTO.small} 1200w, ${CLOSING_PHOTO.large} 2400w`}
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_65%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[oklch(0.52_0.105_40_/_0.3)] mix-blend-multiply"
          />
          <div aria-hidden="true" className="closing-scrim absolute inset-0 -z-10" />
          <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-28 text-center sm:px-10 sm:py-36">
            <AccentTitle
              text={t("landing.closing.title")}
              className="text-[clamp(38px,6vw,72px)] leading-[1.05]"
            />
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-white/88">
              {t("landing.closing.lede", { n: disciplineCount })}
            </p>
            {/* The two ways in, here rather than in the hero, so the reader
                meets them after seeing what the site holds (user, 2026-09-21). */}
            <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/dashboard"
                className="inline-flex w-full max-w-[320px] items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-terracotta-strong shadow-[0_10px_30px_oklch(0.2_0.05_40/0.35)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t("landing.ctaPrimary")}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  className="size-[18px]"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                to="/stats"
                className="hero-glass inline-flex w-full max-w-[320px] items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/20 active:scale-[0.98] sm:w-auto"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t("landing.ctaSecondary", { n: disciplineCount })}
              </Link>
            </div>
          </div>
          <a
            href={CLOSING_PHOTO.source}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-4 right-5 text-[11px] text-white/60 hover:text-white/90 hover:underline sm:right-10"
          >
            {t("ath.photoCredit", { author: CLOSING_PHOTO.author, license: CLOSING_PHOTO.license })}
          </a>
        </section>

        <LandingFooter championshipName={championshipName} />
      </main>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="inline-block py-1.5 text-[14px] text-[var(--terra-muted)] transition-colors hover:text-[var(--terra-fg)]"
      >
        {children}
      </Link>
    </li>
  );
}

function LandingFooter({ championshipName }: { championshipName: string }) {
  const { t } = useT();
  return (
    <footer className="border-t border-[var(--terra-border)] px-5 pb-8 pt-14 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <PodiumCallMark className="size-5" />
            <span
              className="text-[15px] font-bold uppercase tracking-[0.08em] text-[var(--terra-fg)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PodiumCall
            </span>
          </Link>
          <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-[var(--terra-muted)]">
            {t("landing.tagline")}.
          </p>
        </div>
        <nav aria-label={t("landing.footer.explore")}>
          <h2 className="label-caps text-[var(--terra-fg)]">{t("landing.footer.explore")}</h2>
          <ul className="mt-3">
            <FooterLink to="/dashboard">{t("nav.dashboard")}</FooterLink>
            <FooterLink to="/track">{t("nav.track")}</FooterLink>
            <FooterLink to="/field">{t("nav.field")}</FooterLink>
            <FooterLink to="/championship">{championshipName}</FooterLink>
            <FooterLink to="/results">{t("nav.results")}</FooterLink>
            <FooterLink to="/schedule">{t("nav.schedule")}</FooterLink>
          </ul>
        </nav>
        <nav aria-label={t("landing.footer.about")}>
          <h2 className="label-caps text-[var(--terra-fg)]">{t("landing.footer.about")}</h2>
          <ul className="mt-3">
            <FooterLink to="/how-it-works">{t("nav.howItWorks")}</FooterLink>
            <FooterLink to="/stats">{t("nav.stats")}</FooterLink>
            <li>
              <FeedbackLink className="inline-block py-1.5 text-[14px] text-[var(--terra-muted)] transition-colors hover:text-[var(--terra-fg)]" />
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-[var(--terra-border)] pt-6 text-[12.5px] text-[var(--terra-muted)]">
        {t("footer.scrapedFrom")} <WaSourceLink tone="canvas" />. {t("footer.notAffiliated")}
      </div>
    </footer>
  );
}
