---
type: frontend-actions
visibility: public
rag: true
source_of_truth: true
owner: frontend
default_agent: codex
updated: 2026-07-26
---

# Frontend Next

## Phase 1 — pré-déploiement

1. ~~#186~~ — UI Survie v2 livrée : contrats mécaniques projetés, HUD, conditions, inventaire,
   Désavantage, alertes Mourant/Négligence et fin Calciné.
2. ~~#152~~ — flow du concept libre dans `CharacterCreateFlow` : livré.
3. #161 — configurer `NEXT_PUBLIC_API_URL`, le domaine final et les redirects Supabase.
4. #129 — exécuter les golden paths anonyme, conversion et résilience en EN/FR.

## Post-déploiement

1. #136 — Profil, Paramètres et confidentialité.
2. #130 — Chronologie personnelle.
3. #131 — Galerie des Souvenirs.
4. #127 — World Map progressive.
5. #159 — linking multi-provider.

Chaque PR frontend, qu'elle soit menée par Codex ou Claude, met à jour ce fichier et
`FRONTEND_STATUS.md` selon l'état attendu après merge. Si elle change un bloqueur pré-déploiement,
elle met aussi à jour `RELEASE_READINESS.md`.
