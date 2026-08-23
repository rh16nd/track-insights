import { createFileRoute, Link } from "@tanstack/react-router";
import { usePredictions } from "@/hooks/usePredictions";
import { PodiumCallMark } from "@/components/dl/logo";
import { RankBadge } from "@/components/dl/shell";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-[110px]">
      <div
        className="nums text-[32px] font-semibold leading-none text-[var(--landing-fg)] sm:text-[40px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div className="label-caps mt-2 text-[var(--landing-muted)]">{label}</div>
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

const ICONS = {
  database:
    "M4 6c0-1.1 3.58-2 8-2s8 .9 8 2-3.58 2-8 2-8-.9-8-2Zm0 0v12c0 1.1 3.58 2 8 2s8-.9 8-2V6M4 12c0 1.1 3.58 2 8 2s8-.9 8-2",
  shieldCheck: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Zm-3 9 2 2 4-4",
  pulse: "M3 12h4l2 6 4-14 2 8h6",
  wind: "M4 8h9a2.5 2.5 0 1 0-2.5-2.5M4 12h13a2.5 2.5 0 1 1-2.5 2.5M4 16h7",
  versus: "M6 4l4 8-4 8M18 4l-4 8 4 8",
  refresh: "M4 4v5h5M20 20v-5h-5M4.5 15a8 8 0 0 0 14.5 3.5M19.5 9A8 8 0 0 0 5 5.5",
};

const FEATURES = [
  {
    icon: ICONS.database,
    title: "Real results, not hand-typed",
    body: "Every mark comes straight from World Athletics' own API — the Diamond League circuit, Olympics, World Championships, Continental Tour Gold and European Championships.",
  },
  {
    icon: ICONS.shieldCheck,
    title: "Validated honestly",
    body: "Walk-forward tested across five independent seasons — trained only on years strictly before each test year, never peeking at the future.",
  },
  {
    icon: ICONS.pulse,
    title: "Injury & withdrawal aware",
    body: "News and meet recaps are scanned automatically. Flagged athletes get a watch badge; confirmed withdrawals are dropped from the field entirely.",
  },
  {
    icon: ICONS.wind,
    title: "Wind & venue adjusted",
    body: "Sprint, hurdle and jump marks are corrected for following wind; results at bigger meets carry more weight than a small regional invitational.",
  },
  {
    icon: ICONS.versus,
    title: "Head-to-head history",
    body: "Real matchup win rates between rivals feed the model directly — not a manual post-hoc adjustment bolted on afterward.",
  },
  {
    icon: ICONS.refresh,
    title: "Live all season",
    body: "Predictions refresh as 2026 results come in, right up to the Brussels Final.",
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
    body: "Season form, consistency across meets, recency, head-to-head history, wind adjustment — 14 features, all carrying real signal, none structurally constant.",
  },
  {
    n: "03",
    title: "Validate honestly",
    body: "Walk-forward validated across five independent seasons (2021–2025) — trained only on years strictly before each test year, never on the future.",
  },
  {
    n: "04",
    title: "Predict live",
    body: "The model re-scores the field automatically as the 2026 season unfolds, all the way to Brussels.",
  },
];

// A real, illustrative slice of what actually feeds the model -- genuine
// meeting names from the pipeline (see major_meets_scraper.py/
// season_results_scraper.py), not fabricated data.
const FEED = [
  "Wanda Diamond League — Lausanne",
  "Prefontaine Classic — Eugene",
  "FBK Games — Hengelo",
  "World Athletics Championships — Tokyo 2025",
  "European Athletics Championships",
  "Paavo Nurmi Games — Turku",
];

