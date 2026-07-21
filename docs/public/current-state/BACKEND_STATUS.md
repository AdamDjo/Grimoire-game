---
type: backend-status
visibility: public
rag: true
source_of_truth: true
owner: backend
updated: 2026-07-21
---

# Backend Status

## Actif

- Aucun chantier backend en cours : #147 est terminé et attend la revue/merge de
  [PR #174](https://github.com/AdamDjo/Grimoire-game/pull/174) → `develop`.

## Livré sur develop

- #103 et #146 — Prisma/Supabase, world-state et personnage persistants.
- #107 — auth Supabase et vérification JWT/JWKS.
- #109 — d20, conséquences et world-state souverains côté backend.
- #111 et #113 — mémoire narrative N2/N1.
- #115 et #116 — Souvenirs nommés et Chronique de fin de run.
- #154 et #155 — gestion des erreurs asynchrones et délimitation du texte libre dans le prompt.

## En attente de merge

- #147 — Auberge de L'Aveugle branchée à la base et aux contrats API (`aveugle.service.ts`,
  `aveugle.routes.ts`, hub/talk/spend). [PR #174](https://github.com/AdamDjo/Grimoire-game/pull/174)
  → `develop`, 152/152 tests, type-check et lint clean.

## Gaps v0.1.0

- #101 — fallback multi-modèles face aux 429 OpenRouter ;
- #152 — résolution canonique du concept libre ;
- #168 — locale navigateur BCP-47 validée et cohérence de toutes les sorties IA ;
- #161 — hébergement API, migrations, secrets, CORS et healthcheck ;
- #162 — vulnérabilités critiques/hautes ;
- #129 — golden path contre les services réels.

Epic : #165. Coordination frontend : #123.
