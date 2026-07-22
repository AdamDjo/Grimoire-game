---
type: ai-workflow-policy
visibility: public
rag: true
source_of_truth: true
---

# AI Workflow — Mémoire et skills

Cette politique empêche la perte des instructions projet et sépare les ressources versionnées des
réglages personnels ou régénérables.

## Chaîne mémoire

1. `MEMORY.md` est l'unique point d'entrée générique à la racine.
2. `docs/00-START-HERE.md` route vers les sources de vérité.
3. `docs/public/current-state/` contient le statut vivant et le backlog par domaine.
4. `docs/public/nav/task-router.md` charge uniquement le canon nécessaire à la tâche.

Le statut ne doit jamais être recopié dans `MEMORY.md`, les fichiers agents ou les skills.

## Attribution souple

- Claude est assigné par défaut au backend/shared/IA et Codex au frontend.
- Ce choix réduit les conflits, mais ne constitue pas une permission exclusive.
- Une demande utilisateur explicite peut confier n'importe quel domaine à Claude ou Codex.
- L'agent assigné suit toujours les instructions et la paire `STATUS/NEXT` du domaine, indépendamment
  de son identité.

## Ressources toujours versionnées

- `MEMORY.md`, `AGENTS.md`, `CLAUDE.md` et les fichiers `CLAUDE.md` des workspaces ;
- `docs/00-HOME.md`, `docs/00-START-HERE.md` et tout `docs/public/` ;
- les agents projet frontend, backend et code-review dans `.claude/agents/` ;
- les skills projet `bug`, `check`, `design-taste-frontend`, `feature`, `hotfix`, `implement`, `pr`,
  `release`, `status` et `sync` dans `.claude/skills/` et `.agents/skills/` ;
- les workflows GitHub, templates de PR et scripts qui contrôlent cette politique.

Une modification fonctionnelle d'un skill commun doit être reportée dans ses variantes Claude et
Codex. Les références spécifiques à l'outil (`CLAUDE.md` ou `AGENTS.md`) peuvent différer.

## Ressources volontairement locales

- `.claude/settings.local.json`, `.claude/plans/` et `.codex/` ;
- les skills tiers installés localement, par exemple `gsap-*` ;
- `.obsidian/`, les fichiers `.DS_Store` et autres réglages machine ;
- `docs/private/`, les assets lourds et les sources régénérables.

Un nouveau skill doit être rendu public s'il encode une convention, une commande ou une procédure
propre à GRIMOIRE. Un skill tiers inchangé reste local et doit être réinstallé depuis sa source.

## Contrôle automatique

`pnpm check:project-memory` vérifie en CI que les points d'entrée et chaque skill projet existent
encore dans les deux environnements. `pnpm check:doc-links` protège les routes documentaires.
