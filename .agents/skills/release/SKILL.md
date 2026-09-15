---
name: release
description: "Crée et pousse une branche release/X.Y.Z depuis develop. Déclenche le CI, le tag et la GitHub Release. Usage : /release version, par exemple /release 1.2.3."
allowed-tools: Bash
---

L'utilisateur veut créer une release. Les args sont le numéro de version (ex: `1.2.3` ou `0.1.0`).

Si aucun arg fourni, demander la version souhaitée.

Exécuter dans l'ordre :

1. **Valider le format semver**
   - Le format doit être X.Y.Z (chiffres uniquement, pas de 'v' nécessaire)
   - Si format invalide, afficher une erreur et arrêter

2. **Vérifier que develop est propre**

   ```bash
   git status --short
   ```

   - S'il y a des fichiers non commités, alerter l'utilisateur et arrêter

3. **Mettre develop à jour**

   ```bash
   git checkout develop && git pull origin develop
   ```

4. **Créer la branche release**

   ```bash
   git checkout -b release/<version>
   ```

5. **Bumper les versions des workspaces** (étape manuelle — le workflow ne le fait pas)

   `release.yml` lit la version **depuis le nom de la branche**, jamais depuis les
   `package.json`. Sans ce bump, le tag et la GitHub Release sortent corrects mais le
   code mergé dans `main` se déclare encore à la version précédente, et la sync
   post-merge (qui porte `apps/*/package.json` depuis `main`) devient un no-op silencieux.

   Passer ces 3 fichiers en `<version>` — et eux seuls :

   ```
   apps/backend/package.json
   apps/frontend/package.json
   packages/shared/package.json
   ```

   Le `package.json` racine n'a pas de champ `version` (workspace privé) : ne pas y toucher.
   `pnpm-lock.yaml` n'a pas besoin d'être régénéré (workspaces privés, non versionnés).

   ```bash
   git commit -am "chore(release): bump les workspaces en <version>"
   ```

6. **Pousser la branche release**

   ```bash
   git push origin release/<version>
   ```

7. **Confirmer à l'utilisateur :**

   ```
   ✅ release/<version> créée et poussée

   GitHub Actions va automatiquement :
   1. Lancer lint + type-check + build
   2. Créer le tag v<version>
   3. Publier la GitHub Release avec changelog auto
   4. Ouvrir une PR release/<version> → main

   👉 Va sur GitHub pour :
   - Suivre le workflow : Actions → Release
   - Review et merger la PR → main quand le CI est vert

   Après le merge dans main, lance : /sync
   ```
