# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are track & field fans following the 2026 Wanda Diamond League season, plus people encountering the project as a portfolio/demonstration piece (evaluating the real-data ML work, not just using it privately). Confirmed: the site is meant to be presentable to a broader public, not just the owner.

## Product Purpose

A prediction dashboard for the 2026 Diamond League Final (Brussels, Sep 4–5). A RandomForest model trained on real, scraped World Athletics results predicts the likely top-3 finishers across all 32 Final disciplines, updated live as the 2026 season progresses.

## Positioning

Real scraped data end to end, not fan intuition or hand-typed results. Ground truth (Diamond League Final results, 2018–2025 excluding 2020) and training features (per-meeting season history from the DL circuit, Olympics, World Championships, Continental Tour Gold, European Championships) come directly from World Athletics' own public API. Validated honestly via walk-forward testing across independent seasons (train only on years strictly before each test year) rather than a single favorable holdout.

## Operating Context

Two-repo system: a Python ML pipeline (`athletics-predictor`, separate repo) scrapes live data, runs the trained model, and serves predictions through a local Flask API; this repo (`track-insights-main`, React 19 + TanStack Router/Start + Vite + Tailwind 4) is the dashboard that consumes that API. Live and refreshed periodically through the 2026 season (e.g. after each Diamond League meet) up to the Brussels Final.

## Capabilities and Constraints

- 32 disciplines tracked (16 men's, 16 women's): sprints, hurdles, middle/long distance, steeplechase, jumps, throws.
- Live 2026 season standings/toplists feed the model; injury/withdrawal detection (news + meet-recap scraping) flags or removes athletes from predictions, with linked evidence.
- Backtest accuracy is currently ~60% (walk-forward validated, 2021–2025 test years) — expected to move as the model is retrained; report whatever `model_accuracy.txt`/the live API returns, never a hardcoded figure.
- Known, accepted data gaps (not bugs): a couple of qualified athletes are genuinely absent from World Athletics toplists even at deep pagination; men's 5000m has thin historical labels (many years ran a road race instead).
- No user accounts, no backend the dashboard itself owns — it is a read-only view over the Flask API's live predictions.

## Brand Commitments

Confirmed product name: **PodiumCall** (chosen 2026-08-23 via domain-name-brainstormer; `podiumcall.com` and `.io` both appeared unregistered at the time of checking). Previously an unnamed working title ("2026 DL Predictor"). An existing warm, athletics-track-inspired visual identity is already in place across the dashboard (terracotta/gold/brick palette, a literal running-track texture with lane lines used as the sidebar background) — this stays as the confirmed incumbent visual system; only the product name changed.

## Evidence on Hand

Real, live figures only, sourced from the Flask API at request time: model backtest accuracy, days-to-Final countdown, per-discipline predicted rankings with probabilities, real athlete names/marks/nationalities, real injury-watch flags with source links. Nothing on the site is a fabricated statistic, placeholder testimonial, or invented case study — state absence rather than inventing a number when live data isn't reachable (e.g. "Live preview needs `python api.py` running").

## Product Principles

1. Data honesty over impressiveness — never fabricate, hardcode, or hand-type what can be scraped or computed live.
2. A suspiciously good number is a signal to check harder, not a result to bank (a real label-leakage bug was caught this way).
3. Isolate a change's effect before trusting that a number moved because of it.
4. Model accuracy and data quality come first; visual/UX polish is deliberately sequenced after, per the project owner's stated priority.

## Accessibility & Inclusion

No specific requirement beyond general good practice (contrast, keyboard navigation, `prefers-reduced-motion` support).
