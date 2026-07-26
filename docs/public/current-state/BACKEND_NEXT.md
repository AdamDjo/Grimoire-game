---
type: backend-actions
visibility: public
rag: true
source_of_truth: true
owner: backend
default_agent: claude
updated: 2026-07-26
---

# Backend Next

## Phase 1 — pré-déploiement

1. ~~#180~~ — figer les contrats shared Survie v2 : livré (PR #196).
2. ~~#181~~ — conditions et Désavantage : livré (PR #198).
3. ~~#182~~ — Calamine/fin Calciné : livré (PR #199).
4. ~~#183~~ — inventaire réel (acquisition, usage, équipement) : livré.
5. ~~#201~~ — survie punitive (paliers narratifs, négligence→Calamine, érosion PV, état mourant) : livré.
6. ~~#184~~ — repos court/feu (récupération canonique, `restRequested`) : livré (PR #204).
7. ~~#185~~ — crescendo de danger IA (`buildDangerCrescendoSection`) : livré.
8. ~~#101~~ — fiabiliser les modèles : livré (PR #191).
9. ~~#152~~ — résoudre le concept libre (`POST /api/character/resolve-vocation`) : livré.
10. #162 — traiter les risques sécurité applicables avant exposition publique.
11. #161 — déployer l'API, appliquer les migrations et vérifier le healthcheck.
12. #129 — supporter le golden path réel avec le frontend.

Ordre de dépendance :

`#162 → #161 → #129`

## Post-déploiement

1. #114 — rappel sémantique pgvector.
2. #117 — World events scriptés.
3. #133 — échange Souvenir contre lore.

Chaque PR backend/shared/IA, qu'elle soit menée par Claude ou Codex, met à jour ce fichier et
`BACKEND_STATUS.md` selon l'état attendu après merge. Si elle change un bloqueur pré-déploiement,
elle met aussi à jour `RELEASE_READINESS.md`.
