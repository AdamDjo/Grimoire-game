---
type: tech-security
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-26
---

# Sécurité (#162)

## Audit de dépendances npm

`pnpm audit` est exécuté en CI (`.github/workflows/ci.yml`) sur chaque push/PR vers `main`/`develop`.
Depuis #162, `pnpm audit --audit-level=high` **bloque le pipeline** si une vulnérabilité `high` ou
`critical` est détectée (plus de `continue-on-error`).

### Résolution #162 (2026-07-26)

Point de départ : 92 vulnérabilités (2 critical, 41 high). Résolues via :

- Montée de version directe : Next.js 16.1.6 → 16.2.11, Vitest 2 → 3 (majeur, accepté car projet
  encore en dev, pas de prod déployée).
- `pnpm.overrides` (racine `package.json`) pour forcer les dépendances transitives vulnérables vers
  leur version patchée, avec sélecteur scopé au parent quand un package a plusieurs majeurs actifs
  dans l'arbre (ex. `express@4>path-to-regexp` pour ne pas forcer accidentellement la v8 de
  path-to-regexp partout).

État final : **0 critical, 0 high, 0 low, 1 moderate accepté** (voir ci-dessous).

### Risque accepté : `uuid@8.3.2` (moderate)

- **Alerte** : [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) — dépassement
  de buffer possible dans `uuid` v3/v5/v6 quand un buffer est fourni explicitement.
- **Chemin** : `apps/frontend > cypress@13.17.0 > @cypress/request@3.0.10 > uuid@8.3.2`.
- **Exposition** : nulle en production. `uuid` n'est utilisé qu'en interne par Cypress, un outil de
  test e2e qui ne tourne jamais dans le bundle applicatif livré (dev/CI uniquement). Le code du
  projet n'invoque jamais `uuid` avec un buffer fourni par l'utilisateur.
- **Pourquoi non corrigé** : le correctif nécessite `uuid >=11.1.1`, un saut majeur (v8 → v11) sur
  une dépendance transitive de Cypress non actualisable indépendamment sans risquer de casser
  `@cypress/request`. Effort disproportionné pour un risque moderate sans exposition runtime.
  Aucun override forcé n'a été tenté (contrairement aux autres correctifs #162) précisément pour
  cette raison.
- **Échéance** : réévalué à la prochaine montée de version majeure de Cypress, ou si `uuid` publie
  un backport patché sur la ligne 8.x.

## Row Level Security (RLS) — Supabase/Postgres

Voir [[AUTH]] : autorisation V1 basée sur filtrage `userId` explicite côté Express, RLS Postgres
**non activé** (dette explicite, actée dès #107). Sécurisation RLS en cours de guidage, voir suivi
projet.
