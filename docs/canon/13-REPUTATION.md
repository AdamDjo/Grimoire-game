# 13 — Réputation & Relations sociales (scope run V1)

> **Fichier 13 / Phase E / Scope intra-run + écho méta léger via Souvenirs nommés**
> Réécriture du `_archive-v1/06-REPUTATION.md` (281 lignes) au scope V1 : un run de 3-15h, pas un MMO persistant multi-mois.
> Ce qui était "propagation rumeurs 90 jours multi-régions + faveurs persistantes inter-runs + carnet de relations UI complet + romances + Némésis full" est **explicitement repoussé V2+**.

---

## §0 — Principe

La réputation **n'est jamais un score** affiché en HUD. Elle se ressent dans la prose IA : _"Le garde du temple te regarde avec méfiance"_, _"La tenancière t'offre un tabouret au bar"_. Pas de "+5 réputation Faction Y" à l'écran. Jamais.

**Trois règles V1** :

1. La réputation a un scope **intra-run uniquement** par défaut. Reset entre runs.
2. L'écho inter-runs passe **uniquement via Souvenirs nommés** (cf. [14-META-WORLD §2](14-META-WORLD.md)). Pas de carnet de relations qui persiste.
3. Le backend tient un **état simple** (3-4 champs JSON dans `runs.metadata`). Pas de table dédiée `reputation` V1.

> **Différence majeure vs archive** : l'archive supposait un monde MMO partagé multi-mois ("propagation 90 jours", "rumeurs continentales", "dettes éternelles"). V1 = chaque run est un cycle complet. La réputation se gagne et meurt avec le perso, sauf trace dans Souvenirs nommés.

---

## §1 — Les 2 types de réputation V1 (pas 3)

L'archive V1 propose 3 types (faction, confiance individuelle, renommée publique). **V1 simplifie à 2** + une couche optionnelle.

### 🏛️ Type 1 — Faction (intra-run)

