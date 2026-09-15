---
type: frontend-domain
visibility: public
rag: true
source_of_truth: true
owner: frontend
default_agent: codex
---

# Frontend — état et file d'attente

> **Où en est le projet ?** → `gh issue list --milestone "v0.2.1 - Roguelike jouable"`. GitHub porte l'avancement.
> Ce fichier porte les **décisions d'implémentation** prises en codant, celles qu'un ticket fermé ne
> conserve pas.

Priorité courante : refonte roguelike (décision du 2026-08-06, cf. [[PROJECT_STATUS]]).
Canon de référence : `docs/canon/23-RUN-STRUCTURE.md`, `09-ACTION-LOOP.md` §2bis.

**Décision du grilling du 2026-08-08** : le problème n'est pas l'interface narrative commune, mais
l'absence de règles qui mettent l'histoire sous pression. Auberge, voyage, quête, donjon et retour
gardent donc une seule coque narrative. Le combat est la seule transformation d'interface.

Un composant mécanique dépend toujours du contrat backend correspondant : **ne pas l'implémenter
avant que `packages/shared` porte ses types.**

## Décisions d'implémentation

Une entrée n'est ajoutée ici que si elle explique un **choix non évident**. Le simple fait qu'un
ticket soit livré se lit sur GitHub.

- **Le mode courant vient du serveur, jamais déduit du texte de scène.** Corollaire frontend de la
  souveraineté backend : le client dessine, il n'arbitre pas. En v0.2.1, ce mode déclenche surtout
  la transformation combat ; il ne sélectionne pas quatre applications visuellement séparées.
- **Une seule coque narrative hors combat.** L'Auberge et le run partagent exactement la même
  composition : header persistant, illustration à gauche, narration et choix à droite, HUD en
  footer. L'image, la voix et les composants contextuels changent, mais la continuité Auberge →
  voyage → quête/donjon → retour ne casse jamais.
- **L'Auberge est un hub de scènes, pas un tableau.** Comptoir, L'Aveugle, Contrats et Forge restent
  accessibles comme destinations persistantes dans la fiction et s'affichent dans la coque commune,
  en vue subjective lorsque le joueur parle à un PNJ.
- **Le donjon ne révèle pas son moteur en v0.2.1.** Aucun type de salle, indice, icône, carte,
  palier, profondeur ou estimation de retour n'est rendu. Le HUD conserve uniquement l'objectif
  principal repliable, les jauges et « Faire demi-tour » hors combat.
- **Le combat transforme la scène au lieu d'ouvrir un mini-jeu étranger.** Le décor reste visible,
  la dernière narration consultable et l'action libre disponible ; la fin rend la place au récit.
- **`updatedStats` reste `Record<string, number>`** — `isDying` n'est pas transporté sur le réseau
  dans ce canal ; il est mis à jour côté backend et lu dans l'instantané de survie. #201
- **Le HUD n'affiche que les jauges variables** (PV, Soif, Faim, Fatigue, Calamine) ; le Triptyque
  est rendu en scores fixes. Mélanger les deux brouillait ce que le joueur peut agir. #186
- **Le Désavantage est explicite sur le jet**, avec sa cause — la transparence mécanique est une
  règle produit, pas un détail d'UI. #186
- **Tous les runs commencent à l'Auberge.** La Forge ne lance plus directement le premier run : un
  contrat principal doit être accepté avant le départ. L'Auberge tient en `100dvh` sur desktop,
  tablette et mobile, avec défilement interne du dialogue uniquement.
- **Le brouillon de création est versionné** (`CharacterCreateDraft` v2 : nom personnalisé, trait
  narratif, compétences décalées) — un brouillon d'une version antérieure ne doit pas se déserialiser
  en silence. #152
- **Le concept libre a un repli explicite** vers les 4 voies preset avec message dédié : un échec de
  résolution IA ne doit jamais bloquer la création. États `idle`/`pending`/`resolved`/`fallback`/
  `error`. #152
- **La priorité de langue est explicite** : le switcher en jeu gagne sur la détection navigateur pour
  la narration IA. La préférence de narration est distincte de la langue d'interface. #167 #168 #181
- **CSP : `'unsafe-inline'` sur `style-src` est imposé par Next.js** — aucune échappatoire par nonce
  dans l'App Router aujourd'hui. La CSP autorise l'origine Supabase Storage en `img-src` (images de
  scène #207) et `connect-src` (auth/REST navigateur). Elle **dérive de
  `NEXT_PUBLIC_SUPABASE_URL`** et doit être revérifiée à #161 pour couvrir le domaine de production
  final. Détail `docs/tech/SECURITY.md`. #162
