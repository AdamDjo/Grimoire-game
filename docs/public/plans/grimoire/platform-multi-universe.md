---
type: master-plan
visibility: public
rag: true
source_of_truth: false
status: deferred
updated: 2026-07-23
owners:
  - product
  - frontend
  - backend
---

# Plan directeur — Grimoire plateforme multi-univers

> **Statut : plan validé à conserver pour exécution ultérieure.**
>
> Ce document formalise les décisions produit, UX, frontend, backend, données, IA, sécurité,
> performance et déploiement prises autour de la séparation entre **Grimoire**, la plateforme, et
> **Velkhar — Of Ash and Salt**, son premier univers jouable.
>
> Ce plan ne remplace pas les documents d'état vivant. Au moment de l'exécution, commencer par
> `MEMORY.md`, `docs/00-START-HERE.md`, puis les fichiers `docs/public/current-state/*`.

## 1. Résumé exécutif

### 1.1 Décision produit

- **Grimoire** est la plateforme de RPG narratifs propulsés par un moteur de jeu et un Maître du
  jeu IA communs.
- **Velkhar — Of Ash and Salt** est le premier jeu/univers éditorial publié sur Grimoire.
- Chaque univers possède son identité visuelle, sa personnalité de MJ, son vocabulaire, ses assets,
  ses mécaniques particulières, son hub et ses écrans de jeu.
- Le moteur, l'authentification, la persistance, les contrats de session et la Bibliothèque sont
  partagés.
- Le joueur peut commencer Velkhar **anonymement et immédiatement**. La connexion ne doit jamais
  bloquer l'entrée dans l'Auberge.
- Le dashboard est conservé, mais devient **Ma Bibliothèque**, un espace global réservé aux joueurs
  ayant un compte. Il n'appartient pas au tunnel de première partie.
- Un seul dépôt monorepo est conservé. Il n'existe pas un frontend autonome par univers.
- La cible à terme contient deux applications Next.js : un site public `web` et une application de
  jeu `play`, plus l'API Express.
- La transformation ne doit pas compromettre la livraison de la v0.1 Velkhar. Elle commence après
  le vertical slice ou dans des chantiers strictement isolés.

### 1.2 Décision d'architecture

```text
Monorepo Grimoire
├── apps/web       → grimoire.gg, marketing public
├── apps/play      → play.grimoire.gg, compte + jeux
├── apps/backend   → api.grimoire.gg, autorité métier
└── packages/*     → contrats et fondations réellement partagés
```

`api` désigne ici la **surface déployée** (`api.grimoire.gg`). Le dossier physique reste
`apps/backend`, conformément au monorepo actuel. Un éventuel renommage en `apps/api` doit être une
opération de maintenance isolée ; il ne change ni la sécurité, ni les performances, ni
l'architecture logique et n'est donc pas requis par ce programme.

Il n'est pas prévu de créer `play-velkhar`, `play-heroes`, `play-cyberpunk`, etc. Un univers ne sera
extrait en application autonome que si une contrainte réelle de technologie, d'équipe, de sécurité,
de déploiement ou de runtime le justifie.

### 1.3 Invariants absolus

1. **Backend = autorité mécanique.**
2. **IA = prose structurée, jamais vérité mécanique.**
3. **Frontend = rendu et intentions utilisateur, jamais décision de jeu critique.**
4. **Un univers ne connaît pas le code d'un autre univers.**
5. **Un joueur ne télécharge pas les assets des univers qu'il ne visite pas.**
6. **L'identité de Velkhar est conservée, pas absorbée par l'identité Grimoire.**
7. **La Bibliothèque est globale ; l'Auberge et la session sont propres à Velkhar.**
8. **La connexion est progressive et non bloquante avant le cap anonyme.**
9. **Toute autorisation est vérifiée côté backend pour chaque objet demandé.**
10. **Aucune migration massive en une seule PR.**

---

## 2. Terminologie officielle

| Terme            | Définition                                      | Portée                                       |
| ---------------- | ----------------------------------------------- | -------------------------------------------- |
| Grimoire         | Plateforme de jeux narratifs IA                 | Globale                                      |
| Univers          | Jeu éditorial avec identité et règles propres   | Par univers                                  |
| Velkhar          | Premier univers, dark fantasy désertique        | Velkhar                                      |
| Moteur Grimoire  | Orchestration règles, mémoire, état et IA       | Globale                                      |
| Maître du jeu IA | Capacité générique de la plateforme             | Globale                                      |
| L'Aveugle        | Incarnation du MJ IA de Velkhar                 | Velkhar uniquement                           |
| Bibliothèque     | Espace connecté multi-univers du joueur         | Globale                                      |
| Auberge          | Hub narratif entre les runs de Velkhar          | Velkhar uniquement                           |
| Campagne         | Conteneur global d'une aventure dans un univers | Globale avec `universeId`                    |
| Session          | Exécution jouable appartenant à une campagne    | Partagée techniquement, rendue par l'univers |
| Chronique        | Synthèse persistante d'une fin de run           | Globale avec identité d'univers              |
| Souvenir         | Mémoire inter-run de Velkhar                    | Velkhar dans la V1                           |

### 2.1 Règle de rédaction

- Sur le site Grimoire : parler de **Maître du jeu IA**, de moteur, de mémoire et d'univers.
- Sur Velkhar : parler de **L'Aveugle**, de Cendre, de Calamine, de Souvenirs et de Chroniques.
- Ne jamais écrire « Grimoire — Of Ash and Salt » comme si le nom de l'univers qualifiait la
  plateforme.
- Utiliser « Velkhar — Of Ash and Salt » pour le jeu et « Un univers de Grimoire » comme signature
  secondaire.

---

## 3. Positionnement produit

### 3.1 Ce que vend Grimoire

Grimoire vend une collection de jeux narratifs premium partageant un moteur commun :

- action libre ;
- narration incarnée par un MJ IA ;
- règles et jets souverains côté serveur ;
- mémoire persistante ;
- conséquences durables ;
- quêtes, lore, inventaire et Chroniques ;
- identités éditoriales radicalement différentes selon l'univers.

### 3.2 Ce que vend Velkhar

Velkhar vend une expérience précise :

- roguelike narratif solo ;
- dark fantasy de cendre et de sel ;
- L'Aveugle comme MJ et gardien du seuil ;
- Sang, Souffle, Cendre, survie et Calamine ;
- Auberge, expéditions, fins de run et héritage ;
- monde qui se souvient des actes du joueur.

### 3.3 Différence avec Fables

Fables organise son produit autour de milliers de mondes créés par les utilisateurs, d'un workshop,
de la découverte communautaire et de campagnes multijoueurs. Grimoire ne doit pas copier cette
densité.

Grimoire est une bibliothèque éditoriale de jeux conçus et maîtrisés. En V1 :

- pas de création publique d'univers ;
- pas de workshop ;
- pas de galerie communautaire infinie ;
- pas de world-builder exposé ;
- pas de dashboard utilisé comme page de découverte principale.

---

## 4. Parcours utilisateur cible

