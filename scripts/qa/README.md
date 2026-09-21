# QA helpers for the redesign (playwright-cli)

Run these from a scratch folder, not the repo: playwright-cli writes `.playwright-cli/` into the current directory. They were used to check the Terra re-theme on 2026-09-21.

- `shoot-routes.js`: screenshots every main page (first screen and full page) into `./baseline/`, and returns each page's sideways scroll (should be 0).
  `playwright-cli -s=desk open http://localhost:8081/ && playwright-cli -s=desk resize 1280 800 && playwright-cli -s=desk run-code --filename=shoot-routes.js`
  Phones: `playwright-cli -s=mob open --mobile http://localhost:8081/`, then the same `run-code`.
- `measure-headers.js`, then `contrast.py`: header text contrast over the photos. The first records every header text line's box and colour, then screenshots the header with its text hidden into `./measure/`. The second reports each line's ratio against the lightest background under it.
  `playwright-cli -s=desk --raw run-code --filename=measure-headers.js > measure/boxes-desk.json`
  `python contrast.py desk 1280 1` (for phones: `mob 360 3`, the device pixel ratio). Needs `mkdir measure` first, and Pillow.
