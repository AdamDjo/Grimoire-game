---
type: backend-actions
visibility: public
rag: true
source_of_truth: true
owner: backend-claude
updated: 2026-07-22
---

# Backend Next

## Phase 1 — pré-déploiement

1. #180 — figer les contrats shared Survie v2.
2. #181 et #183 — livrer en séquence les conditions/Désavantage et l'inventaire réel.
3. #182 et #184 — brancher la Calamine/fin Calciné et l'action de repos.
4. #185 — renforcer le danger IA une fois les conséquences mécaniques disponibles.
5. #101 et #152 — fiabiliser les modèles et résoudre ou désactiver le concept libre.
6. #162 — traiter les risques sécurité applicables avant exposition publique.
7. #161 — déployer l'API, appliquer les migrations et vérifier le healthcheck.
8. #129 — supporter le golden path réel avec le frontend.

Ordre de dépendance :

`#180 → (#181 + #183) → (#182 + #184) → #185 → (#101 + #152 + #162) → #161 → #129`

## Post-déploiement

1. #114 — rappel sémantique pgvector.
2. #117 — World events scriptés.
3. #133 — échange Souvenir contre lore.

Chaque PR backend/shared/IA Claude met à jour ce fichier et `BACKEND_STATUS.md` selon l'état attendu
après merge. Si elle change un bloqueur pré-déploiement, elle met aussi à jour
`RELEASE_READINESS.md`.
