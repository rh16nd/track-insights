import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import type { Discipline, ResultRow } from "@/lib/dl-data";
import { Panel } from "./shell";
import { useT } from "@/lib/i18n";
import { chanceLabel, discName, ordinalIn } from "@/lib/dl-data";
import { NatFlag } from "./nat-flag";

/* The result of a Final read against the model's FROZEN pre-final call.
 *
 * Moved out of discipline-table.tsx unchanged. That module has been dead since
 * the Ultimate pivot rewrote Track and Field -- DisciplineTable is exported and
 * imported nowhere -- so this view existed and had no route to it. The Results
 * page is that route. Kept as its own module so the next page reframe cannot
 * take it down with whatever it replaces. */

/** A small up/down triangle, reusing the sort arrow's glyph, for how far a
 * finisher landed from where the model projected them. */
function DeltaArrow({ up }: { up: boolean }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden className={`size-[9px] ${up ? "" : "rotate-180"}`}>
      <path d="M5 1.5 8.5 7h-7L5 1.5Z" fill="currentColor" />
    </svg>
  );
}

/** The finishing-position badge. Podium places (1-3) carry the gold-tipped
 * fill the site uses for a strong signal; the rest sit in the plain chip; a
 * DNF/DQ (no place) shows the same dashed placeholder as an unranked athlete. */
function FinishBadge({ row }: { row: ResultRow }) {
  if (row.place === null) {
    return (
      <span
        aria-hidden
        className="flex size-6 items-center justify-center rounded-full border border-dashed border-border text-[11px] text-muted-foreground"
      >
        –
      </span>
    );
  }
  const podium = row.place <= 3;
  return (
    <span
      className={`nums flex size-6 items-center justify-center rounded-full text-[12px] font-semibold ${
        podium ? "text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground"
      }`}
      style={
        podium
          ? {
              backgroundImage:
                "linear-gradient(135deg, var(--terracotta) 0%, var(--gold-strong) 100%)",
            }
          : undefined
      }
    >
      {row.place}
    </span>
  );
}

/** What the model said about this finisher before the meet: a projected place
 * and podium chance, or that it had them outside the field, or not at all. */
function ModelCall({ row }: { row: ResultRow }) {
  const { t, lang } = useT();
  if (row.modelState === "field" && row.predictedRank !== null) {
    return (
      <span className="text-foreground">
        {/* No chance for an event ranked on points: it stated an order, and
            printing 0% beside every athlete would invent one. */}
        {row.predictedProb === null
          ? t("table.resultRanked", { rank: ordinalIn(lang, row.predictedRank) })
          : t("table.resultPredicted", {
              rank: ordinalIn(lang, row.predictedRank),
              prob: chanceLabel(lang, row.predictedProb),
            })}
      </span>
    );
  }
  const key = row.modelState === "nearMiss" ? "table.resultNearMiss" : "table.resultUnseen";
  return <span className="text-muted-foreground">{t(key)}</span>;
}

/** The one-glance verdict: did the model call this place, and if not, which
 * way and by how much. An "as projected" hit reads in the accent colour; a
 * miss shows the signed gap; a podium reached from outside the field is the
 * headline upset. */
function VerdictCell({ row }: { row: ResultRow }) {
  const { t } = useT();
  if (row.status !== "finished") return <span className="text-muted-foreground">—</span>;

  if (row.modelState === "field" && row.delta !== null) {
    if (row.delta === 0) {
      return <span className="font-medium text-terracotta-strong">{t("table.resultExact")}</span>;
    }
    const up = row.delta > 0;
    const n = Math.abs(row.delta);
    const titleKey =
      n === 1
        ? up
          ? "table.resultAboveOne"
          : "table.resultBelowOne"
        : up
          ? "table.resultAboveTitle"
          : "table.resultBelowTitle";
    return (
      <span
        title={t(titleKey, { n })}
        className={`nums inline-flex items-center gap-1 ${up ? "text-gold-strong" : "text-muted-foreground"}`}
      >
        <DeltaArrow up={up} />
        {n}
      </span>
    );
  }

  if (row.modelState === "nearMiss" && row.place !== null && row.place <= 3) {
    return <span className="font-medium text-terracotta-strong">{t("table.resultUpset")}</span>;
  }
  return <span className="text-muted-foreground">—</span>;
}

