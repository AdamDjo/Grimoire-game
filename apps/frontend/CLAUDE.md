# Frontend — Règles spécifiques Next.js 15 (Velkhar)

> Règles globales : `~/.claude/CLAUDE.md`. **Contexte projet : `docs/00-START-HERE.md`** (à lire en premier).
> Architecture : [`docs/03-tech/TECH_STACK.md`](../../docs/03-tech/TECH_STACK.md). Design tokens : [`docs/02-design/DESIGN_TOKENS.md`](../../docs/02-design/DESIGN_TOKENS.md). Source de vérité produit : `docs/raw/` (GDD Velkhar, gitignored) — voir [`docs/wiki/index.md`](../../docs/wiki/index.md).

## Scope

Travailler UNIQUEMENT dans `apps/frontend/`. Ne jamais modifier de fichiers en dehors sauf `packages/shared/` pour les types (ajouter d'abord là-bas — ⚠️ **TODO post-sync : refonte triptyque**).

## Projet

**GRIMOIRE — Of Ash and Salt**, monde de **Velkhar** (dark fantasy désertique). Roguelike narratif : run 3-15h, 4 vocations, hub permanent = Auberge de **L'Aveugle**.

## Architecture

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 for styling (no CSS modules)
- Zustand for UI/client state
- React Query for server state & caching
- All API calls proxied through `/api/[...path]/route.ts`
- Frontend is display-only: shows scenes, presents choices, displays stats

## Directory Structure

```
src/
├── app/
│   ├── (home)/
│   │   ├── page.tsx                  # Landing GRIMOIRE (Velkhar)
│   │   └── _components/
│   ├── (auth)/login, signup/
│   │   └── _components/
│   ├── (main)/
│   │   ├── velkhar/                  # ⚠️ à migrer depuis valorain/
│   │   │   ├── aveugle/page.tsx      # Auberge de L'Aveugle (hub roguelike)
│   │   │   ├── world/page.tsx        # Carte du Makhzen
│   │   │   ├── character-create/page.tsx  # Forge — 4 vocations OU concept libre
│   │   │   ├── campaign/[id]/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── leaderboard/page.tsx
│   ├── (game)/
│   │   └── velkhar/session/[id]/
│   │       └── _components/
│   └── api/[...path]/route.ts       # proxy → backend
├── components/
│   ├── ui/                          # ⚠️ palette désertique (ci-dessous)
│   ├── aveugle/                     # ⚠️ à créer — composants L'Aveugle
│   │   ├── AubergeScene.tsx
│   │   ├── AveugleDialogue.tsx
│   │   ├── VocationPicker.tsx
│   │   ├── ConceptLibreInput.tsx
│   │   ├── SouvenirsExchange.tsx
│   │   └── ArtefactExplanation.tsx
│   ├── character/                   # ⚠️ à adapter au triptyque
│   ├── game/                        # ⚠️ à adapter au triptyque
│   └── world/                       # ⚠️ Makhzen au lieu de Valorain
├── hooks/
└── lib/
```

**Règle absolue colocation** : `_components/` = privé à sa route. `components/ui/` = réutilisable. Ne jamais dupliquer.

---

## Composants `ui/` (palette désertique)

> ⚠️ **TODO post-sync** : adapter la palette actuelle (nordique, OKLCH arcane violet) à la palette désertique du GDD §7. Voir tableau ci-dessous.

| Composant       | Props clés                                          | Obligatoire          | État                              |
| --------------- | --------------------------------------------------- | -------------------- | --------------------------------- |
| `Heading`       | `{ title, level?, size? }`                          | —                    | ✅ garder                         |
| `StatItem`      | `{ icon, value, label, iconLabel }`                 | `iconLabel` (aria)   | ⚠️ adapter au triptyque           |
| `NavLink`       | `{ label, href, active?, small? }`                  | —                    | ✅ garder                         |
| `IconButton`    | `{ icon, label, onClick? }`                         | `label` (aria-label) | ✅ garder                         |
| `Section`       | `{ id?, snap?, 'aria-label'?, children }`           | —                    | ✅ garder                         |
| `PageShell`     | `{ children, scrollSnap? }`                         | —                    | ⚠️ repasser en palette désertique |
| `NavBar`        | `{ logo, links[] }`                                 | —                    | ⚠️ repasser en palette désertique |
| `Footer`        | `{ copyright, links[], actions? }`                  | —                    | ⚠️ repasser en palette désertique |
| `StatBar`       | `{ stat: 'sang'\|'souffle'\|'cendre', value, max }` | —                    | ⚠️ **3 variantes triptyque**      |
| `CalamineMeter` | `{ value }`                                         | —                    | ⚠️ à créer                        |
| `AubergeScene`  | `{ ambiance, children }`                            | —                    | ⚠️ à créer                        |

---

## ⚠️ Designs de référence — Note

Les anciens designs hi-fi `docs/Grimoire/*.html` (Valorain-era) **n'existent pas dans ce repo**. Suivre les **design tokens désertiques GDD §7** :

| Token          | Valeur                                             | Usage                         |
| -------------- | -------------------------------------------------- | ----------------------------- |
| `--gold`       | Or brûlé (or du désert, cuivre patiné)             | CTA principal, accent Velkhar |
| `--gold-light` | Or clair (sable au soleil)                         | Hover, light surfaces         |
| `--gold-dark`  | Or sombre (bronze ancien)                          | Borders, shadows              |
| `--ember`      | Ocre brûlé (cendre chaude, pas violet)             | CTA, loot, danger             |
| `--ember-deep` | Ocre profond                                       | Hover states                  |
| `--arcane`     | Violet brume dorée (la Cendre concentrée, subtile) | Magic, IC mode, IA            |
| `--arcane-2`   | Violet brume foncée                                | Hover arcane                  |
| `--steel`      | Bleu acier terni (désert froid, nuit)              | OOC mode, neutres             |
| `--ink-1`      | Sable brûlé (texte primaire, chaud)                | Texte                         |
| `--ink-2`      | Sable (texte secondaire)                           | Texte muted                   |
| `--ink-3`      | Sable gris (disabled)                              | Disabled                      |
| `--ink-4`      | Brun clair                                         | Très muted                    |

**Polices** (chargées via Google Fonts, déjà dans tous les designs) :

```
Cinzel 500/600/700/800          → --disp  (titres, chapitres, logo)
EB Garamond 400/500/600 + italic → --serif (narration MJ, prose)
Outfit 300/400/500/600/700      → --ui    (UI chrome : boutons, stats, nav)
```

**Atmosphère désertique** (à répliquer dans `globals.css`) :

- `body::before` : radial gradients — or brûlé haut + arcane bas
- `body::after` : SVG fractalNoise grain à 5% opacity, `mix-blend-mode: overlay`
- Particules ocre flottantes (CSS animation Phase 1A, canvas Phase 3)

---

## CSS — Design tokens OKLCH (⚠️ TODO adapter)

Ne jamais hard-coder couleur ou police. Implémenter dans `src/app/globals.css` :

```css
:root {
  /* Backgrounds — palette désertique */
  --bg: oklch(0.15 0.013 52); /* deepest dark — sable noir */
  --bg-2: oklch(0.2 0.015 54); /* panel bg */
  --bg-3: oklch(0.255 0.016 56); /* raised surface */
  --panel-edge: oklch(0.34 0.018 58 / 0.7);
  --line: oklch(0.32 0.014 58 / 0.55);

  /* Text — sable brûlé */
  --ink-1: oklch(0.93 0.02 78); /* primary */
  --ink-2: oklch(0.74 0.018 72); /* secondary */
  --ink-3: oklch(0.56 0.015 66); /* muted */
  --ink-4: oklch(0.42 0.012 60); /* disabled */

  /* Accents — or brûlé, ocre, Cendre */
  --gold: oklch(0.78 0.13 75); /* or brûlé */
  --gold-light: oklch(0.88 0.1 80);
  --gold-dark: oklch(0.62 0.12 70);
  --ember: oklch(0.72 0.135 55); /* ocre — CTA, loot */
  --ember-deep: oklch(0.58 0.14 45);
  --arcane: oklch(0.68 0.09 290); /* violet brume dorée — Cendre */
  --arcane-2: oklch(0.58 0.11 292);
  --steel: oklch(0.66 0.06 225); /* OOC mode */
  --steel-2: oklch(0.52 0.05 240);

  /* Stats triptyque */
  --sang: oklch(0.6 0.17 28); /* rouge combat */
  --souffle: oklch(0.74 0.1 200); /* turquoise désert (nuit) */
  --cendre: oklch(0.7 0.12 60); /* doré cendre */

  /* Survie */
  --pv: oklch(0.6 0.17 28); /* rouge */
  --calamine: oklch(0.7 0.14 75); /* or brume dorée */
  --soif: oklch(0.7 0.1 220); /* bleu sec */
  --faim: oklch(0.68 0.12 50); /* ocre brûlé */
  --fatigue: oklch(0.5 0.05 280); /* violet sombre */

  /* Item rarities */
  --r-common: oklch(0.82 0.015 80);
  --r-unc: oklch(0.74 0.13 145);
  --r-rare: oklch(0.7 0.12 240);
  --r-epic: oklch(0.7 0.14 300);
  --r-leg: oklch(0.78 0.15 65);

  /* Fonts */
  --font-disp: 'Cinzel', serif;
  --font-serif: 'EB Garamond', serif;
  --font-body: 'Outfit', sans-serif;
}
```

---

## SSR Hydration

```tsx
// ✅ Correct
const [particles, setParticles] = useState<Particle[]>([])
useEffect(() => {
  setParticles(generate())
}, [])

// ❌ Faux — divergence server/client
const particles = useRef(generate())
```

---

## Accessibilité — 100% obligatoire

- `IconButton.label` → `aria-label` sur `<button>` (obligatoire)
- `StatItem.iconLabel` → `aria-label` sur `<span role="img">` (obligatoire)
- `NavBar` → `<header role="banner">` + `<nav aria-label="Navigation principale">`
- `Footer` → `<footer role="contentinfo">`
- `aria-current="page"` sur le lien actif
- HTML sémantique : `<button>` jamais `<div onClick>`
- **CalamineMeter** : valeur lisible (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`)

---

## State Management

- **Zustand** : UI state uniquement (sidebar, theme, modals)
- **React Query** : toutes les données serveur (sessions, characters, scènes, L'Aveugle dialogue)
- Ne jamais dupliquer l'état serveur dans Zustand

---

## Tests — Stratégie

### Quoi tester (Vitest + Testing Library)

- **Composants `ui/`** : render correct, props obligatoires, aria attributes présents
- **Hooks custom** : logique métier
- **Utilitaires `lib/`** : fonctions pures
- **Composants L'Aveugle** : `AubergeScene`, `SouvenirsExchange` (logique d'échange)

### Quoi tester (Cypress E2E)

- **Golden path** : landing → login → character-create → auberge L'Aveugle → session
- **Ouverture roguelike** : à chaque run, le joueur passe par L'Aveugle avant le run
- **Triptyque** : créer personnage avec chaque vocation, vérifier l'attribution des mods
- **Souvenirs** : run ≥ 2 → L'Aveugle propose l'échange lore

### Quoi ne PAS tester

- Composants `_components/` spécifiques à une page (couverts par E2E)
- Composants purement visuels sans logique

### Commandes

```bash
pnpm test --filter @grimoire/frontend
pnpm type-check --filter @grimoire/frontend
pnpm cypress open
```

## Testing

- Run `pnpm type-check --filter frontend` to verify types
- Run `pnpm dev --filter frontend` to test dev server
