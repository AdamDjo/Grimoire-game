# 01 — Pillars & Vision

> Ce que GRIMOIRE doit être. Ce qu'il ne doit jamais devenir.

---

## 1. La promesse unique

**GRIMOIRE ne vend pas une fonctionnalité. Il vend une émotion.**

L'émotion ciblée, unique et obsessionnelle :

> **"Je viens de vivre mon propre roman. Et je peux le recommencer — ce sera différent."**

Tout ce qui s'écarte de cette sensation est du bruit à éliminer.

---

## 2. Les cinq piliers de design

Ces cinq piliers sont **non-négociables**. Toute décision de design doit pouvoir être rattachée à l'un d'eux. Si une mécanique ne sert aucun pilier, elle est supprimée.

### Pilier 1 — 🌊 **Survie**

> _Le monde de Velkhar essaie de te tuer. La soif, le sable, les factions, la Cendre._

Le joueur n'est pas un héros surpuissant. C'est un humain qui doit **survivre** dans un monde hostile. La survie est la pression constante — mais elle ne doit jamais étouffer la narration.

- La faim, la soif et la fatigue sont des **menaces réelles**
- Les créatures du désert, les factions hostiles, les Veilleurs mécaniques sont des **dangers constants**
- La survie crée de la **tension** qui rend les moments de calme précieux
- Mais un run qui ne serait que gestion de ressources = échec de design

**Implication système** : un système de survie complet (PV, faim, soif, fatigue, conditions) — avec un curseur "pas hardcore" pour que l'histoire reste le main focus.

### Pilier 2 — 🎲 **Choix & Dés**

> _Tes décisions comptent. Le destin ne doit rien. Ou si._

À chaque moment pivot, le joueur est confronté à un **choix fertile** — et un **dé** décide du résultat. Pas à chaque action (ça tuerait le rythme), mais aux **tournants** : le combat qui engage la vie, le mensonge que le PNJ pourrait percer, la chute d'une dune, la séduction d'un allié, le sacrifice magique.

- Le joueur voit le dé (transparence façon BG3)
- Succès et échec sont **tous les deux intéressants** — un échec crée du jeu, pas de la frustration
- Nat 20 et nat 1 produisent des **conséquences mémorables**
- La chance ne remplace pas les choix — les mods d'attributs et de compétence comptent

**Implication système** : résolution d20 + modificateur vs DC, moments pivots identifiés par le MJ IA.

### Pilier 3 — 📖 **Lentille Narrative**

> _Chaque vocation voit le monde autrement. Chaque run raconte une histoire différente._

Le joueur ne joue pas un "personnage générique". Il incarne une **vocation** — Marcheur-du-Sel, Lame-Ombre, Veilleur ou Tisse-Verbe — et cette vocation filtre **tout** ce qu'il vit. L'IA propose des scènes, des rencontres et des dilemmes adaptés à sa vocation.

- Même lieu, même PNJ, même événement — **vocation différente = scène différente**
- Le joueur peut aussi **écrire son propre concept** (concept libre), le système dérive ses stats
- La rejouabilité infinie repose sur cette multiplicité de lentilles

**Implication système** : chaque vocation possède une **fiche de contraintes** que le MJ IA consulte.

### Pilier 4 — 🔄 **Rejouabilité**

> _Le même monde. Mille histoires._

GRIMOIRE est un **roguelike narratif**. Chaque run est une aventure complète (3-15h), avec un début, un milieu et une fin. À la fin, le joueur reçoit sa **Chronique** — le récit de ce qu'il a vécu. Il peut recommencer avec la même vocation ou une autre.

- Le **méta-monde** évolue entre les runs (le roi meurt, une Conjonction a eu lieu, une faction a chuté)
- Les **choix divergents** créent des histoires fondamentalement différentes
- L'IA **génère de l'imprévu** (rencontres, rumeurs, événements) dans les limites du Canon
- Même classe, même lieu = **histoire différente**

**Implication système** : méta-monde vivant + génération procédurale dirigée par l'IA + Canon fixe.

### Pilier 5 — 🏺 **Héritage**

> _Ta mort n'est pas stérile. Quelque chose survit._

GRIMOIRE est un **roguelike** — ce qui signifie que la mort est définitive, mais qu'elle **n'est pas vide**. Le joueur laisse un héritage au personnage suivant. Cet héritage est mineur et narratif (pas de power fantasy cumulative), mais il crée la sensation d'appartenir à Velkhar sur le long terme.

