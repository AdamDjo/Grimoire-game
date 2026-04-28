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
   - Demander : "Quels labels ? (ex: frontend, backend, phase-1a, phase-1b...)"
   - Créer l'issue via mcp**github**create_issue avec :
     - owner: AdamDjo, repo: Grimoire-game
     - title: "feat(<args>): <description>"
     - labels fournis par l'utilisateur
   - Noter le numéro de l'issue créée → `<numéro>`

2. **Mettre develop à jour**

   ```bash
   git checkout develop && git pull origin develop
   ```

3. **Créer la branche avec le numéro d'issue**

   ```bash
   git checkout -b feature/<numéro>-<args>
   ```

   Exemple : issue #29 + args "phase-1a-landing-page" → `feature/29-phase-1a-landing-page`

4. **Confirmer à l'utilisateur :**

   ```
   ✅ Issue #<numéro> créée
   ✅ Branche 'feature/<numéro>-<args>' créée depuis develop

   Workflow :
   1. Code, commits avec : git commit -m "feat(<scope>): <description>"
   2. Quand prêt : /pr pour pousser et ouvrir la PR → develop (Closes #<numéro>)

   Format commit :
   feat | fix | chore | docs | refactor | test
   Pas de Co-Authored-By Claude
   ```
