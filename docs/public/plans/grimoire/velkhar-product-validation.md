---
type: product-validation-plan
visibility: public
rag: true
source_of_truth: false
status: deferred
updated: 2026-07-23
owners:
  - product
  - game-design
  - frontend
  - backend
---

# Plan produit — Faire de Velkhar un jeu désirable, mesurable et vendable

> **Statut : plan compagnon à exécuter sans compromettre la v0.1.**
>
> Ce document complète
> [`platform-multi-universe.md`](platform-multi-universe.md). Le premier plan
> organise la plateforme ; celui-ci organise la proposition de valeur, l'expérience de jeu, les
> textes, la validation commerciale et la mesure produit de Velkhar.
>
> Aucun produit n'est « 100 % vendable » avant confrontation au marché. L'objectif est de rendre
> Velkhar suffisamment clair, distinctif et fiable pour que des joueurs inconnus puissent le
> comprendre, y revenir et payer sans être convaincus manuellement par le créateur.

## 0. Mode d'emploi

Avant exécution, relire les sources vivantes du projet. Les statuts `current-state` et les contrats
réellement mergés gagnent toujours sur les exemples de ce plan.

Sources auditées pour cette proposition :

- `docs/public/design/GAME_DESIGN.md` ;
- `docs/public/raw/01-PILLARS.md` ;
- `docs/public/raw/02-WORLD-BIBLE.md` ;
- `docs/public/raw/03-FACTIONS.md` ;
- `docs/public/raw/09-ACTION-LOOP.md` ;
- `docs/public/raw/15-GAME-MASTER.md` ;
- `docs/public/raw/17-RUN-CHRONICLE.md` ;
- `docs/public/raw/18-RETENTION.md` ;
- `docs/public/raw/19-MONETIZATION.md` ;
- `docs/public/raw/20-ARCHITECTURE.md` ;
- contrats `scene.types.ts`, validateur IA, schéma Prisma et composants de session actuels.

Ordre d'utilisation :

1. phase 0 uniquement avant la première mise en production ;
2. stabilisation et observation réelle ;
3. canon jouable, Boussole, Enjeux et Traces ;
4. réécriture commerciale basée sur une démonstration E2E réelle ;
5. paiement ;
6. Chronique jouable seulement si les données l'autorisent.

## 1. Décision stratégique

### 1.1 Positionnement retenu

Velkhar n'est pas vendu comme un générateur de texte, un chatbot fantasy ou un créateur de mondes.

La promesse centrale est :

> **Velkhar est un RPG narratif IA qui se souvient, qui te résiste et qui se termine.**

Les trois contrats faits au joueur sont :

1. **Il se souvient** : un choix important devient une Trace visible, persistante et susceptible de
   revenir.
2. **Il te résiste** : les règles, les personnages et le monde peuvent refuser, punir ou détourner
   une intention. L'IA n'accorde pas automatiquement ce que le joueur demande.
3. **Il se termine** : chaque run possède un horizon, une pression, une progression dramatique et
   une conclusion transformée en Chronique.

### 1.2 Formule de vente courte

Version principale :

> **Agis librement. Le monde tranche. Tes choix restent.**

Version émotionnelle :

> **Le monde ne t'obéit pas. Il se souvient.**

Version explicative :

> **Un roguelike narratif où tu écris tes actions librement, où les règles décident des
> conséquences et où chaque existence laisse une Chronique.**

### 1.3 Ce qui n'est pas la différenciation

Ne jamais considérer comme avantage suffisant :

- « propulsé par IA » ;
- génération infinie ;
- action libre seule ;
- mémoire présentée sans preuve visible ;
- jolies illustrations seules ;
- grand nombre d'univers ;
- grand volume de lore ;
- possibilité de tout personnaliser.

Ces éléments peuvent soutenir le produit, mais ne démontrent ni résistance, ni conséquence, ni
plaisir de rejouer.

### 1.4 North Star produit

La métrique principale reste composée de deux signaux :

```text
Runs terminés
      ×
Deuxième run spontané dans les 7 jours
```

Une belle première session sans retour n'est pas une validation. La preuve décisive est un joueur
qui revient sans rappel pour reprendre ou recommencer.

---

## 2. Problèmes à résoudre

### 2.1 Mémoire invisible

Le backend possède déjà :

- `SceneLog.consequences` ;
- `MemoryChunk.keyFactsPinned` ;
- les Souvenirs nommés ;
- les Chroniques ;
- le world-state persistant.

Mais le joueur ne peut pas toujours distinguer :

- une conséquence réellement persistée ;
- une phrase d'ambiance sans effet ;
- ce que le monde sait ;
- ce qui pourra revenir ;
- ce qui sera oublié à la fin du run.

Le produit doit transformer cette mémoire technique en preuve perceptible.

### 2.2 IA trop complaisante

Une action libre peut donner l'impression que tout est possible. Un monde qui accepte toutes les
intentions cesse d'être un jeu.

Velkhar doit pouvoir :

- refuser une action impossible ;
- demander un coût ;
- faire échouer une tentative ;
- proposer une réussite partielle ;
- faire avancer une menace pendant l'hésitation ;
- laisser un PNJ dire non selon ses intérêts ;
- empêcher la répétition gratuite d'une même tentative.

### 2.3 Absence de direction ressentie

L'action libre ne doit pas devenir une page blanche. Le joueur doit toujours comprendre :

- ce qu'il cherche maintenant ;
- ce qui se rapproche ou se dégrade ;
- quel dilemme immédiat mérite une décision.

### 2.4 Promesse infinie non crédible

Les formulations « sans limites », « tout est possible » et « aventure infinie » promettent le
terrain où la cohérence finit par se dégrader. Velkhar gagne à vendre une expérience finie,
rejouable et mémorable.

### 2.5 Valeur commerciale non mesurée

Les compliments sur l'esthétique ne répondent pas à ces questions :

- le joueur commence-t-il réellement ?
- atteint-il une conséquence ?
- finit-il une aventure ?
- revient-il ?
- demande-t-il à jouer davantage ?
- paie-t-il réellement ?
- coûte-t-il moins que ce qu'il rapporte ?

L'instrumentation doit être livrée avant d'interpréter les retours.

---

## 3. Les quatre systèmes produit

### 3.1 Système A — La Boussole dramatique

La Boussole donne une direction sans transformer le jeu en checklist.

Elle contient au maximum trois informations :

```text
TON HORIZON
Atteindre Tissan avant la tempête.

LA MENACE
La soif gagne. La caravane a deux jours d'avance.

LE DILEMME
Traverser les Salures ou négocier avec les Rouilleurs.
```

Règles UX :

- une ligne par élément ;
- visible à l'ouverture de la session puis accessible dans le HUD ;
- pas de liste de tâches ;
- pas de pourcentage arbitraire de scénario ;
- pas de spoiler sur les résultats ;
- mise à jour seulement lorsqu'un pivot réel survient ;
- animation discrète lors d'un changement, jamais à chaque tour.

### 3.2 Système B — Les Enjeux

Avant un choix risqué, le joueur voit ce qui est connu :

```text
CE QUE TU RISQUES

Risque : élevé
Échec possible : les gardes seront alertés
Coût possible : Souffle ou blessure
Irréversible : non
```

Les Enjeux ne garantissent pas un résultat précis. Ils expliquent le contrat de risque.

Règles :

- `riskLevel` reste déterminé/validé par le backend ;
- les coûts mécaniques possibles viennent des règles, pas de la prose IA ;
- l'IA peut reformuler une conséquence autorisée, jamais en inventer une ;
- les informations inconnues restent explicitement inconnues ;
- les choix sûrs n'affichent pas un panneau lourd ;
- un enjeu mortel ou irréversible demande une confirmation claire ;
- l'accessibilité ne dépend jamais uniquement de la couleur.

### 3.3 Système C — Les Traces

Une Trace est la preuve qu'un acte significatif est entré dans l'état du jeu.

```text
LE MONDE A RETENU

Tu as abandonné le marchand aux Cendreurs.

Vane le sait.
Ta position à Tissan s'est dégradée.
Cette décision pourra revenir plus tard.
```

Une Trace comporte :

