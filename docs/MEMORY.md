# Grimoire - Project Memory

**Last Updated**: February 2026
**Current Phase**: Planning Complete → Ready for Phase 1A ✅

---

## 🎯 Quick Summary

**Game**: Narrative multi-universe RPG powered by AI (3 base universes, 14 classes, visible progression, massive replayability)
**Status**: Planning done, ready to code
**Architecture**: Multi-universe from Phase 1, progressive exposure (Fantasy → 3 universes → Custom)
**Next**: Phase 1A - Frontend UI (Week 1-5)

---

## 📖 Documentation Structure

**ALL DOCS ARE HERE**: `docs/` folder

| Doc                          | Purpose                       | Read When                |
| ---------------------------- | ----------------------------- | ------------------------ |
| **README.md**                | Index + overview              | First! Shows structure   |
| **GAME_DESIGN.md**           | Game vision, phases, design   | Understand WHAT to build |
| **FRONTEND_ARCHITECTURE.md** | All pages & components        | Build frontend           |
| **NARRATIVE_DESIGN.md**      | Story standards, AI prompts   | Code backend/AI          |
| **TECH_STACK.md**            | Libraries, patterns, security | Code anything            |
| **MEMORY.md**                | This file - status tracking   | Every session            |

**Note**: Old docs (PROJECT_SPECIFICATION.md, ROADMAP_DETAILED.md, TECH_RECOMMENDATIONS.md) → MERGED into consolidated docs above. Keep for reference if needed, but not authoritative.

---

## 🤖 How Claude Uses Docs

**EVERY SESSION**:

1. Read this MEMORY.md first (current status)
2. Check GAME_DESIGN.md for context (game vision)
3. Reference specific doc based on task:
   - Frontend work? → FRONTEND_ARCHITECTURE.md
   - Story/AI work? → NARRATIVE_DESIGN.md
   - Code quality? → TECH_STACK.md
4. **Update MEMORY.md** at session end with:
   - Progress made
   - Any blockers
   - Next steps
   - Doc changes needed

---

## 📋 Project State

### Setup

- ✅ Monorepo: Turborepo + pnpm
- ✅ Frontend: Next.js 15 (installed)
- ✅ Backend: Express + TypeScript (ready)
- ✅ Shared: Types 95% complete
- ✅ Git hook: pnpm type-check active

### Documentation

- ✅ Game design (GAME_DESIGN.md)
- ✅ Frontend spec (FRONTEND_ARCHITECTURE.md)
- ✅ Narrative standards (NARRATIVE_DESIGN.md)
- ✅ Tech stack (TECH_STACK.md)
- ✅ All docs indexed (README.md)

### Code

- ⏳ Frontend: NOT STARTED (ready to start Week 1)
- ⏳ Backend: NOT STARTED (starts Week 4)
- ⏳ Shared types: 95% complete (minor updates as needed)

---

## 🎮 Game Overview (For Claude Memory)

### Concept

- Player chooses a **universe** (Fantasy, Apocalypse, or Sci-Fi)
- Player creates character (14 classes total, 5/4/5 per universe)
- AI generates narrative scenes adapted to the universe
- Player makes choices with permanent consequences
- Leveling + loot drops provide progression
- Multiple endings based on choices
- Each playthrough feels different (AI + multi-universe)

### Core Addictive Loop

1. Choose universe (theme selection)
2. Create character (identity + class)
3. See scene (immersion)
4. Choose action (agency)
5. See consequences (weight)
6. Get loot/XP (reward)
7. Level up (progression)
8. Go to step 3 (repeat)

### 3 Base Universes

**1. Valorain (Fantasy)**

- Medieval fantasy, magic, mythical creatures
- 5 regions, 4 factions, original creatures
- WoW-inspired but legally original
- Classes: Warrior, Mage, Thief, Healer, Ranger

**2. Terre Desolee (Apocalypse)**

- Post-apocalypse, survival, scarce resources
- Ruins, radioactive zones, human factions
- Fallout/Metro-inspired but original
- Classes: Scavenger, Brawler, Medic, Engineer

