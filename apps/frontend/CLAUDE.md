# Frontend — Règles spécifiques Next.js 15

> Règles globales : `~/.claude/CLAUDE.md`. Architecture et composants : `docs/TECH_STACK.md`. Designs de référence : `docs/Grimoire/`.

## Scope

Travailler UNIQUEMENT dans `apps/frontend/`. Ne jamais modifier de fichiers en dehors sauf `packages/shared/` pour les types (ajouter d'abord là-bas).

## Architecture — Colocation Next.js 15

```
src/
├── app/
│   ├── (home)/
│   │   ├── page.tsx                  # ~70 lignes, composition only
│   │   └── _components/             # privé à la route (underscore = exclu du routing)
│   ├── (auth)/login, signup/
│   │   └── _components/
│   ├── (main)/valorain/
│   │   ├── world/, character-create/, campaign/[id]/
│   │   └── _components/
│   ├── (game)/valorain/session/[id]/
│   │   └── _components/
│   └── api/[...path]/route.ts       # proxy → backend
├── components/
│   └── ui/                          # UNIQUEMENT composants réutilisables multi-routes
├── hooks/                           # custom hooks (use-game-session, use-character…)
├── stores/                          # Zustand stores (ui-store, universe-store)
└── lib/
    └── home-data.ts                 # constantes statiques landing
```

**Règle absolue colocation** : `_components/` = privé à sa route. `components/ui/` = réutilisable partout. Ne jamais dupliquer.

## Composants `ui/` existants

| Composant    | Props clés                                | Obligatoire          |
| ------------ | ----------------------------------------- | -------------------- |
| `Heading`    | `{ title, level?, size? }`                | —                    |
| `StatItem`   | `{ icon, value, label, iconLabel }`       | `iconLabel` (aria)   |
| `NavLink`    | `{ label, href, active?, small? }`        | —                    |
| `IconButton` | `{ icon, label, onClick? }`               | `label` (aria-label) |
| `Section`    | `{ id?, snap?, 'aria-label'?, children }` | —                    |
| `PageShell`  | `{ children, scrollSnap? }`               | —                    |
| `NavBar`     | `{ logo, links[] }`                       | —                    |
| `Footer`     | `{ copyright, links[], actions? }`        | —                    |

## Design de référence — Règle absolue

Avant toute page, ouvrir le HTML correspondant dans `docs/Grimoire/` et le suivre exactement :

| Page             | Design                                                      |
| ---------------- | ----------------------------------------------------------- |
| Landing `/`      | `Grimoire - Accueil.html`                                   |
| Session          | `Grimoire - Session.html` + `grimoire-session.js`           |
| Character create | `Grimoire - Creation Personnage.html` + `grimoire-forge.js` |
| Campaign         | `Grimoire - Campagne.html`                                  |
| World map        | `Grimoire - Carte de Valorain.html` + `grimoire-carte.js`   |

## CSS — Design tokens OKLCH

Ne jamais hard-coder couleur ou police. Utiliser uniquement :

- Couleurs : `var(--gold)`, `var(--gold-light)`, `var(--gold-dark)`, `var(--ink-1)` à `var(--ink-4)`
- Polices : `var(--font-disp)` (Cinzel), `var(--font-serif)` (EB Garamond), `var(--font-body)` (Outfit)
- Définis dans `src/app/globals.css`

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

## Accessibilité — 100% obligatoire

- `IconButton.label` → `aria-label` sur le `<button>` (obligatoire)
- `StatItem.iconLabel` → `aria-label` sur `<span role="img">` (obligatoire)
- `NavBar` → `<header role="banner">` + `<nav aria-label="Navigation principale">`
- `Footer` → `<footer role="contentinfo">`
- `aria-current="page"` sur le lien actif
- HTML sémantique : `<button>` jamais `<div onClick>`

## State Management

- **Zustand** : UI state uniquement (sidebar, theme, modals, `currentUniverse`)
- **React Query** : toutes les données serveur (sessions, characters, scenes)
- Ne jamais dupliquer l'état serveur dans Zustand

## Tests — Stratégie

### Quoi tester (Vitest + Testing Library)

- **Composants `ui/`** : render correct, props obligatoires, aria attributes présents
- **Hooks custom** : logique métier (use-universe-store, use-game-session)
- **Utilitaires `lib/`** : fonctions pures

### Quoi tester (Cypress E2E)

- Golden path : landing → login → character create → session
- Interactions critiques : scroll-snap, sélection portrait, navigation sections

### Quoi ne PAS tester

- Composants `_components/` spécifiques à une page (couverts par E2E)
- Composants purement visuels sans logique

### Commandes

```bash
pnpm test --filter @grimoire/frontend
pnpm type-check --filter @grimoire/frontend
pnpm cypress open
```
