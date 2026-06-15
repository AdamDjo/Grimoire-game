# Tech Stack & Implementation — Grimoire

**Version**: 3.0 (Design-aligned: routes, components, and DB schema match docs/Grimoire/)
**Scope of this doc**: The **HOW** — stack, architecture, conventions, the lore/memory engine (the moat), AI integration, data contracts, validation, security, and technical specs for the Hardcore RP features. For the **WHAT** (vision, world of Valorain, classes, UI look, narrative standards), see `GAME_DESIGN.md`. For current status, see `MEMORY.md`.

> **UI reference**: `docs/Grimoire/` contains 5 finalized hi-fi HTML designs. All frontend routes, component names, and prop shapes defined here must match them exactly.

> **This is the file you copy-paste to the AI when asking it to build a feature.** It is self-contained. No technical detail is duplicated in `GAME_DESIGN.md`.

> **The one idea to internalize:** the AI has _no_ memory and makes _no_ decisions. The **backend** holds the rules, the dice, and the world's memory, and feeds the AI a fresh, complete dossier every turn. The AI only writes prose. That is what makes the Game Master reliable — and it's the entire competitive moat (`GAME_DESIGN.md` §1, §3.2).

---

## 1. Stack Overview

### Monorepo

- **Turborepo** + pnpm workspaces (pnpm 9.15.0)
- `apps/frontend/` — Next.js 15 (App Router), display-only, proxy API
- `apps/backend/` — Express (game engine, dice, memory, AI orchestration)
- `packages/shared/` — shared types & constants (`@grimoire/shared`)
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

| Concern    | Choice                      |
| ---------- | --------------------------- |
| Runtime    | Node.js 20 + Express 4      |
| Language   | TypeScript (strict)         |
| ORM        | Prisma                      |
| Auth       | JWT + bcryptjs              |
| Validation | Zod                         |
| Logging    | Pino                        |
| Security   | Rate limiting, CORS, Helmet |

### Database

- **PostgreSQL** via **Supabase** (Auth + Storage). Use **pgvector** for NPC/lore retrieval (§3.4).

### AI — API-first, free to run (never self-host an LLM)

**Principle: if you can _call_ an LLM via API, never _host_ one yourself.** Hosting a model means a GPU (expensive: hundreds €/month). Calling an API is free within quotas and trivial. So Grimoire uses cloud APIs behind the `AIProvider` abstraction — no Ollama in production.

- **Dev: Claude API.** You develop and tune prompts against the best prose so you judge the game at full potential.
- **Prod: a free fallback chain** — `Gemini Flash → Mistral → (optional 3rd free API) → pre-written safety scene`. The backend tries each in order until one answers. This is **both** the anti-bug net _and_ the load absorber (§ Capacity): stacking free APIs **sums their quotas**, and a saturated provider just falls through to the next — the player never hard-crashes.
- **Premium (later): Claude/GPT in prod** — one config line, when you have revenue.
- **Output**: structured JSON only, enforced by each provider's structured-output/JSON mode, then validated (§5, §6).
- **Context**: rebuilt every turn from the backend's world-state (§3), never "remembered" by the model.
- **Quality lever on free models**: a strong system prompt + **few-shot** (1–2 example scenes) beats any other tuning. Small/cheap models _imitate_ good examples far better than they invent.

> Ollama is **optional, dev-only/offline** (run a small model on your own laptop with no network). It is **not** part of the production architecture — don't self-host it on a cheap (GPU-less) server; it would be unusably slow.

---

## 2. Project Structure

```
grimoire/
├── apps/frontend/          # Next.js 15 (display-only)
├── apps/backend/           # Express (Game Master: rules + memory + AI orchestration)
└── packages/shared/        # @grimoire/shared types & constants
```

### Frontend (`apps/frontend/src/`)

Routes and component names mirror the 5 design files in `docs/Grimoire/` exactly.

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (main)/
│   ├── campaign/[campaignId]/page.tsx    # Grimoire - Campagne.html (agnostic universe)
│   ├── world/page.tsx                    # Grimoire - Carte de Valorain.html (fetches currentUniverse)
│   ├── character-create/page.tsx         # Grimoire - Creation Personnage.html (7-step forge, picks universe)
│   ├── settings/universe/page.tsx        # ← NEW: switch universe modal/page
│   ├── leaderboard/page.tsx
│   └── settings/page.tsx
├── (game)/
│   ├── session/[sessionId]/page.tsx      # Grimoire - Session.html  ← MAIN SCREEN (agnostic universe)
│   └── session/end/page.tsx
├── api/[...path]/route.ts                # proxy — ALL frontend API calls go here
├── layout.tsx
└── page.tsx                              # Grimoire - Accueil.html  (landing, shows universes)

