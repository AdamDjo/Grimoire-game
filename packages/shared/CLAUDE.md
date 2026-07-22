# Shared Package Agent Instructions

> Lire d'abord : `../../MEMORY.md`, puis `../../docs/00-START-HERE.md`.
> Statut vivant : `../../docs/public/current-state/BACKEND_STATUS.md` + `BACKEND_NEXT.md`.
> Contrats actifs : `../../docs/public/tech/ARCHITECTURE_RULES.md`.

## Scope

This agent works ONLY on `packages/shared/`. Never modify files outside this directory.
Claude owns shared contracts. A shared-contract PR updates `BACKEND_STATUS.md` and
`BACKEND_NEXT.md`; Codex consumes the merged contract from a separate frontend PR.

## Purpose

Single source of truth for all TypeScript types and constants shared between frontend and backend. Published as `@grimoire/shared`.

## Directory Structure

```
src/
├── types/              # All TypeScript interfaces & types
│   ├── api.types.ts
│   ├── character.types.ts
│   ├── combat.types.ts
│   ├── inventory.types.ts
│   ├── quest.types.ts
│   ├── scene.types.ts
│   ├── session.types.ts
│   └── universe.types.ts
├── constants/          # Game constants (races, classes, templates)
│   ├── races.ts
│   ├── classes.ts
│   └── universe-templates.ts
└── index.ts            # Barrel export (re-exports everything)
```

## Rules

- Types/Interfaces: `PascalCase` (e.g., `GameSession`)
- Constants: `UPPER_SNAKE_CASE` for values, `camelCase` for helper functions
- Files: `kebab-case.ts`
- Named exports only
- ZERO runtime dependencies - types and constants only
- Always update `index.ts` when adding new exports
- Any type used by both frontend AND backend must live here
- Never import from `apps/frontend` or `apps/backend`

## When to Modify

- Before implementing a new feature in backend/frontend, define types here first
- When a backend/frontend change requires a shared contract change
- When adding new game constants (items, skills, etc.)
- For Velkhar gameplay, read targeted canon through `../../docs/public/nav/task-router.md` before changing constants.

## Testing

- Run `pnpm type-check --filter shared` to verify types compile
