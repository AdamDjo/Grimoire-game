---
type: status-index
visibility: public
rag: true
source_of_truth: true
---

# Project Status

**Point d'entrée unique pour « où en est le projet ».** Ce fichier porte l'objectif et les décisions
structurantes. Il ne porte **aucun avancement par ticket** : c'est GitHub qui le porte, et GitHub ne
peut pas être périmé.

```bash
gh issue list --milestone "v0.2.0 - Roguelike jouable" --state all
```

## Objectif actuel

Livrer **v0.2.0 — Roguelike jouable** : refonder la couche de jeu par-dessus le socle existant, de
sorte qu'un run ait une **destination** (contrat), une **structure** (paliers), une **décision
centrale** (le demi-tour) et un **enjeu** (le retour). Voir `docs/public/raw/23-RUN-STRUCTURE.md`.

> **🎲 Refonte roguelike du 2026-08-06.** Le playtest a rendu un verdict net : _« après une partie je
> m'ennuie, il n'y a aucune raison de recommencer »_. Le diagnostic est que le projet a un
> **excellent moteur de narration et aucun moteur de jeu** — pas de combat tactique, pas de boucle
> avec une destination, pas de méta-progression.
>
> **Le déploiement v0.1.0 est décalé** jusqu'à ce que le jeu soit satisfaisant (décision 19). Il ne
> sert à rien de déployer un vertical slice ennuyeux. Les bloqueurs pré-déploiement #161, #129 et
> #163 sont **gelés**, pas annulés.

## Ordre des EPICs

Les 8 EPICs de la refonte vivent sur GitHub (#214 → #221). Ce qui ne s'y lit pas, et qui est donc
consigné ici : **l'ordre n'est pas indicatif — chaque EPIC suppose le précédent livré.**

`#214 boucle de run → #215 combat → #216 auberge → #217 artefacts → #218 lisibilité / #219 UI par
modes → #220 compagnons / #221 exploits`

## Sources par domaine

| Besoin                               | Source                         |
| ------------------------------------ | ------------------------------ |
| Avancement, priorités, qui fait quoi | GitHub issues et milestones    |
| Décisions backend/shared/IA          | [[BACKEND]]                    |
| Décisions frontend                   | [[FRONTEND]]                   |
| Préparation de release               | [[RELEASE_READINESS]]          |
| Chronologie des décisions            | [[../nav/log]]                 |
| Quel canon lire pour une tâche       | [[../nav/task-router]]         |
| Règles d'architecture                | [[../tech/ARCHITECTURE_RULES]] |

Attribution par défaut : Claude sur backend/shared/IA, Codex sur frontend. Une assignation explicite
peut inverser ce choix sans changer les règles du domaine.

## Fondations livrées

- frontend : landing, Forge, Auberge UI, Game Session, inventaire/fiche/menu, fin de run, Chronique
  et dashboard ;
- backend : Supabase/Prisma, auth JWT, moteur de session souverain, world-state, mémoire N1/N2,
  Souvenirs N3, Chronique et persistance du personnage ;
- qualité : lint, type-check, tests, build, CodeQL et previews Vercel dans la CI.

Ce socle est **conservé** (décision 18) : la refonte roguelike s'écrit par-dessus, elle ne le remplace
pas. Deux exceptions connues, portées par #214 :

- `SessionEndReason` : `inn` est scindé en `extracted` / `returned_empty`
  (`docs/public/raw/09-ACTION-LOOP.md` §7) — breaking change des contrats shared ;
- la session porte désormais un **mode de jeu** explicite (exploration / combat / auberge / retour)
  et une **position de palier**.

## Règle de tenue des docs

Consolidation du 2026-08-08 : les paires `*_STATUS` / `*_NEXT` ont été fusionnées en [[BACKEND]] et
[[FRONTEND]], et `NEXT_ACTIONS.md` supprimé. Cause du ménage : quatre fichiers décrivaient le même
ticket à la main, et dérivaient malgré tout.

- **GitHub porte l'avancement, les docs portent les décisions.** Un ticket ouvert/fermé/commenté est
  déjà l'état de vérité ; le recopier dans un `.md` garantit deux versions divergentes.
- **Une PR de routine ne met à jour aucun document.** Elle ne touche [[BACKEND]] ou [[FRONTEND]] que
  si elle a pris une décision non évidente — pourquoi telle valeur, telle fermeture de type, tel
  garde-fou.
- **Un seul document de domaine par PR**, jamais quatre.
- Une PR qui change un bloqueur `phase: predeploy` met à jour [[RELEASE_READINESS]].
- **Pas de champ `updated:`** dans les docs d'état : il mentait
  (`FRONTEND_STATUS.md` annonçait 2026-07-26 pour un commit du 2026-08-03).
  `git log -1 --format=%cs -- <fichier>` est la seule date fiable.
- Un pivot ou une décision structurante s'inscrit dans [[../nav/log]], qui est append-only et ne
  périme donc jamais.
