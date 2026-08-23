import { useState, useEffect } from "react";
import type { ProjectionsDetail } from "@/lib/dl-data";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; data: ProjectionsDetail };

/** Lazy per-discipline detail for the Projections page (real trajectories +
 * real storylines), fetched only when a discipline is selected -- same
 * pattern as useAthleteProfile, kept out of the bulk /api/predictions
 * payload since computing it for all 32 disciplines on every load would be
 * wasted work for the ones never viewed. */
export function useProjectionsDetail(discKey: string | undefined): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!discKey) return;
    setState({ status: "loading" });
    fetch(`http://localhost:5000/api/projections/${discKey}`)
      .then((r) => {
        if (!r.ok)
          throw new Error(r.status === 404 ? "Discipline not found" : `API returned ${r.status}`);
        return r.json() as Promise<ProjectionsDetail>;
      })
      .then((data) => setState({ status: "ok", data }))
      .catch((e) =>
        setState({
          status: "error",
          message: e.message ?? "Could not reach API — is api.py running?",
        }),
      );
  }, [discKey]);

  return state;
}
