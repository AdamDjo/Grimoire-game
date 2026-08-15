# 12 — PNJ & Relations (scope run V1)

> **Fichier 12 / Phase E / Scope intra-run + écho méta léger via Souvenirs nommés**
> Réécriture du `_archive-v1/04-NPCS.md` (329 lignes) au scope V1 : un run de 3-15h, pas un MMO persistant multi-mois.
> Ce qui était "50 PNJ-Marqueurs avec biographies complètes + graphe de croyances + indisponibilité temps réel + compagnons Premium" est **explicitement repoussé V2+**.

---

## §0 — Principe

Les PNJ servent **la scène de ce run**. Pas un "monde RP persistant multi-mois". La mémoire des PNJ tient dans la mémoire intra-run du système IA (cf. [16-MEMORY](16-MEMORY.md)) — pas dans une couche dédiée séparée.

**Trois règles V1** :

1. Les PNJ-Marqueurs sont **hand-crafted** par Adem (pas générés). Banque V1 : ~8-10 maximum.
2. La mémoire PNJ intra-run est **portée par le système mémoire général** (N1/N2 du fichier 16). Pas de DB séparée par PNJ.
3. Entre les runs, seul l'**écho via Souvenirs nommés** persiste (cf. [14-META-WORLD §2](14-META-WORLD.md)). Pas de continuité confiance individuelle V1.

> **Décision V1** : un PNJ-Marqueur peut "reconnaître" un perso entre les runs **seulement si** un Souvenir nommé impliquant ce PNJ a été créé. Sinon, il accueille comme un inconnu. C'est l'inverse du MVP archive (continuité globale par défaut) — V1 fait le pari **inverse** : la rareté de la reconnaissance la rend précieuse.

---

## §1 — Les 3 types de PNJ

### 🟢 PNJ-Marqueurs (hand-crafted, ~8-10 V1)

Personnages mémorables, **récurrents au sein d'un run** (peuvent apparaître plusieurs fois dans la même partie). Quelques-uns persistent inter-runs via Souvenirs nommés.

