# Wiki Log — Journal chronologique (append-only)

> Chaque entrée = une décision ou un pivot passé. Ne jamais modifier les entrées existantes. Ajouter en bas.

---

## early-2026 — Pivot produit : abandon vision RP générique → GRIMOIRE / Velkhar

Abandon complet de la vision "RP générique" (`docs/private/archive/Roleplay_IA_Masterplan.md`) au profit de **GRIMOIRE — Of Ash and Salt**, monde de **Velkhar** (roguelike narratif désertique, run 3-15h). Univers, stack, archi = refondus. L'ancien masterplan est conservé en archive pour référence historique uniquement.

---

## 2026-06-28 — Sync GDD : alignement docs sur Velkhar canon (terminée)

Passe de synchronisation documentaire pour aligner tout le repo sur le GDD Velkhar (le code avait été initialisé sur une vision "Valorain"). Fichiers mis à jour : `CLAUDE.md` racine, `docs/public/current-state/MEMORY.md`, `docs/public/tech/TECH_STACK.md`, `apps/frontend/CLAUDE.md`, `apps/backend/CLAUDE.md`, `docs/public/design/GAME_DESIGN.md`. Aucun code TypeScript modifié (reporté). Plan de traçabilité archivé côté privé.

---

## 2026-06-30 — Décisions DA mockups Hub + Session (contraignantes Phase 1B)

Suite à la revue DA des mockups Hub L'Aveugle et Session (`docs/private/archive/legacy/teck_docs/DA-REVIEW-MOCKUPS-2026-06-30.md`) :

1. **"Classe" → "Vocation"** dans tous les labels UI — non négociable, blocant pour Character Create
2. **L'Aveugle** = choix dynamiques générés par l'IA à chaque tour (pas 4 boutons fixes prédéfinis)
3. **Dé d20** affiché uniquement en modal overlay aux pivots narratifs — jamais visible par défaut dans l'interface
4. **Images de biome** = statiques pré-générées (pas de génération runtime par scène, coût/latence trop élevés)

---

## 2026-07-02 — Migration docs/ : GDD rapatrié dans le repo, structure LLM Wiki

- `docs/public/raw/` créé : contient les 25 fichiers GDD Velkhar actifs (gitignoré — physiquement présent, non commité)
- `docs/public/wiki/` créé : `index.md` (routeur GDD + doc) + ce `log.md`
- `ZCodeProject/GDD/_archive-v1/` supprimé (zip backup : `~/Desktop/gdd-archive-v1-backup-2026-07-02.zip`)
- `AGENTS.md` créé à la racine (standard multi-IA : Cursor, Windsurf, Copilot, etc.)
- `docs/04-references/GDD-MAP.md` fusionné dans `docs/public/wiki/index.md` puis supprimé
- `docs/public/current-state/plan-sync-gdd.md` supprimé (sync terminée, contenu repris)
- `docs/public/design/animation.md` archivé dans `docs/private/archive/legacy/` (items restants → issues GitHub)
- `docs/public/design/GAME_DESIGN.md` : chirurgie (§3 + §11 supprimés, §4 compressé, §7.1/§7.6 → pointeur DESIGN_TOKENS.md, §8.4 corrigé)

---

## 2026-07-03 — Sync canon : GDD copié dans docs/public/raw

Le canon GDD Velkhar a été copié depuis `/Users/adembenmessaoud/ZCodeProject/GDD/` vers `docs/public/raw/` pour que le projet, les agents IA et la documentation partagent le même répertoire de vérité locale.

- `docs/public/raw/` contient désormais les 25 fichiers Markdown canon en local.
- `docs/public/raw/` est privé et gitignored : il reste lisible par les IA locales, mais ne doit pas être publié.
- Les anciens chemins frontend `valorain/` ont été renommés en `velkhar/`.

---

## 2026-07-03 — Décision stratégie produit : garder Velkhar, réduire le MVP

Revue PM du lore et du positionnement. Décision : **garder Velkhar comme IP principale** et ne pas pivoter vers Dungeons & Dragons comme univers. D&D reste seulement une référence de lisibilité JdR (d20, archétypes, enjeux visibles), pas une direction de contenu.

Changements de plan :

- MVP Phase 2 = vertical slice 45-70 min qui prouve mémoire, conséquences, L'Aveugle et Chronique texte.
- Runs complets 3-15h = objectif post-MVP / Phase 3+.

---

## 2026-07-03 — Réorganisation du vault docs en public/private

