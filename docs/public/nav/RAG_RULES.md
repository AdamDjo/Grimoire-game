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

- `public-core` : `00-START-HERE`, status, actions, task-router, architecture rules.
- `public-reference` : design, tech stack, docs map, public brief.
- `private-canon` : `docs/private/raw/`.
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

1. Lire `docs/00-START-HERE.md`.
2. Lire `docs/public/current-state/PROJECT_STATUS.md`.
3. Lire `docs/public/current-state/NEXT_ACTIONS.md`.
4. Utiliser `docs/public/wiki/task-router.md` pour choisir les fichiers ciblés.
5. Lire le canon privé uniquement si la tâche le demande.