components/
├── ui/
│   └── Button, Input, Card, Modal, Tabs, Badge, Toast
├── auth/
│   └── LoginForm, SignupForm
├── world/                                # Carte de Valorain
│   └── WorldMap, RegionNode, RegionPanel, HeroSelector
├── character/                            # Forge — 7-step stepper
│   ├── ForgeStepIdentity                 # step 1: name, epithet, pronouns, portrait, pitch
│   ├── ForgeStepPeople                   # step 2: 6 peoples (§6.4 GAME_DESIGN)
│   ├── ForgeStepClass                    # step 3: 10 classes (§6.3 GAME_DESIGN)
│   ├── ForgeStepStats                    # step 4: stat allocation (base 8, pool 12, cap 15)
│   ├── ForgeStepHistory                  # step 5: backstory, traits, alignment, ideal/bond/flaw
│   ├── ForgeStepVoice                    # step 6: tone, dice pref, safety settings
│   ├── ForgeStepPact                     # step 7: recap + confirm
│   ├── StatDistributor                   # shared sub-component (step 4)
│   └── SafetySettings                    # shared sub-component (step 6) — see §5.6
├── game/                                 # Session screen
│   ├── Topbar                            # brand + TopNav + vitals + timer + actions
│   ├── SceneHero                         # cinematic image + scrim + chapter/title overlay
│   ├── Narration                         # EB Garamond prose + mj-mark + reveal animation
│   ├── EventLog                          # epill chips (xp / good / bad)
│   ├── ThinkingIndicator                 # MJ processing state
│   ├── ChoicesList                       # 2-col grid of ChoiceButton
│   ├── ChoiceButton                      # label + sub + stat check badge + hover ember bar
│   ├── ActionField                       # IC/OOC toggle + textarea + SlashPalette + submit btn
│   ├── SlashPalette                      # /roll /recap /inventaire /repos /regarder ...
│   ├── DiceOverlay                       # full-screen D20 roll — armed/rolling/win/crit/lose/fumble
│   ├── GameOverScreen
│   └── FreeActionChip                    # live 💬 / ⚔ / 💬+⚔ detection chip
├── codex/                                # Right sidebar of Session screen
│   ├── Codex                             # container for all right-panel cards
│   ├── CharacterCard                     # portrait + name + class + HP/Mana/Vigueur bars
│   ├── LevelRing                         # conic-gradient XP ring
│   ├── StatsPanel                        # FOR/AGI/INT/CHA/CHANCE bars
│   ├── InventoryGrid                     # 5-col grid, rarity color-coded
│   └── ReputationPanel                   # bars per faction
├── campaign/                             # Campaign hub
│   ├── ResumeHero                        # cinematic hero card with last scene + CTA
│   ├── ChapterTimeline                   # vertical chronicle (done/current/locked)
│   ├── QuestTabs                         # Principales / Secondaires / Personnelles
│   ├── FactionReputation
│   ├── NpcLog
│   ├── DiceJournal
│   └── CampaignStats
└── layout/
    └── Header, Navigation, Footer

hooks/
├── useGameState        # currentUniverse, sessionState
├── useCharacter        # fetches chars for currentUniverse
├── useSession          # fetches session for char in currentUniverse
├── useWorld            # fetches universe data (regions, NPCs, lore)
├── useAuth
├── useDiceRoll
├── useCampaign         # campaign stats for char in currentUniverse
└── useUniverseSwitch   # switchUniverse(id) → refetch everything

lib/
├── utils
├── api-client
├── game-constants
├── design-tokens
└── universe-store.ts   # Zustand: { currentUniverse, switchUniverse }

types/
└── index.ts  # re-exports @grimoire/shared

styles/
└── globals.css   # CSS custom properties (all --bg / --ember / --arcane / etc.)
                  # body::before gradient + body::after grain — applied globally
