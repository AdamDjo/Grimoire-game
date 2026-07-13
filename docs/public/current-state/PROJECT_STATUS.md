---
type: status
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-12
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
- **#107 — auth Supabase** : ✅ implémentée (worktree `-claude`, `feature/107-supabase-auth-magic-link-oauth`). Tier anonyme (`signInAnonymously`), magic link + OAuth Google/Discord, JWT vérifié via JWKS dans `requireAuth`, `userId` client retiré du body, proxy `app/api/[...path]/route.ts` qui injecte le Bearer, cap 30 req anonymes → 403 → blocage forcé UI. Bug email anonyme vide (P2002) résolu. Vérifié live. Détail : [[../tech/AUTH]].

## Dette / non-autoritatif à durcir

- Le moteur de conséquences + le d20 de #99 sont **simulés côté front** (démo). À rapatrier côté backend (règles souveraines) lors de l'implémentation réelle de la Session.
- #101 (fallback multi-modèles OpenRouter) : ouvert, non implémenté.
- 91 vulnérabilités Dependabot sur `develop` (3 critiques) — à traiter dans un ticket dédié.
- **Cap anonyme contournable** (#107) : vider les cookies `sb-*` réinitialise le quota (nouvel `auth.users.id`). Dette V1 assumée (friction, pas sécurité). À durcir avec un rate-limit / cap par IP quand l'IA payante remplacera le stub. Détail : [[../tech/AUTH]].
- **RLS Postgres** différé (#107, décision #7) : autorisation V1 = filtrage `userId` explicite côté Express.

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
- Authentification : [[../tech/AUTH]]
