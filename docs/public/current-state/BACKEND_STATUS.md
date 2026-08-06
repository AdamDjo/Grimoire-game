---
type: backend-status
visibility: public
rag: true
source_of_truth: true
owner: backend
default_agent: claude
updated: 2026-08-06
---

# Backend Status

## Livré sur develop

- #103 et #146 — Prisma/Supabase, world-state et personnage persistants.
- #107 — auth Supabase et vérification JWT/JWKS.
- #109 — d20, conséquences et world-state souverains côté backend.
- #111 et #113 — mémoire narrative N2/N1.
- #115 et #116 — Souvenirs nommés et Chronique de fin de run.
- #147 / PR #174 — Auberge de L'Aveugle branchée à la base et aux contrats API.
- #154 et #155 — erreurs asynchrones et délimitation du texte libre dans le prompt.
- #168 / PR #178 — locale IA BCP-47 validée et persistée.
- #179 / PR #187 — canon et plan Gameplay Survie v2.
- #189 — mémoire projet, routage Claude/Codex et garde-fous `current-state`.
- #101 / PR #191 — fallback multi-modèles face aux erreurs OpenRouter.
- #180 / PR #196 — contrats partagés Survie v2 (`ConditionId`, `ActiveCondition`, `itemGained`).
- #181 / PR #198 — conditions persistées, Désavantage au d20 et priorité langue explicite du
  switcher en jeu sur la détection navigateur.
- #182 / PR #199 — paliers de Calamine et fin spéciale `calcined`, `ChronicleEndReason` dérivé de
  `SessionEndReason`.
- #183 — inventaire réel : acquisition via `item_gained` signalé par l'IA, usage/équipement/
  déséquipement joueur via `/inventory/action`, persisté et validé côté backend, et branché
  côté frontend (boutons d'action dans le panneau d'inventaire Velkhar).
- #201 — survie punitive : paliers narratifs Soif/Faim/Énergie (75/50/25) injectés dans le prompt
  IA pour narration, Désavantage non cumulatif sous 25 (réutilise `computeDisadvantage`), nouvelle
  source Calamine backend sur négligence prolongée (Faim ou Soif à 0 pendant 3+ tours, +3 à +5/tour),
  érosion de -1 PV/tour non cumulative tant que Faim ou Soif est à 0, et état universel « mourant »
  (sursis d'un tour à 0 PV, mort définitive au second passage à 0) qui remplace l'ancienne règle
  « 0 PV → inconscience ». Canon `06-SURVIVAL.md` §1/§4/§7 mis à jour en conséquence.
- #184 — repos court/feu : `game-rules/rest.ts` applique les taux canon (06-SURVIVAL §3) — court
  (+20 énergie, +1d4 PV si bandages) et feu (+60 énergie/faim/soif si provisions, +1d4+mod SANG PV
  si bandages, -10 Calamine), jauges clampées 0-100. L'IA propose `rest_requested` (`short`/`fire`,
  `inn` ignoré côté backend) sans jamais choisir les valeurs ; `resolveTurn` applique le repos et
  lève l'état « mourant » si le soin remonte le PV au-dessus de 0. Risque d'embuscade différé.
- #185 — crescendo de danger IA : nouvelle section `buildDangerCrescendoSection` dans
  `ai/system-prompt.ts` qui pousse l'IA à faire monter l'intensité physique (pivots combat/fuite/
  sauvetage réguliers) en s'appuyant sur l'état mécanique réel transmis (ratio PV, palier de
  Calamine, conditions actives, état « mourant ») — aucun état d'acte/chapitre persisté côté
  serveur (explicitement hors scope). Le backend reste seul souverain sur dés, dégâts, conditions,
  objets et fins de run ; l'IA ne fait que mettre en scène. Vérification manuelle en session
  (pas de test unitaire, conforme à la DoD du ticket).
- #186 — projection UI Survie v2 complétée dans `SceneResponse` et `InventoryActionResponse` :
  instantané `survival`, conditions actives, fer persistant et `endReason` autoritaire sont renvoyés
  au frontend après chaque scène ou action d'inventaire. Le client n'infère aucune règle critique.
- #152 — résolution du concept libre : nouvel endpoint dédié `POST /api/character/resolve-vocation`
  (appelé avant `POST /api/character`, stateless, aucune écriture Prisma) qui fait vétérinariser le
  concept libre par l'IA vers l'une des 4 vocations canon (`z.enum` côté serveur, souverain sur
  l'identifiant retenu), avec réponse union discriminée `resolved` (vocation + nom personnalisé +
  trait narratif + compétences décalées) ou `fallback` (raison explicite), toujours HTTP 200. Nom
  personnalisé et trait narratif injectés dans `ai/system-prompt.ts` pour la narration en run.