```

> `ActionField` (IC/OOC + free text + slash palette) renders **below** `ChoicesList` visually, but is the **primary interface** — the cursor blinks there first (`GAME_DESIGN.md` §3.1). Choices are suggestions, not the main input.

### 2.1 Universe Switching — Zero Logout

**Core principle**: universe is a **client-side setting**, not part of auth. Logged-in users switch universes via modal/page without logout.

**Zustand store** (`hooks/use-universe-store.ts`):

```typescript
interface UniverseStore {
  currentUniverse: string; // 'valorain' | 'zombie' | ...
  switchUniverse(id: string): void;
}
```

**Data scope per universe**:

- `Character[]` indexed by `(userId, universe)` → **Character.universe** field
- `Session[]` linked to `Character.id` → session inherits character's universe
- `Campaign[]` linked to `Character.id` → campaign inherits character's universe
- World NPCs/lore/regions: keyed by universe in backend

**Flow on universe switch**:

1. User clicks "Valorain" or "Zombie" in settings or landing
2. Zustand updates `currentUniverse`
3. Frontend refetches:
   - Characters for new universe (→ `GET /api/characters?universe=valorain`)
   - Last session ID (→ `GET /api/characters/:id/last-session`)
   - World data (regions, NPCs, lore)
4. If session active, redirect to `/(game)/session/[sessionId]`; else show campaign hub

**No logout. Session persists across universe switches. Character data stays synced to universe.**

### Backend (`apps/backend/src/`)

```
routes/        thin controllers → delegate to services
services/
├── game-engine.service.ts     # orchestrator: assembles context → AI → validates → applies
├── world-state.service.ts     # §3.2 emergent canon: NPCs, facts, flags, corruption clock
├── memory.service.ts          # §3.4 retrieves relevant NPCs/facts (pgvector) for the prompt
└── lore.service.ts            # §3.1 loads Fixed Canon, guards against contradictions
ai/
├── ai-provider.interface.ts   # AIProvider abstraction
├── providers/ollama.provider.ts | claude.provider.ts | gemini.provider.ts | mistral.provider.ts
├── context-builder.ts         # builds the per-turn dossier from world-state
├── scene-prompt.builder.ts    # §6.2
├── intent-analyzer.ts         # §9.1 free-action → {stat, difficulty}
├── output-parser.ts           # JSON parse + Zod
└── scene-validator.ts         # §6.3 structural + canon checks, triggers regeneration
game-rules/
├── dice.ts                    # §9.3 authoritative D20 resolution
├── stats.ts | combat.ts | inventory.ts | consequences.ts
lore/
└── valorain.canon.ts          # §3.1 the Fixed Canon as structured data
index.ts                       # Express entry point
```

---

## 3. The Lore & Memory Engine (the moat) 🧠

This is the single most important system in Grimoire. It is **both** the lore engine and the memory engine — they are the same thing (`GAME_DESIGN.md` §3.3). It runs in two layers.

### 3.1 Layer 1 — Fixed Canon (hand-written, small, inviolable)

A structured, read-only constitution of Valorain the AI may never contradict (`GAME_DESIGN.md` §4). Lives in `lore/valorain.canon.ts`.

```typescript
interface FixedCanon {
  worldLaws: string[]; // magic is rare/costly, death is permanent, etc.
  centralConflict: string; // the Rising Corruption (the world clock)
  regions: Region[]; // 8 regions — see GAME_DESIGN.md §4.3 for canonical names
  factions: Faction[]; // 4 factions, alignment, goal
  creatures: Creature[]; // original bestiary
  pillarNpcs: PillarNpc[]; // 4 pre-written backbone NPCs (Aldric, Hollow King, Caelith, Brenna)
  tone: "dark-fantasy-measured";
}

// Canonical region IDs (from grimoire-carte.js — must match exactly)
type RegionId =
  | "cendres" // Les Cendres de Valorain — starting region
  | "foret" // La Forêt d'Aelorn (La Forêt qui Murmure)
  | "couronne" // La Couronne Engloutie (Cité Noyée)
  | "tour" // La Tour de l'Arcaniste
  | "givre" // Le Givre Éternel (Confins du Nord)
  | "catacombes" // Les Catacombes Sans Fin
  | "or" // L'Or des Damnés — Premium
  | "dragon"; // Le Pacte du Dragon (Pic du Dragon) — Premium

type RegionState = "current" | "unlockable" | "sealed" | "premium";
```

The relevant slices of Fixed Canon are injected into **every** prompt's system section. `lore.service.ts` exposes `getCanonForPrompt()` and a `assertNoContradiction(scene)` used by the validator (§6.3).

### 3.2 Layer 2 — Emergent Canon (AI creates, backend freezes)

When the MJ invents anything (an NPC, a promise, a poisoned well, a turned faction), `world-state.service.ts` **records it as permanent canon for that run**. Next time it's relevant, it comes from the database, not the model's imagination. This is what makes the world remember (`GAME_DESIGN.md` §5.3, §5.4).

**Persisted per session** (Prisma models, sketch):

```typescript
model WorldNpc {
  id          String  @id @default(cuid())
  sessionId   String
  name        String
  role        String          // "innkeeper", "bandit leader"
  personality String          // fixed once created
  affinity    Int     @default(0)   // trust/hostility, shown in UI (§9)
  lastSeenScene Int
  facts       String[]        // "player lied about their name", "owes player a debt"
  embedding   Unsupported("vector")?   // pgvector, for retrieval (§3.4)
}

model WorldFact {
  id        String @id @default(cuid())
  sessionId String
  kind      String   // "consequence" | "promise" | "discovery" | "faction"
  text      String   // "the Greymoor well is poisoned; villagers are dying"
  sceneCreated Int
  active    Boolean @default(true)
  embedding Unsupported("vector")?
}

model WorldClock {
  sessionId        String @id
  corruptionLevel  Int    @default(0)   // advances over time / on delay (§4.2)
  villagesLost     Int    @default(0)
  scenesElapsed    Int    @default(0)
}

