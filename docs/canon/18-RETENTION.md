# 18 — Rétention & rejouabilité

> **Fichier 18 / Phase D / Pilier #7 (3 crochets de rétention hiérarchisés)**
> Étend [14-META-WORLD](14-META-WORLD.md) (qui implémente les 3 crochets) avec la **stratégie de rétention** : pourquoi le joueur revient, comment on le mesure, quand on s'inquiète.
>
> ⚠️ **Hors-scope** : implémentation technique des Souvenirs/Chronique/Monde (déjà dans Phase C). Ce fichier parle **comportement joueur**, pas code.

---

## §0 — Principe directeur

**La rétention dans un roguelike narratif IA est antifragile par design** : chaque run produit un objet émotionnel (Chronique) + un héritage (Souvenirs) + un monde modifié. Le joueur qui revient ne recommence jamais à zéro — il **reprend une saga**.

**Le piège à éviter** : la rétention par grind (daily quests, log-in streaks, season pass). GRIMOIRE ne fera **jamais** ça. Le joueur revient parce qu'il **veut savoir la suite**, pas parce qu'il a peur de perdre quelque chose.

**Règle absolue** : aucun mécanisme de rétention ne doit créer de FOMO (_Fear Of Missing Out_). Pas de "événement limité 48h", pas de "ton perso meurt si tu joues pas cette semaine", pas de timer de connexion. Le monde attend.

### ⚠️ Le crochet zéro : la boucle doit être bonne _(ajout 2026-08-06)_

Tout ce fichier suppose un joueur qui **a aimé son run** et veut la suite. Le playtest du 2026-08-06
a montré que cette prémisse n'était pas acquise : le retour joueur était _« après une partie je
m'ennuie, il n'y a aucune raison de recommencer »_.

> **Aucun crochet de rétention ne rattrape une boucle de jeu qui n'est pas amusante.** Une Chronique
> magnifique d'un run ennuyeux ne fait pas revenir : elle documente l'ennui.

L'ordre est donc :

```
0. La boucle est bonne   ← 23-RUN-STRUCTURE (quête → voyage → mystère → combat → retour)
   1. Souvenirs nommés
      2. Chronique
         3. Monde qui change
```

Les crochets #1 à #3 restent valides et correctement hiérarchisés — mais ils s'appliquent **après**
que le joueur a envie de relancer un run pour le run lui-même. Voir aussi le **crochet #4**
(connaissance et accès, `09-ACTION-LOOP §10` et `14-META-WORLD §1bis`), qui est le premier crochet
**mécanique** et non narratif.

---

## §1 — La hiérarchie des 3 crochets (rappel + justification)

Posée en Phase C (cf. [14-META-WORLD §1](14-META-WORLD.md)), reprise ici avec la **logique de priorité d'implémentation** :

| Priorité     | Crochet                               | Coût dev                                  | Impact rétention                               | ROI        |
| ------------ | ------------------------------------- | ----------------------------------------- | ---------------------------------------------- | ---------- |
| **#1 HAUTE** | Souvenirs nommés (Niveau A)           | Faible (persistance + injection contexte) | **Élevé** ("mon perso a une histoire")         | ⭐⭐⭐⭐⭐ |
| **#2 MOYEN** | Chronique de fin de run (asset viral) | Moyen (génération + page publique + OG)   | **Moyen direct, élevé indirect** (acquisition) | ⭐⭐⭐⭐   |
| **#3 BAS**   | Monde qui change (Niveau C)           | Faible V1 (3-5 events curés à la main)    | **Léger** (saupoudrage, pas de hook fort)      | ⭐⭐⭐     |

**Pourquoi cette hiérarchie ?**

- **Souvenirs nommés** = le seul crochet **personnel** au joueur. Il revient pour SA saga, pas pour un événement global. **À optimiser en priorité absolue.**
- **Chronique** = double fonction (émotion + acquisition). La partie émotion fidélise déjà existants. La partie virale recrute de nouveaux. **Optimiser en second.**
- **Monde qui change** = atmosphère, pas hook. Si on doit couper quelque chose en V1, c'est ça. **Garder minimal V1, polish V2+.**

