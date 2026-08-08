---
type: architecture-rules
visibility: public
rag: true
source_of_truth: true
---

# Architecture Rules

## Invariants

- **Backend = Game Master** : règles, d20, inventaire, conséquences, NPCs, world-state, mémoire.
- **AI = prose only** : texte narratif, jamais source de vérité mécanique.
- **Frontend = display only** : aucun calcul de jeu critique côté client.
- **Shared = contracts** : types, constantes et contrats communs.

## Frontend multi-univers

- Toutes les routes d'un monde sont regroupées sous `app/(game)/<world>/`.
- Les fonctionnalités partagées entre mondes vivent dans `features/`.
- Les primitives UI ne connaissent ni les mondes, ni les features, ni les stores métier.
- Les composants spécifiques à un monde restent colocalisés sous sa route.
- Les routes publiques des mondes sont centralisées dans `config/worlds.ts`.
- Direction des imports : `app → features/world components → components/ui`.
- Détail : [`FRONTEND_ARCHITECTURE.md`](FRONTEND_ARCHITECTURE.md).

## API

- Toutes les réponses API suivent `{ success, data?, error? }`.
- Les entrées passent par validation Zod.
- Les appels frontend passent par `app/api/[...path]/route.ts`.
- Les sorties IA passent par parsing structuré + validation backend.
- **Auth** : le backend ne fait jamais confiance à un `userId` du body. L'identité vient du JWT Supabase vérifié localement (JWKS) par `requireAuth`. `User.id` = `auth.users.id`. Détail : [[AUTH]].

## Canon et mémoire

- Fixed Canon : `docs/public/raw/`, structuré ensuite côté backend.
- Emergent Canon : faits de run persistés par le backend.
- Retrieval : pgvector pour retrouver les faits utiles sans charger toute l'histoire.
- Le contexte IA est reconstruit par le backend à chaque tour.
