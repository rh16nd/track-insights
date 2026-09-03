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
