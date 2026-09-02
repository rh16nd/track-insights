import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { pageHead } from "@/lib/seo";
import { Shell } from "@/components/dl/shell";
import { usePredictions } from "@/hooks/usePredictions";
import { useStats } from "@/hooks/useStats";
import { WaSourceLink } from "@/components/dl/wa-link";

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
  const preds = usePredictions();
  const stats = useStats();

  const accuracy = preds.status === "ok" ? preds.data.modelAccuracy : null;
  const basis = preds.status === "ok" ? preds.data.modelAccuracyBasis : null;
  const toplist = preds.status === "ok" ? preds.data.modelAccuracyToplist : null;
  const corpus = stats.status === "ok" ? stats.data.corpus : null;

  const num = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString());

  return (
    <Shell
      title="How it works"
      crumb="How it works"
      eyebrow="About the model"
      description="PodiumCall calls the podium for every event at the 2026 Diamond League Final, from real World Athletics results, before anyone races. Here's exactly how it does that, and how well it works."
    >
      <article className="card-surface card-shadow mx-auto max-w-[760px] rounded-[26px] bg-card px-6 sm:px-11">
        <div>
          <Section title="What it predicts">
            <div className="mt-3.5 flex flex-col gap-3.5 text-[15px] leading-relaxed text-foreground">
              <p>
                For every one of the <b>32 events</b> at the Brussels Final, the model gives each
                contender a single number: their chance of finishing <b>in the top three</b>. It
                never names one winner.
              </p>
              <p>
                That&apos;s on purpose. On the day, the fastest qualifier can false-start, get boxed
                in, or be caught on the line, so &ldquo;who wins&rdquo; is close to a coin toss
                between three or four names. &ldquo;Who makes the podium&rdquo; is the harder
                question to dodge, and the one you can actually check against the result afterwards.
                So every figure on the site is about the top three, never the gold medal on its own.
              </p>
            </div>
          </Section>

          <Section title="How the model learns">
            <div className="mt-3.5 flex flex-col gap-3.5 text-[15px] leading-relaxed text-foreground">
              <p>
                It learns from the actual podiums of every Diamond League Final from{" "}
                <b>2018 to 2025</b> (2020 was cancelled). That&apos;s real ground truth, scraped
                straight from World Athletics&apos; own results, not anyone&apos;s ranking of who
                &ldquo;should&rdquo; win.
              </p>
              <p>
                For each athlete in contention it works out <b>14 signals</b> from their real
                season: their season best and career best, how consistent they&apos;ve been meet to
                meet, which way their form is trending, how many times they&apos;ve raced, and how
                they&apos;ve done <b>head-to-head against this exact field</b>. A{" "}
                <b>random forest</b> weighs all of it into one number, the probability of a podium.
                A forest is used because these signals pull on each other in ways a single
                straight-line formula misses: a blazing season best counts for less, for instance,
                if the athlete has barely raced all year.
              </p>
              <p>
                And it&apos;s graded the honest way. Under <b>walk-forward validation</b> the model
                only ever trains on seasons <i>before</i> the year it&apos;s being scored on, so the
                accuracy below comes entirely from Finals it had never seen. That&apos;s the
                difference between a real forecast and a model that has just memorised the answers.
              </p>
            </div>
          </Section>

          <Section title="How accurate it is">
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <div className="nums text-[2.5rem] font-bold leading-none text-terracotta-strong">
                  {accuracy == null ? "—" : `${accuracy}%`}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {basis ?? "Podium hit rate among the athletes who actually contest the Final"}
                </div>
              </div>
              <div>
                <div className="nums text-[2.5rem] font-bold leading-none text-foreground">
                  {toplist == null ? "—" : `${toplist}%`}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  The brutal stress test: picking the 3 medallists out of a discipline&apos;s whole
                  ~101-name toplist, which the site never actually asks of it
                </div>
              </div>
            </div>
            <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground">
              Both numbers come off the exact same predictions; they just ask different questions.
              The first is the real job, and the one the site does: given the eight-to-ten athletes
              who actually make a Final, how often is the model&apos;s projected top three right?
              The second is a deliberately harder task it never has to perform. They sit about
              twelve points apart, and neither is rounded up or picked from a flattering season.
            </p>
          </Section>

          <Section title="Where the data comes from">
            <p className="mt-3.5 text-[15px] leading-relaxed text-foreground">
              Every mark, ranking and result comes straight from <WaSourceLink />
              &apos;s own public API, the same data behind their broadcasts and athlete profiles.
              The scraping runs on a separate machine, and no mark is ever typed in or edited by
              hand, so what you read here is exactly what they published.
            </p>
            {corpus && (
              <div className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
                {[
                  { n: num(corpus.competitions), l: "Competitions" },
                  { n: num(corpus.marks), l: "Marks" },
                  { n: num(corpus.venues), l: "Venues" },
                  {
                    n:
                      corpus.firstSeason && corpus.lastSeason
                        ? `${corpus.firstSeason}–${corpus.lastSeason}`
                        : `${corpus.seasons}`,
                    l: corpus.firstSeason ? "Seasons" : "Seasons deep",
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

          <Section title="What it can't do">
            <ul className="mt-3.5 flex flex-col gap-3 text-[15px] leading-relaxed text-foreground">
              <li className="flex gap-3">
                <span className="mt-[9px] size-1.5 flex-none rounded-full bg-terracotta" />
                <span>
                  It reads <b>form, not the future</b>. A last-minute injury, a withdrawal announced
                  the morning of, or a tactical sit-and-kick race can all beat the numbers on the
                  day.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[9px] size-1.5 flex-none rounded-full bg-terracotta" />
                <span>
                  It predicts <b>who makes the podium, not the exact 1-2-3</b>, and it never claims
                  to know who wins.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[9px] size-1.5 flex-none rounded-full bg-terracotta" />
                <span>
                  It&apos;s <b>not affiliated with World Athletics</b> or the Wanda Diamond League.
                  It just reads their public data.
                </span>
              </li>
            </ul>
          </Section>
        </div>
      </article>
    </Shell>
  );
}
