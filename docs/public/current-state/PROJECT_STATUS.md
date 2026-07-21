---
type: status-index
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-21
---

# Project Status

Index stable de l'état vivant. Ce fichier ne contient ni branche active ni journal de chantier :
les agents frontend et backend ne doivent donc pas le modifier pendant une feature.

## Objectif actuel

Livrer **v0.1.0 — Première version jouable** : un vertical slice Velkhar déployé couvrant
Landing → Auberge → Forge → Session → fin de run → Chronique, avec conversion anonyme vers compte.

## Sources par domaine

| Besoin                     | Source de vérité       | Propriétaire d'édition            |
| -------------------------- | ---------------------- | --------------------------------- |
| Avancement frontend        | [[FRONTEND_STATUS]]    | chantier frontend                 |
| Prochaines tâches frontend | [[FRONTEND_NEXT]]      | chantier frontend                 |
| Avancement backend         | [[BACKEND_STATUS]]     | chantier backend                  |
| Prochaines tâches backend  | [[BACKEND_NEXT]]       | chantier backend                  |
| Préparation de release     | [[RELEASE_READINESS]]  | coordination release, après merge |
| Routage documentaire       | [[../nav/task-router]] | maintenance docs                  |

## Fondations livrées

- frontend : landing, Forge, Auberge UI, Game Session, inventaire/fiche/menu, fin de run,
  Chronique et dashboard ;
- backend : Supabase/Prisma, auth JWT, moteur de session souverain, world-state, mémoire N1/N2,
  Souvenirs N3, Chronique et persistance du personnage ;
- qualité : lint, type-check, tests, build, CodeQL et previews Vercel dans la CI.

## Règle de synchronisation

- Une branche frontend modifie uniquement les fichiers `FRONTEND_*`.
- Une branche backend modifie uniquement les fichiers `BACKEND_*`.
- `RELEASE_READINESS.md` est actualisé après merge sur `develop`, jamais depuis deux branches
  fonctionnelles concurrentes.
- Ce fichier change seulement si l'objectif global ou la structure des sources change.
