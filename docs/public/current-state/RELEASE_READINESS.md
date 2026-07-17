---
type: release-status
visibility: public
rag: true
source_of_truth: true
owner: release-coordination
updated: 2026-07-17
---

# Release Readiness — v0.1.0

Ce fichier est mis à jour après merge sur `develop`, pas depuis une branche frontend ou backend.
La checklist opérationnelle détaillée vit dans l'issue #163.

## État au 17 juillet 2026

| Bloc                    | État                 | Référence      |
| ----------------------- | -------------------- | -------------- |
| UI Kit                  | Livré                | #93 / PR #121  |
| Epic frontend           | En cours             | #123           |
| Auth/conversion anonyme | PR prête, non mergée | #135 / PR #160 |
| Epic backend            | En cours             | #165           |
| Auberge réelle          | En cours             | #147           |
| Disponibilité IA        | À faire              | #101           |
| Concept libre           | À trancher/livrer    | #152           |
| Déploiement API         | À faire              | #161           |
| Sécurité dépendances    | Bloquant             | #162           |
| Golden path réel        | À faire              | #129           |
| Checklist de livraison  | Ouverte              | #163           |

## Hors scope de la première release

Profil complet, Chronologie, Galerie des Souvenirs, World Map, linking multi-provider, pgvector,
World events et échange Souvenir/lore.

## Go / No-Go

`NO-GO` tant que l'API n'est pas déployée, que les risques critiques ne sont pas traités et que
le golden path #129 n'est pas vert sur l'environnement de release.
