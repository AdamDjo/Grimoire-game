# 19 — Monétisation & économie

> **Fichier 19 / Phase D / Pilier #8 (règle d'or coût IA)**
> Consolide les **9 décisions monétisation** tranchées avec Adem le 2026-06-30. Définit le modèle économique V1, l'architecture des tiers, la règle d'or coût IA, l'auth/billing Stripe, et l'éthique anti-dark-patterns.
>
> ⚠️ **Source de vérité tier/caps** : ce fichier. Toute divergence ailleurs (Phase C compris) → ce fichier gagne.

---

## §0 — Principe directeur

**GRIMOIRE doit être rentable pour un solo dev à 50-200 abonnés Premium, sans compromettre l'éthique narrative.** Le payant achète **"plus de jeu"**, jamais **"un meilleur jeu"**. Égalité narrative absolue pour tous les joueurs (anonymes inclus).

**Trois règles cardinales** :

1. **Aucun pay-to-win, aucun cosmétique gadget** — la valeur c'est le jeu, point.
2. **Aucun gating narratif** — la Chronique reste gratuite pour tous (asset d'acquisition).
3. **Aucune dark pattern** — caps explicites, mur honnête, désabonnement en 1 clic, grâce de 12 mois après désabo.

---

## §1 — Les 3 tiers (architecture canonique)

| Tier        | Auth                        | Caps IA                                              | Sauvegarde                                                                                            | Avantage                                                                | Prix                            |
| ----------- | --------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| **Anonyme** | Cookie HTTPOnly 90j         | **30 requêtes total** (cycle de vie cookie)          | Client only (cookie chiffré ~4KB, max 3-4 Souvenirs provisoires) + Chronique upload serveur permanent | Essai sans friction                                                     | 0€                              |
| **Gratuit** | Email + magic link          | **150 requêtes / semaine glissante**                 | DB Supabase, purge ferme 6 mois inactivité (mail à 5 mois)                                            | Persistance + 20 Souvenirs max                                          | 0€                              |
| **Premium** | Email + magic link + Stripe | **Illimité** (hard cap silencieux 5000/sem anti-bot) | Permanent + 12 mois de grâce après désabonnement                                                      | File prioritaire + Souvenirs illimités + illustration Chronique premium | **7,99€/mois OU 69€/an (-28%)** |

### 1.1 — Justifications par décision

**Décision #1 : Cap anonyme = 30 requêtes total (cycle cookie 90j)**

- ~30 reqs = ~15-20 minutes de jeu = assez pour ressentir le hook narratif sans en faire un free-to-play
- Lié au cookie (pas IP) → friction faible pour évaluer
- **Pourquoi 30 et pas 50 ?** Adem a tranché : trop généreux = pas de conversion vers compte gratuit. 30 = teaser honnête.
- **Cycle 90j cookie** : si le cookie expire (3 mois sans visite), nouvelle session = nouveau quota. Acceptable car volume très faible.

**Décision #2 : Cap gratuit = 150 requêtes / semaine glissante**

- ~150 reqs = ~1 mini-run/semaine (un run complet = ~150-300 reqs)
- **Fenêtre glissante** (pas reset lundi minuit) → pas de "speedrun lundi soir", usage régulier encouragé
- Suffit pour entretenir l'engagement narratif sans grind possible
- **Pourquoi pas "2h de jeu" ?** Adem rejet explicite : trop long, encourage marathon, mal cappé techniquement.

**Décision #3 : Cap Premium = 5000 req/sem (silencieux, anti-bot)**

- Premium = "illimité ressenti" mais hard cap technique invisible
- 5000 reqs/sem = ~30 runs/sem complets — usage extrême normal jamais atteint
- Si atteint → erreur 429 silencieuse + mail Adem pour investiguer (bot ou usage pathologique)

**Décision #8 : Prix = 7,99€/mois OU 69€/an (-28%)**

- 7,99€/mois = prix d'un café chaque mois — psychologique acceptable
- 69€/an = -28% (vs 96€ si payé mensuel) → engagement année rentable pour les deux
- **Pourquoi pas 9,99€ ?** Trop proche du palier Netflix/Spotify, perception "trop cher" pour un solo dev. 7,99€ = positionnement indé assumé.
- **Pourquoi pas 4,99€ ?** Coûts fixes (Supabase + Vercel + Stripe + domaine) → marge insuffisante en dessous de 7€.

### 1.2 — Ce qui est IDENTIQUE pour tous les tiers

| Item                        | Pour tous                                                                         |
| --------------------------- | --------------------------------------------------------------------------------- |
| **Qualité écriture IA**     | Free tier OpenRouter pour TOUS — texte narratif identique anonyme/gratuit/Premium |
| **Texte Chronique**         | Identique pour tous (illustration seule diffère)                                  |
| **Lore Velkhar accessible** | Tout débloqué pareil par tous                                                     |
| **Vocations / peuples**     | Tous accessibles à tous                                                           |
| **Mécaniques jeu**          | Triptyque, dés, combat, artefacts — pareil                                        |

→ **Égalité narrative absolue.** Le payant achète du quota et du confort, pas du contenu privilégié.

### 1.3 — Ce qui DIFFÈRE entre les tiers

| Avantage                  | Anonyme             | Gratuit        | Premium                      |
| ------------------------- | ------------------- | -------------- | ---------------------------- |
| Cap requêtes              | 30 total            | 150/sem        | Illimité                     |
| Persistance serveur       | Non (cookie only)   | Oui (Supabase) | Oui (jamais purgé)           |
| File d'attente saturation | Standard            | Standard       | **Prioritaire (queue jump)** |
| Souvenirs nommés stockés  | 3-4 max provisoires | 20 max         | Illimité                     |
| Purge inactivité          | N/A (cookie 90j)    | 6 mois         | 12 mois grâce post-désabo    |
| Illustration Chronique    | FLUX schnell (free) | FLUX schnell   | FLUX dev (premium)           |
| Export PDF Chronique      | Non                 | Non            | Oui (V2+)                    |

---

## §2 — Le pivot stratégique : "Premium = file prioritaire" (Décision #3)

### 2.1 — Pourquoi pas un meilleur modèle IA pour Premium ?

Choix difficile tranché le 2026-06-30 après débat. **Premium n'aura PAS de modèle IA différent pour les scènes en V1**, malgré la marge disponible (~91% à 7,99€ vs ~56% si Sonnet 4.6 sur Premium).

**Les 3 raisons** :

1. **Casse l'égalité narrative** — promesse fondatrice du produit
2. **Dépendance coût IA dès J1** — risque si Anthropic augmente prix
3. **Brûle la carte V2** — si Sonnet déjà donné en V1, plus rien à vendre en V2

**Argument de vente honnête** : _"Premium = tu joues quand tu veux, sans file d'attente."_

### 2.2 — Implémentation file prioritaire

| Composant                     | Comportement                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| Queue Redis (Upstash)         | 2 niveaux : `priority:high` (Premium) / `priority:normal` (gratuit+anonyme)                      |
| Worker IA                     | Pop `priority:high` d'abord, fallback `priority:normal`                                          |
| Saturation cascade OpenRouter | Premium reste servi tant qu'AU MOINS 1 modèle répond — gratuit voit message d'attente            |
| UX Premium                    | "Le MJ réfléchit..." standard, jamais de queue visible                                           |
| UX gratuit                    | Si saturation : "GRIMOIRE est très populaire ce soir. Premium = pas d'attente." (CTA conversion) |

→ Détails techniques dans [20-ARCHITECTURE §6](20-ARCHITECTURE.md) (à compléter Phase D).

### 2.3 — Que se passe-t-il en V2+ ?

Voie ouverte pour ajouter un tier supérieur **sans casser V1** :

| V2+ option                   | Hypothèse                                               |
| ---------------------------- | ------------------------------------------------------- |
| Premium+ à 12,99€/mois       | Inclut "mode prose étendue" = Sonnet 4.6 sur les scènes |
| Premium garde 7,99€ inchangé | File prioritaire toujours offerte                       |
| Anonyme + gratuit inchangés  | Stabilité du modèle de base                             |

**Quand activer V2+ ?** Quand 300+ Premium actifs justifient la complexité opérationnelle d'un 4ᵉ tier.

---

## §3 — La règle d'or coût IA (Pilier #8)

### 3.1 — Énoncé

> **Aucune décision design ne peut augmenter le coût IA moyen par run de plus de +10% sans hausse de prix compensatoire OU cap utilisateur compensatoire.**

### 3.2 — Pourquoi cette règle existe

Le danger principal du solo dev IA = **dérive de coûts silencieuse**. Un changement de prompt qui ajoute 300 tokens × 100 000 requêtes/mois = facture qui explose sans le voir.

Cette règle force à **mesurer avant d'implémenter** chaque change qui touche au prompt, à la mémoire, ou au modèle.

### 3.3 — Cas concrets d'application

| Proposition design                                                       | Évaluation règle d'or                                                                             | Décision                                             |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| "Et si on injectait 10 Souvenirs au lieu de 5 ?"                         | +500 tokens/req = +6% coût IA                                                                     | ✅ Sous le seuil 10% — OK                            |
| "Et si on rappelait TOUT le run précédent en contexte ?"                 | +3000 tokens/req = +35% coût                                                                      | ❌ Au-dessus — refus, ou hausse prix Premium, ou cap |
| "Et si on faisait 3 appels IA par tour (narration + choix + ambiance) ?" | +200% coût                                                                                        | ❌ Refus net                                         |
| "Et si on basculait sur Sonnet 4.6 pour tous les pivots ?"               | Coût marginal $0.0008 × 10% des appels × Premium users → ~$0.50/Premium/mois = ~6% revenu Premium | ✅ Acceptable si Premium > 100, sinon report         |

### 3.4 — Process de validation

**Avant tout merge qui touche prompt / mémoire / modèle** :

1. Mesurer le delta tokens entrée/sortie via `request_logs`
2. Calculer le delta coût/run (incluant projection si bascule modèle payant)
3. Si > +10% → décision explicite : abandon, hausse prix, ou cap compensatoire
4. Documenter la décision dans le commit message

### 3.5 — Métriques de surveillance

Cf. [20-ARCHITECTURE §7](20-ARCHITECTURE.md). À tracker hebdo :

| Métrique                          | Cible V1                                 | Alerte si                            |
| --------------------------------- | ---------------------------------------- | ------------------------------------ |
| Tokens moyens / requête           | ~8 000 entrée + ~330 sortie              | > 9 000 entrée (drift prompt)        |
| Coût IA / run (V1 = 0€ free tier) | 0€                                       | > 0€ inattendu (bascule payante)     |
| Coût IA / Premium / mois          | < $1 V1 (Stripe fees inclus → marge 91%) | > $2 (réévaluer pricing)             |
| % runs dépassant cap tokens 8 000 | < 5%                                     | > 10% (compression mémoire à revoir) |

---

## §4 — Le funnel de conversion (anonyme → gratuit → Premium)

### 4.1 — Anonyme → Gratuit

**Trigger** : épuisement des 30 requêtes cookie OU fin de premier run réussi (Chronique générée).

**Friction visée** : minimale.

- Email + magic link uniquement (pas de mot de passe)
- 1 champ : email
- Conservation transparente : _"Ton aventure et ta Chronique te suivent automatiquement"_
- Si Chronique générée en anonyme : déjà sur serveur, juste rattachée au compte créé

**Cible conversion** : > 40% des anonymes qui atteignent 30 reqs créent un compte (volonté de continuer leur run).

### 4.2 — Gratuit → Premium

**Triggers possibles** :

- Épuisement cap 150 reqs/semaine
- Vouloir éviter file d'attente en cas de saturation
- Vouloir préserver Souvenirs > 20 (cap atteint)
- Approche de purge 6 mois (mail à M+5)

**Friction visée** : faible mais nette.

- Page upgrade claire : 7,99€/mois OU 69€/an (le -28% mis en avant)
- Liste des 4 avantages (file prioritaire, illimité, Souvenirs illimités, illustration Chronique premium)
- **Honnêteté** : _"Tu peux continuer en gratuit, tes données sont préservées 6 mois. Premium = jouer plus + sans attente."_

**Cible conversion** : **3-5%** des comptes gratuits actifs (standard SaaS indé).

### 4.3 — Métriques funnel

| Étape                 | Métrique                         | Cible                    |
| --------------------- | -------------------------------- | ------------------------ |
| Atterrissage landing  | Visiteurs uniques / mois         | (à définir M+3)          |
| Lancement run anonyme | % visiteurs qui démarrent        | > 30%                    |
| Run anonyme terminé   | % qui atteignent fin             | > 25%                    |
| Anonyme → Gratuit     | Conversion compte créé           | > 40% des anonymes finis |
| Gratuit actif         | % qui font ≥ 1 run/mois          | > 60%                    |
| Gratuit → Premium     | Conversion abonnement            | **3-5%**                 |
| Premium rétention     | % renouvelés à M+1               | > 85%                    |
| Premium désabo grâce  | % qui se réabonnent dans 12 mois | > 15%                    |

---

## §5 — Le système Souvenirs (monnaie méta)

### 5.1 — Rappel décisions L9-L10 (cf. [\_STATUS.md](_STATUS.md))

- **Souvenirs** = monnaie méta, distincte de l'or in-game
- Source : 1 gratuit/run + bonus selon performance (max ~3-4/run)
- Échange : chez L'Aveugle uniquement contre du lore généré
- ⚠️ **Ne pas confondre** avec **Souvenirs nommés** (objets narratifs permanents — cf. [14-META-WORLD §2](14-META-WORLD.md))

### 5.2 — Souvenirs vs Souvenirs nommés (table de désambiguïsation)

| Item         | Souvenirs (monnaie)               | Souvenirs nommés (narratif)          |
| ------------ | --------------------------------- | ------------------------------------ |
| Nature       | Currency méta                     | Objet narratif permanent             |
| Source       | 1/run gratuit + bonus             | 3 max/run (déclencheurs émotionnels) |
| Usage        | Échange contre lore L'Aveugle     | Persistence saga + rappel L'Aveugle  |
| Cap stockage | Pas de cap (s'épuisent par usage) | 20 gratuit / illimité Premium        |
| Purge        | N/A (s'utilisent)                 | 6 mois inactivité gratuit            |
| Persistance  | Tier-dépendant                    | Tier-dépendant                       |

→ **À clarifier en glossaire** ([22-GLOSSARY](22-GLOSSARY.md)).

### 5.3 — Économie des Souvenirs (monnaie)

| Action                          | Coût Souvenirs |
| ------------------------------- | -------------- |
| Question lore basique L'Aveugle | 1              |
| Info sur PNJ majeur             | 2              |
| Info sur faction / lieu sacré   | 3              |
| Indice quête / artefact         | 4-5            |
| Révélation secrète majeure      | 8-10           |

L'Aveugle peut **refuser** de vendre certaines infos (lore canon strict). Les Souvenirs ne sont pas une clé universelle.

---

## §6 — L'or in-game (monnaie courte durée)

### 6.1 — Rappel décision L10

- 🪙 **L'or** = monnaie classique in-run (achat/revente équipement)
- **Perdue à la mort** — pas de transmission héritage
- Détails dans [11-INVENTORY-ECONOMY §2](11-INVENTORY-ECONOMY.md)

### 6.2 — Pas de monétisation in-game

**Aucune** mécanique de "buy gold with real money" ou équivalent. C'est non négociable.

Le seul lien argent réel ↔ jeu = abonnement Premium qui débloque cap requêtes + confort.

---

## §7 — Stripe, auth, billing (architecture)

### 7.1 — Stack billing V1

| Composant                  | Outil                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------- |
| **Paiement**               | Stripe Checkout (hosted page)                                                       |
| **Subscription mgmt**      | Stripe Customer Portal (hosted)                                                     |
| **Auth**                   | NextAuth.js (Next.js 15 frontend) — magic links email uniquement                    |
| **Sync tier**              | Stripe webhook → endpoint backend Express → update `accounts.tier` + `players.tier` |
| **Emails transactionnels** | Resend (free tier 3000 emails/mois) ou SES si dépassement                           |

### 7.2 — Pourquoi Stripe Checkout/Portal hosted ?

- **Sécurité PCI** : Stripe gère, on n'a aucune carte qui touche notre backend
- **Tax handling** : Stripe Tax (auto TVA UE) → conformité sans dev
- **Customer Portal** : self-service désabo, change plan, mise à jour CB → **0 dev**
- **Webhooks** : événements `customer.subscription.created/updated/deleted` → on sync

### 7.3 — Le webhook Stripe (signature minimale)

```typescript
// apps/backend/src/routes/stripe.webhook.ts
async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const accountId = sub.metadata.account_id;
      const tier = sub.status === "active" ? "premium" : "free";
      const graceUntil =
        sub.status === "canceled" ? addMonths(new Date(), 12) : null;
      await db.accounts.update(accountId, { tier, grace_until: graceUntil });
      await db.players.updateByAccount(accountId, { tier });
      break;
    }
    case "customer.subscription.deleted": {
      // Bascule en gratuit immédiat mais grâce 12 mois sur données
      const sub = event.data.object as Stripe.Subscription;
      const accountId = sub.metadata.account_id;
      await db.accounts.update(accountId, {
        tier: "free",
        grace_until: addMonths(new Date(), 12),
      });
      await db.players.updateByAccount(accountId, { tier: "free" });
      await sendEmail(accountId, "subscription_canceled_grace");
      break;
    }
  }
}
```

→ Code définitif dans [20-ARCHITECTURE](20-ARCHITECTURE.md) (complément Phase D).

### 7.4 — Flow signup → premium (parcours utilisateur)

```
1. Visiteur lance run anonyme (cookie HTTPOnly grimoire_session)
   → 30 reqs jouées, cap atteint
2. Modal : "Crée un compte pour continuer — gratuit"
   → Email magic link → compte créé
   → Cookie anonyme rattaché à account_id (datas conservées)
   → Joueur reprend, cap passe à 150/sem
3. (Plus tard) Cap 150/sem atteint OU file d'attente saturation
   → Modal upgrade : "Premium 7,99€/mois ou 69€/an"
   → Stripe Checkout → paiement → webhook fires → account.tier = premium
   → Joueur reprend immédiatement (illimité + file prioritaire)
4. Si désabonne (Stripe Portal) :
   → Webhook canceled → grace_until = now + 12 mois
   → Mail "Tes données Premium préservées 12 mois — réabonne-toi quand tu veux"
   → Si pas réabo à M+12 → grâce expire → données suivent règles gratuit (purge 6 mois standard)
```

---

## §8 — L'éthique anti-dark-patterns (règle d'or éthique)

### 8.1 — Ce qu'on FAIT

| Pratique                     | Mise en œuvre                                                             |
| ---------------------------- | ------------------------------------------------------------------------- |
| Désabonnement en 1 clic      | Stripe Customer Portal — pas de "appelez notre service"                   |
| Caps explicites en clair     | UI affiche le compteur restant (pas Premium qui voit pas)                 |
| Mail avant purge             | M+5 gratuit, M+10 Premium grâce                                           |
| Grâce généreuse Premium      | 12 mois post-désabo (la norme SaaS = 30 jours)                            |
| Tarif clair sans subterfuge  | 7,99€/mois OU 69€/an, point. Pas de "premier mois gratuit puis surprise". |
| Refund si insatisfait        | 7 jours satisfaction garantie V1 (à confirmer terms)                      |
| Chronique gratuite pour tous | Asset narratif jamais gaté                                                |

### 8.2 — Ce qu'on NE FAIT JAMAIS

| Dark pattern                                    | Pourquoi on refuse                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| Trial Premium qui se renouvelle automatiquement | Casse confiance — Stripe le permet, on choisit non                        |
| Cap caché en cours de run ("tu peux plus !")    | Frustration max — toujours afficher compteur                              |
| Suppression données sans préavis                | Mail systématique avant toute purge                                       |
| Upsell pendant le jeu (modal qui pop)           | Casse l'immersion narrative — upsell uniquement aux paliers (cap atteint) |
| Tier "Premium Ultra" pay-to-win                 | Non négociable                                                            |
| FOMO ("réabonne-toi dans 24h !")                | Aucune urgence artificielle                                               |
| Cookie tracking publicitaire                    | Aucun ad tracker tiers — analytics privacy-friendly (Plausible si besoin) |

### 8.3 — Test décisionnel

Avant toute feature monétisation, se poser : _"Est-ce que je serais à l'aise si un journaliste tech écrivait un article sur cette pratique ?"_. Si non → refus.

---

## §9 — Projections économiques V1 (réalisme solo dev)

### 9.1 — Hypothèses de base

- **Coût hébergement V1** : 3-10€/mois (Vercel free + Railway $5 + Supabase free + Upstash free + Stripe fees ~3%)
- **Coût IA V1** : ~0€ (OpenRouter free tier) — bascule payante seulement si volume justifie V2+
- **Revenu Premium** : 7,99€/mois × N abonnés actifs

### 9.2 — Scénarios à 6 mois

| Scénario   | Visiteurs/mois | Comptes créés | Premium actifs | MRR brut | Coûts | **Marge mensuelle** |
| ---------- | -------------- | ------------- | -------------- | -------- | ----- | ------------------- |
| Pessimiste | 1 000          | 100           | 3 (3%)         | 24€      | 10€   | **+14€**            |
| Réaliste   | 5 000          | 500           | 15 (3%)        | 120€     | 15€   | **+105€**           |
| Optimiste  | 20 000         | 2 000         | 100 (5%)       | 800€     | 50€   | **+750€**           |

### 9.3 — Break-even

Avec coûts ~10€/mois V1, **break-even à ~2 Premium actifs**. Très tôt — possible dès le 1ᵉʳ mois de lancement public si Chronique virale fonctionne.

### 9.4 — Cible 12 mois

- **50-100 Premium actifs** = 400-800€/mois MRR
- Permet à Adem de **payer son hébergement + 1 modèle IA payant Chronique V2** + ~200€/mois de bonus
- **Pas un revenu de subsistance** — toujours indé solo dev, pas full-time

### 9.5 — Quand passer en full-time ?

Seuil suggéré : **MRR > 2 500€/mois stable 3 mois** = ~310 Premium actifs. Hors scope V1.

---

## §10 — Risques économiques & garde-fous

| Risque                                   | Probabilité                    | Impact                                | Garde-fou                                                                                     |
| ---------------------------------------- | ------------------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------- |
| **OpenRouter free tier disparaît**       | Moyenne (déjà arrivé ailleurs) | Catastrophique sans plan B            | Cascade à 4 niveaux + monitoring quotas + bascule DeepSeek payant ($0.27/1M = ~$0.25/Premium) |
| **Stripe augmente fees > 3.5%**          | Faible                         | Marge -5%                             | Reste rentable ; envisager Lemon Squeezy comme alternative V2                                 |
| **Coûts Supabase explosent** (>500MB DB) | Moyenne à 1000+ joueurs actifs | $25/mois palier suivant               | Provisionnable dès 100 Premium                                                                |
| **Conversion < 1%**                      | Moyenne                        | Pas rentable au-delà de l'hébergement | Revue UX page Premium + tests A/B prix                                                        |
| **Premium désabos massifs**              | Faible                         | Perte MRR                             | 12 mois grâce → réabo facile + mail M+10                                                      |
| **Bot abuse caps anonymes**              | Élevée                         | Coûts IA inutiles                     | Rate limit IP + cookie obligatoire + signature device V2                                      |

---

## §11 — Hors V1 (Phase ultérieure)

| Feature                               | Phase               | Pourquoi pas V1                           |
| ------------------------------------- | ------------------- | ----------------------------------------- |
| Premium+ à 12,99€ (Sonnet 4.6 scènes) | V2+ si 300+ Premium | Carte à garder, validation marché d'abord |
| Pack lifetime 199€                    | V2+                 | Trop d'engagement client sans recul       |
| Gift subscription                     | V2                  | Complexifie le modèle, faible demande V1  |
| Affiliation / referral                | V2                  | Marketing tactique, pas core produit      |
| Multi-univers Premium-only            | V2+                 | Velkhar à saturer d'abord                 |
| Export PDF Chronique Premium          | V2                  | Polish, pas core                          |
| Mode coop Premium                     | V3                  | Complexité dev énorme                     |

---

## §12 — Synthèse économique

```
┌────────────────────────────────────────────────────────────────┐
│                    LES 3 TIERS V1                              │
├──────────────┬───────────┬──────────┬──────────────────────────┤
│ ANONYME      │  GRATUIT  │ PREMIUM  │     EFFET                │
├──────────────┼───────────┼──────────┼──────────────────────────┤
│ 30 req total │ 150/sem   │ Illimité │ Cap progressif honnête   │
│ Cookie 90j   │ DB 6 mois │ +12 grâce│ Sécurité données + grâce │
│ FLUX schnell │ Identique │ FLUX dev │ Polish illustration only │
│ Texte same   │ Texte same│ Texte same│ ÉGALITÉ NARRATIVE       │
│ Queue normal │ Queue norm│ Queue HI │ Confort Premium réel     │
│ 0€           │ 0€        │ 7,99€/mo │ Indé sustainable         │
│              │           │ 69€/an   │ Engagement annuel -28%   │
└──────────────┴───────────┴──────────┴──────────────────────────┘
                            │
                            ↓
            ┌─────────────────────────────────┐
            │  RÈGLE D'OR COÛT IA             │
            │  Aucune décision design ne hausse│
            │  coût IA / run de > +10% sans   │
            │  hausse prix ou cap compensatoire│
            └─────────────────────────────────┘
                            │
                            ↓
            ┌─────────────────────────────────┐
            │  ÉTHIQUE ANTI-DARK-PATTERNS     │
            │  Désabo 1 clic / mails purge    │
            │  Caps explicites / grâce 12 mois│
            │  Chronique gratuite pour TOUS   │
            └─────────────────────────────────┘
                            │
                            ↓
            ┌─────────────────────────────────┐
            │  PROJECTIONS V1                 │
            │  Break-even = 2 Premium         │
            │  Cible 12 mois = 50-100 Premium │
            │  = 400-800€/mois MRR            │
            └─────────────────────────────────┘
```

---

## Références croisées

- → [01-PILLARS §5+§8](01-PILLARS.md) — Pilier Héritage + North Star
- → [11-INVENTORY-ECONOMY](11-INVENTORY-ECONOMY.md) — 2 monnaies (or in-game + Souvenirs)
- → [14-META-WORLD §2](14-META-WORLD.md) — Souvenirs nommés (objets narratifs, à distinguer de la monnaie)
- → [16-MEMORY §8](16-MEMORY.md) — Mémoire par tier (anonyme/gratuit/premium)
- → [17-RUN-CHRONICLE §1.2+§4](17-RUN-CHRONICLE.md) — Chronique = gratuite pour tous + illustration Premium
- → [18-RETENTION](18-RETENTION.md) — Métriques + funnel conversion
- → [20-ARCHITECTURE](20-ARCHITECTURE.md) — Caps middleware + Stripe webhook + queue prioritaire (à compléter Phase D)
- → [22-GLOSSARY](22-GLOSSARY.md) — Désambiguïsation Souvenirs / Souvenirs nommés
