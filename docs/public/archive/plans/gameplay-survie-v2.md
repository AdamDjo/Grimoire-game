# Plan — Gameplay Survie v2 (tension + synergie rétention)

> Issu du grilling du 2026-07-21. 11 décisions validées.
> Répartition : **Claude = backend + shared** (worktree `-claude`). **Codex = tout l'UI** (main folder, on n'y touche pas).
> Règle absolue : le canon `docs/public/raw/*.md` précède le code. Ticket #0 met le canon à jour AVANT toute implémentation.

---

## Les 3 bugs/manques de départ (rappel)

1. **On ne meurt jamais** → seuls `combat`/`flee` en échec retirent des PV ([consequences.ts:107](apps/backend/src/game-rules/consequences.ts)). Aucune condition (poison, fièvre, blessure) n'existe. Calamine jamais alimentée.
2. **La blade disparaît** → `updatedInventory: []` codé en dur ([session.service.ts:434](apps/backend/src/services/session.service.ts)). Inventaire jamais persisté.
3. **Jauges trop molles / pas de tension** → drain lent (intentionnel canon), mais rien ne pèse mécaniquement, calamine morte.

**Diagnostic UI bonus** : le HUD affiche `attributes.breath`/`ash` en **barres** alors que ce sont des scores fixes ; et les PV existent mais sont nommés "Blood" (collision avec l'attribut SANG). → réglé côté Codex.

---

## Les 11 décisions actées

| #   | Décision                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Moteur de conséquences riche **d'abord**, danger IA ensuite                                                                                            |
| 2   | Conditions **hybride strict** : mécaniques/seuil = backend seul / narratives = IA propose `applyCondition` + backend valide (whitelist + plausibilité) |
| 3   | Effets **complets** : dégâts/tour + malus au d20 via **Désavantage** (canon `08-DICE §5`), pas de malus plat                                           |
| 4   | HUD = **jauges variables seulement** (PV clair + soif/faim/fatigue/calamine) ; attributs → fiche perso ; **UI = ticket Codex**                         |
| 5   | Calamine **vivante** : sources narratives canon validées dès maintenant (`applyCondition`) ; artefact = plus tard ; **pas de drain passif**            |
| 6   | Inventaire = **acquisition + usage/équipement** (`itemGained`, consommer, équiper, `ItemEffect`) ; pas d'économie                                      |
| 7   | Soin = consommables + **action de repos** (court/feu, taux canon `06 §3`) ; risque de repos différé                                                    |
| 8   | Danger IA = **(a) prompt musclé** cette passe ; acte-backend = ticket futur                                                                            |
| 9   | **Découpage par système**, ordonné par dépendance                                                                                                      |
| 10  | **Ticket #0 Canon** en tout premier                                                                                                                    |
| 11  | **Fil rouge synergie** : chaque mécanique nourrit la Chronique/Souvenirs existants + fin spéciale Calciné                                              |

**État rétention (audité) :** Chronique ✅ complète (back+front), Souvenirs ✅ complets, méta-monde évolutif ❌ (hors périmètre). On ne refait rien de la rétention — on la **branche** aux nouvelles mécaniques.

---

## Les tickets (ordre = dépendances)

Chaque ticket : 1 issue GitHub → 1 branche depuis `develop` → 1 PR vers `develop`. Tickets Claude = backend/shared. Ticket final = Codex/UI.

---

### 🎯 Ticket #0 — Canon : graver la survie v2

**Objectif** : mettre à jour les `.md` pour que le code s'appuie sur un canon stable.

**Fichiers** :

- `docs/public/raw/06-SURVIVAL.md` §2 → marquer chaque condition **[BACKEND]** (mécanique/seuil) ou **[IA-PROPOSÉE]** (narrative/environnementale). §4 → lister explicitement les sources narratives de Calamine autorisées (lumière archontique, magie excessive, contact corrompu, Veilleurs). §3 → figer les taux de repos exacts.
- `docs/public/raw/08-DICE-RESOLUTION.md` §5 → confirmer que les conditions sévères imposent **Désavantage** (déjà écrit ; on le rend normatif pour le moteur).
- `docs/public/raw/11-INVENTORY-ECONOMY.md` → noter le périmètre v2 (acquisition + usage, pas d'économie).
- `docs/public/raw/15-GAME-MASTER.md` → documenter le **contrat des champs IA** : `applyCondition`, `itemGained` (schéma, whitelist, règles de validation).
- `docs/public/raw/09-ACTION-LOOP.md` §7 → ajouter la **fin spéciale Calciné** comme `endReason` distinct.

**Pas de code.** PR canon-only.

---

### 🧱 Ticket #1 — Shared : contrats & types

**Objectif** : figer le contrat avant toute implémentation (débloque tout le reste).

**Fichiers** `packages/shared/src/` :

- `types/character.types.ts` → ajouter `ActiveCondition` (id, type, source, appliedAtTurn, expiresRule) et l'inclure dans le state perso.
- `types/inventory.types.ts` → contrat `itemGained` (l'objet que l'IA signale).
- `types/scene.types.ts` → étendre la réponse IA : `applyCondition?`, `itemGained?`, `restRequested?`.
- Nouveau `constants/conditions.ts` → table canon des conditions (effet, dégâts/tour, désavantage O/N, famille backend|ia, soin).
- `index.ts` → réexports.

**Tests** : `type-check --filter shared`.

**PR** → develop.

---

### ⚔️ Ticket #2 — Conditions + malus d20 (le cœur de la tension)

**Objectif** : les conditions existent, persistent, et **pèsent** (dégâts/tour + Désavantage).

**Fichiers** `apps/backend/src/` :

- `game-rules/conditions.ts` (nouveau) → applique/tick/retire les conditions ; famille BACKEND appliquée par seuils (fièvre si faim/soif=0, blessure si PV≤seuil).
- `game-rules/dice.ts` → intégrer **Désavantage** (2d20 garder le pire) quand une condition sévère est active (canon `08 §5`).
- `game-rules/consequences.ts` → brancher le tick des conditions par tour ; famille IA-PROPOSÉE validée ici (whitelist + plausibilité biome/contexte) avant application.
- `ai/scene-validator.ts` → accepter/valider `applyCondition`.
- `ai/system-prompt.ts` → expliquer à l'IA quand proposer une condition narrative.
- `services/session.service.ts` → persister les conditions actives (schéma Prisma : champ JSON `activeConditions` sur Character, migration via MCP Supabase).
- **Fil rouge** : mort par condition → `endReason` correct pour la Chronique.

**Tests** : `conditions.test.ts`, `dice.test.ts` (désavantage), `consequences.test.ts` (tick + validation IA).

**PR** → develop.

---

### 🔮 Ticket #3 — Calamine vivante

**Objectif** : la Calamine monte (sources narratives canon), applique ses paliers, et tue à 100 (fin Calciné).

**Fichiers** :

- `game-rules/consequences.ts` / `conditions.ts` → paliers Calamine (Stade 1/2/3), delta via `applyCondition` validé.
- `services/session.service.ts` → à 100 → `endReason='calcined'`, fin de run + Chronique fin spéciale.
- `ai/system-prompt.ts` → sources autorisées.
- **Fil rouge** : `endReason='calcined'` → Chronicle sait le raconter (« Tu es devenu ce que tu chassais »).

**Tests** : paliers, transformation à 100, validation source.

**PR** → develop.

---

### 🎒 Ticket #4 — Inventaire : acquisition + usage (répare le bug #2)

**Objectif** : la blade apparaît, s'équipe, se consomme, applique ses effets.

**Fichiers** :

- Schéma Prisma → persistance inventaire (migration MCP Supabase).
- `services/inventory.service.ts` (nouveau) → acquisition (`itemGained` validé), consommation (`ItemEffect`: heal, calamineReduction, retire condition), équipement (slots canon `11 §1`).
- `ai/scene-validator.ts` → valider `itemGained`.
- `services/session.service.ts` → remplacer `updatedInventory: []` par le vrai état ; exposer les 4 catégories canon (équipement/sac/artefact/trousseau) que le front connaît déjà (`velkhar-inventory-model.ts`).
- **Fil rouge** : fournit les **moyens de soin** des conditions du #2 (antidote, gourde, bandage).

**Tests** : acquisition, sac plein, consommation d'effets, équipement.

**PR** → develop.

---

### 🛌 Ticket #5 — Repos (referme la boucle de survie)

**Objectif** : action de repos (court/feu) résolue backend aux taux canon.

**Fichiers** :

- `game-rules/rest.ts` (nouveau) → court (+~20% fatigue), feu (+~60% fatigue/faim/soif, −10 calamine) — canon `06 §3`.
- `ai/scene-validator.ts` + `system-prompt.ts` → l'IA propose le repos comme choix (`restRequested`).
- `services/session.service.ts` → applique le repos, narre la scène calme.
- Risque de repos (embuscade) = **différé**.

**Tests** : taux de récupération, clamp, −10 calamine au feu.

**PR** → develop.

---

### 📣 Ticket #6 — Prompt danger (crescendo, sans état d'acte)

**Objectif** : l'IA génère assez de danger physique, monte les enjeux au fil du run.

**Fichiers** :

- `ai/system-prompt.ts` → varier l'intensité, pivots physiques réguliers (combat/flee/sauvegarde), enjeux qui montent. **Sans** état d'acte persisté.
- Acte-backend calculé = **ticket futur** (backlog).

**Tests** : n/a (prompt) — vérif manuelle en session.

**PR** → develop.

---

### 🎨 Ticket #7 — UI (CODEX, main folder — pas Claude)

**Objectif** : refléter les nouvelles données. Décrit le contrat exposé par le backend (les tickets #1-#5).

**Périmètre** (à passer à Codex) :

- HUD : **jauges variables seulement** (PV clairement nommé + soif/faim/fatigue/calamine). Attributs SANG/SOUFFLE/CENDRE **sortis du HUD** → fiche perso, en scores fixes (chiffre + modificateur), plus de barres.
- Affichage des **conditions actives** (icônes + tooltip effet).
- Panneau **inventaire** rempli (4 catégories canon) + actions consommer/équiper.
- Indicateur **Désavantage** sur l'encart de dé quand une condition l'impose.
- Écran de fin **Calciné** (réutilise `ChronicleEndExperience`).

**Contrat backend fourni** : `hp/maxHp`, `activeConditions[]`, `inventory` (4 catégories), `endReason` incluant `calcined`.

---

## Ordre de livraison

```
#0 Canon (docs) ──► #1 Shared ──► #2 Conditions ──► #3 Calamine
                                        │
                                        ├──► #4 Inventaire ──► #5 Repos
                                        │
                                        └──► #6 Prompt danger
                                              │
                                              └──► #7 UI (Codex, parallèle possible dès #1 figé)
```

Fil rouge synergie (#11) intégré dans #2, #3, #4.
Méta-monde évolutif (crochet 3) = **hors périmètre**, chantier futur.
