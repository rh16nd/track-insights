# v0 prompt — PodiumCall

Paste everything below the line into v0. It is written to get **visual
direction** back, not code to paste into this repo — see "Why" at the bottom
of this file before you use the output.

---

You are redesigning the visual layer of **PodiumCall**, a live analytics site
for the 2026 Wanda Diamond League Final (Brussels, 4–5 September). Its
audience is athletics analysts and fans who want to argue with the numbers,
not a general dashboard audience.

**Your job is visual only. Do not invent, restructure, or remove information.**

## Hard constraints

1. **Do not change any data, label, number, or claim.** Every figure on this
   site is scraped from World Athletics and the project's first principle is
   that nothing is ever fabricated, hardcoded, or placeholder. If you need
   sample values, use the ones I give you and no others. Never add a stat
   that isn't in my markup, and never invent an athlete name.
2. **Keep every section and every piece of copy.** You may restyle, resize,
   regroup and re-space. You may not delete a panel, drop a column, shorten
   an explanatory note, or replace real copy with lorem.
3. **Keep the existing identity.** This is a warm, earthy athletics-track
   palette, not a generic SaaS dashboard. Do not introduce blue/violet
   gradients, glassmorphism, neon, or a dark "analytics" theme.
4. **No new dependencies, no icon libraries, no chart libraries.** If a chart
   is needed, inline SVG only.

## The design system you must work inside

Colors (CSS custom properties, oklch — use these exact tokens, do not
substitute hexes):

```
--background: oklch(0.54 0.105 40)    /* warm terracotta page ground */
--foreground: oklch(0.19 0.03 40)     /* near-black brown text */
--card: oklch(0.97 0.012 75)          /* warm cream card surface */
--secondary: oklch(0.91 0.02 60)      /* muted sand */
--muted-foreground: oklch(0.42 0.045 45)
--border: oklch(0.85 0.035 55)
--terracotta: oklch(0.545 0.164 38.5)
--terracotta-strong: oklch(0.45 0.164 38.5)
--gold: oklch(0.593 0.128 68)
--gold-strong: oklch(0.49 0.128 68)
--gold-light: oklch(0.8 0.11 68)
--brick: oklch(0.406 0.121 40)
```

Type:
- Display / headings: **Space Grotesk**
- Body / UI: **Barlow**
- All figures use tabular numerals.

Existing conventions to respect:
- Content sits on cream `--card` panels against the terracotta page ground.
- `label-caps` = small uppercase label, letter-spaced, muted.
- Accent gradient used for active states: `linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)`.
- Gold is reserved for "best / winner / peak". Terracotta is the primary
  accent. Muted grey-brown is for secondary text — never pure grey.

## What I want from you

Show me a stronger visual treatment of the page below. Specifically:

- Sharper hierarchy — right now everything is a panel of similar weight, and
  a reader can't tell at a glance what the most important thing on the page
  is.
- A more distinctive, less "dashboard" feel. This is a sports analysis
  publication, not an admin console. Editorial confidence is welcome.
- Better density handling: this page carries dense tables and a matrix, and
  they should feel deliberate and readable rather than cramped.
- Genuine use of the palette. Gold and terracotta should mean something, not
  be sprinkled.

Give me **two distinct directions**, not one. For each, output a single
self-contained HTML file with inline `<style>` using the tokens above, at
1440px and at 375px. Static markup is fine — no framework, no data fetching.

## The page and its real content

Attach **`V0-SAMPLE-DATA.json`** (in this repo, next to this file) and add:

> Here is the real data this page renders — real athletes, real marks, real
> head-to-head records, scraped from World Athletics. Design against these
> exact values. The men's 100m field is Seville, Eseme, Bednarek, Leotlela,
> Bromell, Anthony, Simbine and Omanyala.

Then name the page you want redesigned. Best candidates, in order:

1. **Projections** (`/projections`) — the densest and most distinctive page.
   Sections in order: a hero with the model's pick, a discipline picker,
   three stat tiles, the contenders list, an 8×8 head-to-head matrix with a
   "Last 6" form strip, a "what separates them" comparison table, a season
   form chart, storyline cards, and a cross-discipline confidence list.
   The matrix is the centrepiece — it should not look like a spreadsheet.

2. **Athlete profile** (`/athlete/men_100m/Oblique SEVILLE`) — hero with
   photo, season stats grid, record and ranking (honours + world rank),
   competition record, season-by-season table, season shape bar chart,
   head-to-head list.

3. **A page that does not exist yet: discipline vs discipline.** Which of
   the 32 events are genuinely deep and which are one athlete and a gap.
   This one has no incumbent design, so you have the most freedom — invent
   the layout. Data: each discipline's median World Athletics score, its top
   score, how many athletes are ranked, and the share of marks set indoors.

## One more thing

Do not output a Next.js app, shadcn/ui components, or a `tailwind.config.js`.
I want a single static HTML file per direction so I can read the design
decisions directly. The real site is React 19 + TanStack Router + Tailwind 4
with its own component library, and I will port your direction by hand.
