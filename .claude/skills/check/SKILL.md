---
name: check
description: Run TypeScript type-check and lint across the entire monorepo. Use this to verify code quality before committing.
disable-model-invocation: true
allowed-tools: Bash
---

Run quality checks on the monorepo. Execute these commands sequentially and report results:

1. Run TypeScript type-check:

```bash
cd /c/Users/ABM/dev/frontend/grimoire && pnpm type-check
```

2. If type-check passes, run lint:

```bash
cd /c/Users/ABM/dev/frontend/grimoire && pnpm lint
```

3. Report results clearly:

- If all pass: confirm everything is clean
- If errors: list each error with file path and line number, then suggest fixes
