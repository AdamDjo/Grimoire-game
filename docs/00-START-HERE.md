---
type: entrypoint
visibility: public
rag: true
source_of_truth: true
---

# 00 — Start Here

Point d'entrée unique du vault, pour un humain comme pour un agent. Aucun état vivant ici.

## Où en est le projet

**Sur GitHub, pas dans les docs.**

```bash
gh issue list --milestone "v0.2.1 - Roguelike jouable" --state all
```

Objectif courant et décisions structurantes : [[state/PROJECT_STATUS]].

## Lecture minimale avant de coder

1. **Objectif et priorités** : [[state/PROJECT_STATUS]]
2. **Décisions du domaine** : [[state/BACKEND]] ou [[state/FRONTEND]]
3. **Quel canon lire pour cette tâche** : [[task-router]]
4. **Invariants** : [[tech/RULES]]

Pour une tâche de release, ajouter [[state/RELEASE_READINESS]].

## Règles absolues

- **Lire le canon `docs/canon/` AVANT de coder une mécanique de jeu.** Jamais de constante
  « provisoire, à valider plus tard » : si le canon n'a pas été lu, la valeur n'est pas écrite.
- Ne pas lire tout `docs/canon/` d'un coup — passer par [[task-router]].
- Si un document résumé contredit `docs/canon/`, **le canon gagne**.
- Le backend arbitre dés, dégâts, conditions et fins de run. **L'IA narre, elle ne décide rien.**
- Ne pas lire tout le vault.

## Attribution des chantiers

Par défaut Claude sur backend/shared/IA, Codex sur frontend. L'utilisateur peut assigner n'importe
quel domaine à l'un ou l'autre ; les règles du domaine ne changent pas. Les contrats backend/shared
sont mergés **avant** leur consommation dans une PR frontend distincte.

## Tenue des docs

**GitHub porte l'avancement, les docs portent les décisions.** Une PR de routine ne modifie aucun
document ; une PR qui a tranché un choix non évident l'inscrit dans le fichier de son domaine —
un seul. Détail : [[state/PROJECT_STATUS]] § Règle de tenue des docs.

## Structure

```txt
docs/
├── 00-START-HERE.md   # ce fichier — point d'entrée
├── task-router.md     # quoi lire selon la tâche
├── log.md             # chronologie des décisions (append-only)
├── canon/             # canon Velkhar — la référence qui gagne toujours
├── state/             # PROJECT_STATUS, BACKEND, FRONTEND, RELEASE_READINESS
├── tech/              # architecture, frontend, auth, sécurité, outillage IA
└── private/           # plans, assets lourds, archives — gitignored
```

Quatre dossiers, un rôle chacun : **ce qui est vrai du jeu** (`canon/`), **ce qui est vrai du code**
(`tech/`), **où on en est** (`state/`), **ce qui n'est pas publiable** (`private/`).

## Raccourcis

- Chronologie des décisions : [[log]]
- Sommaire du canon : [[canon/00-SOMMAIRE]]
