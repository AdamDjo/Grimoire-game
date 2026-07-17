# Plan de production du UI Kit Grimoire — archivé

> Statut : livré par l'issue #93 et la PR #121 le 13 juillet 2026. Conservé pour historique.
> Portée : assainissement des assets, pipeline reproductible, composants React
> réutilisables, Storybook, tests, documentation et migration progressive.
> Contrainte Git : créer les issues avant les branches. Ne pas mélanger ce
> chantier complet avec `feature/92-landing-page`.

## 1. Décision d'architecture

Le UI Kit ne sera pas distribué sous la forme d'un atlas global.

### 1.1 Références visuelles et unicité des composants

Les trois mockups suivants définissent ensemble le langage UI global :

- `docs/private/assets/landing/grimoire_atlas_tools/grimoire_ui_kit/mockup/form.png` ;
- `docs/private/assets/landing/grimoire_atlas_tools/grimoire_ui_kit/mockup/hub2.png` ;
- `docs/private/assets/landing/grimoire_atlas_tools/grimoire_ui_kit/mockup/Gamesession.png`.

Les lots fournissent les masters artistiques. Les mockups montrent différents
contextes d'utilisation du même système ; ils ne créent jamais de familles
spécifiques à une page.

Règle absolue : une seule famille globale par primitive. Il existe un seul
`GameButton`, un seul `GameInput`, un seul `GamePanel`, un seul `GameAvatar`,
un seul `GameStepper`, un seul `GameDivider`, un seul `GameIcon`, un seul
`HudFrame` et un seul `StatBar`. Les différences sont exprimées par des
variantes et états fonctionnels strictement typés, jamais par des composants
`Form*`, `Hub*` ou `Session*` redessinés séparément.

Chaque master doit être réintégré et comparé dans tous les mockups où sa famille
apparaît avant validation. Les assets landing déjà réussis dans
`apps/frontend/public/landing/ui/` fixent le niveau minimal de finition.

La solution retenue est hybride :

- sources artistiques haute définition conservées dans `docs/private/assets/` ;
- exports runtime séparés, redimensionnés et optimisés ;
- WebP avec transparence pour les éléments peints et texturés ;
- SVG ou CSS pour les formes simples, lignes, jauges et états colorables ;
- découpe 3-slice ou 9-slice pour les éléments redimensionnables ;
- composants React typés au-dessus des assets ;
- Storybook pour prévisualiser, documenter et tester les variantes ;
- aucun texte fonctionnel intégré dans une image.

Les sources ne sont jamais consommées directement par l'application. Seuls les
exports générés et validés peuvent être importés par les composants.

## 2. Résultat de l'audit actuel

### 2.1 Poids et structure

- dossier complet : environ 46 Mo ;
- sous-dossier `assets/` : environ 15 Mo ;
- planches `lots/` : environ 21 Mo ;
- plusieurs duplications strictes existent entre la racine et `assets/` ;
- les boutons représentent environ 7 Mo à eux seuls ;
- les panels représentent environ 5 Mo ;
- les lots 9 et 10 sont vides ;
- des fichiers `.DS_Store` doivent être supprimés et ignorés.

### 2.2 Transparence réelle

| Lot | Contenu                     | État alpha                 | Décision                                                       |
| --- | --------------------------- | -------------------------- | -------------------------------------------------------------- |
| 1   | panels et surfaces          | vrai canal alpha           | découpe automatique, puis 9-slice                              |
| 2   | inputs, textarea, recherche | vrai canal alpha           | découpe automatique, puis 3-slice ou 9-slice                   |
| 3   | boutons et boutons icône    | damier incrusté, image RGB | réutiliser les exports RGBA propres et restaurer les manquants |
| 4   | cadres avatar               | damier incrusté, image RGB | repasse IA avec transparence réelle, puis contrôle manuel      |
| 5   | stepper                     | damier incrusté, image RGB | repasse IA ou reconstruction fonctionnelle fidèle              |
| 6   | HUD, cadres et séparateurs  | damier incrusté, image RGB | repasse IA pour les cadres, remplissages en CSS                |
| 7   | séparateurs et ornements    | vrai canal alpha           | découpe automatique, puis 3-slice selon la pièce               |
| 8   | icônes illustrées           | vrai canal alpha           | découpe automatique, tri et nomenclature sémantique            |
| 9   | textures                    | lot vide                   | auditer les trois textures 512 px déjà exportées               |
| 10  | effets                      | lot vide                   | effets en CSS ou GSAP par défaut, pas d'images inutiles        |

