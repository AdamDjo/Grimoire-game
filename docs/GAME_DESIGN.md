# Game Design - RPG Narratif Valorain

**Version**: 2.0 (Consolidated)
**Status**: Ready to Develop ✅

---

## 📖 Vue d'ensemble

### Concept
**RPG Narratif Web** est un jeu d'aventure généré par IA où chaque partie est unique. Le joueur crée un personnage, explore l'univers de **Valorain**, prend des décisions avec conséquences permanentes. Progression visible (leveling, loot) + narrative rich + replayabilité = addiction.

### Core Hook
- 🎮 **Progression**: Leveling visible, loot drops, skills débloqués
- 📖 **Narrative**: Scènes riches générées par IA, conséquences permanentes
- 🔄 **Replayabilité**: 5+ endings, classes différentes = expériences différentes
- 🎯 **Engagement**: Mundo se souvient des choix, NPCs réagissent, world change

### Exemple de Session
```
1. Créer Thrall, Guerrier (Str 14, Agi 11, Int 8, Emp 10, Wil 12)
2. L'IA génère scène 1: Terres Sauvages de Valorain
3. Rencontrer bandits → choisir combat ou négociation
4. Combat gagné → [EPIC] Épée des Anciens (loot!)
5. Level 2! +1 Strength. Skill "Cleave" débloqué!
6. Festival arrive → nouvelles opportunités
7. 1h30+ de gameplay → possible mort, victoire, ou fin secrète
8. Rejouer = univers différent, NPCs différents, histoire différente
```

---

## 🌍 Univers: Valorain

### Overview
Monde cohérent inspiré WoW, mais **entièrement original** (évite problèmes légaux).

### Geography
- **Valorheim**: Terres nordiques, guerriers, châteaux de pierre
- **Shadowveil**: Lands corrompues, undead, darkness
- **Sanctum**: Tours de magie, forêts enchantées, mystères
- **Verdantis**: Jungles denses, nature sauvage, créatures primitives
- **Skybound**: Îles flottantes, êtres célestes, mystère

### Factions
| Faction | Alignment | Goal |
|---------|-----------|------|
| **Order of Honor** | Good | Maintenir l'ordre, protéger innocents |
| **Shadow Circle** | Evil | Conquête du pouvoir, corruption |
| **Wild Kin** | Neutral | Liberté, nature, autodétermination |
| **Mage Council** | Neutral | Connaissance, magie, étude |

### Creatures (Originaux)
- **Valorrim**: Humanoids nordiques (not dwarves)
- **Aether-touched**: Êtres magiques (not elves)
- **Voidborn**: Créatures shadow (not demons)
- **Feylins**: Folk forestiers (not fairies)
- **Drakonir**: Humanoids écailleux (not dragons)

---

## ⚔️ Classes de Valorain

### Guerrier
- **Stats**: +2 Force, +1 Volonté
- **Playstyle**: Combat direct, dégâts élevés
- **Skills**: Coup de Marteau (L3), Tourbillon (L8), Armure de Roche (L15)
- **Strength**: Plus dégâts, plus HP
- **Weakness**: Moins options parole, moins intellect

### Magicien
- **Stats**: +2 Intellect, +1 Agilité
- **Playstyle**: Énigmes, magie, solutions créatives
- **Skills**: Projectile (L3), Téléportation (L8), Explosion (L15)
- **Strength**: Déverrouille secrets, créativité
- **Weakness**: Moins HP, moins force brute

### Voleur
- **Stats**: +2 Agilité, +1 Empathie
- **Playstyle**: Stealth, pickpocket, esquive
- **Skills**: Coup Sournois (L3), Invisibilité (L8), Poison (L15)
- **Strength**: Évite combats, vole, chemins secrets
- **Weakness**: Moins défense, moins dégâts bruts

### Prêtre
- **Stats**: +2 Empathie, +1 Intellect
- **Playstyle**: Guérison, persuasion, support
- **Skills**: Guérison (L3), Bénédiction (L8), Résurrection (L15)
- **Strength**: Parler NPCs, déblocage conversations
- **Weakness**: Moins dégâts, moins agilité

