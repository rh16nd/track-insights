import { useCallback, useEffect, useState } from "react";
import type { Country } from "@/lib/dl-data";
import { apiFetch, describeApiError } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "notFound" }
  | { status: "ok"; data: Country };

/** One nation (/api/country/<code>): every ranked athlete of that nationality,
 * the country's direct places at the Ultimate, and its mixed relay teams.
 *
 * `notFound` is kept separate from `error` because the two need different
 * copy: a code we have no athletes for is a real, final answer, whereas a
 * failed request is worth retrying. */
export function useCountry(code: string): State {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: "loading" });
    (async () => {
      try {
        const data = await apiFetch<Country>(`/api/country/${encodeURIComponent(code)}`, {
          signal: ac.signal,
        });
        setState({ status: "ok", data });
      } catch (e) {
        if (ac.signal.aborted) return;
        // A 404 means no athlete from this nation is in the toplists, which is
        // a fact about the season rather than something that failed.
        if (e instanceof Error && "status" in e && (e as { status?: number }).status === 404) {
          setState({ status: "notFound" });
          return;
        }
        setState({ status: "error", message: describeApiError(e), retry });
      }
    })();
    return () => ac.abort();
  }, [code, attempt, retry]);

  return state;
}
