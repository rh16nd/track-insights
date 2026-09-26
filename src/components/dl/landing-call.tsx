import { useMemo } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { NatFlag } from "@/components/dl/nat-flag";
import { useChampionship } from "@/hooks/useChampionship";
import { useInView } from "@/hooks/useInView";
import { ASIAN_GAMES_STRIPE, ASIAN_GAMES_SUN, championshipTheme } from "@/lib/championship-themes";
import { dateRange } from "@/lib/championship-dates";
import { chanceLabel, compareEvents, discName } from "@/lib/dl-data";
import type { ChampionshipSummary, UltimateProjection } from "@/lib/dl-data";
import { useT } from "@/lib/i18n";
import { LANDING_SECTIONS } from "@/components/dl/landing-nav";

/** The events the section shows the favourite of, when the model called them:
 * the sprints most readers know. Events called on points, or missing from the
 * call, are replaced by the next model-called events in the Track order. */
const HIGHLIGHTS = ["men_100m", "women_100m", "men_400m", "women_400m"];
const SHOWN = 4;

/** The current championship's call on the landing, dressed in that
 * championship's own colours: every championship wears its identity (the
 * user's tradition since 2026-09-14), and on 2026-09-21 the user asked for this
 * section to wear it too and blend into the dark page around it, so the page
 * turns to the championship's colour in the middle and back.
 *
 * The blend is a gradient from the landing's ground into the championship's
 * and back, over a fixed depth at each end, and the padding is deeper than
 * that, so no text ever sits on the mix. Text takes the colours measured for
 * the championship's Results box (lib/championship-themes.ts).
 *
 * The call itself (/api/championship) is a large file, so it is fetched only
 * once the section is close to the screen. */
export function LandingCall({
  summary,
  countdownLabel,
}: {
  summary: ChampionshipSummary | undefined;
  countdownLabel: string;
}) {
  const { t, lang } = useT();
  // Only the favourite cards read /api/championship (~366 KB), so they wait until
  // the section is nearly on screen. Everything above them -- eyebrow, heading,
  // lede and the CTA -- runs off the 405-byte summary and paints immediately.
  // That is why the CTA sits ABOVE the cards: on a phone the skeleton is one
  // column and reserves 636px, which used to push the only link to /championship
  // that far below the copy that earns it.
  const { ref, inView } = useInView<HTMLElement>(0.05);
  const theme = championshipTheme(summary?.theme);
  // A championship with no page of its own (the Diamond League) has no page
  // ground; its Results box colour stands in.
  const ground =
    theme?.page?.ground ?? (theme?.box as Record<string, string> | undefined)?.["--card"] ?? null;
  const asian = summary?.theme === "asianGames";
  const name = t(summary?.navKey ?? "nav.championship");

  const style = {
    ...(theme?.box ?? {}),
    "--call-ground": ground ?? "var(--terra-surface)",
  } as CSSProperties;

  return (
    <section
      ref={ref}
      id={LANDING_SECTIONS.championship}
      tabIndex={-1}
      aria-labelledby="landing-call-title"
      className="landing-call relative isolate overflow-hidden outline-none"
      style={style}
    >
      {/* The ground: the landing's colour, the championship's, the landing's. */}
      <div aria-hidden="true" className="landing-call-ground absolute inset-0 -z-10" />
      {theme?.page?.blooms && (
        <div
          aria-hidden="true"
          className="landing-call-blooms absolute inset-0 -z-10"
          style={{ backgroundImage: theme.page.blooms }}
        />
      )}
      {asian && (
        <>
          {/* The emblem's line running into the OCA's red sun, as on the Asian
              Games page, below the text and above the fade (styles.css). */}
          <div
            aria-hidden="true"
            className="landing-call-halo pointer-events-none absolute -z-10 rounded-full"
            style={{
              backgroundImage: `radial-gradient(circle, ${ASIAN_GAMES_SUN}40 0%, transparent 62%)`,
            }}
          />
          <div
            aria-hidden="true"
            className="landing-call-stripe pointer-events-none absolute inset-x-0 -z-10 flex h-1.5"
          >
            {ASIAN_GAMES_STRIPE.map((color) => (
              <span key={color} className="flex-1" style={{ backgroundColor: color }} />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="landing-call-sun pointer-events-none absolute -z-10 rounded-full"
            style={{ backgroundColor: ASIAN_GAMES_SUN }}
          />
        </>
      )}

      <div className="landing-call-body relative mx-auto max-w-6xl px-5 sm:px-10">
        <p className="label-caps text-[var(--gold-strong)]">
          {summary ? `${summary.shortName} · ${dateRange(summary, lang)}` : countdownLabel}
        </p>
        <h2
          id="landing-call-title"
          className="hero-serif mt-4 max-w-[20ch] text-balance text-[clamp(34px,5vw,58px)] leading-[1.08] text-[var(--foreground)]"
        >
          {/* The championship's name in its gold, marked with ** in the copy
              so French can put it where French grammar does. */}
          {t("landing.call.title", { name })
            .split("**")
            .map((part, i) =>
              i % 2 ? (
                <span key={i} className="text-[var(--gold-strong)]">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
        </h2>
        <p className="mt-5 max-w-[56ch] text-[16px] leading-relaxed text-[var(--muted-foreground)]">
          {t("landing.call.lede", { city: summary?.city ?? "" })}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            to="/championship"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--terracotta)] px-6 py-3.5 text-[15px] font-semibold text-[var(--primary-foreground)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("landing.call.cta")}
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
          <span className="text-[14px] text-[var(--muted-foreground)]">
            {t("landing.call.graded")}
          </span>
        </div>

        <div className="mt-10">{inView ? <Favourites /> : <FavouritesSkeleton />}</div>
      </div>
    </section>
  );
}

function FavouritesSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: SHOWN }, (_, i) => (
        <div key={i} className="landing-call-card h-[150px] rounded-2xl" />
      ))}
    </div>
  );
}

