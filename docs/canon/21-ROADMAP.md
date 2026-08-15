# 21 — Roadmap & jalons (solo dev sustainable)

> **Fichier 21 / Phase D**
> Trajectoire produit V1 → V3+ pour Adem solo dev. Définit ce qui est dans le scope de chaque version, dans quel ordre, et selon quels signaux de marché on passe à la suivante.
>
> ⚠️ **Principe directeur** : **saturer Velkhar avant tout multi-univers.** Tant que le canon Velkhar n'est pas riche et joué profondément, ouvrir un 2ᵉ monde divise l'effort sans amplifier la valeur.

---

## §0 — Principe : un solo dev, des versions courtes, des signaux clairs

GRIMOIRE n'est pas un MVP qu'on "scale". C'est un **produit éditorial** qui grandit par couches narratives. Chaque version vise :

1. **Un objectif produit binaire** (atteint / pas atteint)
2. **Un signal de marché chiffré** qui débloque la suivante
3. **Aucune feature "parce qu'elle serait cool"** — chaque feature doit servir le pilier

**Anti-pattern à éviter** : _"On verra à V2 si on a le temps."_ → soit la feature est cadrée et planifiée, soit elle est explicitement hors scope.

---

## §1 — V1 : Foundation (objectif : prouver le hook)

### 1.1 — Objectif

> _"Un run complet de 2-4h sur Velkhar donne envie au joueur d'en lancer un deuxième J+7."_

C'est l'unique question à laquelle V1 doit répondre. Si oui → V1.1. Si non → on itère sur le hook, pas sur les features.

### 1.2 — Périmètre fonctionnel V1

#### Gameplay

- ✅ Auberge de L'Aveugle (hub permanent, voix canon)
- ✅ Création personnage (nom + vocation + peuple)
- ✅ 4 vocations : Marcheur-du-Sel, Lame-Ombre, Veilleur, Tisse-Verbe
- ✅ Triptyque stats (SANG/SOUFFLE/CENDRE), dés d20
- ✅ Boucle d'action (action libre + choix + dés)
- ✅ Combat narratif (pas grille tactique)
- ✅ Inventaire + or in-game + Calamine (magie unifiée)
- ✅ Run de 2-4h (cible médiane)
- ✅ Mort = nouveau perso + 1 artefact transmis + 1 Souvenir nommé

#### Narratif & lore

- ✅ Canon Velkhar : Makhzen, 8 régions (au moins 3 jouables), 6 peuples, brume dorée, Calcinés
- ✅ Souvenirs nommés (max 3/run, 20 stockés gratuit)
- ✅ Chronique fin de run (récit 800-1200 mots + illustration FLUX schnell + OG image)
- ✅ URL publique Chronique (asset viral)
- ✅ 3-5 événements mondiaux scriptés (durée 1-3 mois IRL)

#### IA & moteur

- ✅ Backend Game Master strict (toutes les décisions)
- ✅ Cascade OpenRouter free tier (DeepSeek-V3.1 → Llama 3.3 → Qwen 2.5 → Mistral)
- ✅ 3 voix d'écriture (Aveugle / Narrateur / PNJ génériques)
- ✅ Mémoire 3 niveaux (intra-tour / intra-run / inter-runs)
- ✅ pgvector pour rappel similarité
- ✅ Caps middleware (30 anon / 150 gratuit / illimité Premium)

#### Auth & billing

- ✅ Cookie HTTPOnly anonyme (90j)
- ✅ NextAuth magic links (gratuit)
- ✅ Stripe Checkout + Customer Portal (Premium 7,99€/mois OU 69€/an)
- ✅ Webhook Stripe → sync tier
- ✅ Mails transactionnels (création compte, paiement, purge M+5, désabo)
- ✅ File prioritaire Redis (Premium queue jump)

#### Frontend

- ✅ Landing page (déjà en cours, branche `feature/88-landing-page-redesign`)
- ✅ Création compte + login magic link
- ✅ Création personnage (modal)
- ✅ Page run (UI scène + choix + stats + inventaire)
- ✅ Page Chronique publique partageable
- ✅ Page profil joueur (galerie Souvenirs nommés + historique runs + abonnement)

