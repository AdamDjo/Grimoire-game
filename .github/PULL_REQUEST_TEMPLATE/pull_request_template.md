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

## Current-state

Les documents cochés décrivent l'état attendu **après merge**, jamais une branche « en validation ».

- [ ] `FRONTEND_STATUS.md` + `FRONTEND_NEXT.md` mis à jour si frontend
- [ ] `BACKEND_STATUS.md` + `BACKEND_NEXT.md` mis à jour si backend/shared/AI
- [ ] `RELEASE_READINESS.md` mis à jour si un bloqueur `phase: predeploy` change
- [ ] Current-state non applicable

Justification current-state: <!-- obligatoire si « non applicable » est coché -->

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
