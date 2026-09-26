import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

/** Adding an address to the mailing list.
 *
 * This runs on the server for one reason: a Buttondown API key is a secret.
 * The feedback form's web3forms key sits in the client bundle quite safely,
 * because that kind of key is designed to be public and only names a destination
 * inbox. This one would let anyone read and write the whole list, so it never
 * leaves the server, is read from process.env inside the handler rather than at
 * module scope, and carries no VITE_ prefix (which would inline it at build).
 *
 * Buttondown's embeddable form was the other option and is ruled out three times
 * over: their docs say it must be a form action and must not be driven by fetch,
 * because a subscriber may have to follow the response to clear a CAPTCHA; a
 * no-cors fetch returns an opaque response, so the page could never know whether
 * the subscription actually happened; and this site's CSP blocks both routes
 * anyway, with connect-src for the fetch and form-action 'self' for a native POST.
 * A native POST would also navigate the reader off the site at the moment they
 * signed up. A same-origin server function needs no CSP change and can tell the
 * truth about what happened, which is the whole point.
 *
 * Cross-site callers are already rejected before this runs, by the CSRF
 * middleware in src/start.ts.
 *
 * It never throws. errorMiddleware turns a thrown error into an HTML error page,
 * which the RPC client cannot parse, so a failure would reach the reader as
 * confusion rather than as a message. Every outcome is a value instead. */
export type SubscribeResult =
  | { ok: true; state: "confirm" | "already" }
  | { ok: false; reason: "invalid" | "unconfigured" | "failed" };

const ENDPOINT = "https://api.buttondown.com/v1/subscribers";

// Deliberately loose. Buttondown is the authority on whether an address is
// real; this only catches what is obviously not an address, so the handler can
// answer without a round trip.
const LOOKS_LIKE_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const subscribe = createServerFn({ method: "POST" })
  // Coerces rather than throws: a thrown validator error would become that HTML
  // error page. The handler decides what is invalid.
  .validator((email: unknown): string =>
    String(email ?? "")
      .trim()
      .slice(0, 254),
  )
  .handler(async ({ data: email }): Promise<SubscribeResult> => {
    const key = process.env["BUTTONDOWN_API_KEY"];
    if (!key) return { ok: false, reason: "unconfigured" };
    if (!LOOKS_LIKE_EMAIL.test(email)) return { ok: false, reason: "invalid" };

    let ip: string | undefined;
    try {
      ip = getRequestIP({ xForwardedFor: true });
    } catch {
      // Buttondown only uses it for spam scoring, so carry on without it.
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
        // type is left unset on purpose, which means "unactivated": Buttondown
        // sends a confirmation email and the address joins the list only when it
        // is clicked. Double opt-in keeps typos and bots off the list, and it is
        // why the reader is told to check their inbox rather than that they are
        // subscribed.
        body: JSON.stringify({ email_address: email, ...(ip ? { ip_address: ip } : {}) }),
      });

      if (res.status === 201) return { ok: true, state: "confirm" };

      const body = (await res.json().catch(() => null)) as { code?: string } | null;
      const code = body?.code ?? null;
      // Already on the list is a success, but not the same success: telling a
      // returning reader "check your inbox" would be a lie, since no email comes.
      if (code === "email_already_exists") return { ok: true, state: "already" };
      if (code === "email_invalid") return { ok: false, reason: "invalid" };

      console.error(`buttondown subscribe: HTTP ${res.status}`, code ?? "");
      return { ok: false, reason: "failed" };
    } catch (error) {
      console.error("buttondown subscribe failed", error);
      return { ok: false, reason: "failed" };
    }
  });
