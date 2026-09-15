# 05 — Vocations

> _Quatre façons d'entrer dans Velkhar. Quatre histoires fondamentalement différentes._

---

## 0. Principe

Une **vocation** n'est pas une "classe D&D". C'est une **lentille narrative** — un angle sur le monde. Le Marcheur-du-Sel et la Lame-Ombre qui entrent dans la même taverne ne vivent **pas la même scène**. Le MJ IA adapte sa narration à la vocation du joueur.

Chaque vocation est définie par une **fiche de contraintes** que le MJ IA consulte (façon `lore/vocations.canon.ts`). L'IA ne propose jamais une scène qui contredirait la vocation.

### Comment la vocation structure le jeu

| Élément                 | Rôle                                       |
| ----------------------- | ------------------------------------------ |
| **Lentille narrative**  | Comment le perso voit le monde             |
| **Scènes privilégiées** | Ce que l'IA propose plus souvent           |
| **Scènes évitées**      | Ce que l'IA ne force pas                   |
| **Forces**              | Compétences de départ                      |
| **Tabous**              | Ce que le perso ne ferait pas (par défaut) |
| **Contacts de départ**  | PNJ + faction liés                         |
| **Peur initiale**       | Le secret/faute qui le hante               |
| **Arc narratif type**   | La trajectoire que l'IA peut suivre        |

### Création : vocation OU concept libre

- 🟢 Le joueur choisit une **vocation** (parmi les 4) → répartition d'attributs conseillée + fiche de contraintes
- 🟢 OU le joueur écrit son **propre concept** ("un ancien prêtre du Culte qui a perdu la foi et cherche à se venger") → l'IA dérive les attributs + compétences de départ à partir du texte, et génère une fiche de contraintes personnalisée

Les deux chemins coexistent. Les vocations guident les hésitants ; le concept libre offre la liberté pour les rôlistes.

---

## 1. Les 4 vocations au lancement

```
🐫 MARCH DU-SÉL     Survie, commerce, désert, hospitalité
🗡️ LAME-OMBRE       Furtivité, poison, contrats, secrets
🏛️ VEILLEUR         Ruines, artefacts, savoir interdit, cupidité
🔥 TISSE-VERBE      Éveil d'artéfacts, pouvoir, Cendre, Calamine
```

---

## 2. 🐫 Marcheur-du-Sel

> _"Le sel ne ment pas."_

### Profil d'attributs conseillé

```
SANG     14  (+2)   ← endurant, caravanière
SOUFFLE  10  ( 0)   ← moyen
VOLONTÉ   10  ( 0)   ← moyen, mais bonne sociabilité
```

### Lentille narrative

> _Tu vois le monde comme un réseau de routes, de caravanes et de dettes d'hospitalité. Le désert est ton terrain — pas ton ennemi. Tu sais lire le sable, le vent, le ciel. Les gens te font confiance parce que les Marcheurs-du-Sel sont les nerfs du commerce._

### Scènes privilégiées

- Caravanes, routes du sel, voyages, marchands
- Survie dans le désert (trouver eau, abri, orientation)
- Commerce, marchandage, négociation commerciale
- Hospitalité, dette d'hospitalité, alliances
- Rencontres sur les routes (voyageurs, bandits, nomades)

### Scènes évitées

