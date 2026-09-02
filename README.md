# PodiumCall — web app

The frontend of **PodiumCall**: a website that predicts the podium for every discipline at the 2026 Wanda Diamond League Final. It draws the predictions, standings, and athlete analytics that come from the Python API in a separate repo, [athletics-predictor](https://github.com/rh16nd/athletics-predictor).

**Live:** https://podiumcall.vercel.app

---

## What it is

A read-only React app. Every number on it (podium probabilities, qualifying standings, head-to-head records, season form) is fetched live from the API. The frontend works nothing out for itself and stores no data of its own. It predicts *podium membership* (top 3), not the winner.

## Tech stack

- **React 19** + **TanStack Start** (SSR) + **TanStack Router** & **Query**
- **Tailwind CSS v4**, **Vite** (build), **Recharts** (charts)
- **Vercel Web Analytics** (cookieless)
- Hosted on **Vercel**; the API runs on **Render**

## Pages

Landing · Dashboard (the surest calls) · Track & Field (per-discipline tables) · Discipline detail (field depth + head-to-head) · Athlete profile (career, form, rivalries) · Qualifying (DL standings vs the cut) · Stats (performance index) · Projections · Schedule.

## Run locally

You'll need Node.js and the API running (see the athletics-predictor repo).

```bash
npm install
npm run dev        # http://localhost:8080
```

By default the app calls the API at `http://localhost:5000`. To point it somewhere else, use an env var (below).

## Environment variables

All of these are optional and get baked in at **build time** (`VITE_*`), so changing one means a redeploy. Copy `.env.example` to `.env.local` to set them locally.

| Var | Purpose |
|-----|---------|
| `VITE_API_BASE_URL` | Where the API lives (default `http://localhost:5000`) |
| `VITE_SITE_URL` | The site's public origin. Turns on canonical URLs, JSON-LD, and the sitemap |
| `VITE_GOOGLE_SITE_VERIFICATION` | Renders the Search Console verification tag |

## Deployment (Vercel)

Auto-deploys from `main`. Two things here are specific to Vercel:

- **`NITRO_PRESET=vercel`** has to be set as an env var. The platform overrides the nitro build target in `vite.config.ts`, and this env var is what actually picks the Vercel output.
- **`vercel.json`** holds the security headers and the Content-Security-Policy. (`public/_headers` is Cloudflare-only, and Vercel ignores it.) The CSP is a whitelist, so any new external origin (a new font, an image host, analytics, a moved API) has to be added there or the browser blocks it.

## Related

- **API / model / data pipeline:** [athletics-predictor](https://github.com/rh16nd/athletics-predictor)
- **Design system:** `DESIGN.md` (the "Track at Golden Hour" tokens and rules)

*Not affiliated with World Athletics or the Wanda Diamond League.*
