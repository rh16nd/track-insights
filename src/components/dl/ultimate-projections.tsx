import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Panel, ProbabilityBar, RankBadge, WatchBadge } from "./shell";
import { NatFlag } from "./nat-flag";
import { InfoTip } from "./info-tip";
import { discName } from "@/lib/dl-data";
import type { CallMethod, UltimateProjection } from "@/lib/dl-data";

/** World Athletics writes a single-named athlete with a placeholder given name,
 * ". SEEMA". The placeholder stays in the data, where it is part of the key,
 * and is dropped where a reader sees it. */
function displayName(name: string): string {
  return name.replace(/^\.\s+/, "");
}

/** The model's call on each event at the Ultimate Championship.
 *
 * THE FIELD IS NOT A GUESS. World Athletics publishes the Ultimate's
 * qualification list through their own API, so every athlete here is one they
 * say has qualified, and the route column is their wording for how: a wild
 * card for the Olympic, world and Diamond League champions, World Athletics
 * Rankings for everyone else. The model contributes the ordering, nothing
 * else.
 *
 * The whole field is listed rather than three names. A podium shown on its own
 * hides how close fourth was, and in an event like the men's 400m hurdles —
 * where the top three sit within four points of each other — that gap is the
 * story. */
export function UltimateProjections({
  projections,
  t,
}: {
  projections: UltimateProjection[];
  t: (k: string, v?: Record<string, string | number>) => string;
}) {
  const sorted = useMemo(
    () =>
      [...projections].sort((a, b) =>
        discName(t, a.discKey, a.disciplineLabel).localeCompare(
          discName(t, b.discKey, b.disciplineLabel),
        ),
      ),
    [projections, t],
  );
  const [active, setActive] = useState("");
  const current = sorted.find((p) => p.discKey === active) ?? sorted[0];
  if (!current) return null;

  // Only a REPORTED WITHDRAWAL leaves the list. The two injury statuses mean
  // different things and this used to treat them the same, which moved
  // Duplantis out of the pole vault on a report that said he pulled out of the
  // Diamond League final -- a meeting already run, saying nothing about
  // Budapest. A "watch" is an injury mention that stops short of a withdrawal;
  // it keeps its place, its rank and its number, and carries the badge.
  //
  // Even a reported withdrawal is moved rather than deleted: this field is
  // World Athletics' published qualification list, which the page says in as
  // many words, and a headline match can be wrong (HANDOFF: the Cole Hocker
  // false positive). The reader gets the athlete, the model's number and the
  // report behind it, and decides.
  const isOut = (a: UltimateProjection["athletes"][number]) => a.injuryStatus === "remove";
  const clear = current.athletes.filter((a) => !isOut(a));
  const flagged = current.athletes.filter(isOut);
  // Renumbering the list 1..N closes the hole a withdrawal leaves, and in doing
  // so it hides something: with the model's number one reported out, the three
  // medal badges sit on its 2nd, 3rd and 4th, and the page said nothing about
  // it. Only worth saying when a withdrawal actually displaced the podium --
  // the javelin's flagged athlete is its number eight, and nobody was promoted
  // over him.
  const promoted = flagged.filter((a) => a.rank <= 3);
  const unranked = current.unranked ?? [];
  // The Ultimate's table reads a qualification route, then a chance. A call
  // made one way per event (the Asian Games) reads the mark each athlete is
  // ranked on, then a chance where the model called the event or points where
  // it did not.
  const middle = current.method
    ? { label: "championship.projection.colMark", hint: "championship.projection.markHint" }
    : { label: "ultimate.projection.colRoute", hint: "ultimate.projection.routeHint" };
  const last =
    current.method === "points"
      ? { label: "championship.projection.colPoints", hint: "championship.projection.pointsHint" }
      : {
          label: "ultimate.projection.colChance",
          hint: current.method
            ? "championship.projection.chanceHint"
            : "ultimate.projection.chanceHint",
        };

  return (
    <>
      {/* Same picker the Track and Field tables use — a real select on a
          phone, pills on a desktop — so a reader who has used one page already
          knows how this one works. */}
      <div className="sm:hidden">
        <label className="label-caps mb-1.5 block text-white/90" htmlFor="uc-discipline">
          {t("rankings.discipline")}
        </label>
        <select
          id="uc-discipline"
          value={current.discKey}
          onChange={(e) => setActive(e.target.value)}
          className="w-full rounded-md border border-border bg-card px-3 py-3 text-[13.5px] font-medium text-foreground"
        >
          {sorted.map((p) => (
            <option key={p.discKey} value={p.discKey}>
              {discName(t, p.discKey, p.disciplineLabel)}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden flex-wrap gap-2 sm:flex">
        {sorted.map((p) => (
          <button
            key={p.discKey}
            type="button"
            onClick={() => setActive(p.discKey)}
            className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
              p.discKey === current.discKey
                ? "border-transparent bg-terracotta text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
            }`}
          >
            {discName(t, p.discKey, p.disciplineLabel)}
            {/* A dot marks an event the model calls: gold, like the model's
                share of the hero's split, and the pill's own text colour when
                the pill is selected, where gold would vanish into it. */}
            {p.method === "model" && (
              <>
                <span
                  aria-hidden="true"
                  className={`ml-1.5 inline-block size-1.5 rounded-full align-middle ${
                    p.discKey === current.discKey ? "bg-primary-foreground" : "bg-gold"
                  }`}
                />
                <span className="sr-only"> · {t("championship.projection.byModel")}</span>
              </>
            )}
          </button>
        ))}
      </div>

      <Panel
        title={t(
          current.method === "points"
            ? "championship.projection.titlePoints"
            : "ultimate.projection.title",
          { disc: discName(t, current.discKey, current.disciplineLabel) },
        )}
        subtitle={
          current.method
            ? t("championship.projection.subtitle", {
                n: current.qualified,
                ranked: current.athletes.length,
              })
            : t(
                current.fieldSource === "entries"
                  ? "ultimate.projection.subtitleEntered"
                  : "ultimate.projection.subtitle",
                { n: current.athletes.length, places: current.places ?? current.qualified },
              )
        }
        className="mt-4"
      >
        {/* Why this event was called the way it was, and above the table: the
            reader has to know whether the last column is a chance or a score
            before reading down it. */}
        {current.methodEvidence?.reason === "tooFew" && (
          <p className="mb-3 max-w-3xl text-[12.5px] leading-snug text-foreground">
            {t("championship.projection.whyTooFew", {
              n: current.scored,
              needed: current.methodEvidence.needed ?? 3,
            })}
          </p>
        )}
        {/* Above the table, not below it. A reader who meets this after
            counting down the podium has already drawn the wrong conclusion. */}
        {promoted.length > 0 && (
          <p className="mb-3 max-w-3xl border-l-2 border-gold/50 pl-3 text-[11.5px] leading-snug text-muted-foreground">
            {t("ultimate.projection.promoted", {
              names: promoted.map((a) => a.name).join(", "),
            })}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <caption className="sr-only">
              {t(
                current.method === "model"
                  ? "championship.projection.captionModel"
                  : current.method === "points"
                    ? "championship.projection.captionPoints"
                    : "ultimate.projection.caption",
                { disc: discName(t, current.discKey, current.disciplineLabel) },
              )}
            </caption>
            <thead>
              <tr className="label-caps text-muted-foreground">
                <th scope="col" className="w-12 pb-3 text-left font-semibold">
                  #
                </th>
                <th scope="col" className="pb-3 pl-3 text-left font-semibold">
                  {t("table.colAthlete")}
                </th>
                <th scope="col" className="w-16 pb-3 pl-4 text-left font-semibold">
                  {t("table.colNat")}
                </th>
                <th scope="col" className="w-44 pb-3 pl-4 text-left font-semibold">
                  <span className="inline-flex items-center gap-1">
                    {t(middle.label)}
                    <InfoTip label={t("figure.about", { label: t(middle.label) })}>
                      {t(middle.hint)}
                    </InfoTip>
                  </span>
                </th>
                <th scope="col" className="w-40 pb-3 pl-6 text-right font-semibold">
                  <span className="inline-flex items-center justify-end gap-1">
                    {t(last.label)}
                    <InfoTip label={t("figure.about", { label: t(last.label) })}>
                      {t(last.hint)}
                    </InfoTip>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clear.map((a, i) => (
                <ProjectionRow
                  key={a.name}
                  a={a}
                  i={i}
                  place={i + 1}
                  discKey={current.discKey}
                  t={t}
                  method={current.method}
                />
              ))}
            </tbody>
            {flagged.length > 0 && (
              <tbody className="divide-y divide-border">
                <tr>
                  <th scope="colgroup" colSpan={5} className="pt-5 pb-2 text-left">
                    <span className="label-caps inline-flex items-center gap-1 text-muted-foreground">
                      {t("ultimate.projection.flaggedTitle")}
                      <InfoTip
                        label={t("figure.about", {
                          label: t("ultimate.projection.flaggedTitle"),
                        })}
                      >
                        {t("ultimate.projection.flaggedHint")}
                      </InfoTip>
                    </span>
                  </th>
                </tr>
                {flagged.map((a, i) => (
                  <ProjectionRow
                    key={a.name}
                    a={a}
                    i={i}
                    place={a.rank}
                    discKey={current.discKey}
                    t={t}
                    method={current.method}
                    dimmed
                  />
                ))}
              </tbody>
            )}
            {/* Entered and not ranked, as rows rather than a sentence of names:
                a reader looking for one athlete scans the table, and each row
                says why that athlete has no place in the order above. */}
            {unranked.length > 0 && (
              <tbody className="divide-y divide-border">
                <tr>
                  <th scope="colgroup" colSpan={5} className="pt-5 pb-2 text-left">
                    <span className="label-caps inline-flex items-center gap-1 text-muted-foreground">
                      {t("championship.projection.unrankedTitle", { n: unranked.length })}
                      <InfoTip
                        label={t("figure.about", {
                          label: t("championship.projection.unrankedTitle", { n: unranked.length }),
                        })}
                      >
                        {t("championship.projection.unrankedHint")}
                      </InfoTip>
                    </span>
                  </th>
                </tr>
                {unranked.map((u, i) => (
                  <tr
                    key={`${u.name}-${i}`}
                    className="stagger-item"
                    style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
                  >
                    <td className="nums py-2.5 pr-2 text-[13px] font-semibold text-muted-foreground">
                      —
                    </td>
                    <td className="py-2.5 pl-3 text-[13px] font-medium text-foreground">
                      {u.profileUrl ? (
                        <a
                          href={u.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-terracotta-strong hover:underline"
                        >
                          {displayName(u.name)}
                        </a>
                      ) : (
                        <span>{displayName(u.name)}</span>
                      )}
                    </td>
                    <td className="py-2.5 pl-4">
                      <NatFlag nat={u.nat ?? "—"} />
                    </td>
                    <td colSpan={2} className="py-2.5 pl-4 text-[12px] text-muted-foreground">
                      {t(`championship.projection.unranked.${u.reason}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        {/* Named, not counted. A qualified athlete the model could not score is
            a hole in the projection, and the one thing a reader must not have
            to guess at is whether their favourite is missing. */}
        {/* Qualified and not entered. Below the table, not above: unlike the
            promoted-podium note this does not change how the numbers above
            should be read, it answers "where did they go". */}
        {(current.notEntered?.length ?? 0) > 0 && (
          <p className="mt-3 max-w-3xl text-[11.5px] leading-snug text-muted-foreground">
            {t("ultimate.projection.notEntered", {
              names: (current.notEntered ?? []).join(", "),
            })}
          </p>
        )}
        {/* The Ultimate's call predates the rows above and still names its
            unscored athletes in a sentence. */}
        {current.unscored.length > 0 && !current.unranked && (
          <p className="mt-3 max-w-3xl text-[11.5px] leading-snug text-muted-foreground">
            {t(
              current.method ? "championship.projection.unscored" : "ultimate.projection.unscored",
              { names: current.unscored.map(displayName).join(", ") },
            )}
          </p>
        )}
        <p className="mt-2 max-w-3xl text-[11.5px] leading-snug text-muted-foreground">
          {t(
            current.method === "model"
              ? "championship.projection.noteModel"
              : current.method === "points"
                ? "championship.projection.notePoints"
                : "ultimate.projection.note",
          )}
        </p>
      </Panel>
    </>
  );
}

/** One athlete, in either group.
 *
 * Shared so the flagged group cannot drift into a table that merely resembles
 * the one above it. `dimmed` is the only difference: same columns, same number,
 * quieter. The rank badge and the gold wash follow the athlete's OWN rank, not
 * their position in the list, so moving an injured athlete down does not
 * promote whoever was behind them into a podium colour they did not earn. */
function ProjectionRow({
  a,
  i,
  place,
  discKey,
  t,
  method,
  dimmed = false,
}: {
  a: UltimateProjection["athletes"][number];
  i: number;
  /** How the event was called; absent on the Ultimate. */
  method?: CallMethod | undefined;
  /** The number in the # column. In the main list it is the athlete's position
   * among those expected to start, counted 1..N so the list has no holes in
   * it -- moving a flagged athlete down used to leave the 100m reading 2, 3, 4.
   * In the flagged group it is `a.rank`, the position the MODEL gave them,
   * which is the interesting fact about a flagged favourite and would be lost
   * if this were a position in that short list instead. */
  place: number;
  discKey: string;
  t: (k: string, v?: Record<string, string | number>) => string;
  dimmed?: boolean;
}) {
  return (
    <tr
      className={`stagger-item transition-colors hover:bg-secondary/40 ${
        dimmed ? "opacity-70" : place <= 3 ? "bg-gold/[0.06]" : ""
      }`}
      style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
    >
      <td className="py-3 pr-2">
        {!dimmed && place <= 3 ? (
          <RankBadge rank={place} />
        ) : (
          <span className="nums text-[13px] font-semibold text-muted-foreground">{place}</span>
        )}
      </td>
      <td className="py-3 pl-3 text-[13.5px] font-medium text-foreground">
        {a.hasPage === false ? (
          // On no world toplist, so the site has no page for them. Link to
          // World Athletics when their profile is known and to nothing when it
          // is not, rather than to a page that cannot load.
          a.profileUrl ? (
            <a
              href={a.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-terracotta-strong hover:underline"
            >
              {displayName(a.name)}
            </a>
          ) : (
            <span>{displayName(a.name)}</span>
          )
        ) : (
          <Link
            to="/athlete/$discKey/$name"
            params={{ discKey, name: a.name }}
            className="transition-colors hover:text-terracotta-strong hover:underline"
          >
            {displayName(a.name)}
          </Link>
        )}
        {a.injuryWatch && (
          <WatchBadge
            reason={a.injuryReason ?? null}
            url={a.injuryUrl ?? null}
            status={a.injuryStatus === "remove" ? "remove" : "watch"}
            className="ml-2"
          />
        )}
        {/* Qualified here AND somewhere else. Worth saying on the row rather
            than in a footnote, because the reader's question is about this
            athlete: a clash means they cannot run both, and this list does not
            know which one they will pick. */}
        {a.alsoQualifiedIn?.length ? (
          <span
            className={`ml-2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10.5px] font-medium ${
              a.alsoQualifiedIn.some((o) => o.clashes)
                ? "bg-gold/20 text-[var(--gold-on-canvas)]"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {t(
              a.alsoQualifiedIn.some((o) => o.clashes)
                ? "ultimate.projection.alsoClash"
                : "ultimate.projection.alsoQualified",
              { events: a.alsoQualifiedIn.map((o) => o.label).join(", ") },
            )}
          </span>
        ) : null}
      </td>
      <td className="py-3 pl-4">
        <NatFlag nat={a.nat ?? "—"} />
      </td>
      <td className={`py-3 pl-4 text-[12px] text-muted-foreground ${method ? "nums" : ""}`}>
        {method ? (a.mark ?? "—") : a.qualifiedBy}
        {/* A mark from last season: what an entrant with no mark this season is
            ranked on, and in the 5000m and 10,000m anyone whose last season was
            better. Tagged on the row, so the order never reads a 2025 mark as
            this year's. */}
        {method && a.markSeason ? (
          <span
            title={t("championship.projection.markSeason", { year: a.markSeason })}
            className="ml-1.5 rounded bg-secondary px-1 py-0.5 text-[10.5px] font-medium text-muted-foreground"
          >
            <span aria-hidden="true">{a.markSeason}</span>
            <span className="sr-only">
              {t("championship.projection.markSeason", { year: a.markSeason })}
            </span>
          </span>
        ) : null}
      </td>
      <td className="py-3 pl-6">
        {a.podiumChance === null ? (
          <span className="nums block text-right text-[12.5px] font-semibold text-foreground">
            {a.rankingScore ?? "—"}
          </span>
        ) : (
          <div className="flex items-center justify-end gap-2.5">
            <ProbabilityBar value={a.podiumChance / 100} trackHeight="h-1.5" />
            <span className="nums w-12 text-right text-[12.5px] font-semibold text-foreground">
              {a.podiumChance}%
            </span>
          </div>
        )}
      </td>
    </tr>
  );
}
