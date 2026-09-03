import { useState, useEffect, useCallback } from "react";
import type { DisciplineReport } from "@/lib/dl-data";
import { apiFetch, describeApiError } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ok"; data: DisciplineReport };

/** One discipline read as a field: how level it is against the other 31, the
 * WA score behind that, and who has actually raced whom.
 *
 * Lazy and per-discipline, the same pattern as /api/projections/<key> and
 * /api/athlete/<key>/<name> — the head-to-head matrix alone is O(field²) and
 * has no business in the bulk /api/predictions payload. */
export function useDiscipline(discKey: string): State {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    // Switching discipline mid-flight would otherwise let a slower earlier
    // request land last and render the wrong event's depth report.
    const ac = new AbortController();
    setState({ status: "loading" });

    apiFetch<DisciplineReport>(`/api/discipline/${discKey}`, { signal: ac.signal })
      .then((data) => setState({ status: "ok", data }))
      .catch((e) => {
        if (ac.signal.aborted) return;
        setState({
          status: "error",
          message: describeApiError(e, "No predictions yet. Run python run.py to build them."),
          retry,
        });
      });

    return () => ac.abort();
  }, [discKey, attempt, retry]);

  return state;
}