// Character persisted in DB — matches CharacterCreate type in §5.4
model Character {
  id         String @id @default(cuid())
  userId     String
  name       String
  epithet    String
  pronouns   String   // 'il' | 'elle' | 'iel'
  age        String
  pitch      String
  portraitUrl String?
  people     String   // RegionId-like enum: 'humain' | 'elfe' | 'nain' | 'orsang' | 'sangmaud' | 'feerin'
  class      String   // 'guerrier' | 'mage' | 'rodeur' | ...

  // Stats (base alloc — racial bonuses applied at runtime by stats.ts)
  statFor    Int @default(8)
  statAgi    Int @default(8)
  statInt    Int @default(8)
  statCha    Int @default(8)
  statChance Int @default(8)

  // Lore (step 5)
  backstory  String
  traits     String[]
  alignment  String?
  ideal      String?
  bond       String?
  flaw       String?

  // Voice & comfort (step 6)
  narrativeProse   String @default("equilibre")
  dicePreference   String @default("equilibre")
  voiceStyles      String[]

  // Safety settings (step 6) — injected into every system prompt
  safetyViolence String @default("ok")
  safetyDark     String @default("ok")
  safetyHorror   String @default("veil")
  safetyRomance  String @default("veil")
  safetyBetray   String @default("ok")

  sessions   Session[]
  createdAt  DateTime @default(now())
}
```

### 3.3 The per-turn loop (how a scene is produced)

```
1. Player submits a choice OR a free action.
2. game-engine.service:
   a. If free action → intent-analyzer → { stat, difficulty }   (§9.1)
   b. dice.ts resolves the check (D20 + stat + modifiers)        (§9.3)  ← backend decides, not AI
   c. consequences/world-state updated; WorldClock advances
3. context-builder assembles the DOSSIER:
   - Fixed Canon slice (lore.service)                            (§3.1)
   - Character sheet + flaws/qualities                           (§9.2)
   - Top-K relevant NPCs + facts (memory.service via pgvector)   (§3.4)
   - WorldClock (corruption state), reputation, last 3 events
   - The resolved roll result and what the player attempted
4. scene-prompt.builder → prompt → AIProvider (Ollama)           (§6)
5. output-parser (JSON + Zod) → scene-validator (structure + canon) (§6.3)
   - invalid? regenerate once with the error; second failure → safe fallback scene
6. Any NEW entities the scene introduces → world-state.service freezes them (§3.2)
7. Return { scene, rollResult } to the frontend.
```

**The model never sees the whole history and never decides outcomes.** It sees a fresh, complete dossier and writes prose. That is the anti-drift mechanism — not clever prompting.

### 3.4 Retrieval (keeping context relevant and small)

History grows unbounded; prompts must not. `memory.service.ts` stores embeddings for NPCs and facts (pgvector) and retrieves the **top-K most relevant** to the current scene each turn (e.g. the NPC physically present + facts about this location + active consequences). This keeps the prompt small (cheap on a local model) **and** coherent (the right memories surface). Cache the Fixed Canon + system prompt; only the retrieved slice changes per turn.

---

## 4. Architecture Rules

- **Backend is the Game Master**: stats, dice, inventory, consequences, NPCs, world-state, lore.
- **AI is the voice only**: scenes, dialogue, description. Never memory, never outcomes.
- **Frontend is display-only**: shows scenes, presents choices, displays stats.
- **Never trust frontend data**: validate every input with Zod at the boundary.
- **AI output is always validated** against schema **and** Fixed Canon before storage (§6.3).
- **All API responses**: `{ success: boolean, data?: T, error?: string }`.
- **All frontend API calls** go through `app/api/[...path]/route.ts`.
- Zustand for UI state, React Query for server data.

---

## 5. Conventions & Core Data Contracts

### 5.1 Conventions

- TypeScript strict everywhere. Shared types in `@grimoire/shared`, never duplicated.
- Named exports only; `async/await` only.
- Files `kebab-case.ts`; Types `PascalCase`; functions/vars `camelCase`; constants `UPPER_SNAKE_CASE`; components `PascalCase.tsx`.
- Thin route controllers → services; AI behind `AIProvider`; show consequences, not raw numbers, in narrative.

### 5.2 Universal Stats (canonical — referenced by `GAME_DESIGN.md`)

```typescript
type UniverseType = "fantasy" | "apocalypse" | "scifi";

interface UniversalStats {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number; // labelled Mana | Stamina | Shield Energy by UI only
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  luck: number;
  level: number;
  xp: number;
}
type StatKey = "strength" | "agility" | "intelligence" | "charisma" | "luck";

const RESOURCE_LABEL: Record<UniverseType, string> = {
  fantasy: "Mana",
  apocalypse: "Stamina",
  scifi: "Shield Energy",
};
```

### 5.3 Scene Schema (AI output contract)

```typescript
interface Scene {
  title: string;
  description: string; // 400–600 words
  ambiance: string; // one-line atmospheric description
  choices: Choice[]; // exactly 4 (the MJ's suggestions; free input is separate)
  newEntities?: NewEntity[]; // NPCs/facts the AI introduced → frozen by world-state (§3.2)
}
interface Choice {
  id: string;
  text: string; // ≤ 20 chars
  description: string; // 15–20 words
  statCheck?: StatCheck;
  consequences: Consequences;
}
interface StatCheck {
  stat: StatKey;
  difficulty: number;
  onSuccess: string;
  onFailure: string;
}
interface Consequences {
  xp: number;
  health: number;
  inventory: string[];
  events: string[];
}
interface NewEntity {
  kind: "npc" | "fact";
  name?: string;
  role?: string;
  personality?: string;
  text?: string;
}
```

### 5.4 Character Schema (full — from `Grimoire - Creation Personnage.html`)

```typescript
// packages/shared/src/types/character.types.ts

