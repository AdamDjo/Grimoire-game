---
type: release-status
visibility: public
rag: true
source_of_truth: true
owner: release-coordination
updated: 2026-07-26
---

# Release Readiness — v0.1.0

Toute PR qui change un bloqueur `phase: predeploy` met à jour ce fichier selon l'état attendu après
merge. La checklist opérationnelle détaillée vit dans l'issue #163.

## Fondations livrées

| Bloc                           | État  | Référence      |
| ------------------------------ | ----- | -------------- |
| UI Kit                         | Livré | #93 / PR #121  |
| Auth/conversion anonyme        | Livré | #135 / PR #160 |
| Interface EN/FR                | Livré | #167 / PR #177 |
| Langue IA navigateur           | Livré | #168 / PR #178 |
| Auberge backend réelle         | Livré | #147 / PR #174 |
| Auberge frontend réelle        | Livré | #188           |
| Canon et plan Survie v2        | Livré | #179 / PR #187 |
| Mémoire et état du projet      | Livré | #189           |
| Disponibilité IA (fallback GM) | Livré | #101 / PR #191 |
| Contrats shared Survie v2      | Livré | #180 / PR #196 |
| Conditions et Désavantage      | Livré | #181 / PR #198 |
| Calamine et fin Calciné        | Livré | #182 / PR #199 |
| Inventaire réel                | Livré | #183           |
| Action de repos                | Livré | #184           |

## Phase 1 — pré-déploiement

| Bloc                   | État     | Référence |
| ---------------------- | -------- | --------- |
| Danger IA              | Livré    | #185      |
| UI Survie v2           | Livré    | #186      |
| Concept libre          | Livré    | #152      |
| Sécurité dépendances   | Bloquant | #162      |
| Déploiement API        | À faire  | #161      |
| Golden path réel       | À faire  | #129      |
| Checklist de livraison | Ouverte  | #163      |

## Post-déploiement

Profil complet (#136), Chronologie (#130), Galerie (#131), World Map (#127), linking
multi-provider (#159), pgvector (#114), World events (#117) et échange Souvenir/lore (#133).

## Go / No-Go

`NO-GO` tant que les blocs fonctionnels pré-déploiement restants (#162 sécurité, #161 déploiement
API, #129 golden path) ne sont pas livrés, que la sécurité n'est pas qualifiée, que l'API n'est pas
déployée et que le golden path #129 n'est pas vert sur l'environnement de release.
