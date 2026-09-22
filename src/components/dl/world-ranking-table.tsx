import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import type { WorldRankings } from "@/lib/dl-data";
import { chanceLabel, compareEvents, discName } from "@/lib/dl-data";
import { BareFrame } from "./bare-frame";
import { TableScroll, pinned } from "./table-scroll";
import { NatFlag } from "./nat-flag";
import { InfoTip } from "./info-tip";
import { useT } from "@/lib/i18n";

type View = "model" | "points";

/** Track/Field top-20 per discipline, with a toggle between World Athletics
 * points (objective, by the marks run) and the model rating. Both lists hold
 * the same 20 athletes, each with the same rating; the toggle changes the
 * order, which is where the marks and the model disagree.
 *
 * The rating is the championship model's for every event since 2026-09-17:
 * its chance of a top three if these 20 met in one final. It is labelled a
 * rating, never a podium chance, which the user wants named only for a real
 * competition. Until then the 32 Diamond League events showed the Diamond
 * League model's rating, which followed meetings raced more than marks (Josh
 * Hoey, the best 800m score in the world, read 1.5%).
 *
 * The meets column counts every race we can see this athlete run in the event,
 * from every source, so a rating built on a single outing reads as one. */
export function WorldRankingTable({
  rankings,
  isField,
  activeId,
  onActiveChange,
  onlyId,
}: {
  rankings: WorldRankings;
  isField: boolean;
  activeId: string;
  onActiveChange: (id: string) => void;
  /** One event only, with no picker: an event page's own top 20 (the user,
   * 2026-09-21: "all 20 athletes listed"). */
  onlyId?: string | undefined;
}) {
  const { t, lang } = useT();
  // This table sits bare on the page, so its pinned columns carry the page's
  // own ground. `left-10` is the rank column's width.
  const pin = pinned("group-data-[slid=true]:bg-page-ground");
  const pinName = pinned("group-data-[slid=true]:bg-page-ground", "left-10", true);
  // Points first, not the model. The page promises "the world's best", and
  // points is the ordering that actually answers that — it ranks the marks.
  // The model rating weighs the whole season and is one tap away, labelled
  // as what it is.
  const [view, setView] = useState<View>("points");

  const keys = useMemo(
    () =>
      Object.keys(rankings)
        .filter((k) => rankings[k]!.isField === isField)
        .sort((a, b) => compareEvents(a, b, discName(t, a, a), discName(t, b, b))),
    [rankings, isField, t],
  );

  const currentId = onlyId ?? (keys.includes(activeId) ? activeId : (keys[0] ?? ""));
  const current = rankings[currentId];
  // An event with no model view shows points with no toggle and no model
  // column, whichever view the reader last picked on another discipline.
  const modelAvailable = current?.modelAvailable !== false;
  const shown: View = modelAvailable ? view : "points";
  // Memoised so the empty-case `[]` literal is not a new array every render,
  // which would make maxRating recompute (and its dep change) on each pass.
  const rows = useMemo(() => (current ? current[shown] : []), [current, shown]);
  const maxRating = useMemo(() => Math.max(1, ...rows.map((r) => r.ratingPct ?? 0)), [rows]);

  if (!current) return null;

  const label = discName(t, currentId, currentId);
  const ratingLabel = t("rankings.colRating");

  return (
    <>
      {/* Discipline picker — a real select on mobile, pills on desktop, same
          pattern the projected-field table uses. None on an event's own page. */}
      {!onlyId && (
        <>
          <div className="sm:hidden">
            <label className="label-caps mb-1.5 block text-white/90" htmlFor="rk-discipline">
              {t("rankings.discipline")}
            </label>
            <select
              id="rk-discipline"
              value={currentId}
              onChange={(e) => onActiveChange(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-3 text-[13.5px] font-medium text-foreground"
            >
              {keys.map((k) => (
                <option key={k} value={k}>
                  {discName(t, k, k)}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden flex-wrap gap-2 sm:flex">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onActiveChange(k)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                  k === currentId
                    ? "border-transparent text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
                }`}
                style={
                  k === currentId
                    ? {
                        backgroundImage:
                          "linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
                      }
                    : undefined
                }
              >
                {discName(t, k, k)}
              </button>
            ))}
          </div>
        </>
      )}

      {/* No box around the table, like the Asian Games page's full field (the
          user, 2026-09-21: "don't put them in a box"). */}
      <BareFrame
        level={2}
        title={t("rankings.panelTitle", { label })}
        subtitle={t(
          !modelAvailable
            ? "rankings.subtitle.pointsOnly"
            : shown === "model"
              ? "rankings.subtitle.model"
              : "rankings.subtitle.points",
        )}
        className={onlyId ? "" : "mt-8"}
        action={
          modelAvailable ? (
            <div
              role="tablist"
              aria-label={t("rankings.toggle.label")}
              className="inline-flex rounded-full border border-border bg-card p-0.5"
            >
              {(["model", "points"] as View[]).map((v) => (
                <button
                  key={v}
                  role="tab"
                  aria-selected={view === v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                    view === v
                      ? "bg-terracotta text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(v === "points" ? "rankings.toggle.points" : "rankings.toggle.model")}
                </button>
              ))}
            </div>
          ) : undefined
        }
      >
        {/* Every column on a phone too, reached by sliding the table. */}
        <TableScroll label={t("rankings.caption", { label })} ground="page">
          <table className="w-full min-w-[720px]">
            <caption className="sr-only">{t("rankings.caption", { label })}</caption>
            <thead>
              <tr className="label-caps text-muted-foreground">
                {/* The place and the name stay put while the rest slides, so
                    a rating at the far end still belongs to somebody. */}
                <th scope="col" className={`w-10 pb-3 text-left font-semibold ${pin}`}>
                  #
                </th>
                <th
                  scope="col"
                  className={`w-32 pb-3 pl-3 text-left font-semibold ${pinName} sm:w-auto`}
                >
                  {t("table.colAthlete")}
                </th>
                <th scope="col" className="w-16 pb-3 pl-4 text-left font-semibold">
                  {t("table.colNat")}
                </th>
                <th scope="col" className="w-24 pb-3 pl-4 text-right font-semibold">
                  {t("rankings.colMark")}
                </th>
                <th
                  scope="col"
                  className={`w-24 pb-3 pl-6 text-right font-semibold ${shown === "points" ? "text-foreground" : ""}`}
                >
                  <span className="inline-flex items-center justify-end gap-1">
                    {t("rankings.colPoints")}
                    <InfoTip label={t("figure.about", { label: t("rankings.colPoints") })}>
                      {t("rankings.pointsHint")}
                    </InfoTip>
                  </span>
                </th>
                <th scope="col" className="w-24 pb-3 pl-6 text-right font-semibold">
                  <span className="inline-flex items-center justify-end gap-1">
                    {t("rankings.colMeets")}
                    <InfoTip label={t("figure.about", { label: t("rankings.colMeets") })}>
                      {t("rankings.meetsHint")}
                    </InfoTip>
                  </span>
                </th>
                {modelAvailable && (
                  <th
                    scope="col"
                    className={`w-40 pr-1.5 pb-3 pl-6 text-right font-semibold ${shown === "model" ? "text-foreground" : ""}`}
                  >
                    <span className="inline-flex items-center justify-end gap-1">
                      {ratingLabel}
                      <InfoTip label={t("figure.about", { label: ratingLabel })}>
                        {t("rankings.ratingHint")}
                      </InfoTip>
                    </span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r, i) => (
                <tr
                  key={r.name}
                  className="stagger-item transition-colors hover:bg-secondary/40"
                  style={{ "--stagger-i": i } as CSSProperties}
                >
                  <td
                    className={`nums py-3 pr-2 text-[13px] font-semibold text-muted-foreground ${pin}`}
                  >
                    {r.rank}
                  </td>
                  <td className={`py-3 pl-3 text-[13.5px] font-medium text-foreground ${pinName}`}>
                    {r.profileUrl ? (
                      <Link
                        to="/athlete/$discKey/$name"
                        params={{ discKey: currentId, name: r.name }}
                        className="transition-colors hover:text-terracotta-strong hover:underline"
                      >
                        {r.name}
                      </Link>
                    ) : (
                      r.name
                    )}
                  </td>
                  <td className="py-3 pl-4">
                    <NatFlag nat={r.nat ?? "—"} />
                  </td>
                  <td className="nums py-3 pl-4 text-right text-[13.5px] font-medium text-foreground">
                    {r.mark ?? "—"}
                  </td>
                  <td
                    className={`nums py-3 pl-6 text-right text-[13px] ${shown === "points" ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                  >
                    {r.score ?? "—"}
                  </td>
                  {/* A thin record is the thing worth seeing here, so one or
                      two meets is set in the foreground weight while a normal
                      season stays muted. Weight rather than colour on
                      purpose: no new token to contrast-check, and it reads
                      the same to anyone who cannot separate the two hues. */}
                  <td
                    className={`nums py-3 pl-6 text-right text-[13px] ${
                      (r.racesOnRecord ?? 9) <= 2
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {r.racesOnRecord ?? "—"}
                  </td>
                  {modelAvailable && (
                    <td className="py-3 pl-6">
                      <div className="flex items-center justify-end gap-2.5">
                        <span className="block h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                          <span
                            className="block h-full rounded-full"
                            style={{
                              width: `${Math.round(((r.ratingPct ?? 0) / maxRating) * 100)}%`,
                              backgroundImage:
                                "linear-gradient(90deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
                            }}
                          />
                        </span>
                        <span
                          className={`nums w-10 text-right text-[12.5px] ${shown === "model" ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                        >
                          {/* >99% or <1% at the ends, the user's rule for the
                              model's percentages. */}
                          {r.ratingPct == null ? "—" : `${chanceLabel(lang, r.ratingPct)}%`}
                        </span>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      </BareFrame>
    </>
  );
}