function Landing() {
  const state = usePredictions();
  const accuracy = state.status === "ok" ? `${Math.round(state.data.modelAccuracy)}%` : "—";
  const daysToFinal = state.status === "ok" ? String(state.data.daysToFinal) : "—";
  const disciplineCount =
    state.status === "ok"
      ? String(state.data.trackDisciplines.length + state.data.fieldDisciplines.length)
      : "32";
  const preview = state.status === "ok" ? state.data.topWinners.slice(0, 5) : [];
  const topPick = preview[0];
  const ticker = state.status === "ok" ? state.data.confidence.slice(0, 10) : [];

  return (
    <div className="landing min-h-screen bg-[var(--landing-bg)] text-[var(--landing-fg)]">
      {/* ── Nav ───────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--landing-border)] bg-[var(--landing-bg)]/80 px-6 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-2.5">
          <PodiumCallMark className="size-6" />
          <div className="label-caps text-[var(--landing-muted)]">
            <span className="font-semibold text-[var(--landing-fg)]">PodiumCall</span>
            <span className="ml-2">2026 Diamond League Predictor</span>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="label-caps rounded-full bg-[var(--landing-fg)] px-4 py-2.5 text-[var(--landing-bg)] transition-opacity hover:opacity-90"
        >
          View live predictions
        </Link>
      </header>

      {/* ── Hero (track-surface reused as the backdrop, darkened) ──── */}
      <section className="track-surface relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[var(--landing-bg)]/88" />
        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-24 text-center sm:px-10 sm:pt-32">
          <span className="label-caps inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-card)] px-3.5 py-2 text-[var(--landing-muted)]">
            <span className="size-1.5 rounded-full bg-terracotta" />
            Brussels Final — Sep 4–5, 2026
          </span>

          <h1
            className="mx-auto mt-6 max-w-3xl text-[40px] font-semibold leading-[1.1] tracking-tight sm:text-[56px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A model trained on real results, not gut feeling.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--landing-muted)] sm:text-base">
            Every Diamond League meeting, the Olympics, World Championships and more — scraped
            straight from World Athletics, turned into predictions for all 32 disciplines at the
            2026 Final.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="label-caps rounded-full px-6 py-3.5 text-[var(--landing-bg)] shadow-[0_10px_40px_-12px_oklch(0.545_0.164_38.5/0.6)] transition-transform hover:scale-[1.02]"
              style={{
                backgroundImage: "linear-gradient(100deg, var(--terracotta) 0%, var(--gold) 100%)",
              }}
            >
              View live predictions
            </Link>
            <a
              href="#how-it-works"
              className="label-caps rounded-full border border-[var(--landing-border)] px-6 py-3.5 text-[var(--landing-fg)] transition-colors hover:bg-[var(--landing-card)]"
            >
              How it works
            </a>
          </div>

          <div className="mt-16 flex flex-wrap items-start justify-center gap-x-12 gap-y-8">
            <Stat value={accuracy} label="Backtest accuracy" />
            <Stat value={daysToFinal} label="Days to Brussels" />
            <Stat value={disciplineCount} label="Disciplines tracked" />
            <Stat value="7" label="Seasons of real data" />
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
            Live from the model
          </div>
          {ticker.length > 0 ? (
            <div className="marquee-mask overflow-hidden">
              <div className="marquee-track flex w-max gap-3">
                {[...ticker, ...ticker].map((t, i) => (
                  <span
                    key={`${t.disc}-${i}`}
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

      {/* ── Raw signal → ranked prediction demo ──────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="label-caps text-[var(--landing-muted)]">See the transformation</div>
        <h2
          className="mt-3 max-w-xl text-[28px] font-semibold leading-tight sm:text-[34px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Real results in. A ranked prediction out.
        </h2>

        <div className="mt-10 grid grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-6">
            <div className="label-caps text-[var(--landing-muted)]">Raw signal</div>
            <ul className="mt-4 space-y-3">
              {FEED.map((m) => (
                <li
                  key={m}
                  className="flex items-center gap-2.5 text-[13.5px] text-[var(--landing-fg)]"
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
            <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-6">
              <div className="label-caps text-[var(--landing-muted)]">Ranked prediction</div>
              <div className="mt-4 flex items-center gap-3">
                <RankBadge rank={topPick.rank} className="size-8 text-[13px]" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-semibold text-[var(--landing-fg)]">
                    {topPick.name}
                  </div>
                  <div className="text-[12px] text-[var(--landing-muted)]">{topPick.disc}</div>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="nums text-[13px] text-[var(--landing-muted)]">{topPick.mark}</span>
                <span className="nums text-[18px] font-semibold text-[var(--landing-accent-text)]">
                  {topPick.prob}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--landing-border)]">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${topPick.prob}%`,
                    backgroundImage:
                      "linear-gradient(100deg, var(--terracotta) 0%, var(--gold) 100%)",
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-6 text-[13.5px] text-[var(--landing-muted)]">
              Ranked predictions load once the live model is running.
            </div>
          )}
        </div>
      </section>

      {/* ── Feature grid ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-20 sm:px-10 sm:pb-28">
        <div className="label-caps text-[var(--landing-muted)]">Built for honest predictions</div>
        <h2
          className="mt-3 max-w-xl text-[28px] font-semibold leading-tight sm:text-[34px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          No fabricated data, anywhere in the pipeline.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-6"
            >
              <span
                className="inline-flex size-10 items-center justify-center rounded-full text-[var(--landing-bg)]"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, var(--terracotta) 0%, var(--gold) 100%)",
                }}
              >
                <Icon path={f.icon} />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-[var(--landing-fg)]">{f.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--landing-muted)]">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="label-caps text-[var(--landing-muted)]">How it works</div>
        <h2
          className="mt-3 max-w-xl text-[28px] font-semibold leading-tight sm:text-[34px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Real data in. Honest predictions out.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-6"
            >
              <span
                className="nums inline-flex size-9 items-center justify-center rounded-full text-[13px] font-semibold text-[var(--landing-bg)]"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, var(--terracotta) 0%, var(--gold) 100%)",
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
        <div className="label-caps text-[var(--landing-muted)]">Straight from the dashboard</div>
        <h2
          className="mt-3 max-w-xl text-[28px] font-semibold leading-tight sm:text-[34px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          A live look at the model's current picks.
        </h2>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)]">
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
            <div className="flex items-center justify-between">
              <h3
                className="text-[17px] font-semibold text-[var(--landing-fg)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Current top predicted winners
              </h3>
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
              {preview.map((w) => (
                <div key={w.name} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                  <RankBadge rank={w.rank} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium text-[var(--landing-fg)]">
                      {w.name}
                    </div>
                    <div className="text-[11.5px] text-[var(--landing-muted)]">{w.disc}</div>
                  </div>
                  <div className="nums w-16 text-right text-[13px] text-[var(--landing-muted)]">
                    {w.mark}
                  </div>
                  <div className="nums w-12 text-right text-[13px] font-semibold text-[var(--landing-accent-text)]">
                    {w.prob}%
                  </div>
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
  );
}
