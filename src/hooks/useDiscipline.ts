import { useState, useEffect } from "react";
import type { DisciplineReport } from "@/lib/dl-data";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; data: DisciplineReport };

/** One discipline read as a field: how level it is against the other 31, the
 * WA score behind that, and who has actually raced whom.
 *
 * Lazy and per-discipline, the same pattern as /api/projections/<key> and
 * /api/athlete/<key>/<name> — the head-to-head matrix alone is O(field²) and
 * has no business in the bulk /api/predictions payload. */
export function useDiscipline(discKey: string): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let live = true;
    setState({ status: "loading" });

    fetch(`http://localhost:5000/api/discipline/${discKey}`)
      .then((r) => {
        if (!r.ok)
          throw new Error(
            r.status === 404
              ? "No predictions yet — run python run.py to build them"
              : `API returned ${r.status}`,
          );
        return r.json() as Promise<DisciplineReport>;
      })
      .then((data) => live && setState({ status: "ok", data }))
      .catch(
        (e) =>
          live &&
          setState({
            status: "error",
            message: e.message ?? "Could not reach API — is api.py running?",
          }),
      );

    // Switching discipline mid-flight would otherwise let a slower earlier
    // request land last and render the wrong event's depth report.
    return () => {
      live = false;
    };
  }, [discKey]);

  return state;
}
