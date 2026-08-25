import { useState, useEffect } from "react";
import type { AthleteProfile, MeetMark } from "@/lib/dl-data";

/** An athlete who exists in the season's worldwide toplist but is not in the
 * projected field. Carries the REAL reason (mirroring run.py's selection
 * order) rather than a generic "not found", plus their real season marks. */
export type AthleteNotInField = {
  inField: false;
  name: string;
  disc: string;
  discKey: string;
  seasonBest: string | null;
  worldRank: number | null;
  waUrl: string | null;
  reason: string;
  reasonCode: "not_in_standings" | "injury_removed" | "outside_cut" | "no_data";
  injuryReason?: string | null;
  injuryUrl?: string | null;
  history: MeetMark[];
  historyYear: number | null;
  photoUrl: string | null;
  photoFocus: { x: number; y: number } | null;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "notInField"; data: AthleteNotInField }
  | { status: "ok"; data: AthleteProfile };

/** Lazy per-athlete detail, fetched only when the profile page is visited --
 * kept out of the main /api/predictions payload (see api.py's
 * build_top_winners) since computing history/h2h for every athlete on
 * every dashboard load would be wasted work for the ones never opened. */
export function useAthleteProfile(discKey: string, name: string): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    fetch(`http://localhost:5000/api/athlete/${discKey}/${encodeURIComponent(name)}`)
      .then(async (r) => {
        if (r.ok) {
          setState({ status: "ok", data: (await r.json()) as AthleteProfile });
          return;
        }
        // A 404 here does NOT mean "no such athlete" -- it means they aren't
        // in predictions_latest.csv, which is only the ~230 projected
        // finalists out of ~3,700 ranked athletes. Ask why before giving up.
        if (r.status === 404) {
          const s = await fetch(
            `http://localhost:5000/api/athlete-status/${discKey}/${encodeURIComponent(name)}`,
          );
          if (s.ok) {
            const data = (await s.json()) as AthleteNotInField;
            if (!data.inField) {
              setState({ status: "notInField", data });
              return;
            }
          }
          throw new Error("Athlete not found");
        }
        throw new Error(`API returned ${r.status}`);
      })
      .catch((e) =>
        setState({
          status: "error",
          message: e.message ?? "Could not reach API — is api.py running?",
        }),
      );
  }, [discKey, name]);

  return state;
}
