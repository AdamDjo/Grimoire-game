---
type: actions
visibility: public
rag: true
updated: 2026-07-11
---

# Next Actions

## Immédiat

1. **Reviewer + merger la PR [#102](https://github.com/AdamDjo/Grimoire-game/pull/102)** vers `develop` (ferme l'EPIC #95 et #96→#100).
2. **Régénérer la clé OpenRouter** (`sk-or-v1-…`) et remettre la valeur dans `apps/backend/.env` local — jamais committée, révocation par principe.

## Phase 1B — suite (après merge #102)

3. **Durcir le moteur de session côté backend** : rapatrier le d20 + les conséquences (aujourd'hui simulés au front dans `_lib/consequences.ts`), validation Zod, world-state persistant. Le backend reste souverain.
4. **Écran Auberge de L'Aveugle** (backlog priorité 1) : `app/(game)/velkhar/aveugle/page.tsx` + `aveugle.service.ts` backend.
5. **Écran Character Create (la Forge)** : 4 vocations + concept libre, peuples, attribution triptyque. Dépend de B1 (déjà fait).
6. **Écran World Map (Makhzen)** : carte désertique, régions, points d'intérêt.

## Différé

7. #101 — fallback chain multi-modèles OpenRouter (ouvert, non implémenté).
8. Ticket dédié vulnérabilités Dependabot (3 critiques sur `develop`).

> Garde-fous produit inchangés : **Velkhar only**, MVP court (vertical slice 45-70 min), lore progressif, moat backend d'abord. Voir [[PHASE-1B-BACKLOG]].
