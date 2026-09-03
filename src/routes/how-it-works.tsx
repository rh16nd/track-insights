import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { pageHead } from "@/lib/seo";
import { Shell } from "@/components/dl/shell";
import { usePredictions } from "@/hooks/usePredictions";
import { useStats } from "@/hooks/useStats";
import { WaSourceLink } from "@/components/dl/wa-link";
import { useT } from "@/lib/i18n";
import { Rich } from "@/lib/rich-text";

export const Route = createFileRoute("/how-it-works")({
  head: () =>
    pageHead(
      "How it works",
      "How PodiumCall predicts the podium: what the model learns, how accurate it is, and where the data comes from.",
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
 * answers. */
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
  const preds = usePredictions();
  const stats = useStats();

  const accuracy = preds.status === "ok" ? preds.data.modelAccuracy : null;
  const basis = preds.status === "ok" ? preds.data.modelAccuracyBasis : null;
  const toplist = preds.status === "ok" ? preds.data.modelAccuracyToplist : null;
  const corpus = stats.status === "ok" ? stats.data.corpus : null;

  const num = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString());

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
              <p>
                <Rich text={t("howItWorks.s2.p3")} />
              </p>
            </div>
          </Section>

          <Section title={t("howItWorks.s3.title")}>
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <div className="nums text-[2.5rem] font-bold leading-none text-terracotta-strong">
                  {accuracy == null ? "—" : `${accuracy}%`}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {/* `basis` is prose the Python API writes, and it only
                      writes English. Use its wording when the UI is in the
                      language it was written in; otherwise use our own
                      sentence, which says the same thing. Showing an English
                      caption under a French heading is worse than losing the
                      season range it carries. */}
                  {lang === "en" ? (basis ?? t("howItWorks.s3.basisFallback")) : t("howItWorks.s3.basisFallback")}
                </div>
              </div>
              <div>
                <div className="nums text-[2.5rem] font-bold leading-none text-foreground">
                  {toplist == null ? "—" : `${toplist}%`}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {t("howItWorks.s3.toplistCaption")}
                </div>
              </div>
            </div>
            <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground">
              {t("howItWorks.s3.note")}
            </p>
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
        </div>
      </article>
    </Shell>
  );
}
