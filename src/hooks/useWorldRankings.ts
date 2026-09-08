import { useCallback, useEffect, useState } from "react";
import type { WorldRankings } from "@/lib/dl-data";
import { apiFetch, describeApiError } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ok"; data: WorldRankings };

/** Per-discipline top-20 rankings (points + model) for Track/Field
 * (/api/world-rankings). Its own endpoint rather than part of /api/predictions
 * because it is 32 disciplines x 40 rows and only the Track/Field pages use it. */
export function useWorldRankings(): State {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: "loading" });
    (async () => {
      try {
        const data = await apiFetch<WorldRankings>("/api/world-rankings", { signal: ac.signal });
        setState({ status: "ok", data });
      } catch (e) {
        if (ac.signal.aborted) return;
        setState({ status: "error", message: describeApiError(e), retry });
      }
    })();
    return () => ac.abort();
  }, [attempt, retry]);

  return state;
}
