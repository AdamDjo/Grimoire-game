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

1. Implémenter #168 : locale IA navigateur validée, persistée et fallback anglais. **En cours.**
2. Livrer #101 pour éviter qu'un 429 OpenRouter transforme trop souvent une scène en stub.
3. Résoudre #152 ou fournir au frontend un signal permettant de masquer le concept libre.
4. Déployer l'API et les migrations avec #161.
5. Traiter l'audit sécurité #162.
6. Supporter le golden path réel #129.

## Livré

- [PR #174](https://github.com/AdamDjo/Grimoire-game/pull/174) (#147) — Auberge de L'Aveugle
  branchée à la base de données. Mergée sur `develop` le 21 juillet 2026.

## Après v0.1.0

1. #114 — rappel sémantique pgvector.
2. #117 — World events scriptés.
3. #133 — échange Souvenir contre lore.
