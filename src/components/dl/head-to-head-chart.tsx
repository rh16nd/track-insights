import type { H2hMatchup } from "@/lib/dl-data";

/** Real matchup history (data/h2h/h2h_rates.csv, ~156k scraped rows) --
 * previously only ever consumed as one blended win-rate number fed into
 * the model (train_model.py's add_h2h_features), never shown to a user.
 * Win/loss as two-segment bars, not a single "win rate" bar, so both real
 * counts stay visible rather than collapsing to one ratio. */
export function HeadToHeadChart({ matchups }: { matchups: H2hMatchup[] }) {
  if (matchups.length === 0) return null;
  const maxMeetings = Math.max(...matchups.map((m) => m.meetings));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="label-caps text-muted-foreground">Head-to-head vs. top rivals</div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-terracotta" /> Wins
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-border" /> Losses
          </span>
        </div>
      </div>
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
                  <div className="h-full rounded-full bg-border" style={{ width: `${lossPct}%` }} />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
