---
name: pr
description: Pousse la branche courante et ouvre une PR vers la bonne cible. Extrait le numéro d'issue du nom de branche automatiquement.
allowed-tools: Bash, mcp__github__create_pull_request
---

L'utilisateur veut pousser sa branche courante et ouvrir une PR.

Exécuter dans l'ordre :

1. **Récupérer le contexte**

   ```bash
   git rev-parse --abbrev-ref HEAD
   git log origin/develop..HEAD --oneline 2>/dev/null || git log origin/main..HEAD --oneline
   git status --short
   ```

2. **Vérifier qu'il n'y a pas de fichiers non commités**
   - Si oui, alerter et demander si l'utilisateur veut continuer quand même

3. **Déterminer la branche cible selon le préfixe :**
   - `feature/*` → cible : `develop`
   - `fix/*` → cible : `develop`
   - `hotfix/*` → cible : `main`
   - `release/*` → cible : `main`

4. **Extraire le numéro d'issue du nom de branche**
   - Le nom de branche suit le pattern : `<préfixe>/<numéro>-<description>`
   - Exemple : `feature/29-phase-1a-landing-page` → issue #29
   - Exemple : `fix/30-login-crash` → issue #30
   - Si pas de numéro détecté, demander : "Il y a un numéro d'issue à fermer ? (ou entrée pour passer)"

5. **Pousser la branche**

   ```bash
   git push origin <branche-courante>
   ```

6. **Préparer le titre et le body de la PR**
   - Titre : basé sur le nom de la branche et les commits
   - Body :

     ```
     ## Summary
     <liste des changements principaux>

     ## Test plan
     - [ ] lint + type-check passent
     - [ ] Tests unitaires passent
     - [ ] Testé en local

     Closes #<numéro issue>
     ```

7. **Déterminer les labels selon le préfixe de branche :**
   - `feature/*phase-1a*` → `["frontend", "phase-1a"]`
   - `feature/*phase-1b*` → `["backend", "phase-1b"]`
   - `feature/*phase-2*` → `["frontend", "backend", "phase-2"]`
   - `fix/*` → `["bug"]`
   - `hotfix/*` → `["bug", "priority"]`
   - `release/*` → `["release"]`

8. **Créer la PR via mcp**github**create_pull_request**
   - owner: AdamDjo
   - repo: Grimoire-game
   - head: branche courante
   - base: cible déterminée à l'étape 3

9. **Confirmer à l'utilisateur avec l'URL de la PR**