- un résumé factuel ;
- un niveau d'impact ;
- une portée ;
- les acteurs ou systèmes affectés lorsqu'ils sont connus ;
- une indication de persistance ;
- un lien vers la scène source pour l'historique futur.

Portées autorisées :

| Portée   | Signification                                     |
| -------- | ------------------------------------------------- |
| `scene`  | effet local, consommé immédiatement               |
| `run`    | peut revenir pendant le run actuel                |
| `legacy` | peut traverser la fin via Souvenir nommé/héritage |
| `world`  | modifie un état global explicitement autorisé     |

Niveaux d'impact :

| Niveau         | Affichage                  | Exemples                                    |
| -------------- | -------------------------- | ------------------------------------------- |
| `minor`        | notification simple        | perte légère, consommation ordinaire        |
| `meaningful`   | carte Trace                | condition, quête, relation, objet important |
| `major`        | carte Trace renforcée      | mort PNJ, trahison, artefact, faction       |
| `irreversible` | rituel visuel exceptionnel | fin, Calciné, choix moral permanent         |

Une variation normale de faim ou de fatigue ne devient pas une Trace. Sinon, le système perd sa
rareté et sa force émotionnelle.

### 3.4 Système D — La Chronique jouable / Défi du Seuil

Ce système est post-validation et ne bloque jamais la v0.1.

À partir d'un pivot majeur, le joueur peut partager :

> **« J'ai abandonné le marchand. Qu'aurais-tu fait ? »**

Le destinataire ouvre un lien et joue une courte situation contrôlée avec :

- un contexte canonique minimal ;
- un personnage prédéfini ;
- le même dilemme de départ ;
- ses propres jets et conséquences ;
- un CTA vers une véritable nouvelle partie.

La Chronique jouable ne clone pas une sauvegarde privée. Elle fabrique un `ThresholdChallenge`
sanitisé à partir d'un template canonique et d'un pivot autorisé.

Conditions avant développement :

- Chroniques consultées par au moins 30 % des runs terminés ;
- partage explicite d'au moins 10 % des Chroniques vues, ou demande qualitative forte ;
- golden path et deuxième run déjà satisfaisants ;
- capacité à modérer/supprimer un défi public ;
- mesure du funnel `challenge_opened → challenge_completed → game_started`.

---

## 4. Amélioration du canon : passer du lore au canon jouable

### 4.1 Décision

Le canon de Velkhar possède déjà une identité forte : Cendre, Calamine, désert, L'Aveugle,
artefacts, factions, Souvenirs et héritage. Le problème n'est pas un manque de noms, de régions ou
de mythologie.

Le chantier nécessaire est un **canon jouable** : des vérités structurées qui permettent au moteur
de savoir ce que chaque acteur veut, refuse, risque et retient.

Règle : aucune nouvelle page de lore n'est écrite si elle ne débloque pas au moins un élément
jouable parmi : objectif, refus, dilemme, coût, conséquence, Trace, écho ou fin.

### 4.2 Incohérences canoniques à corriger avant expansion

| Formulation existante                             | Problème                                                               | Décision recommandée                                                               |
| ------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| « Sandbox total, tu peux essayer n'importe quoi » | Suggère que tout est réalisable                                        | « Intention libre, possibilités contraintes par le monde »                         |
| « L'IA décide si un dé est nécessaire »           | Contredit l'autorité mécanique backend                                 | L'IA propose l'intention/pivot ; le backend décide et résout                       |
| « L'IA identifie attribut, DC et conséquence »    | Rend les règles manipulables                                           | Le backend choisit attribut, difficulté et conséquence                             |
| « Rejouabilité infinie »                          | Promesse impossible à démontrer                                        | « Forte rejouabilité », mesurée par le deuxième run                                |
| Run de 3 à 15 heures                              | Incompatible avec le vertical slice 45–70 min et le risque de contexte | V0.1 : expédition complète 45–70 min ; durée commerciale à valider avant mode long |
| Factions évoluant hors ligne pour tous            | Suggère un MMO/global state complexe                                   | V1 : état du run + événements mondiaux curés, pas simulation permanente            |
| Réputation numérique −100 à +100                  | Contredit le modèle récent à trois paliers narratifs                   | Une seule représentation qualitative V1, aucun chiffre affiché                     |
| 10–15 PNJ-marqueurs au lancement                  | Dilue la mémoire et augmente le contexte                               | Quatre PNJ-marqueurs centraux + quelques figurants templatisés                     |
| « Mémoire long terme » sans portée                | Risque de promesse absolue                                             | Toujours préciser scène, run, héritage ou monde                                    |

Ces corrections doivent être appliquées dans les sources canoniques concernées lors d'une issue
dédiée, avec recherche de contradictions et mise à jour du glossaire. Ce plan ne modifie pas le
canon vivant directement.

### 4.3 Les quatre couches du canon

```text
CANON FIXE
Ce qui est vrai pour tous : monde, histoire, factions, magie.
        ↓
CANON JOUABLE
Ce que les acteurs veulent/refusent, les coûts et les réactions autorisées.
        ↓
ÉTAT DU RUN
Ce que ce joueur a changé : relations, ressources, quêtes, Traces.
        ↓
PROSE IA
La mise en scène du tour, contrainte par les trois couches précédentes.
```

La prose ne devient jamais canon parce qu'elle est éloquente. Un fait devient canon de run
uniquement après validation et persistance backend.

### 4.4 Fiches de friction des factions

Chaque faction majeure reçoit une fiche machine-readable courte :

```ts
export interface CanonFrictionProfile {
  id: string;
  wants: string[];
  fears: string[];
  refuses: string[];
  prices: string[];
  canOffer: string[];
  cannotKnow: string[];
  escalationTriggers: string[];
  traceHooks: string[];
}
```

Direction recommandée :

| Faction           | Veut                          | Refuse                     | Prix dramatique principal    |
| ----------------- | ----------------------------- | -------------------------- | ---------------------------- |
| Culte des Cendres | ordre, contrôle des artefacts | magie libre reconnue       | sécurité contre obéissance   |
| Guilde du Sel     | routes sûres, dettes honorées | perte sans compensation    | survie contre profit         |
| Main d'Ombre      | contrats et secrets           | rupture d'une parole payée | efficacité contre conscience |
| Éveilleurs        | artefacts et vérité interdite | livrer le savoir au Culte  | connaissance contre Calamine |

Chaque faction doit avoir au moins :

- une demande que le joueur peut refuser ;
- une faveur qu'elle n'accorde jamais gratuitement ;
- une ligne rouge ;
- une réaction à une Trace ;
- une raison moralement défendable ;
- une conséquence non violente possible.

Le but est d'empêcher l'IA de transformer les factions en distributeurs de quêtes complaisants.

### 4.5 Fiches de friction des PNJ-marqueurs

Pour L'Aveugle, Vane, Salhene, Mihail et Kael le Muet lorsque ce dernier entre réellement dans la
V1 :

```text
Ce qu'il veut maintenant
Ce qu'il ne fera jamais
Ce qui peut le faire changer d'avis
Ce qu'il sait réellement
Ce qu'il cache
Ce qu'il exige en échange
Les Traces qu'il peut reconnaître
Sa manière de dire non
```

Un PNJ mémorable n'est pas celui qui possède la plus longue biographie. C'est celui dont le joueur
peut anticiper les valeurs sans prévoir la décision exacte.

### 4.6 Les quatre quêtes comme questions dramatiques

Les quêtes ouvertes actuelles restent pertinentes, mais chacune doit recevoir une question, une
tentation et une condition de conclusion possible.

| Quête           | Question                                                  | Tentation                              | Prix possible         | Exemple de conclusion                         |
| --------------- | --------------------------------------------------------- | -------------------------------------- | --------------------- | --------------------------------------------- |
| Pouvoir         | Jusqu'où te transformeras-tu pour agir ?                  | éveiller un artefact                   | Calamine, chasse      | maîtriser, transmettre ou détruire l'artefact |
| Vérité          | Toute vérité mérite-t-elle d'être révélée ?               | ouvrir une ruine interdite             | allié, stabilité, foi | révéler, enfouir ou falsifier une découverte  |
| Survie/Héritage | Que faut-il préserver quand tout manque ?                 | sauver les siens au détriment d'autres | ressources, dette     | fonder, transmettre ou renoncer               |
| Destruction     | Peut-on détruire le pouvoir sans devenir son instrument ? | utiliser l'artefact contre lui-même    | corruption, victimes  | briser, sceller ou détourner la source        |

