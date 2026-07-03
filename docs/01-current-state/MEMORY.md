# Project Memory — GRIMOIRE / Velkhar

> ⚠️ **Source de vérité produit = `docs/raw/`** (GDD Velkhar, 25 fichiers, gitignored — physiquement dans le repo).
> Si divergence entre ce fichier et le GDD → `docs/raw/` gagne. Index : [`docs/wiki/index.md`](../wiki/index.md).

## Status rapide

- **Projet** : GRIMOIRE — Of Ash and Salt (Des Cendres et du Sel)
- **Monde** : **Velkhar** (continent désertique, le _Makhzen_) — solo V1, co-op V2
- **Genre** : Roguelike narratif (MVP 45-70 min ; vision long terme run 3-15h + Chronique + méta-monde)
- **Branche courante** : `feature/88-landing-page-redesign` — **transition 1A → 1B** (landing à finaliser/merger avant le démarrage réel de 1B)
- **Phase actuelle** : **Transition Phase 1A → Phase 1B**
- **Phase 1B** : prête en backlog, pas encore démarrée en implémentation backend (Game Master + écrans gameplay — Aveugle, Character Create, World Map, Session)
- **Repo GitHub** : `AdamDjo/Grimoire-game`
- **Packages npm** : `@grimoire/*` (shared, eslint-config, prettier-config, frontend, backend)

### Prochaines actions

Voir [`PHASE-1B-BACKLOG.md`](PHASE-1B-BACKLOG.md). Bloqueurs transverses à traiter en premier :

0. Finaliser la landing sur `feature/88-landing-page-redesign` puis merger vers `develop`
1. Refonte triptyque TS dans `packages/shared/`
2. `openrouter.provider.ts` backend (remplace les 3 providers)
3. Migration `valorain/` → `velkhar/` (routes + lore)

---

## Décision stratégique produit — 2026-07-03

**On garde Velkhar.** GRIMOIRE ne pivote pas vers Dungeons & Dragons comme univers principal.

Raison : la différenciation du projet vient d'une IP claire et maîtrisable (Velkhar, L'Aveugle, Cendre, Calamine, Souvenirs) combinée à un vrai Game Master backend qui se souvient et ne triche pas. D&D peut inspirer des conventions lisibles (d20, archétypes faciles à comprendre, vocabulaire JdR), mais ne doit pas remplacer l'univers, les vocations, ni le triptyque SANG/SOUFFLE/CENDRE.

Règles de planning qui découlent de cette décision :

- MVP = vertical slice 45-70 min, pas run complet 15h au lancement.
- Le lore doit être introduit par paliers : L'Aveugle, Cendre, Calamine, Souvenirs d'abord ; le reste par découverte.
- Chaque élément de lore doit soutenir une boucle gameplay ou rétention : mémoire, corruption, héritage, Chronique, méta-progression.
- Les mécaniques de mémoire/world-state passent avant les cosmétiques et avant l'extension de régions, vocations ou bestiaire.

---

## Décisions produit (extraites du GDD — non négociables)

### Fondations

| #   | Décision             | Valeur                                                     |
| --- | -------------------- | ---------------------------------------------------------- |
| 1   | Nom                  | **GRIMOIRE — Of Ash and Salt**                             |
| 2   | Monde                | **Velkhar** (continent désertique, le _Makhzen_)           |
| 3   | Genre                | Roguelike narratif (MVP 45-70 min ; run 3-15h post-MVP)    |
| 4   | Persistance          | Canon fixe + méta-monde vivant + Chronique + écho léger    |
| 5   | Multijoueur          | Solo V1, co-op V2                                          |
| 6   | Action               | Choix IA + saisie libre + **dés BG3 aux pivots seulement** |
| 7   | Survie               | Complète mais pas hardcore — histoire = main focus         |
| 8   | Direction artistique | Dark fantasy désertique                                    |

### Personnage

| #   | Décision       | Valeur                                                 |
| --- | -------------- | ------------------------------------------------------ |
| 9   | Attributs      | Triptyque **SANG · SOUFFLE · CENDRE**                  |
| 10  | Progression    | **Équipement-driven** (pas de niveaux)                 |
| 11  | Vocations V1   | **Marcheur-du-Sel, Lame-Ombre, Veilleur, Tisse-Verbe** |
| 12  | Vocations V2   | Changepeau, Chasseur-de-Revenants, Contrebandier       |
| 13  | Création perso | Vocation prédéfinie OU concept écrit libre             |

### Lore (GDD L1-L11)

