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

  // Schedule
  "schedule.headlineRoad": "The road to the Final.",
  "schedule.headlineCities": "{{word}} cities, then {{host}}.",
  "schedule.headlineCitiesFinal": "{{word}} cities, then the Final.",
  "schedule.eyebrow": "2026 season · {{n}} meetings",
  "schedule.eyebrowBare": "2026 season",
  "schedule.description":
    "The full Wanda Diamond League season, from the opener to the Final in Brussels.",
  "schedule.descriptionWithCount":
    "The full Wanda Diamond League season, from the opener to the Final in Brussels. {{done}} of {{total}} meetings are scored.",
  "schedule.figMeetings": "Meetings in the series",
  "schedule.figAlreadyRun": "Already run",
  "schedule.figTheFinal": "The Final",
  "schedule.panelTitle": "The road to the Final",
  "schedule.panelSubtitle":
    "The 2026 Diamond League circuit, in order. Gold marks the Final, the only meeting on this list that decides anything.",
  "schedule.meetingOf": "Meeting {{n}} of {{total}}",
  "schedule.num.10": "Ten",
  "schedule.num.11": "Eleven",
  "schedule.num.12": "Twelve",
  "schedule.num.13": "Thirteen",
  "schedule.num.14": "Fourteen",
  "schedule.num.15": "Fifteen",
  "schedule.num.16": "Sixteen",

  // Stats / Performance Index
  "stats.title": "Performance Index",
  "stats.eyebrow": "{{season}} season · {{rows}} ranked marks · scores {{min}}–{{max}}",
  "stats.eyebrowBare": "World Athletics scoring points",
  "stats.description":
    "Which events are genuinely deep, and which are one athlete and a gap. Every 2026 mark is scored on World Athletics' points table, then read as a spread: how far a discipline's leader sits above the median of its own ranked field. A tight spread is a crowd; a long one is a soloist with daylight behind.",
  "stats.figMarksScored": "Marks scored",
  "stats.figFieldMedian": "Field median (WA pts)",
  "stats.figScoringRange": "Scoring range",
  "stats.figSetIndoors": "Set indoors",
  "stats.bestOfSeason": "Best of the season",
  "stats.bestOfYear": "Best of {{season}}, any event",
  "stats.bestSubtitle":
    "Ranked by World Athletics points, so a discus throw and an 800m are directly comparable. The bar is scaled to the range this season actually covers, not to zero.",
  "stats.filterAll": "All events",
  "stats.filterTrack": "Track",
  "stats.filterField": "Field",
  "stats.filterOutdoor": "Outdoor only",
  "stats.noMarks": "No marks match this filter.",
  "stats.indoorNoteBefore": "World Athletics lists indoor marks inside its outdoor season rankings, tagged only by a ",
  "stats.indoorNoteMid": " on the venue — ",
  "stats.indoorNoteOf": "% of the ",
  "stats.indoorNoteAfter":
    " marks here, and close to half of them in the vertical jumps. They are kept, because for a vault or a shot put indoors is arguably the truer measure, but every one is labelled. Use ",
  "stats.indoorNoteOutdoorOnly": "Outdoor only",
  "stats.indoorNoteEnd": " above to drop them.",
  "stats.indoorBadge": "Indoor",
  "stats.indoorBadgeTitle":
    "Set indoors. World Athletics lists these inside the outdoor season rankings",

  // Depth ladder (Stats page)
  "depth.sortDepth": "By depth",
  "depth.sortMedian": "By median",
  "depth.sortTop": "By top score",
  "depth.title": "The depth ladder · {{n}} disciplines",
  "depth.subtitle":
    "Each bar runs from that event's median score to its top score, all on one axis. Shorter is deeper: the leader is closer to the crowd. Longer means one athlete with daylight behind them.",
  "depth.legendMedian": "Field median",
  "depth.legendTop": "Discipline top",
  "depth.legendSpread": "Spread (top − median)",
  "depth.noteBefore": "Deepest by this measure is ",
  "depth.noteMid": ", whose leader is only ",
  "depth.notePointsClear": " points clear of its own median; the most top-heavy is ",
  "depth.noteAt": " at ",
  "depth.noteEnd":
    ". This is the spread across everyone World Athletics ranks in the event, a different question from how level the eight-strong Final field is, which each discipline's own page answers.",

  // How it works (inline emphasis uses **bold** / *italic*, see lib/rich-text)
  "howItWorks.eyebrow": "About the model",
  "howItWorks.description":
    "PodiumCall calls the podium for every event at the 2026 Diamond League Final, from real World Athletics results, before anyone races. Here's exactly how it does that, and how well it works.",
  "howItWorks.s1.title": "What it predicts",
  "howItWorks.s1.p1":
    "For every one of the **32 events** at the Brussels Final, the model gives each contender a single number: their chance of finishing **in the top three**. It never names one winner.",
  "howItWorks.s1.p2":
    "That's on purpose. On the day, the fastest qualifier can false-start, get boxed in, or be caught on the line, so “who wins” is close to a coin toss between three or four names. “Who makes the podium” is the harder question to dodge, and the one you can actually check against the result afterwards. So every figure on the site is about the top three, never the gold medal on its own.",
  "howItWorks.s2.title": "How the model learns",
  "howItWorks.s2.p1":
    "It learns from the actual podiums of every Diamond League Final from **2018 to 2025** (2020 was cancelled). That's real ground truth, scraped straight from World Athletics' own results, not anyone's ranking of who “should” win.",
  "howItWorks.s2.p2":
    "For each athlete in contention it works out **14 signals** from their real season: their season best and career best, how consistent they've been meet to meet, which way their form is trending, how many times they've raced, and how they've done **head-to-head against this exact field**. A **random forest** weighs all of it into one number, the probability of a podium. A forest is used because these signals pull on each other in ways a single straight-line formula misses: a blazing season best counts for less, for instance, if the athlete has barely raced all year.",
  "howItWorks.s2.p3":
    "And it's graded the honest way. Under **walk-forward validation** the model only ever trains on seasons *before* the year it's being scored on, so the accuracy below comes entirely from Finals it had never seen. That's the difference between a real forecast and a model that has just memorised the answers.",
  "howItWorks.s3.title": "How accurate it is",
  "howItWorks.s3.basisFallback":
    "Podium hit rate among the athletes who actually contest the Final",
  "howItWorks.s3.toplistCaption":
    "The brutal stress test: picking the 3 medallists out of a discipline's whole ~101-name toplist, which the site never actually asks of it",
  "howItWorks.s3.note":
    "Both numbers come off the exact same predictions; they just ask different questions. The first is the real job, and the one the site does: given the eight-to-ten athletes who actually make a Final, how often is the model's projected top three right? The second is a deliberately harder task it never has to perform. They sit about twelve points apart, and neither is rounded up or picked from a flattering season.",
  "howItWorks.s4.title": "Where the data comes from",
  "howItWorks.s4.pBefore": "Every mark, ranking and result comes straight from ",
  "howItWorks.s4.pAfter":
    "'s own public API, the same data behind their broadcasts and athlete profiles. The scraping runs on a separate machine, and no mark is ever typed in or edited by hand, so what you read here is exactly what they published.",
  "howItWorks.s4.competitions": "Competitions",
  "howItWorks.s4.marks": "Marks",
  "howItWorks.s4.venues": "Venues",
  "howItWorks.s4.seasons": "Seasons",
  "howItWorks.s4.seasonsDeep": "Seasons deep",
  "howItWorks.s5.title": "What it can't do",
  "howItWorks.s5.b1":
    "It reads **form, not the future**. A last-minute injury, a withdrawal announced the morning of, or a tactical sit-and-kick race can all beat the numbers on the day.",
  "howItWorks.s5.b2":
    "It predicts **who makes the podium, not the exact 1-2-3**, and it never claims to know who wins.",
  "howItWorks.s5.b3":
    "It's **not affiliated with World Athletics** or the Wanda Diamond League. It just reads their public data.",

  // Qualifying
  "qual.num.6": "Six",
  "qual.num.8": "Eight",
  "qual.num.10": "Ten",
  "qual.places": "places",
  "qual.lanes": "lanes",
  "qual.headline": "{{word}} {{noun}}. The race to make the race.",
  "qual.headlineFallback": "Race for the Final",
  "qual.description":
    "Who has actually earned a place at the Final. These are World Athletics' own Diamond League points, not a prediction, with the gap to the qualification cut worked out from what's still winnable.",
  "qual.descriptionDecided":
    "Who has actually earned a place at the Final. These are World Athletics' own Diamond League points, not a prediction, with every scoring meeting of the 2026 season now run.",
  "qual.eyebrowOne": "1 scoring meeting left · a win is worth {{pts}} points",
  "qual.eyebrowMany": "{{n}} scoring meetings left · a win is worth {{pts}} points",
  "qual.eyebrowDecided": "Every scoring meeting is run, so the standings are final",
  "qual.eyebrowBare": "2026 Diamond League standings",
  "qual.figQualify": "Qualify for the Final",
  "qual.figPoints": "Points to make it",
  "qual.figMeetingsLeft": "Meetings left",
  "qual.figPointsForWin": "Points for a win",
  "qual.standingsSkeleton": "Diamond League standings",
  "qual.tightTitleDecided": "Level at the cut line",
  "qual.tightTitleNext": "Closest to the line going into {{city}}",
  "qual.tightTitle": "Closest to the line",
  "qual.tightSubtitleDecided":
    "Every scoring meeting is run, and in these disciplines the athlete below the cut finished level on points with the athlete on it. World Athletics' tie-break decides them, not another race.",
  "qual.tightSubtitle":
    "The smallest gap between the qualification cut and the first athlete below it, the disciplines the last meeting actually decides.",
  "qual.levelOnPoints": "Level on points",
  "qual.behind": "behind",
  "qual.disciplineLabel": "Discipline",
  "qual.standingsTitle": "Diamond League standings · {{disc}}",
  "qual.standingsSubtitle": "The top {{n}} on points qualify for the Final.",
  "qual.standingsSubtitleCut":
    "The top {{n}} on points qualify for the Final. The cut currently sits at {{pts}} points.",
  "qual.caption":
    "Diamond League standings for the {{disc}}: rank, athlete, points, meetings contested, gap to the qualifying cut and status",
  "qual.colMeets": "Meets",
  "qual.colPoints": "Points",
  "qual.colGap": "Gap to cut",
  "qual.colStatus": "Status",
  "qual.status.safe": "Through",
  "qual.status.in": "In",
  "qual.status.chasing": "Chasing",
  "qual.status.out": "Out",
  "qual.status.unknown": "No points",
  "qual.statusDecided.in": "Tie-break",
  "qual.statusDecided.chasing": "Tie-break",
  "qual.statusTitle.safe": "Can't be displaced: nobody below them can reach their total",
  "qual.statusTitle.in": "Above the cut line as it stands, but still catchable",
  "qual.statusTitle.chasing": "Below the line and still mathematically able to reach it",
  "qual.statusTitle.out": "Cannot reach the cut even by winning everything left",
  "qual.statusTitle.unknown": "World Athletics lists no points for this athlete",
  "qual.statusTitleDecided.in":
    "Above the cut line, but level on points with an athlete below it; World Athletics' tie-break decides",
  "qual.statusTitleDecided.chasing":
    "Level on points with the last qualifying place and no scoring meetings left; World Athletics' tie-break decides",
  "qual.gapBehind": "{{n}} behind",
  "qual.gapOnLine": "on the line",
  "qual.gapLevel": "level with the cut",
  "qual.gapClear": "{{n}} clear",
  "qual.footBefore":
    "Points are World Athletics' own, scraped from the 2026 Diamond League standings. ",
  "qual.footOpen":
    "“Out” means the athlete cannot reach the cut even by winning everything left; “Through” means nobody can displace them even if they never score again. Anything in between is still open. This assumes the discipline is on the remaining programme. If it isn't contested again, these standings are already final, which only makes “Out” more certain.",
  "qual.footDecided":
    "No scoring meetings remain, so these standings are the result. “Tie-break” marks the one thing points alone cannot settle: two athletes level on points either side of the cut, separated by World Athletics' own tie-break rules, which are not in this data.",
  "qual.footScraped": " Scraped {{when}}.",
  "qual.howToRead.title": "How to read it",
  "qual.howToRead.subtitle": "The margin, not the medal.",
  "qual.howToRead.p1Before":
    "Points come from finishing position at each Diamond League meeting an athlete actually contested — ",
  "qual.howToRead.p1After":
    " for a win, scaling down from there. Nothing here is a projection: it is the arithmetic of who has scored what.",
  "qual.howToRead.holdsBefore": " holds the {{n}}th and final place on ",
  "qual.howToRead.holdsAfter": " points",
  "qual.howToRead.exactlyLevel": ", exactly level with the cut",
  "qual.howToRead.firstOutBefore": " is first out, ",
  "qual.howToRead.point": "point",
  "qual.howToRead.points": "points",
  "qual.howToRead.short": " short",
  "qual.howToRead.decidedTail": " with no meetings left to change it",
  "qual.howToRead.openTail": " with racing still to come",

  "qual.cutLine": "Qualification cut · top {{n}}",

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
