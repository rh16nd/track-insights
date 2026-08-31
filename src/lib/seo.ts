/** Per-page titles and descriptions.
 *
 * Every route served the same <title> until now — "PodiumCall — 2026 Diamond
 * League Predictions" — which means ~270 real pages (32 disciplines, ~237
 * athletes, plus the fixed routes) were indistinguishable in a search result,
 * a browser tab, or a shared link.
 *
 * `head()` runs before the route's data loads, so a title cannot wait for the
 * API. Anything dynamic here is derived from the URL params instead. */

const EVENT_NAME: Record<string, string> = {
  "100m": "100m",
  "200m": "200m",
  "400m": "400m",
  "800m": "800m",
  "1500m": "1500m",
  "5000m": "5000m",
  "110h": "110m Hurdles",
  "100h": "100m Hurdles",
  "400h": "400m Hurdles",
  "3000sc": "3000m Steeplechase",
  HJ: "High Jump",
  PV: "Pole Vault",
  LJ: "Long Jump",
  TJ: "Triple Jump",
  SP: "Shot Put",
  DT: "Discus Throw",
  JT: "Javelin Throw",
};

/** "men_100m" -> "Men's 100m". Derived from the key rather than duplicating
 * api.py's DISC_LABELS: a second hand-maintained list of 32 labels is a
 * second thing to keep in sync, and this maps the 17 event codes instead.
 * Verified to reproduce all 32 of the API's own labels exactly. Falls back to
 * the raw key rather than inventing a name for one it doesn't recognise. */
export function disciplineLabel(discKey: string): string {
  const [sex, ...rest] = discKey.split("_");
  const event = rest.join("_");
  const name = EVENT_NAME[event];
  if (!name || (sex !== "men" && sex !== "women")) return discKey;
  return `${sex === "men" ? "Men's" : "Women's"} ${name}`;
}

const SUFFIX = "PodiumCall";

/** One place that builds the tags, so title and og:title cannot drift apart
 * — the failure mode where a page looks right in a tab and wrong when
 * shared. */
export function pageHead(title: string, description: string) {
  const full = `${title} · ${SUFFIX}`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
    ],
  };
}
