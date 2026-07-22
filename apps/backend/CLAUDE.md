# Backend — Express + Game Master

> Lire d'abord : `../../MEMORY.md`, puis `../../docs/00-START-HERE.md`.
> Statut vivant : `../../docs/public/current-state/BACKEND_STATUS.md` + `BACKEND_NEXT.md`.
> Architecture active : `../../docs/public/tech/ARCHITECTURE_RULES.md`.
> Routeur : `../../docs/public/nav/task-router.md`.
> Canon ciblé : `../../docs/public/nav/canon-index.md` → `../../docs/public/raw/*`.

## Scope

Travailler uniquement dans `apps/backend/`, sauf changement de contrat partagé dans `packages/shared/`.
Le backend, les contrats shared et l'orchestration IA sont implémentés par Claude. Toute PR de ce
domaine met à jour `BACKEND_STATUS.md` et `BACKEND_NEXT.md` selon l'état attendu après merge,
ainsi que `RELEASE_READINESS.md` si elle change un bloqueur `phase: predeploy`.

## Principe fondamental

Suivre `../../docs/public/tech/ARCHITECTURE_RULES.md`.

## Architecture cible

```txt
src/
├── routes/                 # controllers fins
├── services/               # game engine, world-state, memory, lore, Aveugle
├── ai/                     # OpenRouter provider, context, parser, validator
├── game-rules/             # dice, stats, combat, inventory, survival
├── lore/velkhar/           # canon backend structuré
├── middleware/             # auth, error, validation, rate-limit
└── config/                 # env, clients
```

## Règles absolues

- **Lire le canon `docs/public/raw/` AVANT de coder toute mécanique de jeu** (dés, DC, dégâts, survie, conditions, économie…). Jamais de constante « provisoire, à valider plus tard » : si le canon n'a pas été lu, la valeur n'est pas écrite. Voir `../../docs/public/nav/PRIVATE_CANON_POLICY.md`. Le canon est versionné → lisible directement dans tout worktree.
- Zod validation sur toutes les routes.
- Réponses API : `{ success: boolean, data?: T, error?: string }`.
- Types partagés dans `@grimoire/shared`, jamais dupliqués.
- Output IA toujours parsé et validé avant stockage.
- Le canon Velkhar ne doit jamais être contredit.
- Le d20 et les conséquences mécaniques sont résolus côté backend.
- Le frontend ne reçoit que l'état affichable.

## Canon à lire selon tâche

Utiliser `../../docs/public/nav/task-router.md`.

## Tests

- Unitaires : `game-rules/`, `scene-validator`, `output-parser`, `lore.service`, `intent-analyzer`.
- Intégration : game engine avec provider IA mocké, routes avec validation Zod, memory retrieval avec seed data.
- Ne pas tester les providers IA externes directement.

## Commandes

```bash
pnpm type-check --filter @grimoire/backend
pnpm test --filter @grimoire/backend
pnpm dev --filter @grimoire/backend
```
