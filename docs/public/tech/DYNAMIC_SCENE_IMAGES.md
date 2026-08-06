---
type: tech-plan
visibility: public
rag: true
source_of_truth: true
updated: 2026-08-07
---

> Statut : **livré** (#207). Ce document garde son rôle de plan de conception ;
> les sections marquées « livré » décrivent l'implémentation réelle.

# Images de scène dynamiques (#207)

> Remplace l'image de fond statique unique (`public/scenes/`, voir
> [[UI_KIT]] §Scènes) par une bibliothèque d'images générées et partagées
> entre tous les joueurs.

## Problème

Aujourd'hui le Hub et la Session utilisent une seule image statique pré-faite
par univers (`public/scenes/`). Générer une image par run/joueur serait
coûteux en trois dimensions à la fois : appels de génération (ressource la
plus fragile en free tier), stockage, et duplication — deux joueurs sur un
même type de scène régénéreraient deux fois le même contenu visuel.

## Décision : cache partagé, pas de génération par run

Au lieu de générer à la demande par session, le backend construit une
**bibliothèque d'images réutilisables**, indexée par une clé structurée et
finie plutôt que par session ou par joueur. Le remplissage est automatique :
le premier chunk qui matche une combinaison inédite déclenche une génération
et un stockage ; tous les chunks suivants (tous joueurs confondus) qui
matchent la même combinaison réutilisent l'URL existante sans nouvel appel.
Aucune intervention manuelle, aucune liste d'images à maintenir à la main.

Fréquence de déclenchement : **par chunk N2** (compression mémoire, tous les
~8 tours), pas par tour — cohérent avec le rythme de bascule narrative déjà
en place (#111/#120).

## Clé de cache

La clé ne doit **jamais** dériver du texte libre généré par l'IA (`location`,
`narrative`) — deux formulations différentes de la même scène ("Salt Road" vs
"la route du sel poussiéreuse") casseraient la réutilisation. La clé est
entièrement composée de champs structurés que le **backend** possède déjà ou
assigne lui-même :

```
cacheKey = `${sceneType}_${depthBand}_${lieuType}`
```

- **`sceneType`** (6 valeurs, déjà un enum Zod strict — `scene-validator.ts:114`) :
  `exploration | combat | dialog | event | shop | rest`
- **`depthBand`** (5 valeurs, dérivées de la profondeur du run par
  `depthBandOf` — `game-rules/dungeon.ts`) :
  `surface | upper | mid | deep | abyss`
- **`lieuType`** (5 valeurs, dérivées des types de donjons canon
  `03-BESTIARY.md` §9, lignes 239-244, + un type générique extérieur) :
  `plein_air | ruines_archontiques | cryptes | cavernes_cendre | donjon_profond`

**Pourquoi la profondeur a remplacé le biome.** La clé d'origine supposait un
monde ouvert parcouru horizontalement, où le biome était ce qui changeait
d'une scène à l'autre. La refonte roguelike ([[23-RUN-STRUCTURE]]) a rendu le
contenu **vertical** : le joueur descend des paliers, et ce qui doit changer
l'image est la profondeur atteinte — un palier 1 et un palier 7 ne se
ressemblent pas, deux `tissan` à des paliers différents si. Le biome était de
surcroît **deviné** dans la prose de l'IA, alors que la profondeur est une
donnée que le moteur possède déjà : une image ne peut donc plus contredire le
palier où le joueur se trouve réellement.

Les bandes découpent les 7 paliers exactement là où le bestiaire découpe ses
tiers de danger (`03-BESTIARY.md` §6bis) : `upper` = 1-2 « je gère »,
`mid` = 3-4 « ça coûte », `deep` = 5-6 « je devrais peut-être remonter »,
`abyss` = 7 « c'est là que je meurs ou que je gagne le run ». `surface`
couvre le hors-run (palier 0). L'image suit donc la même montée de tension
que la faune, sans qu'aucun des deux systèmes ait à connaître l'autre.

Espace théorique max : 6 × 5 × 5 = 150 combinaisons, mais beaucoup ne sont pas
plausibles en jeu (pas de `shop` en `abyss`, pas de `cryptes` en `surface`) —
le nombre réel rencontré en pratique sera plutôt de l'ordre de 30-50
combinaisons, un espace fini qui se sature après quelques dizaines de parties.

