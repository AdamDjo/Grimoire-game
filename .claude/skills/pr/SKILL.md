---
name: pr
description: Pousse la branche courante et ouvre une PR vers la bonne cible (develop pour feature/fix, main pour hotfix/release). Crée l'issue si elle n'existe pas.
allowed-tools: Bash, mcp__github__create_pull_request, mcp__github__create_issue
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

4. **Pousser la branche**
   ```bash
   git push origin <branche-courante>
   ```

5. **Préparer le titre et le body de la PR**
   - Titre : basé sur le nom de la branche et les commits
   - Body : utiliser le template suivant (sans Co-Authored-By Claude) :
     ```
     ## Summary
     <liste des changements principaux>

     ## Test plan
     - [ ] lint + type-check passent
     - [ ] Tests unitaires passent
     - [ ] Testé en local

     Closes #<numéro issue si connu>
     ```
   - Demander à l'utilisateur : "Il y a un numéro d'issue à fermer ? (ou entrée pour passer)"

6. **Déterminer les labels selon le préfixe de branche :**
   - `feature/phase-1a-*` → `["frontend", "phase-1a"]`
   - `feature/phase-1b-*` → `["backend", "phase-1b"]`
   - `fix/*` → `["bug"]`
   - `hotfix/*` → `["bug", "priority"]`
   - `release/*` → `["release"]`

7. **Créer la PR via mcp__github__create_pull_request**
   - owner: AdamDjo
   - repo: EpisodeRPG-game
   - head: branche courante
   - base: cible déterminée à l'étape 3

8. **Confirmer à l'utilisateur avec l'URL de la PR**
