---
name: PodiumCall
description: Podium predictions for the 2026 Diamond League Final, built on real scraped World Athletics results.
colors:
  terracotta: "oklch(0.545 0.164 38.5)"
  terracotta-strong: "oklch(0.45 0.164 38.5)"
  terracotta-light: "oklch(0.74 0.15 38.5)"
  brick: "oklch(0.406 0.121 40)"
  canvas: "oklch(0.52 0.105 40)"
  canvas-deep: "oklch(0.47 0.095 40)"
  gold: "oklch(0.593 0.128 68)"
  gold-strong: "oklch(0.49 0.128 68)"
  gold-light: "oklch(0.8 0.11 68)"
  gold-on-canvas: "oklch(0.97 0.08 68)"
  card: "oklch(0.97 0.012 75)"
  sand: "oklch(0.941 0.014 76)"
  ink: "oklch(0.19 0.03 40)"
  ink-muted: "oklch(0.42 0.045 45)"
  border: "oklch(0.85 0.035 55)"
  on-canvas: "oklch(0.97 0.01 80)"
  on-canvas-muted: "oklch(0.955 0.018 60)"
  destructive: "oklch(0.55 0.2 27)"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(44px, 11vw, 96px)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.12em"
  figure:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tabular-nums"
rounded:
  sm: "3px"
  md: "5px"
  lg: "8px"
  pill: "999px"
  band: "44px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "40px"
  band: "112px"
components:
  button-primary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.terracotta-strong}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
    typography: "{typography.title}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.on-canvas}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  chip-live:
    backgroundColor: "{colors.card}"
    textColor: "{colors.on-canvas}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    typography: "{typography.label}"
---

# Design System: PodiumCall

## Overview

**Creative North Star: "The Track at Golden Hour"**

The surface *is* the visual world. The canvas is not a brand colour that happens to be warm — it is the terracotta of a synthetic running track, and everything sits on it the way a stadium's furniture sits on the track: cream paper laid down on the surface, lane lines running underneath, a 400m circuit drawn at the scale of the page. Gold is the low evening light crossing it, which is why it is reserved for the one lane that matters, the marker lapping the circuit, and the single word a headline is about. The system is warm, physical and specific to one sport; it should be impossible to reskin this as a generic analytics dashboard without the identity collapsing.

Density follows the material. Where the page is *the track* it is expansive and quiet — a hero can spend 1,300px saying one sentence. Where the page is *paper on the track* it is dense and tabular, because the content is real marks, ranks and probabilities and the reader is scanning. The two never blur: cream is where you read, terracotta is where you look.

The aesthetic discipline that matters most here is inherited from the product, not the palette: **nothing on screen may be prettier than it is true.** Figures are live, sourced and tabular; a number the API cannot supply is stated as absent rather than filled. Confirmed anti-reference: the dark "night meet under floodlights" palette, explored deliberately in an earlier round and set aside for the lighter warm canvas — do not re-propose it. Also rejected: generic dark-mode-SaaS-black, which the first warm pass drifted into before the chroma was raised.

**Key Characteristics:**
- A literal running track as the substrate: lane texture on every page, the full 400m circuit on the landing hero.
- Cream paper surfaces floating on a saturated terracotta canvas; value shift, not shadow, creates depth.
- Gold used sparingly and always as *light* — the accent lane, the moving marker, one word, one unit.
- Tabular figures everywhere a number appears, because every number is real.
- Type does the shouting: one display face allowed to reach 96px, everything else restrained.

## Colors

A single warm hue family — terracotta through brick — carrying one gold accent and one near-white paper, with no cool colour anywhere in the system.

### Primary
- **Track Terracotta** (`oklch(0.545 0.164 38.5)`): the brand's saturated accent — primary buttons in-app, focus rings, rank emphasis, the dot on a live badge. Also the canvas hue at lower chroma.
- **Deep Terracotta** (`oklch(0.45 0.164 38.5)`): terracotta darkened purely for legibility as *text* on cream. Measures 7.34:1 on the card surface where base terracotta manages only 4.89:1. Use for figures and small caps on paper, never as a fill.
- **Brick** (`oklch(0.406 0.121 40)`): the deepest surface in the system — footers and the darkest band edges. The track seen in shadow.

