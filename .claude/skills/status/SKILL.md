---
name: status
description: Show current project progress, active phase, and what needs to be done next. Use to get a quick overview of project state.
disable-model-invocation: true
allowed-tools: Read, Glob
---

Show the current project status by:

1. Read `MEMORY.md`, then `docs/public/current-state/PROJECT_STATUS.md`.
2. Read `RELEASE_READINESS.md` for a global/release request, or only the matching
   `FRONTEND_STATUS.md` + `FRONTEND_NEXT.md` / `BACKEND_STATUS.md` + `BACKEND_NEXT.md` pair.
3. Never infer an active branch from `PROJECT_STATUS.md`; use git status when needed.
4. Count completed vs total release blockers from the selected status file.
5. Present a clean summary:

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
