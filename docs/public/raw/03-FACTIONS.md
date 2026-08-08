# 03 — Factions

> Qui détient le pouvoir dans Velkhar, et comment le joueur interagit avec eux.

---

## 0. Principe de design

Les factions sont des **acteurs vivants** qui ont leurs propres objectifs, ressources et conflits. Elles se souviennent des actions du joueur et évoluent dans le temps (même hors-ligne).

⚠️ _Cette version (v2) est **réduite** pour le lancement : 4 factions majeures (avec fiches complètes) + 5 mineures (mentionnées). Le système complet de relations inter-factions arrive en V2._

### Le joueur n'est jamais "membre"

Le joueur n'est jamais "membre" d'une faction. Il entretient une **relation** avec elles, mesurée par un score de **réputation** (voir `13-REPUTATION.md`).

---

## 1. Les 4 factions MAJEURES (fiches complètes)

Ces 4 factions sont au cœur du jeu. Chacune a une fiche complète, un PNJ-marqueur, et interagit fortement avec le joueur.

### ⛪ **Le Culte des Cendres** _(religion dominante)_

La religion officielle, qui contrôle la capitale et traque la magie libre.

- **Chef** : _Sa-Sainteté Othmar_, le _Pontife-Grincant_ (très âgé)
- **Base** : _Velkhar_ (la cathédrale du Culte)
- **Force** : Inquisition, structure, légitimité spirituelle
- **Objectif** : Interdire l'usage libre des artefacts, maintenir l'ordre, purifier la Calamine (à un prix)
- **PNJ-marqueur** : **Inquisiteur Vane** — implacable, balafré, complexe
- **Réputation joueur** : froide au départ ; l'Inquisition traque le Tisse-Verbe dès le départ
- **Vocations liées** : Tisse-Verbe (hostile), Veilleur (méfiant)

### 💰 **La Guilde du Sel** _(commerce, caravanes)_

La plus ancienne faction marchande. Contrôle les Routes du Sel, le sel et les caravanes.

- **Chef** : _Maître Salhene_ — vieille Sahéline redoutable, matriarche
- **Base** : _Khar-Then_
- **Force** : réseau de caravanes, renseignement, richesse
- **Objectif** : Maintenir le commerce, protéger les caravanes, trouver un successeur à Salhene
- **PNJ-marqueur** : **Maître Salhene** — sage, pragmatique, perçante
- **Réputation joueur** : neutre au départ
- **Vocations liées** : Marcheur-du-Sel (naturellement allié)

### 🗡️ **La Main d'Ombre** _(assassins, secrets)_

La guilde des assassins. Tueurs à gages, espions, faussaires. Transnationale.

- **Chef** : _le Tisseur_ (anonyme, communique par billets)
- **Base** : mouvante, repères secrets
- **Force** : meurtres, informations, chantage
- **Objectif** : Profits, secrets, neutralité affichée (mais contrat = contrat)
- **PNJ-marqueur** : **Mihail** — tueur élégant, contractuel, dangereux
- **Réputation joueur** : transactionnelle au départ
- **Vocations liées** : Lame-Ombre (accès par contrats)

### 🏛️ **Les Éveilleurs** _(pilleurs de ruines, artefacts)_

Ancienne guilde officiellement interdite par le Culte, qui continue en secret. Cherche les artefacts dans les ruines.

- **Chef** : _Kael le Muet_ — Changepeau légendaire, insaisissable
- **Base** : mouvante, dans les Doigts (ruines)
- **Force** : artefacts, savoir interdit, réseau de ruines/donjons
- **Objectif** : Retrouver les artefacts, comprendre le passé, échapper à l'Inquisition
- **PNJ-marqueur** : **Kael le Muet** — mystérieux, légendaire
- **Réputation joueur** : inconnue tant que non découverte (faction secrète)
- **Vocations liées** : Veilleur (faction naturelle)

---

## 2. Les 5 factions MINEURES (mentionnées, pas de fiche lourde)

Ces factions existent dans le monde, sont mentionnées par les PNJ et la narration, mais n'ont pas de fiche complète au lancement. Elles enrichissent le monde sans surcharger le joueur.

