---
type: frontend-architecture
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-16
---

# Architecture frontend multi-univers

## Objectif

Le frontend doit rester simple à parcourir tout en permettant à plusieurs univers d'utiliser la
même plateforme et la même boucle de jeu.

Un concept ne possède qu'un emplacement principal :

- un monde se trouve sous sa route `app/(game)/<world>/` ;
- une fonctionnalité partagée se trouve sous `features/` ;
- une primitive visuelle se trouve sous `components/ui/` ;
- un shell ou état global se trouve sous `components/system/`.

## Structure

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

## Règles de placement

### Une seule route

Le composant reste colocalisé :

```text
app/(game)/velkhar/(main)/aveugle/_components/
```

### Plusieurs routes du même monde

Le composant remonte dans le dossier privé du monde :

```text
app/(game)/velkhar/_components/
```

Exemples : Calamine, jauges de survie ou emblèmes de vocation.

### Plusieurs mondes

Le comportement partagé va dans une feature :

```text
features/game-session/
```

Exemples :

- contrôleur de session ;
- API de session ;
- narration ;
- choix ;
- résultat de dé ;
- conséquences ;
- états de session.

### Sans connaissance métier

La primitive va dans :

```text
components/ui/
```

Exemples :

- bouton ;
- panneau ;
- champ ;
- fenêtre accessible ;
- barre ou anneau de progression ;
- layout de scène.

### Infrastructure globale

Les navigations, shells, pages système et limites de plateforme vont dans :

```text
components/system/
```

## Direction des dépendances

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

## Personnalisation visuelle

Un monde ne duplique pas un composant lorsque seules changent :

- l'image de fond ;
- la texture ;
- la couleur ;
- la police ;
- le texte ;
- le contenu injecté ;
- une variante structurelle limitée.

Utiliser en priorité :

1. les props métier ;
2. les slots React ;
3. les variantes génériques ;
4. les variables CSS du thème.

Éviter les composants possédant une longue liste de props purement décoratives.

## Exemple : boucle de session

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

## Nommage

- Composant partagé : `DiceRoll`, `GameWindow`, `NarrativePanel`.
- Composant propre au monde : `VelkharSession`, `VelkharSurvivalHud`.
- Éviter `Panel.tsx` ou `Hud.tsx` seuls dans un dossier de monde.
- Un test reste près du comportement qu'il couvre.

## Univers et campagnes

Un univers est du code et une configuration :

```text
app/(game)/velkhar/
```

Une campagne est une donnée utilisant cet univers :

```text
/velkhar/campaign/[id]
```

Ne jamais créer un dossier de code par campagne.
