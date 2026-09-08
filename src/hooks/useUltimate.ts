import { useCallback, useEffect, useState } from "react";
import type { UltimateEvent } from "@/lib/dl-data";
import { apiFetch, describeApiError } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ok"; data: UltimateEvent };

/** The World Athletics Ultimate Championship payload (/api/ultimate): event
 * facts, the direct qualifiers, and the official timetable/field/results once
 * WA publishes them. Its own endpoint rather than part of /api/predictions
 * because it is a different competition with its own lifecycle. */
export function useUltimate(): State {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: "loading" });
    (async () => {
      try {
        const data = await apiFetch<UltimateEvent>("/api/ultimate", { signal: ac.signal });
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
