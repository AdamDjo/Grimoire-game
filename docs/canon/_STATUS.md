# GRIMOIRE — État du Projet (mémoire de session)

_Dernière màj : 2026-06-30 — Garder ce fichier à jour pour préserver les tokens._

---

## DÉCISIONS ACTÉES (non négociables)

### Fondations produit

| #   | Décision             | Valeur                                                             |
| --- | -------------------- | ------------------------------------------------------------------ |
| 1   | Nom produit          | **GRIMOIRE — Of Ash and Salt** (FR : Des Cendres et du Sel)        |
| 2   | Monde                | **Velkhar** (continent désertique, le _Makhzen_)                   |
| 3   | Genre                | Roguelike narratif (run 3-15h, aventure complète)                  |
| 4   | Persistance          | Canon fixe + méta-monde vivant + Chronique + écho léger            |
| 5   | Multijoueur          | Solo V1, co-op V2                                                  |
| 6   | Action               | Choix IA + saisie libre Discord + **dés BG3 aux pivots seulement** |
| 7   | Survie               | Complète mais pas hardcore — histoire = main focus                 |
| 8   | Direction artistique | Dark fantasy désertique                                            |

### Personnage

| #   | Décision       | Valeur                                                 |
| --- | -------------- | ------------------------------------------------------ |
| 9   | Attributs      | Triptyque **SANG · SOUFFLE · CENDRE** + tooltips site  |
| 10  | Progression    | **Équipement-driven** (pas de niveaux)                 |
| 11  | Vocations V1   | **Marcheur-du-Sel, Lame-Ombre, Veilleur, Tisse-Verbe** |
| 12  | Vocations V2   | Changepeau, Chasseur-de-Revenants, Contrebandier       |
| 13  | Création perso | Vocation OU concept écrit libre par le joueur          |

### Lore (REFONTE — décisions L1-L11)

| #   | Décision                | Valeur                                                                                                                                                                         |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| L1  | **Origine**             | Les **Archontes** ont forgé des artefacts. Leur magie a débordé → désert de cendre dorée. UN événement.                                                                        |
| L2  | **Sable doré**          | = la **Cendre** (magie dispersée qui recouvre tout). La **brume dorée** = Cendre concentrée, mortelle.                                                                         |
| L3  | **Magie unifiée**       | Artefacts = seule source de pouvoir (chacun unique). **Calamine** = coût universel. **Tisse-Verbe** = seul à éveiller/pousser les artefacts. Plus de Verbe/Don/Pierre séparés. |
| L4  | **Calcinés = monstres** | Anciens humains abusés de Cendre → menaces dorées. Catégorie centrale du bestiaire.                                                                                            |
| L5  | **Donjons/ruines**      | Là où dorment les artefacts. Cœur de la boucle d'exploration.                                                                                                                  |
| L6  | **Quête ouverte**       | Pouvoir / Vérité / Survie / Destruction. Le joueur construit SA vérité. Aucune réponse canonique.                                                                              |
| L7  | **Factions réduites**   | 4-5 majeures (fiches) + 5-6 mineures (mentionnées). Système complet en V2.                                                                                                     |
| L8  | **L'Aveugle**           | Vend UNIQUEMENT du lore + explique les artefacts rapportés. Pas d'équipement.                                                                                                  |
| L9  | **Monnaie méta**        | **Les Souvenirs** — distincte de l'or in-game. 1 gratuit/run + bonus selon performance. Échangée chez L'Aveugle.                                                               |
| L10 | **Monnaie in-game**     | 🪙 **L'or classique** — achat/revente d'équipement dans le run. Perdu à la mort.                                                                                               |
| L11 | **Vocabulaire**         | Hiérarchisé en 3 niveaux : 5 mots (scène 1) → 10 mots (run 1) → découvertes (runs suivants).                                                                                   |

### Méta-progression

| #   | Décision           | Valeur                                                                                                          |
| --- | ------------------ | --------------------------------------------------------------------------------------------------------------- |
| 14  | Héritage           | Artéfact (1, dégrade après 3-4 transmissions) + écho réputation/connaissance/compétence mineurs + ancêtre vague |
| 15  | Gardien du seuil   | **L'Aveugle** (aubergiste, vend infos lore)                                                                     |
| 16  | Joueur sans compte | Session anonyme + conversion douce (compte proposé après run 1)                                                 |

