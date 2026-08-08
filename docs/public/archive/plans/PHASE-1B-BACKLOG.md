# Phase 1B — Backlog archivé

> **Statut : archivé.** Cette photographie Phase 1B n'est plus une source de tâches.
> Sources vivantes : [[../../current-state/PROJECT_STATUS]] · [[../../current-state/FRONTEND_NEXT]] ·
> [[../../current-state/BACKEND_NEXT]].

## Garde-fous produit

- **Velkhar only** : ne pas pivoter vers D&D comme univers. On peut reprendre des conventions lisibles de JdR (d20, archétypes, difficulté claire), mais pas remplacer Cendre/Calamine/Souvenirs/vocations.
- **MVP court** : viser une vertical slice 45-70 min qui prouve la mémoire, les conséquences et L'Aveugle. Les runs 3-15h sont une vision post-MVP.
- **Lore progressif** : scène 1 = L'Aveugle, Cendre, Calamine, Souvenirs. Les Archontes, factions, régions et secrets se débloquent par jeu.
- **Moat d'abord** : memory/world-state/validation backend avant cosmétiques, régions premium, bestiaire étendu, 3D dice ou leaderboard.

---

## Bloqueurs transverses (à faire avant les écrans)

| #   | Tâche                                            | Scope              | Pourquoi                                                                                                                                                              |
| --- | ------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | **Refonte triptyque TS** dans `packages/shared/` | shared             | Le `Character` actuel a encore FOR/AGI/INT/CHA. À refondre en SANG/SOUFFLE/CENDRE + survie (faim/soif/fatigue/calamine) + Souvenirs. Bloque tous les écrans gameplay. |
| B2  | **OpenRouter provider** backend                  | backend            | Remplacer `providers/{claude,gemini,mistral}.ts` par `openrouter.provider.ts` unique. Une seule clé `OPENROUTER_API_KEY`.                                             |
| B3  | **Vérification migration `velkhar/`**            | frontend + backend | Les routes frontend sont passées sous `velkhar/`. Vérifier ensuite le lore backend et les imports avant implémentation 1B.                                            |

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
