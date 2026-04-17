# Narrative RPG - Documentation Index

**Last Updated**: February 2026
**Status**: Phase Planning Complete

---

## Documents Guide

This page indexes all documents and explains their relationships. **Read this first.**

### 1. **GAME_DESIGN.md** (START HERE)
**What**: Complete game vision, universes, classes, phases, roadmap

**Contains**:
- Game concept
- Valorain universe (coherent, original)
- 5 detailed classes
- Features by phase (MVP, Phase 2B, Phase 3)
- Why certain features come after MVP
- Timeline and calendar
- Success criteria

**Read This If**: You want to understand the game as a whole

**Update This When**:
- Concept/universe changes
- Classes modified
- Phase redefined

---

### 2. **FRONTEND_ARCHITECTURE.md** (FOR BUILDING UI)
**What**: Complete Next.js frontend structure and all components

**Contains**:
- Directory structure
- 9 detailed pages (Landing, Auth, Dashboard, Game, etc.)
- ASCII wireframes for each page
- 20+ React components to build
- State management (Zustand)
- Mock data structures
- Styling strategy (Tailwind)
- Phase 1A milestone checklist

**Read This If**: You are building the frontend

**Update This When**:
- Page design changes
- New component discovered
- Wireframes refined

---

### 3. **NARRATIVE_DESIGN.md** (FOR AI/STORY)
**What**: Standards for AI-generated narrative scenes

**Contains**:
- Narrative principles (rich + simple)
- AI prompt template
- Scene examples (good/bad)
- Engagement mechanics (NPCs, world events, branching)
- Replayability patterns
- Scene validation checklist
- Backend integration

**Read This If**: You are coding AI services and backend

**Update This When**:
- AI template changed (after testing)
- New mechanics discovered
- Validation rules modified

---

### 4. **TECH_STACK.md** (FOR CODE QUALITY)
**What**: Recommended libraries, architecture patterns, security, best practices

**Contains**:
- Frontend libraries (Zustand, React Query, Framer Motion, etc.)
- Backend libraries (Prisma, JWT, bcryptjs, logging, etc.)
- Architecture patterns (service layer, DI, error handling)
- Security best practices (validation, CORS, rate limiting, auth)
- Code conventions (TypeScript, naming, comments)
- Performance optimization
- Testing & monitoring

**Read This If**: You are coding or doing code review

**Update This When**:
- Useful new library discovered
- Better practice pattern found
- Security issue identified

---

### 5. **MEMORY.md** (SESSION TRACKING)
**What**: Project state, preferences, status per phase

**Contains**:
- Current project state
- User preferences & constraints
- Phase status & progress
- Key decisions made
- Important notes for Claude

**Read This If**: You are looking for the current project state

**Update This When**:
- Phase change (completed)
- Major decision made
- Blocker discovered
- User preference expressed

---

## Relationship Between Docs

```
GAME_DESIGN.md (What to build)
    |-- What does the game do?
    |-- How many phases?
    +-- Timeline?

FRONTEND_ARCHITECTURE.md (How to build frontend)
    |-- Pages needed
    |-- Components needed
    +-- Data structures

NARRATIVE_DESIGN.md (How to generate story)
    |-- Scene quality standards
    |-- AI prompt template
    +-- Validation rules

TECH_STACK.md (How to code it well)
    |-- Libraries to use
    |-- Architecture patterns
    |-- Security practices
    +-- Code conventions

MEMORY.md (Current status)
    |-- Where are we now?
    |-- What's next?
    +-- Important notes
```

---

## How to Use These Docs

### For Planning (Now)
1. Read **GAME_DESIGN.md** -> Understand game concept
2. Read **FRONTEND_ARCHITECTURE.md** -> See what pages to build
3. Read **MEMORY.md** -> Check current status
4. Read **TECH_STACK.md** -> Understand code standards

### For Frontend Development (Week 1-5)
1. Reference **FRONTEND_ARCHITECTURE.md** for pages
2. Reference **TECH_STACK.md** for libraries & patterns
3. Update **MEMORY.md** with progress
4. Update **FRONTEND_ARCHITECTURE.md** if design changes

