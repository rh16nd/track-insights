import { useState, useEffect, useCallback } from "react";
import type { StatsData } from "@/lib/dl-data";
import { apiFetch, describeApiError } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ok"; data: StatsData };

/** Cross-discipline performance stats. Separate from /api/predictions for
 * the same reason /api/qualification is: this is raw scraped material --
 * World Athletics' own scoring-table points -- not model output, and only
 * one page asks for it. */
export function useStats(): State {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: "loading" });
    apiFetch<StatsData>("/api/stats", { signal: ac.signal })
      .then((data) => setState({ status: "ok", data }))
      .catch((e) => {
        if (ac.signal.aborted) return;
        setState({
          status: "error",
          message: describeApiError(e, "No season toplists yet. Run python run.py to scrape them."),
          retry,
        });
      });
    return () => ac.abort();
  }, [attempt, retry]);

  return state;
}
