---
type: status-index
visibility: public
rag: true
source_of_truth: true
---

# Project Status

**Point d'entrée unique pour « où en est le projet ».** Ce fichier porte l'objectif et les décisions
structurantes. Il ne porte **aucun avancement par ticket** : c'est GitHub qui le porte, et GitHub ne
peut pas être périmé.

```bash
gh issue list --milestone "v0.2.1 - Roguelike jouable" --state all
```

## Objectif actuel

Livrer **v0.2.1 — Roguelike jouable** : refonder la couche de jeu par-dessus le socle existant, de
sorte qu'un run soit une **quête narrative dirigée** par un contrat, mise sous pression par des
règles roguelike cachées, des ressources, des combats et un retour joué. Voir
`docs/canon/23-RUN-STRUCTURE.md`.

> **🎲 Refonte roguelike du 2026-08-06.** Le playtest a rendu un verdict net : _« après une partie je
> m'ennuie, il n'y a aucune raison de recommencer »_. Le diagnostic est que le projet a un
> **excellent moteur de narration et aucun moteur de jeu** — pas de combat tactique, pas de boucle
> avec une destination, pas de méta-progression.
>
> **Le déploiement v0.1.0 est décalé** jusqu'à ce que le jeu soit satisfaisant (décision 19). Il ne
> sert à rien de déployer un vertical slice ennuyeux. Les bloqueurs pré-déploiement #161, #129 et
> #163 sont **gelés**, pas annulés.

> **🎭 Continuité narrative du 2026-08-08.** Le grilling produit a révoqué les quatre interfaces
> séparées et la structure de donjon visible. Auberge, voyage, quête, donjon et retour conservent la
> même interface storytelling ; seul le combat transforme temporairement la scène. Paliers, salles,
> indices, profondeur et estimation de retour restent cachés en v0.2.1.

## Ordre des chantiers

Les EPICs servent de **carte de coordination**, jamais de preuve d'avancement : leurs issues enfants
livrables portent le travail réel. L'ordre n'est pas indicatif ; chaque chantier suppose les
contrats du précédent livrés :

`quête et boucle narrative → Auberge vivante → combat → images → artefacts → compagnons / exploits`

| Carte de coordination                   | EPIC GitHub |
| --------------------------------------- | ----------- |
| Quêtes et boucle narrative continue     | #251        |
| Auberge vivante et préparation          | #252        |
| Combat tactique intégré au storytelling | #250        |
| Bibliothèque visuelle des scènes        | #253        |

Le board ne porte plus que des tickets livrables, avec trois axes de label : `domain: *` (posé
automatiquement par `.github/labeler.yml`), `release: *`, et `phase: *` qui pilote l'assignation de
milestone dans `.github/workflows/pr.yml`.

## Sources par domaine

| Besoin                               | Source                      |
| ------------------------------------ | --------------------------- |
| Avancement, priorités, qui fait quoi | GitHub issues et milestones |
| Décisions backend/shared/IA          | [[BACKEND]]                 |
| Décisions frontend                   | [[FRONTEND]]                |
| Préparation de release               | [[RELEASE_READINESS]]       |
| Chronologie des décisions            | [[../log]]                  |
| Quel canon lire pour une tâche       | [[../task-router]]          |
| Règles d'architecture                | [[../tech/RULES]]           |

Attribution par défaut : Claude sur backend/shared/IA, Codex sur frontend. Une assignation explicite
peut inverser ce choix sans changer les règles du domaine.

## Fondations livrées

- frontend : landing, Forge, Auberge UI, Game Session, inventaire/fiche/menu, fin de run, Chronique
  et dashboard ;
- backend : Supabase/Prisma, auth JWT, moteur de session souverain, world-state, mémoire N1/N2,
  Souvenirs N3, Chronique et persistance du personnage ;
- qualité : lint, type-check, tests, build, CodeQL et previews Vercel dans la CI.

Ce socle est **conservé** (décision 18) : la refonte roguelike s'écrit par-dessus, elle ne le remplace
pas. Trois évolutions structurantes sont autorisées :

- `SessionEndReason` : `inn` est scindé en `extracted` / `returned_empty`
  (`docs/canon/09-ACTION-LOOP.md` §7) — breaking change des contrats shared ;
- la session porte un état serveur explicite et une structure de progression cachée ; ils arbitrent
  le jeu sans imposer quatre interfaces au frontend ;
- le contrat devient une quête générique structurée, pas seulement une destination de donjon.

## Règle de tenue des docs

Consolidation du 2026-08-08 : les paires `*_STATUS` / `*_NEXT` ont été fusionnées en [[BACKEND]] et
[[FRONTEND]], et `NEXT_ACTIONS.md` supprimé. Cause du ménage : quatre fichiers décrivaient le même
ticket à la main, et dérivaient malgré tout.

- **GitHub porte l'avancement, les docs portent les décisions.** Un ticket ouvert/fermé/commenté est
  déjà l'état de vérité ; le recopier dans un `.md` garantit deux versions divergentes.
- **Une PR de routine ne met à jour aucun document.** Elle ne touche [[BACKEND]] ou [[FRONTEND]] que
  si elle a pris une décision non évidente — pourquoi telle valeur, telle fermeture de type, tel
  garde-fou.
- **Un seul document de domaine par PR**, jamais quatre.
- Une PR qui change un bloqueur `phase: predeploy` met à jour [[RELEASE_READINESS]].
- **Pas de champ `updated:`** dans les docs d'état : il mentait
  (`FRONTEND_STATUS.md` annonçait 2026-07-26 pour un commit du 2026-08-03).
  `git log -1 --format=%cs -- <fichier>` est la seule date fiable.
- Un pivot ou une décision structurante s'inscrit dans [[../log]], qui est append-only et ne
  périme donc jamais.

### Le statut apparaît dans chaque PR, sans éditer un fichier

Le besoin « voir où en est le projet depuis la PR » et la règle « une PR ne modifie aucun document »
ne s'opposent que si le statut est écrit à la main. Il est donc **généré** : le job `Project Status`
de `.github/workflows/pr.yml` lit le milestone via `gh issue list` et poste un commentaire unique,
réécrit à chaque push (marqueur `<!-- grimoire:project-status -->`, script
`scripts/pr-status-comment.mjs`).

Un hook git a été écarté : local à une seule machine, contournable par `--no-verify`, et il aurait
réintroduit dans les commits exactement le churn que cette consolidation supprime.

Le garde-fou `scripts/check-current-state.mjs` applique la règle **à l'envers** de sa version
d'origine : il ne réclame plus aucun document, il refuse qu'une PR en touche trop — deux documents de
domaine, un fichier supprimé ressuscité, un champ `updated:` réintroduit. Une refonte transverse
assumée coche `Refonte transverse des docs` dans le template et la justifie.