### 4.1 Première visite anonyme

```text
grimoire.gg
  ↓ “Découvrir Velkhar”
grimoire.gg/univers/velkhar
  ↓ “Entrer dans l'Auberge”
play.grimoire.gg/velkhar/aveugle
  ↓ création ou garantie d'une session Supabase anonyme
play.grimoire.gg/velkhar/personnage
  ↓
play.grimoire.gg/velkhar/session/[campaignId]
```

Règles :

- aucun formulaire de connexion avant l'Auberge ;
- aucun passage par la Bibliothèque ;
- le clic sur « Entrer dans l'Auberge » doit avoir une destination explicite et immédiate ;
- la session Supabase anonyme est créée au premier point protégé grâce à
  `ensureAnonymousSession` ;
- la route de retour est conservée pendant toute conversion vers un compte.

### 4.2 Conversion anonyme vers compte

```text
Session anonyme
  ↓ soft prompt après valeur vécue ou approche du cap
“Sauvegarder ma Chronique”
  ↓ magic link / Google / Discord
linkIdentity ou updateUser
  ↓ même UUID Supabase conservé
Retour à la route exacte de la partie
```

La conversion ne crée pas une copie de campagne : elle conserve le même propriétaire Supabase et
la même progression.

### 4.3 Joueur connecté qui revient

- Le bouton global « Jouer » mène à `play.grimoire.gg/launch?universe=velkhar`.
- L'application `play` décide côté serveur :
  - campagne active connue → reprise directe ou écran de reprise très court ;
  - aucune campagne → Auberge ;
  - plusieurs campagnes actives → Bibliothèque filtrée ou sélecteur compact.
- Le menu de compte expose « Mes aventures ».
- Depuis le jeu, « Mes aventures » est accessible dans le menu, mais ne remplace jamais le hub de
  l'univers.

### 4.4 Accès à la Bibliothèque

- Utilisateur anonyme : la Bibliothèque n'est pas montrée dans la navigation principale.
- Accès direct anonyme à `/bibliotheque` : redirection vers
  `/connexion?next=/bibliotheque`, sans perte de la session anonyme.
- Utilisateur connecté : avatar → « Mes aventures ».
- Après une connexion déclenchée depuis une session : retour à la session, pas à la Bibliothèque.

### 4.5 Arrivée d'un deuxième univers

```text
Bibliothèque
├── Continuer Velkhar
├── Continuer Univers B
├── Mes campagnes
├── Univers disponibles
└── Chroniques récentes
```

Chaque carte adopte une miniature et un accent propres à son univers. Le shell, la navigation, la
typographie fonctionnelle et les états d'erreur restent Grimoire.

---

## 5. Architecture de l'information et routing

### 5.1 Domaine public — `grimoire.gg`

| Route                 | Rôle                                      | Auth             |
| --------------------- | ----------------------------------------- | ---------------- |
| `/`                   | Landing globale Grimoire                  | Non              |
| `/univers`            | Catalogue éditorial                       | Non              |
| `/univers/velkhar`    | Landing commerciale Velkhar               | Non              |
| `/fonctionnalites`    | Explication du moteur                     | Non              |
| `/tarifs`             | Offre commerciale lorsqu'elle est définie | Non              |
| `/patch-notes`        | Index global                              | Non              |
| `/patch-notes/[slug]` | Détail global ou par univers              | Non              |
| `/ressources`         | Hub ressources                            | Non              |
| `/blog`               | Index éditorial et SEO                    | Non              |
| `/blog/[slug]`        | Article                                   | Non              |
| `/chroniques/[slug]`  | Chronique partageable                     | Selon visibilité |

La route `/tarifs` reste derrière un feature flag tant que le modèle économique n'est pas validé.
Le lien peut être masqué sans laisser de destination morte.

### 5.2 Application joueur — `play.grimoire.gg`

| Route                           | Rôle                          | Portée            |
| ------------------------------- | ----------------------------- | ----------------- |
| `/launch`                       | Routeur de lancement/reprise  | Globale           |
| `/connexion`                    | Authentification              | Globale           |
| `/inscription`                  | Conversion/création de compte | Globale           |
| `/auth/callback`                | Callback Supabase sécurisé    | Globale           |
| `/bibliotheque`                 | Résumé du joueur              | Globale connectée |
| `/bibliotheque/campagnes`       | Toutes les campagnes          | Globale connectée |
| `/bibliotheque/chroniques`      | Toutes les Chroniques         | Globale connectée |
| `/compte`                       | Profil et préférences         | Globale connectée |
| `/velkhar/aveugle`              | Auberge                       | Velkhar           |
| `/velkhar/personnage`           | Forge/personnage              | Velkhar           |
| `/velkhar/session/[campaignId]` | Partie                        | Velkhar           |
| `/velkhar/chronique/[id]`       | Fin de run privée             | Velkhar           |

Préserver des redirects depuis les routes actuelles :

```text
/dashboard                         → /bibliotheque
/velkhar/character-create          → /velkhar/personnage
/velkhar/campaign/[id]             → /velkhar/session/[id]
```

Ne supprimer les anciennes routes qu'après observation des logs et expiration de la période de
compatibilité.

### 5.3 Cookies et sous-domaines

- Les cookies d'authentification doivent être limités à `play.grimoire.gg` par défaut.
- Ne pas utiliser un cookie large `.grimoire.gg` sans besoin démontré.
- `grimoire.gg` n'a pas besoin de connaître la session du joueur.
- Le CTA public redirige vers `/launch`; l'application `play` décide ensuite si elle reprend une
  campagne ou ouvre l'Auberge.
- Les destinations `next` sont exclusivement internes et validées par la fonction existante de
  navigation sûre.

---

## 6. Références visuelles validées

### 6.1 Landing Grimoire

Référence : [`grimoire-public-landing-page.png`](mockups/grimoire-public-landing-page.png)

Cette maquette définit :

- la nouvelle identité globale noire, blanche et rouge ;
- le logo Grimoire indépendant de Velkhar ;
- la navigation `Univers`, `Fonctionnalités`, `Tarifs`, `Patch notes`, `Ressources` ;
- la promesse « Un Maître du jeu IA. Des aventures sans limites. » ;
- la bibliothèque d'univers ;
- l'explorateur de fonctionnalités ;
- la mise en avant de Velkhar sans transformer toute la page en landing Velkhar ;
- les patch notes et le CTA global.

Elle ne définit pas définitivement :

- les textes contractuels des tarifs ;
- les illustrations finales des futurs univers ;
- le contenu réel des patch notes ;
- la politique de compte du CTA global.

### 6.2 Landing Velkhar

Référence sélectionnée :
[`velkhar-landing-page-selected.png`](mockups/velkhar-landing-page-selected.png)

Cette maquette définit :

- la **composition validée** : hero cinématographique, boucle de survie, démonstration de mémoire,
  présentation de L'Aveugle, puis CTA final vers l'Auberge ;
- l'adaptation de cette composition avec les **véritables assets existants de Velkhar**, sans
  fabriquer une nouvelle direction artistique concurrente ;
