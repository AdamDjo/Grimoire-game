---
name: implement
description: Full implementation workflow for a feature. Plans, implements, tests, and reviews. Use with a feature description as argument.
disable-model-invocation: true
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

Implement a feature following industry best practices (Vercel, Google, Airbnb standards).

Feature to implement: $ARGUMENTS

## Workflow

### Step 1: Understand

- Read `MEMORY.md`, `docs/public/current-state/PROJECT_STATUS.md`, then only the matching domain pair:
  `FRONTEND_STATUS.md` + `FRONTEND_NEXT.md` or `BACKEND_STATUS.md` + `BACKEND_NEXT.md`
- Read relevant AGENTS.md files for the target workspace
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
- Follow naming conventions from AGENTS.md

### Step 5: Verify

- Run `pnpm type-check` to catch type errors
- Verify no imports are broken
- Check that the feature integrates with existing code

### Step 6: Update Progress

- A frontend PR updates `FRONTEND_STATUS.md` and `FRONTEND_NEXT.md` in the same branch
- A backend/shared/AI PR updates `BACKEND_STATUS.md` and `BACKEND_NEXT.md` in the same branch
- Write the expected post-merge state; never leave branch or review status in merged documentation
- Update `RELEASE_READINESS.md` when a `phase: predeploy` blocker changes
- Keep `PROJECT_STATUS.md` stable and `NEXT_ACTIONS.md` as a pointer-only compatibility router
- Report what was done and what's next
