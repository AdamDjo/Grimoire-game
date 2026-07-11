# Tech Stack — Public Implementation Summary

> Architecture active, publique et courte.
> Détails internes longs archivés : `docs/private/archive/public-long-versions/TECH_STACK.long.md`.
> Canon produit : `docs/private/raw/` via [`../wiki/canon-index.md`](../wiki/canon-index.md).
> Invariants d'architecture : [`ARCHITECTURE_RULES.md`](ARCHITECTURE_RULES.md).

## Stack

- Monorepo : Turborepo + pnpm.
- Frontend : Next.js App Router, React, TypeScript strict, Tailwind.
- Backend : Express + TypeScript strict.
- Shared : types et constantes dans `packages/shared/`.
- DB : Supabase PostgreSQL + pgvector pour la mémoire/retrieval.
- AI : OpenRouter comme routeur unique.
- State frontend : Zustand + React Query.

## Frontend

- Toutes les routes gameplay publiques passent sous `velkhar/`.
- Les appels API frontend doivent passer par le proxy Next `app/api/[...path]/route.ts`.
- Les composants route-specific restent dans `_components/`.
- Les composants réutilisables restent dans `components/ui/`.
- Ne jamais hardcoder couleur/police : utiliser [`../design/DESIGN_TOKENS.md`](../design/DESIGN_TOKENS.md).

## Backend

- Routes fines : validation, auth, délégation service.
- Services principaux à construire : game engine, world-state, memory, lore, Aveugle.
- AI orchestration : provider OpenRouter unique + validation de sortie.
- Game rules : stats, dice, combat, inventory, survival, consequences.
- Lore backend : `lore/velkhar/` généré à partir du canon privé ciblé.

## Mémoire et canon

- Fixed Canon : données stables de Velkhar, extraites du GDD privé.
- Emergent Canon : NPCs, faits, promesses, artefacts, conséquences créés pendant un run.
- Retrieval : pgvector pour retrouver les faits pertinents sans charger toute l'histoire.
- Le contexte envoyé à l'IA doit être reconstruit par le backend à chaque tour.
- Le validateur bloque ou corrige les contradictions de canon et de structure.

## Flux d'un tour de jeu

1. Frontend envoie l'intention joueur au backend.
2. Backend charge session, personnage, world-state et mémoire pertinente.
3. Backend décide si un pivot mécanique existe.
4. Backend résout règles/dés si nécessaire.
5. Backend construit le contexte narratif.
6. AI écrit une scène structurée.
7. Backend valide, applique les conséquences et persiste les nouveaux faits.
8. Frontend affiche le résultat.

## Contrats de réponse

- Toutes les réponses API suivent `{ success, data?, error? }`.
- Les entrées utilisateur passent par validation Zod.
- Les sorties IA passent par parsing structuré + validation backend.
- Les erreurs doivent être explicites côté backend et affichables côté frontend.

## Sécurité publique minimale

- Secrets uniquement via `.env`, jamais dans les docs publiques.
- `.env.example` peut lister les noms de variables, sans vraie valeur.
- Rate limiting, CORS, Helmet et validation d'entrée côté backend.
- Les prompts, coûts, stratégie premium, modèles précis et plans business restent dans `docs/private/`.

## Tests attendus

- Backend : dice, scene-validator, memory retrieval, Aveugle service.
- Frontend : StatBar, CalamineMeter, VocationCard, flows critiques.
- E2E : landing → création personnage → Auberge → session.

## Références ciblées

- État projet : [`../current-state/MEMORY.md`](../current-state/MEMORY.md)
- Backlog : [`../current-state/PHASE-1B-BACKLOG.md`](../current-state/PHASE-1B-BACKLOG.md)
- Design : [`../design/GAME_DESIGN.md`](../design/GAME_DESIGN.md)
- Architecture : [`ARCHITECTURE_RULES.md`](ARCHITECTURE_RULES.md)
- Canon : [`../wiki/canon-index.md`](../wiki/canon-index.md)
