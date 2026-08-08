---
type: backend-domain
visibility: public
rag: true
source_of_truth: true
owner: backend
default_agent: claude
---

# Backend — état et file d'attente

> **Où en est le projet ?** → `gh issue list --milestone "v0.2.0 - Roguelike jouable"`. GitHub porte l'avancement.
> Ce fichier porte les **décisions d'architecture** prises en implémentant, celles qu'un ticket fermé
> ne conserve pas.

Priorité courante : refonte roguelike (décision du 2026-08-06, cf. [[PROJECT_STATUS]]).
Canon de référence : `docs/public/raw/23-RUN-STRUCTURE.md`, `10-COMBAT.md`, `03-BESTIARY.md`.

Ordre de dépendance : `#214 → #215 → #216 → #217 → #220/#221`.
Transverse à #214 et #221 : la méta-progression de connaissance (`PlayerKnowledge`) persiste
bestiaire, routes, contrats et sujets — **jamais de puissance** (`14-META-WORLD.md` §1bis).

## Décisions d'implémentation

Une entrée n'est ajoutée ici que si elle explique un **choix non évident** : pourquoi telle valeur,
pourquoi telle fermeture de type, pourquoi tel garde-fou. Le simple fait qu'un ticket soit livré se
lit sur GitHub.

### Boucle de run — #214

- **`SessionEndReason` scindé en 5 valeurs** — `death | extracted | returned_empty | abandon |
calcined`. L'ancien `inn` confondait « rentré avec l'objectif » (payé) et « rentré les mains
  vides » (non payé) : il est **remplacé, pas renommé**. Comme il n'était produit que par la fin
  volontaire à l'auberge, sans contrat à honorer, les sessions existantes sont migrées en `abandon`
  (migration `split_session_end_reason_run_structure`). #226
- **`GameMode` ≠ fin de session ≠ type de repos** — `inn | exploration | combat | return` est un
  **mode de jeu**. Ne pas le confondre avec `rest_requested.type: 'inn'`, que le backend ignore
  volontairement. #226
- **Le plafond de 7 paliers est structurel**, clampé même sur une valeur hors barème : c'est le
  garant du plafond dur de 2h30. Trois garde-fous indépendants — clamp moteur, contrainte `CHECK`,
  et `readContract` qui rend nul plutôt que de fabriquer un run trop long. #227 #228
- **`MINUTES_PER_ROOM = 3.75`** est calibré sur le barème canon, pas choisi rond. Le contrat
  3 paliers est le contraignant (12 salles ≈ 45 min) ; les contrats plus profonds restent sous leur
  propre cible (5 paliers ≈ 75 min, 7 paliers ≈ 105 min). #227
- **Le retour est un trajet distinct**, jamais la descente à l'envers : identifiants et types tirés
  à neuf, 1 salle par palier contre 3, aucun boss. Le retour tue par épuisement, jamais par
  embuscade. #227
- **L'indice dit la nature du danger, jamais son ampleur** — un boss verrouille la dernière salle
  des paliers 5+ sans que l'indice le distingue d'un combat ordinaire (§2). #227
- **`detectReturnWarnings` détecte le franchissement**, y compris quand c'est la _descente_ — et non
  la consommation — qui rend le retour inabordable. Une ressource déjà courte ne réalerte pas, pour
  que l'avertissement garde son poids. #227
- **L'avertissement est injecté en langage de personnage** — jamais un nombre, jamais une alerte
  d'interface (§4.2). #228
- **⏱️ La progression est portée par le tour, jamais par le temps réel.** Une session laissée ouverte
  ou reprise le lendemain ne consomme rien : les minutes affichées sont une estimation honnête pour
  décider, pas une horloge que le moteur relit. #228
- **`services/run.service.ts` ne contient aucune règle** — seul pont entre les règles pures et la
  ligne persistée. L'arbitrage reste dans `game-rules/`, qui ignore Prisma. #228

### Combat et bestiaire — #215

