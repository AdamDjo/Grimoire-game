# 11 — Inventaire & Économie

> _L'or se perd. La mémoire reste._

---

> **⚙️ Périmètre d'implémentation — Survie v2 (2026-07)**
> Ce fichier décrit l'économie **cible complète**. Le chantier Survie v2 n'en implémente qu'un **sous-ensemble** :
>
> - ✅ **Acquisition** d'objets (l'IA signale un objet trouvé via `itemGained`, cf. `15-GAME-MASTER §4.5` → le backend le persiste dans les 4 catégories §1).
> - ✅ **Usage / consommation** (appliquer un `ItemEffect` : soin, réduction de Calamine, retrait de condition).
> - ✅ **Équipement** dans les 8 slots §1.
> - ⏳ **Différé** (hors périmètre v2) : or 🪙 in-game (§2), marché/négociation (§7), banque de L'Aveugle (§6), artisanat (§8), tiers de rareté économiques (§4), dégradation d'héritage (§5).
>
> Autrement dit : v2 branche la **possession et l'usage** des objets, **pas** l'économie monétaire.

---

## 0. Principe

GRIMOIRE a une économie à **deux niveaux** — l'un meurt avec le perso, l'autre persiste à travers les runs. C'est ce qui rend le roguelike "strict" (tu peux tout perdre) **supportable** : le joueur sait qu'il rebâtira, et ce qui compte vraiment (Souvenirs, artefact, écho) traverse la mort.

| Niveau      | Monnaie      | Persistance         | Usage                                              |
| ----------- | ------------ | ------------------- | -------------------------------------------------- |
| **In-game** | 🪙 Or        | Perdu à la mort     | Achat équipement, repos, services                  |
| **Méta**    | 📖 Souvenirs | Persistent à jamais | Lore + identification d'artefacts (chez L'Aveugle) |

> _La mort fait mal — mais elle ne ramène jamais à zéro. C'est ce qui te fait revenir._

---

## 1. L'inventaire du joueur

Limité par **encombrement** (slots), pas par poids en kg. Lisible, simple.

### Les 4 catégories

```
┌─────────────────────────────────────────────────┐
│  ⚔️  ÉQUIPEMENT PORTÉ      (8 slots fixes)       │
│  ────────────────────────────────────────────    │
│  [main]      [secondaire]     [armure]    [cape] │
│  [tête]      [accessoire]     [ceinture]  [pied] │
│                                                  │
│  🎒  SAC                    (12-15 slots libres) │
│  ────────────────────────────────────────────    │
│  consommables · matériaux · objets d'aventure    │
│                                                  │
│  🔮  ARTEFACT               (1 slot dédié)       │
│  ────────────────────────────────────────────    │
│  ne compte pas dans l'encombrement               │
│  ne se vend pas, ne se jette pas                 │
│                                                  │
│  📜  TROUSSEAU              (illimité)           │
│  ────────────────────────────────────────────    │
│  clés, lettres, papiers — narratif seulement     │
└─────────────────────────────────────────────────┘
```

### Règles

