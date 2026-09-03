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
    "How often the model's projected top three matches the real medallists, counting only the athletes who reach a Final. It's tested only on past years the model never learned from, so the number isn't flattering itself.",
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
    "The eight events where even the favourite has a low chance of a podium. These finals are the most wide open, and the most likely to surprise.",
  "dashboard.leastSure.note":
    "Each number is the favourite's own chance of a podium, not how far ahead they are of the next athlete. A low number means no one in that event stands out. Tap a row to see the full field.",
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
    "Ranked by season best, each athlete's top mark this year. The podium chance is the model's own estimate and can disagree with this order.",
  "table.subtitle.prob":
    "Ranked by the model's podium chance. The # column still counts by season best, so its numbers look out of order here.",
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
    "The finishing order you'd get by ranking on season best alone, each athlete's fastest or longest mark this year. A real result you can look up, separate from the model's podium chance.",
  "table.colPodiumChance": "Podium chance",
  "table.colPodiumChanceHint":
    "The model's estimate of how likely this athlete is to finish in the top three, not to win. A higher number is a stronger podium threat, which is why it can rank athletes differently from their season best.",
  "table.sortedActivateReverse": " — sorted, activate to reverse",
  "table.activateToSort": " — activate to sort by this column",
  "table.qTitle":
    "Confirmed in World Athletics' own 2026 Diamond League standings for this discipline",
  "table.qSr": "ualified — confirmed in World Athletics' 2026 Diamond League standings",
  "table.notQualifiedHeading": "Not qualified: below the top {{n}} on Diamond League points",
  "table.notQualifiedNote":
    "Fast enough to belong here, but without a qualifying place: either below the points cut-off, or with no Diamond League points in this event at all. The model still scores them, so you can see who would be a threat if they got in.",
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
    "Which events are packed with strong athletes, and which come down to one star ahead of everyone else. Every 2026 mark is turned into World Athletics points, then we measure the gap between each event's best athlete and its middle-ranked one. A small gap means a deep, competitive field; a big gap means one athlete far clear of the rest.",
  "stats.figMarksScored": "Marks scored",
  "stats.figFieldMedian": "Middle score (WA pts)",
  "stats.figScoringRange": "Scoring range",
  "stats.figSetIndoors": "Set indoors",
  "stats.bestOfSeason": "Best of the season",
  "stats.bestOfYear": "Best of {{season}}, any event",
  "stats.bestSubtitle":
    "Ranked by World Athletics points, so a discus throw and an 800m can be compared directly. The bars start at this season's lowest score, not at zero, so the differences are easier to see.",
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
  "depth.sortMedian": "By middle score",
  "depth.sortTop": "By best score",
  "depth.title": "The depth ladder · {{n}} disciplines",
  "depth.subtitle":
    "Each bar runs from the middle-ranked athlete's score to the best score in that event. A short bar means a deep field, where the leader is close to the pack. A long bar means one athlete well clear of the rest.",
  "depth.legendMedian": "Middle of the field",
  "depth.legendTop": "Best in the event",
  "depth.legendSpread": "Gap (best − middle)",
  "depth.noteBefore": "The deepest event by this measure is the ",
  "depth.noteMid": ", where the leader is just ",
  "depth.notePointsClear": " points ahead of its middle-ranked athlete. The most one-sided is the ",
  "depth.noteAt": " at ",
  "depth.noteEnd":
    " points. This gap covers everyone World Athletics ranks in the event, which is a different question from how close the eight finalists are, and each event's own page answers that.",

  // How it works (inline emphasis uses **bold** / *italic*, see lib/rich-text)
  "howItWorks.eyebrow": "About the model",
  "howItWorks.description":
    "PodiumCall calls the podium for every event at the 2026 Diamond League Final, from real World Athletics results, before anyone races. Here's exactly how it does that, and how well it works.",
  "howItWorks.s1.title": "What it predicts",
  "howItWorks.s1.p1":
    "For every one of the **32 events** at the Brussels Final, the model gives each contender a single number: their chance of finishing **in the top three**. It never names one winner.",
  "howItWorks.s1.p2":
    "That's deliberate. On the day, the fastest qualifier can false-start, get blocked in, or be caught on the line, so picking the exact winner is close to a coin toss between three or four names. Picking who makes the podium is a fairer question, and one you can check against the result afterwards. So every number on the site is about the top three, never the gold medal alone.",
  "howItWorks.s2.title": "How the model learns",
  "howItWorks.s2.p1":
    "The model learns from the real podiums of every Diamond League Final from **2018 to 2025** (2020 was cancelled). These are actual results, taken straight from World Athletics, not anyone's opinion of who should have won.",
  "howItWorks.s2.p2":
    "For each athlete in the running, the model works out **14 signals** from their real season: their best mark this year and their career best, how steady they've been from meeting to meeting, which way their form is heading, how often they've raced, and their record **head-to-head against this exact field**. A **random forest**, a model that weighs many signals together, turns all of it into one number: the chance of a podium. It weighs them together because the signals affect each other. A superb season best counts for less, for example, if the athlete has barely raced all year.",
  "howItWorks.s2.p3":
    "And it's tested honestly, using **walk-forward validation**: the model is only ever trained on seasons *before* the year it's scored on, so the accuracy below comes entirely from Finals it had never seen. That's the difference between a real forecast and a model that has simply memorised the answers.",
  "howItWorks.s3.title": "How accurate it is",
  "howItWorks.s3.basisFallback":
    "Podium hit rate among the athletes who actually reach the Final",
  "howItWorks.s3.toplistCaption":
    "A much harder test: picking the 3 medallists out of a discipline's full ranking list of about 100 athletes, which the site never actually does.",
  "howItWorks.s3.note":
    "Both numbers come from the same predictions; they just ask different questions. The first is the real job the site does: given the eight to ten athletes who actually make a Final, how often is the model's projected top three correct? The second is a deliberately harder test it never faces in practice. The two sit about twelve points apart, and neither is rounded up or taken from a flattering season.",
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
    "It reads **form, not the future**. A last-minute injury, a withdrawal announced on the morning, or a slow tactical race decided by a final sprint can all beat the numbers on the day.",
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
    "This uses World Athletics' points, not the model's percentages. A percentage only compares athletes within the same event: add up a whole field's percentages and the total swings anywhere from 31 to 320 depending on the event, so they can't rank one event against another. A points score can, because every mark is scored the same way.",
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
    "Every finalist's best score this season, strongest to weakest. The gap between the two ends is what ranks this event against the other {{of}}.",
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
    "The points gap between the strongest and weakest finalist. A small gap means a close, even field; a big gap means the leader is well ahead.",
  "disc.statStrongest": "Strongest finalist",
  "disc.statMedian": "World top-100 median",
  "disc.statMedianNoScore": "not scored this season",
  "disc.statMedianClear": "strongest finalist is {{n}} clear",
  "disc.statMedianHint":
    "The middle score among the world's top 100 in this event this year. It shows how the Final's field compares to the wider world, not just to itself.",
  "disc.statScored": "Field scored",
  "disc.statScoredEvery": "every finalist",
  "disc.statScoredSome": "some carry no score this season",
  "disc.statScoredHint":
    "How many of the finalists have a World Athletics score this season. A few events have one or two who don't, and nothing is estimated in their place.",
  "disc.disagreeTitle": "Where the model disagrees with the marks",
  "disc.disagreeSubtitle":
    "The model's podium chance next to each athlete's season score, for the same {{n}} athletes. The two don't always agree, and the athletes where they disagree are the most interesting to watch.",
  "disc.disagreeNote":
    "Ordered by World Athletics score. The percentage is the model's chance of that athlete finishing top three, not a chance of winning. The two columns can disagree: a season best is a single result, while the projection weighs the whole season.",

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
    "The same measures for every contender, so two athletes with near-identical season bests can still be told apart.",
  "fa.separatesCaption":
    "What separates the {{disc}} field: the same measures for every contender, so two athletes with near-identical season bests can be told apart.",
  "fa.colTop3": "Top-3 avg",
  "fa.colTop3Hint":
    "The average of this athlete's three best marks this season. Harder to inflate with one lucky result than a single season best is.",
  "fa.colSteadiness": "Steadiness",
  "fa.colSteadinessHint":
    "How close together an athlete's marks are across the season, measured against their average. Lower means more consistent, and it works the same for a sprinter and a thrower.",
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

  "fa.blankCellNote": "A blank cell means those two have genuinely never {{verb}} each other, shown as empty rather than as a 0–0 draw. The “vs. this field” column totals each athlete's record against this field only, which is not their overall win rate: an athlete can beat everyone else and still trail the eight who line up in Brussels.",
  "fa.neverMet": "{{a}} and {{b}} have never {{verb}} each other",

  "fa.noResults": "no results",

  "traj.excludedOne": "{{names}} has no {{year}} meeting data on record yet. See their profile for their most recent season.",
  "traj.excludedMany": "{{names}} have no {{year}} meeting data on record yet. See their profile for their most recent season.",

  // Athlete analytics
  "aa.recordTitle": "Competition record",
  "aa.recordSubtitle":
    "Every final on record: {{n}} {{noun}} across {{seasons}} seasons. A season best is a single result; this is how they performed the rest of the time.",
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
    "Consistency measures how close an athlete's marks are across a season, against their average, so it works the same for a 9.8-second sprinter and a 74-metre thrower. Lower is steadier. Each bar compares one season only to this athlete's other seasons.",
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
    " discipline, so they aren't competing against each other. Their places here show how confident the model is, not how the athletes would finish. Each percentage is a chance of a top-three finish, not of winning; marks are 2026 season bests from World Athletics.",
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

  "podium.chanceOfPodium": "Chance of a podium",
  "wa.ariaLabel": "World Athletics (opens in a new tab)",
  "notFound.title": "Page not found",
  "notFound.body": "The page you’re looking for doesn’t exist or has been moved.",
  "notFound.goHome": "Go home",

  // Why an athlete is not in the projected field. Mirrors api.py's
  // points_cut_reason()/build_not_in_field() so the sentence can be rebuilt
  // in the reader's language from the structured fields the API already
  // sends (reasonCode + dl), rather than translating its English prose.
  "reason.pointsCut":
    "{{rank}} in the {{disc}} Diamond League standings on {{points}} points, outside the top {{limit}} who qualify for the Final.",
  "reason.tailOut": " Too far back to be caught up now.",
  "reason.tailShortOne": " {{gap}} point short of the cut.",
  "reason.tailShortMany": " {{gap}} points short of the cut.",
  "reason.tailTieBreak": " Level on points with the cut, behind on World Athletics' tie-break.",
  "reason.notInStandings":
    "Not in World Athletics' official Diamond League standings for {{disc}} — no Diamond League points scored in this discipline this season. Points are what earns a place at the Final, regardless of how fast they have run elsewhere.",
  "reason.injuryRemoved": "Removed from the projected field by the injury check.",
  "reason.outsideCut":
    "In the Diamond League standings but outside the projected top {{limit}} on season best for {{disc}}.",
  "reason.noData": "No {{year}} season mark on record for {{disc}}.",

  // Discipline names, keyed by discKey. A closed set of 32, so they can be
  // translated on the key without the API having to know a language. The
  // English here matches what the API already sends, so nothing changes for
  // English readers; anything unrecognised falls back to the API's label.
  "disc.name.men_100m": "Men's 100m",
  "disc.name.women_100m": "Women's 100m",
  "disc.name.men_200m": "Men's 200m",
  "disc.name.women_200m": "Women's 200m",
  "disc.name.men_400m": "Men's 400m",
  "disc.name.women_400m": "Women's 400m",
  "disc.name.men_110h": "Men's 110m Hurdles",
  "disc.name.women_100h": "Women's 100m Hurdles",
  "disc.name.men_400h": "Men's 400m Hurdles",
  "disc.name.women_400h": "Women's 400m Hurdles",
  "disc.name.men_800m": "Men's 800m",
  "disc.name.women_800m": "Women's 800m",
  "disc.name.men_1500m": "Men's 1500m",
  "disc.name.women_1500m": "Women's 1500m",
  "disc.name.men_5000m": "Men's 5000m",
  "disc.name.women_5000m": "Women's 5000m",
  "disc.name.men_3000sc": "Men's 3000m Steeplechase",
  "disc.name.women_3000sc": "Women's 3000m Steeplechase",
  "disc.name.men_HJ": "Men's High Jump",
  "disc.name.women_HJ": "Women's High Jump",
  "disc.name.men_PV": "Men's Pole Vault",
  "disc.name.women_PV": "Women's Pole Vault",
  "disc.name.men_LJ": "Men's Long Jump",
  "disc.name.women_LJ": "Women's Long Jump",
  "disc.name.men_TJ": "Men's Triple Jump",
  "disc.name.women_TJ": "Women's Triple Jump",
  "disc.name.men_SP": "Men's Shot Put",
  "disc.name.women_SP": "Women's Shot Put",
  "disc.name.men_DT": "Men's Discus Throw",
  "disc.name.women_DT": "Women's Discus Throw",
  "disc.name.men_JT": "Men's Javelin Throw",
  "disc.name.women_JT": "Women's Javelin Throw",

  "podium.strongestCall": "Strongest call",
  "podium.sb": "SB {{mark}}",

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
