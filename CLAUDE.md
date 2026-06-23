# Grimoire — AI-Powered Narrative RPG

> Règles Git + TypeScript : `~/.claude/CLAUDE.md`
> **Lire en début de session : `docs/MEMORY.md` puis `docs/TECH_STACK.md`**

## Stack

- Monorepo Turborepo + pnpm · Frontend Next.js 15 · Backend Express · DB Supabase + pgvector · AI Claude→Gemini→Mistral→safety scene · State Zustand + React Query

```
apps/frontend/   apps/backend/   packages/shared/
```

```bash
pnpm dev                        # tout démarrer
pnpm dev --filter frontend|backend
pnpm build && pnpm lint && pnpm type-check
```

## Architecture (règles absolues)

- **Backend = Game Master** : stats, dés, inventaire, conséquences, NPCs, world-state, lore
- **AI = voix uniquement** : prose seulement, jamais de décisions
- **Frontend = display only** : jamais de logique de jeu
- Zod validation sur toutes les routes · réponses `{ success, data?, error? }` · types dans `@grimoire/shared` uniquement
- API frontend → `app/api/[...path]/route.ts` uniquement

## UI — Règle absolue

Avant toute page frontend : ouvrir le HTML dans `docs/Grimoire/` et le suivre exactement. Tableau dans `apps/frontend/CLAUDE.md`.

## GitHub

Labels : `phase-1a/1b/2/2b/3` · `frontend/backend/shared/ai/database` · `bug/release/priority/blocked`
Milestones : Phase 1A / 1B / 2 / 2B / 3

> Toujours passer labels + milestone **explicitement** aux PRs.

## Agents

| Tâche             | Agent           |
| ----------------- | --------------- |
| `apps/frontend/`  | `frontend-dev`  |
| `apps/backend/`   | `backend-dev`   |
| avant commit / PR | `code-reviewer` |

Les agents lisent `docs/MEMORY.md` + leur `CLAUDE.md` d'app — pas besoin de re-expliquer.