- **L'inventaire est structuré selon les quatre catégories canon**, pas selon une commodité
  d'affichage. #183 #186
- **Les scènes utilisent une bibliothèque pré-générée de 30 à 38 images.** Les scènes fixes de
  l'Auberge peuvent montrer leurs interactions récurrentes ; pendant un run, les images décrivent
  d'abord un lieu réutilisable. Le personnage joueur n'est jamais représenté ; monstres et actions
  imposées sont absents des plateaux génériques. Aucune génération
  runtime en v0.2.1 et aucun sens mécanique ne dépend de l'image seule.
- **La direction artistique frontend est Encre de Sel.** Contours d'encre visibles, grandes masses,
  trois à quatre valeurs franches et palette stricte Noir / Sel / Or pour les illustrations. Le HUD
  conserve les couleurs sémantiques de Sang, Souffle, Faim, Soif et Calamine. Sur desktop,
  l'illustration reste à gauche et le lecteur narratif défile à droite ; les choix empilés grandissent
  avec leur texte sans devenir des panneaux surdimensionnés : 64 à 72 px pour un choix court, puis
  hauteur automatique. La narration garde une taille de lecture prioritaire de 24 à 26 px sur
  desktop. Sur mobile, image, narration et choix suivent le flux naturel de la page. Sac, Chronique
  et Personnage sont des boutons icônes de 44 px minimum. Aucun comportement essentiel ne dépend du
  hover. Le footer desktop reste un bandeau noir continu et lisible avec petites icônes, valeurs,
  jauges fines et séparateurs ; il n'adopte pas la surcharge gore de l'illustration et des choix.
- **Tailwind pour le responsive, jamais un hook JS.**

## Doctrine de code — comment on écrit le frontend

Règle permanente, pas une décision ponctuelle : tout code frontend est écrit ainsi, sans rappel.

- **Des noms simples et évidents.** On nomme ce que la chose _est_, avec le mot le plus court qui
  reste juste : `GameScene`, `GameHud` — jamais `GameTurnPreview` ni `SurvivalReadout`. Un nom doit
  pouvoir être retrouvé de mémoire six mois plus tard. Si le nom a besoin d'un commentaire pour être
  compris, c'est le nom qu'il faut changer.
- **Un dossier par composant, jamais un fichier fourre-tout.** `NomDuComposant/NomDuComposant.tsx` +
  son CSS colocalisé `nom-du-composant.css` + ses sous-composants privés à côté. Une section de page
  est un dossier, pas un bloc dans un fichier de 600 lignes. L'arborescence doit se lire comme un
  sommaire : on trouve le fichier sans `grep`.
- **Tokens uniquement, aucune valeur en dur.** Jamais un `#080908`, un `0.76s` ni une famille de
  police écrits dans un fichier de composant. Les couleurs, espacements et durées viennent de
  `src/styles/`. Si le token manque, on crée le token — on ne code pas la valeur.
- **Du code propre, humain, lisible d'abord.** Un composant se lit de haut en bas comme une phrase.
  Les commentaires expliquent le _pourquoi_, jamais le _quoi_. Pas d'abstraction ajoutée « au cas
  où » : on factorise à la troisième occurrence, pas à la première.
