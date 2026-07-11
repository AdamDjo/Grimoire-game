---
type: entrypoint
visibility: public
rag: true
source_of_truth: true
---

# 00 — Start Here

Point d'entrée stable pour tout agent IA. Ne pas y stocker l'état vivant du projet.

## Lecture minimale

1. Statut actuel : [[public/current-state/PROJECT_STATUS]]
2. Prochaines actions : [[public/current-state/NEXT_ACTIONS]]
3. Routeur de tâche : [[public/wiki/task-router]]
4. Règles d'architecture : [[public/tech/ARCHITECTURE_RULES]]
5. Politique canon privé : [[public/reference/PRIVATE_CANON_POLICY]]

## Règles absolues

- Ne pas lire tout le vault.
- Ne pas lire tout `docs/private/raw/`.
- Passer par [[public/wiki/task-router]] pour choisir les docs nécessaires.
- Si une doc publique contredit `docs/private/raw/`, le canon privé gagne.
- Si le canon privé manque localement, lancer `pnpm check:canon`.

## Structure

```txt
docs/
├── 00-HOME.md              # dashboard Obsidian humain
├── 00-START-HERE.md        # point d'entrée IA stable
├── public/                 # docs partageables et routables
└── private/                # canon, plans, assets, archives gitignored
```

## Raccourcis

- Carte du vault : [[public/reference/DOCS_MAP]]
- Règles RAG : [[public/reference/RAG_RULES]]
- Brief public : [[public/project/PUBLIC_BRIEF]]
- Log : [[public/wiki/log]]
