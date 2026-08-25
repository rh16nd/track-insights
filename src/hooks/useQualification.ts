import { useState, useEffect } from "react";
import type { QualificationData } from "@/lib/dl-data";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; data: QualificationData };

/** WA's full Diamond League standings with the gap to the qualification cut.
 * Its own endpoint rather than part of /api/predictions: this is the raw
 * points table, not model output, and only one page asks for it. */
export function useQualification(): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    fetch("http://localhost:5000/api/qualification")
      .then((r) => {
        if (!r.ok)
          throw new Error(
            r.status === 404
              ? "No standings data yet — run python src/live_fetcher.py to scrape it"
              : `API returned ${r.status}`,
          );
        return r.json() as Promise<QualificationData>;
      })
      .then((data) => setState({ status: "ok", data }))
      .catch((e) =>
        setState({
          status: "error",
          message: e.message ?? "Could not reach API — is api.py running?",
        }),
      );
  }, []);

  return state;
}
