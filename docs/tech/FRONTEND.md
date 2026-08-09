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

**Règle** : toute couleur nommée du DS (Encre, Or, Or clair, Parchemin, Sang, Souffle, Cendre,
Encre manuscrite) est reprise en hex strictement identique. `--gold-dark` (sans équivalent nommé
dans le DS) est dérivé d'une opacité de `rgba(217,164,65,*)` déjà présente dans le bundle DS
(bordures, bronze ancien) plutôt que d'un hex inventé — aucune couleur du site ne doit provenir
d'une valeur hors DS.

> **Nettoyage 2026-07** : `--ash`, `--parchment-dim`, `--muted`, `--shadow-gold` retirés de
> `globals.css` (0 usage réel dans `apps/frontend/src`). Si un besoin futur de fond secondaire ou
> de texte muted apparaît, les réintroduire à ce moment plutôt que de les garder morts.

Exposées comme utilities Tailwind via `@theme inline` : `bg-void`, `text-gold`, `text-gold-soft`,
`text-parchment`, `text-blood`, `text-soul`, `text-cendre` (et leurs équivalents `bg-*`/`border-*`).

### Typographie

Chargées dans `app/layout.tsx` via `next/font/google` :

| Variable CSS        | Font                                    | Usage                                                                                                                         |
| ------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--font-display`    | **Cinzel** 500/600/700                  | Titres, chapitres, logo                                                                                                       |
| `--font-serif`      | **EB Garamond** 400/500/600 + italic    | Narration MJ, prose, dialogue                                                                                                 |
| `--font-accent`     | **Cormorant Garamond** 400-700 + italic | Accents éditoriaux, citations                                                                                                 |
| `--font-ui`         | **Alegreya Sans** 300/400/500/700       | UI chrome (boutons, stats, nav, labels)                                                                                       |
| `--font-manuscript` | **Caveat** 400/500                      | Notes manuscrites — var CSS brute, consommée via `var(--font-manuscript)` (ex. `card.css`), pas exposée comme classe Tailwind |

Exposées en Tailwind (`@theme inline`) : `font-display`, `font-serif`, `font-accent`, `font-ui`.

> **Nettoyage 2026-07** : `--font-hero` (TC Brookleigh) retiré. La police locale a été entièrement
> supprimée du projet (chargement `localFont` dans `layout.tsx`, fichier
> `apps/frontend/src/app/_fonts/tc-brookleigh-rough.ttf`) — 0 usage réel, résidu de l'ancien design
> system. L'asset source reste archivé dans `docs/private/assets/font/` si une réintégration future
> est décidée.

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

- Titres : `--font-display` (Cinzel).
- Prose : `--font-serif` (EB Garamond).
- Accents éditoriaux et boutons : `--font-accent` (Cormorant Garamond).
- Labels, champs, aides et HUD : `--font-ui` (Alegreya Sans).

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

### HUD de session partagé

`features/game-session/components/GameSessionHud.tsx` possède la structure responsive commune du
footer de jeu. Il ne connaît aucun univers et reçoit uniquement quatre groupes de props :

- `statusBars` : ressources principales sous forme de barres ;
- `statusGauges` : états secondaires sous forme de jauges ;
- `resource` : monnaie ou ressource ponctuelle, optionnelle ;
- `tools` : raccourcis vers inventaire, fiche, menu ou outils propres à l'univers.

Chaque monde conserve un adaptateur local. Par exemple, `VelkharSurvivalHud` transforme SANG,
SOUFFLE, CENDRE, faim, soif, fatigue et Calamine en configuration de `GameSessionHud`. Un autre
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

Les assets runtime sont servis depuis `public/ui-kit/`. Les masters, prompts et planches de
contrôle restent privés dans `docs/private/`. Les WebP runtime sont transparents et dimensionnés
pour leur usage réel, avec une définition Retina pour les icônes.

Organisation :

```txt
public/ui-kit/
  avatars/
  brand/
  controls/
  dividers/
  icons/
  panels/
  stepper/
  surfaces/
  vocations/
```

Les cadres actuels des boutons sont `button-dark-frame-v2.webp`, `cta-gold-frame.webp` et
`button-icon-frame.webp`. Le panel, la narration et les zones de structure réemploient
`structural-frame-v2.webp`. Ce cadre 9-slice ne contient ni flèche, ni diamant, ni séparateur
interne. Il habille les panels sombres, la narration, la barre haute, le dock d'étapes et le
footer HUD avec un langage unique. Le parchemin, les boutons et les champs conservent leurs cadres
dédiés pour respecter leurs proportions.

Le cadre des champs utilise `game-input-frame-v2.webp`. Il est rendu en 9-slice avec
`border-image` afin de préserver les angles gravés lorsque la largeur du champ varie. Les textes
et icônes restent des éléments HTML indépendants ; aucun contenu n'est incrusté dans le master.

Les éléments consolidés depuis la landing sont copiés et optimisés dans cette arborescence. Les
chemins historiques de la landing ne sont ni déplacés ni modifiés tant qu'une migration séparée
n'est pas explicitement demandée.

### Preview et validation

En développement, `/ui-kit-preview` présente les familles, variantes, états et trois compositions
de référence : création de personnage, hub narratif et session de jeu. Les ancres `#proof-form`,
`#proof-hub` et `#proof-session` isolent chaque composition pour la QA.

Le Hub et la Session utilisent des scènes propres dans `public/scenes/`. Ces images ne contiennent
aucun texte ni élément d'interface : le rail de dialogue, les souvenirs, la narration, les actions
et le HUD restent des composants HTML réels. La géométrie desktop suit les mockups de référence
(Hub en grille 69/31, Session en superposition cinématique avec HUD bas) tandis que la déclinaison
mobile privilégie la lisibilité et l'absence de chevauchement.

La route retourne une 404 en production. Aucun dossier `storybook-static` ne doit être versionné ;
Storybook pourra être ajouté plus tard comme dépendance de développement si son coût de
maintenance devient justifié.

Les validations obligatoires sont : type-check, lint, tests Vitest, build Next, contrôle
alpha/dimensions/poids et inspection visuelle aux breakpoints mobile et desktop.