| #   | Décision        | Valeur                                                                                                                       |
| --- | --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| L1  | Origine         | Les **Archontes** ont forgé des artefacts. Magie a débordé → désert de cendre dorée. UN événement.                           |
| L2  | Sable doré      | = la **Cendre** (magie dispersée). La **brume dorée** = Cendre concentrée, mortelle.                                         |
| L3  | Magie unifiée   | Artefacts = seule source de pouvoir. **Calamine** = coût universel. **Tisse-Verbe** = seul à éveiller/pousser les artefacts. |
| L4  | Calcinés        | Anciens humains abusés de Cendre → menaces dorées. Catégorie centrale du bestiaire.                                          |
| L5  | Donjons/ruines  | Là où dorment les artefacts. Cœur de la boucle d'exploration.                                                                |
| L6  | Quête ouverte   | **Pouvoir / Vérité / Survie / Destruction** — aucune canonique. Le joueur construit SA vérité.                               |
| L7  | Factions        | 4 majeures (Culte, Guilde du Sel, Main d'Ombre, Éveilleurs) + 5-6 mineures                                                   |
| L8  | L'Aveugle       | Vend **UNIQUEMENT** du lore + explique les artefacts rapportés. Pas d'équipement.                                            |
| L9  | Monnaie méta    | **Les Souvenirs** — 1 gratuit/run + bonus performance. Échangés chez L'Aveugle.                                              |
| L10 | Monnaie in-game | 🪙 **L'or classique** — achat/revente d'équipement. Perdu à la mort.                                                         |
| L11 | Vocabulaire     | Hiérarchisé 3 niveaux : 5 mots (scène 1) → 10 (run 1) → découvertes (runs suivants)                                          |

### Méta-progression

| #   | Décision           | Valeur                                                                                                          |
| --- | ------------------ | --------------------------------------------------------------------------------------------------------------- |
| 14  | Héritage           | Artéfact (1, dégrade après 3-4 transmissions) + écho réputation/connaissance/compétence mineurs + ancêtre vague |
| 15  | Gardien du seuil   | **L'Aveugle** (aubergiste, vend infos lore)                                                                     |
| 16  | Joueur sans compte | Session anonyme + conversion douce (compte proposé après run 1)                                                 |

### Tech & business

| #   | Décision      | Valeur                                                                                                                               |
| --- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 17  | Stack IA      | **OpenRouter** (routeur) + fallback, 1-2 appels/tour                                                                                 |
| 18  | Stack code    | Express + TypeScript (routes/services/ai/game-rules/lore) — on garde la stack moderne (Turborepo + Next.js 15)                       |
| 19  | Monétisation  | Quota run/jour gratuit + premium illimité + IA premium                                                                               |
| 20  | Rejouabilité  | Méta-monde changeant + choix divergents + émergence IA                                                                               |
| 21  | Bestiaire     | 15-20 créatures au lancement, par tiers + biome                                                                                      |
| 22  | Artefacts     | Endgame rares, liés à quêtes/secrets/donjons                                                                                         |
| 23  | Opening scene | **Fixe** : auberge L'Aveugle → nom → modal création → IA réagit → (run≥2) vend infos contre Souvenirs → joueur quitte → run commence |

---

## Opening scene — L'Aveugle (hub permanent)

À **chaque run**, le joueur commence dans l'Auberge de L'Aveugle (image plein écran). C'est la **seule scène garantie identique** d'un run à l'autre — c'est le hub roguelike.

```
1. Auberge de L'Aveugle (lieu unique, image)
2. L'Aveugle demande le nom
3. Modal création (vocation OU concept libre)
4. IA réagit (première salutation personnalisée)
5. Si run ≥ 2 : L'Aveugle vend infos lore contre Souvenirs
6. Joueur quitte l'auberge → run commence
```

Règles L'Aveugle :

- Vend **uniquement** du lore (pas d'équipement)
- Explique les artefacts rapportés
- Source des Souvenirs méta (échanges uniquement chez lui)
- Lieu de **tutoriel implicite** (pas de tuto popup)

---

## Tooling — TOUT EST EN PLACE ✅

- ESLint + Prettier partagés (`@grimoire/eslint-config`, `@grimoire/prettier-config`) ✅
- GitHub Actions : ci.yml, pr-metadata.yml, release.yml ✅
- Husky + commitlint + lint-staged ✅
- Vitest (frontend + backend) ✅
- Cypress E2E ✅
- Renovate (remplace Dependabot npm) + CodeQL ✅
- Knip + Bundle Analyzer ✅
- Claude Code skills : /feature, /bug, /hotfix, /release, /pr, /sync ✅
- lint-staged avec `.lintstagedrc.js` (workspace-aware, ESLint dans chaque app) ✅

---

## Préférences utilisateur

- Langue : **Français** (pour la conversation), mais **tout le code source doit être en anglais** — strings UI, commentaires, metadata, placeholders. Traduction i18n plus tard.
- Commits : jamais de `Co-Authored-By` Claude. Pas de noreply@anthropic.com nulle part.
- Format commit : `type(scope): message` (feat, fix, chore, docs, refactor, test)
- Travail séquentiel (pas d'agents parallèles sauf si explicitement demandé)
- Toujours créer l'issue GitHub AVANT la branche via MCP github
- Toujours lire ce fichier MEMORY.md en début de session
- **Pas de tickets créés à la demande "docs + routes"** — juste corriger la doc inline

---

## Stack technique

- Monorepo Turborepo + pnpm 9.15.0
- Frontend : Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS 4
- Backend : Express 4, TypeScript strict, Node 20 (I/O-bound + TS partagé front/back — ne pas changer)
- DB : Supabase (PostgreSQL + pgvector pour retrieval NPC/lore/artefacts)
- **AI** : **OpenRouter** (routeur unique) → fallback config-driven (Claude dev / Gemini Flash prod / Mistral). 1-2 appels/tour max. Jamais de self-hosted LLM.
- State : Zustand + React Query

---

## ⚠️ TODO post-sync — implementation backlog

La passe doc du 2026-06-28 a aligné la documentation sur le GDD Velkhar. **Aucune implémentation TS n'a été faite**. À traiter dans les passes suivantes :

- [ ] `packages/shared/src/types/character.types.ts` — refondre au triptyque SANG/SOUFFLE/CENDRE + `vocation` + `peuple` (au lieu de 10 classes / 6 peuples)
- [ ] `packages/shared/src/types/scene.types.ts` — ajouter `souvenirsGagnes?` + notion de quête ouverte
- [ ] `apps/backend/src/game-rules/dice.ts` — réécrire : **d20 aux pivots seulement**, PV = 10 + SANG, Calamine comme ressource
- [ ] `apps/backend/src/ai/scene-validator.ts` — adapter au canon Velkhar (magie unifiée, artefacts, 4 quêtes ouvertes, L'Aveugle)
- [ ] `apps/backend/src/lore/velkhar.canon.ts` — créer (au lieu de `valorain.canon.ts`)
- [ ] `apps/backend/src/lore/velkhar/` — dossier : world-bible.ts, factions.ts, bestiaire.ts (Calcinés), aveugle.ts
- [ ] Tests `dice.ts` + `scene-validator.ts` — réécrire au triptyque (hors scope passe doc)
- [ ] `apps/backend/src/ai/openrouter.provider.ts` — remplacer providers/ par routeur OpenRouter unique
- [ ] Variable d'env `OPENROUTER_API_KEY` (au lieu de 3 clés Gemini/Mistral/Claude)

---

## Workflow GitHub — TOUJOURS respecter

**Règles workflow — SANS EXCEPTION** :

- Une issue GitHub par tâche → une branche avec le numéro d'issue → une PR → merge
- **Jamais commiter directement sur `develop` ou `main`**, même pour du tooling/config/rename
- Nommage branche : `feature/<numéro>-<description>`, `fix/<numéro>-<description>`, `hotfix/<numéro>-<description>`
- Branches depuis `develop`, PRs vers `develop` (sauf hotfix/release → `main`)
- Avant tout `git commit` : vérifier qu'on est sur une branche feature/fix/hotfix/chore, jamais sur develop/main
- Labels à passer explicitement à la PR (l'auto-labeler ne tourne que sur GitHub events)
- Milestones disponibles : Phase 1A/1B/2/2B/3
- Repo GitHub : `AdamDjo/Grimoire-game`

---

## Checklist par phase

> Source de vérité unique (remplace PROGRESS.md supprimé). Mettre à jour ici après chaque tâche complétée.

### Phase 0 — Sync docs avec GDD ✅ (passe 2026-06-28)

- [x] `CLAUDE.md` racine — Velkhar + OpenRouter
- [x] `docs/MEMORY.md` — décisions GDD L1-L23
- [x] `docs/TECH_STACK.md` — OpenRouter + triptyque + L'Aveugle
- [x] `apps/frontend/CLAUDE.md` — routing velkhar/, palette désertique
- [x] `apps/backend/CLAUDE.md` — lore/velkhar.canon.ts
- [x] `docs/GAME_DESIGN.md` — §4 Velkhar canon + §6 vocations + §7 palette désertique
- [ ] `packages/shared/src/types/*` — refonte triptyque (passe suivante)
- [ ] `apps/backend/src/game-rules/dice.ts` — réécriture d20 aux pivots (passe suivante)
- [ ] Tests dice/validator — réécriture (passe suivante)

### Phase 1A — Frontend UI (Velkhar) ⏳ À FINALISER / MERGER

- [ ] **Landing page redesign** (branche `feature/88-landing-page-redesign`) — base + animations posées (loader, particules, cursor gold, footer/navbar, texte, defiler/parallax, sections), **encore des modifs à faire avant merge**
- [ ] Routing structure `/(main)/velkhar/`, `/(game)/velkhar/`
- [ ] Pages : character-create (4 vocations) · campaign hub · world map (Makhzen)
- [ ] **Page "Auberge de L'Aveugle"** — main scene d'entrée à chaque run
- [ ] Composants UI : StatBar (SANG/SOUFFLE/CENDRE), Toast, Stepper, Button, Card, Input, Badge, Modal
- [ ] Composants L'Aveugle : AubergeScene, AveugleDialogue, VocationPicker, ConceptLibreInput

### Phase 1B — Backend Foundation ⏳

- [ ] `lore/velkhar.canon.ts` + dossier `lore/velkhar/` (world-bible, factions, bestiaire, aveugle)
- [ ] OpenRouter provider (routeur unique)
- [ ] DB schema migrations (Character : vocation + triptyque + calamine + souvenirs)
- [ ] Schema WorldNpc / WorldFact / Artefact (avec pgvector)
- [ ] Auth + Zod validation middleware
- [ ] Routes : auth, character, session (run), ouverture L'Aveugle

### Phase 2 — MVP Roguelike ⏳

- [ ] Vertical slice 45-70 min jouable end-to-end avec Chronique texte
- [ ] Free Action + IC/OOC + action/dialogue auto-detect
- [ ] Dés d20 **aux pivots seulement** (BG3-style)
- [ ] L'Aveugle — dialogue IA + vente lore contre Souvenirs
- [ ] Boucle : auberge → run → mort → Chronique → méta-monde change → auberge
- [ ] 4 quêtes ouvertes non canoniques (Pouvoir / Vérité / Survie / Destruction)

### Phase 2B — Méta-monde & Héritage ⏳

- [ ] Méta-monde vivant entre runs (saisons, cataclysmes)
- [ ] Héritage artefact (dégrade 3-4 transmissions) + ancêtre + échos
- [ ] Vocations V2 (Changepeau, Chasseur-de-Revenants, Contrebandier)
- [ ] Co-op V2

### Phase 3 — Polish ⏳

- [ ] Responsive + animations
- [ ] 3D D20 (cosmétique, après mémoire solide)
- [ ] PDF export Chronicle
- [ ] Souvenirs premium / IA premium

---

## The Pitch (one sentence)

> **GRIMOIRE — Of Ash and Salt. Des Cendres et du Sel. A narrative roguelike where every run is a complete story — and the world remembers.**

Concurrent direct : AI Dungeon (liberté totale, zéro mémoire). GRIMOIRE gagne sur la cohérence du MJ et la persistance, pas sur le modèle.

---

## Key Technical Decisions

- **Backend stack** : Node + Express + TS — ne pas changer (I/O-bound, shared TS types front/back, une seule langue pour solo dev frontend)
- **AI** : **OpenRouter** (routeur unique) + fallback config-driven. Jamais de self-hosted LLM. 1-2 appels/tour max.
- **Free deployment** : Vercel + Railway/Render + Supabase + free APIs via OpenRouter
- **Load/capacity** : graceful degradation (fallback chain + per-player rate-limit + queue), jamais de hard-crash
- **Lore** : Canon Fixe (Velkhar — petit, écrit à la main) + Canon Émergent (gelé par backend) — même système que la mémoire
- **Twitch/streamer voting** : coupé définitivement (anti-RP par design)
- **Multi-univers** : **coupé**. GRIMOIRE = Velkhar only. Pas de Valorain/Zombie/Sci-Fi/Apocalypse.

---

## Key Code Files

| Path                                               | Role                                                            |
| -------------------------------------------------- | --------------------------------------------------------------- |
| `CLAUDE.md`                                        | Règles spécifiques GRIMOIRE (global dans `~/.claude/CLAUDE.md`) |
| `packages/shared/src/index.ts`                     | Shared types barrel export (⚠️ TODO refonte triptyque)          |
| `apps/backend/src/index.ts`                        | Express entry point                                             |
| `apps/frontend/src/app/layout.tsx`                 | Next.js root layout                                             |
| `apps/backend/src/ai/openrouter.provider.ts`       | AI provider (⚠️ TODO remplacer providers/ par OpenRouter)       |
| `apps/backend/src/services/game-engine.service.ts` | Central game orchestrator                                       |
