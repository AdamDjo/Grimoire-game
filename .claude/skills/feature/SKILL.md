---
name: feature
description: Crée une issue GitHub puis une branche feature depuis develop avec le numéro d'issue. Usage: /feature <nom> — ex: /feature phase-1a-landing-page
allowed-tools: Bash, mcp__github__create_issue
---

L'utilisateur veut démarrer une nouvelle feature. Les args sont le nom de la branche (sans le préfixe `feature/`).

Si aucun arg fourni, demander le nom à l'utilisateur.

Exécuter dans l'ordre :

1. **Créer l'issue GitHub**
   - Demander : "Décris la feature en une phrase (pour l'issue GitHub)"
   - Déduire les labels depuis le nom de branche (nomenclature avec préfixe catégorie) :
     - `*phase-1a*` → `["type: chore", "phase: 1a", "domain: frontend"]`
     - `*phase-1b*` → `["type: chore", "phase: 1b", "domain: backend"]`
     - `*phase-2b*` → `["type: chore", "phase: 2b"]`
     - `*phase-2*` → `["type: chore", "phase: 2"]`
     - `*phase-3*` → `["type: chore", "phase: 3"]`
     - Sinon → `["type: chore"]`
   - Créer l'issue via mcp**github**create_issue avec :
     - owner: AdamDjo, repo: Grimoire-game
     - title: "feat: <description>"
     - labels déduits ci-dessus
     - assignees: ["AdamDjo"]
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

   Exemple : issue #29 + args "phase-1a-landing-page" → `feature/29-phase-1a-landing-page`

5. **Confirmer à l'utilisateur :**

   ```
   ✅ Issue #<numéro> créée — assignée à AdamDjo, ajoutée au Scrum Board
   ✅ Branche 'feature/<numéro>-<args>' créée depuis develop

   Workflow :
   1. Code, commits avec : git commit -m "feat(<scope>): <description>"
   2. Quand prêt : /pr pour pousser et ouvrir la PR → develop (Closes #<numéro>)

   Format commit :
   feat | fix | chore | docs | refactor | test
   Pas de Co-Authored-By Claude
   ```
