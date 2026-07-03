---
type: policy
visibility: public
rag: true
source_of_truth: true
---

# Private Canon Policy

`docs/private/raw/` est la source de vérité produit pour Velkhar : lore, règles, vocations, mémoire, Game Master, roadmap et décisions business.

Ce dossier est **gitignored**. Il reste lisible localement par les IA, mais ne doit jamais être publié.

## Règles

- Ne jamais publier `docs/private/raw/`.
- Ne jamais publier `docs/private/`.
- Ne jamais copier de détail sensible du canon privé dans une doc publique.
- Si une doc publique contredit `docs/private/raw/`, le canon privé gagne.
- Vérifier la présence locale du canon avec `pnpm check:canon`.

## Fichiers attendus

Le canon privé contient 25 fichiers Markdown, listés dans [[../wiki/canon-index]].