/** Shown in place of the projected table once a discipline's Final has been
 * contested: the actual finishing order, each finisher read against the
 * model's frozen pre-final projection so the difference is the point. */
export function ResultComparison({ current }: { current: Discipline }) {
  const { t } = useT();
  const result = current.result!;
  const label = discName(t, current.id, current.label);
  return (
    <Panel
      title={t("table.resultTitle", { label })}
      subtitle={t("table.resultSummary", { hits: result.podiumHits, n: result.podiumSize })}
      className="mt-4"
    >
      <p className="mb-3 max-w-2xl text-[12px] leading-snug text-muted-foreground">
        {t("table.resultNote")}
      </p>
      {/* On a phone the table fits the card: the finish, the athlete (with
          nation and result under the name) and the model's call, with how far
          off it was under the call. */}
      <div className="relative overflow-x-auto">
        <table className="w-full sm:min-w-[680px]">
          <caption className="sr-only">{t("table.resultCaption", { label })}</caption>
          <thead>
            <tr className="label-caps text-muted-foreground">
              <th scope="col" className="w-9 pb-3 text-left font-semibold sm:w-12">
                {t("table.colFinish")}
              </th>
              <th scope="col" className="pb-3 pl-3 text-left font-semibold">
                {t("table.colAthlete")}
              </th>
              <th
                scope="col"
                className="hidden w-16 pb-3 pl-4 text-left font-semibold sm:table-cell"
              >
                {t("table.colNat")}
              </th>
              <th
                scope="col"
                className="hidden w-24 pb-3 pl-4 text-right font-semibold sm:table-cell"
              >
                {t("table.colResult")}
              </th>
              <th scope="col" className="pb-3 pl-3 text-left font-semibold sm:w-44 sm:pl-6">
                {t("table.colModelCall")}
              </th>
              <th
                scope="col"
                className="hidden w-28 pb-3 pl-6 text-left font-semibold sm:table-cell"
              >
                {t("table.colVsProjected")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {result.rows.map((r, i) => (
              <tr
                key={`${r.name}-${i}`}
                className="stagger-item transition-colors hover:bg-secondary/40"
                style={{ "--stagger-i": i } as CSSProperties}
              >
                <td className="py-3 pr-2">
                  <FinishBadge row={r} />
                </td>
                <td className="py-3 pl-3 text-[13.5px] font-medium text-foreground">
                  {r.hasPage ? (
                    <Link
                      to="/athlete/$discKey/$name"
                      params={{ discKey: current.id, name: r.name }}
                      className="transition-colors hover:text-terracotta-strong hover:underline"
                    >
                      {r.name}
                    </Link>
                  ) : (
                    <a
                      href={r.waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-terracotta-strong hover:underline"
                    >
                      {r.name}
                    </a>
                  )}
                  <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-normal text-muted-foreground sm:hidden">
                    <NatFlag nat={r.nat} />
                    {r.status === "finished" ? (
                      <span className="nums text-foreground">{r.mark}</span>
                    ) : (
                      <span className="label-caps">{r.placeLabel}</span>
                    )}
                  </span>
                </td>
                <td className="hidden py-3 pl-4 sm:table-cell">
                  <NatFlag nat={r.nat} />
                </td>
                <td className="nums hidden py-3 pl-4 text-right text-[13.5px] font-medium text-foreground sm:table-cell">
                  {r.status === "finished" ? (
                    r.mark
                  ) : (
                    <span className="label-caps text-muted-foreground">{r.placeLabel}</span>
                  )}
                </td>
                <td className="py-3 pl-3 text-[12.5px] sm:pl-6">
                  <ModelCall row={r} />
                  <span className="mt-1 block sm:hidden">
                    <VerdictCell row={r} />
                  </span>
                </td>
                <td className="hidden py-3 pl-6 text-[12.5px] sm:table-cell">
                  <VerdictCell row={r} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
