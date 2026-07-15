---
type: status
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-15
---

# Project Status

## État actuel

- Projet : **GRIMOIRE — Of Ash and Salt**
- Phase actuelle : **Phase 1B — parcours frontend Velkhar** (EPIC #123), après livraison du moteur backend et de la mémoire narrative principale.
- Branche active : `feature/126-auberge-aveugle-hub`.
- Priorité active : finaliser #126, avec deux flows distincts : seuil narratif avant création et hub immersif après création du personnage. Le hub est fixé à `100dvh` sur desktop, utilise le cadre sombre existant de l’auberge et sépare les états Parler, Souvenirs et Présage. Le présage constitue la préparation significative avant un nouveau run ; il est persisté localement et transmis à la route Session en attendant le contrat backend.
- Ordre recommandé ensuite : #125 Game Session, puis #134 inventaire/fiche/menu.

## Livré récemment

- **Phase 1A — landing** : ✅ mergée (#94).
- **#124 — Character Create / Forge guidée** : ✅ mergée (PR #141 → `develop`). Le résultat temporaire est persisté côté frontend jusqu’au contrat API personnage.
- **#128 — dashboard, reprise et navigation** : ✅ mergée (PR #139 → `develop`).
- **#115 — Souvenirs nommés** et **#116 — Chronique de fin de run** : ✅ mergés (PR #138 et #140 → `develop`).
- **EPIC #95 — vertical slice gamesession Velkhar** : ✅ mergée sur `develop` (PR #102, commit `9bb37a5`). Ferme #95→#100.
- **#107 — auth Supabase** : ✅ livrée, en PR [#108](https://github.com/AdamDjo/Grimoire-game/pull/108) → `develop`. Tier anonyme (`signInAnonymously`), magic link + OAuth Google/Discord, JWT vérifié via JWKS dans `requireAuth`, cap 30 req anonymes → 403. Vérifiée live. Détail : [[../tech/AUTH]].
- **#109 — moteur de session durci (A1+A2)** : ✅ mergé (PR #110 → `develop`). D20 + conséquences rapatriés côté backend, world-state persistant, `endReason` posé sur `GameSession`.
- **#111 — mémoire narrative N2 (compression de scène)** : ✅ mergé (PR #118 → `develop`). Compression fire-and-forget tous les 8 tours via Mistral Small (fallback Llama 3.3), stockage `MemoryChunk`, injection des chunks récents + faits épinglés dans le prompt système.

## Backlog A3 — mémoire narrative (après #111)

Chantier découpé en sous-tickets indépendants, tous rattachés à A3 :

- [#113](https://github.com/AdamDjo/Grimoire-game/issues/113) — **N1, fenêtre court-terme** (3-5 derniers tours en clair). Gap confirmé : aucune implémentation actuelle, trou de continuité entre le tour 1 et le premier chunk N2 (tour 8).
- [#114](https://github.com/AdamDjo/Grimoire-game/issues/114) — **pgvector / rappel sémantique** sur les `MemoryChunk` N2. Dépend de #111 (livré).
- [#115](https://github.com/AdamDjo/Grimoire-game/issues/115) — **Souvenirs nommés (N3)**, persistants inter-runs. Dépend de `key_facts_pinned` (#111, livré).
- [#116](https://github.com/AdamDjo/Grimoire-game/issues/116) — **Chronique de fin de run**. Génère un récit ~400 mots à partir de N2 + Souvenirs + `endReason`. Inclut la purge des `SceneLog` bruts post-génération (ancien scope #112, fermé et absorbé ici).
- [#117](https://github.com/AdamDjo/Grimoire-game/issues/117) — **World events (Level C)**, scriptés manuellement, jamais IA-générés. Indépendant du reste de A3.

## Dette / non-autoritatif à durcir

- #101 (fallback multi-modèles OpenRouter pour le Game Master principal) : ouvert, non implémenté.
- 91 vulnérabilités Dependabot sur `develop` (3 critiques) — à traiter dans un ticket dédié.
- **Cap anonyme contournable** (#107) : vider les cookies `sb-*` réinitialise le quota (nouvel `auth.users.id`). Dette V1 assumée (friction, pas sécurité). Détail : [[../tech/AUTH]].
- **RLS Postgres** différé (#107, décision #7) : autorisation V1 = filtrage `userId` explicite côté Express.

## Critères pour avancer dans la Phase 1B

- #126 mergé sur `develop` avec séparation seuil/hub validée.
- #125 Game Session reconstruite avec le UI Kit.
- Parcours Landing → seuil → Forge → hub → Session sans cul-de-sac.

## Sources liées

- Prochaines actions : [[NEXT_ACTIONS]]
- Backlog Phase 1B : [[PHASE-1B-BACKLOG]]
- Plan gamesession 1B : [[PLAN-GAMESESSION-1B]]
- Routeur IA : [[../nav/task-router]]
- Canon : [[../nav/canon-index]]
- Règles d'architecture : [[../tech/ARCHITECTURE_RULES]]
- Authentification : [[../tech/AUTH]]
