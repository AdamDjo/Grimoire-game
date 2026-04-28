# Backend Agent Instructions

## Scope

This agent works ONLY on `apps/backend/`. Never modify files outside this directory.

## Architecture

- Express + TypeScript API server on port 3001
- Supabase for database, auth, and storage
- All game logic lives here (stats, combat, inventory, quests)
- AI generates narrative content only; backend validates everything

## Directory Structure

```
src/
├── config/         # Environment & Supabase config
├── middleware/      # Express middlewares (auth, error, validation)
├── routes/         # Thin controllers (delegate to services)
├── services/       # Business logic
├── ai/             # AI provider abstraction & prompt building
├── game-rules/     # Combat, leveling, inventory rules
└── database/       # Migrations & queries
```

## Rules

- Always validate inputs with zod schemas
- All responses: `{ success: boolean, data?: T, error?: string }`
- Import types ONLY from `@grimoire/shared`, never duplicate
- Use `async/await`, never `.then()`
- Files: `kebab-case.ts` (e.g., `game-engine.service.ts`)
- Named exports only, no default exports
- Never trust client data - validate everything server-side
- AI output must be parsed and validated before storing
- Supabase admin client for server operations, user client for RLS

## Key Dependencies

- `@grimoire/shared` - All shared types
- `@supabase/supabase-js` - Database & auth
- `zod` - Input validation
- `express-rate-limit` - Rate limiting

## Testing

- Run `pnpm type-check --filter backend` to verify types
- Run `pnpm dev --filter backend` to test the server starts
