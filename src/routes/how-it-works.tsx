import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { pageHead } from "@/lib/seo";
import { Shell } from "@/components/dl/shell";
import { useStats } from "@/hooks/useStats";
import { useChampionshipSummary } from "@/hooks/useChampionship";
import { WaSourceLink } from "@/components/dl/wa-link";
import { useT } from "@/lib/i18n";
import { Rich } from "@/lib/rich-text";
import { localeTag } from "@/lib/dates";
import { usePageTitle } from "@/lib/use-page-title";
import { dateRange, phaseOf } from "@/lib/championship-dates";
import { CLOSING_PHOTO } from "@/lib/closing-photo";
import { FeedbackLink } from "@/components/dl/feedback-modal";

export const Route = createFileRoute("/how-it-works")({
  head: () =>
    pageHead(
      "How it works",
      "How PodiumCall predicts the podium: what its numbers mean, what the model looks at, how well it works, and where the data comes from.",
      "/how-it-works",
    ),
  component: HowItWorksPage,
});

/** One flowing explainer rather than a stack of cards: the page reads as one
 * column straight on the page, with no box around it (the user, 2026-09-22),
 * its sections divided by hairline rules and the numbers set inline as plain
 * figures, not boxed stat tiles. It ends on what comes next and a closing
 * band with the way into the call.
 * Every number is read live from the same API the rest of the site uses, so
 * this page can't drift from the model; the prose renders before the API
 * answers.
 *
 * Since 2026-09-17 one model makes every number on the site, so the page
 * explains that one model around a reader's questions (what the numbers mean,
 * what it looks at, how well it works, what it can't know) instead of one
 * section per model. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-10 first:border-t-0 first:pt-2 sm:py-12">
      <h2 className="hero-serif text-balance text-[clamp(26px,3vw,34px)] leading-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function HowItWorksPage() {
  const { t, lang } = useT();
  usePageTitle(t("nav.howItWorks"));
  const stats = useStats();
  const champ = useChampionshipSummary();
  const test = champ.status === "ok" ? (champ.data.callTest ?? null) : null;
  const current = champ.status === "ok" ? champ.data : null;
  const corpus = stats.status === "ok" ? stats.data.corpus : null;
  const comparison = stats.status === "ok" ? (stats.data.modelComparison ?? null) : null;

  const num = (n: number | null | undefined) =>
    n == null ? "—" : n.toLocaleString(localeTag(lang));
  // Percentages keep their decimal, so 62.0 does not print as "62" beside 54.8.
  const pct = (n: number | null | undefined) =>
    n == null
      ? "—"
      : n.toLocaleString(localeTag(lang), { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <Shell
      title={t("nav.howItWorks")}
      photo="how"
      crumb={t("nav.howItWorks")}
      eyebrow={t("howItWorks.eyebrow")}
      description={t("howItWorks.description")}
      layout="open"
    >
      <article className="mx-auto max-w-[760px]">
        <div>
          <Section title={t("howItWorks.s1.title")}>
            <div className="mt-3.5 flex flex-col gap-3.5 text-[15px] leading-relaxed text-foreground">
              <p>
                <Rich text={t("howItWorks.s1.p1")} />
              </p>
              <p>
                <Rich text={t("howItWorks.s1.world")} />
              </p>
              <p>
                <Rich text={t("howItWorks.s1.p2")} />
              </p>
            </div>
          </Section>

          <Section title={t("howItWorks.s2.title")}>
            <div className="mt-3.5 flex flex-col gap-3.5 text-[15px] leading-relaxed text-foreground">
              <p>
                <Rich text={t("howItWorks.s2.p1")} />
              </p>
              <p>
                <Rich text={t("howItWorks.s2.p2")} />
              </p>
            </div>
          </Section>

          {/* Both figures are read, not typed: the test from the current
              championship's saved call, the comparison from the head-to-head
              run's report. Each paragraph appears once its figures exist.
              Years are not run through num(), which would print 2012 as
              "2,012". */}
          <Section title={t("howItWorks.s3.title")}>
            <div className="mt-3.5 flex flex-col gap-3.5 text-[15px] leading-relaxed text-foreground">
              {test && (
                <p>
                  <Rich
                    text={t("howItWorks.s3.test", {
                      versions: num(test.versions),
                      finals: num(test.finals),
                      from: test.from ?? "—",
                      to: test.to ?? "—",
                      model: pct(test.model),
                      points: pct(test.points),
                    })}
                  />
                </p>
              )}
              {comparison && (
                <p>
                  <Rich
                    text={t("howItWorks.s3.compare", {
                      finals: num(comparison.finals),
                      from: comparison.from,
                      to: comparison.to,
                      model: pct(comparison.model),
                      previous: pct(comparison.previous),
                      champModel: pct(comparison.championships.model),
                      champPrevious: pct(comparison.championships.previous),
                    })}
                  />
                </p>
              )}
              {/* What no accuracy figure covers: every final in both tests
                  is scored on the athletes who reached the start line, so a
                  withdrawal is invisible to them by construction. */}
              <p className="text-[14px] text-muted-foreground">{t("howItWorks.s3.withdrawals")}</p>
            </div>
          </Section>

          <Section title={t("howItWorks.s5.title")}>
            <ul className="mt-3.5 flex flex-col gap-3 text-[15px] leading-relaxed text-foreground">
              <li className="flex gap-3">
                <span className="mt-[9px] size-1.5 flex-none rounded-full bg-terracotta" />
                <span>
                  <Rich text={t("howItWorks.s5.b1")} />
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[9px] size-1.5 flex-none rounded-full bg-terracotta" />
                <span>
                  <Rich text={t("howItWorks.s5.b2")} />
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[9px] size-1.5 flex-none rounded-full bg-terracotta" />
                <span>
                  <Rich text={t("howItWorks.s5.b3")} />
                </span>
              </li>
            </ul>
          </Section>

          <Section title={t("howItWorks.s4.title")}>
            <p className="mt-3.5 text-[15px] leading-relaxed text-foreground">
              {t("howItWorks.s4.pBefore")}
              <WaSourceLink />
              {t("howItWorks.s4.pAfter")}
            </p>
            {corpus && (
              <div className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
                {[
                  { n: num(corpus.competitions), l: t("howItWorks.s4.competitions") },
                  { n: num(corpus.marks), l: t("howItWorks.s4.marks") },
                  { n: num(corpus.venues), l: t("howItWorks.s4.venues") },
                  {
                    n:
                      corpus.firstSeason && corpus.lastSeason
                        ? `${corpus.firstSeason}–${corpus.lastSeason}`
                        : `${corpus.seasons}`,
                    l: corpus.firstSeason
                      ? t("howItWorks.s4.seasons")
                      : t("howItWorks.s4.seasonsDeep"),
                  },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="nums text-[1.5rem] font-bold leading-none text-foreground">
                      {s.n}
                    </div>
                    <div className="mt-1.5 text-[11.5px] uppercase tracking-wide text-muted-foreground">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Added because the search quietly grew a second thing it can find
              and nothing on the site said so. A feature nobody knows about is
              the same as one that is not there. */}
          <Section title={t("howItWorks.s6.title")}>
            <p className="mt-3.5 text-[15px] leading-relaxed text-foreground">
              <Rich text={t("howItWorks.s6.p1")} />
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground">
              <Rich text={t("howItWorks.s6.p2")} />
            </p>
          </Section>

          {/* What comes next, read off the current championship so it moves on
              with the data (the user, 2026-09-22). Only what is planned: the
              call stands, each final is graded, the hit rate joins the rest. */}
          {current && <WhatsNext current={current} />}
        </div>
      </article>

      <ClosingBand />
    </Shell>
  );
}

function WhatsNext({
  current,
}: {
  current: { navKey: string | null; city: string; startDate: string; endDate: string };
}) {
  const { t, lang } = useT();
  const name = t(current.navKey ?? "nav.championship");
  const done = phaseOf(current).phase === "done";
  const lines = done
    ? [t("howItWorks.next.done1", { name }), t("howItWorks.next.done2")]
    : [
        t("howItWorks.next.upcoming1", {
          name,
          dates: dateRange(current, lang),
          city: current.city,
        }),
        t("howItWorks.next.upcoming2"),
        t("howItWorks.next.upcoming3"),
      ];
  return (
    <Section title={t("howItWorks.next.title")}>
      <ol className="mt-5 flex flex-col gap-5">
        {lines.map((line, i) => (
          <li key={i} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
            <span
              aria-hidden="true"
              className="hero-serif text-[32px] leading-[0.9] text-gold-strong"
              style={{ fontVariantNumeric: "lining-nums" }}
            >
              {i + 1}
            </span>
            <p className="text-[15px] leading-relaxed text-foreground">
              <Rich text={line} />
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** The landing's closing band, on its stadium photo: one line and the two ways
 * on from here, the call and a word back to us. */
function ClosingBand() {
  const { t } = useT();
  const title = t("howItWorks.close.title").split("**");
  return (
    <section
      className="relative isolate -mx-6 mt-16 -mb-[90px] overflow-hidden sm:-mx-8 lg:-mx-12"
      // The scrim fades into the landing's ground; here that is the page's.
      style={{ "--terra-bg": "var(--page-ground, var(--background))" } as CSSProperties}
    >
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
      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center sm:px-10 sm:py-32">
        <h2 className="hero-serif text-balance text-[clamp(34px,5vw,60px)] leading-[1.05] text-white">
          {title.map((part, i) =>
            i % 2 ? (
              <span key={i} className="text-gold-on-canvas">
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </h2>
        <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-white/88">
          {t("howItWorks.close.lede")}
        </p>
        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            to="/championship"
            className="inline-flex w-full max-w-[320px] items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-terracotta-strong shadow-[0_10px_30px_oklch(0.2_0.05_40/0.35)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("howItWorks.close.call")}
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
          <FeedbackLink className="hero-glass inline-flex w-full max-w-[320px] items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/20 active:scale-[0.98] sm:w-auto" />
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
  );
}
