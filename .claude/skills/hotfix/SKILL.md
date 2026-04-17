---
name: hotfix
description: Crée une issue GitHub puis une branche hotfix depuis main avec le numéro d'issue. Usage: /hotfix <nom> — ex: /hotfix auth-crash
allowed-tools: Bash, mcp__github__create_issue
---

L'utilisateur veut corriger un bug urgent en production. Les args sont le nom du hotfix (sans le préfixe `hotfix/`).

Si aucun arg fourni, demander le nom et la description du problème.

Exécuter dans l'ordre :

1. **Créer l'issue GitHub**
   - Demander : "Décris le problème en production en une phrase"
   - Créer l'issue via mcp**github**create_issue avec :
     - owner: AdamDjo, repo: Grimoire-game
     - labels: ["bug", "priority"]
     - title: "hotfix(<args>): <description>"
   - Noter le numéro de l'issue créée → `<numéro>`

2. **Partir de main (pas develop — c'est urgent)**

   ```bash
   git checkout main && git pull origin main
   ```

3. **Créer la branche hotfix avec le numéro d'issue**

   ```bash
   git checkout -b hotfix/<numéro>-<args>
   ```

   Exemple : issue #31 + args "auth-crash" → `hotfix/31-auth-crash`

4. **Confirmer à l'utilisateur :**

   ```
   ⚠️  HOTFIX — tu pars de main (production)

   ✅ Issue #<numéro> créée (priority)
   ✅ Branche 'hotfix/<numéro>-<args>' créée depuis main

   Workflow :
   1. Corrige le bug, commite avec : git commit -m "fix(<scope>): <description>"
   2. Quand prêt : /pr pour pousser et ouvrir la PR → main (Closes #<numéro>)
   3. Après merge dans main : /sync pour ramener le fix dans develop
   ```