type Pronouns = "il" | "elle" | "iel";
type Alignment = "LB" | "NB" | "CB" | "LN" | "NN" | "CN" | "LM" | "NM" | "CM";
type NarrativeProse = "sombre" | "equilibre" | "heroique";
type DicePreference = "permissif" | "equilibre" | "brutal";
type SafetyLevel = "ok" | "veil" | "line";

interface CharacterLore {
  backstory: string; // ≤ 300 chars — injected in every MJ system prompt
  traits: string[]; // max 3 picks from 16 options (Loyal, Sarcastique, Impulsif…)
  align: Alignment | null;
  ideal: string; // free text — what your character fights for
  bond: string; // free text — who/what your character protects
  flaw: string; // free text — your character's weakness
}

interface CharacterVoiceSettings {
  voices: string[]; // picked from: Solennel, Familier, Archaïsant, Laconique…
  prose: NarrativeProse; // affects MJ tone in system prompt
  dice: DicePreference; // affects difficulty thresholds
}

// Injected into system prompt; backend never overrides it. Player-set.
interface SafetySettings {
  violence: SafetyLevel;
  dark: SafetyLevel;
  horror: SafetyLevel;
  romance: SafetyLevel;
  betray: SafetyLevel;
}

interface CharacterCreate {
  // Step 1 — Identity
  name: string;
  epithet: string;
  pronouns: Pronouns;
  age: string;
  pitch: string; // player's own description ≤ 300 chars
  portraitUrl?: string; // uploaded image; generated initials+color at MVP

  // Step 2 — Lignée
  people: "humain" | "elfe" | "nain" | "orsang" | "sangmaud" | "feerin";

  // Step 3 — Voie
  class:
    | "guerrier"
    | "mage"
    | "rodeur"
    | "roublard"
    | "clerc"
    | "barde"
    | "paladin"
    | "druide"
    | "barbare"
    | "invoc";

  // Step 4 — Stats (player allocation; racial bonuses applied by backend)
  alloc: { FOR: number; AGI: number; INT: number; CHA: number; CHANCE: number };
  // base 8, pool 12 pts to distribute, cap 15 before racial bonus

  // Step 5 — Histoire & âme
  lore: CharacterLore;

  // Step 6 — Voix & confort
  voice: CharacterVoiceSettings;
  safety: SafetySettings;
}
```

```typescript
interface FlawDefinition {
  id: string;
  label: string;
  description: string;
  modifier: { trigger: string; stat: StatKey; delta: number }; // applied by backend, not AI
}
```

**SafetySettings** are persisted on the character and injected as a hard instruction in every system prompt (system-level, never revealed to the MJ prose). A `line` topic → never generated. A `veil` topic → kept off-screen (mentioned but not described).

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

### 7.1 Authentication

```
POST   /api/auth/signup           body: { email, password, username }
POST   /api/auth/login            body: { email, password }
POST   /api/auth/logout
GET    /api/auth/me               returns: { userId, email, username, universes: string[] }
```

### 7.2 Character (universe-scoped)

```
GET    /api/characters?universe=valorain         returns: Character[]
POST   /api/characters                           body: { universe, name, class, people, stats, ... }
GET    /api/characters/:id                       returns: Character (with lastSessionId if exists)
GET    /api/characters/:id/last-session          returns: { sessionId } | null
PATCH  /api/characters/:id                       body: { xp, level, inventory, ... }
DELETE /api/characters/:id
```

### 7.3 Session (narrative gameplay)

```
POST   /api/sessions                             body: { characterId, startRegion }  returns: Session
GET    /api/sessions/:id                         returns: Session (full state)
POST   /api/sessions/:id/action                  body: { action, stat?, freeAction? }  returns: Scene + xp/inventory deltas
POST   /api/sessions/:id/choice                  body: { choiceId }  returns: Scene
POST   /api/sessions/:id/slash                   body: { command, args } (e.g. /roll d20)
GET    /api/sessions/:id/journal                 returns: SceneLog[]
PATCH  /api/sessions/:id/end                     body: { reason }  returns: { finalStats, rewards }
```

### 7.4 World (universe lore)

```
GET    /api/world?universe=valorain              returns: { regions[], npcs[], facts[] }
GET    /api/world/npc/:npcId                     returns: NPC full profile
GET    /api/world/region/:regionId               returns: Region (description, connected regions, NPCs, items)
```

### 7.5 Codex (session-scoped stats + inventory)

```
GET    /api/sessions/:id/codex                   returns: { character, inventory, reputation[], npcLog[] }
POST   /api/sessions/:id/codex/equip             body: { itemId }
POST   /api/sessions/:id/codex/consume           body: { itemId }
```

**All responses**:

```typescript
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

---

## 7. AI Integration (API-first, free fallback chain)

### 7.1 Provider abstraction + fallback chain