---

## §2 — Crochet #1 : Souvenirs nommés (le cœur)

### 2.1 — Pourquoi ça marche

Les Souvenirs nommés transforment un run terminé en **objet narratif permanent** rattaché au joueur. Effet psychologique :

- **Sunk cost positif** : le joueur a investi de l'émotion → il veut continuer à construire dessus
- **Identité narrative** : _"Mon Marcheur-du-Sel a épargné Vane lors du Concile de Tissan"_ — c'est SA vérité, pas celle du jeu
- **Rappel asynchrone** : L'Aveugle mentionne les Souvenirs au run N+1 → reconnexion instantanée même après 2 semaines d'absence

### 2.2 — Les déclencheurs émotionnels (rappel cf. [14-META-WORLD §2](14-META-WORLD.md))

L'IA tag des moments candidats. Le backend valide selon règles :

- **Mort PNJ majeur** (faction leader, allié récurrent)
- **Choix moral fort** (trahir, épargner, sacrifier)
- **Victoire de combat épique** (contre un boss tier 3+)
- **Découverte secrète** (artefact rare, vérité lore)
- **Échec marquant** (mort héroïque, défaite morale)

**Max 3 Souvenirs nommés / run** — sinon dilution.

### 2.3 — La règle de la rareté préservée

| Cap par tier | Souvenirs nommés stockés                                                                  |
| ------------ | ----------------------------------------------------------------------------------------- |
| Anonyme      | 0 (pas de persistance serveur — cookie chiffré ne stocke que 3-4 max provisoires)         |
| Gratuit      | **20 max** (purge auto si > 6 mois inactivité, cf. [19-MONETIZATION](19-MONETIZATION.md)) |
| Premium      | Illimité, jamais de purge                                                                 |

**Pourquoi 20 pour gratuit ?** Force le joueur à choisir : _"Lequel je garde ?"_. Le choix = engagement. Si illimité gratuit → inflation → dévaluation.

### 2.4 — Pattern d'injection au run N+1

Quand le joueur revient pour un nouveau run :

1. Backend charge les **5 Souvenirs les plus pertinents** (similarité pgvector vs contexte run actuel — cf. [16-MEMORY §3](16-MEMORY.md))
2. L'Aveugle reçoit les 5 dans son contexte au début du run
3. L'Aveugle **doit en mentionner au moins 1** dans son dialogue d'ouverture (prompt système le force)
4. Le joueur ressent immédiatement _"Ce monde se souvient de moi"_

**Latence émotionnelle** : 0. Première phrase du run = rappel mémoriel.

### 2.5 — Antifragilité des Souvenirs

Que se passe-t-il si :

- **Le joueur joue 5 runs d'affilée → 15 Souvenirs accumulés ?** L'IA priorise les plus récents + les plus émotionnellement chargés (tag `intensity` 1-5)
- **Le joueur revient après 6 mois ?** Gratuit : purge déjà passée (mais Chronique préservée — il a quelque chose). Premium : Souvenirs intacts, L'Aveugle dit _"Voilà longtemps qu'on ne t'a pas vu. Le sable a gardé tes traces."_
- **Le joueur crée un 2ᵉ perso ?** Les Souvenirs du perso précédent sont liés à `player_id` (pas à `character_id`). Le nouveau perso bénéficie aussi → continuité saga > continuité perso

---

## §3 — Crochet #2 : Chronique (le moteur viral)

### 3.1 — Pourquoi c'est asset d'acquisition #1

Détaillé dans [17-RUN-CHRONICLE §1.2](17-RUN-CHRONICLE.md). Synthèse :

- **0€ d'acquisition** par Chronique partagée
- **Format social-friendly** : OG image 1200×630 + tagline 15-30 chars + URL courte
- **Pas de gating** : tous les joueurs (anonymes inclus) génèrent une Chronique → maximisation du funnel
- **Permanence** : chaque Chronique reste live indéfiniment → SEO long-tail + ré-engagement possible

### 3.2 — Le funnel rétention via Chronique

