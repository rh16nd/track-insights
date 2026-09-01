import { pageHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { usePredictions } from "@/hooks/usePredictions";
import { useStats } from "@/hooks/useStats";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { PodiumCallMark } from "@/components/dl/logo";
import { AthleteAvatar, ProbabilityBar, WatchBadge } from "@/components/dl/shell";
import { Podium } from "@/components/dl/podium";
import { TrackCircuit } from "@/components/dl/track-circuit";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Predicting the 2026 Diamond League Final",
      "Real-data podium predictions for all 32 disciplines at the 2026 Wanda Diamond League Final in Brussels, trained on results scraped from World Athletics.",
    ),
  component: Landing,
});

/** One figure in the hero's stat ribbon.
 *
 * Two things here come from v0's ribbon rather than the old flat string:
 * the unit is a separate, smaller, gold span (`.ribbon .stat b .u`), which
 * is why the hit rate reads "71.9" with the "%" hung off it rather than as
 * one undifferentiated "72%"; and the number counts up from zero on
 * arrival, which is what `reveal.js` does to every `.stat b` it reveals.
 *
 * `value` is a number, not a pre-formatted string, because a counter cannot
 * animate a string -- and the decimal place matters: the shipped figure is
 * 71.9%, and rounding it to 72% was quietly claiming a tenth of a point the
 * model has not earned. `null` while the API is still answering; the
 * counter still runs on a real value arriving. */
function Stat({
  value,
  unit = "",
  label,
  decimals = 0,
  delayMs = 0,
}: {
  value: number | null;
  unit?: string;
  label: string;
  decimals?: number;
  delayMs?: number;
}) {
  const counted = useCountUp(value ?? 0, 1050, { from: 0, delayMs });
  const shown =
    value === null
      ? "—"
      : counted.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
  return (
    <div className="min-w-[110px]">
      <div
        className="nums flex items-baseline justify-center gap-px text-[32px] font-semibold leading-none text-[var(--landing-fg)] sm:text-[40px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {shown}
        {value !== null && unit ? (
          <span className="text-[0.55em] text-[var(--gold-light)]">{unit}</span>
        ) : null}
      </div>
      <div className="label-caps mt-2 text-[var(--landing-muted)]">{label}</div>
    </div>
  );
}

/** The v0 direction's recurring section opener: a small uppercase eyebrow
 * above a display-face heading, with an optional line under it. Replaces the
 * bare h2 each section used to carry, so the page has one section rhythm
 * rather than six similar-but-not-identical ones.
 *
 * `tone` exists because the page now alternates terracotta and cream bands
 * and the two need opposite text colours -- a cream band inherits the app's
 * own --foreground, a terracotta one the landing's near-white. */
