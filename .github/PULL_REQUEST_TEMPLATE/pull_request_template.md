## Résumé

<!-- Décris en 1-3 phrases l'état livré une fois cette PR mergée. -->

## Issue liée

Closes #<!-- numéro d'issue -->

## Type de changement

- [ ] Nouvelle fonctionnalité
- [ ] Bug fix
- [ ] Refactoring sans changement de comportement
- [ ] Chore / Tooling / Config
- [ ] Documentation uniquement

## Phase et domaine

- **Phase** : <!-- renseigner exactement un label de phase autorisé -->
- **Domaine** : <!-- domain: frontend / domain: backend / domain: ai -->
- **Propriétaire** : <!-- agent réellement assigné + domaine -->

Phases autorisées : `phase: predeploy` ou `phase: postdeploy`. Remplacer le commentaire sur la
ligne **Phase** par une seule valeur.

## Décisions à consigner

**Par défaut, une PR ne modifie aucun document.** L'avancement se lit sur GitHub : cette PR ferme son
issue, c'est suffisant. On ne documente que les **choix non évidents** — pourquoi telle valeur, telle
fermeture de type, tel garde-fou.

- [ ] Aucune décision non évidente — aucun document modifié
- [ ] `BACKEND.md` mis à jour (décision backend/shared/AI)
- [ ] `FRONTEND.md` mis à jour (décision frontend)
- [ ] `RELEASE_READINESS.md` mis à jour (un bloqueur `phase: predeploy` change)
- [ ] `nav/log.md` complété (pivot ou décision structurante)

Décision consignée : <!-- une ligne, si un document est coché -->

## Checklist technique

- [ ] Conventions du domaine respectées
- [ ] Types partagés dans `packages/shared`, jamais dupliqués
- [ ] Type-check et lint passent
- [ ] Tests pertinents passent
- [ ] Aucun `console.log` oublié
- [ ] Test manuel décrit ci-dessous

## Test manuel effectué

<!-- Commandes et parcours vérifiés. -->

## Captures d'écran

<!-- Frontend uniquement, avant/après si pertinent. -->

## Notes pour la review

<!-- Risques, compromis et décisions. -->

---

> Les domaines sont auto-déduits du diff. La phase déclarée dans cette PR pilote le milestone V1.