État du perso vis-à-vis des **4 factions majeures** (cf. `docs/canon/` — Culte / Guilde du Sel / Main d'Ombre / Éveilleurs) et **5 mineures** (Rénovateurs, Caravaniers Libres, Cendreurs Errants, Comptoir Thérien, Cercle des Voyants).

**Pas de score 0-100.** 3 paliers narratifs :

| Palier     | Trigger typique                                         | Effet                                                   |
| ---------- | ------------------------------------------------------- | ------------------------------------------------------- |
| 🟥 Hostile | Trahison, vol majeur, meurtre membre, sabotage          | Refus d'aide, gardes alertes, contrat sur tête possible |
| 🟨 Neutre  | État par défaut                                         | Transactionnel, prix normaux                            |
| 🟩 Allié   | Service rendu majeur, mission accomplie pour la faction | Prix réduits, accès lieux restreints, soutien narratif  |

**Stockage** : `runs.metadata.factions = { culte: "hostile", guilde_sel: "allié", main_ombre: "neutre" }`.

### 🧠 Type 2 — Confiance PNJ-Marqueur (intra-run)

Cf. [12-NPCS-RELATIONS §6](12-NPCS-RELATIONS.md). 3 paliers : Méfiant / Neutre / Allié.

**Stockage** : `runs.metadata.relations = { npc_vane: "allié", npc_elara: "méfiant" }`.

### 🌍 Type 3 (optionnel V1) — Renommée locale au lieu

Trace **invisible** d'un acte mémorable dans un lieu donné. Pas de "renommée continentale" V1.

**Stockage** : `runs.metadata.local_fame = { "Khar-Then": "sauveur de caravane", "Tissan": "voleur connu" }`.

**Effet** : injecté en contexte IA quand le joueur revient sur le lieu _"On murmure que tu as sauvé la caravane Salhene…"_

**Limite V1** : pas de propagation multi-lieux. Si tu sauves Khar-Then, Tissan ne le sait pas, sauf si tu y vas et que ça vient en conversation.

---

## §2 — Propagation (simplifiée V1)

L'archive V1 décrit une **propagation 4 niveaux** (local → régional → continental → légende) avec timings 24h / 7j / 30j / 90j. **V1 simplifie au maximum** :

- **Témoins directs d'un acte** → savent immédiatement (intra-run uniquement)
- **PNJ proches d'un témoin** dans le même lieu → peuvent savoir (1-2 scènes après)
- **Autres lieux** → ne savent pas, sauf cas spécial (le joueur en parle, événement mondial)

Pas de timing 24h/7j/30j V1. Le run dure 3-15h IRL, ça n'a pas de sens d'avoir des timings calendaires.

**Implementation** : à chaque acte public, le backend ajoute un fait dans `runs.metadata.public_acts = [{ acte, lieu, scène, témoins }]`. L'IA reçoit ce contexte quand pertinent.

---

## §3 — Faveurs & dettes (intra-run seulement V1)

Mécanique narrative qui structure les échanges sociaux. **V1 = scope run uniquement**.

### Poids des faveurs (3 niveaux V1, pas 4)

| Poids    | Exemple                                                         | Effet                                                     |
| -------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| 🪶 Léger | Une info, une cachette pour la nuit, un nom                     | Réciprocable facilement, peu durable                      |
| ⚖️ Moyen | Une lettre d'introduction, un objet utile, une protection brève | Crée une obligation explicite                             |
| ⛓️ Lourd | Vie sauvée, secret protégé, action illégale partagée            | Forte obligation, peut déclencher Souvenir nommé candidat |

(Pas de "vital" comme dans archive — fusionné avec lourd.)

### Cycle de la faveur

1. **Don** : un PNJ offre, ou le joueur reçoit (peut être tag `faveur_due` dans state)
2. **Pression** : le PNJ peut demander réciprocation dans la même scène ou plus tard dans le run
3. **Solde** : action en retour OU refus (refus = malus relation, possiblement passage à Méfiant)

### Stockage

`runs.metadata.favors = [{ from: "npc_salhene", weight: "moyen", description: "lettre d'introduction", status: "due" }]`.

### Inter-runs

**Aucune persistance V1**. Une dette à Salhene meurt avec le perso, sauf si la transaction devient un Souvenir nommé (ex : _"La nuit où Salhene t'a sauvé la vie en échange d'un serment"_).

---

## §4 — Sanctions automatiques (table backend)

Le backend (= MJ, cf. CLAUDE.md règle absolue) tient une **table fixe** d'actes → conséquences. L'IA ne décide pas — elle habille.

| Acte                                                | Conséquence backend (intra-run)                                                    | Souvenir candidat ?        |
| --------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------- |
| Tuer un PNJ-Marqueur (sans justification narrative) | Faction du PNJ → Hostile. Si PNJ allié → contrat sur tête possible                 | Oui (haute valeur)         |
| Voler un temple ou un sanctuaire faction            | Faction → Hostile. Présence gardes renforcée dans cette région du run              | Oui                        |
| Trahir un allié déclaré (palier 🟩)                 | Confiance → Méfiant. Faction du PNJ → -1 palier                                    | Oui (très haute valeur)    |
| Sauver une caravane / un PNJ-Marqueur               | Local_fame positif. Confiance PNJ-Marqueur → +1 palier                             | Oui si effort héroïque     |
| Aider une faction sur une quête                     | Faction → Allié si déjà neutre, Allié+ effet narratif si déjà allié                | Possible si acte fondateur |
| Refuser une faveur lourde demandée                  | Confiance PNJ → -1 palier. Pas d'effet faction                                     | Non                        |
| Mentir et se faire prendre                          | Confiance PNJ → -1 palier. Bouche-à-oreille local possible (autres PNJ même scène) | Non                        |
| Tisse-Verbe public dans zone Culte                  | Culte → Hostile immédiat, témoins traquent                                         | Oui (acte fondateur)       |

**Pas plus** que ~8-10 entrées en V1. Si l'IA produit un acte non listé, le backend ne fait rien d'automatique — le MJ improvise dans la prose, mais l'état formel ne change pas.

---

## §5 — Récompenses émergentes (intra-run + 1 cas méta)

Pas d'achievements visibles. Les récompenses se manifestent par **opportunités narratives** :

### Intra-run

- Un PNJ allié offre spontanément un service hors-quête
- Un lieu où la réputation est positive ouvre une zone normalement fermée
- Un événement scripté se déclenche (assaut, embuscade, rencontre clé) si certains seuils atteints

### Cas méta (rare, via L'Aveugle)

À un nouveau run, **L'Aveugle peut mentionner** : _"Tu portes le visage d'un voyageur dont on disait du bien à Khar-Then…"_ — basé sur **Souvenirs nommés** du perso précédent uniquement.

**Pas de "ton ancien perso a une réputation continentale qui te précède"** V1. Trop cher à animer en cohérence.

---

## §6 — Rumeurs (injection légère par MJ IA)

Pendant le run, l'IA peut **injecter des rumeurs** dans les dialogues PNJ. Source des rumeurs :

1. **Actes du joueur intra-run** (faits dans `public_acts`) — _"On parle de toi en ville…"_
2. **Événements mondiaux actifs** (cf. [14-META-WORLD §4](14-META-WORLD.md)) — _"Tu as vu la comète de Calamine cette nuit ?"_ (1-2 mentions max par run)
3. **Lore de fond Velkhar** (statique) — _"On dit que les Cendreurs ont enterré quelque chose dans le Pli Salé…"_

**Pas de rumeurs générées par IA hors contexte** V1. Le MJ pioche dans une liste de templates pour éviter inventions hors-canon.

---

## §7 — Réputation négative = feature, pas bug

V1 **conserve** ce principe de l'archive. Un perso "mauvais" doit avoir du contenu spécifique :

- **Assassins** envoyés par factions hostiles (rencontres ennemies dans le run)
- **Refus d'aide** des marchands et soigneurs (forçant inventivité)
- **Némésis** : un PNJ-Marqueur peut devenir l'antagoniste personnel du run (poursuite, embuscade finale)
- **Sanctuaires fermés** mais **alternatives criminelles ouvertes** (Main d'Ombre accueille si Culte rejette)

**V1 simplifie la Némésis** : pas de système complexe inter-runs. Si l'archive parle de "Némésis qui poursuit sur plusieurs runs", V1 = la Némésis vit et meurt avec le run. Sauf si elle devient Souvenir nommé, alors elle peut être mentionnée par L'Aveugle au prochain run.

---

## §8 — Inter-runs : écho léger via Souvenirs nommés

**Règle dure V1** : aucune réputation persiste mécaniquement entre runs. L'écho passe uniquement par :

### Souvenirs nommés (cf. [14-META-WORLD §2](14-META-WORLD.md))

Quand un acte de réputation devient un Souvenir nommé (déclencheurs §4 ci-dessus), il s'inscrit dans la mémoire long terme du joueur. Au run N+1 :

- **L'Aveugle** y fait référence : _"On murmurait qu'un voyageur avait tenu tête à l'Inquisiteur Vane à Khar-Then. Tu y crois, toi ?"_
- **PNJ-Marqueurs impliqués** peuvent reconnaître (cf. [12-NPCS-RELATIONS §7](12-NPCS-RELATIONS.md))
- **Aucun effet mécanique** (pas de "+1 palier faction Culte au début du run N+1"). C'est purement narratif

### Pas de carnet de relations UI V1

L'archive propose un "carnet de relations" diégétique consultable. **V1 repousse en V2** — risque d'investissement UI massif pour valeur perçue moyenne sur un produit qui doit d'abord prouver son cycle de run.

---

## §9 — Hors V1 (explicite)

Repoussé V2+ :

- **Romances** (relations amoureuses persistantes intra et inter-runs) → V2
- **Propagation 4 niveaux 24h/7j/30j/90j multi-régions** → V2 (suppose population stable de joueurs et monde MMO)
- **Carnet de relations UI diégétique** complet → V2
- **Némésis qui poursuit sur plusieurs runs** → V2 ou V3 (gros chantier mémoire + IA)
- **Score réputation continentale** d'un perso (titre "Voyageur Béni des Cendres", etc.) → V2
- **Faveurs/dettes persistantes inter-runs** → V2 (incompatible avec "perso meurt = run terminé" V1)
- **Renommée régionale et continentale** → V2

---

## §10 — Risques & garde-fous

| Risque                                                | Mitigation V1                                                                                                        |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Joueur grind d'actes neutres pour "monter en faction" | 3 paliers seulement, transitions sur actes signifiants validés backend                                               |
| IA invente une réputation faction non-canonique       | Sanctions table §4 = backend, IA ne change pas l'état formel                                                         |
| Inflation Souvenirs liés à la réputation              | Cap 3 Souvenirs nommés/run (cf. [16-MEMORY §6](16-MEMORY.md)) — réputation concurrence d'autres déclencheurs         |
| Joueur frustré de "perdre sa réputation" entre runs   | Communication claire UI : "Chaque run est une nouvelle vie. Tes Souvenirs nommés sont ce qui reste."                 |
| Cap d'opportunités positives pour perso allié partout | Trade-offs explicites : être allié d'une faction = potentiellement hostile à une autre (Culte vs Tisse-Verbe libres) |
| Némésis trop intense → frustrant                      | Némésis = 1 max par run, neutralisable par mort, fuite ou réconciliation négociée                                    |

---

## §11 — Synthèse

```
┌──────────────────────────────────────────────────────────┐
│        Réputation V1 (scope intra-run)                   │
├──────────────────────────────────────────────────────────┤
│ 🏛️ Faction : 3 paliers (Hostile/Neutre/Allié) × 4-9     │
│ 🧠 Confiance PNJ : 3 paliers (cf. 12-NPCS-RELATIONS §6)  │
│ 🌍 Renommée locale au lieu (optionnelle, narrative)      │
│ JAMAIS de score 0-100 affiché en HUD                     │
└──────────────────────────────────────────────────────────┘

         ┌──────────────────────────────────────┐
         │  Faveurs & dettes V1                 │
         ├──────────────────────────────────────┤
         │  Poids : 🪶 Léger / ⚖️ Moyen / ⛓️ Lourd │
         │  Cycle : don → pression → solde      │
         │  Intra-run uniquement, reset à mort  │
         └──────────────────────────────────────┘

         ┌──────────────────────────────────────┐
         │  Sanctions : table backend ~8-10     │
         │  L'IA habille, le backend décide     │
         └──────────────────────────────────────┘

         ┌──────────────────────────────────────┐
         │  Inter-runs : SEULEMENT via          │
         │  Souvenirs nommés (cf. 14-META §2)   │
         │  L'Aveugle = vecteur principal       │
         │  Aucune réputation faction persistante│
         └──────────────────────────────────────┘
```

---

## Références croisées

- → [12-NPCS-RELATIONS §6-§7](12-NPCS-RELATIONS.md) — Confiance intra-run + reconnaissance via Souvenirs
- → [14-META-WORLD §2](14-META-WORLD.md) — Souvenirs nommés (unique vecteur inter-runs)
- → [14-META-WORLD §5](14-META-WORLD.md) — L'Aveugle mémoire vivante
- → [15-GAME-MASTER §4](15-GAME-MASTER.md) — Backend valide, IA n'invente pas l'état formel
- → [16-MEMORY §6](16-MEMORY.md) — Mécaniques Souvenirs nommés (cap 3/run)
- → [17-RUN-CHRONICLE §3](17-RUN-CHRONICLE.md) — La Chronique mentionne actes de réputation marquants
- → [03-FACTIONS](03-FACTIONS.md) — 4 factions majeures + 5 mineures
- → [22-GLOSSARY](22-GLOSSARY.md) — Némésis, Souvenirs nommés, Faveurs

---

_Fichier 13 — Phase E — `Réputation & Relations V1` consolidé au scope run. Réduction massive vs `_archive-v1/06-REPUTATION.md` (281 lignes → focus essentiel intra-run + écho méta minimal)._
_Prochaine étape : mise à jour `_STATUS.md` + greps cohérence Phase E._