function SectionHead({
  eyebrow,
  title,
  children,
  tone = "dark",
  center = false,
}: {
  eyebrow: string;
  title: string;
  children?: string;
  tone?: "dark" | "cream";
  center?: boolean;
}) {
  const cream = tone === "cream";
  return (
    <div className={`max-w-[60ch] ${center ? "mx-auto text-center" : ""}`}>
      <div
        className={`label-caps ${cream ? "text-terracotta-strong" : "text-[var(--landing-accent-text-gold)]"}`}
      >
        {eyebrow}
      </div>
      <h2
        className={`mt-3 text-balance text-[28px] font-semibold leading-tight sm:text-[34px] ${
          cream ? "text-foreground" : "text-[var(--landing-fg)]"
        }`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {children && (
        <p
          className={`mt-3 text-[15px] leading-relaxed ${
            cream ? "text-muted-foreground" : "text-[var(--landing-muted)]"
          }`}
        >
          {children}
        </p>
      )}
    </div>
  );
}

/* Minimal hand-drawn 24x24 line icons (1.5px stroke, no library dependency --
   this project deliberately keeps a lean dependency footprint, see HANDOFF.md). */
function Icon({ path, className = "size-5" }: { path: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FEATURES = [
  {
    title: "Real results, not hand-typed",
    body: "Every mark comes straight from World Athletics' own API — the Diamond League circuit, Olympics, World Championships, Continental Tour Gold and European Championships.",
  },
  {
    title: "Validated honestly",
    body: "Walk-forward tested across five independent seasons — trained only on years strictly before each test year, never peeking at the future.",
  },
  {
    title: "Injury & withdrawal aware",
    body: "News and meet recaps are scanned automatically. Flagged athletes get a watch badge; confirmed withdrawals are dropped from the field entirely.",
  },
  {
    title: "Wind & venue adjusted",
    body: "Sprint, hurdle and jump marks are corrected for following wind; results at bigger meets carry more weight than a small regional invitational.",
  },
  {
    title: "Head-to-head history",
    body: "Real matchup win rates between rivals feed the model directly — not a manual post-hoc adjustment bolted on afterward.",
  },
  {
    title: "Live all season",
    body: "Every refresh re-scrapes the season and re-scores all 32 fields, right up to the Brussels Final.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Scrape real results",
    body: "Every Diamond League meet, plus the Olympics, World Championships, Continental Tour Gold meets, and the European Championships — pulled directly from World Athletics' own API, not hand-typed.",
  },
  {
    n: "02",
    title: "Engineer real features",
    body: "Season form, consistency across meets, recency, schedule pacing, head-to-head history, wind adjustment — 15 features, every one measured against a shuffled control before it ships.",
  },
  {
    n: "03",
    title: "Validate honestly",
    body: "Walk-forward validated across five independent seasons (2021–2025) — trained only on years strictly before each test year, never on the future.",
  },
  {
    n: "04",
    title: "Predict live",
    body: "The model re-scores the whole field from fresh World Athletics data on every refresh, right up to Brussels.",
  },
];

// A real, illustrative slice of what actually feeds the model -- genuine
// meeting names from the pipeline (see major_meets_scraper.py/
// season_results_scraper.py), not fabricated data.
const FEED = [
  "Wanda Diamond League — Lausanne",
  "Prefontaine Classic — Eugene",
  "FBK Games — Hengelo",
  "IAAF World Championships in Athletics — 2019",
  "European Athletics Championships",
  "Paavo Nurmi Games — Turku",
];

function Landing() {
  const state = usePredictions();
  // Second fetch, for one number: the total marks scored. Worth it because
  // the alternative is hand-typing it, and it just moved -- two toplists
  // were being read 500 deep instead of 100, which had the site quoting
  // 4,000 when the uniform figure is 3,200.
  const stats = useStats();
  const accuracy = state.status === "ok" ? state.data.modelAccuracy : null;
  const daysToFinal = state.status === "ok" ? state.data.daysToFinal : null;
  const disciplineCount =
    state.status === "ok"
      ? state.data.trackDisciplines.length + state.data.fieldDisciplines.length
      : 32;
  // v0's badge is a live countdown, not a fixed date. Written out rather
  // than templated because the tail has to stay true on the last three
  // days it will ever be read: "1 day", then the Final itself, then a
  // negative number if anyone loads the page afterwards.
  const countdownLabel =
    daysToFinal === null || daysToFinal < 0
      ? "PodiumCall · Brussels Final"
      : daysToFinal === 0
        ? "PodiumCall · Final day in Brussels"
        : `PodiumCall · ${daysToFinal} day${daysToFinal === 1 ? "" : "s"} to Brussels`;
  // All six, same as the dashboard panel -- the old slice(0, 5) quietly
  // dropped one real discipline from a list whose whole job is to preview
  // what the dashboard shows.
  const preview = state.status === "ok" ? state.data.topWinners : [];
  const topPick = preview[0];
  const ticker = state.status === "ok" ? state.data.confidence.slice(0, 10) : [];
  const demoInView = useInView<HTMLElement>();
  const marksScored =
    stats.status === "ok" && stats.data.scoreScale ? stats.data.scoreScale.rows : null;
  // Counted from the schedule rather than written down. v0's mockup said
  // "Fourteen finals of real racing" -- wrong twice over: they are meetings,
  // not finals, and the number goes stale the moment another one is run.
  const meetingsDone =
    state.status === "ok" ? state.data.meets.filter((m) => m.status === "done").length : 0;

  return (
    <div className="landing relative min-h-screen bg-[var(--landing-bg)] text-[var(--landing-fg)]">
      {/* Off-white ambient glow -- the hero has the lane texture and the
          track circuit to break up the flat terracotta, but everything
          below it (feature grid, steps, preview) sat directly on solid
          canvas color with no variation. Same fixed, once-per-page layer
          the rest of the app already uses (see shell.tsx), so the landing
          page picks up a touch of the same off-white lift instead of
          reading flatter than the app it leads into. */}
      <div
        className="ambient-glow ambient-grain pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      />
      <div className="relative z-10">
        {/* ── Nav ───────────────────────────────────────────────────── */}
        {/* Cream bar rather than translucent terracotta. Every text colour
            in here flips with it -- the landing's --landing-fg/-muted are
            near-white, tuned for the dark canvas, and would be invisible on
            cream. The CTA inverts the other way: a terracotta-to-gold pill,
            which is also the only saturated thing in the bar. */}
        <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/92 px-6 backdrop-blur-md sm:px-10">
          <div className="flex items-center gap-2.5">
            <PodiumCallMark className="size-6" />
            <div className="label-caps text-muted-foreground">
              <span className="font-semibold text-foreground">PodiumCall</span>
              <span className="ml-2">2026 Diamond League Predictor</span>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="label-caps rounded-full px-4 py-2.5 text-primary-foreground transition-transform hover:scale-[1.02]"
            style={{
              backgroundImage:
                "linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
            }}
          >
            View live predictions
          </Link>
        </header>

        {/* ── Hero ─────────────────────────────────────────────────────
            The backdrop used to be `.track-surface` under an 88% scrim.
            That utility paints hard white bars every 200px at 0.55 alpha
            (`repeating-linear-gradient(90deg, …)`), plus a noise tile and a
            dark vignette — and the bars run at 90deg while the lane texture
            runs at 100deg, so the two crossed into a grid rather than
            reading as one surface. The scrim was only ever there to hold it
            down, so both are gone; the canvas underneath is the same
            --landing-bg the scrim was resolving to anyway.

            What is left is what the reference actually shows: flat canvas,
            one faint drifting lane texture, and the track circuit. */}
        <section className="relative overflow-hidden pt-16">
          {/* v0's drifting lane texture, the same one every app page uses.
              The landing used to have its own horizontal version plus a
              sweeping light band, which put a second set of lanes at right
              angles to the track circuit drawn on top of it — two tracks,
              not one. */}
          <div className="lanes" aria-hidden="true" />
          {/* Width, not height, is what sizes this: the viewBox is 900x340
              against a much taller box, so `meet` fits it by width and the
              height only sets the letterbox. At `w-full` the circuit ran
              from edge to edge with no margin either side; 80% gives it the
              breathing room the design reference has. Full width on mobile,
              where 80% of 375px would leave a token oval. */}
          <TrackCircuit className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto -mt-6 h-[140%] w-full max-w-none -translate-y-1/2 sm:h-[120%] sm:w-[80%]" />
          <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-24 text-center sm:px-10 sm:pt-32">
            {/* v0's kicker: brand plus a live countdown, gold-ringed, with a
                dot that pulses. The five hero rows carry v0's own reveal
                delays (.05/.14/.24/.36/.5) via --reveal-d. */}
            <span
              className="hero-reveal label-caps inline-flex items-center gap-2.5 rounded-full border border-[var(--gold-light)]/50 bg-[oklch(0.97_0.012_75_/_0.14)] px-4 py-2 text-[var(--landing-fg)]"
              style={{ "--reveal-d": "50ms" } as CSSProperties}
            >
              <span className="kicker-dot size-2 rounded-full bg-[var(--gold-light)]" />
              {countdownLabel}
            </span>

            {/* The v0 direction's display headline. Deliberately much larger
                than the old one (clamped 44px→96px rather than a flat 56px):
                it is the only piece of type on the site allowed to be this
                loud. The line breaks are hard, as v0 writes them — three
                short lines stack into a block, where letting it balance
                across two made a wide banner of it. Only "gun." takes the
                gold, so the accent lands on the one word the page is about,
                and the gradient drifts through it (`.gold-shine`). */}
            <h1
              className="hero-reveal mt-7 text-[clamp(44px,11vw,96px)] font-bold leading-[0.9] tracking-[-0.035em]"
              style={{ fontFamily: "var(--font-display)", "--reveal-d": "140ms" } as CSSProperties}
            >
              We make the
              <br />
              call before
              <br />
              the{" "}
              <span
                className="gold-shine bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(96deg, var(--gold-light) 0%, oklch(0.88 0.09 78) 45%, var(--gold-light) 90%)",
                }}
              >
                gun.
              </span>
            </h1>

            {/* v0's lede, with one word changed and it is load-bearing: it
                writes "name who wins in Brussels", and the model's target is
                `dl_top3` — top-three membership, not the winner. That
                wording has been corrected out of this site once already. */}
            <p
              className="hero-reveal mx-auto mt-6 max-w-[56ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-[var(--landing-muted)]"
              style={{ "--reveal-d": "240ms" } as CSSProperties}
            >
              A model trained on real results, not gut feeling. We scrape every World Athletics mark
              across all 32 Diamond League disciplines and call the podium in Brussels — before a
              single race is run.
            </p>

            <div
              className="hero-reveal mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
              style={{ "--reveal-d": "360ms" } as CSSProperties}
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-card px-6 py-3.5 text-[15px] font-semibold text-terracotta-strong shadow-[0_8px_22px_oklch(0.3_0.08_40/0.28)] transition-transform hover:-translate-y-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                View live predictions
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
                className="rounded-full border border-[oklch(0.97_0.012_75_/_0.4)] px-6 py-3.5 text-[15px] font-semibold text-[var(--landing-fg)] transition-colors hover:bg-[oklch(0.97_0.012_75_/_0.1)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Browse all 32 events
              </Link>
            </div>

            <div
              className="hero-reveal mt-14 flex flex-wrap items-start justify-center gap-x-12 gap-y-8"
              style={{ "--reveal-d": "500ms" } as CSSProperties}
            >
              {/* The count-ups start after the ribbon itself has risen, so a
                  number is never spinning while its own row is still moving. */}
              <Stat value={accuracy} unit="%" decimals={1} delayMs={620} label="Podium hit rate" />
              <Stat value={daysToFinal} delayMs={700} label="Days to Brussels" />
              <Stat value={disciplineCount} delayMs={780} label="Disciplines tracked" />
              <Stat value={marksScored} delayMs={860} label="Marks scored" />
            </div>
            {state.status !== "ok" && (
              <p className="mt-4 text-[12.5px] text-[var(--landing-muted)]">
                {state.status === "loading"
                  ? "Loading live stats…"
                  : "Live stats aren't reachable right now — the numbers above will fill in once the model is running."}
              </p>
            )}
          </div>

          {/* ── Live confidence ticker ─────────────────────────────── */}
          <div className="relative mt-14 border-y border-[var(--landing-border)] bg-[var(--landing-bg-2)] py-4">
            <div className="label-caps mb-3 px-6 text-[var(--landing-muted)] sm:px-10">
              Live from the model — each discipline&apos;s top pick, chance of a podium
            </div>
            {ticker.length > 0 ? (
              <div
                className="marquee-mask overflow-hidden"
                role="list"
                aria-label="Live model confidence by discipline"
              >
                <div className="marquee-track flex w-max gap-3">
                  {ticker.map((t) => (
                    <span
                      key={t.disc}
                      role="listitem"
                      className="label-caps flex shrink-0 items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-card)] px-4 py-2 text-[var(--landing-fg)]"
                    >
                      <span className="nums font-semibold text-[var(--landing-accent-text-gold)]">
                        {t.value}%
                      </span>
                      {t.disc}
                    </span>
                  ))}
                  {ticker.map((t) => (
                    <span
                      key={`${t.disc}-dup`}
                      aria-hidden="true"
                      className="label-caps flex shrink-0 items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-card)] px-4 py-2 text-[var(--landing-fg)]"
                    >
                      <span className="nums font-semibold text-[var(--landing-accent-text-gold)]">
                        {t.value}%
                      </span>
                      {t.disc}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="px-6 text-[13px] text-[var(--landing-muted)] sm:px-10">
                Confidence feed loads once the live model is running.
              </p>
            )}
          </div>
        </section>

        {/* ── The projected podium (cream band) ─────────────────────── */}
        {/* The v0 direction's structural idea, and the biggest visual change
            here: the page now alternates terracotta and cream bands instead
            of running one colour top to bottom. This band is pulled up over
            the hero with a large top radius so the seam reads as a deliberate
            edge rather than a colour change. */}
        <section className="relative z-[2] -mt-8 rounded-t-[44px] bg-card sm:-mt-13">
          <div className="mx-auto max-w-5xl px-6 pb-20 pt-14 sm:px-10 sm:pb-24 sm:pt-[74px]">
            <SectionHead
              eyebrow="The projected podium"
              title="The three the model backs hardest in Brussels."
              tone="cream"
              center
            >
              Ranked by each athlete&apos;s chance of finishing in the top three.
            </SectionHead>

            {preview.length >= 3 ? (
              <Podium winners={preview} />
            ) : (
              <p className="mt-10 text-center text-[13.5px] text-muted-foreground">
                {state.status === "error"
                  ? "The podium fills in once the live model is reachable."
                  : "Loading the model's strongest calls…"}
              </p>
            )}

            {/* Load-bearing, not a disclaimer: a podium shape implies these
                three raced each other. They didn't -- each is the strongest
                call in a different discipline. */}
            <p className="mx-auto mt-8 max-w-2xl text-center text-[12px] leading-relaxed text-muted-foreground">
              Each of these is the model&apos;s strongest call in a <em>different</em> discipline,
              so they are not racing each other — the steps rank the model&apos;s confidence, not
              the athletes. The percentage is a chance of finishing top three, not of winning; marks
              are 2026 season bests from World Athletics.
            </p>
          </div>
        </section>

        {/* ── Raw signal → ranked prediction demo ──────────────────── */}
        <section ref={demoInView.ref} className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
          <SectionHead
            eyebrow="Real results in. A ranked field out."
            title={
              meetingsDone > 0
                ? `${meetingsDone} meetings of real racing, resolved into one call.`
                : "A season of real racing, resolved into one call."
            }
          >
            Every Diamond League meeting this season is scraped from World Athletics, then reduced
            to the model&apos;s single strongest prediction for the Final.
          </SectionHead>

          <div className="mt-10 grid grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] card-shadow p-6">
              <div className="label-caps text-[var(--landing-muted)]">Raw signal</div>
              <ul className="mt-4 space-y-3">
                {FEED.map((m, i) => (
                  <li
                    key={m}
                    className={
                      demoInView.inView
                        ? "stagger-item flex items-center gap-2.5 text-[13.5px] text-[var(--landing-fg)]"
                        : "flex items-center gap-2.5 text-[13.5px] text-[var(--landing-fg)] opacity-0"
                    }
                    style={demoInView.inView ? ({ "--stagger-i": i } as CSSProperties) : undefined}
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-terracotta" />
                    <span className="truncate">{m}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-[12px] text-[var(--landing-muted)]">
                + dozens more meetings, 7 seasons, scraped directly from World Athletics.
              </div>
            </div>

            <div
              aria-hidden="true"
              className="hidden justify-self-center text-[var(--landing-muted)] lg:block"
            >
              <Icon path="M4 12h15m0 0-5-5m5 5-5 5" className="size-6" />
            </div>

            {topPick ? (
              <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] card-shadow p-6">
                <div className="label-caps text-[var(--landing-muted)]">
                  Model&apos;s strongest call
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <AthleteAvatar name={topPick.name} highlight />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-semibold text-[var(--landing-fg)]">
                      {topPick.name}
                    </div>
                    <div className="text-[12px] text-[var(--landing-muted)]">{topPick.disc}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="nums text-[13px] text-[var(--landing-muted)]">
                    {topPick.mark}
                  </span>
                  <span className="label-caps text-[var(--landing-muted)]">Podium chance</span>
                  <span className="nums text-[18px] font-semibold text-[var(--landing-accent-text)]">
                    {topPick.prob}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--landing-border)]">
                  <div
                    className={`prob-fill h-1.5 rounded-full${demoInView.inView ? " prob-fill-in" : ""}`}
                    style={{
                      width: `${topPick.prob}%`,
                      backgroundImage:
                        "linear-gradient(100deg, var(--terracotta) 0%, var(--gold) 100%)",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] card-shadow p-6 text-[13.5px] text-[var(--landing-muted)]">
                Ranked predictions load once the live model is running.
              </div>
            )}
          </div>
        </section>

        {/* ── The six commitments (cream band) ──────────────────────── */}
        {/* v0 dropped the icons for numbered claims on a cream ground, which
            reads as a stated list rather than six feature tiles -- the right
            move for copy whose whole point is that it is a commitment. The
            WORDS are the app's existing ones, not v0's: its card 04 claimed
            "altitude, wind and indoor vs outdoor are all part of the feature
            set", and only wind is (`wind_adj_season_best`). Altitude was
            measured and dropped; indoor is labelled, never fed to the model.
            A false claim under a "no fabricated data" heading is the one
            thing this section cannot carry. */}
        <section className="bg-card">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-24">
            <SectionHead
              eyebrow="No fabricated data, anywhere in the pipeline."
              title="Six commitments that separate a model from a guess."
              tone="cream"
            />

            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div key={f.title}>
                  <div className="dg nums text-[13px] font-bold tracking-[0.1em] text-gold-strong">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-2 text-[17px] font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────── */}
        <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
          <SectionHead
            eyebrow="Real data in. Honest predictions out."
            title="The pipeline, in four steps."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] card-shadow p-6"
              >
                <span
                  className="nums inline-flex size-9 items-center justify-center rounded-full text-[13px] font-semibold text-[var(--landing-fg)]"
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
                  }}
                >
                  {step.n}
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-[var(--landing-fg)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--landing-muted)]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Live app preview (browser-chrome framed) ─────────────── */}
        <section className="mx-auto max-w-5xl px-6 pb-24 sm:px-10 sm:pb-32">
          <SectionHead
            eyebrow="Straight from the running model"
            title="A live look at the model's current picks."
          />

          <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] card-shadow">
            <div className="flex items-center gap-2 border-b border-[var(--landing-border)] px-4 py-3">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[var(--landing-border)]" />
                <span className="size-2.5 rounded-full bg-[var(--landing-border)]" />
                <span className="size-2.5 rounded-full bg-[var(--landing-border)]" />
              </span>
              <span className="label-caps ml-2 rounded-md bg-[var(--landing-bg)] px-2.5 py-1 text-[var(--landing-muted)]">
                PodiumCall / Dashboard
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3
                    className="text-[17px] font-semibold text-[var(--landing-fg)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Most likely to reach the podium
                  </h3>
                  {/* The same clarifying line the dashboard panel carries. It is
                    load-bearing, not decoration: these six athletes are each
                    the top pick in a DIFFERENT discipline, and without saying
                    so the list reads as one ranking of six rivals. */}
                  <p className="mt-1 text-[12px] leading-snug text-[var(--landing-muted)]">
                    The model&apos;s strongest pick in each discipline — chance of finishing top
                    three, not of winning
                  </p>
                </div>
                <Link
                  to="/dashboard"
                  className="label-caps hidden shrink-0 text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-fg)] sm:block"
                >
                  See all 32 disciplines →
                </Link>
              </div>

              <div className="mt-6 divide-y divide-[var(--landing-border)]">
                {state.status === "loading" && (
                  <p className="py-6 text-[13.5px] text-[var(--landing-muted)]">
                    Loading live predictions…
                  </p>
                )}
                {state.status === "error" && (
                  <p className="py-6 text-[13.5px] text-[var(--landing-muted)]">
                    Live predictions aren't reachable right now. This preview and the full dashboard
                    both show the same data once the model is running.
                  </p>
                )}
                {preview.map((w, i) => (
                  <div key={w.name} className="py-3.5 first:pt-0 last:pb-0">
                    <Link
                      to="/athlete/$discKey/$name"
                      params={{ discKey: w.discKey, name: w.name }}
                      className="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md transition-[background-color,transform] duration-150 hover:bg-[var(--landing-fg)]/8 active:scale-[0.99]"
                    >
                      <AthleteAvatar name={w.name} highlight={i === 0} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[13.5px] font-medium text-[var(--landing-fg)]">
                            {w.name}
                          </span>
                          {w.injuryWatch && (
                            <WatchBadge reason={w.injuryReason} url={w.injuryUrl} tone="dark" />
                          )}
                        </div>
                        <div className="text-[11.5px] text-[var(--landing-muted)]">{w.disc}</div>
                      </div>
                      <div className="flex w-full items-center justify-between gap-3 pl-9 sm:w-auto sm:justify-end sm:pl-0">
                        <div className="nums text-[13px] text-[var(--landing-muted)] sm:w-20 sm:text-right">
                          {w.mark}
                        </div>
                        <div className="w-24">
                          <div className="nums text-right text-[12px] font-semibold text-[var(--landing-accent-text)]">
                            {w.prob}%
                          </div>
                          <ProbabilityBar
                            value={w.prob}
                            className="mt-1.5"
                            trackHeight="h-1.5"
                            trackClass="bg-[var(--landing-border)]"
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="border-t border-[var(--landing-border)] px-6 py-8 sm:px-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-[12px] text-[var(--landing-muted)]">
              Not affiliated with World Athletics or the Wanda Diamond League.
            </p>
            <Link
              to="/dashboard"
              className="label-caps text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-fg)]"
            >
              View live predictions →
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
