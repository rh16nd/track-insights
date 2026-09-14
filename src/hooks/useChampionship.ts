import { useCallback, useEffect, useState } from "react";
import type { ChampionshipEvent, ChampionshipSummary } from "@/lib/dl-data";
import { apiFetch, describeApiError } from "@/lib/api";

type State<T> =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ok"; data: T };

function useApi<T>(path: string): State<T> {
  const [state, setState] = useState<State<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: "loading" });
    (async () => {
      try {
        const data = await apiFetch<T>(path, { signal: ac.signal });
        setState({ status: "ok", data });
      } catch (e) {
        if (ac.signal.aborted) return;
        setState({ status: "error", message: describeApiError(e), retry });
      }
    })();
    return () => ac.abort();
  }, [attempt, retry, path]);

  return state;
}

/** The current championship, whole: its facts, field, call and results
 * (/api/championship). WHICH championship is the backend registry's decision
 * (src/championships.py), so the page moves on to the next one with a data
 * push and no change here. */
export function useChampionship(): State<ChampionshipEvent> {
  return useApi<ChampionshipEvent>("/api/championship");
}

/** Only its name, place, dates and theme (/api/championship/summary). The nav
 * tab, the landing badge, the dashboard band and the schedule need no more,
 * and the whole payload runs to hundreds of kilobytes. */
export function useChampionshipSummary(): State<ChampionshipSummary> {
  return useApi<ChampionshipSummary>("/api/championship/summary");
}
