import { useCallback, useEffect, useState } from "react";
import type { CountryHit } from "@/lib/dl-data";
import { apiFetch, describeApiError } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ok"; data: CountryHit[] };

/** Every nation with a ranked athlete this season (/api/countries, the static
 * countries.json on the live site), for the dashboard's coverage map. */
export function useCountries(enabled = true): State {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) return;
    const ac = new AbortController();
    setState({ status: "loading" });
    (async () => {
      try {
        const data = await apiFetch<{ countries: CountryHit[] }>("/api/countries", {
          signal: ac.signal,
        });
        setState({ status: "ok", data: data.countries });
      } catch (e) {
        if (ac.signal.aborted) return;
        setState({ status: "error", message: describeApiError(e), retry });
      }
    })();
    return () => ac.abort();
  }, [attempt, retry, enabled]);

  return state;
}
