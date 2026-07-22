# Frontend — Next.js App Router

> Lire d'abord : `../../MEMORY.md`, puis `../../docs/00-START-HERE.md`.
> Statut vivant : `../../docs/public/current-state/FRONTEND_STATUS.md` + `FRONTEND_NEXT.md`.
> Design/gameplay : `../../docs/public/design/GAME_DESIGN.md`.
> Tokens UI : `../../docs/public/design/DESIGN_TOKENS.md`.
> Architecture/API : `../../docs/public/tech/ARCHITECTURE_RULES.md`.
> Canon (source de vérité) : `../../docs/public/nav/canon-index.md` → `../../docs/public/raw/*`.

## Règle absolue — lire le canon AVANT de coder

**Toute copie affichée, règle de jeu visible ou lore présenté à l'écran doit être vérifié dans `docs/public/raw/` AVANT d'écrire le code.** Jamais de valeur, de libellé ou de comportement « provisoire, à valider plus tard ». Si `GAME_DESIGN.md` (résumé) contredit le canon `raw/`, le `raw/` gagne. Le canon est versionné → lisible directement dans tout worktree. Voir `../../docs/public/nav/PRIVATE_CANON_POLICY.md`.

## Scope

Travailler uniquement dans `apps/frontend/`, sauf changement de contrat partagé dans `packages/shared/`.
Le frontend est implémenté par Codex. Toute PR frontend met à jour `FRONTEND_STATUS.md` et
`FRONTEND_NEXT.md` selon l'état attendu après merge, ainsi que `RELEASE_READINESS.md` si elle
change un bloqueur `phase: predeploy`.

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
- Phase 1A (landing) livrée — plans landing archivés, pas de plan actif restant.

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
