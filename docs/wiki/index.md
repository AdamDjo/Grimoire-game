# Wiki — Index GDD + Doc projet

> **`docs/raw/` = SOURCE DE VÉRITÉ CANON VELKHAR. Ne jamais éditer ces fichiers en side-effect d'une tâche non liée — toute divergence avec `docs/raw/` → `docs/raw/` gagne.**
> Ce fichier est un **routeur** : "pour comprendre X, ouvre le fichier Y". Ne pas lire tous les fichiers d'un coup.

---

## GDD — `docs/raw/` (canon produit, 25 fichiers)

### Fondations (vision + monde)

| Fichier                      | Quand le lire                                                      |
| ---------------------------- | ------------------------------------------------------------------ |
| `docs/raw/00-SOMMAIRE.md`    | Table des matières complète du GDD                                 |
| `docs/raw/01-PILLARS.md`     | Piliers de design (pourquoi le jeu existe, ce qu'il refuse d'être) |
| `docs/raw/02-WORLD-BIBLE.md` | Velkhar : continent, Makhzen, régions — pour World Map / lore      |
| `docs/raw/03-BESTIARY.md`    | 18 créatures, Calcinés au centre — pour combats, encounters        |
| `docs/raw/03-FACTIONS.md`    | Culte, Guilde du Sel, Main d'Ombre, Éveilleurs                     |
| `docs/raw/22-GLOSSARY.md`    | Termes Velkhar (Cendre, Calamine, Archontes, Souvenirs…)           |

### Système (règles de jeu)

| Fichier                             | Quand le lire                                                       |
| ----------------------------------- | ------------------------------------------------------------------- |
| `docs/raw/04-ATTRIBUTES.md`         | Triptyque SANG/SOUFFLE/CENDRE — bloc fondamental                    |
| `docs/raw/05-VOCATIONS.md`          | 4 vocations V1 (Marcheur-du-Sel, Lame-Ombre, Veilleur, Tisse-Verbe) |
| `docs/raw/06-SURVIVAL.md`           | Faim, soif, fatigue, calamine — gauges Session screen               |
| `docs/raw/07-CHARACTER-CREATION.md` | Forge : étapes, vocations vs concept libre, bonus raciaux           |
| `docs/raw/08-DICE-RESOLUTION.md`    | d20 aux pivots, modificateurs, critiques                            |
| `docs/raw/09-ACTION-LOOP.md`        | Loop par tour : intent → résolution → conséquence → narration       |
| `docs/raw/10-COMBAT.md`             | Règles combat avec triptyque                                        |
| `docs/raw/11-INVENTORY-ECONOMY.md`  | Or (in-game) vs Souvenirs (méta), inventaire                        |

### Social + IA

| Fichier                         | Quand le lire                                    |
| ------------------------------- | ------------------------------------------------ |
| `docs/raw/12-NPCS-RELATIONS.md` | NPCs, relations, dialogues                       |
| `docs/raw/13-REPUTATION.md`     | Système de réputation cross-faction              |
| `docs/raw/15-GAME-MASTER.md`    | Backend Game Master : règles, dés, validation IA |
| `docs/raw/16-MEMORY.md`         | pgvector retrieval, mémoire long-terme du run    |

### Méta + business

| Fichier                        | Quand le lire                                           |
| ------------------------------ | ------------------------------------------------------- |
| `docs/raw/14-META-WORLD.md`    | Souvenirs, méta-monde, persistance cross-run            |
| `docs/raw/17-RUN-CHRONICLE.md` | Chronique générée en fin de run                         |
| `docs/raw/18-RETENTION.md`     | Boucles de rétention joueur                             |
| `docs/raw/19-MONETIZATION.md`  | Modèle économique V1 (9 décisions tranchées 2026-06-30) |

### Technique + planning

| Fichier                       | Quand le lire                                                      |
| ----------------------------- | ------------------------------------------------------------------ |
| `docs/raw/20-ARCHITECTURE.md` | Architecture globale (à croiser avec `docs/03-tech/TECH_STACK.md`) |
| `docs/raw/21-ROADMAP.md`      | Roadmap produit (à croiser avec `docs/01-current-state/MEMORY.md`) |
| `docs/raw/_STATUS.md`         | État de complétion du GDD lui-même                                 |

---

## Raccourcis « pour faire X »

| Tâche                             | Fichier(s) à ouvrir                                                                                                        |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Écran **Auberge de L'Aveugle**    | `docs/raw/15-GAME-MASTER.md` + `docs/raw/14-META-WORLD.md` + `docs/raw/22-GLOSSARY.md`                                     |
| Écran **Character Create**        | `docs/raw/07-CHARACTER-CREATION.md` + `docs/raw/05-VOCATIONS.md` + `docs/raw/04-ATTRIBUTES.md`                             |
| Écran **World Map**               | `docs/raw/02-WORLD-BIBLE.md` + `docs/raw/03-FACTIONS.md`                                                                   |
| Écran **Session** (jeu)           | `docs/raw/09-ACTION-LOOP.md` + `docs/raw/08-DICE-RESOLUTION.md` + `docs/raw/06-SURVIVAL.md` + `docs/raw/15-GAME-MASTER.md` |
| Service backend **dice**          | `docs/raw/04-ATTRIBUTES.md` + `docs/raw/08-DICE-RESOLUTION.md`                                                             |
| Service backend **combat**        | `docs/raw/10-COMBAT.md` + `docs/raw/08-DICE-RESOLUTION.md`                                                                 |
| Service backend **lore**          | `docs/raw/02-WORLD-BIBLE.md` + `docs/raw/22-GLOSSARY.md` + `docs/raw/03-FACTIONS.md` + `docs/raw/03-BESTIARY.md`           |
| Service backend **memory**        | `docs/raw/16-MEMORY.md`                                                                                                    |
| Validation IA (`scene-validator`) | `docs/raw/15-GAME-MASTER.md` + `docs/raw/22-GLOSSARY.md`                                                                   |

---

## Doc projet — `docs/` (état d'implémentation, décisions techniques)

| Fichier                                     | Rôle                                                                          | Quand le lire                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| `docs/00-START-HERE.md`                     | Point d'entrée + tableau de routage — **lire en premier**                     | Toujours en début de session                        |
| `docs/01-current-state/MEMORY.md`           | **Hot cache** — état projet, décisions actées, TODOs prioritaires             | En début de session après 00-START-HERE             |
| `docs/01-current-state/PHASE-1B-BACKLOG.md` | Backlog détaillé Phase 1B                                                     | Avant de commencer un écran Phase 1B                |
| `docs/02-design/GAME_DESIGN.md`             | Résumé implementation-facing du GDD (condensé dev, routes, composants, dette) | Avant d'implémenter un écran ou une feature         |
| `docs/02-design/DESIGN_TOKENS.md`           | Tokens CSS OKLCH, polices, exemples Tailwind                                  | Avant tout travail UI                               |
| `docs/03-tech/TECH_STACK.md`                | Architecture technique complète (stack, DB, AI, routes, tests)                | Pour l'archi générale ou avant d'ajouter un service |
| `docs/wiki/log.md`                          | Journal chronologique des décisions et pivots passés                          | Pour comprendre "pourquoi c'est fait comme ça"      |

---

> L'agent IA **doit lire les fichiers GDD ciblés**, pas relire le repo entier. Si une info manque dans le GDD, demander avant d'inventer.
