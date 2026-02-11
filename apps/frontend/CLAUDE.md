# Frontend Agent Instructions

## Scope
This agent works ONLY on `apps/frontend/`. Never modify files outside this directory.

## Architecture
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 for styling (no CSS modules)
- Zustand for UI/client state
- React Query for server state & caching
- All API calls proxied through `/api/[...path]/route.ts`
- Frontend is display-only: shows scenes, presents choices, displays stats

## Directory Structure
```
src/
├── app/
│   ├── (auth)/         # Login, register pages
│   ├── (menu)/         # Main menu, universe selection
│   ├── (game)/         # Game session, character creation
│   ├── api/            # Proxy route to backend
│   ├── layout.tsx      # Root layout with providers
│   └── page.tsx        # Landing/redirect
├── components/
│   ├── ui/             # Generic UI (buttons, modals, cards)
│   ├── game/           # Scene display, choice buttons, notifications
│   ├── character/      # Stats panel, character creation form
│   └── universe/       # Universe cards, generation UI
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
└── lib/                # Utils, API client, constants
```

## Rules
- Import types ONLY from `@rpg-game/shared`
- React components: `PascalCase.tsx` (e.g., `SceneDisplay.tsx`)
- Other files: `kebab-case.ts` (e.g., `use-game-session.ts`)
- Named exports only
- Never put game logic in frontend - it's backend's job
- Use server components by default, `'use client'` only when needed
- Tailwind for all styling, use design tokens/theme variables

## State Management
- **Zustand stores**: UI state (sidebar open, theme, modals)
- **React Query**: All server data (sessions, characters, scenes)
- Never duplicate server state in Zustand

## API Pattern
```typescript
// All API calls go through the proxy:
// Frontend -> /api/game/action -> Backend -> /api/game/action
```

## Testing
- Run `pnpm type-check --filter frontend` to verify types
- Run `pnpm dev --filter frontend` to test dev server
