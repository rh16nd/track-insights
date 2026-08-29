import { useState, useEffect } from "react";
import type { StatsData } from "@/lib/dl-data";

type State =
  { status: "loading" } | { status: "error"; message: string } | { status: "ok"; data: StatsData };

/** Cross-discipline performance stats. Separate from /api/predictions for
 * the same reason /api/qualification is: this is raw scraped material --
 * World Athletics' own scoring-table points -- not model output, and only
 * one page asks for it. */
export function useStats(): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then((r) => {
        if (!r.ok)
          throw new Error(
            r.status === 404
              ? "No season toplists yet — run python run.py to scrape them"
              : `API returned ${r.status}`,
          );
        return r.json() as Promise<StatsData>;
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
