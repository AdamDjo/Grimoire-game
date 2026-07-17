---
type: backend-status
visibility: public
rag: true
source_of_truth: true
owner: backend
updated: 2026-07-17
---

# Backend Status

## Actif

- Issue : #147 — brancher l'Auberge de L'Aveugle à la base et aux contrats API.
- Branche connue : `feature/147-auberge-aveugle-backend`.
- Le ticket reste volontairement unique pendant son chantier actif pour éviter un redécoupage
  concurrent ; il est suivi par l'epic backend #165.

## Livré sur develop

- #103 et #146 — Prisma/Supabase, world-state et personnage persistants.
- #107 — auth Supabase et vérification JWT/JWKS.
- #109 — d20, conséquences et world-state souverains côté backend.
- #111 et #113 — mémoire narrative N2/N1.
- #115 et #116 — Souvenirs nommés et Chronique de fin de run.
- #154 et #155 — gestion des erreurs asynchrones et délimitation du texte libre dans le prompt.

## Gaps v0.1.0

- #147 — retirer les fixtures autoritatives de l'Auberge ;
- #101 — fallback multi-modèles face aux 429 OpenRouter ;
- #152 — résolution canonique du concept libre ;
- #161 — hébergement API, migrations, secrets, CORS et healthcheck ;
- #162 — vulnérabilités critiques/hautes ;
- #129 — golden path contre les services réels.

Epic : #165. Coordination frontend : #123.
