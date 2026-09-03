import { useT } from "@/lib/i18n";
import { useState } from "react";
import type { H2hMatchup } from "@/lib/dl-data";

/** Real matchup history (data/h2h/h2h_rates.csv, ~156k scraped rows) --
 * previously only ever consumed as one blended win-rate number fed into
 * the model (train_model.py's add_h2h_features), never shown to a user.
 * Win/loss as two-segment bars, not a single "win rate" bar, so both real
 * counts stay visible rather than collapsing to one ratio. */
export function HeadToHeadChart({
  matchups,
  /** Who the opponents are. Defaults to the in-field profile's wording;
   * the not-in-field profile passes its own, because there "top rivals" is
   * ambiguous when the athlete isn't in the field those rivals are in. */
  opponentsLabel,
}: {
  matchups: H2hMatchup[];
  opponentsLabel?: string;
}) {
  const { t } = useT();
  const [tableView, setTableView] = useState(false);
  if (matchups.length === 0) return null;
  const maxMeetings = Math.max(...matchups.map((m) => m.meetings));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <div className="label-caps text-muted-foreground">
          {t("h2h.header", { opponents: opponentsLabel ?? t("h2h.topRivals") })}
        </div>
        <div className="flex items-center gap-3">
          {!tableView && (
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-terracotta" /> {t("h2h.wins")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-border" /> {t("h2h.losses")}
              </span>
            </div>
          )}
          <button
            type="button"
            aria-pressed={tableView}
            onClick={() => setTableView((v) => !v)}
            className="label-caps shrink-0 rounded-sm border border-border px-1.5 py-0.5 text-muted-foreground transition-colors hover:text-terracotta-strong"
          >
            {t(tableView ? "traj.chartView" : "traj.tableView")}
          </button>
        </div>
      </div>
      {tableView ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-[12.5px]">
            <caption className="sr-only">
              {t("h2h.caption", { opponents: opponentsLabel ?? t("h2h.topRivals") })}
            </caption>
            <thead>
              <tr className="label-caps text-muted-foreground">
                <th scope="col" className="py-1 pr-3 font-medium">
                  {t("h2h.colOpponent")}
                </th>
                <th scope="col" className="py-1 pr-3 font-medium">
                  {t("h2h.wins")}
                </th>
                <th scope="col" className="py-1 pr-3 font-medium">
                  {t("h2h.losses")}
                </th>
                <th scope="col" className="py-1 font-medium">
                  {t("h2h.colMeetings")}
                </th>
              </tr>
            </thead>
            <tbody>
              {matchups.map((m) => (
                <tr key={m.opponent} className="border-t border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">{m.opponent}</td>
                  <td className="nums py-1.5 pr-3 text-foreground">{m.wins}</td>
                  <td className="nums py-1.5 pr-3 text-foreground">{m.losses}</td>
                  <td className="nums py-1.5 text-muted-foreground">{m.meetings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {matchups.map((m) => {
            const winPct = (m.wins / m.meetings) * 100;
            const lossPct = 100 - winPct;
            const barWidthPct = (m.meetings / maxMeetings) * 100;
            return (
              <li key={m.opponent}>
                <div className="flex items-baseline justify-between text-[12.5px]">
                  <span className="min-w-0 truncate text-foreground">{m.opponent}</span>
                  <span className="nums shrink-0 font-medium text-foreground">
                    {m.wins}-{m.losses}
                    <span className="ml-1 font-normal text-muted-foreground">({m.meetings})</span>
                  </span>
                </div>
                <div
                  className="mt-1.5 flex h-2.5 gap-[2px] overflow-hidden rounded-full bg-transparent"
                  style={{ width: `${barWidthPct}%` }}
                >
                  {m.wins > 0 && (
                    <div
                      className="h-full rounded-full bg-terracotta"
                      style={{ width: `${winPct}%` }}
                    />
                  )}
                  {m.losses > 0 && (
                    <div
                      className="h-full rounded-full bg-border"
                      style={{ width: `${lossPct}%` }}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
