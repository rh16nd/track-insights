import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ProbabilityBar } from "@/components/dl/shell";
import { BareFrame } from "@/components/dl/bare-frame";
import { InfoTip } from "@/components/dl/info-tip";
import { TableScroll, pinned } from "@/components/dl/table-scroll";
import { ordinalIn, startNounKey, startVerbKey } from "@/lib/dl-data";
import { localizeDate, localizeMonth } from "@/lib/dates";
import { useT } from "@/lib/i18n";
import type { FieldAnalysis, FormResult, H2hCell } from "@/lib/dl-data";

/** The field against itself.
 *
 * A ranked list with probabilities beside it can only tell you the order the
 * model likes. It cannot tell you that the model's 36% pick in the Men's
 * 100m is 10-23 against the very people he will line up beside, and 0-3
 * against the man ranked below him. That is the question an analyst opens a
 * page like this to ask, and until the worldwide race log existed there was
 * no way to answer it.
 *
 * Deliberately a matrix rather than more cards. A grid of pairings is a
 * different KIND of object from a stat tile — it is read by scanning a row
 * against a column, not by glancing at a number — and that difference is
 * the point: this section should not feel like the rest of a dashboard. */
export function FieldAnalysisBlock({
  analysis,
  discKey,
  discLabel,
  isField,
}: {
  analysis: FieldAnalysis;
  discKey: string;
  discLabel: string;
  /** Decides the unit on the comparison table. Cannot be inferred from the
   * number: a 22.58m shot put and a 22.58s 200m are the same float. */
  isField: boolean;
}) {
  const { t, lang } = useT();
  const { matrix, comparison } = analysis;
  const byName = new Map(comparison.map((c) => [c.name, c]));
  // Each section only with something in it (the user, 2026-09-21): the grid
  // when at least one pair has met, the table for the athletes with a race on
  // record, and only when there are two of them to set side by side. The
  // 10,000m's grid met in none of its 45 pairings and drew a square of dashes.
  const raced = matrix.names.filter((name) => (byName.get(name)?.races ?? 0) > 0);
  if (matrix.pairsMet === 0 && raced.length < 2) return null;

  return (
    <>
      {matrix.pairsMet > 0 && (
        <BareFrame
          level={2}
          title={t("fa.pairingsTitle", { disc: discLabel })}
          subtitle={t("fa.pairingsSubtitle", {
            noun: t(startNounKey(isField)),
            met: matrix.pairsMet,
            possible: matrix.pairsPossible,
          })}
          className="mt-14 border-t border-border pt-12"
          action={
            <InfoTip label={t("fa.howToRead")}>
              {t("fa.howToReadBefore")}
              <b>3–1</b>
              {t("fa.howToReadAfter", { noun: t(startNounKey(isField)) })}
            </InfoTip>
          }
        >
          <TableScroll
            label={t("fa.gridCaption", { disc: discLabel, noun: t(startNounKey(isField)) })}
            ground="page"
          >
            <table className="border-collapse text-left">
              {/* A grid this shape is unreadable without a caption: every cell
                is a win-loss record whose meaning depends on which athlete
                owns the row and which owns the column. */}
              <caption className="sr-only">
                {t("fa.gridCaption", { disc: discLabel, noun: t(startNounKey(isField)) })}
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="label-caps sticky left-0 z-10 pb-2.5 pr-6 text-muted-foreground group-data-[slid=true]:bg-page-ground group-data-[slid=true]:shadow-[1px_0_0_0_var(--border)]"
                  >
                    {t("table.colAthlete")}
                  </th>
                  {matrix.names.map((n) => (
                    <th
                      key={n}
                      scope="col"
                      className="label-caps w-16 px-2 pb-2.5 text-center font-semibold text-muted-foreground"
                      title={n}
                    >
                      {surname(n)}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="label-caps w-28 pb-2 pl-4 text-right text-muted-foreground"
                  >
                    {t("fa.vsThisField")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {matrix.rows.map((row, i) => (
                  <tr
                    key={row.name}
                    className="stagger-item"
                    style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-10 whitespace-nowrap py-2.5 pr-6 text-left text-[13px] font-medium text-foreground group-data-[slid=true]:bg-page-ground group-data-[slid=true]:shadow-[1px_0_0_0_var(--border)]"
                    >
                      <Link
                        to="/athlete/$discKey/$name"
                        params={{ discKey, name: row.name }}
                        className="transition-colors hover:text-terracotta-strong hover:underline"
                      >
                        {row.name}
                      </Link>
                    </th>
                    {row.cells.map((cell, j) => (
                      <MatrixCell
                        key={matrix.names[j]}
                        cell={cell}
                        self={i === j}
                        a={row.name}
                        b={matrix.names[j] ?? ""}
                        isField={isField}
                      />
                    ))}
                    <td className="py-2 pl-6">
                      <FormStrip form={byName.get(row.name)?.recentForm ?? []} />
                    </td>
                    <td className="py-2 pl-4 text-right">
                      {row.winRate === null ? (
                        <span className="text-[11.5px] text-muted-foreground">never met</span>
                      ) : (
                        <span className="flex items-center justify-end gap-2">
                          <span className="hidden w-14 sm:block">
                            <ProbabilityBar value={row.winRate} trackHeight="h-1.5" />
                          </span>
                          <span className="nums text-[13px] font-semibold text-foreground">
                            {row.wins}–{row.losses}
                          </span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
          <p className="mt-3 max-w-3xl text-[11.5px] leading-relaxed text-muted-foreground">
            {t("fa.blankCellNote", { verb: t(startVerbKey(isField)) })}
          </p>
        </BareFrame>
      )}

      {raced.length >= 2 && (
        <BareFrame
          level={2}
          title={t("fa.separatesTitle")}
          subtitle={t("fa.separatesSubtitle")}
          className="mt-14 border-t border-border pt-12"
        >
          <TableScroll label={t("fa.separatesCaption", { disc: discLabel })} ground="page">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <caption className="sr-only">{t("fa.separatesCaption", { disc: discLabel })}</caption>
              <thead>
                <tr className="label-caps border-b border-border text-muted-foreground">
                  {/* The name stays put while the measures slide past it. */}
                  <th
                    scope="col"
                    className={`w-32 pb-2 pr-2 font-semibold sm:w-auto ${pinned("group-data-[slid=true]:bg-page-ground", "left-0", true)}`}
                  >
                    {t("table.colAthlete")}
                  </th>
                  <th scope="col" className="w-28 pb-2 pl-3 text-right font-semibold">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      {t("fa.colTop3")}
                      <InfoTip label={t("figure.about", { label: t("fa.colTop3") })}>
                        {t("fa.colTop3Hint")}
                      </InfoTip>
                    </span>
                  </th>
                  <th scope="col" className="w-28 pb-2 pl-3 text-right font-semibold">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      {t("fa.colSteadiness")}
                      <InfoTip label={t("figure.about", { label: t("fa.colSteadiness") })}>
                        {t("fa.colSteadinessHint")}
                      </InfoTip>
                    </span>
                  </th>
                  <th scope="col" className="w-28 pb-2 pl-3 text-right font-semibold">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      {t(isField ? "fa.colComps" : "fa.colRaces")}
                      <InfoTip
                        label={t("figure.about", {
                          label: t(isField ? "fa.colComps" : "fa.colRaces"),
                        })}
                      >
                        {t("fa.colStartsHint")}
                      </InfoTip>
                    </span>
                  </th>
                  <th scope="col" className="w-28 pb-2 pl-3 text-right font-semibold">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      {t("fa.colPodium")}
                      <InfoTip label={t("figure.about", { label: t("fa.colPodium") })}>
                        {t("fa.colPodiumHint")}
                      </InfoTip>
                    </span>
                  </th>
                  {/* pr-1.5 for the info button, whose -m-1.5 otherwise pokes
                      6px past the table and leaves it scrollable by that much
                      on a screen it already fits. */}
                  <th scope="col" className="w-28 pr-1.5 pb-2 pl-3 text-right font-semibold">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      {t("fa.colPeaked")}
                      <InfoTip label={t("figure.about", { label: t("fa.colPeaked") })}>
                        {t("fa.colPeakedHint")}
                      </InfoTip>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {raced.map((name, i) => {
                  const c = byName.get(name);
                  return (
                    <tr
                      key={name}
                      className="stagger-item transition-colors hover:bg-secondary/40"
                      style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
                    >
                      <td
                        className={`py-2.5 pr-2 text-[13px] font-medium text-foreground ${pinned("group-data-[slid=true]:bg-page-ground", "left-0", true)}`}
                      >
                        <Link
                          to="/athlete/$discKey/$name"
                          params={{ discKey, name }}
                          className="transition-colors hover:text-terracotta-strong hover:underline"
                        >
                          {name}
                        </Link>
                      </td>
                      <td className="nums py-2.5 pl-3 text-right text-[13px] font-semibold text-foreground">
                        {c?.top3Average != null ? formatMarkish(c.top3Average, isField) : "—"}
                      </td>
                      <td className="nums py-2.5 pl-3 text-right text-[13px] text-muted-foreground">
                        {c?.consistency != null ? `${c.consistency.toFixed(2)}%` : "—"}
                      </td>
                      <td className="nums py-2.5 pl-3 text-right text-[13px] text-muted-foreground">
                        {c?.seasonRaces ?? 0}
                        <span className="text-muted-foreground"> / {c?.races ?? 0}</span>
                      </td>
                      <td className="nums py-2.5 pl-3 text-right text-[13px] text-muted-foreground">
                        {c?.podiumRate != null ? `${c.podiumRate}%` : "—"}
                      </td>
                      <td className="py-2.5 pl-3 text-right text-[13px] text-muted-foreground">
                        {c?.bestMonth ? localizeMonth(lang, c.bestMonth) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroll>
        </BareFrame>
      )}
    </>
  );
}

/** Six finishes, oldest to newest, so the strip reads as a timeline and the
 * rightmost cell is the most recent race. Deliberately positions rather than
 * marks: a position is already a comparison, where a mark needs a field to
 * mean anything. Placed in the horizontal room the grid was leaving empty --
 * 556px of a 1281px panel at desktop width -- and it earns the space by
 * answering what the all-time grid beside it cannot, which is form right
 * now. In the men's 100m the model's top pick reads 2 2 3 1 4 9. */
function FormStrip({ form }: { form: FormResult[] }) {
  const { t, lang } = useT();
  if (form.length === 0) {
    return <span className="text-[11.5px] text-muted-foreground">{t("fa.noResults")}</span>;
  }
  return (
    <span className="flex items-center gap-1">
      {form.map((f, i) => {
        const newest = i === form.length - 1;
        const tone =
          f.place === 1
            ? "bg-[linear-gradient(135deg,var(--gold-light),var(--gold-strong))] text-foreground"
            : f.place <= 3
              ? "bg-terracotta/15 text-terracotta-strong"
              : "bg-secondary text-muted-foreground";
        return (
          <span
            key={`${f.date}-${i}`}
            title={`${ordinalIn(lang, f.place)}${f.meeting ? ` — ${f.meeting}` : ""}, ${localizeDate(lang, f.date)}`}
            className={`nums flex size-5 shrink-0 items-center justify-center rounded-[5px] text-[10.5px] font-semibold ${tone} ${
              newest ? "ring-1 ring-foreground/25" : ""
            }`}
          >
            {f.place}
          </span>
        );
      })}
    </span>
  );
}

/** Wins over losses, coloured by which way the pairing leans. The tone is
 * carried by the text rather than a filled cell: a grid of solid blocks
 * reads as a heatmap of intensity, and these are records, not magnitudes. */
function MatrixCell({
  cell,
  self,
  a,
  b,
  isField,
}: {
  cell: H2hCell;
  self: boolean;
  a: string;
  b: string;
  isField: boolean;
}) {
  const { t, lang } = useT();
  if (self) {
    return (
      <td aria-hidden className="px-2 py-2.5 text-center text-muted-foreground/30">
        ·
      </td>
    );
  }
  if (!cell) {
    return (
      <td className="px-2 py-2.5 text-center">
        <span className="sr-only">
          {t("fa.neverMet", { a, b, verb: t(startVerbKey(isField)) })}
        </span>
        <span aria-hidden className="text-[12px] text-muted-foreground/40">
          —
        </span>
      </td>
    );
  }
  const lead = cell.wins - cell.losses;
  const tone =
    lead > 0 ? "text-gold-strong" : lead < 0 ? "text-muted-foreground" : "text-foreground";
  const weight = Math.abs(lead) >= 3 ? "font-semibold" : "font-medium";
  return (
    <td className="py-2 text-center">
      <span
        title={
          t("fa.cellTitle", {
            a,
            wins: cell.wins,
            losses: cell.losses,
            b,
            n: cell.meetings,
            noun: t(startNounKey(isField, cell.meetings)),
          }) + (cell.lastMet ? t("fa.cellLastMet", { date: localizeDate(lang, cell.lastMet) }) : "")
        }
        className={`nums text-[12.5px] ${tone} ${weight}`}
      >
        {cell.wins}–{cell.losses}
      </span>
    </td>
  );
}

/** "Oblique SEVILLE" -> "SEVILLE". World Athletics writes the surname in
 * caps, so the last all-caps word is the reliable pick rather than the last
 * word, which can be a suffix. */
function surname(name: string): string {
  const caps = name.split(" ").filter((w) => w.length > 1 && w === w.toUpperCase());
  return (caps[caps.length - 1] ?? name.split(" ").pop() ?? name).slice(0, 8);
}

/** The unit has to be told, not guessed: a 22.58m shot put and a 22.58s
 * 200m are the same float, so a threshold on the value alone silently
 * strips the metres off every throw and horizontal jump. */
function formatMarkish(value: number, isField: boolean): string {
  if (isField) return `${value.toFixed(2)}m`;
  if (value >= 60) {
    const m = Math.floor(value / 60);
    const s = value - m * 60;
    return `${m}:${s.toFixed(2).padStart(5, "0")}`;
  }
  return value.toFixed(2);
}
