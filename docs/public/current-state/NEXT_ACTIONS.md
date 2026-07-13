---
type: actions
visibility: public
rag: true
updated: 2026-07-13
---

# Next Actions

## Immédiat

1. **Finaliser + merger #111** (mémoire N2 — compression de scène) vers `develop` : implémenté et testé, reste PR + review.

## A3 — mémoire narrative, suite (après merge #111)

2. [#113](https://github.com/AdamDjo/Grimoire-game/issues/113) — **N1, fenêtre court-terme** : grill le choix Redis vs requête DB directe avant d'implémenter, puis brancher l'injection dans `system-prompt.ts`.
3. [#114](https://github.com/AdamDjo/Grimoire-game/issues/114) — **pgvector / rappel sémantique** sur les `MemoryChunk`.
4. [#115](https://github.com/AdamDjo/Grimoire-game/issues/115) — **Souvenirs nommés (N3)**, inter-runs.
5. [#116](https://github.com/AdamDjo/Grimoire-game/issues/116) — **Chronique de fin de run** (inclut la purge `SceneLog` post-génération).
6. [#117](https://github.com/AdamDjo/Grimoire-game/issues/117) — **World events (Level C)**, priorité basse (dépend du contenu design, pas du code).

## Phase 1B — écrans restants

7. **Écran Auberge de L'Aveugle** (backlog priorité 1) : `app/(game)/velkhar/aveugle/page.tsx` + `aveugle.service.ts` backend.
8. **Écran Character Create (la Forge)** : 4 vocations + concept libre, peuples, attribution triptyque.
9. **Écran World Map (Makhzen)** : carte désertique, régions, points d'intérêt.

## Différé

10. #101 — fallback chain multi-modèles OpenRouter (ouvert, non implémenté).
11. Ticket dédié vulnérabilités Dependabot (3 critiques sur `develop`).

> Garde-fous produit inchangés : **Velkhar only**, MVP court (vertical slice 45-70 min), lore progressif, moat backend d'abord. Voir [[PHASE-1B-BACKLOG]].