### For Backend Development (Week 4-6)
1. Reference **NARRATIVE_DESIGN.md** for AI/story
2. Reference **TECH_STACK.md** for architecture
3. Reference **GAME_DESIGN.md** for phases
4. Update **MEMORY.md** with progress

### For Code Review
1. Check **TECH_STACK.md** for standards
2. Validate against conventions (TypeScript, naming, security)

---

## How Claude Uses These Docs

**Every Session, Claude**:
1. **Reads** MEMORY.md first (current status)
2. **Checks** GAME_DESIGN.md for context
3. **References** relevant docs (Frontend? Narrative? Tech?)
4. **Updates** MEMORY.md with progress & decisions
5. **Suggests** updates to other docs if needed

**Example**:
```
Claude starts session:
1. "Let me check MEMORY.md... We're in Phase 1A, week 2"
2. "GAME_DESIGN.md says week 2 = Character creation UI"
3. "FRONTEND_ARCHITECTURE.md has the specs for this"
4. "TECH_STACK.md says to use React Hook Form + Zod"
5. "Let me update MEMORY.md with what we accomplished"
```

---

## Doc Maintenance

### When to Update Docs

**GAME_DESIGN.md**:
- [ ] Game concept changes
- [ ] New phase discovered
- [ ] Timeline changed

**FRONTEND_ARCHITECTURE.md**:
- [ ] Page design changes
- [ ] New component discovered
- [ ] Wireframe refined

**NARRATIVE_DESIGN.md**:
- [ ] AI prompt tested, needs adjustment
- [ ] New narrative mechanic discovered
- [ ] Scene validation updated

**TECH_STACK.md**:
- [ ] New library added/removed
- [ ] Architecture pattern discovered
- [ ] Security issue fixed

**MEMORY.md**:
- [ ] Phase completed
- [ ] Weekly progress update
- [ ] Important decision made
- [ ] Blocker discovered

---

## Current Status Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **Game Design** | Complete | Valorain universe, 5 classes, 3 phases |
| **Frontend Spec** | Complete | 9 pages, 20+ components, wireframes |
| **Narrative Design** | Complete | AI prompts, validation, standards |
| **Tech Stack** | Complete | All libraries + best practices |
| **Phase 1A (Frontend)** | Ready | Can start week 1 |
| **Phase 1B (Backend)** | Ready | Can start week 4 |
| **Phase 2 (Integration)** | Planned | Week 7-10 |

---

## Next Steps

**Current Phase**: Planning (Complete)
**Next Phase**: Phase 1A - Frontend UI

**Before Starting**:
1. Confirm docs are clear
2. Confirm timeline (10 weeks for MVP)
3. Confirm no major changes needed
4. Confirm Claude should start coding

**When Ready**: Say "Start Phase 1A - Frontend UI"

---

## Document Versions

| Doc | Version | Last Updated |
|-----|---------|--------------|
| README.md | 1.0 | Feb 2026 |
| GAME_DESIGN.md | 1.0 | Feb 2026 |
| FRONTEND_ARCHITECTURE.md | 1.0 | Feb 2026 |
| NARRATIVE_DESIGN.md | 1.0 | Feb 2026 |
| TECH_STACK.md | 1.0 | Feb 2026 |
| MEMORY.md | 2.0 | Feb 2026 |

---

## Questions?

If you're confused about:
- **What to build**: Read GAME_DESIGN.md
- **How to build frontend**: Read FRONTEND_ARCHITECTURE.md
- **How to write story**: Read NARRATIVE_DESIGN.md
- **How to code it**: Read TECH_STACK.md
- **Where we are now**: Read MEMORY.md

---

## Summary

**You have everything needed to build a professional RPG game:**
- Complete game design
- Full architecture planned
- Clear components
- Narrative standards
- Tech stack optimized
- Best practices documented
- Security patterns defined
- Roadmap clear

**Ready to ship a game people will love playing.**
