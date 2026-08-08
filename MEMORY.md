---
type: memory-entry
visibility: public
rag: true
source_of_truth: false
---

# GRIMOIRE — Memory Entry

Ce fichier est l'unique pointeur mémoire générique pour les agents : ne pas chercher ou créer un
autre `MEMORY.md`. Il ne contient jamais de statut, de backlog, de branche active ni de décision
produit.

## Lecture minimale

1. `docs/00-START-HERE.md`
2. `docs/public/current-state/PROJECT_STATUS.md`
3. **Avancement des tickets** : `gh issue list --milestone "v0.2.0 - Roguelike jouable" --state all` — jamais un `.md`
4. Domaine concerné : `docs/public/current-state/BACKEND.md` ou `FRONTEND.md`
5. `docs/public/current-state/RELEASE_READINESS.md` uniquement pour le pré-déploiement ou une release
6. `docs/public/nav/task-router.md` pour charger le canon ciblé
7. `docs/public/nav/AI_WORKFLOW.md` pour la politique de mémoire et des skills versionnés

## Attribution des agents

- Par défaut : Claude prend backend/shared/IA et Codex prend frontend.
- Cette répartition optimise le travail parallèle, elle ne limite jamais les capacités : une demande
  explicite peut confier n'importe quel domaine à Claude ou Codex.
- L'agent assigné charge le document de son domaine, et ne le met à jour que s'il a tranché un choix
  non évident. Une PR de routine ne modifie aucun document.
- Ne jamais faire modifier les mêmes fichiers par deux agents en parallèle.

`docs/public/raw/16-MEMORY.md` décrit la mémoire narrative du jeu, pas la mémoire de travail des
agents. L'avancement vit sur GitHub ; les fichiers `current-state` portent les décisions.
