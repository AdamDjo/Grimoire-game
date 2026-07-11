# Backend — Express + Game Master

> Lire d'abord : `../../docs/00-START-HERE.md`, puis `../../docs/public/current-state/PROJECT_STATUS.md`.
> Statut vivant : `../../docs/public/current-state/PROJECT_STATUS.md`.
> Architecture active : `../../docs/public/tech/ARCHITECTURE_RULES.md`.
> Routeur : `../../docs/public/wiki/task-router.md`.
> Canon ciblé : `../../docs/public/wiki/canon-index.md` → `../../docs/private/raw/*`.

## Scope

Travailler uniquement dans `apps/backend/`, sauf changement de contrat partagé dans `packages/shared/`.

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

- Zod validation sur toutes les routes.
- Réponses API : `{ success: boolean, data?: T, error?: string }`.
- Types partagés dans `@grimoire/shared`, jamais dupliqués.
- Output IA toujours parsé et validé avant stockage.
- Le canon Velkhar ne doit jamais être contredit.
- Le d20 et les conséquences mécaniques sont résolus côté backend.
- Le frontend ne reçoit que l'état affichable.

## Canon à lire selon tâche

Utiliser `../../docs/public/wiki/task-router.md`.

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