```
Joueur finit run → Chronique générée → 3 actions possibles :

(A) Partage public  → Acquisition de nouveaux joueurs (rétention indirecte)
(B) Garde pour soi  → Trophée perso → revient pour en collectionner d'autres
(C) Ignore          → Rare en pratique (Chronique = écran de fin obligatoire)
```

### 3.3 — Métriques Chronique à tracker

| Métrique                      | Définition                                            | Cible V1                                    |
| ----------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| **Chronicle generation rate** | `chronicles_created / runs_ended`                     | > 95% (échec génération rare)               |
| **Chronicle view rate**       | Vues page publique / Chroniques générées              | > 30% (signe que les joueurs la consultent) |
| **Chronicle share rate**      | Partages explicites (clic bouton) / vues              | > 10%                                       |
| **Funnel acquisition**        | Nouveaux signups venant d'une URL `/chronique/{slug}` | > 5% des signups totaux                     |

**Si view rate < 30% en M+2** → problème de qualité Chronique (texte fade) → revisiter prompt + modèle.
**Si share rate < 10%** → problème UX (boutons mal placés) ou format (OG image moche).
**Si funnel acquisition < 5%** → soit Chroniques pas partagées, soit landing page ne convertit pas.

### 3.4 — Boucle vertueuse Chronique → Souvenirs

La Chronique mentionne explicitement les Souvenirs nommés du run (cf. [17-RUN-CHRONICLE §3.2](17-RUN-CHRONICLE.md)). Effet :

- Le joueur (et ses amis qui lisent) voient les Souvenirs **mis en scène littérairement**
- Quand il revient pour un nouveau run → il sait que cette scène marquante **persistera comme Souvenir**
- Sa façon de jouer change → il **cherche** les moments forts → meilleur gameplay → meilleures Chroniques → cycle

---

## §4 — Crochet #3 : Monde qui change (l'atmosphère)

### 4.1 — Pourquoi c'est en #3 (pas en #1)

Le monde qui change est **systémique** (touche tous les joueurs identiquement) → effet _"saupoudrage"_, pas _"hook personnel"_. Risque si on le mettait en priorité haute : on coderait un système MMO complexe pour un effet rétention faible.

### 4.2 — Le modèle V1 minimaliste (rappel)

Cf. [14-META-WORLD §4](14-META-WORLD.md) :

- 3-5 événements globaux actifs simultanément
- Durée 1-3 mois IRL
- Curés à la main par Adem (~1 nouvel event/mois = ~6h/an)
- Injectés en contexte IA + mentionnés par L'Aveugle

### 4.3 — Pourquoi ça marche quand même

- **Coût de production quasi-nul** (~6h/an Adem)
- **Effet "monde vivant" pour 0€** : le joueur perçoit Velkhar comme persistant
- **Hook secondaire pour curieux** : _"Tiens, la grande sécheresse est finie, je vais voir comment Tissan a changé"_

### 4.4 — Métrique unique à tracker

| Métrique                     | Définition                                         | Cible V1 |
| ---------------------------- | -------------------------------------------------- | -------- |
| **World event mention rate** | % de runs où l'IA mentionne au moins 1 event actif | > 80%    |

Si < 80% → le prompt système ne pousse pas assez fort. Le monde "change" mais personne ne le sait.

---

## §5 — Les métriques North Star (consolidation)

### 5.1 — Rappel des piliers (cf. [01-PILLARS §8](01-PILLARS.md))

> **Taux de runs terminés (completion) + Taux de 2ᵉ run dans les 7 jours.**

| Phase     | Completion | 2ᵉ run J+7 |
| --------- | ---------- | ---------- |
| Lancement | ≥ 40%      | ≥ 25%      |
| Mature    | ≥ 60%      | ≥ 45%      |

### 5.2 — Métriques secondaires (la lecture fine)