Les lots 1, 2, 7 et 8 contiennent des pixels transparents dont le canal RGB
conserve encore une couleur brune. La pipeline devra nettoyer les couleurs
cachées afin d'éviter des franges au redimensionnement et à la compression.

Les lots 3, 4, 5 et 6 ne peuvent pas être rendus transparents avec un simple
`trim`. Le damier visible fait partie des pixels de l'image. Un détourage par
seuil détruirait les reflets blancs, les ombres et certaines arêtes dorées.

### 2.3 Qualité des exports existants

- les états de boutons sont déjà en RGBA et peuvent servir de source de départ ;
- les petites jauges et anneaux HUD sont propres techniquement, mais leur rendu
  est trop simple et ne correspond pas aux planches artistiques ;
- `avatar-frame.png`, `input.png`, les panels et le logo possèdent un fond noir
  RGB réellement incrusté ;
- les SVG existants sont très légers, mais leur langage est plus générique et
  moins détaillé que les planches ;
- le CSS fourni étire actuellement les images avec `background-size: 100% 100%`,
  ce qui déforme les coins et les ornements ;
- le manifeste d'atlas actuel annonce une source 8192 x 8192 alors que l'image
  présente fait 1024 x 1536. Ses coordonnées sont donc obsolètes ;
- `cut_atlas.py` découpe et trim uniquement. Il ne gère ni les fonds incrustés,
  ni les franges, ni les tailles runtime, ni WebP, ni les budgets de poids.

## 3. Catalogue artistique à produire

### Lot 1 : surfaces et panels

Le `GamePanel` utilise un seul master neutre transparent. Les tons, la profondeur,
les états interactifs et les variantes de densité sont pilotés par CSS. Les
ornements comme `eye` ou `diamond` restent des couches indépendantes et ne sont
jamais incrustés dans le bitmap du panel.

Produire des assets canoniques pour :

- panel principal ;
- panel horizontal ;
- panel vertical ou sidebar ;
- panel compact ;
- header et footer décoratifs ;
- ornement central indépendant si nécessaire.

Chaque panel redimensionnable reçoit :

- des coordonnées 9-slice validées ;
- des limites de taille minimale et maximale ;
- un fond de texture séparé du cadre ;
- une zone de contenu sûre documentée ;
- un test visuel aux formats carré, paysage, portrait et mobile.

### Lot 2 : champs de formulaire

Produire :

- input normal ;
- input focus ;
- input disabled ;
- input erreur construit par token, sans nouvelle image complète ;
- textarea ;
- champ de recherche ;
- action carrée de fin de champ.

Les états focus, erreur et disabled doivent rester pilotables par CSS et par les
attributs natifs. On évite une image complète différente pour chaque état quand
un contour, une lumière ou une opacité suffit.

### Lot 3 : boutons

Produire un seul master transparent pour `primary`. Les états `hover`, `pressed`
et `disabled`, ainsi que la variante `secondary`, sont pilotés par CSS : filtre,
opacité, ombre et transform. Une texture séparée n'est autorisée que si une
comparaison visuelle prouve que CSS ne restitue pas correctement la matière.

`ghost` reste sans texture lourde. `icon` réutilise la même famille visuelle avec
une icône React ou SVG dynamique, jamais incrustée dans le bitmap. Les libellés et
icônes restent donc toujours accessibles et modifiables dans le DOM.

### Lot 4 : avatars

Produire quatre cadres réellement transparents :

- normal ;
- actif ;
- hover ou sélection ;
- prestige.

La photo ou l'illustration de personnage reste une image séparée. Le cadre est
une couche décorative au-dessus, et les halos sont une couche CSS contrôlable.

### Lot 5 : stepper

Produire :

- étape inactive ;
- étape active ;
- étape terminée ;
- connecteur inactif ;
- connecteur actif ;
- losange terminal ;
- glyphes de vocation ou de phase séparés du cadre.

