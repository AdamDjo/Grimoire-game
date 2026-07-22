---
type: backend-status
visibility: public
rag: true
source_of_truth: true
owner: backend-claude
updated: 2026-07-22
---

# Backend Status

## Livré sur develop

- #103 et #146 — Prisma/Supabase, world-state et personnage persistants.
- #107 — auth Supabase et vérification JWT/JWKS.
- #109 — d20, conséquences et world-state souverains côté backend.
- #111 et #113 — mémoire narrative N2/N1.
- #115 et #116 — Souvenirs nommés et Chronique de fin de run.
- #147 / PR #174 — Auberge de L'Aveugle branchée à la base et aux contrats API.
- #154 et #155 — erreurs asynchrones et délimitation du texte libre dans le prompt.
- #168 / PR #178 — locale IA BCP-47 validée et persistée.
- #179 / PR #187 — canon et plan Gameplay Survie v2.
- #189 — mémoire projet, routage Claude/Codex et garde-fous `current-state`.

## Pré-déploiement restant

- #180 — contrats partagés Survie v2.
- #181 — conditions persistées et Désavantage au d20.
- #183 — acquisition, consommation et équipement de l'inventaire réel.
- #182 — paliers de Calamine et fin spéciale `calcined`.
- #184 — repos court/feu et récupération canonique.
- #185 — danger IA régulier et crescendo d'intensité.
- #101 — fallback multi-modèles face aux erreurs OpenRouter.
- #152 — résolution du concept libre ou signal explicite de masquage V1.
- #162 — vulnérabilités critiques/hautes applicables.
- #161 — API, migrations, secrets, CORS et healthcheck de production.
- #129 — golden path contre les services réels.

## Post-déploiement

- #114 — rappel sémantique pgvector.
- #117 — World events scriptés.
- #133 — échange Souvenir contre lore.

Propriétaire d'implémentation backend/shared/IA : **Claude**. Coordination frontend : #123,
propriétaire **Codex**. Epic backend : #165. Checklist release : #163.
