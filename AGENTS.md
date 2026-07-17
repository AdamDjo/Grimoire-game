# GRIMOIRE — Of Ash and Salt

> Fichier projet lu par les outils IA.
> Lire d'abord : `docs/00-START-HERE.md`.
> État vivant : `docs/public/current-state/PROJECT_STATUS.md`, puis statut du domaine.
> Routeur : `docs/public/nav/task-router.md`.

## Sources de vérité

| Besoin                 | Source                                                              |
| ---------------------- | ------------------------------------------------------------------- |
| Statut actuel          | `docs/public/current-state/PROJECT_STATUS.md`                       |
| Release / go-no-go     | `docs/public/current-state/RELEASE_READINESS.md`                    |
| État / actions front   | `docs/public/current-state/FRONTEND_STATUS.md` + `FRONTEND_NEXT.md` |
| État / actions back    | `docs/public/current-state/BACKEND_STATUS.md` + `BACKEND_NEXT.md`   |
| Architecture           | `docs/public/tech/ARCHITECTURE_RULES.md`                            |
| Stack                  | `docs/public/tech/TECH_STACK.md`                                    |
| Design                 | `docs/public/design/GAME_DESIGN.md`                                 |
| Tokens UI              | `docs/public/design/DESIGN_TOKENS.md`                               |
| Canon                  | `docs/public/nav/canon-index.md` → `docs/public/raw/*`              |
| Politique privé/public | `docs/public/nav/PRIVATE_CANON_POLICY.md`                           |

## Invariants

Voir `docs/public/tech/ARCHITECTURE_RULES.md`.

## Propriété des docs d'état

- Un chantier frontend modifie uniquement `FRONTEND_STATUS.md` et `FRONTEND_NEXT.md`.
- Un chantier backend modifie uniquement `BACKEND_STATUS.md` et `BACKEND_NEXT.md`.
- `PROJECT_STATUS.md` est un index stable, sans branche active.
- `RELEASE_READINESS.md` se met à jour après merge sur `develop`, pas depuis une branche fonctionnelle.

## Stack courte

Monorepo Turborepo + pnpm · Frontend Next.js · Backend Express · DB Supabase + pgvector · AI OpenRouter · Zustand + React Query.

## Git

- Jamais commit sur `main` ou `develop`.
- Toujours issue → branche → PR.
- Branches : `feature/<n>-...`, `fix/<n>-...`, `hotfix/<n>-...`.
- Pas de `Co-Authored-By`.
