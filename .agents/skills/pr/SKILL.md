---
name: pr
description: "Pousse la branche courante et ouvre une PR vers la bonne cible. Extrait le numéro d'issue du nom de branche automatiquement."
allowed-tools: Bash
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
   - `chore/*` → cible : `develop`
   - `hotfix/*` → cible : `main`
   - `release/*` → cible : `main`

4. **Extraire le numéro d'issue du nom de branche**
   - Le nom de branche suit le pattern : `<préfixe>/<numéro>-<description>`
   - Exemple : `feature/29-inventory-consumption` → issue #29
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
     ## Résumé
     <liste des changements principaux>

     ## Phase et domaine
     - **Phase** : <phase exacte reprise depuis l'issue>
     - **Domaine** : <domaines exacts repris depuis l'issue et le diff>
     - **Propriétaire** : <agent réellement assigné + domaine>

     ## Current-state
     <paires STATUS/NEXT mises à jour, ou exception cochée et justifiée>

     ## Tests
     <commandes exécutées>

     Closes #<numéro issue>
     ```

7. **Déterminer les labels depuis l'issue et le diff :**
   - Reprendre depuis l'issue liée exactement une phase : `phase: predeploy` ou `phase: postdeploy`.
   - Fichiers dans `apps/frontend/` → `domain: frontend`.
   - Fichiers dans `apps/backend/` ou `packages/shared/` → `domain: backend`.
   - Fichiers d'orchestration/prompt/provider IA → ajouter `domain: ai`.
   - `fix/*` → `["type: bug"]`
   - `hotfix/*` → `["type: bug", "priority: high"]`
   - `chore/*` → `["type: chore"]`
   - `release/*` → `["type: release"]`
   - Ne jamais recréer un ancien label de phase ou les domaines `shared`, `database`, `devops`.

8. **Créer la PR via `gh pr create`**
   - owner: `AdamDjo`
   - repo: `Grimoire-game`
   - head: branche courante
   - base: cible déterminée à l'étape 3
   - assignees: `["AdamDjo"]`
   - reviewers: `["AdamDjo"]` — TOUJOURS assigner AdamDjo comme reviewer
   - passer tous les labels calculés avec `--label` ; la ligne `Phase` du body doit contenir
     exactement la même phase pour la CI et le milestone

9. **Assigner la PR au projet Scrum Board et au milestone via CLI**

   ```bash
   # Récupérer le node_id de la PR
   PR_NODE_ID=$(gh api repos/AdamDjo/Grimoire-game/pulls/<PR_NUMBER> --jq '.node_id')

   # Ajouter au projet Scrum Board (Projects V2)
   gh api graphql -f query='
   mutation {
     addProjectV2ItemById(input: {
       projectId: "PVT_kwHOAacnj84BU6rS"
       contentId: "'$PR_NODE_ID'"
     }) {
       item { id }
     }
   }'

   # Une issue `phase: predeploy` utilise le milestone "v0.1.0 - Première version jouable".
   # Une issue `phase: postdeploy` n'a pas de milestone V1.
   ```

10. **Confirmer à l'utilisateur avec l'URL de la PR**
    - Indiquer : assignee ✅, reviewer ✅, project ✅, milestone ✅ (ou "pas de milestone pour cette branche")
