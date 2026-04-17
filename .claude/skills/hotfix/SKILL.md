---
name: hotfix
description: Crée une branche hotfix depuis main pour un fix urgent en production. Usage: /hotfix <nom> — ex: /hotfix fix-auth-crash
allowed-tools: Bash, mcp__github__create_issue
---

L'utilisateur veut corriger un bug urgent en production. Les args sont le nom du hotfix (sans le préfixe `hotfix/`).

Si aucun arg fourni, demander le nom et la description du problème.

Exécuter dans l'ordre :

1. **Créer une issue GitHub pour tracer le hotfix**
   - Demander : "Décris le problème en production en une phrase"
   - Créer l'issue via mcp__github__create_issue avec :
     - owner: AdamDjo, repo: EpisodeRPG-game
     - labels: ["bug", "priority"]
     - title: "hotfix: <description>"
   - Noter le numéro de l'issue créée

2. **Partir de main (pas develop — c'est urgent)**
   ```bash
   git checkout main && git pull origin main
   ```

3. **Créer la branche hotfix**
   ```bash
   git checkout -b hotfix/<args>
   ```

4. **Confirmer à l'utilisateur :**
   ```
   ⚠️  HOTFIX — tu pars de main (production)

   ✅ Issue #<numéro> créée (priority)
   ✅ Branche 'hotfix/<args>' créée depuis main

   Workflow :
   1. Corrige le bug, commite avec : git commit -m "fix(<scope>): <description>"
   2. Quand prêt : /pr pour pousser et ouvrir la PR → main (Closes #<numéro>)
   3. Après merge dans main : /sync pour ramener le fix dans develop
   ```
