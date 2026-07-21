---
type: backend-actions
visibility: public
rag: true
source_of_truth: true
owner: backend
updated: 2026-07-21
---

# Backend Next

## Avant v0.1.0

1. Merger [PR #174](https://github.com/AdamDjo/Grimoire-game/pull/174) (#147) — sans étendre le
   scope à l'échange Souvenir/lore (#133, différé).
2. Implémenter #168 : locale IA navigateur validée, persistée et fallback anglais.
3. Livrer #101 pour éviter qu'un 429 OpenRouter transforme trop souvent une scène en stub.
4. Résoudre #152 ou fournir au frontend un signal permettant de masquer le concept libre.
5. Déployer l'API et les migrations avec #161.
6. Traiter l'audit sécurité #162.
7. Supporter le golden path réel #129.

## Après v0.1.0

1. #114 — rappel sémantique pgvector.
2. #117 — World events scriptés.
3. #133 — échange Souvenir contre lore.
