---
name: bug
description: Crée une issue GitHub puis une branche fix depuis develop avec le numéro d'issue. Usage: /bug <nom> — ex: /bug login-crash
allowed-tools: Bash, mcp__github__create_issue
---

L'utilisateur veut corriger un bug. Les args sont le nom de la branche (sans le préfixe `fix/`).

Si aucun arg fourni, demander le nom et la description du bug.

Exécuter dans l'ordre :

1. **Créer l'issue GitHub**
   - Demander : "Décris le bug en une phrase (pour l'issue GitHub)"
   - Créer l'issue via mcp**github**create_issue avec :
     - owner: AdamDjo, repo: EpisodeRPG-game
     - labels: ["bug"]
     - title: "fix(<args>): <description du bug>"
   - Noter le numéro de l'issue créée → `<numéro>`

2. **Mettre develop à jour**

   ```bash
   git checkout develop && git pull origin develop
   ```

3. **Créer la branche avec le numéro d'issue**

   ```bash
   git checkout -b fix/<numéro>-<args>
   ```

   Exemple : issue #30 + args "login-crash" → `fix/30-login-crash`

4. **Confirmer à l'utilisateur :**

   ```
   ✅ Issue #<numéro> créée
   ✅ Branche 'fix/<numéro>-<args>' créée depuis develop

   Workflow :
   1. Corrige le bug, commite avec : git commit -m "fix(<scope>): <description>"
   2. Quand prêt : /pr pour pousser et ouvrir la PR → develop (Closes #<numéro>)
   ```
