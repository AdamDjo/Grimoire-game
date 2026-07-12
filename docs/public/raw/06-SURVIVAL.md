# 06 — Survie

> Le monde de Velkhar essaie de te tuer. Pas toujours violemment.

---

## 0. Principe

La survie est la **pression constante** du jeu (Pilier 1). Mais elle ne doit **jamais** étouffer la narration ni devenir de la micro-gestion. Le joueur souffre, mais ce n'est pas un simulateur de famine.

> _L'objectif n'est pas que le joueur gère une jauge de soif. C'est que la soif pèse sur ses choix. Accepter un contrat dangereux juste pour accéder à un puits — voilà l'émotion visée._

### Le curseur "pas hardcore"

- 🟢 Les jauges se dégradent **lentement** (pas une crise par scène)
- 🟢 Le danger vient de la **narration** (l'IA décrit la fatigue, la fièvre) autant que des chiffres
- 🟢 La mort par survie est possible mais **rare** — elle survient par négligence prolongée, pas par RNG
- 🟢 Le joueur peut toujours **se retourner** (trouver eau, chasser, se reposer) si il réagit

---

## 1. Les quatre jauges

| Jauge                     | Dégradée par                             | Restaurée par                              | Attribut lié |
| ------------------------- | ---------------------------------------- | ------------------------------------------ | ------------ |
| 🩸 **PV** (Points de Vie) | Blessures, poison, maladie, faim extrême | Repos, soin, nourriture                    | SANG         |
| 💧 **Soif**               | Temps, chaleur, effort                   | Boire (eau, tisane, alcool)                | SANG         |
| 🍖 **Faim**               | Temps, effort                            | Manger (viande séchée, dattes, racines)    | SANG         |
| 😴 **Fatigue**            | Marche, combat, manque de sommeil        | Dormir (auberge, feu de camp, repos court) | SANG         |

🟢 _Toutes liées à SANG — le survivant endurci résiste mieux._

### Échelle de chaque jauge (0–100)

```
100  ─── pleine forme
 75  ─── légère gêne (l'IA commence à la mentionner)
 50  ─── malus modéré au jet (-1)
 25  ─── malus sévère (-2), l'IA décrit la souffrance
 10  ─── critique, risque de condition (évanouissement, fièvre)
  0  ─── la jauge touche zéro → condition grave
```

### Base PV

```
PV_max = 10 + modificateur SANG
```

🟢 _Un Marcheur-du-Sel (SANG +2) démarre à 12 PV. Un Tisse-Verbe (SANG -1) à 9 PV._

---

## 2. Les conditions

Au-delà des jauges, le perso peut subir des **conditions** — altérations temporaires ou persistantes.

### Types de conditions

| Condition                  | Cause                                | Effet                                  | Durée                     |
| -------------------------- | ------------------------------------ | -------------------------------------- | ------------------------- |
| 🔥 **Fièvre**              | Faim/soif à 0, maladie, marais       | -2 à tous les jets                     | Jusqu'au soin             |
| 💀 **Empoisonnement**      | Créature, poison, eau corrompue      | -1d4 PV/tour (combat), -1 hors combat  | Jusqu'au soin             |
| 🩸 **Blessure**            | Combat (réduit à 0 PV ou proche)     | -1 aux jets SANG, limite le portage    | Jusqu'au repos long       |
| 🧊 **Gel**                 | Nuit dans le désert, haute montagne  | -1 SOUFFLE, malus mouvement            | Jusqu'à source de chaleur |
| 🌀 **Étourdissement**      | Coup à la tête, explosion            | Perte d'un tour (combat)               | Court                     |
| 😵 **Cécité temporaire**   | Ventre-Gris, lumière archontique     | -2 SOUFFLE (perception)                | Court                     |
| 🤢 **Maladie des marais**  | Marais de Lekh                       | -1 à tous, fatigue double              | Long, soin spécifique     |
| 🔮 **Cendre-corrompu**     | Magie excessive (Tisse-Verbe)        | Progresse vers Calamine                | Voir §4                   |
| 🧠 **Raison ébranlée**     | Trauma, mort d'un proche, révélation | -1 CENDRE, hallucinations              | Variable                  |
| 🪨 **Pétrification lente** | Veilleur archontique                 | Malus progressifs → mort si non soigné | Mortel                    |

🟢 _Le joueur peut subir plusieurs conditions simultanément — mais le MJ IA évite l'empilement punitif._

---

## 3. Le repos

Le joueur peut **se reposer** pour restaurer les jauges. Trois types de repos :

### 🛌 Repos court (1-2h, dans le monde)

- Récupère ~20% fatigue
- Soin léger (1d4 PV si bandages)
- Permet de manger / boire sur le pouce
- Risque : aléatoire (rencontre, embuscade)

### 🔥 Repos long / feu de camp (une nuit)

- Récupère ~60% fatigue, faim, soif (si provision)
- Soin modéré (1d4+mod SANG PV si bandages)
- Permet l'artisanat, la veille, les conversations
- Risque : aléatoire (rencontre nocturne)

### 🏠 Repos en auberge (une nuit, payant)

- Récupère 100% de tout
- Soin complet + retrait d'une condition bénigne
- Accès à rumeurs, PNJ, marché
- Risque : nul, mais coûte du _fer_

🟢 _Le repos est l'occasion de scènes calmes — dialogue PNJ, contemplation, choix réfléchi._

---

## 4. La Cendre et la Calamine

La magie n'est jamais gratuite (voir `02-WORLD-BIBLE.md`). **Tout usage d'artefact** accumule de la **Cendre** dans le corps de l'aventurier. Aucun n'y échappe — mais tous ne payent pas au même rythme.

- 🩸 **Aventuriers ordinaires** (Marcheur-du-Sel, Lame-Ombre, Veilleur) — accumulent de la Cendre uniquement quand ils déclenchent un artefact (pouvoir de base). Lent.
- 🔥 **Tisse-Verbe** — accumule à chaque **éveil**, beaucoup plus vite que les autres. C'est le prix de son don : il tire le pouvoir total des artefacts, mais sa Calamine progresse en compte à rebours accéléré.

### La jauge de Cendre (0–100)

| Seuil | Effet            | Narration                                       |
| ----- | ---------------- | ----------------------------------------------- |
| 0–24  | Rien             | mains propres                                   |
| 25–49 | Stade 1 Calamine | mains grisâtres, insomnie, rêves archontiques   |
| 50–74 | Stade 2          | saignements, perte de mémoire courte, stérilité |
| 75–99 | Stade 3          | transformation en _Calciné_ imminente           |
| 100   | Transformation   | Le perso devient un Calciné → **mort du perso** |

### Comment réduire la Cendre

- 🟢 **Repos long** : -10 Cendre
- 🟢 **Sœurs du Silence** (rituel au Culte) : -30 Cendre, mais coût (fer, quête, secret)
- 🟢 **Artefact purificateur** (rare) : -50 Cendre une fois

🟢 _Tout aventurier qui touche aux artefacts gère un compte à rebours. Le Tisse-Verbe vit ce dilemme à chaque scène (éveiller = puissance immédiate, Calamine plus proche), les autres vocations ne le rencontrent qu'aux moments où elles décident d'activer un artefact trouvé._

---

## 5. Le climat et les biomes

La survie dépend du **lieu**. Chaque biome de Velkhar a son profil de danger.

| Biome                     | Chaleur                      | Eau        | Nourriture      | Danger spécifique                       |
| ------------------------- | ---------------------------- | ---------- | --------------- | --------------------------------------- |
| 🏜️ **Tissan** (désert)    | Extrême le jour, gel la nuit | Rare       | Faible          | Ventre-Gris, Tisseurs de Sable, mirages |
| 🪨 **Doigts** (montagnes) | Froid                        | Moyenne    | Chasse possible | Veilleurs archontiques, éboulements     |
| 🌊 **Rivage** (côte)      | Tempéré                      | Abondante  | Abondante       | Pirates, maladie, inondations           |
| 🌫️ **Marais de Lekh**     | Moite                        | Contaminée | Plantes         | Fièvres, Mangeurs de Souvenir, poison   |
| 🏛️ **Cœur** (Velkhar)     | Tempéré                      | Marché     | Marché          | Crime, dette, Inquisition               |

🟢 _L'IA reçoit le biome courant dans son prompt et adapte la narration de survie._

---

## 6. Survie et dés

Les actions de survie **peuvent** déclencher un dé (voir `08-DICE-RESOLUTION.md`), mais pas toujours :

| Action                           | Dé ?            | Attribut                   |
| -------------------------------- | --------------- | -------------------------- |
| Trouver de l'eau dans le désert  | ✅ (pivot)      | SANG + Survie              |
| Allumer un feu par temps venteux | ✅ (pivot)      | SOUFFLE + Survie           |
| Résister au poison               | ✅ (sauvegarde) | SANG                       |
| Marcher une journée de plus      | Non — narratif  | (la fatigue s'accumule)    |
| Chasser un animal                | ✅ (pivot)      | SOUFFLE + Survie           |
| Naviguer en tempête              | ✅ (pivot)      | SANG + Navigation          |
| Éviter le Ventre-Gris            | ✅ (sauvegarde) | SOUFFLE (perception)       |
| Dormir en sécurité               | Non — narratif  | (restauration automatique) |

🟢 _Les dés apparaissent quand l'issue est **incertaine et importante**. Le reste est narratif._

---

## 7. La mort par survie

Possible, mais **rare et télégraphiée**.

### Règle

- 🟢 Le perso ne meurt pas d'un seul coup de faim
- 🟢 Les jauges doivent s'effondrer **progressivement** et le joueur doit avoir **ignoré les avertissements**
- 🟢 À 0 PV → inconscience (pas mort immédiate) → l'IA décide du sort selon contexte (captivité, secours, mort)
- 🟢 La mort par survie génère une **Chronique** comme toute mort

🟢 _Règle absolue : la mort par survie ne doit jamais être perçue comme injuste ou RNG._

---

## 8. Survie et équipement

L'équipement de survie est **stocké en base** et injecté dans le prompt du MJ IA (voir `11-INVENTORY-ECONOMY.md`).

| Équipement           | Effet sur la survie                                                 |
| -------------------- | ------------------------------------------------------------------- |
| Gourde               | + capacité d'eau, ralentit la soif                                  |
| Vêtements du désert  | Résistent à la chaleur diurne et au gel nocturne                    |
| Tente / toile        | Repos plus sûr, protège du Ventre-Gris                              |
| Bandages             | Soin lors du repos                                                  |
| Antidote             | Retire l'empoisonnement                                             |
| Nourriture séchée    | Restaure la faim sans chasse                                        |
| Boussole archontique | + navigation                                                        |
| Outre de Cendre      | Permet au Tisse-Verbe de stocker de la Cendre (retarde la Calamine) |
| Masque filtrant      | Protège du Ventre-Gris et des marais                                |

🟢 _Le MJ IA prend en compte l'équipement du joueur : "Ta gourde est vide depuis deux jours" ou "Ton masque filtrant grésille, le Ventre-Gris approche."_

---

## 9. Synthèse

```
SURVIE = 4 JAUGES (PV, Soif, Faim, Fatigue)
   ↓ dégradation lente, pression narrative
   ↓
CONDITIONS (fièvre, poison, blessure, Calamine…)
   ↓ se soignent par repos / soin / artefact
   ↓
REPOS (court / feu / auberge)
   ↓ occasion de scènes calmes
   ↓
BIOMES (désert, montagne, côte, marais, ville)
   ↓ adaptent les dangers
   ↓
ÉQUIPEMENT (gourde, tente, masque…)
   ↓ stocké en base, injecté dans le prompt
   ↓
LA MORT POSSIBLE — mais rare, télégraphiée, jamais injuste
```

---

_Le système de **dés** qui arbitre les actions de survie est détaillé dans `08-DICE-RESOLUTION.md`._
