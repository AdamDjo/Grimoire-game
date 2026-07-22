---
type: entrypoint
visibility: public
rag: true
source_of_truth: true
---

# 00 — Start Here

Point d'entrée stable pour tout agent IA. Ne pas y stocker l'état vivant du projet.
`../MEMORY.md` est le shim universel qui conduit ici ; il ne duplique aucune information vivante.

## Propriété des chantiers

- Claude : backend, contrats shared et orchestration IA.
- Codex : frontend.
- Les contrats backend/shared sont mergés avant leur consommation dans une PR frontend distincte.

## Lecture minimale

1. Index d'état : [[public/current-state/PROJECT_STATUS]]
2. Préparation release : [[public/current-state/RELEASE_READINESS]]
3. Statut du domaine concerné : [[public/current-state/FRONTEND_STATUS]] ou [[public/current-state/BACKEND_STATUS]]
4. Prochaines actions du domaine : [[public/current-state/FRONTEND_NEXT]] ou [[public/current-state/BACKEND_NEXT]]
5. Routeur de tâche : [[public/nav/task-router]]
6. Règles d'architecture : [[public/tech/ARCHITECTURE_RULES]]
7. Politique canon privé : [[public/nav/PRIVATE_CANON_POLICY]]
8. Workflow IA versionné : [[public/nav/AI_WORKFLOW]]

## Règles absolues

- Ne pas lire tout le vault.
- Ne pas lire tout `docs/public/raw/` d'un coup — passer par [[public/nav/task-router]] pour choisir les fichiers ciblés.
- Si un doc public résumé contredit `docs/public/raw/`, le canon `raw/` gagne.

## Structure

```txt
MEMORY.md                    # pointeur universel, aucun état vivant
docs/
├── 00-HOME.md              # dashboard Obsidian humain
├── 00-START-HERE.md        # point d'entrée IA stable
├── public/current-state/   # états séparés frontend/backend/release
├── public/                 # docs partageables, routables, versionnées (canon inclus)
└── private/                # plans en cours, assets lourds, archives — gitignored
```

## Raccourcis

- Carte du vault : [[public/nav/DOCS_MAP]]
- Règles RAG : [[public/nav/RAG_RULES]]
- Workflow IA : [[public/nav/AI_WORKFLOW]]
- Brief public : [[public/project/PUBLIC_BRIEF]]
- Log : [[public/nav/log]]