**3. Nova Galaxia (Sci-Fi)**

- Space opera, advanced tech, aliens
- Space stations, colonized planets
- Mass Effect/Star Wars-inspired but original
- Classes: Pilot, Soldier, Hacker, Diplomat, Psionic

### Universal Stats

- HP, Mana, Strength, Agility, Intelligence, Charisma, Luck
- Same stats for all universes (contextual adaptation)

---

## 📅 Timeline (From GAME_DESIGN.md)

```
PHASE 1A (Week 1-5):  Frontend UI - ALL PAGES STATIC
├─ Week 1: Auth pages + component library + universe selector
├─ Week 2-3: Character creation + dashboard
├─ Week 4: Game session screen (most complex)
└─ Week 5: Polish + responsive design
📍 Fantasy ONLY exposed, multi-universe code ready

PHASE 1B (Week 4-6): Backend scaffold - IN PARALLEL
├─ Week 4-5: Database schema (multi-universe) + auth endpoints
└─ Week 6: Game engine skeleton + AI test (fantasy)
📍 Multi-universe architecture, but fantasy only

PHASE 2 (Week 7-10): Integration - CONNECT IT ALL
├─ Week 7: Auth + character creation live
├─ Week 8-9: Game loop with real AI (fantasy)
└─ Week 10: Polish + testing
📍 RESULT: MVP SHIPPED (Fantasy universe fully playable) ✅

PHASE 2B (Week 11-16): Multi-Universe + Addictive features
├─ Week 11: Enable Apocalypse & Sci-Fi universes
├─ Week 12: Named NPCs + relationship tracking
├─ Week 13-14: World events + randomization
├─ Week 15-16: Build diversity + achievements
📍 RESULT: 3 universes, 14 classes, highly replayable ✅

PHASE 3 (Week 17+): UGC + Polish
├─ Custom universe creator (AI generates classes)
├─ Universe sharing between players
├─ Cosmetics, NG+ mode, leaderboards
├─ Story export, streaming integration
└─ Community features
```

---

## 🔑 Key Decisions (Locked)

✅ **Multi-Universe Architecture**: 3 base universes (Fantasy, Apocalypse, Sci-Fi) + custom (Phase 3)
✅ **Progressive Rollout**: Phase 1 = Fantasy only, Phase 2B = 3 universes, Phase 3 = custom
✅ **Multi-Universe Code from Phase 1**: Flexible architecture, progressive exposure
✅ **14 Classes Total**: 5 fantasy, 4 apocalypse, 5 scifi (predefined)
✅ **Universal Stats System**: HP/Mana/Str/Agi/Int/Cha/Luck for all universes
✅ **Frontend-First**: Design UI before backend code
✅ **Multi-AI Provider**: Claude → Gemini → Mistral (fallback)
✅ **Permanent Consequences**: World remembers choices
✅ **French Responses**: User is francophone
✅ **Sequential Work**: Not parallel agents (user preference)

---

## 👥 User Preferences

- 🇫🇷 Respond in French
- ⏱️ Work sequentially, NOT parallel
- 💰 Minimize token usage, be efficient
- 📊 Track progress across sessions
- ❓ Always ask before new phase
- 🎨 Rich narrative scenes (not boring)
- 🔒 Solid architecture + security
- 🏗️ Professional code standards

---

## 🚀 Phase 1A Checklist

**When Starting Phase 1A ("Start Phase 1A - Frontend UI")**:

### Week 1

- [ ] Next.js structure confirmed
- [ ] Tailwind CSS setup done
- [ ] Component library started (Button, Input, Card, etc.)
- [ ] Landing page created
- [ ] Login/Signup pages created
- [ ] Auth form validation working (frontend)

### Week 2-3

- [ ] Universe selector (3 cards: Fantasy, Apocalypse disabled, Sci-Fi disabled)
- [ ] Character creation form complete
- [ ] Class selector (5 fantasy classes visible)
- [ ] Stat distributor (universal stats system)
- [ ] Dashboard page (mock data)
- [ ] Session list display
- [ ] Responsive design checked

