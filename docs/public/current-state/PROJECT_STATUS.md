---
type: status
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-11
---

# Project Status

## État actuel

- Projet : **GRIMOIRE — Of Ash and Salt**
- Phase actuelle : **Phase 1B — vertical slice gamesession**
- Branche active : `feature/95-demo-gamesession-vertical-slice` (PR [#102](https://github.com/AdamDjo/Grimoire-game/pull/102) ouverte → `develop`)
- Priorité active : merger #102, puis attaquer les écrans 1B restants (Auberge de L'Aveugle en priorité 1).
- Chantier parallèle (Codex) : UI Kit Grimoire, `feature/93-ui-kit-grimoire-complet` (#93). Ne pas toucher au code du main folder.

## Livré récemment

- **Phase 1A — landing** : ✅ mergée (#94).
- **EPIC #95 — vertical slice gamesession Velkhar** : ✅ code fini, en PR #102 (ferme #95→#100).
  - #96 types canon triptyque (blood/breath/ash + survie) dans `@grimoire/shared`.
  - #97 perso Velkhar canonique mocké.
  - #98 OpenRouter Game Master + route `POST /api/game/action`.
  - #99 écran gamesession jouable branché sur le MJ IA (composants provisoires `_components/`, jetables, zéro collision avec #93).
  - #100 bundler tsup pour un dist backend autonome.

## Dette / non-autoritatif à durcir

- Le moteur de conséquences + le d20 de #99 sont **simulés côté front** (démo). À rapatrier côté backend (règles souveraines) lors de l'implémentation réelle de la Session.
- #101 (fallback multi-modèles OpenRouter) : ouvert, non implémenté.
- 91 vulnérabilités Dependabot sur `develop` (3 critiques) — à traiter dans un ticket dédié.

## Critères pour avancer dans la Phase 1B

- PR #102 reviewée et mergée sur `develop`.
- Moteur de session durci côté backend (validation Zod, d20 serveur, world-state).
- Écrans Auberge de L'Aveugle + Character Create branchés sur le triptyque canon.

## Sources liées

- Prochaines actions : [[NEXT_ACTIONS]]
- Backlog Phase 1B : [[PHASE-1B-BACKLOG]]
- Plan gamesession 1B : [[PLAN-GAMESESSION-1B]]
- Routeur IA : [[../nav/task-router]]
- Canon : [[../nav/canon-index]]
- Règles d'architecture : [[../tech/ARCHITECTURE_RULES]]
