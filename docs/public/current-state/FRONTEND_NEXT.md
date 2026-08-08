---
type: frontend-actions
visibility: public
rag: true
source_of_truth: true
owner: frontend
default_agent: codex
updated: 2026-08-06
---

# Frontend Next

## Phase 0 — refonte roguelike (priorité absolue)

> **🎲 Décision du 2026-08-06.** Le déploiement est décalé (cf. `PROJECT_STATUS`). Le frontend doit
> cesser de rendre **toutes** les activités du jeu dans le même écran narratif : c'est la cause
> directe du ressenti « c'est toujours pareil ». Canon :
> `docs/public/raw/23-RUN-STRUCTURE.md` et `docs/public/raw/09-ACTION-LOOP.md` §2bis.

1. [#219](https://github.com/AdamDjo/Grimoire-game/issues/219) — **refonte par modes** : exploration,
   combat, auberge, retour. Chaque mode a sa propre interface et son propre rythme (principe 12,
   `01-PILLARS` §9). Le mode courant vient du serveur, il n'est jamais déduit du texte de scène.
2. [#215](https://github.com/AdamDjo/Grimoire-game/issues/215) — **interface de combat** : liste des
   ennemis et de leur état, ordre des tours, actions catégorisées, journal des jets.
3. [#216](https://github.com/AdamDjo/Grimoire-game/issues/216) — **auberge** : contrat, boutique,
   forge, et surtout l'écran de **sac** où se joue l'arbitrage vivres/butin.
4. [#214](https://github.com/AdamDjo/Grimoire-game/issues/214) — **encart de demi-tour** : l'écran de
   décision central du jeu (sac, eau, estimation de retour), plus l'affichage des paliers.
5. [#218](https://github.com/AdamDjo/Grimoire-game/issues/218) — **lisibilité** : tooltips
   systématiques sur SANG/SOUFFLE/CENDRE, Calamine, jauges et conditions. Les textes existent déjà
   dans `docs/public/raw/04-ATTRIBUTES.md` et n'ont **jamais** été câblés à l'UI.
6. [#217](https://github.com/AdamDjo/Grimoire-game/issues/217) — **pouvoirs d'artefact** : label,
   coût en Calamine et usages restants visibles **avant** activation.
7. [#220](https://github.com/AdamDjo/Grimoire-game/issues/220) / [#221](https://github.com/AdamDjo/Grimoire-game/issues/221) — compagnons et exploits.

Chaque écran de mode dépend du contrat backend correspondant : ne pas démarrer un mode avant que
`packages/shared` porte ses types.

## Phase 1 — pré-déploiement (gelée)

> ⏸️ Gelée jusqu'à ce que la Phase 0 rende le jeu satisfaisant (décision 19).

1. ~~#186~~ — UI Survie v2 livrée : contrats mécaniques projetés, HUD, conditions, inventaire,
   Désavantage, alertes Mourant/Négligence, fin Calciné et parcours Forge → premier run direct avec
   Auberge post-run responsive en `100dvh`.
2. ~~#152~~ — flow du concept libre dans `CharacterCreateFlow` : livré.
3. ~~#162~~ — retrait d'axios (dépendance inutilisée) : livré. Le durcissement pentest ajoute les
   en-têtes de sécurité dans `next.config.ts` (CSP, HSTS et consorts) : à revérifier lors de #161,
   la CSP dérive de `NEXT_PUBLIC_SUPABASE_URL` et doit couvrir le domaine de production final.
4. ⏸️ #161 — configurer `NEXT_PUBLIC_API_URL`, le domaine final et les redirects Supabase.
5. ⏸️ #129 — exécuter les golden paths anonyme, conversion et résilience en EN/FR. **À re-scoper**
   après la refonte : les parcours testés ne décriront plus le jeu.

## Post-déploiement

1. #136 — Profil, Paramètres et confidentialité.
2. #130 — Chronologie personnelle.
3. #131 — Galerie des Souvenirs.
4. #127 — World Map progressive.
5. #159 — linking multi-provider.

Chaque PR frontend, qu'elle soit menée par Codex ou Claude, met à jour ce fichier et
`FRONTEND_STATUS.md` selon l'état attendu après merge. Si elle change un bloqueur pré-déploiement,
elle met aussi à jour `RELEASE_READINESS.md`.
