import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { PodiumCallMark } from "./logo";
import { InfoGlyph } from "./info-tip";

/** Bumped if the intro copy changes enough to be worth re-showing everyone. */
const SEEN_KEY = "podiumcall:welcome:v1";

const POINTS = [
  "Every number is a real, scraped stat from World Athletics. Nothing is typed in by hand or made up.",
  "Browse by event under Track and Field, check who's qualified in Qualifying, or open any athlete for their form and rivalries.",
  "Tap the small ⓘ next to a stat to read exactly what it means.",
];

/** First-run onboarding for the dashboard. It's a modal because the user asked
 * for one, so it's built to behave: it traps focus, closes on Escape or a
 * backdrop tap, locks the background from scrolling, and hands focus back to
 * whatever opened it. It only auto-opens once (the dashboard remembers in
 * localStorage); after that the floating button reopens it. Portalled to the
 * body so it sits above everything regardless of stacking context. */
export function WelcomeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

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
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ),
      );
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
      // Hand focus back to the trigger so a keyboard user isn't dropped at the
      // top of the page.
      prevFocus.current?.focus?.();
    };
  }, [open, onClose]);

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
        <div className="flex items-center gap-2.5">
          <PodiumCallMark className="size-7" />
          <span className="label-caps text-muted-foreground">PodiumCall</span>
        </div>

        <h2
          id={titleId}
          className="mt-4 text-[24px] font-bold leading-tight tracking-tight text-foreground sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Predicting the podium in Brussels.
        </h2>

        <p id={descId} className="mt-3 text-[15px] leading-relaxed text-foreground">
          PodiumCall calls the podium for every one of the 32 events at the 2026 Diamond League
          Final, worked out from real World Athletics results before anyone races. It backs the top
          three, not a single winner.
        </p>

        <ul className="mt-5 flex flex-col gap-3">
          {POINTS.map((p) => (
            <li key={p} className="flex gap-3 text-[14px] leading-relaxed text-foreground">
              <span className="mt-[7px] size-1.5 flex-none rounded-full bg-terracotta" />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/how-it-works"
            onClick={onClose}
            className="text-[13.5px] font-medium text-terracotta-strong underline decoration-terracotta/40 underline-offset-2 transition-colors hover:decoration-terracotta-strong"
          >
            How it works, in full →
          </Link>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-terracotta-strong"
          >
            Explore the board
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Owns the whole onboarding lifecycle so a page only has to drop it in once:
 * auto-opens the modal on a visitor's first dashboard load (remembered per
 * browser in localStorage), and leaves a small persistent button pinned to the
 * corner so anyone can reopen it later. Every storage access is wrapped, since
 * a private window or blocked site-data throws on read/write, and a thrown
 * onboarding check should never take the page down. */
export function WelcomeLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage unavailable: treat as seen so we don't nag on every load.
      seen = true;
    }
    if (!seen) {
      setOpen(true);
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* best effort */
      }
    }
  }, []);

  return (
    <>
      <WelcomeModal open={open} onClose={() => setOpen(false)} />
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card/95 px-3.5 py-2 text-[12.5px] font-semibold text-foreground shadow-lg backdrop-blur transition-[transform,border-color] duration-150 hover:border-terracotta/50 active:scale-95 sm:bottom-6 sm:right-6"
      >
        <InfoGlyph className="text-terracotta-strong" />
        About
      </button>
    </>
  );
}
