# GRIMOIRE — Claude Project Entry

> Lire d'abord : `MEMORY.md`, puis `docs/00-START-HERE.md`.
> Ne pas dupliquer les règles : suivre les sources ci-dessous.

Claude prend backend/shared/IA par défaut, mais peut travailler sur le frontend dès que l'utilisateur
le demande. Le domaine assigné détermine les règles et le document à charger ; ne jamais charger les
deux domaines sans besoin transverse explicite.

**GitHub porte l'avancement, les docs portent les décisions.** Une PR de routine ne modifie aucun
document ; une PR qui a tranché un choix non évident l'inscrit dans le fichier de son domaine, un
seul. Détail : `docs/state/PROJECT_STATUS.md` § Règle de tenue des docs.

## Sources

- Statut : `docs/state/PROJECT_STATUS.md`
- Avancement : `gh issue list --milestone "v0.2.1 - Roguelike jouable" --state all` (GitHub, jamais un `.md`)
- Décisions frontend : `docs/state/FRONTEND.md`
- Décisions backend/shared/IA : `docs/state/BACKEND.md`
- Release : `docs/state/RELEASE_READINESS.md` pour une tâche `phase: predeploy`
- Routeur canon : `docs/task-router.md` → `docs/canon/*`
- Règles d'architecture : `docs/tech/RULES.md`
- Architecture frontend, tokens, UI Kit : `docs/tech/FRONTEND.md`
- Setup outillage IA : `docs/tech/AI_SETUP.md`

## App Docs

- Backend : `apps/backend/CLAUDE.md`
- Shared : `packages/shared/CLAUDE.md`
- Frontend : `apps/frontend/CLAUDE.md` et `.claude/agents/frontend-dev/agent.md`