- **Héritage d'artéfact** : l'artéfact trouvé dans un run est transmis (un seul, se dégrade après 3-4 transmissions)
- **Écho de réputation** : les PNJ reconnaissent vaguement l'ancêtre ("Tu me rappelles quelqu'un…")
- **Connaissance du monde** : lieux visités et créatures connues rendent le monde plus familier
- **Écho de compétence** : +1 mineur à un modificateur (max +2 cumulé sur ~10 runs)
- **Lignée** : les noms des personnages morts sont conservés, cités, parfois honorés

La difficulté du jeu **ne baisse pas** avec la méta-progression. Le joueur devient plus familier avec Velkhar, pas plus puissant. Façon Hades.

**Implication système** : table `player_meta` en BDD, injectée dans le prompt du MJ IA au démarrage de chaque run.

---

## 3. L'anti-vision (ce que GRIMOIRE n'est PAS)

| GRIMOIRE n'est PAS…                  | …parce que                                                               |
| ------------------------------------ | ------------------------------------------------------------------------ |
| ❌ Un chatbot fantasy                | Les réponses s'appuient sur un monde mémorisé + des mécaniques de jeu    |
| ❌ Un Visual Novel à embranchements  | Les conséquences émergent, l'IA improvise                                |
| ❌ Un RPG CRUD avec stats            | Les stats servent la narration, pas l'inverse                            |
| ❌ Un outil d'écriture collaborative | Le joueur joue, il ne rédige pas la prose — le MJ IA est l'auteur        |
| ❌ Un sandbox sans direction         | Il y a une structure de run, un ton, des enjeux — pas du freeform absolu |
| ❌ Un jeu de survie hardcore         | La survie est la pression, pas le produit fini                           |
| ❌ Un MMORPG                         | Solo en V1, le monde n'est pas partagé entre joueurs                     |
| ❌ Un clone de D&D                   | Les attributs, les vocations et le lore sont uniques à Velkhar           |

---

## 4. Le ton

GRIMOIRE navigue entre trois influences :

