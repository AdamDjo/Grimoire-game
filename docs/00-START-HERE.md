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
3. Routeur de tâche : [[public/nav/task-router]]
4. Règles d'architecture : [[public/tech/ARCHITECTURE_RULES]]
5. Politique canon privé : [[public/nav/PRIVATE_CANON_POLICY]]

## Règles absolues

- Ne pas lire tout le vault.
- Ne pas lire tout `docs/public/raw/` d'un coup — passer par [[public/nav/task-router]] pour choisir les fichiers ciblés.
- Si un doc public résumé contredit `docs/public/raw/`, le canon `raw/` gagne.

## Structure

```txt
docs/
├── 00-HOME.md              # dashboard Obsidian humain
├── 00-START-HERE.md        # point d'entrée IA stable
├── public/                 # docs partageables, routables, versionnées (canon inclus)
└── private/                # plans en cours, assets lourds, archives — gitignored
```

## Raccourcis

- Carte du vault : [[public/nav/DOCS_MAP]]
- Règles RAG : [[public/nav/RAG_RULES]]
- Brief public : [[public/project/PUBLIC_BRIEF]]
- Log : [[public/nav/log]]
