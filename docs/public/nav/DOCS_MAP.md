---
type: docs-map
visibility: public
rag: true
source_of_truth: true
---

# Docs Map

## Entrées

- `MEMORY.md` : shim universel pour les agents, sans état vivant.
- `docs/00-HOME.md` : dashboard Obsidian humain.
- `docs/00-START-HERE.md` : point d'entrée IA.

## Public

- `current-state/PROJECT_STATUS.md` : index stable de l'état vivant.
- `current-state/RELEASE_READINESS.md` : décision go/no-go et coordination v0.1.0.
- `current-state/FRONTEND_STATUS.md` + `FRONTEND_NEXT.md` : état et file d'attente frontend.
- `current-state/BACKEND_STATUS.md` + `BACKEND_NEXT.md` : état et file d'attente backend.
- `current-state/NEXT_ACTIONS.md` : routeur de compatibilité, sans duplication de backlog.
- `current-state/` : seules sources vivantes de statut, actions et release.
- `archive/plans/` : anciens plans UI Kit, Game Session, moteur et backlog Phase 1B ; historique uniquement.
- `nav/PRIVATE_CANON_POLICY.md` : règle public/privé.
- `nav/RAG_RULES.md` : conventions RAG/mémoire.
- `nav/AI_WORKFLOW.md` : politique de versionnement de la mémoire, des agents et des skills.
- `nav/DOCS_MAP.md` : cette carte.
- `nav/canon-index.md` : index du canon (`raw/`).
- `nav/task-router.md` : pour faire X, lire Y.
- `nav/log.md` : historique append-only.
- `project/PUBLIC_BRIEF.md` : pitch public + lore primer.
- `design/GAME_DESIGN.md` : résumé design/gameplay.
- `design/DESIGN_TOKENS.md` : tokens UI.
- `design/UI_KIT.md` : composants et règles du UI Kit livré (#93 / PR #121).
- `tech/ARCHITECTURE_RULES.md` : invariants backend/AI/frontend.
- `tech/TECH_STACK.md` : stack active.
- `tech/DYNAMIC_SCENE_IMAGES.md` : plan cache d'images de scène partagé (non implémenté).
- `raw/` : canon complet Velkhar (25 fichiers, public, versionné).

## Private (gitignored)

- `plans/` : plans en cours, prompts, roadmap interne.
- `assets/` : mockups, keyframes, sources lourdes.
- `archive/` : anciennes versions et historiques.

## Agents & skills

- Claude : `.claude/agents/frontend-dev/agent.md` et `backend-dev/agent.md` selon le domaine assigné.
- Codex : frontend par défaut, mais autorisé sur tout domaine explicitement demandé.
- `.claude/agents/code-reviewer/agent.md` : revue de code avant PR.
- `.agents/skills/` : sources canoniques des workflows propres au projet.
- `.claude/skills/` : liens vers les mêmes sources pour éviter toute divergence Claude/Codex.
- Les skills tiers installés localement et les réglages personnels restent ignorés. Voir
  [[AI_WORKFLOW]] pour la frontière exacte.
