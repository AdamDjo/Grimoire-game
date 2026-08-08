# 08 — Résolution par les Dés

> _Tes décisions comptent. Le destin ne doit rien. Ou si._

---

## 0. Principe

GRIMOIRE utilise un système de dés inspiré de **Baldur's Gate 3**, mais **allégé**. On ne lance pas à chaque action (ça tuerait le rythme narratif) — seulement aux **moments pivots**, quand l'issue est incertaine et importante.

> _Le dé n'est pas là pour punir. Il est là pour rendre le monde imprévisible, et les réussites/critiques mémorables._

---

## 1. Le dé de base : d20

```
Jet = d20 + modificateur d'attribut + bonus de compétence
```

Comparé à un **DC** (Difficulty Class / Difficulté).

| DC  | Niveau         | Exemple                                        |
| --- | -------------- | ---------------------------------------------- |
| 5   | Très facile    | Frapper un homme ivre endormi                  |
| 8   | Facile         | Grimper une dune instable                      |
| 10  | Moyen          | Persuader un garde indifférent                 |
| 13  | Difficile      | Désarmer un adversaire entraîné                |
| 16  | Très difficile | Éveiller un artefact mineur (Tisse-Verbe)      |
| 19  | Extrême        | Survivre seul au Ventre-Gris                   |
| 22  | Héroïque       | Négocier avec un Veilleur archontique          |
| 25  | Légendaire     | Convaincre un Inquisiteur de te laisser partir |

🟢 _Le MJ IA fixe le DC selon le contexte et le lore. Les DC > 20 sont réservés aux moments épiques._

---

## 2. Le résultat du jet

```
d20 + mod + compétence  VS  DC
   ↓
≥ DC  →  SUCCÈS
   ├── si le dé naturel = 20  →  SUCCÈS CRITIQUE (effet spécial)
   └── si marge ≥ 5            →  succès remarquable

< DC  →  ÉCHEC
   ├── si le dé naturel = 1   →  ÉCHEC CRITIQUE (complication)
   └── si marge ≤ -5          →  échec catastrophique
```

### Succès

- 🟢 Le joueur réussit son action comme prévu
- 🟢 **Succès remarquable** (marge ≥5) : bonus supplémentaire (plus de dégâts, PNJ plus impressionné, information bonus)
- 🟢 **Nat 20** : moment mémorable — l'IA génère un effet spécial narrativement fertile

### Échec

- 🟢 L'action échoue, mais **ne bloque jamais le jeu**
- 🟢 Un échec crée une **complication** (pas un game over) : le garde n'est pas convaincu mais reste méfiant, la flèche rate mais alerte l'ennemi
- 🟢 **Nat 1** : complication majeure — l'arme se brise, le PNJ se fâche définitivement, l'artefact se retourne contre celui qui le manie

🟢 _Règle absolue : un échec n'est jamais un dead-end. Il ouvre une nouvelle voie._

---

## 3. Les moments pivots (quand lancer les dés)

Le MJ IA identifie les moments pivots. Règle : **lancer si l'issue est incertaine ET importante**.

### Catégories de pivots

| Catégorie                            | Exemples                                                      |
| ------------------------------------ | ------------------------------------------------------------- |
| ⚔️ **Combat clé**                    | Frapper un ennemi, désarmer, esquiver                         |
| 💬 **Mensonge / persuasion risquée** | Tromper un Inquisiteur, séduire un PNJ important              |
| 🏃 **Sauvegarde (éviter un danger)** | Esquiver, résister au poison, garder l'équilibre              |
| 🗺️ **Exploration dangereuse**        | Désamorcer un piège archontique, franchir un précipice        |
| 🔮 **Artefacts**                     | Activer le pouvoir d'un artefact, ou l'éveiller (Tisse-Verbe) |
| 💀 **Survie critique**               | Trouver de l'eau, résister au Ventre-Gris                     |

### Ce qui ne déclenche PAS de dé