- #207 — cache d'images de scène dynamique partagé entre joueurs : nouvelle table `SceneImage`
  (`cacheKey` = `sceneType_biome_lieuType`, jamais dérivée du texte libre IA) et colonne
  `GameSession.currentImageUrl`. Classification `biome`/`lieuType` par pattern-matching de
  mots-clés canon sur le `location` texte libre (`classifyBiome`/`classifyLieuType`), toujours
  côté backend. Génération via Pollinations.ai (gratuit, sans clé API, timeout 15s), upload vers
  le bucket public Supabase Storage `scene-images` (écriture service-role, lecture publique, pas
  de policy RLS additionnelle). Résolution déclenchée à chaque chunk N2 (`compressScene`), URL
  persistée sur `currentImageUrl` et relue par tous les points de construction de scène
  (`resumeLatestScene`, `buildOpeningScene`, `resolveTurn`). Défensif de bout en bout : toute
  panne (génération, upload, course concurrentielle sur la clé unique) retombe sur `null` sans
  jamais faire échouer le tour. Doc technique `docs/public/tech/DYNAMIC_SCENE_IMAGES.md`.
- #162 — vulnérabilités npm critiques/hautes résolues (montée Next.js 16.2.11, Vitest 3,
  `pnpm.overrides` transitifs, axios retiré car inutilisé), audit CI bloquant sur `high`/`critical`,
  RLS activé sur les 9 tables Supabase (policy deny-all `anon`/`authenticated`, le backend accède
  via `postgres`/`service_role` qui bypassent RLS). Détail `docs/public/tech/SECURITY.md`.
- #162 (durcissement pentest) — vérification JWT épinglée sur `issuer`/`audience` Supabase avec rejet
  d'un token sans claim `sub`, quota anonyme rendu atomique (`updateMany` avec la garde `lt` dans le
  `WHERE`, plus de course lecture-puis-écriture), `app.set('trust proxy', 1)` et `helmet` (CSP « tout
  interdit », API JSON). Rate limit désormais clé par utilisateur : `requireAuth` monté **avant** les
  limiteurs pour que `req.auth.userId` existe, `userOrIpKey` partagé
  (`src/middleware/rate-limit-key.ts`) appliqué aux limiteurs de `index.ts` et `aveugle.routes.ts` —
  auparavant tous les joueurs derrière un même NAT partageaient un seul seau. Comme déplacer les
  limiteurs après l'authentification exposait `requireAuth` lui-même (vérification JWT contre un JWKS
  distant + upsert Prisma) au flood non authentifié, chaque route est limitée deux fois :
  `preAuthLimiter` par IP (120 req/min) en amont, puis le limiteur par utilisateur en aval.
- #162 (chaîne de modèles) — `google/gemma-4-31b-it:free` rétrogradé après mesure (429 permanent
  upstream) alors qu'il était tête de chaîne **et** repli de compression : un aller-retour complet
  gaspillé à chaque tour. Chaîne réordonnée sur la disponibilité mesurée et élargie à 5 modèles
  gratuits, plus cooldown mémoire (`src/ai/model-cooldown.ts`, 5 min) qui repousse en fin de chaîne
  tout modèle ayant répondu 429/5xx — il réordonne sans jamais retirer, pour qu'un cooldown périmé
  ne puisse pas provoquer un déni de service. Détail `docs/public/tech/SECURITY.md`.

