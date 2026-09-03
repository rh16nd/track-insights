/** French translations. Keys mirror en.ts; any key left out falls back to
 * English. Athletics terms follow French usage: track events are "piste",
 * field events "concours". */
export const fr: Record<string, string> = {
  // Chrome: nav
  "nav.dashboard": "Tableau de bord",
  "nav.track": "Piste",
  "nav.field": "Concours",
  "nav.qualifying": "Qualification",
  "nav.stats": "Stats",
  "nav.schedule": "Calendrier",
  "nav.howItWorks": "Comment ça marche",
  "nav.live": "En direct",
  "nav.searchAthletes": "Rechercher des athlètes",
  "nav.updated": "MAJ {{date}} · J-{{days}} avant Bruxelles",
  "nav.language": "Langue",
  "nav.skipToContent": "Aller au contenu",

  // Search
  "search.placeholder": "Rechercher un athlète…",
  "search.searching": "Recherche…",
  "search.noMatch": "Aucun athlète ne correspond à « {{query}} ».",
  "search.worldRank": "n°{{rank}} mondial",

  // Footer (the source name is a link rendered between these two)
  "footer.scrapedFrom": "Données extraites de",
  "footer.notAffiliated": "Sans affiliation avec World Athletics ni la Wanda Diamond League.",
  "footer.disclaimer": "Les prédictions sont des estimations du modèle, pas des conseils de paris.",

  // Common
  "common.tryAgain": "Réessayer",
  "common.back": "Retour",
  "common.backToDashboard": "Retour au tableau de bord",
  "common.loading": "Chargement…",

  // Shared shell: error / loading / watch badge / head figures
  "error.couldNotLoad": "Impossible de charger les prédictions",
  "error.apiHintBefore": "Assurez-vous que ",
  "error.apiHintAfter": " est bien lancé dans votre dossier athletics-predictor.",
  "watch.badge": "À surveiller",
  "watch.flaggedFrom": "Signalé d'après : {{reason}}",
  "watch.fallback": "Mention récente de blessure ou d'abandon, signalée pour vérification",
  "watch.ariaLabel": "Preuves de l'alerte blessure",
  "watch.viewSource": "Voir la source →",
  "figure.about": "À propos de {{label}}",

  // Meet status labels (schedule / upcoming calendar)
  "meet.status.done": "Terminée",
  "meet.status.next": "Prochaine",
  "meet.status.upcoming": "À venir",
  "meet.status.final": "Finale",

  // Dashboard
  "dashboard.title": "Le tableau, {{phrase}}.",
  "dashboard.titleBare": "Le tableau",
  "dashboard.description":
    "Toutes les projections dont le modèle est le plus sûr, et les épreuves dont il l'est le moins, sur les 32 disciplines de la finale de la Diamond League 2026.",
  "dashboard.daysOut": "à {{days}} jours",
  "dashboard.oneDayOut": "à un jour",
  "dashboard.raceDay": "jour de course",
  "dashboard.underway": "en cours",
  "dashboard.stat.daysToBrussels": "Jours avant Bruxelles",
  "dashboard.stat.hitRate": "Taux de réussite top 3",
  "dashboard.stat.hitRateHint":
    "Parmi les athlètes qui disputent réellement une finale, la fréquence à laquelle le top trois projeté par le modèle correspond aux vrais médaillés. Il n'est évalué que sur des saisons sur lesquelles le modèle ne s'est jamais entraîné, donc le chiffre n'est pas surévalué.",
  "dashboard.stat.disciplines": "Disciplines",
  "dashboard.stat.meetingsRun": "Réunions disputées",
  "dashboard.surest": "n°{{n}} le plus sûr",
  "dashboard.seasonBest": "Meilleure perf. saison {{mark}}",
  "dashboard.pctPodium": "% podium",
  "dashboard.deltaUp": "En hausse de {{pts}} depuis votre dernière visite",
  "dashboard.deltaDown": "En baisse de {{pts}} depuis votre dernière visite",
  "dashboard.pt": "pt",
  "dashboard.pts": "pts",
  "dashboard.mostLikelyPodium": "Les plus susceptibles d'atteindre le podium",
  "dashboard.leastSure.title": "Là où le modèle est le moins sûr",
  "dashboard.leastSure.subtitle":
    "Les huit épreuves dont le meilleur pronostic est le plus faible. Ce sont les finales les plus ouvertes, et les plus susceptibles de surprendre.",
  "dashboard.leastSure.note":
    "Il s'agit de la propre chance de podium du favori, pas d'un écart avec l'athlète suivant. Un chiffre faible signifie que personne ne se détache dans cette épreuve : suivez une ligne pour voir à quel point elle est serrée.",
  "dashboard.surestCalls.title": "Les pronostics les plus sûrs",
  "dashboard.surestCalls.subtitle":
    "Le meilleur pronostic du modèle dans chaque discipline : la chance de finir dans le top trois, pas de gagner. Chaque carte est une épreuve différente, donc ces six-là ne courent pas les uns contre les autres.",
  "dashboard.seasonProgress": "Avancement de la saison",
  "dashboard.meetsScored": "{{done}} réunions sur {{total}} comptabilisées",
  "dashboard.upcomingCalendar": "Calendrier à venir",
  "dashboard.viewFullSchedule": "Voir tout le calendrier →",

  // Injury & withdrawal news feed
  "news.title": "Blessures et forfaits",
  "news.subtitle": "Vrais titres de presse repérés par la vérification automatique des blessures",
  "news.subtitleWithDate":
    "Vrais titres de presse repérés par la vérification automatique des blessures · dernière analyse le {{date}}",
  "news.loading": "Chargement des actualités…",
  "news.empty": "Aucun titre de blessure ou de forfait ne correspond à un athlète du champ projeté.",
  "news.removed": "Retiré du champ",
  "news.matchedOn": "détecté sur « {{keywords}} »",
  "news.disclaimerBefore":
    "Ce sont des titres détectés automatiquement, pas des rapports de blessure vérifiés. Une correspondance peut être erronée, donc le mot-clé détecté est affiché pour que vous en jugiez vous-même, et chaque athlète retiré conserve une fiche complète que vous pouvez ",
  "news.searchFor": "rechercher",
  "news.disclaimerAfter": ".",

  // Track / Field discipline pages
  "common.final2026": "Finale 2026",
  "common.projectedField": "Champ projeté",
  "track.title": "Épreuves de piste",
  "track.eyebrow": "{{n}} disciplines de piste · Finale 2026",
  "track.description":
    "Du sprint au fond, toutes les épreuves de piste disputées à la finale. Choisissez une épreuve pour voir la chance de podium de chaque athlète qualifié.",
  "field.title": "Épreuves de concours",
  "field.eyebrow": "{{n}} disciplines de concours · Finale 2026",
  "field.description":
    "Sauts et lancers, toutes les épreuves de concours disputées à la finale. Choisissez une épreuve pour voir la chance de podium de chaque athlète qualifié.",

  // Discipline table (shared by Track and Field)
  "table.subtitle.rank":
    "Classé par meilleure performance de la saison. La chance de podium est le calcul distinct du modèle et peut diverger.",
  "table.subtitle.prob":
    "Trié par chance de podium selon le modèle. La colonne # classe toujours par meilleure performance de la saison, elle apparaît donc dans le désordre.",
  "table.projectedTop": "Top {{n}} projeté · {{label}}",
  "table.howLevel": "Ce plateau est-il serré ?",
  "table.caption":
    "Champ projeté pour le {{label}} : rang par meilleure performance de la saison, athlète, nationalité, performance et chance de podium",
  "table.colRankSr": " — rang par meilleure performance de la saison",
  "table.colAthlete": "Athlète",
  "table.colNat": "Nat",
  "table.colQualified": "Qualifié",
  "table.colProjected": "Projeté",
  "table.colProjectedHint":
    "Ordre d'arrivée projeté, classé par la meilleure performance de la saison de chaque athlète : sa marque la plus rapide ou la plus longue cette année. Un vrai résultat vérifiable, distinct de la chance de podium du modèle.",
  "table.colPodiumChance": "Chance de podium",
  "table.colPodiumChanceHint":
    "L'estimation par le modèle de la probabilité que cet athlète finisse dans le top trois, pas qu'il gagne. Plus le chiffre est élevé, plus la menace de podium est forte, ce qui explique que ce classement puisse différer de celui des meilleures performances de la saison.",
  "table.sortedActivateReverse": " — trié, activez pour inverser",
  "table.activateToSort": " — activez pour trier par cette colonne",
  "table.qTitle":
    "Confirmé dans le classement Diamond League 2026 de World Athletics pour cette discipline",
  "table.qSr": "ualifié — confirmé dans le classement Diamond League 2026 de World Athletics",
  "table.notQualifiedHeading": "Non qualifiés : sous le top {{n}} aux points Diamond League",
  "table.notQualifiedNote":
    "Assez rapides pour compter, mais sans place qualificative aux points : soit sous la barre du classement, soit sans aucun point Diamond League dans cette épreuve. Évalués par le même modèle, pour que vous voyiez qui serait une menace s'ils y étaient.",
  "table.notQualified": "Non qualifié",

  // Schedule
  "schedule.headlineRoad": "La route vers la finale.",
  "schedule.headlineCities": "{{word}} villes, puis {{host}}.",
  "schedule.headlineCitiesFinal": "{{word}} villes, puis la finale.",
  "schedule.eyebrow": "Saison 2026 · {{n}} réunions",
  "schedule.eyebrowBare": "Saison 2026",
  "schedule.description":
    "Toute la saison de la Wanda Diamond League, de l'ouverture à la finale de Bruxelles.",
  "schedule.descriptionWithCount":
    "Toute la saison de la Wanda Diamond League, de l'ouverture à la finale de Bruxelles. {{done}} réunions sur {{total}} sont comptabilisées.",
  "schedule.figMeetings": "Réunions au programme",
  "schedule.figAlreadyRun": "Déjà disputées",
  "schedule.figTheFinal": "La finale",
  "schedule.panelTitle": "La route vers la finale",
  "schedule.panelSubtitle":
    "Le circuit Diamond League 2026, dans l'ordre. L'or marque la finale, la seule réunion de cette liste qui décide de quelque chose.",
  "schedule.meetingOf": "Réunion {{n}} sur {{total}}",
  "schedule.num.10": "Dix",
  "schedule.num.11": "Onze",
  "schedule.num.12": "Douze",
  "schedule.num.13": "Treize",
  "schedule.num.14": "Quatorze",
  "schedule.num.15": "Quinze",
  "schedule.num.16": "Seize",

  // Stats / Performance Index
  "stats.title": "Indice de performance",
  "stats.eyebrow": "Saison {{season}} · {{rows}} performances classées · scores {{min}}–{{max}}",
  "stats.eyebrowBare": "Points de cotation World Athletics",
  "stats.description":
    "Quelles épreuves sont vraiment denses, et lesquelles se résument à un athlète et un trou. Chaque performance 2026 est cotée sur la table de points de World Athletics, puis lue comme un écart : de combien le leader d'une discipline dépasse la médiane de son propre plateau classé. Un écart serré, c'est une foule ; un écart long, c'est un soliste avec le vide derrière lui.",
  "stats.figMarksScored": "Performances cotées",
  "stats.figFieldMedian": "Médiane du plateau (pts WA)",
  "stats.figScoringRange": "Amplitude des scores",
  "stats.figSetIndoors": "Réalisées en salle",
  "stats.bestOfSeason": "Les meilleures de la saison",
  "stats.bestOfYear": "Les meilleures de {{season}}, toutes épreuves",
  "stats.bestSubtitle":
    "Classées aux points World Athletics, pour qu'un lancer de disque et un 800 m soient directement comparables. La barre est calée sur l'amplitude réellement couverte cette saison, pas sur zéro.",
  "stats.filterAll": "Toutes les épreuves",
  "stats.filterTrack": "Piste",
  "stats.filterField": "Concours",
  "stats.filterOutdoor": "Plein air uniquement",
  "stats.noMarks": "Aucune performance ne correspond à ce filtre.",
  "stats.indoorNoteBefore": "World Athletics inclut les performances en salle dans son classement de la saison en plein air, signalées seulement par un ",
  "stats.indoorNoteMid": " sur le lieu — ",
  "stats.indoorNoteOf": " % des ",
  "stats.indoorNoteAfter":
    " performances présentes ici, et près de la moitié d'entre elles dans les sauts verticaux. Elles sont conservées, car pour une perche ou un poids la salle est sans doute la mesure la plus juste, mais chacune est signalée. Utilisez ",
  "stats.indoorNoteOutdoorOnly": "Plein air uniquement",
  "stats.indoorNoteEnd": " ci-dessus pour les retirer.",
  "stats.indoorBadge": "Salle",
  "stats.indoorBadgeTitle":
    "Réalisée en salle. World Athletics inclut ces performances dans le classement de la saison en plein air",

  // Depth ladder (Stats page)
  "depth.sortDepth": "Par densité",
  "depth.sortMedian": "Par médiane",
  "depth.sortTop": "Par meilleur score",
  "depth.title": "L'échelle de densité · {{n}} disciplines",
  "depth.subtitle":
    "Chaque barre va du score médian de l'épreuve à son meilleur score, sur un axe commun. Plus c'est court, plus c'est dense : le leader est proche du peloton. Plus c'est long, plus il s'agit d'un athlète seul avec le vide derrière lui.",
  "depth.legendMedian": "Médiane du plateau",
  "depth.legendTop": "Meilleur de la discipline",
  "depth.legendSpread": "Écart (meilleur − médiane)",
  "depth.noteBefore": "La plus dense selon cette mesure est ",
  "depth.noteMid": ", dont le leader n'a que ",
  "depth.notePointsClear": " points d'avance sur sa propre médiane ; la plus déséquilibrée est ",
  "depth.noteAt": " avec ",
  "depth.noteEnd":
    ". Il s'agit de l'écart sur l'ensemble des athlètes classés par World Athletics dans l'épreuve, une question différente de celle du niveau du plateau de huit en finale, à laquelle répond la page de chaque discipline.",

  // How it works (inline emphasis uses **bold** / *italic*, see lib/rich-text)
  "howItWorks.eyebrow": "À propos du modèle",
  "howItWorks.description":
    "PodiumCall prédit le podium de chaque épreuve de la finale de la Diamond League 2026, à partir de vrais résultats World Athletics, avant la moindre course. Voici exactement comment il s'y prend, et ce qu'il vaut.",
  "howItWorks.s1.title": "Ce qu'il prédit",
  "howItWorks.s1.p1":
    "Pour chacune des **32 épreuves** de la finale de Bruxelles, le modèle donne à chaque prétendant un seul chiffre : sa chance de finir **dans le top trois**. Il ne désigne jamais un vainqueur unique.",
  "howItWorks.s1.p2":
    "C'est délibéré. Le jour J, le qualifié le plus rapide peut faire un faux départ, se retrouver enfermé ou être repris sur la ligne : « qui gagne » tient donc presque du pile ou face entre trois ou quatre noms. « Qui monte sur le podium » est la question la plus difficile à esquiver, et celle que l'on peut réellement vérifier après coup. Chaque chiffre du site porte donc sur le top trois, jamais sur la seule médaille d'or.",
  "howItWorks.s2.title": "Comment le modèle apprend",
  "howItWorks.s2.p1":
    "Il apprend des podiums réels de chaque finale de Diamond League de **2018 à 2025** (2020 a été annulée). C'est une vérité de terrain, extraite directement des résultats de World Athletics, et non le classement de qui « devrait » gagner selon quelqu'un.",
  "howItWorks.s2.p2":
    "Pour chaque athlète en lice, il calcule **14 signaux** à partir de sa vraie saison : sa meilleure performance de la saison et son record personnel, sa régularité d'une réunion à l'autre, la tendance de sa forme, son nombre de courses, et son bilan en **confrontation directe avec ce plateau précis**. Une **forêt aléatoire** pèse le tout en un seul chiffre, la probabilité de podium. On utilise une forêt parce que ces signaux se tirent mutuellement dessus d'une façon qu'une simple formule linéaire manque : une meilleure performance éclatante compte moins, par exemple, si l'athlète n'a presque pas couru de l'année.",
  "howItWorks.s2.p3":
    "Et il est noté honnêtement. En **validation glissante**, le modèle ne s'entraîne jamais que sur des saisons *antérieures* à l'année sur laquelle il est évalué : la précision ci-dessous provient donc entièrement de finales qu'il n'avait jamais vues. C'est toute la différence entre une vraie prévision et un modèle qui a simplement appris les réponses par cœur.",
  "howItWorks.s3.title": "Sa précision",
  "howItWorks.s3.basisFallback":
    "Taux de réussite du podium parmi les athlètes qui disputent réellement la finale, en validation glissante",
  "howItWorks.s3.toplistCaption":
    "Le test de résistance brutal : choisir les 3 médaillés dans l'ensemble de la liste d'environ 101 noms d'une discipline, ce que le site ne lui demande jamais en pratique",
  "howItWorks.s3.note":
    "Les deux chiffres proviennent exactement des mêmes prédictions ; ils posent simplement des questions différentes. Le premier correspond au vrai travail, celui que fait le site : étant donné les huit à dix athlètes qui disputent réellement une finale, à quelle fréquence le top trois projeté par le modèle est-il juste ? Le second est une tâche volontairement plus dure qu'il n'a jamais à accomplir. Ils sont séparés d'une douzaine de points, et ni l'un ni l'autre n'est arrondi vers le haut ou choisi dans une saison flatteuse.",
  "howItWorks.s4.title": "D'où viennent les données",
  "howItWorks.s4.pBefore":
    "Chaque performance, classement et résultat provient directement de l'API publique de ",
  "howItWorks.s4.pAfter":
    ", les données mêmes qui alimentent leurs retransmissions et leurs fiches d'athlètes. L'extraction tourne sur une machine séparée, et aucune performance n'est jamais saisie ni modifiée à la main : ce que vous lisez ici est exactement ce qu'ils ont publié.",
  "howItWorks.s4.competitions": "Compétitions",
  "howItWorks.s4.marks": "Performances",
  "howItWorks.s4.venues": "Sites",
  "howItWorks.s4.seasons": "Saisons",
  "howItWorks.s4.seasonsDeep": "Saisons d'historique",
  "howItWorks.s5.title": "Ce qu'il ne peut pas faire",
  "howItWorks.s5.b1":
    "Il lit **la forme, pas l'avenir**. Une blessure de dernière minute, un forfait annoncé le matin même ou une course tactique jouée au sprint final peuvent tous démentir les chiffres le jour J.",
  "howItWorks.s5.b2":
    "Il prédit **qui monte sur le podium, pas le 1-2-3 exact**, et il ne prétend jamais savoir qui gagne.",
  "howItWorks.s5.b3":
    "Il n'est **pas affilié à World Athletics** ni à la Wanda Diamond League. Il se contente de lire leurs données publiques.",

  // Welcome modal
  "welcome.eyebrow": "PodiumCall",
  "welcome.title": "Prédire le podium à Bruxelles.",
  "welcome.intro":
    "PodiumCall prédit le podium de chacune des 32 épreuves de la finale de la Diamond League 2026, à partir de vrais résultats de World Athletics, avant la moindre course. Il mise sur le top trois, pas sur un seul vainqueur.",
  "welcome.point1":
    "Chaque chiffre est une vraie statistique extraite de World Athletics. Rien n'est saisi à la main ni inventé.",
  "welcome.point2":
    "Parcourez les épreuves sous Piste et Concours, voyez qui est qualifié dans Qualification, ou ouvrez la fiche d'un athlète pour ses résultats 2026, ses confrontations directes et ses records.",
  "welcome.point3":
    "Touchez le petit ⓘ à côté d'une statistique pour lire exactement ce qu'elle signifie.",
  "welcome.howItWorks": "Comment ça marche, en détail →",
  "welcome.explore": "Explorer le tableau",
  "welcome.about": "À propos",
};