- 🟢 **Sac plein** → l'IA propose : laisser un objet, ou refuser le loot
- 🟢 **Pas d'extension de sac** (pas de "sac de Holding") — garde la friction
- 🟢 **L'artefact** a son propre slot pour ne jamais être en compétition avec un objet trivial
- 🟢 **Le trousseau** existe pour stocker des choses qui n'ont qu'une valeur narrative (lettres, clés, médaillon souvenir d'un PNJ)

🟢 _Limitation intentionnelle : un perso n'est pas un coffre. Choisir ce qu'on prend = choix tactique._

---

## 2. L'or in-game (🪙)

La monnaie courante de Velkhar. Simple, sale, **mortelle**.

### Sources

| Source                         | Gain typique                            |
| ------------------------------ | --------------------------------------- |
| Pillage d'ennemi humain        | 1-10 🪙 (brigand) à 50 🪙 (Inquisiteur) |
| Vente d'équipement             | ~30% du prix d'achat                    |
| Vente de matériaux             | 1-20 🪙 selon rareté                    |
| Contrat (Lame-Ombre, Marcheur) | 30-150 🪙                               |
| Quête principale               | 50-300 🪙                               |
| Loot de coffre                 | 10-100 🪙                               |

### Dépenses

| Service                                         | Coût      |
| ----------------------------------------------- | --------- |
| 🏠 Repos en auberge (1 nuit)                    | 5 🪙      |
| 🍖 Repas chaud                                  | 1 🪙      |
| 💧 Outre d'eau pleine                           | 2 🪙      |
| 🩹 Soins (1d6+2 PV, retire 1 condition mineure) | 10 🪙     |
| 🗡️ Arme commune                                 | 15-40 🪙  |
| 🛡️ Armure commune                               | 25-80 🪙  |
| 🤐 Soudoyer un garde                            | 20-100 🪙 |
| 🐎 Voyage caravane (entre régions)              | 30-50 🪙  |
| 📜 Information de bas étage (rumeur)            | 5-15 🪙   |

### Règle de la mort

```
🩸 MORT DU PERSONNAGE
   ↓
🪙 Or porté = PERDU À 100%
   ↓
Sauf si déposé chez L'Aveugle (voir §6)
```

🟢 _L'or est **précaire**. Le joueur doit décider : tout dépenser maintenant ? mettre en banque ? prendre le risque ?_

---

## 3. Les Souvenirs (📖 monnaie méta)

C'est la **monnaie de l'âme**. Persistent à jamais.

### Sources

| Source                                     | Gain                                  |
| ------------------------------------------ | ------------------------------------- |
| 🎁 Prologue (L'Aveugle)                    | 1 Souvenir gratuit                    |
| 🏆 Acte mémorable en run                   | 1-3 Souvenirs nommés (cf. crochet #2) |
| 📖 Fin de run (Chronique)                  | 1 Souvenir bonus selon performance    |
| 💀 Mort héroïque (boss vaincu juste avant) | 1 Souvenir nommé                      |

### Souvenirs anonymes vs nommés

| Type        | Description                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Anonyme** | Fragment de lore générique (_"La brume dorée tue"_) — utilisable comme monnaie                                               |
| **Nommé**   | Acte spécifique du joueur (_"La nuit où tu as épargné l'Inquisiteur Vane"_) — narratif, non dépensable, évoqué par L'Aveugle |

🟢 _Distinction clé : les nommés **ne se dépensent pas** — ce sont des médailles d'histoire. Les anonymes oui._

### Comment obtenir un Souvenir nommé

L'IA marque un acte comme "nommé" si **au moins 2 critères** sont remplis :

- Décision morale dure (épargner, trahir, sacrifier)
- Nat 20 dans un contexte épique
- Boss vaincu / défi extraordinaire
- PNJ marquant ayant impacté le run
- Premier acte d'un type (premier Calciné tué, première trahison)

### Dépense des Souvenirs

Uniquement chez L'Aveugle (voir `07-CHARACTER-CREATION §5`) :

| Achat                            | Coût        | Effet                                                        |
| -------------------------------- | ----------- | ------------------------------------------------------------ |
| 📖 Fragment de lore              | 1 Souvenir  | L'IA génère un fragment cohérent avec l'historique du joueur |
| 🔮 Identification d'artefact     | 1 Souvenir  | L'IA génère nom, histoire, faiblesse, effet d'éveil          |
| 🎯 Indice sur une quête en cours | 2 Souvenirs | L'Aveugle donne une piste concrète                           |
| 🌍 Carte d'une région            | 3 Souvenirs | Débloque une mini-carte mentale + lieux d'intérêt            |
| ⚖️ Conseil moral                 | 1 Souvenir  | L'Aveugle juge un dilemme (rare, casse sa neutralité)        |

🟢 _Les Souvenirs sont **le moteur méta** : ils donnent envie de jouer pour comprendre le monde, identifier les artefacts trouvés, et débloquer le lore._

---

## 4. L'équipement (3 tiers simples)

Pas de système de rareté à 7 niveaux. **Trois tiers, c'est tout.**

### Tier 1 — Commun

- **Source** : marché, forgeron, pillage de brigands
- **Style** : cuir, bronze, fer
- **Dégâts** : 1d4-1d6 (armes), CA +1 (armures)
- **Prix** : 15-40 🪙

### Tier 2 — Rare

- **Source** : atelier maître, marché noir, quêtes
- **Style** : acier ouvragé, équipement de guilde, sabre forgé
- **Dégâts** : 1d8-1d10 (armes), CA +2 (armures)
- **Prix** : 80-250 🪙

### Tier 3 — Archontique / Légendaire (artefacts)

- **Source** : loot de donjon, Veilleur archontique vaincu, héritage
- **Style** : matériaux étranges (sable doré figé, métal sans rouille, soie qui bouge)
- **Dégâts** : 1d12 ou 2d6 + effet, CA +2-3 (sans malus)
- **Prix** : **invendable** (les marchands refusent par peur ou par lois)

### Tableau d'armes (référence rapide)

| Arme             | Tier | Dé          | Style                        |
| ---------------- | ---- | ----------- | ---------------------------- |
| Poing            | —    | 1d4         | Par défaut                   |
| Dague            | 1    | 1d4         | Discret, +avantage furtivité |
| Épée courte      | 1    | 1d6         | Polyvalente                  |
| Sabre            | 2    | 1d8         | Tranchant, élégant           |
| Hache de guerre  | 2    | 1d10        | Lourd, à 2 mains             |
| Arc court        | 1    | 1d6         | Ranged, SOUFFLE              |
| Arc long         | 2    | 1d8         | Ranged longue portée         |
| Arbalète lourde  | 2    | 1d10        | 1 tour de recharge           |
| Arme archontique | 3    | 1d12 ou 2d6 | Effet spécial unique         |

### Tableau d'armures

| Armure           | Tier | CA  | Malus                       |
| ---------------- | ---- | --- | --------------------------- |
| Aucune           | —    | +0  | —                           |
| Cuir             | 1    | +1  | —                           |
| Cuir bouilli     | 1    | +1  | + résist. dégâts mineurs    |
| Maille           | 2    | +2  | -1 Furtivité                |
| Plate            | 2    | +3  | -1 Furtivité, -1 Athlétisme |
| Soie archontique | 3    | +2  | — (rare, légère)            |

---

## 5. Les artefacts (🔮 le cœur de la magie)

Les artefacts sont **la seule source de pouvoir magique** dans Velkhar (cf. décision L3 de `00-SOMMAIRE`). Chaque artefact est **unique** : nom propre, histoire, faiblesse, effet d'éveil.

### Deux modes d'usage

#### 🔥 Pouvoir de base (toute vocation)

```
- Usable 1× par scène
- Coûte 5 Cendre (cf. 06-SURVIVAL §4)
- 1d8 dégâts OU effet narratif mineur défini par l'artefact
- Le joueur ne connaît que l'effet de base (sauf si identifié)
```

🟢 _Tout aventurier peut **déclencher** un artefact. Pas que les Tisse-Verbe._

#### 🔮 Éveil (Tisse-Verbe seul)

```
- Usable 1× par scène
- Coûte 10 Cendre
- Effet majeur garanti (effet d'éveil défini par l'artefact)
- Option d'amplification : d20 + SOUFFLE + CENDRE + Éveil  vs  DC artefact
  → Succès : effet amplifié (dégâts doublés, zone élargie, condition spéciale)
  → Échec : juste effet de base (Cendre payée UNE SEULE FOIS)
```

🟢 _L'éveil ne rate **jamais** totalement. Le Tisse-Verbe paye et reçoit toujours au minimum l'effet de base._

### Identification d'artefact

Un artefact trouvé est **non identifié** : le joueur ne connaît que le pouvoir de base (1d8 + brève description IA).

Pour débloquer l'effet d'éveil + nom + histoire + faiblesse → **identification chez L'Aveugle (1 Souvenir)**.

🟢 _Tension : ramener un artefact non identifié, l'utiliser au pouvoir de base, et décider de l'identifier ou pas._

### Catalogue d'artefacts

L'IA **génère les artefacts dynamiquement** à partir d'un catalogue de base (5-10 artefacts canon dans `02-WORLD-BIBLE`) + invention contextuelle. Chaque artefact contient :

```yaml
nom: "La Voix des Sables"
type: "lame courte"
pouvoir_de_base: "1d8 + l'arme chuchote des avertissements au porteur"
effet_eveil: "L'arme appelle une tempête de sable qui aveugle tous les ennemis 2 tours"
amplification: "Aveugle + 1d6 dégâts à tous"
faiblesse: "Refuse de blesser un Sahélin"
histoire: "Forgée par un Archonte pour protéger sa fille du désert"
degradation_a_l_heritage: 3
```

### L'artefact d'héritage

À la mort du perso, l'artefact équipé est **transmis** au successeur.

| Transmission | Effet                                                    |
| ------------ | -------------------------------------------------------- |
| 1ʳᵉ          | Effet d'éveil intact                                     |
| 2ᵉ           | Effet d'éveil intact, faiblesse révélée                  |
| 3ᵉ           | Effet d'éveil **perdu**, garde le pouvoir de base 1d8    |
| 4ᵉ et +      | Devient un simple objet narratif (perte du dé de dégâts) |

🟢 _La dégradation rend l'héritage **réel** : on ne traîne pas un artefact OP éternellement. À chaque mort, le joueur doit en trouver un nouveau pour rester puissant._

---

## 6. La banque de L'Aveugle (optionnel)

Le joueur peut **déposer** de l'or à l'auberge **avant** de partir en run.

```
🏠 L'Aveugle accepte des dépôts.
   - Frais : 5% du montant (ou 1 Souvenir si dépôt > 100 🪙)
   - Récupérable au retour vivant
   - PERDU si mort (L'Aveugle "oublie" qui était le porteur)
```

🟢 _Mécanique optionnelle qui adoucit le roguelike strict. Le joueur peut protéger une partie de sa mise au coût d'un risque (la banque ne survit pas à la mort) + petits frais._

### Pourquoi pas garantir 100% à la mort ?

Parce que le pilier #3 (mort = tout perdu sauf héritage) est intouchable. La banque permet juste de ne pas **gaspiller** l'or au lieu de l'emmener, sans casser la tension.

---

## 7. Le marché in-game

Pas de prix fixes. La **négociation** est mécanique :

```
Jet : d20 + CENDRE + Persuasion  vs  DC 12 (marchand normal) à 18 (Guilde stricte)
```

→ **Échec** : prix de base (référence des tableaux §4)
→ **Succès** : -10% (acheter) ou +10% (vendre)
→ **Succès remarquable** : -20% ou +20%
→ **Nat 20** : -50% OU objet bonus (le marchand "oublie" un détail)
→ **Échec critique** : prix +10% (le marchand se sent insulté)

🟢 _Le triptyque a un impact économique : un CENDRE +3 paye moins cher, gagne plus à la vente._

### Variations selon réputation

- 🟢 **Allié d'une faction** → -10% chez ses marchands
- 🔴 **Ennemi d'une faction** → +20% chez ses marchands, ou refus de vente
- 🟡 **Inconnu** → prix normal

---

## 8. L'artisanat (V1 minimal)

Pas de système complexe de recettes. **3 stations dans le monde** :

| Station           | Service                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| 🔨 **Forgeron**   | Réparer arme/armure (5-30 🪙) · forger amélioration (matériau + 50 🪙 → +1 dé) · personnaliser (cosmétique gratuit) |
| 🌿 **Herboriste** | Distiller potion (matériau + 10 🪙 → soin / antidote / boost)                                                       |
| 📜 **Scribe**     | Recopier une lettre · falsifier un document (CENDRE + 30 🪙) · acheter une carte régionale (50 🪙)                  |

🟢 _L'IA narre l'artisanat. Pas de mini-jeu, pas d'attente. Le joueur dépose matériau + or, reçoit objet._

---

## 9. Les donjons & le loot

Les **donjons** sont là où dorment les artefacts (cf. décision L5).

### Structure d'un donjon

```
1. ENTRÉE (un seuil — porte scellée, fissure dans une falaise, descente sous un temple)
   ↓
2. SALLE 1 — Exploration / énigme narrative (DC SOUFFLE Investigation)
   ↓
3. SALLE 2 — Combat (Calcinés, brigands, créature sauvage)
   ↓
4. SALLE 3 — Pivot moral OU énigme + récompense mineure (loot Tier 1-2)
   ↓
5. SALLE BOSS (optionnelle) — combat ou défi narratif épique
   ↓
6. CHAMBRE FINALE — coffre / artefact / révélation lore
```

🟢 _Court (3-5 salles), dense (chaque salle compte), récompense garantie._

### Loot garanti par donjon

- 🔮 **1 artefact** OU 50-200 🪙 + matériaux
- 📖 **1 Souvenir potentiel** (si comportement marquant)
- ⚔️ **1 équipement Tier 2** (parfois Tier 3 si boss vaincu)

🟢 _Le joueur ne sort jamais d'un donjon les mains vides. C'est le **moteur de loot** du jeu._

### Variantes

- **Donjon mineur** (3 salles, 1 récompense)
- **Donjon majeur** (5-7 salles, boss, artefact garanti)
- **Donjon archontique** (rare, 7-10 salles, plusieurs artefacts, boss épique)

---

## 10. Risques & garde-fous

| Risque                                            | Mitigation                                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Inflation économique**                          | Prix dynamiques selon faction/réputation. Pas de gold-sink illimité (pas de "gemme à 10k 🪙")                            |
| **Inventaire chaotique**                          | 8+12 slots fixes, pas d'extension. Le joueur doit choisir                                                                |
| **Artefact d'héritage abusé**                     | Dégradation après 3-4 transmissions. Garantit le besoin de trouver de nouveaux artefacts                                 |
| **Souvenirs accumulés sans usage**                | L'Aveugle propose **toujours** des achats au retour. Le joueur ne doit jamais se demander "que faire de mes Souvenirs ?" |
| **Mort frustrante (perte de 200 🪙)**             | Banque de L'Aveugle. Et l'héritage minimise la perte ressentie                                                           |
| **Joueur qui spam les artefacts non-Tisse-Verbe** | Coût Cendre (5/usage) accumule la Calamine. Risque réel à long terme                                                     |
| **Donjon vide / sans loot**                       | Règle absolue : tout donjon termine sur **au moins** 1 récompense substantielle                                          |

---

## 11. Synthèse — Tableau économie

```
╔════════════════════════════════════════════════════════════════════╗
║                    ÉCONOMIE DE GRIMOIRE                            ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  IN-GAME  🪙 OR                          MÉTA   📖 SOUVENIRS       ║
║  ─────────────────────────              ──────────────────────     ║
║  Source : pillage, contrats,            Source : prologue (1)      ║
║   vente, quêtes                          + actes mémorables        ║
║                                          + bonus fin de run        ║
║                                                                    ║
║  Usage  : équipement, repos,            Usage  : lore,             ║
║           soins, services,                       identification    ║
║           pots-de-vin                            d'artefact,       ║
║                                                  indices de quête  ║
║                                                                    ║
║  Mort   : PERDU 100%                    Mort   : PERSISTENT        ║
║   (sauf dépôt L'Aveugle, 5% frais)              (jamais perdus)    ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  INVENTAIRE                              ÉQUIPEMENT 3 TIERS        ║
║  ─────────────────────────              ──────────────────────     ║
║  ⚔️  8 slots équipement                 1 - Commun (cuir, fer)    ║
║  🎒 12-15 slots sac                     2 - Rare (acier, soie)    ║
║  🔮 1 slot artefact (dédié)             3 - Archontique           ║
║  📜 trousseau illimité (narratif)            (artefacts)          ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  ARTEFACTS                               HÉRITAGE                  ║
║  ─────────────────────────              ──────────────────────     ║
║  Pouvoir de base : 1d8, 5 Cendre        1 artefact transmis        ║
║   (toute vocation, 1×/scène)            Dégrade 3-4 runs           ║
║                                                                    ║
║  Éveil (Tisse-Verbe) : 10 Cendre        + écho réputation/         ║
║   effet majeur garanti                    savoir mineur            ║
║   + amplif optionnelle (d20)                                       ║
║                                                                    ║
║  Identification : 1 Souvenir                                       ║
║   (chez L'Aveugle)                                                 ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

🟢 _Économie à 2 niveaux. Roguelike strict adouci par la persistance des Souvenirs et de l'héritage. Tout achat = un choix, jamais un grind._

---

_Les **vocations** (équipement de départ) sont détaillées dans `05-VOCATIONS.md`._
_L'**équipement de survie** (gourde, masque filtrant, etc.) est détaillé dans `06-SURVIVAL.md` §8._
_Le **combat** (armes, CA, dégâts) est détaillé dans `10-COMBAT.md`._
_Les **Souvenirs** persistent dans le **méta-monde** détaillé dans `14-META-WORLD.md`._
_L'**héritage à la mort** est lié à la **Chronique** détaillée dans `17-RUN-CHRONICLE.md`._
_La **création de perso** qui inclut le 1ᵉʳ Souvenir gratuit est détaillée dans `07-CHARACTER-CREATION.md`._
