# Design Tokens — Velkhar (palette désertique)

> Extrait condensé de [`GAME_DESIGN.md`](GAME_DESIGN.md) §7. Pour le détail complet (justifications, exemples étendus, références visuelles), lire le fichier source.
> **Règle absolue** : ne jamais hard-coder couleur ou police. Toujours utiliser ces tokens (CSS vars ou Tailwind).

---

## Palette OKLCH

Implémentée dans `apps/frontend/src/app/globals.css` :

```css
:root {
  /* Backgrounds — sable noir / panel */
  --bg: oklch(0.15 0.013 52);
  --bg-2: oklch(0.2 0.015 54);
  --bg-3: oklch(0.255 0.016 56);
  --panel-edge: oklch(0.34 0.018 58 / 0.7);
  --line: oklch(0.32 0.014 58 / 0.55);

  /* Text — sable brûlé */
  --ink-1: oklch(0.93 0.02 78); /* primary */
  --ink-2: oklch(0.74 0.018 72); /* secondary */
  --ink-3: oklch(0.56 0.015 66); /* muted */
  --ink-4: oklch(0.42 0.012 60); /* disabled */

  /* Accents — or brûlé, ocre, Cendre */
  --gold: oklch(0.78 0.13 75); /* or brûlé — CTA principal */
  --gold-light: oklch(0.88 0.1 80); /* hover, sable au soleil */
  --gold-dark: oklch(0.62 0.12 70); /* borders, bronze ancien */
  --ember: oklch(0.72 0.135 55); /* ocre — CTA, loot, danger */
  --ember-deep: oklch(0.58 0.14 45);
  --arcane: oklch(0.68 0.09 290); /* violet brume dorée — magie, IA */
  --arcane-2: oklch(0.58 0.11 292);
  --steel: oklch(0.66 0.06 225); /* OOC mode, neutre */

  /* Triptyque stats */
  --sang: oklch(0.6 0.17 28); /* rouge combat */
  --souffle: oklch(0.74 0.1 200); /* turquoise désert nuit */
  --cendre: oklch(0.7 0.12 60); /* doré cendre */

  /* Survie */
  --pv: oklch(0.6 0.17 28);
  --calamine: oklch(0.7 0.14 75);
  --soif: oklch(0.7 0.1 220);
  --faim: oklch(0.68 0.12 50);
  --fatigue: oklch(0.5 0.05 280);
}
```

---

## Typographie

Chargées dans `app/layout.tsx` via `next/font/google` :

| Variable CSS   | Font                                 | Usage                                   |
| -------------- | ------------------------------------ | --------------------------------------- |
| `--font-disp`  | **Cinzel** 500/600/700/800           | Titres, chapitres, logo, héros          |
| `--font-serif` | **EB Garamond** 400/500/600 + italic | Narration MJ, prose, dialogue           |
| `--font-body`  | **Outfit** 300/400/500/600/700       | UI chrome (boutons, stats, nav, labels) |

---

## Atmosphère désertique (à répliquer sur tout PageShell)

- `body::before` → radial gradients : or brûlé en haut + arcane bas
- `body::after` → SVG fractalNoise grain (5 % opacity, `mix-blend-mode: overlay`)
- Particules ocre flottantes — Phase 1A : CSS animation ; Phase 3 : canvas

---

## Exemples Tailwind récurrents

```tsx
// Titre section gradient doré
<h2 className="font-disp bg-gradient-to-b from-[--gold-light] to-[--gold] bg-clip-text text-transparent">

// CTA principal
<button className="bg-[--ember] hover:bg-[--ember-deep] text-[--bg] font-body font-medium">

// Texte secondaire muted
<p className="font-serif text-[--ink-2] italic">

// StatBar SANG
<div className="bg-[--sang] h-2 rounded" style={{ width: `${pct}%` }}>
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
