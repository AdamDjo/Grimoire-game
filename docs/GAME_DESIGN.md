# Game Design - Narrative RPG Multi-Universe

**Version**: 3.0 (Multi-Universe Architecture)
**Status**: Ready to Develop ✅

---

## 📖 Overview

### Concept
**Narrative Web RPG** is an AI-generated adventure game where every playthrough is unique. The player chooses a **universe** (Fantasy, Apocalypse, or Sci-Fi), creates a character, and explores dynamically generated stories. Visible progression (leveling, loot) + rich narrative + multi-universe = massive replayability.

### Core Hook
- 🎮 **Progression**: Visible leveling, loot drops, unlocked skills
- 📖 **Narrative**: Rich AI-generated scenes, permanent consequences
- 🌍 **Multi-Universe**: 3 distinct universes (Fantasy, Apocalypse, Sci-Fi) + custom (Phase 3)
- 🔄 **Replayability**: 15+ classes, 5+ endings per universe, unique experiences
- 🎯 **Engagement**: The world remembers your choices, NPCs react, world changes

### Example Session (Fantasy)
```
1. Choose universe "Valorain" (Fantasy)
2. Create Thrall, Warrior (HP 100, Str 15, Agi 11, Int 8, Cha 10, Luck 10)
3. AI generates scene 1: Wild Lands of Valorain
4. Encounter bandits -> choose combat or negotiation
5. Combat won -> [EPIC] Sword of the Ancients (loot!)
6. Level 2! +2 HP, +1 Strength. Skill "Cleave" unlocked!
7. Festival arrives -> new opportunities
8. 1h30+ of gameplay -> possible death, victory, or secret ending
9. Replay = same universe, different class OR different universe = totally unique experience
```

---

## 🌍 The 3 Base Universes

### 1. Valorain (WoW-like Fantasy)

**Theme**: Medieval fantasy, magic, mythical creatures
**Inspirations**: World of Warcraft, Skyrim (but 100% original)

**Geography**:
- **Valorheim**: Northern lands, warriors, stone castles
- **Shadowveil**: Corrupted lands, undead, darkness
- **Sanctum**: Magic towers, enchanted forests, mysteries
- **Verdantis**: Dense jungles, wild nature, primitive creatures
- **Skybound**: Floating islands, celestial beings, mystery

**Factions**:
| Faction | Alignment | Goal |
|---------|-----------|------|
| **Order of Honor** | Good | Maintain order, protect the innocent |
| **Shadow Circle** | Evil | Power conquest, corruption |
| **Wild Kin** | Neutral | Freedom, nature, self-determination |
| **Mage Council** | Neutral | Knowledge, magic, study |

**Creatures** (Original):
- **Valorrim**: Nordic humanoids
- **Aether-touched**: Magical beings
- **Voidborn**: Shadow creatures
- **Feylins**: Forest folk
- **Drakonir**: Scaled humanoids

---

### 2. Terre Desolee (Post-Apocalypse)

**Theme**: Survival, scarce resources, hostile human factions
**Inspirations**: Fallout, The Last of Us, Metro (but original)

**Geography**:
- **The Ruins**: Collapsed cities, crumbling skyscrapers
- **The Green Zone**: Rare oases of revived nature
- **The Ash Desert**: Radioactive wasteland, constant danger
- **The Bunkers**: Underground networks, hidden civilization
- **The Toxic Marshes**: Mutant zones, strange creatures

**Factions**:
| Faction | Alignment | Goal |
|---------|-----------|------|
| **The Scouts** | Good | Rebuild civilization |
| **The Raiders** | Evil | Survival by force, theft |
| **The Nomads** | Neutral | Freedom, itinerant trade |
| **The Renewal Cult** | Neutral | Mutation = evolution |

**Threats**:
- Radiation zones, mutants, raiders, scarcity

---

### 3. Nova Galaxia (Sci-Fi Space Opera)

**Theme**: Space exploration, advanced technologies, aliens
**Inspirations**: Mass Effect, Star Wars (but original)

**Geography**:
- **Nexus Prime**: Central space station, trade hub
- **Frontier Sector**: Colonized planets, lawless
- **The Void**: Deep space, ancient mysteries
- **Asteroid Belt**: Mines, pirates, danger
- **Xenos Worlds**: Alien planets, unknown civilizations

**Factions**:
| Faction | Alignment | Goal |
|---------|-----------|------|
| **Stellar Confederation** | Good | Order, galactic peace |
| **Black Syndicate** | Evil | Profit, black market, crime |
| **Free Explorers** | Neutral | Discovery, freedom |
| **Ancient Cult** | Neutral | Ancestral alien technology |

**Species**:
- Humans, Synthetics (AI), Xenos (diverse alien races)

---

