# Encre de Sel — design system

La référence écrite. La planche visuelle vit sur `/design-system` (dev uniquement).

**La règle qui tient tout le reste :** un composant n'écrit jamais une valeur littérale.
Ni un hexadécimal, ni une police, ni une durée. Il lit un token. Une couleur écrite deux
fois est une couleur qui finira par diverger d'elle-même.

---

## Où vivent les choses

| Fichier                       | Rôle                                                                    |
| ----------------------------- | ----------------------------------------------------------------------- |
| `src/styles/tokens.css`       | **Source unique.** Toute valeur y est déclarée, et nulle part ailleurs. |
| `src/styles/tokens.ts`        | Miroir TypeScript : les _noms_, pour l'autocomplétion et GSAP.          |
| `src/app/globals.css`         | Importe les tokens, puis les ré-expose à Tailwind via `@theme inline`.  |
| `public/design-system/`       | Les SVG (filets, cadres, ornements, grain), utilisables hors React.     |
| `src/components/ui/grimoire/` | L'UI kit partagé.                                                       |

### Le piège Tailwind

`@theme inline` dans `globals.css` ne ré-exporte qu'un **sous-ensemble** des tokens.
Ajouter un token dans `tokens.css` ne crée donc **pas** d'utilitaire Tailwind : il faut
le recopier dans `@theme inline` si on en veut un.

### Le piège GSAP

GSAP n'accepte `var()` ni pour une durée, ni pour une courbe. D'où deux miroirs dans
`tokens.ts`, gardés adjacents à leur équivalent CSS pour qu'une divergence saute aux yeux :

```ts
import { seconds, easeGsap } from '@/styles/tokens'

gsap.to(el, { opacity: 1, duration: seconds.ui, ease: easeGsap.out })
```

C'est la **seule** duplication de valeur tolérée dans le projet.

---

## 1. Tokens

### Matières → rôles

Deux étages. Les **matières** nomment ce que la chose est (`--material-gold`), les
**rôles** nomment ce à quoi elle sert (`--gold`). **Un composant consomme un rôle**,
jamais une matière : c'est ce qui permet de retoucher la palette sans ouvrir un seul
composant.

```css
/* ✅ */
color: var(--gold);
/* ❌ */
color: var(--material-gold);
/* ❌ */
color: #c9a227;
```

### Jauges de survie

Une couleur par ressource, jamais réemployée ailleurs — ici la teinte **est**
l'information, pas une décoration.

| Token            | Ressource   |
| ---------------- | ----------- |
| `--fresh-blood`  | Sang        |
| `--dried-blood`  | Sang épuisé |
| `--breath-aqua`  | Souffle     |
| `--hunger-ochre` | Faim        |
| `--thirst-salt`  | Soif        |
| `--calamine`     | Calamine    |

### Typographie

Deux échelles, qui ne se mélangent pas :

- `--text-game-*` — in-game : scènes, HUD, dialogues.
- `--text-*` — éditorial : landing, pages marketing.

Toutes sont fluides (`clamp(min mobile, vw + base, max desktop)`). Il n'y a donc
**aucun palier en px à surcharger en media query** : la taille s'interpole toute seule.

### Mouvement

Quatre durées, pas une de plus.

| Token           | Durée  | Pour quoi              |
| --------------- | ------ | ---------------------- |
| `--motion-fast` | 160 ms | Survol, pression       |
| `--motion-ui`   | 220 ms | Ouverture d'un panneau |
| `--motion-step` | 280 ms | Passage d'une étape    |
| `--motion-page` | 650 ms | Voile de navigation    |

Deux courbes : `--ease-grimoire-out` (la courbe par défaut du projet — sortie franche,
repos long) et `--ease-grimoire-standard` (déplacement neutre, qui ne doit pas se
remarquer). Une transition qui n'entre dans aucune de ces quatre durées est
probablement une transition de trop.

### Interactions textuelles

| Token                      | Rôle                                               |
| -------------------------- | -------------------------------------------------- |
| `--link-hover-color`       | Couleur d'un lien textuel au survol                |
| `--link-hover-shadow`      | Halo discret d'un lien textuel au survol           |
| `--link-hover-translate-x` | Déplacement horizontal d'un lien textuel au survol |

---

## 2. Primitives

### `GameDivider` — les filets