Le composant final doit rester lisible à 320 px, accepter un nombre variable
d'étapes et fournir une version compacte verticale sur mobile.

### Lot 6 : HUD

Produire :

- un cadre de jauge horizontal redimensionnable ;
- un cadre circulaire ;
- un cadre de portrait avec barre ;
- un cadre losange ;
- des séparateurs fins.

Les remplissages sang, souffle et cendre seront générés par CSS. Une seule image
de cadre est nécessaire. Cela permet d'animer la valeur sans étirer un bitmap et
de conserver les tokens `--blood`, `--soul` et `--cendre`.

### Lot 7 : séparateurs et ornements

Extraire et classer :

- séparateurs horizontaux courts, moyens et longs ;
- séparateur vertical ;
- coin ;
- losanges ;
- ornements de terminaison ;
- cadres étroits réutilisables.

Les lignes simples seront en SVG ou CSS. Les ornements peints resteront en WebP.
Les éléments longs utilisent 3-slice afin de ne pas étirer le motif central.

### Lot 8 : icônes illustrées

Les planches contiennent des illustrations, pas de simples glyphes. Elles seront
traitées comme une famille `GameIcon`, avec des noms sémantiques et non des
numéros : `book`, `key`, `scroll`, `potion`, `chest`, `coins`, `lock`, `fire`,
`water`, `wind`, `moon`, `crown`, `hourglass`, `warning`, etc.

Règles :

- retirer les doublons et choisir une seule représentation canonique ;
- conserver seulement les icônes ayant un usage produit identifié ;
- exports 1x et 2x pour des tailles cibles 32, 48, 64 et 96 px ;
- texte alternatif obligatoire si l'icône porte du sens ;
- `aria-hidden` si elle est purement décorative ;
- ne pas convertir automatiquement ces illustrations détaillées en SVG.

### Lots 9 et 10

- vérifier si `stone`, `gold` et `black-metal` sont réellement raccordables ;
- produire une version seamless uniquement si une répétition est visible ;
- réserver les effets à CSS, gradients, ombres, masques ou GSAP ;
- n'ajouter une texture d'effet que si une comparaison visuelle prouve sa valeur.

## 4. Pipeline d'assets reproductible

### 4.1 Organisation cible

```txt
docs/private/assets/ui-kit/
  sources/                 # planches et masters lossless
  restored/                # résultats transparents validés
  manifests/               # coordonnées, slices, tailles et métadonnées
  qa/                      # planches de contrôle générées

scripts/ui-kit/
  build-assets.mts
  check-assets.mts
  manifest.schema.ts

apps/frontend/src/assets/ui-kit/generated/
  panels/
  controls/
  avatars/
  stepper/
  hud/
  decorations/
  icons/
  textures/
  asset-map.ts
```

Les fichiers de `generated/` ne sont jamais édités à la main.

### 4.2 Manifeste par asset

Chaque entrée doit définir :

```ts
interface UiAssetManifestEntry {
  name: string;
  source: string;
  crop: { x: number; y: number; width: number; height: number };
  trimThreshold: number;
  padding: number;
  outputs: Array<{ width: number; density: 1 | 2 }>;
  format: "webp" | "png" | "svg";
  quality?: number;
  alphaQuality?: number;
  slice?: { top: number; right: number; bottom: number; left: number };
  safeContentInset?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  sourceHash: string;
}
```

### 4.3 Étapes automatiques

1. vérifier dimensions, mode couleur et présence réelle de l'alpha ;
2. découper selon le manifeste réel ;
3. nettoyer les couleurs RGB sous les pixels transparents ;
4. décontaminer les franges brunes, blanches ou noires ;
5. trimmer sur un seuil alpha faible sans supprimer les ombres ;
6. conserver 4 à 12 px de marge selon le halo ;
7. redimensionner avec un filtre haute qualité ;
8. produire 1x et 2x ;
9. encoder en WebP avec alpha haute qualité ;
10. générer `asset-map.ts` et les dimensions typées ;
11. produire une planche QA sur fond noir, brun, parchemin, photo et damier ;
12. échouer si un asset dépasse son budget ou si un fond opaque inattendu existe.

