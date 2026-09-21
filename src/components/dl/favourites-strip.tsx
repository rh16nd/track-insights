import { useEffect, useRef, useState, type ReactNode } from "react";
import { BareFrame } from "@/components/dl/bare-frame";
import { useT } from "@/lib/i18n";

/** The dashboard's favourites as one sideways row of photo cards, with no box
 * around it (the user, 2026-09-22: a strip to go through every athlete, keeping
 * the big photo cards). Swipe or scroll it, or page through with the arrows;
 * each stop snaps to a card's edge. */
export function FavouritesStrip({
  title,
  subtitle,
  action,
  count,
  renderCard,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  count: number;
  renderCard: (index: number) => ReactNode;
}) {
  const { t } = useT();
  const row = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const update = () =>
      setEdge({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [count]);

  // Most of a screen at a time, so the last card of one page is still in view
  // on the next and the reader keeps their place.
  const page = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow = (dir: 1 | -1) => (
    <button
      type="button"
      onClick={() => page(dir)}
      disabled={dir === -1 ? edge.start : edge.end}
      aria-label={t(dir === -1 ? "dashboard.favourites.prev" : "dashboard.favourites.next")}
      className="glass inline-flex size-10 items-center justify-center rounded-full text-foreground transition-[opacity,transform] duration-150 ease-out hover:bg-white/15 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[18px]"
        aria-hidden="true"
      >
        <path d={dir === -1 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );

  return (
    <BareFrame
      level={2}
      title={title}
      subtitle={subtitle}
      className="mt-14"
      action={
        <div className="flex items-center gap-4">
          {action}
          <div className="flex items-center gap-2">
            {arrow(-1)}
            {arrow(1)}
          </div>
        </div>
      }
    >
      {/* Out to the edges of the page's column, so a card is cut by the
          screen's edge rather than by an invisible box: that cut is what says
          there is more to the side. */}
      <ul
        ref={row}
        aria-label={t("dashboard.favourites.stripLabel")}
        className="favourites-strip -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-[18px] overflow-x-auto px-6 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12"
      >
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-[300px]">
            {renderCard(i)}
          </li>
        ))}
      </ul>
    </BareFrame>
  );
}
