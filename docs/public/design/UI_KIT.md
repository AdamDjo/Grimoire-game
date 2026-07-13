---
type: design-system
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-13
---

# UI Kit Grimoire

Le UI Kit Grimoire est la bibliothèque visuelle globale de l'application. Une
primitive unique couvre chaque besoin grâce à des variantes typées et des états
CSS. Les pages ne doivent pas créer leur propre bouton, champ, panel ou icône.

## Import

```tsx
import {
  GameButton,
  GameField,
  GameIcon,
  GamePanel,
  StatBar,
} from "@/components/ui";
```

## Catalogue

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

`GameIcon` expose `GAME_ICON_NAMES`, la liste typée des 40 icônes disponibles.
Une icône doit recevoir soit `label`, soit `decorative`.

`VocationEmblem` expose les quatre sceaux canoniques `marcheur-du-sel`,
`lame-ombre`, `veilleur` et `tisse-verbe`. Ils restent compacts, sans personnage
ni scène, et sont disponibles en 64, 96 et 128 px.

`GameDivider` expose les variantes CSS `simple`, `diamond`, `ornate` et les
variantes illustrées `celestial`, `auberge`. `GameSurface` centralise les cadres
`card`, `stats` et `parchment`. `GameButton` reste l'unique famille de bouton.

## Boutons

Le catalogue expose deux langages visuels, plus leur déclinaison carrée pour les
actions sans texte :

| Langage      | Variantes API                     | Usage                                         |
| ------------ | --------------------------------- | --------------------------------------------- |
| Cadre sombre | `secondary`, `cinematic`, `ghost` | action courante, choix narratif, CTA sombre   |
| Cadre doré   | `primary`, `radiant`              | validation et action prioritaire              |
| Action icône | `icon`                            | action compacte avec `aria-label` obligatoire |

Les icônes de début et de fin sont optionnelles via `leadingIcon` et
`trailingIcon`. Aucun pictogramme n'est incrusté dans le master du bouton. Les
états hover, focus, pressed, disabled et loading réutilisent le même asset et
sont exclusivement pilotés en CSS.

## Principes d'usage

- Utiliser les variantes du composant existant avant d'ajouter une nouvelle API.
- Garder hover, focus, pressed, disabled, loading et error dans les feuilles CSS.
- Ne jamais importer les masters haute définition dans le runtime.
- Composer les éléments métier à partir des primitives ; ne pas recopier leur CSS.
- Fournir des libellés accessibles et conserver les éléments HTML natifs.

## Typographie et interactions

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

Les bordures structurelles restent dorées sur toutes les familles. Les couleurs
Sang, Souffle et Cendre communiquent un état ou une valeur, mais ne remplacent
pas le contour doré de la surface.

`GameInput` et `GameTextarea` partagent la même progression visuelle : repos,
halo doré discret au hover, accent renforcé au focus, traitement rouge en erreur
et désaturation en disabled. Les transitions sont ciblées et supprimées lorsque
`prefers-reduced-motion` est actif.

Pour les contrôles composés, l'indicateur de focus appartient exclusivement à
la surface englobante (`focus-within`). L'input ou le textarea natif interne ne
doit jamais ajouter une seconde outline. En erreur, le rouge garde la priorité
sur le doré du focus afin que l'état ne devienne pas ambigu.

## Authentification

Les routes `login`, `signup` et récupération d'accès ne possèdent pas de copie
locale des primitives. Elles composent le UI Kit global dans le groupe de routes
`app/(auth)`, avec un layout visuel commun et des formulaires accessibles.

## Assets

Les assets runtime sont servis depuis `public/ui-kit/`. Les masters, prompts et
planches de contrôle restent privés dans `docs/private/`. Les WebP runtime sont
transparents et dimensionnés pour leur usage réel, avec une définition Retina
pour les icônes.

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

Les cadres actuels des boutons sont `button-dark-frame-v2.webp`,
`cta-gold-frame.webp` et `button-icon-frame.webp`. Le panel, la narration et les
zones de structure réemploient `structural-frame-v2.webp`. Ce cadre 9-slice ne
contient ni flèche, ni diamant, ni séparateur interne. Il habille les panels
sombres, la narration, la barre haute, le dock d'étapes et le footer HUD avec un
langage unique. Le parchemin, les boutons et les champs conservent leurs cadres
dédiés pour respecter leurs proportions.

Le cadre des champs utilise `game-input-frame-v2.webp`. Il est rendu en 9-slice
avec `border-image` afin de préserver les angles gravés lorsque la largeur du
champ varie. Les textes et icônes restent des éléments HTML indépendants ;
aucun contenu n'est incrusté dans le master.

Les éléments consolidés depuis la landing sont copiés et optimisés dans cette
arborescence. Les chemins historiques de la landing ne sont ni déplacés ni
modifiés tant qu'une migration séparée n'est pas explicitement demandée.

## Preview et validation

En développement, `/ui-kit-preview` présente les familles, variantes, états et
trois compositions de référence : création de personnage, hub narratif et
session de jeu. Les ancres `#proof-form`, `#proof-hub` et `#proof-session`
isolent chaque composition pour la QA.

Le Hub et la Session utilisent des scènes propres dans `public/scenes/`. Ces
images ne contiennent aucun texte ni élément d'interface : le rail de dialogue,
les souvenirs, la narration, les actions et le HUD restent des composants HTML
réels. La géométrie desktop suit les mockups de référence (Hub en grille 69/31,
Session en superposition cinématique avec HUD bas) tandis que la déclinaison
mobile privilégie la lisibilité et l'absence de chevauchement.

La route retourne une 404 en production. Aucun dossier `storybook-static` ne
doit être versionné ; Storybook pourra être ajouté plus tard comme dépendance de
développement si son coût de maintenance devient justifié.

Les validations obligatoires sont : type-check, lint, tests Vitest, build Next,
contrôle alpha/dimensions/poids et inspection visuelle aux breakpoints mobile et
desktop.
