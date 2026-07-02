# Tech Stack & Implementation — GRIMOIRE / Velkhar

**Version** : 4.0 (Velkhar-aligned — triptyque SANG/SOUFFLE/CENDRE, OpenRouter, L'Aveugle hub)
**Scope of this doc** : The **HOW** — stack, architecture, conventions, lore/memory engine (the moat), AI integration via OpenRouter, data contracts, validation, security, and technical specs. For the **WHAT** (vision, world of Velkhar, vocations, UI look, narrative standards), see `GAME_DESIGN.md`. For current status, see `MEMORY.md`.

> **Source de vérité produit** : `docs/raw/` (GDD Velkhar, 25 fichiers, gitignored — physiquement dans le repo). En cas de divergence → `docs/raw/` gagne. Index : [`docs/wiki/index.md`](../wiki/index.md).

> **The one idea to internalize** : the AI has _no_ memory and makes _no_ decisions. The **backend** holds the rules, the dice, and the world's memory, and feeds the AI a fresh, complete dossier every turn. The AI only writes prose. That is what makes the Game Master reliable — and it's the entire competitive moat.

---

## 1. Stack Overview

### Monorepo

- **Turborepo** + pnpm workspaces (pnpm 9.15.0)
- `apps/frontend/` — Next.js 15 (App Router), display-only, proxy API
- `apps/backend/` — Express (game engine, dice, memory, AI orchestration via OpenRouter)
- `packages/shared/` — shared types & constants (`@grimoire/shared`) — ⚠️ **TODO refonte triptyque**
- `packages/eslint-config`, `packages/prettier-config`

### Frontend

| Concern       | Choice                                               |
| ------------- | ---------------------------------------------------- |
| Framework     | Next.js 15 (App Router)                              |
| Language      | TypeScript (strict)                                  |
| Styling       | Tailwind CSS 4                                       |
| Client state  | Zustand                                              |
| Server data   | React Query                                          |
| Forms         | React Hook Form + Zod                                |
| Animations    | Framer Motion                                        |
| 3D dice (D20) | `@react-three/fiber` + `@react-three/drei` (Phase 3) |
| HTTP          | Axios (via proxy route)                              |

### Backend

| Concern    | Choice                                                                                |
| ---------- | ------------------------------------------------------------------------------------- |
| Runtime    | Node.js 20 + Express 4                                                                |
| Language   | TypeScript (strict)                                                                   |
| ORM        | Prisma (⚠️ aspirationnel — pas encore installé, `package.json` n'a pas la dépendance) |
| Auth       | JWT + bcryptjs                                                                        |
| Validation | Zod                                                                                   |
| Logging    | Pino                                                                                  |
| Security   | Rate limiting, CORS, Helmet                                                           |

### Database

- **PostgreSQL** via **Supabase** (Auth + Storage). Use **pgvector** for NPC/lore/artefact retrieval (§3.4).

### AI — OpenRouter routeur, free-to-run, jamais de self-hosted LLM

**Principe : si tu peux _appeler_ un LLM via API, jamais _l'héberger_.** Héberger un modèle = GPU (cher). Appeler une API = gratuit dans les quotas.

- **Routeur unique** : **OpenRouter** (`https://openrouter.ai/`) — une seule intégration, plusieurs modèles derrière. La clé API OpenRouter (`OPENROUTER_API_KEY`) permet d'accéder à Claude (dev/premium), Gemini Flash (prod gratuit), Mistral (fallback gratuit), etc.
- **Config-driven** : l'ordre des modèles dans la chaîne de fallback est dans la config, jamais hard-codé.
- **Dev** : Claude via OpenRouter (qualité max pour développer/tuner les prompts).
- **Prod gratuit** : chaîne `Gemini Flash → Mistral → safety scene` — le routeur OpenRouter somme les quotas et tombe sur le suivant quand l'un sature.
- **Premium** : Claude/GPT en prod — une ligne de config change la chaîne.
- **Output** : structured JSON only, enforced par chaque provider via le mode `response_format` d'OpenRouter, puis validé (§5, §7).
- **Context** : rebuilt every turn from the backend's world-state (§3), never "remembered" by the model.
- **Quality lever on free models** : system prompt fort + **few-shot** (1-2 example scenes) bat tout autre tuning.

> Ollama reste **optionnel, dev-only/offline** (petit modèle sur laptop). **Pas** dans l'architecture production.

---

## 2. Project Structure

```
grimoire/
├── apps/frontend/          # Next.js 15 (display-only)
├── apps/backend/           # Express (Game Master: rules + memory + AI orchestration via OpenRouter)
└── packages/shared/        # @grimoire/shared types & constants
```

### Frontend (`apps/frontend/src/`)

> ⚠️ **TODO post-sync** : routing à refactor de `valorain/` vers `velkhar/`. Designs hi-fi non produits — suivre design tokens désertiques GDD §7.

Routes (à migrer vers Velkhar) :

```
app/
├── (home)/
│   ├── page.tsx                          # Landing GRIMOIRE (dark fantasy désertique)
│   └── _components/
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (main)/
│   ├── velkhar/                          # ⚠️ à créer (remplace valorain/)
│   │   ├── campaign/[campaignId]/page.tsx
│   │   ├── world/page.tsx                # Carte du Makhzen
│   │   ├── character-create/page.tsx     # Forge — 4 vocations OU concept libre
│   │   ├── aveugle/page.tsx              # Auberge de L'Aveugle (hub roguelike)
│   │   └── settings/page.tsx
│   └── leaderboard/page.tsx
├── (game)/
│   └── velkhar/
│       ├── session/[sessionId]/page.tsx  # Session de jeu (main screen)
│       └── session/end/page.tsx          # Fin de run + Chronique export
├── api/[...path]/route.ts                # proxy — ALL frontend API calls go here
└── layout.tsx
```

Composants spécifiques L'Aveugle (à créer) :

```
components/
├── aveugle/
│   ├── AubergeScene.tsx            # image plein écran + ambiance
│   ├── AveugleDialogue.tsx         # bulle de dialogue + salutation IA
│   ├── VocationPicker.tsx          # 4 vocations OU concept libre
│   ├── ConceptLibreInput.tsx       # textarea pour concept écrit
│   ├── SouvenirsExchange.tsx       # échange Souvenirs ↔ lore (run ≥ 2)
│   └── ArtefactExplanation.tsx     # explication artefacts rapportés
```

Composants génériques `ui/` (palette désertique GDD §7) :

```
components/ui/
├── Button, Card, Input, Modal, Tabs, Badge, Toast, Divider, StatBar, Stepper
├── Heading, StatItem, NavLink, IconButton, Section, PageShell, NavBar, Footer
├── SmokeBackground, CompassRose, MapAtmosphere  # atmosphère Velkhar
└── StatBar (3 variantes : SANG, SOUFFLE, CENDRE) ⚠️ à adapter au triptyque
```

Hooks (`apps/frontend/src/hooks/`) :

```
useGameState        # sessionState
useCharacter        # fetches chars (scope = userId, Velkhar only — pas multi-univers)
useSession          # fetches session for char
useAveugle          # dialogue IA + échange Souvenirs
useDiceRoll         # d20 aux pivots
useChronicle        # export markdown
```

> **Règle colocation Next.js 15** : `_components/` (underscore) = privé à sa route, exclu du routing. `components/ui/` = composants réutilisables.
>
> **Règle accessibilité** : tous les composants `ui/` exposent les props aria nécessaires. `IconButton.label` est obligatoire.
>
> **Règle SSR hydration** : pour toute valeur aléatoire, utiliser `useState([]) + useEffect` — jamais `useRef(Math.random())`.

### Backend (`apps/backend/src/`)

```
routes/                          # thin controllers → delegate to services
services/
├── game-engine.service.ts       # orchestrator: assembles context → AI → validates → applies
├── world-state.service.ts       # emergent canon: NPCs, facts, artefacts, Cendre clock
├── memory.service.ts            # pgvector retrieval top-K
├── lore.service.ts              # Fixed Canon Velkhar, anti-contradiction
└── aveugle.service.ts           # ⚠️ à créer — hub L'Aveugle (dialogue, Souvenirs, artefacts)
ai/
├── openrouter.provider.ts       # ⚠️ à créer — routeur unique OpenRouter (remplace providers/)
├── provider-chain.ts            # fallback chain (Gemini Flash → Mistral → safety scene)
├── context-builder.ts
├── scene-prompt.builder.ts
├── intent-analyzer.ts           # free-action → { sang|souffle|cendre, difficulty }
├── output-parser.ts             # JSON + Zod
└── scene-validator.ts           # canon Velkhar + triptyque ⚠️ à adapter
game-rules/
├── dice.ts                      # ⚠️ d20 aux pivots seulement, PV = 10 + SANG
├── stats.ts                     # ⚠️ triptyque SANG/SOUFFLE/CENDRE
├── combat.ts, inventory.ts, consequences.ts, survie.ts (faim/soif/fatigue/calamine)
lore/
└── velkhar/                     # ⚠️ à créer (remplace valorain/)
    ├── velkhar.canon.ts         # Fixed Canon principal
    ├── world-bible.ts           # Makhzen, régions
    ├── factions.ts              # Culte, Guilde du Sel, Main d'Ombre, Éveilleurs
    ├── bestiaire.ts             # 18 créatures, Calcinés au centre
    ├── aveugle.ts               # L'Aveugle — dialogues, Souvenirs, artefacts
    └── vocations.ts             # Marcheur/Lame/Veilleur/Tisse-Verbe
middleware/                      # auth, error, validation, rate-limit
config/                          # env, supabase client, openrouter
index.ts                         # Express entry point
```

---

## 3. The Lore & Memory Engine (the moat) 🧠

Single most important system. **Both** the lore engine and the memory engine — they are the same thing. Two layers.

### 3.1 Layer 1 — Fixed Canon (Velkhar, hand-written, small, inviolable)

Structured, read-only constitution of Velkhar the AI may never contradict. Lives in `lore/velkhar/velkhar.canon.ts`. **Source de vérité = `docs/raw/`** :

- `02-WORLD-BIBLE.md` — Cosmologie, Archontes, magie unifiée (artefacts → Cendre → Calamine)
- `03-FACTIONS.md` — Culte, Guilde du Sel, Main d'Ombre, Éveilleurs (4 majeures + 5-6 mineures)
- `03-BESTIARY.md` — 18 créatures, **Calcinés au centre** (GDD L4)
- `04-ATTRIBUTES.md` — Triptyque SANG/SOUFFLE/CENDRE
- `05-VOCATIONS.md` — 4 vocations V1 + V2

```typescript
interface FixedCanon {
  worldLaws: string[]; // magie = artefacts, mort définitive, Cendre corrupte, etc.
  cataclysm: string; // UN événement : Archontes ont forgé les artefacts, magie a débordé
  regions: Region[]; // Makhzen (continent désertique) — référencé GDD §02
  factions: Faction[]; // 4 majeures + 5-6 mineures
  creatures: Creature[]; // bestiaire avec Calcinés au centre
  aveugle: AveugleData; // dialogues, Souvenirs, artefacts
  tone: "dark-fantasy-desert";
  openQuests: ["pouvoir", "verite", "survie", "destruction"]; // aucune canonique
}
```

Relevant slices injected into **every** prompt system section. `lore.service.ts` exposes `getCanonForPrompt()` and `assertNoContradiction(scene)` used by the validator (§7.3).

### 3.2 Layer 2 — Emergent Canon (AI creates, backend freezes)

When the MJ invents anything (NPC, promise, artefact trouvé, faction retournée), `world-state.service.ts` records it as permanent canon for that run. Next time it's relevant, it comes from DB, not model imagination.

**Persisted per session** (Prisma models, sketch — ⚠️ TODO post-sync) :

```prisma
model Character {
  id         String  @id @default(cuid())
  userId     String
  runId      String  @unique

  // Identité
  name       String
  epithet    String?
  pronouns   String  // 'il' | 'elle' | 'iel'
  pitch      String? // concept libre si pas de vocation

  // Vocation
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
  calamine   Int @default(0)  // 0-100, monte avec usage magique

  // Méta (à remplir entre runs)
  souvenirs  Int @default(0)  // monnaie méta — 1 gratuit/run + bonus
  or         Int @default(0)  // monnaie in-game — perdu à la mort

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

model Artefact {
  id          String  @id @default(cuid())
  sessionId   String
  name        String
  origin      String  // "archonte" | "éveillé"
  awakened    Boolean @default(false)  // seul Tisse-Verbe peut éveiller
  calamineCost Int    @default(0)
  embedding   Unsupported("vector")?
}

model WorldNpc {
  id          String  @id @default(cuid())
  sessionId   String
  name        String
  role        String
  personality String
  affinity    Int     @default(0)
  lastSeenScene Int
  facts       String[]
  isAveugle   Boolean @default(false)  // L'Aveugle = hub, persiste cross-run
  embedding   Unsupported("vector")?
}

model WorldFact {
  id        String @id @default(cuid())
  sessionId String
  kind      String  // "consequence" | "promise" | "discovery" | "faction" | "artefact_found"
  text      String
  sceneCreated Int
  active    Boolean @default(true)
  embedding Unsupported("vector")?
}

model WorldClock {
  sessionId        String @id
  calamineLevel    Int @default(0)  // monte avec usage magique, déclenche événements
  villagesLost     Int @default(0)
  scenesElapsed    Int @default(0)
  currentRegion    String
}
```

> ⚠️ **TODO post-sync** : la `model Character` actuelle dans `apps/backend/prisma/schema.prisma` utilise encore les anciens champs (FOR/AGI/INT/CHA/CHANCE, classes D&D, peuples Valorain). À refondre au triptyque — **hors scope de cette passe doc**.

### 3.3 The per-turn loop (how a scene is produced)

```
1. Player submits a choice OR a free action.
2. game-engine.service:
   a. If free action → intent-analyzer → { stat: sang|souffle|cendre, difficulty }
   b. dice.ts resolves the check ONLY at pivot moments (BG3-style)
      → d20 + SANG|SOUFFLE|CENDRE modifier vs DC
      → PV = 10 + SANG (la vie du perso)
   c. consequences/world-state updated; WorldClock (Calamine) advances
3. context-builder assembles the DOSSIER:
   - Fixed Canon Velkhar slice (lore.service)         (§3.1)
   - Character sheet + triptyque + vocation + peuple
   - Top-K relevant NPCs + facts + artefacts (memory.service via pgvector)  (§3.4)
   - WorldClock (Calamine state), reputation, last 3 events
   - The resolved roll result and what the player attempted
4. scene-prompt.builder → prompt → OpenRouter (routeur) → modèle configuré  (§7)
5. output-parser (JSON + Zod) → scene-validator (structure + canon Velkhar) (§7.3)
   - invalid? regenerate once with the error; second failure → safe fallback scene
6. Any NEW entities the scene introduces → world-state.service freezes them (§3.2)
7. Return { scene, rollResult, souvenirsGagnes? } to the frontend.
```

**The model never sees the whole history and never decides outcomes.** It sees a fresh, complete dossier and writes prose.

### 3.4 Retrieval (keeping context relevant and small)

History grows unbounded; prompts must not. `memory.service.ts` stores embeddings for NPCs, facts, artefacts (pgvector) and retrieves the **top-K most relevant** to the current scene each turn. Cache Fixed Canon + system prompt; only the retrieved slice changes per turn.

---

## 4. Architecture Rules

- **Backend is the Game Master** : stats (SANG/SOUFFLE/CENDRE), dice, inventory, consequences, NPCs, world-state, lore, **L'Aveugle hub**.
- **AI is the voice only** (via OpenRouter) : scenes, dialogue, description. Never memory, never outcomes.
- **Frontend is display-only** : shows scenes, presents choices, displays stats, **renders L'Aveugle**.
- **Never trust frontend data** : validate every input with Zod at the boundary.
- **AI output always validated** against schema **and** Velkhar Fixed Canon before storage (§7.3).
- **All API responses** : `{ success: boolean, data?: T, error?: string }`.
- **All frontend API calls** go through `app/api/[...path]/route.ts`.
- Zustand for UI state, React Query for server data.
- **1-2 AI calls per turn max** (GDD L17).

---

## 5. Conventions & Core Data Contracts

### 5.1 Conventions

- TypeScript strict everywhere. Shared types in `@grimoire/shared`, never duplicated.
- Named exports only; `async/await` only.
- Files `kebab-case.ts`; Types `PascalCase`; functions/vars `camelCase`; constants `UPPER_SNAKE_CASE`; components `PascalCase.tsx`.
- Thin route controllers → services; AI behind `OpenRouterProvider`; show consequences, not raw numbers, in narrative.
- **Source de vérité** : toute question produit → `docs/raw/` (index : `docs/wiki/index.md`).

### 5.2 Velkhar Stats (triptyque GDD — ⚠️ TODO refonte `packages/shared/`)

```typescript
// Triptyque : SANG · SOUFFLE · CENDRE
// Modificateurs : −3 à +4
// PV = 10 + SANG
// PV = 10 + SANG (max)
// Soif / Faim / Fatigue : 0-100 (100 = plein)
// Calamine : 0-100 (corruption magique, monte avec usage)
interface VelkharStats {
  // Triptyque
  sang: number; // -3 à +4 — combat, survie, force, intimidation
  souffle: number; // -3 à +4 — précision, furtivité, artisanat, éveil artefacts
  cendre: number; // -3 à +4 — charisme, foi, commandement, résistance magique

  // Dérivés
  pv: number; // 10 + SANG
  pvMax: number; // 10 + SANG

  // Survie
  faim: number; // 0-100
  soif: number; // 0-100
  fatigue: number; // 0-100

  // Magie (unifiée)
  calamine: number; // 0-100 — coût universel de la magie, monte avec usage
}

type StatKey = "sang" | "souffle" | "cendre";

// Quête ouverte (non canonique, le joueur construit SA vérité)
type OpenQuest = "pouvoir" | "verite" | "survie" | "destruction";
```

### 5.3 Scene Schema (AI output contract)

```typescript
interface Scene {
  title: string;
  description: string; // 400-600 words (GDD §8.1)
  ambiance: string;
  choices: Choice[]; // exactly 4
  newEntities?: NewEntity[];
  openQuestClue?: OpenQuest; // hint vers quête ouverte
}

interface Choice {
  id: string;
  text: string; // ≤ 20 chars
  description: string; // 15-20 words
  statCheck?: StatCheck;
  consequences: Consequences;
}

interface StatCheck {
  stat: "sang" | "souffle" | "cendre";
  difficulty: number;
  onSuccess: string;
  onFailure: string;
}

interface Consequences {
  xp: number;
  health: number; // delta PV
  calamine?: number; // delta Calamine (si usage magique)
  inventory: string[];
  events: string[];
  souvenirsGagnes?: number; // gain méta (rare)
}

interface NewEntity {
  kind: "npc" | "fact" | "artefact";
  name?: string;
  role?: string;
  personality?: string;
  text?: string;
}
```

### 5.4 Character Schema (Velkhar — ⚠️ TODO refonte `packages/shared/src/types/character.types.ts`)

```typescript
type Pronouns = "il" | "elle" | "iel";
type NarrativeProse = "sombre" | "equilibre" | "heroique";
type DicePreference = "permissif" | "equilibre" | "brutal";
type SafetyLevel = "ok" | "veil" | "line";

// 4 vocations V1 + concept libre
type Vocation =
  | "marcheur-sel" // Commerce/survie/désert — Guilde du Sel
  | "lame-ombre" // Contrats/secrets/ombres — Main d'Ombre
  | "veilleur" // Ruines/artefacts/savoir — Éveilleurs
  | "tisse-verbe" // Éveille les artefacts, risque max Calamine — Rénovateurs
  | "libre"; // concept écrit par le joueur

type Peuple =
  | "sahelin" // +1 SANG
  | "rivain" // +1 CENDRE
  | "therien" // +1 SANG
  | "cendreur" // +1 SOUFFLE
  | "changepeau"; // +1 SOUFFLE / −1 CENDRE

interface CharacterLore {
  backstory: string;
  traits: string[];
  bond: string?;
  flaw: string?;
}

interface CharacterVoiceSettings {
  voices: string[];
  prose: NarrativeProse;
  dice: DicePreference;
}

interface SafetySettings {
  violence: SafetyLevel;
  dark: SafetyLevel;
  horror: SafetyLevel;
  romance: SafetyLevel;
  betray: SafetyLevel;
}

interface CharacterCreate {
  name: string;
  epithet?: string;
  pronouns: Pronouns;
  pitch?: string; // concept libre (requis si vocation === "libre")

  vocation: Vocation;
  peuple: Peuple;

  // Triptyque — base 0, allocation 5 points, mod −3 à +4 final après bonus racial
  alloc: { sang: number; souffle: number; cendre: number };
  openQuest?: OpenQuest;

  lore: CharacterLore;
  voice: CharacterVoiceSettings;
  safety: SafetySettings;
}
```

### 5.5 API envelope

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

## 6. API Endpoints

All frontend-to-backend calls go through `frontend/src/app/api/[...path]/route.ts` (proxy). Backend runs on `http://localhost:3001`.

### 6.1 Authentication

```
POST   /api/auth/signup           body: { email, password, username }
POST   /api/auth/login            body: { email, password }
POST   /api/auth/logout
GET    /api/auth/me               returns: { userId, email, username }
```

### 6.2 Character

```
POST   /api/characters                           body: CharacterCreate
GET    /api/characters                           returns: Character[] (user-scoped, Velkhar)
GET    /api/characters/:id                       returns: Character
GET    /api/characters/:id/last-session          returns: { sessionId } | null
PATCH  /api/characters/:id                       body: partial Character
DELETE /api/characters/:id
```

### 6.3 Session (run)

```
POST   /api/sessions                             body: { characterId, startRegion }  returns: Session
GET    /api/sessions/:id                         returns: Session (full state)
POST   /api/sessions/:id/action                  body: { action, stat?, freeAction? }  returns: Scene + roll + souvenirsGagnes?
POST   /api/sessions/:id/choice                  body: { choiceId }  returns: Scene
POST   /api/sessions/:id/slash                   body: { command, args }
GET    /api/sessions/:id/journal                 returns: SceneLog[]
GET    /api/sessions/:id/chronicle               returns: format markdown
PATCH  /api/sessions/:id/end                     body: { reason }  returns: { finalStats, chronique, souvenirs }
```

### 6.4 L'Aveugle — hub roguelike

```
GET    /api/aveugle/dialogue                     returns: { greeting, contexte } — première salutation à chaque run
POST   /api/aveugle/ask                          body: { question }  returns: { reponse, lore }
GET    /api/aveugle/souvenirs                    returns: { disponibles: SouvenirInfo[], prixParType: Record<LoreType, number> }
POST   /api/aveugle/buy                          body: { loreType }  returns: { loreAchete, souvenirsRestants }
POST   /api/aveugle/artefact-explain             body: { artefactId }  returns: { explication, calamineCost }
POST   /api/aveugle/quit                         body: { }  → démarre le run
```

### 6.5 World (lore Velkhar)

```
GET    /api/world/regions                        returns: Region[] (Makhzen)
GET    /api/world/region/:regionId               returns: Region + NPCs + artefacts
GET    /api/world/factions                       returns: Faction[] (4 majeures)
GET    /api/world/bestiaire                      returns: Creature[] (Calcinés au centre)
```

### 6.6 Codex (session-scoped)

```
GET    /api/sessions/:id/codex                   returns: { character, inventory, reputation[], npcLog[], souvenirs }
POST   /api/sessions/:id/codex/equip             body: { itemId }
POST   /api/sessions/:id/codex/consume           body: { itemId }
```

**All responses** :

```typescript
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

---

## 7. AI Integration — OpenRouter

### 7.1 Provider abstraction + fallback chain via OpenRouter

```typescript
// ai/openrouter.provider.ts
interface AIProvider {
  readonly name: string;
  generateScene(prompt: string, schema: object): Promise<Scene>; // returns parsed JSON
  analyzeIntent(prompt: string, schema: object): Promise<Intent>;
}

// ai/provider-chain.ts — config-driven, jamais hard-codé
const DEFAULT_CHAIN_DEV = ["anthropic/claude-3.5-sonnet"];
const DEFAULT_CHAIN_PROD_FREE = [
  "google/gemini-flash-1.5",
  "mistralai/mistral-7b-instruct",
];

async function generateWithFallback(prompt, schema, chain): Promise<Scene> {
  for (const model of chain) {
    try {
      return await openrouter.generate(model, prompt, schema);
    } catch (e) {
      if (isQuotaOrTransient(e)) continue;
      throw e;
    } // 429/5xx → next model
  }
  return SAFETY_SCENE; // all exhausted → pre-written neutral scene; player never hard-crashes
}
```

**OpenRouter specifics** :

- Single API key (`OPENROUTER_API_KEY`) — one env var
- Endpoint unique : `https://openrouter.ai/api/v1/chat/completions`
- Structured output : `response_format: { type: "json_schema", ... }` ou tool-calling selon le modèle
- Headers requis : `HTTP-Referer` + `X-Title` (analytics OpenRouter)

**Selecting/reordering models is config, never code.**

### 7.2 Why a cheap/free model is enough here

The model only writes prose — backend supplies memory, rules, dice. So the model's job is small :

1. **Forced structured output** via OpenRouter JSON mode — model _cannot_ emit anything else.
2. **Fresh dossier every turn** (§3.3) — never ask the model to remember.
3. **Locked system prompt + few-shot** — 1-2 example scenes, biggest quality lever on free models.
4. **Low temperature** (~0.6-0.8).
5. **Validate + regenerate** (§7.3) — broken format/tone/canon → retry once, then safety scene.
6. **Develop on Claude via OpenRouter, run on the free chain.**

### 7.3 Validation (structure + canon Velkhar)

```typescript
export function validateScene(
  scene: Scene,
  canon: FixedCanon,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (scene.description.length < 300) errors.push("Scene too short");
  if (scene.description.length > 800) errors.push("Scene too long");
  if (!scene.choices || scene.choices.length !== 4)
    errors.push("Must have exactly 4 choices");
  for (const c of scene.choices)
    if (c.text.length > 20) errors.push(`Choice too long`);
  // canon guard: jamais de résurrection, magie = artefacts seulement, Cendre corrupte
  errors.push(...assertNoContradiction(scene, canon));
  return { isValid: errors.length === 0, errors };
}
```

On failure, `game-engine.service` regenerates once (passing `errors` back), then safety scene.

### 7.4 AI anti-patterns

**Don't** : fancy vocabulary; >700-word scenes; invent NPCs that contradict world-state; all-equal choices; expose raw stat numbers; overuse player name; break dark-fantasy-desert tone; ignore Calamine clock; all-combat pacing.

**Do** : clear language; 400-600 words; reuse persisted NPCs by name; some risky/failing choices; show consequences; vary scene types including quiet/mundane beats; reference Cendre/Calamine pressure.

---

## 8. Security & Quality

- Validate every input with Zod at the route boundary.
- Auth : JWT (short access + refresh), bcryptjs, secrets via env.
- CORS allowlist, Helmet, HTTPS in prod.
- **Per-player rate-limit on AI actions** (GDD L17 — pas de spam drainant le quota partagé).
- **1-2 AI calls per turn max** (GDD L17 — coût + latence).
- **Prompt-injection guard** : treat free-action text and any player text as untrusted; wrap in clearly delimited blocks.
- AI cost/perf : structured output, retrieval-limited context, cached canon/system prompt.
- Centralized error handler; Pino logs; never leak stack traces.
- Testing : Vitest (front + back), Cypress E2E. Knip, bundle analyzer.

---

## 9. Deployment & Capacity (free-first, degrade gracefully)

### 9.1 Free deployment

| Layer                    | Service                            | Tier        | Cost |
| ------------------------ | ---------------------------------- | ----------- | ---- |
| Frontend (Next.js)       | **Vercel**                         | free        | 0€   |
| Backend (Express)        | **Railway** or **Render**          | free        | 0€   |
| DB (Postgres + pgvector) | **Supabase**                       | free        | 0€   |
| AI (prod)                | **OpenRouter** (routeur gratuit)   | free quotas | 0€   |
| AI (dev)                 | **OpenRouter → Claude 3.5 Sonnet** | pay-per-use | ~0€  |

**Une seule variable d'env** : `OPENROUTER_API_KEY`. Pas de GPU, pas de self-hosted, rien à acheter.

### 9.2 Capacity — graceful degradation

Bottleneck = **AI free quota** (requests/min + requests/day).

- 1 player : ~1 action / 20-40 s → fine.
- Tens : OpenRouter chaîne gratuite tient (somme des quotas Gemini + Mistral).
- Hundreds : free quotas exhaust → degrade, not crash → queue + safety scene.

**Scale levers** :

1. Free — fallback chain (somme quotas) + queue + per-player rate-limit.
2. Few €/month — move one model to paid tier via OpenRouter (cents/1000 scenes).
3. At scale — caching, multiple OpenRouter keys, real cloud plan.

---

## 10. Commands

```bash
pnpm dev                    # start all apps
pnpm dev --filter frontend  # frontend only
pnpm dev --filter backend   # backend only
pnpm build                  # build all
pnpm lint                   # lint all
pnpm type-check             # TS check all
```

---

## 11. Hardcore RP — Technical Specs 🎭

### 11.1 Free Action — primary interface

**Frontend** : `ActionField` rendered **above** `ChoicesList`. On submit, POST raw text.

```
POST /api/sessions/:id/action
{ action, freeAction, mode: 'ic' | 'ooc' }
```

**Backend** :

1. Validate `freeAction` (Zod: non-empty, ≤ 280 chars, sanitized).
2. `analyzeIntent` → `{ stat: 'sang'|'souffle'|'cendre', difficulty, rationale }`.
3. **dice.ts** resolves ONLY if pivot moment (§11.5).
4. Resolved outcome + dossier (§3.3) → next scene via OpenRouter.

### 11.2 Action vs Dialogue auto-detection

```
type Segment = { kind: "dialogue" | "action"; text: string };

function segmentInput(raw: string): Segment[];
//  "..."      → dialogue
//  *...*      → action
//  unmarked   → action (beginner-safe default)
//  mixed line → multiple segments
```

- **Dialogue** : no dice by default. NPC affinity shift.
- **Action** : intent-analyzer → dice if needed.
- **Mixed** : both resolved.

Frontend chip = UX hint only; backend re-segments.

### 11.3 IC / OOC + Slash commands

- `//` prefix → mode='ooc' → `ai/ooc.service.ts` (no world-state mutation, no dice).
- `/roll`, `/recap`, `/inventaire`, `/statut`, `/regarder`, `/repos`, `/partager`, `/sauvegarder`.

### 11.4 Backstory + Flaws/Qualities

Injected into MJ system prompt. **Backend** applies flaw modifiers in `dice.ts` (e.g. `fear_of_corruption` → −2 inside Calciné zones).

### 11.5 Dice Resolution — d20 aux pivots seulement (GDD §8)

`game-rules/dice.ts` is authoritative. **Important : d20 ne se lance PAS à chaque action — seulement aux moments pivots** (combat risquant la vie, mensonge risqué, sprint désespéré). La plupart du temps, l'action réussit et le MJ narre le résultat.

```typescript
interface RollResult {
  die: number; // 1-20
  stat: "sang" | "souffle" | "cendre";
  statValue: number; // mod du triptyque (-3 à +4)
  modifiers: { source: string; delta: number }[]; // flaws, fatigue, items
  total: number; // die + statValue + Σ modifiers
  difficulty: number;
  success: boolean;
  crit: "success" | "failure" | null; // nat 20 / nat 1
  pvDelta?: number; // PV = 10 + SANG, peut être blessé
  calamineDelta?: number;
}
```

**PV = 10 + SANG**. Le dé ne se lance qu'aux **pivots** : réussite automatique le reste du temps (et le MJ narre). Critiques (nat 20 / nat 1) = memorable.

> ⚠️ **TODO post-sync** : `dice.ts` actuel applique d20 partout. À réécrire pour respecter la règle GDD "aux pivots seulement" — **hors scope de cette passe doc**.

- **Dice journal** : persist each `RollResult` per session.
- **Inspiration token** (Phase 2B) : 1 free re-roll per scene.

### 11.6 NPC affinity & world-state UI

> ⚠️ **TODO post-sync** : les 4 Pillar NPCs actuels (Aldric, Hollow King, Caelith, Brenna) sont **remplacés par L'Aveugle unique** (GDD #15). Les 3 autres deviennent des NPCs émergents.

`CorruptionMeter.tsx` affiche `WorldClock.calamineLevel` (GDD L2 : la Calamine monte avec usage magique).

### 11.7 Chronicle (in-game + export)

`GET /api/sessions/:id/chronicle?format=md|pdf` → markdown Discord (Phase 2), PDF parchemin vieilli (Phase 3).

### 11.8 Session seeds + leaderboard (Phase 2/3)

```typescript
interface SessionSeed {
  code: string; // e.g. "VELKHAR-42"
  startingCharacter: CharacterTemplate;
  rngSeed: number;
}
```

### 11.9 L'Aveugle — Opening Scene (hub roguelike)

**Chaque run commence dans l'Auberge de L'Aveugle.** C'est la **seule scène garantie identique** d'un run à l'autre — le hub du roguelike.

```
Séquence d'ouverture (fixe — GDD #23) :
1. Auberge de L'Aveugle (image plein écran — ambiance désertique)
2. L'Aveugle demande le nom
3. Modal de création : 4 vocations OU concept libre
4. IA (via OpenRouter) réagit — première salutation personnalisée
5. Si run ≥ 2 : L'Aveugle propose d'échanger des Souvenirs contre du lore
6. Joueur quitte l'auberge → run commence
```

**Implémentation backend** (`aveugle.service.ts` + `routes/aveugle.ts`) :

- `getGreeting(runNumber, character)` : L'Aveugle salue (première fois : "Qui va là, voyageur ?" ; runs suivants : référence au perso précédent, aux artefacts, aux exploits)
- `askLore(question, context)` : IA répond via OpenRouter, factuellement alignée sur le canon Velkhar
- `getSouvenirsShop(characterId)` : liste de lore (Calcinés, Archontes, artefacts, factions) avec prix en Souvenirs
- `buyLore(souvenirsCost, loreType)` : échange atomique, retire Souvenirs, ajoute WorldFact au canon
- `explainArtefact(artefactId)` : L'Aveugle explique (calamine cost, effets, lore) — réservé Tisse-Verbe pour l'éveil
- `quitAuberge()` : démarre le run (POST /api/sessions)

**Règles L'Aveugle (GDD L8)** :

- Vend **uniquement** du lore (jamais d'équipement)
- Source unique des Souvenirs méta
- Lieu de tutoriel implicite (pas de tuto popup — l'Aveugle enseigne par la conversation)

**Composants frontend** (`components/aveugle/`) :

- `AubergeScene.tsx` — image plein écran + ambiance
- `AveugleDialogue.tsx` — bulle dialogue + salutation
- `VocationPicker.tsx` — 4 vocations OU concept libre
- `ConceptLibreInput.tsx` — textarea pour concept écrit
- `SouvenirsExchange.tsx` — interface d'échange
- `ArtefactExplanation.tsx` — explication artefacts

### 11.10 Deferred specs (Phase 2B/3) — sketches only

- Narrative travel map (chain of visited places, no XY)
- Table safety — Lines & Veils (déjà supporté via `SafetySettings`)
- Per-scene ambient sound (Phase 3)
- Co-op V2 (GDD #5)

> **Explicitly rejected** : multi-univers (Valorain/Zombie/Sci-Fi/Apocalypse) — GRIMOIRE = **Velkhar only**.

---

## 12. Variables d'environnement requises

Voir `.env.example` à la racine du projet.

**Simplification post-sync** :

- ⚠️ Retirer `GEMINI_API_KEY`, `MISTRAL_API_KEY`, `CLAUDE_API_KEY` (3 clés séparées)
- ✅ Ajouter **`OPENROUTER_API_KEY`** (une seule clé pour tous les modèles)

```bash
# .env.example
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
OPENROUTER_API_KEY=        # remplace les 3 clés AI
OPENROUTER_REFERER=https://grimoire.app
```