- **Dark fantasy désertique** (Dune, Glen Cook, Le Premier Magicien) — survie, perte, beauté morose, sable
- **RPG narratif** (Baldur's Gate 3, Disco Elysium) — choix moraux complexes, personnages qui comptent
- **Roguelike** (Hades, Slay the Spire) — mort qui avance le méta, rejouabilité, progression entre les runs

### Trucs à éviter absolument

- Humour briseur de ton (style Marvel)
- Power fantasy de surpuissance
- Poncifs D&D (elfes/nains/orcs génériques)
- Moralité binaire Bien/Mal
- Exposition pavée
- Gameplay qui étouffe la narration

### Trucs à viser

- Ambiguïté morale constante
- Pertes irréversibles (un PNJ peut mourir pour de bon)
- Mystère non résolu (tout n'est pas expliqué)
- Langage sensoriel : le sable, la soif, la lumière rasante, le silence
- Lenteur comme outil narratif
- La mort comme moment de récit, pas de frustration

---

## 5. Le public cible

### Public primaire 🎯

**Joueurs de 18-35 ans, anglophones, familiers du RP IA et des RPG narratifs.**

- Ont essayé ChatGPT/Character.AI pour le RP et ont été déçus par l'amnésie
- Connaissent Baldur's Gate 3, Disco Elysium, ou Hades
- Acceptent une session longue (3-15h) et réfléchie
- Veulent une histoire _qui leur appartient_ et qu'ils peuvent _recommencer_

### Public secondaire

- Joueurs de CRPG classiques cherchant un récit plus personnel
- Rôlistes sur table curieux du support numérique
- Fans de dark fantasy littéraire

### Public à ne PAS courir après

- Le grand public casual mobile
- Les enfants (< 18 ans, le ton est mature)
- Les power-gamers qui veulent "maxer" un build et "gagner"
- Les joueurs exclusivement multijoueur

---

## 6. La règle d'or de chaque session

> **Toute session réussie est une session dont le joueur se souvient d'un détail précis le lendemain.**

Pas un combat. Pas un loot. Un **détail** : la façon dont un PNJ a détourné le regard, une phrase ambiguë, le silence avant un jet de dé critique. C'est ce qui crée l'attachement et la rejouabilité.

---

## 7. Différenciateurs concurrentiels

| Dimension                   | ChatGPT RP | AI Dungeon | Character.AI | D&D Beyond   | BG3        | **GRIMOIRE**          |
| --------------------------- | ---------- | ---------- | ------------ | ------------ | ---------- | --------------------- |
| Mémoire long-terme          | ❌         | ❌         | ❌           | N/A          | ✅ (fixe)  | ✅ (scope run + méta) |
| Dés / résolution            | ❌         | 🟡         | ❌           | ✅ (DM gère) | ✅✅       | ✅✅ (pivots)         |
| Vocations distinctes        | ❌         | ❌         | ❌           | ✅           | ✅✅       | ✅✅ (lentilles IA)   |
| Système de survie           | ❌         | ❌         | ❌           | ✅           | 🟡         | ✅✅                  |
| Monde qui change entre runs | ❌         | ❌         | ❌           | N/A          | 🟡 (fixed) | ✅ (méta-monde)       |
| Chronique générée           | ❌         | ❌         | ❌           | N/A          | ❌         | ✅                    |
| Cohérence artistique        | ❌         | ❌         | ❌           | N/A          | ✅✅       | ✅                    |
| Pas besoin d'autres humains | ✅         | ✅         | ✅           | ❌           | ❌         | ✅                    |
| Rejouabilité infinie        | ❌         | 🟡         | ❌           | ❌           | ❌         | ✅✅                  |

**Le combo unique : Vocations + Dés + Survie + Méta-monde + Chronique.** Aucun concurrent ne fait les cinq.

---

## 8. North Star Metric

> **Taux de runs terminés (completion) + Taux de 2ᵉ run dans les 7 jours.**

Pas le DAU. Pas le temps de session.

- **Completion rate** : le joueur a-t-il mené son run jusqu'à la fin (mort, victoire, ou conclusion) ? Un run abandonné = le game design a échoué à captiver.
- **2ᵉ run à J+7** : le joueur a-t-il recommencé une nouvelle aventure après sa première ? C'est la preuve que la rejouabilité fonctionne.

Objectif lancement : **≥ 40% completion + ≥ 25% 2ᵉ run à J+7.**
Objectif mature : **≥ 60% completion + ≥ 45% 2ᵉ run à J+7.**

---

## 9. Principes de design dérivés

1. 🟢 **Jamais de formulaire nu.** Toute collecte d'info passe par la fiction.
2. 🟢 **L'émotion avant la mécanique.** En cas de conflit, l'émotion gagne.
3. 🟢 **Le joueur n'est jamais tutoyé par "le système".** C'est toujours un personnage qui parle.
4. 🟢 **La mort est réelle, mais pas punitive gratuitement.** Elle génère une Chronique et nourrit le méta.
5. 🟢 **La lenteur est une feature.** Hésitation, silence, attente = intentionnel.
6. 🟢 **L'IA ne brise jamais le quatrième mur.** Pas de "En tant qu'IA…"
7. 🟢 **Les dés ne sont tirés qu'aux moments pivots.** Pas de micro-gestion aléatoire.
8. 🟢 **La survie est une pression, pas une punition.** Le joueur souffre, mais pas de façon qui le fait quitter.
9. 🟢 **La magie est une tentation, pas un outil.** Toujours un prix, toujours un risque.
10. 🟢 **Chaque vocation = une expérience fondamentalement différente.** Pas des skins sur le même jeu.

---

## 10. Risques produit majeurs

| Risque                                | Impact | Mitigation                                                   |
| ------------------------------------- | ------ | ------------------------------------------------------------ |
| Coût LLM (même gratuit, rate limits)  | 🔴     | OpenRouter + 1-2 appels/tour + caching                       |
| Incohérences narr. sur un run long    | 🔴     | Canon fixe en RAG + Validateur + prompt strict               |
| Run abandonné (trop long / trop plat) | 🔴     | Structure en 3 actes + pacing + cliffhangers                 |
| "Survie" étouffe la narration         | 🟡     | Curseur "pas hardcore", events narratifs > micro-gestion     |
| Dés frustrants (échecs à répétition)  | 🟡     | Mods d'attributs compensent, échec = jeu pas punition        |
| Vocations trop similaires en pratique | 🟡     | Fiches de contraintes strictes, lentilles testées séparément |
| Free tiers insuffisants (rate limits) | 🔴     | Quota de runs/jour, fallback providers                       |

---

## 11. Pitch en une phrase pour l'équipe

> _GRIMOIRE n'est pas un chatbot. C'est un roguelike narratif où chaque run est un roman de survie, de dés et de magie interdite — et où le monde change entre tes aventures._

---

_Le lore de Velkhar (cosmologie, peuples, magie, factions) est détaillé dans `02-WORLD-BIBLE.md` et `03-FACTIONS.md`._