| Caractéristique      | V1                                                 |
| -------------------- | -------------------------------------------------- |
| Nombre total         | ~8-10 (dont L'Aveugle = fixe)                      |
| Fiche structurée     | Oui, YAML simple (cf. §2)                          |
| Voix distincte       | Oui, 3-5 phrases canoniques                        |
| Objectifs personnels | 1-2 max (pas 5+)                                   |
| Graphe de croyances  | ❌ V2+ (trop cher en tokens et en QA)              |
| Apparition inter-run | Seulement si Souvenir nommé créé impliquant ce PNJ |

**Exemples V1** : L'Aveugle (toujours), + 6-8 figures Velkhar (cf. §8).

### 🟡 PNJ-Récurrents (templates par lieu)

Personnages liés à un lieu/faction, **partagés entre runs en tant que figures génériques** mais avec mémoire **uniquement intra-run**.

| Caractéristique       | V1                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| Génération            | Templates (aubergiste, marchand, garde nommé)                                                                 |
| Voix                  | Variante culturelle (Sahélin/Rivain/Thérien/Cendreur/Changepeau — cf. [15-GAME-MASTER §1](15-GAME-MASTER.md)) |
| Mémoire               | Intra-run uniquement                                                                                          |
| Persistance inter-run | ❌ (reset entre runs — "nouveau marchand" même si nom identique)                                              |

**Exemples** : _« Olfa, la tenancière de la Taverne du Sel à Khar-Then »_ — fonction connue, mais Olfa du run N+1 ≠ Olfa du run N.

### 🔴 PNJ-Figurants (à la volée)

Passants, gardes anonymes, clients de taverne. Générés par le MJ IA pendant la scène, **détruits après usage**.

- Aucune persistance, même intra-run au-delà de la scène
- Peuvent être **promus en Récurrents** si le joueur s'y intéresse fortement (intra-run uniquement)

---

## §2 — Fiche PNJ-Marqueur V1 (minimale)

Chaque PNJ-Marqueur est défini par une fiche YAML **courte** (~150-200 tokens injectée en contexte IA quand le PNJ entre en scène). Pas le fichier de 100 lignes de l'archive V1.

### Exemple — _L'Aveugle_

```yaml
id: npc_aveugle
nom: L'Aveugle
peuple: indéterminé (rumeurs : Cendreur exilé ? Thérien renégat ?)
fonction: Aubergiste de l'Auberge du Pas — gardien du seuil (cf. 07-CHARACTER-CREATION)
voix:
  style: "chaud, ironique, proverbes désertiques"
  exemples:
    - "Ah, tu reviens. Le sable t'a recraché, à ce que je vois."
    - "Le vent ne ment pas, voyageur. Toi non plus, j'espère."
    - "Bois. Ce que tu as à dire peut attendre que ta gorge ne brûle plus."
objectif_intra_run: "écouter, vendre du lore, jauger le voyageur"
défaut_narratif: "trop bienveillant — ne refuse jamais une histoire, même quand il devrait"
secret: "voit plus que ses yeux le suggèrent (lire 22-GLOSSARY)"
romanc̟able: false  # V1 — pas de romance
peut_mourir: false # L'Aveugle est canon immortel V1
```

### Exemple — _Vane (Inquisiteur)_ — PNJ-Marqueur antagoniste type V1

```yaml
id: npc_vane
nom: Inquisiteur Vane
peuple: Rivain
fonction: Inquisiteur du Culte, traque les Tisse-Verbe non-déclarés
voix:
  style: "sec, formel, sentences"
  exemples:
    - "La loi des Cendres est claire. Tu connais ton sort."
    - "Tu peux fuir le désert. Pas le Culte."
    - "Je préfère un menteur courageux à un saint qui tremble."
objectif_intra_run: "capturer un Tisse-Verbe spécifique (généré par le scénario du run)"
défaut_narratif: "obsessionnel — manque les nuances"
secret: "son frère est Tisse-Verbe caché"
romanc̟able: false
peut_mourir: true
```

> **Note format** : YAML simple, max ~200 tokens. C'est ce qui rentre dans le budget contexte IA sans casser la limite 8000 tokens du tour.

---

## §3 — Mémoire des PNJ : portée par le système général

Pas de mémoire dédiée par PNJ V1. La mémoire d'un PNJ intra-run est dans :

- **N1 (mémoire intra-tour, ~1500t)** : les 3-5 derniers tours en clair → l'IA "se souvient" de la conversation en cours
- **N2 (mémoire intra-run, ~4000t)** : résumés de scènes passées + key_facts_pinned (cf. [16-MEMORY §2](16-MEMORY.md)) → l'IA sait que "le joueur a sauvé Vane il y a 2 scènes"
- **N3 (inter-runs, ~800t)** : Souvenirs nommés impliquant ce PNJ uniquement (cf. [14-META-WORLD §2](14-META-WORLD.md))

**Conséquence concrète** :

- Pendant le run : le PNJ se souvient parfaitement (jusqu'au cap 4000 tokens, géré par compression Mistral Small)
- Entre les runs : le PNJ a "oublié" SAUF si Souvenir nommé impliquant lui (~50 tokens injectés en N3)
- Pas de couche "Canon" séparée — les faits canon sont dans `key_facts_pinned` du run

---

## §4 — La voix des PNJ

Géré par [15-GAME-MASTER §1](15-GAME-MASTER.md) — pas de duplication ici. Rappel :

- **L'Aveugle** : voix unique chaude/ironique/proverbes
- **Narrateur** : voix sèche, sensorielle (description scènes, pas dialogues PNJ)
- **PNJ génériques** : voix neutre + **5 variantes culturelles** (Sahélin laconique / Rivain lyrique / Thérien militaire / Cendreur mystique / Changepeau elliptique)

**Pour les PNJ-Marqueurs hand-crafted V1** : la fiche YAML (§2) injecte 3 phrases canoniques en few-shot dans le prompt. C'est ce qui distingue Vane d'un Inquisiteur générique.

---

## §5 — Mort d'un PNJ

### Intra-run

- La mort est **irréversible** dans le run en cours
- Le `key_facts_pinned` du run note : _"PNJ X est mort, scène Y, cause Z"_
- Les PNJ proches réagissent (deuil bref dans la prose IA, pas mécanique complexe V1)

### Trigger Souvenir nommé

Si un PNJ-Marqueur meurt **par la main du joueur ou pour sauver le joueur**, c'est un **candidat Souvenir nommé** (cf. [16-MEMORY §6](16-MEMORY.md)). Backend décide selon règles d'attribution (max 3/run).

**Exemple** : _"La nuit où Vane est mort en t'épargnant"_ → Souvenir nommé qui persistera inter-runs.

### Mort de L'Aveugle ?

**Non.** L'Aveugle est canon immortel V1 — c'est le pivot méta. Si Adem veut tuer L'Aveugle un jour, ce sera un événement narratif global (cf. [14-META-WORLD §4](14-META-WORLD.md), événement mondial scripté).

---

## §6 — Confiance intra-run (3 paliers simples)

L'archive V1 propose 6 paliers avec scores 0-100. **V1 simplifie à 3 paliers narratifs** (jamais affichés en HUD) :

| Palier         | Trigger                                                                   | Effet narratif                                                |
| -------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 🟥 **Méfiant** | Insulte, menace, trahison, échec test social majeur                       | PNJ refuse aide, peut attaquer si poussé                      |
| 🟨 **Neutre**  | État par défaut, premières interactions                                   | PNJ poli, transactionnel                                      |
| 🟩 **Allié**   | Aide concrète, succès test VOLONTÉ/SOUFFLE majeur, partage info précieuse | PNJ offre faveurs spontanées, peut accompagner sur 1-2 scènes |

**Stockage** : 1 champ `relations` dans `runs.metadata` JSON : `{ npc_vane: "allié", npc_elara: "méfiant" }`.

**Pas de score 0-100, pas de paliers Confident/Intime/Lié-à-vie V1.** Trop cher en complexité IA, peu de valeur perçue sur un run de 3-15h.

**Inter-runs** : aucune persistance de palier. Reset entre runs sauf Souvenir nommé qui re-déclenche une posture (cf. §7).

---

## §7 — Inter-runs : écho via Souvenirs nommés uniquement

C'est la **règle dure V1**. Un PNJ-Marqueur du run N apparaît au run N+1 dans deux cas seulement :

### Cas 1 : Souvenir nommé impliquant ce PNJ existe

- Le PNJ est injecté en contexte N3 (~50 tokens par Souvenir nommé)
- Au moment où il entre en scène, le MJ IA reçoit : _"Souvenir nommé : L'ancien perso a sauvé Vane à Khar-Then (run précédent, il y a 3 mois IRL)"_
- Le PNJ peut réagir : _"Tu portes le visage d'un voyageur que j'ai connu. Sauf erreur, je lui dois la vie."_

### Cas 2 : PNJ est canon (L'Aveugle)

- L'Aveugle est toujours présent. Il a son propre flux de mémoire spéciale via Souvenirs nommés du joueur (cf. [14-META-WORLD §5](14-META-WORLD.md))
- C'est le seul PNJ à reconnaître **toujours** le joueur entre les runs

### Cas 3 (par défaut) : pas de Souvenir nommé

- Le PNJ accueille comme un inconnu
- C'est **intentionnel** : la rareté de la reconnaissance la rend précieuse
- Évite l'inflation "tous les PNJ se souviennent de tout" qui banalise le hook narratif

---

## §8 — Banque PNJ-Marqueurs V1

Liste cible **8-10 PNJ hand-crafted** au lancement V1. Adem rédige les fiches YAML pendant la phase de production (estimation : ~2h par PNJ = 16-20h total).

| #   | PNJ                                    | Rôle                               | Peut mourir ?  |
| --- | -------------------------------------- | ---------------------------------- | -------------- |
| 1   | **L'Aveugle**                          | Aubergiste pivot, gardien du seuil | ❌             |
| 2   | **Vane** (Inquisiteur)                 | Antagoniste type Culte             | ✅             |
| 3   | **Elara** (Tisse-Verbe renégate)       | Allié potentiel, secret Calamine   | ✅             |
| 4   | **Salhene** (Matriarche Guilde du Sel) | Mécène commerçant                  | ✅             |
| 5   | **Kael le Muet** (Changepeau)          | Allié errant, énigme               | ✅             |
| 6   | **Mihail** (Lame-Ombre)                | Tueur élégant, ambigu              | ✅             |
| 7   | **Ysolde** (Voyante aveugle)           | Mystère, prophéties                | ❌ (lien lore) |
| 8   | **Dalla Segkor** (Forge-Mère)          | Marchande artefacts                | ✅             |

**Note** : les PNJ V1 sont **partagés entre tous les joueurs** (canon Velkhar). Ce n'est pas "le Vane du joueur A vs le Vane du joueur B" — c'est le même Vane canon, qui réagit à chaque joueur selon son historique de Souvenirs nommés.

---

## §9 — Hors V1 (explicite)

Repoussé V2+ :

- **Compagnons** (PNJ qui accompagnent le joueur sur plusieurs scènes en jouant en parallèle) → V2 ou V3
- **Romances** (relation amoureuse persistante) → V2
- **Graphe de croyances complet** par PNJ → V2
- **Indisponibilité temps réel** ("Elara est en expédition pendant 2 semaines IRL") → V3+
- **Mort signifiante de L'Aveugle** comme événement global → V3+ scripté par Adem
- **Cohérence portrait visuel par PNJ** (seed image stable) → V1.1 si volume justifie
- **Banque PNJ étendue à 30-50** → V1.1 progressive (1-2 nouveaux PNJ par mois)
- **PNJ Récurrents qui persistent inter-runs** (Olfa la tenancière qui se souvient) → V2

---

## §10 — Risques & garde-fous

| Risque                                          | Mitigation V1                                                                                                                 |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Inflation "tous les PNJ se souviennent de tout" | Règle dure §7 : reconnaissance inter-run uniquement via Souvenir nommé                                                        |
| L'IA invente un PNJ-Marqueur non-canon          | Fiches YAML injectées en contexte quand PNJ rentre en scène, MJ ne crée pas de nouveau Marqueur                               |
| Voix incohérente entre tours                    | Few-shot 3 phrases canoniques + key_facts_pinned ("Vane a dit ceci scène 2")                                                  |
| Mort gratuite d'un PNJ-Marqueur                 | Backend valide : la mort doit avoir une cause narrative claire dans le contexte. Si IA tente mort gratuite → rejet + reprompt |
| Surcharge tokens si trop de PNJ en scène        | Cap 3 PNJ-Marqueurs simultanés en scène, sinon downgrade en Récurrents                                                        |
| Joueur ne reconnaît pas un PNJ canon            | L'Aveugle peut faire l'intro contextuelle ("tu cherches Vane ? L'Inquisiteur ? Il loge au temple cette saison.")              |

---

## §11 — Synthèse

```
┌─────────────────────────────────────────────────────────────┐
│           Types PNJ V1                                       │
├─────────────────────────────────────────────────────────────┤
│ 🟢 Marqueurs : ~8-10 hand-crafted, fiche YAML, voix unique  │
│ 🟡 Récurrents : templates par lieu, intra-run uniquement     │
│ 🔴 Figurants : générés à la volée, détruits après usage     │
└─────────────────────────────────────────────────────────────┘

         ┌───────────────────────────────────────┐
         │      Mémoire des PNJ V1               │
         ├───────────────────────────────────────┤
         │ Portée par système général [16-MEMORY]│
         │  - N1 intra-tour (1500 tokens)        │
         │  - N2 intra-run (4000 tokens)         │
         │  - N3 inter-runs (800 tokens)         │
         │    └─ Souvenirs nommés UNIQUEMENT     │
         └───────────────────────────────────────┘

         ┌───────────────────────────────────────┐
         │   Confiance intra-run (3 paliers)     │
         │   🟥 Méfiant / 🟨 Neutre / 🟩 Allié    │
         │   Reset entre runs, sauf Souvenirs    │
         └───────────────────────────────────────┘

         ┌───────────────────────────────────────┐
         │ Inter-runs : un PNJ reconnaît        │
         │ SEULEMENT si Souvenir nommé existe   │
         │ (sauf L'Aveugle, canon immortel)     │
         └───────────────────────────────────────┘
```

---

## Références croisées

- → [07-CHARACTER-CREATION §5](07-CHARACTER-CREATION.md) — L'Aveugle pivot rituel de création
- → [14-META-WORLD §2](14-META-WORLD.md) — Souvenirs nommés = seul vecteur d'écho PNJ inter-runs
- → [14-META-WORLD §5](14-META-WORLD.md) — L'Aveugle mémoire vivante
- → [15-GAME-MASTER §1](15-GAME-MASTER.md) — Voix L'Aveugle/Narrateur/PNJ
- → [16-MEMORY §6](16-MEMORY.md) — Souvenirs nommés (mécaniques d'attribution)
- → [13-REPUTATION](13-REPUTATION.md) — Confiance individuelle ↔ réputation faction (V1 simplifiée)
- → [22-GLOSSARY](22-GLOSSARY.md) — entrées L'Aveugle, Souvenirs nommés

---

_Fichier 12 — Phase E — `PNJ & Relations V1` consolidé au scope run. Réduction massive vs `_archive-v1/04-NPCS.md` (329 lignes → focus essentiel intra-run + écho méta)._
_Prochaine étape : [13-REPUTATION.md](13-REPUTATION.md)._
