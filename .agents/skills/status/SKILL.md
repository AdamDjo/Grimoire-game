---
name: status
description: "Show current project progress, active phase, and what needs to be done next. Use to get a quick overview of project state."
allowed-tools: Read, Glob
---

Show the current project status by:

1. Read ticket progress from GitHub, never from a `.md`:
   `gh issue list --milestone "v0.2.1 - Roguelike jouable" --state all`.
2. Read `MEMORY.md`, then `docs/public/current-state/PROJECT_STATUS.md` for the phase and the EPIC
   dependency order.
3. Read `RELEASE_READINESS.md` for a global/release request, or only the matching domain document
   (`FRONTEND.md` or `BACKEND.md`) for a domain decision.
4. Never infer an active branch from a document; use git status when needed.
5. Count completed vs total release blockers from `RELEASE_READINESS.md`.
6. Present a clean summary:

Format:

```
PROJECT STATUS: Grimoire
================================
PREDEPLOY:  <completed>/<total> blockers delivered
POSTDEPLOY: <count> planned improvements

DEFAULT AGENT: Claude backend/shared/AI | Codex frontend (overridable by explicit assignment)
NEXT TASKS:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
```

6. Also check git status to see if there are uncommitted changes.
7. Report any blockers or issues found.
