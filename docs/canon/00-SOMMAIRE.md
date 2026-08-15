# GRIMOIRE — Of Ash and Salt

> _Des Cendres et du Sel._

---

## À propos de ce document

**GRIMOIRE** est un roguelike narratif par IA, dans un monde de dark fantasy désertique appelé **Velkhar**.

Le joueur incarne un aventurier — Marcheur-du-Sel, Lame-Ombre, Veilleur ou Tisse-Verbe — et vit une aventure complète en **3 à 15 heures**. À la fin du run, une **Chronique** est générée : le récit de son histoire. Le joueur peut recommencer avec la même vocation ou une autre — le **méta-monde** aura changé, et l'IA générera une toute nouvelle aventure.

La **survie** est la pression de tous les jours. La **magie** est une tentation rare, corruptrice, qui coûte la **Cendre** — et peut mener à la **Calamine**.

Le jeu est en anglais, avec direction artistique dark fantasy désertique.

Ce Game Design Document décrit l'ensemble du produit. Il est versionné sous Git.

---

## Décisions fondatrices

| #                    | Décision                                                                                         | Valeur |
| -------------------- | ------------------------------------------------------------------------------------------------ | ------ |
| Nom                  | **GRIMOIRE — Of Ash and Salt**                                                                   |
| Monde                | **Velkhar** (continent désertique, le _Makhzen_)                                                 |
| Genre                | Roguelike narratif (run 3-15h, aventure complète)                                                |
| Persistance          | Canon fixe + méta-monde vivant + Chronique + écho léger                                          |
| Multijoueur          | Solo V1, co-op en V2                                                                             |
| Action               | Choix IA + saisie libre + dés BG3 aux pivots                                                     |
| Survie               | Complète, pas hardcore — histoire = main focus                                                   |
| Attributs            | Triptyque **SANG · SOUFFLE · VOLONTÉ**                                                           |
| Vocations V1         | Marcheur-du-Sel, Lame-Ombre, Veilleur, Tisse-Verbe                                               |
| Vocations V2         | Changepeau, Chasseur-de-Revenants, Contrebandier                                                 |
| Création perso       | Vocation prédéfinie OU concept écrit libre                                                       |
| Magie                | **Unifiée** — artefacts = seule source, Calamine = coût universel, Tisse-Verbe = seul à éveiller |
| Héritage             | Artefact transmis (1, dégrade après 3-4 runs) + écho réputation/compétence mineurs               |
| Hub méta             | **L'Aveugle** (aubergiste) — vend lore + explique les artefacts contre **Souvenirs**             |
| Monnaies             | **Or** in-game (perdu à la mort) + **Souvenirs** méta (1 gratuit/run + bonus performance)        |
| Stack IA             | OpenRouter (routeur) + fallback, 1-2 appels/tour                                                 |
| Stack code           | Express + TypeScript (routes/services/ai/game-rules/lore)                                        |
| Monétisation         | Quota run/jour gratuit + premium illimité                                                        |
| Direction artistique | Dark fantasy désertique                                                                          |

---

## Structure du GDD

Le document est organisé en **5 parties** et **23 sections** :

### PARTIE I — VISION & FONDATIONS

| #   | Section          | Fichier             | Thème                                                       |
| --- | ---------------- | ------------------- | ----------------------------------------------------------- |
| 00  | Sommaire         | `00-SOMMAIRE.md`    | Navigation, décisions fondatrices                           |
| 01  | Pillars & Vision | `01-PILLARS.md`     | Piliers roguelike, promesse, anti-vision                    |
| 02  | World Bible      | `02-WORLD-BIBLE.md` | Cosmologie, histoire, géographie, peuples, magie de Velkhar |
| 03  | Factions         | `03-FACTIONS.md`    | Guildes, cultes, nations, matrice de relations              |
| 03  | Bestiaire        | `03-BESTIARY.md`    | Créatures de Velkhar, Calcinés, 4 tiers de danger, biomes   |

### PARTIE II — LE PERSONNAGE

| #   | Section                | Fichier                    | Thème                                              |
| --- | ---------------------- | -------------------------- | -------------------------------------------------- |
| 04  | Attributs              | `04-ATTRIBUTES.md`         | Triptyque SANG/SOUFFLE/VOLONTÉ, mods, échelles     |
| 05  | Vocations              | `05-VOCATIONS.md`          | 4 vocations d'aventurier, lentilles narratives     |
| 06  | Survie                 | `06-SURVIVAL.md`           | PV, faim, soif, fatigue, conditions                |
| 07  | Création de personnage | `07-CHARACTER-CREATION.md` | Prologue narratif, choix vocation ou concept libre |

### PARTIE III — LES SYSTÈMES DE JEU

| #   | Section               | Fichier                   | Thème                                                    |
| --- | --------------------- | ------------------------- | -------------------------------------------------------- |
| 23  | **Structure de run**  | `23-RUN-STRUCTURE.md`     | ⭐ **Pivot** — contrat, paliers, demi-tour, retour, fins |
| 08  | Résolution de dés     | `08-DICE-RESOLUTION.md`   | d20, DC, moments pivots, critiques                       |
| 09  | Boucle d'action       | `09-ACTION-LOOP.md`       | Choix IA + saisie libre + déclenchement des dés          |
| 10  | Combat                | `10-COMBAT.md`            | Tactique lite façon BG3 simplifié                        |
| 11  | Inventaire & Économie | `11-INVENTORY-ECONOMY.md` | Objets, équipement, argent, artisanat, commerce          |
| 12  | PNJ & Relations       | `12-NPCS-RELATIONS.md`    | PNJ persistants dans le run, faveurs, dettes             |
| 13  | Réputation            | `13-REPUTATION.md`        | Factions, rumeurs, propagation (scope run)               |

### PARTIE IV — LE MONDE & L'IA

| #   | Section        | Fichier             | Thème                                      |
| --- | -------------- | ------------------- | ------------------------------------------ |
| 14  | Méta-monde     | `14-META-WORLD.md`  | Évolution entre runs, saisons, cataclysmes |
| 15  | Game Master IA | `15-GAME-MASTER.md` | MJ IA condensé, OpenRouter, prompts        |
| 16  | Mémoire        | `16-MEMORY.md`      | Mémoire scope-run + Chronique + écho léger |

### PARTIE V — PRODUIT & TECHNIQUE

| #   | Section         | Fichier               | Thème                                |
| --- | --------------- | --------------------- | ------------------------------------ |
| 17  | Run & Chronique | `17-RUN-CHRONICLE.md` | Structure d'un run, début/milieu/fin |
| 18  | Rétention       | `18-RETENTION.md`     | Boucles roguelike, rejouabilité      |
| 19  | Monétisation    | `19-MONETIZATION.md`  | Quota, premium, IA premium           |
| 20  | Architecture    | `20-ARCHITECTURE.md`  | Stack, DB, LLM, OpenRouter           |
| 21  | Roadmap         | `21-ROADMAP.md`       | Phases, KPIs                         |
| 22  | Glossaire       | `22-GLOSSARY.md`      | Termes, conventions, annexes         |

---

## Conventions

- 🟢 = règle validée
- 🟡 = en cours de réflexion
- 🔴 = point bloquant
- 💡 = idée d'amélioration
- ⚙️ = implémentation technique

Les noms propres de l'univers sont en _italique_ à leur première occurrence.

---

## Fichiers de la v1 (archivés)

La version précédente du GDD (vision "monde persistant infini") est conservée dans `_archive-v1/`. Le lore de Velkhar (World Bible + Factions) y est intact et a servi de fondation à cette v2.

---

_Dernière mise à jour : 2026-06-28_