La pipeline utilisera `sharp` comme dépendance de développement explicitement
déclarée, même s'il existe actuellement de façon transitive via Next.js.

### 4.4 Repasse des lots sans alpha

Pour les lots 3 à 6 :

1. tester d'abord les exports propres déjà disponibles ;
2. utiliser une édition d'image guidée pour rendre le fond réellement transparent
   tout en conservant strictement la forme et les détails ;
3. préférer une repasse par famille cohérente plutôt qu'une régénération globale ;
4. découper ensuite les objets individuellement ;
5. comparer chaque objet à la source à 100 %, 50 % et taille runtime ;
6. rejeter toute variation qui modifie la géométrie, les symboles ou la palette ;
7. conserver le résultat lossless validé dans `restored/` avant compression.

Un détourage algorithmique par luminosité ne sera pas utilisé seul sur le damier
incrusté. Il supprimerait également les reflets et les détails clairs.

### 4.5 Budgets initiaux

| Type                |  Budget 1x |   Budget 2x |
| ------------------- | ---------: | ----------: |
| petite icône        |  4 à 12 Ko |   8 à 24 Ko |
| icône illustrée     |  8 à 24 Ko |  16 à 48 Ko |
| bouton              | 20 à 45 Ko |  35 à 80 Ko |
| input ou séparateur | 10 à 35 Ko |  20 à 60 Ko |
| avatar              | 20 à 50 Ko |  35 à 90 Ko |
| panel               | 30 à 90 Ko | 60 à 160 Ko |
| texture raccordable | 15 à 60 Ko | selon usage |

Cible de chargement : le shell UI nécessaire à un écran doit rester sous 300 Ko
compressés hors portraits et illustrations de contenu. Un écran gameplay complet
doit rester sous 700 Ko d'assets UI uniques au premier affichage.

## 5. Architecture des composants

### 5.1 Arborescence

```txt
apps/frontend/src/components/ui/grimoire/
  GamePanel/
    GamePanel.tsx
    game-panel.css
    GamePanel.stories.tsx
    GamePanel.test.tsx
  GameButton/
  GameField/
  GameInput/
  GameTextarea/
  GameSearchInput/
  GameAvatar/
  GameStepper/
  GameDivider/
  GameIcon/
  HudFrame/
  StatBar/
  CalamineMeter/
  SurvieGauge/
  VocationCard/
  index.ts
```

Les composants route-specific restent dans `_components/`. Le dossier ci-dessus
ne contient que des composants partageables entre landing, création de personnage,
Auberge, carte et session.

### 5.2 Principes d'API

- named exports uniquement ;
- props TypeScript strictes et unions fermées ;
- couleurs et polices via tokens existants ;
- `className` autorisé pour le layout externe, pas pour casser la structure ;
- forwarding des refs sur les contrôles interactifs ;
- attributs HTML natifs conservés ;
- état contrôlé et non contrôlé quand le composant le justifie ;
- aucune logique de règles de jeu dans le UI Kit ;
- pas d'animation obligatoire dans un composant de base ;
- états hover, active, focus-visible, disabled, loading et error documentés ;
- mobile, clavier et reduced motion traités dès la première version.

### 5.3 API proposée

#### `GamePanel`

```ts
interface GamePanelProps {
  as?: "section" | "article" | "div" | "aside";
  variant?: "main" | "sidebar" | "compact" | "header" | "footer";
  tone?: "neutral" | "gold" | "blood" | "soul" | "cendre";
  ornament?: "none" | "eye" | "diamond";
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}
```

#### `GameButton`

```ts
interface GameButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  tone?: "gold" | "blood" | "soul" | "cendre";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  asChild?: boolean;
}
```

Le composant doit fonctionner comme vrai `<button>` par défaut. `asChild` permet
de rendre un lien sans maintenir deux composants visuellement divergents.

#### `GameField`, `GameInput`, `GameTextarea`, `GameSearchInput`

```ts
interface GameFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

interface GameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
  invalid?: boolean;
}
```

Le label reste au-dessus du champ. Le placeholder ne remplace jamais le label.
L'erreur est reliée au contrôle par `aria-describedby`.

#### `GameAvatar`

