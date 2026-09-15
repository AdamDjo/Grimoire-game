# GRIMOIRE — Of Ash and Salt

> Fichier projet lu par les outils IA.
> Lire d'abord : `MEMORY.md`, puis `docs/00-START-HERE.md`.
> État vivant : `docs/state/PROJECT_STATUS.md`, puis statut du domaine.
> Routeur : `docs/task-router.md`.

## Mémoire et attribution

- `MEMORY.md` est l'unique nœud d'entrée générique. Ne pas chercher ou créer un autre fichier
  mémoire opérationnel.
- Les skills globaux attendus et leurs commandes de restauration sont documentés dans
  `docs/tech/AI_SETUP.md`.
- `docs/canon/16-MEMORY.md` concerne la mémoire narrative du jeu, pas celle des agents.
- Attribution par défaut : Claude sur backend/shared/IA, Codex sur frontend.
- Ce défaut n'est pas une restriction : si l'utilisateur assigne Codex au backend ou Claude au
  frontend, suivre les règles et le document du domaine demandé.
- Un contrat shared/backend est livré avant sa consommation dans une PR frontend distincte.
- Deux agents ne modifient jamais le même chantier fonctionnel en parallèle.

## Sources de vérité

| Besoin                 | Source                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Statut actuel          | `docs/state/PROJECT_STATUS.md`                                                     |
| Release / go-no-go     | `docs/state/RELEASE_READINESS.md`                                                  |
| Avancement des tickets | `gh issue list --milestone "v0.2.1 - Roguelike jouable"` — GitHub, jamais un `.md` |
| Décisions frontend     | `docs/state/FRONTEND.md`                                                           |
| Décisions back/shared  | `docs/state/BACKEND.md`                                                            |
| Architecture           | `docs/tech/RULES.md`                                                               |
| Frontend, tokens, UI   | `docs/tech/FRONTEND.md`                                                            |
| Canon (règles de jeu)  | `docs/task-router.md` → `docs/canon/*`                                             |

## Invariants

Voir `docs/tech/RULES.md`.

## Propriété des docs d'état

**GitHub porte l'avancement, les docs portent les décisions.**

- **Par défaut, une PR ne modifie aucun document.** Elle ferme son issue, c'est suffisant.
- Une PR touche `BACKEND.md` ou `FRONTEND.md` — **un seul**, celui de son domaine — uniquement si elle
  a tranché un choix non évident : pourquoi telle valeur, telle fermeture de type, tel garde-fou.
- Un pivot ou une décision structurante va dans `docs/log.md` (append-only).
- Une PR qui change un bloqueur `phase: predeploy` met à jour `RELEASE_READINESS.md`.
- Ne jamais écrire d'avancement par ticket dans un `.md` : il devient faux au premier merge.
- Pas de champ `updated:` dans les docs d'état — `git log -1 --format=%cs -- <fichier>` est la seule
  date fiable.
- En cas de conflit sur `RELEASE_READINESS.md`, la seconde PR se rebase sur `develop` avant merge.

## Stack courte

Monorepo Turborepo + pnpm · Frontend Next.js · Backend Express · DB Supabase + pgvector · AI OpenRouter · Zustand + React Query.

## Git

- Jamais commit sur `main` ou `develop`.
- Toujours issue → branche → PR.
- Branches : `feature/<n>-...`, `fix/<n>-...`, `hotfix/<n>-...`.
- Pas de `Co-Authored-By`.
