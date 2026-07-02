# Grimoire — Claude Code (Velkhar)

> Règles Git + TypeScript : `~/.claude/CLAUDE.md`
> Contexte projet complet (stack, archi, conventions) : **`AGENTS.md`** à la racine.
> **Lire en début de session : [`docs/00-START-HERE.md`](docs/00-START-HERE.md)** — puis `docs/wiki/index.md` pour naviguer vers le bon fichier GDD ou doc.
>
> ⚠️ **Source de vérité produit = `docs/raw/`** (GDD Velkhar, gitignored). Toute divergence → `docs/raw/` gagne.
> Ce repo implémente GRIMOIRE — Of Ash and Salt.

## UI — Note

Les designs hi-fi (Valorain-era) **n'existent pas dans ce repo**. Suivre les design tokens désertiques : [`docs/02-design/DESIGN_TOKENS.md`](docs/02-design/DESIGN_TOKENS.md). Détails composant dans `apps/frontend/CLAUDE.md`.

Les variables CSS (couleurs, polices, effets atmosphériques) sont documentées dans `GAME_DESIGN.md §7.7`. Ne jamais hard-coder une couleur — toujours utiliser les custom properties.

## Fichiers clés

Les agents lisent `docs/00-START-HERE.md` + leur `CLAUDE.md` d'app — pas besoin de re-expliquer.

## Skills disponibles

`/feature`, `/bug`, `/hotfix`, `/release`, `/pr`, `/sync`, `/check`, `/status`, `/implement`, `/design-taste-frontend`