```ts
interface GameAvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  state?: "normal" | "active" | "selected" | "prestige";
  statusLabel?: string;
}
```

#### `GameStepper`

```ts
interface GameStepperItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface GameStepperProps {
  items: GameStepperItem[];
  currentId: string;
  completedIds?: string[];
  orientation?: "horizontal" | "vertical" | "responsive";
  onStepChange?: (id: string) => void;
}
```

Le rendu utilise une liste ordonnée et `aria-current="step"`.

#### `StatBar`

```ts
interface StatBarProps {
  label: string;
  value: number;
  max: number;
  tone: "sang" | "souffle" | "cendre";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  animated?: boolean;
}
```

La valeur est bornée pour l'affichage. Le calcul mécanique reste côté backend.
Le composant expose `role="progressbar"` et les attributs ARIA correspondants.

#### `GameIcon` et `GameDivider`

```ts
interface GameIconProps {
  name: GameIconName;
  size?: 24 | 32 | 48 | 64 | 96;
  label?: string;
  decorative?: boolean;
}

interface GameDividerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "simple" | "diamond" | "ornate";
  size?: "sm" | "md" | "lg";
}
```

### 5.4 Composites métier

Une fois les primitives stabilisées :

- `CalamineMeter` compose `StatBar`, icône et seuils visuels ;
- `SurvieGauge` compose faim, soif et fatigue ;
- `VocationCard` compose panel, illustration, sélection et action ;
- les composants L'Aveugle seront ajoutés uniquement à partir de besoins écran
  réels afin de ne pas construire une bibliothèque spéculative.

## 6. Storybook et documentation

Storybook est retenu parce que le kit possède beaucoup de variantes, d'états et
de contraintes de dimensions. Il reste une dépendance de développement et ne
fait pas partie du bundle de production.

### 6.1 Installation

- intégration officielle Next.js ;
- import des tokens et de `globals.css` dans le preview ;
- addon documentation ;
- addon accessibility ;
- contrôles de props ;
- viewports Grimoire : 390, 768, 1024 et 1440 px.

Le frontend utilise actuellement Vitest 2. L'intégration du test addon Storybook
récent devra faire l'objet d'un spike de compatibilité avant toute montée de
version de Vitest. Storybook et l'addon a11y peuvent être installés sans forcer
immédiatement cette migration.

### 6.2 Structure des stories

```txt
Foundations/
  Colors
  Typography
  Spacing
  Textures
  AssetGallery

Primitives/
Forms/
HUD/
Navigation/
Composites/
```

Chaque composant doit présenter :

- toutes les variantes dans une matrice ;
- normal, hover simulé, focus-visible, active, disabled, loading et error ;
- libellé très court et très long ;
- français et anglais ;
- mobile et desktop ;
- fond void, fond photo, fond parchemin et damier ;
- zoom 200 % ;
- reduced motion ;
- exemple d'usage recommandé et anti-pattern documenté.

### 6.3 Tests visuels

Au départ :

- Storybook local comme catalogue et contrôle manuel ;
- captures de référence pour les composants critiques ;
- tests a11y automatiques sur les stories ;
- aucune dépendance Chromatic obligatoire pour un projet solo.

Chromatic pourra être ajouté plus tard si les régressions visuelles sur les PR
deviennent difficiles à suivre. Ce choix est indépendant du UI Kit lui-même.

## 7. Stratégie de tests

### Tests unitaires avec Vitest et Testing Library

- forwarding des attributs natifs ;
- ref et événements ;
- états disabled et loading ;
- associations label, hint et error ;
- navigation du stepper ;
- bornage visuel de `StatBar` ;
- rendu décoratif ou sémantique des icônes ;
- absence de calcul de règle de jeu.

### Tests Storybook

- interactions clavier ;
- focus visible ;
- axe a11y ;
- variantes difficiles à atteindre dans l'application ;
- dimensions minimales et maximales.

### Tests intégration et performance

- build Next.js ;
- type-check et lint du monorepo ;
- contrôle des imports morts ;
- taille totale des assets par composant ;
- Lighthouse sur au moins un écran mobile et desktop ;
- vérification LCP, INP et CLS ;
- aucune image source haute définition dans le bundle runtime.

## 8. Migration de l'existant

