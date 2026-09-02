import { pageHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import {
  Shell,
  Panel,
  PanelSkeleton,
  ErrorPanel,
  ProbabilityBar,
  WatchBadge,
  HeadFigure,
  dotClass,
  badgeClass,
} from "@/components/dl/shell";
import { statusLabel, type ConfidenceRow, type TopWinner } from "@/lib/dl-data";
import { usePredictions } from "@/hooks/usePredictions";
import { useCountUp } from "@/hooks/useCountUp";
import { NewsFeed } from "@/components/dl/news-feed";

const LAST_PROBS_KEY = "podiumcall:lastProbs";

/** Real, honest trend signal for a repeat visitor: compares today's
 * probabilities against whatever this browser last saw (localStorage, not
 * a fabricated number or a backend history endpoint that doesn't exist
 * yet). First-ever visit shows no deltas -- there's nothing true to compare
 * against -- and only genuinely-changed athletes get a chip. Added per the
 * 2026-08-24 critique: the product's whole premise is live, updating
 * predictions, but nothing on the page ever showed what moved. */
function useProbabilityDeltas(topWinners: TopWinner[] | undefined) {
  const [deltas, setDeltas] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!topWinners) return;
    let previous: Record<string, number> = {};
    try {
      previous = JSON.parse(localStorage.getItem(LAST_PROBS_KEY) ?? "{}");
    } catch {
      previous = {};
    }
    const computed: Record<string, number> = {};
    const next: Record<string, number> = {};
    for (const w of topWinners) {
      next[w.name] = w.prob;
      const prior = previous[w.name];
      if (typeof prior === "number" && prior !== w.prob) {
        computed[w.name] = w.prob - prior;
      }
    }
    setDeltas(computed);
    try {
      localStorage.setItem(LAST_PROBS_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable (private browsing, quota) -- delta signal
      // just won't persist to the next visit; not worth surfacing an error
      // for.
    }
  }, [topWinners]);
  return deltas;
}

export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageHead(
      "Dashboard",
      "The model's surest calls across all 32 Diamond League disciplines, and the events it is least sure about.",
    ),
  component: Dashboard,
});

/* Our own hand-drawn 20x20 line icons, restored rather than dropped: v0's
 * figrow carries no glyph, and these read better than anything generated for
 * it. One per stat, so the row scans as four distinct facts instead of four
 * identical number blocks. No icon-library dependency. */
function StatIcon({ kind }: { kind: "flag" | "calendar" | "grid" | "target" }) {
  const common = {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-[18px]",
    "aria-hidden": true,
  };
  if (kind === "flag") {
    return (
      <svg {...common}>
        <path d="M5 2.5v15" />
        <path d="M5 3.5h11l-3.2 3.2 3.2 3.2H5" />
      </svg>
    );
  }
  if (kind === "calendar") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="14" height="13" rx="2" />
        <path d="M3 8h14M7 2.5v3M13 2.5v3" />
      </svg>
    );
  }
  if (kind === "grid") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="11" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="11" width="6" height="6" rx="1" />
        <rect x="11" y="11" width="6" height="6" rx="1" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="10" cy="10" r="6.5" />
      <circle cx="10" cy="10" r="3.5" />
      <circle cx="10" cy="10" r="0.6" fill="currentColor" />
    </svg>
  );
}

/** The head-band figures keep the count-up the old stat tiles had — it is
 * the one bit of that treatment worth carrying over, since a number ticking
 * up on arrival is what makes the band feel live rather than printed. */
function CountUpValue({ value }: { value: number }) {
  return <>{Math.round(useCountUp(value))}</>;
}

/** One of the six surest calls, as a card rather than a list row (the v0
 * "Race Programme" treatment). The probability is the card's anchor at 38px,
 * which is the point: this page's job is to say how sure the model is, and
 * the old row buried that in a 12px figure at the right-hand edge. */
