/** One place that knows where the API lives, and how to survive it being
 * briefly unavailable.
 *
 * Before this existed, eight call sites each hardcoded
 * `http://localhost:5000`. That is not a dev-only wart -- it is the whole
 * data layer, so the site fetched from the VIEWER's own machine anywhere
 * but the box running api.py, and every page showed its error state. A
 * `/impeccable critique` scored error recovery 1/4 for exactly this: five
 * separately-worded "not reachable" strings, no retries, and a base URL
 * that could not be pointed anywhere else without editing source.
 *
 * `VITE_API_BASE_URL` overrides the base at build time (see .env.example).
 * The localhost default is kept because it is genuinely right for the
 * development setup this project is normally run in -- the point is that it
 * is now a default rather than the only possibility. */
const RAW_BASE = import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:5000";

/** Trailing slashes are stripped so `${API_BASE}/api/x` cannot become a
 * double slash -- Flask treats `//api/x` as a different route and 404s. */
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

/** Whether the API is somewhere other than the developer's own machine.
 * The "is api.py running?" hint is good advice locally and nonsense in
 * production, so the copy branches on this rather than always saying it. */
export const API_IS_LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(API_BASE);

export class ApiError extends Error {
  /** HTTP status, or 0 when the request never got an answer at all. */
  readonly status: number;
  /** True when retrying later could plausibly work: a network failure or a
   * server-side error. A 404 is not retryable -- it means the pipeline has
   * not produced that file yet, which waiting does not fix. */
  readonly retryable: boolean;

  constructor(message: string, status: number, retryable: boolean) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryable = retryable;
  }
}

const OFFLINE_MESSAGE = API_IS_LOCAL
  ? "Could not reach the prediction API."
  : "Could not reach the prediction API. It may be restarting — try again in a moment.";

/** Wording used by every surface, so the site says one thing rather than
 * five. `notFound` lets a caller explain what is specifically missing,
 * since "no toplists yet" and "no such athlete" want different advice. */
export function describeApiError(e: unknown, notFound?: string): string {
  if (e instanceof ApiError) {
    if (e.status === 404 && notFound) return notFound;
    return e.message;
  }
  if (e instanceof Error && e.name === "AbortError") return "Request cancelled.";
  return OFFLINE_MESSAGE;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Backoff between attempts. Short on purpose: this is a local-first app and
 * a human is watching a spinner, so the goal is to ride out a server that is
 * mid-reload, not to survive a long outage. */
const RETRY_DELAYS_MS = [400, 1200];

/**
 * Fetch a path from the API, retrying transient failures.
 *
 * `path` is API-relative and must start with "/" (e.g. "/api/stats").
 * Anything that already looks absolute is a caller bug and throws, rather
 * than silently reintroducing a hardcoded host.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (/^https?:\/\//i.test(path)) {
    throw new Error(`apiFetch expects an API-relative path, got an absolute URL: ${path}`);
  }
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) {
        // 5xx is the server having a bad moment; 4xx is a real answer about
        // this specific request, and repeating it just wastes the user's time.
        const retryable = res.status >= 500;
        throw new ApiError(
          retryable ? OFFLINE_MESSAGE : `The API answered ${res.status}.`,
          res.status,
          retryable,
        );
      }
      return (await res.json()) as T;
    } catch (e) {
      // An aborted request is the caller changing its mind (a superseded
      // search keystroke, an unmounting component). Retrying it would fight
      // the caller, so it propagates immediately.
      if (e instanceof Error && e.name === "AbortError") throw e;

      // A bare TypeError from fetch is the network layer: refused connection,
      // DNS, CORS, offline. Those are exactly the retryable ones.
      const retryable = e instanceof ApiError ? e.retryable : true;
      lastError = e instanceof ApiError ? e : new ApiError(OFFLINE_MESSAGE, 0, true);
      const delay = RETRY_DELAYS_MS[attempt];
      if (!retryable || delay === undefined) break;
      await sleep(delay);
    }
  }
  throw lastError;
}
