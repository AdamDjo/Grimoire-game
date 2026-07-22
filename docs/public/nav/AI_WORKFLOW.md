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
- les sources canoniques des skills projet `bug`, `check`, `design-taste-frontend`, `feature`,
  `hotfix`, `implement`, `pr`, `release`, `status` et `sync` dans `.agents/skills/` ;
- les liens relatifs `.claude/skills/` vers ces sources, afin que Claude et Codex exécutent le même
  workflow sans duplication ;
- les workflows GitHub, templates de PR et scripts qui contrôlent cette politique.

Les skills canoniques utilisent des formulations neutres et chargent `CLAUDE.md` ou `AGENTS.md`
selon l'outil actif. Une règle réellement spécifique reste dans le fichier d'entrée de l'outil, pas
dans une copie du skill.

## Ressources volontairement locales

- `.claude/settings.local.json`, `.claude/plans/` et `.codex/` ;
- les skills tiers installés localement, par exemple `gsap-*` ;
- `.obsidian/`, les fichiers `.DS_Store` et autres réglages machine ;
- `docs/private/`, les assets lourds et les sources régénérables.

Un nouveau skill doit être rendu public s'il encode une convention, une commande ou une procédure
propre à GRIMOIRE. Un skill tiers inchangé reste local et doit être réinstallé depuis sa source.

## Skills globaux utilisés par GRIMOIRE

Ces skills tiers sont installés globalement pour Claude Code et Codex. Leur contenu n'est pas copié
dans le dépôt ; les commandes suivantes constituent la procédure de restauration sur une nouvelle
machine.

| Skill                              | Usage projet                                      | Source               |
| ---------------------------------- | ------------------------------------------------- | -------------------- |
| `supabase-postgres-best-practices` | schémas, migrations, requêtes, index et RLS       | officiel Supabase    |
| `e2e-testing-patterns`             | Cypress/Playwright, golden paths et accessibilité | wshobson/agents      |
| `vercel-react-best-practices`      | React, Next.js, rendu, data fetching et bundles   | officiel Vercel Labs |

```bash
npx skills add supabase/agent-skills --skill supabase-postgres-best-practices --agent claude-code codex --global --yes
npx skills add wshobson/agents --skill e2e-testing-patterns --agent claude-code codex --global --yes
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --agent claude-code codex --global --yes
```

Les skills globaux complètent les règles du projet sans les remplacer. En cas de contradiction,
`AGENTS.md`, `CLAUDE.md`, l'architecture et le canon GRIMOIRE gagnent.

## Contrôle automatique

`pnpm check:project-memory` vérifie en CI les points d'entrée, les sources canoniques et la cible de
chaque lien Claude. `pnpm check:doc-links` protège les routes documentaires.
