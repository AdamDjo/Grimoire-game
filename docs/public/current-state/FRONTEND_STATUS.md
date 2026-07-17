---
type: frontend-status
visibility: public
rag: true
source_of_truth: true
owner: frontend
updated: 2026-07-17
---

# Frontend Status

## Actif

- Issue : #135 — auth complète et conversion anonyme.
- Branche : `feature/135-auth-conversion-anonyme`.
- PR : #160 vers `develop`, CI et preview Vercel vertes ; review/merge restant.

## Livré sur develop

- #93 / PR #121 — UI Kit Grimoire global ; le chantier UI Kit est terminé.
- #149 — architecture frontend multi-univers.
- #124 — Forge guidée, branchée ensuite à la persistance par #146.
- #126 et #142 — Auberge UI et cinématique d'entrée.
- #125 et #134 — Game Session, inventaire, fiche et menu.
- #128 — dashboard, reprise et navigation.
- #132 — fin de run et lecteur de Chronique.

## Gaps v0.1.0

- intégrer les contrats réels de l'Auberge lorsque #147 sera livré ;
- décider avec #152 si le concept libre est livré ou masqué pour v0.1.0 ;
- configurer le domaine/API/redirects de production avec #161 ;
- valider le golden path réel dans #129.

Les écrans Profil (#136), Chronologie (#130), Galerie (#131) et World Map (#127) ne sont pas
« oubliés » : ils sont explicitement différés après v0.1.0 et ne bloquent pas le premier run.

Epic : #123. Coordination backend : #165.
