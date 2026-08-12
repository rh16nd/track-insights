# Track Insights

Build a full-screen sports analytics dashboard for a Diamond League athletics prediction system called "2026 DL Predictor" by Wanda Diamond League.

Layout:

Fixed sidebar on the left (200px wide) with a dark terracotta/brick red athletics track as the background — straight lane lines running top to bottom with lane numbers 1–7 at the top, heavy grain texture like real rubberized track surface, a solid white finish line near the bottom. Dark overlay so white text is readable on top.

Main content area on the right with a light cream/off-white background (#f5f0eb)

Fixed topbar showing the current page title, subtitle with last updated date and days to final, and a "LIVE SEASON" status pill in terracotta red

Sidebar navigation items:

Section: Overview → Dashboard, Schedule

Section: Predictions → Track events, Field events

Section: Analysis → Projections

Footer: "Refresh predictions ↗" button

Dashboard page (default):

Row of 4 stat cards: Meets Done (11 of 14), Days to Final (23), Disciplines (13), Model Accuracy (44%)

Two column layout below: left panel shows "Top predicted winners" list with medal emoji, athlete name, discipline, projected mark, win probability percentage. Right panel shows season progress bar (78%) and a mini calendar showing last 5 meets with done/next/upcoming/final status dots and colored badges

Schedule page:

Full list of all 15 Diamond League meets in order — May through September — each row showing meet number, colored status dot, date, city name, and status badge. Done meets are muted, next meet is bold, Brussels Final is in gold

Track events page:

Discipline tab pills at the top (Men 100m, Women 100m, Men 200m, Women 200m, Men 400H, Women 400H, Men 800m, Women 800m, Men 1500m, Women 1500m)

Table below showing projected top 8 for selected discipline: rank number, athlete name, nationality code, Q badge for qualified athletes, projected mark, win probability with a small inline bar

Field events page:

Same layout as track events but with tabs: Men PV, Women PV, Men LJ

Projections page:

Two column: left shows confidence bars by discipline (horizontal bar per discipline showing win prediction confidence %), right shows a line chart of season trajectory for Men's 100m with a dashed projected line to the final

Below: 2x2 grid of "key storyline" cards with a terracotta label and description text

Color palette:

Sidebar: deep brick red (#8B3A1A) with grain texture, white text

Accent: terracotta (#c84b20) for all highlights, badges, probability bars, active states

Gold accent (#BA7517) for the Brussels Final and special callouts

Main background: cream (#f5f0eb)

Cards: white (#ffffff) with light border (#e8ddd0)

Text: dark brown (#1a1008) primary, muted (#9a8070) secondary

Typography: System font stack, clean and minimal. Section labels in small caps with letter spacing. Numbers in tabular numerals.

No dark mode. Light mode only. No box shadows — use subtle borders instead. No rounded corners larger than 8px.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/67904055-f322-4aa5-9fb3-ba3d2855bf8b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
