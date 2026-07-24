---
type: backend-status
visibility: public
rag: true
source_of_truth: true
owner: backend
default_agent: claude
updated: 2026-07-24
---

# Backend Status

## Livré sur develop

- #103 et #146 — Prisma/Supabase, world-state et personnage persistants.
- #107 — auth Supabase et vérification JWT/JWKS.
- #109 — d20, conséquences et world-state souverains côté backend.
- #111 et #113 — mémoire narrative N2/N1.
- #115 et #116 — Souvenirs nommés et Chronique de fin de run.
- #147 / PR #174 — Auberge de L'Aveugle branchée à la base et aux contrats API.
- #154 et #155 — erreurs asynchrones et délimitation du texte libre dans le prompt.
- #168 / PR #178 — locale IA BCP-47 validée et persistée.
- #179 / PR #187 — canon et plan Gameplay Survie v2.
- #189 — mémoire projet, routage Claude/Codex et garde-fous `current-state`.
- #101 / PR #191 — fallback multi-modèles face aux erreurs OpenRouter.
- #180 / PR #196 — contrats partagés Survie v2 (`ConditionId`, `ActiveCondition`, `itemGained`).
- #181 / PR #198 — conditions persistées, Désavantage au d20 et priorité langue explicite du
  switcher en jeu sur la détection navigateur.
- #182 / PR #199 — paliers de Calamine et fin spéciale `calcined`, `ChronicleEndReason` dérivé de
  `SessionEndReason`.
- #183 — inventaire réel : acquisition via `item_gained` signalé par l'IA, usage/équipement/
  déséquipement joueur via `/inventory/action`, persisté et validé côté backend, et branché
  côté frontend (boutons d'action dans le panneau d'inventaire Velkhar).
- #201 — survie punitive : paliers narratifs Soif/Faim/Énergie (75/50/25) injectés dans le prompt
  IA pour narration, Désavantage non cumulatif sous 25 (réutilise `computeDisadvantage`), nouvelle
  source Calamine backend sur négligence prolongée (Faim ou Soif à 0 pendant 3+ tours, +3 à +5/tour),
  érosion de -1 PV/tour non cumulative tant que Faim ou Soif est à 0, et état universel « mourant »
  (sursis d'un tour à 0 PV, mort définitive au second passage à 0) qui remplace l'ancienne règle
  « 0 PV → inconscience ». Canon `06-SURVIVAL.md` §1/§4/§7 mis à jour en conséquence.

## Pré-déploiement restant

- #184 — repos court/feu et récupération canonique.
- #185 — danger IA régulier et crescendo d'intensité.
- #152 — résolution du concept libre ou signal explicite de masquage V1.
- #162 — vulnérabilités critiques/hautes applicables.
- #161 — API, migrations, secrets, CORS et healthcheck de production.
- #129 — golden path contre les services réels.

## Post-déploiement

- #114 — rappel sémantique pgvector.
- #117 — World events scriptés.
- #133 — échange Souvenir contre lore.

Agent assigné par défaut : **Claude**, remplaçable par Codex sur demande explicite. Coordination
frontend : #123. Epic backend : #165. Checklist release : #163.
