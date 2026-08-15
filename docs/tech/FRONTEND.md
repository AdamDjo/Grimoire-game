---
type: frontend
visibility: public
rag: true
source_of_truth: true
---

# Frontend — architecture, tokens et UI Kit

Document unique du domaine frontend : **où poser un fichier**, **avec quels tokens le styler**,
**quel composant réutiliser**. Le canon de gameplay reste dans `docs/canon/` ; ici on ne décrit que
la couche visible.

> **Règle absolue de style** : ne jamais hard-coder une couleur ou une police. Toujours passer par
> les tokens ci-dessous (variables CSS ou utilities Tailwind).

---

## 1. Architecture

### Objectif

Le frontend doit rester simple à parcourir tout en permettant à plusieurs univers d'utiliser la
même plateforme et la même boucle de jeu.

Un concept ne possède qu'un emplacement principal :

- un monde se trouve sous sa route `app/(game)/<world>/` ;
- une fonctionnalité partagée se trouve sous `features/` ;
- une primitive visuelle se trouve sous `components/ui/` ;
- un shell ou état global se trouve sous `components/system/`.

### Structure

```text
apps/frontend/src/
├── app/
│   ├── (game)/
│   │   └── velkhar/
│   │       ├── (main)/
│   │       │   ├── aveugle/
│   │       │   ├── campaign/
│   │       │   ├── character-create/
│   │       │   └── world/
│   │       ├── _components/
│   │       ├── _config/
│   │       └── session/
│   ├── (home)/
│   └── (main)/
├── components/
│   ├── system/
│   └── ui/
├── config/
├── features/
├── hooks/
├── lib/
└── stores/
```

Les route groups comme `(game)` et `(main)` n'apparaissent pas dans les URLs.

### Règles de placement

**Une seule route** — le composant reste colocalisé :

```text
app/(game)/velkhar/(main)/aveugle/_components/
```

**Plusieurs routes du même monde** — le composant remonte dans le dossier privé du monde :

```text
app/(game)/velkhar/_components/
```

Exemples : Calamine, jauges de survie ou emblèmes de vocation.

**Plusieurs mondes** — le comportement partagé va dans une feature :

```text
features/game-session/
```

Exemples : contrôleur de session ; API de session ; narration ; choix ; résultat de dé ;
conséquences ; états de session.

**Sans connaissance métier** — la primitive va dans `components/ui/`.

Exemples : bouton ; panneau ; champ ; fenêtre accessible ; barre ou anneau de progression ;
layout de scène.

**Infrastructure globale** — les navigations, shells, pages système et limites de plateforme vont
dans `components/system/`.

### Direction des dépendances

```text
app
  ↓
features et composants propres au monde
  ↓
components/ui
  ↓
lib sans métier
```

Contraintes :

- `features/` ne doit jamais importer `app/`.
- `components/ui/` ne doit importer ni route, ni feature, ni store métier.
- une feature partagée ne connaît aucun canon.
- un monde ne doit pas importer les composants d'un autre monde.
- les routes et destinations publiques sont centralisées dans `config/worlds.ts`.

ESLint protège les deux premières règles avec `no-restricted-imports`.

### Personnalisation visuelle

Un monde ne duplique pas un composant lorsque seules changent : l'image de fond ; la texture ;
la couleur ; la police ; le texte ; le contenu injecté ; une variante structurelle limitée.

Utiliser en priorité :

1. les props métier ;
2. les slots React ;
3. les variantes génériques ;
4. les variables CSS du thème.

Éviter les composants possédant une longue liste de props purement décoratives.

### Nommage

- Composant partagé : `DiceRoll`, `GameWindow`, `NarrativePanel`.
- Composant propre au monde : `VelkharSession`, `VelkharSurvivalHud`.
- Éviter `Panel.tsx` ou `Hud.tsx` seuls dans un dossier de monde.
- Un test reste près du comportement qu'il couvre.

### Univers et campagnes

Un univers est du code et une configuration :

```text
app/(game)/velkhar/
```

Une campagne est une donnée utilisant cet univers :

```text
/velkhar/campaign/[id]
```

Ne jamais créer un dossier de code par campagne.

---

## 2. Tokens

### Palette