Le joueur ne choisit pas nécessairement une quête dans un menu. Le backend détecte une orientation
à partir d'actes validés, mais la Boussole traduit ensuite cette direction en objectif compréhensible.

### 4.7 Bibliothèque de dilemmes fertiles

Créer 8 à 12 dilemmes V1 profondément testés vaut mieux que 100 événements génériques.

Un dilemme canonique respecte :

- au moins deux options défendables ;
- un coût différent pour chaque option ;
- aucun résultat moralement parfait ;
- une conséquence mécanique ;
- une Trace possible ;
- au moins un écho ultérieur ;
- une variation par vocation lorsque pertinente ;
- une issue libre plausible sans invalider le dilemme.

Gabarit :

```yaml
id: merchant-at-the-threshold
horizon: atteindre Tissan avant la tempête
pressure: eau faible + temps limité
dilemma: secourir un marchand poursuivi
options:
  - save: coûte eau et temps, crée dette positive
  - ignore: conserve ressources, risque mort du marchand
  - rob: gagne ressources, crée témoin/hostilité
free_action_constraints:
  impossible: annuler la tempête, créer de l'eau, téléportation
trace_hooks:
  - merchant-saved
  - merchant-abandoned
  - merchant-robbed
echo_window: avant la fin de l'expédition
```

Les noms et détails définitifs doivent être validés par le canon. Le gabarit est plus important que
l'exemple.

### 4.8 Pressions et horloges narratives

Chaque expédition contient au maximum :

- une pression majeure : tempête, poursuite, Calamine, siège ou dette ;
- une pression secondaire : ressource, blessure, confiance ou temps ;
- un horizon actuel ;
- un dilemme actif.

Une pression possède 3 à 5 états nommés, jamais un compteur arbitraire visible :

```text
LOINTAINE → PROCHE → IMMINENTE → DÉCLENCHÉE
```

Le backend avance la pression selon les tours, les repos et les actions. L'IA décrit les signes
sensoriels associés, sans contrôler l'horloge.

### 4.9 Structure d'une expédition vendable

Pour la première expérience commerciale :

1. **Seuil** — L'Aveugle donne un horizon concret.
2. **Premier coût** — le désert retire une ressource ou impose une contrainte.
3. **Premier dilemme** — choix défendable, première Trace possible.
4. **Écho** — un personnage ou une situation réagit à cette Trace.
5. **Pivot irréversible** — le joueur choisit ce qu'il accepte de perdre.
6. **Climax** — résolution combinant état, vocation et décisions.
7. **Fin** — survie, retour, mort ou Calciné.
8. **Chronique** — preuve de l'histoire et invitation à une autre destinée.

Cette structure est invisible dans l'UI. Elle ne doit jamais ressembler à des chapitres imposés.

### 4.10 Expédition de preuve recommandée

Construire une expédition E2E canonique provisoirement appelée **Le Prix de la Pitié** :

```text
Horizon : atteindre Tissan avant une tempête de Cendre
Pression : eau rare + tempête qui approche
Pivot 1 : un marchand blessé demande de l'aide
Trace : sauvé / abandonné / dépouillé / solution libre validée
Écho : la Guilde, un témoin ou le marchand réagit plus tard
Pivot 2 : l'arrivée à Tissan exige un nouveau coût
Fin : entrée, retour forcé, mort ou sacrifice
Chronique : met en relation les deux pivots
```

Cette expédition doit prouver dans un seul golden path :

- Boussole ;
- survie ;
- action libre ;
- Enjeux ;
- D20 ;
- refus possible ;
- Trace ;
- écho ;
- fin ;
- Chronique.

Elle ne devient canon définitif qu'après validation narrative. Son rôle premier est de garantir que
la promesse marketing correspond à une expérience reproductible.

### 4.11 Secrets et exposition

- un run 1 ne doit pas expliquer les Archontes ;
- chaque révélation répond à une question et en ouvre une autre ;
- maximum cinq termes propres indispensables dans les premières scènes ;
- l'Aveugle donne une direction, pas une encyclopédie ;
- un Souvenir dépensé révèle du lore utile à une décision ;
- aucune page marketing ne spoile une vérité centrale ;
- les futurs univers ne réutilisent pas les concepts canoniques Velkhar.

### 4.12 Critères d'acceptation du canon jouable

- chaque faction majeure sait dire non ;
- chaque PNJ-marqueur possède une limite et un prix ;
- chaque quête possède au moins une condition de fin ;
- chaque dilemme modifie un état backend ;
- chaque Trace majeure possède au moins un écho prévu ;
- la première expédition se termine en 45–70 minutes lors des tests médians ;
- les quatre vocations produisent au moins une différence de lecture ou d'option ;
- aucun prompt ne dit que l'IA décide seule des règles ;
- aucune source canonique ne promet infinité ou mémoire parfaite ;
- les documents `GAME_DESIGN`, `01-PILLARS`, `03-FACTIONS`, `09-ACTION-LOOP`, `15-GAME-MASTER`,
  `18-RETENTION` et le glossaire ne se contredisent plus.

---

## 5. Réécriture des textes marketing

### 5.1 Principes rédactionnels

Chaque texte doit vendre une preuve de jeu, pas une capacité abstraite de l'IA.

À favoriser :

- verbes concrets : agir, risquer, perdre, survivre, laisser, revenir ;
- résultats observables : règle, jet, condition, Trace, Chronique ;
- phrases courtes ;
- vocabulaire Velkhar sur la page Velkhar ;
- IA présentée comme MJ, pas comme gadget technologique ;
- promesse finie et rejouable.

À supprimer :

- « sans limites » ;
- « possibilités infinies » ;
- « tout est possible » ;
- « une aventure unique à chaque fois » sans preuve ;
- « l'IA comprend tout » ;
- « mémoire parfaite » ;
- « révolutionnaire » ;
- comparaisons non démontrables avec un humain ;
- accumulation de termes techniques.

### 5.2 Landing Grimoire — proposition de texte

#### Hero

Sur-titre :

> **GRIMOIRE — RPG NARRATIFS VIVANTS**

Titre :

> **Des mondes qui se souviennent. Des choix qui ne s'effacent pas.**

Sous-titre :

> **Tu agis librement. Le Maître du jeu IA met le monde en scène. Les règles tranchent, et chaque
> aventure laisse une trace.**

CTA principal :

> **JOUER À VELKHAR**

CTA secondaire :

> **VOIR COMMENT LE MONDE RÉAGIT**

#### Démonstration du moteur

```text
TU AGIS
Écris ce que tu veux tenter.

LE MJ MET EN SCÈNE
Il comprend ton intention et raconte la réaction du monde.

LES RÈGLES TRANCHENT
Risque, D20, ressources et conséquences restent souverains.

LE MONDE RETIENT
Les actes importants deviennent des Traces qui peuvent revenir.
```

#### Bibliothèque d'univers

Titre :

> **Plusieurs mondes. Une même promesse : tes choix comptent.**

Velkhar :

> **Le premier seuil. Un désert de cendre et de sel où survivre exige de renoncer à quelque
> chose.**

Futurs univers :

> **À venir — chaque monde aura ses règles, son identité et sa manière de se souvenir.**

Ne pas annoncer de date ni décrire un univers qui n'est pas réellement en production.

### 5.3 Landing Velkhar — proposition de texte

#### Hero

Sur-titre :

> **UN UNIVERS DE GRIMOIRE**

Titre :

> **VELKHAR — OF ASH AND SALT**

Promesse :

> **Survis. Choisis. Laisse une trace.**

Description :

> **Un roguelike narratif où tu agis librement, où les règles décident des conséquences et où le
> désert garde la mémoire de ceux qui l'ont traversé.**

CTA principal :

> **ENTRER DANS L'AUBERGE**

CTA secondaire :

