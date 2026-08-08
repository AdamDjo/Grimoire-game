# Plan — Correction audit thermo-nucléaire backend (2026-07-24)

> Issu de la revue `/thermo-nuclear-code-quality-review` sur l'ensemble d'`apps/backend` (pas juste
> le diff de branche), demandée le 2026-07-24. 16 findings — 0 régression bloquante, 3 zones de
> dette structurelle concentrée + 1 bug de localisation confirmé + 2 fichiers `CLAUDE.md` obsolètes.
> Répartition : **100% Claude = backend + shared** (worktree `-claude`). Aucun ticket frontend.
> Règle absolue : chaque ticket = 1 issue GitHub → 1 branche depuis `develop` → 1 PR vers `develop`.
> Tests + type-check + lint doivent rester verts à chaque PR (pas de baisse de couverture).

---

## Constat de départ (rappel)

Revue menée par 5 sous-agents parallèles (session.service.ts seul, reste de services/, game-rules/
entier, ai+routes+middleware+config) plus relecture directe de `survival.ts`, `consequences.ts`,
`conditions.ts` et `apps/backend/CLAUDE.md`. Verdict : **REQUEST CHANGES** — aucune régression, mais
dette réelle concentrée sur `resolveChoice` (consequences.ts) et sur la duplication cross-fichiers
(validation Zod, mappers DTO, scaffolds IA). Un bug de localisation confirmé dans l'Aveugle. Deux
`CLAUDE.md` documentent une architecture qui n'existe plus.

**Fichiers sains, aucune action requise** : `game-rules/survival.ts` (hors `gaugeTier`, voir #4),
`game-rules/dice.ts`, `services/scene-assembler.ts`, `ai/game-master.service.ts`,
`middleware/auth.middleware.ts`, `config/env.ts`.

---

## Les tickets (ordre = dépendances)

### 🎯 Ticket #1 — `resolveChoice` : unifier mort/mourant + extraire l'orchestration neglect→Calamine

**Pourquoi en premier** : c'est l'épicentre de l'audit (4 findings liés) et la seule zone où la
duplication a déjà produit une **divergence de comportement réelle**, pas juste de la
répétition cosmétique.

**Fichiers** : `apps/backend/src/game-rules/consequences.ts`, `apps/backend/src/game-rules/survival.ts`

**Contenu** :

1. Unifier les deux sites `resolveDying` → `gameOver`/`dying` (lignes ~160-169 et ~210-218). Le
   chemin "condition létale" doit lui aussi passer par `applyBackendConditions`/`clearDyingOnHeal`
   — vérifier d'abord avec le canon (`06-SURVIVAL.md §7`) si le silence actuel est un bug ou un
   choix voulu (un décès par condition doit-il aussi timbrer `wound` ?).
2. Extraire l'orchestration neglect→Calamine (drain → érosion → tick streak → roll conditionnel →
   clamp conditionnel, lignes ~120-136) en une fonction composite exportée depuis `survival.ts`
   (ex. `applyNeglectAndCalamine(stats, rng)`), réutilisant `applyCalamineDelta`/`clampCalamineDelta`
   de `conditions.ts` au lieu de la variante inline non cappée par `CALAMINE_DELTA_CAP`.
3. Remplacer le diff `survivalChanges` recalculé/fusionné 3× par un calcul unique de snapshot
   avant/après en fin de fonction (avant-état capturé au début, delta calculé une seule fois).
4. Simplifier le chaînage de 6 variables renommées (`drained → eroded → neglectTracked → ...`) —
   conséquence naturelle des points 2 et 3.

**Non-régression** : tests existants `consequences.test.ts` doivent rester verts sans modification
de leurs assertions (comportement identique, structure interne seulement).

---

### 🎯 Ticket #2 — Middleware de validation Zod partagé

**Fichiers** : nouveau `apps/backend/src/middleware/validate.middleware.ts` ; puis
`routes/game.routes.ts` (5 sites), `routes/aveugle.routes.ts` (2 sites, dont la variante params+body),
`routes/character.routes.ts` (1 site).

**Contenu** : middleware `validateBody(schema)` / `validateParams(schema)` qui fait le
`safeParse` + formatage `issues.map(...).join('; ')` + réponse `{success:false, error}` en 400,
une seule fois. Remplace les 8 blocs copiés-collés. La variante `aveugle.routes.ts` (parse params

- body en parallèle) devient un cas d'usage normal du même middleware, pas un bricolage à part.

---

### 🎯 Ticket #3 — Générique `validateAiOutput<T>` pour les validateurs IA

**Fichiers** : nouveau `apps/backend/src/ai/validate.ts` ; puis `ai/scene-validator.ts`,
`ai/compression-validator.ts`, `ai/chronicle-validator.ts`, `ai/aveugle-validator.ts`.

**Contenu** : `AveugleValidationResult<T>` est déjà générique — le promouvoir en
`AiValidationResult<T>` partagé, et remplacer les 5 implémentations du pattern
safeParse-et-report par un seul `validateAiOutput<T>(schema, raw): AiValidationResult<T>` réutilisé
partout. ~35 lignes dupliquées → ~8 lignes.

---

### 🎯 Ticket #4 — Mapper Souvenir unique + `clamp` partagé + tiers de jauge unifiés

Trois nettoyages indépendants mais de faible risque, groupés dans un seul ticket pour éviter
l'accumulation de mini-PRs.

**4a. Mapper Souvenir** (`services/souvenir.service.ts` : ajouter `toSouvenirDto(row): Souvenir`,
puis réutiliser dans `routes/souvenir.routes.ts`, `routes/aveugle.routes.ts`,
`services/aveugle.service.ts::getAveugleHubState`). Supprime les 3 copies du cast
`type: s.type as SouvenirType` non validé.

