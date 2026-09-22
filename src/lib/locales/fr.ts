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
  "nav.asianGames": "Jeux asiatiques",
  "nav.championship": "Championnat",
  "results.meet.asianGames": "Jeux asiatiques 2026",
  "nav.stats": "Performances",
  "nav.schedule": "Calendrier",
  "nav.results": "Résultats",
  "results.title": "Ce que les derniers pronostics ont donné",
  "results.eyebrow": "Le bilan du modèle",
  "results.description":
    "Chaque championnat pronostiqué à l’avance, avec le pronostic figé avant la réunion et le résultat qui a suivi. Rien n’a été réécrit après coup.",
  "results.meet.dlFinal": "Finale de la Diamond League 2026",
  "results.meet.ultimate": "Championnat Ultimate 2026",
  "results.eventsWord": "{{n}} épreuves",
  "results.eventsSoFar": "{{done}} épreuves sur {{n}} pour l’instant",
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
  "championship.stat.daysTo": "Jours avant {{city}}",
  "championship.chip.days": "J-{{n}} avant {{city}}",
  "championship.chip.dayOne": "J-1 avant {{city}}",
  "championship.chip.live": "En direct de {{city}}",
  "championship.chip.done": "{{city}}, c’est terminé",
  "championship.projection.titlePoints": "Classement aux points · {{disc}}",
  "championship.projection.subtitle": "{{n}} athlètes inscrits, {{ranked}} classés ci-dessous.",
  "championship.projection.whyTooFew":
    "Seuls {{n}} athlètes inscrits ici ont une marque que le modèle peut lire. Il lui en faut {{needed}} pour pronostiquer une épreuve : celle-ci est donc classée aux points.",
  "championship.projection.colMark": "Meilleure marque",
  "championship.projection.markHint":
    "La meilleure marque de l’athlète dans cette épreuve en 2026, d’après le bilan asiatique de World Athletics ou son propre profil World Athletics. Un athlète sans marque en 2026 est jugé sur sa meilleure marque de 2025, signalée 2025.",
  "championship.projection.markSeason": "Marque de {{year}}",
  "championship.projection.oldMarks":
    "Cette saison, plus {{percent}} % d'une meilleure marque de {{year}}",
  "championship.projection.colPoints": "Points",
  "championship.projection.pointsHint":
    "Les points World Athletics de la meilleure marque affichée. Plus de points signifie une meilleure marque. Cette colonne est un classement, pas un pronostic.",
  "championship.projection.chanceHint":
    "La probabilité, selon le modèle, que cet athlète finisse dans les trois premiers. La colonne totalise 300 sur l’ensemble des engagés, et non 100 : cent par médaille.",
  "championship.projection.colWin": "Chance de victoire",
  "championship.projection.winHint":
    "La probabilité, selon le modèle, que cet athlète gagne. La colonne totalise 100 sur l’ensemble des engagés.",
  "championship.projection.unrankedTitle": "Engagés, non classés ({{n}})",
  "championship.projection.unrankedHint":
    "Ces athlètes figurent sur la liste des engagés des organisateurs, mais nous n’avons trouvé aucune marque pour les classer. Chaque ligne en donne la raison. Ils n’occupent aucune place dans l’ordre ci-dessus.",
  "championship.projection.unranked.notFound":
    "Aucun profil World Athletics ne correspond à cette inscription",
  "championship.projection.unranked.noMark":
    "Aucun résultat en 2026 dans cette épreuve, et absent du bilan asiatique 2025",
  "championship.projection.unranked.lookupFailed":
    "World Athletics n’a pas répondu lors de notre vérification",
  "championship.projection.unranked.notScored":
    "A une marque, mais le modèle n’a pas pu la rattacher au dossier de l’athlète",
  "championship.projection.unscored":
    "Inscrits, sans marque 2026 trouvée dans cette épreuve : {{names}}.",
  "championship.projection.noteModel":
    "La liste des inscrits est celle des organisateurs. L’ordre et les probabilités sont ceux du modèle.",
  "championship.projection.notePoints":
    "La liste des inscrits est celle des organisateurs. L’ordre suit les points World Athletics de la meilleure marque de chacun : ce n’est pas un pronostic.",
  "championship.projection.byModel": "pronostic du modèle",
  "championship.projection.captionModel":
    "Tous les inscrits du {{disc}} ayant une marque en 2026 ou en 2025, classés selon leur chance de podium",
  "championship.projection.captionPoints":
    "Tous les inscrits du {{disc}} ayant une marque en 2026 ou en 2025, classés selon leurs points World Athletics",
  "asianGames.title": "Les Jeux asiatiques",
  "asianGames.hero.headline": "Le meilleur de l’Asie, à {{city}}.",
  "asianGames.hero.body":
    "Athlétisme, {{dates}}, au {{venue}}. {{entrants}} athlètes de {{federations}} pays sont inscrits.",
  "asianGames.hero.bodyBare": "Athlétisme, {{dates}}, au {{venue}}.",
  "asianGames.split.aria":
    "{{model}} épreuves pronostiquées par le modèle, {{points}} classées aux points, {{none}} sans pronostic",
  "asianGames.split.model": "par le modèle",
  "asianGames.split.points": "aux points",
  "asianGames.split.none": "sans pronostic",
  "asianGames.how.title": "Comment chaque épreuve est pronostiquée",
  "asianGames.how.field":
    "Le plateau est la liste officielle des inscrits, publiée par les organisateurs : personne n’y figure au hasard.",
  "asianGames.how.model":
    "Toutes les épreuves sont pronostiquées par un seul modèle, qui compare chaque athlète aux autres engagés. La saison en cours compte en entier, et c’est elle qui pèse le plus : la moyenne de ses cinq meilleures marques, sa forme sur les six dernières semaines, ses podiums dans les grands meetings comme la Diamond League et son bilan face aux engagés les plus forts dans les finales qu’ils ont disputées ensemble. Une marque plus ancienne ne compte que si elle dépasse encore ce qu’il a fait cette année, compte de moins en moins avec les années, et jamais assez pour le placer devant un athlète plus rapide cette saison.",
  "asianGames.how.testHeld":
    "Nous l’avons testé sur les {{finals}} finales de championnats de {{from}} et {{to}}, mises de côté pendant sa construction, chaque année pronostiquée uniquement à partir des années précédentes. Il a désigné {{model}} % des médaillés, contre {{previous}} % pour le modèle qu’il remplace et {{points}} % pour un classement aux points World Athletics. Sur les {{asiaFinals}} finales asiatiques, il en a désigné {{asiaModel}} %, contre {{asiaPrevious}} % pour l’ancien modèle, mais un classement aux points en a désigné {{asiaPoints}} %.",
  "asianGames.how.testOldMarks":
    "Nous avons essayé {{versions}} façons de compter les marques anciennes sur les {{finals}} finales de championnat de {{from}} à {{to}}, en pronostiquant chaque saison uniquement à partir des saisons précédentes, et gardé la plus juste qui respecte cette règle. Elle a désigné {{model}} % des médaillés, contre {{previous}} % pour le modèle qu’elle remplace, qui laissait une vieille marque peser plus que la saison en cours, et {{points}} % pour un classement aux points World Athletics. Sur les {{asiaFinals}} finales asiatiques, elle en a désigné {{asiaModel}} %, contre {{asiaPoints}} % pour les points. Ces mêmes saisons ont servi à la choisir : les Jeux asiatiques seront son premier vrai test.",
  "asianGames.how.testAllSeasons":
    "Nous avons testé {{versions}} versions du modèle sur les {{finals}} finales de championnat de {{from}} à {{to}}, en pronostiquant chaque saison uniquement à partir des saisons précédentes, et gardé celle qui a désigné le plus de médaillés : {{model}} %, contre {{points}} % pour un classement aux points World Athletics. Sur les {{asiaFinals}} finales asiatiques, elle en a désigné {{asiaModel}} %, contre {{asiaPoints}} % pour les points. Ces mêmes saisons ont servi à la choisir : les Jeux asiatiques seront son premier vrai test.",
  "asianGames.how.test":
    "Nous l’avons testé sur {{finals}} finales de championnats passées, de {{from}} à {{to}}. Il a désigné {{model}} % des médaillés, contre {{points}} % pour un simple classement aux points World Athletics : à peu près autant, pas mieux. Sur les {{asiaFinals}} finales asiatiques, il en a désigné {{asiaModel}} %, contre {{asiaPoints}} % pour les points.",
  "asianGames.field.pending":
    "Le pronostic n’est pas encore prêt. Le plateau et le pronostic apparaîtront ici.",
  "asianGames.notCalled.title": "Épreuves sans pronostic",
  "asianGames.notCalled.subtitle":
    "{{n}} épreuves du programme n’ont pas de pronostic. Voici pourquoi.",
  "asianGames.notCalled.relay": "Relais",
  "asianGames.notCalled.relayNote":
    "Le modèle lit des athlètes individuels. Une équipe de relais n’a pas d’historique propre.",
  "asianGames.notCalled.noData": "Pas de données",
  "asianGames.notCalled.noDataNote":
    "Nous n’avons ni bilan, ni historique de résultats, ni modèle pour ces épreuves.",
  "asianGames.notCalled.noEntries": "Aucun inscrit",
  "asianGames.notCalled.noEntriesNote":
    "La liste des inscrits ne compte aucun athlète dans ces épreuves.",
  "asianGames.notCalled.entrants": "{{n}} inscrits",
  "asianGames.eventLabel": "{{event}} {{sex}}",
  "asianGames.sex.M": "hommes",
  "asianGames.sex.W": "femmes",
  "asianGames.sex.X": "mixte",
  "asianGames.event.10000M": "10 000 m",
  "asianGames.event.MARATHON": "Marathon",
  "asianGames.event.HAMMER": "Lancer du marteau",
  "asianGames.event.DECATH": "Décathlon",
  "asianGames.event.HEPTATH": "Heptathlon",
  "asianGames.event.WALKHM": "Semi-marathon marche",
  "asianGames.event.WALKM": "Marathon marche",
  "asianGames.event.4X100M": "Relais 4 × 100 m",
  "asianGames.event.4X400M": "Relais 4 × 400 m",
  "nagoya.cover.edition": "20es Jeux asiatiques",
  "nagoya.countdown.startsIn": "Avant le premier jour d’athlétisme",
  "nagoya.countdown.days": "jours",
  "nagoya.countdown.hours": "heures",
  "nagoya.countdown.minutes": "minutes",
  "nagoya.countdown.seconds": "secondes",
  "nagoya.countdown.aria":
    "{{days}} jours, {{hours}} heures et {{minutes}} minutes avant le premier jour d’athlétisme",
  "nagoya.countdown.dayOf": "Jour {{n}} sur {{total}}",
  "nagoya.countdown.over": "Les Jeux sont terminés",
  "nagoya.glance.title": "Le pronostic en un coup d’œil",
  "nagoya.glance.lede":
    "Le favori de chaque épreuve pronostiquée, et sa chance de finir dans les trois premiers. Choisissez une épreuve pour voir tous ses engagés.",
  "nagoya.glance.onPoints": "points World Athletics, pas un pronostic",
  "nagoya.glance.next": "Puis {{names}}",
  "nagoya.glance.openTable": "Voir tout le plateau",
  "nagoya.glance.pagePrev": "Épreuves précédentes",
  "nagoya.glance.pageNext": "Épreuves suivantes",
  "nagoya.glance.stripLabel": "{{group}} : le favori de chaque épreuve",
  "nagoya.field.title": "Tous les engagés, épreuve par épreuve",
  "nagoya.field.lede":
    "Choisissez une épreuve. Le tableau reprend tous les inscrits de la liste officielle des organisateurs, dans l’ordre du pronostic.",
  "nagoya.foot.title": "Chaque finale est notée sur la page Résultats",
  "nagoya.foot.body":
    "Le pronostic a été figé avant la première session et ne changera plus. Après chaque finale, il est placé à côté du vrai résultat.",
  "nagoya.foot.cta": "Ouvrir la page Résultats",
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
  "country.backToStats": "← Retour à l’indice de performance",
  "country.athletes": "Athlètes",
  "country.disciplines": "Épreuves",
  "country.bestScore": "Meilleur score",
  "country.lede": "{{athletes}} dans {{events}} cette saison.",
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
  "country.athletesNoteEntered":
    "{{n}} classés cette saison, les meilleurs en premier, puis les athlètes engagés au championnat qui n’ont aucun résultat cette saison.",
  "country.athletesNoteEnteredOnly": "Engagés au championnat, sans résultat cette saison.",
  "country.noResultThisSeason": "Aucun résultat dans cette épreuve cette saison",
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
  "search.countryHint": "{{athletes}} · {{events}}",

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
  "common.rankedAthleteOne": "1 athlète classé",
  "common.rankedAthleteMany": "{{n}} athlètes classés",
  "common.eventOne": "1 épreuve",
  "common.eventMany": "{{n}} épreuves",
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
    "L’athlète que le modèle évalue le mieux dans chaque épreuve. Il pèse toute la saison : ce n’est donc pas toujours celui qui a la meilleure marque.",
  "dashboard.favourites.cta": "Tous les classements",
  "dashboard.favourites.prev": "Favoris précédents",
  "dashboard.favourites.next": "Favoris suivants",
  "dashboard.favourites.stripLabel":
    "Le favori de chaque épreuve, de la meilleure évaluation à la plus basse",
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
  "dashboard.stat.hitRateHintChampionship":
    "À quelle fréquence le top trois du modèle a correspondu aux vrais médaillés, sur {{finals}} finales de championnat passées de {{from}} à {{to}}, chaque saison pronostiquée uniquement à partir des saisons précédentes. Ces mêmes saisons ont servi à choisir le modèle : ce championnat est donc son premier vrai test.",
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
    "Aucun titre sur une blessure ou un forfait ne concerne un athlète que nous suivons.",
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
    "Les meilleurs mondiaux dans chaque épreuve de piste. Choisissez une discipline, puis classez-la par points World Athletics, ou selon l’évaluation du modèle qui pronostique les championnats.",
  "field.title": "Épreuves de concours",
  "field.eyebrow": "{{n}} disciplines de concours",
  "field.description":
    "Les meilleurs mondiaux dans chaque épreuve de concours. Choisissez une discipline, puis classez-la par points World Athletics, ou selon l’évaluation du modèle qui pronostique les championnats.",

  // Tables de classement mondial piste/concours (bascule points / modèle)
  "rankings.loading": "Classement mondial",
  "rankings.discipline": "Discipline",
  "rankings.panelTitle": "Top 20 · {{label}}",
  "rankings.caption":
    "Le top 20 du {{label}} : marque, points World Athletics, meetings relevés et évaluation du modèle",
  "rankings.subtitle.points":
    "Classé selon les points World Athletics — le score de la meilleure performance de la saison. Aucun modèle ici.",
  "rankings.subtitle.pointsOnly":
    "Classé selon les points World Athletics, le score de la meilleure performance de la saison. Cette épreuve n’a pas d’évaluation du modèle : le modèle n’a pas pu lire assez de saisons de ces athlètes.",
  "rankings.subtitle.model":
    "Classé selon l’évaluation du modèle, celui qui pronostique les championnats. Il lit ces 20 athlètes comme s’ils disputaient une même finale et évalue la probabilité pour chacun de finir dans les trois premiers. Il juge d’abord la saison en cours : la moyenne des cinq meilleures marques de chaque athlète, sa forme récente, ses podiums dans les grands meetings et son bilan face aux plus forts. Une marque plus ancienne ne compte que si elle dépasse encore sa saison, et de moins en moins avec les années.",
  "rankings.toggle.label": "Méthode de classement",
  "rankings.toggle.model": "Évaluation du modèle",
  "rankings.toggle.points": "Par points",
  "rankings.colMark": "Marque",
  "rankings.colPoints": "Points",
  "rankings.colRating": "Évaluation du modèle",
  "rankings.colMeets": "Meetings",
  "rankings.meetsOne": "1 meeting",
  "rankings.meetsMany": "{{n}} meetings",
  "rankings.pointsHint":
    "Le score de performance World Athletics pour la meilleure marque de la saison.",
  "rankings.ratingHint":
    "La lecture que fait le modèle de cet athlète face au reste de ces 20 : la probabilité qu’il finisse dans les trois premiers si ces 20 athlètes disputaient une même finale. Les 20 évaluations d’une épreuve totalisent 300 : une évaluation se compare donc à celle de n’importe quelle autre épreuve. On parle d’évaluation, pas de chance de podium, car ces athlètes ne sont pas tous engagés dans une même compétition.",
  "rankings.meetsHint":
    "Meetings où nous pouvons voir cet athlète disputer cette épreuve en 2026, d’après la liste de la saison, le journal de la Diamond League, le journal élargi des courses et les résultats World Athletics de l’athlète quand nous les détenons. C’est un minimum, pas un relevé complet : un 1 signifie un meeting visible, pas forcément un seul disputé. À lire à côté de l’évaluation du modèle, car une évaluation bâtie sur une seule sortie repose sur moins qu’une évaluation bâtie sur une saison.",

  // Discipline table (shared by Track and Field)
  "table.subtitle.rank":
    "Classé par meilleure performance de la saison, la meilleure marque de chaque athlète cette année. La chance de podium est l’estimation propre du modèle et peut différer de ce classement.",
  "table.subtitle.prob":
    "Classé par chance de podium selon le modèle. La colonne # compte toujours par meilleure performance de la saison, ses numéros semblent donc en désordre ici.",
  "table.projectedTop": "Top {{n}} projeté · {{label}}",
  "table.howLevel": "Ce plateau est-il serré ?",
  "table.caption":
    "Plateau projeté du {{label}} : rang à la meilleure performance de la saison, athlète, nationalité, performance et chance de podium",
  "table.slideHint": "Faites glisser le tableau pour voir toutes les colonnes.",
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
  "table.resultRanked": "Classé {{rank}} aux points",
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
  "schedule.eyebrowNext": "J-{{n}} avant {{city}}",
  "schedule.eyebrowNextOne": "J-1 avant {{city}}",
  "schedule.figNext": "Prochain championnat",
  "schedule.figSeasonRun": "Meetings DL disputés",
  "schedule.upcoming.title": "Prochain championnat",
  "schedule.upcoming.when": "{{dates}} · {{venue}}, {{city}}",
  "schedule.upcoming.cta": "Voir le plateau",
  "schedule.season.title": "La saison 2026",
  "schedule.season.subtitle":
    "La saison de la Diamond League, avec chaque meeting évalué et la finale disputée.",
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
    " points. Cet écart couvre tous les athlètes classés par World Athletics dans l’épreuve, ce qui est une autre question que de savoir à quel point les tout meilleurs sont proches, et la page de chaque épreuve y répond.",

  // How it works (inline emphasis uses **bold** / *italic*, see lib/rich-text)
  "howItWorks.eyebrow": "À propos du modèle",
  "howItWorks.description":
    "PodiumCall pronostique le podium des grands championnats d’athlétisme et évalue les meilleurs mondiaux de chaque épreuve, à partir de vrais résultats World Athletics. Voici ce que veulent dire les chiffres, ce que regarde le modèle, et ce qu’il vaut.",
  "howItWorks.s1.title": "Ce que veulent dire les chiffres",
  "howItWorks.s1.p1":
    "Lors d’un championnat, le modèle donne à chaque athlète engagé dans une épreuve sa chance de finir **dans le top trois**. Il donne aussi sa chance de **gagner**, qui montre si un favori se détache ou s’il fait partie de plusieurs noms proches.",
  "howItWorks.s1.world":
    "Les chances de podium ne sont données que pour une vraie compétition, où les athlètes sont réellement engagés. Sur les pages Piste, Concours, chaque page d’épreuve, le tableau de bord et les pages d’athlète, le chiffre est plutôt **l’évaluation du modèle**. Le même modèle lit les 20 meilleurs mondiaux de chaque épreuve comme s’ils disputaient une même finale, et évalue la probabilité pour chacun de finir dans les trois premiers. Les 20 évaluations totalisent 300 : 60 % au 100 m veut donc dire la même chose que 60 % au lancer du poids.",
  "howItWorks.s1.p2":
    "Le top trois passe en premier, et c’est voulu. Le jour J, l’athlète le plus rapide peut faire un faux départ, se faire enfermer ou être repris sur la ligne, si bien que le vainqueur exact se joue souvent entre trois ou quatre noms. Savoir qui monte sur le podium est une question plus juste, et que l’on peut vérifier face au résultat ensuite. La chance de victoire dit à quel point la course est ouverte, pas qui va gagner.",
  "howItWorks.s2.title": "Ce que regarde le modèle",
  "howItWorks.s2.p1":
    "Un seul modèle fait tous les pronostics du site. Il compare chaque athlète **uniquement aux autres athlètes de la même finale**. Il a appris le poids de chaque élément sur de vraies finales depuis 2009 : Jeux olympiques, Championnats du monde, championnats continentaux, Jeux asiatiques et finales de Diamond League.",
  "howItWorks.s2.p2":
    "**La saison en cours compte le plus, et en entier** : la moyenne des cinq meilleures marques de l’athlète, sa forme sur les six dernières semaines, ses podiums dans les grands meetings et son bilan face aux engagés les plus forts dans les finales disputées ensemble. **Une marque plus ancienne ne compte que si elle dépasse encore la saison en cours.** Elle compte de moins en moins avec les années, et jamais assez pour placer un athlète devant un autre plus rapide cette saison : une saison record n’est jamais effacée par une grosse marque d’il y a deux ans.",
  "howItWorks.s3.title": "Ce qu’il vaut",
  "howItWorks.s3.test":
    "Pour le tester, nous avons essayé **{{versions}} façons de compter les marques anciennes** sur {{finals}} finales de championnat de {{from}} à {{to}}, en pronostiquant chaque saison uniquement à partir des saisons précédentes, et gardé la plus juste qui respecte cette règle. Il a désigné **{{model}} % des médaillés**, contre {{points}} % pour un classement aux points World Athletics. Ces mêmes saisons ont servi à le choisir : le championnat qu’il pronostique aujourd’hui est donc son premier vrai test.",
  "howItWorks.s3.compare":
    "Jusqu’en septembre 2026, les pages Piste, Concours et les pages d’épreuve utilisaient un modèle plus ancien, conçu pour la Diamond League. Nous avons soumis les deux modèles aux mêmes **{{finals}} finales, de {{from}} à {{to}}**. Celui-ci a désigné **{{model}} % des médaillés**, l’ancien {{previous}} %. Sur les seuls Jeux olympiques, Championnats du monde et Championnats d’Europe, les chiffres sont de {{champModel}} % et {{champPrevious}} %. Les deux modèles avaient été réglés sur ces saisons : la comparaison est donc équitable entre eux, mais ce n’est pas un test sur des finales qu’aucun n’avait vues.",
  "howItWorks.s3.withdrawals":
    "Aucun de ces chiffres ne dit qui sera au départ. Chaque finale des deux tests n’est calculée que sur des athlètes réellement alignés : ils mesurent la capacité du modèle à classer un plateau, pas à deviner qui le composera. Les blessures et les forfaits de dernière minute sont une autre question, et ce sont les signalements affichés sur le pronostic qui y répondent.",
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
    "Il donne **des chances, pas des certitudes**. Un favori avec 60 % de chances de victoire perd encore quatre fois sur dix, et le modèle ne prétend jamais connaître le 1-2-3 exact.",
  "howItWorks.s5.b3":
    "Il n’est **pas affilié à World Athletics** ni à la Wanda Diamond League. Il se contente de lire leurs données publiques.",
  "howItWorks.s6.title": "Rechercher par pays",
  "howItWorks.s6.p1":
    "La recherche trouve **les pays autant que les athlètes**. Tapez une nation — « Jamaïque », « KEN », « Norvège » — et elle apparaît dans les résultats à côté des athlètes dont le nom correspond, avec le nombre d’athlètes classés et d’épreuves de cette nation cette saison.",
  "howItWorks.s6.p2":
    "En ouvrir une donne à cette nation sa propre page : tous ses athlètes classés, leurs marques et leurs scores, ses trois meilleures performances de la saison, et ses athlètes au championnat en cours. La page porte les couleurs du pays, tirées de son drapeau.",
  "howItWorks.next.title": "La suite",
  "howItWorks.next.upcoming1":
    "**{{name}}** : {{dates}}, à {{city}}. Le pronostic de chaque épreuve a été fait avant la première session et ne changera plus.",
  "howItWorks.next.upcoming2":
    "Chaque finale rejoint la page Résultats une fois disputée, à côté du pronostic : on voit ce que le modèle a vu juste et ce qu’il a manqué.",
  "howItWorks.next.upcoming3":
    "Une fois la dernière finale disputée, le taux de réussite du pronostic rejoint celui des championnats précédents sur la page Résultats.",
  "howItWorks.next.done1":
    "Chaque finale des **{{name}}** est notée sur la page Résultats, à côté du pronostic fait avant elle.",
  "howItWorks.next.done2":
    "Le pronostic du prochain championnat sera publié sur sa page dès que sa liste des engagés le sera.",
  "howItWorks.close.title": "Le pronostic est fait. **Reste à le voir se jouer.**",
  "howItWorks.close.lede":
    "Suivez le pronostic épreuve par épreuve, et dites-nous ce que vous aimeriez voir sur le site.",
  "howItWorks.close.call": "Voir le pronostic",

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
    "Discipline contre discipline · top {{n}} mondial, plus serré que {{wider}} des {{of}} finales",
  "disc.eyebrowBare": "Discipline contre discipline",
  "disc.description":
    "Une épreuve lue comme un plateau et non comme une liste. Le plateau est l’élite mondiale aux points World Athletics, autant d’athlètes qu’une finale de ce type. Est-ce serré de bout en bout, ou un athlète se détache-t-il du reste ?",
  "disc.whyScore":
    "Ceci utilise les points World Athletics, pas les évaluations du modèle. Dans chaque épreuve, le top 20 se partage le même total d’évaluations : une évaluation montre donc qui mène une épreuve, mais pas à quel point ses athlètes sont proches. Un score en points le montre, car chaque marque est cotée de la même façon.",
  "disc.depthSkeleton": "Densité du plateau",
  "disc.seasonForm": "Forme réelle de la saison · {{disc}}",
  "disc.seasonFormSubtitle":
    "Chaque performance réellement enregistrée par les prétendants cette saison, sur un vrai calendrier. Ce n’est pas une tendance lissée : les points sont les meetings où ils se sont présentés.",
  "disc.depthTitle": "Densité du plateau",
  "disc.depthNeeds": "Nécessite un score World Athletics pour au moins deux athlètes du plateau.",
  "disc.depthNotEnough":
    "Trop peu d’athlètes de ce plateau ont un score World Athletics cette saison pour mesurer son homogénéité. Rien n’est estimé à la place.",
  "disc.levelTitle": "L’homogénéité de ce plateau",
  "disc.levelSubtitle":
    "Le meilleur score de la saison de chacun des {{n}} premiers mondiaux, du plus fort au plus faible. L’écart entre les deux extrémités est comparé aux plateaux de {{of}} finales de Diamond League de cette saison.",
  "disc.verdict.level.label": "PLATEAU HOMOGÈNE",
  "disc.verdict.level.basis": "aussi serré que le tiers le plus serré des {{of}} finales",
  "disc.verdict.mixed.label": "DEUX GROUPES",
  "disc.verdict.mixed.basis": "au niveau du tiers intermédiaire des {{of}} finales",
  "disc.verdict.topHeavy.label": "UN SEUL ET LE VIDE",
  "disc.verdict.topHeavy.basis": "aussi large que le tiers le plus large des {{of}} finales",
  "disc.spreadSentenceMid": " points séparent ",
  "disc.spreadSentenceDown": " du plus faible des ",
  "disc.spreadSentenceEnd": " athlètes cotés.",
  "disc.statSpread": "Écart sur le plateau",
  "disc.statSpreadValue": "{{n}} pts",
  "disc.statSpreadNote": "plus serré que {{wider}} des {{of}} finales",
  "disc.statSpreadHint":
    "L’écart de points entre le plus fort et le plus faible des {{size}} premiers mondiaux. Un petit écart signifie un plateau serré et homogène ; un grand écart, un leader nettement devant.",
  "disc.statStrongest": "Le plus fort cette saison",
  "disc.statMedian": "Médiane du top 100 mondial",
  "disc.statMedianNoScore": "non coté cette saison",
  "disc.statMedianClear": "le plus fort a {{n}} d’avance",
  "disc.statMedianHint":
    "Le score du milieu parmi les 100 meilleurs mondiaux de l’épreuve cette année. Il montre à quelle hauteur les {{size}} premiers se situent face au reste du monde.",
  "disc.statScored": "Plateau coté",
  "disc.statScoredEvery": "tous, sans exception",
  "disc.statScoredSome": "certains n’ont aucun score cette saison",
  "disc.statScoredHint":
    "Combien des {{size}} premiers mondiaux ont un score World Athletics cette saison. Rien n’est estimé pour ceux qui n’en ont pas.",
  "disc.disagreeTitle": "Là où le modèle diverge des performances",
  "disc.disagreeSubtitle":
    "L’évaluation du modèle à côté du score de la saison de chaque athlète, pour les mêmes {{n}} athlètes. C’est l’évaluation affichée sur les pages Piste et Concours, parmi les 20 meilleurs mondiaux.",
  "disc.disagreeSubtitleModel":
    "Les mêmes {{n}} athlètes, classés cette fois selon l’évaluation du modèle plutôt que selon leur score de la saison. Un athlète qui monte ou descend nettement est un athlète sur lequel les deux mesures ne s’accordent pas.",
  "disc.disagreeToggleLabel": "Classer cette liste par",
  "disc.disagreeByPoints": "Score de la saison",
  "disc.disagreeByModel": "Évaluation du modèle",
  "disc.disagreeColScore": "Score",
  "disc.disagreeColRating": "Éval.",
  "disc.disagreeNote":
    "L’évaluation est la lecture que fait le modèle de chaque athlète face au reste des 20 meilleurs mondiaux de l’épreuve : la probabilité qu’il finisse dans les trois premiers si ces 20 athlètes disputaient une même finale. C’est la même évaluation que sur les pages Piste et Concours, et pas une chance de victoire. Le modèle juge d’abord la saison en cours, et une marque plus ancienne compte de moins en moins avec les années.",

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
    "Une case vide signifie qu’il n’y a réellement jamais eu de confrontation {{verb}} entre ces deux athlètes : elle reste vide plutôt que d’afficher un 0–0 trompeur. La colonne « face à ce plateau » totalise le bilan de chaque athlète face à ce plateau uniquement, ce qui n’est pas son taux de victoire global : un athlète peut battre tous les autres et rester derrière les athlètes de cette grille.",
  "fa.neverMet": "{{a}} et {{b}} : aucune confrontation {{verb}}",

  "fa.noResults": "aucun résultat",

  "traj.excludedOne":
    "{{names}} n’a encore aucune donnée de meeting {{year}} enregistrée. Voir sa fiche pour sa saison la plus récente.",
  "traj.excludedMany":
    "{{names}} n’ont encore aucune donnée de meeting {{year}} enregistrée. Voir leur fiche pour leur saison la plus récente.",

  // Athlete analytics
  "aa.recordTitle": "Bilan en compétition",
  "aa.recordSubtitle":
    "Toutes les finales enregistrées : {{n}} {{noun}} sur {{seasons}} {{seasonWord}}. Une meilleure performance de la saison n’est qu’un résultat ; voici le niveau tenu le reste du temps.",
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
  "aa.h2hNote":
    "Trié par nombre de rencontres, pas par bilan, car ce sont les rivalités les plus fournies qui en disent le plus. Les défaites sont montrées aussi clairement que les victoires.",
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

  "disc.spreadCaption": "Le score World Athletics de chaque athlète",
  "disc.spreadNote":
    "L’or marque le meilleur score du plateau. Des points regroupés signalent un plateau homogène ; un point isolé signifie que quelqu’un se détache du reste.",

  "fa.vsThisField": "face à ce plateau",

  // Athlete profile
  "ath.backToTrack": "← Retour aux épreuves de piste",
  "ath.backToField": "← Retour aux épreuves de concours",
  "ath.dossier": "Fiche athlète · {{disc}}",
  "ath.age": "{{n}} ans",
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
  "ath.champ.subtitle": "Engagé dans cette épreuve",
  "ath.champ.points":
    "{{rank}} sur {{n}} engagés classés selon les points World Athletics ({{score}}). Cette épreuve est pronostiquée aux points, pas par le modèle.",
  "ath.champ.model":
    "{{rank}} choix du modèle sur {{n}} engagés classés, avec {{chance}} % de chances de podium.",
  "ath.champ.modelWin":
    "{{rank}} choix du modèle sur {{n}} engagés classés, avec {{chance}} % de chances de podium et {{win}} % de chances de victoire.",
  "ath.champ.oldMarks":
    "Jugé sur ses marques de cette saison, plus {{percent}} % d'une meilleure marque de {{year}}.",
  "ath.champ.seasonOnly":
    "Jugé uniquement sur ses marques de cette saison : rien de plus ancien ne les dépasse.",
  "ath.champ.seasonOnlyPb":
    "Jugé uniquement sur ses marques de cette saison, avec un record personnel.",
  "ath.champ.link": "Voir le pronostic de chaque épreuve",
  "ath.seasonBest2026": "Meilleure perf. 2026",
  "ath.seasonBestIn": "Meilleure perf. {{year}}",
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
  "ath.realSeasonForm": "Forme réelle de la saison",
  "ath.seasonFormAll":
    "Toutes les compétitions disputées cette saison — {{n}} au total — en salle comme en plein air, pas seulement la Diamond League. Le palmarès ci-dessous ne compte que les finales, d’où des totaux différents.",
  "ath.seasonFormAllIn":
    "Toutes les compétitions disputées en {{year}}, sa dernière saison connue : {{n}} au total, en salle comme en plein air, pas seulement la Diamond League. Le palmarès ci-dessous ne compte que les finales, d’où des totaux différents.",
  "ath.seasonFormCondensedIn":
    "Sa meilleure performance de chaque mois en {{year}}, sa dernière saison connue. {{n}} courses, trop pour les afficher une à une : chaque mois disputé est représenté par son meilleur résultat.",
  "ath.seasonFormCondensed":
    "Sa meilleure performance de chaque mois. {{n}} courses cette saison, trop pour les afficher une à une : chaque mois disputé est représenté par son meilleur résultat.",
  "ath.h2hTitle": "Bilan des confrontations directes",
  "ath.h2hSubtitle":
    "Confrontations réelles avec les athlètes qualifiés pour la finale de la Diamond League cette année, d’après les résultats World Athletics.",
  "ath.h2hOpponents": "finalistes de la Diamond League cette année",
  "ath.figSeasonBest": "Meilleure perf. saison",
  "ath.figPersonalBest": "Record personnel",
  "ath.figRacesIn": "Courses en {{year}}",
  "ath.model": "Modèle PodiumCall",
  "ath.modelRating": "Évaluation du modèle",
  "ath.modelBefore":
    " % d’évaluation du modèle : sa lecture de cet athlète face au reste des 20 meilleurs mondiaux de l’épreuve, soit la probabilité de finir dans les trois premiers si ces 20 athlètes disputaient une même finale. C’est la même évaluation que sur les pages Piste, Concours et sur la page de l’épreuve.",
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
  "ath.onDlPointOne": "{{rank}} avec 1 point DL",
  "ath.noHistoryYear": "Aucun résultat de meeting en {{year}} pour cet athlète.",
  "ath.noHistoryRecent": "Aucun résultat de meeting récent pour cet athlète.",
  "ath.noHistoryPrior": "Aucun résultat de meeting de la saison précédente pour cet athlète.",
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
  "landing.hero.lineA": "Le pronostic",
  "landing.hero.everyEvent": "de chaque épreuve",
  "landing.hero.srTitle": "Le pronostic du podium de chaque épreuve, avant le départ.",
  "landing.hero.lede":
    "Avant le départ, un modèle entraîné sur de vrais résultats World Athletics désigne les favoris des {{n}} épreuves.",
  "landing.hero.favourite": "Favori",
  "landing.hero.pause": "Mettre en pause le titre qui change",
  "landing.hero.play": "Reprendre le titre qui change",
  "landing.numbers.title": "Bâti sur de **vrais résultats**",
  "landing.numbers.lede":
    "Chaque chiffre du site vient des données World Athletics, et le modèle est testé sur des finales déjà disputées.",
  "landing.numbers.hitRate": "des médaillés désignés sur des finales de championnat passées",
  "landing.numbers.finals": "finales de championnat testées, de {{from}} à {{to}}",
  "landing.numbers.events": "épreuves évaluées",
  "landing.walkthrough.title": "Vous découvrez **PodiumCall** ?",
  "landing.walkthrough.lede":
    "Une vidéo d’une minute montre ce que fait le site et où trouver chaque pronostic.",
  "landing.features.title": "Toute la saison, **lue par le modèle**",
  "landing.features.lede":
    "Choisissez une page pour la voir. Tout est en direct, et tout vient des mêmes données.",
  "landing.features.dashboard.title": "Le tableau de bord",
  "landing.features.dashboard.body":
    "Le favori de chaque épreuve, là où le modèle et les points divergent, et le prochain championnat.",
  "landing.features.track.title": "Piste et concours",
  "landing.features.track.body":
    "Les 20 meilleurs mondiaux de chaque épreuve, par points ou selon l’évaluation du modèle.",
  "landing.features.championship.title": "{{name}} : le pronostic",
  "landing.features.championship.body":
    "La chance de podium de chaque engagé, pronostiquée avant la première session.",
  "landing.features.athlete.title": "Pages d’athlète",
  "landing.features.athlete.body":
    "La forme de la saison, les confrontations directes et les records de chaque athlète classé.",
  "landing.features.results.title": "Résultats",
  "landing.features.results.body": "Les pronostics passés, comparés à ce qui s’est vraiment passé.",
  "landing.faq.title": "Questions **fréquentes**",
  "landing.faq.rating.q": "Que veut dire l’évaluation du modèle ?",
  "landing.faq.rating.a":
    "C’est la lecture que fait le modèle d’un athlète face au reste des 20 meilleurs mondiaux de son épreuve : la probabilité qu’il finisse dans les trois premiers si ces 20 athlètes disputaient une même finale. Les évaluations de chaque épreuve totalisent 300.",
  "landing.faq.chance.q": "Et la chance de podium ?",
  "landing.faq.chance.a":
    "La même idée pour une vraie compétition, où les athlètes sont réellement engagés. Elle figure sur la page du championnat et sur la page de chaque engagé.",
  "landing.faq.accuracy.q": "Quelle est sa précision ?",
  "landing.faq.accuracy.a":
    "Testé saison après saison sur {{finals}} finales de championnat de {{from}} à {{to}}, il a désigné {{model}} % des médaillés, contre {{points}} % pour un classement aux points World Athletics.",
  "landing.faq.accuracy.aFallback":
    "Il est testé saison après saison sur des finales de championnat passées, chacune pronostiquée uniquement à partir des saisons précédentes. La page Comment ça marche donne les chiffres.",
  "landing.faq.data.q": "D’où viennent les données ?",
  "landing.faq.data.a":
    "Des résultats et classements publics de World Athletics. Rien n’est saisi ni modifié à la main.",
  "landing.faq.injuries.q": "Tient-il compte des blessures ?",
  "landing.faq.injuries.a":
    "Avant chaque pronostic, il cherche dans l’actualité les blessures et les forfaits et signale les athlètes concernés. Un forfait de dernière minute peut quand même déjouer les chiffres le jour J.",
  "landing.faq.free.q": "Est-ce gratuit ?",
  "landing.faq.free.a": "Oui. Tous les pronostics du site sont en accès libre.",
  "landing.faq.affiliated.q": "PodiumCall fait-il partie de World Athletics ?",
  "landing.faq.affiliated.a":
    "Non. C’est un projet indépendant qui lit les données publiques de World Athletics.",
  "landing.faq.more": "En savoir plus sur le fonctionnement",
  "landing.closing.title": "Avant le départ, **le pronostic est fait**.",
  "landing.closing.lede":
    "{{n}} épreuves, le pronostic du championnat et la saison de chaque athlète, à partir de vrais résultats.",
  "landing.nav.menu": "Menu",
  "landing.hero.rating": "évaluation du modèle {{rating}} %",
  "landing.features.dashboard.open": "Ouvrir le tableau de bord",
  "landing.features.track.open": "Voir le top 20 de chaque épreuve",
  "landing.features.championship.open": "Voir tout le pronostic",
  "landing.features.athlete.open": "Voir la page de l’athlète",
  "landing.features.results.open": "Voir tous les pronostics notés",
  "landing.features.card.dashboard": "Meilleures évaluations du modèle",
  "landing.features.card.track": "{{event}}, selon l’évaluation du modèle",
  "landing.features.card.ratingNote":
    "Sa chance de finir dans les trois premiers si le top 20 mondial disputait une même finale.",
  "landing.features.card.startsIn": "Début dans {{n}} jours",
  "landing.features.card.startsInOne": "Début demain",
  "landing.features.card.live": "En cours",
  "landing.features.card.done": "Terminé",
  "landing.features.card.athlete": "{{event}} : le favori du modèle",
  "landing.features.card.results": "Bilan à ce jour",
  "landing.features.card.resultsLine": "{{pct}} % des places de podium trouvées",
  "landing.features.card.resultsNext": "Prochain bilan : {{city}}",
  "landing.call.title": "Le pronostic des **{{name}}**",
  "landing.call.lede":
    "Le favori du modèle dans chaque épreuve pronostiquée à {{city}}, avec sa chance de podium : sa chance de finir dans les trois premiers.",
  "landing.call.chance": "chance de podium",
  "landing.call.cta": "Voir tout le pronostic",
  "landing.call.graded": "Chaque finale est notée sur la page Résultats une fois disputée.",
  "landing.call.error": "Impossible de charger le pronostic.",
  "podium.strongestCall": "Le mieux évalué",
  "podium.rating": "Évaluation du modèle",
  "podium.sb": "MPS {{mark}}",
  "podium.replay": "Rejouer",
  "landing.podiumEyebrow": "Les favoris du modèle",
  "landing.podiumTitle": "Les trois athlètes que le modèle **évalue le mieux** en ce moment.",
  "landing.podiumRankedBy":
    "Classés selon l’évaluation du modèle qui pronostique les championnats.",
  "landing.podiumLoading": "Chargement des pronostics les plus sûrs du modèle…",
  "landing.podiumError": "Le podium se remplira dès que le modèle en direct sera joignable.",
  "landing.podiumNoteBefore":
    "Chacun d’eux est le pronostic le plus sûr du modèle dans une discipline ",
  "landing.podiumNoteDifferent": "différente",
  "landing.podiumNoteAfter":
    ", ils ne sont donc pas en concurrence les uns avec les autres. Leur place ici montre l’évaluation que le modèle leur donne, pas l’ordre dans lequel ils finiraient les uns contre les autres. Chaque pourcentage est l’évaluation du modèle, pas un classement officiel ; les marques sont les meilleures performances de la saison 2026 selon World Athletics.",
  "dashboard.map.title": "D’où viennent les athlètes",
  "dashboard.map.subtitle":
    "Chaque pays qui compte au moins un athlète classé cette saison, plus ou moins doré selon leur nombre. Choisissez un pays pour ouvrir sa page.",
  "dashboard.map.countries": "Pays",
  "dashboard.map.athletes": "Athlètes classés",
  "dashboard.map.legend": "Athlètes classés par pays",
  "dashboard.map.athleteOne": "1 athlète classé",
  "dashboard.map.athleteCount": "{{n}} athlètes classés",
  "dashboard.map.showAll": "Voir les {{n}} pays",
  "dashboard.map.showFewer": "Voir moins",
  "dashboard.map.open": "Ouvrir la page {{name}}",
  "dashboard.map.listLabel": "Pays selon le nombre d’athlètes classés",
  "dashboard.map.error": "Impossible de charger la carte.",
  "landing.footer.explore": "Explorer",
  "landing.footer.about": "À propos",
  "landing.hero.event.100m": "du 100 m",
  "landing.hero.event.200m": "du 200 m",
  "landing.hero.event.400m": "du 400 m",
  "landing.hero.event.800m": "du 800 m",
  "landing.hero.event.1500m": "du 1500 m",
  "landing.hero.event.5000m": "du 5000 m",
  "landing.hero.event.10000m": "du 10 000 m",
  "landing.hero.event.100h": "du 100 m haies",
  "landing.hero.event.110h": "du 110 m haies",
  "landing.hero.event.400h": "du 400 m haies",
  "landing.hero.event.3000sc": "du 3000 m steeple",
  "landing.hero.event.HJ": "du saut en hauteur",
  "landing.hero.event.PV": "du saut à la perche",
  "landing.hero.event.LJ": "du saut en longueur",
  "landing.hero.event.TJ": "du triple saut",
  "landing.hero.event.SP": "du lancer du poids",
  "landing.hero.event.DT": "du lancer du disque",
  "landing.hero.event.HT": "du lancer du marteau",
  "landing.hero.event.JT": "du lancer du javelot",
  "landing.badgeCountdown": "PodiumCall · J-{{n}} avant {{city}}",
  "landing.badgeCountdownOne": "PodiumCall · J-1 avant {{city}}",
  "landing.badgeLive": "PodiumCall · En direct de {{city}}",
  "landing.badgeDone": "PodiumCall · {{city}} terminé",
  "landing.ctaPrimary": "Voir les prédictions en direct",
  "landing.ctaSecondary": "Parcourir les {{n}} épreuves",
  "landing.video.cta": "Voir comment ça marche",
  "landing.video.length": "1 min",
  "landing.video.title": "Comment fonctionne PodiumCall",
  "landing.video.close": "Fermer la vidéo",
  "landing.statMarks": "Performances cotées cette saison",
  "landing.statsError":
    "Les statistiques en direct sont injoignables pour le moment. Les chiffres ci-dessus se rempliront dès que le modèle tournera.",
  "landing.ticker": "En direct du modèle : l’athlète le mieux évalué dans chaque épreuve",
  "landing.tickerWithRange":
    "En direct du modèle : l’athlète le mieux évalué dans chacune des {{n}} épreuves, de {{lo}} à {{hi}} %",
  "landing.tickerAria": "L’athlète le mieux évalué par le modèle dans chaque épreuve",

  "landing.confidenceFeedLoads":
    "Les évaluations du modèle se chargeront dès que le modèle en direct tournera.",

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
  // is what keeps "pour le {{disc}}" / "du {{disc}}" grammatical across all 36.
  // "10 000" takes a no-break space, so a pill never splits the number.
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
  "disc.name.men_HT": "Lancer du marteau hommes",
  "disc.name.women_HT": "Lancer du marteau femmes",
  "disc.name.men_10000m": "10 000 m hommes",
  "disc.name.women_10000m": "10 000 m femmes",

  "ath.photoCredit": "Photo : {{author}} · {{license}}",
  "ath.photoCreditTitle": "Photo de {{author}}, {{license}}, via {{source}}. Ouvre la source.",

  // Welcome modal
  "welcome.eyebrow": "PodiumCall",
  "welcome.title": "Les meilleurs mondiaux, vus par le modèle.",
  "welcome.intro":
    "PodiumCall classe les meilleurs athlètes de chaque épreuve à partir de vraies données World Athletics : selon les points marqués, et selon l’évaluation du modèle, apprise sur de vraies finales de championnat depuis 2009.",
  "welcome.nextUp": "À venir : {{championship}} à {{city}}.",
  "welcome.point1":
    "Chaque chiffre est une vraie statistique extraite de World Athletics. Rien n’est saisi à la main ni inventé.",
  "welcome.point2":
    "Parcourez le top 20 par épreuve sous Piste et Concours, consultez le pronostic de chaque épreuve sous {{tab}}, ou ouvrez la fiche d’un athlète pour ses résultats, ses confrontations directes et ses records.",
  "welcome.point3":
    "Touchez le petit ⓘ à côté d’une statistique pour lire exactement ce qu’elle signifie.",
  "welcome.howItWorks": "Comment ça marche, en détail →",
  "welcome.explore": "Explorer le tableau",
  "welcome.about": "À propos",

  // Titres d’onglet.
  "seo.landing": "Les meilleurs mondiaux, vus par le modèle",
  "seo.ultimate": "Championnat Ultimate",
};