> **VOIR CE QUE TU RISQUES**

#### Section 1 — Il te résiste

Titre :

> **Le désert ne te doit aucune victoire.**

Texte :

> **Faim, soif, blessures et Calamine pèsent sur chaque décision. Tu peux tout tenter — pas tout
> réussir.**

#### Section 2 — Il se souvient

Titre :

> **Ce que tu fais ne disparaît pas avec la scène.**

Texte :

> **Une promesse, une trahison ou une vie épargnée devient une Trace. Des personnages s'en
> souviendront. L'Aveugle aussi.**

#### Section 3 — Il se termine

Titre :

> **Chaque existence mérite une fin.**

Texte :

> **Survis, reviens à l'Auberge ou deviens Calciné. À la fin, ta route devient une Chronique que tu
> peux garder et partager.**

#### CTA final

Titre :

> **Ta première Chronique commence au seuil.**

Texte :

> **Aucun compte requis pour entrer. Choisis ton prochain pas ; Velkhar gardera le reste.**

CTA :

> **ENTRER DANS L'AUBERGE**

### 5.4 Textes dans le jeu

| Emplacement     | Texte recommandé                                                                  |
| --------------- | --------------------------------------------------------------------------------- |
| Action libre    | « Décris ce que tu fais. Le monde décidera ce qui est possible. »                 |
| Chargement      | « Le monde pèse les conséquences… »                                               |
| Boussole        | « Ton horizon » / « La menace » / « Le dilemme »                                  |
| Enjeux          | « Ce que tu risques »                                                             |
| Trace           | « Le monde a retenu »                                                             |
| Échec           | « Tu échoues, mais la situation avance. »                                         |
| Impossible      | « Cette action dépasse ce que ton personnage peut accomplir ici. »                |
| Alternative     | « Tu peux toutefois… »                                                            |
| Souvenir nommé  | « Cette Trace te survivra. »                                                      |
| Fin             | « Ton voyage s'achève. Sa trace demeure. »                                        |
| Nouvelle partie | « Écrire une autre destinée »                                                     |
| Reprise         | « Reprendre là où le monde t'attend »                                             |
| Limite gratuite | « Cette aventure peut continuer. Sauvegarde-la pour franchir le prochain seuil. » |

Tous les textes doivent avoir une traduction anglaise validée dans `next-intl`. Le français reste
la langue de conception ; l'anglais ne doit pas être une traduction littérale si le rythme se
dégrade.

### 5.5 Ce qui doit être prouvé sur la landing

La page montre une seule séquence causale réelle :

```text
Action du joueur
  → Enjeu annoncé
  → Jet/règle
  → Conséquence
  → Trace persistée
  → Retour de la Trace plus tard
```

Ne pas afficher une fausse conversation ou une conséquence que le produit ne sait pas reproduire.
La démo marketing doit être construite à partir d'un scénario couvert par un test E2E.

---

## 6. Contrats fonctionnels

### 6.1 Boussole dramatique

Contrat partagé proposé :

```ts
export interface DramaticCompass {
  horizon: {
    id: string;
    label: string;
  };
  threat: {
    id: string;
    label: string;
    pressure: "stable" | "rising" | "critical";
  };
  dilemma?: {
    id: string;
    label: string;
  };
  revision: number;
}
```

Règles :

- les `id` et `pressure` sont backend-owned ;
- les labels proviennent de templates localisés ou d'une reformulation IA validée ;
- `revision` augmente seulement si l'état change ;
- chaque session active possède un horizon ;
- si aucun dilemme n'est actif, le champ est absent plutôt qu'inventé.

### 6.2 Enjeux

Extension proposée de `Choice` :

```ts
export interface ChoiceStakes {
  riskLevel: "safe" | "low" | "medium" | "high" | "deadly";
  possibleCosts: Array<{
    code: string;
    label: string;
    category: "resource" | "condition" | "relation" | "quest" | "position";
  }>;
  failurePreview?: string;
  irreversible: boolean;
  visibility: "known" | "partial";
}
```

Ne pas envoyer une probabilité numérique tant que le calcul complet et compréhensible n'est pas
stabilisé. Un faux pourcentage ferait perdre davantage de confiance qu'un niveau de risque.

### 6.3 Action libre

Phase initiale :

- l'action libre reste soumise directement ;
- le backend valide faisabilité, risque et coût ;
- les actions impossibles retournent une raison canonique et 1 à 3 alternatives ;
- une action libre à risque mortel/irréversible peut demander confirmation après classification,
  avant application mécanique.

Phase ultérieure, seulement si nécessaire :

```text
Saisie libre
  → classification backend
  → preview uniquement si high/deadly/irreversible
  → confirmation
  → résolution
```

Ne pas ajouter deux requêtes à chaque action. Le preview conditionnel protège le rythme et le coût
IA.

### 6.4 Résolution anti-complaisance

Le résolveur retourne un statut explicite :

```ts
export type ActionResolution =
  | { outcome: "success"; consequences: ChoiceConsequence }
  | { outcome: "partial"; consequences: ChoiceConsequence }
  | { outcome: "failure"; consequences: ChoiceConsequence }
  | { outcome: "impossible"; reasonCode: string; alternatives: string[] };
```

Invariants :

- un échec fait avancer ou détériore au moins un état ;
- répéter exactement une action échouée ne réinitialise pas le risque ;
- le modèle ne fabrique jamais un jet ;
- une réussite n'efface pas les coûts déjà engagés ;
- un PNJ peut refuser selon état de relation, intérêt et scène ;
- une action impossible ne consomme pas une ressource mécanique, sauf coût annoncé de tentative ;
- le texte final respecte le résultat mécanique.

### 6.5 Trace

Contrat de projection proposé :

```ts
export interface WorldTrace {
  id: string;
  sceneId: string;
  summary: string;
  impact: "minor" | "meaningful" | "major" | "irreversible";
  scope: "scene" | "run" | "legacy" | "world";
  affectedSubjects: Array<{
    type: "npc" | "faction" | "quest" | "location" | "character" | "world";
    id: string;
    label: string;
  }>;
  persistence: "resolved" | "active" | "remembered";
  createdAt: string;
}
```

`WorldTrace` n'est pas une nouvelle vérité mécanique. C'est une projection sûre de données déjà
validées par le backend.

Source par ordre de priorité :

1. conséquence mécanique appliquée ;
2. changement de quête/relation/condition ;
3. `keyFactsPinned` validé ;
4. Souvenir nommé créé ;
5. événement de fin.

### 6.6 Définition d'une première conséquence importante

L'événement produit `first_meaningful_consequence_reached` une seule fois par première campagne
lorsqu'au moins une condition est vraie :

- condition persistante ajoutée ;
- objet important gagné ou perdu ;
- quête activée, bifurquée ou échouée ;
- relation/faction changée ;
- fait critique épinglé ;
- Souvenir nommé validé ;
- PNJ majeur mort ;
- choix irréversible ;
- fin de run.

Sont exclus :

- drain normal de faim/soif/fatigue ;
- message d'ambiance ;
- simple changement de lieu ;
- choix cliqué sans modification d'état ;
- notification générée uniquement côté frontend.

### 6.7 Retour d'une Trace

Une Trace est prouvée seulement lorsqu'elle a un effet ultérieur observable.

Le backend doit pouvoir signaler :

```ts
export interface TraceEcho {
  traceId: string;
  mode: "dialogue" | "mechanical" | "access" | "relationship" | "legacy";
  sceneId: string;
}
```

L'UI peut alors indiquer discrètement :

> **Une ancienne Trace vient de refaire surface.**

Le premier dialogue de L'Aveugle au run N+1 doit mentionner au moins une Trace `legacy` pertinente,
si elle existe.

---

## 7. Modèle de données et architecture

### 7.1 Ne pas créer un quatrième système de mémoire

Les Traces s'appuient sur :

- `SceneLog.consequences` pour la mécanique ;
- `MemoryChunk.keyFactsPinned` pour les faits critiques ;
- `Souvenir` pour l'héritage inter-runs ;
- `Chronicle` pour la synthèse finale.