- une identité noire, brune, dorée et ambrée, distincte de Grimoire ;
- `VELKHAR — OF ASH AND SALT` comme marque principale ;
- « Un univers de Grimoire » comme signature discrète ;
- la boucle `Choisis → D20 → Survis → Le monde se souvient` ;
- L'Aveugle explicitement présenté comme MJ IA ;
- l'Auberge comme CTA de lancement anonyme.

La maquette sert de référence de **mise en page**, pas de planche d'assets définitive. Pendant
l'implémentation, chaque image doit être remplacée ou recadrée à partir de la bibliothèque Velkhar
existante, après vérification de sa licence, de sa résolution et de son rôle canonique. Les assets
hero, scène de conséquence, L'Aveugle et Auberge doivent rester chargés uniquement sur les routes
Velkhar.

### 6.3 Bibliothèque Grimoire

La maquette haute fidélité reste à produire avant implémentation. Elle devra couvrir trois états
distincts :

1. **Compte récent sans campagne** : Velkhar dominant, CTA « Entrer dans l'Auberge ».
2. **Une campagne active** : reprise dominante, campagnes et Chroniques secondaires.
3. **Plusieurs univers** : reprise récente, campagnes groupées, catalogue éditorial compact.

Wireframe fonctionnel cible :

```text
┌──────────────────────────────────────────────────────────────┐
│ GRIMOIRE                        Mes aventures   Avatar        │
├──────────────────────────────────────────────────────────────┤
│ CONTINUER                                                    │
│ [Grande campagne Velkhar : lieu, personnage, dernière trace] │
│                                           [REPRENDRE]        │
├──────────────────────────────────────────────────────────────┤
│ MES CAMPAGNES                                                │
│ [Velkhar] [Univers B plus tard]                              │
├──────────────────────────────────────────────────────────────┤
│ UNIVERS                                                      │
│ [Velkhar disponible] [À venir] [À venir]                     │
├──────────────────────────────────────────────────────────────┤
│ CHRONIQUES RÉCENTES                                          │
└──────────────────────────────────────────────────────────────┘
```

Ne pas reprendre de Fables :

- sidebar pleine de fonctions de création ;
- workshop ;
- image studio ;
- classements communautaires ;
- grille infinie de mondes ;
- métriques sociales sans produit correspondant.

### 6.4 Découpage des maquettes avant code

Chaque surface doit disposer de références séparées, lisibles et non d'une seule image verticale
compressée.

#### Landing Grimoire

1. Header + Hero.
2. Comment fonctionne le moteur.
3. Bibliothèque d'univers.
4. Explorateur de fonctionnalités.
5. Univers à l'affiche.
6. Patch notes.
7. CTA + Footer.

#### Landing Velkhar

1. Header de transition Grimoire → Velkhar + Hero.
2. Boucle de jeu.
3. Monde, mémoire et conséquences.
4. L'Aveugle, MJ IA.
5. CTA Auberge.

#### Application `play`

1. Bibliothèque vide.
2. Bibliothèque avec campagne active.
3. Bibliothèque multi-univers.
4. Menu de compte.
5. Route `/launch` et état de reprise.
6. Conversion anonyme non bloquante.

Pour chaque écran : desktop 1440 px, mobile 390 px, état clavier/focus, état chargement, état erreur,
état vide et `prefers-reduced-motion` lorsque pertinent.

---

## 7. Direction artistique par couche

### 7.1 Grimoire global

- Noir profond, gris minéral, blanc éditorial, accent rouge contrôlé.
- Architecture monumentale, portails, signes géométriques et typographie moderne condensée.
- Pas de dorures Velkhar comme langage principal.
- Illustrations originales globales et couvertures propres à chaque univers.
- Interface claire, premium, éditoriale, non « agence IA ».

### 7.2 Velkhar

- Conserver les assets existants dans `apps/frontend/public/landing`, `scenes`, `characters` et
  `ui-kit`.
- Noir/encre, parchemin, or ancien, ambre, cendre, sel et ruines.
- Conserver L'Aveugle, l'Auberge, le grimoire, le D20, la Citadelle et les vocations.
- Ne pas remplacer les illustrations par une nouvelle direction volcanique générique.
- La barre globale Grimoire peut apparaître discrètement, mais elle ne recolore pas le jeu.

### 7.3 Bibliothèque

- Shell Grimoire global.
- Cartes de campagne colorées par l'univers.
- Une carte peut charger une miniature, un sigil et un accent, jamais le thème complet du jeu.
- L'entrée dans une campagne déclenche le passage visuel au thème de l'univers.

### 7.4 Tokens

- Les tokens actuels `DESIGN_TOKENS.md` deviennent les tokens **Velkhar**, même s'ils sont encore
  nommés globalement dans le code.
- Créer ultérieurement un thème plateforme distinct, sans écraser les valeurs Velkhar.
- Aucun composant partagé ne doit hardcoder une couleur de monde.

Structure cible :

```text
themes/
├── platform.css
└── universes/
    ├── velkhar.css
    └── future-world.css
```

---

## 8. Motion design premium sans excès

### 8.1 Principes

- Une animation signature par page.
- Une seule section épinglée au scroll sur la landing Grimoire.
- Priorité à `transform` et `opacity`.
- Les animations ne retardent jamais un CTA ni la navigation.
- Le dashboard/Bibliothèque reste calme et fonctionnel.
- Mobile : pas de scroll-jacking, pas de pin long, pas de séquence de dizaines d'images.
- `prefers-reduced-motion` supprime scrub, parallaxe et mouvements non essentiels.

### 8.2 Landing Grimoire

- Hero : révélation du portail, profondeur très lente, lumière contrôlée.
- Moteur : ligne causale animée entre action, MJ, règles et mémoire.
- Couvertures : profondeur 2–4 px, zoom maximal 1.02, crossfade de l'ambiance.
- Explorateur : transition 350–500 ms entre les fonctionnalités.
- Changement de page : voile ou masque 450–650 ms.

### 8.3 Landing Velkhar

- Conserver l'idée d'ouverture du grimoire comme animation signature.
- Réutiliser la séquence existante uniquement si son coût est acceptable sur desktop.
- Remplacer la séquence par vidéo optimisée ou image statique sur mobile/connexion lente.
- L'Auberge peut utiliser une lumière vivante et un reveal de porte, pas une boucle agressive.

### 8.4 Budget motion

- Maximum trois groupes animés simultanément.
- `will-change` posé seulement pendant l'animation puis retiré.
- Un seul système de scroll lissé, jamais plusieurs.
- Tous les timelines et ScrollTriggers nettoyés au démontage.
- Aucun curseur custom obligatoire ; s'il est conservé sur Velkhar, il doit être désactivé sur
  tactile et en reduced motion.

---

## 9. Architecture monorepo cible

### 9.1 Transition depuis l'existant

État actuel : `apps/frontend` contient marketing, auth, dashboard et Velkhar.

Cible :

```text
apps/
├── web/
├── play/
└── backend/
packages/
├── shared/
├── universe-contract/
├── game-runtime/
└── ui-foundation/       # seulement si des primitives sont réellement communes
```

