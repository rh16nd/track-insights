/** English source strings. Keys are the source of truth; fr.ts mirrors them.
 * A missing French key falls back to the English here, so partial coverage
 * degrades to English rather than to a blank. Dynamic content from the API
 * (athlete names, discipline names, computed verdicts/storylines) is NOT here
 * and stays in its scraped English for now. */
export const en: Record<string, string> = {
  // Chrome: nav
  "nav.dashboard": "Dashboard",
  "nav.track": "Track",
  "nav.field": "Field",
  "nav.qualifying": "Qualifying",
  "nav.stats": "Stats",
  "nav.schedule": "Schedule",
  "nav.howItWorks": "How it works",
  "nav.live": "Live",
  "nav.searchAthletes": "Search athletes",
  "nav.updated": "Updated {{date}} · {{days}}d to Brussels",
  "nav.language": "Language",
  "nav.skipToContent": "Skip to content",

  // Search
  "search.placeholder": "Search any athlete…",
  "search.searching": "Searching…",
  "search.noMatch": "No athlete matches “{{query}}”.",
  "search.worldRank": "world #{{rank}}",

  // Footer (the source name is a link rendered between these two)
  "footer.scrapedFrom": "Data scraped from",
  "footer.notAffiliated": "Not affiliated with World Athletics or the Wanda Diamond League.",
  "footer.disclaimer": "Predictions are model estimates, not betting advice.",

  // Common
  "common.tryAgain": "Try again",
  "common.back": "Back",
  "common.backToDashboard": "Back to dashboard",
  "common.loading": "Loading…",

  // Welcome modal
  "welcome.eyebrow": "PodiumCall",
  "welcome.title": "Predicting the podium in Brussels.",
  "welcome.intro":
    "PodiumCall calls the podium for every one of the 32 events at the 2026 Diamond League Final, worked out from real World Athletics results before anyone races. It backs the top three, not a single winner.",
  "welcome.point1":
    "Every number is a real, scraped stat from World Athletics. Nothing is typed in by hand or made up.",
  "welcome.point2":
    "Browse by event under Track and Field, see who's qualified in Qualifying, or open any athlete for their 2026 results, head-to-head record and career bests.",
  "welcome.point3": "Tap the small ⓘ next to a stat to read exactly what it means.",
  "welcome.howItWorks": "How it works, in full →",
  "welcome.explore": "Explore the board",
  "welcome.about": "About",
};