- Combat frontal (le Marcheur-du-Sel n'est pas un guerrier)
- Infiltration fine, assassinat
- Magie savante (la Cendre et les artefacts sont réservés aux Tisse-Verbe et Veilleurs)

### Forces (compétences de départ)

- **Survie (SANG)** — trouver eau/nourriture/abri dans le désert
- **Marchandage (VOLONTÉ)** — négocier prix, dettes, faveurs
- **Navigation (SOUFFLE)** — lire le sable, le vent, s'orienter
- **Hospitalité (VOLONTÉ)** — créer un lien de confiance rapide

### Tabous

- Ne refuse jamais l'hospitalité à quelqu'un qui la demande (sauf ennemi mortel)
- Ne trahit pas un hôte qui t'a accueilli

### Contacts de départ

- **Maître Salhene** (Guilde du Sel) — matriarche, contact précieux
- **Amani Tousse-à-l'Aube** — un autre Marcheur, informateur

### Peur initiale (propositions)

- Une caravane entière a péri par ta faute (oubli d'une route)
- Une dette d'hospitalité non tenue envers un Changepeau
- Un fils/frère perdu dans le désert que tu cherches encore

### Arc narratif type

- Monter dans la Guilde du Sel → devenir Maître
- Ou : racheter une faute passée (la caravane perdue)
- Ou : découvrir que le commerce du sel cache un trafic de Cendre

### Faction liée

**Guilde du Sel** (cordiale au départ) + Caravanes Sahélins Libres

---

## 3. 🗡️ Lame-Ombre

> _"La dette est sacrée. Le sang aussi."_

### Profil d'attributs conseillé

```
SANG     10  ( 0)
SOUFFLE  14  (+2)   ← précis, furtif
VOLONTÉ   10  ( 0)
```

### Lentille narrative

> _Tu vois le monde comme un réseau de cibles, de dettes et de secrets. Chaque visage est une information, chaque ombre est une opportunité. Tu ne te bats pas en rase campagne — tu frappes une fois, du premier coup, et tu disparais. Ta réputation te précède, et c'est à double tranchant._

### Scènes privilégiées

- Contrats, cibles, éliminations
- Infiltration, discrétion, vol, cambriolage
- Renseignement, chantage, secrets
- Rencontrer des commanditaires, marchander un contrat

### Scènes évitées

- Combat frontal, mêlée ouverte
- Diplomatie publique, grand discours
- Magie savante (la Cendre est dangereuse — la Lame-Ombre l'évite)

### Forces (compétences de départ)

- **Furtivité (SOUFFLE)** — se cacher, se déplacer en silence
- **Tir / précision (SOUFFLE)** — arc, dague de jet, arbalète
- **Poison (SOUFFLE)** — préparer, appliquer, identifier
- **Renseignement (VOLONTÉ)** — interroger, corrompre, chantonner

### Tabous

- Ne révèle jamais ton identité de Lame-Ombre à un non-initié
- Ne tue pas un client (la guilde te traquerait)
- Ne brise pas un contrat (sauf si on te trahit d'abord)

### Contacts de départ

- **Mihail** (Main d'Ombre) — ton contact, tueur élégant
- Un **commanditaire anonyme** — te paie en _fer_ pour des contrats

### Peur initiale (propositions)

- Une cible a survécu et te traque
- Tu as tué le mauvais homme (un innocent, ou un puissant)
- Ton ancien mentor t'a trahi et tu veux te venger

### Arc narratif type

- Monter dans la Main d'Ombre → devenir Légende
- Ou : racheter un contrat raté
- Ou : trahir la guilde pour protéger quelqu'un (romance possible)

### Faction liée

**Main d'Ombre** (neutre au départ) — accès par contrats

---

## 4. 🏛️ Veilleur

> _"Ce qui est enfoui mérite la lumière."_

### Profil d'attributs conseillé

```
SANG     10  ( 0)
SOUFFLE  14  (+2)   ← érudit, manipule les artefacts
VOLONTÉ   10  ( 0)
```

### Lentille narrative

> *Tu vois le monde comme une carte de ruines, de cryptes et de savoir perdu. Chaque pierre ancienne est un secret à déchiffrer. Tu manipules les artefacts *archontiques* — tu sais les identifier, les manipuler, parfois en tirer un pouvoir mineur, mais leur **éveil** complet reste l'apanage du Tisse-Verbe. L'Inquisition te traque, et le pouvoir de l'Ancien Âge est irrésistible.*

### Scènes privilégiées

- Ruines archontiques, cryptes, tombeaux
- Artefacts, glyphes, traduction de textes anciens
- Manipulation d'artefacts archontiques (identification, usage de base — pas d'éveil, réservé au Tisse-Verbe)
- Pilleurs de ruines, marchands d'antiquités, secrets
- Érudition, bibliothèques, archives

### Scènes évitées

- Grand commerce, caravanes
- Assassinat fin (le Veilleur est un érudit, pas un tueur)
- Éveil d'artefacts (réservé au Tisse-Verbe — le Veilleur les comprend, mais ne les réveille pas)

### Forces (compétences de départ)

- **Érudition (SOUFFLE)** — lire, traduire, identifier artefacts
- **Artisanat (SOUFFLE)** — réparer, manipuler objets archontiques
- **Investigation (SOUFFLE)** — fouiller, décrypter, trouver des passages
- **Perception (SOUFFLE)** — repérer pièges, glyphes, dangers

### Tabous

- Ne détruis jamais un artefact (le savoir prime)
- Ne vends pas un secret archontique à l'Inquisition

### Contacts de départ

- **Kael le Muet** (Éveilleurs) — Changepeau légendaire, maître des ruines
- Un **mécène secret** — finance tes recherches (anonyme)

### Peur initiale (propositions)

- Un artefact que tu as réveillé a tué un compagnon
- Tu as perdu un partenaire dans une ruine effondrée
- Tu cherches un artefact précis (quête personnelle)

### Arc narratif type

- Trouver l'artefact majeur que tu cherches
- Ou : découvrir un secret sur les Archontes qui change tout
- Or : être rattrapé par l'Inquisition

### Faction liée

**Éveilleurs** (secrète, bienveillante au départ) + Inquisition (hostile, te traque)

---

## 5. 🔥 Tisse-Verbe

> _"Le monde est puni. Mais les artefacts… les artefacts ne sont pas des péchés. C'est un héritage."_

### Profil d'attributs conseillé

```
SANG      8  (−1)
SOUFFLE  14  (+2)   ← éveille les artefacts archontiques
VOLONTÉ   12  (+1)   ← la volonté de manier la Cendre
```

### Lentille narrative

> _Tu vois le monde comme un champs de ruines endormies — chaque artefact est une voix étouffée, et toi seul peux la réveiller. Tu es un **Tisse-Verbe**, l'un des rares êtres capables d'**éveiller** les objets archontiques. Le pouvoir est là, tapi dans le sable doré, attendant qu'une main le saisisse. Mais chaque éveil te coûte de la **Calamine** — et la transformation guette. Le Culte te traque, les Veilleurs te convoitent, et chaque artefact que tu pousses trop loin te rapproche de la transformation._

### Scènes privilégiées

- Découverte d'artéfacts archontiques (ruines, donjons, cryptes)
- Éveil et manipulation d'artéfacts (chaque objet = pouvoir unique)
- Négocier avec la tentation (pousser l'artéfact un cran plus loin)
- Cacher sa nature aux Inquisiteurs
- Conversations avec d'autres éveilleurs (Rénovateurs)

### Scènes évitées

- Combat au corps-à-corps (le Tisse-Verbe est fragile)
- Affrontement direct avec l'Inquisition (sans préparation)
- Grande diplomatie publique (ta nature se trahit)

### Forces (compétences de départ)

- **Éveil (SOUFFLE)** — réveiller et pousser un artéfact archontique
- **Érudition (SOUFFLE)** — lire les langues anciennes, identifier les artefacts
- **Discrétion (SOUFFLE)** — cacher sa nature d'éveilleur
- **Résistance à la Cendre (VOLONTÉ)** — retarder la montée de Calamine (un peu)

### Tabous

- Ne révèle jamais ton pouvoir à un Inquisiteur (mort assurée)
- Ne pousse pas un artefact au-delà de tes limites sans préparation (la Calamine attend)

### Contacts de départ

- **Elara Tchen** (Rénovateurs) — savante renégate, géniale, alliée naturelle
- Un **maître caché** — t'enseigne de nouvelles techniques d'éveil (rarement)

### Peur initiale (propositions)

- Ta Calamine progresse (stade 1) — tu sais que ton temps est compté
- Un Inquisiteur a vu tes mains grises
- Tu as perdu le contrôle d'un artefact et blessé un innocent

### Arc narratif type

- Trouver le **Clavier de Verre** (artéfact majeur des Archontes)
- Ou : trouver un remède à la Calamine (quête désespérée)
- Ou : être capturé par l'Inquisition et faire un choix impossible
- Ou : succomber à la Calamine et devenir _Calciné_ (mort/transformation)

### Faction liée

**Rénovateurs** (secrète, alliée) + Inquisition (hostile, te traque activement)

---

## 6. Tableau récapitulatif

| Vocation           | SANG   | SOUFFLE | VOLONTÉ | Angle                                | Faction       | Danger principal                  |
| ------------------ | ------ | ------- | ------- | ------------------------------------ | ------------- | --------------------------------- |
| 🐫 Marcheur-du-Sel | **+2** | 0       | 0       | Commerce / survie / désert           | Guilde du Sel | Bandits, désert                   |
| 🗡️ Lame-Ombre      | 0      | **+2**  | 0       | Contrats / secrets / ombres          | Main d'Ombre  | Réputation, cibles survivantes    |
| 🏛️ Veilleur        | 0      | **+2**  | 0       | Ruines / artefacts / savoir          | Éveilleurs    | Inquisition, Veilleurs mécaniques |
| 🔥 Tisse-Verbe     | −1     | **+2**  | +1      | Éveil d'artéfacts / pouvoir / Cendre | Rénovateurs   | Calamine, Inquisition             |

---

## 7. Les vocations en V2 (prévues)

### 🎭 Changepeau

Espion, infiltration, faux-semblants, secrets. Capable (dit-on) de modifier légèrement son apparence. Peuple persécuté, survie dans la marge.

- Attributs : SOUFFLE +2 / VOLONTÉ −1 (le Changepeau est méprisé)
- Angle : espionnage, déguisement, manipulation
- Faction : Changepeaux / Changeurs

### ⚔️ Chasseur-de-Revenants

Le "sorceleur" de Velkhar. Traque les créatures surnaturelles (Revenants, Calcinés, Tisseurs de Sable). Alchimie de survie, poisons, connaissance des monstres.

- Attributs : SANG +2 / SOUFFLE +1
- Angle : traque, alchimie, survie contre le surnaturel
- Faction : Culte (tolérance méfiante) / indépendant

### 💰 Contrebandier

Marchand noir, réseau, dette et faveurs. Fait passer de la Cendre, des artefacts, des esclaves. Riche, corrompu, pragmatique.

- Attributs : VOLONTÉ +2 / SOUFFLE +1
- Angle : marché noir, réseau, contrebande, manipulation économique
- Faction : Guilde du Rivage / Changeurs

---

## 8. Vocation et monde méta

### L'écho de réputation entre les runs

Si un joueur fait plusieurs runs avec la **même vocation** :

- 🟢 Sa réputation au sein de la faction liée **persiste vaguement** (écho léger)
- 🟢 Les PNJ de cette faction le reconnaissent ("Un Marcheur-du-Sel ? On parle encore d'un certain… Amani, il y a des années")
- 🟢 Mais ça ne donne pas d'avantage mécanique massif — juste de la saveur narrative

### La même vocation jouée plusieurs fois = histoire différente

- 🟢 Le **méta-monde a changé** entre les runs (roi mort, Conjonction, faction affaiblie)
- 🟢 Les **choix divergents** créent des scènes différentes
- 🟢 L'IA **génère du neuf** (rencontres, rumeurs, événements) dans les limites du Canon
- 🟢 Même classe + même lieu = **histoire différente**

---

## 9. Le concept libre (écrit par le joueur)

Si le joueur ne choisit pas de vocation mais écrit son propre concept, le système :

1. **Analyse le texte** du concept
2. **Déduit** une répartition d'attributs (SANG/SOUFFLE/VOLONTÉ)
3. **Génère** une fiche de contraintes personnalisée (lentille, forces, tabous, peur)
4. Propose au joueur pour **validation** avant le début du run

### Exemple

> _Concept : "Un ancien prêtre du Culte qui a perdu la foi après avoir brûlé un hérétique innocent. Il cherche à se venger du Grand Archiviste qui lui a ordonné cela. Il garde sa connaissance des rituels, mais n'y croit plus."_

**Système déduit :**

```yaml
concept: "prêtre déchu en quête de vengeance"
SANG: 10
SOUFFLE: 12   ← connaissance des rituels
VOLONTÉ: 12    ← ancien prêtre, charisme, foi brisée
forces: [rituel, érudition, tromperie (feindre la foi)]
peur: "le hérétique innocent qu'il a brûlé le hante"
arc_type: "vengeance contre le Grand Archiviste"
faction_liée: "Inquisition (ancien membre, maintenant traqué)"
```

🟢 _Le joueur valide → le run commence avec cette fiche. L'IA adapte toute la narration._

---

## 10. Risques & garde-fous

| Risque                                               | Mitigation                                                                                                 |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Vocations trop similaires en pratique                | Fiches de contraintes strictes, scènes privilégiées testées séparément                                     |
| Le Tisse-Verbe est soit trop faible, soit trop fort  | Calamine comme compteur automatique (plus tu lances, plus tu meurs)                                        |
| Le Veilleur et la Lame-Ombre partagent SOUFFLE       | Différencier par les **compétences** (ruines vs contrats) et les **factions** (Éveilleurs vs Main d'Ombre) |
| Concept libre génère un perso déséquilibré           | Validation système + ajustement léger avant le run                                                         |
| Une vocation "meilleure" que les autres              | Balancing par playtests, chaque angle a ses failles                                                        |
| Trop d'identité = difficile de sortir de la vocation | Le joueur peut toujours agir contre sa vocation (avec conséquences)                                        |

---

## La promesse au joueur

> _« Quatre vocations. Chacune rejouable à l'infini — le monde change, tes choix changent, l'IA improvise. Le même Velkhar, mille histoires. »_

---

_Le système de **survie** qui s'applique à toutes les vocations est détaillé dans `06-SURVIVAL.md`. La **création de personnage** (prologue + choix de vocation) dans `07-CHARACTER-CREATION.md`._
