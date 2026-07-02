# Wiki Log — Journal chronologique (append-only)

> Chaque entrée = une décision ou un pivot passé. Ne jamais modifier les entrées existantes. Ajouter en bas.

---

## early-2026 — Pivot produit : abandon vision RP générique → GRIMOIRE / Velkhar

Abandon complet de la vision "RP générique" (`docs/_archive/Roleplay_IA_Masterplan.md`) au profit de **GRIMOIRE — Of Ash and Salt**, monde de **Velkhar** (roguelike narratif désertique, run 3-15h). Univers, stack, archi = refondus. L'ancien masterplan est conservé en archive pour référence historique uniquement.

---

## 2026-06-28 — Sync GDD : alignement docs sur Velkhar canon (terminée)

Passe de synchronisation documentaire pour aligner tout le repo sur le GDD Velkhar (le code avait été initialisé sur une vision "Valorain"). Fichiers mis à jour : `CLAUDE.md` racine, `docs/MEMORY.md`, `docs/TECH_STACK.md`, `apps/frontend/CLAUDE.md`, `apps/backend/CLAUDE.md`, `docs/GAME_DESIGN.md`. Aucun code TypeScript modifié (reporté). Plan de traçabilité : `docs/_archive/plan-sync-gdd.md` (supprimé post-migration, contenu repris dans les fichiers cibles).

---

## 2026-06-30 — Décisions DA mockups Hub + Session (contraignantes Phase 1B)

Suite à la revue DA des mockups Hub L'Aveugle et Session (`docs/_archive/DA-REVIEW-MOCKUPS-2026-06-30.md`) :

1. **"Classe" → "Vocation"** dans tous les labels UI — non négociable, blocant pour Character Create
2. **L'Aveugle** = choix dynamiques générés par l'IA à chaque tour (pas 4 boutons fixes prédéfinis)
3. **Dé d20** affiché uniquement en modal overlay aux pivots narratifs — jamais visible par défaut dans l'interface
4. **Images de biome** = statiques pré-générées (pas de génération runtime par scène, coût/latence trop élevés)

---

## 2026-07-02 — Migration docs/ : GDD rapatrié dans le repo, structure LLM Wiki

- `docs/raw/` créé : contient les 25 fichiers GDD Velkhar actifs (gitignoré — physiquement présent, non commité)
- `docs/wiki/` créé : `index.md` (routeur GDD + doc) + ce `log.md`
- `ZCodeProject/GDD/_archive-v1/` supprimé (zip backup : `~/Desktop/gdd-archive-v1-backup-2026-07-02.zip`)
- `AGENTS.md` créé à la racine (standard multi-IA : Cursor, Windsurf, Copilot, etc.)
- `docs/04-references/GDD-MAP.md` fusionné dans `docs/wiki/index.md` puis supprimé
- `docs/01-current-state/plan-sync-gdd.md` supprimé (sync terminée, contenu repris)
- `docs/02-design/animation.md` archivé dans `docs/_archive/` (items restants → issues GitHub)
- `docs/02-design/GAME_DESIGN.md` : chirurgie (§3 + §11 supprimés, §4 compressé, §7.1/§7.6 → pointeur DESIGN_TOKENS.md, §8.4 corrigé)
