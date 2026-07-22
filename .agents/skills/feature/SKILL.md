---
name: feature
description: Crée une issue GitHub puis une branche feature depuis develop avec le numéro d'issue. Usage: /feature <nom> — ex: /feature inventory-consumption
allowed-tools: Bash
---

L'utilisateur veut démarrer une nouvelle feature. Les args sont le nom de la branche (sans le préfixe `feature/`).

Si aucun arg fourni, demander le nom à l'utilisateur.

Exécuter dans l'ordre :

1. **Créer l'issue GitHub**
   - Demander : "Décris la feature en une phrase (pour l'issue GitHub)"
   - Déduire ou demander exactement une phase : `phase: predeploy` ou `phase: postdeploy`.
   - Déduire un ou plusieurs domaines autorisés : `domain: frontend`, `domain: backend`, `domain: ai`.
     `packages/shared` appartient à `domain: backend`.
   - Si la phase ou le domaine est ambigu, demander avant de créer l'issue.
   - Créer l'issue avec `gh issue create`, les labels `type: feature`, phase et domaine, puis
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
   git checkout -b feature/<numéro>-<args>
   ```

   Exemple : issue #29 + args "inventory-consumption" → `feature/29-inventory-consumption`

5. **Confirmer à l'utilisateur :**

   ```
   ✅ Issue #<numéro> créée — assignée à AdamDjo, ajoutée au Scrum Board
   ✅ Branche 'feature/<numéro>-<args>' créée depuis develop

   Workflow :
   1. Code, commits avec : git commit -m "feat(<scope>): <description>"
   2. Quand prêt : /pr pour pousser et ouvrir la PR → develop (Closes #<numéro>)

   Format commit :
   feat | fix | chore | docs | refactor | test
   Pas de Co-Authored-By Codex
   ```
