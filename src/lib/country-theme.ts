import { IOC_TO_ISO2 } from "./flags";
import { FLAG_PALETTE } from "./flag-palette";
import type { FlagPalette } from "./flag-palette";
import type { CSSProperties } from "react";
import type { PageGround } from "@/components/dl/shell";

/** The two lookups that turn a World Athletics nationality code into a page
 * theme.
 *
 * They live here rather than in ./flags on purpose. NatFlag reads
 * IOC_TO_ISO2 and NatFlag is on nearly every page, so anything ./flags
 * imports rides along in the shared chunk -- and the generated palette is 136
 * nations of colour that only the country route ever reads. Keeping the import
 * on this side of the line keeps it in that route's own chunk. */
export function countryPalette(ioc: string): (FlagPalette & Pick<PageGround, "surface">) | null {
  const iso = IOC_TO_ISO2[ioc.toUpperCase()];
  const palette = (iso && FLAG_PALETTE[iso]) || null;
  if (!palette) return null;
  // The panels take the band's colour, the nation's own near-black, so the
  // page reads as the country's all the way down (the Terra re-theme).
  return {
    ...palette,
    surface: { "--card": palette.band, "--card-wash": "none" } as CSSProperties,
  };
}

/** The basename of a nation's flag SVG in `public/flags/`, or null when we
 * have no verified flag for it -- the same graceful nothing NatFlag falls
 * back to. For the places that render the flag at a size where it is the
 * subject rather than a marker. */
export function flagFile(ioc: string): string | null {
  return IOC_TO_ISO2[ioc.toUpperCase()] ?? null;
}
