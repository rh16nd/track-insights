import { useEffect, useState, type CSSProperties } from "react";
import { useT } from "@/lib/i18n";
import { pagePhoto } from "@/lib/page-photos";
import { dateRange, zonedMidnight } from "@/lib/championship-dates";
import { localeTag } from "@/lib/dates";
import { ASIAN_GAMES_STRIPE, ASIAN_GAMES_SUN } from "@/lib/championship-themes";

/** What the cover needs to know. The championship summary carries all of it
 * but the time zone and the entry counts, so the cover can open before the
 * call itself has loaded. */
export type CoverInfo = {
  name: string;
  shortName: string;
  city: string;
  venue: string;
  startDate: string;
  endDate: string;
  timezone?: string | undefined;
  entrants?: number | null | undefined;
  federations?: number | null | undefined;
};

export type CallSplit = { model: number; points: number; none: number };

const DAY = 86_400_000;

/** "Aichi-Nagoya 2026" as two lines, the name and the year, with a real en
 * dash between the two cities. */
function titleLines(shortName: string): string[] {
  const cut = shortName.lastIndexOf(" ");
  const lines = cut > 0 ? [shortName.slice(0, cut), shortName.slice(cut + 1)] : [shortName];
  return lines.map((line) => line.replace(/(\p{L})-(\p{L})/gu, "$1–$2"));
}

/** The page's first screen: the stadium at dusk under a green wash, the
 * emblem's line drawing in from the left, and the OCA's red sun rising onto
 * it. The countdown and the call's split sit on it, so the cover already
 * says when, and how the events are called. */
