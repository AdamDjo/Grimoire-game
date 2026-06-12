# Grimoire — Project Memory

**Last Updated**: 2026-06-12
**Current Phase**: Game design complete → Ready to build

> Claude: read this file first at the start of every session. This is the current project state. For vision, features, and lore: `GAME_DESIGN.md`. For stack, architecture, AI prompts: `TECH_STACK.md`.

---

## Quick Status

| Aspect           | Status                                                                       |
| ---------------- | ---------------------------------------------------------------------------- |
| **Tooling / CI** | ✅ All in place (ESLint, Prettier, Husky, Vitest, Cypress, Renovate, CodeQL) |
| **Game design**  | ✅ Complete — `GAME_DESIGN.md` v5.0 + `TECH_STACK.md` v2.0                   |
| **Frontend**     | ⏳ Not started — ready for Phase 1A                                          |
| **Backend**      | ⏳ Not started — ready for Phase 1B                                          |
| **Open PR**      | #80 `feature/79-docs-consolidation` → develop (ready to merge)               |

---

## Documentation (current structure)

| File                  | Role                                                | Open when              |
| --------------------- | --------------------------------------------------- | ---------------------- |
| `docs/MEMORY.md`      | This file — session state                           | Every session          |
| `docs/GAME_DESIGN.md` | The WHAT: vision, Valorain, UI, RP features, phases | Design, UI, narrative  |
| `docs/TECH_STACK.md`  | The HOW: stack, memory engine, AI, deployment       | Code, architecture, AI |

> `FRONTEND_ARCHITECTURE.md`, `NARRATIVE_DESIGN.md`, `docs/README.md` → deleted (content merged into the 2 docs above). Do not recreate.

---

## Next Steps

1. **Merge PR #80** → develop (docs consolidation)
2. **Phase 1A** — Valorain frontend: all pages static, dark-fantasy UI (reference: Claude Design bundle `Grimoire - Session.html`)
3. **Phase 1B** — Backend: DB schema, auth, lore/memory tables (`WorldNpc`, `WorldFact`, `WorldClock`), AI providers
4. **Phase 2** — Integration: playable MVP + Free Action + IC/OOC + Flaws + persistent NPCs + world-state

---

## The Pitch (one sentence)

> **Grimoire is the AI Game Master that finally works: it remembers, it doesn't cheat, and your choices change the world for good.**

Direct competitor: AI Dungeon (total freedom, zero memory). Grimoire wins on coherence, not on the model.

---

## Key Technical Decisions

- **Backend stack**: Node + Express + TS — do not change (I/O-bound, shared TS types front/back, one language for a solo frontend dev)
- **AI**: Claude (dev) → Gemini Flash → Mistral (free prod, fallback chain = load absorber, never self-host an LLM)
- **Free deployment**: Vercel + Railway/Render + Supabase + free APIs
- **Load/capacity**: graceful degradation (fallback chain + per-player rate-limit + queue), never hard-crash
- **Lore**: Fixed Canon (hand-written, small) + Emergent Canon (backend-frozen) — same system as memory
- **Twitch/streamer voting**: cut permanently (anti-RP by design)

---

## User Preferences

- Language: **French** (respond in French always)
- Commits: **never** add `Co-Authored-By Claude` / `noreply@anthropic.com`
- Commit format: `type(scope): message`
- Workflow: issue → branch → PR, **never commit directly on develop/main**
- Sequential work (no parallel agents unless explicitly asked)
- Solo dev, frontend background — explain backend concepts simply

---

## GitHub Workflow (reminder)

```
GitHub issue → branch feature/<n>-<desc> from develop
→ commits → PR → merge into develop
hotfix/* and release/* → main
```

Always pass labels **explicitly** to the PR (auto-labeler only runs on GitHub Actions events).

---

## Key Code Files

| Path                                               | Role                                           |
| -------------------------------------------------- | ---------------------------------------------- |
| `CLAUDE.md`                                        | Git rules + conventions (overrides everything) |
| `packages/shared/src/index.ts`                     | Shared types barrel export                     |
| `apps/backend/src/index.ts`                        | Express entry point                            |
| `apps/frontend/src/app/layout.tsx`                 | Next.js root layout                            |
| `apps/backend/src/ai/ai-provider.interface.ts`     | AI provider abstraction                        |
| `apps/backend/src/services/game-engine.service.ts` | Central game orchestrator                      |
