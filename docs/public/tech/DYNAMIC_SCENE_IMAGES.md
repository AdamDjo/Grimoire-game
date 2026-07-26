---
type: tech-plan
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-26
---

# Images de scène dynamiques (plan)

> Statut : **plan, non implémenté**. Remplace l'image de fond statique unique
> (`public/scenes/`, voir [[UI_KIT]] §Scènes) par une bibliothèque d'images
> générées et partagées entre tous les joueurs.

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
cacheKey = `${sceneType}_${biome}_${lieuType}`
```

- **`sceneType`** (6 valeurs, déjà un enum Zod strict — `scene-validator.ts:114`) :
  `exploration | combat | dialog | event | shop | rest`
- **`biome`** (5 valeurs, canon `06-SURVIVAL.md` §5, lignes 210-222) :
  `tissan | doigts | rivage | marais_lekh | coeur`
- **`lieuType`** (5 valeurs, dérivées des types de donjons canon
  `03-BESTIARY.md` §9, lignes 239-244, + un type générique extérieur) :
  `plein_air | ruines_archontiques | cryptes | cavernes_cendre | donjon_profond`

Espace théorique max : 6 × 5 × 5 = 150 combinaisons, mais beaucoup ne sont pas
plausibles en jeu (pas de `shop` dans une `cavernes_cendre`, pas de
`cryptes` au `rivage`) — le nombre réel rencontré en pratique sera plutôt de
l'ordre de 30-50 combinaisons, un espace fini qui se sature après quelques
dizaines de parties.

**Qui assigne `biome` et `lieuType`** : le backend, jamais l'IA — cohérent
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

## Schéma (à créer)

Nouvelle table Prisma `SceneImage` :

```prisma
model SceneImage {
  id        String   @id @default(cuid())
  cacheKey  String   @unique // sceneType_biome_lieuType
  url       String
  createdAt DateTime @default(now())
}
```

Au moment de la compression N2 (ou de la génération de scène), le backend
calcule `cacheKey`, cherche une ligne existante ; absente → génère, upload
Supabase Storage, insère la ligne ; présente → réutilise `url` directement.
Le `MemoryChunk` (ou le payload de scène renvoyé au frontend) porte la
`SceneImage.url` résolue pour ce tour.

## Hors scope de ce plan

- Génération par tour individuel (retenu : par chunk N2 uniquement).
- Personnalisation de l'image par joueur (délibérément partagée/anonyme).
- Redis et pgvector : évalués et différés séparément, voir
  [[BACKEND_STATUS]] (post-déploiement, #114) et `20-ARCHITECTURE.md:56`
  (Redis dès 2+ instances backend, pas avant).