## ⚔️ Classes by Universe

### 📖 Universal Stats System

**All classes use these 7 stats**:

| Stat | Fantasy | Apocalypse | Sci-Fi |
|------|---------|------------|--------|
| **HP** | Hit points | Health | Body integrity |
| **Mana** | Magical energy | Stamina | Shield energy |
| **Strength** | Physical strength | Raw strength | Gravitational force |
| **Agility** | Combat agility | Speed, dodge | Piloting reflexes |
| **Intelligence** | Magic knowledge | Engineering, crafting | Hacking, tech |
| **Charisma** | Persuasion, social | Leadership | Alien diplomacy |
| **Luck** | Loot chance | Scavenge bonus | Rare encounters |

---

### 🏰 Fantasy - Valorain (5 classes)

#### Warrior
- **Bonus**: +3 Strength, +15 Max HP, -1 Intelligence
- **Playstyle**: Melee combat, tanking, raw damage
- **Starting Skills**: Power Strike, War Cry
- **Unique**: Can break doors, intimidate enemies

#### Mage
- **Bonus**: +3 Intelligence, +20 Max Mana, -1 Strength
- **Playstyle**: Elemental spells, puzzle solving
- **Starting Skills**: Fireball, Arcane Shield
- **Unique**: Deciphers ancient runes, levitation

#### Thief
- **Bonus**: +3 Agility, +2 Luck, -5 Max HP
- **Playstyle**: Stealth, theft, traps, dodge
- **Starting Skills**: Sneak Attack, Lockpicking
- **Unique**: Detects traps, pickpocket NPCs

#### Healer
- **Bonus**: +2 Intelligence, +2 Charisma, +15 Max Mana
- **Playstyle**: Support, healing, buffs
- **Starting Skills**: Minor Heal, Purification
- **Unique**: Cures diseases, calms hostile NPCs

#### Ranger
- **Bonus**: +2 Agility, +1 Strength, +1 Luck
- **Playstyle**: Archery, nature, survival
- **Starting Skills**: Precise Shot, Tracking
- **Unique**: Tames creatures, wilderness survival

---

### 💀 Apocalypse - Terre Desolee (4 classes)

#### Scavenger
- **Bonus**: +3 Luck, +1 Intelligence, +1 Agility
- **Playstyle**: Scavenging, crafting, tinkering
- **Starting Skills**: Expert Scavenging, Tinkering
- **Unique**: Finds rare resources, repairs objects

#### Brawler
- **Bonus**: +3 Strength, +10 Max HP, -1 Intelligence
- **Playstyle**: Street fighting, brutal, resilient
- **Starting Skills**: Punch, Endurance
- **Unique**: Ignores pain, unarmed combat

#### Medic
- **Bonus**: +3 Intelligence, +2 Charisma, -1 Strength
- **Playstyle**: Healing, diagnostics, chemistry
- **Starting Skills**: First Aid, Diagnosis
- **Unique**: Creates medicine, treats radiation

#### Engineer
- **Bonus**: +3 Intelligence, +1 Agility, -1 Charisma
- **Playstyle**: Tech, hacking, traps
- **Starting Skills**: Repair, Improvised Trap
- **Unique**: Hacks terminals, creates explosives

---

### 🚀 Sci-Fi - Nova Galaxia (5 classes)

#### Pilot
- **Bonus**: +3 Agility, +2 Luck, -1 Strength
- **Playstyle**: Piloting, maneuvers, speed
- **Starting Skills**: Evasive Maneuver, Stellar Navigation
- **Unique**: Pilots ships, avoids space combat

#### Soldier
- **Bonus**: +2 Strength, +10 Max HP, +1 Agility
- **Playstyle**: Tactical combat, heavy weapons
- **Starting Skills**: Barrage Fire, Tactical Cover
- **Unique**: Military tactics, resists injuries

#### Hacker
- **Bonus**: +3 Intelligence, +1 Agility, -2 Strength
- **Playstyle**: Intrusion, system control
- **Starting Skills**: System Intrusion, Data Scan
- **Unique**: Hacks drones, disables security

#### Diplomat
- **Bonus**: +3 Charisma, +2 Intelligence, -2 Strength
- **Playstyle**: Negotiation, peaceful resolution
- **Starting Skills**: Persuasion, Cultural Analysis
- **Unique**: Avoids combat, faction access

#### Psion
- **Bonus**: +2 Intelligence, +20 Max Mana, +1 Charisma
- **Playstyle**: Mental powers, manipulation
- **Starting Skills**: Telekinesis, Mind Reading
- **Unique**: Mind control, detects lies

---

## 🎮 Features by Phase

### Phase 1 - MVP (Week 1-10) ✅
**Goal**: Game is playable and fun
**Universe**: Fantasy (Valorain) ONLY

