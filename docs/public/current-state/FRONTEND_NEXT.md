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

1. #186 — afficher le HUD Survie v2, les conditions, le Désavantage et la fin Calciné ; dépend de
   ~~#180~~ (livré, PR #196), ~~#181~~ (livré, PR #198) et #182-#184. Actions d'inventaire réel
   (~~#183~~, PR #200) déjà branchées : boutons utiliser/équiper/déséquiper opérationnels.
   ~~#201~~ (livré, PR #203) : `SurvivalStats` du personnage de démo et de `readSurvival`
   synchronisés avec `isDying`/`neglectStreak` ; l'affichage dédié à ces deux champs reste à faire
   dans le cadre du HUD Survie v2.
2. ~~#152~~ — flow du concept libre dans `CharacterCreateFlow` : livré.
3. ~~#162~~ — retrait d'axios (dépendance inutilisée) : livré. Le durcissement pentest ajoute les
   en-têtes de sécurité dans `next.config.ts` (CSP, HSTS et consorts) : à revérifier lors de #161,
   la CSP dérive de `NEXT_PUBLIC_SUPABASE_URL` et doit couvrir le domaine de production final.
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
