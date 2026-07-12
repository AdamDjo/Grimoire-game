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

## API

- Toutes les réponses API suivent `{ success, data?, error? }`.
- Les entrées passent par validation Zod.
- Les appels frontend passent par `app/api/[...path]/route.ts`.
- Les sorties IA passent par parsing structuré + validation backend.

## Canon et mémoire

- Fixed Canon : `docs/public/raw/`, structuré ensuite côté backend.
- Emergent Canon : faits de run persistés par le backend.
- Retrieval : pgvector pour retrouver les faits utiles sans charger toute l'histoire.
- Le contexte IA est reconstruit par le backend à chaque tour.
