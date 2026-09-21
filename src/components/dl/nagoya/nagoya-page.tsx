import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { UltimateProjections } from "@/components/dl/ultimate-projections";
import { EmblemLine } from "@/components/dl/nagoya/emblem-line";
import { NagoyaTiles } from "@/components/dl/nagoya/nagoya-tiles";
import { useInView } from "@/hooks/useInView";
import type { Lang } from "@/lib/i18n";
import { localeTag } from "@/lib/dates";
import { ASIAN_GAMES_STRIPE, ASIAN_GAMES_SUN } from "@/lib/championship-themes";
import { compareEvents, discName } from "@/lib/dl-data";
import type { ChampionshipEvent, NotCalledEvent } from "@/lib/dl-data";

type T = (k: string, v?: Record<string, string | number>) => string;

/** The page's width and gutters, the site's own, set per section: the page
 * runs edge to edge, and each section keeps its text to this column. */
export const NAGOYA_WRAP = "mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-12";

const SECTION = "py-20 sm:py-28";

/** The Asian Games page below its cover: "Night in Nagoya", as the user chose
 * it on 2026-09-21. Full-width sections on the Games' green, no panels, the
 * emblem's line between them and the red sun as the motif. What it says is
 * what the page always said: how each event is called, the call, and the
 * events without one. */
export function NagoyaPage({ ev, lang, t }: { ev: ChampionshipEvent; lang: Lang; t: T }) {
  const projections = useMemo(
    () =>
      [...(ev.projections ?? [])].sort((a, b) =>
        compareEvents(
          a.discKey,
          b.discKey,
          discName(t, a.discKey, a.disciplineLabel),
          discName(t, b.discKey, b.disciplineLabel),
        ),
      ),
    [ev.projections, t],
  );
  const notCalled = ev.notCalled ?? [];
  const [active, setActive] = useState<string | undefined>(undefined);

  // A tile opens its event in the full table: the picker moves to it, and the
  // page scrolls to the table and hands it focus, so a keyboard reader lands
  // where a mouse reader looks.
  const open = (discKey: string) => {
    setActive(discKey);
    window.requestAnimationFrame(() => {
      const target = document.getElementById("nagoya-event");
      if (!target) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      target.focus({ preventScroll: true });
    });
  };

  return (
    <div className="nagoya-page">
      {ev.rule && (
        <>
          <Divider />
          <HowSection ev={ev} lang={lang} t={t} />
        </>
      )}

      <Divider />
      {projections.length > 0 ? (
        <>
          <section aria-labelledby="nagoya-glance" className={`${NAGOYA_WRAP} ${SECTION}`}>
            <SectionHead id="nagoya-glance" title={t("nagoya.glance.title")}>
              {t("nagoya.glance.lede")}
            </SectionHead>
            <div className="mt-12">
              <NagoyaTiles projections={projections} onOpen={open} t={t} lang={lang} />
            </div>
          </section>

          <Divider />
          <section aria-labelledby="nagoya-field" className={`${NAGOYA_WRAP} ${SECTION}`}>
            <SectionHead id="nagoya-field" title={t("nagoya.field.title")}>
              {t("nagoya.field.lede")}
            </SectionHead>
            <div className="mt-10">
              <UltimateProjections
                projections={projections}
                t={t}
                bare
                frameId="nagoya-event"
                active={active}
                onActiveChange={setActive}
              />
            </div>
          </section>
        </>
      ) : (
        <section aria-labelledby="nagoya-field" className={`${NAGOYA_WRAP} ${SECTION}`}>
          <SectionHead id="nagoya-field" title={t("ultimate.field.title")}>
            {t("asianGames.field.pending")}
          </SectionHead>
        </section>
      )}

      {notCalled.length > 0 && (
        <>
          <Divider />
          <NotCalledSection items={notCalled} t={t} />
        </>
      )}

      <Foot t={t} />
    </div>
  );
}

function Divider() {
  return (
    <div className={NAGOYA_WRAP}>
      <EmblemLine />
    </div>
  );
}

function SectionHead({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-[780px]">
      <h2
        id={id}
        className="hero-serif text-balance text-[clamp(36px,4.6vw,64px)] leading-[1.04] text-foreground"
      >
        {title}
      </h2>
      {children && (
        <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          {children}
        </p>
      )}
    </div>
  );
}

/** How the call is made: the heading on the left, the steps on the right with
 * the Games' gold numerals. The test line says in as many words how the model
 * was tested. Since 2026-09-16 that is the versions tried on every past season
 * and the one kept; before that, finals kept aside while it was built, against
 * the model it replaced and a ranking by points. An older call keeps its
 * wording. */
