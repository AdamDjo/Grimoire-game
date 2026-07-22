---
type: release-status
visibility: public
rag: true
source_of_truth: true
owner: release-coordination
updated: 2026-07-22
---

# Release Readiness — v0.1.0

Toute PR qui change un bloqueur `phase: predeploy` met à jour ce fichier selon l'état attendu après
merge. La checklist opérationnelle détaillée vit dans l'issue #163.

## Fondations livrées

| Bloc                      | État  | Référence      |
| ------------------------- | ----- | -------------- |
| UI Kit                    | Livré | #93 / PR #121  |
| Auth/conversion anonyme   | Livré | #135 / PR #160 |
| Interface EN/FR           | Livré | #167 / PR #177 |
| Langue IA navigateur      | Livré | #168 / PR #178 |
| Auberge backend réelle    | Livré | #147 / PR #174 |
| Canon et plan Survie v2   | Livré | #179 / PR #187 |
| Mémoire et état du projet | Livré | #189           |

## Phase 1 — pré-déploiement

| Bloc                      | État       | Référence |
| ------------------------- | ---------- | --------- |
| Contrats shared Survie v2 | À faire    | #180      |
| Conditions et Désavantage | À faire    | #181      |
| Calamine et fin Calciné   | À faire    | #182      |
| Inventaire réel           | À faire    | #183      |
| Action de repos           | À faire    | #184      |
| Danger IA                 | À faire    | #185      |
| UI Survie v2              | À faire    | #186      |
| Auberge frontend réelle   | À faire    | #188      |
| Disponibilité IA          | À faire    | #101      |
| Concept libre             | À trancher | #152      |
| Sécurité dépendances      | Bloquant   | #162      |
| Déploiement API           | À faire    | #161      |
| Golden path réel          | À faire    | #129      |
| Checklist de livraison    | Ouverte    | #163      |

## Post-déploiement

Profil complet (#136), Chronologie (#130), Galerie (#131), World Map (#127), linking
multi-provider (#159), pgvector (#114), World events (#117) et échange Souvenir/lore (#133).

## Go / No-Go

`NO-GO` tant que les treize blocs fonctionnels pré-déploiement ne sont pas livrés, que la sécurité
n'est pas qualifiée, que l'API n'est pas déployée et que le golden path #129 n'est pas vert sur
l'environnement de release.
