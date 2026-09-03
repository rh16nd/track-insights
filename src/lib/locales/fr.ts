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

  // Qualifying
  "qual.num.6": "Six",
  "qual.num.8": "Huit",
  "qual.num.10": "Dix",
  "qual.places": "places",
  "qual.lanes": "couloirs",
  "qual.headline": "{{word}} {{noun}}. La course pour disputer la course.",
  "qual.headlineFallback": "La course pour la finale",
  "qual.description":
    "Qui a réellement gagné sa place en finale. Ce sont les points Diamond League de World Athletics eux-mêmes, pas une prédiction, avec l'écart jusqu'à la barre de qualification calculé sur ce qui reste à gagner.",
  "qual.descriptionDecided":
    "Qui a réellement gagné sa place en finale. Ce sont les points Diamond League de World Athletics eux-mêmes, pas une prédiction, toutes les réunions comptant pour le classement 2026 étant désormais disputées.",
  "qual.eyebrowOne": "1 réunion comptante restante · une victoire vaut {{pts}} points",
  "qual.eyebrowMany": "{{n}} réunions comptantes restantes · une victoire vaut {{pts}} points",
  "qual.eyebrowDecided": "Toutes les réunions comptantes sont disputées, le classement est définitif",
  "qual.eyebrowBare": "Classement Diamond League 2026",
  "qual.figQualify": "Qualifiés pour la finale",
  "qual.figPoints": "Points pour se qualifier",
  "qual.figMeetingsLeft": "Réunions restantes",
  "qual.figPointsForWin": "Points pour une victoire",
  "qual.standingsSkeleton": "Classement Diamond League",
  "qual.tightTitleDecided": "À égalité sur la barre",
  "qual.tightTitleNext": "Au plus près de la barre avant {{city}}",
  "qual.tightTitle": "Au plus près de la barre",
  "qual.tightSubtitleDecided":
    "Toutes les réunions comptantes sont disputées, et dans ces disciplines l'athlète sous la barre a terminé à égalité de points avec celui qui l'occupe. C'est le départage de World Athletics qui tranche, pas une autre course.",
  "qual.tightSubtitle":
    "Le plus petit écart entre la barre de qualification et le premier athlète en dessous : les disciplines que la dernière réunion décide vraiment.",
  "qual.levelOnPoints": "À égalité de points",
  "qual.behind": "de retard",
  "qual.disciplineLabel": "Discipline",
  "qual.standingsTitle": "Classement Diamond League · {{disc}}",
  "qual.standingsSubtitle": "Les {{n}} premiers aux points se qualifient pour la finale.",
  "qual.standingsSubtitleCut":
    "Les {{n}} premiers aux points se qualifient pour la finale. La barre se situe actuellement à {{pts}} points.",
  "qual.caption":
    "Classement Diamond League du {{disc}} : rang, athlète, points, réunions disputées, écart à la barre de qualification et statut",
  "qual.colMeets": "Réunions",
  "qual.colPoints": "Points",
  "qual.colGap": "Écart à la barre",
  "qual.colStatus": "Statut",
  "qual.status.safe": "Qualifié",
  "qual.status.in": "Dedans",
  "qual.status.chasing": "En chasse",
  "qual.status.out": "Éliminé",
  "qual.status.unknown": "Aucun point",
  "qual.statusDecided.in": "Départage",
  "qual.statusDecided.chasing": "Départage",
  "qual.statusTitle.safe": "Indéboulonnable : personne en dessous ne peut atteindre son total",
  "qual.statusTitle.in": "Au-dessus de la barre en l'état, mais encore rattrapable",
  "qual.statusTitle.chasing": "Sous la barre et encore mathématiquement capable de l'atteindre",
  "qual.statusTitle.out": "Ne peut pas atteindre la barre, même en gagnant tout ce qui reste",
  "qual.statusTitle.unknown": "World Athletics ne recense aucun point pour cet athlète",
  "qual.statusTitleDecided.in":
    "Au-dessus de la barre, mais à égalité de points avec un athlète en dessous ; le départage de World Athletics tranche",
  "qual.statusTitleDecided.chasing":
    "À égalité de points avec la dernière place qualificative et plus aucune réunion comptante ; le départage de World Athletics tranche",
  "qual.gapBehind": "{{n}} de retard",
  "qual.gapOnLine": "sur la barre",
  "qual.gapLevel": "à égalité avec la barre",
  "qual.gapClear": "{{n}} d'avance",
  "qual.footBefore":
    "Les points sont ceux de World Athletics, extraits du classement Diamond League 2026. ",
  "qual.footOpen":
    "« Éliminé » signifie que l'athlète ne peut pas atteindre la barre, même en gagnant tout ce qui reste ; « Qualifié » signifie que personne ne peut le déloger, même s'il ne marque plus jamais. Tout ce qui se situe entre les deux reste ouvert. Cela suppose que la discipline figure au programme restant. Si elle n'est plus disputée, ce classement est déjà définitif, ce qui ne fait que rendre « Éliminé » plus certain encore.",
  "qual.footDecided":
    "Il ne reste aucune réunion comptante : ce classement est donc le résultat. « Départage » signale la seule chose que les points seuls ne peuvent trancher : deux athlètes à égalité de points de part et d'autre de la barre, séparés par les règles de départage de World Athletics, qui ne figurent pas dans ces données.",
  "qual.footScraped": " Extrait le {{when}}.",
  "qual.howToRead.title": "Comment le lire",
  "qual.howToRead.subtitle": "La marge, pas la médaille.",
  "qual.howToRead.p1Before":
    "Les points viennent de la place obtenue à chaque réunion Diamond League réellement disputée — ",
  "qual.howToRead.p1After":
    " pour une victoire, en dégressif ensuite. Rien ici n'est une projection : c'est l'arithmétique de qui a marqué quoi.",
  "qual.howToRead.holdsBefore": " occupe la {{n}}e et dernière place avec ",
  "qual.howToRead.holdsAfter": " points",
  "qual.howToRead.exactlyLevel": ", exactement à égalité avec la barre",
  "qual.howToRead.firstOutBefore": " est le premier éliminé, à ",
  "qual.howToRead.point": "point",
  "qual.howToRead.points": "points",
  "qual.howToRead.short": "",
  "qual.howToRead.decidedTail": ", sans aucune réunion restante pour y changer quoi que ce soit",
  "qual.howToRead.openTail": ", avec des courses encore à venir",

  "qual.cutLine": "Barre de qualification · top {{n}}",

  // Athletics vocabulary shared across components
  "word.race": "course",
  "word.races": "courses",
  "word.competition": "concours",
  "word.competitions": "concours",
  "word.raced": "couru contre",
  "word.competedAgainst": "concouru contre",

  // Discipline page
  "disc.titleFallback": "Discipline",
  "disc.eyebrow": "Discipline contre discipline · {{rank}} plateau le plus serré sur {{of}} finales",
  "disc.eyebrowBare": "Discipline contre discipline",
  "disc.description":
    "Une épreuve lue comme un plateau et non comme une liste. Est-ce un vrai combat de bout en bout, ou un athlète et un trou ? Mesuré sur les points de cotation de World Athletics, pour que la réponse soit comparable aux 31 autres finales.",
  "disc.whyScore":
    "C'est mesuré sur les points de cotation de World Athletics, pas sur les probabilités du modèle. Les probabilités classent les athlètes au sein d'une même épreuve, mais chacun est évalué séparément : le total des pourcentages d'un plateau peut donc aller de 31 à 320 selon les 32 finales. Voilà pourquoi elles ne peuvent pas classer une épreuve par rapport à une autre. Un score extrait, si.",
  "disc.depthSkeleton": "Densité du plateau",
  "disc.seasonForm": "Forme réelle de la saison · {{disc}}",
  "disc.seasonFormSubtitle":
    "Chaque performance réellement enregistrée par les prétendants cette saison, sur un vrai calendrier. Ce n'est pas une tendance lissée : les points sont les réunions où ils se sont présentés.",
  "disc.storylines": "Ce qu'il faut suivre · {{disc}}",
  "disc.storylinesSubtitle":
    "Calculé à partir des données, pas rédigé : chaque angle repose sur un chiffre réel, et la carte mise en avant est celle qui contredit le plus le pronostic du modèle.",
  "disc.depthTitle": "Densité du plateau",
  "disc.depthNeeds": "Nécessite un score World Athletics pour au moins deux athlètes du plateau.",
  "disc.depthNotEnough":
    "Trop peu d'athlètes de ce plateau ont un score World Athletics cette saison pour mesurer son homogénéité. Rien n'est estimé à la place.",
  "disc.levelTitle": "L'homogénéité de ce plateau",
  "disc.levelSubtitle":
    "Le meilleur score de la saison de chaque finaliste, du plus fort au plus faible. C'est la distance entre les deux extrémités qui classe cette épreuve face aux {{of}} autres.",
  "disc.verdict.level.label": "PLATEAU HOMOGÈNE",
  "disc.verdict.level.basis": "l'un des tiers les plus serrés des 32 finales",
  "disc.verdict.mixed.label": "UNE TÊTE ET UNE QUEUE",
  "disc.verdict.mixed.basis": "le tiers intermédiaire des 32 finales",
  "disc.verdict.topHeavy.label": "UN SEUL ET LE VIDE",
  "disc.verdict.topHeavy.basis": "l'un des tiers les plus larges des 32 finales",
  "disc.spreadSentenceMid": " points séparent ",
  "disc.spreadSentenceDown": " du plus faible des ",
  "disc.spreadSentenceEnd": " athlètes cotés.",
  "disc.statSpread": "Écart sur le plateau",
  "disc.statSpreadValue": "{{n}} pts",
  "disc.statSpreadNote": "{{rank}} plus serré sur {{of}}",
  "disc.statSpreadHint":
    "L'écart de points entre le score du finaliste le plus fort et celui du plus faible. Un petit écart signifie un plateau serré et homogène ; un grand écart signifie que le leader a de la marge.",
  "disc.statStrongest": "Finaliste le plus fort",
  "disc.statMedian": "Médiane du top 100 mondial",
  "disc.statMedianNoScore": "non coté cette saison",
  "disc.statMedianClear": "le meilleur finaliste a {{n}} d'avance",
  "disc.statMedianHint":
    "Le score médian du top 100 mondial de l'épreuve cette année, comme étalon. Il montre où se situe le plateau de la finale par rapport au reste du monde, et pas seulement par rapport à lui-même.",
  "disc.statScored": "Plateau coté",
  "disc.statScoredEvery": "tous les finalistes",
  "disc.statScoredSome": "certains n'ont aucun score cette saison",
  "disc.statScoredHint":
    "Combien de finalistes ont un score World Athletics cette saison. Quelques épreuves en comptent un ou deux qui n'en ont pas, et rien n'est estimé à leur place.",
  "disc.disagreeTitle": "Là où le modèle diverge des performances",
  "disc.disagreeSubtitle":
    "Probabilité de podium face à la capacité mesurée, pour les mêmes {{n}} athlètes. Ces deux classements ne coïncident pas, et c'est là où ils divergent que le débat devient intéressant.",
  "disc.disagreeNote":
    "Classé par score World Athletics. Le pourcentage est la chance, selon le modèle, que cet athlète finisse dans le top trois. Ce n'est pas une probabilité de victoire, et les deux colonnes ont le droit de diverger : une meilleure performance, c'est un jour, alors que la projection lit toute une saison.",

  // Storylines (titles are a fixed set keyed by type; the sentence itself is
  // generated by the API with real numbers and stays in its scraped English)
  "storyline.empty":
    "Aucun angle marquant pour cette discipline en ce moment. Revenez au fil de la saison.",
  "storyline.photo_finish": "Arrivée au photo-finish",
  "storyline.injury_watch": "À surveiller",
  "storyline.returning_champion": "Champion de retour",
  "storyline.debutant": "Première finale",
  "storyline.rivalry": "Rivalité relancée",
  "storyline.hot_streak": "En progression",

  // Field analysis (head-to-head grid + what separates them)
  "fa.pairingsTitle": "Toutes les confrontations du plateau du {{disc}}",
  "fa.pairingsSubtitle":
    "Lisez une ligne de gauche à droite : le bilan de cet athlète face à chaque rival, victoires en premier. Établi à partir des {{noun}} qu'ils ont réellement partagés. {{met}} des {{possible}} confrontations possibles ont eu lieu.",
  "fa.howToRead": "Comment lire cette grille",
  "fa.howToReadBefore":
    "Chaque ligne est un athlète, chaque colonne un rival. Une case indique les victoires puis les défaites : ",
  "fa.howToReadAfter":
    " signifie que l'athlète de la ligne a battu ce rival trois fois et perdu une fois, en ne comptant que les {{noun}} auxquels ils ont tous deux participé. L'or indique que l'athlète de la ligne mène ; une case vide signifie qu'ils ne se sont jamais rencontrés.",
  "fa.gridCaption":
    "Grille des confrontations directes du plateau du {{disc}}. Chaque ligne est le bilan d'un athlète face à celui nommé dans chaque colonne, victoires en premier, à partir des {{noun}} qu'ils ont réellement partagés.",
  "fa.separatesTitle": "Ce qui les sépare",
  "fa.separatesSubtitle":
    "Les mêmes axes pour chaque prétendant, pour que deux athlètes aux meilleures performances quasi identiques cessent de ressembler au même pari.",
  "fa.separatesCaption":
    "Ce qui sépare le plateau du {{disc}} : les mêmes mesures pour chaque prétendant, pour pouvoir distinguer deux athlètes aux meilleures performances quasi identiques.",
  "fa.colTop3": "Moy. top 3",
  "fa.colTop3Hint":
    "La moyenne des trois meilleures performances de cet athlète cette saison. Elle résiste à un après-midi de chance là où une seule meilleure performance ne le fait pas.",
  "fa.colSteadiness": "Régularité",
  "fa.colSteadinessHint":
    "À quel point les performances d'une saison sont resserrées, en pourcentage de leur moyenne. Plus c'est bas, plus c'est reproductible, et cela se lit pareil pour un sprinteur et un lanceur.",
  "fa.colComps": "Concours",
  "fa.colRaces": "Courses",
  "fa.colStartsHint":
    "Combien de fois ils ont concouru cette saison, puis leur total de tous les temps enregistré (cette saison / tous les temps).",
  "fa.colPodium": "Podium",
  "fa.colPodiumHint":
    "À quelle fréquence cet athlète a fini dans le top trois, sur l'ensemble des finales à son actif.",
  "fa.colPeaked": "Pic de forme",
  "fa.colPeakedHint": "Le mois où la meilleure performance de la saison a été réalisée.",
  "fa.cellTitle": "{{a}} {{wins}}–{{losses}} {{b}} sur {{n}} {{noun}}",
  "fa.cellLastMet": ", dernière rencontre le {{date}}",

  // Trajectory overlay chart
  "traj.header": "Forme réelle {{year}} · top {{n}}",
  "traj.higherFarther": "Plus haut, plus loin",
  "traj.higherFaster": "Plus haut, plus rapide",
  "traj.chartView": "Vue graphique",
  "traj.tableView": "Vue tableau",
  "traj.caption":
    "Performances réelles {{year}} réunion par réunion pour les {{n}} meilleurs prétendants, une ligne par réunion",
  "traj.colDate": "Date",
  "traj.colMark": "Performance",
  "traj.colVenue": "Lieu",

  "fa.blankCellNote": "Une case vide signifie que ces deux-là ne se sont réellement jamais {{verb}}, montré comme une absence plutôt que comme un nul zéro partout. « face à ce plateau » totalise une ligne, et ce n’est pas le même chiffre qu’un taux de victoire en carrière : un athlète peut souvent gagner contre tous les autres et rester en retard face aux huit qui s’aligneront vraiment à Bruxelles.",
  "fa.neverMet": "{{a}} et {{b}} ne se sont jamais {{verb}}",

  "fa.noResults": "aucun résultat",

  "traj.excludedOne": "{{names}} n’a encore aucune donnée de réunion {{year}} enregistrée. Voir sa fiche pour sa saison la plus récente.",
  "traj.excludedMany": "{{names}} n’ont encore aucune donnée de réunion {{year}} enregistrée. Voir leur fiche pour leur saison la plus récente.",

  // Athlete analytics
  "aa.recordTitle": "Bilan en compétition",
  "aa.recordSubtitle":
    "Toutes les finales extraites : {{n}} {{noun}} sur {{seasons}} saisons. Une meilleure performance, c'est un après-midi. Voici ce qui s'est passé le reste du temps.",
  "aa.wins": "Victoires",
  "aa.ofStarts": "{{pct}} % des départs",
  "aa.podiums": "Podiums",
  "aa.averageFinish": "Place moyenne",
  "aa.best": "meilleure : {{place}}",
  "aa.topTierStarts": "Départs au plus haut niveau",
  "aa.topTierShare": "{{pct}} % des {{noun}}",
  "aa.byCategory": "Par catégorie de compétition",
  "aa.colCategory": "Catégorie",
  "aa.colWon": "Gagnées",
  "aa.seasonBySeason": "Saison par saison",
  "aa.seasonBySeasonSubtitle":
    "La meilleure performance de la saison face à la moyenne des trois meilleures de l'année, pour qu'un après-midi de chance côtoie le niveau réellement tenu.",
  "aa.seasonShape": "Profil de saison",
  "aa.seasonShapeSubtitleField":
    "Quand ils concourent réellement, et quand tombe la meilleure performance. Un athlète au pic en mai n'est pas le même pari en septembre qu'un autre encore en progression.",
  "aa.seasonShapeSubtitleTrack":
    "Quand ils courent réellement, et quand tombe la meilleure performance. Un athlète au pic en mai n'est pas le même pari en septembre qu'un autre encore en progression.",
  "aa.h2hTitle": "Bilan des confrontations directes",
  "aa.h2hSubtitle":
    "Établi à partir d'un {{noun}} réellement partagé : même réunion, même jour, comparé à la place obtenue. Rien ici n'est déduit.",
  "aa.inFieldTitle": "Projeté dans le plateau de la finale",
  "aa.inField": "Dans le plateau",
  "aa.h2hNoteBefore":
    "Trié par nombre de rencontres, pas par bilan, car les rivalités les plus fournies sont les plus instructives. Les défaites sont montrées aussi clairement que les victoires. Les adversaires marqués ",
  "aa.h2hNoteAfter": " sont projetés au départ de la finale.",
  "aa.coverageBefore": "Calculé à partir de {{races}} finales extraites ({{withPlace}} avec une place enregistrée) sur {{n}} {{seasonWord}} : {{seasons}}. Ce sont toutes les réunions dont World Athletics publie les résultats dans les groupes de compétition seniors en plein air, pas la carrière complète d'un athlète ; un {{noun}} hors de ces groupes n'est pas compté.",
  "aa.season": "saison",
  "aa.seasons": "saisons",
  "aa.seasonTableCaption":
    "Saison par saison : meilleure performance, moyenne des trois meilleures et régularité de chaque campagne",
  "aa.colSeason": "Saison",
  "aa.colBest": "Meilleure",
  "aa.colConsistency": "Régularité",
  "aa.ofCount": "(sur {{n}})",
  "aa.tooFew": "trop peu de {{noun}}",
  "aa.consistencyNote":
    "La régularité est la dispersion des performances d'une saison en pourcentage de leur moyenne : elle se lit donc pareil pour un sprinteur à 9,8 s et un lanceur à 74 mètres. Plus c'est bas, plus c'est régulier. La barre ne compare une saison qu'aux autres saisons de cet athlète.",
  "aa.monthTitle": "{{month}} : {{n}} {{noun}}",
  "aa.monthTitleBest": "{{month}} : {{n}} {{noun}}, meilleure performance de la saison ici",
  "aa.shapeNote": "{{n}} {{noun}} de {{first}} à {{last}}.",
  "aa.shapeBestBefore": " Leur meilleure performance de la saison est tombée en ",
  "aa.shapeBestAfter": " (barre dorée).",

  "aa.colAvgFinish": "Place moy.",
  "aa.categoriesNote": "Les catÃ©gories sont les propres libellÃ©s de classement de World Athletics, listÃ©s dans un ordre fixe et dÃ©libÃ©rÃ©ment non ramenÃ©s Ã  un score de qualitÃ© unique, car un championnat continental et un meeting du Continental Tour Gold ne sont pas comparables sur un seul axe. Lisez plutÃ´t les lignes les unes par rapport aux autres.",

  "disc.spreadCaption": "Le score World Athletics de chaque finaliste",
  "disc.spreadNote": "L’or marque le meilleur score du plateau. Des points regroupés signalent un plateau homogène ; un point isolé signifie que quelqu’un se détache du reste.",

  "fa.vsThisField": "face à ce plateau",

  // Athlete profile
  "ath.backToTrack": "← Retour aux épreuves de piste",
  "ath.backToField": "← Retour aux épreuves de concours",
  "ath.dossier": "Fiche athlète · {{disc}}",
  "ath.notInField": "Pas dans le plateau projeté",
  "ath.age": "{{n}} ans",
  "ath.rankInField": "n°{{n}} du plateau projeté",
  "ath.ifQualified": "S'il ou elle s'était qualifié",
  "ath.ifQualifiedBefore": " % de chance de podium, d'après le même modèle appliqué au groupe des recalés. Ce n'est pas une projection sur Bruxelles ; il ou elle n'est pas dans le plateau.",
  "ath.whyNotTitle": "Pourquoi il ou elle n'est pas dans le plateau projeté",
  "ath.whyNotSubtitle": "Le même contrôle d'éligibilité que celui utilisé par les projections",
  "ath.flaggedFrom": "Signalé d'après : {{reason}}",
  "ath.viewSource": "Voir la source",
  "ath.dlPoints": "Points Diamond League",
  "ath.inStandings": "· {{rank}} au classement",
  "ath.gapToCut": "Écart à la barre",
  "ath.level": "à égalité",
  "ath.cutAt": "· barre à {{n}}",
  "ath.seeStandings": "Voir tout le classement du {{disc}} →",
  "ath.fastestNote":
    "À noter : c'est la meilleure performance mondiale de la saison. L'éligibilité à la finale de la Diamond League se décide aux points marqués dans la série, pas à la meilleure performance de la saison.",
  "ath.seasonStats": "Statistiques de la saison",
  "ath.seasonBest2026": "Meilleure perf. 2026",
  "ath.worldRank": "Rang mondial",
  "ath.thisSeasonToplist": "classement de cette saison",
  "ath.careerBest": "Record en carrière",
  "ath.pbGap": "Écart au record",
  "ath.offCareerBest": "de son record en carrière",
  "ath.pbGapHintMetres":
    "De combien la meilleure performance de la saison est éloignée du record de tous les temps de l'athlète, en mètres. Zéro signifie qu'il ou elle a égalé son record personnel cette année ; un chiffre plus élevé signifie qu'il ou elle en est encore loin.",
  "ath.pbGapHintSeconds":
    "De combien la meilleure performance de la saison est éloignée du record de tous les temps de l'athlète, en secondes. Zéro signifie qu'il ou elle a égalé son record personnel cette année ; un chiffre plus élevé signifie qu'il ou elle en est encore loin.",
  "ath.ageLabel": "Âge",
  "ath.meetsThisSeason": "Réunions cette saison",
  "ath.dlMeetings": "réunions Diamond League",
  "ath.competitionsThisSeason": "Concours cette saison",
  "ath.racesThisSeason": "Courses cette saison",
  "ath.allCompetitions": "toutes compétitions",
  "ath.lastCompeted": "Dernière sortie",
  "ath.daysAgo": "il y a {{n}} j",
  "ath.waScore": "Score WA",
  "ath.waScoreSub": "Top {{pct}} % de toutes les performances classées",
  "ath.waScoreHint":
    "Le score en points de World Athletics pour une performance. Il place toutes les épreuves sur une même échelle : un 9,9 au 100 m et un 2,30 m en hauteur peuvent ainsi être comparés. Plus c'est élevé, mieux c'est.",
  "ath.percentileBefore": "{{ord}} centile au sein du {{disc}}, où la médiane est de ",
  "ath.percentileAfter": ".",
  "ath.setIndoors": " Cette performance a été réalisée en salle.",
  "ath.noDatedResults":
    "World Athletics recense une meilleure performance de la saison pour cet athlète mais aucun résultat daté cette saison{{extra}} : le nombre de réunions et la dernière sortie sont donc inconnus ici, et non nuls.",
  "ath.noDatedResultsExtra": " (ses résultats enregistrés datent d'années antérieures)",
  "ath.notComputed":
    "Le record en carrière, l'écart au record et l'activité ne sont pas calculés pour des athlètes aussi éloignés du plateau. Le modèle n'évalue que les finalistes projetés et leurs plus proches poursuivants.",
  "ath.realSeasonForm": "Forme réelle de la saison",
  "ath.realSeasonFormSubtitle":
    "Réunions Diamond League uniquement. Le bilan en compétition ci-dessous compte chaque finale extraite, ses totaux sont donc plus élevés. C'est une différence de périmètre, pas une contradiction.",
  "ath.h2hTitle": "Confrontations directes face au plateau projeté",
  "ath.h2hSubtitle":
    "Rencontres réelles avec les athlètes qui se sont qualifiés, d'après les résultats World Athletics.",
  "ath.figSeasonBest": "Meilleure perf. saison",
  "ath.figPersonalBest": "Record personnel",
  "ath.figRacesIn": "Courses en {{year}}",
  "ath.model": "Modèle PodiumCall",
  "ath.modelBefore": " % de chance de finir sur le podium à Bruxelles, pas de gagner. Le modèle prédit l'appartenance au top trois.",
  "ath.modelScoreBefore": " Le ",
  "ath.modelScoreMid": " vaut ",
  "ath.modelScoreAfter": " points World Athletics, soit le ",
  "ath.modelScoreEnd": " centile de cette discipline.",
  "ath.profileEyebrow": "Fiche athlète",
  "ath.loadingDescription":
    "Chargement de la forme réelle de la saison, des confrontations directes et des statistiques…",
  "ath.errorDescription": "Le profil de cet athlète n'a pas pu être chargé.",
  "ath.errorTitle": "Impossible de charger le profil de l'athlète",
  "ath.errorHint":
    "Cet athlète n'est peut-être pas dans le fichier de prédictions actuel. Les athlètes déclarés forfait sont filtrés avant la construction des profils.",

  "ath.percentileDiffer": " Les deux lectures diffèrent parce que les épreuves n’ont pas la même densité.",
  "ath.viewFullProfile": "Voir la fiche complète sur World Athletics →",

  "ath.onDlPoints": "{{rank}} avec {{points}} points DL",
  "ath.worldRankTag": "n°{{n}} mondial",

  // Athlete career, season trend and head-to-head charts
  "car.title": "Palmarès et classement",
  "car.subtitle":
    "Le palmarès et le classement mondial actuel de World Athletics, tels qu'ils les publient et non calculés ici.",
  "car.worldRanking": "classement mondial",
  "car.overall": "Général",
  "car.acrossAllEvents": "toutes épreuves confondues",
  "car.honours": "Palmarès",
  "car.colChampionship": "Championnat",
  "car.colGold": "Or",
  "car.colSilver": "Argent",
  "car.colBronze": "Bronze",
  "car.colEntries": "Participations",
  "stc.header": "Forme de la saison {{year}}",
  "stc.headerLast": "Forme de la dernière saison",
  "stc.caption": "Performances de la saison {{year}} de cet athlète, une ligne par réunion",
  "stc.captionLast": "Performances de la dernière saison de cet athlète, une ligne par réunion",
  "stc.colScore": "Score",
  "stc.pts": "{{n}} pts",
  "h2h.header": "Confrontations directes face aux {{opponents}}",
  "h2h.topRivals": "principaux rivaux",
  "h2h.wins": "Victoires",
  "h2h.losses": "Défaites",
  "h2h.caption": "Bilan des confrontations directes face aux {{opponents}}",
  "h2h.colOpponent": "Adversaire",
  "h2h.colMeetings": "Rencontres",

  "car.pbBefore": "World Athletics recense des records personnels pour cet athlète dans ",
  "car.event": "épreuve",
  "car.events": "épreuves",
  "car.pbRange": " (une palette, pas une seule spécialité)",
  "car.pbAfter": ". Les performances réalisées en salle sont comprises dans ce total et signalées partout où elles apparaissent ; World Athletics les répertorie aux côtés de celles en plein air.",

  // Landing page
  "landing.tagline": "Prédicteur Diamond League 2026",
  "landing.badgeFinal": "PodiumCall · La finale de Bruxelles",
  "landing.badgeComplete": "PodiumCall · Finale de Bruxelles terminée",
  "landing.badgeFinalDay": "PodiumCall · Jour de finale à Bruxelles",
  "landing.badgeOneDay": "PodiumCall · J-1 avant Bruxelles",
  "landing.badgeDays": "PodiumCall · J-{{n}} avant Bruxelles",
  "landing.h1a": "Nous faisons le",
  "landing.h1b": "pronostic avant",
  "landing.h1c": "le",
  "landing.h1gun": "départ.",
  "landing.lede":
    "Un modèle entraîné sur de vrais résultats, pas sur l'intuition. Nous extrayons chaque performance World Athletics des {{n}} disciplines de la Diamond League et pronostiquons le podium de Bruxelles, avant la moindre course.",
  "landing.ctaPrimary": "Voir les prédictions en direct",
  "landing.ctaSecondary": "Parcourir les {{n}} épreuves",
  "landing.statHitRate": "Taux de réussite du podium",
  "landing.statDays": "Jours avant Bruxelles",
  "landing.statDisciplines": "Disciplines suivies",
  "landing.statMarks": "Performances cotées",
  "landing.statsLoading": "Chargement des statistiques en direct…",
  "landing.statsError":
    "Les statistiques en direct sont injoignables pour le moment. Les chiffres ci-dessus se rempliront dès que le modèle tournera.",
  "landing.tickerWithRange":
    "En direct du modèle : les {{n}} disciplines, de {{lo}} à {{hi}} %, et il est bien plus sûr de certaines finales que d'autres",
  "landing.ticker":
    "En direct du modèle : le meilleur pronostic de chaque discipline, et sa chance de podium",
  "landing.tickerAria": "Confiance du modèle en direct, par discipline",
  "landing.podiumEyebrow": "Le podium projeté",
  "landing.podiumTitle": "Les trois sur lesquels le modèle mise le plus à Bruxelles.",
  "landing.podiumError": "Le podium se remplira dès que le modèle en direct sera joignable.",
  "landing.podiumLoading": "Chargement des pronostics les plus sûrs du modèle…",
  "landing.podiumNoteBefore": "Chacun d'eux est le pronostic le plus sûr du modèle dans une discipline ",
  "landing.podiumNoteDifferent": "différente",
  "landing.podiumNoteAfter":
    ", ils ne courent donc pas les uns contre les autres. Les marches classent la confiance du modèle, pas les athlètes. Le pourcentage est une chance de finir dans le top trois, pas de gagner ; les performances sont les meilleures de la saison 2026 selon World Athletics.",
  "landing.demoEyebrow": "De vrais résultats en entrée. Un plateau classé en sortie.",
  "landing.demoTitleWithCount": "{{n}} réunions de vraies courses, ramenées à un seul pronostic.",
  "landing.demoTitle": "Une saison de vraies courses, ramenée à un seul pronostic.",
  "landing.demoBodyBefore": "Chaque réunion Diamond League de la saison est extraite de ",
  "landing.demoBodyAfter":
    ", puis réduite à la prédiction la plus forte du modèle pour la finale.",
  "landing.rawSignal": "Signal brut",
  "landing.strongestCall": "Le pronostic le plus sûr du modèle",
  "landing.rankedLoad": "Les prédictions classées se chargeront dès que le modèle en direct tournera.",
  "landing.stepsEyebrow": "Aucune donnée inventée, nulle part dans le pipeline.",
  "landing.stepsTitle": "De vraies données en entrée, des prédictions honnêtes en sortie, en {{n}} étapes.",
  "landing.previewEyebrow": "Directement du modèle en fonctionnement",
  "landing.previewTitle": "Un aperçu en direct des pronostics actuels du modèle.",
  "landing.previewCrumb": "PodiumCall / Tableau de bord",
  "landing.previewHeading": "Les plus susceptibles d'atteindre le podium",
  "landing.previewSub":
    "Le meilleur pronostic du modèle dans chaque discipline : la chance de finir dans le top trois, pas de gagner",
  "landing.seeAll": "Voir les {{n}} disciplines →",
  "landing.previewLoading": "Chargement des prédictions en direct…",
  "landing.footerLink": "Voir les prédictions en direct →",
  "landing.step1Title": "Extraire de vrais résultats",
  "landing.step1Body":
    "Chaque meeting de la Diamond League, plus les Jeux olympiques, les Championnats du monde, les meetings du Continental Tour Gold et les Championnats d'Europe. Le tout tiré directement de l'API de World Athletics, jamais saisi à la main.",
  "landing.step2Title": "Construire de vraies variables",
  "landing.step2Body":
    "Forme de la saison, régularité d'une réunion à l'autre, fraîcheur, rythme du calendrier, historique des confrontations directes, correction du vent : 15 en tout. Chaque candidate est depuis évaluée sur dix graines aléatoires face à un contrôle mélangé, et écartée si elle ne le bat pas. Plusieurs l'ont été.",
  "landing.step3Title": "Valider honnêtement",
  "landing.step3Body":
    "Validation glissante sur cinq saisons indépendantes (2021-2025), en n'entraînant que sur des années strictement antérieures à l'année testée, jamais sur le futur.",
  "landing.step4Title": "Vérifier qui court vraiment",
  "landing.step4Body":
    "Les actualités et les comptes rendus de réunions sont analysés automatiquement avant tout calcul. Les athlètes signalés portent un badge de vigilance avec un lien vers la source ; les forfaits confirmés sont entièrement retirés du plateau.",
  "landing.step5Title": "Prédire en direct",
  "landing.step5Body":
    "Le modèle réévalue tout le plateau à partir de données World Athletics fraîches à chaque actualisation, jusqu'à Bruxelles.",
  "landing.spell.3": "trois",
  "landing.spell.4": "quatre",
  "landing.spell.5": "cinq",
  "landing.spell.6": "six",

  "landing.confidenceFeedLoads": "Le flux de confiance se chargera dès que le modèle en direct tournera.",
  "landing.podiumRankedBy": "Classés selon la chance de chaque athlète de finir dans le top trois.",
  "landing.corpusMore": "+ {{n}} autres compétitions sur {{seasons}} saisons ({{first}}-{{last}}), extraites directement de World Athletics.",
  "landing.corpusFallback": "…et toutes les autres compétitions des données d’entraînement du modèle, extraites directement de World Athletics.",

  "podium.chanceOfPodium": "Chance de podium",
  "wa.ariaLabel": "World Athletics (ouvre un nouvel onglet)",
  "notFound.title": "Page introuvable",
  "notFound.body": "La page que vous cherchez n’existe pas ou a été déplacée.",
  "notFound.goHome": "Retour à l’accueil",

  // Why an athlete is not in the projected field. Mirrors api.py's
  // points_cut_reason()/build_not_in_field() so the sentence can be rebuilt
  // in the reader's language from the structured fields the API already
  // sends (reasonCode + dl), rather than translating its English prose.
  "reason.pointsCut":
    "{{rank}} au classement Diamond League du {{disc}} avec {{points}} points, en dehors du top {{limit}} qui se qualifie pour la finale.",
  "reason.tailOut": " Trop loin désormais pour revenir.",
  "reason.tailShortOne": " À {{gap}} point de la barre.",
  "reason.tailShortMany": " À {{gap}} points de la barre.",
  "reason.tailTieBreak":
    " À égalité de points avec la barre, mais derrière au départage de World Athletics.",
  "reason.notInStandings":
    "Absent du classement officiel Diamond League de World Athletics pour le {{disc}} : aucun point Diamond League marqué dans cette discipline cette saison. Ce sont les points qui donnent une place en finale, quelle que soit la vitesse réalisée ailleurs.",
  "reason.injuryRemoved": "Retiré du plateau projeté par la vérification des blessures.",
  "reason.outsideCut":
    "Présent au classement Diamond League mais en dehors du top {{limit}} projeté à la meilleure performance de la saison pour le {{disc}}.",
  "reason.noData": "Aucune performance enregistrée pour la saison {{year}} en {{disc}}.",

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
