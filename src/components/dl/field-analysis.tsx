import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Panel, ProbabilityBar } from "@/components/dl/shell";
import { InfoTip } from "@/components/dl/info-tip";
import { ordinal, startNoun, startVerb } from "@/lib/dl-data";
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
  const { matrix, comparison } = analysis;
  const byName = new Map(comparison.map((c) => [c.name, c]));

  return (
    <>
      <Panel
        title={`Every pairing in the ${discLabel} field`}
        subtitle={`Read a row across: that athlete's record against each rival, wins first. Built from ${startNoun(isField)} they actually shared. ${matrix.pairsMet} of ${matrix.pairsPossible} possible pairings have met.`}
        className="mt-6"
        action={
          <InfoTip label="How to read this grid">
            Each row is one athlete, each column a rival. A cell reads wins then losses, so{" "}
            <b>3–1</b> means the row athlete has beaten that rival three times and lost once,
            counting only {startNoun(isField)} they both entered. Gold means the row athlete is
            ahead; a blank means they&apos;ve never met.
          </InfoTip>
        }
      >
        <div className="overflow-x-auto">
          <table className="border-collapse text-left">
            {/* A grid this shape is unreadable without a caption: every cell
                is a win-loss record whose meaning depends on which athlete
                owns the row and which owns the column. */}
            <caption className="sr-only">
              {`Head-to-head grid for the ${discLabel} field. Each row is one athlete's record against the athlete named in each column, wins first, from ${startNoun(isField)} they actually shared.`}
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="label-caps sticky left-0 z-10 bg-card pb-2.5 pr-6 text-muted-foreground"
                >
                  Athlete
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
                  vs. this field
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
                    className="sticky left-0 z-10 whitespace-nowrap bg-card py-2.5 pr-6 text-left text-[13px] font-medium text-foreground"
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
        </div>
        <p className="mt-3 max-w-3xl text-[11.5px] leading-relaxed text-muted-foreground">
          A blank cell means those two have genuinely never {startVerb(isField)} each other, shown
          as absent rather than as a nil-all draw. &ldquo;vs. this field&rdquo; totals a row, and is
          not the same number as a career win rate: an athlete can win often against everyone else
          and still be behind against the eight who will actually line up in Brussels.
        </p>
      </Panel>

      <Panel
        title="What separates them"
        subtitle="The same axes for every contender, so two athletes with near-identical season bests stop looking like the same bet."
        className="mt-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <caption className="sr-only">
              {`What separates the ${discLabel} field: the same measures for every contender, so two athletes with near-identical season bests can be told apart.`}
            </caption>
            <thead>
              <tr className="label-caps border-b border-border text-muted-foreground">
                <th scope="col" className="pb-2 pr-2 font-semibold">
                  Athlete
                </th>
                <th scope="col" className="w-28 pb-2 pl-3 text-right font-semibold">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Top-3 avg
                    <InfoTip label="About Top-3 average">
                      The average of this athlete&apos;s three best marks this season. It holds up
                      to one lucky afternoon in a way a single season best doesn&apos;t.
                    </InfoTip>
                  </span>
                </th>
                <th scope="col" className="w-28 pb-2 pl-3 text-right font-semibold">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Steadiness
                    <InfoTip label="About Steadiness">
                      How tightly a season&apos;s marks cluster, as a percentage of their average.
                      Lower is more repeatable, and it reads the same for a sprinter and a thrower.
                    </InfoTip>
                  </span>
                </th>
                <th scope="col" className="w-28 pb-2 pl-3 text-right font-semibold">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    {isField ? "Comps" : "Races"}
                    <InfoTip label={isField ? "About Comps" : "About Races"}>
                      How many times they&apos;ve competed this season, then their all-time total on
                      record (this season / all-time).
                    </InfoTip>
                  </span>
                </th>
                <th scope="col" className="w-28 pb-2 pl-3 text-right font-semibold">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Podium
                    <InfoTip label="About Podium">
                      How often this athlete has finished in the top three, across every final on
                      their record.
                    </InfoTip>
                  </span>
                </th>
                <th scope="col" className="w-28 pb-2 pl-3 text-right font-semibold">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Peaked
                    <InfoTip label="About Peaked">
                      The month this season&apos;s best mark was set.
                    </InfoTip>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {matrix.names.map((name, i) => {
                const c = byName.get(name);
                return (
                  <tr
                    key={name}
                    className="stagger-item transition-colors hover:bg-secondary/40"
                    style={{ "--stagger-i": Math.min(i, 12) } as CSSProperties}
                  >
                    <td className="py-2.5 pr-2 text-[13px] font-medium text-foreground">
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
                      {c?.bestMonth ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
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
  if (form.length === 0) {
    return <span className="text-[11.5px] text-muted-foreground">no results</span>;
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
            title={`${ordinal(f.place)}${f.meeting ? ` — ${f.meeting}` : ""}, ${f.date}`}
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
        <span className="sr-only">{`${a} and ${b} have never ${startVerb(isField)} each other`}</span>
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
        title={`${a} ${cell.wins}–${cell.losses} ${b} over ${cell.meetings} ${startNoun(
          isField,
          cell.meetings,
        )}${cell.lastMet ? `, last met ${cell.lastMet}` : ""}`}
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
