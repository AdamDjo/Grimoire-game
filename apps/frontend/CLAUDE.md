# Frontend — Next.js App Router

> Lire d'abord : `../../MEMORY.md`, puis `../../docs/00-START-HERE.md`.
> Décisions du domaine : `../../docs/state/FRONTEND.md`.
> Avancement : `gh issue list --milestone "v0.2.1 - Roguelike jouable" --state all` (GitHub, jamais un `.md`).
> Architecture, tokens et UI Kit : `../../docs/tech/FRONTEND.md`.
> Architecture/API : `../../docs/tech/RULES.md`.
> Canon (source de vérité) : `../../docs/task-router.md` → `../../docs/canon/*`.

## Règle absolue — lire le canon AVANT de coder

**Toute copie affichée, règle de jeu visible ou lore présenté à l'écran doit être vérifié dans `docs/canon/` AVANT d'écrire le code.** Jamais de valeur, de libellé ou de comportement « provisoire, à valider plus tard ». `docs/canon/` est la seule source de vérité gameplay : aucun résumé ne fait autorité contre lui. Le canon est versionné → lisible directement dans tout worktree.

## Scope

Travailler uniquement dans `apps/frontend/`, sauf changement de contrat partagé explicitement inclus
dans la tâche. Codex est assigné au frontend par défaut, mais Claude suit exactement ces mêmes règles
lorsqu'il reçoit une tâche frontend. **Par défaut, une PR ne modifie aucun document** : elle ferme son
issue, c'est suffisant. Elle met à jour `FRONTEND.md` uniquement si elle a tranché un choix non évident
(pourquoi tel comportement, telle contrainte de rendu, tel garde-fou), et `RELEASE_READINESS.md` si elle
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

- La landing vit dans `(home)/_components/LandingExperience/` : un seul composant racine,
  ses sous-composants colocalisés et son CSS `landing-experience.css`.
- Contenu/copy à garder cohérent avec le canon `../../docs/canon/` (via `../../docs/task-router.md`).
- Phase 1A (landing) livrée — plans landing archivés, pas de plan actif restant.

## Doctrine de code — permanente

> Détail et épisode fondateur : `../../docs/state/FRONTEND.md` § « Doctrine de code ».

- **Noms simples et évidents.** Le mot le plus court qui reste juste (`GameScene`, `GameHud`), jamais
  un nom descriptif à rallonge. Si le nom a besoin d'un commentaire, changer le nom.
- **Un dossier par composant.** `NomDuComposant/NomDuComposant.tsx` + `nom-du-composant.css` +
  sous-composants privés colocalisés. L'arborescence se lit comme un sommaire.
- **Tokens uniquement.** Aucune couleur, police, durée ou espacement en dur. Si le token manque,
  créer le token dans `src/styles/`.
- **Clean code humain, garde-fous d'ingénieur.** Lisible de haut en bas, commentaires qui disent le
  _pourquoi_, pas d'abstraction spéculative — mais typage strict sans `any`, dépendances à sens
  unique, et porte de validation complète (Prettier, `tsc`, ESLint, Vitest) avant de dire « fini ».
- **Un composant partagé reçoit des chaînes déjà résolues**, jamais des clés de traduction :
  `useTranslations()` n'accepte qu'un namespace littéral, donc résoudre ses propres clés soude le
  composant à un seul catalogue.
- **Une règle ESLint qui bloque un emplacement a raison.** Déplacer le code, jamais désactiver la
  règle : `components/ui/` ne peut importer ni `app/**`, ni `features/**`, ni `stores/**`.

## UI

- Ne jamais hardcoder couleur ou police.
- Utiliser les tokens de `../../docs/tech/FRONTEND.md` et les variables CSS existantes.
- Pas de logique de jeu critique côté client.
- Textes UI/code en anglais, conversation utilisateur en français.
- Appliquer le skill global `vercel-react-best-practices` pour tout code React/Next.js.
- Appliquer `e2e-testing-patterns` aux golden paths, tests Cypress et régressions navigateur.

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
