import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { Shell, Panel, PanelSkeleton, ErrorPanel } from "@/components/dl/shell";
import { NatFlag } from "@/components/dl/nat-flag";
import { AthleteCard } from "@/components/dl/athlete-card";
import { BackButton } from "@/components/dl/back-button";
import { useCountry } from "@/hooks/useCountry";
import { countryPalette, flagFile } from "@/lib/country-theme";
import { useT } from "@/lib/i18n";
import { discName } from "@/lib/dl-data";
import type { Country, CountryAthlete, CountryQualifier, CountryRelay } from "@/lib/dl-data";

export const Route = createFileRoute("/country/$code")({
  head: ({ params }) =>
    pageHead(
      params.code.toUpperCase(),
      `Every ranked athlete from ${params.code.toUpperCase()} this season, their marks, and their places at the World Athletics Ultimate Championship.`,
    ),
  component: CountryPage,
});

/** How many athletes to list before folding the rest away. The United States
 * alone has over a thousand ranked athletes, so an uncapped list would be a
 * page nobody scrolls to the bottom of. */
const SHOWN = 60;

/** Squad names to list per relay. Across two meets a nation can field eight
 * or more; the ones that matter are at the top, since they're ordered by how
 * often the country actually used them. */
const SQUAD_SHOWN = 6;

/** Where the flag stops, as a mask on the band's flag layer. It has to be done
 * before the band starts turning into the page's ground below it. */
const FLAG_FADE = "linear-gradient(to bottom, #000 0%, #000 46%, transparent 74%)";

/** Where the flag is allowed to come up to full strength: the right-hand side,
 * clear of the text. Two masks multiplied -- transparent on the left through
 * the whole text column, and the same bottom fade as above so it still
 * dissolves into the page. */
const FLAG_REVEAL =
  "linear-gradient(to right, transparent 0%, transparent 52%, #000 82%), " +
  "linear-gradient(to bottom, #000 0%, #000 46%, transparent 74%)";

function CountryPage() {
  const { code } = Route.useParams();
  const { t } = useT();
  const state = useCountry(code);
  // The theme comes from the code in the URL, not from the response, so the
  // page is already wearing the nation's colours while it loads. Deriving it
  // from the loaded data instead meant every visit opened terracotta and then
  // flipped colour a moment later. A code we have no flag for resolves to
  // null here exactly as it does below.
  const theme = countryPalette(code) ?? "default";

  if (state.status === "loading") {
    return (
      <Shell title={code.toUpperCase()} crumb={code.toUpperCase()} theme={theme}>
        <PanelSkeleton title={t("country.athletes")} rows={10} />
      </Shell>
    );
  }
  if (state.status === "notFound") {
    return (
      <Shell title={code.toUpperCase()} crumb={code.toUpperCase()} theme={theme}>
        <Panel title={t("country.notFoundTitle")}>
          <p className="text-[13.5px] leading-relaxed text-foreground">
            {t("country.notFound", { code: code.toUpperCase() })}
          </p>
        </Panel>
      </Shell>
    );
  }
  if (state.status === "error") {
    return (
      <Shell title={code.toUpperCase()} crumb={code.toUpperCase()} theme={theme}>
        <ErrorPanel title={t("country.errorTitle")} message={state.message} onRetry={state.retry} />
      </Shell>
    );
  }
  return <CountryBody c={state.data} t={t} />;
}

