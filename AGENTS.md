# GRIMOIRE — Of Ash and Salt

> Fichier projet lu par les outils IA.
> Lire d'abord : `docs/00-START-HERE.md`.
> État vivant : `docs/public/current-state/PROJECT_STATUS.md`.
> Routeur : `docs/public/wiki/task-router.md`.

## Sources de vérité

| Besoin                 | Source                                                   |
| ---------------------- | -------------------------------------------------------- |
| Statut actuel          | `docs/public/current-state/PROJECT_STATUS.md`            |
| Prochaines actions     | `docs/public/current-state/NEXT_ACTIONS.md`              |
| Architecture           | `docs/public/tech/ARCHITECTURE_RULES.md`                 |
| Stack                  | `docs/public/tech/TECH_STACK.md`                         |
| Design                 | `docs/public/design/GAME_DESIGN.md`                      |
| Tokens UI              | `docs/public/design/DESIGN_TOKENS.md`                    |
| Canon privé            | `docs/public/wiki/canon-index.md` → `docs/private/raw/*` |
| Politique privé/public | `docs/public/reference/PRIVATE_CANON_POLICY.md`          |

## Invariants

Voir `docs/public/tech/ARCHITECTURE_RULES.md`.

## Stack courte

Monorepo Turborepo + pnpm · Frontend Next.js · Backend Express · DB Supabase + pgvector · AI OpenRouter · Zustand + React Query.

## Git

- Jamais commit sur `main` ou `develop`.
- Toujours issue → branche → PR.
- Branches : `feature/<n>-...`, `fix/<n>-...`, `hotfix/<n>-...`.
- Pas de `Co-Authored-By`.
