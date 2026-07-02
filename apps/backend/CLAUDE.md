# Backend — Règles spécifiques Express + Game Engine (Velkhar)

> Règles globales : `~/.claude/CLAUDE.md`. **Contexte projet : `docs/00-START-HERE.md`** (à lire en premier).
> Architecture : [`docs/03-tech/TECH_STACK.md`](../../docs/03-tech/TECH_STACK.md). Source de vérité produit : `docs/raw/` (GDD Velkhar, gitignored) — voir [`docs/wiki/index.md`](../../docs/wiki/index.md).

## Scope

Travailler UNIQUEMENT dans `apps/backend/`. Ne jamais modifier de fichiers en dehors sauf `packages/shared/` pour les types (ajouter d'abord là-bas — ⚠️ **TODO post-sync : refonte triptyque**).

## Projet

**GRIMOIRE — Of Ash and Salt**, monde de **Velkhar** (dark fantasy désertique). Roguelike narratif : run 3-15h, 4 vocations, hub permanent = Auberge de **L'Aveugle**.

## Principe fondamental

**Backend = Game Master. AI = voix uniquement (via OpenRouter).**

Le backend possède toutes les règles (triptyque SANG/SOUFFLE/CENDRE), les dés (d20 aux pivots seulement), l'inventaire, le world-state, le lore Velkhar, et le hub L'Aveugle. L'IA écrit la prose — elle ne prend aucune décision. `dice.ts` est la seule autorité pour les résultats.

---

## Architecture

```
src/
├── routes/                          # thin controllers → délèguent aux services
├── services/
│   ├── game-engine.service.ts       # orchestrateur central
│   ├── world-state.service.ts       # emergent canon (NPCs, facts, flags, Calamine clock)
│   ├── memory.service.ts            # retrieval top-K via pgvector
│   ├── lore.service.ts              # Fixed Canon Velkhar, anti-contradiction
│   └── aveugle.service.ts           # ⚠️ à créer — hub L'Aveugle (dialogue, Souvenirs, artefacts)
├── ai/
│   ├── openrouter.provider.ts       # ⚠️ à créer — routeur unique OpenRouter (remplace providers/)
│   ├── provider-chain.ts            # fallback chain via OpenRouter
│   ├── context-builder.ts           # ⚠️ adapter au triptyque
│   ├── scene-prompt.builder.ts
│   ├── intent-analyzer.ts           # ⚠️ free-action → { sang|souffle|cendre, difficulty }
│   ├── output-parser.ts
│   ├── scene-validator.ts           # ⚠️ canon Velkhar + triptyque + 4 quêtes ouvertes
│   └── ooc.service.ts
├── game-rules/
│   ├── dice.ts                      # ⚠️ d20 aux pivots seulement, PV = 10 + SANG
│   ├── stats.ts                     # ⚠️ triptyque SANG/SOUFFLE/CENDRE
│   ├── combat.ts                    # ⚠️ adapter au triptyque
│   ├── inventory.ts
│   ├── consequences.ts              # ⚠️ inclure calamine, souvenirsGagnes
│   └── survie.ts                    # ⚠️ à créer — faim/soif/fatigue/calamine
├── lore/
│   └── velkhar/                     # ⚠️ à créer (remplace valorain/)
│       ├── velkhar.canon.ts         # Fixed Canon principal (Archontes, Cendre, Calamine)
│       ├── world-bible.ts           # Makhzen, régions
│       ├── factions.ts              # Culte, Guilde du Sel, Main d'Ombre, Éveilleurs
│       ├── bestiaire.ts             # 18 créatures, Calcinés au centre
│       ├── aveugle.ts               # L'Aveugle — dialogues, Souvenirs, lore prix
│       └── vocations.ts             # Marcheur/Lame/Veilleur/Tisse-Verbe + bonus
├── middleware/                      # auth, error, validation, rate-limit (per-player)
└── config/                          # env, supabase client, openrouter
```

---

## Règles absolues

- Zod validation sur **toutes** les routes (boundary enforcement)
- Réponses API : `{ success: boolean, data?: T, error?: string }`
- **Per-player rate-limit** sur les actions IA (GDD L17 — pas de spam drainant le quota partagé)
- **1-2 appels IA par tour max** (GDD L17)
- Output IA → toujours validé par `scene-validator` avant stockage
- Fixed Canon Velkhar (`lore/velkhar/`) → jamais contredit
- Types partagés dans `@grimoire/shared`, jamais dupliqués
- **`dice.ts` est la seule autorité** pour les résultats

---

## Prisma + Supabase

- Prisma = ORM unique — jamais de raw SQL dans les services
- Admin client pour les opérations serveur
- User client pour les requêtes protégées par RLS
- pgvector embeddings sur `WorldNpc`, `WorldFact`, `Artefact`

### Modèle Character (⚠️ TODO post-sync)

Le `Character` actuel utilise encore les anciens champs (FOR/AGI/INT/CHA/CHANCE, classes D&D, peuples Valorain). À refondre au triptyque Velkhar :

```prisma
model Character {
  id         String  @id @default(cuid())
  userId     String
  runId      String  @unique

  // Identité
  name       String
  epithet    String?
  pronouns   String
  pitch      String?

  // Vocation + peuple
  vocation   String  // 'marcheur-sel' | 'lame-ombre' | 'veilleur' | 'tisse-verbe' | 'libre'
  peuple     String  // 'sahelin' | 'rivain' | 'therien' | 'cendreur' | 'changepeau'

  // Triptyque (mod −3 à +4 après bonus racial)
  sang       Int @default(0)
  souffle    Int @default(0)
  cendre     Int @default(0)

  // Survie
  pvMax      Int @default(10)
  pv         Int @default(10)
  faim       Int @default(100)
  soif       Int @default(100)
  fatigue    Int @default(0)
  calamine   Int @default(0)

  // Monnaies
  or         Int @default(0)   // in-game, perdu à la mort
  souvenirs  Int @default(0)   // méta, persiste cross-run

  // Lore
  backstory  String?
  traits     String[]
  bond       String?
  flaw       String?

  // Sécurité
  safetyViolence String @default("ok")
  safetyDark     String @default("ok")
  safetyHorror   String @default("veil")
  safetyRomance  String @default("veil")
  safetyBetray   String @default("ok")

  sessions   Session[]
  createdAt  DateTime @default(now())
}
```

---

## AI Fallback Chain via OpenRouter

```
OpenRouter (routeur unique) :
  dev → anthropic/claude-3.5-sonnet
  prod gratuit → google/gemini-flash-1.5 → mistralai/mistral-7b-instruct → safety scene
  premium → claude/gpt (config)
```

**Jamais de hard-crash** — la safety scene est toujours le dernier recours.

`OPENROUTER_API_KEY` est la seule clé AI à gérer.

---

## L'Aveugle — Hub roguelike (⚠️ service à créer)

`aveugle.service.ts` gère :

| Méthode                             | Endpoint                             | Rôle                                 |
| ----------------------------------- | ------------------------------------ | ------------------------------------ |
| `getGreeting(runNumber, character)` | `GET /api/aveugle/dialogue`          | Première salutation personnalisée    |
| `askLore(question, context)`        | `POST /api/aveugle/ask`              | Question lore du joueur              |
| `getSouvenirsShop(characterId)`     | `GET /api/aveugle/souvenirs`         | Liste lore avec prix en Souvenirs    |
| `buyLore(souvenirsCost, loreType)`  | `POST /api/aveugle/buy`              | Échange atomique                     |
| `explainArtefact(artefactId)`       | `POST /api/aveugle/artefact-explain` | Explication artefact (calamine cost) |
| `quitAuberge(characterId)`          | `POST /api/aveugle/quit`             | Démarre le run                       |

**Règles L'Aveugle (GDD L8)** :

- Vend **uniquement** du lore (jamais d'équipement)
- Source unique des Souvenirs méta
- L'Aveugle explique les artefacts rapportés
- Lieu de tutoriel implicite (pas de tuto popup)

---

## Tests — Stratégie

> ⚠️ **TODO post-sync** : les tests actuels de `dice.ts` + `scene-validator.ts` doivent être **réécrits au triptyque Velkhar** — **hors scope de cette passe doc**.

### Quoi tester (Vitest — unitaire) — quand réécrits

- **`dice.ts`** : triptyque SANG/SOUFFLE/CENDRE + PV = 10 + SANG + d20 aux pivots + critiques (nat 1, nat 20) + modificateurs (faim, soif, fatigue, flaws)
- **`scene-validator.ts`** : scènes valides, trop courtes, trop longues, < 4 choix, > 4 choix, contradictions canon Velkhar (magie = artefacts seulement, pas de résurrection)
- **`output-parser.ts`** : JSON valide, JSON malformé, schema Zod invalide
- **`lore.service.ts`** : assertions Fixed Canon Velkhar (Archontes, Cendre, Calamine, 4 quêtes ouvertes non canoniques)
- **`intent-analyzer.ts`** : classification d'action libre → `{ sang|souffle|cendre, difficulty }`
- **`aveugle.service.ts`** : logique d'échange Souvenirs ↔ lore, exclusion équipement
- **Utilitaires purs** dans `game-rules/`

### Quoi tester (Vitest — intégration)

- **`game-engine.service.ts`** : per-turn loop complet avec mocks AI provider (OpenRouter)
- **Routes** : avec supertest — happy path + validation Zod erreurs
- **`memory.service.ts`** : retrieval pgvector avec seed data
- **Routes L'Aveugle** : `/api/aveugle/*`

### Quoi ne PAS tester

- Providers AI externes (mock `AIProvider` interface + mock OpenRouter)
- Supabase directement (mock le client)
- Logique de prose/narration (c'est le rôle de l'AI)

### Convention de nommage

```
src/
├── config/         # Environment & Supabase config
├── middleware/      # Express middlewares (auth, error, validation)
├── routes/         # Thin controllers (delegate to services)
├── services/       # Business logic
├── ai/             # AI provider abstraction & prompt building
├── game-rules/     # Combat, leveling, inventory rules
└── database/       # Migrations & queries
```

## Rules

```bash
pnpm test --filter @grimoire/backend
pnpm test:coverage --filter @grimoire/backend
pnpm type-check --filter @grimoire/backend
```

### Coverage cible (quand tests réécrits)

- `game-rules/` : 100% (logique de jeu critique)
- `ai/output-parser.ts`, `ai/scene-validator.ts` : 100%
- `services/aveugle.service.ts` : 100%
- Services : ≥ 80%
- Routes : ≥ 70% (happy path + erreurs Zod)

---

## Variables d'environnement requises

Voir `.env.example` à la racine du projet.

**Simplification post-sync** :

- ⚠️ Retirer `GEMINI_API_KEY`, `MISTRAL_API_KEY`, `CLAUDE_API_KEY`
- ✅ Ajouter **`OPENROUTER_API_KEY`** (clé unique)

---

## Après chaque tâche

1. `pnpm type-check --filter @grimoire/backend` → zéro erreur
2. `pnpm test --filter @grimoire/backend` → tous les tests passent (quand réécrits)
3. `pnpm dev --filter @grimoire/backend` → serveur démarre sur port 3001