function HowSection({ ev, lang, t }: { ev: ChampionshipEvent; lang: Lang; t: T }) {
  const test = ev.rule?.backtest;
  const pct = (value: number) =>
    new Intl.NumberFormat(localeTag(lang), { maximumFractionDigits: 1 }).format(value);
  const lines = [
    t("asianGames.how.field"),
    t("asianGames.how.model"),
    ...(test
      ? [
          t(
            test.method === "oldMarks"
              ? "asianGames.how.testOldMarks"
              : test.method === "allSeasons"
                ? "asianGames.how.testAllSeasons"
                : test.previous != null
                  ? "asianGames.how.testHeld"
                  : "asianGames.how.test",
            {
              versions: test.versions ?? "",
              finals: pct(test.finals),
              from: test.years[0] ?? "",
              to: test.years[test.years.length - 1] ?? "",
              model: pct(test.model),
              previous: test.previous != null ? pct(test.previous) : "",
              points: pct(test.points),
              asiaFinals: pct(test.asiaFinals),
              asiaModel: pct(test.asiaModel),
              asiaPrevious: test.asiaPrevious != null ? pct(test.asiaPrevious) : "",
              asiaPoints: pct(test.asiaPoints),
            },
          ),
        ]
      : []),
  ];

  return (
    <section
      aria-labelledby="nagoya-how"
      className={`${NAGOYA_WRAP} ${SECTION} grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}
    >
      <div>
        <h2
          id="nagoya-how"
          className="hero-serif text-balance text-[clamp(36px,4.6vw,64px)] leading-[1.04] text-foreground lg:sticky lg:top-32"
        >
          {t("asianGames.how.title")}
        </h2>
      </div>
      <ol className="space-y-10 sm:space-y-12">
        {lines.map((line, i) => (
          <li key={i} className="grid gap-3 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-6">
            <span
              aria-hidden="true"
              className="hero-serif text-[clamp(48px,6vw,84px)] leading-[0.82] text-gold-strong"
              style={{ fontVariantNumeric: "lining-nums" }}
            >
              {i + 1}
            </span>
            <p className="max-w-[64ch] text-[16px] leading-relaxed text-foreground/90 sm:text-[17px]">
              {line}
            </p>
          </li>
        ))}
      </ol>
    </section>
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
function NotCalledSection({ items, t }: { items: NotCalledEvent[]; t: T }) {
  const groups = REASONS.map((reason) => ({
    reason,
    events: items.filter((item) => item.reason === reason),
  })).filter((group) => group.events.length > 0);

  return (
    <section aria-labelledby="nagoya-not-called" className={`${NAGOYA_WRAP} ${SECTION}`}>
      <SectionHead id="nagoya-not-called" title={t("asianGames.notCalled.title")}>
        {t("asianGames.notCalled.subtitle", { n: items.length })}
      </SectionHead>
      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <section key={group.reason}>
            <h3 className="hero-serif text-[26px] leading-tight text-foreground">
              {t(`asianGames.notCalled.${group.reason}`)}
            </h3>
            <p className="mt-2 text-[13.5px] leading-snug text-muted-foreground">
              {t(`asianGames.notCalled.${group.reason}Note`)}
            </p>
            <ul className="mt-4 border-t border-border">
              {group.events.map((e, i) => (
                <li
                  key={e.evKey}
                  className="stagger-item flex items-center gap-3 border-b border-border py-2.5"
                  style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
                >
                  <span className="truncate text-[14px] font-medium text-foreground">
                    {eventLabel(e, t)}
                  </span>
                  <span className="nums ml-auto whitespace-nowrap text-[12px] text-muted-foreground">
                    {t("asianGames.notCalled.entrants", { n: e.entrants })}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

/** The page's foot: where every final will be graded, and the sun setting on
 * the emblem's line before the site's footer. */
function Foot({ t }: { t: T }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  return (
    <section aria-labelledby="nagoya-foot" className="relative overflow-clip pt-24 sm:pt-32">
      <div className={`${NAGOYA_WRAP} flex flex-col items-center text-center`}>
        <h2
          id="nagoya-foot"
          className="hero-serif max-w-[22ch] text-balance text-[clamp(32px,4vw,56px)] leading-[1.08] text-foreground"
        >
          {t("nagoya.foot.title")}
        </h2>
        <p className="mt-5 max-w-[56ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          {t("nagoya.foot.body")}
        </p>
        <Link
          to="/results"
          className="mt-9 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-terracotta px-6 text-[15px] font-semibold text-primary-foreground transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("nagoya.foot.cta")}
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
      </div>

      <div ref={ref} data-in={inView} aria-hidden="true" className="nagoya-sunset relative mt-16">
        <div className="nagoya-sunset-sky absolute inset-x-0 top-0 overflow-hidden">
          <div
            className="nagoya-sunset-halo absolute left-1/2 rounded-full"
            style={{
              backgroundImage: `radial-gradient(circle, ${ASIAN_GAMES_SUN}4d 0%, ${ASIAN_GAMES_SUN}14 42%, transparent 66%)`,
            }}
          />
          <div className="nagoya-sunset-sun absolute left-1/2">
            <div className="size-full rounded-full" style={{ backgroundColor: ASIAN_GAMES_SUN }} />
          </div>
        </div>
        <div className="nagoya-sunset-line absolute inset-x-0 flex h-1.5">
          {ASIAN_GAMES_STRIPE.map((colour) => (
            <span key={colour} className="flex-1" style={{ backgroundColor: colour }} />
          ))}
        </div>
      </div>
    </section>
  );
}
