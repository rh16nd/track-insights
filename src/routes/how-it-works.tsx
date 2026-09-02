import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { Shell, Panel } from "@/components/dl/shell";
import { usePredictions } from "@/hooks/usePredictions";
import { useStats } from "@/hooks/useStats";
import { WaSourceLink } from "@/components/dl/wa-link";

export const Route = createFileRoute("/how-it-works")({
  head: () =>
    pageHead(
      "How it works",
      "How PodiumCall predicts the podium — what the model learns, how accurate it is, and where the data comes from.",
    ),
  component: HowItWorksPage,
});

/** A single, discoverable place for the two questions reviewers keep asking:
 * how accurate is it, and where does the data come from. The numbers are read
 * live from the same API the rest of the site uses, so this page cannot drift
 * from the model — a retrain updates it on its own. The prose renders
 * regardless of whether the API has answered yet. */
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
      description="PodiumCall calls the podium for every event at the 2026 Diamond League Final — from real results, before a single race is run. Here is exactly how, and how well."
    >
      <div className="mx-auto flex max-w-[820px] flex-col gap-5 py-2">
        <Panel
          title="What it predicts"
          subtitle="The podium, not the winner — and that is a deliberate choice."
        >
          <p className="text-[15px] leading-relaxed text-foreground">
            For each of the <b>32 disciplines</b> contested at the Final, the model estimates every
            contender&apos;s chance of finishing <b>in the top three</b>. It does not name a single
            winner: in a championship where several athletes can win on the day,
            &ldquo;podium&rdquo; is the honest call — the one that can be made well and checked
            against what actually happens.
          </p>
        </Panel>

        <Panel
          title="How the model learns"
          subtitle="Trained on what really happened, not on rankings or opinion."
        >
          <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-foreground">
            <p>
              The model is trained on the actual podiums of every Diamond League Final from{" "}
              <b>2018 to 2025</b> — real ground truth, scraped from World Athletics&apos; own
              results.
            </p>
            <p>
              For everyone in contention it computes <b>14 signals</b> — season best and career
              best, how consistent they are, how their form is trending, how they have done{" "}
              <b>head-to-head against this exact field</b>, and more — and a <b>random forest</b>{" "}
              weighs them into one number: the probability of a podium.
            </p>
            <p>
              It is tested honestly. Using <b>walk-forward validation</b>, it is trained only on
              seasons <i>before</i> each year it is scored on — so the accuracy below is measured on
              results the model never saw, the same way you would judge a real forecast.
            </p>
          </div>
        </Panel>

        <Panel
          title="How accurate it is"
          subtitle="Two honest numbers, from the same predictions. Read live from the model."
        >
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[14px] border border-border bg-secondary/25 p-4">
                <div className="nums text-[2rem] font-bold leading-none text-terracotta-strong">
                  {accuracy == null ? "—" : `${accuracy}%`}
                </div>
                <div className="mt-2 text-[13px] text-muted-foreground">
                  {basis ?? "Podium hit rate among the athletes who actually contest the Final"}
                </div>
              </div>
              <div className="rounded-[14px] border border-border bg-secondary/25 p-4">
                <div className="nums text-[2rem] font-bold leading-none text-foreground">
                  {toplist == null ? "—" : `${toplist}%`}
                </div>
                <div className="mt-2 text-[13px] text-muted-foreground">
                  The harder historical ruler: picking 3 from a discipline&apos;s whole ~101-athlete
                  toplist — a task the site never actually performs
                </div>
              </div>
            </div>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              Both come off the same predictions; they answer different questions, which is why they
              are about twelve points apart. The first is the task PodiumCall really does. Neither
              is rounded up.
            </p>
          </div>
        </Panel>

        <Panel
          title="Where the data comes from"
          subtitle="Scraped from World Athletics — no hand-entry, no guesswork."
        >
          <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-foreground">
            <p>
              Every mark, ranking and result is pulled directly from <WaSourceLink />
              &apos;s own public data — the same source their broadcasts and profiles use. The
              scraping runs off-site and the marks are never edited by hand.
            </p>
            {corpus && (
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-border bg-border sm:grid-cols-4">
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
                  <div key={s.l} className="bg-card p-4">
                    <div className="nums text-[1.4rem] font-bold leading-none text-foreground">
                      {s.n}
                    </div>
                    <div className="mt-1.5 text-[11.5px] uppercase tracking-wide text-muted-foreground">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        <Panel title="What it can't do" subtitle="An honest forecast names its own blind spots.">
          <ul className="flex flex-col gap-2.5 text-[15px] leading-relaxed text-foreground">
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-terracotta" />
              It reads <b>form, not the future</b> — it can&apos;t see a last-minute injury,
              withdrawal, or a tactical, slow-then-kick race on the day.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-terracotta" />
              It predicts <b>podium membership, not the exact order</b> — and never claims to know
              the winner.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-terracotta" />
              It is <b>not affiliated with World Athletics</b> or the Wanda Diamond League — it only
              reads their public data.
            </li>
          </ul>
        </Panel>
      </div>
    </Shell>
  );
}
