---
type: frontend-status
visibility: public
rag: true
source_of_truth: true
owner: frontend
default_agent: codex
updated: 2026-07-24
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

## Pré-déploiement restant

- #186 — livrer l'UI Survie v2 après stabilisation des contrats ~~#180~~ (livré, PR #196) et des
  endpoints #181-#184.
- #152 — intégrer la résolution du concept libre ou masquer proprement l'option en V1.
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
