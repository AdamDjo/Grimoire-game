---
type: release-status
visibility: public
rag: true
source_of_truth: true
owner: release-coordination
updated: 2026-08-06
---

# Release Readiness — v0.1.0 (décalée) → v0.2.0

Toute PR qui change un bloqueur `phase: predeploy` met à jour ce fichier selon l'état attendu après
merge. La checklist opérationnelle détaillée vit dans l'issue #163.

> **⏸️ Déploiement décalé — décision du 2026-08-06.**
>
> La v0.1.0 n'est **pas** bloquée par un problème technique : les bloqueurs restants sont
> circonscrits et connus. Elle est décalée parce que **le jeu n'est pas satisfaisant** — verdict de
> playtest : _« après une partie je m'ennuie, il n'y a aucune raison de recommencer »_ (décision 19).
>
> Le travail bascule sur la **refonte roguelike v0.2.0** (8 EPICs, #214→#221). Ce fichier reste la
> source de vérité du déploiement et sera réactivé une fois la boucle de jeu satisfaisante ; sa
> checklist reste valable.

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

| Bloc                   | État                  | Référence      |
| ---------------------- | --------------------- | -------------- |
| Danger IA              | Livré                 | #185           |
| UI Survie v2           | Livré                 | #186           |
| Concept libre          | Livré                 | #152           |
| Sécurité dépendances   | Livré                 | #162 / PR #209 |
| Déploiement API        | ⏸️ Gelé               | #161           |
| Golden path réel       | ⏸️ Gelé — à re-scoper | #129           |
| Checklist de livraison | ⏸️ Gelée              | #163           |

Les trois blocs gelés ne sont pas annulés. #129 devra être **re-scopé** : son golden path valide un
parcours (landing → auberge → session) qui ne décrira plus le jeu après la refonte.

## Phase 0 — refonte roguelike (en cours)

Prérequis de fait au déploiement : le jeu doit être satisfaisant avant d'être publié.

| Bloc                             | État     | Référence |
| -------------------------------- | -------- | --------- |
| Alignement du canon              | En cours | #222      |
| Boucle de run (contrat → retour) | À faire  | #214      |
| Combat par tours                 | À faire  | #215      |
| Auberge sous contrainte          | À faire  | #216      |
| Artefacts activables             | À faire  | #217      |
| Lisibilité (tooltips, lore)      | À faire  | #218      |
| UI par modes                     | À faire  | #219      |
| Compagnons                       | À faire  | #220      |
| Exploits                         | À faire  | #221      |

## Post-déploiement

Profil complet (#136), Chronologie (#130), Galerie (#131), World Map (#127), linking
multi-provider (#159), pgvector (#114), World events (#117) et échange Souvenir/lore (#133).

## Go / No-Go

`NO-GO`, pour deux raisons distinctes qu'il ne faut pas confondre :

1. **Raison produit (bloquante, prioritaire)** — la boucle de jeu n'est pas satisfaisante. Les 8
   EPICs de la Phase 0 doivent être livrés et le jeu jugé amusant par l'auteur avant de rouvrir la
   question du déploiement.
2. **Raison technique (circonscrite)** — l'API n'est pas déployée (#161) et le golden path n'est pas
   vert sur un environnement de release (#129, à re-scoper). La sécurité, elle, est qualifiée
   depuis #162.

Le passage en `GO` suppose que **les deux** soient levées, dans cet ordre.