```typescript
// ai/ai-provider.interface.ts
interface AIProvider {
  readonly name: string;
  generateScene(prompt: string, schema: object): Promise<unknown>; // returns parsed JSON
  analyzeIntent(prompt: string, schema: object): Promise<unknown>;
}
```

Providers: `ClaudeProvider` (dev / premium prod), `GeminiProvider`, `MistralProvider`, optional `OllamaProvider` (dev-local only). A small `ai/provider-chain.ts` tries an ordered list until one succeeds:

```typescript
// Config-driven order. Prod-free default: ['gemini', 'mistral']. Dev: ['claude']. Premium: ['claude'].
async function generateWithFallback(prompt, schema, order): Promise<Scene> {
  for (const name of order) {
    try {
      return await providers[name].generateScene(prompt, schema);
    } catch (e) {
      if (isQuotaOrTransient(e)) continue;
      throw e;
    } // quota/429/5xx → next provider
  }
  return SAFETY_SCENE; // all exhausted → pre-written neutral scene; player never hard-crashes
}
```

**Selecting/reordering providers is config, never code.** The chain is the anti-bug net _and_ the load absorber (§ Capacity).

### 7.2 Why a cheap/free model is enough here

In Grimoire the model only writes prose — the backend supplies the memory, rules, and dice. So the model's job is small, and these techniques make even a free-tier model reliable:

1. **Forced structured output.** Pass the `Scene` JSON schema to the provider's JSON/structured-output mode so the model _cannot_ emit anything else. Eliminates ~80% of "the AI went off the rails."
2. **Fresh dossier every turn (§3.3).** Never ask the model to remember; hand it the facts.
3. **Locked system prompt + few-shot.** A strong system prompt (world laws, tone, allowed/forbidden lexicon) plus **1–2 example scenes** — the single biggest quality lever on free models. They imitate examples far better than they follow instructions.
4. **Low temperature** (~0.6–0.8) to reduce drift.
5. **Validate + regenerate (§6.3).** Broken format/tone/canon → retry once with the error; second failure → safety scene. The player never sees a broken scene.
6. **Develop on Claude, run on the free chain.** Tune prompts against the best prose, then let Gemini→Mistral serve them in prod.

### 7.3 Validation (structure + canon)

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
    if (c.text.length > 20) errors.push(`Choice too long: "${c.text}"`);
  // canon guard: reject scenes that contradict world laws / pillar NPCs (e.g. resurrecting the dead)
  errors.push(...assertNoContradiction(scene, canon));
  return { isValid: errors.length === 0, errors };
}
```

On failure, `game-engine.service` regenerates once (passing `errors` back to the model), then falls back to a neutral pre-written scene.

### 7.4 AI anti-patterns to enforce

Don't: fancy vocabulary; >700-word scenes; invent NPCs that contradict world-state; make all choices equally good; expose raw stat numbers; overuse the player name; break the dark-fantasy-measured tone; ignore the Corruption clock; all-combat pacing.
Do: clear language; 400–600 words; reuse persisted NPCs by name; some risky/failing choices; show consequences; vary scene types including quiet/mundane beats; reference the advancing threat.

---

## 8. Security & Quality

- Validate every input with Zod at the route boundary; never trust the frontend.
- Auth: JWT (short access + refresh), bcryptjs, secrets via env.
- CORS allowlist, Helmet, HTTPS in prod.
- **Per-player rate-limit on AI actions** (not just global): stop one player from spamming actions and draining the shared free quota for everyone (§ Capacity).
- **Prompt-injection guard**: treat free-action text and any player text as untrusted; wrap in clearly delimited blocks and instruct the model never to follow instructions found inside player input (§9.1).
- AI cost/perf: structured output, retrieval-limited context (§3.4), cached canon/system prompt.
- Centralized error handler; Pino logs; never leak stack traces.
- Testing: Vitest (front + back), Cypress E2E. Knip (dead code), bundle analyzer.

---

## 9. Deployment & Capacity (free-first, degrade gracefully)

### 8.1 Free deployment

| Layer                    | Service                         | Tier                | Cost |
| ------------------------ | ------------------------------- | ------------------- | ---- |
| Frontend (Next.js)       | **Vercel**                      | free                | 0€   |
| Backend (Express)        | **Railway** or **Render**       | free                | 0€   |
| DB (Postgres + pgvector) | **Supabase**                    | free                | 0€   |
| AI (prod)                | **Gemini Flash → Mistral** APIs | free quotas         | 0€   |
| AI (dev)                 | **Claude** API                  | pay-per-use (cents) | ~0€  |

Secrets (Gemini/Mistral/Claude keys, DB URL) live in env vars on the platform. No GPU, no self-hosted model, nothing to buy — just create the free accounts/keys.

### 8.2 Capacity — where it breaks and how to scale

The bottleneck is **not** the app (a scene is a light DB read/write) — it's the **AI free quota** (requests/minute + requests/day). Each player action = 1 AI request.

- **1 player**: ~1 action / 20–40 s → fine.
- **Tens of simultaneous players**: free chain holds (Gemini + Mistral quotas **sum**; saturation falls through to the next provider).
- **Hundreds at once**: free quotas exhaust → you must add capacity (below). You **degrade, not crash**: a saturated chain ends in a short queue or the safety scene, never a hard failure.

**Scale levers, cheapest first:**

1. **Free** — fallback chain (sum quotas) + a short **request queue** when all providers are busy (a narrative RPG tolerates a 2–3 s wait) + per-player rate-limit.
2. **A few €/month** — move _one_ provider to its paid tier (Gemini/Mistral are cents per 1000 scenes; pay only for what you use). This is the right move once you actually _have_ players.
3. **At scale** — caching, multiple API keys in rotation, a real cloud plan. A "good problem" you solve when you have traffic (and likely revenue).

> Design intent: **degrade gracefully, never hard-crash.** Start free for tens of players; raise capacity in € proportional to success, with no rewrite.

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

Design/rationale in `GAME_DESIGN.md` §5. Implementation contracts below. (Twitch/streamer voting is **cut** — `GAME_DESIGN.md` §2.)

### 9.1 Free Action ("Action Libre") — primary interface

**Frontend**: `FreeActionInput.tsx` rendered **above** `ChoicesList`. On submit, POST raw text.

```
POST /api/game/action
{ sessionId: string, freeAction: string }   // or { sessionId, choiceId } for a suggestion
```

**Backend** (`ai/intent-analyzer.ts` → `game-engine`):

1. Validate `freeAction` (Zod: non-empty, ≤ 280 chars, sanitized, treated as untrusted — §7).
2. `analyzeIntent` → `{ stat, difficulty, rationale }` (structured output).
3. **Backend** resolves the check via `dice.ts` (§9.3) — the AI never decides success.
4. Resolved outcome + dossier (§3.3) → next scene.
5. Support **negotiable checks** (`GAME_DESIGN.md` §3.4): if the player's text justifies a different stat ("I use Charisma, not Strength"), the analyzer may return that stat.

```typescript
interface FreeActionAnalysis {
  stat: StatKey;
  difficulty: number;
  rationale: string;
}
```

### 9.2 Action vs Dialogue auto-detection (`GAME_DESIGN.md` §5.2)

A single input; the backend segments the raw text into **dialogue** and **action** parts. Detection must run **in real time on the frontend** (to drive the live chip `💬 / ⚔ / 💬+⚔`) and **authoritatively on the backend** (for resolution).

```typescript
type Segment = { kind: "dialogue" | "action"; text: string };