function CountryBody({
  c,
  t,
}: {
  c: Country;
  t: (k: string, v?: Record<string, string | number>) => string;
}) {
  const [filter, setFilter] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Name or event, so "hurdles" finds a nation's hurdlers as readily as a
  // surname does. A country page is the one list long enough to need it:
  // the United States alone has over a thousand ranked athletes.
  const matches = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return c.athletes;
    return c.athletes.filter(
      (a) => a.name.toLowerCase().includes(q) || a.disc.toLowerCase().includes(q),
    );
  }, [c.athletes, filter]);

  const shown = showAll ? matches : matches.slice(0, SHOWN);
  const hidden = matches.length - shown.length;
  // The three best of the season, by the same score the table is ordered on.
  const best = c.athletes.slice(0, 3);

  // The whole page wears the nation's colours, not just a stripe of them: the
  // ground behind everything, the ambient blooms, the head band, the footer.
  // The panels stay light — they hold marks and scores, and tinting data is
  // where a themed page stops being readable — but they carry the nation's
  // accent on their edges and figures.
  //
  // Null for a nation with no vendored flag, and then nothing changes at all:
  // the page is the site's own terracotta, which is the same graceful nothing
  // NatFlag falls back to rather than a colour guessed from a country code.
  const palette = countryPalette(c.code);
  const iso = flagFile(c.code);
  const backdrop = palette ? (
    <div aria-hidden="true" className="absolute inset-0">
      {/* The band is its own, much darker version of the nation's ground, and
          that is what pays for the flag. The page ground sits exactly at the
          4.5:1 floor, so it has no headroom: anything laid over it at a
          visible strength breaks the text on it. Dropping the band to
          oklch(0.18 ...) buys the room back, and `flagAlpha` spends as much of
          it as measurement allows -- 16% to 55% depending on the nation, 31%
          at the median, solved against that flag's single brightest pixel so a
          headline falling across the white bar of a tricolour is as readable
          as one that does not. The site already has this move: the athlete
          page's headTone="brick" is the same darker, heavier band under a
          photo. */}
      <div className="absolute inset-0" style={{ backgroundColor: palette.band }} />
      {iso && (
        <>
          {/* The measured layer: the flag across the WHOLE band at the alpha
              solved for this nation, which is safe behind text anywhere. */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(/flags/${iso}.svg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: palette.flagAlpha,
              // Faded out before the band ends, so the flag never overlaps the
              // stretch where the band has become the page's own ground --
              // that ground is measured at exactly 4.5:1 and has nothing spare.
              maskImage: FLAG_FADE,
              WebkitMaskImage: FLAG_FADE,
            }}
          />
          {/* ...and a second, much stronger pass of the same flag, masked to
              the right-hand side where no text reaches.

              This is why Germany's header looked empty. The safe alpha is
              solved against the flag's brightest pixel behind body text, and
              for a nation whose bloom is gold that lands at 22% -- enough to
              tint, not enough to read as a flag. Text is constrained to the
              left (the description is max-w-[64ch]), so the right side has
              contrast to spare and there is no reason to spend the same
              budget there.

              ADDITIVE and therefore safe by construction: this only ever adds
              opacity where the mask is non-zero, and the mask is zero across
              the whole left side. Hidden below `sm`, where text wraps the full
              width and that guarantee would no longer hold. */}
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              backgroundImage: `url(/flags/${iso}.svg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.85,
              maskImage: FLAG_REVEAL,
              WebkitMaskImage: FLAG_REVEAL,
              // INTERSECT, not the default union. Two mask layers are added
              // together by default, which would mean "right of 52% OR above
              // the bottom fade" -- and that OR puts the flag straight back
              // over the title at full strength. Both conditions have to hold.
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
          />
        </>
      )}
      {/* ...and the band dissolves into the page's ground rather than stopping
          against it. Without this the header read as a separate dark slab that
          had been dropped on top of the page.

          Safe by construction, not by luck: this only ever mixes the band
          towards `ground`, and `ground` is itself measured at 4.5:1 for every
          one of these text tokens. Every point in the fade is a blend of two
          colours that both pass, and luminance moves monotonically between
          them, so the worst case in here is the ground itself. The flag's mask
          above is finished before this starts. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 62%, ${palette.ground} 100%)`,
        }}
      />
    </div>
  ) : null;

  return (
    <Shell
      title={c.name}
      crumb={c.name}
      theme={palette ?? "default"}
      headBackdrop={backdrop}
      back={<BackButton fallbackTo="/stats" fallbackLabel={t("country.backToStats")} />}
      eyebrow={c.area ?? undefined}
      description={t("country.lede", {
        n: c.athleteCount,
        d: c.disciplineCount,
      })}
      figures={
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <span className="flex items-center gap-3">
            <NatFlag nat={c.code} />
            <span className="label-caps text-white/92">{c.code}</span>
          </span>
          <Figure label={t("country.athletes")} value={c.athleteCount} />
          <Figure label={t("country.disciplines")} value={c.disciplineCount} />
          <Figure label={t("country.bestScore")} value={c.topScore || "—"} />
        </div>
      }
    >
      <div className="space-y-6">
        {(c.ultimateQualifiers.length > 0 || c.relays.length > 0) && (
          <Panel title={t("country.ultimateTitle")} subtitle={t("country.ultimateNote")}>
            <div className="space-y-6">
              {c.relays.length > 0 && <RelayList relays={c.relays} t={t} />}
              {c.ultimateQualifiers.length > 0 && (
                <QualifierList qualifiers={c.ultimateQualifiers} t={t} />
              )}
            </div>
          </Panel>
        )}

        {best.length > 0 && (
          <Panel title={t("country.bestTitle")} subtitle={t("country.bestNote")}>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {best.map((a, i) => (
                <li key={`${a.discKey}-${a.name}`}>
                  <AthleteCard
                    name={a.name}
                    nat={c.code}
                    discipline={discName(t, a.discKey, a.disc)}
                    stat={a.score ?? "—"}
                    statLabel={t("country.colScore")}
                    sub={a.mark}
                    photoUrl={a.photoUrl}
                    photoCredit={a.photoCredit}
                    photoFocus={a.photoFocus}
                    to={{ discKey: a.discKey, name: a.name }}
                    index={i}
                  />
                </li>
              ))}
            </ul>
          </Panel>
        )}

        <Panel
          title={t("country.athletes")}
          subtitle={t("country.athletesNote", { n: c.athleteCount })}
        >
          <div className="mb-3.5">
            <label className="sr-only" htmlFor="country-filter">
              {t("country.filterLabel")}
            </label>
            <input
              id="country-filter"
              type="search"
              value={filter}
              placeholder={t("country.filterPlaceholder")}
              onChange={(e) => {
                setFilter(e.target.value);
                setShowAll(false);
              }}
              className="h-9 w-full max-w-xs rounded-full border border-border bg-card px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="label-caps border-b border-border text-muted-foreground">
                  <th scope="col" className="pb-2 pr-2 font-semibold">
                    {t("country.colAthlete")}
                  </th>
                  <th scope="col" className="pb-2 pl-3 font-semibold">
                    {t("country.colEvent")}
                  </th>
                  <th scope="col" className="w-24 pb-2 pl-3 text-right font-semibold">
                    {t("country.colMark")}
                  </th>
                  <th scope="col" className="w-20 pb-2 pl-3 text-right font-semibold">
                    {t("country.colScore")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shown.map((a, i) => (
                  <AthleteRow key={`${a.discKey}-${a.name}`} a={a} i={i} t={t} />
                ))}
              </tbody>
            </table>
          </div>
          {matches.length === 0 && (
            <p className="mt-3 text-[12.5px] text-muted-foreground">
              {t("country.noMatch", { query: filter.trim() })}
            </p>
          )}
          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mt-3 text-[12.5px] font-medium text-terracotta-strong hover:underline"
            >
              {t("country.showAll", { n: hidden })}
            </button>
          )}
          <p className="mt-3 max-w-3xl text-[11.5px] leading-snug text-muted-foreground">
            {t("country.scoreNote")}
          </p>
        </Panel>
      </div>
    </Shell>
  );
}

