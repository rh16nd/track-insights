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

  // Shared shell: error / loading / watch badge / head figures
  "error.couldNotLoad": "Could not load predictions",
  "error.apiHintBefore": "Make sure ",
  "error.apiHintAfter": " is running in your athletics-predictor folder.",
  "watch.badge": "Watch",
  "watch.flaggedFrom": "Flagged from: {{reason}}",
  "watch.fallback": "Recent injury or DNF mention, flagged for review",
  "watch.ariaLabel": "Injury watch evidence",
  "watch.viewSource": "View source →",
  "figure.about": "About {{label}}",

  // Meet status labels (schedule / upcoming calendar)
  "meet.status.done": "Done",
  "meet.status.next": "Next up",
  "meet.status.upcoming": "Upcoming",
  "meet.status.final": "Final",

  // Dashboard
  "dashboard.title": "The board, {{phrase}}.",
  "dashboard.titleBare": "The board",
  "dashboard.description":
    "Every projection the model is most sure of, and the events it is least sure of, across all 32 disciplines of the 2026 Diamond League Final.",
  "dashboard.daysOut": "{{days}} days out",
  "dashboard.oneDayOut": "one day out",
  "dashboard.raceDay": "race day",
  "dashboard.underway": "under way",
  "dashboard.stat.daysToBrussels": "Days to Brussels",
  "dashboard.stat.hitRate": "Top-3 hit rate",
  "dashboard.stat.hitRateHint":
    "Among the athletes who actually contest a Final, how often the model's projected top three matches who really medals. It's scored only on seasons the model never trained on, so the figure isn't inflated.",
  "dashboard.stat.disciplines": "Disciplines",
  "dashboard.stat.meetingsRun": "Meetings run",
  "dashboard.surest": "#{{n}} surest",
  "dashboard.seasonBest": "Season best {{mark}}",
  "dashboard.pctPodium": "% podium",
  "dashboard.deltaUp": "Up {{pts}} since your last visit",
  "dashboard.deltaDown": "Down {{pts}} since your last visit",
  "dashboard.pt": "pt",
  "dashboard.pts": "pts",
  "dashboard.mostLikelyPodium": "Most likely to reach the podium",
  "dashboard.leastSure.title": "Where the model is least sure",
  "dashboard.leastSure.subtitle":
    "The eight events whose strongest pick is weakest. These are the most open fields at the Final, and the ones most likely to surprise.",
  "dashboard.leastSure.note":
    "This is the favourite's own chance of a podium, not a margin over the next athlete. A low number means no one in that field stands out, so follow a row through to see how level it really is.",
  "dashboard.surestCalls.title": "The surest calls",
  "dashboard.surestCalls.subtitle":
    "The model's strongest pick in each discipline: the chance of finishing top three, not of winning. Each card is a different event, so these six aren't racing each other.",
  "dashboard.seasonProgress": "Season progress",
  "dashboard.meetsScored": "{{done}} of {{total}} meets scored",
  "dashboard.upcomingCalendar": "Upcoming calendar",
  "dashboard.viewFullSchedule": "View full schedule →",

  // Injury & withdrawal news feed
  "news.title": "Injury & withdrawal news",
  "news.subtitle": "Real headlines matched by the automatic injury check",
  "news.subtitleWithDate": "Real headlines matched by the automatic injury check · last run {{date}}",
  "news.loading": "Loading news…",
  "news.empty": "No injury or withdrawal headlines matched any athlete in the projected field.",
  "news.removed": "Removed from field",
  "news.matchedOn": "matched on “{{keywords}}”",
  "news.disclaimerBefore":
    "These are automatically matched headlines, not verified injury reports. A match can be wrong, so the matched keyword is shown for you to judge it yourself, and every removed athlete keeps a full profile you can ",
  "news.searchFor": "search for",
  "news.disclaimerAfter": ".",

  // Track / Field discipline pages
  "common.final2026": "2026 Final",
  "common.projectedField": "Projected field",
  "track.title": "Track events",
  "track.eyebrow": "{{n}} track disciplines · 2026 Final",
  "track.description":
    "Sprints through distance, every track discipline contested at the Final. Pick an event to see each qualified athlete's chance of finishing on the podium.",
  "field.title": "Field events",
  "field.eyebrow": "{{n}} field disciplines · 2026 Final",
  "field.description":
    "Jumps and throws, every field discipline contested at the Final. Pick an event to see each qualified athlete's chance of finishing on the podium.",

  // Discipline table (shared by Track and Field)
  "table.subtitle.rank":
    "Ranked by season best. Podium chance is the model's separate call and can disagree.",
  "table.subtitle.prob":
    "Sorted by the model's podium chance. The # column still ranks by season best, so it reads out of sequence.",
  "table.projectedTop": "Projected top {{n}} · {{label}}",
  "table.howLevel": "How level is this field?",
  "table.caption":
    "Projected field for the {{label}}: rank by season best, athlete, nationality, mark and chance of a podium",
  "table.colRankSr": " — rank by season best",
  "table.colAthlete": "Athlete",
  "table.colNat": "Nat",
  "table.colQualified": "Qualified",
  "table.colProjected": "Projected",
  "table.colProjectedHint":
    "Projected finishing order, ranked by each athlete's season best: their fastest or furthest mark this year. A real result you can look up, separate from the model's podium chance.",
  "table.colPodiumChance": "Podium chance",
  "table.colPodiumChanceHint":
    "The model's estimate of how likely this athlete is to finish in the top three, not to win. Higher means a stronger podium threat, which is why this can rank athletes differently from their season-best mark.",
  "table.sortedActivateReverse": " — sorted, activate to reverse",
  "table.activateToSort": " — activate to sort by this column",
  "table.qTitle":
    "Confirmed in World Athletics' own 2026 Diamond League standings for this discipline",
  "table.qSr": "ualified — confirmed in World Athletics' 2026 Diamond League standings",
  "table.notQualifiedHeading": "Not qualified: below the top {{n}} on Diamond League points",
  "table.notQualifiedNote":
    "Fast enough to matter, but short of a qualifying place on points, either below the cut in the standings or with no Diamond League points in this event at all. Scored by the same model, so you can see who would be a threat if they got in.",
  "table.notQualified": "Not qualified",

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
