---
type: policy
visibility: public
rag: true
source_of_truth: true
---

# Canon Policy

`docs/public/raw/` est la source de vérité produit pour Velkhar : lore, règles, vocations, mémoire, Game Master, roadmap et décisions business.

Ce dossier est **versionné et public**. Toute IA (quelle que soit la branche ou le worktree) doit toujours pouvoir le lire — c'est pour ça qu'il n'est plus gitignored.

## Règles

- `docs/public/raw/` est la référence : toujours à jour, jamais de trou entre branches/worktrees.
- Si une doc publique résumée (ex: `GAME_DESIGN.md`) contredit `docs/public/raw/`, le canon `raw/` gagne — corriger le résumé.
- `docs/private/` reste réservé au travail non-stable : plans en cours, assets lourds, archives, brouillons Obsidian. Rien de `private/` n'est requis pour comprendre les règles de jeu ou l'architecture.
- Dès qu'une décision passe de "en réflexion" (`docs/private/plans/`) à "actée", elle migre dans `docs/public/raw/` ou dans le doc public concerné.

## Fichiers attendus

Le canon contient 25 fichiers Markdown, listés dans [[canon-index]].
