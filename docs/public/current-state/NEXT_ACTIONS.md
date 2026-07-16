---
type: actions
visibility: public
rag: true
updated: 2026-07-16
---

# Next Actions

## Immédiat

1. **Finaliser + merger #125** (Game Session pixel-perfect) vers `develop` : valider la composition à 1440 px, le panneau personnage au-dessus du HUD, le responsive mobile et le flux choix/action libre → scène suivante. Les données d’inventaire et de monnaie restent branchées sur les contrats existants, encore vides côté backend.

## EPIC frontend #123 — ordre recommandé

2. [#134](https://github.com/AdamDjo/Grimoire-game/issues/134) — **Inventaire, fiche personnage et menu de session**.
3. [#132](https://github.com/AdamDjo/Grimoire-game/issues/132) — **Fin de run et Chronique publique**.
4. [#135](https://github.com/AdamDjo/Grimoire-game/issues/135) — **Auth complète et conversion anonyme**.
5. [#136](https://github.com/AdamDjo/Grimoire-game/issues/136) — **Profil, Paramètres et confidentialité**.
6. [#130](https://github.com/AdamDjo/Grimoire-game/issues/130), [#131](https://github.com/AdamDjo/Grimoire-game/issues/131), [#127](https://github.com/AdamDjo/Grimoire-game/issues/127), puis [#129](https://github.com/AdamDjo/Grimoire-game/issues/129).

## A3 — mémoire narrative, suite (après merge #111)

7. [#114](https://github.com/AdamDjo/Grimoire-game/issues/114) — **pgvector / rappel sémantique** sur les `MemoryChunk`.
8. [#117](https://github.com/AdamDjo/Grimoire-game/issues/117) — **World events (Level C)**, priorité basse (dépend du contenu design, pas du code).

## Phase 1B — écrans restants

9. **Backend Auberge de L'Aveugle** : remplacer les fixtures frontend de #126 par `aveugle.service.ts` et ses contrats API.
10. **Écran Character Create (la Forge)** : 4 vocations + concept libre, peuples, attribution triptyque.
11. **Écran World Map (Makhzen)** : carte désertique, régions, points d'intérêt.

## Différé

12. #101 — fallback chain multi-modèles OpenRouter (ouvert, non implémenté).
13. Ticket dédié vulnérabilités Dependabot (3 critiques sur `develop`).

> Garde-fous produit inchangés : **Velkhar only**, MVP court (vertical slice 45-70 min), lore progressif, moat backend d'abord. Voir [[PHASE-1B-BACKLOG]].
