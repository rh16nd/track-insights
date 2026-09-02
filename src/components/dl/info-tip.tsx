import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** A drawn info "i", not a Unicode glyph, since the craft floor bans emoji
 * standing in for an icon. Lives here rather than in shell.tsx so InfoTip can
 * own it without a shell <-> info-tip import cycle. `aria-hidden` because the
 * meaning it marks travels in InfoTip's `sr-only` text and popover. */
export function InfoGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      className={`size-[13px] shrink-0 ${className}`}
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="5.15" r="0.95" fill="currentColor" />
      <path d="M8 7.4v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/** A metric explainer that works with a mouse AND a finger.
 *
 * The site's first tooltips were a native `title` plus an `sr-only` line: fine
 * on a desktop hover, invisible on a phone (no hover, and `title` never fires
 * on tap). This replaces them. It opens on hover for a mouse and on tap for
 * touch, and the two don't fight because the hover handlers are guarded to
 * `pointerType === "mouse"`, so a tap never triggers a hover-open that the same
 * tap's click then closes.
 *
 * The popover is portalled to `document.body` and fixed-positioned from the
 * trigger's rect, on purpose: these live inside the discipline table's
 * `overflow-x-auto` wrapper, where an absolutely-positioned popover gets
 * clipped (and can force a scrollbar). A portal escapes the clip entirely.
 *
 * The full text is also kept in an always-present `sr-only` span inside the
 * button, so assistive tech reads the explanation whether or not the visual
 * popover is open. */
export function InfoTip({
  label,
  children,
  tone = "card",
}: {
  /** Short accessible name for the button, e.g. "About podium chance". */
  label: string;
  /** The explanation shown in the popover and to assistive tech. */
  children: ReactNode;
  /** Glyph colour context. "canvas" is the terracotta head band (white glyph);
   * "card" is a cream surface (muted glyph). */
  tone?: "card" | "canvas";
}) {
  const [open, setOpen] = useState(false);
  /** True once opened by a click/tap, so a mouse leaving the trigger doesn't
   * yank a deliberately-opened tip away. */
  const [pinned, setPinned] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  useEffect(() => setMounted(true), []);

  function place() {
    const b = btnRef.current?.getBoundingClientRect();
    if (!b) return;
    const width = Math.min(280, window.innerWidth - 24);
    // Centre under the trigger, then clamp so it never runs off either edge.
    const left = Math.max(
      12,
      Math.min(b.left + b.width / 2 - width / 2, window.innerWidth - width - 12),
    );
    setCoords({ top: b.bottom + 8, left, width });
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !popRef.current?.contains(t)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    // A fixed popover can't follow the page, so dismiss it rather than let it
    // drift away from its trigger. Capture phase catches scrolls in any
    // ancestor (the table's own horizontal scroller included).
    function onScroll() {
      close();
    }
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  function show() {
    place();
    setOpen(true);
  }
  function close() {
    setOpen(false);
    setPinned(false);
  }

  const glyph =
    tone === "canvas"
      ? "text-white/70 hover:text-white"
      : "text-muted-foreground hover:text-foreground";

  return (
    <span className="relative inline-flex">
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") show();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse" && !pinned) setOpen(false);
        }}
        onClick={() =>
          setPinned((p) => {
            const next = !p;
            if (next) show();
            else setOpen(false);
            return next;
          })
        }
        onFocus={show}
        onBlur={(e) => {
          if (!popRef.current?.contains(e.relatedTarget as Node)) close();
        }}
        // -m-1.5 p-1.5 grows the tap target past 24px without moving the glyph.
        className={`-m-1.5 inline-flex items-center justify-center rounded-full p-1.5 transition-colors ${glyph}`}
      >
        <InfoGlyph />
        <span className="sr-only">{label}. </span>
        <span className="sr-only">{children}</span>
      </button>
      {mounted &&
        open &&
        coords &&
        createPortal(
          <div
            ref={popRef}
            id={popoverId}
            role="tooltip"
            style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width }}
            className="z-[70] animate-[popover-in_140ms_ease-out] rounded-lg border border-border bg-popover p-3 text-[12.5px] font-normal leading-relaxed text-popover-foreground shadow-lg"
          >
            {children}
          </div>,
          document.body,
        )}
    </span>
  );
}
