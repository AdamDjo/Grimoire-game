# Grimoire — AI-Powered Narrative RPG

> Les règles Git, conventions TypeScript et préférences globales sont dans `~/.claude/CLAUDE.md`.
> **Lire `docs/MEMORY.md` en début de chaque session.**

---

## Description

RPG narratif interactif où l'IA génère un univers unique à chaque partie. Gameplay Roadwarden-style : stats, inventaire, choix avec conséquences, Game Over possible.

## Stack

- **Monorepo** : Turborepo + pnpm workspaces
- **Frontend** : Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend** : Node.js + Express + TypeScript
- **DB** : Supabase (PostgreSQL + pgvector + Auth + Storage)
- **AI** : Claude (dev) → Gemini Flash → Mistral (prod fallback chain)
- **State** : Zustand (client) + React Query (server)

## Structure

```
grimoire/
├── apps/frontend/     # Next.js 15 — display only, proxy API
├── apps/backend/      # Express — game engine, dice, memory, AI
└── packages/shared/   # @grimoire/shared — types & constants
```

## Commandes

```bash
pnpm dev                    # tout démarrer
pnpm dev --filter frontend  # frontend uniquement
pnpm dev --filter backend   # backend uniquement
pnpm build && pnpm lint && pnpm type-check
```

## Architecture (règles absolues)

- **Backend = Game Master** : stats, dés, inventaire, conséquences, NPCs, world-state, lore
- **AI = voix uniquement** : scènes, dialogues, descriptions — jamais de mémoire, jamais de décisions
- **Frontend = display only** : affiche les scènes, présente les choix, affiche les stats
- **Jamais faire confiance au frontend** : valider tout avec Zod côté backend
- **Output AI toujours validé** : parser et valider avant stockage
- Types partagés dans `@grimoire/shared` — jamais dupliqués
- Toutes les réponses API : `{ success: boolean, data?: T, error?: string }`
- Tous les appels API frontend passent par `app/api/[...path]/route.ts`

## Conventions spécifiques au projet

- Composants organisés par domaine : `ui/`, `game/`, `character/`, `codex/`, `campaign/`, `world/`, `layout/`
- Routes groupées : `(auth)`, `(main)`, `(game)`
- AI : structured JSON output forcé, contexte = top-K NPCs/facts (pgvector), canon fixe injecté à chaque prompt
- Envoyer seulement les 3-5 dernières scènes (résumées) comme contexte, pas l'historique complet

## UI — Règle absolue pour le frontend

**Avant de créer ou modifier une page frontend, ouvrir le fichier HTML correspondant dans `docs/Grimoire/` et le suivre exactement.**

| Page à développer                              | Fichier de référence                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| Landing `/`                                    | `docs/Grimoire/Grimoire - Accueil.html`                                   |
| Session `/(game)/session/[id]`                 | `docs/Grimoire/Grimoire - Session.html` + `grimoire-session.js`           |
| Création personnage `/(main)/character-create` | `docs/Grimoire/Grimoire - Creation Personnage.html` + `grimoire-forge.js` |
| Campagne `/(main)/campaign/[id]`               | `docs/Grimoire/Grimoire - Campagne.html`                                  |
| Carte du monde `/(main)/world`                 | `docs/Grimoire/Grimoire - Carte de Valorain.html` + `grimoire-carte.js`   |

Les variables CSS (couleurs, polices, effets atmosphériques) sont documentées dans `GAME_DESIGN.md §7.7`. Ne jamais hard-coder une couleur — toujours utiliser les custom properties.

## Fichiers clés

| Fichier                                                     | Rôle                                                                 |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| `docs/MEMORY.md`                                            | État de session — lire en premier                                    |
| `docs/GAME_DESIGN.md`                                       | Le QUOI : vision, Valorain, UI, phases, design tokens                |
| `docs/TECH_STACK.md`                                        | Le COMMENT : stack, routes, composants, memory engine, AI, DB schema |
| `docs/Grimoire/`                                            | **Designs hi-fi de référence** — source de vérité UI                 |
| `packages/shared/src/types/scene.types.ts`                  | Contrat de données du game loop                                      |
| `apps/backend/src/ai/ai-provider.interface.ts`              | Abstraction AI provider                                              |
| `apps/backend/src/services/game-engine.service.ts`          | Orchestrateur central                                                |
| `apps/frontend/src/app/(game)/session/[sessionId]/page.tsx` | Écran de jeu principal                                               |

## GitHub — Spécifique Grimoire

### Labels

| Label                                                 | Usage               |
| ----------------------------------------------------- | ------------------- |
| `phase-1a`                                            | Frontend UI         |
| `phase-1b`                                            | Backend Foundation  |
| `phase-2`                                             | Intégration MVP     |
| `phase-2b`                                            | Features addictives |
| `phase-3`                                             | Polish & UGC        |
| `frontend` / `backend` / `shared` / `ai` / `database` | Domaine             |
| `bug` / `release` / `priority` / `blocked`            | Statut              |

### Milestones

| Milestone                     | Objectif                   |
| ----------------------------- | -------------------------- |
| Phase 1A - Frontend UI        | Toutes les pages statiques |
| Phase 1B - Backend Foundation | DB + auth prêts            |
| Phase 2 - MVP                 | Jouable de bout en bout    |
| Phase 2B - Multi-Universe     | 3 univers, 14 classes      |
| Phase 3 - Polish & UGC        | Features communauté        |

> Toujours passer les labels **explicitement** aux PRs — l'auto-labeler ne tourne que sur les GitHub Actions events, pas via API.

## Agents (si multi-agents)

- **Agent Backend** : `apps/backend/` uniquement
- **Agent Frontend** : `apps/frontend/` uniquement
- **Agent Shared** : `packages/shared/` uniquement
- Commencer par les types partagés avant frontend/backend
