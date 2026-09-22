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
  "nav.ultimate": "Ultimate",
  "nav.asianGames": "Asian Games",
  "nav.championship": "Championship",
  "nav.stats": "Performance",
  "nav.schedule": "Schedule",
  "nav.results": "Results",
  "results.title": "How the last predictions turned out",
  "results.eyebrow": "The model’s track record",
  "results.description":
    "Every championship the model called in advance, with the projection frozen before the meet and the result that followed. Nothing here was rewritten afterwards.",
  "results.meet.dlFinal": "Diamond League Final 2026",
  "results.meet.ultimate": "Ultimate Championship 2026",
  "results.meet.asianGames": "Asian Games 2026",
  "results.eventsWord": "{{n}} events",
  "results.eventsSoFar": "{{done}} of {{n}} events so far",
  "results.notRunYet": "Not run yet",
  "results.badgeCalled": "Called in advance",
  "results.pendingMeet":
    "The model’s call on all {{n}} events was frozen before the first session and cannot be edited now. This opens up with the comparison once the championship has been run.",
  "results.figPodium": "Podium places called",
  "results.figShare": "Of the places available",
  "results.figMeets": "Championships",
  "results.figBacktest": "What the model claims",
  "results.figBacktestHint":
    "The hit rate the model scores across every championship final in its training history, testing only on seasons it was not trained on. The figure beside it is what actually happened at one meeting it had never seen. They should be close; if they ever stop being close, the claim is the thing that is wrong.",
  "results.scorecardTitle": "Why this page exists",
  "results.scorecardNote":
    "Every other accuracy number on this site is a backtest — honest, but still the model being marked on races it was scored against afterwards. This is the other kind of evidence. These projections were published before the Final was run and left alone, so what you are reading is a forecast and its outcome, not a model explaining itself in hindsight. Pick an event to see who the model had, who actually finished there, and where it was wrong.",
  "results.pendingTitle": "Nothing to show yet",
  "results.pendingBody":
    "No final has been contested since the last projection was published. This page fills in once one has.",
  "results.error": "Could not load the results.",
  "nav.howItWorks": "How it works",
  "nav.live": "Live",
  "nav.searchAthletes": "Search athletes",
  "nav.updated": "Updated {{date}}",
  "nav.language": "Language",
  "nav.back": "← Back",
  "nav.skipToContent": "Skip to content",

  // Ultimate Championship (Budapest, 11-13 Sep 2026)
  "ultimate.title": "The Ultimate Championship",
  "ultimate.tagline": "The best against the best, in Budapest.",
  "ultimate.stat.days": "Days to Budapest",
  "championship.stat.daysTo": "Days to {{city}}",
  "championship.chip.days": "{{n}} days to {{city}}",
  "championship.chip.dayOne": "1 day to {{city}}",
  "championship.chip.live": "Live in {{city}}",
  "championship.chip.done": "{{city}} is over",
  "championship.projection.titlePoints": "Ranked on points · {{disc}}",
  "championship.projection.subtitle": "{{n}} athletes entered, {{ranked}} ranked below.",
  "championship.projection.whyTooFew":
    "Only {{n}} athletes entered here have a mark the model can read. It needs {{needed}} to call an event, so this one is ranked on points instead.",
  "championship.projection.colMark": "Best mark",
  "championship.projection.markHint":
    "The athlete's best mark in this event in 2026, from World Athletics' Asian toplist or the athlete's own World Athletics profile. An athlete with no 2026 mark is judged on their 2025 best, tagged 2025.",
  "championship.projection.markSeason": "Mark from {{year}}",
  "championship.projection.oldMarks":
    "This season, plus {{percent}}% of a better mark from {{year}}",
  "championship.projection.colPoints": "Points",
  "championship.projection.pointsHint":
    "World Athletics points for the best mark shown. More points means a better mark. This column is an order, not a forecast.",
  "championship.projection.chanceHint":
    "The model's chance that this athlete finishes in the top three. The column adds up to 300 across the field, not 100: one hundred for each medal.",
  "championship.projection.colWin": "Win chance",
  "championship.projection.winHint":
    "The model's chance that this athlete wins. The column adds up to 100 across the field.",
  "championship.projection.unrankedTitle": "Entered, not ranked ({{n}})",
  "championship.projection.unrankedHint":
    "These athletes are on the organisers' entry list, but we found no mark to rank them by. Each row says why. They take no place in the order above.",
  "championship.projection.unranked.notFound": "No World Athletics profile matches this entry",
  "championship.projection.unranked.noMark":
    "No 2026 result in this event, and not on the 2025 Asian toplist",
  "championship.projection.unranked.lookupFailed": "World Athletics didn't answer when we checked",
  "championship.projection.unranked.notScored":
    "Has a mark, but the model could not match it to this athlete's record",
  "championship.projection.unscored":
    "Entered, with no 2026 mark we could find in this event: {{names}}.",
  "championship.projection.noteModel":
    "The entry list is the organisers'. The order and the chances are the model's.",
  "championship.projection.notePoints":
    "The entry list is the organisers'. The order is World Athletics points for each athlete's best mark, not a forecast.",
  "championship.projection.byModel": "called by the model",
  "championship.projection.captionModel":
    "Every entrant in the {{disc}} with a mark from 2026 or 2025, ranked by the model's chance of a podium",
  "championship.projection.captionPoints":
    "Every entrant in the {{disc}} with a mark from 2026 or 2025, ranked by World Athletics points",
  "asianGames.title": "The Asian Games",
  "asianGames.hero.headline": "Asia's best, in {{city}}.",
  "asianGames.hero.body":
    "Athletics runs {{dates}} at {{venue}}. {{entrants}} athletes from {{federations}} nations are entered.",
  "asianGames.hero.bodyBare": "Athletics runs {{dates}} at {{venue}}.",
  "asianGames.split.aria":
    "{{model}} events called by the model, {{points}} ranked on points, {{none}} not called",
  "asianGames.split.model": "by the model",
  "asianGames.split.points": "on points",
  "asianGames.split.none": "not called",
  "asianGames.how.title": "How each event is called",
  "asianGames.how.field":
    "The field is the organisers' official entry list, so nobody here is a guess.",
  "asianGames.how.model":
    "Every event is called by one model, which compares each athlete with the others entered. This season counts in full and counts most: the average of their five best marks, their form over the last six weeks, their podiums at major meetings such as the Diamond League, and their record against the strongest entrants in finals they have shared. An older mark counts only where it still beats what they have done this year, counts for less the older it is, and never counts for enough to put them ahead of someone faster this season.",
  "asianGames.how.test":
    "We tested it on {{finals}} past championship finals from {{from}} to {{to}}. It picked {{model}}% of the medallists, and simply ranking by World Athletics points picked {{points}}%: about the same, not better. On the {{asiaFinals}} Asian finals it picked {{asiaModel}}%, against {{asiaPoints}}% for points.",
  "asianGames.how.testHeld":
    "We tested it on the {{finals}} championship finals of {{from}} and {{to}}, kept aside while it was built, each year called only from the years before. It named {{model}}% of the medallists, against {{previous}}% for the model it replaced and {{points}}% for a ranking by World Athletics points. On the {{asiaFinals}} Asian finals it named {{asiaModel}}%, against {{asiaPrevious}}% for the old model, though a ranking by points named {{asiaPoints}}% there.",
  "asianGames.how.testOldMarks":
    "We tried {{versions}} ways of counting old marks on the {{finals}} championship finals from {{from}} to {{to}}, calling each season only from the seasons before it, and kept the most accurate one that follows that rule. It named {{model}}% of the medallists, against {{previous}}% for the model it replaces, which let an old mark outweigh this season, and {{points}}% for a ranking by World Athletics points. On the {{asiaFinals}} Asian finals it named {{asiaModel}}%, against {{asiaPoints}}% for points. Those same seasons were used to choose it, so the Asian Games will be its first real test.",
  "asianGames.how.testAllSeasons":
    "We tested {{versions}} versions of the model on the {{finals}} championship finals from {{from}} to {{to}}, calling each season only from the seasons before it, and kept the one that named the most medallists: {{model}}%, against {{points}}% for a ranking by World Athletics points. On the {{asiaFinals}} Asian finals it named {{asiaModel}}%, against {{asiaPoints}}% for points. Those same seasons were used to choose it, so the Asian Games will be its first real test.",
  "asianGames.field.pending":
    "The call is not built yet. The field and the call appear here once it is.",
  "asianGames.notCalled.title": "Events without a call",
  "asianGames.notCalled.subtitle": "{{n}} events on the programme have no call, and this is why.",
  "asianGames.notCalled.relay": "Relays",
  "asianGames.notCalled.relayNote":
    "The model reads individual athletes. A relay team has no record of its own to read.",
  "asianGames.notCalled.noData": "No data to call on",
  "asianGames.notCalled.noDataNote":
    "We hold no toplist, results history or model for these events.",
  "asianGames.notCalled.noEntries": "Nobody entered",
  "asianGames.notCalled.noEntriesNote": "The entry list has no athletes for these events.",
  "asianGames.notCalled.entrants": "{{n}} entered",
  "asianGames.eventLabel": "{{sex}} {{event}}",
  "asianGames.sex.M": "Men's",
  "asianGames.sex.W": "Women's",
  "asianGames.sex.X": "Mixed",
  "asianGames.event.10000M": "10,000m",
  "asianGames.event.MARATHON": "marathon",
  "asianGames.event.HAMMER": "hammer throw",
  "asianGames.event.DECATH": "decathlon",
  "asianGames.event.HEPTATH": "heptathlon",
  "asianGames.event.WALKHM": "half marathon race walk",
  "asianGames.event.WALKM": "marathon race walk",
  "asianGames.event.4X100M": "4 × 100m relay",
  "asianGames.event.4X400M": "4 × 400m relay",
  "nagoya.cover.edition": "20th Asian Games",
  "nagoya.countdown.startsIn": "Until the first day of athletics",
  "nagoya.countdown.days": "days",
  "nagoya.countdown.hours": "hours",
  "nagoya.countdown.minutes": "minutes",
  "nagoya.countdown.seconds": "seconds",
  "nagoya.countdown.aria":
    "{{days}} days, {{hours}} hours and {{minutes}} minutes until the first day of athletics",
  "nagoya.countdown.dayOf": "Day {{n}} of {{total}}",
  "nagoya.countdown.over": "The Games are over",
  "nagoya.glance.title": "The call at a glance",
  "nagoya.glance.lede":
    "The favourite in every event with a call, and their chance of finishing in the top three. Choose an event to see everyone entered in it.",
  "nagoya.glance.onPoints": "World Athletics points, not a forecast",
  "nagoya.glance.next": "Then {{names}}",
  "nagoya.glance.openTable": "See the full field",
  "nagoya.glance.pagePrev": "Previous events",
  "nagoya.glance.pageNext": "Next events",
  "nagoya.glance.stripLabel": "{{group}}: each event's favourite",
  "nagoya.field.title": "Everyone entered, event by event",
  "nagoya.field.lede":
    "Choose an event. The table lists everyone on the organisers' entry list, in the order of the call.",
  "nagoya.foot.title": "Every final is graded on the Results page",
  "nagoya.foot.body":
    "The call was fixed before the first session and will not change. After each final, it is set beside the real result.",
  "nagoya.foot.cta": "Open the Results page",
  "ultimate.stat.liveValue": "Live",
  "ultimate.stat.liveLabel": "Racing in Budapest",
  "ultimate.stat.doneValue": "Done",
  "ultimate.stat.doneLabel": "Championship over",
  "ultimate.stat.events": "Events",
  "ultimate.stat.perTrack": "Per track final",
  "ultimate.stat.perTrackHint":
    "Track finals take {{track}} athletes; field events take {{field}}.",
  "ultimate.stat.prize": "Prize pool",
  "ultimate.about.title": "Budapest 26",
  "ultimate.about.body":
    "The World Athletics Ultimate Championship is a new invitational that brings the world's best in each event together for three evenings at {{venue}}, {{city}} ({{dates}}). Small fields, direct places for the biggest names, and a US$10 million purse.",
  "ultimate.chip.venue": "{{venue}}, {{city}}",
  "ultimate.chip.sessions": "{{n}} evening sessions",
  "ultimate.chip.fields": "Fields of {{track}} / {{field}}",
  "ultimate.qualify.title": "How you get in",
  "ultimate.qualify.direct":
    "A direct place for the reigning Olympic champion, the reigning world champion, and each event's 2026 Diamond League Final winner.",
  "ultimate.qualify.rankings":
    "Every remaining place is filled from the World Athletics Rankings over the qualifying year.",
  "ultimate.qualify.note": "So the field is, by design, the best in the world in each discipline.",
  "ultimate.qualifiers.title": "Already qualified",
  "ultimate.qualifiers.note":
    "World Athletics has named the champions who already hold a place. Every remaining place is decided by the world rankings, which are not published yet.",
  "ultimate.qualifiers.olympic": "Olympic champions",
  "ultimate.qualifiers.olympicNote": "A place for winning in Paris in 2024.",
  "ultimate.qualifiers.world": "World champions",
  "ultimate.qualifiers.worldNote": "A place for winning in Tokyo in 2025.",
  "ultimate.qualifiers.dl": "Diamond League Final winners",
  "ultimate.qualifiers.dlNote": "A place for winning the 2026 Diamond League Final.",
  "country.bestTitle": "Best of the season",
  "country.bestNote":
    "The three strongest performances by this nation, on the World Athletics score.",
  "country.scoreOf": "{{score}} pts",
  "country.filterLabel": "Filter these athletes",
  "country.filterPlaceholder": "Filter by name or event…",
  "country.noMatch": "No athlete here matches “{{query}}”.",
  "country.showAll": "Show all {{n}} more",
  "country.backToStats": "← Back to the Performance Index",
  "country.athletes": "Athletes",
  "country.disciplines": "Events",
  "country.bestScore": "Best score",
  "country.lede": "{{athletes}} across {{events}} this season.",
  "country.notFoundTitle": "No athletes on file",
  "country.notFound":
    "No athlete from {{code}} appears in this season's world lists, so there is nothing to show yet.",
  "country.errorTitle": "Could not load this country",
  "country.ultimateTitle": "At the Ultimate Championship",
  "country.ultimateNote": "Places already held in Budapest, 11–13 September.",
  "country.qualifiersTitle": "Direct places",
  "country.relaysTitle": "Mixed relays",
  "country.relayPlace": "Place {{place}} at the World Relays, {{mark}}",
  "country.relayNoTime": "{{mark}} at the World Relays",
  "country.relayHost": "Host place",
  "country.relayQualified": "Qualified",
  "country.relayOneRound": "(one round)",
  "country.relayMeets": "{{n}} meets",
  "country.relayMoreSquad": "+{{n}} more used",
  "country.relaySquadNote":
    "The athletes each nation actually ran at the World Relays, with the leg they ran. Numbers are appearances, so a name in every round is a fixed squad member rather than a substitute.",
  "country.relayNote":
    "Relay places were decided at the World Athletics Relays. The squad is who each nation actually ran there and at the 2025 World Championships, most-used first. The model does not rate relay teams: it is built on individual events, and the Diamond League has no relays.",
  "country.athletesNote": "{{n}} ranked this season, best first.",
  "country.athletesNoteEntered":
    "{{n}} ranked this season, best first, then the athletes entered at the championship who have no result this season.",
  "country.athletesNoteEnteredOnly": "Entered at the championship, with no result this season.",
  "country.noResultThisSeason": "No result in this event this season",
  "country.colAthlete": "Athlete",
  "country.colEvent": "Event",
  "country.colMark": "Best mark",
  "country.colScore": "Score",
  "country.more": "{{n}} more not shown.",
  "country.scoreNote":
    "Score is the World Athletics Results Score, which compares performances across different events. Athletes are ordered by it rather than by podium chance, because a podium chance only compares within one event.",
  "ultimate.relays.title": "Mixed relays",
  "ultimate.relays.note":
    "Two of the 28 events are mixed relays, and they qualified by their own route.",
  "ultimate.relays.from": "Top {{n}} at the {{meet}} in {{city}}, plus the host.",
  "ultimate.relays.noModel":
    "The model does not rate relay teams. It is built from individual events, and the Diamond League has no relays, so there is no history to learn a national team from. These are the qualifying results, not a projection.",
  "ultimate.projection.title": "The model's call · {{disc}}",
  "ultimate.projection.subtitle":
    "All {{n}} qualified athletes, ranked by the model. The field is World Athletics' own: everyone here has qualified, for {{places}} places.",
  "ultimate.projection.caption":
    "Every qualified athlete in the {{disc}}, ranked by the model's chance of a podium",
  "ultimate.projection.colRoute": "How they qualified",
  "ultimate.projection.colChance": "Podium chance",
  "ultimate.projection.routeHint":
    "World Athletics' own wording. A wild card is a place held for a champion: the 2024 Olympic winner, the 2025 world champion and the 2026 Diamond League Final winner in each event get one automatically. Everyone else got in on their World Athletics Ranking over the qualifying year.",
  "ultimate.projection.chanceHint":
    "The model's estimate that this athlete finishes in the top three of this event. It is each athlete's own chance, not a share of one hundred, so the column does not add up to 100 — in a close event several athletes can all be likely medallists.",
  "ultimate.projection.flaggedTitle": "Reported out",
  "ultimate.projection.flaggedHint":
    "These athletes are still in World Athletics' qualified field, but a report says they will not be there. Only a reported withdrawal moves an athlete down here — an injury mention that stops short of one keeps its place in the list above, with a Watch badge on it. The number beside each name is the place the model gave them; the list above is numbered by who is expected to start, which is why it runs straight from 1. Nobody is deleted, because a match can be wrong: tap the badge to read the report and judge it yourself.",
  "ultimate.projection.alsoQualified": "also in the {{events}}",
  "ultimate.projection.alsoClash": "also in the {{events}}, which clashes",
  "ultimate.projection.subtitleEntered":
    "All {{n}} athletes on World Athletics' official entry list for this event, ranked by the model. {{places}} places.",
  "ultimate.projection.notEntered":
    "Qualified for this event but not on the entry list, so not ranked above: {{names}}.",
  "ultimate.projection.promoted":
    "The model's own top three included {{names}}, since reported out. The three below are the next in its order.",
  "ultimate.projection.unscored":
    "Qualified but not ranked here, with no 2026 mark on file for this event: {{names}}.",
  "ultimate.projection.note":
    "Who is entered comes from World Athletics; only the order is the model's. Each percentage is that athlete's own chance of finishing in the top three, so they do not add up to 100.",
  "ultimate.field.title": "The full field",
  "ultimate.field.pending":
    "World Athletics publishes the official start lists and session timetable in the days before the meet. This page fills in with the real field and live results as soon as they do.",
  "ultimate.field.publishedSoon": "Start lists are up — the field and results appear here.",
  "ultimate.hero.kicker": "{{short}} · {{dates}}",
  "ultimate.hero.headline": "The best against the best.",
  "ultimate.hero.daysToGo": "Days to go",
  "ultimate.hero.fieldsLabel": "Field (track / field)",
  "ultimate.hero.nights": "Evenings",

  // Search
  "search.placeholder": "Search any athlete…",
  "search.searching": "Searching…",
  "search.noMatch": "No athlete matches “{{query}}”.",
  "search.worldRank": "world #{{rank}}",
  "search.countryHint": "{{athletes}} · {{events}}",

  // Footer (the source name is a link rendered between these two)
  "footer.scrapedFrom": "Data scraped from",
  "feedback.trigger": "Send feedback",
  "feedback.title": "Found something wrong?",
  "feedback.body":
    "This site is built from public data and it does get things wrong. If a number looks off, an athlete is in the wrong event, or something here just doesn’t make sense, say so. Several of the fixes on this site started as somebody writing in.",
  "feedback.messageLabel": "Your message",
  "feedback.messagePlaceholder": "What did you see, and on which page?",
  "feedback.replyLabel": "Email, if you want a reply",
  "feedback.replyPlaceholder": "Optional",
  "feedback.send": "Send",
  "feedback.sending": "Sending…",
  "feedback.cancel": "Cancel",
  "feedback.close": "Close",
  "feedback.sentTitle": "Sent — thank you.",
  "feedback.sentBody": "One person reads these, so a reply may take a few days.",
  "feedback.error":
    "That did not send. Try again in a moment, or write to rayenhamed65 at gmail dot com.",
  "footer.notAffiliated": "Not affiliated with World Athletics or the Wanda Diamond League.",
  "footer.disclaimer": "Predictions are model estimates, not betting advice.",

  // Common
  "common.tryAgain": "Try again",
  "common.back": "Back",
  "common.rankedAthleteOne": "1 ranked athlete",
  "common.rankedAthleteMany": "{{n}} ranked athletes",
  "common.eventOne": "1 event",
  "common.eventMany": "{{n}} events",
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
    "The model's pick in every event, and where it parts company with the points, with the next championship days away.",
  "dashboard.eventEyebrow": "{{short}} · {{name}}",
  "dashboard.event.title": "Next up",
  "dashboard.event.cta": "Explore the field",
  "dashboard.event.where": "{{venue}}, {{city}} · {{dates}}",
  "dashboard.favourites.title": "The model's favourites",
  "dashboard.favourites.subtitle":
    "The athlete the model rates highest in each event. It weighs the whole season, so it isn't always the athlete with the best mark.",
  "dashboard.favourites.cta": "All rankings",
  "dashboard.favourites.prev": "Previous favourites",
  "dashboard.favourites.next": "Next favourites",
  "dashboard.favourites.stripLabel": "Each event's favourite, highest rating first",
  "dashboard.fav.rating": "rating",
  "dashboard.disagree.title": "Where the model disagrees",
  "dashboard.disagree.subtitle":
    "Events where the model's pick isn't the points leader. Points rank a single best mark; the model weighs a whole season of competing, and the two disagree more often than you would think.",
  "dashboard.disagree.model": "Model:",
  "dashboard.disagree.points": "Points:",
  "dashboard.daysOut": "{{days}} days out",
  "dashboard.oneDayOut": "one day out",
  "dashboard.raceDay": "race day",
  "dashboard.underway": "under way",
  "dashboard.stat.daysToBrussels": "Days to Brussels",
  "dashboard.stat.hitRate": "Top-3 hit rate",
  "dashboard.stat.hitRateHint":
    "How often the model's projected top three matches the real medallists, counting only the athletes who reach a Final. It's tested only on past years the model never learned from, so the number isn't flattering itself.",
  "dashboard.stat.hitRateHintChampionship":
    "How often the model's top three matched the real medallists across {{finals}} past championship finals from {{from}} to {{to}}, each season called only from the seasons before it. Those same seasons were used to choose the model, so this championship is its first real test.",
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
  "news.subtitleWithDate":
    "Real headlines matched by the automatic injury check · last run {{date}}",
  "news.loading": "Loading news…",
  "news.empty": "No injury or withdrawal headlines matched any athlete we follow.",
  // Was "Removed from field". Nothing is removed any more -- a flagged
  // athlete keeps their place and their number, so the label has to say
  // what is known about the athlete instead of what the table did.
  "news.removed": "Reported out",
  "watch.badgeOut": "Out",
  "news.reportOne": "1 report",
  "news.reportMany": "{{n}} reports",
  "news.matchedOn": "matched on “{{keywords}}”",
  "news.disclaimerBefore":
    "These are automatically matched headlines, not verified injury reports. A match can be wrong, so the matched keyword is shown for you to judge it yourself, and every removed athlete keeps a full profile you can ",
  "news.searchFor": "search for",
  "news.disclaimerAfter": ".",

  // Track / Field discipline pages
  "common.final2026": "2026 Final",
  "common.projectedField": "Projected field",
  "track.title": "Track events",
  "track.eyebrow": "{{n}} track disciplines",
  "track.description":
    "The world's best in every track event. Pick a discipline, then rank it by World Athletics points, or by the rating from the model that calls the championships.",
  "field.title": "Field events",
  "field.eyebrow": "{{n}} field disciplines",
  "field.description":
    "The world's best in every field event. Pick a discipline, then rank it by World Athletics points, or by the rating from the model that calls the championships.",

  // Track/Field world-ranking tables (points vs model toggle)
  "rankings.loading": "World rankings",
  "rankings.discipline": "Discipline",
  "rankings.panelTitle": "Top 20 · {{label}}",
  "rankings.caption":
    "The top 20 in the {{label}}: mark, World Athletics points, meets on record, and the model rating",
  "rankings.subtitle.points":
    "Ordered by World Athletics points — the score of each athlete's season best. No model involved.",
  "rankings.subtitle.pointsOnly":
    "Ordered by World Athletics points, the score of each athlete's season best. There's no model rating for this event: the model couldn't read enough of these athletes' seasons.",
  "rankings.subtitle.model":
    "Ordered by the model rating, from the same model that calls the championships. It reads these 20 as if they met in one final and rates how likely each is to finish in the top three. It judges this season first: the average of each athlete's five best marks, their recent form, their podiums at major meetings and their record against the strongest. An older mark counts only where it still beats their season, and for less the older it is.",
  "rankings.toggle.label": "Ranking method",
  "rankings.toggle.model": "Model rating",
  "rankings.toggle.points": "By points",
  "rankings.colMark": "Mark",
  "rankings.colPoints": "Points",
  "rankings.colRating": "Model rating",
  "rankings.colMeets": "Meets",
  "rankings.meetsOne": "1 meet",
  "rankings.meetsMany": "{{n}} meets",
  "rankings.pointsHint": "World Athletics' performance score for the athlete's season best.",
  "rankings.ratingHint":
    "The model's read of this athlete against the rest of these 20: how likely they'd be to finish in the top three if the 20 met in one final. An event's 20 ratings add up to 300, so a rating in one event compares with a rating in any other. It's called a rating, not a podium chance, because these athletes aren't all entered in one competition.",
  "rankings.meetsHint":
    "Meets we can see this athlete contest this event in 2026, from the season list, the Diamond League log, the wider race log and the athlete's World Athletics results where we hold them. It is a floor, not a full record: a 1 means one meeting we can see, not necessarily one meeting run. Worth reading next to the model rating, since a rating built on a single outing rests on less than one built on a season.",

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

  // Discipline table — result vs projection (shown once a Final is contested)
  "table.resultTitle": "Result vs projection · {{label}}",
  "table.resultSummary":
    "The model had {{hits}} of the {{n}} who reached the podium in its projected top three.",
  "table.resultNote":
    "What happened at the Final, shown against the model's projection from before the meet. The projection is frozen from beforehand, so nothing here is scored with hindsight.",
  "table.resultCaption":
    "Final result for the {{label}}: finishing position, athlete, nationality, mark, and what the model projected",
  "table.colFinish": "Finish",
  "table.colResult": "Result",
  "table.colModelCall": "Model's call",
  "table.colVsProjected": "vs projected",
  "table.resultPredicted": "Projected {{rank}} · {{prob}}%",
  "table.resultRanked": "Ranked {{rank}} on points",
  "table.resultNearMiss": "Outside the projected field",
  "table.resultUnseen": "Not in the projection",
  "table.resultExact": "As projected",
  "table.resultUpset": "Podium from outside the field",
  "table.resultAboveTitle": "Finished {{n}} places above the projection",
  "table.resultBelowTitle": "Finished {{n}} places below the projection",
  "table.resultAboveOne": "Finished one place above the projection",
  "table.resultBelowOne": "Finished one place below the projection",

  // Schedule
  "schedule.headlineRoad": "The road to the Final.",
  "schedule.headlineCities": "{{word}} cities, then {{host}}.",
  "schedule.headlineCitiesFinal": "{{word}} cities, then the Final.",
  "schedule.eyebrow": "2026 season · {{n}} meetings",
  "schedule.eyebrowBare": "2026 season",
  "schedule.titleNext": "The road ahead",
  "schedule.descriptionNext":
    "The next big championship, and the 2026 Diamond League season that led up to it.",
  "schedule.eyebrowNext": "{{n}} days to {{city}}",
  "schedule.eyebrowNextOne": "1 day to {{city}}",
  "schedule.figNext": "Next championship",
  "schedule.figSeasonRun": "DL meetings run",
  "schedule.upcoming.title": "Next championship",
  "schedule.upcoming.when": "{{dates}} · {{venue}}, {{city}}",
  "schedule.upcoming.cta": "See the field",
  "schedule.season.title": "The 2026 season",
  "schedule.season.subtitle":
    "The Diamond League season, with every meeting scored and the Final complete.",
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
  "stats.indoorNoteBefore":
    "World Athletics lists indoor marks inside its outdoor season rankings, tagged only by a ",
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
    "PodiumCall calls the podium at the big athletics championships and rates the world's best in every event, from real World Athletics results. Here's what the numbers mean, what the model looks at, and how well it works.",
  "howItWorks.s1.title": "What the numbers mean",
  "howItWorks.s1.p1":
    "At a championship, the model gives every athlete entered in an event a chance of finishing **in the top three**. It also gives a chance of **winning**, which shows whether a favourite is clear of the rest or one of several close names.",
  "howItWorks.s1.world":
    "Podium chances are only given for a real competition, where the athletes are actually entered. On Track, Field, each event page, the dashboard and athlete pages, the number is the **model rating** instead. The same model reads the world's top 20 in each event as if they met in one final and rates how likely each is to finish in the top three. The 20 ratings add up to 300, so 60% in the 100m means the same as 60% in the shot put.",
  "howItWorks.s1.p2":
    "The top three comes first on purpose. On the day, the fastest athlete can false-start, get blocked in, or be caught on the line, so the exact winner is often close between three or four names. Who makes the podium is a fairer question, and one you can check against the result afterwards. The win chance says how open that race is, not who will win.",
  "howItWorks.s2.title": "What the model looks at",
  "howItWorks.s2.p1":
    "One model makes every call on the site. It compares each athlete **only with the others in the same final**. It learned how much each thing matters from real finals since 2009: the Olympics, World Championships, continental championships, Asian Games and Diamond League Finals.",
  "howItWorks.s2.p2":
    "**This season counts most, and in full**: the average of an athlete's five best marks, their form over the last six weeks, their podiums at major meetings, and their record against the strongest entrants in finals they have shared. **An older mark counts only where it still beats this season.** It counts for less the older it is, and never for enough to put an athlete ahead of someone faster this season, so a record-breaking season is never outweighed by a big mark from two years ago.",
  "howItWorks.s3.title": "How well it works",
  "howItWorks.s3.test":
    "To test it, we tried **{{versions}} ways of counting old marks** on {{finals}} championship finals from {{from}} to {{to}}, calling each season only from the seasons before it, and kept the most accurate one that follows that rule. It named **{{model}}% of the medallists**, against {{points}}% for a ranking by World Athletics points. Those same seasons were used to choose it, so the championship it is calling now is its first real test.",
  "howItWorks.s3.compare":
    "Until September 2026, Track, Field and the event pages used an older model built for the Diamond League. We ran both models on the same **{{finals}} finals from {{from}} to {{to}}**. This one named **{{model}}% of the medallists** and the older one {{previous}}%. At the Olympics, World and European Championships alone, the figures were {{champModel}}% and {{champPrevious}}%. Both had been tuned on those seasons, so this compares the two fairly but is not a test on finals neither had seen.",
  "howItWorks.s3.withdrawals":
    "Neither figure knows who will turn up. Every final in both tests is scored only on athletes who reached the start line, so they measure how well the model ranks a field, not who ends up in it. Injuries and late withdrawals are a separate question, and the watch flags on the call answer it.",
  "howItWorks.s4.title": "Where the data comes from",
  "howItWorks.s4.pBefore": "Every mark, ranking and result comes straight from ",
  "howItWorks.s4.pAfter":
    "'s own public API, the same data behind their broadcasts and athlete profiles. The scraping runs on a separate machine, and no mark is ever typed in or edited by hand, so what you read here is exactly what they published.",
  "howItWorks.s4.competitions": "Competitions",
  "howItWorks.s4.marks": "Past marks learned from",
  "howItWorks.s4.venues": "Venues",
  "howItWorks.s4.seasons": "Seasons",
  "howItWorks.s4.seasonsDeep": "Seasons deep",
  "howItWorks.s5.title": "What it can't do",
  "howItWorks.s5.b1":
    "It reads **form, not the future**. A last-minute injury, a withdrawal announced on the morning, or a slow tactical race decided by a final sprint can all beat the numbers on the day.",
  "howItWorks.s5.b2":
    "It gives **chances, not certainties**: a favourite with a 60% chance of winning still loses four times in ten, and it never claims to know the exact 1-2-3.",
  "howItWorks.s5.b3":
    "It's **not affiliated with World Athletics** or the Wanda Diamond League. It just reads their public data.",
  "howItWorks.s6.title": "Searching by country",
  "howItWorks.s6.p1":
    "The search box finds **countries as well as athletes**. Type a nation — “Jamaica”, “KEN”, “Norway” — and it appears in the results alongside any athletes whose name matches, with how many ranked athletes and how many events that nation has this season.",
  "howItWorks.s6.p2":
    "Opening one gives that nation its own page: every ranked athlete it has, their marks and scores, its three best performances of the season, and its athletes at the current championship. The page wears the country's own colours, taken from its flag.",
  "howItWorks.next.title": "What's next",
  "howItWorks.next.upcoming1":
    "**{{name}}**: {{dates}}, in {{city}}. The call for every event was made before the first session and won't change.",
  "howItWorks.next.upcoming2":
    "Each final goes on the Results page once it's run, next to the call, so you can see what the model got right and what it missed.",
  "howItWorks.next.upcoming3":
    "Once the last final is run, the call's hit rate joins the earlier championships on the Results page.",
  "howItWorks.next.done1":
    "Every final from **{{name}}** is graded on the Results page, next to the call made before it.",
  "howItWorks.next.done2":
    "The next championship's call goes up on its page once its entry list is published.",
  "howItWorks.close.title": "The call is in. **Watch it play out.**",
  "howItWorks.close.lede":
    "Follow the call event by event, and tell us what you'd like the site to do next.",
  "howItWorks.close.call": "See the call",

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
  "disc.eyebrow":
    "Discipline vs discipline · world top {{n}}, tighter than {{wider}} of the {{of}} finals",
  "disc.eyebrowBare": "Discipline vs discipline",
  "disc.description":
    "One event read as a field rather than a list. The field is the world's best on World Athletics points, as many athletes as a final of its kind. Is it close all the way down, or is one athlete clear of the rest?",
  "disc.whyScore":
    "This uses World Athletics' points, not the model ratings. Every event's top 20 share the same total of ratings, so a rating shows who leads an event but not how close its athletes are. A points score does, because every mark is scored the same way.",
  "disc.depthSkeleton": "Depth of the field",
  "disc.seasonForm": "Real season form · {{disc}}",
  "disc.seasonFormSubtitle":
    "Every mark each contender actually recorded this season, on a real calendar. These aren't a smoothed trend; the dots are the meetings they turned up to.",
  "disc.depthTitle": "Depth of the field",
  "disc.depthNeeds": "Needs a World Athletics score for at least two of the field.",
  "disc.depthNotEnough":
    "Not enough of this field carries a World Athletics score this season to measure how level it is. Nothing is estimated in its place.",
  "disc.levelTitle": "How level this field is",
  "disc.levelSubtitle":
    "The best score this season of each of the world's top {{n}}, strongest to weakest. The gap between the two ends is compared with the fields of {{of}} Diamond League Finals from this season.",
  "disc.verdict.level.label": "LEVEL FIELD",
  "disc.verdict.level.basis": "as tight as the tightest third of the {{of}} finals",
  "disc.verdict.mixed.label": "A TOP AND A TAIL",
  "disc.verdict.mixed.basis": "level with the middle third of the {{of}} finals",
  "disc.verdict.topHeavy.label": "ONE AND A GAP",
  "disc.verdict.topHeavy.basis": "as wide as the widest third of the {{of}} finals",
  "disc.spreadSentenceMid": " points from ",
  "disc.spreadSentenceDown": " down to the weakest of the ",
  "disc.spreadSentenceEnd": " scored.",
  "disc.statSpread": "Spread across the field",
  "disc.statSpreadValue": "{{n}} pts",
  "disc.statSpreadNote": "tighter than {{wider}} of the {{of}} finals",
  "disc.statSpreadHint":
    "The points gap between the strongest and the weakest of the world's top {{size}}. A small gap means a close, even field; a big gap means the leader is well ahead.",
  "disc.statStrongest": "Strongest this season",
  "disc.statMedian": "World top-100 median",
  "disc.statMedianNoScore": "not scored this season",
  "disc.statMedianClear": "the strongest is {{n}} clear",
  "disc.statMedianHint":
    "The middle score among the world's top 100 in this event this year. It shows how far the top {{size}} sit above the wider world.",
  "disc.statScored": "Field scored",
  "disc.statScoredEvery": "every one of them",
  "disc.statScoredSome": "some carry no score this season",
  "disc.statScoredHint":
    "How many of the world's top {{size}} have a World Athletics score this season. Nothing is estimated for anyone who doesn't.",
  "disc.disagreeTitle": "Where the model disagrees with the marks",
  "disc.disagreeSubtitle":
    "The model rating next to each athlete's season score, for the same {{n}} athletes. It's the rating shown on the Track and Field pages, among the world's top 20.",
  "disc.disagreeSubtitleModel":
    "The same {{n}} athletes, now ordered by the model rating instead of their season score. Where an athlete moves up or down the list, the two measures disagree about them.",
  "disc.disagreeToggleLabel": "Order this list by",
  "disc.disagreeByPoints": "Season score",
  "disc.disagreeByModel": "Model rating",
  "disc.disagreeColScore": "Score",
  "disc.disagreeColRating": "Rating",
  "disc.disagreeNote":
    "The rating is the model's read of each athlete against the rest of the world's top 20 in this event: how likely they'd be to finish in the top three if the 20 met in one final. It's the same rating as on Track and Field, and not a chance of winning. The model judges this season first, and an older mark counts for less the older it is.",

  // Field analysis (head-to-head grid + what separates them)
  "fa.pairingsTitle": "Every pairing in the {{disc}} field",
  "fa.pairingsSubtitle":
    "Read a row across: that athlete's record against each rival, wins first. Built from {{noun}} they actually shared. {{met}} of {{possible}} possible pairings have met.",
  "fa.howToRead": "How to read this grid",
  "fa.howToReadBefore":
    "Each row is one athlete, each column a rival. A cell reads wins then losses, so ",
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
  "traj.caption": "Real {{year}} meet-by-meet marks for the top {{n}} contenders, one row per meet",
  "traj.colDate": "Date",
  "traj.colMark": "Mark",
  "traj.colVenue": "Venue",

  "fa.blankCellNote":
    "A blank cell means those two have genuinely never {{verb}} each other, shown as empty rather than as a 0–0 draw. The “vs. this field” column totals each athlete's record against this field only, which is not their overall win rate: an athlete can beat everyone else and still trail the eight who line up in Brussels.",
  "fa.neverMet": "{{a}} and {{b}} have never {{verb}} each other",

  "fa.noResults": "no results",

  "traj.excludedOne":
    "{{names}} has no {{year}} meeting data on record yet. See their profile for their most recent season.",
  "traj.excludedMany":
    "{{names}} have no {{year}} meeting data on record yet. See their profile for their most recent season.",

  // Athlete analytics
  "aa.recordTitle": "Competition record",
  "aa.recordSubtitle":
    "Every final on record: {{n}} {{noun}} across {{seasons}} {{seasonWord}}. A season best is a single result; this is how they performed the rest of the time.",
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
  "aa.h2hNote":
    "Sorted by how often they've met, not by record, since the deepest rivalries tell you the most. Losses are shown as plainly as wins.",
  "aa.coverageBefore":
    "Computed from {{races}} scraped finals ({{withPlace}} with a recorded finishing position) across {{n}} {{seasonWord}}: {{seasons}}. This is every meeting World Athletics publishes results for in the senior outdoor competition groups, not an athlete's complete career; a {{noun}} outside those groups isn't counted.",
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
  "aa.categoriesNote":
    "Categories are World Athletics’ own ranking labels, listed in a fixed order and deliberately not collapsed into a single quality score, because a continental championship and a Continental Tour Gold meeting aren’t comparable on one axis. Read the rows against each other instead.",

  "disc.spreadCaption": "Each athlete's World Athletics score",
  "disc.spreadNote":
    "Gold marks the strongest score in the field. Dots that bunch mean a level field; a dot out on its own means someone is clear of the rest.",

  "fa.vsThisField": "vs. this field",

  // Athlete profile
  "ath.backToTrack": "← Back to track events",
  "ath.backToField": "← Back to field events",
  "ath.dossier": "Athlete dossier · {{disc}}",
  "ath.age": "Age {{n}}",
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
  "ath.champ.subtitle": "Entered in this event",
  "ath.champ.points":
    "{{rank}} of {{n}} ranked entrants on World Athletics points ({{score}}). This event is called on points, not by the model.",
  "ath.champ.model":
    "The model's {{rank}} pick of {{n}} ranked entrants, with a {{chance}}% chance of a podium.",
  "ath.champ.modelWin":
    "The model's {{rank}} pick of {{n}} ranked entrants, with a {{chance}}% chance of a podium and a {{win}}% chance of winning.",
  "ath.champ.oldMarks":
    "Called on this season's marks, plus {{percent}}% of a better mark from {{year}}.",
  "ath.champ.seasonOnly":
    "Called on this season's marks alone: nothing older of theirs stands above them.",
  "ath.champ.seasonOnlyPb": "Called on this season's marks alone, led by a personal best.",
  "ath.champ.link": "See the call for every event",
  "ath.seasonBest2026": "2026 season best",
  "ath.seasonBestIn": "{{year}} season best",
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
  "ath.realSeasonForm": "Real season form",
  "ath.seasonFormAll":
    "Every meeting this athlete has contested this season — {{n}} of them — indoors and out, not just the Diamond League. The competition record below counts finals only, so its totals differ.",
  "ath.seasonFormAllIn":
    "Every meeting this athlete contested in {{year}}, their latest season on record: {{n}} of them, indoors and out, not just the Diamond League. The competition record below counts finals only, so its totals differ.",
  "ath.seasonFormCondensedIn":
    "Their best mark in each month of {{year}}, their latest season on record. {{n}} races is too many to plot one by one, so every month they competed in is here, represented by its best result.",
  "ath.seasonFormCondensed":
    "Their best mark in each month. {{n}} races this season is too many to plot one by one, so every month they competed in is here, represented by its best result.",
  "ath.h2hTitle": "Head-to-head record",
  "ath.h2hSubtitle":
    "Real meetings with the athletes who made this year's Diamond League Final, from World Athletics results.",
  "ath.h2hOpponents": "this year's Diamond League finalists",
  "ath.figSeasonBest": "Season best",
  "ath.figPersonalBest": "Personal best",
  "ath.figRacesIn": "Races in {{year}}",
  "ath.model": "PodiumCall model",
  "ath.modelRating": "Model rating",
  "ath.modelBefore":
    "% model rating: the model's read of this athlete against the rest of the world's top 20 in this event, as the chance of a top-three finish if the 20 met in one final. It's the same rating Track, Field and the event page show.",
  "ath.modelScoreBefore": " The ",
  "ath.modelScoreMid": " scores ",
  "ath.modelScoreAfter": " World Athletics points, the ",
  "ath.modelScoreEnd": " percentile of this discipline.",
  "ath.profileEyebrow": "Athlete profile",
  "ath.loadingDescription": "Loading real season form, head-to-head record and season stats…",
  "ath.errorDescription": "This athlete's profile could not be loaded.",
  "ath.errorTitle": "Could not load athlete profile",
  "ath.errorHint":
    "This athlete may not be in the current predictions file. Withdrawn athletes are filtered out before profiles are built.",

  "ath.percentileDiffer": " The two readings differ because events differ in depth.",
  "ath.viewFullProfile": "View full profile on World Athletics →",

  "ath.onDlPoints": "{{rank}} on {{points}} DL points",
  "ath.onDlPointOne": "{{rank}} on 1 DL point",
  "ath.noHistoryYear": "No {{year}} meet history on record for this athlete.",
  "ath.noHistoryRecent": "No recent meet history on record for this athlete.",
  "ath.noHistoryPrior": "No prior-season meet history on record for this athlete.",
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
  "car.pbAfter":
    ". Marks set indoors are included in that count and are labelled wherever they are shown; World Athletics lists them alongside outdoor ones.",

  // Landing page
  "landing.tagline": "Athletics predictions from real results",
  "landing.badgeBare": "PodiumCall",
  "landing.hero.lineA": "We call",
  "landing.hero.everyEvent": "every event",
  "landing.hero.srTitle": "We call the podium in every event, before the gun.",
  "landing.hero.lede":
    "Before the gun, a model trained on real World Athletics results names the favourites in all {{n}} events.",
  "landing.hero.favourite": "Favourite",
  "landing.hero.pause": "Pause the changing headline",
  "landing.hero.play": "Resume the changing headline",
  "landing.numbers.title": "Built on **real results**",
  "landing.numbers.lede":
    "Every number on the site comes from World Athletics data, and the model is tested on finals that have already been run.",
  "landing.numbers.hitRate": "of medallists named in past championship finals",
  "landing.numbers.finals": "championship finals tested, {{from}} to {{to}}",
  "landing.numbers.events": "events rated",
  "landing.walkthrough.title": "New to **PodiumCall**?",
  "landing.walkthrough.lede":
    "A one-minute video shows what the site does and where to find each call.",
  "landing.features.title": "The whole season, **read by the model**",
  "landing.features.lede":
    "Pick a page to see it. It's all live, and it all comes from the same data.",
  "landing.features.dashboard.title": "The dashboard",
  "landing.features.dashboard.body":
    "Each event's favourite, where the model and the points disagree, and the next championship.",
  "landing.features.track.title": "Track and Field",
  "landing.features.track.body": "The world's top 20 in every event, by points or by model rating.",
  "landing.features.championship.title": "{{name}}: the call",
  "landing.features.championship.body":
    "Every entrant's podium chance, called before the first session.",
  "landing.features.athlete.title": "Athlete pages",
  "landing.features.athlete.body":
    "Season form, head-to-head records and career bests for every ranked athlete.",
  "landing.features.results.title": "Results",
  "landing.features.results.body": "Past calls graded against what actually happened.",
  "landing.faq.title": "Common **questions**",
  "landing.faq.rating.q": "What does the model rating mean?",
  "landing.faq.rating.a":
    "It's the model's read of an athlete against the rest of the world's top 20 in their event: how likely they'd be to finish in the top three if those 20 met in one final. Each event's ratings add up to 300.",
  "landing.faq.chance.q": "Then what's a podium chance?",
  "landing.faq.chance.a":
    "The same idea for a real competition, where the athletes are actually entered. You'll find it on the championship page and on each entrant's athlete page.",
  "landing.faq.accuracy.q": "How accurate is it?",
  "landing.faq.accuracy.a":
    "Tested season by season on {{finals}} championship finals from {{from}} to {{to}}, it named {{model}}% of the medallists, against {{points}}% for a ranking by World Athletics points.",
  "landing.faq.accuracy.aFallback":
    "It's tested season by season on past championship finals, each one called only from the seasons before it. How it works has the figures.",
  "landing.faq.data.q": "Where does the data come from?",
  "landing.faq.data.a":
    "World Athletics' own public results and rankings. Nothing is typed in or edited by hand.",
  "landing.faq.injuries.q": "Does it know about injuries?",
  "landing.faq.injuries.a":
    "Before each call it checks the news for injuries and withdrawals and flags the athletes it finds. A late withdrawal can still beat the numbers on the day.",
  "landing.faq.free.q": "Is it free?",
  "landing.faq.free.a": "Yes. Every prediction on the site is free to read.",
  "landing.faq.affiliated.q": "Is PodiumCall part of World Athletics?",
  "landing.faq.affiliated.a":
    "No. It's an independent project that reads World Athletics' public data.",
  "landing.faq.more": "More on how it works",
  "landing.closing.title": "Before the gun, **the call is in**.",
  "landing.closing.lede":
    "{{n}} events, the championship call and every athlete's season, all from real results.",
  "landing.nav.menu": "Menu",
  "landing.hero.rating": "model rating {{rating}}%",
  "landing.features.dashboard.open": "Open the dashboard",
  "landing.features.track.open": "See every event's top 20",
  "landing.features.championship.open": "See the full call",
  "landing.features.athlete.open": "Open the athlete's page",
  "landing.features.results.open": "See every graded call",
  "landing.features.card.dashboard": "Highest model ratings right now",
  "landing.features.card.track": "{{event}}, by model rating",
  "landing.features.card.ratingNote":
    "Their chance of a top three if the world's top 20 met in one final.",
  "landing.features.card.startsIn": "Starts in {{n}} days",
  "landing.features.card.startsInOne": "Starts tomorrow",
  "landing.features.card.live": "Under way now",
  "landing.features.card.done": "Finished",
  "landing.features.card.athlete": "{{event}}: the model's favourite",
  "landing.features.card.results": "Graded so far",
  "landing.features.card.resultsLine": "{{pct}}% of podium places called",
  "landing.features.card.resultsNext": "Next to be graded: {{city}}",
  "landing.call.title": "The **{{name}}** call",
  "landing.call.lede":
    "The model's favourite in every event it called in {{city}}, with their podium chance: the chance of finishing in the top three.",
  "landing.call.chance": "podium chance",
  "landing.call.cta": "See the full call",
  "landing.call.graded": "Each final is graded on the Results page once it's run.",
  "landing.call.error": "The call could not be loaded.",
  "podium.strongestCall": "Highest rated",
  "podium.rating": "Model rating",
  "podium.sb": "SB {{mark}}",
  "podium.replay": "Replay",
  "landing.podiumEyebrow": "The model's favourites",
  "landing.podiumTitle": "The three the model **rates highest** right now.",
  "landing.podiumRankedBy":
    "Ranked by the model rating, from the model that calls the championships.",
  "landing.podiumLoading": "Loading the model's strongest calls…",
  "landing.podiumError": "The podium fills in once the live model is reachable.",
  "landing.podiumNoteBefore": "Each of these is the model's strongest call in a ",
  "landing.podiumNoteDifferent": "different",
  "landing.podiumNoteAfter":
    " discipline, so they aren't competing against each other. Their places here show how highly the model rates them, not how they would finish against each other. Each percentage is the model rating, not an official ranking; marks are 2026 season bests from World Athletics.",
  "dashboard.map.title": "Where the athletes come from",
  "dashboard.map.subtitle":
    "Every country with a ranked athlete this season, shaded by how many it has. Pick a country to open its page.",
  "dashboard.map.countries": "Countries",
  "dashboard.map.athletes": "Ranked athletes",
  "dashboard.map.legend": "Ranked athletes per country",
  "dashboard.map.athleteOne": "1 ranked athlete",
  "dashboard.map.athleteCount": "{{n}} ranked athletes",
  "dashboard.map.showAll": "Show all {{n}} countries",
  "dashboard.map.showFewer": "Show fewer",
  "dashboard.map.open": "Open {{name}}",
  "dashboard.map.listLabel": "Countries by number of ranked athletes",
  "dashboard.map.error": "The map could not be loaded.",
  "landing.footer.explore": "Explore",
  "landing.footer.about": "About",
  "landing.hero.event.100m": "the 100m",
  "landing.hero.event.200m": "the 200m",
  "landing.hero.event.400m": "the 400m",
  "landing.hero.event.800m": "the 800m",
  "landing.hero.event.1500m": "the 1500m",
  "landing.hero.event.5000m": "the 5000m",
  "landing.hero.event.10000m": "the 10,000m",
  "landing.hero.event.100h": "the 100m hurdles",
  "landing.hero.event.110h": "the 110m hurdles",
  "landing.hero.event.400h": "the 400m hurdles",
  "landing.hero.event.3000sc": "the steeplechase",
  "landing.hero.event.HJ": "the high jump",
  "landing.hero.event.PV": "the pole vault",
  "landing.hero.event.LJ": "the long jump",
  "landing.hero.event.TJ": "the triple jump",
  "landing.hero.event.SP": "the shot put",
  "landing.hero.event.DT": "the discus",
  "landing.hero.event.HT": "the hammer",
  "landing.hero.event.JT": "the javelin",
  "landing.badgeCountdown": "PodiumCall · {{n}} days to {{city}}",
  "landing.badgeCountdownOne": "PodiumCall · 1 day to {{city}}",
  "landing.badgeLive": "PodiumCall · Live in {{city}}",
  "landing.badgeDone": "PodiumCall · {{city}} complete",
  "landing.ctaPrimary": "View live predictions",
  "landing.ctaSecondary": "Browse all {{n}} events",
  "landing.video.cta": "Watch how it works",
  "landing.video.length": "1 min",
  "landing.video.title": "How PodiumCall works",
  "landing.video.close": "Close video",
  "landing.statMarks": "Marks ranked this season",
  "landing.statsError":
    "Live stats aren't reachable right now. The numbers above will fill in once the model is running.",
  "landing.ticker": "Live from the model: its top-rated athlete in every event",
  "landing.tickerWithRange":
    "Live from the model: its top-rated athlete in each of {{n}} events, rated {{lo}}–{{hi}}%",
  "landing.tickerAria": "The model's top-rated athlete in every event",

  "landing.confidenceFeedLoads": "The model's ratings load once the live model is running.",

  "wa.ariaLabel": "World Athletics (opens in a new tab)",
  "notFound.title": "Page not found",
  "notFound.body": "The page you’re looking for doesn’t exist or has been moved.",
  "notFound.goHome": "Go home",

  // Why an athlete is not in the projected field. Mirrors api.py's
  // points_cut_reason()/build_not_in_field() so the sentence can be rebuilt
  // in the reader's language from the structured fields the API already
  // sends (reasonCode + dl), rather than translating its English prose.

  // Discipline names, keyed by discKey. A closed set of 36, so they can be
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
  "disc.name.men_HT": "Men's Hammer Throw",
  "disc.name.women_HT": "Women's Hammer Throw",
  "disc.name.men_10000m": "Men's 10,000m",
  "disc.name.women_10000m": "Women's 10,000m",

  "ath.photoCredit": "Photo: {{author}} · {{license}}",
  "ath.photoCreditTitle": "Photo by {{author}}, {{license}}, via {{source}}. Opens the source.",

  // Welcome modal
  "welcome.eyebrow": "PodiumCall",
  "welcome.title": "The world's best, read by the model.",
  "welcome.intro":
    "PodiumCall ranks the best athletes in every event from real World Athletics data: by the points they've scored, and by the model rating, learned from real championship finals going back to 2009.",
  "welcome.nextUp": "Next up: {{championship}} in {{city}}.",
  "welcome.point1":
    "Every number is a real, scraped stat from World Athletics. Nothing is typed in by hand or made up.",
  "welcome.point2":
    "Browse the top 20 by event under Track and Field, see the call for every event under {{tab}}, or open any athlete for their results, head-to-head record and career bests.",
  "welcome.point3": "Tap the small ⓘ next to a stat to read exactly what it means.",
  "welcome.howItWorks": "How it works, in full →",
  "welcome.explore": "Explore the board",
  "welcome.about": "About",

  // Browser-tab titles. Only the two that no existing key already says
  // correctly; the other ten routes reuse a nav or page-title key.
  "seo.landing": "The world's best, read by the model",
  "seo.ultimate": "Ultimate Championship",
};
