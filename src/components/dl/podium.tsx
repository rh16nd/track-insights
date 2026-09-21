import { useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { discName } from "@/lib/dl-data";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { WatchBadge } from "./shell";
import type { TopWinner } from "@/lib/dl-data";

/** One plaque: the athlete the championship model rates highest in an event,
 * with that model rating. A rating and never a podium chance, which the site
 * names only for a real competition (2026-09-17). */
export type PodiumPick = TopWinner;
import { WaAthleteLink } from "./wa-link";

/** The model's favourites as a podium — the old landing's signature block,
 * brought back on the Terra landing at the user's request (2026-09-21) and
 * dressed in its look: glass plaques, serif figures, and gold, silver and
 * bronze blocks.
 *
 * Reads the same favourites the dashboard reads (each event's highest model
 * rating), in the same order: highest rating first. Do not re-sort or re-index
 * them here.
 *
 * The one thing a podium shape asserts that a list does not: that these
 * three are ranked against each other. They are not — each is the favourite
 * in a DIFFERENT discipline, so the footnote saying so is load-bearing,
 * exactly as it is on the dashboard and in the landing's preview panel.
 *
 * Every class below is written out in full. Tailwind reads source as text,
 * so a class assembled at runtime (`sm:${step.height}`) is never generated —
 * it would silently produce an unstyled podium. */
type Step = {
  /** Index into the top three. Visual order is 2nd, 1st, 3rd. */
  index: number;
  block: string;
  rank: string;
  order: string;
  /** Centre first: the eye should land on the strongest call. */
  plaqueDelay: string;
  blockDelay: string;
};

const STEPS: Step[] = [
  {
    index: 1,
    block:
      "h-16 sm:h-[138px] bg-[linear-gradient(180deg,oklch(0.88_0.012_75)_0%,oklch(0.64_0.02_60)_100%)]",
    rank: "text-[38px] sm:text-[60px] text-[oklch(0.17_0.012_45/0.5)]",
    order: "order-2 sm:order-1",
    plaqueDelay: "0.78s",
    blockDelay: "0.46s",
  },
  {
    index: 0,
    block:
      "h-16 sm:h-[188px] bg-[linear-gradient(180deg,var(--gold-light)_0%,var(--gold-strong)_100%)]",
    rank: "text-[44px] sm:text-[84px] text-[oklch(0.17_0.012_45/0.5)]",
    order: "order-1 sm:order-2",
    plaqueDelay: "0.62s",
    blockDelay: "0.3s",
  },
  {
    index: 2,
    block:
      "h-16 sm:h-[110px] bg-[linear-gradient(180deg,oklch(0.72_0.11_50)_0%,oklch(0.5_0.11_40)_100%)]",
    rank: "text-[38px] sm:text-[52px] text-[oklch(0.17_0.012_45/0.5)]",
    order: "order-3",
    plaqueDelay: "0.92s",
    blockDelay: "0.62s",
  },
];

export function Podium({ winners }: { winners: PodiumPick[] }) {
  // Replay remounts the subtree by changing its key rather than toggling a
  // class and forcing a reflow the way the static mockup had to.
  const [run, setRun] = useState(0);
  const { t } = useT();
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const top3 = winners.slice(0, 3);
  if (top3.length < 3) return null;

  return (
    <div ref={ref}>
      <div
        key={run}
        className={`${inView ? "podium-in" : ""} mx-auto mt-12 grid max-w-[900px] items-end gap-4 sm:mt-14 sm:grid-cols-[1fr_1.12fr_1fr] sm:gap-[22px]`}
      >
        {STEPS.map((step) => {
          const winner = top3[step.index];
          if (!winner) return null;
          return (
            <div key={winner.name} className={`flex flex-col ${step.order}`}>
              <Plaque winner={winner} lead={step.index === 0} delay={step.plaqueDelay} run={run} />
              <div
                aria-hidden="true"
                className={`podium-block relative flex items-center justify-center overflow-hidden rounded-b-[16px] sm:mt-5 sm:rounded-b-none sm:rounded-t-[16px] ${step.block}`}
                style={{ "--podium-block-delay": step.blockDelay } as CSSProperties}
              >
                <span className={`page-title leading-none ${step.rank}`}>{step.index + 1}</span>
                <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(1_0_0/0.12),transparent_46%)]" />
              </div>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="mx-auto hidden h-2.5 max-w-[900px] rounded-b-lg bg-white/10 sm:block"
      />

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="glass label-caps inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="size-3.5"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" />
          </svg>
          {t("podium.replay")}
        </button>
      </div>
    </div>
  );
}

function Plaque({
  winner,
  lead,
  delay,
  run,
}: {
  winner: PodiumPick;
  lead: boolean;
  delay: string;
  run: number;
}) {
  const { t } = useT();
  // From zero, staggered behind the block beneath it, and restarted by Replay.
  const pct = useCountUp(winner.prob, 950, {
    from: 0,
    delayMs: lead ? 780 : 940,
    runKey: run,
  });

  return (
    <div
      className={`podium-plaque relative rounded-[20px] border bg-card px-5 pb-5 pt-[22px] text-center shadow-[0_30px_60px_-30px_oklch(0.05_0.01_40/0.8)] ${
        lead ? "border-gold-light/70" : "border-white/10"
      }`}
      style={{ "--podium-plaque-delay": delay } as CSSProperties}
    >
      {lead && (
        <span
          className="label-caps absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-1 text-card"
          style={{
            backgroundImage:
              "linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
          }}
        >
          {t("podium.strongestCall")}
        </span>
      )}
      <div className="label-caps text-muted-foreground">
        {discName(t, winner.discKey, winner.disc)}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2">
        <Link
          to="/athlete/$discKey/$name"
          params={{ discKey: winner.discKey, name: winner.name }}
          className="dg text-balance py-1 text-[18px] leading-[1.12] font-semibold text-foreground transition-colors hover:text-terracotta-strong hover:underline"
        >
          {winner.name}
        </Link>
        {winner.injuryWatch && <WatchBadge reason={winner.injuryReason} url={winner.injuryUrl} />}
      </div>
      {/* v0's mockup carried a nationality here. /api/predictions' topWinners
          rows don't have one, and inventing it is exactly what the porting
          rules forbid — so the plaque shows the real season best alone. */}
      <div className="label-caps nums mt-1.5 text-muted-foreground">
        {t("podium.sb", { mark: winner.mark })}
      </div>
      <div
        className={`page-title nums mt-4 text-[52px] leading-none ${
          lead ? "text-gold-strong" : "text-foreground"
        }`}
      >
        {Math.round(pct)}
        <span className={`text-[22px] ${lead ? "text-gold-strong/80" : "text-muted-foreground"}`}>
          %
        </span>
      </div>
      {/* v0 labelled this "Win probability". It is the model rating: a podium
          chance is named only in a real competition's call. */}
      <div className="label-caps mt-1 text-muted-foreground">{t("podium.rating")}</div>
      {/* The page stakes its credibility on these three names and, before
          this, gave the reader nothing to check them against. The season
          best above is the claim most worth following up. */}
      <WaAthleteLink href={winner.waUrl} name={winner.name} className="mt-3 inline-block" />
    </div>
  );
}
