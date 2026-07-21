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

- Read `docs/public/current-state/PROJECT_STATUS.md`, then only the matching domain pair:
  `FRONTEND_STATUS.md` + `FRONTEND_NEXT.md` or `BACKEND_STATUS.md` + `BACKEND_NEXT.md`
- Read relevant CLAUDE.md files for the target workspace
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
- Follow naming conventions from CLAUDE.md

### Step 5: Verify

- Run `pnpm type-check` to catch type errors
- Verify no imports are broken
- Check that the feature integrates with existing code

### Step 6: Update Progress

- Update only the matching domain status/actions files when progress documentation is in scope
- Never update `PROJECT_STATUS.md`, `NEXT_ACTIONS.md` or `RELEASE_READINESS.md` from a feature branch
- Report what was done and what's next
