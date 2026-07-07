# Design Tokens — Grimoire (or/parchemin)

> Extrait condensé de [`GAME_DESIGN.md`](GAME_DESIGN.md) §7. Pour le détail complet (justifications, exemples étendus, références visuelles), lire le fichier source.
> **Règle absolue** : ne jamais hard-coder couleur ou police. Toujours utiliser ces tokens (CSS vars ou Tailwind).

---

## Palette

Implémentée dans `apps/frontend/src/app/globals.css` :

```css
:root {
  --void: #0a0806; /* Encre — fond principal */
  --ash: #171208; /* Fumée — fond secondaire, panels */
  --parchment: #e8dcc0; /* Parchemin — texte primaire */
  --parchment-dim: #c8b894; /* Parchemin atténué — texte secondaire */
  --muted: #9b8d74; /* Texte muted / disabled */
  --gold: #d9a441; /* Or — accent principal, CTA */
  --gold-light: #f0d48a; /* Or clair — hover, lueur */
  --gold-hover: #f0d48a; /* Alias de --gold-light */
  --gold-dark: #7d5521; /* Or foncé — bordures, bronze ancien */
  --blood: #c0392b; /* Sang — stat combat */
  --soul: #35c4ac; /* Souffle — stat magie/soul */
  --cendre: #e3b341; /* Cendre — stat ressource */
  --border-gold: rgba(217, 164, 65, 0.34);
  --shadow-gold: rgba(217, 164, 65, 0.28);
  --ink: var(--parchment);
  --ink-2: var(--parchment-dim);
  --focus-ring: 0 0 0 3px rgba(217, 164, 65, 0.3);
}
```

Exposées comme utilities Tailwind via `@theme inline` : `bg-void`, `bg-ash`, `text-ink`, `text-muted`, `text-gold`, `text-gold-soft`, `text-gold-dark`, `text-parchment`, `text-blood`, `text-soul`, `text-cendre` (et leurs équivalents `bg-*`/`border-*`).

---

## Typographie

Chargées dans `app/layout.tsx` via `next/font/google` (+ 1 police locale) :

| Variable CSS        | Font                                    | Usage                                   |
| ------------------- | --------------------------------------- | --------------------------------------- |
| `--font-display`    | **Cinzel** 500/600/700                  | Titres, chapitres, logo                 |
| `--font-hero`       | **TC Brookleigh** (local) + Cinzel      | Grand titre héros landing               |
| `--font-serif`      | **EB Garamond** 400/500/600 + italic    | Narration MJ, prose, dialogue           |
| `--font-accent`     | **Cormorant Garamond** 400-700 + italic | Accents éditoriaux, citations           |
| `--font-ui`         | **Alegreya Sans** 300/400/500/700       | UI chrome (boutons, stats, nav, labels) |
| `--font-manuscript` | **Caveat** 400/500                      | Notes manuscrites, touches "grimoire"   |

Exposées en Tailwind : `font-display`, `font-hero`, `font-serif`, `font-accent`, `font-ui`, `font-manuscript`.

---

## Atmosphère désertique (à répliquer sur tout PageShell)

- `.landing-experience` → radial + linear gradients sombres (encre/fumée), `isolation: isolate`
- `.landing-experience::after` → grain de bruit (gradient + grille 3px), `mix-blend-mode: soft-light`, 38 % opacity
- Particules dorées flottantes — Phase 1A : CSS animation ; Phase 3 : canvas

---

## Exemples Tailwind récurrents

```tsx
// Titre en police display, couleur or
<h2 className="font-display text-gold">

// CTA principal
<button className="bg-gold hover:bg-gold-soft text-void font-ui font-medium">

// Texte secondaire muted
<p className="font-serif text-muted italic">

// Stat combat (Sang)
<div className="bg-blood h-2 rounded" style={{ width: `${pct}%` }}>
```

---

## Principes UI à respecter

- **Snap scroll** sur la landing et les écrans pleine page
- **Cursor doré custom** (cf. landing actuelle)
- **Accessibilité 100 %** : `aria-label`, `aria-current`, `role="banner/contentinfo"`
- **SSR safe** : particules + valeurs random uniquement dans `useEffect` (jamais `useRef(Math.random())`)
- **Composants `ui/`** prop-based, `_components/` colocalisés par route

---

> Pour les anti-patterns, justifications, et la vision design étendue → [`GAME_DESIGN.md`](GAME_DESIGN.md) §7.