- **`CreatureId` (18) et `CreatureVariant` (5) sont des unions fermées**, pas de la documentation :
  une créature inventée par l'IA produit une valeur que le type ne peut pas représenter, donc qui
  n'atteint jamais le moteur. _Pourquoi fermer plutôt que valider_ : une créature improvisée n'a ni
  CA, ni PV, ni comportement, ni butin — le backend ne peut pas l'arbitrer et le joueur ne peut pas
  apprendre à la combattre. La méta-progression n'a de valeur que si la créature du run 8 est **la
  même** qu'au run 3. #233
- **`CombatConditionId` est typé séparément de `ConditionId`** — les conditions de combat vivent et
  meurent dans un seul combat, les conditions de survie persistent sur le run. #233
- **`CreatureHabitat` ≠ `LieuType`** — le second nomme un _lieu_ et sert de clé au cache d'images, le
  premier est une _règle de placement_. D'où `anywhere`, dont les Calcinés ont besoin et qu'aucune
  image ne pourrait représenter. #233
- **Les chiffres du bestiaire sont dérivés, pas inventés.** Le canon donne comportements, habitats et
  tiers de butin mais aucun PV/CA/dégât par créature. Plutôt que reporter le lot ou écrire des
  constantes provisoires, la table dérive des seules ancres existantes : `PV = 10 + SANG`
  (référence ≈ 11 PV), CA 11 en cuir (`10-COMBAT §4`), les deux CA imprimées telles quelles
  (Calciné rampant 12, Veilleur 18) et l'échelle d'armes de `08-DICE-RESOLUTION §7`.
  _Pourquoi celle-ci_ : à 11 PV, les dégâts se lisent en **tours avant de mourir** et les PV en
  **tours pour la tuer** — la seule échelle que le joueur ressent. #234
- **Les tests verrouillent la calibration, pas la présence des entrées** : « je gère » = rien ne tue
  en moins de 4 tours aux paliers 1-2, « ça coûte » = rien ne tue en 2 tours aux paliers 3-4, « je
  devrais remonter » = tout ce qui tue en ≤ 2 tours vit au palier 5+. Ils ont rattrapé deux erreurs
  d'équilibrage à l'écriture. #234
- **`minDepth`/`maxDepth` rendent l'anti-règle « jamais de légendaire aux paliers 1-2 »
  structurelle** plutôt que confiée au tirage de rencontres. `creaturesForReturn` ne puise que dans
  les paliers déjà traversés. #234
- **Deux créatures refusent le statut de sac à PV** via `CreatureEngagement` : le Vent-Gris est un
  `hazard` à 0 PV — le canon dit « on ne le combat pas, on le fuit », donc attaquer un nuage ne doit
  pas être une option que le moteur propose puis punit — et le Mangeur de Souvenir un `drain`, au
  plus faible dégât des rares, parce que son coût est un souvenir et non des PV. #234
- **`applyVariant` n'accepte qu'une variante** : « Calciné ancien affamé en meute » est
  irreprésentable (§6ter, garde-fou d'unicité). #234

### Survie et conditions

- **État « mourant » universel** — sursis d'un tour à 0 PV, mort définitive au second passage à 0.
  Remplace l'ancienne règle « 0 PV → inconscience ». Canon `06-SURVIVAL.md` §7. #201
- **Érosion et Calamine de négligence non cumulatives** — -1 PV/tour tant que Faim _ou_ Soif est à 0
  (jamais les deux additionnés), Calamine backend au-delà de 3 tours de négligence (+3 à +5/tour).
  Désavantage non cumulatif sous 25. #201
- **L'IA propose le repos, le backend fixe les valeurs** — `rest_requested` (`short`/`fire`, `inn`
  ignoré) ; les taux canon (`06-SURVIVAL §3`) sont appliqués côté serveur, jauges clampées 0-100. #184
- **Le crescendo de danger n'a aucun état persisté** — `buildDangerCrescendoSection` s'appuie sur
  l'état mécanique réel transmis (ratio PV, palier de Calamine, conditions, mourant). Aucun état
  d'acte/chapitre serveur, explicitement hors scope. #185

### Images de scène — #207

