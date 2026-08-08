# Plan — Résolution de la vocation host du concept libre (#152)

> Canon `docs/public/raw/07-CHARACTER-CREATION.md` §2 étape 4. Bloqueur `phase: predeploy`
> (`RELEASE_READINESS.md` — ligne « Concept libre »).
> Répartition : **Claude = backend + frontend**, décidé explicitement par l'utilisateur (le défaut
> recommandé était backend seul — écarté pour livrer le veto joueur dans le même ticket).
> Règle absolue : le backend décide tout — l'IA propose une vocation host parmi les 4 presets
> canon, jamais une 5ᵉ inventée ; contrainte imposée par validation Zod (`z.enum`), pas par le prompt.

---

## Constat de départ

Aujourd'hui, quand un joueur écrit un concept libre (`freeConcept`) au lieu de choisir un preset,
`character.service.ts` retombe silencieusement sur `DEFAULT_HOST_VOCATION_ID = 'watcher'` — aucune
résolution IA n'existe. Le canon (`07-CHARACTER-CREATION.md` §2 étape 4) demande que L'Aveugle
identifie la vocation host parmi les 4 presets, l'annonce en jeu, personnalise nom/compétences/trait
narratif, et laisse un veto explicite au joueur. Le frontend anticipe déjà ce flow avec un texte
statique jamais résolu (`customPathPending`, fr.json:190/en.json:190) et `getResumeStep` a un bug
confirmé : une fois `freeConceptSchema` validé, le chemin `custom` saute directement à
`history`/`summary` sans jamais résoudre `vocationId`.

## Décisions actées avec l'utilisateur

1. **Endpoint séparé** : nouvel endpoint `POST /api/character/resolve-vocation`, appelé par le
   frontend avant `POST /api/character`, plutôt que de fusionner la résolution dans l'appel de
   création existant.
