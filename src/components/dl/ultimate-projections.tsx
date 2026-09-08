import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Panel, ProbabilityBar, RankBadge, WatchBadge } from "./shell";
import { NatFlag } from "./nat-flag";
import { InfoTip } from "./info-tip";
import { discName } from "@/lib/dl-data";
import type { UltimateProjection } from "@/lib/dl-data";

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

  // Flagged athletes drop to their own group at the foot of the discipline
  // rather than out of the table. Two reasons they are not removed: this field
  // is World Athletics' published qualification list, which the page says in as
  // many words, and an injury match can be wrong -- the check reads headlines,
  // and it has been wrong before (HANDOFF: the Cole Hocker false positive). A
  // reader gets the athlete, the model's number, and the headline behind the
  // flag, and decides.
  const clear = current.athletes.filter((a) => !a.injuryWatch);
  const flagged = current.athletes.filter((a) => a.injuryWatch);

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
          </button>
        ))}
      </div>

      <Panel
        title={t("ultimate.projection.title", {
          disc: discName(t, current.discKey, current.disciplineLabel),
        })}
        subtitle={t("ultimate.projection.subtitle", {
          n: current.qualified,
          places: current.places ?? current.qualified,
        })}
        className="mt-4"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <caption className="sr-only">
              {t("ultimate.projection.caption", {
                disc: discName(t, current.discKey, current.disciplineLabel),
              })}
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
                    {t("ultimate.projection.colRoute")}
                    <InfoTip
                      label={t("figure.about", { label: t("ultimate.projection.colRoute") })}
                    >
                      {t("ultimate.projection.routeHint")}
                    </InfoTip>
                  </span>
                </th>
                <th scope="col" className="w-40 pb-3 pl-6 text-right font-semibold">
                  <span className="inline-flex items-center justify-end gap-1">
                    {t("ultimate.projection.colChance")}
                    <InfoTip
                      label={t("figure.about", { label: t("ultimate.projection.colChance") })}
                    >
                      {t("ultimate.projection.chanceHint")}
                    </InfoTip>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clear.map((a, i) => (
                <ProjectionRow key={a.name} a={a} i={i} discKey={current.discKey} />
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
                  <ProjectionRow key={a.name} a={a} i={i} discKey={current.discKey} dimmed />
                ))}
              </tbody>
            )}
          </table>
        </div>
        {/* Named, not counted. A qualified athlete the model could not score is
            a hole in the projection, and the one thing a reader must not have
            to guess at is whether their favourite is missing. */}
        {current.unscored.length > 0 && (
          <p className="mt-3 max-w-3xl text-[11.5px] leading-snug text-muted-foreground">
            {t("ultimate.projection.unscored", { names: current.unscored.join(", ") })}
          </p>
        )}
        <p className="mt-2 max-w-3xl text-[11.5px] leading-snug text-muted-foreground">
          {t("ultimate.projection.note")}
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
  discKey,
  dimmed = false,
}: {
  a: UltimateProjection["athletes"][number];
  i: number;
  discKey: string;
  dimmed?: boolean;
}) {
  return (
    <tr
      className={`stagger-item transition-colors hover:bg-secondary/40 ${
        dimmed ? "opacity-70" : a.rank <= 3 ? "bg-gold/[0.06]" : ""
      }`}
      style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
    >
      <td className="py-3 pr-2">
        {!dimmed && a.rank <= 3 ? (
          <RankBadge rank={a.rank} />
        ) : (
          <span className="nums text-[13px] font-semibold text-muted-foreground">{a.rank}</span>
        )}
      </td>
      <td className="py-3 pl-3 text-[13.5px] font-medium text-foreground">
        <Link
          to="/athlete/$discKey/$name"
          params={{ discKey, name: a.name }}
          className="transition-colors hover:text-terracotta-strong hover:underline"
        >
          {a.name}
        </Link>
        {a.injuryWatch && (
          <WatchBadge
            reason={a.injuryReason ?? null}
            url={a.injuryUrl ?? null}
            status={a.injuryStatus === "remove" ? "remove" : "watch"}
            className="ml-2"
          />
        )}
      </td>
      <td className="py-3 pl-4">
        <NatFlag nat={a.nat ?? "—"} />
      </td>
      <td className="py-3 pl-4 text-[12px] text-muted-foreground">{a.qualifiedBy}</td>
      <td className="py-3 pl-6">
        <div className="flex items-center justify-end gap-2.5">
          <ProbabilityBar value={a.podiumChance / 100} trackHeight="h-1.5" />
          <span className="nums w-12 text-right text-[12.5px] font-semibold text-foreground">
            {a.podiumChance}%
          </span>
        </div>
      </td>
    </tr>
  );
}
