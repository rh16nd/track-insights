import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { pageHead } from "@/lib/seo";
import { Shell } from "@/components/dl/shell";
import { useStats } from "@/hooks/useStats";
import { useChampionshipSummary } from "@/hooks/useChampionship";
import { WaSourceLink } from "@/components/dl/wa-link";
import { useT } from "@/lib/i18n";
import { Rich } from "@/lib/rich-text";
import { localeTag } from "@/lib/dates";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/how-it-works")({
  head: () =>
    pageHead(
      "How it works",
      "How PodiumCall predicts the podium: what its numbers mean, what the model looks at, how well it works, and where the data comes from.",
      "/how-it-works",
    ),
  component: HowItWorksPage,
});

/** One flowing explainer rather than a stack of cards: the page reads as a
 * single sheet, its sections divided by hairline rules and the numbers set
 * inline as plain figures, not boxed stat tiles. It still lives on a cream
 * surface because the terracotta canvas can't host body text at a readable
 * contrast — so "no boxes" means one continuous sheet, not text on the canvas.
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
    <section className="border-t border-border py-8 first:border-t-0 sm:py-11">
      <h2
        className="text-[19px] font-bold tracking-tight text-foreground sm:text-[21px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
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
      crumb={t("nav.howItWorks")}
      eyebrow={t("howItWorks.eyebrow")}
      description={t("howItWorks.description")}
    >
      <article className="card-surface card-shadow mx-auto max-w-[760px] rounded-[26px] bg-card px-6 sm:px-11">
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
        </div>
      </article>
    </Shell>
  );
}