Le vault docs est passé à une structure simple :

- `docs/00-START-HERE.md` reste le point d'entrée unique.
- `docs/public/` contient les documents trackés et publiables : current-state, design, project, tech, wiki.
- `docs/private/` contient tout ce qui ne doit pas être publié : canon complet, plans, prompts, assets lourds, archives.
- Le canon GDD actif vit désormais dans `docs/public/raw/`.
- `pnpm check:canon` vérifie désormais `docs/public/raw/`.
- Lore exposé par paliers : L'Aveugle, Cendre, Calamine, Souvenirs d'abord ; Archontes, factions, régions et secrets par découverte.
- Priorité produit confirmée : memory/world-state/validation backend avant extension de régions, vocations, bestiaire, 3D dice ou leaderboard.

---

## 2026-07-04 — Architecture vault Obsidian + IA + RAG

Réduction des répétitions et séparation des sources de vérité :

- `docs/00-HOME.md` ajouté comme dashboard Obsidian humain.
- `docs/00-START-HERE.md` réduit en point d'entrée IA stable.
- `PROJECT_STATUS.md` devient la seule source pour phase, priorité et branche.
- `NEXT_ACTIONS.md` devient la seule source pour les actions immédiates.
- `ARCHITECTURE_RULES.md` devient la source des invariants backend/AI/frontend.
- `wiki/index.md` devient un index court vers `task-router.md` et `canon-index.md`.
- `PRIVATE_CANON_POLICY.md`, `DOCS_MAP.md` et `RAG_RULES.md` ajoutés dans `docs/public/reference/`.
- `PROJECT_OVERVIEW.md` + `LORE_PRIMER.md` fusionnés dans `PUBLIC_BRIEF.md`.
- Les `CLAUDE.md` et agents pointent vers les sources au lieu de recopier les règles.

---

## 2026-07-04 — Statut landing : préparation des frames T1 Cendres

La Phase 1A landing reste active. Le plan principal est `docs/private/plans/landing/PLAN-LANDING-CUBERTO-LEVEL.md`, et l'étape opérationnelle actuelle est la préparation/génération des frames **T1 Cendres** via `docs/private/plans/landing/LANDING_ASSET_PROMPTS.md`.

Phase 1B reste en backlog uniquement jusqu'à validation et merge de la landing.

---

## 2026-07-12 — Fix : trou de canon entre branches/worktrees

`docs/public/raw/` contenait déjà une copie complète et à jour du canon (25 fichiers), mais tous les docs de routage (`00-START-HERE.md`, `task-router.md`, `canon-index.md`, `RAG_RULES.md`, `PRIVATE_CANON_POLICY.md`) pointaient encore vers `docs/private/raw/` (gitignored). Résultat : sur une branche/worktree où `docs/private/` n'était pas recréé localement, une IA suivant ces liens croyait le canon manquant.

- Tous les liens de routage public pointent désormais vers `docs/public/raw/`.
- `PRIVATE_CANON_POLICY.md` réécrite : le canon est officiellement public et versionné, `docs/private/` ne sert plus qu'aux plans en cours / assets lourds / archives.
- `scripts/check-canon.sh` et `pnpm check:canon` supprimés (obsolètes : un dossier versionné ne peut pas "manquer" silencieusement, `git status` suffit).
- L'ancien doublon `docs/private/raw/` (gitignored) a été supprimé — `docs/public/raw/` est l'unique source de vérité.

---

## 2026-07-12 — Réorganisation : `current-state/` allégé, `plans-actifs/` créé

`current-state/` mélangeait statut vivant (`PROJECT_STATUS.md`, `NEXT_ACTIONS.md`), un routeur de compatibilité (`MEMORY.md`) et deux plans de travail actifs — trop chargé, confus à parcourir.

- `docs/public/current-state/MEMORY.md` supprimé après vérification complète : `AGENTS.md` (Codex) ne le référençait pas ; seuls 2 skills Claude Code (`status`, `implement`) pointaient vers un chemin fantôme `docs/MEMORY.md` jamais existant post-reorg — corrigés pour lire directement `PROJECT_STATUS.md`/`NEXT_ACTIONS.md`.
- `PLAN-GAMESESSION-1B.md` et `PHASE-1B-BACKLOG.md` déplacés dans le nouveau dossier `docs/public/plans-actifs/` (plans de travail en cours, séparés du statut vivant).
- `current-state/` ne contient plus que `PROJECT_STATUS.md` + `NEXT_ACTIONS.md`.
- Références croisées corrigées : `DOCS_MAP.md`, `TECH_STACK.md`, `PLAN-GAMESESSION-1B.md`, `AGENTS.md`, `apps/backend/CLAUDE.md`, `README.md`.

