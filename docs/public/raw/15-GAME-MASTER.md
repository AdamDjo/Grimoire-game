# 15 — Le Game Master (IA)

> **Fichier 15 / Phase C / Pilier #1 (LLM cascade), Pilier #6 (3 voix d'écriture)**
>
> Liens : [09-ACTION-LOOP](09-ACTION-LOOP.md) · [16-MEMORY](16-MEMORY.md) · [17-RUN-CHRONICLE](17-RUN-CHRONICLE.md) · [20-ARCHITECTURE](20-ARCHITECTURE.md) · [19-MONETIZATION](#-références-phase-d) _(Phase D)_

---

## §0 — Principe

**L'IA est une voix, pas un cerveau.**

Le **backend** est Game Master au sens strict : il connaît l'état du monde (stats SANG/SOUFFLE/CENDRE, PV, inventaire, faction, lore Velkhar canon, dés roulés, conséquences). L'IA reçoit cet état et l'**habille en prose**. Elle ne décide jamais.

Si l'IA tente de décider (« le marchand baisse son prix de 30% », « tu trouves un artefact dans le coffre », « le coup porte 8 dégâts »), le backend **rejette son output** et la reprompte avec un rappel explicite : _« Tu narres ce que le moteur t'indique. Tu n'inventes ni stat ni conséquence. »_

C'est la règle qui protège le jeu de l'effondrement : sans elle, l'IA dérive en quelques tours vers une fanfiction incohérente, et le joueur perd confiance.

---

## §1 — Les 3 voix d'écriture (Pilier #6)

GRIMOIRE n'a **aucun audio en V1**. Tout passe par le **texte**. Mais le texte a une voix — un style, un rythme, un vocabulaire. Pour que Velkhar soit vivant, l'IA doit savoir parler en **3 voix distinctes**, jamais mélangées.

### 1.1 — L'Aveugle (PNJ pilier unique)

**Ton** : chaud, ironique, sage paysan. Tutoie toujours. Parle en proverbes désertiques courts.

**Vocabulaire récurrent** : _le sable, le vent, le sel, la cendre, le thé tiède, les os blanchis, la lampe à huile, la porte._

**Anti-pattern interdit** : jamais lyrique, jamais "vieux sage mystérieux". Il est **paysan-prophète**, pas magicien.

**Phrases canoniques** (à injecter dans le prompt comme exemples) :

> « Ah, tu reviens. Le sable t'a recraché, à ce que je vois. Assieds-toi, étranger. Le thé est tiède mais l'histoire sera chaude. »
>
> « Le vent a parlé de toi cette nuit. Pas en bien. Pas en mal. Juste en long. »
>
> « Trois pièces pour le lit. Une pour le thé. Et ton nom, gratuit — je le garderai. »
>
> « Tu portes l'artefact d'un mort. Il pèse plus lourd que tu crois. »
>
> « Un autre a tenté avant toi. Il n'est pas revenu. Toi non plus, peut-être. »

### 1.2 — Narrateur (voix off, descriptions, action)

**Ton** : sec, sensoriel, présent. Phrases courtes. Aucune émotion explicite — il décrit, il ne juge pas. Jamais d'adverbes émotionnels (_tristement, doucement, mystérieusement_ → interdits).

**Règle d'or** : montrer, pas dire. _« Tu as peur »_ est interdit. _« Tes mains tremblent. Le souffle se bloque. »_ est obligatoire.

**Phrases canoniques** :

> « Le vent porte une odeur de fer chaud. Trois silhouettes se découpent contre la dune. Aucune ne bouge. »
>
> « La porte cède sous l'épaule. À l'intérieur, le silence. Et l'odeur — vieille viande, vieille peur. »
>
> « La lame entre. Sort. Le sang noircit le sable en quelques secondes. »
>
> « Tu marches depuis trois heures. La soif est devenue une pensée fixe. »

### 1.3 — PNJ génériques (tous les autres)

**Ton** : neutre par défaut, avec **5 variantes culturelles légères** selon le peuple du PNJ. Une variante = 2-3 tics de langage, pas une voix complète.

| Peuple         | Tic 1                      | Tic 2                                    | Exemple                                                                                                         |
| -------------- | -------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Sahélin**    | Laconique, phrases courtes | Métaphores du sel et du désert           | _« Cinq pièces. Pas une de moins. Le sel ne pousse pas sur les rochers, voyageur. »_                            |
| **Rivain**     | Lyrique, phrases longues   | Mention du fleuve, de l'eau, des oiseaux | _« Ah, ami, le fleuve m'a porté bien des nouvelles ces derniers jours — dont la tienne, peut-être, qui sait. »_ |
| **Thérien**    | Militaire, direct          | Titres et rangs même informels           | _« Rapport, étranger. Que cherches-tu dans le Quartier des Lames ? Sois bref. »_                                |
| **Cendreur**   | Mystique, ellipses         | Allusions aux artefacts, à la Calamine   | _« Tu portes une chose qui dort. Elle se réveillera. Bientôt, ou jamais. »_                                     |
| **Changepeau** | Elliptique, énigmatique    | Phrases inachevées, pronoms flous        | _« On t'attendait. Enfin — on disait. Tu décideras toi-même. »_                                                 |

**Tous les PNJ génériques** (marchands, gardes, ivrognes, pèlerins) tombent dans une de ces 5 voix selon leur origine. **Pas de voix unique par PNJ secondaire** — économie de prompt.

---

## §2 — Stratégie LLM en cascade (Pilier #1)

GRIMOIRE V1 vise **0€ de coût IA par tour**. C'est non-négociable — le projet doit être autonome et profitable dès M3-M6 (cf. décision produit Adem).

### 2.1 — Les 3 contextes d'exécution

| Contexte                                | Modèle                                                      | Coût               | Quand                         |
| --------------------------------------- | ----------------------------------------------------------- | ------------------ | ----------------------------- |
| **Dev local** (Adem qui code)           | Ollama — Qwen 2.5 32B                                       | 0€                 | Tests, prototypage            |
| **Prod — Micro-tours** (90% des appels) | Cascade OpenRouter free tier                                | 0€                 | Tous les tours de jeu normaux |
| **Prod — Chronique fin de run**         | Meilleur modèle free disponible V1 / Sonnet 4.6 V2+ Premium | 0€ V1 / ~$0.03 V2+ | 1 fois par fin de run         |

### 2.2 — La cascade OpenRouter (cœur de la prod V1)

L'ordre exact, défini dans `OPENROUTER_MODELS_CASCADE` (env var, modifiable sans redéploiement) :

```
1. deepseek/deepseek-chat-v3.1:free
2. meta-llama/llama-3.3-70b-instruct:free
3. qwen/qwen-2.5-72b-instruct:free
4. mistralai/mistral-small-24b-instruct:free
```

**Règles de bascule** :

- Si modèle 1 renvoie erreur, timeout > 12 sec, ou rate-limit → bascule modèle 2
- Si modèle 4 échoue aussi → renvoyer au frontend `{ error: "ai_saturated", message: "GRIMOIRE est très populaire ce soir, réessaye dans 10 min" }`
- Bascule loggée dans `request_logs.model_used` pour monitoring
- Si un modèle échoue 3 fois en 5 min → blacklisté 30 min auto (évite le ping-pong)

### 2.3 — Pivots narratifs (V2+, après traction)

10% des appels sont des **pivots** (combat décisif, fin d'acte, dialogue critique avec L'Aveugle). En V1, ils utilisent la même cascade. En V2+, si Premium ≥ 50 utilisateurs, on bascule sur **Claude Haiku 4.5** (~$0.0008/appel) pour ces tours.

→ Doit rester **invisible côté joueur** : pas de "modèle premium activé", juste meilleure narration ressentie.

### 2.4 — Chronique fin de run

Détaillé dans [17-RUN-CHRONICLE](17-RUN-CHRONICLE.md). Résumé :

- **V1** : meilleur modèle free dispo (essai cascade dans l'ordre 1→4)
- **V2+ Premium** : Claude Sonnet 4.6
- **V2+ Free tier** : reste sur free cascade

---

## §3 — Anti-patterns d'écriture interdits

Liste dure dans le prompt système. L'IA reçoit ces interdits explicitement. Le backend **detecte** les violations par regex et reprompte si besoin.

### Interdits absolus

| Catégorie                           | Exemple interdit                                        | Pourquoi                                                                                         |
| ----------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Adverbes émotionnels**            | _« Tu te sens étrangement attiré... »_                  | Casse le show-don't-tell. Le joueur ressent par lui-même.                                        |
| **"Soudain !"**                     | _« Soudain, un cri ! »_                                 | Tic narratif paresseux. Préférer : _« Un cri. Court. Suivi d'un silence pire. »_                 |
| **Questions rhétoriques au joueur** | _« Que vas-tu faire ? »_                                | Le rôle des **choix** UI, pas de la prose.                                                       |
| **Emojis dans la prose**            | _« Le marchand sourit 😏. »_                            | Réservés à l'UI (🩸 PV, 💨 SOUFFLE, 🔥 CENDRE, 🪙 or, 📖 souvenir).                              |
| **Méta-commentaire**                | _« En tant que MJ, je dirais que... »_                  | Brise l'immersion. L'IA est invisible.                                                           |
| **Happy ending forcé**              | _« Heureusement, tu trouves de l'eau juste à temps ! »_ | Velkhar est rude. La mort, la défaite, la trahison sont **autorisées et nécessaires**.           |
| **Lore inventé hors canon**         | _« Le grand Empire de Velkhar fondé en l'an 200... »_   | Le lore est dans [02-WORLD-BIBLE](02-WORLD-BIBLE.md). L'IA n'invente jamais d'histoire mondiale. |
| **Décision mécanique**              | _« Tu perds 5 PV. »_                                    | Le backend annonce les dégâts via l'UI. La prose **décrit**, ne **calcule** pas.                 |
| **Roulage de dé en prose**          | _« Tu lances un d20... 14 ! Réussite. »_                | Le backend roule, l'IA narre le résultat. Cf. [08-DICE-RESOLUTION](08-DICE-RESOLUTION.md).       |

### Tolérés mais à doser

- Métaphores poétiques (1 par scène max — on évite la prose surchargée)
- Dialogues internes du perso (interdits si Narrateur, autorisés si L'Aveugle commente)
- Cliffhangers (autorisés si naturels, pas forcés)

---

## §4 — Garde-fous mécaniques (backend)

L'IA peut dériver. Le backend la rattrape **systématiquement**.

### 4.1 — Validation Zod sur tout output IA

Chaque réponse IA doit matcher ce schéma :

```ts
{
  narration: string (max 250 tokens),
  choices: Array<{ id: string, label: string }> (3-4 max, label max 20 tokens),
  mood: "calm" | "tense" | "festive" | "sacred" | "dangerous",
  npcs_present: string[] (noms des PNJ en scène)
}
```

Si parse Zod échoue → **retry avec prompt enrichi** _« Ton dernier output ne respectait pas le format JSON imposé. Renvoie strictement : ... »_.

### 4.2 — Vérification contextuelle

Après parse, le backend vérifie :

| Check                                                        | Action si fail                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------ |
| Un `choice` propose une action sur un PNJ absent du contexte | Rejet + retry                                                      |
| Un `choice` mentionne un item non possédé                    | Rejet + retry                                                      |
| `mood: "festive"` alors que le perso est à 1 PV              | Rejet + retry                                                      |
| `npcs_present` contient un PNJ mort dans un run précédent    | Rejet + retry                                                      |
| Narration mentionne un lieu inexistant dans Velkhar canon    | Rejet + retry **après 2 tentatives → renvoyer fallback générique** |

### 4.3 — Hard timeout 12 sec

Si l'IA ne répond pas en 12 sec → annulation + bascule modèle suivant dans la cascade. L'utilisateur ne sait jamais qu'il y a eu fallback.

### 4.4 — Limite de retries

Maximum **2 retries** par tour. Au-delà → fallback à un texte générique pré-écrit (banque de 20 transitions neutres par mood, ex : _« Le silence retombe. L'instant attend ta décision. »_). Préférable à un crash visible.

---

## §5 — Budget de tokens par tour

Discipline financière + perceptuelle (réponses courtes = jeu nerveux).

| Élément                                                  | Tokens max |
| -------------------------------------------------------- | ---------- |
| Prompt système (instructions, voix, anti-patterns)       | 1 200      |
| Contexte lore Velkhar injecté                            | 500        |
| Mémoire intra-tour (3-5 derniers tours)                  | 1 500      |
| Mémoire intra-run (résumés compressés)                   | 4 000      |
| Mémoire inter-runs (Souvenirs nommés, événement mondial) | 800        |
| **Total entrée par appel**                               | **~8 000** |
| Narration sortie                                         | 250        |
| Choix sortie                                             | 80         |
| **Total sortie**                                         | **~330**   |

**Si l'entrée dépasse 8 000** → compression forcée du plus ancien (cf. [16-MEMORY §4](16-MEMORY.md)). **Si la sortie dépasse 330** → tronquée propre + retry avec rappel _« Sois plus concis. »_.

---

## §6 — Prompt système (squelette V1)

Voici la **structure** du prompt système envoyé à chaque tour. Le contenu exact évoluera (versionné via fichier `prompts/system-v{n}.txt` dans le backend), mais la structure reste stable.

```
[RÔLE]
Tu es le Maître du Jeu de GRIMOIRE — Of Ash and Salt, un roguelike narratif
se déroulant à Velkhar, continent désertique. Tu n'es jamais le joueur.
Tu décris le monde tel que le moteur te l'indique.

[RÈGLE ABSOLUE]
Tu n'inventes RIEN qui n'est pas dans le contexte fourni :
- Pas de stat (les chiffres viennent du moteur)
- Pas de conséquence (le moteur les calcule)
- Pas de PNJ inconnu (catalogue fourni)
- Pas de lieu hors Velkhar canon (cf. WORLD-BIBLE)

[3 VOIX]
Tu écris en 3 voix selon le contexte :
1. L'AVEUGLE — chaud, ironique, tutoie, proverbes désertiques courts
   [3 phrases canoniques en exemple]
2. NARRATEUR — sec, sensoriel, présent, jamais d'émotion explicite
   [3 phrases canoniques en exemple]
3. PNJ GÉNÉRIQUES — neutre + variante culturelle selon peuple
   [5 variantes × 1 exemple chacune]

[INTERDITS]
- Adverbes émotionnels (tristement, mystérieusement...)
- "Soudain !", questions rhétoriques au joueur
- Emojis dans la prose
- Lore inventé hors WORLD-BIBLE
- Happy ending forcé (Velkhar est rude)

[FORMAT DE SORTIE — STRICTEMENT JSON]
{
  "narration": "...max 250 tokens...",
  "choices": [
    { "id": "a", "label": "..." },
    { "id": "b", "label": "..." },
    { "id": "c", "label": "..." }
  ],
  "mood": "calm | tense | festive | sacred | dangerous",
  "npcs_present": ["..."]
}

[CONTEXTE DE LA SCÈNE]
{lore_velkhar_extrait}
{état_perso : nom, vocation, peuple, PV, stats, inventaire bref}
{souvenirs_nommés_pertinents}
{mémoire_intra_run_compressée}
{3-5_derniers_tours_en_clair}
{action_du_joueur_au_tour_n}
{résultat_dé_si_applicable}

[INSTRUCTION FINALE]
Génère le tour N+1. Réponds STRICTEMENT en JSON. Une seule voix par
narration (Narrateur par défaut, L'Aveugle si on est à l'auberge,
PNJ si dialogue direct).
```

**Taille cible** : 1 200 tokens fixes (instructions) + variable selon contexte. Versionné `system-v1.txt`, `system-v2.txt`...

---

## §7 — Cas spécial : la Chronique de fin de run

Détaillé dans [17-RUN-CHRONICLE](17-RUN-CHRONICLE.md). Vue côté GM :

- **Trigger** : `runs.status` passe à `ended` ou `dead`
- **Modèle** : meilleur dispo selon tier joueur (V1 = même cascade free, V2+ Premium = Sonnet 4.6)
- **Prompt** : ~2 000 tokens, demande un récit littéraire 800-1200 mots à la 3ᵉ personne
- **Input** : tous les résumés intra-run + Souvenirs nommés du run + faits `pinned`
- **Output** : `{ title, body_markdown, mood, key_moments[], illustration_prompt }`
- **Style imposé** : "écris comme un romancier qui raconterait cette aventure à un ami au coin du feu — pas un rapport de partie"
- **Voix** : **Narrateur uniquement** (jamais L'Aveugle, jamais en JE)

---

## §8 — Risques & garde-fous

| Risque                                                                        | Mitigation                                                                                                                                                          |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dérive de voix entre modèles** (DeepSeek vs Llama narrent différemment)     | Tests A/B systématiques sur 20 prompts canoniques par modèle. Si écart de style > seuil → exclure le modèle. Banque de phrases canoniques injectée à chaque prompt. |
| **Hallucinations lore** (l'IA invente un peuple, un dieu, une région)         | Lore Velkhar injecté à chaque appel (max 500 tokens, extraits pertinents). Validation `lieu mentionné ∈ catalogue` côté backend.                                    |
| **Latence variable free tier** (3-15 sec selon modèle/heure)                  | UI affiche _« Le MJ réfléchit... »_ avec animation discrète. Pas de timer visible.                                                                                  |
| **Quotas free tier explosés**                                                 | Monitoring quotas en temps réel via `request_logs`. Alerte mail Adem à 80% quota. Cascade auto vers modèle suivant.                                                 |
| **Style trop verbose** (modèles open source ont tendance à overdoser)         | Hard cap 250 tokens narration. Tronqué propre + retry si dépassement.                                                                                               |
| **JSON cassé** (modèles open source moins fiables que Claude)                 | Parse Zod systématique. Retry avec exemple JSON valide en prompt. Au pire : fallback générique.                                                                     |
| **Quotas free tier disparaissent** (OpenRouter retire un modèle sans préavis) | Liste cascade en env var modifiable sans redéploiement. Veille mensuelle Adem sur les modèles dispo.                                                                |
| **Erreur fournisseur silencieuse** (modèle renvoie 200 mais contenu vide)     | Validation longueur min narration (10 tokens). Sinon retry.                                                                                                         |

---

## §9 — Synthèse

```
                  ┌─────────────────────────────────────┐
                  │   JOUEUR clique un choix ou écrit   │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   BACKEND (Game Master véritable)   │
                  │   1. Valide l'action                │
                  │   2. Roule le dé si pivot           │
                  │   3. Calcule conséquences           │
                  │   4. Construit le contexte IA       │
                  │      (8000 tokens max, cf. §5)      │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   CASCADE OPENROUTER (§2)           │
                  │   DeepSeek → Llama → Qwen → Mistral │
                  │   (12 sec timeout par modèle)       │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   VALIDATION ZOD + CONTEXTE (§4)    │
                  │   Anti-patterns, items, PNJ, mood   │
                  │   Si fail → retry (max 2)           │
                  │   Si fail² → fallback générique     │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   FRONTEND affiche                  │
                  │   narration + 3-4 choix + mood UI   │
                  └─────────────────────────────────────┘

    L'IA n'a JAMAIS touché aux stats, inventaire, dés.
    Le backend décide TOUT. L'IA est une voix.
```

---

## Références Phase D

- **Tier Premium** (bascule modèles meilleurs) → cf. `19-MONETIZATION.md` à venir
- **Auth & billing** (lien tier ↔ choix modèle) → cf. `20-ARCHITECTURE.md` Phase D
- **Règle d'or coût IA** → cf. `19-MONETIZATION.md` à venir

---

_Fichier 15 — Phase C — `Game Master` posé. Suite : [16-MEMORY](16-MEMORY.md)._
