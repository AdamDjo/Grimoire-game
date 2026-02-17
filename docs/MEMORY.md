# RPG Game - Project Memory & Status

**Last Updated**: Février 2026
**Current Phase**: Planning Complete → Ready for Phase 1A ✅

---

## 🎯 Quick Summary

**Game**: RPG narratif généré par IA (Valorain univers, 5 classes, progression visible, replayabilité infinie)
**Status**: Planning done, ready to code
**Next**: Phase 1A - Frontend UI (Week 1-5)

---

## 📖 Documentation Structure

**ALL DOCS ARE HERE**: `docs/` folder

| Doc | Purpose | Read When |
|-----|---------|-----------|
| **README.md** | Index + overview | First! Shows structure |
| **GAME_DESIGN.md** | Game vision, phases, design | Understand WHAT to build |
| **FRONTEND_ARCHITECTURE.md** | All pages & components | Build frontend |
| **NARRATIVE_DESIGN.md** | Story standards, AI prompts | Code backend/AI |
| **TECH_STACK.md** | Libraries, patterns, security | Code anything |
| **MEMORY.md** | This file - status tracking | Every session |

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
- Player creates character (choose class from 5)
- AI generates unique universe + narrative scenes
- Player makes choices with permanent consequences
- Leveling + loot drops provide progression
- Multiple endings based on choices
- Each playthrough feels different (AI generation)

### Core Addictive Loop
1. Create character (identity)
2. See scene (immersion)
3. Choose action (agency)
4. See consequences (weight)
5. Get loot/XP (reward)
6. Level up (progression)
7. Go to step 2 (repeat)

### Universe: Valorain
- Single cohesive medieval fantasy world
- 4 regions, 4 factions, original creatures
- WoW-inspired but legally original
- Lore cached per session (not regenerated)

### Classes (Each Different Playstyle)
- Warrior: Combat, direct damage
- Mage: Intellect, puzzles, magic
- Rogue: Agility, stealth, theft
- Priest: Empathy, persuasion, healing
- Paladin: Honor-based, defensive

---

## 📅 Timeline (From GAME_DESIGN.md)

```
PHASE 1A (Week 1-5):  Frontend UI - ALL PAGES STATIC
├─ Week 1: Auth pages + component library
├─ Week 2-3: Character creation + dashboard
├─ Week 4: Game session screen (most complex)
└─ Week 5: Polish + responsive design

PHASE 1B (Week 4-6): Backend scaffold - IN PARALLEL
├─ Week 4-5: Database + auth endpoints
└─ Week 6: Game engine skeleton + AI test

PHASE 2 (Week 7-10): Integration - CONNECT IT ALL
├─ Week 7: Auth + character creation live
├─ Week 8-9: Game loop with real AI
└─ Week 10: Polish + testing

RESULT: MVP SHIPPED ✅

PHASE 2B (Week 11-16): Addictive features
├─ Named NPCs with memory
├─ World events + randomization
├─ Build diversity (class affects narrative)
└─ Achievements + leaderboards

PHASE 3 (Week 17+): Polish
├─ Cosmetics, NG+ mode, real leaderboards
├─ Story export, streaming integration
└─ Community features
```

---

## 🔑 Key Decisions (Locked)

✅ **Frontend-First**: Design UI before backend code
✅ **Univers Valorain**: Single world, 5 classes, not multiple universes
✅ **Phase 2B Later**: MVP first (10 weeks), addictive features after
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
- [ ] Character creation form complete
- [ ] Class selector with 5 options
- [ ] Stat distributor (5 points system)
- [ ] Dashboard page (mock data)
- [ ] Session list display
- [ ] Responsive design checked

### Week 4
- [ ] Game session screen layout (main complexity)
- [ ] Scene display component
- [ ] Choices list (4 buttons)
- [ ] Stats sidebar (bars: HP, Sanity, Stamina)
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

| Path | Purpose |
|------|---------|
| `docs/README.md` | Index + structure overview |
| `docs/GAME_DESIGN.md` | Full game spec |
| `docs/FRONTEND_ARCHITECTURE.md` | All pages + components |
| `docs/NARRATIVE_DESIGN.md` | Story standards |
| `docs/TECH_STACK.md` | Libraries + patterns |
| `docs/MEMORY.md` | This file - status |
| `CLAUDE.md` | Root rules (conventions, etc.) |
| `apps/frontend/src/` | Frontend code (when building) |
| `apps/backend/src/` | Backend code (when building) |
| `packages/shared/src/` | Shared types |

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

## 📞 When to Update MEMORY.md

- [ ] Phase completed
- [ ] Weekly progress update
- [ ] Major decision made
- [ ] Blocker discovered
- [ ] Doc updated
- [ ] User preference expressed
