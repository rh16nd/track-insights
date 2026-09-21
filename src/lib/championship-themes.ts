import type { CSSProperties } from "react";
import type { PageGround } from "@/components/dl/shell";

/** Every championship wears its own competition's colours: its page, its nav
 * tab, and its box on the Results page. A tradition the user set on
 * 2026-09-14, when the Asian Games page was planned: the Diamond League in its
 * blue, the Ultimate in World Athletics' black and purple with gold, and the
 * Asian Games in the colours of the Aichi-Nagoya emblem and the OCA's red sun.
 *
 * Every text colour here is MEASURED, not picked. Each was composited the way
 * the page paints it (blooms at their peak, the grain tile, the head band's warm
 * wash, translucent white text) and read as a WCAG ratio; the numbers sit beside
 * the values. It is the method scripts/make-flag-palette.py uses for the
 * country pages. Change a colour, measure it again.
 *
 * The id is the one the API sends (`theme` on /api/results and
 * /api/championship), from src/championships.py in athletics-predictor. */
export type ChampionshipThemeId = "diamondLeague" | "ultimate" | "asianGames";

export type ChampionshipTheme = {
  /** The championship page's ground, for Shell. Null for a championship that
   * never had a page of its own: the Diamond League Final lived on the
   * site's own pages. */
  page: PageGround | null;
  /** The nav tab's text colour on the dark glass menu, at rest and on the
   * active pill. Null when the championship never held the tab. */
  navAccent: string | null;
  /** Tokens for the championship's box on the Results page. Set on the box,
   * they re-dress everything inside it, ResultComparison included: styles.css
   * registers the colours with `@theme inline`, so `text-foreground` compiles
   * to `var(--foreground)` and reads whichever value the nearest box sets. */
  box: CSSProperties;
};

/** The tokens a dark box needs. Ratios are against `--card` unless noted. */
function box(tokens: {
  card: string;
  foreground: string;
  muted: string;
  border: string;
  secondary: string;
  fill: string;
  onFill: string;
  accent: string;
  gold: string;
}): CSSProperties {
  return {
    "--card": tokens.card,
    // Panel's cream wash is a background-image and would paint over --card,
    // leaving this box's light text on cream (styles.css, card-surface).
    "--card-wash": "none",
    "--foreground": tokens.foreground,
    "--muted-foreground": tokens.muted,
    "--border": tokens.border,
    "--secondary": tokens.secondary,
    // The active event pill and the text on it.
    "--terracotta": tokens.fill,
    "--primary-foreground": tokens.onFill,
    "--ring": tokens.fill,
    // The verdict words ("Called it", "Upset") and the arrows.
    "--terracotta-strong": tokens.accent,
    "--gold-strong": tokens.gold,
    colorScheme: "dark",
  } as CSSProperties;
}

export const CHAMPIONSHIP_THEMES: Record<ChampionshipThemeId, ChampionshipTheme> = {
  diamondLeague: {
    page: null,
    navAccent: null,
    box: box({
      card: "#11254b", // Diamond League navy
      foreground: "#f0f6fc", // 13.93
      muted: "#b4c6db", // 8.72; 8.05 on a hovered row; 7.06 on a chip
      border: "#3b4d6e",
      secondary: "#213459",
      // Lifted from #44a2d9 (6.18 under its text) to clear 7:1: the user found
      // these boxes hard to read, so AA alone is not the target here.
      fill: "#5bb0e0", // 6.28 against the card (non-text)
      onFill: "#07183a", // 7.27 on the fill, 11.37 on the gold (place badges)
      accent: "#7dc7f7", // 8.25
      gold: "#f5cb70", // 9.87
    }),
  },
  ultimate: {
    // Moved here unchanged from Shell: near-black with violet blooms, the look
    // World Athletics gave the Ultimate.
    page: {
      ground: "#07050d",
      glow: ["#964ae0", "#602ab2"],
      blooms:
        "radial-gradient(ellipse 1200px 720px at 84% -8%, rgba(150,74,224,0.40), transparent 62%)," +
        "radial-gradient(ellipse 1000px 640px at 2% 104%, rgba(96,42,178,0.34), transparent 58%)," +
        "radial-gradient(ellipse 760px 520px at 50% 46%, rgba(72,30,140,0.20), transparent 60%)",
      trackCurve: false,
    },
    // The Terra bar is dark glass, so the accent is the light violet now.
    navAccent: "var(--violet-strong)",
    box: box({
      card: "#0c0718",
      foreground: "#f6f4fb", // 18.14
      muted: "#c1b8d4", // 10.50; 9.93 hovered; 8.85 on a chip
      border: "#453065",
      secondary: "#241737",
      // A LIGHT violet under near-black text, not white text on a deep violet.
      // The podium place badge paints this text on a gradient from the fill to
      // the gold, and white measured 1.75 at the gold end. Now 8.23 on the
      // fill, 11.82 on the gold, and the fill is 8.23 against the card.
      fill: "#b897f0",
      onFill: "#0c0718",
      accent: "#f0c24a", // 11.82, the Ultimate's gold
      gold: "#f0c24a",
    }),
  },
  asianGames: {
    // A green field under a gold evening light. The red sun is NOT a bloom on
    // this ground: red laid over green composites to brown at any strength
    // that shows, so the sun is drawn as a solid disc in the page's hero, where
    // it can be red.
    page: {
      ground: "#002912", // oklch(0.24 0.07 158)
      glow: ["#4fae67", "#f4c352"],
      // Measured at each bloom's peak: white/92 6.03 on the page and 4.80 in the
      // head band; white/90 5.86 and 4.67; --gold-on-canvas 5.93 and 4.66, the
      // tightest reading on the page.
      blooms:
        "radial-gradient(ellipse 1200px 720px at 84% -8%, oklch(0.66 0.14 152 / 0.30), transparent 62%)," +
        "radial-gradient(ellipse 1000px 640px at 2% 104%, oklch(0.84 0.13 85 / 0.14), transparent 58%)",
      trackCurve: false,
    },
    // The emblem's green, lifted to read as text on the dark glass bar.
    navAccent: "oklch(0.82 0.13 155)",
    box: box({
      card: "#002a16",
      foreground: "#f1f7f2", // 14.40
      muted: "#b8cebc", // 9.40; 8.70 hovered; 7.70 on a chip
      border: "#29523b",
      secondary: "#0f3924",
      // Coral, not the sun's red: red measured 2.91 against this green, under
      // the 3:1 a control boundary needs. This coral is 6.93, lifted from
      // #f18a76 so the text on it clears 7:1 rather than 6.99.
      fill: "#f39382",
      onFill: "#00220f", // 7.53 on the fill, 10.99 on the gold (place badges)
      accent: "#fca391", // 8.05
      gold: "#f8ca65", // 10.17
    }),
  },
};

/** The sun and the emblem's line, for the Asian Games hero. */
export const ASIAN_GAMES_SUN = "#db2c2b"; // 3.35 against the hero ground (non-text)
export const ASIAN_GAMES_STRIPE = ["#8e47cd", "#f4c352", "#33ac5a"] as const;

export function championshipTheme(id: string | null | undefined): ChampionshipTheme | null {
  return id && id in CHAMPIONSHIP_THEMES ? CHAMPIONSHIP_THEMES[id as ChampionshipThemeId] : null;
}
