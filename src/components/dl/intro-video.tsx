import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useT } from "@/lib/i18n";

/** The one-minute walkthrough of the site, for people who land here and
 * don't yet know what they're looking at.
 *
 * It opens in a player on top of the page rather than playing inline, so it
 * behaves the same on a phone and on a desktop and never autoplays sound at
 * someone who didn't ask for it. The language follows the page: switch the
 * site to French and the French cut plays.
 *
 * The files are served from the site itself (public/video/) rather than from
 * the Higgsfield CDN they were rendered on. The CSP only allows media from our
 * own origin, and hosting them here means the video can't break because a
 * third party rotated a link. The <video> element only exists while the player
 * is open, so the 7 to 8 MB file never downloads for anyone who doesn't press
 * play. The landing page itself only loads the poster. */
const SOURCES: Record<string, { video: string; poster: string }> = {
  en: { video: "/video/intro-en.mp4", poster: "/video/intro-en.jpg" },
  fr: { video: "/video/intro-fr.mp4", poster: "/video/intro-fr.jpg" },
};

export function IntroVideo({ className = "" }: { className?: string }) {
  const { t, lang } = useT();
  const [open, setOpen] = useState(false);
  const src = SOURCES[lang] ?? SOURCES["en"]!;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`group relative block w-full overflow-hidden rounded-[22px] border border-[var(--gold-light)]/40 bg-[var(--landing-card)] text-left shadow-[0_18px_40px_oklch(0.25_0.07_40/0.35)] transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none ${className}`}
      >
        <img
          src={src.poster}
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--gold-light)] shadow-[0_10px_28px_oklch(0.2_0.06_40/0.5)] transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none sm:size-20"
        >
          <svg
            viewBox="0 0 24 24"
            className="ml-1 size-7 text-[oklch(0.3_0.08_40)] sm:size-8"
            fill="currentColor"
          >
            <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
          </svg>
        </span>
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-5 py-4 text-white">
          <span
            className="text-[15px] font-semibold sm:text-[16px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("landing.video.cta")}
          </span>
          <span className="label-caps shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11px]">
            {t("landing.video.length")}
          </span>
        </span>
      </button>
      <IntroVideoPlayer open={open} onClose={() => setOpen(false)} src={src} />
    </>
  );
}

function IntroVideoPlayer({
  open,
  onClose,
  src,
}: {
  open: boolean;
  onClose: () => void;
  src: { video: string; poster: string };
}) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  // Held in a ref so a new arrow function from the parent on every render
  // doesn't re-run the open effect and yank focus back to the close button.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const titleId = useId();
  const { t } = useT();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      // Keep Tab inside the player: the close button and the video controls.
      const panel = panelRef.current;
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>("button, video"));
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
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[3px]" aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[1100px] animate-[popover-in_200ms_ease-out] motion-reduce:animate-none"
      >
        <div className="mb-3 flex items-center justify-between gap-4 text-white">
          <h2
            id={titleId}
            className="text-[15px] font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("landing.video.title")}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("landing.video.close")}
            className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        {/* key on the file: switching the site's language while the player is
            open swaps to the other cut instead of carrying on in the old one. */}
        <video
          key={src.video}
          src={src.video}
          poster={src.poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="aspect-video w-full rounded-[18px] bg-black shadow-2xl"
        />
      </div>
    </div>,
    document.body,
  );
}
