import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useT } from "@/lib/i18n";

/** Where a submitted message goes.
 *
 * Web3Forms' access key is designed to be public and to sit in client code --
 * it identifies the destination inbox, it does not authorise anything else --
 * so it lives in an env var rather than a secret store, and the repo can be
 * public without leaking anything. Set VITE_WEB3FORMS_KEY in the Vercel project.
 *
 * With no key configured the form does not pretend to work: it falls back to
 * the mail-client link, which is what this replaced. A feedback box that
 * silently drops messages is worse than no feedback box. */
const ACCESS_KEY = import.meta.env["VITE_WEB3FORMS_KEY"] as string | undefined;
const ENDPOINT = "https://api.web3forms.com/submit";

// Split so the address never appears as one string in the served bundle, which
// is what the simplest harvesters read. Only used for the no-key fallback.
const CONTACT = ["rayenhamed65", "@", "gmail", ".com"];

type Status = "idle" | "sending" | "sent" | "error";

export function FeedbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();
  const { t } = useT();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea,input:not([type="hidden"]),[tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus.current?.focus?.();
    };
  }, [open, onClose]);

  // A fresh open is a fresh message; leaving "sent" up would make a second
  // report look like it had already gone.
  useEffect(() => {
    if (open) {
      setStatus("idle");
      setMessage("");
      setReply("");
    }
  }, [open]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim() || status === "sending") return;

    // The honeypot: a field a person never sees and a bot fills in. Silently
    // succeed rather than reject, so a bot learns nothing from the response.
    const form = new FormData(e.currentTarget);
    if (form.get("website")) {
      setStatus("sent");
      return;
    }

    if (!ACCESS_KEY) {
      window.location.href =
        `mailto:${CONTACT.join("")}?subject=${encodeURIComponent("PodiumCall feedback")}` +
        `&body=${encodeURIComponent(message)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: "PodiumCall feedback",
          from_name: "PodiumCall",
          message,
          // Where the reader was when they wrote it. Most reports are about a
          // specific page and the page is the first thing you would ask.
          page: window.location.pathname,
          reply_to: reply.trim() || undefined,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-foreground/45 backdrop-blur-[2px]" aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(e) => e.stopPropagation()}
        className="card-shadow card-surface relative max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-t-[26px] bg-card p-6 animate-[popover-in_200ms_ease-out] motion-reduce:animate-none sm:rounded-[26px] sm:p-8"
      >
        <h2
          id={titleId}
          className="text-[22px] font-bold leading-tight tracking-tight text-foreground sm:text-[25px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("feedback.title")}
        </h2>
        <p id={descId} className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
          {t("feedback.body")}
        </p>

        {status === "sent" ? (
          <div className="mt-6">
            <p className="text-[14px] font-semibold text-foreground">{t("feedback.sentTitle")}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              {t("feedback.sentBody")}
            </p>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              className="mt-5 rounded-full bg-terracotta px-4 py-2 text-[13.5px] font-semibold text-primary-foreground transition-[transform,background-color] duration-150 ease-out hover:bg-terracotta-strong active:scale-[0.97]"
            >
              {t("feedback.close")}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5">
            <label className="label-caps block text-muted-foreground" htmlFor="fb-message">
              {t("feedback.messageLabel")}
            </label>
            <textarea
              id="fb-message"
              data-autofocus
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("feedback.messagePlaceholder")}
              className="mt-1.5 w-full resize-y rounded-lg border border-border bg-secondary px-3 py-2.5 text-[13.5px] leading-relaxed text-foreground outline-none transition-colors focus:border-terracotta"
            />

            <label className="label-caps mt-4 block text-muted-foreground" htmlFor="fb-reply">
              {t("feedback.replyLabel")}
            </label>
            <input
              id="fb-reply"
              type="email"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={t("feedback.replyPlaceholder")}
              className="mt-1.5 w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-[13.5px] text-foreground outline-none transition-colors focus:border-terracotta"
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

            {status === "error" && (
              <p className="mt-3 text-[12.5px] leading-snug text-terracotta-strong">
                {t("feedback.error")}
              </p>
            )}

            <div className="mt-5 flex items-center gap-3">
              <button
                type="submit"
                disabled={!message.trim() || status === "sending"}
                className="rounded-full bg-terracotta px-4 py-2 text-[13.5px] font-semibold text-primary-foreground transition-[transform,background-color,opacity] duration-150 ease-out hover:bg-terracotta-strong active:scale-[0.97] disabled:opacity-45"
              >
                {status === "sending" ? t("feedback.sending") : t("feedback.send")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("feedback.cancel")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** The footer's trigger. Kept here with the modal so a page adding feedback
 * imports one thing. */
export function FeedbackLink({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useT();
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {t("feedback.trigger")}
      </button>
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