Ne pas créer tous les packages dès le premier ticket. Extraire uniquement après identification de
deux consommateurs réels.

### 9.2 `apps/web`

```text
apps/web/src/app/
├── page.tsx
├── univers/
│   ├── page.tsx
│   └── velkhar/page.tsx
├── fonctionnalites/page.tsx
├── tarifs/page.tsx
├── patch-notes/
├── ressources/
├── blog/
└── chroniques/[slug]/page.tsx
```

Responsabilités : SEO, contenu public, conversion, catalogue, patch notes et Chroniques publiques.
Pas de Zustand de session, pas de logique mécanique, pas de clé privée d'API.

### 9.3 `apps/play`

```text
apps/play/src/app/
├── (auth)/
├── (global)/
│   ├── bibliotheque/
│   └── compte/
├── launch/
└── (game)/
    ├── velkhar/
    │   ├── aveugle/
    │   ├── personnage/
    │   ├── session/[campaignId]/
    │   ├── _components/
    │   ├── _config/
    │   └── _theme/
    └── future-world/
```

Découpage conceptuel du code de l'application :

```text
apps/play/src/
├── global/
│   ├── authentication/
│   ├── library/
│   └── account/
└── universes/
    ├── velkhar/
    │   ├── routes/
    │   ├── components/
    │   ├── theme/
    │   ├── assets/
    │   └── index.ts
    └── heroes/                 # uniquement lorsqu'il existe réellement
        ├── routes/
        ├── components/
        ├── theme/
        ├── assets/
        └── index.ts
```

Le dossier `app/` de Next.js reste responsable des URLs et compose ces modules. Le dossier
`universes/` porte leur implémentation isolée. Les médias servis directement peuvent rester sous
`public/universes/<universeId>/`, tandis que les petits assets importés par le code peuvent vivre
dans le module de l'univers.

Règles existantes de `FRONTEND_ARCHITECTURE.md` conservées :

- plusieurs routes du même univers → composants privés de l'univers ;
- plusieurs univers → `features/` ou `game-runtime` ;
- primitives sans métier → `components/ui` ou `ui-foundation` ;
- aucune feature partagée ne connaît L'Aveugle, la Calamine ou un canon précis.

### 9.4 Registre d'univers

Le registre est explicite et typé :

```ts
export const UNIVERSE_LOADERS = {
  velkhar: () => import("./velkhar"),
  // futureWorld: () => import('./future-world'),
} satisfies Record<UniverseId, UniverseLoader>;
```

Interdictions :

- `import * as universes from ...` dans le bundle initial ;
- chemin d'import assemblé à partir d'une entrée utilisateur ;
- barrel global réexportant tous les composants et assets des univers ;
- asset d'un univers importé dans un layout global.

### 9.5 Contrat d'univers frontend

```ts
interface UniverseManifest {
  id: UniverseId;
  slug: string;
  displayName: string;
  subtitle: string;
  status: "available" | "coming-soon" | "private";
  routes: UniverseRoutes;
  theme: UniverseThemeReference;
  terminology: UniverseTerminology;
  capabilities: UniverseCapabilities;
  marketing: UniverseMarketingMetadata;
}
```

Le manifeste ne doit pas contenir de secrets, de prompts privés ni de règles souveraines.

### 9.6 Pourquoi conserver un seul frontend de jeu

Créer prématurément `play-velkhar`, `play-heroes`, `play-cyberpunk` et `play-space` entraînerait :

- plusieurs intégrations d'authentification à maintenir et auditer ;
- plusieurs navigations, Bibliothèques et espaces compte ;
- de la duplication pour les sessions, sauvegardes, erreurs et états de chargement ;
- des correctifs transverses à reporter dans chaque application ;
- davantage de pipelines, variables d'environnement et déploiements ;
- des transitions inter-univers et une reprise de campagne plus complexes ;
- aucun gain automatique de vitesse : le nombre d'applications ne garantit pas la taille des
  bundles réellement téléchargés.

Les performances doivent venir du découpage par route et par univers :

- chunks JavaScript séparés par route ;
- imports dynamiques explicites via `UNIVERSE_LOADERS` ;
- CSS, polices et composants chargés uniquement pour l'univers ouvert ;
- assets namespacés par univers et chargés progressivement ;
- CDN avec cache long et hash de contenu ;
- aucun preload ou barrel global d'un univers non visité ;
- contrôle de la waterfall réseau et des bundles dans le CI.

Une session Velkhar ne doit donc télécharger ni le code, ni le thème, ni les médias d'un autre
univers. Le chemin totalement dynamique ci-dessous est interdit, car il est moins analysable par
le bundler et transforme une donnée utilisateur en chemin d'import :

```ts
// Interdit
await import(`@/universes/${universeId}`);
```

Le registre fermé et typé de la section 9.4 est la seule porte de chargement autorisée.

### 9.7 Quand extraire un univers en application autonome

Une extraction devient légitime seulement si au moins une contrainte mesurée le nécessite :

- technologie ou runtime réellement incompatible avec `apps/play` ;
- cycle de publication indépendant ;
- équipe autonome avec ownership complet ;
- interface, runtime et dépendances presque sans rapport avec les autres univers ;
- besoin de déploiement, disponibilité ou dimensionnement indépendant ;
- frontière réglementaire ou de sécurité spécifique ;
- impossibilité démontrée de tenir les budgets de bundle malgré le découpage par route.

La cible peut alors évoluer sans remettre en cause les contrats du moteur :

```text
apps/
├── web/
├── play/                # Bibliothèque et univers encore mutualisés
├── play-velkhar/        # seulement si une contrainte réelle l'impose
├── play-heroes/
└── backend/             # déployé sur api.grimoire.gg
```

Cette décision exige un ADR avec mesures, impacts opérationnels, stratégie d'authentification et
coût de maintenance. Elle ne doit pas être prise pour anticiper un besoin hypothétique.

---

## 10. Gestion des assets

### 10.1 Principes

- Chaque univers possède son namespace d'assets.
- Les assets source et les dérivés web sont distingués.
- Les noms sont descriptifs et versionnés.
- Aucun asset futur n'est préchargé depuis une page Velkhar.
- Les images critiques ont une taille intrinsèque et un ratio réservant l'espace pour éviter CLS.

### 10.2 Organisation cible

```text
public/
├── platform/
│   ├── brand/
│   ├── landing/
│   └── universes/
└── universes/
    └── velkhar/
        ├── marketing/
        ├── scenes/
        ├── characters/
        ├── ui/
        └── cinematics/
```

À moyen terme, les médias lourds peuvent être servis par un CDN/object storage :

```text
cdn.grimoire.gg/platform/...
cdn.grimoire.gg/universes/velkhar/...
```

### 10.3 Pipeline

- Sources haute définition conservées hors bundle de production.
- Dérivés AVIF/WebP responsifs pour les images.
- MP4/WebM avec poster pour les cinématiques.
- Hash de contenu et cache immutable.
- Préchargement du hero seulement.
- Chargement différé des sections hors viewport.
- Audit de droits/licences avant publication.

