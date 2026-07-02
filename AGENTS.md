# GRIMOIRE — Of Ash and Salt (Velkhar)

> Fichier lu par tous les outils IA (Cursor, Windsurf, Copilot, Claude Code, etc.).
> **Lire en premier : `docs/00-START-HERE.md`** puis `docs/wiki/index.md` pour naviguer vers le bon fichier.
> Source de vérité produit : `docs/raw/` (GDD Velkhar, 25 fichiers, gitignored). Toute divergence → `docs/raw/` gagne.

---

## Projet

**GRIMOIRE — Of Ash and Salt** est un roguelike narratif par IA, monde de **Velkhar** (désert, le _Makhzen_). Run 3–15h, 4 vocations, Chronique générée en fin de run, méta-monde vivant. Hub permanent : l'Auberge de **L'Aveugle** — ouvre chaque run (nom → création → réaction IA → run).

## Stack

Monorepo Turborepo + pnpm · **Frontend** Next.js 15 App Router · **Backend** Express 4 · **DB** Supabase + pgvector · **AI** OpenRouter (routeur + fallback, 1-2 appels/tour) · **State** Zustand + React Query

```
apps/frontend/   apps/backend/   packages/shared/
```

```bash
pnpm dev                         # tout démarrer
pnpm dev --filter frontend|backend
pnpm build && pnpm lint && pnpm type-check
```

## Architecture — règles absolues

- **Backend = Game Master** : stats (SANG/SOUFFLE/CENDRE), dés d20 aux pivots, inventaire, conséquences, NPCs, world-state, lore
- **AI = voix uniquement** (via OpenRouter) : prose seulement, jamais de décisions mécaniques
- **Frontend = display only** : jamais de logique de jeu côté client
- Zod validation sur toutes les routes · réponses `{ success, data?, error? }` · types partagés dans `packages/shared/`
- API frontend → `app/api/[...path]/route.ts` uniquement (proxy vers backend)

## Statistiques du jeu (triptyque GDD)

| Attribut   | Pilote                                               | Détail GDD                  |
| ---------- | ---------------------------------------------------- | --------------------------- |
| 🩸 SANG    | combat, survie, force, intimidation                  | `docs/raw/04-ATTRIBUTES.md` |
| 💨 SOUFFLE | précision, furtivité, artisanat, éveil des artefacts | `docs/raw/04-ATTRIBUTES.md` |
| 🔥 CENDRE  | charisme, foi, commandement, résistance magique      | `docs/raw/04-ATTRIBUTES.md` |

Mod −3 à +4 · PV = 10 + SANG · Dés d20 aux **pivots seulement**

**Calamine** (0→100) : coût universel de la magie. Monte à chaque usage d'artefact. À 100 = corruption physique et mentale (Calciné). C'est **la menace centrale du run** — la pendule qui rend chaque usage magique un choix. Détail complet : `docs/raw/04-ATTRIBUTES.md`.

## Vocations V1

Marcheur-du-Sel · Lame-Ombre · Veilleur · Tisse-Verbe (seul à éveiller les artefacts).

## Conventions TypeScript

- TypeScript strict partout · named exports uniquement · `async/await` (jamais `.then()`)
- Fichiers : `kebab-case.ts` · Types/Interfaces : `PascalCase` · Composants React : `PascalCase.tsx`
- Fonctions/variables : `camelCase` · Constantes : `UPPER_SNAKE_CASE`

## Workflow Git

- Branches : `feature/<n>-<desc>`, `fix/<n>-<desc>`, `hotfix/<n>-<desc>` — toujours préfixées par le numéro d'issue
- `feature/*` / `fix/*` → PR vers `develop` · `release/*` → `main` · `hotfix/*` → `main` ET `develop`
- Format de commit : `type(scope): résumé court` — types : `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
- Toujours créer l'issue GitHub AVANT la branche
- Labels PRs : `phase-1a/1b/2/2b/3` · `frontend/backend/shared/ai/database` · Milestones : Phase 1A/1B/2/2B/3

## GitHub

Repo : `AdamDjo/Grimoire-game`

## UI

Design tokens désertiques : `docs/02-design/DESIGN_TOKENS.md`. Résumé routes/composants : `docs/02-design/GAME_DESIGN.md` §7. Jamais de hard-coding couleur/police — toujours via les tokens CSS.

## Navigation doc

Pour comprendre X → `docs/wiki/index.md` → ouvre le fichier ciblé. Ne pas lire tous les fichiers d'un coup.
