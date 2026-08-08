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
Canon de référence : `docs/public/raw/23-RUN-STRUCTURE.md`, `09-ACTION-LOOP.md` §2bis.

**Le problème que la refonte doit résoudre** : le frontend rend _toutes_ les activités du jeu dans le
même écran narratif. C'est la cause directe du ressenti « c'est toujours pareil ». Chaque mode doit
avoir sa propre interface et son propre rythme (principe 12, `01-PILLARS` §9).

Un écran de mode dépend du contrat backend correspondant : **ne pas démarrer un mode avant que
`packages/shared` porte ses types.**

## Décisions d'implémentation

Une entrée n'est ajoutée ici que si elle explique un **choix non évident**. Le simple fait qu'un
ticket soit livré se lit sur GitHub.

- **Le mode courant vient du serveur, jamais déduit du texte de scène.** Corollaire frontend de la
  souveraineté backend : le client dessine, il n'arbitre pas. #219
- **`updatedStats` reste `Record<string, number>`** — `isDying` n'est pas transporté sur le réseau
  dans ce canal ; il est mis à jour côté backend et lu dans l'instantané de survie. #201
- **Le HUD n'affiche que les jauges variables** (PV, Soif, Faim, Fatigue, Calamine) ; le Triptyque
  est rendu en scores fixes. Mélanger les deux brouillait ce que le joueur peut agir. #186
- **Le Désavantage est explicite sur le jet**, avec sa cause — la transparence mécanique est une
  règle produit, pas un détail d'UI. #186
- **La Forge ouvre directement le premier run** ; l'Auberge interactive est réservée aux sessions
  commencées ou terminées. Elle tient en `100dvh` sur desktop, tablette et mobile, avec défilement
  interne du dialogue uniquement. #186
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
  final. Détail `docs/public/tech/SECURITY.md`. #162
- **L'inventaire est structuré selon les quatre catégories canon**, pas selon une commodité
  d'affichage. #183 #186
- **Tailwind pour le responsive, jamais un hook JS.**

## Dette et suivis connus

- **#218 — les textes de lisibilité existent déjà** dans `docs/public/raw/04-ATTRIBUTES.md` et n'ont
  **jamais** été câblés à l'UI (tooltips SANG/SOUFFLE/CENDRE, Calamine, jauges, conditions). C'est de
  la valeur joueur déjà écrite et non livrée.
- **#217 — coût en Calamine et usages restants doivent être visibles _avant_ activation**, pas après.
- **#216 — l'écran de sac est là où se joue l'arbitrage vivres/butin** : c'est l'écran, pas un
  panneau secondaire.
- **#214 — l'encart de demi-tour est l'écran de décision central du jeu** (sac, eau, estimation de
  retour, paliers).
- CSP de production à revérifier à #161.
- #129 est **à re-scoper** : les golden paths testés ne décrivent plus le jeu après la refonte.

## Règles de tenue de ce fichier

- On y écrit **pourquoi**, pas **quoi** ni **quand**. L'avancement vit sur GitHub, la chronologie
  dans [[log]].
- Pas de champ `updated:` — il mentait ; `git log -1 --format=%cs -- <fichier>` est la seule date fiable.
- Une PR ne touche ce fichier **que** si elle a pris une décision non évidente. Une PR de routine ne
  touche aucun document.
