# GRIMOIRE — Claude Project Entry

> Lire d'abord : `MEMORY.md`, puis `docs/00-START-HERE.md`.
> Ne pas dupliquer les règles : suivre les sources ci-dessous.

Claude prend backend/shared/IA par défaut, mais peut travailler sur le frontend dès que l'utilisateur
le demande. Le domaine assigné détermine les règles et la paire `STATUS/NEXT` à charger ; ne jamais
charger les deux domaines sans besoin transverse explicite.

## Sources

- Statut : `docs/public/current-state/PROJECT_STATUS.md`
- Frontend : `docs/public/current-state/FRONTEND_STATUS.md` + `FRONTEND_NEXT.md`
- Backend/shared/IA : `docs/public/current-state/BACKEND_STATUS.md` + `BACKEND_NEXT.md`
- Release : `docs/public/current-state/RELEASE_READINESS.md` pour une tâche `phase: predeploy`
- Routeur : `docs/public/nav/task-router.md`
- Architecture : `docs/public/tech/ARCHITECTURE_RULES.md`
- Stack : `docs/public/tech/TECH_STACK.md`
- Canon : `docs/public/nav/canon-index.md`
- RAG : `docs/public/nav/RAG_RULES.md`
- Skills globaux : `docs/public/nav/AI_WORKFLOW.md`

## App Docs

- Backend : `apps/backend/CLAUDE.md`
- Shared : `packages/shared/CLAUDE.md`
- Frontend : `apps/frontend/CLAUDE.md` et `.claude/agents/frontend-dev/agent.md`