/** One number on the head band, in the same shape the dashboard uses. */
function Figure({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="flex flex-col">
      <span className="nums text-[22px] leading-none font-semibold text-white">{value}</span>
      <span className="label-caps mt-1.5 text-white/92">{label}</span>
    </span>
  );
}

function AthleteRow({
  a,
  i,
  t,
}: {
  a: CountryAthlete;
  i: number;
  t: (k: string, v?: Record<string, string | number>) => string;
}) {
  return (
    <tr
      className="stagger-item transition-colors hover:bg-secondary/40"
      style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
    >
      <td className="py-2.5 pr-2 text-[13px]">
        <Link
          to="/athlete/$discKey/$name"
          params={{ discKey: a.discKey, name: a.name }}
          className="font-medium text-foreground transition-colors hover:text-terracotta-strong hover:underline"
        >
          {a.name}
        </Link>
      </td>
      <td className="py-2.5 pl-3 text-[13px] text-muted-foreground">
        <Link
          to="/discipline/$discKey"
          params={{ discKey: a.discKey }}
          className="transition-colors hover:text-terracotta-strong hover:underline"
        >
          {discName(t, a.discKey, a.disc)}
        </Link>
      </td>
      <td className="nums py-2.5 pl-3 text-right text-[13px] text-foreground">{a.mark ?? "—"}</td>
      <td className="nums py-2.5 pl-3 text-right text-[13px] font-semibold text-foreground">
        {a.score ?? "—"}
      </td>
    </tr>
  );
}