- **Mais avec les garde-fous d'un vrai ingénieur.** Typage strict sans `any` ni cast de confort,
  dépendances orientées dans un seul sens (`components/ui/` ne connaît ni les routes ni les
  features — la règle `no-restricted-imports` d'`eslint.config.js` en est le gardien), composants
  partagés qui reçoivent des **chaînes déjà résolues** plutôt que des clés de traduction, et une
  porte de validation complète — Prettier, `tsc`, ESLint, Vitest — avant de dire qu'un travail est
  fini.

**L'épisode qui a fixé la règle (ticket #310).** La démo de la landing devait devenir réutilisable
par la vraie session de jeu. Trois choses en sont sorties, toutes générales :

1. `useTranslations()` n'accepte qu'un namespace littéral. Un composant partagé qui résout ses
   propres clés est donc soudé à un seul catalogue — d'où la règle des chaînes déjà résolues.
2. Un défaut anodin (`background={<LandingArt />}`) faisait dépendre un composant partagé d'une
   route. Une prop requise vaut mieux qu'un défaut qui crée un couplage.
3. Le kit visait `components/ui/velkhar/`, mais il compose `GameSessionHud` : ESLint l'a refusé à
   juste titre. Il vit donc dans `features/game-session/velkhar/`. **Quand une règle d'architecture
   bloque un emplacement, c'est l'emplacement qui est faux, pas la règle** — on ne désactive pas le
   garde-fou.

**Une marque peut avoir sa palette, pas ses littéraux (ticket #310).** La landing utilisait trois
couleurs déclarées dans son propre CSS (`--salt-page`, `--salt-paper`, `--salt-gold`), plus une
vingtaine de littéraux `#080908e8` en dur. Deux réflexes étaient faux :

- **Les aligner sur `--ink-black` / `--salt-white`** aurait restylé 36 points d'appel : la landing
  est volontairement plus contrastée que l'in-game. Ces couleurs sont donc devenues de vraies
  matières dans `tokens.css` (`--landing-black`, `--landing-paper`, `--landing-paper-dim`), avec
  les rôles `--salt-*` en alias. Le préfixe historique survit, la déclaration remonte au centre.
- **Garder le motif `var(--token, #hex)`** — le « token legacy ». Le fallback ne servait jamais
  (le token existait), mais il faisait croire à deux sources de vérité et masquait une divergence :
  `var(--material-gold, #d9ac55)` rendait `#bd7b26` depuis longtemps. Tout fallback de couleur a
  été supprimé.

Les opacités ne s'écrivent plus en suffixe hexadécimal mais en tokens nommés
(`--salt-veil`, `--salt-veil-deep`, `--salt-rule`), construits en `color-mix`. Un voile a un nom et
une intention ; `#08090866` n'en a pas. Reste autorisé : `var(--x, <valeur>)` pour un **paramètre
d'animation** posé par JS ou par une section (`--beam-x`, `--salt-veil-strength`) — là, le défaut
est la valeur de repos, pas une couleur de secours.

## Dette et suivis connus

- **#218 — les textes de lisibilité existent déjà** dans `docs/canon/04-ATTRIBUTES.md` et n'ont
  **jamais** été câblés à l'UI (tooltips SANG/SOUFFLE/VOLONTÉ, Calamine, jauges, conditions). C'est de
  la valeur joueur déjà écrite et non livrée.
- **#217 — coût en Calamine et usages restants doivent être visibles _avant_ activation**, pas après.
- L'arbitrage vivres/butin doit rester lisible dans l'inventaire sans transformer l'Auberge en
  tableau de gestion.
- L'ancien encart de demi-tour avec estimation et paliers est révoqué pour v0.2.1. « Faire
  demi-tour » reste disponible en permanence hors combat, sans prédiction du trajet.
- CSP de production à revérifier à #161.
- #129 est **à re-scoper** : les golden paths testés ne décrivent plus le jeu après la refonte.

- **Le backend livre plus vite que le frontend n'expose.** Audit du 2026-09-08 : sur les épics
  vivants, 11 tickets backend ouverts contre 5 frontend. Des mécaniques entièrement livrées côté
  serveur restent invisibles au joueur — le palier de progression n'avait aucun composant (#302),
  l'effet de l'équipement porté n'était restitué nulle part (#303), la succession n'avait pas
  d'écran (#304). Le réflexe à garder : **une mécanique n'est pas livrée tant qu'un écran ne la
  montre pas.** Ouvrir le ticket frontend en même temps que le ticket backend, pas après : l'écart
  ne se voit dans aucun test — tout reste vert pendant qu'une mécanique livrée devient injouable, et
  il se rattrape mal une fois installé.
- **Le sas #298 n'est pas un épic de travail.** Il recueille les 8 tickets restés sous l'épic #123,
  fermé en `NOT_PLANNED` le 2026-08-06 sans que ses enfants soient traités. Chaque ticket en sort
  par une décision explicite — fermé, ou rattaché à un épic vivant. Ne rien y ajouter.

## Règles de tenue de ce fichier

- On y écrit **pourquoi**, pas **quoi** ni **quand**. L'avancement vit sur GitHub, la chronologie
  dans [[log]].
- Pas de champ `updated:` — il mentait ; `git log -1 --format=%cs -- <fichier>` est la seule date fiable.
- Une PR ne touche ce fichier **que** si elle a pris une décision non évidente. Une PR de routine ne
  touche aucun document.
