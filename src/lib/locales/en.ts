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

  // Athletics vocabulary shared across components
  "word.race": "race",
  "word.races": "races",
  "word.competition": "competition",
  "word.competitions": "competitions",
  "word.raced": "raced",
  "word.competedAgainst": "competed against",

  // Discipline page
  "disc.titleFallback": "Discipline",
  "disc.eyebrow": "Discipline vs discipline · {{rank}} tightest of {{of}} finals",
  "disc.eyebrowBare": "Discipline vs discipline",
  "disc.description":
    "One event read as a field rather than a list. Is this a genuine contest all the way down, or one athlete and a gap? Measured on World Athletics' own scoring points, so the answer can be compared against the other 31 finals.",
  "disc.whyScore":
    "This is measured on World Athletics' scoring points, not the model's probabilities. Probabilities rank athletes inside one event, but each athlete is scored on their own, so a field's percentages can add up to anything from 31 to 320 across the 32 finals. That's why they can't rank one event against another. A scraped score can.",
  "disc.depthSkeleton": "Depth of the field",
  "disc.seasonForm": "Real season form · {{disc}}",
  "disc.seasonFormSubtitle":
    "Every mark each contender actually recorded this season, on a real calendar. These aren't a smoothed trend; the dots are the meetings they turned up to.",
  "disc.storylines": "Storylines · {{disc}}",
  "disc.storylinesSubtitle":
    "Computed from the data, not written: each one is anchored on a real number, and the featured card is whichever most contradicts the model's own pick.",
  "disc.depthTitle": "Depth of the field",
  "disc.depthNeeds": "Needs a World Athletics score for at least two of the field.",
  "disc.depthNotEnough":
    "Not enough of this field carries a World Athletics score this season to measure how level it is. Nothing is estimated in its place.",
  "disc.levelTitle": "How level this field is",
  "disc.levelSubtitle":
    "Every finalist's best score this season, strongest to weakest. The distance between the two ends is what ranks this event against the other {{of}}.",
  "disc.verdict.level.label": "LEVEL FIELD",
  "disc.verdict.level.basis": "one of the tightest thirds of the 32 finals",
  "disc.verdict.mixed.label": "A TOP AND A TAIL",
  "disc.verdict.mixed.basis": "the middle third of the 32 finals",
  "disc.verdict.topHeavy.label": "ONE AND A GAP",
  "disc.verdict.topHeavy.basis": "one of the widest thirds of the 32 finals",
  "disc.spreadSentenceMid": " points from ",
  "disc.spreadSentenceDown": " down to the weakest of the ",
  "disc.spreadSentenceEnd": " scored.",
  "disc.statSpread": "Spread across the field",
  "disc.statSpreadValue": "{{n}} pts",
  "disc.statSpreadNote": "{{rank}} tightest of {{of}}",
  "disc.statSpreadHint":
    "The points gap from the strongest finalist's score down to the weakest. A small gap is a tight, level field; a big one means the leader has daylight.",
  "disc.statStrongest": "Strongest finalist",
  "disc.statMedian": "World top-100 median",
  "disc.statMedianNoScore": "not scored this season",
  "disc.statMedianClear": "strongest finalist is {{n}} clear",
  "disc.statMedianHint":
    "The middle score of the world's top 100 in this event this year, as a yardstick. It shows how the Final's field sits against the wider world, not just against itself.",
  "disc.statScored": "Field scored",
  "disc.statScoredEvery": "every finalist",
  "disc.statScoredSome": "some carry no score this season",
  "disc.statScoredHint":
    "How many of the finalists have a World Athletics score this season. A few events have one or two who don't, and nothing is estimated in their place.",
  "disc.disagreeTitle": "Where the model disagrees with the marks",
  "disc.disagreeSubtitle":
    "Podium probability against measured ability, for the same {{n}} athletes. These two orderings are not the same, and where they diverge is the argument worth having.",
  "disc.disagreeNote":
    "Ordered by World Athletics score. The percentage is the model's chance of that athlete finishing in the top three. It isn't a win probability, and the two columns are allowed to disagree: a season best is one day, and the projection reads a whole season.",

  // Storylines (titles are a fixed set keyed by type; the sentence itself is
  // generated by the API with real numbers and stays in its scraped English)
  "storyline.empty":
    "No standout storylines for this discipline right now. Check back as the season progresses.",
  "storyline.photo_finish": "Photo finish",
  "storyline.injury_watch": "One to watch",
  "storyline.returning_champion": "Returning champion",
  "storyline.debutant": "First Final appearance",
  "storyline.rivalry": "Rivalry renewed",
  "storyline.hot_streak": "Trending up",

  // Field analysis (head-to-head grid + what separates them)
  "fa.pairingsTitle": "Every pairing in the {{disc}} field",
  "fa.pairingsSubtitle":
    "Read a row across: that athlete's record against each rival, wins first. Built from {{noun}} they actually shared. {{met}} of {{possible}} possible pairings have met.",
  "fa.howToRead": "How to read this grid",
  "fa.howToReadBefore": "Each row is one athlete, each column a rival. A cell reads wins then losses, so ",
  "fa.howToReadAfter":
    " means the row athlete has beaten that rival three times and lost once, counting only {{noun}} they both entered. Gold means the row athlete is ahead; a blank means they've never met.",
  "fa.gridCaption":
    "Head-to-head grid for the {{disc}} field. Each row is one athlete's record against the athlete named in each column, wins first, from {{noun}} they actually shared.",
  "fa.separatesTitle": "What separates them",
  "fa.separatesSubtitle":
    "The same axes for every contender, so two athletes with near-identical season bests stop looking like the same bet.",
  "fa.separatesCaption":
    "What separates the {{disc}} field: the same measures for every contender, so two athletes with near-identical season bests can be told apart.",
  "fa.colTop3": "Top-3 avg",
  "fa.colTop3Hint":
    "The average of this athlete's three best marks this season. It holds up to one lucky afternoon in a way a single season best doesn't.",
  "fa.colSteadiness": "Steadiness",
  "fa.colSteadinessHint":
    "How tightly a season's marks cluster, as a percentage of their average. Lower is more repeatable, and it reads the same for a sprinter and a thrower.",
  "fa.colComps": "Comps",
  "fa.colRaces": "Races",
  "fa.colStartsHint":
    "How many times they've competed this season, then their all-time total on record (this season / all-time).",
  "fa.colPodium": "Podium",
  "fa.colPodiumHint":
    "How often this athlete has finished in the top three, across every final on their record.",
  "fa.colPeaked": "Peaked",
  "fa.colPeakedHint": "The month this season's best mark was set.",
  "fa.cellTitle": "{{a}} {{wins}}–{{losses}} {{b}} over {{n}} {{noun}}",
  "fa.cellLastMet": ", last met {{date}}",

  // Trajectory overlay chart
  "traj.header": "Real {{year}} form · top {{n}}",
  "traj.higherFarther": "Higher is farther",
  "traj.higherFaster": "Higher is faster",
  "traj.chartView": "Chart view",
  "traj.tableView": "Table view",
  "traj.caption":
    "Real {{year}} meet-by-meet marks for the top {{n}} contenders, one row per meet",
  "traj.colDate": "Date",
  "traj.colMark": "Mark",
  "traj.colVenue": "Venue",

  "fa.blankCellNote": "A blank cell means those two have genuinely never {{verb}} each other, shown as absent rather than as a nil-all draw. “vs. this field” totals a row, and is not the same number as a career win rate: an athlete can win often against everyone else and still be behind against the eight who will actually line up in Brussels.",
  "fa.neverMet": "{{a}} and {{b}} have never {{verb}} each other",

  "fa.noResults": "no results",

  "traj.excludedOne": "{{names}} has no {{year}} meeting data on record yet. See their profile for their most recent season.",
  "traj.excludedMany": "{{names}} have no {{year}} meeting data on record yet. See their profile for their most recent season.",

  // Athlete analytics
  "aa.recordTitle": "Competition record",
  "aa.recordSubtitle":
    "Every scraped final: {{n}} {{noun}} across {{seasons}} seasons. A season best is one afternoon. This is what happened the rest of the time.",
  "aa.wins": "Wins",
  "aa.ofStarts": "{{pct}}% of starts",
  "aa.podiums": "Podiums",
  "aa.averageFinish": "Average finish",
  "aa.best": "best: {{place}}",
  "aa.topTierStarts": "Top-tier starts",
  "aa.topTierShare": "{{pct}}% of {{noun}}",
  "aa.byCategory": "By competition category",
  "aa.colCategory": "Category",
  "aa.colWon": "Won",
  "aa.seasonBySeason": "Season by season",
  "aa.seasonBySeasonSubtitle":
    "Season best against the average of that year's best three, so one lucky afternoon sits next to the level actually held.",
  "aa.seasonShape": "Season shape",
  "aa.seasonShapeSubtitleField":
    "When they actually compete, and when the best mark lands. An athlete who peaked in May is a different bet in September from one still climbing.",
  "aa.seasonShapeSubtitleTrack":
    "When they actually race, and when the best mark lands. An athlete who peaked in May is a different bet in September from one still climbing.",
  "aa.h2hTitle": "Head-to-head record",
  "aa.h2hSubtitle":
    "Derived from actually sharing a {{noun}}: same meeting, same day, compared on finishing position. Nothing here is inferred.",
  "aa.inFieldTitle": "Projected to be in the Final field",
  "aa.inField": "In field",
  "aa.h2hNoteBefore":
    "Sorted by how often they've met, not by record, since the deepest rivalries are the informative ones. Losses are shown as plainly as wins. Opponents marked ",
  "aa.h2hNoteAfter": " are projected to line up in the Final.",
  "aa.coverageBefore": "Computed from {{races}} scraped finals ({{withPlace}} with a recorded finishing position) across {{n}} {{seasonWord}}: {{seasons}}. This is every meeting World Athletics publishes results for in the senior outdoor competition groups, not an athlete's complete career; a {{noun}} outside those groups isn't counted.",
  "aa.season": "season",
  "aa.seasons": "seasons",
  "aa.seasonTableCaption":
    "Season by season: best mark, top-three average, and how consistent each campaign was",
  "aa.colSeason": "Season",
  "aa.colBest": "Best",
  "aa.colConsistency": "Consistency",
  "aa.ofCount": "(of {{n}})",
  "aa.tooFew": "too few {{noun}}",
  "aa.consistencyNote":
    "Consistency is the spread of a season's marks as a percentage of their average, so it reads the same for a 9.8-second sprinter and a 74-metre thrower. Lower is steadier. The bar compares a season only against this athlete's own others.",
  "aa.monthTitle": "{{month}}: {{n}} {{noun}}",
  "aa.monthTitleBest": "{{month}}: {{n}} {{noun}}, season best set here",
  "aa.shapeNote": "{{n}} {{noun}} from {{first}} to {{last}}.",
  "aa.shapeBestBefore": " Their best mark of the season came in ",
  "aa.shapeBestAfter": " (gold bar).",

  "aa.colAvgFinish": "Avg finish",
  "aa.categoriesNote": "Categories are World Athleticsâ own ranking labels, listed in a fixed order and deliberately not collapsed into a single quality score, because a continental championship and a Continental Tour Gold meeting arenât comparable on one axis. Read the rows against each other instead.",

  "disc.spreadCaption": "Each finalist’s World Athletics score",
  "disc.spreadNote": "Gold marks the strongest score in the field. Dots that bunch mean a level field; a dot out on its own means someone is clear of the rest.",

  "fa.vsThisField": "vs. this field",

  // Athlete profile
  "ath.backToTrack": "← Back to track events",
  "ath.backToField": "← Back to field events",
  "ath.dossier": "Athlete dossier · {{disc}}",
  "ath.notInField": "Not in the projected field",
  "ath.age": "Age {{n}}",
  "ath.rankInField": "#{{n}} in the projected field",
  "ath.ifQualified": "If they had qualified",
  "ath.ifQualifiedBefore": "% chance of a podium, from the same model run over the near-miss group. This isn't a projection about Brussels; they aren't in the field.",
  "ath.whyNotTitle": "Why they're not in the projected field",
  "ath.whyNotSubtitle": "The same eligibility check the projections themselves use",
  "ath.flaggedFrom": "Flagged from: {{reason}}",
  "ath.viewSource": "View source",
  "ath.dlPoints": "Diamond League points",
  "ath.inStandings": "· {{rank}} in the standings",
  "ath.gapToCut": "Gap to the cut",
  "ath.level": "level",
  "ath.cutAt": "· cut at {{n}}",
  "ath.seeStandings": "See the full {{disc}} standings →",
  "ath.fastestNote":
    "Worth noting: this is the fastest mark in the world this season. Diamond League Final eligibility is decided by points scored in the series, not by season best.",
  "ath.seasonStats": "Season stats",
  "ath.seasonBest2026": "2026 season best",
  "ath.worldRank": "World rank",
  "ath.thisSeasonToplist": "this season's toplist",
  "ath.careerBest": "Career best",
  "ath.pbGap": "PB gap",
  "ath.offCareerBest": "off their career best",
  "ath.pbGapHintMetres":
    "How far this season's best mark is from the athlete's all-time best, in metres. Zero means they've matched their personal best this year; a bigger number means they're still off it.",
  "ath.pbGapHintSeconds":
    "How far this season's best mark is from the athlete's all-time best, in seconds. Zero means they've matched their personal best this year; a bigger number means they're still off it.",
  "ath.ageLabel": "Age",
  "ath.meetsThisSeason": "Meets this season",
  "ath.dlMeetings": "Diamond League meetings",
  "ath.competitionsThisSeason": "Competitions this season",
  "ath.racesThisSeason": "Races this season",
  "ath.allCompetitions": "all competitions",
  "ath.lastCompeted": "Last competed",
  "ath.daysAgo": "{{n}}d ago",
  "ath.waScore": "WA score",
  "ath.waScoreSub": "Top {{pct}}% of all ranked marks",
  "ath.waScoreHint":
    "World Athletics' own points score for a mark. It puts every event on one scale, so a 9.9 hundred metres and a 2.30m high jump can be lined up and compared. Higher is better.",
  "ath.percentileBefore": "{{ord}} percentile within {{disc}}, where the median is ",
  "ath.percentileAfter": ".",
  "ath.setIndoors": " This mark was set indoors.",
  "ath.noDatedResults":
    "World Athletics lists a season best for this athlete but no dated results this season{{extra}}, so meetings and last-competed are unknown here rather than zero.",
  "ath.noDatedResultsExtra": " (their results on record are from earlier years)",
  "ath.notComputed":
    "Career best, PB gap and activity aren't computed for athletes this far outside the field. The model only scores the projected finalists and the closest challengers.",
  "ath.realSeasonForm": "Real season form",
  "ath.realSeasonFormSubtitle":
    "Diamond League meetings only. The competition record below counts every scraped final, so its totals run higher. That's a difference in scope, not a contradiction.",
  "ath.h2hTitle": "Head-to-head vs the projected field",
  "ath.h2hSubtitle":
    "Real meetings against the athletes who did qualify, from World Athletics results.",
  "ath.figSeasonBest": "Season best",
  "ath.figPersonalBest": "Personal best",
  "ath.figRacesIn": "Races in {{year}}",
  "ath.model": "PodiumCall model",
  "ath.modelBefore": "% chance of finishing on the podium in Brussels, not of winning. The model predicts top-three membership.",
  "ath.modelScoreBefore": " The ",
  "ath.modelScoreMid": " scores ",
  "ath.modelScoreAfter": " World Athletics points, the ",
  "ath.modelScoreEnd": " percentile of this discipline.",
  "ath.profileEyebrow": "Athlete profile",
  "ath.loadingDescription":
    "Loading real season form, head-to-head record and season stats…",
  "ath.errorDescription": "This athlete's profile could not be loaded.",
  "ath.errorTitle": "Could not load athlete profile",
  "ath.errorHint":
    "This athlete may not be in the current predictions file. Withdrawn athletes are filtered out before profiles are built.",

  "ath.percentileDiffer": " The two readings differ because events differ in depth.",
  "ath.viewFullProfile": "View full profile on World Athletics →",

  "ath.onDlPoints": "{{rank}} on {{points}} DL points",
  "ath.worldRankTag": "World #{{n}}",

  // Athlete career, season trend and head-to-head charts
  "car.title": "Record and ranking",
  "car.subtitle":
    "World Athletics' own honours and current world ranking, stated by them and not computed here.",
  "car.worldRanking": "world ranking",
  "car.overall": "Overall",
  "car.acrossAllEvents": "across all events",
  "car.honours": "Honours",
  "car.colChampionship": "Championship",
  "car.colGold": "Gold",
  "car.colSilver": "Silver",
  "car.colBronze": "Bronze",
  "car.colEntries": "Entries",
  "stc.header": "{{year}} season form",
  "stc.headerLast": "Last season form",
  "stc.caption": "{{year}} season marks for this athlete, one row per meet",
  "stc.captionLast": "Last season marks for this athlete, one row per meet",
  "stc.colScore": "Score",
  "stc.pts": "{{n}} pts",
  "h2h.header": "Head-to-head vs. {{opponents}}",
  "h2h.topRivals": "top rivals",
  "h2h.wins": "Wins",
  "h2h.losses": "Losses",
  "h2h.caption": "Head-to-head record vs. {{opponents}}",
  "h2h.colOpponent": "Opponent",
  "h2h.colMeetings": "Meetings",

  "car.pbBefore": "World Athletics holds personal bests for this athlete in ",
  "car.event": "event",
  "car.events": "events",
  "car.pbRange": " (a range, not a single specialism)",
  "car.pbAfter": ". Marks set indoors are included in that count and are labelled wherever they are shown; World Athletics lists them alongside outdoor ones.",

  // Landing page
  "landing.tagline": "2026 Diamond League Predictor",
  "landing.badgeFinal": "PodiumCall · The Brussels Final",
  "landing.badgeComplete": "PodiumCall · Brussels Final complete",
  "landing.badgeFinalDay": "PodiumCall · Final day in Brussels",
  "landing.badgeOneDay": "PodiumCall · 1 day to Brussels",
  "landing.badgeDays": "PodiumCall · {{n}} days to Brussels",
  "landing.h1a": "We make the",
  "landing.h1b": "call before",
  "landing.h1c": "the",
  "landing.h1gun": "gun.",
  "landing.lede":
    "A model trained on real results, not gut feeling. We scrape every World Athletics mark across all {{n}} Diamond League disciplines and call the podium in Brussels, before anyone races.",
  "landing.ctaPrimary": "View live predictions",
  "landing.ctaSecondary": "Browse all {{n}} events",
  "landing.statHitRate": "Podium hit rate",
  "landing.statDays": "Days to Brussels",
  "landing.statDisciplines": "Disciplines tracked",
  "landing.statMarks": "Marks scored",
  "landing.statsLoading": "Loading live stats…",
  "landing.statsError":
    "Live stats aren't reachable right now. The numbers above will fill in once the model is running.",
  "landing.tickerWithRange":
    "Live from the model: all {{n}} disciplines, {{lo}}–{{hi}}%, and it's far surer about some finals than others",
  "landing.ticker": "Live from the model: each discipline's top pick, and its chance of a podium",
  "landing.tickerAria": "Live model confidence by discipline",
  "landing.podiumEyebrow": "The projected podium",
  "landing.podiumTitle": "The three the model backs hardest in Brussels.",
  "landing.podiumError": "The podium fills in once the live model is reachable.",
  "landing.podiumLoading": "Loading the model's strongest calls…",
  "landing.podiumNoteBefore": "Each of these is the model's strongest call in a ",
  "landing.podiumNoteDifferent": "different",
  "landing.podiumNoteAfter":
    " discipline, so they aren't racing each other. The steps rank the model's confidence, not the athletes. The percentage is a chance of finishing top three, not of winning; marks are 2026 season bests from World Athletics.",
  "landing.demoEyebrow": "Real results in. A ranked field out.",
  "landing.demoTitleWithCount": "{{n}} meetings of real racing, resolved into one call.",
  "landing.demoTitle": "A season of real racing, resolved into one call.",
  "landing.demoBodyBefore": "Every Diamond League meeting this season is scraped from ",
  "landing.demoBodyAfter":
    ", then reduced to the model's single strongest prediction for the Final.",
  "landing.rawSignal": "Raw signal",
  "landing.strongestCall": "Model's strongest call",
  "landing.rankedLoad": "Ranked predictions load once the live model is running.",
  "landing.stepsEyebrow": "No fabricated data, anywhere in the pipeline.",
  "landing.stepsTitle": "Real data in, honest predictions out, in {{n}} steps.",
  "landing.previewEyebrow": "Straight from the running model",
  "landing.previewTitle": "A live look at the model's current picks.",
  "landing.previewCrumb": "PodiumCall / Dashboard",
  "landing.previewHeading": "Most likely to reach the podium",
  "landing.previewSub":
    "The model's strongest pick in each discipline: the chance of finishing top three, not of winning",
  "landing.seeAll": "See all {{n}} disciplines →",
  "landing.previewLoading": "Loading live predictions…",
  "landing.footerLink": "View live predictions →",
  "landing.step1Title": "Scrape real results",
  "landing.step1Body":
    "Every Diamond League meet, plus the Olympics, World Championships, Continental Tour Gold meets, and the European Championships. All of it pulled straight from World Athletics' own API, not hand-typed.",
  "landing.step2Title": "Engineer real features",
  "landing.step2Body":
    "Season form, consistency across meets, recency, schedule pacing, head-to-head history, wind adjustment: 15 in all. Every candidate since gets scored across ten random seeds against a shuffled control, and dropped when it can't beat one. Several have been.",
  "landing.step3Title": "Validate honestly",
  "landing.step3Body":
    "Walk-forward validated across five independent seasons (2021–2025), training only on years strictly before each test year, never on the future.",
  "landing.step4Title": "Check who is actually racing",
  "landing.step4Body":
    "News and meet recaps are scanned automatically before anything is scored. Flagged athletes carry a watch badge with a link to the source; confirmed withdrawals are dropped from the field entirely.",
  "landing.step5Title": "Predict live",
  "landing.step5Body":
    "The model re-scores the whole field from fresh World Athletics data on every refresh, right up to Brussels.",
  "landing.spell.3": "three",
  "landing.spell.4": "four",
  "landing.spell.5": "five",
  "landing.spell.6": "six",

  "landing.confidenceFeedLoads": "Confidence feed loads once the live model is running.",
  "landing.podiumRankedBy": "Ranked by each athlete’s chance of finishing in the top three.",
  "landing.corpusMore": "+ {{n}} more competitions across {{seasons}} seasons ({{first}}–{{last}}), scraped directly from World Athletics.",
  "landing.corpusFallback": "…and every other competition in the model’s training data, scraped directly from World Athletics.",

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