- **La clé de cache est reclée sur la profondeur, jamais sur le texte IA.** Le contenu n'est pas un
  monde ouvert à biomes mais une descente en paliers : la variable qui change l'image est la
  **profondeur atteinte**. `depthBandOf` découpe les 7 paliers exactement là où le bestiaire découpe
  ses tiers de danger (`surface | upper | mid | deep | abyss`), et la profondeur vient de l'état du
  run — une image ne peut donc plus contredire le palier réel. `classifyBiome` a été **supprimé**.
- **Un palier hors bornes retombe sur une bande valide plutôt que de lever** : un tour ne doit pas
  échouer parce qu'il cherchait à s'illustrer. Toute panne (génération, upload, course sur la clé
  unique) retombe sur `null` sans faire échouer le tour.
- Détail : `docs/public/tech/DYNAMIC_SCENE_IMAGES.md`.

### Sécurité et infrastructure — #162

- **Rate limit à deux étages** — `requireAuth` doit précéder le limiteur par utilisateur pour que
  `req.auth.userId` existe, mais cela exposait `requireAuth` (JWT contre JWKS distant + upsert
  Prisma) au flood non authentifié. D'où `preAuthLimiter` par IP (120 req/min) en amont, puis le
  limiteur par utilisateur en aval. Auparavant tous les joueurs derrière un même NAT partageaient un
  seul seau (`src/middleware/rate-limit-key.ts`).
- **Quota anonyme atomique** — `updateMany` avec la garde `lt` dans le `WHERE`, plus de course
  lecture-puis-écriture. JWT épinglé sur `issuer`/`audience`, rejet d'un token sans claim `sub`.
- **RLS activé sur les 9 tables** (policy deny-all `anon`/`authenticated`) ; le backend accède via
  `postgres`/`service_role` qui bypassent RLS.
- **Le cooldown de modèles réordonne sans jamais retirer** (`src/ai/model-cooldown.ts`, 5 min) : un
  cooldown périmé ne doit pas pouvoir provoquer un déni de service. `gemma-4-31b-it:free` rétrogradé
  après mesure (429 permanent) alors qu'il était tête de chaîne **et** repli de compression.
- **⚠️ Dockerfile corrigé mais non construit localement** (daemon indisponible) : `CMD` pointait sur
  `dist/index.js` alors que tsup émet `dist/index.mjs` — le conteneur aurait crashé au démarrage bien
  que l'image se construise. À confirmer au premier build Coolify. Détail
  `docs/public/tech/SECURITY.md`.

### Contrats et mémoire

- **La mémoire interne est en pivot anglais fixe**, indépendante de la locale de narration : un
  changement de langue en cours de run ne doit jamais traduire ni corrompre le canon. #168
- **Le client n'infère aucune règle** — `SceneResponse` et `InventoryActionResponse` portent
  l'instantané de survie, les conditions actives, le fer persistant, le `run` complet
  (`canDescend` inclus), le `CombatSnapshot` et le `endReason` autoritaire. #186 #228 #233
- **`POST /api/character/resolve-vocation` est stateless** (aucune écriture Prisma, toujours HTTP 200) : l'IA propose une des 4 vocations canon, le serveur reste souverain sur l'identifiant retenu
  via `z.enum`. Réponse en union discriminée `resolved` | `fallback`. #152

## Dette et suivis connus

- Montée `express-rate-limit` v7 → v8 pour envelopper le repli IP de `userOrIpKey` dans
  `ipKeyGenerator` (/64 IPv6).
- Re-mesure périodique de la disponibilité des modèles `:free` — le catalogue OpenRouter tourne.
- #129 est **à re-scoper** : son golden path valide un parcours (landing → auberge → session) qui ne
  décrit plus le jeu après la refonte.
- Premier build Coolify à vérifier (cf. Dockerfile ci-dessus).

## Règles de tenue de ce fichier

- On y écrit **pourquoi**, pas **quoi** ni **quand**. L'avancement vit sur GitHub, la chronologie
  dans [[log]].
- Pas de champ `updated:` — il mentait ; `git log -1 --format=%cs -- <fichier>` est la seule date fiable.
- Une PR ne touche ce fichier **que** si elle a pris une décision non évidente. Une PR de routine ne
  touche aucun document.
