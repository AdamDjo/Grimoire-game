# Grimoire — AI-Powered Narrative RPG

## IMPORTANT: Project Memory

**Claude: Always read `docs/MEMORY.md` at the start of each session.** It contains persistent project state, user preferences, and implementation notes that carry across conversations.

## ⚠️ IMPORTANT: Git Commit Rules

**Always apply these rules for every commit, no exceptions:**

- **No Claude auto-generated `Co-Authored-By`** — never add `Co-Authored-By: Claude ... <noreply@anthropic.com>`. Co-Authored-By for real collaborators is allowed.
- **Clear and descriptive message** — explain what was done and why, not just a generic list
- **Format**: `type(scope): short summary` + blank line + detailed explanation if needed
- **Types**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
- **Example**:

  ```
  feat(tooling): configure shared ESLint and Prettier for the monorepo

  Created packages/eslint-config with 3 configs (base, next, backend)
  and packages/prettier-config. Each app now extends the shared config
  instead of duplicating rules. Closes #7
  ```

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
grimoire/
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
- Never duplicate types - always import from `@grimoire/shared`
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

| File                                                        | Purpose                          |
| ----------------------------------------------------------- | -------------------------------- |
| `packages/shared/src/types/scene.types.ts`                  | Core game loop data contract     |
| `apps/backend/src/ai/ai-provider.interface.ts`              | AI provider abstraction          |
| `apps/backend/src/ai/context-builder.ts`                    | Builds AI prompt from game state |
| `apps/backend/src/services/game-engine.service.ts`          | Central game orchestrator        |
| `apps/frontend/src/app/(game)/session/[sessionId]/page.tsx` | Main game screen                 |

## Agent Workflow

When working with multiple Claude Code agents:

- **Agent Backend**: works on `apps/backend/` only
- **Agent Frontend**: works on `apps/frontend/` only
- **Agent Shared**: works on `packages/shared/` only
- Always start with shared types before backend/frontend implementation
- Frontend and backend can be developed in parallel once shared types exist

## GitHub Workflow (AI-Assisted)

### Branch Strategy

```
main          ← production, protected (PRs only)
develop       ← integration branch, all features merge here
feature/*     ← feature branches (ex: feature/phase-1a-auth-pages)
release/*     ← release candidates (ex: release/0.1.0)
hotfix/*      ← urgent production fixes
```

### Branch Naming Convention

```
feature/<issue>-<description>      # Toujours préfixé par le numéro d'issue
fix/<issue>-<description>          # Bug fix avec numéro d'issue
hotfix/<issue>-<description>       # Hotfix avec numéro d'issue
release/<semver>                   # Release (ex: release/0.1.0)
```

**Exemples concrets :**

```
feature/29-phase-1a-landing-page   # Issue #29, Phase 1A frontend
feature/30-phase-1b-auth-api       # Issue #30, Phase 1B backend
fix/31-login-crash                 # Issue #31, bug fix
hotfix/32-auth-token-leak          # Issue #32, hotfix prod
```

**Règles absolues — sans aucune exception :**

- Toujours créer l'issue avant la branche
- Ne jamais commiter directement sur `develop` ou `main` — même pour du tooling, config, rename, ou chore
- Avant tout `git commit`, vérifier qu'on est sur une branche `feature/*`, `fix/*`, `hotfix/*` — jamais sur `develop`/`main`
- Utiliser les skills `/feature`, `/bug`, `/hotfix` qui créent l'issue et la branche automatiquement

### Workflow Claude → GitHub (MCP github server)

Claude peut directement, via le MCP `github`:

**Créer des issues en premier :**

1. Créer l'issue avec le bon label (phase, domaine, priorité)
2. Noter le numéro → l'inclure dans le nom de branche
3. La PR ferme l'issue automatiquement via `Closes #<numéro>` dans le body

**Créer des branches (toujours depuis une issue) :**

```
feature/29-phase-1a-landing-page   # depuis develop
fix/30-login-crash                 # depuis develop
release/0.1.0                      # depuis develop quand MVP prêt
```

**Créer des PRs** :

- `feature/*` → `develop` (développement normal)
- `release/*` → `main` (releases, déclenche workflow release.yml)
- `hotfix/*` → `main` ET `develop`

### Labels disponibles

| Label      | Usage                           |
| ---------- | ------------------------------- |
| `phase-1a` | Frontend UI (Week 1-5)          |
| `phase-1b` | Backend Foundation (Week 4-6)   |
| `phase-2`  | Integration (Week 7-10)         |
| `phase-2b` | Addictive Features (Week 11-16) |
| `phase-3`  | Polish & UGC (Week 17+)         |
| `frontend` | `apps/frontend/`                |
| `backend`  | `apps/backend/`                 |
| `shared`   | `packages/shared/`              |
| `ai`       | AI integration                  |
| `database` | Supabase / schema               |
| `bug`      | Bug fix                         |
| `release`  | Release PR                      |
| `priority` | Priorité haute                  |
| `blocked`  | Bloqué par dépendance           |

### Milestones

| Milestone                     | Deadline | Goal                  |
| ----------------------------- | -------- | --------------------- |
| Phase 1A - Frontend UI        | Week 5   | All pages static      |
| Phase 1B - Backend Foundation | Week 6   | DB + auth ready       |
| Phase 2 - MVP                 | Week 10  | Fully playable        |
| Phase 2B - Multi-Universe     | Week 16  | 3 univers, 14 classes |
| Phase 3 - Polish & UGC        | Week 17+ | Community features    |

### PR Automation (automatic — no manual action needed)

**Labels** → auto-applied by `actions/labeler@v5` via `.github/labeler.yml`:

- Files in `apps/frontend/` → labels `frontend` + `phase-1a`
- Files in `apps/backend/` → labels `backend` + `phase-1b`
- Files in `packages/` → label `shared`

**Milestone** → auto-assigned by `.github/workflows/pr-metadata.yml` based on branch name:
| Branch pattern | Milestone |
|----------------|-----------|
| `feature/phase-1a-*` | Phase 1A - Frontend UI |
| `feature/phase-1b-*` | Phase 1B - Backend Foundation |
| `feature/phase-2-*` | Phase 2 - MVP |
| `feature/phase-2b-*` | Phase 2B - Multi-Universe |
| `feature/phase-3-*` | Phase 3 - Polish & UGC |
| `feature/tooling-*` | _(none)_ |

**Reviewers** → assigned manually (solo project).

> When creating PRs via MCP github tool, still pass `labels` explicitly —
> GitHub Actions automation only runs on GitHub-triggered events, not via API calls.

### How to ask Claude to create issues

Valid commands:

- "Create issues for Phase 1A Week 1 from the docs"
- "Create an issue to implement the UniverseCard component"
- "Create a PR feature/phase-1a-landing-page → develop"
- "Create the release branch 0.1.0"

Claude will read the relevant docs and automatically create issues/branches/PRs with the correct labels and milestones.
