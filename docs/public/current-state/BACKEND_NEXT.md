---
type: backend-actions
visibility: public
rag: true
source_of_truth: true
owner: backend
default_agent: claude
updated: 2026-07-24
---

# Backend Next

## Phase 1 — pré-déploiement

1. ~~#180~~ — figer les contrats shared Survie v2 : livré (PR #196).
2. ~~#181~~ — conditions et Désavantage : livré (PR #198). #183 — inventaire réel reste à livrer.
3. #182 et #184 — brancher la Calamine/fin Calciné et l'action de repos.
4. #185 — renforcer le danger IA une fois les conséquences mécaniques disponibles.
5. ~~#101~~ — fiabiliser les modèles : livré (PR #191).
6. #152 — résoudre ou désactiver le concept libre.
7. #162 — traiter les risques sécurité applicables avant exposition publique.
8. #161 — déployer l'API, appliquer les migrations et vérifier le healthcheck.
9. #129 — supporter le golden path réel avec le frontend.

Ordre de dépendance :

`#183 → (#182 + #184) → #185 → (#152 + #162) → #161 → #129`

## Post-déploiement

1. #114 — rappel sémantique pgvector.
2. #117 — World events scriptés.
3. #133 — échange Souvenir contre lore.

Chaque PR backend/shared/IA, qu'elle soit menée par Claude ou Codex, met à jour ce fichier et
`BACKEND_STATUS.md` selon l'état attendu après merge. Si elle change un bloqueur pré-déploiement,
elle met aussi à jour `RELEASE_READINESS.md`.
