---
type: tech-plan
visibility: public
rag: true
source_of_truth: true
---

# Bibliothèque d'images de scène

> **Révision du 2026-08-08.** La génération dynamique livrée par #207 est remplacée pour v0.2.1
> par une bibliothèque pré-générée, contrôlée et sans appel image au runtime.

## Décision

GRIMOIRE utilise les images comme décors de la narration, pas comme sortie improvisée d'un modèle à
chaque partie. La v0.2.1 ne génère aucune image pendant un tour, un run ou la découverte d'un lieu.

Cette décision privilégie :

- une direction artistique cohérente entre L'Aveugle, le comptoir, les voyages et les donjons ;
- aucun temps d'attente lié à une génération ;
- aucun coût proportionnel au nombre de joueurs ;
- aucun échec de partie causé par un fournisseur d'images ;
- un contrôle humain sur les images réellement montrées.

## Volume initial

| Famille          | Cible       | Exemples                                                    |
| ---------------- | ----------- | ----------------------------------------------------------- |
| Auberge          | 6 à 8       | entrée, comptoir, L'Aveugle, contrats, forge, sac           |
| Voyages          | 12 à 15     | routes, désert, rivage, marais, variations de lumière       |
| Donjons          | 25 à 35     | ruines, cryptes, cavernes, profondeurs, salles remarquables |
| **Total v0.2.1** | **45 à 60** | deux ou trois variantes par famille de décor                |

Une image peut servir à plusieurs scènes proches. La narration et l'état du monde rendent chaque
scène unique ; l'image fournit le lieu, la lumière et la matière.

## Sélection

La sélection repose sur des identifiants fermés et versionnés, jamais sur le texte libre de l'IA.

```ts
type SceneImageFamily = "inn" | "travel" | "dungeon";

interface SceneImageDefinition {
  id: string;
  family: SceneImageFamily;
  locationType: string;
  variant: string;
  url: string;
  fallbackId: string;
}
```

Le backend choisit une image compatible avec la scène structurée actuelle. L'IA reçoit ce décor en
contexte et écrit une prose compatible ; elle ne demande pas une image et ne construit pas sa clé.

### Règle anti-spoiler

L'image représente uniquement **le lieu où se trouve déjà le personnage**. Elle ne doit jamais :

- révéler le type de la prochaine salle ;
- montrer un ennemi avant son apparition narrative ;
- annoncer un trésor, un repos ou un piège à venir ;
- encoder visuellement la profondeur ou la difficulté cachée.

## Production et stockage

1. Les masters sont générés et sélectionnés pendant le développement.
2. Chaque asset est recadré au ratio réel de l'interface et compressé en WebP/AVIF.
3. Les fichiers optimisés sont téléversés une seule fois dans le bucket Supabase `scene-images`.
4. Un manifeste versionné dans le dépôt lie les identifiants stables aux URLs.
5. Le frontend précharge seulement l'image courante et, si connue sans spoiler, la transition
   immédiate suivante.

Le stockage distant évite d'alourdir le bundle et le dépôt. Le manifeste garde le contrat
reproductible ; un changement d'URL passe par une PR.

## Fallback et accessibilité

- Une image absente, lente ou invalide retombe sur le décor de thème de sa famille.
- Le tour et la navigation ne dépendent jamais du chargement de l'image.
- La narration doit rester suffisante pour comprendre et jouer sans visuel.
- Les informations mécaniques essentielles vivent dans le texte ou le HUD, jamais dans l'image
  seule.
- Le combat conserve le décor courant quand il transforme l'interface.

## Migration depuis #207

L'implémentation actuelle génère via Pollinations, persiste `SceneImage` et choisit une clé
`sceneType_depthBand_lieuType`. Elle devient une dette de migration, pas la cible produit.

La migration doit :

1. introduire le manifeste et les identifiants fermés ;
2. remplacer `resolveSceneImage()` par une résolution locale déterministe ;
3. supprimer l'appel Pollinations et son timeout ;
4. décider si la table `SceneImage` peut être retirée après migration ;
5. conserver `GameSession.currentImageUrl` ou le remplacer par `currentImageId` selon le contrat
   shared retenu ;
6. garder le fallback défensif de bout en bout.

## Hors périmètre v0.2.1

- génération par tour, joueur, run ou nouvelle combinaison ;
- personnalisation d'image selon le texte libre ;
- image unique pour chaque salle procédurale ;
- galerie d'administration des assets ;
- retour automatique à un fournisseur payant ou gratuit.

Une génération dynamique avec cache pourra être réévaluée après playtest si la répétition visuelle
est réellement mesurée. Elle ne doit pas être anticipée avant ce signal.