2. **Scope backend + frontend** dans ce même ticket (le veto joueur doit être livré, pas juste
   l'API).

---

## 1. Contrats partagés (`packages/shared`)

Ajouter les types de résolution de vocation (proposition IA + fallback), et étendre le type
`Character` exposé au frontend avec les 3 champs de personnalisation (nom de vocation
personnalisé, trait narratif, compétences décalées). `POST /api/character/resolve-vocation` est
**stateless** — aucune écriture Prisma — pour ne jamais laisser un état orphelin si le joueur
abandonne après avoir vu la proposition.

Réponse discriminée : succès (`status: 'resolved'`) avec `vocationId` parmi les 4 presets canon +
nom/trait/compétences personnalisés, ou fallback (`status: 'fallback'`, `reason:
'unintelligible_concept' | 'ai_unavailable'`) — toujours en HTTP 200, jamais en 4xx/5xx, pour que le
frontend traite ce cas comme une issue métier légitime et non une erreur réseau.

## 2. Migration Prisma

`Character` gagne 3 champs nullable :

- `customVocationName String?`
- `narrativeTrait String?`
- `shiftedSkills Json? @default("[]")`

`prisma migrate dev --name add_vocation_resolution_fields` puis `prisma generate`.

## 3. Nouveau service IA (pattern à 3 couches, cf. `aveugle.service.ts`)

- `apps/backend/src/ai/vocation-resolution-validator.ts` — schéma Zod
  `z.discriminatedUnion('understood', [...])`, avec `vocationId: z.enum(['salt-walker',
'shadow-blade', 'watcher', 'word-weaver'])` qui rejette mécaniquement toute 5ᵉ vocation
  halluciné, quel que soit le comportement du prompt.
- `apps/backend/src/services/vocation-resolution.service.ts` — construit le prompt à partir du
  `freeConcept`, appelle `callOpenRouter`, `JSON.parse` défensif, valide, retourne le statut
  `resolved`/`fallback` sans jamais persister. Résolution de la locale joueur via
  `prisma.user.findUnique` (pas de `GameSession`/`Character` disponible à ce stade — impossible de
  réutiliser `resolvePlayerLocale` tel quel).

## 4. `character.service.ts`

- Supprimer `DEFAULT_HOST_VOCATION_ID` et le fallback silencieux.
- `vocationId` devient requis dans `CreateCharacterServiceInput` — absence ⇒
  `InvalidCharacterInputError` explicite. Le vrai filet de sécurité est désormais le choix explicite
  du joueur après une réponse `fallback`, pas une supposition serveur cachée.
- Persister les 3 nouveaux champs (`customVocationName`, `narrativeTrait`, `shiftedSkills`) quand
  fournis.

## 5. Routes

- `character.schema.ts` : `vocationId` requiert désormais une valeur ; nouveau
  `resolveVocationSchema` pour le nouvel endpoint.
- `character.routes.ts` : nouvelle route `POST /api/character/resolve-vocation` avec un rate
  limiter dédié plus strict (miroir du `gameLimiter` d'`aveugleRouter`), distinct de l'`apiLimiter`
  global utilisé par `POST /api/character` qui n'appelle pas l'IA.

## 6. `system-prompt.ts`

Injecter `customVocationName`/`narrativeTrait` dans le prompt du Game Master (zone identifiée
~ligne 331) pour que L'Aveugle mette en scène la vocation personnalisée pendant la partie.

## 7. Tests backend

- `vocation-resolution-validator.test.ts` (nouveau).
- `vocation-resolution.service.test.ts` (nouveau).
- `character.service.test.ts` — retirer le test de fallback `watcher` obsolète, ajouter les cas
  `vocationId` requis / erreur explicite.
- `character.routes.test.ts` (nouveau — n'existe pas encore).

**Checkpoint** : `pnpm type-check --filter @grimoire/backend && pnpm test --filter @grimoire/backend`.

## 8. Frontend — state machine

`_lib/character-create-model.ts` :

- Bump `CharacterCreateDraft.version` : `1 → 2` (invalide proprement les drafts `sessionStorage`
  incompatibles via `z.literal(2)` dans `storedDraftSchema` — pas de migration manuelle nécessaire,
  état de session court-vécu).
- Nouveau champ `vocationResolutionStatus: 'idle' | 'pending' | 'resolved' | 'fallback' | 'error'`
  - `customVocationName`/`narrativeTrait`/`shiftedSkills`.
- Pas de 6ᵉ step ajouté à `CHARACTER_CREATE_STEPS` — le veto est une sous-vue de l'étape `vocation`
  existante, pour ne pas casser `GameStepper`/`getCompletedSteps`.
- `getResumeStep` : le chemin `custom` ne peut plus atteindre `history`/`summary` tant que
  `vocationResolutionStatus !== 'resolved'` ou que `vocationId` est vide — corrige le bug confirmé.

## 9. Frontend — API + UI

- `_lib/api.ts` : nouvelle fonction `resolveVocation(freeConcept)`, extension de
  `toCreateCharacterInput`.
- `CharacterCreateFlow.tsx` : nouvelle sous-vue proposition/veto dans l'étape `vocation`
  (états idle/pending/resolved/fallback/error, réutilise `GameButton` avec `loading`,
  `ArchetypeCard` pour afficher la proposition, pattern erreur/retry de `AveugleHub.tsx`). Mise à
  jour de l'étape `summary`. Suppression de la clé i18n statique `customPathPending`, ajout des
  nouvelles clés `fr.json`/`en.json`.

## 10. Tests frontend

- `character-create-model.test.ts`, `CharacterCreateFlow.test.tsx` — mise à jour.
- Vérifier `aveugle-hub-model.test.ts`/`AveugleHub.test.tsx` pour sensibilité à la forme du draft
  stocké.

**Checkpoint** : `pnpm type-check --filter @grimoire/frontend && pnpm test --filter @grimoire/frontend`.

## 11. Docs à mettre à jour

`BACKEND_STATUS.md`, `BACKEND_NEXT.md`, `FRONTEND_STATUS.md`, `FRONTEND_NEXT.md`,
`RELEASE_READINESS.md` (ligne `Concept libre | À trancher | #152` → `Livré`, revérifier le
paragraphe Go/No-Go après édition de la table).

---

## Ordre d'implémentation

1. `packages/shared` (types).
2. Migration Prisma.
3. `vocation-resolution-validator.ts` + `vocation-resolution.service.ts`.
4. `character.service.ts`.
5. `character.schema.ts` + `character.routes.ts`.
6. `system-prompt.ts`.
7. Tests backend + checkpoint.
8. `character-create-model.ts` v2.
9. `_lib/api.ts`.
10. `CharacterCreateFlow.tsx` + i18n.
11. Tests frontend + checkpoint.
12. Docs (5 fichiers).
13. Commit(s) + PR → `develop`, ferme #152.
