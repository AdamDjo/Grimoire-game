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

- `current-state/PROJECT_STATUS.md` : objectif courant et décisions structurantes. **L'avancement par
  ticket vit sur GitHub** (`gh issue list`), jamais ici.
- `current-state/BACKEND.md` : décisions d'architecture backend/shared/IA.
- `current-state/FRONTEND.md` : décisions d'implémentation frontend.
- `current-state/RELEASE_READINESS.md` : décision go/no-go et bloqueurs de déploiement.
- Consolidation du 2026-08-08 : les paires `*_STATUS`/`*_NEXT` et `NEXT_ACTIONS.md` ont été
  supprimées — quatre fichiers décrivaient le même ticket à la main et dérivaient malgré tout.
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
- `tech/DYNAMIC_SCENE_IMAGES.md` : cache d'images de scène partagé (#207).
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