**4b. `clamp` partagé** (nouveau helper unique dans `game-rules/` — ex. `game-rules/clamp.ts` ou
promu dans `@grimoire/shared` si le display frontend en a l'usage). Remplace les 4 copies
verbatim (`survival.ts`, `conditions.ts`, `consequences.ts`, `inventory.ts`) et fait de
`clampGauge` un simple appel à ce helper au lieu d'une 5ᵉ réimplémentation.

**4c. `gaugeTier` / `calamineTier`** — vérifier si un `tierFromThresholds(value, thresholds)`
générique est justifié (les deux ladders ont un sens directionnel différent — jauges descendent
vers le danger, Calamine monte vers le danger — donc ne PAS forcer une fausse unification si ça
complique la lecture ; documenter explicitement l'intention si on garde les deux fonctions
séparées).

**Fichiers** : `game-rules/survival.ts`, `game-rules/conditions.ts`, `game-rules/consequences.ts`,
`game-rules/inventory.ts`, `services/souvenir.service.ts`, `routes/souvenir.routes.ts`,
`routes/aveugle.routes.ts`, `services/aveugle.service.ts`.

---

### 🎯 Ticket #5 — Bug locale Aveugle : labels People/Vocation non traduits

**Priorité** : à isoler des tickets de nettoyage structurel — c'est un vrai bug utilisateur
(confirmé), pas juste de la dette.

**Fichiers** : `apps/backend/src/services/aveugle.service.ts` (lignes ~266-267, ~379-382),
`apps/backend/src/services/aveugle.service.test.ts`.

**Contenu** : dériver le label People/Vocation depuis `locale` comme le fait déjà
`chronicle.service.ts` (`nameKey = locale === 'fr' ? 'fr' : 'en'` puis `name[nameKey]`), au lieu du
`.name.fr` codé en dur. Ajouter un test locale (#168) qui assert explicitement sur la langue du
label People/Vocation, pas seulement sur `languageName` — c'est ce trou de test qui a caché le bug.

---

### 🎯 Ticket #6 — Découper `session.service.ts` (673 lignes)

**Le plus gros chantier, à faire en dernier** une fois les tickets #1-5 stabilisés (ils touchent
tous du code appelé par `session.service.ts` — moins de conflits de rebase si ce ticket vient après).

**Fichiers** : `apps/backend/src/services/session.service.ts` → split en :

- `services/character-mapper.ts` — le mapping Character DB↔domaine (11 casts `as unknown as`
  actuellement dupliqués 3×) devient une fonction typée unique, sans cast.
- `services/session-lifecycle.service.ts` — création/reprise de session.
- `services/session.service.ts` (allégé) — résolution de tour uniquement.

**Inclut aussi** :

- Extraire le pattern fire-and-forget (compression/souvenir/chronique) copié 4× en un helper
  `runBackground(label, task)`.
- Vérifier/clarifier `chosenChoice` persisté sur `choice.text` truthiness (finding PLAUSIBLE —
  confirmer si "pas de choix" et "action libre vide" doivent vraiment être distingués ou fusionnés).
- Vérifier si le double traitement inline (condition IA + item IA) dans `resolveTurn` peut passer
  par un seul point d'entrée `game-rules` (finding PLAUSIBLE, à évaluer, pas à forcer si les deux
  flux ont des règles de validation réellement différentes).

**Risque** : le plus gros diff du plan. Découper en sous-commits mais **une seule PR** (comportement
inchangé, refactor pur) pour ne pas laisser le fichier dans un état intermédiaire incohérent entre
deux merges.

---

### 🎯 Ticket #7 — Mise à jour des `CLAUDE.md` obsolètes

**Pas de code.** PR doc-only. Déjà identifié lors de l'audit CLAUDE.md du 2026-07-24 (rapport
livré, corrections différées jusqu'ici).

**Fichiers** :

- `apps/backend/CLAUDE.md` — supprimer `src/lore/velkhar/  # canon backend structuré` de l'arbo
  cible (n'existe pas ; les lookups canon passent par `@grimoire/shared::getPeople/getVocation`).
- `apps/frontend/CLAUDE.md` — rafraîchir l'arbre de répertoires (signalé obsolète, score C/68
  lors de l'audit CLAUDE.md).

---

## Ordre de dépendance

```
#1 (resolveChoice) ─┐
#2 (middleware Zod) ─┼─→ #4 (mapper + clamp + tiers) ─→ #6 (split session.service.ts)
#3 (validateAiOutput)┘
#5 (bug locale Aveugle) ──────────────────────────────→ indépendant, peut passer en parallèle
#7 (CLAUDE.md) ────────────────────────────────────────→ indépendant, à tout moment
```

`#1`, `#2`, `#3` n'ont aucune dépendance entre eux (fichiers disjoints) — peuvent être menés dans
n'importe quel ordre ou en parallèle. `#4` touche des fichiers modifiés par `#1`-`#3` (petits
conflits possibles sur `consequences.ts`/`aveugle.routes.ts`) — la faire après. `#6` est le plus
gros diff et le plus susceptible de conflits de rebase — dernier. `#5` et `#7` sont totalement
indépendants et peuvent être glissés n'importe quand, y compris avant `#1`.

## Suivi

Chaque ticket, une fois livré, doit mettre à jour `docs/public/current-state/BACKEND_NEXT.md` et
`BACKEND_STATUS.md` selon l'état attendu après merge (convention du projet, voir
`gameplay-survie-v2.md`).
