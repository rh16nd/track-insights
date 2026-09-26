import { type FormEvent, useId, useState } from "react";

import { subscribe } from "@/lib/subscribe";
import { useT } from "@/lib/i18n";

/** The mailing list, on the landing between the questions and the closing band.
 *
 * Why it exists: nothing on this site gives a reader a reason to come back once
 * a championship is over, and athletics is quiet from October to April. A page
 * cannot survive that gap. A list can.
 *
 * Why inline and not a modal like the feedback box: the problem it answers is a
 * 73% bounce, not shallow engagement, so an ask behind a trigger most readers
 * never click is the wrong shape. Feedback is a task you go and do; a list is an
 * offer you encounter. It sits after the proof, the call and the questions
 * because the ask has to be earned, and before the closing band, which reads as
 * the end of the page.
 *
 * Borrowed from feedback-modal.tsx, which worked these out first: the honeypot
 * checked before any request so a bot learns nothing, a status machine rather
 * than a boolean, and error copy that appears without clearing what was typed.
 * Not borrowed: the portal, the focus trap, the scroll lock and the Escape
 * handler, none of which an inline form needs.
 *
 * VITE_NEWSLETTER gates it. The key this depends on lives on the server, so the
 * browser cannot tell whether it is set; without the flag a preview deploy would
 * show a form that silently cannot work. */
type Status = "idle" | "sending" | "sent" | "already" | "error";

const ENABLED = import.meta.env["VITE_NEWSLETTER"] === "1";

export function LandingSignup() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [problem, setProblem] = useState<"invalid" | "failed">("failed");
  const fieldId = useId();
  const headingId = useId();

  if (!ENABLED) return null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;

    // A field a person never sees and a bot fills in. Report success and send
    // nothing, so the bot learns nothing from the response.
    if (new FormData(e.currentTarget).get("website")) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await subscribe({ data: email });
      if (res.ok) {
        setStatus(res.state === "already" ? "already" : "sent");
        return;
      }
      // unconfigured is deliberately shown as the ordinary failure: it is our
      // problem, not the reader's, and naming it would mean nothing to them.
      setProblem(res.reason === "invalid" ? "invalid" : "failed");
      setStatus("error");
    } catch {
      setProblem("failed");
      setStatus("error");
    }
  }

  const done = status === "sent" || status === "already";

  return (
    <section className="px-5 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="label-caps text-[var(--terra-gold)]">{t("signup.eyebrow")}</p>
        <h2
          id={headingId}
          className="hero-serif mt-4 text-[clamp(30px,4.5vw,46px)] leading-[1.1] text-[var(--terra-fg)]"
        >
          {t("signup.title")
            .split("**")
            .map((part, i) =>
              i % 2 === 1 ? (
                <span key={i} className="text-[var(--terra-gold)]">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
        </h2>

        {done ? (
          <div className="mt-6" role="status">
            <p className="text-[17px] text-[var(--terra-fg)]">
              {t(status === "already" ? "signup.alreadyTitle" : "signup.confirmTitle")}
            </p>
            <p className="mx-auto mt-2 max-w-[46ch] text-[15px] leading-relaxed text-[var(--terra-muted)]">
              {t(status === "already" ? "signup.alreadyBody" : "signup.confirmBody")}
            </p>
          </div>
        ) : (
          <>
            <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-[var(--terra-muted)]">
              {t("signup.lede")}
            </p>
            <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[var(--terra-muted)]">
              {t("signup.offSeason")}
            </p>

            <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-md text-left">
              <label className="label-caps block text-[var(--terra-muted)]" htmlFor={fieldId}>
                {t("signup.emailLabel")}
              </label>
              <div className="mt-1.5 flex flex-col gap-3 sm:flex-row">
                <input
                  id={fieldId}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("signup.emailPlaceholder")}
                  className="min-h-[44px] w-full rounded-full border border-[var(--terra-border)] bg-[var(--terra-surface)] px-5 py-3 text-[15px] text-[var(--terra-fg)] outline-none transition-colors focus:border-[var(--terra-gold)]"
                />

                {/* Never shown, never focusable. A bot fills it; a person cannot. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <button
                  type="submit"
                  disabled={!email.trim() || status === "sending"}
                  className="min-h-[44px] shrink-0 rounded-full bg-[var(--terra-gold)] px-6 py-3 text-[15px] font-semibold text-[var(--terra-bg)] transition-[transform,opacity] duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-45"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {status === "sending" ? t("signup.sending") : t("signup.submit")}
                </button>
              </div>

              {status === "error" && (
                <p
                  className="mt-3 text-[13.5px] leading-snug text-[var(--terra-gold)]"
                  role="alert"
                >
                  {t(problem === "invalid" ? "signup.invalid" : "signup.error")}
                </p>
              )}

              <p className="mt-4 text-[13px] leading-relaxed text-[var(--terra-muted)]">
                {t("signup.unsubscribe")} {t("signup.privacy")}
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
