---
name: bug
description: "Crée une issue GitHub puis une branche fix depuis develop avec le numéro d'issue. Usage : /bug nom, par exemple /bug login-crash."
allowed-tools: Bash
---

L'utilisateur veut corriger un bug. Les args sont le nom de la branche (sans le préfixe `fix/`).

Si aucun arg fourni, demander le nom et la description du bug.

Exécuter dans l'ordre :

1. **Créer l'issue GitHub**
   - Demander : "Décris le bug en une phrase (pour l'issue GitHub)"
   - Déduire ou demander la phase : `phase: predeploy` ou `phase: postdeploy`.
   - Déduire le domaine : `domain: frontend`, `domain: backend` et/ou `domain: ai`.
   - Créer l'issue avec `gh issue create`, le label `type: bug`, la phase et le domaine, puis
     l'assigner à `AdamDjo`.
   - Noter le numéro de l'issue créée → `<numéro>`

2. **Ajouter l'issue au projet Scrum Board**

   ```bash
   ISSUE_NODE_ID=$(gh api repos/AdamDjo/Grimoire-game/issues/<numéro> --jq '.node_id')
   gh api graphql -f query='mutation { addProjectV2ItemById(input: { projectId: "PVT_kwHOAacnj84BU6rS" contentId: "'$ISSUE_NODE_ID'" }) { item { id } } }'
   ```

3. **Mettre develop à jour**

   ```bash
   git checkout develop && git pull origin develop
   ```

4. **Créer la branche avec le numéro d'issue**

   ```bash
   git checkout -b fix/<numéro>-<args>
   ```

   Exemple : issue #30 + args "login-crash" → `fix/30-login-crash`

5. **Confirmer à l'utilisateur :**

   ```
   ✅ Issue #<numéro> créée — assignée à AdamDjo, ajoutée au Scrum Board
   ✅ Branche 'fix/<numéro>-<args>' créée depuis develop

   Workflow :
   1. Corrige le bug, commite avec : git commit -m "fix(<scope>): <description>"
   2. Quand prêt : /pr pour pousser et ouvrir la PR → develop (Closes #<numéro>)
   ```