// Shared util (packages/shared) — used by both the live chip and the backend.
function segmentInput(raw: string): Segment[];
//  "..."      → dialogue
//  *...*      → action
//  unmarked   → action (beginner-safe default)
//  mixed line → multiple segments
```

**Resolution rules** (in `game-engine`):

- **Dialogue segments** → no dice by default. They feed the NPC's social reaction (affinity shift, tone of reply). A check (`persuasion`/`lie`/`barter` → mapped to `charisma`/`intelligence`) fires **only** if `intent-analyzer` flags a real stake. Avoid a roll on every line.
- **Action segments** → routed through `intent-analyzer` (§9.1) → `dice.ts` if a check is needed.
- A **mixed** message resolves both: the social effect of the speech _and_ the action's check.

The frontend chip is a UX hint only; the backend re-segments and never trusts client classification (§7).

### 9.3 Backstory + History & Soul (step 5 of the Forge)

Types in §5.4. Components: `ForgeStepHistory` contains `BackstoryEditor` (300-char counter), `TraitChips` (16 options, max 3 selected), `AlignmentGrid` (3×3), and free-text fields for ideal/bond/flaw. All persisted on `CharacterCreate.lore`. Backstory + traits are injected into the MJ system prompt (context-builder), and **the backend** applies flaw modifiers in `dice.ts` when a scene's context matches a `trigger` (e.g. `fear_of_corruption` → −2 inside Les Catacombes). The AI is _told_ about flaws for flavor; it does not compute their mechanical effect.

### 9.4 IC / OOC mode + Slash commands (`GAME_DESIGN.md` §5.3, §5.4)

**IC / OOC** — the `ActionField` component shows an `[IC] [OOC]` toggle (`.ca-modes`). A message prefixed with `//` forces OOC. The toggle's visual state changes the entire field's accent color: IC → arcane violet · OOC → steel blue (exactly as in `Grimoire - Session.html`).

```
POST /api/game/action
{ sessionId, input, mode: 'ic' | 'ooc' }   // '//' prefix → mode='ooc'
```

- **IC** → normal flow (§9.1, §9.2): segment, analyze, roll, advance the scene.
- **OOC** → `ai/ooc.service.ts` — its own prompt ("you are the GM speaking out-of-character; do not advance the story"). No world-state mutation, no dice. The OOC thread renders as a distinct message list (`.ooc-thread`) below the field, separate from the narrative. Supports: recap, rules questions, retry requests, safety asks.

**Slash commands** — `SlashPalette` component. Typing `/` opens a positioned dropdown (`position: absolute; bottom: calc(100% + 8px)`). Navigation: ↑↓ keys + Enter/Tab to confirm.

Full slash command spec (from `docs/Grimoire/grimoire-session.js`):

