import type { CSSProperties } from "react";
import { Panel } from "@/components/dl/shell";
import { UltimateProjections } from "@/components/dl/ultimate-projections";
import type { Lang } from "@/lib/i18n";
import { dateRange, phaseOf } from "@/lib/championship-dates";
import { localeTag } from "@/lib/dates";
import { ASIAN_GAMES_STRIPE, ASIAN_GAMES_SUN } from "@/lib/championship-themes";
import type { ChampionshipEvent, NotCalledEvent } from "@/lib/dl-data";

type T = (k: string, v?: Record<string, string | number>) => string;

/** Figures and the model's share on the hero's green: oklch(0.86 0.13 85),
 * 10.34:1 on the ground and 8.69:1 on the sun's halo. */
const GOLD = "oklch(0.86 0.13 85)";

/** The Asian Games page. It wears the competition's own look, a tradition the
 * user set: a green field, the OCA's red sun, and the Aichi-Nagoya emblem's
 * purple, gold and green line. Nothing here should read as the Ultimate's black
 * and violet. */
export function AsianGamesBody({ ev, lang, t }: { ev: ChampionshipEvent; lang: Lang; t: T }) {
  const projections = ev.projections ?? [];
  const notCalled = ev.notCalled ?? [];
  const split = {
    model: projections.filter((p) => p.method === "model").length,
    points: projections.filter((p) => p.method === "points").length,
    none: notCalled.length,
  };
  const test = ev.rule?.backtest;
  const pct = (value: number) =>
    new Intl.NumberFormat(localeTag(lang), { maximumFractionDigits: 1 }).format(value);

  return (
    <div className="space-y-6">
      <AsianGamesHero ev={ev} lang={lang} t={t} split={split} />

      {ev.rule && (
        <Panel title={t("asianGames.how.title")}>
          <ol className="max-w-3xl space-y-3 text-[13.5px] leading-snug text-foreground">
            {[
              t("asianGames.how.field"),
              t("asianGames.how.model"),
              // Said in as many words: how the model tested on finals kept aside
              // while it was built, against the model it replaced and a ranking
              // by points, including the Asian finals, where points did better.
              // An older report, without the model it replaced, keeps its wording.
              ...(test
                ? [
                    t(test.previous != null ? "asianGames.how.testHeld" : "asianGames.how.test", {
                      finals: test.finals,
                      from: test.years[0] ?? "",
                      to: test.years[test.years.length - 1] ?? "",
                      model: pct(test.model),
                      previous: test.previous != null ? pct(test.previous) : "",
                      points: pct(test.points),
                      asiaFinals: test.asiaFinals,
                      asiaModel: pct(test.asiaModel),
                      asiaPrevious: test.asiaPrevious != null ? pct(test.asiaPrevious) : "",
                      asiaPoints: pct(test.asiaPoints),
                    }),
                  ]
                : []),
            ].map((line, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="nums mt-0.5 font-semibold text-terracotta-strong">{i + 1}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </Panel>
      )}

      {projections.length > 0 ? (
        <UltimateProjections projections={projections} t={t} />
      ) : (
        <Panel title={t("ultimate.field.title")}>
          <p className="mx-auto max-w-xl py-4 text-center text-[13.5px] leading-snug text-muted-foreground">
            {t("asianGames.field.pending")}
          </p>
        </Panel>
      )}

      {notCalled.length > 0 && <NotCalledPanel items={notCalled} t={t} />}
    </div>
  );
}

/** The first viewport. What it has to say is the page's one mechanism: every
 * event is called one way, by the model or on points, and some are not called
 * at all. The split bar shows that before a word of explanation.
 *
 * The sun is a solid disc with a halo, not a bloom on the page ground: red
 * glowing into green composites to brown. And the text column stops short of
 * it, because white body text on that red measures 4.0:1. */
function AsianGamesHero({
  ev,
  lang,
  t,
  split,
}: {
  ev: ChampionshipEvent;
  lang: Lang;
  t: T;
  split: { model: number; points: number; none: number };
}) {
  const { phase, days } = phaseOf(ev);
  const chip =
    phase === "upcoming"
      ? t("championship.chip.days", { n: days, city: ev.city })
      : phase === "live"
        ? t("championship.chip.live", { city: ev.city })
        : t("championship.chip.done", { city: ev.city });
  const segments: { key: keyof typeof split; className: string; style: CSSProperties }[] = [
    { key: "model", className: "", style: { backgroundColor: GOLD } },
    { key: "points", className: "bg-white/45", style: {} },
    { key: "none", className: "border border-white/45", style: {} },
  ];
  const shown = segments.filter((s) => split[s.key] > 0);
  const dates = dateRange(ev, lang);

  return (
    <div
      className="relative mt-2 overflow-hidden rounded-[28px] px-6 pb-60 pt-11 text-white sm:px-12 sm:pt-16 lg:pb-16"
      style={{ backgroundColor: "#002912", border: "1px solid rgba(79,174,103,0.28)" }}
    >
      {/* Halo, then the emblem's line, then the sun, so the line runs INTO the
          sun rather than across it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 -bottom-44 size-[560px] rounded-full lg:-right-46 lg:-bottom-56"
        style={{
          backgroundImage: `radial-gradient(circle, ${ASIAN_GAMES_SUN}4d 0%, transparent 60%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[92px] flex h-1.5 lg:bottom-[110px]"
      >
        {ASIAN_GAMES_STRIPE.map((color) => (
          <span key={color} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 -bottom-24 size-[260px] rounded-full lg:-right-20 lg:-bottom-28 lg:size-[340px]"
        style={{ backgroundColor: ASIAN_GAMES_SUN }}
      />

      <div className="relative max-w-xl">
        <h1 className="dg text-[34px] font-bold leading-[1.02] tracking-[-0.02em] sm:text-[54px]">
          {t("asianGames.hero.headline", { city: ev.city })}
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-white/70">
          {ev.entrants != null && ev.federations != null
            ? t("asianGames.hero.body", {
                dates,
                venue: ev.venue,
                entrants: ev.entrants,
                federations: ev.federations,
              })
            : t("asianGames.hero.bodyBare", { dates, venue: ev.venue })}
        </p>
        <span className="label-caps mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 text-white">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full"
            style={{ backgroundColor: GOLD }}
          />
          {chip}
        </span>

        {shown.length > 0 && (
          <div className="mt-9">
            <div
              role="img"
              aria-label={t("asianGames.split.aria", split)}
              className="flex h-2.5 w-full gap-1"
            >
              {shown.map((s) => (
                <span
                  key={s.key}
                  className={`rounded-full ${s.className}`}
                  style={{ flexGrow: split[s.key], ...s.style }}
                />
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-white/70">
              {shown.map((s) => (
                <li key={s.key}>
                  <span className="nums font-semibold text-white">{split[s.key]}</span>{" "}
                  {t(`asianGames.split.${s.key}`)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const REASONS = ["relay", "noData", "noEntries"] as const;

/** The programme's events we name in both languages. The portal writes its
 * labels in English only, so a French reader would otherwise get them raw. */
const EVENT_CODES = new Set([
  "10000M",
  "MARATHON",
  "HAMMER",
  "DECATH",
  "HEPTATH",
  "WALKHM",
  "WALKM",
  "4X100M",
  "4X400M",
]);

function eventLabel(e: NotCalledEvent, t: T): string {
  const [sex = "", rest = ""] = e.evKey.split(".");
  const code = rest.replace(/-+$/, "");
  if (!EVENT_CODES.has(code) || !["M", "W", "X"].includes(sex)) return e.label;
  return t("asianGames.eventLabel", {
    sex: t(`asianGames.sex.${sex}`),
    event: t(`asianGames.event.${code}`),
  });
}

/** Every event on the programme without a call, named and grouped by why.
 * Listed rather than left out, so a reader looking for the marathon finds the
 * reason instead of wondering whether we missed it. */
function NotCalledPanel({ items, t }: { items: NotCalledEvent[]; t: T }) {
  const groups = REASONS.map((reason) => ({
    reason,
    events: items.filter((item) => item.reason === reason),
  })).filter((group) => group.events.length > 0);

  return (
    <Panel
      title={t("asianGames.notCalled.title")}
      subtitle={t("asianGames.notCalled.subtitle", { n: items.length })}
    >
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
        {groups.map((group) => (
          <section key={group.reason}>
            <h3 className="label-caps text-foreground">
              {t(`asianGames.notCalled.${group.reason}`)}
            </h3>
            <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
              {t(`asianGames.notCalled.${group.reason}Note`)}
            </p>
            <ul className="mt-2.5">
              {group.events.map((e, i) => (
                <li
                  key={e.evKey}
                  className="stagger-item flex items-center gap-3 border-b border-border/60 py-2 last:border-0"
                  style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
                >
                  <span className="truncate text-[13.5px] font-medium text-foreground">
                    {eventLabel(e, t)}
                  </span>
                  <span className="nums ml-auto whitespace-nowrap text-[11.5px] text-muted-foreground">
                    {t("asianGames.notCalled.entrants", { n: e.entrants })}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Panel>
  );
}