### Tech & business

| #   | Décision      | Valeur                                                                                                                           |
| --- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 17  | Stack IA      | **OpenRouter** (routeur) + fallback, pas de local, 1-2 appels/tour                                                               |
| 18  | Stack code    | Express + TypeScript (routes/services/ai/game-rules/lore)                                                                        |
| 19  | Monétisation  | Quota run/jour gratuit + premium illimité + IA premium                                                                           |
| 20  | Rejouabilité  | Méta-monde changeant + choix divergents + émergence IA                                                                           |
| 21  | Bestiaire     | 15-20 créatures au lancement, par tiers + biome                                                                                  |
| 22  | Artefacts     | Endgame rares, liés à quêtes/secrets/donjons                                                                                     |
| 23  | Opening scene | Fixe : auberge L'Aveugle → nom → modal création → IA réagit → (run≥2) vend infos contre Souvenirs → joueur quitte → run commence |

---

## LE TRIPTYQUE

| Attribut   | Pilote                                               |
| ---------- | ---------------------------------------------------- |
| 🩸 SANG    | combat, survie, force, intimidation                  |
| 💨 SOUFFLE | précision, furtivité, artisanat, éveil des artefacts |
| 🔥 CENDRE  | charisme, foi, commandement, résistance magique      |

Échelle mods : −3 à +4. PV = 10 + SANG.
⚠️ Magie unifiée : plus de "Don/Verbe/Pierre" séparés. Les artefacts = pouvoir, Calamine = coût universel, Tisse-Verbe = seul à les éveiller.

---

## LES 4 VOCATIONS V1

| Vocation           | SANG | SOUFFLE | CENDRE | Angle                                      | Faction liée  |
| ------------------ | ---- | ------- | ------ | ------------------------------------------ | ------------- |
| 🐫 Marcheur-du-Sel | +2   | 0       | 0      | Commerce/survie/désert                     | Guilde du Sel |
| 🗡️ Lame-Ombre      | 0    | +2      | 0      | Contrats/secrets/ombres                    | Main d'Ombre  |
| 🏛️ Veilleur        | 0    | +2      | 0      | Ruines/artefacts/savoir                    | Éveilleurs    |
| 🔥 Tisse-Verbe     | −1   | +2      | +1     | Éveille les artefacts, risque max Calamine | Rénovateurs   |

Bonus peuple : Sahélin +1 SANG · Rivain +1 CENDRE · Thérien +1 SANG · Cendreur +1 SOUFFLE · Changepeau +1 SOUFFLE/−1 CENDRE.

✅ `05-VOCATIONS.md` aligné : Veilleur et Tisse-Verbe parlent d'éveil d'artefacts, plus de "Verbe/Pierre/Don".

---

## LES 5 PILIERS

1. 🌊 **Survie** — le monde essaie de te tuer (brume dorée, Calcinés, faim)
2. 🎲 **Choix & Dés** — d20 BG3 aux pivots seulement, succès/échec fertiles
3. 📖 **Lentille Narrative** — chaque vocation voit le monde autrement
4. 🔄 **Rejouabilité** — même monde, mille histoires (méta change + IA improvise)
5. 🏺 **Héritage** — la mort n'est pas stérile (artéfact transmis + échos)

North Star : completion rate ≥40% + 2e run à J+7 ≥25% (lancement).

---

## LES 4 QUÊTES OUVERTES DU JOUEUR (L6)

| Quête                    | Ce que cherche le joueur                                |
| ------------------------ | ------------------------------------------------------- |
| 🔮 **Pouvoir**           | Maîtriser les artefacts, devenir plus fort que le monde |
| 💡 **Vérité**            | Comprendre le cataclysme, rassembler les fragments      |
| 🛡️ **Survie / Héritage** | Durer, fonder quelque chose, laisser une trace          |
| 💀 **Destruction**       | Briser les artefacts, empêcher que ça recommence        |

Aucune n'est canonique. Le joueur choisit par ses actes.

---

## ÉTAT DU GDD

### Chemin : `docs/canon/`

### Source importée : `/Users/adembenmessaoud/ZCodeProject/GDD/`

### Archive v1 : `/Users/adembenmessaoud/ZCodeProject/GDD/_archive-v1/` (17 anciens docs, non copiés dans le repo)

