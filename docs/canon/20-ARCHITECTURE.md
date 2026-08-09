# 20 — Architecture Technique (V1)

> **Fichier 20 / Phase C / Pilier transverse — consolidation stack**
>
> Liens : [15-GAME-MASTER](15-GAME-MASTER.md) · [16-MEMORY](16-MEMORY.md) · [17-RUN-CHRONICLE](17-RUN-CHRONICLE.md) · [14-META-WORLD](14-META-WORLD.md) · [09-ACTION-LOOP](09-ACTION-LOOP.md)
>
> ⚠️ **Hors-scope V1 = auth complète + billing Stripe + notifications.** Ces couches s'ajoutent en Phase D, sans casser l'architecture posée ici.

---

## §0 — Principe

**Monorepo Turborepo + pnpm.** Découpe stricte des responsabilités :

| Couche          | Rôle                   | Règle absolue                                                                 |
| --------------- | ---------------------- | ----------------------------------------------------------------------------- |
| **Backend**     | Game Master véritable  | Calcule TOUT (stats, dés, inventaire, conséquences). Source unique de vérité. |
| **Frontend**    | Display + interactions | Aucune logique de jeu. Affiche ce que le backend envoie.                      |
| **AI Provider** | Voix narrative         | OpenRouter cascade. Jamais de décision. Validation Zod systématique.          |
| **DB**          | Persistance            | Postgres + pgvector (Supabase). Cache éphémère Redis (ou in-memory V1).       |

**Aucune couche ne dépend de l'auth en V1.** Les sessions anonymes via cookie suffisent pour faire tourner tout GRIMOIRE V1. L'auth est un _bolt-on_ Phase D, pas une fondation.

---

## §1 — Stack technique

### Frontend

- **Framework** : Next.js 15 (App Router)
- **Runtime** : React 19
- **Langage** : TypeScript strict
- **Styling** : Tailwind CSS 4 (tokens désertiques cf. `docs/canon/`)
- **State client** : Zustand (UI state) + React Query (data fetching)
- **Polices** : Cinzel (titres) · EB Garamond (corps narratif) · Outfit (UI/data)
- **Hébergement** : Vercel (free tier — 100 GB bandwidth/mois suffit V1)

### Backend

- **Framework** : Express 4
- **Langage** : TypeScript strict
- **Runtime** : Node 20
- **Validation** : Zod (toutes routes + tous outputs IA)
- **Hébergement** : Railway ou Fly.io (free tier ~5$/mois si dépassement)

### Database

- **Provider** : Supabase (Postgres 16 + pgvector + Storage)
- **Plan** : Free tier V1 (500 MB DB, 1 GB Storage — suffit < 1000 joueurs actifs)
- **Migration** : tracking au-delà → Pro $25/mois (Phase D si traction)

### Cache

- **V1 minimal** : cache in-memory Express (`node-cache` ou Map natif) pour mémoire intra-tour
- **V1.1** : Redis via Upstash (free tier 10k commands/jour suffit ~30 joueurs actifs simultanés)
- **Décision** : démarrer in-memory, migrer Redis quand 2+ instances backend (scale horizontal)

### AI Provider

- **Production** : OpenRouter (cascade modèles free tier — cf. [15-GAME-MASTER §2](15-GAME-MASTER.md))
- **Dev local** : Ollama (Qwen 2.5 32B sur machine Adem)
- **Modèles d'embedding** : OpenRouter free tier (ou pgvector natif si bloqué)

### Tooling repo

- **Monorepo** : Turborepo + pnpm 9.15
- **Lint/Format** : `@grimoire/eslint-config` + `@grimoire/prettier-config`
- **Tests** : Vitest (unit) + Cypress (E2E)
- **CI/CD** : GitHub Actions (ci.yml, pr-metadata.yml, release.yml)
- **Hooks** : Husky + commitlint + lint-staged

### Coût mensuel V1 estimé

| Service              | Plan                     | Coût            |
| -------------------- | ------------------------ | --------------- |
| Vercel               | Free                     | 0€              |
| Railway/Fly.io       | Free + dépassement léger | 0-5€            |
| Supabase             | Free                     | 0€              |
| Upstash Redis (V1.1) | Free                     | 0€              |
| OpenRouter           | Free tier cascade        | 0€              |
| Domaine `.game`      | Annuel                   | ~3€/mois amorti |
| **TOTAL V1**         |                          | **~3-10€/mois** |

**Premier vrai coût IA : si Premium ≥ 50 utilisateurs (V2+) → Sonnet 4.6 sur Chronique = ~6$/mois.** Toujours < 1,5% du revenu Premium attendu.

---

## §2 — Schéma DB minimal V1 (sans auth/billing)

### Vue d'ensemble

```
players ──┬── characters ──┬── runs ── scenes ── (embeddings)
          │                │
          │                └── souvenirs
          │
          ├── traces (locales)
          │
          └── request_logs

world_events (table indépendante, partagée tous joueurs)

chronicles (1:1 avec runs, URL publique)
```

### Tables détaillées

#### `players`

```sql
CREATE TABLE players (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_cookie     TEXT UNIQUE,                              -- UUID cookie HTTPOnly
  account_id      UUID UNIQUE REFERENCES accounts(id),      -- NULL en V1 (table accounts = Phase D)
  tier            TEXT NOT NULL DEFAULT 'anon',             -- 'anon' | 'free' | 'premium'
  signature       TEXT,                                     -- pseudo court optionnel
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT player_identity CHECK (anon_cookie IS NOT NULL OR account_id IS NOT NULL)
);

CREATE INDEX idx_players_cookie ON players(anon_cookie) WHERE anon_cookie IS NOT NULL;
CREATE INDEX idx_players_account ON players(account_id) WHERE account_id IS NOT NULL;
```

#### `characters`