---

## 11. Modèle de données cible

### 11.1 Problèmes actuels à résoudre

- `Character` impose `@@unique([userId])` : un seul personnage total par utilisateur.
- `GameSession` ne porte pas d'`universeId`.
- Il n'existe pas de modèle `Campaign` global.
- `Souvenir` et `Chronicle` ne portent pas d'`universeId` ni de relation de campagne.
- Plusieurs champs sont explicitement Velkhar dans `Character` : Sang, Souffle, Cendre, survie,
  Calamine, Fer et topics de L'Aveugle.

### 11.2 Modèle cible conceptuel

```text
User
  └── Campaign[]
        ├── universeId
        ├── universeVersion
        ├── status
        ├── Character/Avatar
        ├── GameSession[]
        ├── Chronicle[]
        └── universeState
```

### 11.3 `Campaign`

Champs recommandés :

```text
id
userId
universeId
universeVersion
title
status                 active | completed | abandoned
currentSessionId?
lastActivityAt
createdAt
updatedAt
```

Le propriétaire est toujours le `User.id` Supabase, y compris pour un utilisateur anonyme. La
conversion par linking conserve cet identifiant.

### 11.4 `Character`

- Retirer progressivement l'unicité globale `userId`.
- Relier le personnage à une campagne.
- Autoriser plusieurs personnages/campagnes par utilisateur.
- Séparer les champs universels des états propres à Velkhar.

Option V1 recommandée :

```text
Character
├── id, campaignId, userId
├── name, avatarUrl
├── archetypeId
└── universeState Json validé par l'adaptateur backend
```

Ne pas convertir immédiatement tous les champs Velkhar en JSON si cela fait perdre les contraintes
utiles. Une migration intermédiaire peut conserver les colonnes actuelles et introduire
`campaignId`/`universeId`; la généralisation des stats vient lors du deuxième univers.

### 11.5 `GameSession`

Ajouter :

- `campaignId` ;
- `universeId` ou dérivation sûre depuis Campaign ;
- `universeVersion` figée pour la reprise ;
- index sur `(campaignId, status, updatedAt)` ;
- index sur `(userId, updatedAt)` via Campaign pour la Bibliothèque.

### 11.6 `Chronicle` et `Souvenir`

Ajouter :

- `campaignId` ;
- `universeId` ;
- visibilité `private | unlisted | public` pour la Chronique ;
- `slug` unique seulement lorsqu'une Chronique devient partageable ;
- provenance conservée après suppression d'une session.

Les Souvenirs restent une mécanique Velkhar tant qu'aucun autre univers n'en définit l'équivalent.
La Bibliothèque peut afficher des « héritages » génériques via un adaptateur de présentation.

### 11.7 Migration sans perte

1. Créer `Campaign` nullable/compatible.
2. Backfiller une campagne `velkhar` par personnage/session existants.
3. Ajouter les nouvelles relations sans supprimer les anciennes.
4. Déployer le code en double lecture contrôlée.
5. Vérifier les comptes anonymes et connectés.
6. Passer les relations en non-null quand les métriques confirment le backfill.
7. Retirer `@@unique([userId])` seulement après adaptation des services.
8. Supprimer les anciens chemins de lecture dans une migration ultérieure.

Chaque étape doit disposer d'un script de vérification et d'une stratégie de rollback.

---

## 12. Backend multi-univers

### 12.1 Structure cible

```text
apps/backend/src/
├── core/
│   ├── campaigns/
│   ├── sessions/
│   ├── auth/
│   ├── memory/
│   └── ai/
├── universes/
│   └── velkhar/
│       ├── rules/
│       ├── prompts/
│       ├── validators/
│       ├── lore/
│       ├── services/
│       └── manifest.ts
├── routes/
└── middleware/
```

Ne pas déplacer tous les fichiers au début. Introduire d'abord les frontières via interfaces et
adaptateurs, puis déplacer par système avec tests.

### 12.2 Contrat backend d'univers

```ts
interface UniverseEngineAdapter {
  id: UniverseId;
  version: string;
  validateAction(input: unknown): ValidatedAction;
  resolveRules(context: RuleContext): MechanicalResolution;
  buildNarrativeContext(context: NarrativeContext): PromptContext;
  validateNarrativeOutput(output: unknown): ValidatedNarrative;
  applyConsequences(context: ConsequenceContext): PersistedChanges;
  buildChronicle(context: ChronicleContext): ChroniclePayload;
}
```

Le routeur sélectionne l'adaptateur depuis un registre serveur allowlisté. Il ne charge jamais un
module depuis un nom libre envoyé par le client.

### 12.3 L'Aveugle

L'Aveugle devient l'adaptateur/persona Velkhar :

- prompt système propre ;
- vocabulaire ;
- topics de l'Auberge ;
- règles de Souvenirs ;
- contraintes de canon ;
- voix narrative et validations spécifiques.

Le service générique peut s'appeler `GameMasterService`, mais il reçoit un adaptateur d'univers. Ne
pas renommer L'Aveugle en « Grimoire AI » dans les écrans Velkhar.

### 12.4 API cible

Endpoints globaux :

```text
GET    /api/me
GET    /api/me/library
GET    /api/campaigns
GET    /api/campaigns/:campaignId
GET    /api/chronicles
GET    /api/chronicles/:id
PATCH  /api/chronicles/:id/visibility
```

Endpoints univers-scoped :

```text
POST   /api/universes/:universeId/campaigns
GET    /api/universes/:universeId/campaigns/:campaignId
POST   /api/universes/:universeId/campaigns/:campaignId/actions
GET    /api/universes/:universeId/campaigns/:campaignId/state
POST   /api/universes/velkhar/campaigns/:campaignId/aveugle/talk
POST   /api/universes/velkhar/campaigns/:campaignId/aveugle/spend
```

Toutes les réponses conservent `{ success, data?, error? }`. Toutes les entrées passent par Zod.

### 12.5 Validation croisée obligatoire

Pour toute route contenant `universeId` et `campaignId` :

1. vérifier le JWT ;
2. charger la campagne par `campaignId` **et** `userId` ;
3. vérifier `campaign.universeId === params.universeId` ;
4. charger l'adaptateur autorisé ;
5. valider le payload spécifique ;
6. appliquer les règles côté serveur ;
7. persister dans une transaction si plusieurs tables changent.

---

## 13. Contrats partagés

### 13.1 Types globaux

- `UniverseId`
- `UniverseSummary`
- `UniverseCapabilities`
- `CampaignSummary`
- `CampaignStatus`
- `LibraryResponse`
- `ChronicleSummary`
- `LaunchDecision`
- erreurs API stables.

### 13.2 Types spécifiques

Les types Velkhar restent nommés :

- `VelkharCharacterState`
- `VelkharSurvivalState`
- `VelkharSessionResponse`
- `VelkharAveugleTopic`
- `VelkharChronicleMetadata`

Ne pas généraliser `blood`, `breath`, `ash` en trois ressources universelles.

