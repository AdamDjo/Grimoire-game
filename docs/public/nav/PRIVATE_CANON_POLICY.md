---
type: policy
visibility: public
rag: true
source_of_truth: true
---

# Canon Policy

`docs/public/raw/` est la source de vérité produit pour Velkhar : lore, règles, vocations, mémoire, Game Master, roadmap et décisions business.

Ce dossier est **versionné et public** : toute IA (quelle que soit la branche ou le worktree) peut toujours le lire directement — il n'est plus gitignored.

## Règle absolue — lire le canon AVANT de coder (front ET back)

**Tout ce qui touche au jeu doit être lu dans `docs/public/raw/` AVANT d'écrire la moindre ligne de code — côté backend comme côté frontend.**

- **Backend** : mécaniques (dés, DC, dégâts, survie, conditions, économie, vocations, mémoire, Game Master…).
- **Frontend** : copie affichée, règles de jeu visibles, lore présenté à l'écran, libellés, comportements de gameplay.
- **Jamais** de constante, valeur, libellé ou comportement "provisoire, à valider plus tard". Si le canon n'a pas été lu, ce n'est pas écrit.
- Le fichier canon pertinent se trouve via [[canon-index]] ou [[task-router]] (ex : `06-SURVIVAL.md` pour le drain, `08-DICE-RESOLUTION.md` pour les DC et dégâts).

## Autres règles

- Si une doc publique résumée (ex: `GAME_DESIGN.md`) contredit `docs/public/raw/`, le canon `raw/` gagne — corriger le résumé.
- `docs/private/` reste réservé au travail non-stable : plans en cours, assets lourds, archives, brouillons Obsidian. Rien de `private/` n'est requis pour comprendre les règles de jeu.
- Dès qu'une décision passe de "en réflexion" (`docs/private/plans/`) à "actée", elle migre dans le canon `docs/public/raw/` ou dans le doc public concerné.

## Fichiers attendus

Le canon contient 25 fichiers Markdown, listés dans [[canon-index]].
