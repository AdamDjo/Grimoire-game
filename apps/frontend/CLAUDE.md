# Frontend — Next.js App Router

> Lire d'abord : `../../docs/00-START-HERE.md`, puis `../../docs/public/current-state/PROJECT_STATUS.md`.
> Statut vivant : `../../docs/public/current-state/PROJECT_STATUS.md`.
> Design/gameplay : `../../docs/public/design/GAME_DESIGN.md`.
> Tokens UI : `../../docs/public/design/DESIGN_TOKENS.md`.
> Architecture/API : `../../docs/public/tech/ARCHITECTURE_RULES.md`.

## Scope

Travailler uniquement dans `apps/frontend/`, sauf changement de contrat partagé dans `packages/shared/`.

## Architecture — colocation

```txt
src/
├── app/
│   ├── (home)/
│   ├── (auth)/
│   ├── (main)/velkhar/
│   ├── (game)/velkhar/
│   └── api/[...path]/route.ts
├── components/ui/
├── hooks/
├── stores/
└── lib/
```

- `_components/` = privé à une route.
- `components/ui/` = réutilisable multi-routes.
- Les pages doivent composer des composants, pas contenir toute la logique.
- Toutes les API frontend passent par `app/api/[...path]/route.ts`.

## Nommage des fichiers

- `components/ui/` : fichiers plats kebab-case (`media-layer.tsx`), toujours exportés
  depuis `components/ui/index.ts`. Réutilisable multi-routes, jamais de copy hardcodée.
- `app/(route)/_components/NomDuComposant/` : dossier PascalCase + fichier principal
  `NomDuComposant.tsx` (jamais `index.tsx`) + sous-composants privés colocalisés en
  PascalCase.tsx + CSS colocalisé `nom-du-composant.css`.
- Un composant sans sous-composants ni CSS dédié reste un fichier plat
  `app/(route)/_components/nom-du-composant.tsx`.

## Landing

- Sections scroll de `(home)` dans `_components/Section<N><Nom>/`.
- Contenu/copy à garder cohérent avec `../../docs/public/design/GAME_DESIGN.md`.
- Plan landing visuel actif : `../../docs/private/plans/landing/PLAN-LANDING-CUBERTO-LEVEL.md`.
- Plan landing SEO/copy : `../../docs/private/plans/landing/LANDING_SEO_BILINGUAL_PLAN.md`.

## UI

- Ne jamais hardcoder couleur ou police.
- Utiliser les tokens de `../../docs/public/design/DESIGN_TOKENS.md` et les variables CSS existantes.
- Pas de logique de jeu critique côté client.
- Textes UI/code en anglais, conversation utilisateur en français.

## Accessibilité

- `IconButton.label` obligatoire.
- `StatItem.iconLabel` obligatoire.
- Navigation sémantique : `header`, `nav`, `footer`.
- `aria-current="page"` sur le lien actif.
- Utiliser `<button>`, jamais `<div onClick>`.

## State

- Zustand : UI state uniquement.
- React Query : server state.
- Ne pas dupliquer l'état serveur dans Zustand.

## SSR Hydration

```tsx
const [particles, setParticles] = useState<Particle[]>([])

useEffect(() => {
  setParticles(generate())
}, [])
```

Éviter tout `Math.random()` rendu directement côté serveur.

## Tests

```bash
pnpm type-check --filter @grimoire/frontend
pnpm test --filter @grimoire/frontend
pnpm cypress open
```