### 13.3 Discriminants

Utiliser des unions discriminées :

```ts
type UniverseSessionState =
  | { universeId: "velkhar"; state: VelkharSessionState }
  | { universeId: "future-world"; state: FutureWorldSessionState };
```

Le frontend doit échouer explicitement pour un univers inconnu, pas rendre un thème par défaut
silencieux.

---

## 14. Sécurité

### 14.1 Frontière de confiance

- Le frontend n'est pas une frontière de sécurité.
- `universeId`, `campaignId`, `userId`, dégâts, dés, inventaire et conséquences venant du client ne
  sont jamais fiables.
- L'identité vient exclusivement du JWT Supabase vérifié via JWKS.
- Le backend ne lit jamais un `userId` du body pour déterminer le propriétaire.

### 14.2 Autorisation objet par objet

Chaque accès à Campaign, Character, GameSession, SceneLog, Chronicle ou Souvenir applique un filtre
de propriétaire.

```text
where: {
  id: campaignId,
  userId: authenticatedUserId,
  universeId: expectedUniverseId
}
```

Un UUID difficile à deviner n'est pas une autorisation.

### 14.3 Supabase et base de données

État actuel : autorisation Express explicite, RLS différée.

Avant exposition multi-univers :

1. inventorier les tables exposées par la Data API ;
2. activer RLS sur toute table exposée du schéma `public` ;
3. ne créer aucune policy large par commodité ;
4. révoquer les grants Data API inutiles ou déplacer les tables internes vers un schéma privé ;
5. conserver les contrôles Express même avec RLS ;
6. vérifier le rôle PostgreSQL utilisé par Prisma et documenter s'il contourne RLS ;
7. tester les lectures/écritures croisées entre deux utilisateurs ;
8. tester utilisateur anonyme → compte lié sans changement de propriétaire.

### 14.4 Sessions et cookies

- Supabase SSR et PKCE.
- Cookies `HttpOnly`, `Secure`, `SameSite=Lax` ou plus strict selon le flux.
- Rotation et expiration gérées par Supabase.
- Pas de token dans localStorage pour le flux SSR.
- Redirects OAuth exacts pour production et previews autorisées.
- `next` validé comme destination interne.

### 14.5 Protection de l'IA et des coûts

- Rate limit par utilisateur et par IP sur les endpoints coûteux.
- Limite de taille des actions libres.
- Timeout et annulation des appels provider.
- Budget de tokens par tour et par campagne.
- Cap anonyme souverain côté backend.
- Idempotency key pour éviter un double tour facturé sur retry.
- Journalisation des coûts sans stocker de secrets ni de texte sensible inutile.
- Fallback multi-modèles conformément au backlog existant.

### 14.6 Prompt et sortie IA

- Texte utilisateur délimité comme donnée non fiable.
- Canon et règles injectés séparément.
- Sortie structurée parsée et validée.
- Conséquences mécaniques sur allowlist.
- Toute condition, acquisition ou quête proposée par l'IA est validée par l'adaptateur d'univers.
- L'IA ne choisit jamais directement un propriétaire, un solde, un jet ou un inventaire final.

### 14.7 Sécurité web

- Helmet côté Express.
- CSP stricte, adaptée aux providers réellement utilisés.
- CORS avec allowlist exacte de `grimoire.gg` et `play.grimoire.gg` ; pas de `*` avec credentials.
- CSRF évalué pour les endpoints à cookie ; bearer token via proxy conservé.
- Validation MIME/taille pour toute future upload.
- Secrets uniquement en variables d'environnement.
- Sentry/logs expurgés des tokens, cookies, prompts privés et données personnelles.

### 14.8 Tests sécurité requis

- utilisateur A ne lit/modifie jamais une campagne B ;
- modification de `universeId` dans l'URL refusée ;
- campagne Velkhar inaccessible par un endpoint d'un autre univers ;
- token expiré → 401 ; autorisation insuffisante → 403/404 cohérent ;
- retry d'une action avec même clé → pas de double conséquence ;
- cap anonyme vérifié côté backend ;
- redirection externe dans `next` rejetée ;
- service role absent des bundles frontend ;
- politiques RLS testées avec rôles `anon` et `authenticated`.

---

## 15. Performance

### 15.1 Objectifs

- LCP p75 ≤ 2,5 s.
- INP p75 ≤ 200 ms.
- CLS p75 ≤ 0,1.
- 60 FPS sur les animations desktop compatibles.
- Navigation et action de jeu utilisables sur mobile moyen et connexion 4G.

### 15.2 Stratégie frontend

- Server Components par défaut pour marketing et Bibliothèque.
- Client Components seulement pour interactions nécessaires.
- Code splitting par route.
- Imports dynamiques explicites des rendus d'univers.
- Streaming/Suspense pour les listes connectées.
- React Query pour le cache serveur, Zustand uniquement pour l'état UI/session local utile.
- Pas d'import d'un monde dans le layout global.

### 15.3 Préchargement

- Précharger uniquement le hero de la page actuelle.
- Désactiver `prefetch` sur les cartes d'univers lourdes si cela télécharge prématurément leurs
  chunks.
- Précharger la route de jeu après intention forte : hover prolongé, focus ou clic, pas au chargement
  initial.
- Dans une session, précharger la prochaine illustration probable lorsque le backend a déjà choisi
  la scène.

### 15.4 Budgets de contrôle

À figer après mesure initiale avec `pnpm analyze` :

- budget JavaScript initial par route ;
- poids maximum hero mobile/desktop ;
- nombre de polices et variantes ;
- poids vidéo/séquence ;
- nombre maximal de requêtes critiques.

Le CI doit échouer ou avertir sur une régression significative, pas seulement produire un rapport.

### 15.5 Velkhar

- Auditer la séquence de 96 frames.
- Desktop : conserver seulement si la mesure prouve sa fluidité et son intérêt de conversion.
- Mobile : poster statique ou vidéo courte optimisée.
- Ne pas précharger `new-gameplay`, `Castle` et l'Auberge avant leur proximité de viewport.
- Les assets de session ne sont chargés qu'après entrée dans `play`.

### 15.6 Backend

- Index DB sur propriétaires, campagne, statut et activité récente.
- Pagination des campagnes, Chroniques et scènes.
- Pas de chargement de tout l'historique pour construire un tour IA.
- Retrieval mémoire borné et instrumenté.
- Transactions courtes.
- Timeout par provider et circuit breaker/fallback.
- Cache des JWKS conservé.

---

## 16. SEO, contenu et conversion

### 16.1 Site public

- Metadata unique par route.
- Canonical URLs.
- `sitemap.xml` et `robots.txt`.
- Open Graph par univers.
- Données structurées pertinentes pour jeu vidéo/articles, validées avant publication.
- Pages EN/FR avec alternates corrects.
- Patch notes filtrables par plateforme/univers.
- Blog orienté ressources utiles, pas remplissage SEO générique.

### 16.2 Événements de funnel

Événements minimaux, sans texte narratif personnel :

