import { useState, useEffect, useCallback } from "react";
import type { QualificationData } from "@/lib/dl-data";
import { apiFetch, describeApiError } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ok"; data: QualificationData };

/** WA's full Diamond League standings with the gap to the qualification cut.
 * Its own endpoint rather than part of /api/predictions: this is the raw
 * points table, not model output, and only one page asks for it. */
export function useQualification(): State {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: "loading" });

    apiFetch<QualificationData>("/api/qualification", { signal: ac.signal })
      .then((data) => setState({ status: "ok", data }))
      .catch((e) => {
        if (ac.signal.aborted) return;
        setState({
          status: "error",
          message: describeApiError(
            e,
            "No standings data yet — run python src/live_fetcher.py to scrape it.",
          ),
          retry,
        });
      });

    return () => ac.abort();
  }, [attempt, retry]);

  return state;
}
