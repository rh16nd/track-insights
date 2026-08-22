import { useState, useEffect } from "react";
import type { ApiData } from "@/lib/dl-data";
import { API_URL } from "@/lib/dl-data";

type State =
  { status: "loading" } | { status: "error"; message: string } | { status: "ok"; data: ApiData };

export function usePredictions(): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    fetch(API_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`API returned ${r.status}`);
        return r.json() as Promise<ApiData>;
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