### ✅ FAIT — Refonte lore complète (session précédente)

- `02-WORLD-BIBLE.md` — ✅ **RÉÉCRIT** (origine unifiée L1, sable doré=Cendre L2, magie unifiée L3, Calcinés=monstres L4, donjons/artefacts L5, 4 quêtes L6, L'Aveugle L8, vocabulaire L11)
- `03-FACTIONS.md` — ✅ **CRÉÉ** (4 majeures avec fiches : Culte, Guilde du Sel, Main d'Ombre, Éveilleurs + 5 mineures mentionnées)
- `03-BESTIARY.md` — ✅ **CRÉÉ** (18 créatures, Calcinés au centre, 4 tiers de danger, par biome)

### ✅ FAIT — Phase A : Cohérence magie unifiée (complète)

- `04-ATTRIBUTES.md` — ✅ **RETOUCHÉ** (magie unifiée, refs Verbe/Don/Pierre supprimées, §8 réécrit)
- `01-PILLARS.md` — ✅ **DÉJÀ CLEAN** (pilier 5 Héritage en place, aucune mention résiduelle)
- `05-VOCATIONS.md` — ✅ **RETOUCHÉ** (Veilleur : plus de "magie de la Pierre"/"Verbe", éveil = Tisse-Verbe seul)
- `06-SURVIVAL.md` — ✅ **RETOUCHÉ** (§4 Cendre/Calamine élargie à tous les aventuriers, Tisse-Verbe = compte à rebours accéléré)
- `08-DICE-RESOLUTION.md` — ✅ **RETOUCHÉ** (compétence "Éveil" remplace "Verbe", artefacts dans table dégâts, bug l.204 corrigé)
- `00-SOMMAIRE.md` — ✅ **RETOUCHÉ** (03-BESTIARY listé, décisions L3/héritage/L'Aveugle/monnaies ajoutées, date màj)

### ✅ FAIT — Phase B : Gameplay (complète)

- `09-ACTION-LOOP.md` — ✅ **CRÉÉ** (boucle hybride choix+✍️, 3 modes joueur, éveil artefact effet de base+amplif, 3 actes invisibles, 3 crochets rétention Chronique/Souvenirs/monde change)
- `07-CHARACTER-CREATION.md` — ✅ **CRÉÉ** (5 étapes rituel L'Aveugle, concept libre → vocation hôte, 1ᵉʳ Souvenir gratuit, identification artefact, création raccourcie après mort)
- `10-COMBAT.md` — ✅ **CRÉÉ** (tactique lite BG3, 4 catégories d'action, CENDRE Leader avec Intimidation/Commandement/Présence, fuite/mort/captivité)
- `11-INVENTORY-ECONOMY.md` — ✅ **CRÉÉ** (2 monnaies or/Souvenirs, inventaire 8+12+1+illimité, 3 tiers équipement, artefacts éveil amplif, héritage dégrade 3-4, banque L'Aveugle, donjons)

### ✅ FAIT — Phase C : Monde, IA & Architecture (complète)

- `15-GAME-MASTER.md` — ✅ **CRÉÉ** (IA voix-only, 3 styles d'écriture L'Aveugle/Narrateur/PNJ, cascade OpenRouter free tier DeepSeek→Llama→Qwen→Mistral, anti-patterns interdits, Zod systématique, budget 8000 tokens, prompt système V1)
- `16-MEMORY.md` — ✅ **CRÉÉ** (3 niveaux N1 intra-tour 1500t / N2 intra-run 4000t avec pgvector / N3 inter-runs 800t, compression Mistral Small free tous les 8-10 tours, key_facts_pinned, seuil similarité 0.85, anonyme cookie chiffré)
- `17-RUN-CHRONICLE.md` — ✅ **CRÉÉ** (800-1200 mots Narrateur, déclencheurs mort/auberge/abandon, URL publique grimoire.game/chronique/{slug} permanente, OG image Canvas, Pollinations.ai gratuit, V2+ Sonnet 4.6 Premium ~$0.03, anti-bot 1/jour)
- `14-META-WORLD.md` — ✅ **CRÉÉ** (3 niveaux A Souvenirs nommés 3/run perso / B traces locales V1 / C world_events 3-5 actifs curés à la main par Adem ~6h/an, L'Aveugle pivot méta, immuabilité Souvenirs sauf RGPD)
- `20-ARCHITECTURE.md` — ✅ **CRÉÉ** (stack Vercel+Railway+Supabase+pgvector+Upstash+OpenRouter ~3-10€/mois V1, DB 8 tables sans auth/billing, flux turn détaillé 9 étapes, caps middleware sliding-window, cookie HTTPOnly 90j, monitoring SQL minimaliste, sécurité minimale, hors-V1 explicite)

### ✅ FAIT — Phase D : Rétention & Monétisation (complète)

- `18-RETENTION.md` — ✅ **CRÉÉ** (3 crochets hiérarchisés : Souvenirs nommés #1 / Chronique #2 / Monde qui change #3, métriques North Star Metric = completion × J+7, antifragilité du retour, dashboard Adem-only V1, signaux d'alerte rétention)
- `19-MONETIZATION.md` — ✅ **CRÉÉ** (~390 lignes — 3 tiers anonyme/gratuit/Premium, caps 30/150/5000, prix 7,99€/mois ou 69€/an, pivot "Premium = file prioritaire" queue jump Redis, **règle d'or coût IA**, Stripe Checkout + Customer Portal + webhook code, éthique anti-dark-patterns, projections économiques 3 scénarios, marge ~91%)
- `21-ROADMAP.md` — ✅ **CRÉÉ** (~370 lignes — V1 Foundation / V1.1 Profondeur (saturer Velkhar) / V2 Extension 3 options à arbitrer / V3+ horizons multi-univers/coop/mobile, **principe "saturer Velkhar avant multi-univers"**, critères Go/No-Go chiffrés, signaux Go V1.1/V2)
- `22-GLOSSARY.md` — ✅ **CRÉÉ** (~340 lignes alphabétique complet, catégorisation 🌍 Lore / ⚙️ Mécanique / 💼 Produit / 🤖 IA/Tech, désambiguïsations Souvenirs vs Souvenirs nommés / Velkhar vs Makhzen / Cendre vs Calcinés vs Cendreurs, annexe termes REJETÉS Mana/XP/niveau/Battle pass/Premium-only)
- `20-ARCHITECTURE.md` (compléments) — ✅ **ÉTENDU** §13 à §16 : table `accounts` + `email_logs` SQL, NextAuth magic links + flow rattachement anonyme→compte, Stripe Checkout + webhook complet, queue Redis prioritaire BullMQ (Premium priority:1 / gratuit+anon priority:5), notifications Resend (9 templates), cron purges M+5/M+6/M+10/M+12, RGPD complet, diagramme stack mis à jour, migrations DB

### ✅ FAIT — Phase E : PNJ & Réputation (scope run)

- `12-NPCS-RELATIONS.md` — ✅ **CRÉÉ** (réécriture archive 329 lignes → scope run V1, 3 types PNJ (Marqueurs ~8-10 hand-crafted / Récurrents templates / Figurants), fiche YAML minimale ~200 tokens, mémoire portée par système général N1/N2/N3 cf. 16-MEMORY, voix → 15-GAME-MASTER §1, mort irréversible intra-run + Souvenir candidat, confiance 3 paliers Méfiant/Neutre/Allié, inter-runs UNIQUEMENT via Souvenirs nommés sauf L'Aveugle canon immortel, banque V1 8 PNJ listés, hors-V1 explicite : compagnons/romances/graphe croyances/cohérence portrait visuel → V2+)
- `13-REPUTATION.md` — ✅ **CRÉÉ** (réécriture archive 281 lignes → scope run V1, 2 types V1 Faction 3 paliers + Confiance PNJ + optionnel Renommée locale, JAMAIS de score 0-100 en HUD, propagation simplifiée témoins directs intra-run, faveurs 3 poids 🪶/⚖️/⛓️ intra-run, sanctions table backend ~8-10 entrées, Némésis intra-run, inter-runs uniquement via Souvenirs nommés, hors-V1 explicite : romances/propagation 90j multi-régions/carnet UI/Némésis cross-run/score continental → V2+)

### Points à intégrer

- **L'Aveugle** → `07-CHARACTER-CREATION` + `17-RUN-CHRONICLE`
- **Souvenirs** (méta) → `19-MONETIZATION` + `14-META-WORLD`
- **Or in-game** → `11-INVENTORY-ECONOMY`
- **Session anonyme** → `20-ARCHITECTURE`
- **Donjons/artefacts** → `11-INVENTORY-ECONOMY` + `03-BESTIARY`

---

## PROCHAINE ÉTAPE

**Phase A — Cohérence magie unifiée : ✅ TERMINÉE** (28 juin)
→ Les 6 fichiers du noyau (01, 04, 05, 06, 08, 00) parlent désormais le même langage.

**Phase B — Gameplay : ✅ TERMINÉE** (28 juin)
→ Les 4 fichiers (09-ACTION-LOOP, 07-CHARACTER-CREATION, 10-COMBAT, 11-INVENTORY-ECONOMY) sont écrits et cohérents (piliers 1-7 vérifiés par grep).

**Phase C — Monde, IA & Architecture : ✅ TERMINÉE** (29 juin)
→ Les 5 fichiers (15-GAME-MASTER, 16-MEMORY, 17-RUN-CHRONICLE, 14-META-WORLD, 20-ARCHITECTURE) sont écrits dans l'ordre des dépendances. Les 8 décisions produit actées (free tier 100% V1, tier unique Premium 7,99€, caps 30/150/5000 par requêtes, Chronique = asset viral, 3 voix d'écriture, Souvenirs > Chronique > Monde, règle d'or coût IA → Phase D) sont cohérentes entre les fichiers.

**Phase D — Rétention & Monétisation : ✅ TERMINÉE** (30 juin)
→ Les 4 nouveaux fichiers (18-RETENTION, 19-MONETIZATION, 21-ROADMAP, 22-GLOSSARY) + les compléments §13-§16 de 20-ARCHITECTURE consolident produit + business + auth/billing.
→ Les **9 décisions monétisation V1** tranchées 2026-06-30 sont actées :

1. Modèle IA scènes : free tier pour tous (pas de différenciation Premium V1)
2. Sonnet 4.6 sur Chronique réservé V2+ si Premium ≥ 50 utilisateurs
3. Pivot stratégique : **Premium = file prioritaire** (queue jump Redis)
4. Illustration Chronique : FLUX schnell gratuit / FLUX dev Premium
5. Cap anonyme : 30 requêtes total puis mur création compte
6. Cap gratuit : 150 reqs/semaine glissante
7. Cap Premium : illimité avec hard cap silencieux 5000/sem anti-bot
8. Prix : 7,99€/mois OU 69€/an (-28%)
9. Sauvegarde : 6 mois gratuit / illimité Premium / 12 mois grâce post-désabo
   → **Règle d'or coût IA** formalisée : aucune décision design n'augmente coût IA/run de +10% sans hausse prix ou cap compensatoire.

**Phase E — PNJ & Réputation : ✅ TERMINÉE** (30 juin)
→ Les 2 fichiers (12-NPCS-RELATIONS, 13-REPUTATION) sont écrits au scope run V1 (réduction massive vs archive). Décisions clés Phase E actées :

1. **Scope run par défaut** — PNJ et réputation reset entre runs
2. **Souvenirs nommés = unique vecteur inter-runs** (pas de carnet de relations persistant, pas de score faction continentale)
3. **L'Aveugle = seul PNJ canon immortel** qui reconnaît toujours le joueur
4. **Banque V1 8 PNJ-Marqueurs** hand-crafted (Adem ~2h/PNJ)
5. **3 paliers narratifs** (Méfiant/Neutre/Allié), jamais de score 0-100 en HUD
6. **Table sanctions backend ~8-10 entrées** — IA habille, backend décide
7. **Hors-V1 explicite** : compagnons / romances / graphe croyances / propagation 90j / carnet UI / Némésis cross-run / score continental → V2+

**Greps de cohérence Phase D + E effectués** ✅ — termes (NSM, caps 30/150/5000, prix 7,99€/69€, Souvenirs nommés, 3 paliers, L'Aveugle) cohérents entre 12/13/14/15/16/17/18/19/20/21/22.

**Prochaine étape** : GDD V1 complet → bascule implémentation Phase 1B (cf. CLAUDE.md projet — Phase 1A landing terminée, prochaine = Session screen + Character Create depuis MEMORY.md).