```text
platform_viewed
universe_opened
velkhar_landing_viewed
auberge_cta_clicked
anonymous_session_started
character_created
first_action_sent
signup_prompt_seen
anonymous_account_linked
campaign_resumed
chronicle_completed
```

Définir la base légale, le consentement et la durée de rétention avant d'ajouter un outil analytics.

### 16.3 Indicateurs de décision

- clic landing Grimoire → Velkhar ;
- clic landing Velkhar → Auberge ;
- Auberge → personnage créé ;
- personnage → première action ;
- taux de conversion anonyme → compte ;
- taux de reprise J+1/J+7 ;
- taux de fin de Chronique ;
- performance par route et appareil.

---

## 17. Déploiement VPS

### 17.1 Topologie

```text
Internet
  ↓
Reverse proxy / TLS
  ├── grimoire.gg       → container web
  ├── play.grimoire.gg  → container play
  └── api.grimoire.gg   → container backend
                           ↓
                      Supabase PostgreSQL/Auth
                           ↓
                        OpenRouter
```

### 17.2 Exigences

- Containers et variables d'environnement distincts.
- Healthcheck pour chaque application.
- Migrations DB en étape contrôlée avant mise en service du backend compatible.
- Déploiement backward compatible pendant les migrations.
- TLS automatique et redirection HTTPS.
- Compression Brotli/Gzip des assets texte.
- Cache immutable des médias hashés.
- Logs structurés et corrélation par request ID.
- Sauvegardes et procédure de restauration DB testées.
- Rollback vers l'image précédente sans rollback destructif de migration.

### 17.3 CI/CD

- lint, type-check et tests par package impacté ;
- build `web`, `play`, `backend` ;
- tests contrat `shared` avant consommateurs ;
- tests E2E golden path ;
- scan dépendances et CodeQL ;
- analyse bundle et Lighthouse sur routes critiques ;
- migrations avec validation pré/post ;
- smoke test production après déploiement.

---

## 18. Stratégie de migration par phases

### Phase 0 — Protéger la v0.1 actuelle

Objectif : terminer le vertical slice Velkhar sans mélanger ce programme.

- terminer les bloqueurs actuels ;
- exécuter le golden path réel ;
- documenter les métriques de base ;
- ne pas renommer massivement `apps/frontend` avant stabilisation ;
- garder ce plan en `status: deferred`.

Sortie : v0.1 déployable ou décision explicite de démarrer la transformation avant release.

### Phase 1 — ADR et contrats

- ADR Grimoire plateforme / Velkhar univers ;
- ADR un monorepo, deux frontends (`web`, `play`) ;
- ADR modèle Campaign ;
- créer `UniverseId`, `CampaignSummary`, `LibraryResponse` ;
- étendre `config/worlds.ts` sans changer le parcours actuel ;
- tests de contrats.

Sortie : frontières figées, aucun changement visuel majeur.

### Phase 2 — Modèle Campaign et migration backend

- introduire `Campaign` ;
- backfill Velkhar ;
- relier Character, GameSession, Chronicle et Souvenir ;
- adapter les services ;
- supprimer l'hypothèse un personnage par utilisateur ;
- exposer les endpoints globaux de Bibliothèque ;
- tests d'autorisation et migrations.

Sortie : backend capable de plusieurs campagnes Velkhar et prêt pour `universeId`.

### Phase 3 — Frontières d'univers backend

- créer le registre serveur ;
- extraire l'adaptateur Velkhar sans changer le comportement ;
- isoler prompts, validateurs, règles et lore ;
- ajouter `universeVersion` ;
- tests de non-régression complets.

Sortie : moteur commun + Velkhar comme premier adaptateur.

### Phase 4 — Séparer `web` et `play`

- créer `apps/web` ;
- transformer l'actuel `apps/frontend` en `apps/play` ou migrer progressivement ;
- déplacer marketing/public vers `web` ;
- conserver auth, Bibliothèque et jeu dans `play` ;
- créer les redirects ;
- partager uniquement les contrats/primitives nécessaires ;
- valider cookies, OAuth, CORS et variables d'environnement.

Sortie : domaines public et joueur déployables indépendamment.

### Phase 5 — Landing Grimoire

- implémenter la maquette `grimoire-public-landing-page.png` par sections ;
- générer/valider les assets globaux définitifs ;
- brancher univers, fonctionnalités, patch notes et ressources ;
- feature flag Tarifs ;
- animations et reduced motion ;
- SEO EN/FR ;
- funnel analytics minimal.

Sortie : plateforme comprise en moins de dix secondes, Velkhar clairement premier univers.

### Phase 6 — Landing Velkhar

- déplacer/refondre la landing actuelle sous `/univers/velkhar` ;
- implémenter la composition de `velkhar-landing-page-selected.png` ;
- réutiliser les assets actuels et valider leurs recadrages section par section ;
- retirer les blocs génériques déjà expliqués par Grimoire ;
- présenter L'Aveugle comme MJ IA ;
- CTA direct vers `/launch?universe=velkhar` ou Auberge ;
- optimiser la séquence hero ;
- accessibilité et responsive.

Sortie : page courte, spécifique, vendeuse, sans perte d'identité.

### Phase 7 — Bibliothèque

- produire et valider les trois maquettes d'état ;
- renommer `/dashboard` en `/bibliotheque` ;
- supprimer l'accès anonyme visible ;
- brancher campagne active, campagnes, univers et Chroniques ;
- rendre le CTA de reprise direct ;
- ajouter compte et déconnexion ;
- conserver un redirect `/dashboard`.

Sortie : espace connecté utile, pas un clone de Fables.

### Phase 8 — Durcissement sécurité et performance

- RLS/grants/schéma privé ;
- rate limits utilisateur + IP ;
- idempotence des actions IA ;
- CSP/CORS/cookies ;
- bundle budgets ;
- audit médias et animations ;
- E2E multi-compte ;
- tests de charge ciblés.

Sortie : go/no-go sécurité et performance documenté.

### Phase 9 — Préparer le deuxième univers sans le construire

- créer un univers factice uniquement dans les tests ;
- vérifier qu'il peut fournir thème, routes, session state et adaptateur backend ;
- vérifier qu'aucun import Velkhar ne fuite dans le runtime générique ;
- vérifier que le bundle Velkhar n'est pas chargé sur l'univers factice ;
- supprimer le code factice de production.

Sortie : architecture prouvée par un deuxième consommateur test, sans annoncer un jeu fictif.

---

## 19. Découpage recommandé en issues/PR

Chaque ligne doit devenir une issue puis une branche dédiée depuis `develop`.