### Chevalier
- **Stats**: +2 Force, +2 Volonté, -1 Agilité
- **Playstyle**: Chevaleresque, honorable, défense
- **Skills**: Bouclier (L3), Honneur (L8), Bastion (L15)
- **Strength**: Path "honorable", réduction dégâts
- **Weakness**: Moins agilité, certains choix "sales" refusés

---

## 🎮 Features par Phase

### Phase 1 - MVP (Week 1-10) ✅
**Goal**: Game is playable and fun

#### Essential Features
| Feature | Why | Example |
|---------|-----|---------|
| **Authentication** | Control access | Login/signup |
| **Character Creation** | Player identity | Choose class, distribute stats |
| **Scene Generation** | Core gameplay | AI generates narrative |
| **Choices & Consequences** | Interactivity | Choices affect stats, inventory |
| **Leveling System** | Progression | Visible XP bar, level ups |
| **Loot & Rarity** | Dopamine | Common/Uncommon/Rare/Epic/Legendary items |
| **Stat Checks** | Difficulty | "Intellect ≥ 12?" success/fail |
| **Multiple Endings** | Replayability | 5+ distinct endings based on choices |
| **Game Over** | Stakes | Possible death, madness, betrayal |

#### Not In MVP (But Planned)
- Named NPCs with memory (Phase 2B)
- Random world events (Phase 2B)
- Build diversity (class affects narrative) (Phase 2B)
- Achievements & leaderboards (Phase 2B)
- New Game+ mode (Phase 3)

### Phase 2B - Core Features (Week 11-16)
**Goal**: Game is addictive, highly replayable

| Feature | Addiction | Details |
|---------|-----------|---------|
| **Named NPCs** | Emotional investment | Tormund remembers you in scene 5, 12, 18 |
| **World Events** | Surprise, freshness | Random merchants, festivals, rare bosses |
| **Build Diversity** | Class identity | Warrior ≠ Mage experience (30-40% different) |
| **Achievements** | Completionism | "Dragon Slayer", "Speedrunner", etc. |
| **Reputation** | Consequences felt | Factions react to your choices |

### Phase 3 - Polish (Week 17+)
**Goal**: Community, cosmetics, streaming

| Feature | Purpose |
|---------|---------|
| **Cosmetics** | Portraits, skins, titles |
| **NG+ Mode** | Meta-knowledge rewards |
| **Real Leaderboards** | Competition |
| **Story Export** | PDF, share with friends |
| **Streaming Integration** | Twitch chat affects game |
| **Community Features** | Wiki, fan art, discussions |

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
- ✅ User creates character (5 classes work)
- ✅ Game generates unique scenes via AI
- ✅ Choices have consequences (visible)
- ✅ Leveling works (XP bar, level ups)
- ✅ Loot drops with rarity colors
- ✅ Session playable 50-70 minutes
- ✅ Multiple endings (5+) exist
- ✅ 0 game-breaking bugs

### Phase 2B Success (Week 16)
- ✅ NPCs appear multiple times, remember you
- ✅ World events add surprise factor
- ✅ Class affects 30-40% of content
- ✅ Achievements motivate replays
- ✅ Player wants to play again immediately

### Addiction Metric
**By Phase 2B, players should feel**:
- 🎮 "I want to play again with different class"
- 📖 "What if I made different choice in scene 5?"
- 🏆 "I need to unlock all achievements"
- 🌍 "The world felt different this playthrough"

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
- ✅ Game becomes viral (word of mouth)

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

✅ **Single Univers Valorain** (not multiple worlds)
✅ **5 Classes** (diversity without overcomplication)
✅ **Frontend-First** (design before backend)
✅ **Multi-AI Provider** (fallback reliability)
✅ **Permanent Consequences** (weight of choices)
✅ **Phase 2B After MVP** (strategic shipping)

---

## 🚀 Next Step

**When ready to code**: Say "Start Phase 1A"

All spec, architecture, and tech stack documented.
Ready to build the game.