#### Hors scope V1 (explicite)

- ❌ Coop multijoueur
- ❌ Multi-univers (autre monde que Velkhar)
- ❌ Mobile native (web responsive uniquement)
- ❌ Discord intégration
- ❌ Système de réputation par faction (Phase E — fichier 13)
- ❌ NPCs relations détaillées (Phase E — fichier 12)
- ❌ Export PDF Chronique
- ❌ Modération automatique IA
- ❌ Voice over / TTS
- ❌ Mode hardcore / iron-mode

### 1.3 — Jalons V1 (Phases techniques)

Référence aux phases issues GitHub déjà définies :

| Phase        | Scope                                                                      | Statut      | Cible                              |
| ------------ | -------------------------------------------------------------------------- | ----------- | ---------------------------------- |
| **Phase 1A** | Landing page + design system                                               | ✅ TERMINÉE | —                                  |
| **Phase 1B** | Auth + création compte + profil                                            | En attente  | +2 semaines                        |
| **Phase 2**  | Auberge L'Aveugle + création perso + run skeleton                          | En attente  | +4-6 semaines                      |
| **Phase 2B** | Combat + inventaire + dés + Calamine                                       | En attente  | +3 semaines                        |
| **Phase 3**  | Mémoire 3 niveaux + pgvector + Souvenirs nommés + Chronique + URL publique | En attente  | +6-8 semaines                      |
| **Phase 3B** | Stripe billing + caps middleware + queue prioritaire + mails               | En attente  | +2-3 semaines                      |
| **Phase 4**  | Polish, tests E2E, monitoring, soft launch fermé                           | En attente  | +2 semaines                        |
| **Phase 5**  | Lancement public                                                           | En attente  | T0 +5-6 mois (estimation solo dev) |

**Estimation totale réaliste** : ~5-6 mois de dev solo à temps partiel (soirées + weekends). Adem confirmera ou ajustera selon disponibilité.

### 1.4 — Signaux de marché qui débloquent V1.1

Au lancement public, suivre pendant **3 mois** :

| Signal                           | Cible "Go V1.1"    | Cible "Retry V1"                      |
| -------------------------------- | ------------------ | ------------------------------------- |
| **Run completion rate**          | ≥ 40%              | < 25% (refondre boucle)               |
| **2ᵉ run J+7**                   | ≥ 25%              | < 15% (refondre rétention)            |
| **Conversion gratuit → Premium** | ≥ 3%               | < 1% (refondre proposition de valeur) |
| **MRR M+3**                      | ≥ 100€             | < 30€ (revoir pricing/positionnement) |
| **Chronique view rate**          | > 5 vues/chronique | < 1 (refondre asset viral)            |

Si 3+ signaux sur 5 sont "Go" → V1.1. Sinon → cycle d'itération sur V1 avant nouvelle feature.

---

## §2 — V1.1 : Profondeur & polish (objectif : engager les revenants)

### 2.1 — Objectif

> _"Le joueur revient pour son 3ᵉ, 5ᵉ, 10ᵉ run parce que Velkhar a plus à dire et que le moteur réagit mieux."_

V1.1 ne s'attaque pas à la croissance — elle approfondit l'existant.

### 2.2 — Périmètre V1.1

#### Lore & contenu

- 8 régions jouables (vs 3-4 en V1)
- 6 peuples avec lore approfondi (langues, coutumes, héritages narratifs)
- ~20 PNJ canon nommés (vs ~8 V1)
- ~15 artefacts canon (vs ~5 V1)
- 1 nouvel événement mondial / mois (Adem écrit la chronique éditoriale)
- Banque de phrases canon élargie pour chaque voix (+50%)

#### IA

- Compression mémoire améliorée (faits `pinned` plus subtils)
- Variantes culturelles PNJ enrichies (5 cultures × phrases canon)
- Modération automatique légère (anti-spam Chronique publique)

#### Frontend