Décision V1 : ajouter une projection structurée au résultat et, si une requête historique le
nécessite, persister `traceProjection` sur `SceneLog`.

Ne créer une table `WorldTrace` autonome que si au moins deux usages nécessitent des requêtes
transversales performantes : historique joueur, recherche, échos multiples ou Chronique jouable.

### 7.2 Évolution additive proposée

Étape 1 :

```text
SceneLog
├── consequences        existant
├── diceRoll             existant
├── traceProjection?     nouveau JSON nullable
└── impactLevel?         nouveau string nullable
```

Étape 2 :

```text
GameSession
├── dramaticCompass?     JSON nullable
├── compassRevision      int default 0
└── firstMeaningfulAt?   timestamp nullable
```

Étape 3, uniquement si validée :

```text
ThresholdChallenge
├── id
├── publicTokenHash
├── sourceChronicleId
├── universeId
├── templateId
├── sanitizedSeed
├── status
├── expiresAt?
└── createdAt
```

Toutes les migrations sont additives. Aucun champ existant n'est supprimé pendant la phase de
validation.

### 7.3 Responsabilités

| Élément        | IA                         | Backend              | Frontend          |
| -------------- | -------------------------- | -------------------- | ----------------- |
| Texte de scène | écrit                      | valide               | affiche           |
| Risque         | propose éventuellement     | décide/valide        | explique          |
| Jet            | jamais                     | calcule              | anime             |
| Conséquence    | formule dans une allowlist | décide/applique      | affiche           |
| Trace          | propose un résumé          | construit/persiste   | révèle            |
| Boussole       | reformule éventuellement   | choisit l'état       | affiche           |
| Souvenir       | propose candidat           | valide               | célèbre           |
| Chronique      | écrit                      | fournit faits/valide | présente/partage  |
| Analytics      | aucun accès libre          | émet autoritatif     | émet interactions |

### 7.4 Endpoints

Extensions possibles :

```text
POST /sessions/:id/actions
  → scene + stakes/result + trace? + compass

GET /sessions/:id
  → état + compass + traces actives nécessaires

GET /sessions/:id/traces
  → historique paginé, post-V1 si utile

POST /sessions/:id/actions/preview
  → uniquement pour action libre high/deadly, post-validation

POST /chronicles/:id/challenges
  → création opt-in d'un Défi du Seuil, post-validation

GET /challenges/:token
  → snapshot public sanitisé
```

### 7.5 Sécurité et vie privée

- aucune action libre ou narration brute dans les événements analytics ;
- aucun email, nom réel, token, cookie ou prompt dans `properties` ;
- `userId` pseudonyme uniquement côté serveur ;
- un challenge public est opt-in ;
- le snapshot public exclut inventaire privé, historique complet et identifiants internes ;
- token public aléatoire, hash stocké côté DB ;
- rate limit sur lecture et création des challenges ;
- modération, désactivation et suppression RGPD ;
- contrôle propriétaire sur toute création depuis une Chronique ;
- `universeId`, `sessionId` et `traceId` toujours vérifiés ensemble ;
- l'IA ne reçoit jamais les événements analytics comme instructions.
- la table d'événements n'est jamais écrite directement depuis le navigateur avec un accès DB ;
- l'endpoint de collecte applique rate limit, limite de taille et schéma par événement ;
- la base légale, la durée de conservation et le besoin éventuel de consentement sont validés avant
  production selon les outils et pays ciblés.

---

## 8. UX détaillée

### 8.1 Première session

```text
Landing Velkhar
  → Entrer dans l'Auberge
  → L'Aveugle donne un objectif simple
  → création courte
  → première scène
  → Boussole visible
  → choix avec niveau de risque
  → première conséquence importante
  → carte Trace
  → scène ultérieure où la Trace réapparaît
  → fin
  → Chronique
  → CTA nouvelle destinée / sauvegarde compte
```

La première Trace doit idéalement apparaître pendant les 10 à 15 premières minutes, sans être
artificiellement garantie si le joueur n'accomplit aucun acte significatif.

### 8.2 Carte Enjeux

- intégrée au choix, pas dans une modale systématique ;
- détail au focus, hover ou ouverture tactile ;
- confirmation séparée seulement pour `deadly` ou `irreversible` ;
- labels traduits ;
- icône + texte + couleur ;
- jamais d'animation qui cache le bouton d'action.

### 8.3 Carte Trace

- apparaît après la narration et avant les nouveaux choix ;
- reste 4 à 8 secondes en mode célébration, puis se compacte ;
- accessible au clavier ;
- lecture vocale non interrompue brutalement ;
- animation d'encre/cendre sobre ;
- aucune Trace mineure en plein écran ;
- `prefers-reduced-motion` remplace le reveal par un fondu court.

### 8.4 Boussole

- desktop : panneau discret du HUD ;
- mobile : tiroir compact « Horizon » ;
- mise à jour annoncée par `aria-live="polite"` ;
- version précédente consultable seulement si un vrai besoin apparaît ;
- aucune carte du monde obligatoire.

### 8.5 Écho

Lorsqu'une ancienne Trace revient :

- la narration reste prioritaire ;
- un badge discret relie l'écho à la Trace initiale ;
- le joueur peut ouvrir le rappel après lecture ;
- le système explique le lien sans révéler les données internes.

Exemple :

```text
UNE TRACE REFAIT SURFACE

Le marchand se souvient que tu l'as abandonné.
Voir l'acte d'origine
```

---

## 9. Qualité narrative et garde-fous

### 9.1 Tests anti-« yes-man »

Créer une suite de scénarios contractuels :

1. obtenir gratuitement un objet qu'un marchand refuse de vendre ;
2. convaincre immédiatement un ennemi juré ;
3. utiliser un objet absent de l'inventaire ;
4. se téléporter dans un lieu inconnu ;
5. annuler une blessure par simple déclaration ;
6. répéter une action échouée sans changer d'approche ;
7. tuer un PNJ majeur sans moyen plausible ;
8. ignorer une menace critique pendant plusieurs tours.

Résultat attendu : refus, coût, risque, progression de menace ou alternative cohérente. Jamais une
acceptation automatique.

### 9.2 Tests de mémoire démontrable

Pour chaque type de Trace :

- créer l'acte ;
- vérifier la persistance ;
- charger une scène ultérieure ;
- vérifier l'écho ;
- reprendre après déconnexion ;
- terminer le run ;
- vérifier la présence dans Souvenir/Chronique selon portée ;
- commencer un nouveau run ;
- vérifier le rappel par L'Aveugle si `legacy`.

### 9.3 Feedback joueur intégré

Après une scène, menu discret :

```text
Signaler un problème
├── Le monde a oublié un fait
├── Cette conséquence est incohérente
├── Le texte se répète
├── Mon action a été mal comprise
├── Le résultat semble trop facile
└── Autre
```

Le signal contient uniquement IDs, catégories, modèle/version et références serveur. L'ajout du
texte libre est optionnel, limité et traité comme donnée sensible.

---

## 10. Monétisation à tester

### 10.1 Principe

Le paiement arrive après une preuve de valeur : conséquence ressentie, fin de première aventure ou
désir explicite de continuer.

Ne pas bloquer :

- l'entrée dans l'Auberge ;
- la première conséquence ;
- la première Chronique ;
- la compréhension de la promesse.

### 10.2 Offre initiale recommandée

Hypothèse à tester, pas décision contractuelle :

- première expédition significative gratuite ;
- compte gratuit pour sauvegarder et reprendre ;
- offre Fondateur entre 9,99 € et 14,99 €/mois selon coût réel ;
- quota généreux et transparent ;
- aucun « illimité » avant mesure des distributions d'usage ;
- crédits premium seulement pour modèles/images coûteux, après validation du besoin.

### 10.3 Mesure de volonté de payer

Ordre de preuve, du plus faible au plus fort :

1. déclare qu'il paierait dans une interview ;
2. visite les tarifs ;
3. choisit une offre ;
4. commence un checkout ;
5. paie ;
6. renouvelle le mois suivant.

Seuls les niveaux 5 et 6 démontrent un revenu. Les autres sont des intentions.

Si Stripe n'est pas encore disponible, utiliser un test honnête :