### Secondary
- **Low Gold** (`oklch(0.593 0.128 68)`): decorative gold for fills, bars and borders on cream.
- **Legible Gold** (`oklch(0.49 0.128 68)`): gold as text or as a badge fill under white type; darkened so it still clears 4.5:1 against a *tinted* gold-15% surface, not just plain cream.
- **Gold Light** (`oklch(0.8 0.11 68)`): surface and accent gold on the dark canvas — pulsing badge dot, marker halo, gradient stops.
- **Canvas Gold** (`oklch(0.98 0.08 68)`): the only gold that is legible **on the terracotta canvas**. Solved against the canvas the page ACTUALLY PAINTS — the grain composite (157,90,66) — not the bare token. Base gold sits at the canvas's own lightness and tops out at 1.27:1 there — effectively invisible. Any gold on terracotta uses this token. Measures 4.63 on the body, 4.53 in the hero where a second grain layer stacks. Chroma stays at 0.08 on purpose: the alternative fix, lightening this token against the OLD canvas, needed 0.06 chroma and turned it warm white.

### Neutral
- **Track Canvas** (`oklch(0.52 0.105 40)`): the page. Deliberately byte-identical to the landing's `--landing-bg`; the two drifting apart is the exact "two different products stitched together" complaint that drove the theme unification, so change both or neither. Dropped from 0.54 on 2026-09-01 — see The Grain Rule.
- **Canvas Deep** (`oklch(0.47 0.095 40)`): banded strips within the canvas — the confidence ticker's rail.
- **Paper** (`oklch(0.97 0.012 75)`): every card, panel and reading surface. Warm, not white.
- **Sand** (`oklch(0.941 0.014 76)`): paper's quieter sibling for nested fills.
- **Ink** (`oklch(0.19 0.03 40)`) / **Ink Muted** (`oklch(0.42 0.045 45)`): text on paper. Muted measures 7.88:1 on Paper.
- **On Canvas** (`oklch(0.97 0.01 80)`) / **On Canvas Muted** (`oklch(0.955 0.018 60)`): text on terracotta. Against the composited canvas they measure 4.87 and 4.63 — there is no headroom to darken them.

### Named Rules

**The Grain Rule.** Every contrast figure in this document is solved against the canvas **as composited with the grain**, never against the bare token. `ambient-grain` is a fixed full-page overlay that paints on all nine pages, so the bare canvas is a colour the user never sees. Solving against it was wrong by about a third of a point in the direction that matters: at the old 0.54 it put `--landing-muted` at 4.33 and `--gold-on-canvas` at 4.23, both under AA, on 11-17.6px text sitewide, while this document claimed 4.67 and 4.55. The canvas dropped 0.54 -> 0.52 and Canvas Gold 0.97 -> 0.98 to fix it; measured, that took canvas-backed AA failures from 8 to 0 on the landing and 1 to 0 on the athlete page. The hero is the tight case — it stacks `track-grain` at 0.12 on top of `ambient-grain`, so solve there, not on a body section.

**The Lightness Rule.** Contrast on this canvas is a *lightness* problem, not an opacity one. The canvas sits at oklch 0.54, and any token near that lightness — `gold` at 0.593 above all — cannot be made visible by raising alpha; it tops out at 1.27:1 solid. Before placing a colour on terracotta, resolve it through a canvas and check the ratio. `getComputedStyle` returns `oklch()` strings here, and parsing them as RGB produced 121 out of 121 false readings once already.

**The Gold Is Light Rule.** Gold marks the thing the eye should land on and nothing else: one lane of the circuit, the lapping marker, the accent word in the display headline, the unit on a headline figure. It is never a background for content, never a second body colour, and never used to make an ordinary element feel important.

## Typography

