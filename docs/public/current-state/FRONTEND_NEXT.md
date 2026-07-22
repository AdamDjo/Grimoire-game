---
type: frontend-actions
visibility: public
rag: true
source_of_truth: true
owner: frontend
default_agent: codex
updated: 2026-07-22
---

# Frontend Next

## Phase 1 — pré-déploiement

1. #188 — brancher l'Auberge sur les endpoints réels `hub`, `talk` et `spend` de #147.
2. #186 — afficher le HUD Survie v2, les conditions, l'inventaire réel, le Désavantage et la fin
   Calciné ; dépend de #180-#184.
3. #152 — livrer le flow du concept libre ou masquer l'option sans cul-de-sac pour la V1.
4. #161 — configurer `NEXT_PUBLIC_API_URL`, le domaine final et les redirects Supabase.
5. #129 — exécuter les golden paths anonyme, conversion et résilience en EN/FR.

## Post-déploiement

1. #136 — Profil, Paramètres et confidentialité.
2. #130 — Chronologie personnelle.
3. #131 — Galerie des Souvenirs.
4. #127 — World Map progressive.
5. #159 — linking multi-provider.

Chaque PR frontend, qu'elle soit menée par Codex ou Claude, met à jour ce fichier et
`FRONTEND_STATUS.md` selon l'état attendu après merge. Si elle change un bloqueur pré-déploiement,
elle met aussi à jour `RELEASE_READINESS.md`.
