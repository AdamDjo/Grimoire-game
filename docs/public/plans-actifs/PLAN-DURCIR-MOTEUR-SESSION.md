# PLAN — Durcir le moteur de session backend (A1 + A2) · Phase 1B

> **Doc de reprise.** Si je reviens plus tard, je lis ce fichier + l'issue GitHub du chantier et je reprends où j'en étais.
> **d20 souverain + world-state persistant.** Rapatrier au backend les règles aujourd'hui simulées au front.
> **Dernière mise à jour** : 2026-07-12.

---

## 0. Contexte de travail (à relire en premier)

- **Worktree parallèle.** Codex bosse sur le dossier principal (`/Users/adembenmessaoud/dev/EpisodeRPG-game`, branche `feature/93-ui-kit-grimoire-complet` = UI Kit). Claude bosse dans le worktree `/Users/adembenmessaoud/dev/EpisodeRPG-game-claude`.
- ⚠️ **Ne jamais toucher au dossier principal** (c'est celui de Codex).
- ⚠️ **Canon gitignored** : `docs/public/raw/*.md` (les GDD) n'existent QUE dans le dossier principal. Pour les relire → `/Users/adembenmessaoud/dev/EpisodeRPG-game/docs/public/raw/` (lecture seule).
- **Règles git absolues** : issue → branche → PR, jamais de commit sans demande explicite, jamais sur `main`/`develop`, jamais de `Co-Authored-By: Claude`, messages courts `type(#n): résumé`. `feature/*` → `develop`.
- Chantier suivant l'auth #107 (PR [#108](https://github.com/AdamDjo/Grimoire-game/pull/108)).

---

## 1. Le problème

L'invariant **"Backend = Game Master, AI = prose only"** (`docs/public/tech/ARCHITECTURE_RULES.md`) est **violé** :
`_lib/consequences.ts` simule d20 + conséquences + drain côté front (démo #99, marqué "disposable").
Le backend a `rollCheck()` complet dans `dice.ts` mais il n'est **appelé nulle part**.
`POST /api/game/action` est **stateless** : `turnNumber: 1` hardcodé, `sessionId ?? randomUUID()`,
`void choiceId`, character reçu du body client.

On rapatrie la souveraineté des règles au backend et on rend la session **persistante**.

---

## 2. Décisions actées (grilling — 11)

| #   | Décision                                                                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Chantier A** — durcir le moteur backend (pas d'écran neuf)                                                                                                                                                              |
| 2   | **Scope A1 + A2** dans **1 seul ticket** (couplés) ; A3 (mémoire narrative) = ticket séparé                                                                                                                               |
| 3   | **B** — le backend dérive l'attribut testé + les conséquences depuis `type`+`riskLevel` ; IA = prose only                                                                                                                 |
| 4   | `game-rules/` en **fonctions pures**, split `dice.ts` / `survival.ts` / `consequences.ts`                                                                                                                                 |
| 5   | **DB = source de vérité** ; le client n'envoie que `sessionId` + `choiceId` (+ action libre), plus aucune stat                                                                                                            |
| 6   | `POST /api/game/session` **seed Yarel idempotent** (1 Character/user) — départ provisoire jusqu'à la Forge                                                                                                                |
| 7   | **Game-over** : `hp<=0` → `session.status='ended'` + `endReason='death'`, dernier Scene `gameOver=true`, action sur session terminée refusée. **Zéro texte de fin en A1**, hooks Chronique/Souvenirs/héritage **vacants** |
| 8   | **`endReason`** (`'death'\|'inn'\|'abandon'`) posé dès A1 = seul pont vers A3                                                                                                                                             |
| 9   | **`DiceRoll`** déplacé dans `@grimoire/shared` (backend l'importe), ajouté à `SceneResponse.diceRoll?`                                                                                                                    |
| 10  | `DIFFICULTY_TARGET` **backend gagne** (medium:12/high:16/deadly:19) ; le front perd ses constantes                                                                                                                        |
| 11  | **Suppression pure** de `_lib/consequences.ts` ; le front lit stats + dé depuis `SceneResponse`                                                                                                                           |

**Ancré canon** (lu pendant le grilling) : la mort déclenche en A3 la Chronique (`17-RUN-CHRONICLE`) +
Souvenirs nommés (`14-META-WORLD` §2, `16-MEMORY` §6) + héritage (`17-RUN-CHRONICLE` §8).
Le canon confirme l'invariant B : **le backend décide** qu'un moment devient Souvenir (l'IA ne fait que
suggérer un candidat). A1 pose juste `endReason` ; tout le reste est A3.

---

## 3. Ce qui existe déjà (câblage, pas greenfield)

- ✅ `rollCheck()` complet — `apps/backend/src/game-rules/dice.ts` (jamais appelé)
- ✅ `DiceRoll` + `DIFFICULTY_TARGET` — dans `dice.ts` (à déplacer vers shared)
- ✅ `ChoiceConsequence` avec `gameOver?` — `packages/shared/src/types/scene.types.ts`
- ✅ `SceneResponse` (scene + updatedStats + updatedInventory + notifications) — même fichier
- ✅ `GameSession` (turnNumber, location, status) + `SceneLog` (JSON: choices, chosenChoice, consequences, diceRoll, source) — `apps/backend/prisma/schema.prisma`
- ✅ `Character` avec toutes les jauges (hp/maxHp/thirst/hunger/energy/calamine, conditions) — même schema
- ✅ `attributeModifier` — `@grimoire/shared`

---

## 4. Fichiers à modifier

### Shared — `packages/shared/`

- **`src/types/dice.types.ts` (nouveau)** — déplacer l'interface `DiceRoll` de `dice.ts` ici (`roll, modifier, total, target, success, critical: 'success'|'failure'|null`). Le backend l'importera de shared.
- **`src/types/scene.types.ts`** — ajouter `diceRoll?: DiceRoll` à `SceneResponse` (import depuis `./dice.types`).
- **`src/index.ts`** — ré-exporter `dice.types`.

### Backend — `apps/backend/`

- **`prisma/schema.prisma`** — `GameSession` : ajouter `endReason String?` (nullable, `'death'|'inn'|'abandon'` app-side). Nouvelle migration.
- **`src/game-rules/dice.ts`** — retirer l'interface `DiceRoll` locale, l'importer de `@grimoire/shared`. Garder `rollCheck` + `DIFFICULTY_TARGET`.
- **`src/game-rules/survival.ts` (nouveau — pure)** — drain par tour (thirst/hunger/energy/…), clamp 0..max. Aligner sur le canon survie (`06-SURVIVAL` à relire à l'implémentation, pas les constantes front arbitraires).
- **`src/game-rules/consequences.ts` (nouveau — pure)** — dérive l'attribut testé + la difficulté depuis `Choice.type`+`riskLevel` ; applique les deltas de `ChoiceConsequence` ; détecte `hp<=0` → `gameOver`. Aucune I/O, `rng` injecté (testable).
- **`src/services/session.service.ts` (nouveau)** — `getOrCreateSession(userId)` (seed Yarel idempotent, 1 Character/user, GameSession active) + `resolveTurn({ session, character, choiceId, freeAction })` (lit DB → rollCheck → survival → consequences → persiste SceneLog + met à jour Character + GameSession → renvoie `SceneResponse`).
- **`src/routes/game.routes.ts`** — `POST /api/game/session` (nouveau, état initial) + refonte `POST /api/game/action` (stateful : charge session+character via `req.auth.userId`, refuse si `status==='ended'` → 409, `resolveTurn`, renvoie `SceneResponse` avec `diceRoll`). Plus de `randomUUID()`, plus de `turnNumber:1`, plus de character du body.
- **`src/routes/game-action.schema.ts`** — réduire le body à `{ sessionId, choiceId, freeAction?, locale? }`. Retirer `character` et tout stat client.
- **`src/services/scene-assembler.ts`** — poser `turnNumber` réel (depuis la session), propager `consequences`/`gameOver`.

### Frontend — `apps/frontend/`

- **`src/app/(game)/velkhar/session/[id]/_lib/consequences.ts`** — **SUPPRESSION PURE**. Retirer tous les usages.
- **`src/app/(game)/velkhar/session/[id]/` (SessionClient + composants)** — ne plus appeler `resolveChoice()`. Au mount : `POST /api/game/session` (état initial persistant). Par tour : POST `{ sessionId, choiceId }` → lire `updatedStats` + `diceRoll` de `SceneResponse`. Le composant dé lit `SceneResponse.diceRoll` (type shared). Stats **uniquement** depuis la réponse backend.

---

## 5. Hors scope (explicite)

- **A3 entier** : Chronique, Souvenirs nommés, héritage, `world_events`, pgvector, mémoire N1/N2/N3.
- **La Forge** (Character Create) : chantier **suivant**, confirmé.
- **RLS Postgres** : dette explicite (#107 décision #7).
- Génération de texte de fin de run (c'est la Chronique = A3).

---

## 6. Vérification

- `pnpm type-check --filter @grimoire/shared` + `--filter @grimoire/backend` + `--filter @grimoire/frontend`
- `pnpm lint`
- `pnpm --filter @grimoire/backend prisma migrate dev` (migration `endReason`)
- **Tests** : unitaires `dice.ts`, `survival.ts`, `consequences.ts` (pures, `rng` injecté → déterministe). Cas : nat 20 succès forcé, nat 1 échec forcé, `hp<=0` → `gameOver`, action sur session `ended` → refus.
- **Live** : anonyme → session créée en DB → jouer un tour → dé affiché = celui du backend, stats = DB → jouer jusqu'à `hp<=0` → écran de fin `gameOver`, actions bloquées.
- Lecture manuelle : `game-action.schema.ts` sans `character`/stats ; `_lib/consequences.ts` supprimé ; front ne recalcule aucune stat.

---

## 7. Points à confirmer avant de lancer l'issue

1. **1 ticket A1+A2** (recommandé, couplés) vs 2 tickets.
2. **Titre issue** proposé : _"Durcir le moteur de session backend : d20 souverain + world-state persistant (A1+A2)"_

---

## 8. Prochaines étapes (ordre des règles git)

1. Créer l'**issue GitHub** (issue avant branche).
2. Créer la branche `feature/<n>-durcir-moteur-session` depuis `develop` à jour.
3. Implémentation (APEX `-x -t -v -b` recommandé, ou direct).
4. PR → `develop`, body `Closes #<n>`.