/** The nation's mixed relay teams.
 *
 * Deliberately carries no projection. The Diamond League has no relays, so
 * there is no training history, no toplist and no head-to-head for a national
 * team — the model has nothing to say about them, and saying so is better than
 * inventing a number. What is shown is what actually happened at the World
 * Athletics Relays, which is the qualifying meet. */
function RelayList({
  relays,
  t,
}: {
  relays: CountryRelay[];
  t: (k: string, v?: Record<string, string | number>) => string;
}) {
  return (
    <section>
      <h3 className="label-caps text-foreground">{t("country.relaysTitle")}</h3>
      <ul className="mt-2.5 space-y-1">
        {relays.map((r) => (
          <li
            key={r.event}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border/60 py-2 last:border-0"
          >
            <span className="text-[13.5px] font-medium text-foreground">{r.event}</span>
            <span className="text-[12px] text-muted-foreground">
              {r.host
                ? t("country.relayHost")
                : r.place != null
                  ? t("country.relayPlace", { place: r.place, mark: r.mark ?? "—" })
                  : t("country.relayNoTime", { mark: r.mark ?? "—" })}
            </span>
            {r.qualified && (
              <span className="label-caps ml-auto rounded-full bg-terracotta/12 px-1.5 py-0.5 text-terracotta-strong">
                {t("country.relayQualified")}
              </span>
            )}
            {r.squad.length > 0 && (
              <ul className="mt-1 flex w-full flex-wrap gap-x-4 gap-y-1">
                {r.squad.slice(0, SQUAD_SHOWN).map((m) => (
                  <li key={m.name} className="text-[12px] text-muted-foreground">
                    <span className="nums text-foreground/70">
                      {m.legs.length ? m.legs.join("/") : "—"}
                    </span>{" "}
                    <span className="text-foreground">{m.name}</span>
                    {/* Say the notable thing only. Appearing at more than one
                        meet marks a fixture of the squad; a single round marks
                        a substitute. Everyone else needs no annotation. */}
                    {m.meets.length > 1 ? (
                      <span className="text-terracotta-strong">
                        {" "}
                        {t("country.relayMeets", { n: m.meets.length })}
                      </span>
                    ) : m.rounds === 1 ? (
                      <span> {t("country.relayOneRound")}</span>
                    ) : null}
                  </li>
                ))}
                {r.squad.length > SQUAD_SHOWN && (
                  <li className="text-[12px] text-muted-foreground">
                    {t("country.relayMoreSquad", { n: r.squad.length - SQUAD_SHOWN })}
                  </li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11.5px] leading-snug text-muted-foreground">
        {t("country.relayNote")}
      </p>
    </section>
  );
}

function QualifierList({
  qualifiers,
  t,
}: {
  qualifiers: CountryQualifier[];
  t: (k: string, v?: Record<string, string | number>) => string;
}) {
  const routeLabel: Record<CountryQualifier["route"], string> = {
    olympic: t("ultimate.qualifiers.olympic"),
    world: t("ultimate.qualifiers.world"),
    dl: t("ultimate.qualifiers.dl"),
  };
  return (
    <section>
      <h3 className="label-caps text-foreground">{t("country.qualifiersTitle")}</h3>
      <ul className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
        {qualifiers.map((q, i) => (
          <li
            key={`${q.route}-${q.name}-${q.discKey ?? q.disciplineLabel}`}
            className="stagger-item flex items-center gap-3 border-b border-border/60 py-2 last:border-0"
            style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
          >
            {q.discKey ? (
              <Link
                to="/athlete/$discKey/$name"
                params={{ discKey: q.discKey, name: q.name }}
                className="truncate text-[13.5px] font-medium text-foreground transition-colors hover:text-terracotta-strong hover:underline"
              >
                {q.name}
              </Link>
            ) : (
              <span className="truncate text-[13.5px] font-medium text-foreground">{q.name}</span>
            )}
            <span className="ml-auto whitespace-nowrap text-[11.5px] text-muted-foreground">
              {routeLabel[q.route]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
