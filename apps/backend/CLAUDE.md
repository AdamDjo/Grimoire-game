# Backend — Règles spécifiques Express + Game Engine

> Règles globales : `~/.claude/CLAUDE.md`. Architecture complète : `docs/TECH_STACK.md`.

## Scope

Travailler UNIQUEMENT dans `apps/backend/`. Ne jamais modifier de fichiers en dehors sauf `packages/shared/` pour les types (ajouter d'abord là-bas, puis type-check).

## Principe fondamental

**Backend = Game Master. AI = voix uniquement.**

Le backend possède toutes les règles, les dés, l'inventaire, le world-state, et le lore. L'IA écrit la prose — elle ne prend aucune décision. `dice.ts` est la seule autorité pour les résultats.

## Architecture

```
src/
├── routes/                        # thin controllers → délèguent aux services
├── services/
│   ├── game-engine.service.ts     # orchestrateur central
│   ├── world-state.service.ts     # emergent canon (NPCs, facts, flags)
│   ├── memory.service.ts          # retrieval top-K via pgvector
│   └── lore.service.ts            # Fixed Canon, anti-contradiction
├── ai/
│   ├── ai-provider.interface.ts   # abstraction AIProvider
│   ├── providers/                 # claude | gemini | mistral
│   ├── context-builder.ts
│   ├── scene-prompt.builder.ts
│   ├── intent-analyzer.ts
│   ├── output-parser.ts
│   └── scene-validator.ts
├── game-rules/
│   ├── dice.ts                    # D20 — autorité absolue
│   ├── stats.ts, combat.ts, inventory.ts, consequences.ts
├── lore/
│   └── valorain.canon.ts          # Fixed Canon — inviolable
├── middleware/                    # auth, error, validation, rate-limit
└── config/                        # env, supabase client
```

## Règles absolues

- Zod validation sur **toutes** les routes (boundary enforcement)
- Réponses API : `{ success: boolean, data?: T, error?: string }`
- Rate-limit **par joueur** sur les actions IA (pas seulement global)
- Output IA → toujours validé par `scene-validator` avant stockage
- Fixed Canon (`valorain.canon.ts`) → jamais contredit
- Types partagés dans `@grimoire/shared`, jamais dupliqués

## Prisma + Supabase

- Prisma = ORM unique — jamais de raw SQL dans les services
- Admin client pour les opérations serveur
- User client pour les requêtes protégées par RLS
- pgvector embeddings sur `WorldNpc` et `WorldFact`

## AI Fallback Chain

```
Claude (dev) → Gemini Flash → Mistral → safety scene
```

Jamais de hard-crash — la safety scene est toujours le dernier recours.

## Tests — Stratégie

### Quoi tester (Vitest — unitaire)

- **`dice.ts`** : toutes les combinaisons stat + modifier + critiques (nat 1, nat 20)
- **`scene-validator.ts`** : scènes valides, trop courtes, trop longues, < 4 choix, > 4 choix, contradictions canon
- **`output-parser.ts`** : JSON valide, JSON malformé, schema Zod invalide
- **`lore.service.ts`** : assertions Fixed Canon (mort permanente, magie coûteuse, etc.)
- **`intent-analyzer.ts`** : classification d'action libre → stat + difficulty
- **Utilitaires purs** dans `game-rules/`

### Quoi tester (Vitest — intégration)

- **`game-engine.service.ts`** : per-turn loop complet avec mocks AI provider
- **Routes** : avec supertest — happy path + validation Zod erreurs
- **`memory.service.ts`** : retrieval pgvector avec seed data

### Quoi ne PAS tester

- Providers AI externes (mock `AIProvider` interface)
- Supabase directement (mock le client)
- Logique de prose/narration (c'est le rôle de l'AI)

### Convention de nommage

```
src/
├── services/game-engine.service.ts
├── services/game-engine.service.test.ts   # co-localisé avec le fichier
├── game-rules/dice.ts
└── game-rules/dice.test.ts
```

### Commandes

```bash
pnpm test --filter @grimoire/backend           # Vitest
pnpm test:coverage --filter @grimoire/backend  # coverage
pnpm type-check --filter @grimoire/backend     # TypeScript strict
```

### Coverage cible

- `game-rules/` : 100% (logique de jeu critique)
- `ai/output-parser.ts`, `ai/scene-validator.ts` : 100%
- Services : ≥ 80%
- Routes : ≥ 70% (happy path + erreurs Zod)

## Variables d'environnement requises

Voir `.env.example` à la racine du projet.

## Après chaque tâche

1. `pnpm type-check --filter @grimoire/backend` → zéro erreur
2. `pnpm test --filter @grimoire/backend` → tous les tests passent
3. `pnpm dev --filter @grimoire/backend` → serveur démarre sur port 3001
