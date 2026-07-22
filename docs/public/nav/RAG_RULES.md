---
type: rag-rules
visibility: public
rag: true
source_of_truth: true
---

# RAG Rules

Objectif : rendre le vault facile à indexer pour une IA sans créer de bruit ni de répétition.

## Règles de structure

- Un fichier = un rôle clair.
- Une information vivante = une seule source de vérité.
- Les autres fichiers doivent pointer vers la source, pas la recopier.
- Les fichiers publics doivent rester courts, idéalement 50-150 lignes.
- Les archives et assets ne sont pas destinés au RAG courant.

## Collections recommandées

- `public-core` : `00-START-HERE`, index d'état, release readiness, statuts/actions par domaine,
  task-router et architecture rules.
- `public-reference` : design, tech stack, docs map, public brief.
- `public-canon` : `docs/public/raw/`.
- `private-plans` : plans actifs, prompts, assets, roadmap interne.

## Frontmatter recommandé

```md
---
type: status
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-04
---
```

## Lecture IA

1. Lire `MEMORY.md`, pointeur court sans état vivant.
2. Lire `docs/00-START-HERE.md`.
3. Lire `docs/public/current-state/PROJECT_STATUS.md`.
4. Lire `RELEASE_READINESS.md` seulement pour une question de pré-déploiement ou de release.
5. Lire les fichiers `FRONTEND_*` ou `BACKEND_*`, jamais les deux sans besoin transverse.
6. Utiliser `docs/public/nav/task-router.md` pour choisir les fichiers ciblés.
7. Lire le canon (`docs/public/raw/`) via `task-router.md`, seulement les fichiers ciblés par la tâche.

`docs/public/raw/16-MEMORY.md` appartient au canon gameplay : ce n'est pas une mémoire de travail
pour les agents. `docs/public/nav/log.md` est un historique append-only, jamais une source d'état.
