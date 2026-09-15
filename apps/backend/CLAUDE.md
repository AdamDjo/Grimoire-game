# Backend — Express + Game Master

> Lire d'abord : `../../MEMORY.md`, puis `../../docs/00-START-HERE.md`.
> Décisions du domaine : `../../docs/state/BACKEND.md`.
> Avancement : `gh issue list --milestone "v0.2.1 - Roguelike jouable" --state all` (GitHub, jamais un `.md`).
> Architecture active : `../../docs/tech/RULES.md`.
> Routeur : `../../docs/task-router.md`.
> Canon ciblé : `../../docs/task-router.md` → `../../docs/canon/*`.

## Scope

Travailler uniquement dans `apps/backend/`, sauf changement de contrat partagé dans `packages/shared/`.
Claude est assigné à ce domaine par défaut ; Codex suit les mêmes règles s'il reçoit explicitement
une tâche backend/shared/IA. **Par défaut, une PR ne modifie aucun document** : elle ferme son issue,
c'est suffisant. Elle met à jour `BACKEND.md` uniquement si elle a tranché un choix non évident
(pourquoi telle valeur, telle fermeture de type, tel garde-fou), et `RELEASE_READINESS.md` si elle
change un bloqueur `phase: predeploy`.

## Principe fondamental

Suivre `../../docs/tech/RULES.md`.

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

- **Lire le canon `docs/canon/` AVANT de coder toute mécanique de jeu** (dés, DC, dégâts, survie, conditions, économie…). Jamais de constante « provisoire, à valider plus tard » : si le canon n'a pas été lu, la valeur n'est pas écrite. Le canon est versionné → lisible directement dans tout worktree.
- Zod validation sur toutes les routes.
- Réponses API : `{ success: boolean, data?: T, error?: string }`.
- Types partagés dans `@grimoire/shared`, jamais dupliqués.
- Output IA toujours parsé et validé avant stockage.
- Le canon Velkhar ne doit jamais être contredit.
- Le d20 et les conséquences mécaniques sont résolus côté backend.
- Le frontend ne reçoit que l'état affichable.

## Canon à lire selon tâche

Utiliser `../../docs/task-router.md`.

## Tests

- Unitaires : `game-rules/`, `scene-validator`, `output-parser`, `lore.service`, `intent-analyzer`.
- Intégration : game engine avec provider IA mocké, routes avec validation Zod, memory retrieval avec seed data.
- Ne pas tester les providers IA externes directement.
- Appliquer le skill global `supabase-postgres-best-practices` aux schémas, migrations, requêtes,
  index et politiques RLS.
- Appliquer `e2e-testing-patterns` aux parcours réels qui traversent frontend, API et persistance.

## Commandes

```bash
pnpm type-check --filter @grimoire/backend
pnpm test --filter @grimoire/backend
pnpm dev --filter @grimoire/backend
```
