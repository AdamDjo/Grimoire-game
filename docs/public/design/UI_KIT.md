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

- Titres : `--font-display` (IM Fell French Canon SC).
- Prose, accents, boutons, labels et HUD : `--font-serif`, `--font-accent` et
  `--font-ui` (Alegreya).

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

## Assets Encre de Sel

Les nouveaux cadrans runtime sont servis depuis `public/encre-de-sel/`. Les
icônes encore actives restent dans `public/ui-kit/icons/`. Les masters, prompts
et planches de contrôle restent privés dans `docs/private/`.

Organisation :

```txt
public/encre-de-sel/
  chrome/
    header-separator.webp
    reader-separator.webp
    footer-separator.webp
    hud-stat-separator.webp
    hud-bar-mask.webp
  frames/
    choice-frame-gore.webp
    choice-number-plate.webp
    action-input-gore.webp
  icons/
    blood.webp
    breath.webp
    hunger.webp
    thirst.webp
    calamine.webp
    inventory-tile.webp
    journal-tile.webp
    character-tile.webp
    action-quill.webp
    action-submit-tile.webp
```

`choice-frame-gore.webp` et `action-input-gore.webp` sont rendus en 9-slice :
les angles, les gouttes et l'empreinte restent fixes, tandis que le centre peut
s'étendre sur une ou plusieurs lignes. Les chiffres, textes, labels et icônes
restent du HTML accessible. Les contrôles carrés génériques restent dessinés en
CSS ; seuls les trois outils permanents du footer utilisent leurs tuiles validées.

Les séparateurs, le rail, les pictogrammes de ressources et les trois tuiles du
footer sont extraits du master GameSession validé. Les tuiles gardent leur cadre
et leur icône dans un seul bitmap afin de conserver exactement le trait original.

Les surfaces, panels et boutons génériques utilisent les tokens de matière. Le
header, la séparation lecture/image et le footer emploient les assets `chrome/`
issus du master. Les anciens masters `structural-frame-v2`,
`button-dark-frame-v2`, `cta-gold-frame` et `game-input-frame-v2` sont retirés du
runtime.

Les éléments consolidés depuis la landing sont copiés et optimisés dans cette
arborescence. Les chemins historiques de la landing ne sont ni déplacés ni
modifiés tant qu'une migration séparée n'est pas explicitement demandée.

## Preview et validation

En développement, `/ui-kit-preview` présente les familles, variantes, états et
trois compositions de référence : création de personnage, hub narratif et
session de jeu. Les ancres `#proof-form`, `#proof-hub` et `#proof-session`
isolent chaque composition pour la QA.

Le Hub et la Session utilisent le même `GameSceneLayout`. Sur desktop : header
persistant, scène 58 %, reader 42 % avec scroll indépendant, footer sur toute la
largeur. Sur mobile : header compact, scène entre 32 et 38 dVh, reader en flux
naturel puis footer. Il n'existe plus de variantes `sidebar`, `immersive` ou
`centered`.

La route retourne une 404 en production. Aucun dossier `storybook-static` ne
doit être versionné ; Storybook pourra être ajouté plus tard comme dépendance de
développement si son coût de maintenance devient justifié.

Les validations obligatoires sont : type-check, lint, tests Vitest, build Next,
contrôle alpha/dimensions/poids et inspection visuelle aux breakpoints mobile et
desktop.
