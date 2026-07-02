# 00 — START HERE

> **Point d'entrée unique pour tout agent IA (Claude Code, ChatGPT, autre).**
> Lis ce fichier en premier. Suis le tableau de routage plus bas pour savoir quoi lire ensuite — sans avaler tout le repo.

---

## Projet

**GRIMOIRE — Of Ash and Salt** (Des Cendres et du Sel) — roguelike narratif par IA, monde de **Velkhar** (continent désertique, le _Makhzen_).
Run 3-15h, 4 vocations, Chronique générée en fin de run, méta-monde vivant entre les runs.
**Hub permanent** : l'Auberge de **L'Aveugle** — ouvre chaque run.

**Source de vérité produit** (lore + game design) : `docs/raw/` (GDD Velkhar, 25 fichiers, gitignored) — voir [`wiki/index.md`](wiki/index.md). Toute divergence repo ↔ GDD → `docs/raw/` gagne.

---

## Où on en est

- **Phase actuelle** : **Phase 1B** (backend Game Master + écrans Phase 1A restants).
- **Phase 1A** : ✅ landing page terminée (branche `feature/88-landing-page-redesign`).
- **Branche courante** : `feature/88-landing-page-redesign` — à merger sur `develop` avant d'ouvrir 1B.
- **Détail backlog** : [`01-current-state/PHASE-1B-BACKLOG.md`](01-current-state/PHASE-1B-BACKLOG.md).
- **État détaillé** : [`01-current-state/MEMORY.md`](01-current-state/MEMORY.md).

---

## Tableau de routage — « Pour faire X, lis Y »

| Si tu dois…                                               | Lis (dans l'ordre)                                                                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Comprendre le projet en 5 min                             | Ce fichier + [`01-current-state/MEMORY.md`](01-current-state/MEMORY.md)                                                   |
| Implémenter un composant **frontend**                     | + [`apps/frontend/CLAUDE.md`](../apps/frontend/CLAUDE.md) + [`02-design/DESIGN_TOKENS.md`](02-design/DESIGN_TOKENS.md)    |
| Implémenter une route ou service **backend**              | + [`apps/backend/CLAUDE.md`](../apps/backend/CLAUDE.md) + [`03-tech/TECH_STACK.md`](03-tech/TECH_STACK.md) §AI            |
| Générer un **wireframe** d'écran                          | + [`02-design/DESIGN_TOKENS.md`](02-design/DESIGN_TOKENS.md) + GDD pertinent via [`wiki/index.md`](wiki/index.md)         |
| Comprendre une **vocation**, un peuple, le **lore**       | [`wiki/index.md`](wiki/index.md) → fichier `docs/raw/` ciblé                                                              |
| Comprendre les **règles de jeu** (dés, triptyque, combat) | [`wiki/index.md`](wiki/index.md) → `docs/raw/04-ATTRIBUTES.md`, `docs/raw/08-DICE-RESOLUTION.md`, `docs/raw/10-COMBAT.md` |
| Faire un **Git commit / PR**                              | [`CLAUDE.md`](../CLAUDE.md) racine + `~/.claude/CLAUDE.md` (règles globales)                                              |
| Comprendre la **vision / design system** complet          | [`02-design/GAME_DESIGN.md`](02-design/GAME_DESIGN.md)                                                                    |

---

## Règles absolues (mémoriser, jamais transgresser)

1. **Git** : jamais commit sur `main`/`develop`. Toujours issue → branche (`feature/<n>-...`) → PR. Jamais de `Co-Authored-By: Claude`.
2. **Architecture** : Backend = Game Master (toutes les règles). AI = voix uniquement via OpenRouter. Frontend = display only.
3. **Source de vérité** : `docs/raw/` gagne sur tout le reste.

---

## Stack en 5 lignes

- Monorepo Turborepo + pnpm 9.15.0 — `apps/frontend/` (Next.js 15, React 19, TS strict, Tailwind 4) · `apps/backend/` (Express 4, Node 20) · `packages/shared/`
- DB : Supabase (PostgreSQL + pgvector)
- AI : **OpenRouter** (routeur unique) → Claude / Gemini Flash / Mistral (fallback chain)
- State : Zustand (UI) + React Query (server data)
- Triptyque stats : **SANG / SOUFFLE / CENDRE** · PV = 10 + SANG · Calamine = coût magique unifié

---

## Structure `docs/`

```
docs/
├── 00-START-HERE.md            ← tu es ici
├── 01-current-state/           ← où on en est, prochaines actions
├── 02-design/                  ← look & feel, design tokens, animations
├── 03-tech/                    ← architecture, routes, AI, DB
├── wiki/                       ← index GDD + log chronologique (Karpathy pattern)
│   ├── index.md                ← catalogue docs/raw/ + doc projet (remplace GDD-MAP.md)
│   └── log.md                  ← journal append-only, agent-agnostic
├── raw/                        ← GDD Velkhar canon (25 fichiers, gitignored)
└── _archive/                   ← docs obsolètes (gitignored, gardés pour trace)
```
