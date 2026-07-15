---
type: actions
visibility: public
rag: true
updated: 2026-07-15
---

# Next Actions

## Immédiat

1. **Finaliser + merger #126** (Auberge de L’Aveugle) vers `develop` : valider le hub `100dvh`, les panneaux exclusifs Parler/Souvenirs/Présage et les animations GSAP, puis remplacer les fixtures de souvenirs et de présages par les contrats API lorsqu’ils seront disponibles.

## EPIC frontend #123 — ordre recommandé

2. [#125](https://github.com/AdamDjo/Grimoire-game/issues/125) — **Game Session pixel-perfect** avec le UI Kit.
3. [#134](https://github.com/AdamDjo/Grimoire-game/issues/134) — **Inventaire, fiche personnage et menu de session**.
4. [#132](https://github.com/AdamDjo/Grimoire-game/issues/132) — **Fin de run et Chronique publique**.
5. [#135](https://github.com/AdamDjo/Grimoire-game/issues/135) — **Auth complète et conversion anonyme**.
6. [#136](https://github.com/AdamDjo/Grimoire-game/issues/136) — **Profil, Paramètres et confidentialité**.
7. [#130](https://github.com/AdamDjo/Grimoire-game/issues/130), [#131](https://github.com/AdamDjo/Grimoire-game/issues/131), [#127](https://github.com/AdamDjo/Grimoire-game/issues/127), puis [#129](https://github.com/AdamDjo/Grimoire-game/issues/129).

## A3 — mémoire narrative, suite (après merge #111)

8. [#114](https://github.com/AdamDjo/Grimoire-game/issues/114) — **pgvector / rappel sémantique** sur les `MemoryChunk`.
9. [#117](https://github.com/AdamDjo/Grimoire-game/issues/117) — **World events (Level C)**, priorité basse (dépend du contenu design, pas du code).

## Phase 1B — écrans restants

7. **Écran Auberge de L'Aveugle** (backlog priorité 1) : `app/(game)/velkhar/aveugle/page.tsx` + `aveugle.service.ts` backend.
8. **Écran Character Create (la Forge)** : 4 vocations + concept libre, peuples, attribution triptyque.
9. **Écran World Map (Makhzen)** : carte désertique, régions, points d'intérêt.

## Différé

10. #101 — fallback chain multi-modèles OpenRouter (ouvert, non implémenté).
11. Ticket dédié vulnérabilités Dependabot (3 critiques sur `develop`).

> Garde-fous produit inchangés : **Velkhar only**, MVP court (vertical slice 45-70 min), lore progressif, moat backend d'abord. Voir [[PHASE-1B-BACKLOG]].
