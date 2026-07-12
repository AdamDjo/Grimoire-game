# PLAN — Vertical-slice gamesession Velkhar (MJ IA) · Phase 1B

> **Doc de reprise.** Si je reviens plus tard, je lis ce fichier + l'EPIC [#95](https://github.com/AdamDjo/Grimoire-game/issues/95) et je reprends où j'en étais.
> **Dernière mise à jour** : 2026-07-11.

---

## 0. Contexte de travail (à relire en premier)

- **Worktree parallèle.** Codex bosse sur le dossier principal (`/Users/adembenmessaoud/dev/EpisodeRPG-game`, branche `feature/93-ui-kit-grimoire-complet` = UI Kit). Claude bosse dans un worktree à côté : `/Users/adembenmessaoud/dev/EpisodeRPG-game-claude`, branche **`feature/95-demo-gamesession-vertical-slice`** (partie de `origin/develop`).
- ⚠️ **Ne jamais toucher au dossier principal** (c'est celui de Codex). Tout le dev de cet EPIC se fait dans `EpisodeRPG-game-claude`.
- ⚠️ **Canon gitignored** : `docs/public/raw/*.md` (les GDD) n'existent QUE dans le dossier principal (non transférés au worktree). Pour les relire → les lire depuis `/Users/adembenmessaoud/dev/EpisodeRPG-game/docs/public/raw/` (lecture seule).
- **Règles git absolues** : issue → branche → PR, jamais de commit sans demande explicite, jamais sur `main`/`develop`, jamais de `Co-Authored-By: Claude`. `feature/*` → `develop`.
- **Node** : `pnpm install` déjà fait dans le worktree (les `node_modules` ne se transfèrent pas).

---

## 1. Objectif de l'EPIC

Un palier **« le jeu tourne »** : une session Velkhar **jouable**, avec **narration générée par une IA réelle** (OpenRouter, côté backend), en réutilisant le dossier UI existant. On adaptera le **UI Kit #93** plus tard.

**On ne fait PAS** de démo scriptée. On démarre **Phase 1B pour de vrai**. Le seul mock = le _personnage de départ_ (en attendant les écrans L'Aveugle + la Forge).

---

## 2. Décisions actées (ne pas re-débattre)

| Sujet                 | Décision                                                                                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provider IA           | **OpenRouter** (API hébergée, modèles `:free`). 9Router/OmniRoute rejetés (proxies dev locaux, pas des backends).                                                    |
| Backend               | **Express + TypeScript**. Raison : `packages/shared` = contrat typé front↔back en un seul langage ; viable jusqu'au multi async (V2) et temps réel (V3+ WebSockets). |
| Clé API               | `OPENROUTER_API_KEY` **secret serveur uniquement**. Jamais front/bundle/logs. + `OPENROUTER_MODEL` en env.                                                           |
| Qui décide des règles | **Le backend.** L'IA écrit la prose ; le backend valide (Zod), applique, persiste.                                                                                   |
| Langue                | **Anglais par défaut**, l'IA localise selon `locale` (champ du contexte de session). Pas d'i18n d'interface pour l'instant.                                          |
| Termes canon          | Traduits par un **dico curaté `LocalizedString`** (blood→{en:'Blood',fr:'Sang'}…), stable, écrit à la main. L'IA ne retraduit PAS les termes de marque.              |
| Clés d'attributs      | **Anglais** : `blood` / `breath` / `ash` (= SANG / SOUFFLE / CENDRE).                                                                                                |
| Perso de départ       | **Mocké canonique** (bien typé). Suffit à orienter l'IA sans finir L'Aveugle/la Forge d'abord.                                                                       |
| Isolation UI Kit      | Composants provisoires isolés dans les `_components/` de la route session → **zéro collision avec #93**.                                                             |

---

## 3. Modèle de données canon (référence B1)

### Attributs (triptyque)

- `blood` (SANG), `breath` (SOUFFLE), `ash` (CENDRE) — valeurs **3 à 18**.
- Table de modificateurs : `3=−3 · 4-5=−2 · 6-7=−1 · 8-11=0 · 12-13=+1 · 14-15=+2 · 16-17=+3 · 18=+4`.
- Dé = `d20 + mod attribut + skill vs DC`.

### Survie (jauges 0–100, toutes liées à `blood`)

- `hp` / `maxHp` avec **`maxHp = 10 + attributeModifier(blood)`**.
- `thirst` (soif), `hunger` (faim), `fatigue`.
- `calamine` (0–100) : corruption Cendre accumulée. **100 = mort** (transformation en Calciné). Stades à 25 / 50 / 75.

### Conditions

Type simple (liste) : fièvre, empoisonnement, blessure, gel, étourdissement, cécité, maladie des marais, cendre-corrompu, raison ébranlée, pétrification.

### Structure cible (à écrire en B1)

```ts
export type Attribute = "blood" | "breath" | "ash";
export type Attributes = Record<Attribute, number>; // 3–18

export interface SurvivalStats {
  hp: number;
  maxHp: number; // = 10 + attributeModifier(blood)
  thirst: number;
  hunger: number;
  fatigue: number;
  calamine: number; // 0–100
}

export interface CharacterStats {
  attributes: Attributes;
  survival: SurvivalStats;
  conditions: Condition[];
}

export function attributeModifier(value: number): number;
```

### Character étendu

`vocation`, `people` (peuple), `freeConcept`, `backstory`, `locale` (défaut `'en'`).

- **Peuples** : Sahélin (+1 blood), Rivain (+1 ash), Thérien (+1 blood), Cendreur (+1 breath), Changepeau (+1 breath, −1 ash).
- **Vocations** : Marcheur-du-Sel, Lame-Ombre, Veilleur, Tisse-Verbe (+ concept libre). Profils stats dans `docs/public/raw/04-ATTRIBUTES.md` (ex. Marcheur-du-Sel : blood 14 / breath 10 / ash 10).
- **Souvenirs** (méta) : entité séparée (title + ~50 tokens), **PAS** dans `CharacterStats`.

### ⚠️ Réconciliation à faire en B1

- `packages/shared/src/types/character.types.ts` a un `CharacterStats` **obsolète** (hp/maxHp/mana/strength/agility/intelligence/charisma/luck/level/xp) → **à refondre**.
- `packages/shared/src/constants/classes.ts` utilise déjà `sang/souffle/cendre` + `LocalizedString` → **incohérent** avec les types. B1 réconcilie et bascule les clés en `blood/breath/ash`.
- **DoD B1** : `pnpm --filter @grimoire/shared build` passe, **plus aucune** référence `strength/agility/intelligence/charisma/luck`.

---

## 4. Roadmap subtasks (ordre d'exécution)

```
#96 (types)  →  #97 (mock perso)  ┐
             →  #98 (backend IA)  ┴→  #99 (écran jouable)
```

### Étape 1 — B1 · Types partagés — [#96](https://github.com/AdamDjo/Grimoire-game/issues/96)

`@grimoire/shared`. Voir §3. **Débloque tout le reste.**

- DoD : build shared OK, zéro ancienne réf, `attributeModifier()` testable.

### Étape 2 — Mock perso — [#97](https://github.com/AdamDjo/Grimoire-game/issues/97) _(dépend de #96)_

Un `Character` canonique en dur (ex. Marcheur-du-Sel / Sahélin), typé sur shared, copie EN.

- Emplacement : `_data/` de la route session.
- DoD : satisfait `Character` sans cast ; réutilisable tel quel comme entrée de la route.

### Étape 3 — B2 · Backend MJ — [#98](https://github.com/AdamDjo/Grimoire-game/issues/98) _(dépend de #96)_

- `openrouter.provider.ts` (clé secrète, `OPENROUTER_MODEL` en env).
- Route `POST /api/game/action` — input `{ sessionId?, character, choiceId?, locale }`.
  - **Étape 3a** : renvoie une `Scene` **stub déterministe** (sans IA) → débloque l'écran tout de suite.
  - **Étape 3b** : branche l'IA réelle → narration + choix générés.
- **Validation Zod** de la sortie IA (le `scene-validator` du TECH_STACK). Sortie malformée → rejet/reprompt, jamais brute au front.
- Prompt système MJ : « answer in {locale}, English by default », termes canon non retraduits.
- Sécurité publique minimale : CORS/Helmet/validation d'entrée.
- ⚠️ **État backend actuel** : `apps/backend/` = seulement `index.ts` (health skeleton) + `test/example.test.ts`. **Aucun provider n'existe encore.** Tout est à créer.
- DoD : `curl POST /api/game/action` renvoie une `Scene` valide (stub puis IA) ; clé absente du bundle/logs.

### Étape 4 — Session screen — [#99](https://github.com/AdamDjo/Grimoire-game/issues/99) _(dépend de #96, #98)_

- Route `/(game)/velkhar/session/[id]` (actuellement un shell de 11 lignes).
- Layout : narration MJ · choix joueur · HUD (triptyque blood/breath/ash + jauges survie) · jet de dés visible aux pivots.
- Flux : choix → `POST /api/game/action` → nouvelle scène → conséquences appliquées au HUD.
- Data de départ = perso mocké (#97) ; scènes = route B2 (#98).
- Composants **provisoires isolés** dans `_components/` → zéro collision avec le UI Kit #93.
- DoD : ouvrir `/velkhar/session/demo`, lire une scène IA, cliquer un choix, nouvelle scène arrive, HUD bouge. Vérifié via preview (console/network propres + screenshot). SSR/hydratation OK.

---

## 5. Design tokens dispo (frontend)

`apps/frontend/src/app/globals.css` — `:root` :
`--void:#0a0806` · `--parchment:#e8dcc0` · `--gold:#d9a441` · `--gold-light:#f0d48a` · `--blood:#c0392b` · `--soul:#35c4ac` · `--cendre:#e3b341` · `--ink-manuscript:#2a2118`.
Tailwind v4 `@theme inline` → `--color-*`. Fonts : Cinzel (display), Cormorant (accent), EB Garamond (serif), Alegreya Sans (ui), Caveat (manuscript).
UI déjà dispo : `Heading`, `NavBar`, `Footer`, `Section`, `PageShell`, `StatItem`, `IconButton`, `NavLink`, `Button`, `Card` (`components/ui/`).

---

## 6. Sources canon (dossier principal, lecture seule)

- `docs/public/raw/04-ATTRIBUTES.md` — triptyque, modificateurs, dés, profils vocations.
- `docs/public/raw/06-SURVIVAL.md` — 4 jauges + Calamine + conditions + biomes + équipement.
- `docs/public/raw/14-META-WORLD.md` §2 — Souvenirs.
- `docs/public/tech/TECH_STACK.md` — Express+TS, OpenRouter, Supabase+pgvector, flux de tour.
- `docs/public/plans-actifs/PHASE-1B-BACKLOG.md` — bloqueurs B1/B2/B3, écrans, tests.

---

## 7. État d'avancement

| Étape                   | Issue      | Statut                 |
| ----------------------- | ---------- | ---------------------- |
| Cadrage + issues + plan | #95 (EPIC) | ✅ Fait (2026-07-11)   |
| B1 — types shared       | #96        | ⬜ À faire (prochaine) |
| Mock perso              | #97        | ⬜ À faire             |
| B2 — backend MJ         | #98        | ⬜ À faire             |
| Session screen          | #99        | ⬜ À faire             |

**Prochaine action à la reprise** : implémenter **B1 (#96)** dans le worktree, en refondant `character.types.ts` et en réconciliant `classes.ts`.
