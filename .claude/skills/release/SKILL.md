---
name: release
description: Crée et pousse une branche release/X.Y.Z depuis develop. Déclenche le CI + tag + GitHub Release automatiquement. Usage: /release <version> — ex: /release 1.2.3
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

4. **Créer et pousser la branche release**
   ```bash
   git checkout -b release/<version>
   git push origin release/<version>
   ```

5. **Confirmer à l'utilisateur :**
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
