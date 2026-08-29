# Drop the v0 output here

Anything in this folder is **design source, not shipped code**. Nothing here
is imported by the app or served to anyone — it exists so the redesign can be
read, compared against the live pages, and ported by hand into the real
components.

## What to save here

Whatever v0 gave you, in whatever form you have it:

```
design/v0/
  system.css          ← the shared stylesheet, if it produced one
  index.html          ← landing
  projections.html
  stats.html
  athlete.html
  dashboard.html
  track.html
  qualification.html
  schedule.html
  shots/              ← screenshots, any filenames, PNG or JPG
```

None of it is required. One file is enough to start. Screenshots alone are
enough to start.

## How to get files out of v0

Any of these work:

- **Download** — v0 lets you download the generated files; save them here.
- **Copy the code block** — paste into a new file here with the right name.
- **Screenshot** — drop images in `shots/`. Useful even when you also have
  the code, because a screenshot shows what it is supposed to look like when
  the CSS is doing its job.

## Then

Tell me it's here. I read the files, compare each page against the live one,
and port the direction onto the real `Panel` / `Shell` / `StatBlock`
components and the live API data.

Nothing is ported blind: anything that changes a number, drops a panel, or
invents an athlete gets flagged rather than shipped.