- Page galerie Chroniques publiques (top viewed, recent, random)
- Page profil avancée (timeline visuelle des Souvenirs)
- Améliorations accessibilité (lecteur d'écran complet)
- Mode sombre/clair auto + tokens personnalisables Premium (cosmétique non-gadget)

#### Backend

- Monitoring avancé (dashboard Adem-only : coûts, latences, completion)
- Système A/B testing prompts IA (versions de phrases canon par voix)
- Refonte triptyque `@grimoire/shared` (TODO connu)

#### Monétisation

- Pas de nouveau tier — V1.1 reste 1 Premium unique
- Possibilité d'ajouter pack lifetime 199€ si traction le justifie (signal : > 30 Premium actifs)

#### Hors scope V1.1

- ❌ Multi-univers
- ❌ Coop
- ❌ Mobile native
- ❌ Premium+ tier supérieur

### 2.3 — Signaux qui débloquent V2

Après V1.1 stable (3-6 mois), suivre :

| Signal                              | Cible "Go V2"                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| **Premium actifs**                  | ≥ 100                                                                         |
| **MRR**                             | ≥ 800€/mois                                                                   |
| **Rétention M+3 Premium**           | ≥ 70%                                                                         |
| **Saturation Velkhar**              | Joueurs hardcore signalent "j'ai tout vu" (signal qualitatif via formulaires) |
| **Demande explicite multi-univers** | Signal mineur — Adem ne suit la demande que si elle est massive               |

Si 3+ signaux sur 5 → V2 envisageable. Sinon → V1.2 ou consolidation.

---

## §3 — V2 : Extension (objectif : multiplier la valeur sans diviser l'effort)

### 3.1 — Objectif

> _"Velkhar est saturé, on ouvre un 2ᵉ univers OU on ajoute une couche de profondeur majeure."_

**Important** : V2 n'est PAS automatique. Si Velkhar est encore en croissance et pas saturé, V2 est repoussée.

### 3.2 — Options V2 (à arbitrer selon signaux)

#### Option A : Un 2ᵉ univers (nom à définir)

- Le repo n'ouvre pas de deuxième univers en V1. Toute option multi-univers nécessitera une nouvelle décision produit.
- Nouvel univers = nouvelle ambiance + nouveau lore + nouvelles vocations + nouvelle palette
- Conserve le moteur Game Master / mémoire / Chronique
- Coût dev : ~3-4 mois de lore + 1 mois d'intégration moteur
- Risque : dilue l'effort éditorial sans amplifier valeur si Velkhar pas saturé

#### Option B : Profondeur Velkhar (NPCs relations + réputation)

- Fichiers `12-NPCS-RELATIONS.md` + `13-REPUTATION.md` (Phase E déjà identifiée)
- Système de relations dynamiques PNJ (amour/haine/respect/dette)
- Réputation par faction qui change les options en run
- Coût dev : ~2-3 mois
- Risque faible — c'est de la profondeur sur l'existant

#### Option C : Premium+ tier supérieur (12,99€/mois)

- Inclut "mode prose étendue" = Sonnet 4.6 sur scènes
- Casse l'égalité narrative V1 mais ne touche pas le tier de base
- Coût dev : ~2 semaines (cascade modèle conditionnelle)
- Risque : segmentation tier perçue négativement si mal communiquée

**Recommandation par défaut** : **Option B (profondeur Velkhar)** avant Option A (multi-univers), avec Option C en complément si MRR le permet.

### 3.3 — Périmètre V2 typique (si Option B retenue)

- Système NPCs relations (`12-NPCS-RELATIONS.md`)
- Système réputation par faction (`13-REPUTATION.md`)
- Export PDF Chronique Premium
- Voice over Aveugle (TTS premium, ElevenLabs ou équivalent)
- API publique read-only Chroniques (devs tiers peuvent embed)
- Mobile PWA installable

---

## §4 — V3+ : Horizons (objectif : devenir une plateforme)

### 4.1 — Objectif

> _"GRIMOIRE devient une plateforme narrative IA, plus juste un jeu."_

V3+ est à plusieurs années (T0 + 18-36 mois) et **dépend totalement** d'un MRR > 2 500€/mois stable.

### 4.2 — Pistes V3+ (non priorisées)

| Piste                 | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| Multi-univers complet | 3-5 mondes parallèles, chacun avec ses canons                 |
| Coop async            | 2 joueurs partagent le même run, alternance des tours         |
| Créateur de monde     | Outils communautaires pour custom worlds (modération forte)   |
| Mobile native         | iOS + Android, push notifications soft (jamais agressives)    |
| Marketplace narratif  | Players peuvent vendre/échanger leurs Chroniques (royalties)  |
| API platform          | Open API pour devs tiers (Discord bots, alternatives clients) |
| Mode roleplay live    | Sessions multi-joueurs synchrones (MJ humain + IA assistante) |
| Localisation          | Anglais, espagnol, allemand (Velkhar = bilingue assumé)       |

**Aucune de ces pistes n'est tranchée.** Elles existent comme horizon, pas comme plan.

---

## §5 — Métriques de pilotage continues

### 5.1 — Le dashboard Adem-only (V1)

À avoir dès V1 (pas d'outil externe payant) :

| Métrique                     | Source                                  | Fréquence   |
| ---------------------------- | --------------------------------------- | ----------- |
| Visiteurs uniques landing    | Analytics privacy (Plausible)           | Quotidienne |
| Comptes créés                | SQL `accounts`                          | Quotidienne |
| Runs démarrés                | SQL `runs`                              | Quotidienne |
| Runs terminés (completion)   | SQL `runs.status = ended`               | Quotidienne |
| Chroniques générées          | SQL `chronicles`                        | Quotidienne |
| Chroniques vues              | SQL `chronicles.view_count`             | Hebdo       |
| Premium actifs               | Stripe API + SQL `accounts.tier`        | Quotidienne |
| MRR                          | Stripe Dashboard                        | Hebdo       |
| Conversion gratuit → Premium | Calcul Premium / total comptes gratuits | Hebdo       |
| Coût IA / run moyen          | SQL `request_logs`                      | Hebdo       |
| Latence p95 appels IA        | SQL `request_logs`                      | Hebdo       |
| % free tier saturé           | Monitoring OpenRouter quotas            | Quotidienne |
| Mails purge envoyés (M+5)    | SQL `email_logs`                        | Hebdo       |
| Désabonnements Premium       | Stripe API                              | Hebdo       |

### 5.2 — Le scoreboard mensuel (NSM + secondaires)

**North Star Metric** : completion rate × J+7 retention.

```
Score NSM = (runs_completed / runs_started) × (players_with_2nd_run_J7 / total_players_J7)
```

Cible V1 launch : **≥ 0.10** (40% completion × 25% retour).
Cible V1 mature : **≥ 0.27** (60% × 45%).

### 5.3 — Quand pivoter ?

Si **2 mois consécutifs** :

- NSM < cible launch ET
- MRR stagnant ou en baisse

→ **Pause de feature**, retour sur l'identification du hook qui ne mord pas.
**Pas de feature panic-driven** (ajouter de la complexité ne sauve jamais un produit qui ne mord pas).

---

## §6 — Risques transverses & garde-fous roadmap

| Risque                                      | Probabilité | Mitigation roadmap                                                            |
| ------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| Adem brûlé par charge solo dev              | Élevée      | Versions courtes (V1.1 = 3-4 mois max), pas de sprint long                    |
| Feature creep V1                            | Élevée      | Hors scope explicite + relecture mensuelle                                    |
| OpenRouter free tier disparaît              | Moyenne     | Plan B DeepSeek payant ($0.27/1M) déjà chiffré (cf. [19](19-MONETIZATION.md)) |
| Concurrence directe (autre RPG IA narratif) | Moyenne     | Différentiation par qualité éditoriale Velkhar + Chronique virale             |
| Pas de PMF V1                               | Moyenne     | Itération sur hook avant feature, jamais l'inverse                            |
| Adem perd intérêt                           | Faible      | Solo dev = OK d'arrêter si plus de passion. Pas un engagement infini.         |
| Désabonnement massif post-lancement         | Faible      | 12 mois grâce + UX bienveillante + pas de FOMO                                |

---

## §7 — Le principe "saturer Velkhar avant multi-univers" (clarification)

### 7.1 — Pourquoi ce principe

Tentation classique : _"On a fini V1, ajoutons un nouvel univers pour amplifier l'attrait."_

**C'est un piège.** Raisons :

1. **Effort dilué** : créer un nouvel univers = 3-4 mois de lore + intégration. Cet effort pourrait approfondir Velkhar à 2× la valeur perçue.
2. **Risque éditorial** : Adem maîtrise Velkhar (canon partagé GDD). Un nouvel univers = nouveau canon, nouveau ton, nouvelle cohérence à construire.
3. **Marketing dilué** : 2 univers = 2 angles de comm. 1 univers riche = 1 angle puissant.
4. **Rétention floue** : un joueur engagé sur Velkhar peut perdre l'envie si "tout le monde parle de l'univers Y maintenant".

### 7.2 — Critères de saturation Velkhar

Velkhar est "saturé" quand :

- ≥ 80% des joueurs Premium actifs ont vu les 8 régions
- ≥ 50% ont accompli au moins 1 run avec chaque vocation
- Signaux qualitatifs récurrents : _"J'ai l'impression d'avoir tout vu"_, _"Je veux autre chose"_
- MRR stable et croissant depuis ≥ 6 mois (la croissance Velkhar ne suffit plus à amplifier)

Sans ces 4 conditions → V2 reste sur Velkhar (profondeur, pas extension).

### 7.3 — Quand multi-univers devient évident

Si 100+ Premium et signaux "j'ai tout vu" majoritaires → **alors** envisager un deuxième univers nommé et cadré par un nouveau GDD. Pas avant.

---

## §8 — Synthèse roadmap

```
┌──────────────────────────────────────────────────────────────────────┐
│                      ROADMAP GRIMOIRE                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  V1 (T0 +5-6m)        V1.1 (+3-6m)         V2 (+6-12m)              │
│  ─────────────         ──────────           ──────────              │
│  Foundation            Profondeur           Extension OU profondeur+│
│  Prouver le hook       Saturer Velkhar      Multi-univers OU NPCs   │
│  ✅ Auberge            ↑ Lore complet       ↑ Relations PNJ         │
│  ✅ 4 vocations        ↑ 8 régions          ↑ Réputation factions   │
│  ✅ Run 2-4h           ↑ Variantes voix     ↑ Premium+ (optionnel)  │
│  ✅ Chronique          ↑ Galerie publique   ↑ Voice over Aveugle    │
│  ✅ Stripe Premium     ↑ Refonte triptyque  ↑ PWA mobile            │
│                                                                      │
│       │                     │                     │                  │
│       ↓                     ↓                     ↓                  │
│  Signal Go V1.1        Signal Go V2         Signal Go V3            │
│  • 40% completion      • 100 Premium        • 2 500€ MRR stable     │
│  • 25% J+7 retention   • Velkhar saturé     • Plateforme demandée   │
│  • 3% conversion       • MRR 800€+                                   │
│  • 100€ MRR M+3                                                      │
│                                                                      │
│              V3+ (+18-36m)                                           │
│              ──────────                                              │
│              Plateforme narrative                                    │
│              • Multi-univers complet                                 │
│              • Coop async                                            │
│              • Créateur de monde                                     │
│              • Mobile native                                         │
│              • API publique                                          │
│              • Localisation EN/ES/DE                                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
              │
              ↓
   PRINCIPE FONDATEUR : SATURER VELKHAR AVANT MULTI-UNIVERS
   Profondeur > Extension tant que Velkhar n'est pas joué à fond.
```

---

## Références croisées

- → [\_STATUS.md](_STATUS.md) — état d'avancement Phase actuelle
- → [18-RETENTION](18-RETENTION.md) — métriques + NSM
- → [19-MONETIZATION §9](19-MONETIZATION.md) — projections économiques V1
- → [01-PILLARS](01-PILLARS.md) — vision long terme
- → [20-ARCHITECTURE §11](20-ARCHITECTURE.md) — "ce qui est hors V1"
- → [22-GLOSSARY](22-GLOSSARY.md) — termes (à venir)
