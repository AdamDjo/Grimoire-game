---
type: docs-map
visibility: public
rag: true
source_of_truth: true
---

# Docs Map

## Entrées

- `docs/00-HOME.md` : dashboard Obsidian humain.
- `docs/00-START-HERE.md` : point d'entrée IA.

## Public

- `current-state/PROJECT_STATUS.md` : phase, priorité, branche, état vivant.
- `current-state/NEXT_ACTIONS.md` : prochaines actions courtes.
- `plans-actifs/PHASE-1B-BACKLOG.md` : backlog futur.
- `plans-actifs/PLAN-GAMESESSION-1B.md` : plan de reprise du chantier gamesession actif.
- `plans-actifs/PLAN-UI-KIT-PRODUCTION.md` : plan du chantier UI-kit actif.
- `nav/PRIVATE_CANON_POLICY.md` : règle public/privé.
- `nav/RAG_RULES.md` : conventions RAG/mémoire.
- `nav/DOCS_MAP.md` : cette carte.
- `nav/canon-index.md` : index du canon (`raw/`).
- `nav/task-router.md` : pour faire X, lire Y.
- `nav/log.md` : historique append-only.
- `project/PUBLIC_BRIEF.md` : pitch public + lore primer.
- `design/GAME_DESIGN.md` : résumé design/gameplay.
- `design/DESIGN_TOKENS.md` : tokens UI.
- `tech/ARCHITECTURE_RULES.md` : invariants backend/AI/frontend.
- `tech/TECH_STACK.md` : stack active.
- `raw/` : canon complet Velkhar (25 fichiers, public, versionné).

## Private (gitignored)

- `plans/` : plans en cours, prompts, roadmap interne.
- `assets/` : mockups, keyframes, sources lourdes.
- `archive/` : anciennes versions et historiques.

## Agents & skills (Claude Code)

- `.claude/agents/backend-dev/agent.md` : agent dédié `apps/backend/`.
- `.claude/agents/frontend-dev/agent.md` : agent dédié `apps/frontend/`.
- `.claude/agents/code-reviewer/agent.md` : revue de code avant PR.
- `.claude/skills/` : commandes slash (`status`, `implement`, `feature`, `bug`, `hotfix`, `release`, `pr`, `check`, `sync`) — chacune lit `PROJECT_STATUS.md`/`NEXT_ACTIONS.md` selon son besoin.