- #162 (image de production) — `apps/backend/Dockerfile` corrigé avant tout déploiement : `CMD` pointait
  sur `dist/index.js` alors que tsup émet `dist/index.mjs` (`format: ['esm']`), donc **le conteneur
  aurait crashé au démarrage** bien que l'image se construise sans erreur. Corrigé aussi : le schéma
  Prisma est désormais copié dans le stage `deps` pour que le `postinstall` `prisma generate` puisse
  aboutir (le client généré vit dans `src/generated/prisma`, hors `node_modules`, et est inliné par
  tsup) ; le stage runner prend ses `node_modules` d'un nouveau stage `prod-deps`
  (`--prod --ignore-scripts`) au lieu du stage `deps` qui embarquait tsup/vitest/eslint ; l'API ne
  tourne plus en `root` (`USER node`). Ajout d'un `.dockerignore` (il n'y en avait aucun) : les
  `node_modules` de l'hôte — binaires macOS — entraient dans le contexte de build, et tout `.env`
  local aussi. `docker-compose.yml` : le service `backend` ne recevait ni `DATABASE_URL` ni
  `DIRECT_URL`, donc Prisma ne pouvait pas se connecter en dev local. `.env.example` (racine et
  backend) réalignés sur `src/config/env.ts` : suppression des variables mortes (`JWT_SECRET`,
  `ANTHROPIC_API_KEY`, `MISTRAL_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `PRIMARY_AI_PROVIDER`,
  `SUPABASE_SERVICE_ROLE_KEY` — le code lit `SUPABASE_SERVICE_KEY`), ajout de `DATABASE_URL`/
  `DIRECT_URL`, et retrait du défaut `OPENROUTER_MODEL=google/gemma-4-31b-it:free` (modèle rétrogradé
  pour indisponibilité). ⚠️ Image non construite localement (daemon Docker indisponible) : correctif
  établi par lecture de la sortie `tsup` et des imports externes du bundle, à confirmer au premier
  build Coolify.
- #226 (lot 1 de #214) — contrats partagés de la boucle de run. Nouveau
  `packages/shared/src/types/run.types.ts` : `RunContract` (destination, profondeur 3/5/7 plafonnée
  à 7, durée cible 45/90/150 min, prime due au retour), `DungeonFloor`/`Room`/`RoomHint`
  (l'indice dit la **nature** du danger, jamais son **ampleur**), `ReturnEstimate` (salles et minutes
  restantes, eau/vivres nécessaires, `suppliesShort`) et `RunState` (mode, profondeur courante et
  max, demi-tour engagé, objectif sécurisé). `GameMode` (`inn | exploration | combat | return`)
  est un **mode de jeu**, à ne pas confondre avec les fins de session ni avec le type de repos
  `rest_requested.type: 'inn'` que le backend ignore volontairement.
  `SessionEndReason` scindé en 5 valeurs canoniques —
  `death | extracted | returned_empty | abandon | calcined`. L'ancien `inn` confondait « rentré
  avec l'objectif » (payé) et « rentré les mains vides » (non payé) : il est **remplacé, pas
  renommé**. Comme il n'était produit que par la fin volontaire à l'auberge, sans contrat à honorer,
  les sessions existantes sont migrées en `abandon` (migration Supabase
  `split_session_end_reason_run_structure` ; aucune ligne concernée en base à ce jour).
  `ChronicleEndReason` suit par alias, et le prompt de Chronique distingue désormais les deux
  retours. Les fins `extracted`/`returned_empty` sont désormais réellement produites par le trajet
  de retour (#228). `@see docs/public/raw/23-RUN-STRUCTURE.md` §5.
- #227 (lot 2 de #214) — moteur de donjon et estimation de retour, en règles pures
  (`game-rules/dungeon.ts` et `game-rules/run.ts`, zéro Prisma, `rng` injectable comme `dice.ts`).
  `generateDescent` produit 3 salles par palier avec indice partiel et 2-3 suites au choix ; le
  plafond de 7 paliers est **structurel** (clampé même sur une valeur hors barème), garant du
  plafond dur de 2h30. La part de salles hostiles croît avec la profondeur, et un boss verrouille
  la dernière salle des paliers 5+ — sans que l'indice le distingue d'un combat ordinaire
  (règle de l'indice, §2). `generateReturn` génère un trajet **distinct** (identifiants et types
  retirés à neuf, jamais la descente à l'envers) et **strictement plus court**
  (1 salle par palier contre 3), sans boss : le retour tue par épuisement, jamais par embuscade.
  `MINUTES_PER_ROOM = 3.75` est calibré sur le barème canon plutôt que choisi rond — le contrat
  3 paliers est le contraignant (12 salles ≈ 45 min), les contrats plus profonds restant sous
  leur propre cible (5 paliers ≈ 75 min, 7 paliers ≈ 105 min).
  `computeReturnEstimate` chiffre salles, minutes, eau et vivres nécessaires plus un
  `RETURN_SAFETY_MARGIN` d'une ration : la ressource la plus rare pilote le risque
  (`safe | tight | critical`). `detectReturnWarnings` détecte le **franchissement** de seuil, y
  compris quand c'est la descente — et non la consommation — qui rend le retour inabordable ; une
  ressource déjà courte ne réalerte pas, pour que l'avertissement garde son poids. Ce lot produit
  **la donnée, pas la phrase** : la formulation en langage de personnage (§4.2) revient à
  l'injection de prompt (#228). `@see docs/public/raw/23-RUN-STRUCTURE.md` §1-§4.
- #228 (lot 3 de #214) — la boucle de run est câblée sur la session et persistée. `GameSession`
  porte le contrat (destination, profondeur visée, prime, objectif), le mode de jeu, la profondeur
  courante et max, le demi-tour engagé et l'objectif sécurisé (migration Supabase
  `add_run_structure_to_game_session` ; toutes les colonnes nullables ou par défaut, donc les
  sessions antérieures restent jouables sans panneau de run). `services/run.service.ts` est le seul
  pont entre les règles pures de #227 et la ligne persistée : il lit une session en `RunState`, la
  réécrit, et **ne contient aucune règle**. Une profondeur hors barème en base rend `readContract`
  nul plutôt que de fabriquer un run trop long — troisième garde-fou après le clamp moteur et la
  contrainte `CHECK`.
  `POST /api/game/session/start-run` accepte un contrat à l'auberge et renvoie la scène **avec
  l'estimation de retour déjà à l'écran** (§4.1) ; le demi-tour voyage sur `POST /api/game/action`
  (`engageReturn`), parce que le pivot **est** le tour que le joueur dépense. `resolveTurn` fait
  progresser le run (descente, ou remontée une fois le demi-tour engagé), détecte les
  franchissements de seuil, les injecte dans le prompt en **langage de personnage** — jamais un
  nombre, jamais une alerte d'interface (§4.2) — puis résout `extracted` / `returned_empty` au
  retour en surface. Le `SceneResponse` porte un `run` complet (profondeur, mode, estimation,
  `canDescend`) pour que le client n'infère **aucune règle**.
  ⏱️ **La progression est portée par le tour, jamais par le temps réel écoulé.** Une session laissée
  ouverte ou reprise le lendemain ne consomme rien et ne change ni la narration, ni le retour : les
  minutes affichées sont une estimation honnête pour décider, pas une horloge que le moteur relit.
  `@see docs/public/raw/23-RUN-STRUCTURE.md` §1-§6.
- #233 (lot 1 de #215) — contrats de combat et bestiaire typé. `combat.types.ts` existait depuis la
  phase 2B mais n'était **importé par aucun fichier** : écrit avant que le canon combat n'existe, il
  a été confronté au canon plutôt que repris tel quel. Deux fermetures portent tout le fichier et
  sont **structurelles, pas documentaires** : `CreatureId` énumère les 18 créatures canon et
  `CreatureVariant` les 5 variantes contrôlées — une créature inventée par l'IA, une variante hors
  table ou deux variantes cumulées produisent une valeur que le type ne peut pas représenter, donc
  qui n'atteint jamais le moteur. _Pourquoi une fermeture plutôt qu'une validation_ : une créature
  improvisée n'a ni CA, ni PV, ni comportement, ni butin — le backend ne peut pas l'arbitrer et le
  joueur ne peut pas apprendre à la combattre. La méta-progression de connaissance n'a de valeur que
  si la créature du run 8 est **la même** qu'au run 3.
  Les conditions de combat (`CombatConditionId`, §6) sont typées **séparément** de `ConditionId` :
  elles vivent et meurent dans un seul combat, là où les conditions de survie persistent sur le run.
  L'habitat du bestiaire est `CreatureHabitat` et non le `Biome` de `scene.types.ts` : ce dernier
  nomme un **lieu** et sert de clé au cache d'images, le premier est une **règle de placement** —
  d'où `anywhere`, dont les Calcinés ont besoin et qu'aucune image ne pourrait représenter.
  `CombatSnapshot` rejoint `RunSnapshot` dans `SceneResponse` : le client dessine l'interface de
  combat sans recalculer une seule règle. Ce lot ne pose **aucune valeur chiffrée** — PV, CA et
  dégâts relèvent du bestiaire (#234), et le canon devra les fournir.
  `@see docs/public/raw/03-BESTIARY.md` §1-§8, `docs/public/raw/10-COMBAT.md` §2-§7.

## Pré-déploiement restant

- #161 — API, migrations, secrets, CORS et healthcheck de production.
- #129 — golden path contre les services réels.

## Post-déploiement

- #114 — rappel sémantique pgvector.
- #117 — World events scriptés.
- #133 — échange Souvenir contre lore.

Agent assigné par défaut : **Claude**, remplaçable par Codex sur demande explicite. Coordination
frontend : #123. Epic backend : #165. Checklist release : #163.
