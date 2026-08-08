---
name: implement
description: "Full implementation workflow for a feature. Plans, implements, tests, and reviews. Use with a feature description as argument."
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

Implement a feature following industry best practices (Vercel, Google, Airbnb standards).

Feature to implement: $ARGUMENTS

## Workflow

### Step 1: Understand

- Read `MEMORY.md`, `docs/public/current-state/PROJECT_STATUS.md`, then only the matching domain
  document: `FRONTEND.md` or `BACKEND.md`
- Read ticket progress from GitHub, never from a `.md`: `gh issue list --milestone "v0.2.1 - Roguelike jouable" --state all`
- Read the relevant tool entry and workspace instructions: `AGENTS.md` for Codex, `CLAUDE.md` for
  Claude
- Read existing related code to understand patterns
- Identify which files need to be created or modified

### Step 2: Plan

- List all files to create/modify
- Define the order of operations
- Identify dependencies between files
- Check if shared types need updating first

### Step 3: Types First

- If new shared types are needed, create them in `packages/shared/`
- Update `packages/shared/src/index.ts` barrel export
- Run type-check to verify

### Step 4: Implement

- Follow the established patterns in the codebase
- One file at a time, in dependency order
- Use zod for all input validation
- Follow naming conventions from the active tool entry (`AGENTS.md` or `CLAUDE.md`)

### Step 5: Verify

- Run `pnpm type-check` to catch type errors
- Verify no imports are broken
- Check that the feature integrates with existing code

### Step 6: Record Decisions

- **By default, a PR updates no document**: closing its issue is enough — GitHub carries progress
- Update the single domain document (`FRONTEND.md` **or** `BACKEND.md`, never both) only when the PR
  settled a non-obvious choice: why this value, this closed type, this guard
- Never write per-ticket progress in a `.md`: it becomes wrong at the first merge
- Update `RELEASE_READINESS.md` when a `phase: predeploy` blocker changes
- Add a `docs/public/nav/log.md` entry for a pivot or a structural decision
- Report what was done and what's next
