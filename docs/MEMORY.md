# Project Memory — Grimoire-game

## Status rapide

- **Branche courante** : feature/79-docs-consolidation (PR #80 ouverte → develop)
- **Phase actuelle** : Game design finalisé — prêt à démarrer Phase 1A (frontend) + Phase 1B (backend)
- **Repo GitHub** : `AdamDjo/Grimoire-game`
- **Packages npm** : `@grimoire/*` (shared, eslint-config, prettier-config, frontend, backend)

---

## Tooling — TOUT EST EN PLACE ✅

- ESLint + Prettier partagés (`@grimoire/eslint-config`, `@grimoire/prettier-config`) ✅
- GitHub Actions : ci.yml, pr-metadata.yml, release.yml ✅
- Husky + commitlint + lint-staged ✅
- Vitest (frontend + backend) ✅
- Cypress E2E ✅
- Renovate (remplace Dependabot npm) + CodeQL ✅
- Knip + Bundle Analyzer ✅
- Claude Code skills : /feature, /bug, /hotfix, /release, /pr, /sync ✅
- lint-staged avec `.lintstagedrc.js` (workspace-aware, ESLint dans chaque app) ✅

---

## Prochaines étapes

1. **Merger PR #80** (docs consolidation) → develop
2. **Démarrer Phase 1A** — 5 pages statiques reproduisant exactement `docs/Grimoire/` :
   - Landing · Session · Character Create (forge 7 étapes) · Campaign hub · World map
3. **Démarrer Phase 1B** (backend : DB schema `Character` + safety settings + WorldNpc/Fact/Clock, auth, AI providers)

## Session 2026-06-15 — Universe Switch Architecture & API Routes

**Question soulevée** : comment un user switch d'univers sans se déconnecter + comment l'univers récupère ses perso/progression ?

**Solution retenue** :

- **Routes agnostiques** : pas de groupage `/(main)/valorain/`, `/(main)/zombie/` — c'est complexe + scalabilité réduite
- **Univers = client-side setting** dans Zustand (`hooks/use-universe-store.ts`)
  - `currentUniverse: string` (valorain, zombie, etc.)
  - `switchUniverse(id: string)` → refetch characters + sessions + world pour nouvel univers
  - Persiste en localStorage
- **Zero logout** : session JWT persiste, seul `currentUniverse` change
- **Character scope** : indexé par `(userId, universe)` → ajout field `Character.universe`
- **Data sync** :
  - Characters: `GET /api/characters?universe=valorain` → retourne chars utilisateur pour cet univers
  - Sessions: liées à `Character.id` → héritent univers du character
  - Campaigns: liées à `Character.id` → héritent univers du character
  - World (NPCs, régions, lore): keyed par univers dans backend
- **UX Flow** : user connecté → landing affiche ses univers + perso par univers → clic pour switch → Zustand update → refetch → si session active: navigate to `/(game)/session/[id]`, sinon: campaign hub

**Updates TECH_STACK.md**:

- §2: routes restent agnostiques + NEW page `/(main)/settings/universe` pour switcher
- §2.1: NEW subsection "Universe Switching — Zero Logout" (Zustand, data scope, flow)
- §6: NEW section "API Endpoints" (auth, character, session, world, codex)
- Renommage ancien §6 (AI Integration) → §7, et cascade §7→§8, §8→§9, etc.

**Pas de changes en base ou backend encore** — juste l'architecture documentée.

---

## Session 2026-06-14 — Intégration designs UI (docs/Grimoire/)

- Ajout de `docs/Grimoire/` : 5 fichiers HTML hi-fi + JS interactifs (Accueil, Session, Creation, Campagne, Carte)
- GAME_DESIGN.md v6.0 : §4.3 régions mises à jour (8 régions canoniques), §6 stats/classes/peuples complets (10 classes, 6 peuples), §7 UI entièrement réécrit avec design tokens OKLCH + layout exact de chaque page
- TECH_STACK.md v3.0 : routes frontend mises à jour (campaign/[id], world/), composants renommés (Codex au lieu de StatsSidebar+InventorySidebar, ActionField au lieu de FreeActionInput), schéma Character DB complet avec safety settings, slash commands spécifiées avec leur handler
- CLAUDE.md : ajout règle absolue UI (ouvrir le HTML avant de coder la page)

## Session 2026-06-12 — Game design complet

- Docs consolidées : GAME_DESIGN.md + TECH_STACK.md (FRONTEND_ARCHITECTURE, NARRATIVE_DESIGN, docs/README supprimés)
- Pitch recentré : "le MJ IA qui se souvient et ne triche pas" (vs AI Dungeon)
- Canon Fixe Valorain : lois du monde, Corruption qui monte, 4 PNJ piliers (Aldric, Hollow King, Caelith, Brenna)
- Stratégie IA : Claude (dev) → Gemini Flash → Mistral fallback chain (prod gratuit)
- Déploiement gratuit : Vercel + Railway/Render + Supabase
- Features RP Discord-natives : Free Action, Action/Dialogue auto-detect, IC/OOC + //, slash commands, D20+critiques, dice journal, Inspiration token, Narrative Titles, cliffhanger

---

## Préférences utilisateur

- Langue : Français (pour la conversation), mais **tout le code source doit être en anglais** — strings UI, commentaires, metadata, placeholders. Traduction i18n plus tard.
- Commits : jamais de `Co-Authored-By` Claude. Pas de noreply@anthropic.com nulle part.
- Format commit : `type(scope): message` (feat, fix, chore, docs, refactor, test)
- Travail séquentiel (pas d'agents parallèles sauf si explicitement demandé)
- Toujours créer l'issue GitHub AVANT la branche via MCP github
- Toujours lire ce fichier MEMORY.md en début de session
- **Pas de tickets créés à la demande "docs + routes"** — juste corriger la doc inline

---

## Stack technique

- Monorepo Turborepo + pnpm 9.15.0
- Frontend : Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS 4
- Backend : Express 4, TypeScript strict, Node 20 (Node choisi car I/O-bound + TS partagé front/back — ne pas changer)
- DB : Supabase (PostgreSQL + pgvector pour retrieval NPC/lore)
- AI : Claude (dev) → Gemini Flash (prod gratuit) → Mistral (fallback) — jamais de LLM self-hosted
- State : Zustand + React Query

## Workflow GitHub — TOUJOURS respecter

**Règles workflow — SANS EXCEPTION** :

- Une issue GitHub par tâche → une branche avec le numéro d'issue → une PR → merge
- **Jamais commiter directement sur `develop` ou `main`**, même pour du tooling/config/rename
- Nommage branche : `feature/<numéro>-<description>`, `fix/<numéro>-<description>`, `hotfix/<numéro>-<description>`
- Branches depuis `develop`, PRs vers `develop` (sauf hotfix/release → `main`)
- Avant tout `git commit` : vérifier qu'on est sur une branche feature/fix/hotfix/chore, jamais sur develop/main
- Labels à passer explicitement à la PR (l'auto-labeler ne tourne que sur GitHub events)
- Milestones disponibles : Phase 1A/1B/2/2B/3
- Repo GitHub : `AdamDjo/Grimoire-game`

## Fichiers clés projet

| Fichier                            | Rôle                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `CLAUDE.md`                        | Règles git + conventions code + règle UI obligatoire                                   |
| `docs/MEMORY.md`                   | État du projet (lire au démarrage)                                                     |
| `docs/GAME_DESIGN.md`              | Le QUOI : vision, Valorain, 8 régions, 10 classes, 6 peuples, UI/design tokens, phases |
| `docs/TECH_STACK.md`               | Le COMMENT : routes, composants, DB schema, API endpoints, AI, slash commands          |
| `docs/Grimoire/`                   | **Designs hi-fi HTML** — source de vérité UI absolue (5 fichiers + JS)                 |
| `packages/shared/src/index.ts`     | Barrel export types partagés                                                           |
| `apps/backend/src/index.ts`        | Entry point Express                                                                    |
| `apps/frontend/src/app/layout.tsx` | Layout Next.js                                                                         |

> Claude: read this file first at the start of every session. This is the current project state. For vision, features, and lore: `GAME_DESIGN.md`. For stack, architecture, AI prompts: `TECH_STACK.md`.

---

## Quick Status

| Aspect           | Status                                                                       |
| ---------------- | ---------------------------------------------------------------------------- |
| **Tooling / CI** | ✅ All in place (ESLint, Prettier, Husky, Vitest, Cypress, Renovate, CodeQL) |
| **Game design**  | ✅ Complete — `GAME_DESIGN.md` v6.0 + `TECH_STACK.md` v3.0                   |
| **UI designs**   | ✅ 5 hi-fi designs in `docs/Design/` — source de vérité UI                   |
| **Frontend**     | ⏳ Not started — ready for Phase 1A                                          |
| **Backend**      | ⏳ Not started — ready for Phase 1B                                          |
| **Open PR**      | #80 `feature/79-docs-consolidation` → develop (ready to merge) ⚠️ à merger   |

---

## Documentation (current structure)

| File                  | Role                                                | Open when                |
| --------------------- | --------------------------------------------------- | ------------------------ |
| `docs/MEMORY.md`      | This file — session state                           | Every session            |
| `docs/GAME_DESIGN.md` | The WHAT: vision, Valorain, UI, RP features, phases | Design, UI, narrative    |
| `docs/TECH_STACK.md`  | The HOW: stack, routes, components, AI, DB schema   | Code, architecture, AI   |
| `docs/Design/`        | **Hi-fi HTML designs** — source de vérité UI        | Before any frontend work |

> `FRONTEND_ARCHITECTURE.md`, `NARRATIVE_DESIGN.md`, `docs/README.md` → deleted (content merged into the 2 docs above). Do not recreate.

---

## Checklist par phase

> Source de vérité unique (remplace PROGRESS.md supprimé). Mettre à jour ici après chaque tâche complétée.

### Phase 1A — Frontend UI (Valorain) ⏳

- [x] Routing structure par univers (`/(main)/valorain/`, `/(game)/valorain/`)
- [x] Pages vides créées : landing, character-create, campaign, world, session
- [x] Composants UI de base : StatBar, Toast, Stepper, Button, Card, Input, Badge, Modal
- [ ] Landing page `/` — reproduire `Grimoire - Accueil.html`
- [ ] World map `/(main)/valorain/world` — reproduire `Grimoire - Carte de Valorain.html`
- [ ] Character create `/(main)/valorain/character-create` — forge 7 étapes (`Grimoire - Creation Personnage.html`)
- [ ] Campaign hub `/(main)/valorain/campaign` — reproduire `Grimoire - Campagne.html`
- [ ] Session `/(game)/valorain/session/[id]` — reproduire `Grimoire - Session.html`

### Phase 1B — Backend Foundation ⏳

- [ ] Supabase client setup + environment config
- [ ] Error handler middleware
- [ ] Auth middleware (Supabase JWT)
- [ ] Zod validation middleware
- [ ] DB schema migrations (Character + safety settings + WorldNpc/Fact/Clock)
- [ ] Auth routes + service (register, login, session)
- [ ] Character routes + service (CRUD)

### Phase 2 — Intégration MVP ⏳

- [ ] AI Provider interface (Claude → Gemini Flash → Mistral fallback)
- [ ] Context builder (game state → prompt)
- [ ] Output parser (AI response → validated JSON)
- [ ] Game engine service (orchestrateur central)
- [ ] Free Action + IC/OOC + Flaws
- [ ] Persistent NPCs + world-state
- [ ] End-to-end game flow playable

### Phase 2B — Multi-Univers ⏳

- [ ] 2e univers (Zombie) — fork du routing valorain + nouveaux design tokens
- [ ] 3e univers
- [ ] 14 classes total
- [ ] Universe switcher (Zustand, zero logout)

### Phase 3 — Polish & UGC ⏳

- [ ] Responsive design + animations
- [ ] D20 + critiques + dice journal
- [ ] Inspiration token + Narrative Titles + cliffhanger
- [ ] Community features

---

## The Pitch (one sentence)

> **Grimoire is the AI Game Master that finally works: it remembers, it doesn't cheat, and your choices change the world for good.**

Direct competitor: AI Dungeon (total freedom, zero memory). Grimoire wins on coherence, not on the model.

---

## Key Technical Decisions

- **Backend stack**: Node + Express + TS — do not change (I/O-bound, shared TS types front/back, one language for a solo frontend dev)
- **AI**: Claude (dev) → Gemini Flash → Mistral (free prod, fallback chain = load absorber, never self-host an LLM)
- **Free deployment**: Vercel + Railway/Render + Supabase + free APIs
- **Load/capacity**: graceful degradation (fallback chain + per-player rate-limit + queue), never hard-crash
- **Lore**: Fixed Canon (hand-written, small) + Emergent Canon (backend-frozen) — same system as memory
- **Twitch/streamer voting**: cut permanently (anti-RP by design)

---

## Key Code Files

| Path                                               | Role                                                          |
| -------------------------------------------------- | ------------------------------------------------------------- |
| `CLAUDE.md`                                        | Règles spécifiques Grimoire (global dans ~/.claude/CLAUDE.md) |
| `packages/shared/src/index.ts`                     | Shared types barrel export                                    |
| `apps/backend/src/index.ts`                        | Express entry point                                           |
| `apps/frontend/src/app/layout.tsx`                 | Next.js root layout                                           |
| `apps/backend/src/ai/ai-provider.interface.ts`     | AI provider abstraction                                       |
| `apps/backend/src/services/game-engine.service.ts` | Central game orchestrator                                     |
