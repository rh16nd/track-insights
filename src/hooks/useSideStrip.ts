import { useEffect, useRef, useState } from "react";

/** A sideways row of cards that pages with arrows, shared by the dashboard's
 * favourites and the Asian Games call so the two rows behave the same: where
 * the row sits against either end, and a way to move it on. */
export function useSideStrip<T extends HTMLElement>(count: number) {
  const row = useRef<T>(null);
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

  return { row, edge, page };
}

/** Out to the edges of the page's column (the pages all pad it px-6/8/12), so
 * a card is cut by the screen's edge rather than by an invisible box: that cut
 * is what says there is more to the side. Each stop snaps to a card's edge. */
export const STRIP_ROW =
  "side-strip -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-[18px] overflow-x-auto px-6 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12";

export const STRIP_ITEM = "w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-[300px]";