```sql
CREATE TABLE characters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  vocation        TEXT NOT NULL CHECK (vocation IN ('marcheur-du-sel','lame-ombre','veilleur','tisse-verbe')),
  people          TEXT NOT NULL CHECK (people IN ('sahelin','rivain','therien','cendreur','changepeau','metisse')),
  stats_json      JSONB NOT NULL,                           -- {sang, souffle, cendre, pv_max, pv_current}
  current_run_id  UUID REFERENCES runs(id),
  status          TEXT NOT NULL DEFAULT 'alive',            -- 'alive' | 'dead' | 'legacy'
  legacy_data     JSONB,                                    -- artefact transmis, dernière scène, etc.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  died_at         TIMESTAMPTZ
);

CREATE INDEX idx_characters_player ON characters(player_id);
CREATE INDEX idx_characters_status ON characters(status);
```

#### `runs`

```sql
CREATE TABLE runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  status          TEXT NOT NULL DEFAULT 'active',            -- 'active' | 'ended' | 'dead' | 'abandoned'
  end_reason      TEXT,                                      -- 'death' | 'inn_choice' | 'abandonment'
  chronicle_id    UUID REFERENCES chronicles(id),
  turn_count      INT NOT NULL DEFAULT 0,
  ai_calls_count  INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_runs_character ON runs(character_id);
CREATE INDEX idx_runs_status ON runs(status);
```

#### `scenes` (mémoire N2 — cf. [16-MEMORY §2](16-MEMORY.md))

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE scenes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id              UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  summary             TEXT NOT NULL,                          -- ~150 tokens
  key_facts           JSONB NOT NULL DEFAULT '[]',
  key_facts_pinned    JSONB NOT NULL DEFAULT '[]',            -- jamais purgés
  mood                TEXT NOT NULL,
  npcs_evolution      JSONB NOT NULL DEFAULT '[]',
  embedding           VECTOR(1536),                           -- pgvector pour rappel
  turn_count_start    INT NOT NULL,                           -- range tours couverts
  turn_count_end      INT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scenes_run ON scenes(run_id);
CREATE INDEX idx_scenes_embedding ON scenes USING ivfflat (embedding vector_cosine_ops);
```

#### `souvenirs` (niveau A méta — cf. [14-META-WORLD §2](14-META-WORLD.md))

```sql
CREATE TABLE souvenirs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  character_id    UUID NOT NULL REFERENCES characters(id),
  run_id          UUID NOT NULL REFERENCES runs(id),
  scene_id        UUID REFERENCES scenes(id),
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  named           BOOLEAN NOT NULL DEFAULT true,
  embedding       VECTOR(1536),                              -- pour tri pertinence
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ                                -- soft delete RGPD
);

CREATE INDEX idx_souvenirs_player ON souvenirs(player_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_souvenirs_embedding ON souvenirs USING ivfflat (embedding vector_cosine_ops);
```

#### `traces` (niveau B méta — cf. [14-META-WORLD §3](14-META-WORLD.md))

```sql
CREATE TABLE traces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  category        TEXT NOT NULL CHECK (category IN ('npc_killed','faction_marked','location_modified')),
  entity_id       TEXT NOT NULL,                              -- référence catalogue lore (slug stable)
  context_text    TEXT NOT NULL,
  decay_runs      INT,                                        -- NULL = permanent
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_traces_player_entity ON traces(player_id, entity_id);
```

#### `world_events` (niveau C méta — cf. [14-META-WORLD §4](14-META-WORLD.md))

```sql
CREATE TABLE world_events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 TEXT NOT NULL,
  description_player    TEXT NOT NULL,                        -- pour UI publique
  lore_context_for_ai   TEXT NOT NULL,                        -- injecté dans prompts IA
  active_from           DATE NOT NULL,
  active_until          DATE NOT NULL,
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  created_by            TEXT NOT NULL DEFAULT 'adem',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_world_events_active ON world_events(active_from, active_until);
```

#### `chronicles` (cf. [17-RUN-CHRONICLE](17-RUN-CHRONICLE.md))

```sql
CREATE TABLE chronicles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id              UUID UNIQUE NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  slug                TEXT UNIQUE NOT NULL,                   -- hash 8-10 chars base62
  title               TEXT NOT NULL,
  body_markdown       TEXT NOT NULL,
  mood                TEXT NOT NULL,
  key_moments         JSONB NOT NULL DEFAULT '[]',
  tagline             TEXT,
  illustration_url    TEXT,                                   -- Supabase Storage
  og_image_url        TEXT,
  view_count          INT NOT NULL DEFAULT 0,
  share_count         INT NOT NULL DEFAULT 0,
  signature           TEXT,                                   -- pseudo joueur ou NULL
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ                             -- soft delete RGPD/modération
);