1. ne pas supprimer immédiatement `Button` et `Card` actuels ;
2. construire les nouveaux composants sous `ui/grimoire/` ;
3. adapter d'abord une section de la landing comme preuve ;
4. comparer visuellement et mesurer le poids réseau ;
5. migrer progressivement les usages ;
6. retirer les anciens assets uniquement lorsque `rg` confirme zéro référence ;
7. mettre à jour `DESIGN_TOKENS.md` et la documentation du frontend ;
8. conserver des alias temporaires uniquement si une migration atomique est
   impossible.

## 9. Découpage Git recommandé

Créer une issue principale puis des sous-issues ou issues liées :

1. asset inventory et pipeline Sharp ;
2. restauration transparente et optimisation des lots ;
3. Storybook et foundations ;
4. panels, boutons et formulaires ;
5. avatars, stepper, HUD, dividers et icons ;
6. composites métier ;
7. migration de la landing et suppression de l'ancien kit ;
8. QA, budgets, documentation et performance.

Chaque issue suit `issue -> branche feature/<n>-... -> commit -> PR develop`.
Le chantier complet ne doit pas être commité directement dans la branche landing
actuelle, sauf décision explicite de réduire le scope à un composant nécessaire
à la landing.

## 10. Ordre d'exécution

### Phase A : fondations

- geler et renommer les sources ;
- créer le manifeste v2 ;
- construire la pipeline Sharp ;
- ajouter les rapports alpha, dimensions et poids ;
- générer les premières planches QA.

### Phase B : restauration artistique

- lots 1, 2, 7 et 8 en premier car leur alpha est exploitable ;
- lot 3 à partir des exports RGBA existants ;
- lots 4, 5 et 6 par repasse contrôlée ;
- validation visuelle avant encodage runtime ;
- validation du raccord des textures.

### Phase C : preview technique

- installer Storybook ;
- documenter tokens et assets ;
- créer `GamePanel`, `GameButton` et `GameDivider` ;
- valider 3-slice, 9-slice, transparence et responsive.

### Phase D : contrôles et HUD

- champs et états de formulaire ;
- avatar ;
- stepper ;
- `StatBar` ;
- cadres HUD et icônes ;
- tests clavier et a11y.

### Phase E : composants métier

- `CalamineMeter` ;
- `SurvieGauge` ;
- `VocationCard` ;
- composants additionnels déclenchés par les écrans réels.

### Phase F : migration et finition

- preuve sur une section existante ;
- mesure réseau avant et après ;
- migration progressive ;
- suppression des doublons ;
- build, tests, Lighthouse et documentation finale.

## 11. Critères de fin

Le chantier est terminé lorsque :

- aucun asset runtime ne possède de fond opaque accidentel ;
- aucune frange claire ou brune n'apparaît sur les cinq fonds de test ;
- tous les éléments redimensionnables utilisent 3-slice, 9-slice ou CSS ;
- les sources haute définition ne sont jamais importées dans l'application ;
- les budgets de poids sont automatisés ;
- chaque composant possède props typées, stories, tests et documentation ;
- les contrôles sont accessibles au clavier et au lecteur d'écran ;
- les états focus, error, disabled et loading existent ;
- les composants fonctionnent à 390 px et 1440 px ;
- les tokens Grimoire sont utilisés sans couleurs ou polices hardcodées ;
- Storybook se construit sans erreur ;
- type-check, lint, tests et build Next.js passent ;
- la migration n'a introduit aucune régression visuelle ou fonctionnelle ;
- le poids UI initial respecte les budgets définis.

## 12. Première tranche recommandée

La première tranche doit rester petite et démontrer toute la chaîne :

1. un panel du lot 1 ;
2. un input du lot 2 ;
3. les quatre états d'un bouton du lot 3 ;
4. un séparateur du lot 7 ;
5. deux icônes du lot 8 ;
6. pipeline Sharp complète ;
7. `GamePanel`, `GameButton`, `GameInput`, `GameDivider` et `GameIcon` ;
8. stories, tests, budgets et une intégration réelle sur la landing.

Cette tranche valide la qualité du détourage, le poids, les slices, les APIs et
Storybook avant de traiter plusieurs dizaines d'assets.
