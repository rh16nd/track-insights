import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import type { WorldRankings } from "@/lib/dl-data";
import { discName } from "@/lib/dl-data";
import { Panel } from "./shell";
import { NatFlag } from "./nat-flag";
import { InfoTip } from "./info-tip";
import { useT } from "@/lib/i18n";

type View = "model" | "points";

/** Track/Field top-20 per discipline, with a toggle between World Athletics
 * points (objective, by the marks run) and the model's rating. The two lists
 * have genuinely different membership and order, which is the point of the
 * toggle.
 *
 * The model's rating is a Diamond League form rating, not a verdict on who is
 * strongest — it was trained on DL Final podiums and every form feature comes
 * from the circuit, so someone who skipped it rates near zero however fast
 * they have run (Josh Hoey: best 800m score in the world, 1.5%).
 *
 * The meets column carries the other half of that: how many times we can
 * actually SEE the athlete contest this discipline. It used to count Diamond
 * League meetings only, which reads as "did not run" when it means "did not
 * run a Diamond League one" — the men's 400mH was a DL event at 5 of the 14
 * meetings in 2026, and 28% of the athletes here read 0. Counting every
 * source instead puts Rai Benjamin at 1 rather than 0, which is the number
 * that explains why third place rests on a single afternoon. */
export function WorldRankingTable({
  rankings,
  isField,
  activeId,
  onActiveChange,
}: {
  rankings: WorldRankings;
  isField: boolean;
  activeId: string;
  onActiveChange: (id: string) => void;
}) {
  const { t } = useT();
  // Points first, not the model. The page promises "the world's best", and
  // points is the ordering that actually answers that — it ranks the marks.
  // The model answers a narrower question (who would podium at a Diamond
  // League Final) and is one tap away, labelled as what it is.
  const [view, setView] = useState<View>("points");

  const keys = useMemo(
    () =>
      Object.keys(rankings)
        .filter((k) => rankings[k]!.isField === isField)
        .sort((a, b) => discName(t, a, a).localeCompare(discName(t, b, b))),
    [rankings, isField, t],
  );

  const currentId = keys.includes(activeId) ? activeId : (keys[0] ?? "");
  const current = rankings[currentId];
  // Memoised so the empty-case `[]` literal is not a new array every render,
  // which would make maxRating recompute (and its dep change) on each pass.
  const rows = useMemo(() => (current ? current[view] : []), [current, view]);
  const maxRating = useMemo(() => Math.max(1, ...rows.map((r) => r.ratingPct)), [rows]);

  if (!current) return null;

  const label = discName(t, currentId, currentId);

  return (
    <>
      {/* Discipline picker — a real select on mobile, pills on desktop, same
          pattern the projected-field table uses. */}
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

      <Panel
        title={t("rankings.panelTitle", { label })}
        subtitle={t(view === "model" ? "rankings.subtitle.model" : "rankings.subtitle.points")}
        className="mt-4"
        action={
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
                {t(v === "model" ? "rankings.toggle.model" : "rankings.toggle.points")}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <caption className="sr-only">{t("rankings.caption", { label })}</caption>
            <thead>
              <tr className="label-caps text-muted-foreground">
                <th scope="col" className="w-10 pb-3 text-left font-semibold">
                  #
                </th>
                <th scope="col" className="pb-3 pl-3 text-left font-semibold">
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
                  className={`w-24 pb-3 pl-6 text-right font-semibold ${view === "points" ? "text-foreground" : ""}`}
                >
                  <span className="inline-flex items-center gap-1 justify-end">
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
                <th
                  scope="col"
                  className={`w-40 pb-3 pl-6 text-right font-semibold ${view === "model" ? "text-foreground" : ""}`}
                >
                  <span className="inline-flex items-center gap-1 justify-end">
                    {t("rankings.colRating")}
                    <InfoTip label={t("figure.about", { label: t("rankings.colRating") })}>
                      {t("rankings.ratingHint")}
                    </InfoTip>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r, i) => (
                <tr
                  key={r.name}
                  className="stagger-item transition-colors hover:bg-secondary/40"
                  style={{ "--stagger-i": i } as CSSProperties}
                >
                  <td className="nums py-3 pr-2 text-[13px] font-semibold text-muted-foreground">
                    {r.rank}
                  </td>
                  <td className="py-3 pl-3 text-[13.5px] font-medium text-foreground">
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
                    className={`nums py-3 pl-6 text-right text-[13px] ${view === "points" ? "font-semibold text-foreground" : "text-muted-foreground"}`}
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
                  <td className="py-3 pl-6">
                    <div className="flex items-center justify-end gap-2.5">
                      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${Math.round((r.ratingPct / maxRating) * 100)}%`,
                            backgroundImage:
                              "linear-gradient(90deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
                          }}
                        />
                      </span>
                      <span
                        className={`nums w-10 text-right text-[12.5px] ${view === "model" ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                      >
                        {r.ratingPct}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