La palette **Encre de Sel** (#272 / PR #277) nomme des **matières et des états diégétiques**, pas
des rôles d'interface génériques. Implémentée dans `apps/frontend/src/app/globals.css` :

```css
:root {
  /* Encre de Sel — matières, pas de couleurs SaaS génériques. */
  --ink-black: #050403; /* fond principal */
  --ink-raised: #0c0a08; /* surface surélevée */
  --salt-white: #e9dfc9; /* texte primaire */
  --salt-muted: #b9aa8e; /* texte secondaire */
  --material-gold: #bd7b26; /* accent principal, CTA */
  --material-gold-bright: #e0a143; /* hover, lueur */
  --material-gold-dim: #765021; /* or éteint */
  --dried-blood: #6d211b; /* sang séché */
  --fresh-blood: #bd3024; /* stat Sang */
  --breath-aqua: #43aaa3; /* stat Souffle */
  --hunger-ochre: #d19428; /* stat Faim */
  --thirst-salt: #d8d0c0; /* stat Soif */
  --calamine: #c2872d; /* Calamine */
  --line-gold: color-mix(in srgb, var(--material-gold) 72%, transparent);
  --ink-on-paper: #241a12; /* texte sur matière claire */
}
```

**Règle** : un nouveau composant consomme **uniquement** les tokens de matière ci-dessus.

Les anciens noms (`--void`, `--parchment`, `--gold`, `--blood`, `--soul`, `--cendre`,
`--ink-manuscript`, `--border-gold`) subsistent dans `globals.css` mais **ne sont plus que des
alias** pointant vers un token de matière — `--void: var(--ink-black)`, `--cendre:
var(--hunger-ochre)`, etc. Toute l'application rend donc déjà la palette Encre de Sel ; les alias
existent pour éviter une réécriture massive des feuilles existantes, pas pour être réutilisés.
**Ne jamais en introduire un nouveau, ne jamais leur redonner un hex propre.**

Les dérivés opacifiés passent par `color-mix(in srgb, …)` plutôt que par un `rgba()` recopié à la
main : la teinte source reste unique et une correction de `--material-gold` se propage seule.

Exposées comme utilities Tailwind via `@theme inline` : `bg-void`, `text-gold`, `text-gold-soft`,
`text-parchment`, `text-blood`, `text-soul`, `text-cendre` (et leurs équivalents `bg-*`/`border-*`).

### Typographie

**Deux familles seulement**, chargées dans `app/layout.tsx` via `next/font/google` :

| Police source               | Variable Next         | Poids           |
| --------------------------- | --------------------- | --------------- |
| **IM Fell French Canon SC** | `--next-font-display` | 400             |
| **Alegreya**                | `--next-font-text`    | 400/500/600/700 |

Les variables applicatives s'y branchent :

| Variable CSS        | Source                  | Usage                                     |
| ------------------- | ----------------------- | ----------------------------------------- |
| `--font-display`    | IM Fell French Canon SC | Titres gravés, lieux, chapitres           |
| `--font-serif`      | Alegreya                | Narration, dialogue, texte éditorial      |
| `--font-accent`     | Alegreya                | Accents, citations, boutons               |
| `--font-ui`         | Alegreya                | Navigation, champs, labels, HUD           |
| `--font-manuscript` | Alegreya                | Notes et textes courts sur matière claire |

Quatre des cinq variables pointent donc vers la même famille : elles restent distinctes pour que
les composants gardent une intention typographique lisible, et pour pouvoir réintroduire une
seconde famille de texte sans toucher aux feuilles de style.

Exposées en Tailwind (`@theme inline`) : `font-display`, `font-serif`, `font-accent`, `font-ui`.

> **Réduction #277** : Cinzel, EB Garamond, Cormorant Garamond, Alegreya Sans et Caveat sont
> sorties du runtime, ainsi que `--font-hero` (TC Brookleigh, police locale). Deux familles
> suffisent à porter l'identité et réduisent le coût de chargement. L'asset TC Brookleigh reste
> archivé dans `docs/private/assets/font/`.

### Échelle typographique (type-scale)

Tokens pixel-perfect du Design System, exposés via `@theme inline` dans `globals.css` (syntaxe
Tailwind v4 `--text-<name>` + suffixes `--line-height`/`--letter-spacing`) :

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

Usage : combiner avec le token de police correspondant, ex.
`className="font-display text-h1 font-medium"`. La plupart des tokens sont fluides
(`clamp(min, vw+base, max)`) et portent leur propre responsif — inutile d'ajouter des breakpoints
px pour la taille.

**Une utility = un rôle.** Consommer les utilities `text-*` + `font-*` dans le TSX ; ne **jamais**
poser de `font-size`/`font-family`/`line-height` de corps en dur dans un CSS de section. Les CSS
colocalisés (`section-*.css`) ne portent plus que layout / couleur / spacing pour ces rôles. En
particulier, le corps de prose de la landing = **`font-serif text-body-editorial`** partout (Hero,
Gameplay, Monde, piliers) — source unique, jamais surchargée.

> **Nettoyage 2026-07** : `text-manuscript`, `text-nav-brand`, `text-nav-item` retirés de
> `@theme inline` (0 usage réel dans `apps/frontend/src`).

### Animations

Exposées via `@theme inline` (syntaxe Tailwind v4 `--animate-<name>` + `@keyframes` associé dans le
même bloc) :

| Token Tailwind             | Durée                    | Rôle                                                                  |
| -------------------------- | ------------------------ | --------------------------------------------------------------------- |
| `animate-gold-pulse`       | 2.4s ease-in-out, boucle | Lueur pulsante dorée (`box-shadow`), état actif d'un marqueur/élément |
| `animate-shiny-text-multi` | 8s ease-in-out, boucle   | Reflet qui traverse un texte (background-position animé)              |

Usage `animate-gold-pulse` avec variante arbitraire, ex. dans
[`section-progress.tsx`](../../apps/frontend/src/components/ui/section-progress.tsx) :
`className="section-progress__diamond [.is-active_&]:animate-gold-pulse"` — l'animation ne se
déclenche que lorsque l'ancêtre porte la classe `is-active`. Respecte automatiquement
`prefers-reduced-motion` via la règle globale `@media (prefers-reduced-motion: reduce)` dans
`globals.css`.

### Atmosphère désertique (à répliquer sur tout PageShell)

- `.landing-experience` → radial + linear gradients sombres (encre/fumée), `isolation: isolate`
- `.landing-experience::after` → grain de bruit (gradient + grille 3px), `mix-blend-mode: soft-light`, 38 % opacity
- Particules dorées flottantes — Phase 1A : CSS animation ; Phase 3 : canvas

### Exemples Tailwind récurrents

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

### Principes UI à respecter

- **Snap scroll** sur la landing et les écrans pleine page
- **Cursor doré custom** (cf. landing actuelle)
- **Accessibilité 100 %** : `aria-label`, `aria-current`, `role="banner/contentinfo"`
- **SSR safe** : particules + valeurs random uniquement dans `useEffect` (jamais `useRef(Math.random())`)
- **Composants `ui/`** prop-based, `_components/` colocalisés par route

---

## 3. UI Kit

Le UI Kit Grimoire est la bibliothèque visuelle globale de l'application. Une primitive unique
couvre chaque besoin grâce à des variantes typées et des états CSS. Les pages ne doivent pas créer
leur propre bouton, champ, panel ou icône.

### Import

```tsx
import {
  GameButton,
  GameField,
  GameIcon,
  GamePanel,
  StatBar,
} from "@/components/ui";
```

### Catalogue

| Famille           | Composants                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| Identité          | `GameBrand` (`lockup`, `sigil`), `GameOrnament` (`watcher`)                                                   |
| Primitives        | `GameButton`, `GamePanel`, `GameSurface`, `GameInput`, `GameDivider`, `GameIcon`, `GameAvatar`, `GameStepper` |
| Formulaires       | `GameField`, `GameTextarea`, `GameSearchInput`                                                                |
| HUD               | `StatBar`, `HudFrame`, `CalamineMeter`, `SurvieGauge`                                                         |
| Métier            | `VocationCard`, `VocationEmblem`                                                                              |
| Narration         | `GameSectionHeading`, `NarrativePassage`, `DialogueChoice`, `DialogueChoiceGroup`, `NarrativeComposer`        |
| HUD avancé        | `GameProgressRing`, `ResourceCounter`, `GameHudDock`                                                          |
| Inventaire        | `InventorySlot`, `InventoryQuickbar`                                                                          |
| Identité de scène | `PlayerIdentity`, `LocationIdentity`, `MemoryBadge`                                                           |
| Structure         | `GameTopBar`, `GameStepDock`, `GameSceneLayout`                                                               |

`GameIcon` expose `GAME_ICON_NAMES`, la liste typée des 40 icônes disponibles. Une icône doit
recevoir soit `label`, soit `decorative`.

`VocationEmblem` expose les quatre sceaux canoniques `marcheur-du-sel`, `lame-ombre`, `veilleur`
et `tisse-verbe`. Ils restent compacts, sans personnage ni scène, et sont disponibles en 64, 96 et
128 px.

`GameDivider` expose les variantes CSS `simple`, `diamond`, `ornate` et les variantes illustrées
`celestial`, `auberge`. `GameSurface` centralise les cadres `card`, `stats` et `parchment`.
`GameButton` reste l'unique famille de bouton.

### Boutons

Le catalogue expose deux langages visuels, plus leur déclinaison carrée pour les actions sans
texte :

| Langage      | Variantes API                     | Usage                                         |
| ------------ | --------------------------------- | --------------------------------------------- |
| Cadre sombre | `secondary`, `cinematic`, `ghost` | action courante, choix narratif, CTA sombre   |
| Cadre doré   | `primary`, `radiant`              | validation et action prioritaire              |
| Action icône | `icon`                            | action compacte avec `aria-label` obligatoire |

Les icônes de début et de fin sont optionnelles via `leadingIcon` et `trailingIcon`. Aucun
pictogramme n'est incrusté dans le master du bouton. Les états hover, focus, pressed, disabled et
loading réutilisent le même asset et sont exclusivement pilotés en CSS.

### Principes d'usage

- Utiliser les variantes du composant existant avant d'ajouter une nouvelle API.
- Garder hover, focus, pressed, disabled, loading et error dans les feuilles CSS.
- Ne jamais importer les masters haute définition dans le runtime.
- Composer les éléments métier à partir des primitives ; ne pas recopier leur CSS.
- Fournir des libellés accessibles et conserver les éléments HTML natifs.

### Application des tokens aux composants

- Titres : `--font-display` (IM Fell French Canon SC).
- Prose, accents, boutons, labels, champs et HUD : `--font-serif`, `--font-accent` et `--font-ui`
  (Alegreya).

Échelle appliquée aux composants :

| Rôle                     | Token ou taille                      |
| ------------------------ | ------------------------------------ |
| Titre de section / carte | `--text-card-title`                  |
| Prose de surface         | `--text-body-editorial`              |
| Label de champ           | `--text-ui` (16 px)                  |
| Saisie                   | 17–19 px fluide, `--font-ui`         |
| Label HUD                | `--text-stat-label` (17 px)          |
| Valeur HUD               | `--text-stat-value` (20 px)          |
| CTA principal            | jusqu'à `--text-btn-primary` (26 px) |

Les bordures structurelles restent dorées sur toutes les familles. Les couleurs Sang, Souffle et
Cendre communiquent un état ou une valeur, mais ne remplacent pas le contour doré de la surface.

`GameInput` et `GameTextarea` partagent la même progression visuelle : repos, halo doré discret au
hover, accent renforcé au focus, traitement rouge en erreur et désaturation en disabled. Les
transitions sont ciblées et supprimées lorsque `prefers-reduced-motion` est actif.

Pour les contrôles composés, l'indicateur de focus appartient exclusivement à la surface
englobante (`focus-within`). L'input ou le textarea natif interne ne doit jamais ajouter une
seconde outline. En erreur, le rouge garde la priorité sur le doré du focus afin que l'état ne
devienne pas ambigu.

### Authentification

Les routes `login`, `signup` et récupération d'accès ne possèdent pas de copie locale des
primitives. Elles composent le UI Kit global dans le groupe de routes `app/(auth)`, avec un layout
visuel commun et des formulaires accessibles.

---

## 4. Session de jeu

### Layout unifié — `GameSceneLayout`

Depuis #272 / PR #277, le Hub et la Session partagent **un seul** layout :
`components/ui/grimoire/GameSceneLayout`. Il n'existe plus de variantes `sidebar`, `immersive` ni
`centered` — le composant n'expose aucune prop `variant`, seulement cinq emplacements :
`background`, `top`, `scene`, `reader` et `bottom`.

Géométrie réelle (`game-scene-layout.css`, source de vérité) :

- **Desktop** — grille `auto / minmax(0, 1fr) / auto` sur `100dvh`. Le corps est une grille
  `minmax(0, var(--game-scene-reader-start)) minmax(25rem, 42fr)`, soit **58 % scène / 42 %
  reader**, le reader ayant un plancher de `25rem` et son propre scroll.
- **Sous 1120 px** — passage en flux vertical : header compact, scène en
  `clamp(15rem, 34dvh, 23rem)`, reader dans le flux naturel, puis footer.

La séparation scène/reader est portée par `chrome/reader-separator.webp` en desktop et par
`chrome/footer-separator.webp` en mobile. Modifier la géométrie se fait dans le CSS du layout, pas
dans les écrans qui le consomment.

### HUD de session partagé

`features/game-session/components/GameSessionHud.tsx` possède la structure responsive commune du
footer de jeu. Il ne connaît aucun univers et reçoit uniquement quatre groupes de props :

- `statusBars` : ressources principales sous forme de barres ;
- `statusGauges` : états secondaires sous forme de jauges ;
- `resource` : monnaie ou ressource ponctuelle, optionnelle ;
- `tools` : raccourcis vers inventaire, fiche, menu ou outils propres à l'univers.

Chaque monde conserve un adaptateur local. Par exemple, `VelkharSurvivalHud` transforme SANG,
SOUFFLE, VOLONTÉ, faim, soif, fatigue et Calamine en configuration de `GameSessionHud`. Un autre
univers peut fournir PV, bouclier, stress et crédits sans importer le modèle de survie Velkhar.

La structure, les breakpoints et l'accessibilité restent partagés. Les libellés, valeurs, icônes,
tons, nombre de jauges et présence de la monnaie restent configurables par univers.

### Exemple : boucle de session

`features/game-session/hooks/use-game-session.ts` possède :

- création et reprise de session ;
- envoi des actions ;
- erreurs et retry ;
- connexion hors ligne ;
- résultat de dé ;
- inventaire générique ;
- fin de session ;
- conservation de la route de reprise.

Velkhar injecte :

- son type de réponse backend ;
- son état de survie ;
- son réducteur `updatedStats → SurvivalStats` ;
- son HUD ;
- sa fiche de personnage ;
- son thème et son image de scène.

Un futur monde peut réutiliser le contrôleur sans importer un type de personnage Velkhar.

---

## 5. Assets et validation

### Assets

Les assets runtime sont servis depuis **`public/encre-de-sel/`** (#272 / PR #277). Les masters,
prompts et planches de contrôle restent privés dans `docs/private/`. Les WebP runtime sont
transparents et dimensionnés pour leur usage réel, avec une définition Retina pour les icônes.

Organisation :

```txt
public/encre-de-sel/
  chrome/     # header, reader et footer separators, hud-stat-separator, hud-bar-mask
  frames/     # choice-frame-gore, choice-number-plate, action-input-gore,
              # button-primary-gore, button-secondary-ochre, narrative-surface-frame
  icons/      # ressources (blood, breath, hunger, thirst, calamine),
              # outils du footer (inventory-tile, journal-tile, character-tile),
              # saisie (action-quill, action-submit-tile)
    glyphs/   # pictogrammes génériques, consommés par GameIcon
    vocations/
```

`choice-frame-gore.webp`, `action-input-gore.webp` et `narrative-surface-frame.webp` sont rendus en
9-slice via `border-image` : angles, gouttes et empreintes restent fixes pendant que le centre
s'étire sur une ou plusieurs lignes. Chiffres, textes, labels et icônes restent du HTML
accessible — aucun contenu n'est incrusté dans un master.

Les glyphes de `icons/glyphs/` ne sont jamais référencés en dur : ils passent par `GameIcon`, qui
construit le chemin depuis le nom (`/encre-de-sel/icons/glyphs/<name>.webp`).

Les surfaces, panels et boutons génériques s'habillent avec les tokens de matière ; seuls le
header, la séparation lecture/image, le footer et les trois outils permanents utilisent un bitmap
validé, afin de conserver exactement le trait du master.

> **Sorti du runtime en #277** : `structural-frame-v2.webp`, `button-dark-frame-v2.webp`,
> `cta-gold-frame.webp`, `button-icon-frame.webp` et `game-input-frame-v2.webp` — vérifié, zéro
> référence dans `apps/frontend/src`. Le dossier `public/ui-kit/` subsiste sur le disque
> (character-create, brand, dividers, avatars…) mais **plus aucun de ses chemins n'est référencé
> par le code** : le traiter comme un legacy à purger dans un ticket dédié, jamais comme une
> source pour un nouvel écran.

### Preview et validation

En développement, `/ui-kit-preview` présente les familles, variantes, états et trois compositions
de référence : création de personnage, hub narratif et session de jeu. Les ancres `#proof-form`,
`#proof-hub` et `#proof-session` isolent chaque composition pour la QA.

Le Hub et la Session utilisent des scènes propres dans `public/scenes/`. Ces images ne contiennent
aucun texte ni élément d'interface : le rail de dialogue, les souvenirs, la narration, les actions
et le HUD restent des composants HTML réels. Les deux écrans partagent désormais la même géométrie,
celle de `GameSceneLayout` (§ 4) — il n'y a plus de grille propre au Hub ni de superposition
cinématique propre à la Session.

La route retourne une 404 en production. Aucun dossier `storybook-static` ne doit être versionné ;
Storybook pourra être ajouté plus tard comme dépendance de développement si son coût de
maintenance devient justifié.

Les validations obligatoires sont : type-check, lint, tests Vitest, build Next, contrôle
alpha/dimensions/poids et inspection visuelle aux breakpoints mobile et desktop.