| Métrique                                 | Catégorie  | Cible V1     | Si en dessous →                                                                        |
| ---------------------------------------- | ---------- | ------------ | -------------------------------------------------------------------------------------- |
| **Completion rate**                      | North Star | 40%          | Problème game design (runs trop longs ? frustration ?)                                 |
| **2ᵉ run J+7**                           | North Star | 25%          | Problème rétention (hook crochet #1 faible)                                            |
| **3ᵉ run J+30**                          | Engagement | 15%          | Problème monde mature (lassitude)                                                      |
| **Souvenirs créés / run**                | Crochet #1 | 2 en moyenne | IA tag mal les moments candidats                                                       |
| **L'Aveugle mentionne Souvenir run N+1** | Crochet #1 | 100%         | Bug prompt système                                                                     |
| **Chronicle view rate**                  | Crochet #2 | 30%          | Qualité Chronique ou UX                                                                |
| **Chronicle share rate**                 | Crochet #2 | 10%          | UX partage ou OG image                                                                 |
| **Funnel acquisition Chronique**         | Crochet #2 | 5% signups   | Landing post-Chronique faible                                                          |
| **World event mention rate**             | Crochet #3 | 80%          | Prompt système faible                                                                  |
| **Free → Premium conversion**            | Économie   | 3-5%         | Caps mal calibrés ou Premium peu désirable (cf. [19-MONETIZATION](19-MONETIZATION.md)) |

### 5.3 — Cadence de revue

- **Hebdo** : completion rate, 2ᵉ run J+7, Chronique view/share
- **Mensuel** : conversion free → premium, Souvenirs/run, world events
- **Trimestriel** : revue complète + ajustement caps + ajout/retrait événements globaux

### 5.4 — Outillage V1 minimaliste

Cf. [20-ARCHITECTURE §7](20-ARCHITECTURE.md). Pas de Mixpanel/Amplitude — **scripts SQL Supabase** lancés à la main + dashboard interne ultra-basique. Le solo dev doit pouvoir lire ses métriques en 5 min/semaine, pas y passer 1 jour.

---

## §6 — Antifragilité du retour joueur

### 6.1 — Le joueur qui revient après 1 semaine

| Trigger émotionnel au retour         | Mécanisme                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| L'Aveugle reconnaît                  | Prompt système charge Souvenirs (cf. §2.4)                                          |
| Le monde a évolué                    | World event injecté en contexte IA                                                  |
| Le perso garde son héritage          | Artefact + écho transmis (cf. [07-CHARACTER-CREATION §7](07-CHARACTER-CREATION.md)) |
| Choix de poursuivre ou nouveau perso | Modal proposée à l'auberge V1.1                                                     |

### 6.2 — Le joueur qui revient après 1 mois

- Souvenirs intacts (cap 20 gratuit non encore touché — la purge c'est 6 mois)
- Probablement nouveau monde event actif → nouveauté immédiate
- L'Aveugle adapte son ton : _"Tu reviens enfin. Le sable a gardé bien des secrets pendant ton absence."_

### 6.3 — Le joueur qui revient après 6 mois (gratuit)

**Cas le plus délicat.** Juste avant la purge auto :

- Mail envoyé à M+5 : _"Tes Souvenirs t'attendent encore 1 mois — viens écrire la suite"_
- Si revient : reset compteur d'inactivité, tout préservé
- Si ignore : purge à M+6 mais **Chronique préservée éternellement** (pas de purge Chronique gratuit non plus)

→ Même après purge, le joueur a **toujours** ses Chroniques pour ressentir la nostalgie.

### 6.4 — Le joueur qui revient après 12 mois (Premium désabonné)

- Données encore intactes pendant 12 mois grâce après désabonnement (cf. [19-MONETIZATION](19-MONETIZATION.md))
- Mail M+10 : _"Tes Souvenirs Premium s'effaceront dans 2 mois — réabonne-toi pour les préserver"_
- Si réabonne : tout récupéré transparent. Si ignore : downgrade vers règles gratuit (purge + 6 mois supplémentaires)

### 6.5 — Ce qu'on NE FAIT PAS

- ❌ Daily quests, log-in rewards, streaks
- ❌ Énergie / stamina (free-to-play mobile)
- ❌ Saison limitée 30 jours
- ❌ Notification push _"Reviens jouer !"_ (uniquement transactionnels : purge incoming, Chronique partagée a reçu X vues)
- ❌ Battle pass, season pass
- ❌ Mauvaise UX pour forcer Premium (cf. [19-MONETIZATION §règle d'or éthique](19-MONETIZATION.md))

---

## §7 — Risques rétention & garde-fous

| Risque                                      | Probabilité            | Impact | Garde-fou                                                          |
| ------------------------------------------- | ---------------------- | ------ | ------------------------------------------------------------------ |
| **Lassitude du monde mature** (J+90+)       | Moyenne                | Élevé  | World events curés à la main + nouvelles vocations V2              |
| **Souvenirs trop génériques** (IA tag mal)  | Moyenne                | Moyen  | Tests A/B prompt + feedback joueur (signaler Souvenir nul)         |
| **Chronique fade → pas de partage**         | Faible (modèle bon)    | Élevé  | Sonnet 4.6 envisagé V2+ si view rate stagne                        |
| **Joueur frustré par caps gratuit 150/sem** | Élevée                 | Moyen  | Mur explicite + propose Premium → conversion attendue 3-5%         |
| **Premium désabo perd données**             | Faible (12 mois grâce) | Élevé  | Mail explicite avant purge + downgrade gracieux gratuit            |
| **L'Aveugle devient répétitif**             | Moyenne                | Moyen  | Banque de 30+ phrases d'ouverture, randomisées + adaptées contexte |

---

## §8 — La règle d'or rétention

> **Le joueur revient parce qu'il VEUT savoir la suite, jamais parce qu'il a PEUR de perdre.**

Tous les mécanismes V1 respectent ça :

- Souvenirs nommés = curiosité (_"que va devenir cette saga ?"_) — pas peur
- Chronique = fierté (_"j'ai vécu cette histoire"_) — pas peur
- Monde qui change = découverte (_"qu'est-ce qui a changé ?"_) — pas peur
- Caps gratuit = générosité limitée (150 reqs/sem = ~1 mini-run/sem) — pas punition

Si une décision design future induit de la peur → **rejet automatique**, même si elle "boosterait la rétention".

---

## §9 — Synthèse

```
                    ┌─────────────────────────────────────┐
                    │      LE JOUEUR REVIENT              │
                    │      (driver émotionnel)            │
                    └─────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ↓                           ↓                           ↓
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  CROCHET #1      │    │   CROCHET #2         │    │   CROCHET #3         │
│  Souvenirs       │    │   Chronique          │    │   Monde change       │
│                  │    │                      │    │                      │
│  PERSONNEL       │    │  PERSONNEL + VIRAL   │    │  AMBIANCE            │
│  Priorité ABSOLUE│    │  Priorité ÉLEVÉE     │    │  Priorité BASSE      │
│                  │    │                      │    │                      │
│  "Ma saga"       │    │  "Mon histoire à     │    │  "Velkhar continue"  │
│                  │    │   partager"          │    │                      │
└──────────────────┘    └──────────────────────┘    └──────────────────────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    ↓
                    ┌─────────────────────────────────────┐
                    │  NORTH STAR                         │
                    │  Completion ≥40% + 2ᵉ run J+7 ≥25% │
                    │  (Lancement → ≥60% / ≥45% mature)  │
                    └─────────────────────────────────────┘
                                    │
                                    ↓
                    ┌─────────────────────────────────────┐
                    │  CONVERSION ÉCONOMIQUE 3-5%         │
                    │  → cf. 19-MONETIZATION              │
                    └─────────────────────────────────────┘
```

---

## Références croisées

- → [14-META-WORLD](14-META-WORLD.md) — implémentation technique des 3 crochets
- → [16-MEMORY](16-MEMORY.md) — pgvector pour rappel Souvenirs au run N+1
- → [17-RUN-CHRONICLE](17-RUN-CHRONICLE.md) — détails Chronique + métriques view/share
- → [01-PILLARS §8](01-PILLARS.md) — North Star Metric d'origine
- → [19-MONETIZATION](19-MONETIZATION.md) — caps, purges, grâce Premium
- → [20-ARCHITECTURE §7](20-ARCHITECTURE.md) — outillage métriques V1 minimaliste