| Faction                                       | Rôle                                                                                     | Mention                             |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------- |
| 🌊 **Guilde du Rivage** _(les Ventrus)_       | Commerce maritime, opulence, corruption. Rivale de la Guilde du Sel.                     | PNJ marchands, intrigues portuaires |
| 🪙 **Guilde des Changeurs**                   | Banquiers, prêteurs, tenanciers de dettes. Discrète, crainte.                            | Prêts, dettes, chantage             |
| 🔮 **Les Rénovateurs** _(hérésie savante)_    | Pensent que les Archontes étaient des sauveurs. Cherchent les artefacts pour comprendre. | Hérétiques, PNJ cachés              |
| 💀 **Les Affamés** _(secte apocalyptique)_    | Veulent un nouveau cataclysme. Terroristes.                                              | Menace rare, terrifiante            |
| 🌙 **Les Tisseuses** _(culte féminin secret)_ | Disent converser avec des forces cachées. Tolérées avec méfiance.                        | Mystère, présages                   |

🟢 _Les mineures sont nommées, présentes dans la narration, mais le joueur n'a pas de "fiche de réputation" formelle avec elles au lancement._

---

## 3. Seuils de réputation

| Score      | Statut           | Effet narratif                                   |
| ---------- | ---------------- | ------------------------------------------------ |
| −100 à −71 | 💀 _Némésis_     | La faction veut ta mort active                   |
| −70 à −31  | ⚔️ _Ennemi_      | Refus de service, hostilité                      |
| −30 à −10  | 😐 _Indésirable_ | Méfiance, prix majorés                           |
| −9 à +9    | 😶 _Inconnu_     | Neutralité                                       |
| +10 to +29 | 🤝 _Toléré_      | Services de base, quêtes mineures                |
| +30 to +69 | ⭐ _Allié_       | Accès aux secrets, quêtes majeures               |
| +70 to +99 | 🛡️ _Champion_    | La faction te défend, te recommande              |
| +100       | 👑 _Légende_     | On raconte des histoires sur toi dans la faction |

Détail complet en `13-REPUTATION.md`.

---

## 4. Les PNJ-marqueurs (rappel)

Chaque faction majeure a **un PNJ-marqueur** : personnage récurrent, mémorable, avec lequel le joueur interagit durablement (voir `12-NPCS-RELATIONS.md`).

| Faction           | PNJ-marqueur       | Rôle                          |
| ----------------- | ------------------ | ----------------------------- |
| Culte des Cendres | _Inquisiteur Vane_ | Implacable, balafré, complexe |
| Guilde du Sel     | _Maître Salhene_   | Matriarche sage et perçante   |
| Main d'Ombre      | _Mihail_           | Tueur élégant, contractuel    |
| Éveilleurs        | _Kael le Muet_     | Changepeau légendaire         |

🟡 _À compléter : PNJ-marqueurs additionnels (PNJ locaux par région, aubergistes marquants, antagonistes locaux). Cible ~10-15 PNJ-marqueurs au total au lancement._

---

## 5. Comment le joueur interagit

Le joueur construit de l'influence par :

1. **Quêtes** — accomplir des missions pour une faction (+réputation)
2. **Faveurs** — contracter/rembourser des dettes
3. **Donations** — argent, artefacts, informations
4. **Sabotage** — affaiblir une faction rivale (+ chez l'une, − chez l'autre)

🟢 _Le système complet (alliances inter-factions, évolution dynamique, guerres) arrive en V2._

---

## 6. V2 — Système complet (prévu)

Au lancement, on garde les factions **simples**. En V2 :

- 🟡 **Matrice de relations inter-factions** (la Guilde du Sel déteste la Guilde du Rivage, etc.)
- 🟡 **Évolution dynamique** (une faction affaiblie peut être attaquée par une rivale)
- 🟡 **Factions mineures promues en majeures** (Rénovateurs, Affamés)

🟢 _Pour la V1, on privilégie la clarté : 4 factions majeures, relations simples, score de réputation._

---

## 7. Risques & garde-fous

| Risque                             | Mitigation                                                               |
| ---------------------------------- | ------------------------------------------------------------------------ |
| Trop de factions = confusion       | 4 majeures au lancement, mineures en fond                                |
| Réputation trop visible / gamifiée | Jamais de chiffres dans l'UI narrative (que dans le carnet de relations) |
| Factions stéréotypées              | Chaque faction a sa nuance (le Culte n'est pas "le mal", etc.)           |

---

_Les **PNJ-marqueurs** sont détaillés dans `12-NPCS-RELATIONS.md`. Le système de **réputation** complet dans `13-REPUTATION.md`._
