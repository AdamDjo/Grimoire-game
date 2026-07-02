# Phase 1B — Backlog

> Phase 1A (landing) ✅ terminée. Phase 1B = brancher le **backend Game Master** + finir les **écrans frontend restants**.
> Pré-requis : merger `feature/88-landing-page-redesign` sur `develop`.

---

## Bloqueurs transverses (à faire avant les écrans)

| #   | Tâche                                            | Scope              | Pourquoi                                                                                                                                                              |
| --- | ------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | **Refonte triptyque TS** dans `packages/shared/` | shared             | Le `Character` actuel a encore FOR/AGI/INT/CHA. À refondre en SANG/SOUFFLE/CENDRE + survie (faim/soif/fatigue/calamine) + Souvenirs. Bloque tous les écrans gameplay. |
| B2  | **OpenRouter provider** backend                  | backend            | Remplacer `providers/{claude,gemini,mistral}.ts` par `openrouter.provider.ts` unique. Une seule clé `OPENROUTER_API_KEY`.                                             |
| B3  | **Migration `valorain/` → `velkhar/`**           | frontend + backend | Renommer les dossiers de routes + lore. Cohérence avec le GDD.                                                                                                        |

---

## Écrans Phase 1B (frontend)

### 1. Auberge de L'Aveugle (hub roguelike) — **priorité 1**

- **Route** : `app/(main)/velkhar/aveugle/page.tsx`
- **GDD** : `08-AUBERGE-AVEUGLE.md` (si existe) + `15-GAME-MASTER.md` + `14-META-WORLD.md` (Souvenirs)
- **Composants à créer** : `components/aveugle/{AubergeScene, AveugleDialogue, VocationPicker, ConceptLibreInput, SouvenirsExchange, ArtefactExplanation}`
- **Backend requis** : `aveugle.service.ts` + routes `/api/aveugle/*` (greeting, ask, souvenirs, buy, artefact-explain, quit)
- **Dépend de** : B1, B2

### 2. Character Create (la Forge)

- **Route** : `app/(main)/velkhar/character-create/page.tsx`
- **GDD** : `07-CHARACTER-CREATION.md` + `05-VOCATIONS.md`
- **À fournir** : 4 vocations + concept libre, peuples, bonus raciaux, attribution triptyque
- **Dépend de** : B1

### 3. World Map (Makhzen)

- **Route** : `app/(main)/velkhar/world/page.tsx`
- **GDD** : `02-WORLD-BIBLE.md`
- **À fournir** : carte du continent désertique, régions, points d'intérêt
- **Composants** : `components/world/{MakhzenMap, RegionTooltip}`

### 4. Campaign / Session screen

- **Routes** : `app/(main)/velkhar/campaign/[id]/page.tsx` + `app/(game)/velkhar/session/[id]/page.tsx`
- **GDD** : `09-ACTION-LOOP.md` + `15-GAME-MASTER.md`
- **À fournir** : narration MJ, choix joueur, free-action, dés visibles aux pivots, inventaire, survie
- **Dépend de** : B1, B2

---

## Composants UI réutilisables à créer

| Composant       | Variantes                     | Usage                    |
| --------------- | ----------------------------- | ------------------------ |
| `StatBar`       | `sang` / `souffle` / `cendre` | Tous les écrans gameplay |
| `CalamineMeter` | —                             | Aveugle, Session         |
| `SurvieGauge`   | `faim` / `soif` / `fatigue`   | Session                  |
| `VocationCard`  | 4 vocations + "libre"         | Character Create         |

Déjà disponibles (Phase 1A) : `Heading`, `NavBar`, `Footer`, `Section`, `PageShell`, `StatItem`, `IconButton`, `NavLink` — voir `components/ui/`.

---

## Tests Phase 1B (à écrire)

- Vitest backend : `dice.ts` triptyque, `aveugle.service.ts`, `scene-validator.ts` canon Velkhar
- Vitest frontend : `StatBar` (3 variantes), `CalamineMeter`, `VocationCard`
- Cypress E2E : golden path landing → login → character-create → auberge → session

---

## Hors scope Phase 1B (Phase 2+)

- Génération Chronique fin de run
- Méta-monde (consolidation Souvenirs cross-run)
- Leaderboard, monétisation