> **L'offre Fondateur n'est pas encore ouverte. Souhaites-tu être prévenu lors de son lancement ?**

Ne jamais simuler un checkout, cacher l'indisponibilité ou présenter une liste d'attente comme une
vente.

### 10.4 Économie unitaire

Calculer par cohorte :

```text
Revenu HT encaissé
- frais de paiement
- coût IA texte
- coût IA image/voix
- infrastructure variable
= marge contributive
```

Objectif initial : IA + infrastructure variable sous 25 à 30 % du revenu HT. Toute promesse de prix
est révisée si le p95 des gros joueurs détruit cette marge.

---

## 11. Plan de livraison

### Phase 0 — Avant le déploiement v0.1

Ne pas lancer la refonte complète. Ajouter seulement ce qui permet de mesurer honnêtement le
vertical slice :

- définir les événements et leur version ;
- mesurer landing → session → conséquence → fin → Chronique ;
- journaliser tokens, modèle, latence, résultat et coût estimé ;
- fixer la définition serveur d'une conséquence importante ;
- remplacer les promesses manifestement fausses comme « sans limites » si elles sont visibles ;
- terminer les bloqueurs `RELEASE_READINESS` ;
- exécuter le golden path avec l'instrumentation active en staging.

Sortie : la v0.1 peut produire une baseline sans changement architectural massif.

### Phase 1 — Stabilisation production, jours 0 à 14

- corriger P0/P1 ;
- vérifier la qualité des données analytics ;
- exclure bots, tests internes et environnements non-prod ;
- mesurer latence et coût par run ;
- observer 10 à 20 parties réelles ;
- conduire 5 entretiens sans présenter les futures solutions ;
- ne pas développer la Chronique jouable.

Sortie : baseline fiable et liste des abandons réels.

### Phase 2 — Canon jouable, Boussole et résistance

- corriger les contradictions listées en section 4.2 ;
- figer les fiches de friction des quatre factions et des PNJ V1 ;
- écrire/tester l'expédition de preuve `Le Prix de la Pitié` ;
- créer `DramaticCompass` ;
- brancher horizon/menace/dilemme sur l'état backend ;
- compléter la résolution `success/partial/failure/impossible` ;
- ajouter les refus canoniques et alternatives ;
- empêcher les retries gratuits identiques ;
- renforcer danger et fail-forward ;
- tests anti-complaisance ;
- UI responsive/accessibilité.

Sortie : le joueur sait quoi poursuivre et le monde sait dire non.

### Phase 3 — Enjeux visibles

- étendre le contrat `ChoiceStakes` ;
- générer les coûts possibles depuis les règles ;
- afficher le détail sur choix risqués ;
- confirmation `deadly/irreversible` ;
- preview conditionnel de l'action libre seulement si nécessaire ;
- instrumenter exposition, confirmation et abandon.

Sortie : le joueur comprend le risque avant de s'engager.

### Phase 4 — Traces visibles

- définir l'impact serveur ;
- construire la projection depuis les conséquences existantes ;
- persister seulement ce qui est nécessaire ;
- afficher la carte Trace ;
- relier Trace → scène source ;
- implémenter au moins un écho intra-run ;
- faire rappeler une Trace `legacy` par L'Aveugle au run suivant ;
- tests de reprise et de non-duplication.

Sortie : la promesse « le monde se souvient » est démontrée à l'écran.

### Phase 5 — Réécriture commerciale

- appliquer les textes de la section 5 ;
- construire la démo causale à partir d'un vrai scénario E2E ;
- mettre à jour métadonnées SEO et Open Graph ;
- adapter FR/EN ;
- instrumenter chaque CTA ;
- ne pas afficher futurs univers/prix comme disponibles ;
- mener un test qualitatif de compréhension en 10 secondes.

Sortie : un visiteur comprend action libre, résistance, mémoire et fin.

### Phase 6 — Test de paiement

- calculer le coût p50/p95 d'un run ;
- définir quota et prix expérimental ;
- afficher l'offre après valeur vécue ;
- intégrer Stripe seulement lorsque sécurité/billing sont prêts ;
- mesurer offre vue, checkout et paiement ;
- interroger payeurs et non-payeurs ;
- ne pas modifier le jeu pour forcer artificiellement la conversion.

Sortie : première preuve ou réfutation de volonté de payer.

### Phase 7 — Défi du Seuil, conditionnelle

- valider les seuils Chronique ;
- concevoir des templates canoniques partageables ;
- créer un snapshot sanitisé ;
- développer le mini-parcours anonyme ;
- mesurer ouverture, complétion et démarrage d'une vraie partie ;
- arrêter la fonctionnalité si elle ne recrute pas.

Sortie : boucle d'acquisition jouable, uniquement si les données la justifient.

---

## 12. Découpage recommandé en issues/PR

Chaque élément devient une issue avant sa branche.

1. Product — ADR promesse « se souvient / résiste / se termine ».
2. Canon — corriger autorité backend, durée, réputation et promesses absolues.
3. Canon — fiches de friction factions/PNJ.
4. Game design — expédition E2E `Le Prix de la Pitié`.
5. Shared — schéma versionné des événements analytics.
6. Backend — endpoint first-party de collecte et idempotence.
7. Backend — journal AI usage/coût/latence.
8. Backend — définition `meaningfulConsequence`.
9. Frontend — instrumentation funnel anonyme.
10. Data — vues SQL et exclusion trafic interne.
11. Shared — contrat `DramaticCompass`.
12. Backend — état dramatique et pression.
13. Frontend — Boussole responsive.
14. Backend — résolution explicite et refus canoniques.
15. QA — corpus anti-complaisance.
16. Shared — contrat `ChoiceStakes`.
17. Backend — stakes mécaniques.
18. Frontend — UI Enjeux et confirmation.
19. Shared — projection `WorldTrace`.
20. Backend — construction/persistance minimale des Traces.
21. Frontend — reveal et historique compact.
22. Backend/IA — écho intra-run et rappel L'Aveugle.
23. QA — E2E action → Trace → écho → reprise.
24. Content — réécriture Grimoire et Velkhar FR/EN.
25. Frontend — démo landing issue du scénario E2E.
26. Product — test qualitatif compréhension/conversion.
27. Billing — offre Fondateur et Stripe, conditionnelle.
28. Product — prototype Défi du Seuil, conditionnel.

Les contrats shared/backend sont mergés avant leur consommation frontend. Les changements de scope
pré-déploiement mettent à jour `RELEASE_READINESS.md`.

---

## 13. Tests et critères d'acceptation

### 13.1 Promesse comprise

Sans explication orale, 8 testeurs sur 10 doivent pouvoir répondre après dix secondes :

- le joueur écrit ou choisit ses actions ;
- le jeu possède de vraies règles ;
- les conséquences persistent ;
- l'aventure possède une fin.

### 13.2 Boussole

- toujours un horizon sur session active ;
- menace mise à jour selon règles ;
- pas de changement artificiel à chaque tour ;
- aucune divergence après reprise ;
- mobile, clavier et lecteur d'écran fonctionnels.

### 13.3 Enjeux

- niveau de risque identique frontend/backend ;
- coûts affichés appartenant à l'allowlist ;
- impossibilité de modifier les stakes côté client ;
- confirmation des actions irréversibles ;
- aucune probabilité trompeuse.

### 13.4 Traces

- une Trace correspond à un changement réellement persisté ;
- aucun message IA seul ne produit une Trace ;
- une Trace n'est jamais doublée sur retry ;
- un utilisateur ne lit pas la Trace d'un autre ;
- un écho référence une Trace existante ;
- une Trace `legacy` survit à la fin selon les règles ;
- les drains ordinaires ne saturent pas l'interface.

### 13.5 Analytics

- mêmes événements non dupliqués après retry ;
- horodatage serveur pour événements autoritatifs ;
- environnement et version présents ;
- aucune PII ni narration brute ;
- parcours test identifiable et excluable ;
- calcul funnel reproductible par requête SQL ;
- coût d'un run réconciliable avec les appels provider.

---

## 14. Risques et réponses

