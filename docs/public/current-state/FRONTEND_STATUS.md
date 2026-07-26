---
type: frontend-status
visibility: public
rag: true
source_of_truth: true
owner: frontend
default_agent: codex
updated: 2026-07-26
---

# Frontend Status

## Livré sur develop

- #93 / PR #121 — UI Kit Grimoire global.
- #149 — architecture frontend multi-univers.
- #124 et #146 — Forge guidée et persistance du personnage.
- #126 et #142 — Auberge UI et cinématique d'entrée.
- #125 et #134 — Game Session, inventaire, fiche et menu.
- #128 — dashboard, reprise et navigation.
- #132 — fin de run et lecteur de Chronique.
- #135 / PR #160 — auth passwordless et conversion anonyme sans perte de progression.
- #167 / PR #177 — interface anglaise/française avec sélecteur persistant.
- #168 / PR #178 — préférence navigateur distincte pour la narration IA.
- #179 / PR #187 — canon et plan Gameplay Survie v2.
- #189 — mémoire projet, routage Claude/Codex et garde-fous `current-state`.
- #188 — Auberge branchée sur les contrats réels `hub`, `talk` et `spend`, avec états de
  résilience et reprise anonyme/authentifiée.
- #181 / PR #198 — priorité langue explicite du switcher en jeu sur la détection navigateur pour
  la narration IA (le HUD Survie v2 consommant conditions/Désavantage reste #186).
- #183 / PR #200 — panneau d'inventaire Velkhar branché sur `POST /api/game/inventory/action` :
  boutons utiliser/équiper/déséquiper par objet, mise à jour de l'inventaire et des stats de
  survie après réponse serveur.
- #201 / PR #203 — synchronisation frontend avec `SurvivalStats` (contrat backend #201) : `isDying`
  et `neglectStreak` ajoutés au personnage de démo et à `readSurvival`, `updatedStats` restant
  `Record<string, number>` (isDying non transporté réseau, mis à jour côté backend uniquement).
- #152 — flow du concept libre dans `CharacterCreateFlow` : soumission du concept à L'Aveugle via
  `resolveVocation` (client API), état `vocationResolutionStatus` (`idle`/`pending`/`resolved`/
  `fallback`/`error`) affiché avec `ArchetypeCard` réutilisé pour la vocation proposée, acceptation
  qui avance vers l'étape Histoire, repli explicite vers les 4 voies preset avec message dédié en
  cas d'échec, `CharacterCreateDraft` v2 (nom personnalisé, trait narratif, compétences décalées)
  persisté dans le brouillon versionné. Copy EN/FR synchronisée.
- #162 — axios retiré de `apps/frontend` : dépendance inutilisée (aucun appel dans le code, fetch
  natif partout), sans impact fonctionnel.

## Pré-déploiement restant

- #186 — livrer l'UI Survie v2 après stabilisation des contrats ~~#180~~ (livré, PR #196) et des
  endpoints ~~#181~~ (livré, PR #198), #182-#184.
- #161 — configurer l'API de production et les redirects Supabase côté frontend.
- #129 — valider le golden path réel EN/FR, l'accessibilité et le responsive.

## Post-déploiement

- #136 — Profil, Paramètres et confidentialité.
- #130 — Chronologie personnelle.
- #131 — Galerie des Souvenirs.
- #127 — World Map progressive.
- #159 — linking multi-provider.

Agent assigné par défaut : **Codex**, remplaçable par Claude sur demande explicite. Coordination
backend/shared/IA : #165. Epic frontend : #123. Checklist release : #163.