function CallCard({
  winner,
  index,
  delta,
}: {
  winner: TopWinner;
  index: number;
  delta: number | undefined;
}) {
  const lead = index === 0;
  return (
    <Link
      to="/athlete/$discKey/$name"
      params={{ discKey: winner.discKey, name: winner.name }}
      style={{ "--stagger-i": index } as CSSProperties}
      className={`stagger-item card-shadow group relative block overflow-hidden rounded-[26px] border bg-card p-[22px] transition-[transform,border-color] duration-150 hover:-translate-y-0.5 active:scale-[0.99] ${
        lead ? "border-gold-light/70" : "border-border hover:border-terracotta/40"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`dg text-[13px] font-bold tracking-[0.04em] ${
            lead ? "text-gold-strong" : "text-muted-foreground"
          }`}
        >
          #{index + 1} surest
        </span>
        {winner.injuryWatch && <WatchBadge reason={winner.injuryReason} url={winner.injuryUrl} />}
      </div>

      <div className="label-caps mt-3 text-terracotta-strong">{winner.disc}</div>
      <div className="dg mt-1.5 text-[22px] leading-[1.05] font-bold tracking-[-0.02em] text-foreground">
        {winner.name}
      </div>
      <div className="nums mt-1.5 text-[13.5px] text-muted-foreground">
        Season best {winner.mark}
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span
          className={`dg nums text-[38px] leading-none font-bold tracking-[-0.03em] ${
            lead ? "text-gold-strong" : "text-terracotta"
          }`}
        >
          {winner.prob}
        </span>
        <span className="label-caps text-muted-foreground">% podium</span>
        {typeof delta === "number" && (
          <span
            className={`delta-chip nums ml-auto text-[10.5px] font-semibold ${
              delta > 0 ? "text-gold-strong" : "text-muted-foreground"
            }`}
            title={`${delta > 0 ? "Up" : "Down"} ${Math.abs(delta)} pt${
              Math.abs(delta) === 1 ? "" : "s"
            } since your last visit`}
          >
            {delta > 0 ? "▲" : "▼"}
            {Math.abs(delta)}
          </span>
        )}
      </div>
      <ProbabilityBar value={winner.prob} className="mt-3.5" trackHeight="h-[7px]" />
    </Link>
  );
}

/** v0 put a "Confidence board — top eight by margin" here. Two problems, so
 * this is the same board read from the OTHER end.
 *
 * First, it is not a margin: `build_confidence()` returns each discipline's
 * favourite's probability. Second, sorted descending it is the same ranking
 * as the surest-calls panel directly above — its top six ARE those six
 * athletes' numbers, so the page would state them twice.
 *
 * Read from the bottom it stops duplicating and starts saying something the
 * dashboard never has: which events the model cannot call. That is the more
 * useful half on a site whose stated principle is not overclaiming, and it
 * lands the reader on the discipline page built to explain exactly that. */
function LeastSurePanel({ confidence }: { confidence: ConfidenceRow[] }) {
  const least = [...confidence].sort((a, b) => a.value - b.value).slice(0, 8);
  if (least.length === 0) return null;
  const widest = least[least.length - 1]?.value || 1;

  return (
    <Panel
      title="Where the model is least sure"
      subtitle="The eight events whose strongest pick is weakest. These are the most open fields at the Final, and the ones most likely to surprise."
    >
      <ul className="divide-y divide-border">
        {least.map((c, i) => {
          const row = (
            <>
              <span className="min-w-0 flex-1 truncate text-[14.5px] font-medium text-foreground">
                {c.disc}
              </span>
              <span
                aria-hidden="true"
                className="hidden h-[9px] w-[200px] shrink-0 overflow-hidden rounded-full bg-secondary sm:block"
              >
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${Math.max((c.value / Math.max(widest, 1)) * 100, 4)}%`,
                    backgroundImage:
                      "linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
                  }}
                />
              </span>
              <span className="nums w-13 shrink-0 text-right text-[13.5px] font-semibold text-foreground">
                {c.value}%
              </span>
            </>
          );
          return (
            /* The row's vertical padding lives on the CHILD, not here. With
               py-3 on the <li> the link was only 21.8px tall while the row it
               sat in was 47px, so most of the row looked clickable and wasn't.
               Moving the padding down makes the target the whole row (45.8px)
               and actually clickable; the first/last trims move with it, so
               the rhythm is unchanged (panel height identical, measured).

               NOT a WCAG 2.5.8 fix, though it looks like one: 21.8px is under
               the 24x24 minimum, but the rows are 35-47px apart and the
               success criterion's spacing exception clears anything whose
               neighbouring target centres are 24px away. It conformed before
               and conforms now. This is a UX change. */
            <li
              key={c.disc}
              className="stagger-item [&:first-child>*]:pt-0 [&:last-child>*]:pb-0"
              style={{ "--stagger-i": i } as CSSProperties}
            >
              {c.discKey ? (
                <Link
                  to="/discipline/$discKey"
                  params={{ discKey: c.discKey }}
                  className="flex items-center gap-4 rounded-md py-3 transition-colors hover:bg-secondary/30"
                >
                  {row}
                </Link>
              ) : (
                <div className="flex items-center gap-4 py-3">{row}</div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
        This is the favourite&apos;s own chance of a podium, not a margin over the next athlete. A
        low number means no one in that field stands out — follow a row through to see how level it
        really is.
      </p>
    </Panel>
  );
}

/** "six days out" / "tomorrow" / "today". The Final is a fixed date, so the
 * headline hits 0 and then goes negative if nobody refreshes the data — say
 * something true at each end rather than printing "-2 days out". */
function dayPhrase(days: number): string {
  if (days > 1) return `${days} days out`;
  if (days === 1) return "one day out";
  if (days === 0) return "race day";
  return "under way";
}

function Dashboard() {
  const state = usePredictions();
  const data = state.status === "ok" ? state.data : undefined;
  const deltas = useProbabilityDeltas(data?.topWinners);

  const doneCount = data ? data.meets.filter((m) => m.status === "done").length : 0;
  const totalCount = data ? data.meets.length : 0;
  const progressPct = data && totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const stats = data
    ? [
        {
          label: "Days to Brussels",
          value: data.daysToFinal,
          sub: "Final, 04 Sep",
          icon: "calendar" as const,
          accent: "text-gold-light",
        },
        {
          // v0's label, and a better one than "Model accuracy": it names the
          // task the number measures rather than implying the model is right
          // 72% of the time about everything.
          label: "Top-3 hit rate",
          value: Math.round(data.modelAccuracy),
          suffix: "%",
          // Says which of the two backtest numbers this is. The caption
          // used to read only "walk-forward '23-'25", which was true of
          // both and identified neither.
          sub: data.modelAccuracyBasis,
          // The bare "72%" is opaque without saying WHAT it measures. Copy
          // kept in step with the How-it-works page's vetted framing ("podium
          // hit rate among the athletes who actually contest the Final") and
          // the anti-"winner" rule: the target is top-three membership.
          hint: "How often the model's projected top three includes the athletes who actually make the podium, among the real Final field — measured by walk-forward backtest, never on the season shown.",
          icon: "target" as const,
          accent: "text-terracotta-light",
        },
        {
          label: "Disciplines",
          value: data.trackDisciplines.length + data.fieldDisciplines.length,
          sub: "tracked",
          icon: "grid" as const,
          accent: "text-gold-light",
        },
        {
          label: "Meetings run",
          value: doneCount,
          sub: totalCount - doneCount === 1 ? "1 to go" : `${totalCount - doneCount} to go`,
          icon: "flag" as const,
          accent: "text-terracotta-light",
        },
      ]
    : null;

  // The track-surface hero box is gone. v0 opens every app page with one
  // full-bleed band (Shell's page head), and the dashboard was the only page
  // still wrapping its title in a textured, darkened, rounded card -- which
  // is what made it read as a different design from the rest of the site,
  // and what the drifting lanes were fighting with.
  //
  // Figures still hold their shape through loading so the band doesn't
  // reflow when data lands, and still never show a fabricated number.
  const figures = stats ? (
    stats.map((s) => (
      <HeadFigure
        key={s.label}
        icon={<StatIcon kind={s.icon} />}
        value={<CountUpValue value={s.value} />}
        unit={s.suffix}
        label={s.label}
        hint={s.hint}
      />
    ))
  ) : (
    <>
      {[0, 1, 2, 3].map((i) => (
        <div key={i}>
          <span className="skeleton-pulse block h-10 w-16 rounded-md bg-white" />
          <span className="skeleton-pulse mt-3 block h-2.5 w-24 rounded-full bg-white" />
        </div>
      ))}
    </>
  );

  return (
    <Shell
      title={data ? `The board, ${dayPhrase(data.daysToFinal)}.` : "The board"}
      crumb="Dashboard"
      description="Every projection the model is most sure of, and the events it is least sure of, across all 32 disciplines of the 2026 Diamond League Final."
      figures={figures}
      lastUpdated={data?.lastUpdated}
      daysToFinal={data?.daysToFinal}
    >
      {state.status === "loading" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
          <PanelSkeleton title="Most likely to reach the podium" rows={6} />
          <PanelSkeleton title="Season progress" rows={3} />
        </div>
      )}

      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}

      {/* The "Removed from predictions — injury/withdrawal" panel used to sit
          here, between the hero and the real content. It was deleted rather
          than moved: NewsFeed at the bottom of this page is a strict superset
          of it -- same athlete, disciplines, headline and source link, plus
          the keyword the checker matched on -- so the panel was duplicating
          the page's most valuable vertical space. api.py's build_news() now
          guarantees a row for every removed athlete even when the match has
          no usable headline, so nothing can go unlisted. `removedAthletes`
          is still on the API and still tested; it just has no UI. */}

      {data && (
        <>
          {/* v0 promotes the surest calls from list rows to full cards, which
              is the right weight for the page's headline content -- the
              probability becomes a 38px figure instead of a 12px one. Every
              feature the list row carried comes with it: the since-last-visit
              delta chip, the injury watch badge, and the link through to the
              athlete. */}
          <Panel
            title="The surest calls"
            subtitle="The model's strongest pick in each discipline: the chance of finishing top three, not of winning. Each card is a different event, so these six aren't racing each other."
            className="mt-6"
          >
            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
              {data.topWinners.map((w, i) => (
                <CallCard key={w.name} winner={w} index={i} delta={deltas[w.name]} />
              ))}
            </div>
          </Panel>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
            <LeastSurePanel confidence={data.confidence} />

            <div className="space-y-6">
              <Panel title="Season progress">
                <div className="flex items-baseline justify-between">
                  <span className="nums text-[28px] font-semibold leading-none text-foreground">
                    {progressPct}%
                  </span>
                  <span className="nums text-[12px] text-muted-foreground">
                    {doneCount} of {totalCount} meets scored
                  </span>
                </div>
                <ProbabilityBar value={progressPct} className="mt-4" trackHeight="h-2" />
              </Panel>

              <Panel
                title="Upcoming calendar"
                action={
                  <Link
                    to="/schedule"
                    className="label-caps text-terracotta-strong hover:underline"
                  >
                    View full schedule →
                  </Link>
                }
              >
                <ul className="space-y-2.5">
                  {data.meets.slice(-5).map((m) => (
                    <li key={m.n} className="flex items-center gap-3">
                      <span className={`size-1.5 shrink-0 rounded-full ${dotClass[m.status]}`} />
                      <span className="nums w-14 text-[12px] text-muted-foreground">{m.date}</span>
                      <span
                        className={[
                          "flex-1 truncate text-[13px]",
                          m.status === "done" ? "text-muted-foreground" : "text-foreground",
                          m.status === "next" ? "font-semibold" : "",
                          m.status === "final" ? "font-semibold text-gold-strong" : "",
                        ].join(" ")}
                      >
                        {m.city}
                      </span>
                      <span className={`label-caps rounded-sm px-1.5 py-1 ${badgeClass[m.status]}`}>
                        {statusLabel[m.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>
        </>
      )}

      {/* Bottom of the dashboard: the evidence behind every injury flag and
          every athlete missing from the field. Previously this only existed
          as a tooltip on a badge. */}
      {data && <NewsFeed />}
    </Shell>
  );
}