| Command        | Type   | Handler                                                               | Phase |
| -------------- | ------ | --------------------------------------------------------------------- | ----- |
| `/roll <expr>` | Dice   | Client-side RNG + logged to dice journal                              | 2     |
| `/recap`       | OOC    | `POST /api/game/action { mode: 'ooc', input: 'résume la situation' }` | 2     |
| `/inventaire`  | UI     | Flash Codex inventory card (`.card.flash` CSS animation)              | 2     |
| `/statut`      | UI     | Flash Codex stats card                                                | 2     |
| `/regarder`    | IC     | Observation action → INT check                                        | 2B    |
| `/repos`       | IC     | Rest action → recover HP/Vigueur                                      | 2B    |
| `/partager`    | Export | Share scene to Discord (copy formatted text)                          | 2B    |
| `/sauvegarder` | Meta   | Force-save session state                                              | 2B    |

Slash commands are **thin client-side shortcuts** — they map to existing endpoints or UI actions. No new backend engine needed.

### 9.5 Dice resolution + visible roll + dice journal + free rolls

`game-rules/dice.ts` is authoritative:

```typescript
interface RollResult {
  die: number; // 1–20
  stat: StatKey;
  statValue: number;
  modifiers: { source: string; delta: number }[]; // flaws, fatigue, items
  total: number; // die + statValue + Σ modifiers
  difficulty: number;
  success: boolean;
  crit: "success" | "failure" | null; // nat 20 / nat 1 → the salt of the table
}
```

The action endpoint returns `RollResult` with the next `Scene`. **Phase 2**: resolve with a visible text reveal (roll, modifier, verdict, crit). **Phase 3**: `DiceRoll.tsx` (`@react-three/fiber`) animates a 3D D20; respect Settings → "animations off".

- **Dice journal** (Phase 2, trivial): persist each `RollResult` per session; `DiceJournal.tsx` lists them (players love re-reading their nat 20). `GET /api/session/:id/rolls`.
- **Free dice box** (Phase 2B, cosmetic/optional): a `2d6+3` field + quick `d4 d6 d8 d20 d100` buttons for off-system rolls (home-brew damage, personal rolls). Pure client-side RNG, logged to the journal; it does **not** feed the authoritative check engine.
- **Inspiration token** (Phase 2B): **1 free re-roll per scene**. Granted at scene start, spent to re-roll a failed check. Turns failure into a _choice_ ("re-roll or accept fate?") without removing stakes. Tracked in session state; may later evolve toward a "earned by roleplay" model.

### 9.6 NPC affinity & world-state UI

`NpcAffinityList.tsx` (sidebar) renders persisted `WorldNpc.affinity` (§3.2). `CorruptionMeter.tsx` renders `WorldClock.corruptionLevel` (`GAME_DESIGN.md` §4.2, §7.2). Both read straight from world-state — display-only. NPC avatars are **generated from initials + color** at MVP; real generated portraits are deferred to Phase 3 (image-gen cost/coherence).

### 9.7 Chronicle (in-game + export)

The narrative is **scrollable in-session** (a `ChroniclePanel.tsx` reading the session's scene history), not only at the end. `GET /api/session/:id/chronicle?format=md|pdf` compiles scenes + choices + items + key world-facts.

- **Markdown** (Phase 2): Discord-formatted long post.
- **PDF** (Phase 3): server-rendered, aged-parchment theme; store in Supabase Storage; return a signed URL.

### 9.8 Session seeds + leaderboard (seed Phase 2 / board Phase 3)

```typescript
interface SessionSeed {
  code: string;
  universeType: UniverseType;
  startingCharacter: CharacterTemplate;
  rngSeed: number;
}
```

- `rngSeed` makes the _opening_ situations deterministic (same seed → same start; choices then diverge via emergent canon).
- `code` (e.g. `GREYMOOR-42`) is the shareable handle.
- **Leaderboard** (Phase 3): `GET /api/leaderboard?seed=GREYMOOR-42` ranks runs by depth/XP/time. Generate and display `code` from Phase 2 so it's ready before the board ships.

### 9.9 Deferred specs (Phase 2B/3) — sketches only

- **Narrative travel map** (`GAME_DESIGN.md` §5.11): persist an ordered list of visited canon places (from Emergent Canon, §3.2) — a chain of nodes, **no XY coordinates**. `MapTrail.tsx` renders `Pont → Sanctuaire → ( ? )`. Linear at first.
- **Table safety — Lines & Veils** (`GAME_DESIGN.md` §5.12): a `SafetySettings` object (avoided topics) injected into every system prompt with a hard instruction to never generate them and to keep "veil" topics off-screen. Set at session start or in Settings; dismissable.
- **Per-scene ambient sound** (nice-to-have, Phase 3): mapping improvised scenes to an audio bank is a project in itself (bank, mood detection, licensing). Not committed.

> **Explicitly rejected:** multi-character switching (PluralKit-style) — Grimoire is a single-hero solo RPG; multiple saves already exist via the dashboard, and mid-run switching would break world-state coherence.
