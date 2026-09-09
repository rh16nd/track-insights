import { useState, useEffect, useCallback } from "react";
import type { ResultsHistory } from "@/lib/dl-data";
import { apiFetch, describeApiError } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ok"; data: ResultsHistory };

export function useResults(): State {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: "loading" });

    apiFetch<ResultsHistory>("/api/results", { signal: ac.signal })
      .then((data) => setState({ status: "ok", data }))
      .catch((e) => {
        if (ac.signal.aborted) return;
        setState({
          status: "error",
          message: describeApiError(e, "No results yet."),
          retry,
        });
      });

    return () => ac.abort();
  }, [attempt, retry]);

  return state;
}
