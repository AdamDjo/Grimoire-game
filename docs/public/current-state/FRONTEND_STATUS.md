---
type: frontend-status
visibility: public
rag: true
source_of_truth: true
owner: frontend
updated: 2026-07-21
---

# Frontend Status

## Actif

- #167 est implémentée sur `feature/167-interface-en-fr` et en validation avant PR :
  `next-intl`, anglais principal/fallback, français détecté à la première visite, sélecteur
  persistant cookie/compte et golden path traduit sans changer la locale de narration IA.
- #135 est mergée via PR #160 ; l'auth frontend passwordless est livrée sur `develop`.

## Livré sur develop

- #93 / PR #121 — UI Kit Grimoire global ; le chantier UI Kit est terminé.
- #149 — architecture frontend multi-univers.
- #124 — Forge guidée, branchée ensuite à la persistance par #146.
- #126 et #142 — Auberge UI et cinématique d'entrée.
- #125 et #134 — Game Session, inventaire, fiche et menu.
- #128 — dashboard, reprise et navigation.
- #132 — fin de run et lecteur de Chronique.
- #135 — auth complète et conversion anonyme : login/signup partagés, magic link
  passwordless, conversion anonyme, récupération par renvoi de lien, prompt progressif avant
  limite anonyme et logout dashboard.

## Gaps v0.1.0

- merger #167 après validation de la PR ;
- #168 — transmettre séparément la préférence de narration au contrat IA ;
- intégrer les contrats réels de l'Auberge maintenant que #147 est livré ;
- décider avec #152 si le concept libre est livré ou masqué pour v0.1.0 ;
- configurer le domaine/API/redirects de production avec #161 ;
- valider le golden path réel dans #129.

Les écrans Profil (#136), Chronologie (#130), Galerie (#131) et World Map (#127) ne sont pas
« oubliés » : ils sont explicitement différés après v0.1.0 et ne bloquent pas le premier run.
Le linking multi-provider avancé (#159) est également différé après v0.1.0.

Epic : #123. Coordination backend : #165.
