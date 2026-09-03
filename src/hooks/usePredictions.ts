import { useState, useEffect, useCallback } from "react";
import type { ApiData } from "@/lib/dl-data";
import { apiFetch, describeApiError } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ok"; data: ApiData };

export function usePredictions(): State {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: "loading" });

    apiFetch<ApiData>("/api/predictions", { signal: ac.signal })
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
  }, [attempt, retry]);

  return state;
}
