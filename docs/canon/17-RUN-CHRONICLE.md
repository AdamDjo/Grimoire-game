# 17 — La Chronique de fin de run

> **Fichier 17 / Phase C / Pilier #5 (asset d'acquisition viral), Pilier #7 (crochet de rétention #2)**
>
> Liens : [09-ACTION-LOOP](09-ACTION-LOOP.md) · [15-GAME-MASTER](15-GAME-MASTER.md) · [16-MEMORY](16-MEMORY.md) · [14-META-WORLD](14-META-WORLD.md) · [20-ARCHITECTURE](20-ARCHITECTURE.md)

---

## §0 — Principe

À la fin de chaque run — qu'il se termine par la mort, par un choix à l'auberge, ou par un abandon assumé — l'IA génère une **Chronique** : un récit littéraire de 800-1200 mots qui transforme la partie vécue en histoire.

La Chronique a **deux fonctions distinctes mais convergentes** :

1. **Récompense émotionnelle pour le joueur** : son aventure devient un objet — un texte qu'il peut relire, partager, garder. La mort en roguelike n'est plus une perte sèche, c'est une page écrite.

2. **Asset d'acquisition gratuit pour GRIMOIRE** : URL publique, OG image générée, partageable sur X / Bluesky / Discord. **Chaque Chronique partagée est une pub gratuite.** C'est le moteur viral du jeu — pas une fonctionnalité bonus, **le canal d'acquisition principal V1**.

**Règle absolue** : la Chronique reste **gratuite pour tous**, anonymes inclus. Aucun gating, jamais. Tout joueur qui termine un run obtient sa Chronique partageable, point.

---

## §1 — Génération

### Trigger

La génération de Chronique se déclenche dans 3 cas (cf. [09-ACTION-LOOP §7](09-ACTION-LOOP.md)) :

| Cas                          | Trigger                                                                           | Tone                                             |
| ---------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Mort**                     | PV tombent à 0 ou condition `runs.status = 'dead'`                                | Tragique, épique selon contexte                  |
| **Choix de fin à l'auberge** | Joueur clique _"Ton aventure se termine ici"_ face à L'Aveugle                    | Sereine, contemplative                           |
| **Abandon mi-chemin**        | Inactivité > 30 jours sur un run actif, ou clic explicite _"Abandonner ce perso"_ | Courte (~400 mots), titre _"Un Voyage Inachevé"_ |

### Input (ce que l'IA reçoit)

- Tous les **résumés intra-run** (niveau N2 mémoire, cf. [16-MEMORY §2](16-MEMORY.md))
- Tous les **Souvenirs nommés** générés pendant le run (cf. [14-META-WORLD §2](14-META-WORLD.md))
- Tous les **`key_facts_pinned`** (morts PNJ, artefacts obtenus, quêtes activées)
- Identité perso : nom, vocation, peuple, stats finales
- Cause de fin : mort (où, comment), choix à l'auberge, abandon
- Lieux visités, PNJ rencontrés majeurs, faction marquante

### Modèle utilisé

| Tier joueur    | Modèle V1                                | Modèle V2+                                            |
| -------------- | ---------------------------------------- | ----------------------------------------------------- |
| Anonyme        | meilleur free dispo (cascade OpenRouter) | idem V1                                               |
| Compte gratuit | meilleur free dispo (cascade OpenRouter) | idem V1                                               |
| Premium        | meilleur free dispo (cascade OpenRouter) | **Claude Sonnet 4.6** (qualité littéraire supérieure) |

**Pourquoi Sonnet 4.6 pour Premium V2+ ?** Parce que la Chronique est le moment où l'écart se ressent le plus. Un Premium qui partage une Chronique magnifique → meilleure acquisition. ROI direct. Coût : ~$0.03/Chronique × ~50 Premium actifs/mois × 4 runs/mois = ~$6/mois total — soutenable.

### Output (format strict, validé Zod)

