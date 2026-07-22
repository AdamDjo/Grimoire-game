# GRIMOIRE — Of Ash and Salt

> Fichier projet lu par les outils IA.
> Lire d'abord : `MEMORY.md`, puis `docs/00-START-HERE.md`.
> État vivant : `docs/public/current-state/PROJECT_STATUS.md`, puis statut du domaine.
> Routeur : `docs/public/nav/task-router.md`.

## Mémoire et attribution

- `MEMORY.md` est l'unique nœud d'entrée générique. Ne pas chercher ou créer un autre fichier
  mémoire opérationnel.
- Les skills globaux attendus et leurs commandes de restauration sont documentés dans
  `docs/public/nav/AI_WORKFLOW.md`.
- `docs/public/raw/16-MEMORY.md` concerne la mémoire narrative du jeu, pas celle des agents.
- Attribution par défaut : Claude sur backend/shared/IA, Codex sur frontend.
- Ce défaut n'est pas une restriction : si l'utilisateur assigne Codex au backend ou Claude au
  frontend, suivre les règles et les fichiers `STATUS/NEXT` du domaine demandé.
- Un contrat shared/backend est livré avant sa consommation dans une PR frontend distincte.
- Deux agents ne modifient jamais le même chantier fonctionnel en parallèle.

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

- Une PR frontend met à jour `FRONTEND_STATUS.md` et `FRONTEND_NEXT.md` dans la même branche.
- Une PR backend/shared/IA met à jour `BACKEND_STATUS.md` et `BACKEND_NEXT.md` dans la même branche.
- Les documents décrivent l'état attendu après merge : ne pas laisser « branche active »,
  « en validation » ou « attend le merge » dans le commit destiné à `develop`.
- Une PR qui change un bloqueur `phase: predeploy` met aussi à jour `RELEASE_READINESS.md`.
- Une PR sans impact produit peut déclarer `current-state` non applicable avec justification.
- `PROJECT_STATUS.md` est un index stable, sans branche active.
- En cas de conflit sur `RELEASE_READINESS.md`, la seconde PR se rebase sur `develop` avant merge.

## Stack courte

Monorepo Turborepo + pnpm · Frontend Next.js · Backend Express · DB Supabase + pgvector · AI OpenRouter · Zustand + React Query.

## Git

- Jamais commit sur `main` ou `develop`.
- Toujours issue → branche → PR.
- Branches : `feature/<n>-...`, `fix/<n>-...`, `hotfix/<n>-...`.
- Pas de `Co-Authored-By`.