---

## 2026-07-12 — Fusion `wiki/` + `reference/` → `nav/`

`wiki/` et `reference/` avaient la même fonction (aider à naviguer le vault) sans frontière claire, et 4 fichiers différents (`00-START-HERE.md`, `docs/public/README.md`, `wiki/index.md`, `reference/DOCS_MAP.md`) redirigeaient tous vers les mêmes cibles — confusion et trou d'hallucination potentiel.

- `wiki/` et `reference/` fusionnés en `docs/public/nav/` (contient `DOCS_MAP.md`, `task-router.md`, `canon-index.md`, `PRIVATE_CANON_POLICY.md`, `RAG_RULES.md`, `log.md`).
- `docs/public/README.md` et `wiki/index.md` supprimés (pure redite de `00-START-HERE.md` / `DOCS_MAP.md`, aucune info unique).
- `00-START-HERE.md` reste l'unique point d'entrée IA ; `DOCS_MAP.md` reste la carte exhaustive.
- Tous les liens (`AGENTS.md`, `CLAUDE.md`, agents Claude Code, docs publiques, `apps/backend/CLAUDE.md`, `packages/shared/CLAUDE.md`) repointés vers `docs/public/nav/`.

---

## 2026-07-12 — Audit complet des liens : 2 chemins fantômes corrigés

Balayage de tous les fichiers contenant des liens markdown/wiki-links (`00-START-HERE.md`, `PROJECT_STATUS.md`, `NEXT_ACTIONS.md`, `DESIGN_TOKENS.md`, `GAME_DESIGN.md`, `PRIVATE_CANON_POLICY.md`, `canon-index.md`, `PHASE-1B-BACKLOG.md`, `TECH_STACK.md`, `ARCHITECTURE_RULES.md`, `DOCS_MAP.md`, `RAG_RULES.md`, `task-router.md`, `AGENTS.md`, `CLAUDE.md` (racine + apps + packages), agents Claude Code).

- `task-router.md` et `apps/frontend/CLAUDE.md` référençaient encore `docs/private/plans/landing/PLAN-LANDING-CUBERTO-LEVEL.md` et `LANDING_SEO_BILINGUAL_PLAN.md` — ces fichiers n'existent plus (Phase 1A livrée, plans landing archivés). Remplacés par les entrées vers les plans actifs réels : `docs/private/plans/gamesession-1b/NOTES-IMPLEMENTATION.md` et `docs/private/plans/ui-kit/PLAN-UI-KIT-PRODUCTION.md`.
- `TECH_STACK.md` : mention résiduelle "canon privé" corrigée en "canon (`docs/public/raw/`)" — terminologie obsolète depuis que le canon est public.
- Tous les autres liens vérifiés (contenu lu intégralement, pas juste grep) : corrects.

---

## 2026-07-17 — Séparation des états frontend, backend et release

Le travail parallèle frontend/backend provoquait des conflits récurrents dans `PROJECT_STATUS.md`
et `NEXT_ACTIONS.md`. Les responsabilités documentaires sont désormais séparées :

- `PROJECT_STATUS.md` devient un index stable sans branche active ;
- `NEXT_ACTIONS.md` devient un routeur de compatibilité sans backlog dupliqué ;
- `FRONTEND_STATUS.md` + `FRONTEND_NEXT.md` appartiennent au chantier frontend ;
- `BACKEND_STATUS.md` + `BACKEND_NEXT.md` appartiennent au chantier backend ;
- `RELEASE_READINESS.md` est synchronisé après merge sur `develop`, jamais depuis deux branches concurrentes ;
- les skills et agents Codex/Claude ont été alignés sur ces frontières.

---

## 2026-07-17 — Clôture documentaire des chantiers UI Kit et Phase 1B

L'issue UI Kit #93 est fermée et sa PR #121 est mergée. Les anciens plans UI Kit, vertical slice
Game Session, durcissement moteur et backlog Phase 1B ont été déplacés de `plans-actifs/` vers
`public/archive/plans/`. Le frontend v0.1 reste ouvert uniquement pour l'auth, les intégrations
réelles, la configuration de production et le golden path ; les écrans secondaires sont post-v0.1.
