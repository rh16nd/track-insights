import { useState, useEffect } from "react";
import type { AthleteProfile } from "@/lib/dl-data";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
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
      .then((r) => {
        if (!r.ok)
          throw new Error(r.status === 404 ? "Athlete not found" : `API returned ${r.status}`);
        return r.json() as Promise<AthleteProfile>;
      })
      .then((data) => setState({ status: "ok", data }))
      .catch((e) =>
        setState({
          status: "error",
          message: e.message ?? "Could not reach API — is api.py running?",
        }),
      );
  }, [discKey, name]);

  return state;
}