```json
{
  "title": "string (max 80 chars)",
  "body_markdown": "string (800-1200 mots, markdown léger : ## titres section interdits, italique autorisé)",
  "mood": "tragic | epic | melancholic | serene | absurd",
  "key_moments": [{ "label": "string (5-8 mots)", "scene_ref": "scene_id" }],
  "illustration_prompt": "string (max 200 tokens, descriptif visuel pour modèle d'image)",
  "tagline": "string (15-30 chars, pour OG image)"
}
```

---

## §2 — Le titre

Généré par l'IA en **style chapitre de roman**. Évocateur, jamais générique, ancré dans le récit du run.

### Anti-patterns interdits

- ❌ _"La fin de Kael"_ (trop direct)
- ❌ _"Mort dans le désert"_ (générique)
- ❌ _"Run #47"_ (méta, brise l'immersion)
- ❌ _"GAME OVER"_ (jeu vidéo, pas roman)

### Patterns recommandés

- ✅ _"Les Cendres de Tissan"_ (lieu + symbole)
- ✅ _"Celui-qui-portait-le-Sel"_ (épithète épique)
- ✅ _"Le Dernier Pas dans la Salure"_ (action poétique)
- ✅ _"La Promesse Brisée de Vane"_ (PNJ + arc)
- ✅ _"Une Lampe dans le Vent"_ (image emblématique)

Le prompt inclut **10 exemples canoniques** dans le système (versionné `prompts/chronicle-v1.txt`).

---

## §3 — Le corps

### Structure (invisible dans le texte)

3 actes implicites — l'IA respecte la structure mais ne la **nomme jamais**. Pas de `## Acte I`, pas de `## Climax`. Le texte coule comme un récit court.

| Acte                   | Tokens cibles | Contenu                                                                            |
| ---------------------- | ------------- | ---------------------------------------------------------------------------------- |
| **I — Ouverture**      | ~200-300      | Le perso, son origine, sa quête initiale, le ton de Velkhar                        |
| **II — Complications** | ~400-600      | Les rencontres marquantes, les Souvenirs nommés, les choix difficiles, l'évolution |
| **III — Climax & fin** | ~200-300      | Le moment de bascule, la mort/le départ, l'écho qui reste                          |

### Voix

**Narrateur uniquement** (cf. [15-GAME-MASTER §1.2](15-GAME-MASTER.md)) — sec, sensoriel, présent, à la **3ᵉ personne**. Jamais en "JE", jamais L'Aveugle qui parle.

### Tone selon `mood`

- **tragic** : froideur, beauté du désastre, pas de larmes faciles
- **epic** : souffle, gravité, héritage transmis
- **melancholic** : douceur de la fin, regrets sans amertume
- **serene** : paix, retour, repos mérité
- **absurd** : humour noir assumé — la mort ridicule existe en roguelike, on la respecte

### Éléments à mentionner obligatoirement

- Nom du perso (en entier, plusieurs fois)
- Vocation (au moins 1 mention narrative)
- Peuple (au moins 1 ancrage culturel)
- 2-3 Souvenirs nommés du run (intégrés au récit, pas listés)
- 1-2 PNJ marquants (par leur nom)
- L'artefact si présent (avec son nom)
- La cause de fin (mort, départ, abandon — décrite, jamais énoncée bêtement)

### Anti-patterns interdits

- ❌ Résumé "rapport de partie" (_"Le joueur a tué X et trouvé Y"_)
- ❌ Stats numériques (_"avec 14 SANG et 8 SOUFFLE..."_)
- ❌ Emojis (réservés UI : 🩸💨🔥🪙📖)
- ❌ Méta-commentaire (_"En 3 actes, le joueur..."_)
- ❌ Adresse au lecteur (_"Imaginez..."_) — récit fermé

### Exemple canonique (200 mots, juste un extrait, pour calibrer le ton)

> ## Les Cendres de Tissan
>
> Kael était né dans le sel. Sahélin de naissance, Marcheur-du-Sel de vocation, il avait porté la lampe à huile depuis les dunes du sud jusqu'aux portes de Tissan sans jamais croire qu'il en franchirait l'enceinte. C'est pourtant ce qu'il fit, un soir de vent rouge.
>
> Il y rencontra Vane. Elle parlait peu, mais ses silences valaient des serments. Elle l'aida à fuir les Rouilleurs — et lui, en retour, lui jura quelque chose qu'il ne tint pas. _La nuit où il l'épargna sur le seuil de la lame_, il n'imaginait pas qu'elle reviendrait pour le voir mourir.
>
> Le désert, plus tard, ne lui pardonna rien. La soif vint d'abord, puis la fièvre. L'artefact qu'il portait — la Lampe Brûlée des Cendreurs — pulsait faiblement contre sa hanche, mais il ne sut pas l'éveiller. Il s'allongea dans le sable, regarda les étoiles, et pensa qu'il aurait dû payer le thé de L'Aveugle, la dernière fois.
>
> Le vent garda son nom une nuit. Pas plus.

---

## §4 — L'illustration

### Génération V1 (gratuit)

- IA principale génère `illustration_prompt` dans le JSON output
- Prompt envoyé à **Pollinations.ai** ou **FLUX schnell free** via API gratuite
- Style imposé en suffixe du prompt :
  > _"ink wash painting, desert tones, ochre and ash palette, mystical atmosphere, Velkhar landscape, no text, no UI"_
- Image PNG 1024×1024 stockée dans Supabase Storage
- Si génération échoue → image fallback générique (1 par `mood`, 5 fallbacks pré-générés par Adem)

### OG Image (1200×630, pour partage social)

- Générée **côté frontend** au build de la page Chronique
- Composée : illustration (à droite, 50% largeur) + titre Cinzel + tagline + logo GRIMOIRE
- Format PNG, stockée Supabase Storage
- Disponible aux URLs Open Graph standards

### Aucun usage d'IA payante pour l'image V1

- Pollinations : gratuit, qualité acceptable
- FLUX schnell free tier : meilleure qualité si dispo
- En V2+ Premium → option Stable Diffusion XL ou DALL-E 3 payante envisageable, mais **pas obligatoire**

---

## §5 — La page publique Chronique

### URL

```
grimoire.game/chronique/{slug}
```

Le `slug` est un **hash court non-énumérable** (8-10 caractères, base62) :

- Format : `K3p2X9aBcD`
- **Pas séquentiel** (évite scraping)
- **Pas devinable** (rate-limiting + obscurité = anti-abus)
- Unique par Chronique

### Layout

```
┌─────────────────────────────────────────────────────────┐
│   GRIMOIRE — Of Ash and Salt                            │  ← nav minimaliste
├─────────────────────────────────────────────────────────┤
│                                                         │
│   [ ILLUSTRATION pleine largeur, 1200×600 ]             │
│                                                         │
│             ## Les Cendres de Tissan                    │  ← titre Cinzel
│                                                         │
│             Kael — Marcheur-du-Sel                      │  ← sous-titre EB Garamond
│                                                         │
│   ─── (séparateur ornement désertique) ───              │
│                                                         │
│   Kael était né dans le sel...                          │  ← corps EB Garamond
│   [800-1200 mots]                                       │
│   ...Le vent garda son nom une nuit. Pas plus.          │
│                                                         │
│   ─── (séparateur) ───                                  │
│                                                         │
│   Signature : Joué par {@signature_or_anonyme}          │  ← optionnel
│   {date_de_fin}                                         │
│                                                         │
│   ┌───────────────────────────────────────────────┐    │
│   │  Commencer ton aventure à Velkhar             │    │  ← CTA gros
│   └───────────────────────────────────────────────┘    │
│                                                         │
│   [Partager X]  [Partager Bluesky]  [Copier le lien]   │
│   [Télécharger l'image]                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Métas HTML

```html
<title>Les Cendres de Tissan — Chronique GRIMOIRE</title>
<meta property="og:title" content="Les Cendres de Tissan" />
<meta
  property="og:description"
  content="L'aventure de Kael, Marcheur-du-Sel, à Velkhar."
/>
<meta property="og:image" content="https://grimoire.game/og/{slug}.png" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
```

### Signature (optionnelle)

- Anonyme par défaut → affiché _"Joué par un voyageur anonyme"_
- Si compte → joueur peut activer une signature dans son profil (pseudo court, max 20 chars)
- Si signature activée → affiché _"Joué par {pseudo}"_
- Aucune obligation, aucun gating

### Permanence

- **Jamais supprimée automatiquement** (même compte gratuit purgé après 6 mois → la Chronique survit)
- Sauf **demande RGPD explicite** du joueur (bouton dans le profil)
- Sauf **modération** (signalement public + revue Adem — cf. §10)

---

## §6 — Le funnel viral

### Flow joueur → audience

```
1. Joueur termine son run
2. Écran transition "Ton aventure prend fin..." (5 sec, animation discrète)
3. Apparition de la Chronique générée (lecture inline + bouton "Voir en plein écran")
4. Boutons sous la Chronique :
   - [Copier le lien]
   - [Partager X/Twitter]  (intent URL pré-rempli avec titre + lien)
   - [Partager Bluesky]   (idem)
   - [Télécharger l'image OG]
5. Si anonyme → CTA discret "Crée ton compte pour garder ta Chronique en galerie"
6. Toujours : CTA "Commencer un nouveau perso" (le hook roguelike)
```

### Boutons sans gating

- **Aucune connexion requise pour partager**
- **Aucun watermark "Free" / "Premium"** — la Chronique est universelle
- Le **CTA "Crée ton compte"** est un nudge, pas un mur

### Métriques à tracker (cf. [20-ARCHITECTURE §7](20-ARCHITECTURE.md))

- `chronicles.view_count` : compteur vues uniques par IP/jour
- `chronicles.share_count` : compteur clics partage par bouton
- **Conversion view → essai gratuit** : trackée via UTM sur le CTA "Commencer ton aventure"
- **Conversion view → compte créé** : trackée via flow auth (Phase D)
- **Top 10 Chroniques par vues** : dashboard Adem (Supabase requête SQL simple)

### Pas de "vote / like"

- Pas de système d'upvote (apporterait complexité + risque modération + dérive Reddit)
- Pas de classement public
- La viralité passe par le **partage organique**, pas par la gamification interne

---

## §7 — Cas spéciaux

### Mort héroïque

- Trigger : mort en combat contre boss, mort en protégeant un PNJ aimé, mort en accomplissant une quête majeure
- `mood: "epic"` ou `"tragic"`
- Chronique amplifie : le sacrifice est célébré, l'héritage souligné
- Souvenir transmis (cf. [14-META-WORLD §3](14-META-WORLD.md))

### Mort ridicule

- Trigger : mort par soif, mort par chute idiote, mort par dialogue raté avec une chèvre
- `mood: "absurd"`
- **Le prompt impose de garder l'humour** — pas d'euphémisation. C'est l'esprit roguelike. La mort ridicule est aussi une histoire.
- Exemple titre canonique : _"Le Voyageur qui Confondit la Soif et le Sel"_

### Run abandonné mi-chemin

- Trigger : clic explicite "Abandonner" OU inactivité > 30 jours sur run actif
- Chronique **courte** (~400 mots)
- Titre type : _"Un Voyage Inachevé"_, _"La Route qui Restait"_
- Tone mélancolique, sans jugement
- L'objet existe quand même → le joueur peut le partager

### Run très court (< 5 tours)

- Pas de Chronique générée (pas assez de matière narrative)
- Écran : _"Ton aventure fut brève. Reviens à l'Auberge."_
- Pas pénalisant — c'est un test rapide, l'IA ne s'épuise pas dessus

### Premier run d'un joueur

- Pas de mention "ton 1er run" ou "ton 47ᵉ run" dans la Chronique elle-même
- **Méta caché** côté joueur uniquement (galerie compte)
- La Chronique reste universelle, lisible par n'importe qui

---

## §8 — L'héritage post-Chronique

Lien direct avec [14-META-WORLD §3](14-META-WORLD.md) et [07-CHARACTER-CREATION §7](07-CHARACTER-CREATION.md) :

Si le perso meurt :

- **1 artefact** est transmis au prochain perso (s'il en possédait)
- **1 Souvenir nommé** rejoint la mémoire inter-runs du joueur
- L'Aveugle au run N+1 **mentionne l'ancien perso** dans sa réaction à la création (_"Tu portes l'ombre de Kael. Le sable se souvient."_)

Si le perso termine par choix à l'auberge :

- Pas d'héritage matériel (le perso part vivant, garde ses biens)
- Mais le **Souvenir final** rejoint la galerie du joueur
- L'Aveugle se souviendra du perso "qui est parti vivant" — référence narrative possible

---

## §9 — Le coût

### Par Chronique

| Élément                                                     | Tokens / Coût              |
| ----------------------------------------------------------- | -------------------------- |
| Prompt système Chronique                                    | ~1 500 tokens              |
| Contexte (résumés N2 + Souvenirs + faits pinned + identité) | ~3 000-4 000 tokens        |
| Sortie narrative (800-1200 mots ≈ 1 200-1 800 tokens)       | ~1 500 tokens              |
| Génération illustration (Pollinations free)                 | 0€                         |
| Génération OG image (frontend Canvas)                       | 0€                         |
| **Total V1 free tier**                                      | **~6 500 tokens → 0€**     |
| **Total V2+ Premium (Sonnet 4.6)**                          | **~6 500 tokens → ~$0.03** |

### Par mois (projection M3-M6)

- **Anonymes/Free** : 100 Chroniques/jour × 30 jours = 3000/mois × 0€ = **0€**
- **Premium V2+** : 50 Premium × 4 runs/mois = 200 Chroniques × $0.03 = **$6/mois**
- **Total Chronique** : ~$6/mois max — négligeable face aux 7,99€ × 50 = 400€ revenu Premium

### Économies vs design naïf

- Un design naïf (Chronique sur Sonnet pour tous) coûterait : 3000 × $0.03 = **$90/mois** — drainerait 22% du revenu Premium
- Notre design (free pour tous, Sonnet uniquement Premium) coûte : **$6/mois** — 1,5% du revenu Premium
- **15× moins cher**, même qualité ressentie pour tous (le free tier produit déjà des Chroniques très lisibles)

---

## §10 — Risques & garde-fous

| Risque                                                                                            | Mitigation                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Chronique générique/banale** (le run était plat → l'IA n'a rien d'intéressant à raconter)       | Prompt enrichi avec exemples canoniques + faits spécifiques (PNJ nommés, Souvenirs, lieux). Si run < 5 tours → pas de Chronique générée.                                                                               |
| **Spam de Chroniques bot** (un script qui finit 1000 runs anonymes)                               | Cap **1 Chronique max par cookie/IP/jour**. Au-delà → la Chronique générée n'est pas publiée (le joueur la voit, mais pas d'URL publique). Cf. `request_logs`.                                                         |
| **Contenu inapproprié dans la Chronique** (l'IA hallucine quelque chose offensant)                | (1) Filtre regex post-génération sur termes blacklistés. (2) Bouton "Signaler" sur chaque page publique → modération manuelle Adem. (3) Si signalement validé → Chronique dépubliée (URL renvoie 404), joueur notifié. |
| **Slug deviné/scrapé**                                                                            | Hash 8-10 chars base62 = ~62^8 = 218 milliards de combinaisons. Rate-limiting sur 404 (10/min/IP). Pas d'API publique de listing.                                                                                      |
| **Illustration ratée** (Pollinations renvoie image vide ou nulle)                                 | 5 illustrations fallback pré-générées par `mood` (5 PNG dans `/public/fallbacks/`). Si fail → fallback automatique.                                                                                                    |
| **OG image cassée** (problème font Cinzel ou Canvas)                                              | Tests E2E sur 10 Chroniques exemples avant chaque déploiement. Si fail → fallback "OG générique GRIMOIRE".                                                                                                             |
| **Chronique trop longue** (l'IA sort 3000 mots)                                                   | Hard cap 1800 tokens sortie, tronqué propre + retry avec rappel _"800-1200 mots, pas plus"_.                                                                                                                           |
| **Joueur veut supprimer sa Chronique** (regret post-partage)                                      | Bouton "Supprimer cette Chronique" dans le profil (compte requis). Anonyme → URL irrévocable, mais demande RGPD acceptée.                                                                                              |
| **Conflit RGPD** (Chronique stockée 2 ans même compte purgé)                                      | Politique transparente : "Les Chroniques restent publiques 2 ans même si tu fermes ton compte, sauf demande de suppression explicite". Consentement à la création de compte.                                           |
| **Sur-promesse Premium V2+** (joueur Premium déçu si la Chronique Sonnet n'est pas spectaculaire) | Tests A/B blind sur 20 Chroniques free vs Sonnet. Si écart pas significatif → ne pas activer Sonnet en V2+ (économie). Si écart fort → activer. Décision data-driven.                                                  |

---

## §11 — Synthèse

```
                  ┌─────────────────────────────────────┐
                  │   FIN DE RUN (mort/choix/abandon)   │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   BACKEND collecte :                │
                  │   - Résumés N2 (16-MEMORY)          │
                  │   - Souvenirs nommés du run         │
                  │   - key_facts_pinned                │
                  │   - Identité + cause de fin         │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   APPEL IA Chronique                │
                  │   - V1 / Free : cascade OpenRouter  │
                  │   - V2+ Premium : Sonnet 4.6        │
                  │   - Output : titre, body, mood,     │
                  │     illustration_prompt, tagline    │
                  └──────────────────┬──────────────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
                ▼                    ▼                    ▼
       ┌────────────────┐  ┌─────────────────┐  ┌─────────────────┐
       │  Pollinations  │  │  Frontend       │  │  Postgres       │
       │  → illustration│  │  Canvas         │  │  chronicles{    │
       │  PNG 1024×1024 │  │  → OG image     │  │   slug, title,  │
       │                │  │  PNG 1200×630   │  │   body, urls... │
       └────────────────┘  └─────────────────┘  └─────────────────┘
                │                    │                    │
                └────────────────────┼────────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   URL publique permanente :         │
                  │   grimoire.game/chronique/{slug}    │
                  │                                     │
                  │   Joueur voit + partage             │
                  │   → traffic externe                 │
                  │   → CTA "Commencer ton aventure"    │
                  │   → conversion                      │
                  └─────────────────────────────────────┘

       CHAQUE CHRONIQUE PARTAGÉE = ACQUISITION GRATUITE.
       C'est le moteur viral V1. Pas un bonus.
```

---

## Références croisées Phase D

- **Bouton "Supprimer Chronique" + flow RGPD complet** → `19-MONETIZATION.md` (politique données) + `20-ARCHITECTURE.md` Phase D
- **Galerie personnelle des Chroniques (compte requis)** → `19-MONETIZATION.md` (avantage compte gratuit)
- **Export PDF de la Chronique** → idée Premium V2+, à valider dans `19-MONETIZATION.md`

---

_Fichier 17 — Phase C — `Chronique` posée (l'asset viral). Suite : [14-META-WORLD](14-META-WORLD.md)._
