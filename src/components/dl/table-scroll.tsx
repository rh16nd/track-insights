import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useT } from "@/lib/i18n";

/** A table that keeps all its columns on a phone and slides sideways.
 *
 * The user (2026-09-22): "in the mobile version they dont show the whole
 * table, there should be a way to slide the table to see all the info". The
 * tables used to drop their narrower columns below sm and fold a few of them
 * under the athlete's name, which put the rest out of reach: the top 20's
 * mark and meets, Results' own columns, the Qualification standings.
 *
 * They were dropped because the page itself scrolled sideways instead of the
 * table -- ten tables ran off a 360px screen with their last columns cut off.
 * That was never the table's width: an `overflow-x-auto` box inside a grid or
 * flex parent takes `min-width: auto`, so the parent grew to the table and
 * the whole page went with it. `min-w-0` here holds the box to its column, so
 * the table scrolls inside it and the page stays still.
 *
 * What the reader gets: the ground fading in at whichever edge has more
 * behind it, and one line telling them it slides, until they slide it. The
 * box takes focus so it can be scrolled with a keyboard, and is announced as
 * a region, which is what a scrollable box owes a screen reader. */
/** Classes for a cell that stays put while the rest of the table slides.
 *
 * Without it the far end of a wide table is a column of figures with nobody's
 * name against them. `left` is the distance from the box's edge, so a table
 * that opens with a narrow rank column pins that at `left-0` and the name at
 * the rank's own width.
 *
 * `ground` is the colour the cell paints while the table is slid, since the
 * rest of the row passes underneath it, and it is passed in rather than
 * assumed: a tinted row (the top three of a call) needs its own tint, or the
 * pinned end of the row would be a different colour from the rest of it. Pass
 * it qualified with the `group-data-[slid=true]:` variant, so that an
 * untouched table paints nothing over the page's ground and only a table
 * being read sideways carries the block of colour. */
export function pinned(ground: string, left = "left-0", edge = false) {
  return [
    `sticky ${left} z-10`,
    ground,
    // A hairline on the last pinned column while it is holding, so the join
    // reads as an edge rather than as a row that stopped halfway.
    edge ? "group-data-[slid=true]:shadow-[1px_0_0_0_var(--border)]" : "",
  ].join(" ");
}

export function TableScroll({
  children,
  label,
  ground = "card",
  className = "",
}: {
  children: ReactNode;
  /** What this table is, for the scrollable region's name. */
  label: string;
  /** Which ground the fades blend into: a panel's, or the page's own for a
   * table that sits bare on it. */
  ground?: "card" | "page";
  className?: string;
}) {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState({ left: false, right: false, moved: false });

  const read = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // A pixel of slack: zoom and fractional layout leave sub-pixel remainders
    // that would otherwise read as "there is more".
    setMore((held) => ({
      left: el.scrollLeft > 1,
      right: max - el.scrollLeft > 1,
      moved: held.moved || el.scrollLeft > 1,
    }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    read();
    el.addEventListener("scroll", read, { passive: true });
    // The table's width changes under it: data lands, the language switches,
    // the phone turns. ResizeObserver catches all three; a resize listener
    // would miss the first two.
    const ro = new ResizeObserver(read);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", read);
      ro.disconnect();
    };
  }, [read]);

  const fade = ground === "card" ? "from-card" : "from-background";
  return (
    // `group` and `data-slid` drive the pinned columns below: they paint their
    // ground only while the table is actually held to one side, so a table
    // nobody has touched shows the page's own ground straight through.
    <div className={`group relative min-w-0 ${className}`} data-slid={more.left ? "true" : "false"}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="overflow-x-auto focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ring)]"
      >
        {children}
      </div>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r ${fade} to-transparent transition-opacity duration-200 ${more.left ? "opacity-100" : "opacity-0"}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l ${fade} to-transparent transition-opacity duration-200 ${more.right ? "opacity-100" : "opacity-0"}`}
      />
      {more.right && !more.moved && (
        <p className="mt-2 text-[11.5px] text-muted-foreground sm:hidden">{t("table.slideHint")}</p>
      )}
    </div>
  );
}
