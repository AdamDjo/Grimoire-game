---
type: status-index
visibility: public
rag: true
source_of_truth: true
updated: 2026-08-06
---

# Project Status

Index stable de l'état vivant. Ce fichier ne contient ni branche active ni journal de chantier :
les agents frontend et backend ne doivent donc pas le modifier pendant une feature.

## Objectif actuel

Livrer **v0.2.0 — Roguelike jouable** : refonder la couche de jeu par-dessus le socle existant, de
sorte qu'un run ait une **destination** (contrat), une **structure** (paliers), une **décision
centrale** (le demi-tour) et un **enjeu** (le retour). Voir `docs/public/raw/23-RUN-STRUCTURE.md`.

> **🎲 Refonte roguelike du 2026-08-06.** Le playtest a rendu un verdict net : _« après une partie
> je m'ennuie, il n'y a aucune raison de recommencer »_. Le diagnostic est que le projet a un
> **excellent moteur de narration et aucun moteur de jeu** — pas de combat tactique, pas de boucle
> avec une destination, pas de méta-progression.
>
> **Le déploiement v0.1.0 est décalé** jusqu'à ce que le jeu soit satisfaisant (décision 19). Il ne
> sert à rien de déployer un vertical slice ennuyeux. Les bloqueurs pré-déploiement #161, #129 et
> #163 sont **gelés**, pas annulés.

### Les 8 EPICs de la refonte

| #                                                           | EPIC                                                   | Ordre |
| ----------------------------------------------------------- | ------------------------------------------------------ | ----- |
| [#214](https://github.com/AdamDjo/Grimoire-game/issues/214) | Boucle de run — contrat, paliers, demi-tour, retour    | 1     |
| [#215](https://github.com/AdamDjo/Grimoire-game/issues/215) | Combat par tours — moteur backend + mode dédié         | 2     |
| [#216](https://github.com/AdamDjo/Grimoire-game/issues/216) | Auberge — préparation sous contrainte, boutique, forge | 3     |
| [#217](https://github.com/AdamDjo/Grimoire-game/issues/217) | Artefacts — pouvoirs activables payés en Calamine      | 4     |
| [#218](https://github.com/AdamDjo/Grimoire-game/issues/218) | Lisibilité — tooltips et lore enseigné par L'Aveugle   | 5     |
| [#219](https://github.com/AdamDjo/Grimoire-game/issues/219) | UI — refonte par modes                                 | 6     |
| [#220](https://github.com/AdamDjo/Grimoire-game/issues/220) | Compagnons — alliés semi-autonomes                     | 7     |
| [#221](https://github.com/AdamDjo/Grimoire-game/issues/221) | Exploits — badges et déblocages d'accès                | 7     |

L'ordre n'est pas indicatif : chaque EPIC suppose le précédent livré.

## Sources par domaine

| Besoin                     | Source de vérité       | Propriétaire d'édition          |
| -------------------------- | ---------------------- | ------------------------------- |
| Avancement frontend        | [[FRONTEND_STATUS]]    | chantier frontend               |
| Prochaines tâches frontend | [[FRONTEND_NEXT]]      | chantier frontend               |
| Avancement backend         | [[BACKEND_STATUS]]     | chantier backend                |
| Prochaines tâches backend  | [[BACKEND_NEXT]]       | chantier backend                |
| Préparation de release     | [[RELEASE_READINESS]]  | toute PR qui change un bloqueur |
| Routage documentaire       | [[../nav/task-router]] | maintenance docs                |

## Fondations livrées

- frontend : landing, Forge, Auberge UI, Game Session, inventaire/fiche/menu, fin de run,
  Chronique et dashboard ;
- backend : Supabase/Prisma, auth JWT, moteur de session souverain, world-state, mémoire N1/N2,
  Souvenirs N3, Chronique et persistance du personnage ;
- qualité : lint, type-check, tests, build, CodeQL et previews Vercel dans la CI.

Ce socle est **conservé** (décision 18) : la refonte roguelike s'écrit par-dessus, elle ne le
remplace pas. Deux exceptions connues, portées par #214 :

- `SessionEndReason` : `inn` est scindé en `extracted` / `returned_empty`
  (`docs/public/raw/09-ACTION-LOOP.md` §7) — breaking change des contrats shared ;
- la session porte désormais un **mode de jeu** explicite (exploration / combat / auberge / retour)
  et une **position de palier**.

## Règle de synchronisation

- Une PR frontend met à jour les fichiers `FRONTEND_*` selon son état attendu après merge.
- Une PR backend/shared/IA met à jour les fichiers `BACKEND_*` selon son état attendu après merge.
- Une PR qui change un bloqueur `phase: predeploy` met aussi à jour `RELEASE_READINESS.md`.
- Attribution par défaut : Claude sur backend/shared/IA, Codex sur frontend. Une assignation
  explicite peut inverser ce choix sans changer les règles documentaires du domaine.
- Les contrats sont livrés avant leur consommation frontend afin d'éviter des modifications
  concurrentes du même chantier.
- Ce fichier change seulement si l'objectif global ou la structure des sources change.