/** The favourite in each highlighted event, as the call has them. */
function pickEvents(projections: UltimateProjection[]): UltimateProjection[] {
  const called = projections.filter(
    (p) => p.method !== "points" && p.athletes[0] && p.athletes[0].podiumChance != null,
  );
  const byKey = new Map(called.map((p) => [p.discKey, p]));
  const picked = HIGHLIGHTS.map((k) => byKey.get(k)).filter((p): p is UltimateProjection => !!p);
  const rest = called
    .filter((p) => !HIGHLIGHTS.includes(p.discKey))
    .sort((a, b) => compareEvents(a.discKey, b.discKey, a.disciplineLabel, b.disciplineLabel));
  return [...picked, ...rest].slice(0, SHOWN);
}

function Favourites() {
  const { t, lang } = useT();
  const state = useChampionship();
  const events = useMemo(
    () => (state.status === "ok" ? pickEvents(state.data.projections ?? []) : []),
    [state],
  );

  if (state.status === "error") {
    return <p className="text-[14px] text-[var(--muted-foreground)]">{t("landing.call.error")}</p>;
  }
  if (state.status === "loading") return <FavouritesSkeleton />;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {events.map((p) => {
        const a = p.athletes[0]!;
        return (
          <li key={p.discKey} className="landing-call-card rounded-2xl p-5">
            <div className="text-[13px] text-[var(--muted-foreground)]">
              {discName(t, p.discKey, p.disciplineLabel)}
            </div>
            <div className="mt-2 flex min-w-0 items-center gap-2">
              {a.hasPage === false ? (
                <span className="truncate text-[17px] font-semibold text-[var(--foreground)]">
                  {a.name}
                </span>
              ) : (
                <Link
                  to="/athlete/$discKey/$name"
                  params={{ discKey: p.discKey, name: a.name }}
                  className="truncate text-[17px] font-semibold text-[var(--foreground)] hover:underline"
                >
                  {a.name}
                </Link>
              )}
            </div>
            {a.nat && (
              <NatFlag nat={a.nat} className="mt-1 [&>span]:text-[var(--muted-foreground)]" />
            )}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="hero-serif nums text-[34px] leading-none text-[var(--gold-strong)]">
                {chanceLabel(lang, a.podiumChance!)}%
              </span>
              <span className="text-[13px] text-[var(--muted-foreground)]">
                {t("landing.call.chance")}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