- 🟢 Discuter normalement avec un PNJ amical
- 🟢 Marcher sur une route sûre
- pivots critiques où l'issue est **certaine** (frapper un homme endormi)
- 🟢 Acheter au marché
- 🟢 Ouvrir une porte non verrouillée
- 🟢 Raconter un souvenir, faire un choix moral (le choix est au joueur, pas au dé)

---

## 4. Le joueur voit le dé (transparence BG3)

Le joueur voit **toujours** le dé quand il est lancé :

```
┌───────────────────────────────────────┐
│  Tu tentes de persuader le garde...    │
│                                        │
│  [ Persuasion ]  CENDRE +2  vs  DC 13  │
│                                        │
│         🎲 d20 = 14                    │
│         14 + 2 = 16                    │
│                                        │
│         ✅ SUCCÈS                      │
└───────────────────────────────────────┘
```

🟢 _Transparence totale. Le joueur comprend POURQUOI il réussit ou échoue. C'est ce qui crée l'engagement._

---

## 5. Avantage et Désavantage

Certaines situations donnent **avantage** (lancer 2d20, garder le meilleur) ou **désavantage** (garder le pire).

### Avantage 🟢

- Le joueur a un **plan préparé** (reconnaissance, plan détaillé)
- Le joueur a un **objet adapté** (grappin pour escalader)
- Le joueur a un **allié** qui l'aide (un PNJ distrait le garde)
- Le joueur exploite une **faiblesse** de l'ennemi

### Désavantage 🔴

- Conditions sévères (blessure, fièvre, fatigue <25%)
- Équipement inadapté (escalader sans corde)
- Situation défavorable (intimider en étant blessé)
- Cible sur ses gardes (un garde alerté)

🟢 _Avantage/désavantage = la principale façon dont l'équipement, les conditions et la préparation influencent les dés._

### Désavantage par condition (contrat moteur)

Le moteur (`game-rules/dice.ts`) applique le **Désavantage** automatiquement quand **au moins une condition sévère active** l'impose. Une condition « sévère » est marquée `disadvantage: true` dans la table canon des conditions (`06-SURVIVAL §2`).

- Implémentation : `roll = min(d20, d20)` (2 tirages, on garde le pire) dès qu'une condition sévère est active pour l'attribut concerné.
- Le désavantage **ne se cumule pas** : plusieurs conditions sévères = toujours un seul désavantage (2d20 garder le pire), jamais 3d20. C'est un état booléen, pas un empilement.
- Avantage et Désavantage s'**annulent** : si le contexte donne un avantage et une condition un désavantage, le jet redevient un simple d20.
- Le résultat exposé au joueur (transparence BG3, §4) indique explicitement « Désavantage » et sa cause (la condition).

---

## 6. Compétences et attributs

Chaque jet associe un **attribut** à une **compétence**. Le bonus de compétence monte avec l'usage (voir `05-VOCATIONS.md`).

### Liste des compétences (par attribut)

#### SANG

