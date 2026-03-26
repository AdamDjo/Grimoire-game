# Narrative RPG Web - AI-Powered

## IMPORTANT: Project Memory
**Claude: Always read `docs/MEMORY.md` at the start of each session.** It contains persistent project state, user preferences, and implementation notes that carry across conversations.

## Project Description
Interactive narrative RPG web game where AI generates unique universes for each playthrough. The player creates a character, reads narrative scenes, and chooses among text-based options. Roadwarden-style gameplay: stats, inventory, choices with consequences, possible Game Over. Infinite replayability through AI generation.

## Tech Stack
- **Monorepo**: Turborepo (pnpm workspaces)
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Multi-provider (OpenAI, Claude, Mistral, Gemini) with fallback chain
- **State**: Zustand (client) + React Query (server state)

## Project Structure
```
rpg-game/
├── apps/frontend/          # Next.js 15 app (proxy API)
├── apps/backend/           # Express API (game engine, AI, rules)
└── packages/shared/        # Shared TypeScript types & constants
```

## Commands
```bash
pnpm dev                    # Start all apps in dev mode
pnpm dev --filter frontend  # Start only frontend
pnpm dev --filter backend   # Start only backend
pnpm build                  # Build all
pnpm lint                   # Lint all
pnpm type-check             # TypeScript check all
```

## Code Conventions

### General
- TypeScript strict mode everywhere
- All types shared between frontend/backend go in `packages/shared`
- Never duplicate types - always import from `@rpg-game/shared`
- Use named exports, not default exports
- Use `async/await`, never raw Promises with `.then()`

### Naming
- Files: `kebab-case.ts` (e.g., `game-engine.service.ts`)
- Types/Interfaces: `PascalCase` (e.g., `GameSession`, `AIProvider`)
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- React components: `PascalCase.tsx` (e.g., `SceneDisplay.tsx`)

### Frontend (Next.js)
- App Router with route groups: `(auth)`, `(menu)`, `(game)`
- Components in `src/components/` organized by domain: `ui/`, `game/`, `character/`, `universe/`
- Hooks in `src/hooks/`
- All API calls go through proxy route `app/api/[...path]/route.ts`
- Use Zustand for UI state, React Query for server data
- Tailwind CSS for styling, no CSS modules

### Backend (Express)
- Routes in `src/routes/` - thin controllers, delegate to services
- Business logic in `src/services/`
- AI logic in `src/ai/` with provider abstraction
- Game rules in `src/game-rules/`
- All responses follow format: `{ success: boolean, data?: T, error?: string }`
- Validate all inputs with zod

### AI Integration
- All AI providers implement `AIProvider` interface from `ai-provider.interface.ts`
- Use `context-builder.ts` to build prompts from game state
- Use `output-parser.ts` to validate/parse AI JSON responses
- Always request structured JSON output from AI
- Cache universe lore in DB, never re-generate
- Send only 3-5 last scenes (summarized) as context, not full history

## Architecture Rules
- **Backend owns all game logic**: stats, combat, inventory, consequences
- **AI generates narrative content only**: scenes, dialogues, descriptions
- **Frontend is display-only**: shows scenes, presents choices, displays stats
- **Never trust frontend data**: always validate on backend
- **AI output is always validated**: parse and validate before storing

## Key Files
| File | Purpose |
|---|---|
| `packages/shared/src/types/scene.types.ts` | Core game loop data contract |
| `apps/backend/src/ai/ai-provider.interface.ts` | AI provider abstraction |
| `apps/backend/src/ai/context-builder.ts` | Builds AI prompt from game state |
| `apps/backend/src/services/game-engine.service.ts` | Central game orchestrator |
| `apps/frontend/src/app/(game)/session/[sessionId]/page.tsx` | Main game screen |

## Agent Workflow
When working with multiple Claude Code agents:
- **Agent Backend**: works on `apps/backend/` only
- **Agent Frontend**: works on `apps/frontend/` only
- **Agent Shared**: works on `packages/shared/` only
- Always start with shared types before backend/frontend implementation
- Frontend and backend can be developed in parallel once shared types exist
