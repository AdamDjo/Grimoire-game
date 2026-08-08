# Game Design — Public Implementation Summary

> Résumé public et lisible pour implémenter sans relire tout le GDD.
> Canon complet : `docs/public/raw/` via [`../nav/canon-index.md`](../nav/canon-index.md).
> Version longue archivée : `docs/private/archive/public-long-versions/GAME_DESIGN.long.md`.

## Pitch

**GRIMOIRE — Of Ash and Salt** est un roguelike narratif par IA situé dans **Velkhar**, un monde de dark fantasy désertique.

Promesse produit : **un monde qui se souvient**. Le joueur agit librement, le backend résout les règles, l'IA écrit la prose, et les conséquences persistent dans le world-state.

## Piliers

- **Survie** : faim, soif, fatigue, Calamine, pression du désert.
- **Choix & dés** : d20 uniquement aux pivots narratifs.
- **Lentille narrative** : la vocation colore les scènes et les options.
- **Rejouabilité** : chaque run change le méta-monde.
- **Héritage** : la mort laisse une trace, jamais un simple reset.

## Règles de scope

- Velkhar only pour V1.
- MVP = vertical slice 45-70 min, pas run complet 15h.
- L'Aveugle, Cendre, Calamine et Souvenirs sont les premiers concepts exposés.
- Mémoire, conséquences et validation backend avant polish cosmétique.
- Pas de multi-univers, pas de pivot D&D, pas de Twitch voting.

## Expérience cible

1. Le joueur commence à l'Auberge de L'Aveugle.
2. L'Aveugle demande son nom.
3. Le joueur crée son personnage : vocation ou concept libre.
4. L'IA réagit en prose, mais le backend garde les règles.
5. Le joueur quitte l'auberge et entre dans le run.
6. Les choix importants créent des faits persistants.
7. La mort ou la fin génère une trace pour les runs suivants.

## Canon public minimal

- Monde : **Velkhar**, continent du **Makhzen**.
- Hub : **L'Aveugle**, aubergiste et gardien du seuil.
- Attributs : **SANG**, **SOUFFLE**, **CENDRE**.
- Vocations V1 : Marcheur-du-Sel, Lame-Ombre, Veilleur, Tisse-Verbe.
- Magie : artefacts uniquement ; la Calamine corrompt.
- Méta-monnaie : Souvenirs, dépensés chez L'Aveugle.
- Quêtes ouvertes : Pouvoir, Vérité, Survie, Destruction.

## UI et direction artistique

- Ambiance : dark fantasy désertique, cendre dorée, sel, ruines, seuils.
- Tokens : toujours utiliser [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md).
- UI : dense, lisible, cinématique, jamais générique fantasy.
- Les écrans gameplay doivent prioriser la narration, l'état du personnage, les conséquences et l'action libre.

## Écrans à construire

- Landing : promesse claire + SEO bilingue, sans exposer le canon complet.
- Auberge de L'Aveugle : hub de run, création, Souvenirs, artefacts.
- Character Create : 4 vocations + concept libre.
- World Map : carte du Makhzen, régions, points d'intérêt.
- Session : narration, action libre, choix, dés aux pivots, inventaire, survie.

## Composants attendus

- `StatBar` : variantes `sang`, `souffle`, `cendre`.
- `CalamineMeter`.
- `SurvieGauge` : faim, soif, fatigue.
- `VocationCard`.
- Composants L'Aveugle : scène, dialogue, choix vocation, concept libre, échange Souvenirs.

## Règles IA côté design

- L'IA ne doit pas créer de règles.
- L'IA ne doit pas contredire le canon.
- Les choix générés doivent rester jouables et validables par le backend.
- Le joueur peut écrire librement ; l'interface doit favoriser l'action libre.

## Références ciblées

- Attributs et dés : `docs/public/raw/04-ATTRIBUTES.md`, `08-DICE-RESOLUTION.md`
- Création personnage : `07-CHARACTER-CREATION.md`, `05-VOCATIONS.md`
- Auberge : `15-GAME-MASTER.md`, `14-META-WORLD.md`, `22-GLOSSARY.md`
- Monde : `02-WORLD-BIBLE.md`, `03-FACTIONS.md`, `03-BESTIARY.md`