#### Essential Features
| Feature | Why | Example |
|---------|-----|---------|
| **Authentication** | Control access | Login/signup |
| **Universe Selection** | Choose theme | Fantasy visible, others grayed out (Phase 2B) |
| **Character Creation** | Player identity | Choose class (5 fantasy), distribute stats |
| **Scene Generation** | Core gameplay | AI generates narrative (fantasy only) |
| **Choices & Consequences** | Interactivity | Choices affect stats, inventory |
| **Leveling System** | Progression | Visible XP bar, level ups |
| **Loot & Rarity** | Dopamine | Common/Uncommon/Rare/Epic/Legendary items |
| **Stat Checks** | Difficulty | "Intelligence ≥ 12?" success/fail |
| **Multiple Endings** | Replayability | 5+ distinct endings based on choices |
| **Game Over** | Stakes | Possible death, madness, betrayal |

**Code Architecture**:
- ✅ Backend ready for multi-universe (types, DB schema)
- ✅ Frontend UI with universe selector (but 2 universes disabled)
- ✅ AI prompts adaptable per universe
- 🎯 **Exposure**: Fantasy only

#### Not In MVP (But Planned)
- Apocalypse & Sci-Fi universes (Phase 2B)
- Named NPCs with memory (Phase 2B)
- Random world events (Phase 2B)
- Build diversity (class affects narrative) (Phase 2B)
- Achievements & leaderboards (Phase 2B)
- Custom universe creator (Phase 3)

### Phase 2B - Addictive Features + Multi-Universe (Week 11-16)
**Goal**: Game is addictive, highly replayable
**Universe**: All 3 base universes activated

| Feature | Addiction | Details |
|---------|-----------|---------|
| **Apocalypse & Sci-Fi** | 3x replayability | Activate the 2 other universes |
| **Named NPCs** | Emotional investment | Tormund remembers you in scene 5, 12, 18 |
| **World Events** | Surprise, freshness | Random merchants, festivals, rare bosses |
| **Build Diversity** | Class identity | Warrior ≠ Mage experience (30-40% different) |
| **Achievements** | Completionism | "Dragon Slayer", "Speedrunner", etc. |
| **Reputation** | Consequences felt | Factions react to your choices |

**Deliverable**:
- ✅ 3 playable universes (Fantasy, Apocalypse, Sci-Fi)
- ✅ 14 total classes (5+4+5)
- ✅ Massive replayability (3 universes x 5 classes x 5 endings = 75+ experiences)

### Phase 3 - Polish + Custom Universes (Week 17+)
**Goal**: Community, cosmetics, UGC (User Generated Content)

| Feature | Purpose |
|---------|---------|
| **Custom Universe Creator** | Ultimate UGC | Player creates their universe, AI generates classes |
| **Cosmetics** | Portraits, skins, titles |
| **NG+ Mode** | Meta-knowledge rewards |
| **Real Leaderboards** | Competition |
| **Story Export** | PDF, share with friends |
| **Streaming Integration** | Twitch chat affects game |
| **Community Features** | Wiki, fan art, discussions |
| **Universe Sharing** | Players share custom universes |

---

## 📊 Timeline & Phases

### Phase 1A: Frontend UI (Week 1-5)
**Parallel**: Phase 1B Backend starts week 4

```
Week 1:   Setup + Auth pages + Component library
Week 2-3: Character creation + Dashboard UI
Week 4:   Game session screen (complex!)
Week 5:   Polish, testing, responsive design

DELIVERABLE: All frontend pages done, beautiful UI, no API calls yet
```

### Phase 1B: Backend Foundation (Week 4-6)
**Parallel**: While frontend finishing

```
Week 4-5: Database schema + Auth endpoints
Week 6:   Game engine skeleton + AI integration test

DELIVERABLE: Backend structure ready, endpoints stubbed
```

### Phase 2: Integration (Week 7-10)
```
Week 7:   Auth + Character creation live
Week 8-9: Game loop with real AI
Week 10:  Polish, test, fix bugs

DELIVERABLE: MVP fully playable end-to-end ✅
```

### Phase 2B: Addictive Features (Week 11-16)
```
Week 11-12: Named NPCs + relationship tracking
Week 13-14: World events + randomization
Week 15-16: Build diversity + achievements

DELIVERABLE: Game is truly addictive, 5+ playthroughs feel different
```

### Phase 3: Polish (Week 17+)
```
Cosmetics, NG+, leaderboards, streaming, community
```

---

## 🎯 Success Criteria