```tsx
<GameDivider variant="diamond" />
```

`variant` : `simple` · `diamond` · `ornate` · `celestial` · `auberge`
`orientation` : `horizontal` · `vertical` — `size` : `sm` · `md` · `lg`

Porte `role="separator"` et `aria-orientation` : c'est un séparateur déclaré, pas un
trait décoratif.

### `GameOrnament` — le veilleur

```tsx
<GameOrnament name="watcher" size="md" decorative />
```

`decorative` et `label` sont **exclusifs** (union discriminée) : soit l'ornement est
décoratif et se retire de l'arbre d'accessibilité, soit il porte un label. Il n'y a pas
de troisième cas, et le type l'interdit.

### `HudFrame` — les cadres

```tsx
<HudFrame variant="diamond" active>
  …
</HudFrame>
```

`variant` : `horizontal` · `circular` · `portrait` · `diamond`

### Les fichiers SVG

`public/design-system/` — pour les usages hors React (`background-image`, `mask`) :

```
dividers/   divider-simple · divider-diamond · divider-ornate · divider-celestial
frames/     frame-corners · frame-diamond
ornaments/  ornament-watcher
textures/   grain
```

Tous sont dessinés en `currentColor`. Ils **héritent** donc de la couleur de leur
contexte au lieu de figer un hexadécimal — la règle « jamais de couleur en dur »
s'applique aussi à l'intérieur d'un SVG.

---

## 3. Composants

### `GameButton`

```tsx
<GameButton variant="primary" tone="gold" size="md">Commencer</GameButton>
<GameButton loading>Chargement</GameButton>
```

| Prop                           | Valeurs                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `variant`                      | `primary` `secondary` `ghost` `icon` `cinematic` `radiant` `landing` `landing-ghost` `landing-gameplay` |
| `tone`                         | `gold` `danger` `aqua` `ember`                                                                          |
| `size`                         | `sm` `md` `lg`                                                                                          |
| `loading`                      | pose `aria-busy` et affiche le spinner                                                                  |
| `leadingIcon` / `trailingIcon` | `ReactNode`                                                                                             |

Les variantes `landing-*` sont réservées à la landing éditoriale — ne pas les employer
in-game.

### `GamePanel` / `GameSurface`

`GameSurface` est la surface nue (`card` · `stats` · `parchment`).
`GamePanel` est la surface encadrée, avec ton et ornement :

```tsx
<GamePanel variant="main" tone="gold" ornament="diamond" padding="md">
  …
</GamePanel>
```

`variant` : `main` `sidebar` `compact` `header` `footer` `form-frame` `aside-frame`
`dialogue-frame` `narrative-frame` — `padding` : `none` `sm` `md` `lg`

### `StatBar` / `GameProgressRing`

```tsx
<StatBar label="Sang" value={7} max={10} tone="danger" />
<GameProgressRing label="Calamine" value={3} max={10} tone="ember" />
```

`label`, `value` et `max` sont **obligatoires** : une jauge sans libellé n'est pas
lisible au lecteur d'écran.

### `GameIcon`

```tsx
<GameIcon name="eye" size={32} decorative />
```

`size` est une union fermée : `24 | 32 | 48 | 64 | 96`. Pas de taille intermédiaire —
les glyphes sont dessinés pour ces paliers. La liste des 40 noms fait foi dans
`GAME_ICON_NAMES`.

---

## 4. Règles

1. **Jamais de littéral.** Couleur, police, durée : un token, toujours.
2. **Un rôle, pas une matière.** `var(--gold)`, pas `var(--material-gold)`.
3. **Ne pas modifier l'UI kit partagé** depuis une route. `components/ui/grimoire/`
   appartient à tout le jeu : le toucher pour un besoin local casse ailleurs.
4. **Responsive en CSS**, jamais via un hook JS.
5. **Code et naming en anglais**, copy affichée en français.
6. **Nommage** — `components/ui/` : fichiers plats kebab-case, exportés depuis
   `index.ts`. `app/(route)/_components/` : dossier PascalCase + `NomDuComposant.tsx`
   (jamais `index.tsx`) + CSS colocalisé `nom-du-composant.css`.

---

## Pages

- `/design-system` — cette référence, en visuel. Dev uniquement.
- `/ui-kit-preview` — **legacy**. Planche de contact exhaustive, conservée telle quelle.
