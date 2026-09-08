import type { CSSProperties, ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { Shell, Panel, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { NatFlag } from "@/components/dl/nat-flag";
import { UltimateProjections } from "@/components/dl/ultimate-projections";
import { useUltimate } from "@/hooks/useUltimate";
import { useT, type Lang } from "@/lib/i18n";
import { discName } from "@/lib/dl-data";
import type { UltimateEvent, UltimateNamedQualifier, UltimateRelay } from "@/lib/dl-data";
import { localeTag } from "@/lib/dates";
import { usePageTitle } from "@/lib/use-page-title";

export const Route = createFileRoute("/ultimate")({
  head: () =>
    pageHead(
      "Ultimate Championship",
      "The World Athletics Ultimate Championship in Budapest, 11-13 September 2026: the format, the field, and the athletes already qualified.",
    ),
  component: UltimatePage,
});

type Phase = "upcoming" | "live" | "done";

function phaseOf(ev: UltimateEvent, now = new Date()): { phase: Phase; days: number } {
  const start = new Date(`${ev.startDate}T00:00:00`);
  const end = new Date(`${ev.endDate}T23:59:59`);
  const days = Math.max(0, Math.ceil((start.getTime() - now.getTime()) / 86_400_000));
  const phase: Phase = now < start ? "upcoming" : now <= end ? "live" : "done";
  return { phase, days };
}

function dateRange(ev: UltimateEvent, lang: Lang): string {
  const start = new Date(`${ev.startDate}T00:00:00`);
  const end = new Date(`${ev.endDate}T00:00:00`);
  const month = new Intl.DateTimeFormat(localeTag(lang), {
    month: "long",
  }).format(end);
  return `${start.getDate()}–${end.getDate()} ${month} ${end.getFullYear()}`;
}

/** The immersive, event-specific hero — deliberately unlike the rest of the
 * (light, terracotta) site. Dark, gold-accented, with the countdown as the
 * anchor: this is the "the whole season has been building to this" moment. All
 * styling is inline/scoped so nothing about this look leaks to other pages;
 * when the next championship takes this tab, only this component re-themes. */
function UltimateHero({ ev, lang }: { ev: UltimateEvent; lang: Lang }) {
  const { t } = useT();
  const { phase, days } = phaseOf(ev);
  const gold = "#f0c24a";
  return (
    <div
      className="relative mt-2 overflow-hidden rounded-[28px] px-6 py-11 text-white sm:px-12 sm:py-16"
      style={{
        backgroundColor: "#0c0718",
        border: "1px solid rgba(168,85,247,0.22)",
        backgroundImage:
          "radial-gradient(120% 150% at 88% -12%, rgba(168,85,247,0.55) 0%, rgba(12,7,24,0) 58%)," +
          "radial-gradient(100% 130% at -6% 108%, rgba(109,40,217,0.46) 0%, rgba(12,7,24,0) 56%)," +
          "radial-gradient(70% 90% at 45% 58%, rgba(217,70,239,0.16) 0%, rgba(12,7,24,0) 62%)," +
          "repeating-linear-gradient(115deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 46px)",
      }}
    >
      <span
        className="label-caps inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px]"
        style={{ borderColor: "rgba(240,194,74,0.5)", color: gold }}
      >
        <span className="size-1.5 rounded-full" style={{ backgroundColor: gold }} />
        {t("ultimate.hero.kicker", { short: ev.shortName, dates: dateRange(ev, lang) })}
      </span>

      <h1 className="dg mt-5 max-w-3xl text-[34px] font-bold leading-[1.02] tracking-[-0.02em] sm:text-[54px]">
        {t("ultimate.hero.headline")}
      </h1>
      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/70">
        {t("ultimate.about.body", { venue: ev.venue, city: ev.city, dates: dateRange(ev, lang) })}
      </p>

      {/* Countdown + format facts, gold on dark */}
      <div className="mt-9 flex flex-wrap items-end gap-x-10 gap-y-6">
        <div>
          <div
            className="dg nums text-[64px] font-bold leading-none sm:text-[84px]"
            style={{ color: gold }}
          >
            {phase === "live"
              ? t("ultimate.stat.liveValue")
              : phase === "done"
                ? t("ultimate.stat.doneValue")
                : days}
          </div>
          <div className="label-caps mt-1 text-white/70">
            {phase === "live"
              ? t("ultimate.stat.liveLabel")
              : phase === "done"
                ? t("ultimate.stat.doneLabel")
                : t("ultimate.hero.daysToGo")}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {[
            { v: ev.eventCount, l: t("ultimate.stat.events") },
            { v: `${ev.trackFieldSize}/${ev.fieldFieldSize}`, l: t("ultimate.hero.fieldsLabel") },
            { v: `$${Math.round(ev.prizeUSD / 1_000_000)}M`, l: t("ultimate.stat.prize") },
            { v: ev.sessions, l: t("ultimate.hero.nights") },
          ].map((s) => (
            <div key={s.l}>
              <div className="dg nums text-[26px] font-bold leading-none text-white">{s.v}</div>
              <div className="label-caps mt-1.5 text-white/55">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UltimatePage() {
  const { t, lang } = useT();
  usePageTitle(t("seo.ultimate"));
  const state = useUltimate();

  return (
    <Shell title={t("ultimate.title")} crumb={t("nav.ultimate")} theme="ultimate">
      {state.status === "loading" && (
        <div className="mt-2 space-y-6">
          <div className="skeleton-pulse h-64 rounded-[28px] bg-white/60" />
          <PanelSkeleton title={t("ultimate.qualifiers.title")} rows={8} />
        </div>
      )}
      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}
      {state.status === "ok" && <UltimateBody ev={state.data} lang={lang} t={t} />}
    </Shell>
  );
}

/** "ETHAN KATZBERG" -> "Ethan KATZBERG". World Athletics shouts every name on
 * these cards; our own convention is forename in sentence case and surname in
 * caps. Applied only to athletes we could not match, since a matched one is
 * already shown under our own spelling. */
function waName(name: string): string {
  const [first, ...rest] = name.split(" ");
  if (!first) return name;
  const forename = first.charAt(0) + first.slice(1).toLowerCase();
  return [forename, ...rest].join(" ");
}

/** "POLE VAULT" -> "Pole vault". World Athletics writes its event names in
 * caps on these cards; shouting them next to our own sentence-case discipline
 * names read as two different data sources, which is exactly what it is. */
function titleCase(label: string): string {
  const s = label.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** One qualification route: a labelled group of athletes who got in that way. */
function QualifierGroup({
  heading,
  note,
  n,
  children,
}: {
  heading: string;
  note: string;
  n: number;
  children: ReactNode;
}) {
  if (n === 0) return null;
  return (
    <section>
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <h3 className="label-caps text-foreground">{heading}</h3>
        <span className="nums text-[11.5px] text-muted-foreground">{n}</span>
      </div>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{note}</p>
      <ul className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </ul>
    </section>
  );
}

/** A champion named by World Athletics. Linked into our own pages only when
 * the athlete was matched to one of our disciplines beyond doubt -- otherwise
 * shown as plain text, since a wrong link is worse than no link. */
function NamedQualifierRow({
  q,
  i,
  t,
}: {
  q: UltimateNamedQualifier;
  i: number;
  t: (k: string, v?: Record<string, string | number>) => string;
}) {
  const shown = q.linkName ?? waName(q.name);
  // Our gendered name when we know the event; otherwise WA's own wording,
  // gently cased, because their card carries no gender to infer one from.
  const event = q.discKey ? discName(t, q.discKey, q.discKey) : titleCase(q.disciplineLabel ?? "");
  return (
    <li
      className="stagger-item flex items-center gap-3 border-b border-border/60 py-2 last:border-0"
      style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
    >
      <NatFlag nat={q.nationality ?? ""} />
      {q.discKey && q.linkName ? (
        <Link
          to="/athlete/$discKey/$name"
          params={{ discKey: q.discKey, name: q.linkName }}
          className="truncate text-[13.5px] font-medium text-foreground transition-colors hover:text-terracotta-strong hover:underline"
        >
          {shown}
        </Link>
      ) : (
        <span className="truncate text-[13.5px] font-medium text-foreground">{shown}</span>
      )}
      <span className="ml-auto whitespace-nowrap text-[11.5px] text-muted-foreground">{event}</span>
    </li>
  );
}

/** One mixed relay: who qualified, and how. Carries no projection -- see
 * ultimate.relays.noModel for why, which is a data fact rather than a
 * choice about what to show. */
function RelayEvent({
  relay,
  t,
}: {
  relay: UltimateRelay;
  t: (k: string, v?: Record<string, string | number>) => string;
}) {
  const qualified = relay.teams.filter((x) => x.qualified);
  return (
    <section>
      <div className="flex flex-wrap items-baseline gap-x-2.5">
        <h3 className="label-caps text-foreground">{relay.event}</h3>
        <span className="nums text-[11.5px] text-muted-foreground">
          {qualified.length + relay.wildcards.length}
        </span>
      </div>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
        {t("ultimate.relays.from", {
          n: relay.qualifyPlaces,
          meet: relay.qualifier.name,
          city: relay.qualifier.city,
        })}
      </p>
      <ul className="mt-2.5">
        {qualified.map((team, i) => (
          <li
            key={team.nationality ?? String(i)}
            className="stagger-item flex items-center gap-3 border-b border-border/60 py-2 last:border-0"
            style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
          >
            <NatFlag nat={team.nationality ?? ""} />
            {team.nationality ? (
              <Link
                to="/country/$code"
                params={{ code: team.nationality }}
                className="truncate text-[13.5px] font-medium text-foreground transition-colors hover:text-terracotta-strong hover:underline"
              >
                {team.country ?? team.nationality}
              </Link>
            ) : (
              <span className="truncate text-[13.5px] font-medium text-foreground">
                {team.country}
              </span>
            )}
            <span className="nums ml-auto whitespace-nowrap text-[11.5px] text-muted-foreground">
              {team.mark ?? "—"}
            </span>
          </li>
        ))}
        {relay.wildcards.map((code) => (
          <li
            key={`host-${code}`}
            className="flex items-center gap-3 border-b border-border/60 py-2 last:border-0"
          >
            <NatFlag nat={code} />
            <Link
              to="/country/$code"
              params={{ code }}
              className="truncate text-[13.5px] font-medium text-foreground transition-colors hover:text-terracotta-strong hover:underline"
            >
              {code}
            </Link>
            <span className="ml-auto whitespace-nowrap text-[11.5px] text-muted-foreground">
              {t("country.relayHost")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function UltimateBody({
  ev,
  lang,
  t,
}: {
  ev: UltimateEvent;
  lang: Lang;
  t: (k: string, v?: Record<string, string | number>) => string;
}) {
  const dlQualifiers = [...ev.dlFinalQualifiers].sort((a, b) =>
    discName(t, a.discipline, a.discipline).localeCompare(discName(t, b.discipline, b.discipline)),
  );
  // Guarded: a deploy whose snapshot predates the named-qualifier scrape
  // should show the Diamond League group rather than crash on undefined.
  const named = ev.namedQualifiers ?? [];
  const olympic = named.filter((q) => q.route === "olympic");
  const world = named.filter((q) => q.route === "world");
  const relays = ev.relays ?? [];
  return (
    <div className="space-y-6">
      <UltimateHero ev={ev} lang={lang} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel title={t("ultimate.qualify.title")}>
          <ol className="space-y-3 text-[13.5px] leading-snug text-foreground">
            <li className="flex gap-2.5">
              <span className="mt-0.5 font-semibold text-terracotta-strong">1</span>
              <span>{t("ultimate.qualify.direct")}</span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 font-semibold text-terracotta-strong">2</span>
              <span>{t("ultimate.qualify.rankings")}</span>
            </li>
          </ol>
          <p className="mt-4 text-[12px] leading-snug text-muted-foreground">
            {t("ultimate.qualify.note")}
          </p>
        </Panel>
      </div>

      <Panel title={t("ultimate.qualifiers.title")} subtitle={t("ultimate.qualifiers.note")}>
        <div className="space-y-7">
          <QualifierGroup
            heading={t("ultimate.qualifiers.olympic")}
            note={t("ultimate.qualifiers.olympicNote")}
            n={olympic.length}
          >
            {olympic.map((q, i) => (
              <NamedQualifierRow key={`o-${q.waId}-${q.disciplineLabel}`} q={q} i={i} t={t} />
            ))}
          </QualifierGroup>
          <QualifierGroup
            heading={t("ultimate.qualifiers.world")}
            note={t("ultimate.qualifiers.worldNote")}
            n={world.length}
          >
            {world.map((q, i) => (
              <NamedQualifierRow key={`w-${q.waId}-${q.disciplineLabel}`} q={q} i={i} t={t} />
            ))}
          </QualifierGroup>
          <QualifierGroup
            heading={t("ultimate.qualifiers.dl")}
            note={t("ultimate.qualifiers.dlNote")}
            n={dlQualifiers.length}
          >
            {dlQualifiers.map((q, i) => (
              <li
                key={`d-${q.discipline}-${q.athlete_name}`}
                className="stagger-item flex items-center gap-3 border-b border-border/60 py-2 last:border-0"
                style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
              >
                <NatFlag nat={q.nationality} />
                <Link
                  to="/athlete/$discKey/$name"
                  params={{ discKey: q.discipline, name: q.athlete_name }}
                  className="text-[13.5px] font-medium text-foreground transition-colors hover:text-terracotta-strong hover:underline"
                >
                  {q.athlete_name}
                </Link>
                <span className="ml-auto whitespace-nowrap text-[11.5px] text-muted-foreground">
                  {discName(t, q.discipline, q.discipline)}
                </span>
              </li>
            ))}
          </QualifierGroup>
        </div>
      </Panel>

      {relays.length > 0 && (
        <Panel title={t("ultimate.relays.title")} subtitle={t("ultimate.relays.note")}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {relays.map((r) => (
              <RelayEvent key={r.event} relay={r} t={t} />
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-[11.5px] leading-snug text-muted-foreground">
            {t("ultimate.relays.noModel")}
          </p>
        </Panel>
      )}

      {(ev.projections ?? []).length > 0 ? (
        <UltimateProjections projections={ev.projections} t={t} />
      ) : (
        <Panel title={t("ultimate.field.title")}>
          <div className="rounded-lg border border-dashed border-border bg-secondary/30 px-4 py-6 text-center">
            <p className="mx-auto max-w-xl text-[13.5px] leading-snug text-muted-foreground">
              {t("ultimate.field.pending")}
            </p>
          </div>
        </Panel>
      )}
    </div>
  );
}
