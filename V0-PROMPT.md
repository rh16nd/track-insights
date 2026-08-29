# v0 prompt — full-site redesign

**How to use it:** attach `V0-SAMPLE-DATA.json` (same folder) to the v0 chat,
then paste everything below the line as your message.

**What to bring back:** the generated HTML or screenshots — not code to paste
into this repo. This app is React 19 + TanStack Router + Tailwind 4 with its
own component library; v0 outputs Next.js + shadcn/ui, which will not compile
here and would replace the identity. The design gets ported by hand.

---

Redesign an entire website. I've attached the real data it renders — real
athletes, real marks, real head-to-head records, scraped from World
Athletics. Design against those exact values and **never invent an athlete
name or a statistic**.

## The product

**PodiumCall** — a live analytics site that predicts the podium at the 2026
Wanda Diamond League Final (Brussels, 4–5 September) across all 32 track and
field disciplines, and lets you interrogate why. A RandomForest model trained
on real scraped results does the predicting; the site's whole promise is that
every number on it is real and sourced, never fabricated.

The audience is athletics analysts and serious fans. People who want to
**argue with the model**, not just read its output.

## What is wrong with it now, and what "better" means

It reads like a competent admin dashboard: rows of similar-weight cards,
panels of equal visual priority, nothing that tells you what matters most on
a page. It is clean but anonymous — you could swap the data for SaaS metrics
and it would look unchanged.

I want it to read like **a sports analysis publication**. Editorial
confidence. A clear focal point per page. Dense data presented as though
someone chose how to present it. Distinctive enough that a screenshot is
recognisable.

## Non-negotiable constraints

1. **Never change, invent, or remove data.** Every figure is scraped. Do not
   add a stat that isn't in the JSON, don't round differently, don't invent
   athletes. If a page has an explanatory note about what a number means,
   keep it — those notes exist because the numbers are easy to misread.
2. **Keep every page and every section.** Restyle, resize, regroup, re-space,
   change hierarchy. Do not delete panels or shorten explanatory copy.
3. **Keep the identity below.** Warm athletics-track palette. No blue/violet
   gradients, no glassmorphism, no neon, no dark "analytics" theme.
4. **No shadcn/ui, no Next.js, no icon or chart libraries, no
   tailwind.config.js.** Inline SVG only, if a chart needs one.

## The design system — use these exact values

CSS custom properties, oklch. Do not substitute hexes.

```
--background: oklch(0.54 0.105 40)     /* warm terracotta page ground */
--foreground: oklch(0.19 0.03 40)      /* near-black brown */
--card: oklch(0.97 0.012 75)           /* warm cream card surface */
--secondary: oklch(0.91 0.02 60)       /* muted sand */
--muted-foreground: oklch(0.42 0.045 45)
--border: oklch(0.85 0.035 55)
--terracotta: oklch(0.545 0.164 38.5)
--terracotta-strong: oklch(0.45 0.164 38.5)
--gold: oklch(0.593 0.128 68)
--gold-strong: oklch(0.49 0.128 68)
--gold-light: oklch(0.8 0.11 68)
--brick: oklch(0.406 0.121 40)
```

- Headings: **Space Grotesk**. Body: **Barlow**. Tabular numerals on every figure.
- Content sits on cream `--card` panels against the terracotta `--background`.
- **Gold means best / winner / peak.** Terracotta is the primary accent.
  Secondary text is muted brown — never pure grey.
- Active state gradient: `linear-gradient(100deg, var(--terracotta) 0%, var(--gold-strong) 100%)`.
- There is an existing running-track texture (repeating white lane lines on
  brick) used sparingly as a hero surface. Keep that idea; use it better.
- Small uppercase letter-spaced labels are a recurring device.

## The eight pages

**1. Landing (`/`)** — the pitch. What the model is, that everything is real
scraped data, live model confidence by discipline, days to Brussels,
disciplines tracked. Currently the weakest page; it should make someone want
to explore.

**2. Dashboard (`/dashboard`)** — the overview. Days to final, disciplines,
meets done, model accuracy. "Most likely to reach the podium" (each athlete
is the top pick in a *different* discipline — this is a common misreading and
the design must not imply they're racing each other). Season progress.
Upcoming calendar. Athletes removed for injury/withdrawal, with sources.

**3 & 4. Track (`/track`) and Field (`/field`)** — a discipline picker plus
the projected top 8 for the chosen event: rank, athlete, nationality, season
best, podium probability. Note the rank column is ordered by season best
while the percentage is podium chance, so the two disagree on purpose.

**5. Qualifying (`/qualification`)** — the race for a place at the Final.
Real Diamond League points, the qualification cut line, and each athlete's
status: Through / Out / Tie-break. Every scoring meeting is now run, so some
athletes are separated only by World Athletics' tie-break.

**6. Performance Index (`/stats`)** — the whole season on one scale using
World Athletics' scoring points, so a discus throw and an 800m are directly
comparable. Best performances of the season across all events, plus how deep
each of the 32 events is. **Currently 5.3 screens long with an undisclosed
32-row table — this page most needs your help.**

**7. Schedule (`/schedule`)** — the 15-meeting season calendar, each meeting
done/next/upcoming, with the Final marked.

**8. Projections (`/projections`)** — the deepest page, and the one that
should feel most like the product's centre. Per discipline: the model's pick
with podium probability, three stat tiles, the contenders list, then the
analysis — **an 8×8 head-to-head matrix of every pairing in the field** with
a "last 6 finishes" form strip, a "what separates them" comparison table
(top-3 average, steadiness, races, podium rate, month they peaked), a season
form chart, computed storylines, and a cross-discipline confidence list.
**The matrix is the centrepiece.** It should look like something an analyst
would print out, not like a spreadsheet.

**Plus: the athlete profile (`/athlete/...`)** — photo hero, season stats,
World Athletics honours and world ranking, competition record with win and
podium rates, season-by-season table, a season-shape bar chart, and
head-to-head records.

## What I want back

Design **the whole site as one coherent system**, not eight unrelated pages.

1. A short statement of the direction — what you decided and why.
2. The shared language: type scale, spacing rhythm, how a panel is built, how
   a data table is styled, how the nav works.
3. **Full HTML for the Landing page, Projections, Performance Index and the
   athlete profile** — self-contained files with inline `<style>`, at 1440px
   and 375px.
4. The remaining four pages as either HTML or a clear layout description
   reusing the same system.

Give me **two distinct directions** at step 1 so I can choose, then build out
the one I pick. Ask me which before writing all four pages.