| Risque                               | Réponse                                                   |
| ------------------------------------ | --------------------------------------------------------- |
| Trop de panneaux cassent l'immersion | Afficher seulement pivots et impacts significatifs        |
| Enjeux révèlent trop                 | Visibilité `known/partial`, aucun spoiler caché           |
| Trace duplique Souvenir              | Trace = projection ; Souvenir = héritage validé           |
| IA formule une fausse conséquence    | Backend construit depuis allowlist                        |
| Boussole devient checklist           | Trois lignes maximum, pas de tâches                       |
| Monde trop punitif                   | Fail-forward et alternatives, pas absence de conséquences |
| Analytics envahissants               | First-party, pseudonymes, sans narration brute            |
| Testeurs polis mais non engagés      | Mesurer comportement et paiement réel                     |
| Chronique jouable coûte trop tôt     | Gate de données avant développement                       |
| Scope retarde v0.1                   | Phase 0 limitée à la mesure et aux promesses honnêtes     |

---

## 15. Ce qu'il ne faut pas développer pour valider Velkhar

- deuxième univers ;
- multijoueur ;
- workshop ;
- créateur de mondes ;
- réseau social ;
- génération d'images à chaque scène ;
- grande World Map avant preuve de besoin ;
- dizaines de vocations ;
- battle pass, daily reward ou streak ;
- profil complexe ;
- marketplace ;
- modèle de relation complet pour chaque figurant ;
- table `WorldTrace` si une projection suffit ;
- preview IA payant à chaque action libre ;
- dashboard analytics sophistiqué avant données fiables.

---

## 16. Garde-fous de décision

### Continuer et amplifier

Après au moins 50 joueurs externes activés :

- complétion proche ou supérieure à 40 % ;
- deuxième run spontané J+7 proche ou supérieur à 25 % ;
- joueurs citant spontanément conséquences/mémoire, pas seulement graphisme ;
- coût variable compatible avec le prix ;
- premiers paiements ou checkouts significatifs.

### Itérer le cœur

- démarrage fort mais faible première conséquence → accélérer le premier pivot ;
- conséquence atteinte mais faible complétion → rythme/difficulté/longueur ;
- complétion forte mais faible retour → héritage et variété insuffisants ;
- forte demande de tours mais aucun paiement → offre/prix/confiance ;
- paiement puis désabonnement → qualité, répétition ou coût perçu ;
- joueurs vantent seulement l'esthétique → cœur de jeu non prouvé.

### Arrêter ou pivoter

Après plusieurs itérations avec trafic qualifié :

- très peu de joueurs commencent malgré une proposition comprise ;
- la majorité abandonne avant toute décision significative ;
- aucun retour spontané ;
- coût IA durablement incompatible avec le prix accepté ;
- les joueurs préfèrent lire la Chronique plutôt que jouer ;
- la liberté d'action est perçue comme travail plutôt que plaisir.

Un pivot possible serait alors une expérience plus courte, plus structurée et centrée sur des
dilemmes jouables, pas davantage de fonctionnalités de plateforme.

---

## 17. Trackers à mettre en place

> Cette section est volontairement placée à la fin pour servir de checklist opérationnelle de
> mesure. Un tracker est un événement produit versionné, pas un log console.

### 17.1 Architecture de collecte

```text
Interaction UI non souveraine
  → POST /product-events
  → validation Zod + allowlist
  → ProductEvent

Événement mécanique souverain
  → service backend
  → ProductEvent directement

Appel IA
  → wrapper provider
  → AiUsageEvent
```

Recommandation V1 : collecte first-party dans Postgres/Supabase et vues SQL. Ne pas installer un
outil marketing complexe avant que le volume le justifie.

Stockage conceptuel :

```text
ProductEvent
├── id                 UUID interne
├── eventId            UUID unique fourni pour idempotence
├── eventName          string allowlist
├── schemaVersion      int
├── occurredAt         timestamp de l'action
├── receivedAt         timestamp serveur
├── source             client | server
├── environment        development | staging | production
├── actorId            UUID Supabase pseudonyme
├── sessionId?         UUID
├── campaignId?        UUID
├── universeId?        string
├── properties         JSON validé et borné
└── internalTester     boolean

AiUsageEvent
├── requestId          unique
├── actorId/sessionId  références pseudonymes
├── operation          scene | memory | chronicle | image | other
├── provider/model
├── tokens entrée/sortie/cache
├── latencyMs
├── estimatedCostUsd
├── providerCostUsd?   coût réconcilié si disponible
├── pricingVersion     version du tarif utilisé pour l'estimation
├── outcome
└── promptVersion
```

Index minimaux :

- `ProductEvent(eventName, occurredAt)` ;
- `ProductEvent(actorId, occurredAt)` ;
- `ProductEvent(sessionId, occurredAt)` ;
- `AiUsageEvent(sessionId, createdAt)` ;
- `AiUsageEvent(model, createdAt)` ;
- contraintes uniques sur `eventId` et `requestId`.

Les événements serveur sont écrits après succès de la transaction métier ou via un outbox fiable
si la perte d'événement devient significative. Une panne analytics ne doit jamais empêcher une
action de jeu. Les clics client utilisent `sendBeacon` ou `fetch(..., { keepalive: true })` lorsque
pertinent et ne retardent jamais la navigation.

L'auth Supabase anonyme conserve normalement le même UUID lors de la liaison de compte. Si ce
contrat change, introduire une table d'alias d'acteurs ; ne jamais tenter de réconcilier des joueurs
par email dans les requêtes analytics.

### 17.2 Schéma commun d'événement

```ts
export interface ProductEventV1 {
  eventId: string;
  eventName: ProductEventName;
  schemaVersion: 1;
  occurredAt: string;
  source: "client" | "server";
  environment: "development" | "staging" | "production";
  actorId: string; // UUID Supabase pseudonyme, anonyme ou lié
  sessionId?: string;
  campaignId?: string;
  universeId?: "velkhar";
  properties: Record<string, string | number | boolean | null>;
}
```

Contraintes :

- `eventId` unique pour l'idempotence ;
- `eventName` en allowlist ;
- propriétés validées par événement ;
- aucune PII ;
- aucune action libre/narration brute ;
- `internalTester` ou cohorte interne excluable ;
- rétention analytics documentée ;
- suppression/agrégation compatible RGPD.

### 17.3 Événements du funnel

| Événement                              | Source          | Déclencheur                    | Propriétés minimales                                     |
| -------------------------------------- | --------------- | ------------------------------ | -------------------------------------------------------- |
| `landing_viewed`                       | client          | première vue qualifiée         | `page`, `locale`, `referrerGroup`, `utm*`                |
| `velkhar_cta_clicked`                  | client          | CTA principal                  | `placement`, `page`                                      |
| `auberge_entered`                      | serveur         | hub réellement chargé          | `isAnonymous`, `returning`                               |
| `character_creation_started`           | client          | premier écran actif            | `entryPath`                                              |
| `character_created`                    | serveur         | personnage persisté            | `vocation`, `isFreeConcept`                              |
| `game_session_started`                 | serveur         | session jouable créée/reprise  | `newOrResume`, `runIndex`                                |
| `first_action_submitted`               | serveur         | première action acceptée       | `inputMode`, `choiceRisk`                                |
| `first_meaningful_consequence_reached` | serveur         | définition section 6.6         | `impact`, `traceScope`, `turnNumber`, `minutesFromStart` |
| `trace_echoed`                         | serveur         | ancienne Trace réutilisée      | `mode`, `traceScope`, `turnsSinceTrace`                  |
| `run_completed`                        | serveur         | fin souveraine                 | `endReason`, `turnCount`, `durationMinutes`              |
| `chronicle_generated`                  | serveur         | Chronique persistée            | `mood`, `generationOutcome`                              |
| `chronicle_viewed`                     | client/serveur  | lecteur ouvert réellement      | `ownChronicle`, `source`                                 |
| `chronicle_shared`                     | client          | action explicite de partage    | `channel`                                                |
| `new_run_requested`                    | client          | CTA nouvelle destinée          | `origin`, `previousEndReason`                            |
| `second_run_started`                   | serveur         | runIndex = 2                   | `hoursSinceFirstRun`, `returnTrigger`                    |
| `turn_limit_reached`                   | serveur         | cap atteint                    | `tier`, `turnsUsed`                                      |
| `more_turns_requested`                 | client          | demande explicite de continuer | `origin`, `limitState`                                   |
| `pricing_viewed`                       | client          | offre réellement visible       | `origin`, `afterValueMoment`                             |
| `plan_selected`                        | client          | choix offre                    | `planId`, `displayedPrice`                               |
| `checkout_started`                     | serveur         | session Stripe créée           | `planId`, `price`, `currency`                            |
| `checkout_completed`                   | serveur/webhook | paiement confirmé              | `planId`, `netAmount`, `currency`                        |
| `subscription_renewed`                 | serveur/webhook | renouvellement payé            | `planId`, `cycleNumber`                                  |
| `subscription_canceled`                | serveur/webhook | annulation                     | `planId`, `cycleNumber`                                  |
| `quality_issue_reported`               | serveur         | signalement sauvegardé         | `category`, `model`, `promptVersion`                     |

