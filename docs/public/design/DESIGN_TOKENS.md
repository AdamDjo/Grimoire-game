# Design Tokens — Grimoire (or/parchemin)

> Extrait condensé de [`GAME_DESIGN.md`](GAME_DESIGN.md) §7. Pour le détail complet (justifications, exemples étendus, références visuelles), lire le fichier source.
> **Règle absolue** : ne jamais hard-coder couleur ou police. Toujours utiliser ces tokens (CSS vars ou Tailwind).

---

## Palette

Implémentée dans `apps/frontend/src/app/globals.css` :

```css
:root {
  --void: #0a0806; /* DS "Encre" — fond principal */
  --parchment: #e8dcc0; /* DS "Parchemin" — texte primaire */
  --gold: #d9a441; /* DS "Or" — accent principal, CTA */
  --gold-light: #f0d48a; /* DS "Or clair" — hover, lueur */
  --gold-hover: #f0d48a; /* Alias de --gold-light */
  --gold-dark: rgba(
    217,
    164,
    65,
    0.55
  ); /* dérivé DS (or atténué) — bordures, bronze ancien */
  --blood: #c0392b; /* DS "Sang" — stat combat */
  --soul: #35c4ac; /* DS "Souffle" — stat magie/soul */
  --cendre: #e3b341; /* DS "Cendre" — stat ressource */
  --border-gold: rgba(217, 164, 65, 0.34);
  --ink-manuscript: #2a2118; /* DS "Encre manuscrite" — texte sur insert parchemin (cards) */
  --ink: var(--parchment);
  --ink-2: rgba(
    232,
    220,
    192,
    0.75
  ); /* dérivé DS (parchemin atténué) — texte secondaire */
  --focus-ring: 0 0 0 3px rgba(217, 164, 65, 0.3);
}
```

**Règle** : toute couleur nommée du DS (Encre, Or, Or clair, Parchemin, Sang, Souffle, Cendre, Encre manuscrite) est reprise en hex strictement identique. `--gold-dark` (sans équivalent nommé dans le DS) est dérivé d'une opacité de `rgba(217,164,65,*)` déjà présente dans le bundle DS (bordures, bronze ancien) plutôt que d'un hex inventé — aucune couleur du site ne doit provenir d'une valeur hors DS.

> **Nettoyage 2026-07** : `--ash`, `--parchment-dim`, `--muted`, `--shadow-gold` retirés de `globals.css` (0 usage réel dans `apps/frontend/src`). Si un besoin futur de fond secondaire ou de texte muted apparaît, les réintroduire à ce moment plutôt que de les garder morts.

Exposées comme utilities Tailwind via `@theme inline` : `bg-void`, `text-gold`, `text-gold-soft`, `text-parchment`, `text-blood`, `text-soul`, `text-cendre` (et leurs équivalents `bg-*`/`border-*`).

---

## Typographie

Chargées dans `app/layout.tsx` via `next/font/google` :