- Athlétisme (escalader, nager, sauter, porter)
- Mêlée (épée, hache, poings, bouclier)
- Intimidation (par la force)
- Survie (trouver eau, s'orienter, chasser)
- Résistance (sauvegarde contre poison, maladie, douleur)

#### SOUFFLE

- Tir (arc, arbalète, dague de jet)
- Furtivité (se cacher, se déplacer en silence)
- Artisanat (réparer, forger, manipuler artefacts)
- Investigation (fouiller, décrypter, repérer pièges)
- Éveil (réveiller et pousser un artefact — Tisse-Verbe seul au démarrage)

#### CENDRE

- Persuasion (convaincre, marchander, séduire)
- Tromperie (mentir, bluffer, déguiser)
- Leadership (commander, inspirer, galvaniser)
- Résistance à la Cendre (sauvegarde contre effets d'artefacts et corruption)
- Foi / Rituel (prières, rituels du Culte)

🟢 _~15 compétences. Chaque vocation démarre avec 4 compétences de départ._

---

## 7. Les dés de dégâts (combat)

Le combat utilise des dés de **dégâts** (en plus du d20 de toucher). Voir `10-COMBAT.md` pour le détail.

```
Dégâts = dé d'arme + modificateur SANG
```

| Arme                                       | Dé de dégâts         |
| ------------------------------------------ | -------------------- |
| Poing / gourdin                            | 1d4                  |
| Dague                                      | 1d4                  |
| Épée courte                                | 1d6                  |
| Sabre / épée longue                        | 1d8                  |
| Hache / masse                              | 1d10                 |
| Arme lourde / archontique                  | 1d12 ou 2d6          |
| Artefact (pouvoir de base, toute vocation) | 1d8                  |
| Artefact (éveillé par un Tisse-Verbe)      | 3d6 ou effet spécial |

🟢 _Les dégâts réduisent les PV. À 0 PV → inconscience → l'IA décide du sort selon contexte._

---

## 8. Succès et échec critiques — exemples narratifs

Le MJ IA génère des conséquences **fertiles** (voir `01-PILLARS.md`).

### Nat 20 — exemples

- **Combat** : coup fatal, l'ennemi est désarmé, le sang gicle, les alliés dégainent
- **Persuasion** : le garde devient un allié, offre une information, te laisse passer avec respect
- **Furtivité** : tu disparais totalement, tu surprends une conversation, tu trouves une cachette parfaite
- **Artefact** : l'effet est amplifié, ne coûte pas de Cendre cette fois, révèle une propriété oubliée

### Nat 1 — exemples

- **Combat** : l'arme se coince, glisse, se brise
- **Persuasion** : ton argument se retourne contre toi, le PNJ se ferme définitivement
- **Furtivité** : tu fais du bruit, tu tombes sur un objet bruyant, un garde te repère
- **Artefact** : l'effet se retourne, la Cendre accumulée est double, tu te blesses sur le coup

🟢 _Le nat 1 doit créer de la situation, pas de la frustration._

---

## 9. Le dé et la saisie libre (le cœur du gameplay)

C'est ici que les deux systèmes coexistent (voir `09-ACTION-LOOP.md`).

### Le flux

```
1. Le joueur décrit son action (libre, Discord-like)
   ↓
2. Le MJ IA interprète l'intention
   → identifie l'attribut + compétence pertinents
   → estime le DC
   ↓
3. Décision : dé ou pas ?
   ├── action banale → narration pure, pas de dé
   └── action pivot → LANCEMENT DU DÉ
   ↓
4. Le joueur voit le dé, le résultat
   ↓
5. Le MJ IA narre le résultat
   → succès : comme prévu (+ bonus si critique)
   → échec : complication fertile (pas dead-end)
```

🟢 _Le joueur n'a jamais à connaître les règles. Il décrit, l'IA arbitre._

---

## 10. Risques & garde-fous

| Risque                                        | Mitigation                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| Trop de dés → rythme cassé                    | Max 1-2 dés par scène, pivots uniquement                                   |
| Nat 1 frustrant → churn                       | Échec = complication fertile, jamais dead-end                              |
| Le joueur ne comprend pas pourquoi il échoue  | Transparence totale du dé (BG3)                                            |
| Le dé contredit la narration                  | Le dé arbitre, l'IA narrre — jamais l'inverse                              |
| DC incohérents                                | Tables de référence + calibration par playtests                            |
| Éveil d'artefact (Tisse-Verbe) trop aléatoire | Effet de base garanti + dé pour l'amplification, pas pour le déclenchement |

---

## 11. Synthèse

```
Joueur décrit une action
   ↓
IA interprète (attribut + compétence + DC)
   ↓
Action banale ?  →  narration pure
Action pivot ?   →  DÉ (d20 + mod + compétence vs DC)
                      ↓
              Succès  /  Échec
              (+ crit nat 20 / nat 1)
                      ↓
           IA narrre le résultat (fertile, jamais dead-end)
```

🟢 _Simple. Transparent. BG3-lite. Au service de l'émotion._

---

_La **boucle d'action** complète (saisie libre + choix IA + dés) est détaillée dans `09-ACTION-LOOP.md`._