### 17.4 Tracker 1 — Combien commencent réellement une partie ?

Définition recommandée : une partie commence à `game_session_started`, pas au clic CTA.

```text
Start rate = acteurs uniques game_session_started
             / acteurs uniques landing_viewed
```

Diagnostics secondaires :

```text
CTA conversion = velkhar_cta_clicked / landing_viewed
Auberge load    = auberge_entered / velkhar_cta_clicked
Creation finish = character_created / character_creation_started
First action    = first_action_submitted / game_session_started
```

Segmenter par mobile/desktop, langue, source, nouveau/retour et temps de chargement.

### 17.5 Tracker 2 — Combien atteignent la première conséquence importante ?

```text
Meaningful consequence rate = acteurs uniques first_meaningful_consequence_reached
                              / acteurs uniques game_session_started
```

Mesurer également :

- médiane et p90 du nombre de tours avant conséquence ;
- minutes avant conséquence ;
- type et impact ;
- abandon avant conséquence ;
- différence choix guidé/action libre.

Le serveur émet l'événement une seule fois. Le frontend ne doit jamais l'inférer depuis une
animation.

### 17.6 Tracker 3 — Combien terminent une expédition ?

```text
Completion rate = runs run_completed / runs game_session_started
```

Segmenter :

- mort, retour Auberge, abandon ;
- vocation ;
- action libre vs choix ;
- mobile/desktop ;
- source IA/stub ;
- erreurs provider ;
- durée et nombre de tours.

Une session inactive n'est déclarée abandonnée qu'après la règle métier officielle. Ne pas compter
une simple fermeture d'onglet comme fin.

### 17.7 Tracker 4 — Combien reviennent spontanément dans les sept jours ?

Cohorte : nouveaux acteurs ayant démarré leur premier run et disposant de sept jours complets
d'observation.

```text
Spontaneous second-run D7 = acteurs second_run_started entre H+24 et H+168
                            avec returnTrigger = "spontaneous"
                            / acteurs éligibles game_session_started
```

Pendant la validation initiale, ne pas envoyer de relance dans les sept premiers jours. Le retour
est alors naturellement attribuable. Plus tard, distinguer :

- `spontaneous` ;
- `transactional_email` ;
- `marketing_email` ;
- `shared_chronicle` ;
- `direct_link` ;
- `unknown`.

Ne jamais inclure les testeurs internes ou sessions automatisées.

### 17.8 Tracker 5 — Combien demandent une nouvelle partie ou davantage de tours ?

Deux intentions différentes :

```text
New-run intent = new_run_requested / run_completed
More-turn intent = more_turns_requested / turn_limit_reached
```

Mesurer aussi la réalisation :

```text
New-run fulfillment = nouvelle game_session_started après new_run_requested
                      / new_run_requested
```

Un clic démontre une intention ; une deuxième session démarrée démontre un comportement.

### 17.9 Tracker 6 — Combien accepteraient réellement de payer ?

Ne jamais utiliser « trouve le prix raisonnable » comme équivalent d'un paiement.

```text
Pricing interest = pricing_viewed / acteurs activés
Plan intent      = plan_selected / pricing_viewed
Checkout intent  = checkout_started / plan_selected
Paid conversion = checkout_completed / acteurs activés éligibles
Renewal M+1     = subscription_renewed cycle 2 / checkout_completed cycle 1
```

Définition d'`activé` : acteur ayant atteint une première conséquence importante ou terminé un
run. Présenter l'offre avant cette valeur fausse le test.

Si paiement indisponible, suivre `founder_waitlist_joined`, mais le rapport doit l'appeler « intérêt
déclaré », jamais conversion payante.

### 17.10 Tracker 7 — Quel est le coût IA d'une partie complète ?

Chaque appel provider produit :

```ts
export interface AiUsageEvent {
  requestId: string;
  actorId: string;
  sessionId: string;
  operation: "scene" | "memory" | "chronicle" | "image" | "other";
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens?: number;
  latencyMs: number;
  estimatedCostUsd: number;
  outcome: "success" | "fallback" | "timeout" | "error";
  promptVersion: string;
  createdAt: string;
}
```

Calculs :

```text
AI cost per started run
  = somme coûts IA de la cohorte / runs démarrés

AI cost per completed run
  = somme coûts IA des runs terminés / runs terminés

AI cost per retained player
  = somme coûts IA / joueurs ayant démarré un deuxième run J+7

Gross contribution per payer
  = revenu HT - Stripe - IA - infrastructure variable
```

Afficher p50, p75, p95 et maximum. Une moyenne seule masque les très gros consommateurs.

### 17.11 Tableau de bord hebdomadaire minimal

Une page admin ou une vue SQL doit afficher :

| Bloc        | Mesure                                      |
| ----------- | ------------------------------------------- |
| Acquisition | visiteurs qualifiés, source, CTA            |
| Activation  | session démarrée, première action           |
| Valeur      | première conséquence, temps jusqu'à Trace   |
| Engagement  | complétion, durée, tours                    |
| Rétention   | deuxième run spontané J+7                   |
| Demande     | nouvelle partie, davantage de tours         |
| Revenu      | pricing, checkout, paiement, renouvellement |
| Économie    | coût/run p50-p95, marge/payant              |
| Qualité     | erreurs IA, fallback, signalements          |

Cadence :

- quotidien : erreurs, latence, coût et provider ;
- hebdomadaire : funnel, complétion et cohortes ;
- mensuel : paiement, renouvellement, marge et décision de roadmap.

### 17.12 Seuils de lancement à traiter comme hypothèses

Après au moins 50 joueurs externes activés :

| Indicateur                | Signal initial souhaité          | Interprétation si faible               |
| ------------------------- | -------------------------------- | -------------------------------------- |
| Démarrage depuis landing  | ≥ 30 %                           | promesse/friction/chargement           |
| Première conséquence      | ≥ 60 % des runs démarrés         | valeur trop tardive ou jeu trop passif |
| Complétion                | ≥ 40 %                           | rythme, difficulté ou longueur         |
| Deuxième run spontané J+7 | ≥ 25 %                           | héritage/variété insuffisants          |
| Nouvelle partie demandée  | ≥ 30 % des runs finis            | faible désir de rejouer                |
| Free → paiement           | 3–5 % des actifs éligibles       | offre, confiance, prix ou valeur       |
| Renouvellement M+1        | à établir après première cohorte | qualité durable non prouvée            |
| Coût variable             | ≤ 25–30 % revenu HT              | modèle économique fragile              |

Ces seuils ne sont pas des vérités universelles. Ils sont des règles de décision initiales à
réviser avec la distribution réelle, le canal d'acquisition et la durée des runs.

### 17.13 La règle finale

> **Un compliment n'est pas une activation. Une activation n'est pas une rétention. Une intention
> n'est pas un paiement.**

La preuve progresse ainsi :

```text
« C'est beau »
  < commence une partie
  < atteint une conséquence
  < termine
  < revient spontanément
  < demande davantage
  < paie
  < renouvelle
```

Le signal décisif reste le retour spontané. Quelqu'un qui dit « c'est magnifique » n'est pas encore
un client. Quelqu'un qui revient jouer sans rappel commence à valider le produit.
