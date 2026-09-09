/** French translations. Keys mirror en.ts; any key left out falls back to
 * English. Athletics terms follow French usage: track events are "piste",
 * field events "concours". */
export const fr: Record<string, string> = {
  // Chrome: nav
  "nav.dashboard": "Tableau de bord",
  "nav.track": "Piste",
  "nav.field": "Concours",
  "nav.qualifying": "Qualification",
  "nav.ultimate": "Ultimate",
  "nav.stats": "Stats",
  "nav.schedule": "Calendrier",
  "nav.results": "Résultats",
  "results.title": "Ce que les derniers pronostics ont donné",
  "results.eyebrow": "Le bilan du modèle",
  "results.description":
    "Chaque championnat pronostiqué à l’avance, avec le pronostic figé avant la réunion et le résultat qui a suivi. Rien n’a été réécrit après coup.",
  "results.meet.dlFinal": "Finale de la Diamond League 2026",
  "results.meet.ultimate": "Championnat Ultimate 2026",
  "results.eventsWord": "{{n}} épreuves",
  "results.notRunYet": "Pas encore disputé",
  "results.badgeCalled": "Pronosticé à l’avance",
  "results.pendingMeet":
    "Le pronostic du modèle sur les {{n}} épreuves a été figé avant la première session et ne peut plus être modifié. La comparaison s’affichera ici une fois le championnat disputé.",
  "results.figPodium": "Places de podium trouvées",
  "results.figShare": "Des places disponibles",
  "results.figMeets": "Championnats",
  "results.figBacktest": "Ce que le modèle annonce",
  "results.figBacktestHint":
    "Le taux de réussite du modèle sur toutes les finales de championnat de son historique, testé uniquement sur des saisons où il n’a pas été entraîné. Le chiffre à côté est ce qui s’est réellement passé lors d’une réunion qu’il n’avait jamais vue. Les deux doivent être proches ; s’ils cessent de l’être, c’est l’annonce qui est fausse.",
  "results.scorecardTitle": "À quoi sert cette page",
  "results.scorecardNote":
    "Tous les autres chiffres de précision du site sont des tests rétrospectifs — honnêtes, mais le modèle reste noté sur des courses jugées après coup. Ici, c’est autre chose. Ces pronostics ont été publiés avant la finale puis laissés intacts : vous lisez donc une prévision et son résultat, pas un modèle qui se justifie après la course. Choisissez une épreuve pour voir qui le modèle donnait, qui a réellement fini là, et où il s’est trompé.",
  "results.pendingTitle": "Rien à afficher pour l’instant",
  "results.pendingBody":
    "Aucune finale n’a été disputée depuis la publication du dernier pronostic. Cette page se remplira dès que ce sera le cas.",
  "results.error": "Impossible de charger les résultats.",
  "nav.howItWorks": "Comment ça marche",
  "nav.live": "En direct",
  "nav.searchAthletes": "Rechercher des athlètes",
  "nav.updated": "MAJ {{date}}",
  "nav.language": "Langue",
  "nav.back": "← Retour",
  "nav.skipToContent": "Aller au contenu",

  // Championnat Ultimate (Budapest, 11-13 sept. 2026)
  "ultimate.title": "Le Championnat Ultimate",
  "ultimate.tagline": "Les meilleurs face aux meilleurs, à Budapest.",
  "ultimate.stat.days": "Jours avant Budapest",
  "ultimate.stat.liveValue": "En direct",
  "ultimate.stat.liveLabel": "En piste à Budapest",
  "ultimate.stat.doneValue": "Terminé",
  "ultimate.stat.doneLabel": "Championnat terminé",
  "ultimate.stat.events": "Épreuves",
  "ultimate.stat.perTrack": "Par finale sur piste",
  "ultimate.stat.perTrackHint":
    "Les finales sur piste accueillent {{track}} athlètes ; les concours, {{field}}.",
  "ultimate.stat.prize": "Dotation",
  "ultimate.about.title": "Budapest 26",
  "ultimate.about.body":
    "Le Championnat Ultimate de World Athletics est une nouvelle épreuve sur invitation qui réunit les meilleurs mondiaux de chaque épreuve pendant trois soirées au {{venue}}, {{city}} ({{dates}}). Des plateaux restreints, des places directes pour les plus grands noms, et une dotation de 10 millions de dollars US.",
  "ultimate.chip.venue": "{{venue}}, {{city}}",
  "ultimate.chip.sessions": "{{n}} soirées",
  "ultimate.chip.fields": "Plateaux de {{track}} / {{field}}",
  "ultimate.qualify.title": "Comment se qualifier",
  "ultimate.qualify.direct":
    "Une place directe pour le champion olympique en titre, le champion du monde en titre et le vainqueur de la finale Diamond League 2026 de chaque épreuve.",
  "ultimate.qualify.rankings":
    "Toutes les autres places sont attribuées d’après le classement mondial World Athletics sur l’année de qualification.",
  "ultimate.qualify.note":
    "Le plateau est donc, par conception, le meilleur au monde dans chaque discipline.",
  "ultimate.qualifiers.title": "Déjà qualifiés",
  "ultimate.qualifiers.note":
    "World Athletics a nommé les champions qui ont déjà leur place. Toutes les autres places se jouent au classement mondial, pas encore publié.",
  "ultimate.qualifiers.olympic": "Champions olympiques",
  "ultimate.qualifiers.olympicNote": "Une place pour avoir gagné à Paris en 2024.",
  "ultimate.qualifiers.world": "Champions du monde",
  "ultimate.qualifiers.worldNote": "Une place pour avoir gagné à Tokyo en 2025.",
  "ultimate.qualifiers.dl": "Vainqueurs de la finale Diamond League",
  "ultimate.qualifiers.dlNote": "Une place pour avoir gagné la finale Diamond League 2026.",
  "country.bestTitle": "Le meilleur de la saison",
  "country.bestNote": "Les trois meilleures performances du pays, au score World Athletics.",
  "country.scoreOf": "{{score}} pts",
  "country.filterLabel": "Filtrer ces athlètes",
  "country.filterPlaceholder": "Filtrer par nom ou épreuve…",
  "country.noMatch": "Aucun athlète ici ne correspond à « {{query}} ».",
  "country.showAll": "Afficher les {{n}} autres",
  "country.backToStats": "← Tous les pays",
  "country.athletes": "Athlètes",
  "country.disciplines": "Épreuves",
  "country.bestScore": "Meilleur score",
  "country.lede": "{{n}} athlètes classés dans {{d}} épreuves cette saison.",
  "country.notFoundTitle": "Aucun athlète référencé",
  "country.notFound":
    "Aucun athlète de {{code}} n’apparaît dans les listes mondiales de la saison, il n’y a donc rien à afficher.",
  "country.errorTitle": "Impossible de charger ce pays",
  "country.ultimateTitle": "Au Championnat Ultimate",
  "country.ultimateNote": "Places déjà acquises à Budapest, du 11 au 13 septembre.",
  "country.qualifiersTitle": "Places directes",
  "country.relaysTitle": "Relais mixtes",
  "country.relayPlace": "Place {{place}} aux World Relays, {{mark}}",
  "country.relayNoTime": "{{mark}} aux World Relays",
  "country.relayHost": "Place de pays hôte",
  "country.relayQualified": "Qualifié",
  "country.relayOneRound": "(un tour)",
  "country.relayMeets": "{{n}} compétitions",
  "country.relayMoreSquad": "+{{n}} autres alignés",
  "country.relaySquadNote":
    "Les athlètes que chaque nation a réellement alignés aux World Relays, avec leur relais. Un nom présent à chaque tour est un titulaire, pas un remplaçant.",
  "country.relayNote":
    "Les places en relais se sont jouées aux World Athletics Relays. L’équipe listée est celle que chaque nation a réellement alignée là-bas et aux Championnats du monde 2025, les plus utilisés d’abord. Le modèle n’évalue pas les équipes de relais : il repose sur les épreuves individuelles, et la Diamond League n’a pas de relais.",
  "country.athletesNote": "{{n}} classés cette saison, les meilleurs en premier.",
  "country.colAthlete": "Athlète",
  "country.colEvent": "Épreuve",
  "country.colMark": "Meilleure performance",
  "country.colScore": "Score",
  "country.more": "{{n}} autres non affichés.",
  "country.scoreNote":
    "Le score est le Results Score de World Athletics, qui compare des performances d’épreuves différentes. Le classement utilise ce score plutôt que la chance de podium, car celle-ci ne se compare qu’au sein d’une même épreuve.",
  "ultimate.relays.title": "Relais mixtes",
  "ultimate.relays.note":
    "Deux des 28 épreuves sont des relais mixtes, qualifiés par une voie qui leur est propre.",
  "ultimate.relays.from": "Les {{n}} premiers aux {{meet}} de {{city}}, plus le pays hôte.",
  "ultimate.relays.noModel":
    "Le modèle n’évalue pas les équipes de relais. Il repose sur les épreuves individuelles, et la Diamond League n’a pas de relais : il n’existe aucun historique pour apprendre une équipe nationale. Voici les résultats qualificatifs, pas une projection.",
  "ultimate.projection.title": "Le pronostic du modèle · {{disc}}",
  "ultimate.projection.subtitle":
    "Les {{n}} athlètes qualifiés, classés par le modèle. Le plateau est celui de World Athletics : tous ceux qui figurent ici sont qualifiés, pour {{places}} places.",
  "ultimate.projection.caption":
    "Tous les athlètes qualifiés du {{disc}}, classés selon leur chance de podium",
  "ultimate.projection.colRoute": "Qualification",
  "ultimate.projection.colChance": "Chance de podium",
  "ultimate.projection.routeHint":
    "Les termes de World Athletics. Une wild card est une place réservée à un champion : le vainqueur olympique 2024, le champion du monde 2025 et le vainqueur de la finale de Diamond League 2026 de chaque épreuve en obtiennent une automatiquement. Tous les autres se sont qualifiés grâce à leur classement mondial World Athletics sur l’année de qualification.",
  "ultimate.projection.chanceHint":
    "L’estimation par le modèle des chances de cet athlète de finir dans les trois premiers de cette épreuve. C’est la chance propre à chacun, pas une part de cent : la colonne ne totalise donc pas 100 — dans une épreuve serrée, plusieurs athlètes peuvent tous être de sérieux candidats au podium.",
  "ultimate.projection.flaggedTitle": "Annoncés forfaits",
  "ultimate.projection.flaggedHint":
    "Ces athlètes figurent toujours dans le plateau qualifié de World Athletics, mais une information de presse annonce leur absence. Seul un forfait annoncé fait descendre un athlète ici ; une simple mention de blessure le laisse à sa place dans la liste ci-dessus, avec un badge « à surveiller ». Le chiffre à côté de chaque nom est la place que le modèle lui avait donnée ; la liste ci-dessus est numérotée selon les athlètes attendus au départ, et repart donc de 1. Personne n’est supprimé, car une détection peut se tromper : touchez le badge pour lire l’information et en juger vous-même.",
  "ultimate.projection.alsoQualified": "aussi engagé sur le {{events}}",
  "ultimate.projection.alsoClash": "aussi qualifié sur le {{events}}, en conflit d’horaire",
  "ultimate.projection.subtitleEntered":
    "Les {{n}} athlètes inscrits sur la liste officielle de World Athletics pour cette épreuve, classés par le modèle. {{places}} places.",
  "ultimate.projection.notEntered":
    "Qualifiés pour cette épreuve mais absents de la liste des engagés, donc non classés ci-dessus : {{names}}.",
  "ultimate.projection.promoted":
    "Le modèle plaçait {{names}} dans son top 3. Forfait annoncé depuis : les trois athlètes ci-dessous sont les suivants de son classement.",
  "ultimate.projection.unscored":
    "Qualifiés mais non classés ici, faute de marque 2026 dans cette épreuve : {{names}}.",
  "ultimate.projection.note":
    "Les engagés viennent de World Athletics ; seul l’ordre est celui du modèle. Chaque pourcentage est la chance propre de l’athlète de finir dans les trois premiers : leur somme ne fait donc pas 100.",
  "ultimate.field.title": "Le plateau complet",
  "ultimate.field.pending":
    "World Athletics publie les listes de départ officielles et le programme des sessions dans les jours qui précèdent la compétition. Cette page se remplira avec le vrai plateau et les résultats en direct dès leur publication.",
  "ultimate.field.publishedSoon":
    "Les listes de départ sont publiées — le plateau et les résultats apparaissent ici.",
  "ultimate.hero.kicker": "{{short}} · {{dates}}",
  "ultimate.hero.headline": "Les meilleurs face aux meilleurs.",
  "ultimate.hero.daysToGo": "Jours restants",
  "ultimate.hero.fieldsLabel": "Plateau (piste / concours)",
  "ultimate.hero.nights": "Soirées",

  // Search
  "search.placeholder": "Rechercher un athlète…",
  "search.searching": "Recherche…",
  "search.noMatch": "Aucun athlète ne correspond à « {{query}} ».",
  "search.worldRank": "n°{{rank}} mondial",
  "search.countryHint": "{{n}} athlètes classés · {{d}} épreuves",

  // Footer (the source name is a link rendered between these two)
  "footer.scrapedFrom": "Données extraites de",
  "feedback.trigger": "Envoyer un retour",
  "feedback.title": "Vous avez repéré une erreur ?",
  "feedback.body":
    "Ce site est construit à partir de données publiques, et il se trompe parfois. Si un chiffre paraît faux, si un athlète est dans la mauvaise épreuve, ou si quelque chose n’a pas de sens, dites-le. Plusieurs corrections de ce site sont parties d’un message de lecteur.",
  "feedback.messageLabel": "Votre message",
  "feedback.messagePlaceholder": "Qu’avez-vous vu, et sur quelle page ?",
  "feedback.replyLabel": "E-mail, si vous voulez une réponse",
  "feedback.replyPlaceholder": "Facultatif",
  "feedback.send": "Envoyer",
  "feedback.sending": "Envoi…",
  "feedback.cancel": "Annuler",
  "feedback.close": "Fermer",
  "feedback.sentTitle": "Envoyé — merci.",
  "feedback.sentBody": "Une seule personne les lit : une réponse peut prendre quelques jours.",
  "feedback.error":
    "L’envoi a échoué. Réessayez dans un instant, ou écrivez à rayenhamed65 arobase gmail point com.",
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
  "watch.flaggedFrom": "Signalé d’après : {{reason}}",
  "watch.fallback": "Mention récente de blessure ou d’abandon, signalée pour vérification",
  "watch.ariaLabel": "Preuves de l’alerte blessure",
  "watch.viewSource": "Voir la source →",
  "figure.about": "En savoir plus sur {{label}}",

  // Meet status labels (schedule / upcoming calendar)
  "meet.status.done": "Terminée",
  "meet.status.next": "Prochaine",
  "meet.status.upcoming": "À venir",
  "meet.status.final": "Finale",

  // Dashboard
  "dashboard.title": "Le tableau, {{phrase}}.",
  "dashboard.titleBare": "Le tableau",
  "dashboard.description":
    "Le choix du modèle dans chaque épreuve, et là où il s’écarte des points, à quelques jours du prochain championnat.",
  "dashboard.eventEyebrow": "{{short}} · {{name}}",
  "dashboard.event.title": "À venir",
  "dashboard.event.cta": "Découvrir le plateau",
  "dashboard.event.where": "{{venue}}, {{city}} · {{dates}}",
  "dashboard.favourites.title": "Les favoris du modèle",
  "dashboard.favourites.subtitle":
    "L’athlète que le modèle évalue le mieux dans chaque discipline. Il lit la façon dont l’athlète a concouru toute la saison : ce n’est donc pas toujours celui qui a la meilleure marque.",
  "dashboard.favourites.cta": "Tous les classements",
  "dashboard.fav.rating": "éval.",
  "dashboard.disagree.title": "Là où le modèle diverge",
  "dashboard.disagree.subtitle":
    "Les épreuves où le choix du modèle n’est pas le leader aux points. Les points classent une seule meilleure marque ; le modèle pèse toute une saison de compétition, et les deux divergent plus souvent qu’on ne le croit.",
  "dashboard.disagree.model": "Modèle :",
  "dashboard.disagree.points": "Points :",
  "dashboard.daysOut": "à {{days}} jours",
  "dashboard.oneDayOut": "à un jour",
  "dashboard.raceDay": "jour de course",
  "dashboard.underway": "en cours",
  "dashboard.stat.daysToBrussels": "Jours avant Bruxelles",
  "dashboard.stat.hitRate": "Taux de réussite top 3",
  "dashboard.stat.hitRateHint":
    "À quelle fréquence le top trois projeté par le modèle correspond aux vrais médaillés, en ne comptant que les athlètes qui atteignent une finale. Il n’est mesuré que sur des saisons passées, jamais montrées au modèle pendant son entraînement : le chiffre n’est donc pas flatté.",
  "dashboard.stat.disciplines": "Disciplines",
  "dashboard.stat.meetingsRun": "Meetings disputés",
  "dashboard.surest": "n°{{n}} le plus sûr",
  "dashboard.seasonBest": "Meilleure perf. saison {{mark}}",
  "dashboard.pctPodium": "% podium",
  "dashboard.deltaUp": "En hausse de {{pts}} depuis votre dernière visite",
  "dashboard.deltaDown": "En baisse de {{pts}} depuis votre dernière visite",
  "dashboard.pt": "pt",
  "dashboard.pts": "pts",
  "dashboard.mostLikelyPodium": "Les plus susceptibles d’atteindre le podium",
  "dashboard.leastSure.title": "Là où le modèle est le moins sûr",
  "dashboard.leastSure.subtitle":
    "Les huit épreuves où même le favori a peu de chances de podium. Ce sont les finales les plus ouvertes, et les plus susceptibles de créer la surprise.",
  "dashboard.leastSure.note":
    "Chaque chiffre est la chance de podium du favori lui-même, pas son avance sur l’athlète suivant. Un chiffre faible signifie que personne ne se détache dans l’épreuve. Touchez une ligne pour voir tout le plateau.",
  "dashboard.surestCalls.title": "Les pronostics les plus sûrs",
  "dashboard.surestCalls.subtitle":
    "Le meilleur pronostic du modèle dans chaque discipline : la chance de finir dans le top trois, pas de gagner. Chaque carte est une épreuve différente : ces six-là ne s’affrontent donc pas.",
  "dashboard.seasonProgress": "Avancement de la saison",
  "dashboard.meetsScored": "{{done}} meetings sur {{total}} comptabilisés",
  "dashboard.upcomingCalendar": "Calendrier à venir",
  "dashboard.viewFullSchedule": "Voir tout le calendrier →",

  // Injury & withdrawal news feed
  "news.title": "Blessures et forfaits",
  "news.subtitle": "Vrais titres de presse repérés par la vérification automatique des blessures",
  "news.subtitleWithDate":
    "Vrais titres de presse repérés par la vérification automatique des blessures · dernière analyse le {{date}}",
  "news.loading": "Chargement des actualités…",
  "news.empty":
    "Aucun titre de blessure ou de forfait ne correspond à un athlète du plateau projeté.",
  "news.removed": "Annoncé forfait",
  "watch.badgeOut": "Forfait",
  "news.reportOne": "1 article",
  "news.reportMany": "{{n}} articles",
  "news.matchedOn": "détecté sur « {{keywords}} »",
  "news.disclaimerBefore":
    "Ce sont des titres détectés automatiquement, pas des rapports de blessure vérifiés. Une correspondance peut être erronée, donc le mot-clé détecté est affiché pour que vous en jugiez vous-même, et chaque athlète retiré conserve une fiche complète que vous pouvez ",
  "news.searchFor": "rechercher",
  "news.disclaimerAfter": ".",

  // Track / Field discipline pages
  "common.final2026": "Finale 2026",
  "common.projectedField": "Plateau projeté",
  "track.title": "Épreuves de piste",
  "track.eyebrow": "{{n}} disciplines de piste",
  "track.description":
    "Les meilleurs mondiaux dans chaque épreuve de piste. Choisissez une discipline, puis classez-la par points World Athletics, ou selon l’évaluation du modèle : sa lecture de qui monterait sur le podium en finale de championnat.",
  "field.title": "Épreuves de concours",
  "field.eyebrow": "{{n}} disciplines de concours",
  "field.description":
    "Les meilleurs mondiaux dans chaque épreuve de concours. Choisissez une discipline, puis classez-la par points World Athletics, ou selon l’évaluation du modèle : sa lecture de qui monterait sur le podium en finale de championnat.",

  // Tables de classement mondial piste/concours (bascule points / modèle)
  "rankings.loading": "Classement mondial",
  "rankings.discipline": "Discipline",
  "rankings.panelTitle": "Top 20 · {{label}}",
  "rankings.caption":
    "Le top 20 du {{label}} : marque, points World Athletics, meetings relevés et évaluation du modèle",
  "rankings.subtitle.model":
    "Classé selon l’évaluation du modèle — sa lecture de qui monterait sur le podium si cette épreuve disputait une finale de championnat maintenant. Il pèse la façon dont l’athlète a réellement concouru, et pas seulement sa meilleure marque : il ne se contente donc pas de répéter l’ordre des points.",
  "rankings.subtitle.points":
    "Classé selon les points World Athletics — le score de la meilleure performance de la saison. Aucun modèle ici.",
  "rankings.toggle.label": "Méthode de classement",
  "rankings.toggle.model": "Éval. du modèle",
  "rankings.toggle.points": "Par points",
  "rankings.colMark": "Marque",
  "rankings.colPoints": "Points",
  "rankings.colMeets": "Meetings",
  "rankings.colRating": "Éval. modèle",
  "rankings.pointsHint":
    "Le score de performance World Athletics pour la meilleure marque de la saison.",
  "rankings.meetsHint":
    "Meetings où nous pouvons voir cet athlète disputer cette épreuve en 2026, d’après la liste de la saison, le journal de la Diamond League et le journal élargi des courses. C’est un minimum, pas un relevé complet : un 1 signifie un meeting visible, pas forcément un seul disputé. À lire à côté de l’évaluation — une évaluation bâtie sur une seule sortie est plus fragile qu’une évaluation bâtie sur une saison.",
  "rankings.ratingHint":
    "L’évaluation par le modèle des chances de cet athlète de monter sur le podium d’une finale de championnat. Il a appris sur les vrais podiums de chaque finale de Diamond League, des Jeux olympiques, des Championnats du monde et d’Europe et de la Coupe continentale depuis 2018, en n’évaluant chaque athlète que sur ce qu’il avait accompli avant chacune de ces finales. Ce n’est pas un classement mondial officiel, et cela porte sur une course, pas sur une saison.",

  // Discipline table (shared by Track and Field)
  "table.subtitle.rank":
    "Classé par meilleure performance de la saison, la meilleure marque de chaque athlète cette année. La chance de podium est l’estimation propre du modèle et peut différer de ce classement.",
  "table.subtitle.prob":
    "Classé par chance de podium selon le modèle. La colonne # compte toujours par meilleure performance de la saison, ses numéros semblent donc en désordre ici.",
  "table.projectedTop": "Top {{n}} projeté · {{label}}",
  "table.howLevel": "Ce plateau est-il serré ?",
  "table.caption":
    "Plateau projeté du {{label}} : rang à la meilleure performance de la saison, athlète, nationalité, performance et chance de podium",
  "table.colRankSr": " — rang par meilleure performance de la saison",
  "table.colAthlete": "Athlète",
  "table.colNat": "Nat",
  "table.colQualified": "Qualifié",
  "table.colProjected": "Projeté",
  "table.colProjectedHint":
    "L’ordre d’arrivée obtenu en se basant uniquement sur la meilleure performance de la saison, la marque la plus rapide ou la plus longue de chaque athlète cette année. Un vrai résultat vérifiable, distinct de la chance de podium du modèle.",
  "table.colPodiumChance": "Chance de podium",
  "table.colPodiumChanceHint":
    "L’estimation par le modèle de la probabilité que cet athlète finisse dans le top trois, pas qu’il gagne. Un chiffre plus élevé est une menace de podium plus forte, ce qui explique qu’il puisse classer les athlètes autrement que leur meilleure performance de la saison.",
  "table.sortedActivateReverse": " — trié, activez pour inverser",
  "table.activateToSort": " — activez pour trier par cette colonne",
  "table.qTitle":
    "Confirmé dans le classement Diamond League 2026 de World Athletics pour cette discipline",
  "table.qSr": "ualifié — confirmé dans le classement Diamond League 2026 de World Athletics",
  "table.notQualifiedHeading": "Non qualifiés : sous le top {{n}} aux points Diamond League",
  "table.notQualifiedNote":
    "Assez rapides pour y figurer, mais sans place qualificative : soit sous la barre des points, soit sans aucun point Diamond League dans cette épreuve. Le modèle les évalue quand même, pour que vous voyiez qui serait une menace s’ils y étaient.",
  "table.notQualified": "Non qualifié",

  // Discipline table — résultat vs projection (affiché une fois la finale disputée)
  "table.resultTitle": "Résultat vs projection · {{label}}",
  "table.resultSummary":
    "Le modèle avait {{hits}} des {{n}} athlètes montés sur le podium dans ses trois premiers projetés.",
  "table.resultNote":
    "Ce qui s’est passé lors de la finale, comparé à la projection du modèle établie avant la compétition. La projection est figée à l’avance : rien ici n’est évalué avec le recul.",
  "table.resultCaption":
    "Résultat de la finale du {{label}} : place, athlète, nationalité, marque et projection du modèle",
  "table.colFinish": "Place",
  "table.colResult": "Résultat",
  "table.colModelCall": "Pronostic du modèle",
  "table.colVsProjected": "vs projeté",
  "table.resultPredicted": "Projeté {{rank}} · {{prob}} %",
  "table.resultNearMiss": "Hors du plateau projeté",
  "table.resultUnseen": "Absent de la projection",
  "table.resultExact": "Conforme à la projection",
  "table.resultUpset": "Podium hors du plateau projeté",
  "table.resultAboveTitle": "Terminé {{n}} places au-dessus de la projection",
  "table.resultBelowTitle": "Terminé {{n}} places en dessous de la projection",
  "table.resultAboveOne": "Terminé une place au-dessus de la projection",
  "table.resultBelowOne": "Terminé une place en dessous de la projection",

  // Schedule
  "schedule.headlineRoad": "La route vers la finale.",
  "schedule.headlineCities": "{{word}} villes, puis {{host}}.",
  "schedule.headlineCitiesFinal": "{{word}} villes, puis la finale.",
  "schedule.eyebrow": "Saison 2026 · {{n}} meetings",
  "schedule.eyebrowBare": "Saison 2026",
  "schedule.titleNext": "La route à venir",
  "schedule.descriptionNext":
    "Le prochain grand championnat, et la saison Diamond League 2026 qui y a mené.",
  "schedule.eyebrowNext": "J-{{n}} avant Budapest",
  "schedule.figNext": "Prochain championnat",
  "schedule.figSeasonRun": "Meetings DL disputés",
  "schedule.upcoming.title": "Prochain championnat",
  "schedule.upcoming.when": "{{dates}} · {{venue}}, {{city}}",
  "schedule.upcoming.cta": "Voir le plateau",
  "schedule.season.title": "La saison 2026",
  "schedule.season.subtitle":
    "La route Diamond League qui a mené à l’Ultimate — chaque meeting évalué, la finale disputée.",
  "schedule.description":
    "Toute la saison de la Wanda Diamond League, de l’ouverture à la finale de Bruxelles.",
  "schedule.descriptionWithCount":
    "Toute la saison de la Wanda Diamond League, de l’ouverture à la finale de Bruxelles. {{done}} meetings sur {{total}} sont comptabilisés.",
  "schedule.figMeetings": "Meetings au programme",
  "schedule.figAlreadyRun": "Déjà disputées",
  "schedule.figTheFinal": "La finale",
  "schedule.panelTitle": "La route vers la finale",
  "schedule.panelSubtitle":
    "Le circuit Diamond League 2026, dans l’ordre. L’or marque la finale, le seul meeting de cette liste qui décide de quelque chose.",
  "schedule.meetingOf": "Meeting {{n}} sur {{total}}",
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
    "Quelles épreuves regorgent d’athlètes de haut niveau, et lesquelles se résument à une star loin devant les autres. Chaque performance 2026 est convertie en points World Athletics, puis nous mesurons l’écart entre le meilleur athlète de l’épreuve et celui du milieu de classement. Un petit écart signifie un plateau dense et disputé ; un grand écart, un athlète très détaché du reste.",
  "stats.figMarksScored": "Performances cotées",
  "stats.figFieldMedian": "Score du milieu (pts WA)",
  "stats.figScoringRange": "Amplitude des scores",
  "stats.figSetIndoors": "Réalisées en salle",
  "stats.bestOfSeason": "Les meilleures de la saison",
  "stats.bestOfYear": "Les meilleures de {{season}}, toutes épreuves",
  "stats.bestSubtitle":
    "Classées aux points World Athletics, pour qu’un lancer de disque et un 800 m soient directement comparables. Les barres commencent au score le plus bas de la saison, pas à zéro, pour que les écarts soient plus visibles.",
  "stats.filterAll": "Toutes les épreuves",
  "stats.filterTrack": "Piste",
  "stats.filterField": "Concours",
  "stats.filterOutdoor": "Plein air uniquement",
  "stats.noMarks": "Aucune performance ne correspond à ce filtre.",
  "stats.indoorNoteBefore":
    "World Athletics inclut les performances en salle dans son classement de la saison en plein air, signalées seulement par un ",
  "stats.indoorNoteMid": " sur le lieu — ",
  "stats.indoorNoteOf": " % des ",
  "stats.indoorNoteAfter":
    " performances présentes ici, et près de la moitié d’entre elles dans les sauts verticaux. Elles sont conservées, car pour une perche ou un poids la salle est sans doute la mesure la plus juste, mais chacune est signalée. Utilisez ",
  "stats.indoorNoteOutdoorOnly": "Plein air uniquement",
  "stats.indoorNoteEnd": " ci-dessus pour les retirer.",
  "stats.indoorBadge": "Salle",
  "stats.indoorBadgeTitle":
    "Réalisée en salle. World Athletics inclut ces performances dans le classement de la saison en plein air",

  // Depth ladder (Stats page)
  "depth.sortDepth": "Par densité",
  "depth.sortMedian": "Par score du milieu",
  "depth.sortTop": "Par meilleur score",
  "depth.title": "L’échelle de densité · {{n}} disciplines",
  "depth.subtitle":
    "Chaque barre va du score de l’athlète en milieu de classement au meilleur score de l’épreuve. Une barre courte signifie un plateau dense, où le leader est proche du peloton. Une barre longue, un athlète nettement détaché du reste.",
  "depth.legendMedian": "Milieu du plateau",
  "depth.legendTop": "Meilleur de l’épreuve",
  "depth.legendSpread": "Écart (meilleur − milieu)",
  "depth.noteBefore": "L’épreuve la plus dense selon cette mesure est le ",
  "depth.noteMid": ", où le leader n’a que ",
  "depth.notePointsClear":
    " points d’avance sur l’athlète du milieu de classement. La plus déséquilibrée est le ",
  "depth.noteAt": " avec ",
  "depth.noteEnd":
    " points. Cet écart couvre tous les athlètes classés par World Athletics dans l’épreuve, ce qui est une autre question que de savoir à quel point les huit finalistes sont proches, et la page de chaque épreuve y répond.",

  // How it works (inline emphasis uses **bold** / *italic*, see lib/rich-text)
  "howItWorks.eyebrow": "À propos du modèle",
  "howItWorks.description":
    "PodiumCall prédit le podium de chaque épreuve de la finale de la Diamond League 2026, à partir de vrais résultats World Athletics, avant le premier départ. Voici exactement comment il s’y prend, et ce qu’il vaut.",
  "howItWorks.s1.title": "Ce qu’il prédit",
  "howItWorks.s1.p1":
    "Pour chacune des **32 épreuves** de la finale de Bruxelles, le modèle donne à chaque prétendant un seul chiffre : sa chance de finir **dans le top trois**. Il ne désigne jamais un vainqueur unique.",
  "howItWorks.s1.p2":
    "C’est délibéré. Le jour J, le qualifié le plus rapide peut faire un faux départ, se faire enfermer ou être repris sur la ligne : prédire le vainqueur exact tient donc presque du pile ou face entre trois ou quatre noms. Prédire qui monte sur le podium est une question plus juste, et que l’on peut vérifier face au résultat ensuite. Chaque chiffre du site porte donc sur le top trois, jamais sur la seule médaille d’or.",
  "howItWorks.s2.title": "Comment le modèle apprend",
  "howItWorks.s2.p1":
    "Le modèle apprend des podiums réels de chaque finale de Diamond League, des Jeux olympiques, des Championnats du monde, des Championnats d’Europe et de la Coupe continentale, de **2018 à 2025** (2020 a été annulée). Ce sont de vrais résultats, tirés directement de World Athletics, pas l’avis de quiconque sur qui aurait dû gagner. Chaque athlète n’est jugé que sur ce qu’il avait accompli **avant que cette finale ait lieu** : une finale de juillet n’est jamais évaluée avec une course d’août.",
  "howItWorks.s2.p2":
    "Pour chaque athlète en lice, le modèle calcule **18 signaux** à partir de sa vraie saison : sa meilleure marque de l’année et son record en carrière, sa régularité d’un meeting à l’autre, la tendance de sa forme, sa fréquence de compétition, l’ancienneté de sa meilleure marque, son retard sur le meilleur du plateau, et son bilan **en confrontation directe avec ce plateau précis**. Une **forêt aléatoire**, un modèle qui pèse de nombreux signaux ensemble, transforme le tout en un seul chiffre : la chance de podium. Elle les pèse ensemble parce que les signaux s’influencent les uns les autres. Une superbe meilleure performance compte moins, par exemple, si l’athlète n’a presque pas concouru de l’année.",
  "howItWorks.s2.p3":
    "Et il est testé honnêtement, par **validation glissante** : le modèle n’est entraîné que sur des saisons *antérieures* à l’année sur laquelle il est évalué, la précision ci-dessous provient donc entièrement de finales qu’il n’avait jamais vues. C’est toute la différence entre une vraie prévision et un modèle qui a simplement appris les réponses par cœur.",
  "howItWorks.s3.title": "Sa précision",
  "howItWorks.s3.basisFallback":
    "Taux de réussite du podium parmi les athlètes qui atteignent réellement la finale",
  "howItWorks.s3.toplistCaption":
    "Un test bien plus difficile : choisir les 3 médaillés dans la liste de classement complète d’environ 100 athlètes d’une discipline, ce que le site ne fait jamais en pratique.",
  "howItWorks.s3.note":
    "Les deux chiffres proviennent des mêmes prédictions ; ils posent simplement des questions différentes. Le premier est le vrai travail que fait le site : étant donné les huit à dix athlètes qui atteignent réellement une finale, à quelle fréquence le top trois projeté par le modèle est-il correct ? Le second est un test volontairement plus difficile qu’il n’a jamais à passer en pratique. Une douzaine de points sépare les deux, et aucun des deux n’est arrondi vers le haut ou pris dans une saison flatteuse.",
  "howItWorks.s3.withdrawals":
    "Aucun des deux chiffres ne dit qui sera au départ. Ils ne sont calculés que sur des athlètes réellement alignés : ils mesurent la capacité du modèle à classer un plateau, pas à deviner qui le composera. Les blessures et les forfaits de dernière minute sont une autre question, et ce sont les signalements affichés sur les projections qui y répondent.",
  "howItWorks.s4.title": "D’où viennent les données",
  "howItWorks.s4.pBefore":
    "Chaque performance, classement et résultat provient directement de l’API publique de ",
  "howItWorks.s4.pAfter":
    ", les données mêmes qui alimentent leurs retransmissions et leurs fiches d’athlètes. L’extraction tourne sur une machine séparée, et aucune performance n’est jamais saisie ni modifiée à la main : ce que vous lisez ici est exactement ce qu’ils ont publié.",
  "howItWorks.s4.competitions": "Compétitions",
  "howItWorks.s4.marks": "Performances passées apprises",
  "howItWorks.s4.venues": "Sites",
  "howItWorks.s4.seasons": "Saisons",
  "howItWorks.s4.seasonsDeep": "Saisons d’historique",
  "howItWorks.s5.title": "Ce qu’il ne peut pas faire",
  "howItWorks.s5.b1":
    "Il lit **la forme, pas l’avenir**. Une blessure de dernière minute, un forfait annoncé le matin même, ou une course tactique lente décidée au sprint final peuvent tous démentir les chiffres le jour J.",
  "howItWorks.s5.b2":
    "Il prédit **qui monte sur le podium, pas le 1-2-3 exact**, et il ne prétend jamais savoir qui gagne.",
  "howItWorks.s5.b3":
    "Il n’est **pas affilié à World Athletics** ni à la Wanda Diamond League. Il se contente de lire leurs données publiques.",
  "howItWorks.s6.title": "Rechercher par pays",
  "howItWorks.s6.p1":
    "La recherche trouve **les pays autant que les athlètes**. Tapez une nation — « Jamaïque », « KEN », « Norvège » — et elle apparaît dans les résultats à côté des athlètes dont le nom correspond, avec le nombre d’athlètes classés et d’épreuves de cette nation cette saison.",
  "howItWorks.s6.p2":
    "En ouvrir une donne à cette nation sa propre page : tous ses athlètes classés, leurs marques et leurs scores, ses trois meilleures performances de la saison, et ceux qu’elle a qualifiés pour le Championnat Ultimate. La page porte les couleurs du pays, tirées de son drapeau.",

  // Qualifying
  "qual.num.6": "Six",
  "qual.num.8": "Huit",
  "qual.num.10": "Dix",
  "qual.places": "places",
  "qual.lanes": "couloirs",
  "qual.headline": "{{word}} {{noun}}. La course pour disputer la course.",
  "qual.headlineFallback": "La course pour la finale",
  "qual.description":
    "Qui a réellement gagné sa place en finale. Ce sont les points Diamond League de World Athletics eux-mêmes, pas une prédiction, avec l’écart jusqu’à la barre de qualification calculé sur ce qui reste à gagner.",
  "qual.descriptionDecided":
    "Qui a réellement gagné sa place en finale. Ce sont les points Diamond League de World Athletics eux-mêmes, pas une prédiction, tous les meetings comptant pour le classement 2026 étant désormais disputés.",
  "qual.eyebrowOne": "1 meeting qualificatif restant · une victoire vaut {{pts}} points",
  "qual.eyebrowMany": "{{n}} meetings qualificatifs restants · une victoire vaut {{pts}} points",
  "qual.eyebrowDecided":
    "Tous les meetings qualificatifs sont disputés, le classement est définitif",
  "qual.eyebrowBare": "Classement Diamond League 2026",
  "qual.figQualify": "Qualifiés pour la finale",
  "qual.figPoints": "Points pour se qualifier",
  "qual.figMeetingsLeft": "Meetings restants",
  "qual.figPointsForWin": "Points pour une victoire",
  "qual.standingsSkeleton": "Classement Diamond League",
  "qual.tightTitleDecided": "À égalité sur la barre",
  "qual.tightTitleNext": "Au plus près de la barre avant {{city}}",
  "qual.tightTitle": "Au plus près de la barre",
  "qual.tightSubtitleDecided":
    "Tous les meetings qualificatifs sont disputés, et dans ces disciplines l’athlète sous la barre a terminé à égalité de points avec celui qui l’occupe. C’est le départage de World Athletics qui tranche, pas une autre course.",
  "qual.tightSubtitle":
    "Le plus petit écart entre la barre de qualification et le premier athlète en dessous : les disciplines que le dernier meeting décide vraiment.",
  "qual.levelOnPoints": "À égalité de points",
  "qual.behind": "de retard",
  "qual.disciplineLabel": "Discipline",
  "qual.standingsTitle": "Classement Diamond League · {{disc}}",
  "qual.standingsSubtitle": "Les {{n}} premiers aux points se qualifient pour la finale.",
  "qual.standingsSubtitleCut":
    "Les {{n}} premiers aux points se qualifient pour la finale. La barre se situe actuellement à {{pts}} points.",
  "qual.caption":
    "Classement Diamond League du {{disc}} : rang, athlète, points, meetings disputés, écart à la barre de qualification et statut",
  "qual.colMeets": "Meetings",
  "qual.colPoints": "Points",
  "qual.colGap": "Écart à la barre",
  "qual.colStatus": "Statut",
  "qual.status.safe": "Qualifié",
  "qual.status.in": "En position",
  "qual.status.chasing": "En chasse",
  "qual.status.out": "Éliminé",
  "qual.status.unknown": "Aucun point",
  "qual.statusDecided.in": "Départage",
  "qual.statusDecided.chasing": "Départage",
  "qual.statusTitle.safe": "Indéboulonnable : personne en dessous ne peut atteindre son total",
  "qual.statusTitle.in": "Au-dessus de la barre en l’état, mais encore rattrapable",
  "qual.statusTitle.chasing": "Sous la barre et encore mathématiquement capable de l’atteindre",
  "qual.statusTitle.out": "Ne peut pas atteindre la barre, même en gagnant tout ce qui reste",
  "qual.statusTitle.unknown": "World Athletics ne recense aucun point pour cet athlète",
  "qual.statusTitleDecided.in":
    "Au-dessus de la barre, mais à égalité de points avec un athlète en dessous ; le départage de World Athletics tranche",
  "qual.statusTitleDecided.chasing":
    "À égalité de points avec la dernière place qualificative et plus aucun meeting qualificatif ; le départage de World Athletics tranche",
  "qual.gapBehind": "{{n}} de retard",
  "qual.gapOnLine": "sur la barre",
  "qual.gapLevel": "à égalité avec la barre",
  "qual.gapClear": "{{n}} d’avance",
  "qual.footBefore":
    "Les points sont ceux de World Athletics, extraits du classement Diamond League 2026. ",
  "qual.footOpen":
    "« Éliminé » signifie que l’athlète ne peut pas atteindre la barre, même en gagnant tout ce qui reste ; « Qualifié » signifie que personne ne peut le déloger, même s’il ne marque plus jamais. Tout ce qui se situe entre les deux reste ouvert. Cela suppose que la discipline figure au programme restant. Si elle n’est plus disputée, ce classement est déjà définitif, ce qui ne fait que rendre « Éliminé » plus certain encore.",
  "qual.footDecided":
    "Il ne reste aucun meeting qualificatif : ce classement est donc le résultat. « Départage » signale la seule chose que les points seuls ne peuvent trancher : deux athlètes à égalité de points de part et d’autre de la barre, séparés par les règles de départage de World Athletics, qui ne figurent pas dans ces données.",
  "qual.footScraped": " Extrait le {{when}}.",
  "qual.howToRead.title": "Comment le lire",
  "qual.howToRead.subtitle": "La marge, pas la médaille.",
  "qual.howToRead.p1Before":
    "Les points viennent de la place obtenue à chaque meeting Diamond League réellement disputé — ",
  "qual.howToRead.p1After":
    " pour une victoire, en dégressif ensuite. Rien ici n’est une projection : c’est l’arithmétique de qui a marqué quoi.",
  "qual.howToRead.holdsBefore": " occupe la {{n}}e et dernière place avec ",
  "qual.howToRead.holdsAfter": " points",
  "qual.howToRead.exactlyLevel": ", exactement à égalité avec la barre",
  "qual.howToRead.firstOutBefore": " est le premier éliminé, à ",
  "qual.howToRead.point": "point",
  "qual.howToRead.points": "points",
  "qual.howToRead.short": "",
  "qual.howToRead.decidedTail": ", sans aucun meeting restant pour y changer quoi que ce soit",
  "qual.howToRead.openTail": ", avec des courses encore à venir",

  "qual.cutLine": "Barre de qualification · top {{n}}",

  // Athletics vocabulary shared across components
  "word.race": "course",
  "word.races": "courses",
  "word.competition": "concours",
  "word.competitions": "concours",
  "word.raced": "en course",
  "word.competedAgainst": "en concours",

  // Discipline page
  "disc.titleFallback": "Discipline",
  "disc.eyebrow":
    "Discipline contre discipline · {{rank}} plateau le plus serré sur {{of}} finales",
  "disc.eyebrowBare": "Discipline contre discipline",
  "disc.description":
    "Une épreuve lue comme un plateau et non comme une liste. Est-ce disputé de bout en bout, ou un seul athlète et le vide derrière ? Mesuré sur les points de cotation de World Athletics, pour que la réponse soit comparable aux 31 autres finales.",
  "disc.whyScore":
    "Ceci utilise les points World Athletics, pas les pourcentages du modèle. Un pourcentage ne compare que des athlètes d’une même épreuve : additionnez les pourcentages de tout un plateau et le total varie de 31 à 320 selon l’épreuve, ils ne peuvent donc pas classer une épreuve par rapport à une autre. Un score en points le peut, car chaque marque est cotée de la même façon.",
  "disc.depthSkeleton": "Densité du plateau",
  "disc.seasonForm": "Forme réelle de la saison · {{disc}}",
  "disc.seasonFormSubtitle":
    "Chaque performance réellement enregistrée par les prétendants cette saison, sur un vrai calendrier. Ce n’est pas une tendance lissée : les points sont les meetings où ils se sont présentés.",
  "disc.storylines": "Ce qu’il faut suivre · {{disc}}",
  "disc.storylinesSubtitle":
    "Calculé à partir des données, pas rédigé : chaque angle repose sur un chiffre réel, et la carte mise en avant est celle qui contredit le plus le pronostic du modèle.",
  "disc.depthTitle": "Densité du plateau",
  "disc.depthNeeds": "Nécessite un score World Athletics pour au moins deux athlètes du plateau.",
  "disc.depthNotEnough":
    "Trop peu d’athlètes de ce plateau ont un score World Athletics cette saison pour mesurer son homogénéité. Rien n’est estimé à la place.",
  "disc.levelTitle": "L’homogénéité de ce plateau",
  "disc.levelSubtitle":
    "Le meilleur score de chaque finaliste cette saison, du plus fort au plus faible. C’est l’écart entre les deux extrémités qui classe cette épreuve face aux {{of}} autres.",
  "disc.verdict.level.label": "PLATEAU HOMOGÈNE",
  "disc.verdict.level.basis": "l’un des tiers les plus serrés des 32 finales",
  "disc.verdict.mixed.label": "DEUX GROUPES",
  "disc.verdict.mixed.basis": "le tiers intermédiaire des 32 finales",
  "disc.verdict.topHeavy.label": "UN SEUL ET LE VIDE",
  "disc.verdict.topHeavy.basis": "l’un des tiers les plus larges des 32 finales",
  "disc.spreadSentenceMid": " points séparent ",
  "disc.spreadSentenceDown": " du plus faible des ",
  "disc.spreadSentenceEnd": " athlètes cotés.",
  "disc.statSpread": "Écart sur le plateau",
  "disc.statSpreadValue": "{{n}} pts",
  "disc.statSpreadNote": "{{rank}} plus serré sur {{of}}",
  "disc.statSpreadHint":
    "L’écart de points entre le finaliste le plus fort et le plus faible. Un petit écart signifie un plateau serré et homogène ; un grand écart, un leader nettement devant.",
  "disc.statStrongest": "Finaliste le plus fort",
  "disc.statMedian": "Médiane du top 100 mondial",
  "disc.statMedianNoScore": "non coté cette saison",
  "disc.statMedianClear": "le meilleur finaliste a {{n}} d’avance",
  "disc.statMedianHint":
    "Le score du milieu parmi les 100 meilleurs mondiaux de l’épreuve cette année. Il montre comment le plateau de la finale se situe face au reste du monde, et pas seulement face à lui-même.",
  "disc.statScored": "Plateau coté",
  "disc.statScoredEvery": "tous les finalistes",
  "disc.statScoredSome": "certains n’ont aucun score cette saison",
  "disc.statScoredHint":
    "Combien de finalistes ont un score World Athletics cette saison. Quelques épreuves en comptent un ou deux qui n’en ont pas, et rien n’est estimé à leur place.",
  "disc.disagreeTitle": "Là où le modèle diverge des performances",
  "disc.disagreeSubtitle":
    "La chance de podium du modèle à côté du score de la saison de chaque athlète, pour les mêmes {{n}} athlètes. Les deux ne coïncident pas toujours, et les athlètes où ils divergent sont les plus intéressants à suivre.",
  "disc.disagreeSubtitleModel":
    "Les mêmes {{n}} athlètes, classés cette fois selon leur chance de podium plutôt que selon leur score de la saison. Un athlète qui monte ou descend nettement est un athlète sur lequel les deux mesures ne s’accordent pas.",
  "disc.disagreeToggleLabel": "Classer cette liste par",
  "disc.disagreeByPoints": "Score de la saison",
  "disc.disagreeByModel": "Chance de podium",
  "disc.disagreeColScore": "Score",
  "disc.disagreeColChance": "Chance",
  "disc.disagreeNote":
    "Classé par score World Athletics. Le pourcentage est la chance, selon le modèle, que cet athlète finisse dans le top trois, pas une chance de victoire. Les deux colonnes peuvent diverger : une meilleure performance de la saison est un seul résultat, alors que la projection pèse toute la saison.",

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
    "Lisez une ligne de gauche à droite : le bilan de cet athlète face à chaque rival, victoires en premier. Établi à partir de leurs {{noun}} en commun. {{met}} des {{possible}} confrontations possibles ont eu lieu.",
  "fa.howToRead": "Comment lire cette grille",
  "fa.howToReadBefore":
    "Chaque ligne est un athlète, chaque colonne un rival. Une case indique les victoires puis les défaites : ",
  "fa.howToReadAfter":
    " signifie que l’athlète de la ligne a battu ce rival trois fois et perdu une fois, en ne comptant que leurs {{noun}} en commun. L’or indique que l’athlète de la ligne mène ; une case vide signifie qu’ils ne se sont jamais rencontrés.",
  "fa.gridCaption":
    "Grille des confrontations directes du plateau du {{disc}}. Chaque ligne est le bilan d’un athlète face à celui nommé dans chaque colonne, victoires en premier, à partir de leurs {{noun}} en commun.",
  "fa.separatesTitle": "Ce qui les sépare",
  "fa.separatesSubtitle":
    "Les mêmes mesures pour chaque prétendant, pour pouvoir distinguer deux athlètes aux meilleures performances de la saison quasi identiques.",
  "fa.separatesCaption":
    "Ce qui sépare le plateau du {{disc}} : les mêmes mesures pour chaque prétendant, pour pouvoir distinguer deux athlètes aux meilleures performances quasi identiques.",
  "fa.colTop3": "Moy. top 3",
  "fa.colTop3Hint":
    "La moyenne des trois meilleures marques de cet athlète cette saison. Plus difficile à gonfler avec un seul résultat chanceux qu’une simple meilleure performance de la saison.",
  "fa.colSteadiness": "Régularité",
  "fa.colSteadinessHint":
    "À quel point les marques d’un athlète sont proches les unes des autres sur la saison, rapportées à sa moyenne. Plus c’est bas, plus l’athlète est régulier, et la mesure se lit de la même façon pour un sprinteur et pour un lanceur.",
  "fa.colComps": "Concours",
  "fa.colRaces": "Courses",
  "fa.colStartsHint":
    "Combien de fois cet athlète a concouru cette saison, puis son total enregistré sur toute sa carrière (cette saison / carrière).",
  "fa.colPodium": "Podium",
  "fa.colPodiumHint":
    "À quelle fréquence cet athlète a fini dans le top trois, sur l’ensemble des finales à son actif.",
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
    "Performances réelles {{year}} meeting par meeting pour les {{n}} meilleurs prétendants, une ligne par meeting",
  "traj.colDate": "Date",
  "traj.colMark": "Performance",
  "traj.colVenue": "Lieu",

  "fa.blankCellNote":
    "Une case vide signifie qu’il n’y a réellement jamais eu de confrontation {{verb}} entre ces deux athlètes : elle reste vide plutôt que d’afficher un 0–0 trompeur. La colonne « face à ce plateau » totalise le bilan de chaque athlète face à ce plateau uniquement, ce qui n’est pas son taux de victoire global : un athlète peut battre tous les autres et rester derrière les huit qui s’alignent à Bruxelles.",
  "fa.neverMet": "{{a}} et {{b}} : aucune confrontation {{verb}}",

  "fa.noResults": "aucun résultat",

  "traj.excludedOne":
    "{{names}} n’a encore aucune donnée de meeting {{year}} enregistrée. Voir sa fiche pour sa saison la plus récente.",
  "traj.excludedMany":
    "{{names}} n’ont encore aucune donnée de meeting {{year}} enregistrée. Voir leur fiche pour leur saison la plus récente.",

  // Athlete analytics
  "aa.recordTitle": "Bilan en compétition",
  "aa.recordSubtitle":
    "Toutes les finales enregistrées : {{n}} {{noun}} sur {{seasons}} saisons. Une meilleure performance de la saison n’est qu’un résultat ; voici le niveau tenu le reste du temps.",
  "aa.wins": "Victoires",
  "aa.ofStarts": "{{pct}} % des départs",
  "aa.podiums": "Podiums",
  "aa.averageFinish": "Place moyenne",
  "aa.best": "meilleure : {{place}}",
  "aa.topTierStarts": "Départs au plus haut niveau",
  "aa.topTierShare": "{{pct}} % des {{noun}}",
  "aa.byCategory": "Par catégorie de compétition",
  "aa.colCategory": "Catégorie",
  "aa.colWon": "Gagnées",
  "aa.seasonBySeason": "Saison par saison",
  "aa.seasonBySeasonSubtitle":
    "La meilleure performance de la saison face à la moyenne des trois meilleures de l’année, pour qu’un après-midi de chance côtoie le niveau réellement tenu.",
  "aa.seasonShape": "Profil de saison",
  "aa.seasonShapeSubtitleField":
    "Quand ils concourent réellement, et quand tombe la meilleure performance. Un athlète au pic en mai n’est pas le même pari en septembre qu’un autre encore en progression.",
  "aa.seasonShapeSubtitleTrack":
    "Quand ils courent réellement, et quand tombe la meilleure performance. Un athlète au pic en mai n’est pas le même pari en septembre qu’un autre encore en progression.",
  "aa.h2hTitle": "Bilan des confrontations directes",
  "aa.h2hSubtitle":
    "Établi uniquement sur des affrontements réels en {{noun}} : même meeting, même jour, places comparées. Rien ici n’est déduit.",
  "aa.inFieldTitle": "Projeté dans le plateau de la finale",
  "aa.inField": "Dans le plateau",
  "aa.h2hNoteBefore":
    "Trié par nombre de rencontres, pas par bilan, car les rivalités les plus fournies sont les plus instructives. Les défaites sont montrées aussi clairement que les victoires. Les adversaires marqués ",
  "aa.h2hNoteAfter": " sont projetés au départ de la finale.",
  "aa.coverageBefore":
    "Calculé à partir de {{races}} finales extraites ({{withPlace}} avec une place enregistrée) sur {{n}} {{seasonWord}} : {{seasons}}. Ce sont tous les meetings dont World Athletics publie les résultats dans les groupes de compétition seniors en plein air, pas la carrière complète d’un athlète ; une sortie en {{noun}} hors de ces groupes n’est pas comptée.",
  "aa.season": "saison",
  "aa.seasons": "saisons",
  "aa.seasonTableCaption":
    "Saison par saison : meilleure performance, moyenne des trois meilleures et régularité de chaque campagne",
  "aa.colSeason": "Saison",
  "aa.colBest": "Meilleure",
  "aa.colConsistency": "Régularité",
  "aa.ofCount": "(sur {{n}})",
  "aa.tooFew": "trop peu de {{noun}}",
  "aa.consistencyNote":
    "La régularité mesure à quel point les marques d’un athlète sont proches sur une saison, rapportées à sa moyenne : elle se lit donc de la même façon pour un sprinteur à 9,8 s et pour un lanceur à 74 mètres. Plus c’est bas, plus c’est régulier. Chaque barre ne compare une saison qu’aux autres saisons de cet athlète.",
  "aa.monthTitle": "{{month}} : {{n}} {{noun}}",
  "aa.monthTitleBest": "{{month}} : {{n}} {{noun}}, meilleure performance de la saison ici",
  "aa.shapeNote": "{{n}} {{noun}} du {{first}} au {{last}}.",
  "aa.shapeBestBefore": " Sa meilleure performance de la saison est tombée en ",
  "aa.shapeBestAfter": " (barre dorée).",

  "aa.colAvgFinish": "Place moy.",
  "aa.categoriesNote":
    "Les catégories sont les propres libellés de classement de World Athletics, listés dans un ordre fixe et délibérément non ramenés à un score de qualité unique, car un championnat continental et un meeting du Continental Tour Gold ne sont pas comparables sur un seul axe. Lisez plutôt les lignes les unes par rapport aux autres.",

  "disc.spreadCaption": "Le score World Athletics de chaque finaliste",
  "disc.spreadNote":
    "L’or marque le meilleur score du plateau. Des points regroupés signalent un plateau homogène ; un point isolé signifie que quelqu’un se détache du reste.",

  "fa.vsThisField": "face à ce plateau",

  // Athlete profile
  "ath.backToTrack": "← Retour aux épreuves de piste",
  "ath.backToField": "← Retour aux épreuves de concours",
  "ath.dossier": "Fiche athlète · {{disc}}",
  "ath.age": "{{n}} ans",
  "ath.rankInField": "n°{{n}} du plateau projeté",
  "ath.ifQualified": "En cas de qualification",
  "ath.ifQualifiedBefore":
    " % de chance de podium, d’après le même modèle appliqué au groupe des recalés. Ce n’est pas une projection sur Bruxelles ; il ou elle n’est pas dans le plateau.",
  "ath.flaggedFrom": "Signalé d’après : {{reason}}",
  "ath.viewSource": "Voir la source",
  "ath.dlPoints": "Points Diamond League",
  "ath.inStandings": "· {{rank}} au classement",
  "ath.gapToCut": "Écart à la barre",
  "ath.level": "à égalité",
  "ath.cutAt": "· barre à {{n}}",
  "ath.seeStandings": "Voir tout le classement du {{disc}} →",
  "ath.fastestNote":
    "À noter : c’est la meilleure performance mondiale de la saison. L’éligibilité à la finale de la Diamond League se décide aux points marqués dans la série, pas à la meilleure performance de la saison.",
  "ath.seasonStats": "Statistiques de la saison",
  "ath.seasonBest2026": "Meilleure perf. 2026",
  "ath.worldRank": "Rang mondial",
  "ath.thisSeasonToplist": "classement de cette saison",
  "ath.careerBest": "Record en carrière",
  "ath.pbGap": "Écart au record",
  "ath.offCareerBest": "de son record en carrière",
  "ath.pbGapHintMetres":
    "L’écart entre la meilleure performance de la saison et le record personnel de l’athlète, en mètres. Zéro veut dire que le record personnel a été égalé cette année ; plus le chiffre est grand, plus l’athlète en est loin.",
  "ath.pbGapHintSeconds":
    "L’écart entre la meilleure performance de la saison et le record personnel de l’athlète, en secondes. Zéro veut dire que le record personnel a été égalé cette année ; plus le chiffre est grand, plus l’athlète en est loin.",
  "ath.ageLabel": "Âge",
  "ath.meetsThisSeason": "Meetings cette saison",
  "ath.dlMeetings": "meetings Diamond League",
  "ath.competitionsThisSeason": "Concours cette saison",
  "ath.racesThisSeason": "Courses cette saison",
  "ath.allCompetitions": "toutes compétitions",
  "ath.lastCompeted": "Dernière sortie",
  "ath.daysAgo": "il y a {{n}} j",
  "ath.waScore": "Score WA",
  "ath.waScoreSub": "Top {{pct}} % de toutes les performances classées",
  "ath.waScoreHint":
    "Le score en points de World Athletics pour une performance. Il place toutes les épreuves sur une même échelle : un 9,9 au 100 m et un 2,30 m en hauteur peuvent ainsi être comparés. Plus c’est élevé, mieux c’est.",
  "ath.percentileBefore": "{{ord}} centile au sein du {{disc}}, où la médiane est de ",
  "ath.percentileAfter": ".",
  "ath.setIndoors": " Cette performance a été réalisée en salle.",
  "ath.noDatedResults":
    "World Athletics recense une meilleure performance de la saison pour cet athlète mais aucun résultat daté cette saison{{extra}} : le nombre de meetings et la dernière sortie sont donc inconnus ici, et non nuls.",
  "ath.noDatedResultsExtra": " (ses résultats enregistrés datent d’années antérieures)",
  "ath.notComputed":
    "Le record en carrière, l’écart au record et l’activité ne sont pas calculés pour des athlètes aussi éloignés du plateau. Le modèle n’évalue que les finalistes projetés et leurs plus proches poursuivants.",
  "ath.realSeasonForm": "Forme réelle de la saison",
  "ath.seasonFormAll":
    "Toutes les compétitions disputées cette saison — {{n}} au total — en salle comme en plein air, pas seulement la Diamond League. Le palmarès ci-dessous ne compte que les finales, d’où des totaux différents.",
  "ath.seasonFormCondensed":
    "Sa meilleure performance de chaque mois. {{n}} courses cette saison, trop pour les afficher une à une : chaque mois disputé est représenté par son meilleur résultat.",
  "ath.h2hTitle": "Confrontations directes face au plateau projeté",
  "ath.h2hSubtitle":
    "Confrontations réelles face aux athlètes qui se sont qualifiés, d’après les résultats World Athletics.",
  "ath.figSeasonBest": "Meilleure perf. saison",
  "ath.figPersonalBest": "Record personnel",
  "ath.figRacesIn": "Courses en {{year}}",
  "ath.model": "Modèle PodiumCall",
  "ath.modelBefore":
    " % de chance de finir sur le podium à Bruxelles, pas de gagner. Le modèle prédit l’appartenance au top trois.",
  "ath.modelScoreBefore": " Le ",
  "ath.modelScoreMid": " vaut ",
  "ath.modelScoreAfter": " points World Athletics, soit le ",
  "ath.modelScoreEnd": " centile de cette discipline.",
  "ath.profileEyebrow": "Fiche athlète",
  "ath.loadingDescription":
    "Chargement de la forme réelle de la saison, des confrontations directes et des statistiques…",
  "ath.errorDescription": "Le profil de cet athlète n’a pas pu être chargé.",
  "ath.errorTitle": "Impossible de charger le profil de l’athlète",
  "ath.errorHint":
    "Cet athlète n’est peut-être pas dans le fichier de prédictions actuel. Les athlètes déclarés forfait sont filtrés avant la construction des profils.",

  "ath.percentileDiffer":
    " Les deux lectures diffèrent parce que les épreuves n’ont pas la même densité.",
  "ath.viewFullProfile": "Voir la fiche complète sur World Athletics →",

  "ath.onDlPoints": "{{rank}} avec {{points}} points DL",
  "ath.worldRankTag": "n°{{n}} mondial",

  // Athlete career, season trend and head-to-head charts
  "car.title": "Palmarès et classement",
  "car.subtitle":
    "Le palmarès et le classement mondial actuel tels que World Athletics les publie. Rien n’est calculé ici.",
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
  "stc.caption": "Performances de la saison {{year}} de cet athlète, une ligne par meeting",
  "stc.captionLast": "Performances de la dernière saison de cet athlète, une ligne par meeting",
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
  "car.pbAfter":
    ". Les performances réalisées en salle sont comprises dans ce total et signalées partout où elles apparaissent ; World Athletics les répertorie aux côtés de celles en plein air.",

  // Landing page
  "landing.tagline": "Des pronostics d’athlétisme fondés sur de vrais résultats",
  "landing.badgeBare": "PodiumCall",
  "landing.badgeCountdown": "PodiumCall · J-{{n}} avant {{city}}",
  "landing.badgeLive": "PodiumCall · En direct de {{city}}",
  "landing.badgeDone": "PodiumCall · {{city}} terminé",
  "landing.h1a": "Nous faisons le",
  "landing.h1b": "pronostic avant",
  "landing.h1c": "le",
  "landing.h1gun": "départ.",
  "landing.lede":
    "Un modèle entraîné sur de vrais résultats, pas sur l’intuition. Nous extrayons chaque performance World Athletics des {{n}} disciplines, classons les meilleurs mondiaux et pronostiquons le podium avant le premier départ.",
  "landing.ctaPrimary": "Voir les prédictions en direct",
  "landing.ctaSecondary": "Parcourir les {{n}} épreuves",
  "landing.statHitRate": "Taux de réussite du podium",
  "landing.statDisciplines": "Disciplines suivies",
  "landing.statMarks": "Performances cotées cette saison",
  "landing.statsLoading": "Chargement des statistiques en direct…",
  "landing.statsError":
    "Les statistiques en direct sont injoignables pour le moment. Les chiffres ci-dessus se rempliront dès que le modèle tournera.",
  "landing.tickerWithRange":
    "En direct du modèle : son athlète le mieux évalué dans chacune des {{n}} disciplines, de {{lo}} à {{hi}} %",
  "landing.ticker": "En direct du modèle : l’athlète qu’il évalue le mieux dans chaque épreuve",
  "landing.tickerAria": "Confiance du modèle en direct, par discipline",
  "landing.podiumEyebrow": "Le podium projeté",
  "landing.podiumTitle": "Les trois sur lesquels le modèle mise le plus en ce moment.",
  "landing.podiumError": "Le podium se remplira dès que le modèle en direct sera joignable.",
  "landing.podiumLoading": "Chargement des pronostics les plus sûrs du modèle…",
  "landing.podiumNoteBefore":
    "Chacun d’eux est le pronostic le plus sûr du modèle dans une discipline ",
  "landing.podiumNoteDifferent": "différente",
  "landing.podiumNoteAfter":
    " discipline, ils ne sont donc pas en concurrence les uns avec les autres. Leur place ici montre la note que le modèle leur donne, pas l’ordre dans lequel ils finiraient les uns contre les autres. Chaque pourcentage est l’évaluation propre du modèle, pas un classement officiel ; les marques sont les meilleures performances de la saison 2026 selon World Athletics.",
  "landing.demoEyebrow": "De vrais résultats en entrée. Un plateau classé en sortie.",
  "landing.demoTitleWithCount":
    "{{n}} meetings réellement disputés, ramenés aux meilleurs athlètes du modèle.",
  "landing.demoTitle":
    "Une saison entière de compétition, ramenée aux meilleurs athlètes du modèle.",
  "landing.demoBodyBefore": "Chaque grand meeting de la saison est extrait de ",
  "landing.demoBodyAfter":
    ", puis réduite à l’évaluation par le modèle de chaque athlète dans chaque épreuve.",
  "landing.rawSignal": "Signal brut",
  "landing.modelRating": "Éval. modèle",
  "landing.strongestCall": "Le meilleur athlète du modèle",
  "landing.rankedLoad":
    "Les prédictions classées se chargeront dès que le modèle en direct tournera.",
  "landing.stepsEyebrow": "Aucune donnée inventée, à aucune étape.",
  "landing.stepsTitle":
    "De vraies données en entrée, des prédictions honnêtes en sortie, en {{n}} étapes.",
  "landing.previewEyebrow": "Directement du modèle en fonctionnement",
  "landing.previewTitle": "Un aperçu en direct des pronostics actuels du modèle.",
  "landing.previewCrumb": "PodiumCall / Tableau de bord",
  "landing.previewHeading": "Les meilleurs athlètes du modèle",
  "landing.previewSub":
    "L’athlète le mieux évalué par le modèle dans chaque discipline, évaluation la plus haute en premier",
  "landing.seeAll": "Voir les {{n}} disciplines →",
  "landing.previewLoading": "Chargement des prédictions en direct…",
  "landing.footerLink": "Voir les prédictions en direct →",
  "landing.step1Title": "Extraire de vrais résultats",
  "landing.step1Body":
    "Chaque meeting de la Diamond League, plus les Jeux olympiques, les Championnats du monde, les meetings du Continental Tour Gold et les Championnats d’Europe. Le tout tiré directement de l’API de World Athletics, jamais saisi à la main.",
  "landing.step2Title": "Construire de vraies variables",
  "landing.step2Body":
    "Forme de la saison, régularité d’un meeting à l’autre, récence des sorties, rythme du calendrier, historique des confrontations directes, correction du vent : 15 en tout. Chaque candidate est depuis mesurée sur dix tirages aléatoires, face à un témoin obtenu en mélangeant les données, et écartée si elle ne le bat pas. Plusieurs l’ont été.",
  "landing.step3Title": "Valider honnêtement",
  "landing.step3Body":
    "Validation glissante sur cinq saisons indépendantes (2021-2025), en n’entraînant que sur des années strictement antérieures à l’année testée, jamais sur le futur.",
  "landing.step4Title": "Vérifier qui sera vraiment au départ",
  "landing.step4Body":
    "Les actualités et les comptes rendus de meetings sont analysés automatiquement avant tout calcul. Les athlètes signalés portent un badge de vigilance avec un lien vers la source ; les forfaits confirmés sont entièrement retirés du plateau.",
  "landing.step5Title": "Prédire en direct",
  "landing.step5Body":
    "Le modèle réévalue tout le plateau à partir de données World Athletics fraîches à chaque actualisation, jusqu’au prochain championnat.",
  "landing.spell.3": "trois",
  "landing.spell.4": "quatre",
  "landing.spell.5": "cinq",
  "landing.spell.6": "six",

  "landing.confidenceFeedLoads":
    "Les évaluations du modèle se chargeront dès que le modèle en direct tournera.",
  "landing.podiumRankedBy":
    "Classés selon l’évaluation par le modèle de la force actuelle de chaque athlète.",
  "landing.corpusMore":
    "+ {{n}} autres compétitions sur {{seasons}} saisons ({{first}}-{{last}}), extraites directement de World Athletics.",
  "landing.corpusFallback":
    "…et toutes les autres compétitions des données d’entraînement du modèle, extraites directement de World Athletics.",

  "podium.chanceOfPodium": "Chance de podium",
  "wa.ariaLabel": "World Athletics (ouvre un nouvel onglet)",
  "notFound.title": "Page introuvable",
  "notFound.body": "La page que vous cherchez n’existe pas ou a été déplacée.",
  "notFound.goHome": "Retour à l’accueil",

  // Why an athlete is not in the projected field. Mirrors api.py's
  // points_cut_reason()/build_not_in_field() so the sentence can be rebuilt
  // in the reader's language from the structured fields the API already
  // sends (reasonCode + dl), rather than translating its English prose.

  // Discipline names, keyed by discKey. Every French name has a MASCULINE
  // head noun ("le 100 m", "le saut en hauteur", "le lancer du poids"), which
  // is what keeps "pour le {{disc}}" / "du {{disc}}" grammatical across all 32.
  "disc.name.men_100m": "100 m hommes",
  "disc.name.women_100m": "100 m femmes",
  "disc.name.men_200m": "200 m hommes",
  "disc.name.women_200m": "200 m femmes",
  "disc.name.men_400m": "400 m hommes",
  "disc.name.women_400m": "400 m femmes",
  "disc.name.men_110h": "110 m haies hommes",
  "disc.name.women_100h": "100 m haies femmes",
  "disc.name.men_400h": "400 m haies hommes",
  "disc.name.women_400h": "400 m haies femmes",
  "disc.name.men_800m": "800 m hommes",
  "disc.name.women_800m": "800 m femmes",
  "disc.name.men_1500m": "1500 m hommes",
  "disc.name.women_1500m": "1500 m femmes",
  "disc.name.men_5000m": "5000 m hommes",
  "disc.name.women_5000m": "5000 m femmes",
  "disc.name.men_3000sc": "3000 m steeple hommes",
  "disc.name.women_3000sc": "3000 m steeple femmes",
  "disc.name.men_HJ": "Saut en hauteur hommes",
  "disc.name.women_HJ": "Saut en hauteur femmes",
  "disc.name.men_PV": "Saut à la perche hommes",
  "disc.name.women_PV": "Saut à la perche femmes",
  "disc.name.men_LJ": "Saut en longueur hommes",
  "disc.name.women_LJ": "Saut en longueur femmes",
  "disc.name.men_TJ": "Triple saut hommes",
  "disc.name.women_TJ": "Triple saut femmes",
  "disc.name.men_SP": "Lancer du poids hommes",
  "disc.name.women_SP": "Lancer du poids femmes",
  "disc.name.men_DT": "Lancer du disque hommes",
  "disc.name.women_DT": "Lancer du disque femmes",
  "disc.name.men_JT": "Lancer du javelot hommes",
  "disc.name.women_JT": "Lancer du javelot femmes",

  "podium.strongestCall": "Le plus sûr",
  "podium.sb": "MPS {{mark}}",

  "ath.photoCredit": "Photo : {{author}} · {{license}}",
  "ath.photoCreditTitle": "Photo de {{author}}, {{license}}, via {{source}}. Ouvre la source.",

  // Welcome modal
  "welcome.eyebrow": "PodiumCall",
  "welcome.title": "Les meilleurs mondiaux, vus par le modèle.",
  "welcome.intro":
    "PodiumCall classe les meilleurs athlètes de chaque épreuve à partir de vraies données World Athletics — selon les points marqués, et selon l’évaluation du modèle, apprise sur huit ans de vraies finales de championnat. À venir : le Championnat Ultimate à Budapest.",
  "welcome.point1":
    "Chaque chiffre est une vraie statistique extraite de World Athletics. Rien n’est saisi à la main ni inventé.",
  "welcome.point2":
    "Parcourez le top 20 par épreuve sous Piste et Concours, suivez la montée en puissance sous Ultimate, ou ouvrez la fiche d’un athlète pour ses résultats, ses confrontations directes et ses records.",
  "welcome.point3":
    "Touchez le petit ⓘ à côté d’une statistique pour lire exactement ce qu’elle signifie.",
  "welcome.howItWorks": "Comment ça marche, en détail →",
  "welcome.explore": "Explorer le tableau",
  "welcome.about": "À propos",

  // Titres d’onglet.
  "seo.landing": "Les meilleurs mondiaux, vus par le modèle",
  "seo.ultimate": "Championnat Ultimate",
};