**Display Font:** Space Grotesk (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Barlow (with `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`)

**Character:** Two low-contrast grotesques that agree with each other, chosen so the pairing reads as engineered rather than editorial. Barlow is drawn off Californian road-sign and licence-plate lettering — it carries stadium signage in its bones and its tabular figures suit a page of marks, ranks and times. Space Grotesk supplies the harder, more geometric voice for anything structural: headings, figures, small caps.

### Hierarchy
- **Display** (700, `clamp(44px, 11vw, 96px)`, 0.9, -0.035em): the landing hero headline and nothing else. The only type on the site permitted to be this loud, hard-broken into three short lines so it stacks into a block rather than spreading into a banner.
- **Headline** (600, 28–34px, 1.25): section openers, always paired with a label-cap eyebrow above them.
- **Title** (600, 18px, 1.12, -0.01em): athlete names, card titles, button text.
- **Body** (400, 15px, 1.6): prose. Measure capped at ~56–60ch; the hero lede and every section head hold that cap explicitly.
- **Label** (600, 11px, 0.12em, uppercase): the system's connective tissue — eyebrows, stat captions, table headers, chips. Carried by a single `label-caps` utility so the tracking cannot drift between surfaces.
- **Figure** (600, 32–40px, tabular): any headline number. Always `font-variant-numeric: tabular-nums`.

### Named Rules

**The Tabular Rule.** Every number on this site is real and most of them sit in a column or update live. Any figure gets `nums` (tabular numerals) so ranks align down a table and a counting number does not jitter its own width as it animates.

**The One Loud Voice Rule.** Exactly one element per page may use the display scale. If a second thing needs to shout, the first one was not doing its job.

## Layout

A single content column, `max-w-5xl` (1024px) with the gutters **inside** the box — `px-6`, `sm:px-10` — which puts the content edge at a consistent 158px on a 1274px viewport. Every band on a page shares that column: a full-bleed element (a marquee, a banded rail) may run to the viewport edge, but its *caption* returns to the column.

Vertical rhythm is one value per breakpoint: `py-20` below `sm`, `py-28` (112px) at and above it, giving a uniform 224px between the content of adjacent bands. Bands alternate cream and terracotta, and a cream band may be pulled up over the band above it with a large top radius (`rounded-t-[44px]`, `-mt-8`/`sm:-mt-13`) so the seam reads as a deliberate edge rather than a colour change.

Breakpoints are Tailwind's defaults; `sm` (640px) is the real hinge, where the layout goes from stacked to composed. Decorative geometry that scales with the viewport is capped in pixels — an SVG fitted by width grows in *both* dimensions as the window widens, which is how a background element ends up 87% of the screen on a large monitor.

## Elevation & Depth

Flat, with tonal layering. Depth is the value shift between the terracotta canvas and the cream paper on it, plus a 1px border where two like surfaces meet. There is no shadow scale and none should be introduced.

Shadows exist in exactly two places and both earn it by lifting something off the page rather than by decorating it.

### Shadow Vocabulary
- **Button lift** (`box-shadow: 0 8px 22px oklch(0.3 0.08 40 / 0.28)`): the single primary call-to-action on a terracotta band, paired with a 2px hover rise.
- **Plaque lift** (`box-shadow: 0 8px 20px oklch(0.3 0.08 40 / 0.07)`, gold-tinted at `0 14px 34px oklch(0.49 0.128 68 / 0.16)` for the centre plinth): the podium, where the metaphor is physical objects standing on steps.

### Named Rules

**The Border-First Rule.** When a surface needs separating from what is behind it, reach for a border or a value shift. A shadow is only correct when the element is meant to be *physically above* the page — which is true of two components and will stay that way.

## Shapes

Small radii, applied consistently: 3px / 5px / 8px, with 8px as the ceiling for cards and panels. Nothing in the reading layer is more rounded than 8px.

Two deliberate exceptions carry meaning rather than style. **Pills** (`999px`) mark anything that is a control or a status — buttons, chips, badges, the live ticker's items — so roundness signals interactivity. **The band radius** (`44px`) belongs to one move only: a cream band pulled up over the section above it, where the large corner reads as a sheet of paper laid on the track.

The recurring silhouette is the running track itself: the lane texture (`repeating-linear-gradient` at 100deg, two layers drifting at different speeds), and the 400m circuit — two straights, two bends, five lanes, a dashed finish line, a 100m start spur off the home straight, and a gold marker lapping it. Both are real geometry, derived from the sport's own measurements, not abstract ovals.

## Components

### Buttons
- **Shape:** pill (`999px`), `14px 24px`, Space Grotesk 600 at 15px, sentence case — not the label-caps treatment.
- **Primary on terracotta:** cream fill (`{colors.card}`), Deep Terracotta text, button-lift shadow, and a trailing arrow glyph. Hover raises it 2px.
- **Primary on cream:** a terracotta-to-gold gradient fill with near-white text; hover scales 1.02.
- **Ghost:** transparent with a 40%-opacity cream border and On Canvas text; hover fills to 10% cream.

### Chips
- **Style:** pill, cream at 14% over the canvas, 1px border, label-caps text, often with a leading dot.
- **State:** a live chip carries a gold dot with a slow pulsing ring; a status chip tints its own background from the status colour at ~15%.

### Cards / Containers
- **Corner:** 8px. **Background:** Paper. **Border:** 1px `{colors.border}` — solid, because a translucent edge is invisible on a near-white card.
- **Shadow:** none. See Elevation.
- **Padding:** 24px, tightening to 16px in dense table rows.

### Navigation
- Fixed full-bleed bar, Paper at 92% with a backdrop blur, 1px bottom border, 64px tall. Brand lockup left, label-caps links, one gradient pill call-to-action right. Every text colour inverts against the canvas treatment — the bar is cream, so it uses Ink, not On Canvas.
- **Mobile:** horizontally scrolling tab strip with the active tab auto-scrolled into view; discipline pickers collapse to a native `<select>` rather than a wall of pills.

### Signature: the Track Circuit
The landing hero's backdrop and the system's clearest statement of the North Star. A real 400m outline — straights, bends, five lanes at accurate relative spacing, a dashed finish line, and a 100m start spur whose length is *derived* from the geometry (each straight is 84.39m, so the sprint needs 15.61m of extension). One lane is drawn in Canvas Gold as the accent; a gold marker laps the circuit on a 14s `offset-path` loop and freezes under `prefers-reduced-motion`. The display headline sits **inside the infield**, never across the lanes.

## Do's and Don'ts

### Do:
- **Do** resolve any colour through a canvas before trusting its contrast, and check it against the GRAIN COMPOSITE (157,90,66), never the bare token. `getComputedStyle` returns `oklch()` here.
- **Do** use `--gold-on-canvas` for any gold placed on terracotta, and `--gold-strong` / `--terracotta-strong` for gold or terracotta used as text on cream.
- **Do** give every number `nums`, and derive every count from the data it describes rather than typing it beside it.
- **Do** keep gutters inside the `max-w-5xl` box so each band's content edge lands on the same column, and return full-bleed captions to that column.
- **Do** cap decorative geometry in pixels as well as percentages — a width-fitted SVG grows in both dimensions.
- **Do** honour `prefers-reduced-motion` by removing looping motion, not by parking it mid-cycle where a frozen highlight reads as a rendering fault.

### Don't:
- **Don't** reintroduce the dark floodlit palette. It was explored deliberately and set aside.
- **Don't** raise opacity to fix a colour that is invisible on the canvas; change the lightness instead.
- **Don't** add a shadow scale. Two components use shadow and that is the whole vocabulary.
- **Don't** put a second display-scale element on a page.
- **Don't** stack two different lane textures at different angles — one track, not a grid.
- **Don't** describe the model's output as picking a winner. The target is top-three membership, and "who wins" wording has had to be removed from this site three times.
- **Don't** let a landing-only change reach the shared classes every app page uses; split the class instead.
