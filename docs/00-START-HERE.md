---
type: entrypoint
visibility: public
rag: true
source_of_truth: true
---

# 00 — Start Here

Point d'entrée unique, pour un humain comme pour un agent. Aucun état vivant ici.

## Où en est le projet

**Sur GitHub, pas dans les docs.**

```bash
gh issue list --milestone "v0.2.1 - Roguelike jouable" --state all
```

Objectif courant et décisions structurantes : [[public/current-state/PROJECT_STATUS]].

## Lecture minimale avant de coder

1. **Objectif et priorités** : [[public/current-state/PROJECT_STATUS]]
2. **Décisions du domaine** : [[public/current-state/BACKEND]] ou [[public/current-state/FRONTEND]]
3. **Quel canon lire pour cette tâche** : [[public/nav/task-router]]
4. **Invariants** : [[public/tech/ARCHITECTURE_RULES]]

Pour une tâche de release, ajouter [[public/current-state/RELEASE_READINESS]].

## Règles absolues

- **Lire le canon `docs/public/raw/` AVANT de coder une mécanique de jeu.** Jamais de constante
  « provisoire, à valider plus tard » : si le canon n'a pas été lu, la valeur n'est pas écrite.
- Ne pas lire tout `docs/public/raw/` d'un coup — passer par [[public/nav/task-router]].
- Si un doc résumé contredit `docs/public/raw/`, le **canon `raw/` gagne**.
- Le backend arbitre dés, dégâts, conditions et fins de run. **L'IA narre, elle ne décide rien.**
- Ne pas lire tout le vault.

## Attribution des chantiers

Par défaut Claude sur backend/shared/IA, Codex sur frontend. L'utilisateur peut assigner n'importe
quel domaine à l'un ou l'autre ; les règles du domaine ne changent pas. Les contrats backend/shared
sont mergés **avant** leur consommation dans une PR frontend distincte.

## Tenue des docs

**GitHub porte l'avancement, les docs portent les décisions.** Une PR de routine ne modifie aucun
document ; une PR qui a tranché un choix non évident l'inscrit dans le fichier de son domaine —
un seul. Détail : [[public/current-state/PROJECT_STATUS]] § Règle de tenue des docs.

## Structure

```txt
docs/
├── 00-START-HERE.md        # ce fichier — point d'entrée
├── 00-HOME.md              # dashboard Obsidian humain
├── public/current-state/   # PROJECT_STATUS, BACKEND, FRONTEND, RELEASE_READINESS
├── public/raw/             # canon Velkhar — la référence qui gagne toujours
├── public/nav/             # task-router, log, DOCS_MAP, règles RAG
├── public/tech/            # architecture, stack, sécurité
└── private/                # plans, assets lourds, archives — gitignored
```

## Raccourcis

- Chronologie des décisions (append-only) : [[public/nav/log]]
- Carte du vault : [[public/nav/DOCS_MAP]]
- Index du canon : [[public/nav/canon-index]]
- Règles RAG : [[public/nav/RAG_RULES]]
- Brief public : [[public/project/PUBLIC_BRIEF]]
