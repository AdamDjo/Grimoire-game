---
type: plan-index
visibility: public
rag: true
source_of_truth: false
status: deferred
updated: 2026-07-23
---

# Grimoire — Plans produit et maquettes validées

Ce dossier conserve les décisions prises pour l'évolution de Grimoire après la livraison du
vertical slice Velkhar v0.1. Ces documents sont des plans différés : les fichiers
`docs/public/current-state/*` restent les sources de vérité pour l'exécution immédiate.

## Plans

- [`platform-multi-universe.md`](platform-multi-universe.md) — séparation entre Grimoire et ses
  univers, architecture cible, routing, sécurité, performance, backend, API et déploiement.
- [`velkhar-product-validation.md`](velkhar-product-validation.md) — proposition de valeur de
  Velkhar, canon jouable, textes, fonctionnalités, validation commerciale et instrumentation.

## Maquettes

- [`grimoire-public-landing-page.png`](mockups/grimoire-public-landing-page.png) — direction validée
  pour le site public multi-univers Grimoire.
- [`velkhar-landing-page-exploration.png`](mockups/velkhar-landing-page-exploration.png) — première
  exploration conservée pour son identité et ses illustrations ; elle n'est pas la composition à
  implémenter telle quelle.
- [`velkhar-landing-page-selected.png`](mockups/velkhar-landing-page-selected.png) — composition
  sélectionnée pour la future landing page de l'univers Velkhar, à adapter aux assets existants.
- [`velkhar-game-session-selected.png`](mockups/velkhar-game-session-selected.png) — direction
  sélectionnée pour la session de jeu : narration centrale ample, Boussole compacte en haut à
  gauche, Trace compacte en haut à droite et HUD Survie en bas.

## Règle d'utilisation

Les maquettes expriment une direction UX et artistique, pas des contrats fonctionnels. Avant toute
implémentation, confronter leurs libellés, jauges et actions aux contrats réellement mergés ainsi
qu'au canon public. Ne jamais déduire une règle backend depuis une image.
