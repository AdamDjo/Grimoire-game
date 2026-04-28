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
   - `chore/*` → cible : `develop`
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

7. **Déterminer les labels selon le préfixe de branche (nomenclature avec préfixe catégorie) :**
   - `feature/*phase-1a*` ou fichiers dans `apps/frontend/` → `["phase: 1a", "domain: frontend"]`
   - `feature/*phase-1b*` ou fichiers dans `apps/backend/` → `["phase: 1b", "domain: backend"]`
   - `feature/*phase-2b*` → `["phase: 2b"]`
   - `feature/*phase-2*` → `["phase: 2"]`
   - `feature/*phase-3*` → `["phase: 3"]`
   - `fix/*` → `["type: bug"]`
   - `hotfix/*` → `["type: bug", "priority: high"]`
   - `chore/*` → `["type: chore"]`
   - `release/*` → `["type: release"]`
   - Ajouter `domain: devops` si les fichiers modifiés sont dans `.github/`
   - Ajouter `domain: shared` si les fichiers modifiés sont dans `packages/`

8. **Créer la PR via mcp**github**create_pull_request**
   - owner: `AdamDjo`
   - repo: `Grimoire-game`
   - head: branche courante
   - base: cible déterminée à l'étape 3
   - assignees: `["AdamDjo"]`
   - reviewers: `["AdamDjo"]` — TOUJOURS assigner AdamDjo comme reviewer

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

   # Assigner le milestone selon le pattern de branche (même logique que pr.yml)
   # feature/*phase-1a* → "Phase 1A - Frontend UI"
   # feature/*phase-1b* → "Phase 1B - Backend Foundation"
   # feature/*phase-2b* → "Phase 2B - Multi-Universe"
   # feature/*phase-2* → "Phase 2 - MVP"
   # feature/*phase-3* → "Phase 3 - Polish & UGC"
   MILESTONE_NUMBER=$(gh api repos/AdamDjo/Grimoire-game/milestones --jq '.[] | select(.title == "<MILESTONE_TITLE>") | .number')
   gh api repos/AdamDjo/Grimoire-game/issues/<PR_NUMBER> --method PATCH --field milestone=$MILESTONE_NUMBER
   ```

10. **Confirmer à l'utilisateur avec l'URL de la PR**
    - Indiquer : assignee ✅, reviewer ✅, project ✅, milestone ✅ (ou "pas de milestone pour cette branche")