| Variable CSS        | Font                                    | Usage                                                                                                                         |
| ------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--font-display`    | **Cinzel** 500/600/700                  | Titres, chapitres, logo                                                                                                       |
| `--font-serif`      | **EB Garamond** 400/500/600 + italic    | Narration MJ, prose, dialogue                                                                                                 |
| `--font-accent`     | **Cormorant Garamond** 400-700 + italic | Accents éditoriaux, citations                                                                                                 |
| `--font-ui`         | **Alegreya Sans** 300/400/500/700       | UI chrome (boutons, stats, nav, labels)                                                                                       |
| `--font-manuscript` | **Caveat** 400/500                      | Notes manuscrites — var CSS brute, consommée via `var(--font-manuscript)` (ex. `card.css`), pas exposée comme classe Tailwind |

Exposées en Tailwind (`@theme inline`) : `font-display`, `font-serif`, `font-accent`, `font-ui`.

> **Nettoyage 2026-07** : `--font-hero` (TC Brookleigh) retiré. La police locale a été entièrement supprimée du projet (chargement `localFont` dans `layout.tsx`, fichier `apps/frontend/src/app/_fonts/tc-brookleigh-rough.ttf`) — 0 usage réel, résidu de l'ancien design system. L'asset source reste archivé dans `docs/private/assets/font/` si une réintégration future est décidée.

---

## Échelle typographique (type-scale)

Tokens pixel-perfect du Design System, exposés via `@theme inline` dans `globals.css` (syntaxe Tailwind v4 `--text-<name>` + suffixes `--line-height`/`--letter-spacing`) :

| Token Tailwind         |  Taille | Line-height | Letter-spacing | Rôle                                         |
| ---------------------- | ------: | ----------: | -------------: | -------------------------------------------- |
| `text-h1`              |    72px |        1.05 |         0.06em | Titre héros (H1), `font-display`             |
| `text-h2`              |    44px |        1.15 |              — | Titres de section, `font-accent`             |
| `text-accroche`        |    26px |           — |              — | Accroche italique, `font-accent`             |
| `text-body-editorial`  | 18→24px |         1.6 |              — | Corps de prose (source unique), `font-serif` |
| `text-ui`              |    16px |         1.6 |              — | UI/labels courts, `font-ui`                  |
| `text-card-num`        |    40px |           — |              — | Numéro de card, `font-display` (600)         |
| `text-card-title`      |    25px |           — |              — | Titre de card, `font-accent` (500)           |
| `text-card-manuscript` |    24px |           — |              — | Insert manuscrit de card, `font-manuscript`  |
| `text-stat-label`      |    17px |           — |         0.16em | Label de jauge stat, `font-display`          |
| `text-stat-value`      |    20px |           — |              — | Valeur de jauge stat, `font-accent`          |
| `text-btn-primary`     |    26px |           — |              — | Bouton primaire, `font-accent` (500)         |
| `text-btn-secondary`   |    27px |           — |              — | Bouton secondaire (CTA gameplay)             |

Usage : combiner avec le token de police correspondant, ex. `className="font-display text-h1 font-medium"`. La plupart des tokens sont fluides (`clamp(min, vw+base, max)`) et portent leur propre responsif — inutile d'ajouter des breakpoints px pour la taille.

**Une utility = un rôle.** Consommer les utilities `text-*` + `font-*` dans le TSX ; ne **jamais** poser de `font-size`/`font-family`/`line-height` de corps en dur dans un CSS de section. Les CSS colocalisés (`section-*.css`) ne portent plus que layout / couleur / spacing pour ces rôles. En particulier, le corps de prose de la landing = **`font-serif text-body-editorial`** partout (Hero, Gameplay, Monde, piliers) — source unique, jamais surchargée.

> **Nettoyage 2026-07** : `text-manuscript`, `text-nav-brand`, `text-nav-item` retirés de `@theme inline` (0 usage réel dans `apps/frontend/src`).

---

## Animations

Exposées via `@theme inline` (syntaxe Tailwind v4 `--animate-<name>` + `@keyframes` associé dans le même bloc) :

| Token Tailwind             | Durée                    | Rôle                                                                  |
| -------------------------- | ------------------------ | --------------------------------------------------------------------- |
| `animate-gold-pulse`       | 2.4s ease-in-out, boucle | Lueur pulsante dorée (`box-shadow`), état actif d'un marqueur/élément |
| `animate-shiny-text-multi` | 8s ease-in-out, boucle   | Reflet qui traverse un texte (background-position animé)              |

Usage `animate-gold-pulse` avec variante arbitraire, ex. dans [`section-progress.tsx`](../../../apps/frontend/src/components/ui/section-progress.tsx) : `className="section-progress__diamond [.is-active_&]:animate-gold-pulse"` — l'animation ne se déclenche que lorsque l'ancêtre porte la classe `is-active`. Respecte automatiquement `prefers-reduced-motion` via la règle globale `@media (prefers-reduced-motion: reduce)` dans `globals.css`.

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

// Texte secondaire atténué (via var() — pas de classe Tailwind dédiée)
<p className="font-serif italic" style={{ color: 'var(--ink-2)' }}>

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
