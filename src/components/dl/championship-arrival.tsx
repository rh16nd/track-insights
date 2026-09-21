import { useEffect, useState, type CSSProperties } from "react";
import type { ChampionshipArrivalColours } from "@/lib/championship-themes";

/** How long the overlay stays mounted. The keyframes (styles.css, "arrival")
 * finish at 1.1s and leave everything invisible, so this only tidies up. */
const MOUNTED_MS = 1300;

/** The moment of arriving at a championship's page, on every visit (the user,
 * 2026-09-21): the event's colours sweep across the screen and its emblem
 * swells between them, then everything clears onto the page's own cover.
 *
 * Pure CSS keyframes that end invisible (`forwards`), so the page is never
 * left covered even if this component is slow to unmount. The overlay takes no
 * pointer events, so the menu works while it plays, and it is hidden under
 * reduced motion. The colours come from the championship's theme, so the next
 * championship arrives in its own. */
export function ChampionshipArrival({ colours }: { colours: ChampionshipArrivalColours }) {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(false), MOUNTED_MS);
    return () => window.clearTimeout(id);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="arrival pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      <div
        className="arrival-ground absolute inset-0"
        style={{ backgroundColor: colours.ground }}
      />
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col">
        {colours.bands.map((colour, i) => (
          <span
            key={colour}
            className="arrival-band block h-[7vh] min-h-10"
            style={{ backgroundColor: colour, "--band-i": i } as CSSProperties}
          />
        ))}
      </div>
      <span
        className="arrival-disc absolute left-1/2 top-1/2 size-[clamp(140px,22vw,260px)] rounded-full"
        style={{ backgroundColor: colours.disc }}
      />
    </div>
  );
}
