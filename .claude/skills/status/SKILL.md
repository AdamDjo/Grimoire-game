---
name: status
description: Show current project progress, active phase, and what needs to be done next. Use to get a quick overview of project state.
disable-model-invocation: true
allowed-tools: Read, Glob
---

Show the current project status by:

1. Read `PROGRESS.md` from the project root
2. Count completed vs total tasks in each phase
3. Present a clean summary:

Format:
```
PROJECT STATUS: RPG Narratif Web
================================
Phase 1: Architecture        [####] 100%
Phase 2: Backend Infra       [##--]  50%
Phase 3: Backend Routes      [----]   0%
...

CURRENT PHASE: Phase X - Description
NEXT TASKS:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
```

4. Also check git status to see if there are uncommitted changes
5. Report any blockers or issues found