**Qui assigne `depthBand` et `lieuType`** : le backend, jamais l'IA — cohérent
avec la règle du projet "le backend possède toutes les règles, l'IA ne décide
rien" ([[ARCHITECTURE_RULES]]). L'IA continue d'écrire `location` en texte
libre pour l'immersion narrative ; ce texte n'entre jamais dans la clé de
cache.

## Génération

Service gratuit recommandé : **Pollinations.ai** (`image.pollinations.ai/prompt/...`)
— gratuit sans clé API, simple GET avec prompt encodé. Pas de SLA garanti :
en cas d'échec ou timeout, fallback sur l'image statique de thème actuelle
(même pattern défensif que `buildStubScene` côté texte).

Alternatives si Pollinations s'avère insuffisant en qualité/fiabilité :
quota gratuit Gemini image gen, ou Hugging Face Inference API (free tier,
latence de cold-start plus élevée).

## Stockage

**Supabase Storage**, pas de nouveau service tiers — déjà utilisé pour
DB/auth. Le volume reste borné par le nombre de combinaisons de cache
(quelques dizaines d'images, pas une par run/joueur), donc largement dans le
free tier (1 Go).

## Schéma (livré)

Table Prisma `SceneImage` :

```prisma
model SceneImage {
  id        String   @id @default(uuid())
  cacheKey  String   @unique // sceneType_depthBand_lieuType
  url       String
  createdAt DateTime @default(now())
}
```

`GameSession` gagne une colonne `currentImageUrl String?`.

## Profondeur et lieuType (livré)

Les deux composantes non-`sceneType` de la clé ne sont **pas** obtenues de la
même façon, et c'est délibéré :

- **`depthBand`** est _lu_, jamais deviné. `depthBandOf(depth)` traduit la
  profondeur du run — `GameSession.currentDepth`, une donnée que le moteur
  possède — en bande. Aucun texte n'intervient. Un palier hors bornes (négatif,
  `NaN`, au-delà de 7) est **clampé** vers une bande valide au lieu de lever :
  un tour ne doit jamais échouer parce qu'il cherchait à s'illustrer.
- **`lieuType`** reste _classifié_, par `classifyLieuType(location)` :
  pattern-matching de mots-clés canon sur le texte libre `location` écrit par
  l'IA, avec `plein_air` comme défaut sûr. C'est le seul endroit où la prose
  influence la clé, et seulement pour choisir entre cinq décors — jamais pour
  décider du niveau de danger représenté.

`classifyBiome` a été **supprimé** avec la refonte roguelike : il devinait dans
la prose une information que le moteur détient désormais de façon fiable.

## Pont asynchrone image ↔ tour (livré)

`resolveTurn()` (`session.service.ts`) construit et renvoie le `SceneResponse`
de façon synchrone, puis déclenche `compressScene()` en asynchrone (non
attendu, tous les ~8 tours). L'image ne peut donc pas atteindre la réponse du
même tour : l'URL résolue est persistée sur `GameSession.currentImageUrl` (via
`resolveAndPersistSceneImage()` dans `memory.service.ts`) et relue par tous
les points de construction de scène suivants (`resumeLatestScene`,
`buildOpeningScene`, `resolveTurn`) pour peupler `Scene.imageUrl`.

## Génération et stockage (livré)

**Pollinations.ai** (`image.pollinations.ai/prompt/...`), GET simple avec
prompt encodé, timeout 15s via `AbortController`. Échec ou timeout → `null`,
le frontend retombe sur l'image de thème statique existante.

Bucket **Supabase Storage `scene-images`**, créé **public** (`getPublicUrl()`
direct, pas d'URL signée). Les écritures (`uploadSceneImage`) utilisent la clé
service-role qui bypass RLS ; les lectures sont publiques — donc aucune
policy RLS Storage additionnelle nécessaire.

`resolveSceneImage()` gère la course concurrentielle : si deux requêtes
tentent de créer la même `cacheKey` en même temps, l'échec de contrainte
unique déclenche une relecture par `cacheKey` pour réutiliser la ligne
gagnante plutôt que de traiter ça comme une erreur.

## Hors scope de ce plan

- Génération par tour individuel (retenu : par chunk N2 uniquement).
- Personnalisation de l'image par joueur (délibérément partagée/anonyme).
- Redis et pgvector : évalués et différés séparément, voir
  [[BACKEND_STATUS]] (post-déploiement, #114) et `20-ARCHITECTURE.md:56`
  (Redis dès 2+ instances backend, pas avant).