export function NagoyaCover({
  info,
  split,
}: {
  info: CoverInfo | undefined;
  split: CallSplit | undefined;
}) {
  const { t, lang } = useT();
  const shot = pagePhoto("nagoya");

  return (
    <section
      aria-labelledby="nagoya-title"
      className="nagoya-cover relative isolate flex min-h-[100svh] flex-col overflow-clip supports-[height:100dvh]:min-h-[100dvh]"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {shot && (
          <img
            src={shot.large}
            srcSet={`${shot.small} 1200w, ${shot.large} 2400w`}
            sizes="100vw"
            alt=""
            decoding="async"
            fetchPriority="high"
            className="hero-photo absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: shot.focus }}
          />
        )}
        <div className="nagoya-tint absolute inset-0" />
        <div className="nagoya-wash absolute inset-0" />
      </div>

      {/* The text sits at the foot of the screen, clear of the sun: above it
          on a phone, beside it from lg, where the countdown moves to the
          right of the title like a scoreboard over the stands. */}
      <div className="nagoya-cover-body relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-6 pt-[112px] sm:px-8 lg:px-12">
        {info && (
          <div className="nagoya-cover-text grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-16">
            <div className="max-w-[720px] lg:col-start-1 lg:row-start-1">
              <p
                className="hero-reveal label-caps text-gold-strong"
                style={{ "--reveal-d": "450ms" } as CSSProperties}
              >
                {t("nagoya.cover.edition")} · {dateRange(info, lang)}
              </p>
              <h1
                id="nagoya-title"
                className="hero-reveal hero-serif mt-4 text-[clamp(44px,7.4vw,124px)] leading-[0.92] tracking-[-0.02em] text-foreground"
                style={{ "--reveal-d": "550ms" } as CSSProperties}
              >
                {titleLines(info.shortName).map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p
                className="hero-reveal mt-6 text-[clamp(22px,2.4vw,30px)] font-medium leading-tight text-foreground"
                style={
                  { "--reveal-d": "680ms", fontFamily: "var(--font-display)" } as CSSProperties
                }
              >
                {t("asianGames.hero.headline", { city: info.city })}
              </p>
              <p
                className="hero-reveal mt-3 max-w-[56ch] text-[15px] leading-relaxed text-foreground/90 sm:text-[16px]"
                style={{ "--reveal-d": "760ms" } as CSSProperties}
              >
                {info.entrants != null && info.federations != null
                  ? t("asianGames.hero.body", {
                      dates: dateRange(info, lang),
                      venue: info.venue,
                      entrants: info.entrants,
                      federations: info.federations,
                    })
                  : t("asianGames.hero.bodyBare", {
                      dates: dateRange(info, lang),
                      venue: info.venue,
                    })}
              </p>
            </div>
            <div
              className="hero-reveal mt-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center"
              style={{ "--reveal-d": "860ms" } as CSSProperties}
            >
              <Countdown info={info} />
            </div>
            {split && (
              <div className="lg:col-start-1 lg:row-start-2">
                <SplitBar split={split} />
              </div>
            )}
          </div>
        )}
      </div>

      <Horizon />

      {shot && (
        <a
          href={shot.source}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-[76px] z-[2] rounded-full bg-black/35 px-2.5 py-1 text-[11px] text-white/80 hover:text-white hover:underline sm:right-8 sm:top-[92px] lg:right-12"
        >
          {t("ath.photoCredit", { author: shot.author, license: shot.license })}
        </a>
      )}
    </section>
  );
}

/** The emblem's line along the foot of the cover and the sun on it. The line
 * stops at the sun's centre, so it runs into the sun rather than across it. */
function Horizon() {
  return (
    <div aria-hidden="true" className="nagoya-horizon">
      <div
        className="nagoya-halo absolute rounded-full"
        style={{
          backgroundImage: `radial-gradient(circle, ${ASIAN_GAMES_SUN}59 0%, ${ASIAN_GAMES_SUN}1f 38%, transparent 64%)`,
        }}
      />
      <div className="nagoya-horizon-line absolute left-0 flex h-1.5">
        {ASIAN_GAMES_STRIPE.map((colour) => (
          <span key={colour} className="flex-1" style={{ backgroundColor: colour }} />
        ))}
      </div>
      <div className="nagoya-sun-sink absolute">
        <div
          className="nagoya-sun size-full rounded-full"
          style={{ backgroundColor: ASIAN_GAMES_SUN }}
        />
      </div>
    </div>
  );
}

/** Seconds since mount, ticking once a second. Null on the server and in the
 * first client render, so the countdown never disagrees with the HTML it
 * hydrates. */
function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function Countdown({ info }: { info: CoverInfo }) {
  const { t, lang } = useT();
  const now = useNow();
  const start = zonedMidnight(info.startDate, info.timezone);
  const end = zonedMidnight(info.endDate, info.timezone) + DAY;
  const totalDays = Math.round((end - start) / DAY);

  if (now !== null && now >= end) {
    return (
      <p className="hero-serif text-[clamp(30px,3.6vw,44px)] leading-tight text-foreground">
        {t("nagoya.countdown.over")}
      </p>
    );
  }

  if (now !== null && now >= start) {
    const day = Math.min(totalDays, Math.floor((now - start) / DAY) + 1);
    return (
      <div className="flex flex-wrap items-center gap-4">
        <span className="label-caps inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 text-foreground">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="live-ping-ring absolute inline-flex size-full rounded-full bg-terracotta" />
            <span className="relative inline-flex size-2 rounded-full bg-terracotta" />
          </span>
          {t("championship.chip.live", { city: info.city })}
        </span>
        <p className="hero-serif text-[clamp(30px,3.6vw,44px)] leading-tight text-foreground">
          {t("nagoya.countdown.dayOf", { n: day, total: totalDays })}
        </p>
      </div>
    );
  }

  // Before the Games, and on the first render, when the time is not known yet:
  // the same boxes with blank figures, so nothing moves when it arrives.
  const left = now === null ? null : Math.max(0, start - now);
  const units = [
    { key: "days", value: left === null ? null : Math.floor(left / DAY) },
    { key: "hours", value: left === null ? null : Math.floor(left / 3_600_000) % 24 },
    { key: "minutes", value: left === null ? null : Math.floor(left / 60_000) % 60 },
    { key: "seconds", value: left === null ? null : Math.floor(left / 1000) % 60 },
  ] as const;
  const format = (n: number) =>
    new Intl.NumberFormat(localeTag(lang), { minimumIntegerDigits: 2 }).format(n);

  // role="timer": what a countdown is, and its changes are not announced, so a
  // screen reader is not read a new second every second.
  return (
    <div role="timer">
      <p className="label-caps text-gold-strong">{t("nagoya.countdown.startsIn")}</p>
      {/* Four equal columns, so the row fits a 320px phone in either
          language: "secondes" is the longest label. */}
      <div aria-hidden="true" className="mt-3 grid max-w-[460px] grid-cols-4">
        {units.map((u, i) => (
          <div key={u.key} className={i > 0 ? "border-l border-white/20 pl-3 sm:pl-5" : ""}>
            <span
              className="hero-serif block text-[clamp(40px,5.4vw,68px)] leading-none text-foreground"
              style={{ fontVariantNumeric: "lining-nums tabular-nums" }}
            >
              {u.value === null ? <span className="invisible">00</span> : format(u.value)}
            </span>
            <span className="mt-2 block text-[12.5px] text-muted-foreground">
              {t(`nagoya.countdown.${u.key}`)}
            </span>
          </div>
        ))}
      </div>
      {left !== null && (
        <p className="sr-only">
          {t("nagoya.countdown.aria", {
            days: units[0].value ?? 0,
            hours: units[1].value ?? 0,
            minutes: units[2].value ?? 0,
          })}
        </p>
      )}
    </div>
  );
}

/** Every event is called one way, by the model or on points, or not at all.
 * The bar shows that before a word of explanation. */
function SplitBar({ split }: { split: CallSplit }) {
  const { t } = useT();
  const segments = [
    { key: "model", className: "bg-gold-strong" },
    { key: "points", className: "bg-white/45" },
    { key: "none", className: "border border-white/45" },
  ] as const;
  const shown = segments.filter((s) => split[s.key] > 0);
  if (shown.length === 0) return null;

  return (
    <div
      className="hero-reveal mt-9 max-w-[520px]"
      style={{ "--reveal-d": "960ms" } as CSSProperties}
    >
      <div
        role="img"
        aria-label={t("asianGames.split.aria", split)}
        className="flex h-2.5 w-full gap-1"
      >
        {shown.map((s) => (
          <span
            key={s.key}
            className={`rounded-full ${s.className}`}
            style={{ flexGrow: split[s.key] }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-foreground/90">
        {shown.map((s) => (
          <li key={s.key}>
            <span className="nums font-semibold text-foreground">{split[s.key]}</span>{" "}
            {t(`asianGames.split.${s.key}`)}
          </li>
        ))}
      </ul>
    </div>
  );
}
