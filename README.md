# EpisodeRPG — AI-Powered Narrative RPG

An interactive web narrative RPG where AI generates unique universes every playthrough. Players create a character, read narrative scenes, and choose from text options. Roadwarden-style gameplay: stats, inventory, choices with permanent consequences, and Game Over possible. Infinite replayability through AI generation.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 9 — `npm install -g pnpm`

## Installation

```bash
git clone https://github.com/AdamDjo/EpisodeRPG-game.git
cd EpisodeRPG-game
pnpm install
```

## Configuration

### Environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
# Fill in the values in apps/backend/.env
```

### MCP Servers (Claude Code only)

MCP servers allow Claude Code to interact with GitHub, Supabase, and library documentation.

```bash
cp .mcp.json.example .mcp.json
# Fill in your tokens in .mcp.json
```

| Placeholder | Where to get it |
|-------------|-----------------|
| `ghp_YOUR_TOKEN_HERE` | GitHub → Settings → Developer Settings → Personal Access Tokens |

> ⚠️ Never commit `.mcp.json` — it contains your secrets. It is listed in `.gitignore`.

## Commands

```bash
pnpm dev                       # Start frontend + backend in dev mode
pnpm dev --filter frontend     # Start frontend only (port 3000)
pnpm dev --filter backend      # Start backend only (port 3001)
pnpm build                     # Build all packages
pnpm lint                      # Lint the entire monorepo
pnpm type-check                # TypeScript check across all packages
```

## Project Structure

```
EpisodeRPG-game/
├── apps/
│   ├── frontend/              # Next.js 16 (App Router) — port 3000
│   └── backend/               # Express + TypeScript — port 3001
├── packages/
│   ├── shared/                # Shared types & constants (@rpg-game/shared)
│   ├── eslint-config/         # Shared ESLint config (@rpg-game/eslint-config)
│   └── prettier-config/       # Shared Prettier config (@rpg-game/prettier-config)
├── docs/
│   ├── GAME_DESIGN.md         # Game vision, phases, classes, universes
│   ├── FRONTEND_ARCHITECTURE.md  # Pages, components, Next.js structure
│   ├── NARRATIVE_DESIGN.md    # Narrative standards, AI prompts
│   └── MEMORY.md              # Current project state (read by Claude each session)
├── .github/
│   ├── workflows/             # CI (lint, type-check, build) + Release
│   └── ISSUE_TEMPLATE/        # GitHub issue templates
├── .mcp.json.example          # MCP servers template (no secrets)
└── CLAUDE.md                  # Claude Code instructions
```

## Branch Strategy

```
main          ← production, protected (PRs only)
develop       ← integration branch
feature/*     ← features (e.g. feature/6-tooling-ci)
release/*     ← release candidates (e.g. release/0.1.0)
hotfix/*      ← urgent production fixes
```

Feature branches follow the convention `feature/<issue-number>-<description>` to automatically link the branch to its GitHub issue.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| Backend | Express, TypeScript, Zod |
| Database | Supabase (PostgreSQL) |
| State management | Zustand + React Query |
| AI | Claude, Gemini, Mistral (fallback chain) |
| Monorepo | Turborepo + pnpm workspaces |