### Week 4

- [ ] Game session screen layout (main complexity)
- [ ] Scene display component
- [ ] Choices list (4 buttons)
- [ ] Stats sidebar (bars: HP, Mana, Str/Agi/Int/Cha/Luck)
- [ ] Inventory sidebar with items
- [ ] Event log component

### Week 5

- [ ] Game over screen
- [ ] Leaderboard mockup
- [ ] Settings page
- [ ] Polish all pages
- [ ] Test responsive design
- [ ] Test all navigation

**Deliverable**: All frontend pages done, statically, beautiful UI, no API calls

---

## 📝 Session Template (For Claude)

**At START of session**:

```
✓ Read MEMORY.md (current status)
✓ Check docs (README.md shows which to read)
✓ Assess what phase we're in
✓ Understand what we're building
```

**During session**:

```
✓ Reference specific docs as needed
✓ Update MEMORY.md with progress
✓ Propose doc updates if needed
✓ Track blockers, decisions
```

**At END of session**:

```
✓ Update MEMORY.md with:
  - What was accomplished
  - Current status
  - Next steps
  - Any doc updates made
✓ Commit message if code changed
```

---

## 🔗 Important Files

| Path                            | Purpose                        |
| ------------------------------- | ------------------------------ |
| `docs/README.md`                | Index + structure overview     |
| `docs/GAME_DESIGN.md`           | Full game spec                 |
| `docs/FRONTEND_ARCHITECTURE.md` | All pages + components         |
| `docs/NARRATIVE_DESIGN.md`      | Story standards                |
| `docs/TECH_STACK.md`            | Libraries + patterns           |
| `docs/MEMORY.md`                | This file - status             |
| `CLAUDE.md`                     | Root rules (conventions, etc.) |
| `apps/frontend/src/`            | Frontend code (when building)  |
| `apps/backend/src/`             | Backend code (when building)   |
| `packages/shared/src/`          | Shared types                   |

---

## 🎯 Success Criteria

**MVP Success (Week 10)**:

- ✅ User can create character (all 5 classes)
- ✅ Game generates unique scenes via AI
- ✅ Choices have visible consequences
- ✅ Leveling works (XP bar, level ups)
- ✅ Loot drops with rarity colors
- ✅ Session playable 50-70 minutes
- ✅ 5+ different endings exist
- ✅ 0 game-breaking bugs
- ✅ **Player wants to play again immediately**

**Phase 2B Success (Week 16)**:

- ✅ NPCs reappear, remember you
- ✅ World events add surprise
- ✅ Class affects content (30-40% different)
- ✅ Achievements motivate replays
- ✅ **Player feels strong replayability urge**

---

## 🆘 Questions to Ask Claude

If unclear: Check README.md → GAME_DESIGN.md → specific doc

## ⚙️ CI / GitHub Automation (Active)

### PR Labels (auto-applied)

Labels are auto-applied via `actions/labeler@v5` in `.github/workflows/ci.yml` based on files changed:

- `apps/frontend/**` → `frontend`, `phase-1a`
- `apps/backend/**` → `backend`, `phase-1b`
- `packages/**` → `shared`

Config: `.github/labeler.yml`

### PR Milestones (auto-assigned)

Milestones are auto-assigned via `.github/workflows/pr-metadata.yml` based on branch name:

- `feature/phase-1a-*` → Phase 1A - Frontend UI
- `feature/phase-1b-*` → Phase 1B - Backend Foundation
- `feature/phase-2-*` → Phase 2 - MVP
- `feature/phase-2b-*` → Phase 2B - Multi-Universe
- `feature/phase-3-*` → Phase 3 - Polish & UGC
- `feature/tooling-*` → no milestone (tooling branches)

**Note**: When creating PRs via MCP GitHub tool, pass labels/milestone explicitly since automation only triggers on GitHub Actions events.

---

## 📞 When to Update MEMORY.md

- [ ] Phase completed
- [ ] Weekly progress update
- [ ] Major decision made
- [ ] Blocker discovered
- [ ] Doc updated
- [ ] User preference expressed
