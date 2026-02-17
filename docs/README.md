# RPG Narratif - Documentation Index

**Last Updated**: Février 2026
**Status**: Phase Planning Complete ✅

---

## 📖 Documents Guide

Cette page indexe tous les documents et explique leur relation. **Lis-la d'abord.**

### 1. **GAME_DESIGN.md** ⭐ (START HERE)
**What**: Complète vision du jeu, univers, classes, phases, roadmap

**Contains**:
- ✅ Concept du jeu
- ✅ Univers Valorain (cohérent, original)
- ✅ 5 classes détaillées
- ✅ Fonctionnalités par phase (MVP, Phase 2B, Phase 3)
- ✅ Pourquoi certaines features viennent après MVP
- ✅ Timeline et calendrier
- ✅ Success criteria

**Read This If**: Tu veux comprendre le jeu dans sa globalité

**Update This When**:
- Concept/univers change
- Classes modifiées
- Phase redéfinie

---

### 2. **FRONTEND_ARCHITECTURE.md** 🎨 (FOR BUILDING UI)
**What**: Structure complète du frontend Next.js et tous les composants

**Contains**:
- ✅ Directory structure
- ✅ 9 pages détaillées (Landing, Auth, Dashboard, Game, etc.)
- ✅ Wireframes ASCII pour chaque page
- ✅ 20+ composants React à créer
- ✅ Gestion d'état (Zustand)
- ✅ Mock data structures
- ✅ Styling strategy (Tailwind)
- ✅ Phase 1A milestone checklist

**Read This If**: Tu vas coder le frontend

**Update This When**:
- Design de page change
- Nouveau composant découvert
- Wireframes affinées

---

### 3. **NARRATIVE_DESIGN.md** 📖 (FOR AI/STORY)
**What**: Standards pour les scènes narratives générées par l'IA

**Contains**:
- ✅ Principes narratifs (rich + simple)
- ✅ Template pour prompts IA
- ✅ Exemples de scènes (bon/mauvais)
- ✅ Mécaniques d'engagement (NPCs, world events, branching)
- ✅ Replayability patterns
- ✅ Scene validation checklist
- ✅ Intégration backend

**Read This If**: Tu codes les services IA et backend

**Update This When**:
- Template IA changé (après tests)
- Nouvelles mécaniques découvertes
- Validation rules modifiées

---

### 4. **TECH_STACK.md** 🛠️ (FOR CODE QUALITY)
**What**: Libraries recommandées, architecture patterns, security, best practices

**Contains**:
- ✅ Frontend libraries (Zustand, React Query, Framer Motion, etc.)
- ✅ Backend libraries (Prisma, JWT, bcryptjs, logging, etc.)
- ✅ Architecture patterns (service layer, DI, error handling)
- ✅ Security best practices (validation, CORS, rate limiting, auth)
- ✅ Code conventions (TypeScript, naming, comments)
- ✅ Performance optimization
- ✅ Testing & monitoring

**Read This If**: Tu codes ou tu fais code review

**Update This When**:
- Nouvelle library découverte (utile)
- Pattern mieux practice trouvé
- Security issue identifiée

---

### 5. **MEMORY.md** 🧠 (SESSION TRACKING)
**What**: État du projet, préférences, status par phase

**Contains**:
- ✅ Current project state
- ✅ User preferences & constraints
- ✅ Phase status & progress
- ✅ Key decisions made
- ✅ Important notes pour Claude

**Read This If**: Tu cherches l'état actuel du projet

**Update This When**:
- Phase change (completed)
- Major decision made
- Blocker discovered
- User preference expressed

---

## 🔄 Relationship Between Docs

```
GAME_DESIGN.md (What to build)
    ├─ What does the game do?
    ├─ How many phases?
    └─ Timeline?

FRONTEND_ARCHITECTURE.md (How to build frontend)
    ├─ Pages needed
    ├─ Components needed
    └─ Data structures

NARRATIVE_DESIGN.md (How to generate story)
    ├─ Scene quality standards
    ├─ AI prompt template
    └─ Validation rules

TECH_STACK.md (How to code it well)
    ├─ Libraries to use
    ├─ Architecture patterns
    ├─ Security practices
    └─ Code conventions

MEMORY.md (Current status)
    ├─ Where are we now?
    ├─ What's next?
    └─ Important notes
```

---

## 📋 How to Use These Docs

### For Planning (Now)
1. Read **GAME_DESIGN.md** → Understand game concept
2. Read **FRONTEND_ARCHITECTURE.md** → See what pages to build
3. Read **MEMORY.md** → Check current status
4. Read **TECH_STACK.md** → Understand code standards

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

## 🤖 How Claude Uses These Docs

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

## ✅ Doc Maintenance

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

## 📊 Current Status Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **Game Design** | ✅ Complete | Univers Valorain, 5 classes, 3 phases |
| **Frontend Spec** | ✅ Complete | 9 pages, 20+ components, wireframes |
| **Narrative Design** | ✅ Complete | AI prompts, validation, standards |
| **Tech Stack** | ✅ Complete | All libraries + best practices |
| **Phase 1A (Frontend)** | 🕐 Ready | Can start week 1 |
| **Phase 1B (Backend)** | 🕐 Ready | Can start week 4 |
| **Phase 2 (Integration)** | 📋 Planned | Week 7-10 |

---

## 🎯 Next Steps

**Current Phase**: Planning (Complete)
**Next Phase**: Phase 1A - Frontend UI

**Before Starting**:
1. ✅ Confirm docs are clear
2. ✅ Confirm timeline (10 weeks for MVP)
3. ✅ Confirm no major changes needed
4. ✅ Confirm Claude should start coding

**When Ready**: Say "Start Phase 1A - Frontend UI"

---

## 📝 Document Versions

| Doc | Version | Last Updated |
|-----|---------|--------------|
| README.md | 1.0 | Feb 2026 |
| GAME_DESIGN.md | 1.0 | Feb 2026 |
| FRONTEND_ARCHITECTURE.md | 1.0 | Feb 2026 |
| NARRATIVE_DESIGN.md | 1.0 | Feb 2026 |
| TECH_STACK.md | 1.0 | Feb 2026 |
| MEMORY.md | 2.0 | Feb 2026 |

---

## 🆘 Questions?

If you're confused about:
- **What to build**: Read GAME_DESIGN.md
- **How to build frontend**: Read FRONTEND_ARCHITECTURE.md
- **How to write story**: Read NARRATIVE_DESIGN.md
- **How to code it**: Read TECH_STACK.md
- **Where we are now**: Read MEMORY.md

---

## ✨ Summary

**You have everything needed to build a professional RPG game:**
- ✅ Complete game design
- ✅ Full architecture planned
- ✅ Clear components
- ✅ Narrative standards
- ✅ Tech stack optimized
- ✅ Best practices documented
- ✅ Security patterns defined
- ✅ Roadmap clear

**Ready to ship a game people will love playing.**