1. Docs/ADR — séparation Grimoire/Velkhar.
2. Shared — contrats Universe et Campaign.
3. DB — modèle Campaign additif.
4. Backend — backfill et double lecture.
5. Backend — endpoints Bibliothèque.
6. Backend — autorisation objet + tests croisés.
7. Backend — registre/adaptateur Velkhar.
8. Frontend — route launcher et redirects.
9. Infrastructure — création `apps/web`.
10. Frontend — migration marketing vers `web`.
11. Frontend — landing Grimoire section par section.
12. Frontend — landing Velkhar réutilisant les assets.
13. Design — maquettes Bibliothèque trois états + mobile.
14. Frontend — Bibliothèque connectée.
15. Backend/DB — RLS, grants et schéma exposé.
16. Backend — rate limiting, idempotence, coûts IA.
17. Frontend — performance médias/motion.
18. QA — E2E, accessibilité, responsive, sécurité.
19. Ops — domaines, CORS, OAuth et déploiement VPS.
20. Architecture — univers factice de validation en tests.

Les contrats backend/shared doivent être livrés avant leur consommation frontend. Une PR frontend
met à jour `FRONTEND_STATUS/NEXT`; une PR backend/shared/IA met à jour `BACKEND_STATUS/NEXT`.

---

## 20. Tests et critères d'acceptation

### 20.1 Parcours critique anonyme

- `/` → Velkhar → Auberge sans login ;
- session anonyme créée avant le premier endpoint protégé ;
- personnage et campagne persistés ;
- première action jouable ;
- refresh/reprise sans perte ;
- cap anonyme souverain ;
- conversion puis retour à la même partie.

### 20.2 Parcours connecté

- connexion par magic link et providers configurés ;
- Bibliothèque inaccessible anonymement ;
- campagne active visible ;
- reprise directe ;
- campagnes d'un autre utilisateur invisibles ;
- Chronique visible selon sa politique de partage.

### 20.3 Multi-univers

- `universeId` obligatoire dans Campaign ;
- adaptateur inconnu refusé ;
- Velkhar ne charge aucun asset d'un autre univers ;
- runtime partagé n'importe aucun type Velkhar ;
- Bibliothèque peut afficher deux manifestes de test ;
- route d'un univers ne peut pas charger une campagne d'un autre.

### 20.4 Design et accessibilité

- navigation clavier complète ;
- focus visible ;
- contraste vérifié ;
- hiérarchie H1/H2 correcte ;
- alternatives textuelles ;
- reduced motion ;
- zoom 200 % ;
- mobile 390 px sans contenu inaccessible ;
- aucun pin ne masque du contenu ;
- CTA principal compréhensible sans animation.

### 20.5 Performance

- Core Web Vitals mesurés sur les routes critiques ;
- bundle par route inspecté ;
- absence d'assets cross-universe dans le waterfall ;
- LCP hero optimisé ;
- pas de layout shift des images ;
- session interactive sur mobile moyen ;
- API p95 et latence provider instrumentées séparément.

---

## 21. Observabilité

- request ID traversant proxy Next, Express et appels IA ;
- logs structurés par `universeId`, endpoint, statut et latence ;
- aucun prompt complet ni token d'auth dans les logs par défaut ;
- métriques d'erreur par univers ;
- coût IA par utilisateur/campagne agrégé ;
- taux de fallback provider ;
- taux d'échec auth/callback ;
- alertes sur 5xx, latence, coût et saturation DB ;
- tableau de bord Core Web Vitals séparé pour `web` et `play`.

---

## 22. Risques et mesures

| Risque                             | Impact                 | Mesure                                      |
| ---------------------------------- | ---------------------- | ------------------------------------------- |
| Réécriture avant v0.1              | Retard du jeu          | Phase 0 et PR additives                     |
| Abstraction trop précoce           | Architecture fictive   | Valider avec un univers test en Phase 9     |
| Perte de l'identité Velkhar        | Produit générique      | Assets/tokens/persona restent Velkhar       |
| Bundle contenant tous les mondes   | Lenteur                | Registre dynamique + analyse waterfall      |
| Migration Character destructive    | Perte de sauvegarde    | Backfill, double lecture, rollback          |
| Dashboard inutile                  | Friction               | Bibliothèque hors tunnel anonyme            |
| IDOR campagne                      | Fuite de données       | Contrôle propriétaire à chaque requête      |
| Abus IA anonyme                    | Coûts                  | Cap, IP rate limit, idempotence, budgets    |
| Cookies inter-domaines trop larges | Surface d'attaque      | Cookies limités à `play`                    |
| Deux apps dupliquent le DS         | Maintenance            | Partager seulement les primitives stables   |
| Animations AAA trop lourdes        | Conversion/performance | Budgets, alternatives mobile/reduced motion |
| Futures cartes trompeuses          | Promesse non tenue     | « À venir » sans date ni faux gameplay      |

---

## 23. Hors périmètre initial

- Création d'univers par les joueurs.
- Workshop et marketplace.
- Multiplayer.
- Application frontend autonome par univers.
- Refonte du moteur en microservices.
- Personnalisation totale du MJ par l'utilisateur.
- Tarification avant validation business.
- Publication d'un deuxième univers fictif pour prouver l'architecture.
- Migration immédiate de tous les champs Velkhar vers un modèle JSON générique.

---

## 24. Definition of Done du programme

Le programme est terminé lorsque :

- Grimoire et Velkhar sont compris comme deux marques liées mais distinctes ;
- les domaines `web`, `play` et `api` sont opérationnels ;
- la première partie Velkhar reste anonyme et directe ;
- la Bibliothèque est connectée, utile et multi-campagne ;
- Velkhar conserve L'Aveugle, ses assets et son design system ;
- le backend possède Campaign, `universeId` et un adaptateur Velkhar ;
- les autorisations objet et la protection DB sont testées ;
- les bundles/assets sont isolés par univers ;
- les performances et l'accessibilité respectent les budgets ;
- les redirects et anciennes sauvegardes fonctionnent ;
- un univers de test prouve l'absence de dépendance structurelle à Velkhar ;
- la documentation d'architecture et les fichiers `current-state` reflètent l'état mergé.

---

## 25. Instructions destinées aux IA et futurs intervenants

Avant toute implémentation issue de ce plan :

1. Lire `MEMORY.md` et `docs/00-START-HERE.md`.
2. Lire les statuts frontend/backend actifs.
3. Lire `ARCHITECTURE_RULES.md`, `FRONTEND_ARCHITECTURE.md` et `AUTH.md`.
4. Vérifier que la v0.1 n'est pas dans une phase critique incompatible.
5. Créer une issue avant la branche.
6. Ne traiter qu'une phase ou un contrat cohérent par PR.
7. Ne pas modifier simultanément les mêmes contrats dans deux chantiers.
8. Préserver les données et routes existantes par migration additive.
9. Ne pas interpréter les maquettes comme une autorisation de réinventer les assets Velkhar.
10. Ne jamais généraliser une mécanique Velkhar sans deuxième besoin démontré.
11. Tester sécurité, accessibilité, mobile et reduced motion avant handoff.
12. Mettre à jour les documents `STATUS/NEXT` du domaine concerné.

### Décision finale à ne pas redébattre sans nouvelle contrainte

> Grimoire utilise un seul monorepo, un site public, une application de jeu multi-univers et une API.
> Chaque univers conserve son identité et son rendu, tandis que les capacités techniques communes
> restent partagées. La Bibliothèque est globale ; les hubs et sessions sont propres aux univers.
