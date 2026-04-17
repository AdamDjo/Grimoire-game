---
name: feature
description: Crée une branche feature depuis develop. Usage: /feature <nom> — ex: /feature phase-1a-landing-page
allowed-tools: Bash, mcp__github__create_issue
---

L'utilisateur veut démarrer une nouvelle feature. Les args sont le nom de la branche (sans le préfixe `feature/`).

Si aucun arg fourni, demander le nom à l'utilisateur.

Exécuter dans l'ordre :

1. **Vérifier s'il y a une issue GitHub**
   - Demander : "Il y a un numéro d'issue GitHub pour cette feature ? (numéro ou entrée pour passer)"
   - Si oui, noter le numéro pour l'utiliser dans les commits et la PR

2. **Mettre develop à jour**
   ```bash
   git checkout develop && git pull origin develop
   ```

3. **Créer la branche**
   ```bash
   git checkout -b feature/<args>
   ```

4. **Confirmer à l'utilisateur :**
   ```
   ✅ Branche 'feature/<args>' créée depuis develop

   Tu es maintenant sur : feature/<args>

   Workflow :
   1. Code, commits avec : git commit -m "feat(<scope>): <description>"
   2. Quand prêt : /pr pour pousser et ouvrir la PR → develop

   Format commit :
   feat | fix | chore | docs | refactor | test
   Pas de Co-Authored-By Claude
   ```
