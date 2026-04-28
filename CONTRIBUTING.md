# Contributing

## Prerequisites

- Node 20+
- pnpm 9+
- Git

## Getting started

```bash
git clone https://github.com/AdamDjo/Grimoire-game.git
cd Grimoire-game
bash scripts/setup.sh
```

Fill in `apps/backend/.env` and `apps/frontend/.env.local`, then:

```bash
pnpm dev
```

## Branch naming

```
feature/<issue>-<description>   # new feature
fix/<issue>-<description>        # bug fix
hotfix/<issue>-<description>     # urgent production fix
release/<semver>                 # release candidate
```

Always create a GitHub issue before branching. With Claude Code, use `/feature`, `/bug`, or `/hotfix` — they create the issue and branch automatically.

## Commit format

We use [Conventional Commits](https://www.conventionalcommits.org):

```
feat(scope): add something new
fix(scope): correct a bug
chore(scope): tooling or config change
docs(scope): documentation only
refactor(scope): no behavior change
test(scope): add or update tests
```

Rules:

- No `Co-Authored-By: Claude` lines
- Keep the subject under 72 characters
- Reference the issue in the body: `Closes #42`

## Workflow

1. Create an issue (or use `/feature <name>`)
2. Branch from `develop`
3. Commit with conventional format
4. Open a PR → `develop` (use `/pr`)
5. CI must pass before merge

## Useful commands

```bash
pnpm dev             # start all apps
pnpm lint            # lint all
pnpm type-check      # TypeScript check all
pnpm test            # unit tests
pnpm build           # build all
```

## Code conventions

See [CLAUDE.md](./CLAUDE.md) for the full conventions (naming, imports, architecture rules).
