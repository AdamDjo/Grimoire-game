---
type: backend-status
visibility: public
rag: true
source_of_truth: true
owner: backend
default_agent: claude
updated: 2026-07-26
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

## Pré-déploiement restant

- #161 — API, migrations, secrets, CORS et healthcheck de production.
- #129 — golden path contre les services réels.

## Post-déploiement

- #114 — rappel sémantique pgvector.
- #117 — World events scriptés.
- #133 — échange Souvenir contre lore.

Agent assigné par défaut : **Claude**, remplaçable par Codex sur demande explicite. Coordination
frontend : #123. Epic backend : #165. Checklist release : #163.