### MVP Success (Week 10)
- ✅ User creates character (5 fantasy classes work)
- ✅ Fantasy universe fully playable
- ✅ Game generates unique scenes via AI
- ✅ Choices have consequences (visible)
- ✅ Leveling works (XP bar, level ups)
- ✅ Loot drops with rarity colors
- ✅ Session playable 50-70 minutes
- ✅ Multiple endings (5+) exist
- ✅ 0 game-breaking bugs
- ✅ Code ready for multi-universe (architecture)

### Phase 2B Success (Week 16)
- ✅ 3 playable universes (Fantasy, Apocalypse, Sci-Fi)
- ✅ 14 total functional classes
- ✅ NPCs appear multiple times, remember you
- ✅ World events add surprise factor
- ✅ Class affects 30-40% of content
- ✅ Achievements motivate replays
- ✅ Player wants to play again immediately

### Addiction Metric
**By MVP (Week 10), players should feel**:
- 🎮 "I want to play again with different class" (5 fantasy classes)
- 📖 "What if I made different choice in scene 5?"
- 🌍 "The world felt different this playthrough"

**By Phase 2B (Week 16), players should feel**:
- 🌍 "I want to try Apocalypse and Sci-Fi universes!"
- 🎮 "14 classes = infinite replayability"
- 🏆 "I need to unlock all achievements"
- 🔄 "Each universe feels completely different"

---

## 🔧 Tech Stack (Quick Reference)

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **State**: Zustand (client state)
- **Server Data**: React Query
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **HTTP**: Axios

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript (strict)
- **ORM**: Prisma
- **Auth**: JWT + bcryptjs
- **Validation**: Zod
- **Logging**: Pino
- **Security**: Rate limiting, CORS

### Database
- **PostgreSQL** (Supabase)

### AI
- **Providers**: Claude, Gemini, Mistral (fallback chain)
- **Prompting**: Structured JSON responses
- **Validation**: Scene validator service

---

## 📋 Why Phase 2B Not In MVP?

### Strategic Reasons

1. **Scope Control**
   - MVP only = 10 weeks (ships!)
   - Everything = 20+ weeks (never ships!)

2. **Testing**
   - MVP tests core loop with users
   - Get feedback before Phase 2B
   - Iterate based on real data

3. **Risk Mitigation**
   - If AI fails, catch it early
   - If UX bad, redesign before Phase 2B
   - If engagement low, debug core loop

4. **Feature Dependencies**
   - NPCs need many scenes (20+) to test
   - World events need randomizer working
   - Build diversity needs class context in every scene

### Better Approach
- ✅ Ship MVP (10 weeks)
- ✅ Get users playing
- ✅ Get feedback
- ✅ Implement Phase 2B (week 11-16)
- ✅ Launch Phase 2B update
- ✅ Game goes viral (word of mouth)

---

## 🎨 Narrative Standards (High Level)

### Scene Quality
- **Length**: 400-600 words (readable, rich)
- **Clarity**: Simple language, not complex vocabulary
- **Immersion**: All senses (sight, sound, smell)
- **Consequence**: Reflects previous choices
- **Branching**: 4 distinct choices, all meaningful

### NPCs (Phase 2B)
- Same NPC reappears in different contexts
- Remembers previous interaction
- Relationship affects dialogue
- Can ally or betray based on history

### World Events (Phase 2B)
- 30% chance: random encounter
- 10% chance: rare creature
- 5% chance: merchant caravan
- Each has unique loot, story impact

---

## 📊 Addiction Factor Progression

```
MVP (Week 10):        70% addictive
  ✓ Leveling (satisfying)
  ✓ Loot drops (dopamine)
  ✓ Consequences (weight)
  ✓ Multiple endings (replayability)
  ✓ AI generation (novelty)

Phase 2B (Week 16):   90% addictive
  + Named NPCs (emotional)
  + World events (surprise)
  + Build diversity (identity)
  + Achievements (completion)

Phase 3 (Week 17+):   95%+ addictive
  + Cosmetics (self-expression)
  + NG+ (meta-gaming)
  + Leaderboards (competition)
  + Community (social)
```

---

## ❓ Key Decisions Made

✅ **Multi-Universe Architecture** (3 base + custom in Phase 3)
✅ **Progressive Rollout** (Phase 1 = Fantasy, Phase 2B = 3 universes, Phase 3 = custom)
✅ **14 Total Classes** (5 fantasy, 4 apocalypse, 5 scifi)
✅ **Universal Stats System** (HP/Mana/Str/Agi/Int/Cha/Luck for all universes)
✅ **Frontend-First** (design before backend)
✅ **Multi-AI Provider** (fallback reliability)
✅ **Permanent Consequences** (weight of choices)
✅ **Multi-Universe Code from Phase 1** (flexible architecture, progressive exposure)

---

## 🚀 Next Step

**When ready to code**: Say "Start Phase 1A"

All spec, architecture, and tech stack documented.
Ready to build the game.