CREATE INDEX idx_chronicles_slug ON chronicles(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_chronicles_views ON chronicles(view_count DESC) WHERE deleted_at IS NULL;
```

#### `request_logs` (caps + monitoring)

```sql
CREATE TABLE request_logs (
  id              BIGSERIAL PRIMARY KEY,
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  run_id          UUID REFERENCES runs(id),
  request_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tokens_in       INT NOT NULL,
  tokens_out      INT NOT NULL,
  model_used      TEXT NOT NULL,                              -- ex: 'deepseek/deepseek-chat-v3.1:free'
  latency_ms      INT NOT NULL,
  cost_estimate   NUMERIC(10,6) NOT NULL DEFAULT 0,
  error_code      TEXT                                        -- NULL si succès
);

CREATE INDEX idx_logs_player_time ON request_logs(player_id, request_at DESC);
CREATE INDEX idx_logs_model ON request_logs(model_used, request_at DESC);
```

### Volumes estimés V1 (M3-M6)

- 500 joueurs actifs/mois
- ~10 runs/joueur/mois = 5 000 runs/mois
- ~25 tours/run = 125 000 tours/mois
- ~3 scènes/run = 15 000 scènes/mois (avec embeddings)
- ~2 Souvenirs/run = 10 000 Souvenirs/mois
- ~125 000 lignes `request_logs`/mois

**Free tier Supabase (500 MB) tient ~6 mois.** Au-delà → Pro $25/mois (déclencheur Phase D).

---

## §3 — Flux d'un tour de jeu (séquence détaillée)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  FRONTEND (Next.js)                                             │
│  ─────────────────────                                          │
│  Utilisateur clique un choix ou écrit action libre              │
│  → POST /api/turn { run_id, action: { type, payload } }         │
│                                                                 │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  ROUTE PROXY  app/api/[...path]/route.ts                        │
│  → forward vers backend Express                                 │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (Express)                                              │
│  ─────────────────────                                          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 1. MIDDLEWARE — sessionMiddleware                      │    │
│  │    Lit cookie HTTPOnly grimoire_session                │    │
│  │    Récupère player_id depuis players (anon_cookie)     │    │
│  │    Si inexistant → crée nouveau player anonyme         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                  │                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 2. MIDDLEWARE — capsMiddleware                         │    │
│  │    Compte request_logs glissants (semaine)             │    │
│  │    Si > cap tier → renvoie 429 + upgrade_prompt        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                  │                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 3. ROUTE — POST /turn                                  │    │
│  │    Zod valide payload                                  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                  │                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 4. GAME ENGINE                                         │    │
│  │    a. Charge état run (character, scenes, inventory)   │    │
│  │    b. Valide action (PNJ présent, item dispo, etc.)    │    │
│  │    c. Roule d20 si pivot (08-DICE-RESOLUTION)          │    │
│  │    d. Calcule conséquences (stats, inventaire, etc.)   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                  │                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 5. MEMORY SERVICE                                      │    │
│  │    Construit contexte 8000 tokens :                    │    │
│  │    - N1 intra-tour (cache/Redis)                       │    │
│  │    - N2 intra-run (scenes + pinned + pgvector recall)  │    │
│  │    - N3 inter-runs (souvenirs + world_events + legacy) │    │
│  │    - Lore Velkhar pertinent                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                  │                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 6. AI SERVICE — callWithCascade                        │    │
│  │    Essaie modèle 1 (DeepSeek free)                     │    │
│  │    → timeout 12s ? → modèle 2 (Llama free)             │    │
│  │    → ... → si tous fail : renvoie error structuré      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                  │                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 7. VALIDATION OUTPUT IA                                │    │
│  │    Zod parse (narration, choices, mood, npcs)          │    │
│  │    Vérif contextuelle (items, PNJ vivants, mood vs PV) │    │
│  │    Anti-pattern regex (emojis prose, "Soudain!")       │    │
│  │    Si fail → retry × 2 → sinon fallback générique      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                  │                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 8. PERSIST                                             │    │
│  │    - INSERT turn → cache N1 Redis                      │    │
│  │    - Si 9ᵉ tour → trigger compression async (16 §5)    │    │
│  │    - Si souvenir_candidate validé → INSERT souvenirs   │    │
│  │    - INSERT request_logs (tokens, modèle, latence)     │    │
│  │    - UPDATE runs.turn_count, ai_calls_count            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                  │                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 9. RESPONSE                                            │    │
│  │    { narration, choices, mood, state_update,           │    │
│  │      souvenir_unlocked? }                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND affiche                                               │
│  - narration (transition douce)                                 │
│  - choix (3-4)                                                  │
│  - state_update (PV, inventaire, mood ambiance UI)              │
│  - notification Souvenir si débloqué                            │
└─────────────────────────────────────────────────────────────────┘
```

**Latence cible totale** : 3-8 sec (dépend modèle free tier). UI affiche _"Le MJ réfléchit..."_ avec animation discrète.

---

## §4 — Système de caps techniques

### Principe

Middleware Express `capsMiddleware` qui vérifie le quota du joueur **avant** d'appeler l'IA. Si dépassé → 429 + upgrade prompt.

### Caps V1

| Tier               | Cap                                     | Fenêtre                         | Action si dépassé                                                       |
| ------------------ | --------------------------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| **Anonyme**        | 30 requêtes IA                          | Total cycle de vie cookie (90j) | Mur "Crée un compte pour continuer"                                     |
| **Compte gratuit** | 150 requêtes IA                         | Glissante 7 jours               | Mur "Tu as épuisé tes requêtes cette semaine, passe Premium ou attends" |
| **Premium**        | 5 000 requêtes IA (silencieux anti-bot) | Glissante 7 jours               | Erreur 429 silencieuse (jamais atteinte en usage normal)                |

### Calcul

```sql
SELECT COUNT(*) FROM request_logs
WHERE player_id = $1
  AND request_at > NOW() - INTERVAL '7 days'
  AND error_code IS NULL;
```

### Cas spéciaux

- **Compressions** (cf. [16-MEMORY §5](16-MEMORY.md)) : pas comptées dans le cap joueur (c'est de la maintenance backend)
- **Chronique fin de run** : comptée comme 1 requête (même si plus coûteuse, pour ne pas pénaliser le geste viral)
- **Embedding** : pas comptée
- **Retry sur fail** : pas comptée (seul le succès compte)

### Affichage frontend

- **Badge discret** dans le header pendant le jeu : _"148/150 requêtes restantes cette semaine"_ (compte gratuit)
- **Anonyme** : pas de badge initial → apparait à 25/30 ("Plus que 5 actions avant création de compte")
- **Premium** : badge invisible (pas de compteur visible — fluidité)

### V1 fonctionne sans auth

Le middleware fonctionne dès aujourd'hui avec `players.anon_cookie` + `players.tier = 'anon'`. Quand l'auth s'ajoute Phase D, on switch simplement `tier` selon `account_id`.

---

## §5 — Sessions anonymes

### Cookie HTTPOnly

- **Nom** : `grimoire_session`
- **Valeur** : UUID v4 (cryptographiquement sûr)
- **Durée** : 90 jours, renouvelée à chaque visite
- **Flags** : `HttpOnly`, `Secure`, `SameSite=Lax`
- **Domaine** : `.grimoire.game`

### Lifecycle

1. **1ère visite** : aucun cookie → backend génère UUID, crée `players` avec `anon_cookie`, set cookie response
2. **Visites suivantes** : cookie présent → lookup `players.anon_cookie` → récupère `player_id`
3. **Cookie expire** : nouveau cookie généré → nouveau `players` créé → données précédentes orphelines (purge auto 30j)
4. **Création de compte (Phase D)** : `accounts.id` lié à `players.account_id`, données rattachées au compte. Cookie reste actif pour fallback.

### RGPD anonyme

- Pas de PII collectée sans consentement
- Cookie consent banner V1 minimal : _"GRIMOIRE utilise un cookie pour sauvegarder ta partie. [Accepter] [Refuser]"_
- Si refusé → mode "session-only" (localStorage, pas de DB) — fonctionnalités limitées (pas de Chronique partagée)

### Données stockées côté serveur anonyme

- `players` row (cookie, tier='anon', timestamps)
- `characters`, `runs`, `scenes`, `souvenirs` liés au `player_id`
- `request_logs` pour caps

### Données stockées côté client anonyme

- Cookie HTTPOnly uniquement (pas de localStorage en mode standard)
- Optionnel : `localStorage` pour cache UI (préférences thème, sound)

---

## §6 — OpenRouter cascade (service détaillé)

### Configuration

`.env` :

```
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODELS_CASCADE=deepseek/deepseek-chat-v3.1:free,meta-llama/llama-3.3-70b-instruct:free,qwen/qwen-2.5-72b-instruct:free,mistralai/mistral-small-24b-instruct:free
OPENROUTER_TIMEOUT_MS=12000
OPENROUTER_MAX_RETRIES_PER_MODEL=1
```

### Service `aiService.ts`

```typescript
async callWithCascade(prompt: string, options: AIOptions): Promise<AIResponse> {
  const models = process.env.OPENROUTER_MODELS_CASCADE.split(',');
  const blacklist = await getBlacklistedModels();    // Redis ou in-memory

  for (const model of models) {
    if (blacklist.has(model)) continue;

    try {
      const response = await callOpenRouter(model, prompt, {
        timeout: OPENROUTER_TIMEOUT_MS,
        maxTokens: options.maxTokens
      });

      // Validation Zod
      const parsed = AIResponseSchema.parse(response);

      // Log success
      await logRequest({ model, tokens_in, tokens_out, latency_ms, success: true });

      return parsed;
    } catch (err) {
      await logRequest({ model, error_code: err.code, latency_ms });

      // Si 3 erreurs en 5 min sur ce modèle → blacklist 30 min
      const recentErrors = await countRecentErrors(model, '5 minutes');
      if (recentErrors >= 3) {
        await blacklistModel(model, '30 minutes');
      }

      continue;  // Essai modèle suivant
    }
  }

  // Tous les modèles ont échoué
  throw new AISaturatedError(
    'GRIMOIRE est très populaire ce soir, réessaye dans 10 min'
  );
}
```

### Modèles d'embedding

- **Préférence** : OpenRouter free tier embedding (si dispo)
- **Fallback** : pgvector natif via extension (génération côté DB)
- **V2+** : OpenAI ada-002 payant si free tier insuffisant

---

## §7 — Monitoring & alertes V1 minimaliste

### Métriques produit

Calculées via requêtes SQL directes sur Supabase. Pas de Datadog/Mixpanel payant V1.

| Métrique                | Requête                                                                                             | Cadence                     |
| ----------------------- | --------------------------------------------------------------------------------------------------- | --------------------------- |
| Joueurs actifs/jour     | `SELECT COUNT(DISTINCT player_id) FROM request_logs WHERE request_at > NOW() - INTERVAL '24 hours'` | Dashboard quotidien         |
| Run completion rate     | `runs WHERE status IN ('ended','dead') / runs total`                                                | Hebdo                       |
| Chronique view rate     | `chronicles.view_count` moyenne                                                                     | Hebdo                       |
| Conversion view → essai | UTM tracking sur CTA → analytics frontend                                                           | Hebdo                       |
| Coût IA réel            | `SUM(request_logs.cost_estimate) WHERE month = current`                                             | Quotidien                   |
| Modèle dominant         | `request_logs.model_used` répartition                                                               | Quotidien (détection drift) |

### Alertes mail Adem

- **Quota OpenRouter free tier > 80%** d'un modèle dans la journée → mail auto
- **Erreur cascade fatale** (tous modèles échouent simultanément 3 fois en 1h) → mail urgent
- **Dépassement cap silencieux Premium > 90%** d'un utilisateur → mail (investigation bot ou usage extrême)
- **Pas de nouveau world_event > 45 jours** → mail "Velkhar attend son prochain souffle"

### Logs applicatifs

- **Vercel logs** (frontend) : 7 jours retention free tier
- **Railway/Fly.io logs** (backend) : 7 jours retention free tier
- **Pas de Sentry V1** — logs structurés JSON suffisent pour debug solo dev

### Dashboard Adem (V1 ultra-minimal)

- **Supabase Studio** : table SQL exploration directe
- **Pages internes Next.js protégées** (`/admin` derrière secret env var) :
  - Stats du jour
  - Liste 10 dernières Chroniques (avec liens)
  - Modèles utilisés (camembert)
  - Liste world_events actifs
- **Pas d'UI admin complète V1** — Supabase Studio fait le job

---

## §8 — Stratégie d'environnements

| Env                       | Frontend         | Backend                                         | DB                       | IA                   |
| ------------------------- | ---------------- | ----------------------------------------------- | ------------------------ | -------------------- |
| **dev** (local)           | Next.js dev mode | Express dev mode                                | Supabase local Docker    | Ollama Qwen 2.5 32B  |
| **staging** (PR previews) | Vercel preview   | Railway preview (ou bypass : backend dev local) | Supabase project staging | OpenRouter free tier |
| **prod**                  | Vercel prod      | Railway prod                                    | Supabase cloud prod      | OpenRouter free tier |

### Conventions

- Variables d'environnement strictement séparées par env (jamais de prod en dev)
- Migrations DB versionnées (Supabase migrations folder)
- Branches : `feature/*` → preview, `develop` → staging, `main` → prod (cf. CLAUDE.md global)

---

## §9 — Découpe monorepo (existant)

```
EpisodeRPG-game/
├── apps/
│   ├── frontend/                 Next.js 15
│   │   ├── src/
│   │   │   ├── app/              App Router (routing universe-grouped)
│   │   │   ├── components/ui/    Composants partagés (Heading, NavBar, etc.)
│   │   │   ├── lib/              home-data, helpers
│   │   │   └── stores/           Zustand stores
│   │   └── CLAUDE.md             Règles frontend
│   │
│   └── backend/                  Express 4
│       ├── src/
│       │   ├── routes/           /api/turn, /api/character, /api/run...
│       │   ├── services/         gameEngine, aiService, memoryService, chronicleService
│       │   ├── middleware/       sessionMiddleware, capsMiddleware
│       │   ├── lib/              dice, lore, validators
│       │   ├── prompts/          system-v1.txt, chronicle-v1.txt, compression-v1.txt
│       │   └── db/               migrations, schemas Zod
│       └── CLAUDE.md             Règles backend
│
├── packages/
│   ├── shared/                   Types TS partagés
│   │   └── src/                  ⚠️ TODO refonte triptyque (cf. MEMORY)
│   ├── eslint-config/
│   └── prettier-config/
│
├── docs/
│   ├── 00-START-HERE.md          Point d'entrée IA
│   ├── public/                   Docs trackées et publiables
│   └── private/                  Canon, plans, assets et archives privés
│
├── CLAUDE.md                     Règles racine
└── turbo.json / pnpm-workspace.yaml
```

### Source de vérité produit

- **GDD canon Velkhar** : `docs/canon/` (25 fichiers Markdown, publics et versionnés)
- Toute divergence avec le GDD → le GDD gagne (cf. CLAUDE.md racine)

---

## §10 — Sécurité minimale V1

### Anti-DDoS / Anti-abus

- **Rate limiting Express** par IP : 60 req/min sur `/api/*` (sauf `/api/chronique/:slug` qui est plus permissif)
- **Rate limiting cookie** : 30 req/min par `grimoire_session` cookie
- **Anti-bot Chronique** : 1 Chronique max/cookie/IP/jour

### Validation inputs

- **Zod systématique** sur toutes les routes (body, query, params)
- **Sanitisation XSS** sur action libre joueur (DOMPurify côté backend avant insertion)
- **Échappement SQL** : Supabase client utilise toujours parameterized queries (jamais string concat)

### CORS

```
CORS_ORIGIN=https://grimoire.game,https://www.grimoire.game
```

Strict en prod, plus permissif en dev (`localhost:3000`).

### Secrets

- **Env vars** : jamais commités, `.env.local` git-ignored
- **Rotation** : OpenRouter API key tous les 6 mois ou si suspicion
- **Stockage** : Vercel/Railway secrets management (chiffré at-rest)

### Audit RGPD basique V1

- Cookie consent banner (cf. §5)
- Bouton "Effacer toutes mes données" dans profil (Phase D quand auth)
- Bouton "Effacer ma session anonyme" V1 (vide cookie + delete cascade `players`)
- Email contact `rgpd@grimoire.game` pour demandes manuelles
- Pas de cookies tiers V1 (pas de Google Analytics)

### Modération contenu

- **Filtre regex** post-IA sur termes blacklistés (slurs, contenus illégaux)
- **Bouton "Signaler"** sur chaque Chronique publique → mail Adem
- **Soft delete** sur Chronique signalée (URL 404 le temps de la revue)
- **Pas de modération automatique IA V1** — coût + faux positifs

---

## §11 — Ce qui est explicitement HORS V1

Documenté ici pour clarté :

| Fonctionnalité                                      | Phase prévue | Raison report                                    |
| --------------------------------------------------- | ------------ | ------------------------------------------------ |
| **Auth complète** (NextAuth, magic links, OAuth)    | Phase D      | Anonyme suffit pour valider produit V1           |
| **Billing Stripe** (subscription Premium)           | Phase D      | Pas de revenue avant validation produit          |
| **Notifications email/push**                        | Phase D      | Mails Adem-only V1 suffisent                     |
| **Modération automatique IA**                       | V1.1         | Coût + faux positifs                             |
| **Multi-univers** (extension Velkhar → autre monde) | V2           | Saturer Velkhar d'abord                          |
| **Monde partagé entre joueurs**                     | V2+          | Complexité disproportionnée vs valeur incertaine |
| **API publique tierce**                             | V2+          | Pas de demande, sécurité prioritaire             |
| **App mobile native**                               | V3+          | Web responsive V1 suffit                         |
| **PWA**                                             | V1.2         | Nice-to-have, pas critique                       |
| **i18n** (anglais, autres)                          | V2+          | Français-first, audience cible V1                |
| **Mode hors-ligne**                                 | Jamais       | Incompatible IA cloud                            |
| **Génération vocale narrative**                     | V3+          | Coût + complexité — texte-first assumé           |

---

## §12 — Synthèse (diagramme stack)

```
                ┌─────────────────────────────────────────┐
                │           UTILISATEUR (browser)         │
                └────────────────────┬────────────────────┘
                                     │ HTTPS
                                     ▼
                ┌─────────────────────────────────────────┐
                │  VERCEL  →  Next.js 15 frontend         │
                │  - React 19, Tailwind 4, Zustand        │
                │  - app/(home), (auth), (main), (game)   │
                │  - components/ui, lib/home-data         │
                │  - cookie HTTPOnly grimoire_session     │
                └────────────────────┬────────────────────┘
                                     │ /api/* proxy
                                     ▼
                ┌─────────────────────────────────────────┐
                │  RAILWAY  →  Express backend            │
                │  - sessionMiddleware (cookie → player)  │
                │  - capsMiddleware (request_logs)        │
                │  - gameEngine (TOUTE la logique)        │
                │  - memoryService (3 niveaux + pgvector) │
                │  - aiService (cascade OpenRouter)       │
                │  - chronicleService                     │
                └────────┬──────────────┬─────────────────┘
                         │              │
                ┌────────▼─────┐  ┌─────▼──────────────────────┐
                │  REDIS       │  │  OPENROUTER                │
                │  (Upstash)   │  │  - DeepSeek-V3.1 free      │
                │  N1 cache    │  │  - Llama 3.3 70B free      │
                │  intra-tour  │  │  - Qwen 2.5 72B free       │
                └──────────────┘  │  - Mistral Small free      │
                                  │  - (V2+ : Sonnet 4.6 Prem) │
                                  └────────────────────────────┘
                         │
                         ▼
                ┌─────────────────────────────────────────┐
                │  SUPABASE  →  PostgreSQL 16 + pgvector  │
                │  Tables : players, characters, runs,    │
                │  scenes, souvenirs, traces,             │
                │  world_events, chronicles, request_logs │
                │  Storage : illustrations + OG images    │
                └─────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  RÈGLES D'OR (rappel) :                                  │
  │  - Backend = source unique de vérité (stats, dés, lore)  │
  │  - AI = voix uniquement (validation Zod systématique)    │
  │  - Frontend = display only                               │
  │  - Caps via request_logs, fonctionne sans auth V1        │
  │  - Coût mensuel V1 : ~3-10€/mois total                   │
  └──────────────────────────────────────────────────────────┘
```

---

## §13 — Compléments Phase D : Auth, Billing & Notifications

> Cette section consolide l'auth complète, le billing Stripe, la file prioritaire Redis et les notifications email. Tout ce qui était _bolt-on hors V1_ en Phase C est ici décrit pour intégration.

### 13.1 — Auth complète (NextAuth.js)

**Choix V1 Phase D** : NextAuth.js avec **magic links email uniquement** (pas de mot de passe, pas d'OAuth initial — minimaliste solo dev).

#### Configuration NextAuth

```typescript
// apps/frontend/src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

export const authOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER, // SMTP Resend
      from: "GRIMOIRE <no-reply@grimoire.game>",
      maxAge: 24 * 60 * 60, // magic link valide 24h
    }),
  ],
  adapter: SupabaseAdapter({ url, secret }),
  session: { strategy: "database", maxAge: 90 * 24 * 60 * 60 }, // 90j
  callbacks: {
    async session({ session, user }) {
      // Rattacher account_id au cookie anonyme s'il existe
      session.account_id = user.id;
      session.tier = user.tier;
      return session;
    },
  },
};
```

#### Flow de rattachement anonyme → compte

1. Visiteur anonyme avec cookie `grimoire_session` → `players.anon_cookie` rempli, `account_id` NULL
2. Création de compte (magic link) → NextAuth crée row dans `accounts`
3. Backend détecte cookie présent + nouveau session → `UPDATE players SET account_id = $1, tier = 'free' WHERE anon_cookie = $2`
4. **Toutes les données anonymes (characters, runs, scenes, souvenirs, chronicles) restent rattachées** via `player_id` (la `players.account_id` mise à jour suffit)
5. Cookie `grimoire_session` reste actif (fallback si déconnexion future)

### 13.2 — Schéma DB additionnel Phase D

#### `accounts` (nouvelle table)

```sql
CREATE TABLE accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT UNIQUE NOT NULL,
  email_verified      TIMESTAMPTZ,
  tier                TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free','premium')),
  stripe_customer_id  TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  grace_until         TIMESTAMPTZ,                        -- 12 mois post-désabo Premium
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at       TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ                          -- soft delete RGPD
);

CREATE INDEX idx_accounts_email ON accounts(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_accounts_stripe_customer ON accounts(stripe_customer_id);
CREATE INDEX idx_accounts_tier ON accounts(tier);
```

#### `email_logs` (audit + déduplication)

```sql
CREATE TABLE email_logs (
  id              BIGSERIAL PRIMARY KEY,
  account_id      UUID REFERENCES accounts(id) ON DELETE CASCADE,
  template        TEXT NOT NULL,                          -- 'welcome', 'magic_link', 'purge_warning_m5', 'cancellation_grace', etc.
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status          TEXT NOT NULL,                          -- 'sent', 'failed', 'bounced'
  provider_id     TEXT                                    -- Resend message ID
);

CREATE INDEX idx_email_logs_account ON email_logs(account_id, sent_at DESC);
CREATE INDEX idx_email_logs_template ON email_logs(template, sent_at DESC);
```

#### Migration `players` Phase D

```sql
-- account_id existait déjà en V1 (NULL pour anonymes)
-- On rajoute juste un index unique partiel pour éviter doublons
CREATE UNIQUE INDEX idx_players_account_unique
  ON players(account_id) WHERE account_id IS NOT NULL;
```

### 13.3 — Billing Stripe (intégration complète)

#### Stack

- **Stripe Checkout** (page hostée) pour le paiement initial
- **Stripe Customer Portal** (page hostée) pour gestion abonnement (changement plan, désabo, mise à jour CB)
- **Stripe Tax** activé (TVA UE auto)
- **Webhooks** vers `/api/stripe/webhook` (backend Express)

#### Variables d'env

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_...   # 7,99€/mois
STRIPE_PRICE_PREMIUM_YEARLY=price_...    # 69€/an
```

#### Flow Checkout

```typescript
// apps/backend/src/routes/stripe.checkout.ts
async function createCheckoutSession(req, res) {
  const { account_id, plan } = req.body; // plan: 'monthly' | 'yearly'

  const account = await db.accounts.findById(account_id);

  const session = await stripe.checkout.sessions.create({
    customer: account.stripe_customer_id || undefined,
    customer_email: account.stripe_customer_id ? undefined : account.email,
    line_items: [
      {
        price:
          plan === "yearly"
            ? process.env.STRIPE_PRICE_PREMIUM_YEARLY
            : process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.FRONTEND_URL}/profile?upgrade=success`,
    cancel_url: `${process.env.FRONTEND_URL}/profile?upgrade=cancel`,
    automatic_tax: { enabled: true },
    metadata: { account_id },
    subscription_data: { metadata: { account_id } },
  });

  res.json({ checkout_url: session.url });
}
```

#### Webhook Stripe

```typescript
// apps/backend/src/routes/stripe.webhook.ts
async function handleStripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const accountId = sub.metadata.account_id;
      const tier = sub.status === "active" ? "premium" : "free";
      const graceUntil =
        sub.status === "canceled" ? addMonths(new Date(), 12) : null;

      await db.accounts.update(accountId, {
        tier,
        stripe_subscription_id: sub.id,
        stripe_customer_id: sub.customer,
        grace_until: graceUntil,
      });
      await db.players.updateByAccount(accountId, { tier });

      if (event.type === "customer.subscription.created") {
        await sendEmail(accountId, "welcome_premium");
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const accountId = sub.metadata.account_id;
      const graceUntil = addMonths(new Date(), 12);

      await db.accounts.update(accountId, {
        tier: "free",
        grace_until: graceUntil,
      });
      await db.players.updateByAccount(accountId, { tier: "free" });
      await sendEmail(accountId, "cancellation_grace");
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const accountId = await getAccountIdFromCustomer(invoice.customer);
      await sendEmail(accountId, "payment_failed");
      // Stripe retry auto 3x avant cancellation
      break;
    }
  }

  res.json({ received: true });
}
```

#### Sécurité webhook

- Signature Stripe vérifiée systématiquement
- Endpoint en POST uniquement
- Rate limit Express (10 req/min, c'est largement assez)
- Logs sur chaque event (`stripe_events` table optionnelle pour audit V1.1)

### 13.4 — File prioritaire Redis (queue jump Premium)

#### Architecture

Au lieu d'appeler OpenRouter directement depuis `aiService.callWithCascade`, le service **enqueue** dans Redis. Un worker pop selon priorité.

```typescript
// apps/backend/src/services/aiQueue.ts
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

const redis = new Redis(process.env.UPSTASH_REDIS_URL);
const aiQueue = new Queue("ai-calls", { connection: redis });

export async function enqueueAICall(
  prompt: string,
  options: AIOptions & { player_id: string; tier: "anon" | "free" | "premium" },
): Promise<AIResponse> {
  const priority = options.tier === "premium" ? 1 : 5; // BullMQ : plus bas = prioritaire

  const job = await aiQueue.add(
    "ai-call",
    { prompt, options },
    {
      priority,
      attempts: 1, // Pas de retry — la cascade interne gère
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  );

  // Await le résultat
  return await job.waitUntilFinished(redis, 15000); // 15s timeout
}

// Worker (process séparé ou même backend selon scale)
new Worker(
  "ai-calls",
  async (job) => {
    const { prompt, options } = job.data;
    return await aiService.callWithCascade(prompt, options);
  },
  {
    connection: redis,
    concurrency: 10, // 10 appels IA parallèles max
  },
);
```

#### Comportement saturation

- 10 worker concurrents → file file up si > 10 appels simultanés
- **Premium** : priorité 1 → pop en premier → quasi-jamais en file
- **Gratuit + Anonyme** : priorité 5 → si Premium attendent, ils passent après
- Frontend reçoit après `waitUntilFinished` (timeout 15s sinon erreur structurée)
- Si timeout 15s → message _"GRIMOIRE est très populaire ce soir, Premium = pas d'attente"_ (CTA conversion pour gratuit/anonyme uniquement)

#### Monitoring queue

- **Métriques Redis** : longueur file par priorité, latence moyenne pop
- **Alerte mail Adem** : si file > 50 jobs en attente > 5 min → mail (signal saturation)

### 13.5 — Notifications email (Resend)

#### Stack

- **Provider** : Resend (free tier 3 000 emails/mois, $20/mois si dépassement)
- **Fallback** : SES (Amazon) si volume > 50k/mois (V2+)
- **Templates** : React Email (composants TSX) compilés en HTML

#### Templates V1 Phase D

| Template                          | Trigger                                      | Délai        |
| --------------------------------- | -------------------------------------------- | ------------ |
| `magic_link`                      | Demande de connexion                         | Instantané   |
| `welcome_account_created`         | Création compte gratuit                      | Instantané   |
| `welcome_premium`                 | Webhook subscription.created                 | Instantané   |
| `cancellation_grace`              | Webhook subscription.deleted                 | Instantané   |
| `purge_warning_m5`                | Cron : M+5 mois sans activité gratuit        | Mensuel cron |
| `purge_warning_m10_premium_grace` | Cron : M+10 grâce Premium                    | Mensuel cron |
| `purge_executed`                  | Cron : M+6 (gratuit) ou M+12 (premium grâce) | Mensuel cron |
| `payment_failed`                  | Webhook invoice.payment_failed               | Instantané   |
| `subscription_renewed_yearly`     | Webhook subscription updated annuel          | Annuel       |

#### Cron jobs Phase D

```typescript
// apps/backend/src/cron/purge-warnings.ts
// Exécuté quotidiennement (Railway cron ou Vercel cron)

async function sendPurgeWarnings() {
  // M+5 gratuit
  const m5Free = await db.accounts.findInactive("free", 5, 6);
  for (const acc of m5Free) {
    if (!(await emailSentRecently(acc.id, "purge_warning_m5", 30))) {
      await sendEmail(acc.id, "purge_warning_m5");
    }
  }

  // M+10 Premium grâce
  const m10Premium = await db.accounts.findInGracePeriod(10, 11);
  for (const acc of m10Premium) {
    if (
      !(await emailSentRecently(acc.id, "purge_warning_m10_premium_grace", 30))
    ) {
      await sendEmail(acc.id, "purge_warning_m10_premium_grace");
    }
  }
}

async function executePurges() {
  // M+6 gratuit
  const m6Free = await db.accounts.findInactive("free", 6, null);
  for (const acc of m6Free) {
    await db.players.softDeleteByAccount(acc.id); // soft delete cascade
    await sendEmail(acc.id, "purge_executed");
  }

  // M+12 Premium grâce
  const m12Premium = await db.accounts.findInGracePeriodExpired();
  for (const acc of m12Premium) {
    // Bascule en mode gratuit standard, purge selon règles gratuit
    await db.accounts.update(acc.id, { grace_until: null });
    // Datas restent (joueur peut revenir en gratuit) — purge si inactif 6 mois après
  }
}
```

### 13.6 — RGPD complet Phase D

#### Endpoints

| Route                                          | Description                                                                                                                   |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/account/me/export`                   | Export JSON complet des données du compte (players, characters, runs, scenes, souvenirs, chronicles, request_logs anonymisés) |
| `DELETE /api/account/me`                       | Soft delete account + cascade soft delete sur `players.account_id = X`                                                        |
| `POST /api/account/me/chronicle/:id/unpublish` | Retire Chronique de l'URL publique sans supprimer la donnée                                                                   |

#### Hard delete (cron mensuel)

- Comptes soft-deleted depuis > 30j → hard delete cascade DB
- Logs Stripe conservés (obligation comptable EU 10 ans)

#### Page mentions légales

- `/legal/cgu`, `/legal/privacy`, `/legal/cookies` — pages statiques générées au build
- Lien footer obligatoire

---

## §14 — Diagramme stack Phase D (mis à jour)

```
                ┌─────────────────────────────────────────┐
                │           UTILISATEUR (browser)         │
                └────────────────────┬────────────────────┘
                                     │ HTTPS
                                     ▼
                ┌─────────────────────────────────────────┐
                │  VERCEL  →  Next.js 15 frontend         │
                │  - NextAuth magic links                 │
                │  - Stripe Checkout/Portal redirects     │
                │  - cookie HTTPOnly grimoire_session     │
                └────────────────────┬────────────────────┘
                                     │ /api/* proxy
                                     ▼
                ┌─────────────────────────────────────────┐
                │  RAILWAY  →  Express backend            │
                │  - sessionMiddleware (cookie + account) │
                │  - capsMiddleware                       │
                │  - gameEngine, memoryService            │
                │  - aiQueue (enqueue Redis priority)     │
                │  - chronicleService                     │
                │  - stripeWebhookHandler                 │
                │  - cron purges + warnings               │
                └────┬──────────┬─────────────┬───────────┘
                     │          │             │
              ┌──────▼─────┐ ┌──▼──────────┐ ┌▼─────────────┐
              │ REDIS      │ │ OPENROUTER  │ │ STRIPE       │
              │ (Upstash)  │ │ cascade     │ │ - Checkout   │
              │ - N1 cache │ │ free tier   │ │ - Portal     │
              │ - aiQueue  │ │             │ │ - Webhooks   │
              │   priority │ │             │ │ - Tax        │
              │   high/    │ └─────────────┘ └──────────────┘
              │   normal   │
              └────────────┘
                     │
                     ▼
                ┌─────────────────────────────────────────┐
                │  SUPABASE  →  Postgres 16 + pgvector    │
                │  - players (anon + account)             │
                │  - accounts (NEW Phase D)               │
                │  - characters, runs, scenes             │
                │  - souvenirs, traces, world_events      │
                │  - chronicles, request_logs             │
                │  - email_logs (NEW Phase D)             │
                └─────────────────────────────────────────┘
                     │
                     ▼
                ┌─────────────────────────────────────────┐
                │  RESEND  →  emails transactionnels      │
                │  - magic_link, welcome, purge warnings  │
                │  - payment_failed, cancellation_grace   │
                └─────────────────────────────────────────┘
```

---

## §15 — Coût mensuel V1 + Phase D (mis à jour)

| Service         | V1 (Phase C)    | V1 + Phase D                              |
| --------------- | --------------- | ----------------------------------------- |
| Vercel          | 0€              | 0€                                        |
| Railway/Fly.io  | 0-5€            | 0-5€                                      |
| Supabase        | 0€              | 0€ (jusqu'à 500MB)                        |
| Upstash Redis   | 0€              | 0€ (10k cmds/jour suffit)                 |
| OpenRouter      | 0€              | 0€ (free tier)                            |
| Stripe          | —               | 1,4% + 0,25€/transaction (déduit revenus) |
| Resend          | —               | 0€ (3000 emails/mois)                     |
| Domaine `.game` | ~3€/mois        | ~3€/mois                                  |
| **TOTAL**       | **~3-10€/mois** | **~3-10€/mois + ~3% fees Stripe**         |

→ Break-even reste à ~2 Premium actifs (cf. [19-MONETIZATION §9.3](19-MONETIZATION.md)).

---

## §16 — Migrations DB Phase D (séquence d'application)

```sql
-- Migration 001 : créer accounts + email_logs
CREATE TABLE accounts (...);
CREATE TABLE email_logs (...);

-- Migration 002 : index unique players.account_id
CREATE UNIQUE INDEX idx_players_account_unique
  ON players(account_id) WHERE account_id IS NOT NULL;

-- Migration 003 : ajouter colonnes Stripe sur accounts (déjà dans CREATE)
-- (idempotent : seulement si pas créées en 001)

-- Migration 004 : seed templates email_logs (référentiel)
INSERT INTO email_templates (name, subject_fr, body_template_url) VALUES (...);
```

**Stratégie de déploiement** :

1. Déployer migrations (zero-downtime, tables additionnelles)
2. Déployer backend Phase D (NextAuth + Stripe webhook + Redis queue)
3. Déployer frontend Phase D (page upgrade, Stripe redirect)
4. Tester en staging avec Stripe test mode
5. Activer Stripe live mode après validation
6. Communiquer aux joueurs anonymes existants (mail si jamais opt-in préalable, sinon banner UI)

---

## Références croisées Phase D (complétées)

- ✅ **Auth complète** : §13.1 + §13.2 ci-dessus
- ✅ **Billing Stripe** : §13.3 ci-dessus + [19-MONETIZATION §7](19-MONETIZATION.md)
- ✅ **File prioritaire Redis** : §13.4 ci-dessus + [19-MONETIZATION §2.2](19-MONETIZATION.md)
- ✅ **Notifications email** : §13.5 ci-dessus + [18-RETENTION §2.3](18-RETENTION.md)
- ✅ **RGPD complet** : §13.6 ci-dessus
- → **Dashboard admin UI custom** : V2+ si Adem délègue à un narrative designer

---

_Fichier 20 — Architecture V1 (Phase C) + Compléments Phase D — `Architecture complète` consolidée._
_Phase C ✅ + Phase D ✅. Prochaine étape : mise à jour `_STATUS.md`._
