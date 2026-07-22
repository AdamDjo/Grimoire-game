# 09 — La Boucle d'Action

> _Tu décris. Le monde répond. Tu réponds au monde. Toujours._

---

## 0. Principe

GRIMOIRE n'est pas un jeu à tour de table. C'est une **conversation tendue** entre le joueur et le monde, arbitrée par l'IA, ponctuée par les dés (voir `08-DICE-RESOLUTION.md`).

Un **tour de jeu** = une réponse IA + une action joueur. Le joueur **n'attend jamais** : il y a toujours quelque chose à faire, ou quelqu'un à qui répondre.

> _Le but : que le joueur oublie qu'il joue à un jeu. Qu'il vive une histoire dont il est l'acteur._

### Les 3 promesses de la boucle

- 🟢 **Toujours du choix** : aucune scène sans option (même au repos)
- 🟢 **Toujours du sens** : chaque action a une conséquence narrative, jamais ignorée
- 🟢 **Toujours fluide** : le joueur peut cliquer sans réfléchir OU prendre 5 minutes à écrire, les deux marchent

---

## 1. La boucle de base

```
┌─────────────────────────────────────────────────────┐
│  1. L'IA narre la scène (texte + ambiance)          │
│                                                      │
│  2. L'IA propose 3-4 choix d'action                 │
│     + une icône  ✍️  "Autre action"                  │
│                                                      │
│  3. Le joueur :                                      │
│     ─ clique sur un choix                            │
│       OU                                             │
│     ─ clique sur  ✍️  et tape librement              │
│                                                      │
│  4. L'IA interprète l'intention                      │
│     → identifie attribut + compétence + DC           │
│     → décide si dé ou narration pure                 │
│                                                      │
│  5. Si dé : roulement transparent (voir §4)          │
│                                                      │
│  6. L'IA narre la conséquence                        │
│     → fertile, jamais dead-end (cf. 01-PILLARS)      │
│                                                      │
│  7. Retour à 1.                                      │
└─────────────────────────────────────────────────────┘
```

🟢 _Le rythme est tenu par l'IA. Si le joueur tarde, l'IA peut **relancer** ("Le garde s'impatiente...") mais ne force jamais une action._

---

## 2. Les 3 modes du joueur

Le joueur n'est jamais enfermé dans un seul mode. Il choisit naturellement à chaque tour.

### Mode A — Choix proposés (par défaut)

- Le joueur clique sur un des 3-4 choix proposés
- **Rapide** : 1 clic = 1 tour
- **Onboarding doux** : pas besoin d'imagination ni de connaître les règles
- C'est le mode **privilégié** pour 80% des tours

### Mode B — Saisie libre (icône ✍️)

- Le joueur clique sur ✍️ "Autre action" → champ texte s'ouvre
- Le joueur écrit ce qu'il veut faire (style Discord, 1 phrase à 1 paragraphe)
- L'IA interprète l'intention et résout
- **Sandbox total** : tu peux essayer **n'importe quoi**

### Mode C — Hybride (clic + précision)

- Le joueur clique sur un choix, puis l'IA propose une **icône ✍️ "préciser"**
- Le joueur ajoute du texte ("je tente l'option 2, mais en feignant la fatigue")
- L'IA combine : l'intention de base du choix + la nuance écrite
- Permet de jouer **rapide** sans perdre la liberté

🟢 _Règle : le joueur ne doit jamais avoir l'impression que "écrire" est une fonctionnalité cachée. L'icône ✍️ est toujours visible, toujours à côté des choix._

---

## 3. Comment l'IA propose les choix

Les choix proposés sont **générés à chaque tour** par l'IA selon la scène. Pas de menu fixe.

### Règles de génération

| Règle                                                | Pourquoi                                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **3-4 choix max**                                    | Plus = analysis paralysis, le joueur scrolle au lieu de jouer                         |
| **Toujours 1 option RP / 1 pragmatique / 1 risquée** | Diversité, profils de joueurs différents                                              |
| **Jamais "Fuir" sauf danger réel**                   | Sinon devient un bouton "skip scène"                                                  |
| **Jamais d'option méta**                             | Pas de "Quitter le jeu" ou "Ouvrir inventaire" dans les choix narratifs               |
| **Adaptés à la vocation**                            | Un Tisse-Verbe voit "Tu sens un artefact dans cette ruine" qu'un Marcheur ne voit pas |
| **Adaptés aux conditions**                           | Si le perso a la fièvre, "Se reposer ici" peut apparaître en priorité                 |
| **Adaptés à la phase narrative**                     | En climax (acte 3 invisible, cf. §6), pas de choix "explorer un bâtiment au hasard"   |

### Exemple

> _Tu entres dans la taverne du Doigt-Cassé. L'air pue la sueur et le sel. Au fond, un Inquisiteur t'observe en silence._

**Choix proposés** :

1. 🗡️ Approcher l'Inquisiteur, sans baisser les yeux _(option risquée)_
2. 🪙 Aller au bar, commander un verre, attendre _(option pragmatique)_
3. 👁️ Observer la salle, chercher une sortie discrète _(option RP/SOUFFLE)_
4. ✍️ _Autre action_

---

## 4. Le déclenchement des dés

Le dé n'est pas roulé pour chaque action. Voir `08-DICE-RESOLUTION.md` pour le système complet.

### Qui décide ?

**L'IA décide** si l'action est un **pivot** (issue incertaine ET importante). Si oui, dé. Sinon, narration pure.

### Comment c'est annoncé au joueur

Avant le dé, l'IA affiche un **encart transparent** (style BG3) :

```
┌────────────────────────────────────────┐
│  Tu tentes de persuader l'Inquisiteur. │
│                                         │
│  [ Persuasion ]  CENDRE +2  vs  DC 16  │
│                                         │
│         🎲 d20 = ?                      │
│                                         │
│  [ ROULER LE DÉ ]                       │
└────────────────────────────────────────┘
```

Le joueur **clique pour rouler** (suspense + ressenti BG3). Le résultat s'affiche, puis l'IA narre la conséquence.

🟢 _Transparence totale. Le joueur comprend pourquoi il réussit ou échoue. C'est ce qui crée l'engagement._

---

## 5. Cas spécifique — Éveil d'artefact (Tisse-Verbe)

L'éveil suit un flux **particulier** parce que c'est le geste central du Tisse-Verbe (et qu'on veut éviter la frustration "j'ai payé la Cendre et il s'est rien passé").

### Le flux

```
1. Le joueur (Tisse-Verbe) déclare "Je tente d'éveiller l'artefact"
   ↓
2. L'IA confirme :
   ┌──────────────────────────────────────────┐
   │  Tu poses la main sur la Clé d'Ombre.    │
   │  Effet de base : tu désactives un piège. │
   │  Coût : 10 Cendre.                       │
   │                                           │
   │  Veux-tu tenter une AMPLIFICATION ?       │
   │  → d20 + SOUFFLE vs DC 14                 │
   │  → Réussite : tu désactives + tu           │
   │    apprends une faiblesse de l'artefact.  │
   │  → Échec : juste l'effet de base.         │
   │                                           │
   │  [ EFFET DE BASE ]  [ TENTER AMPLI ]      │
   └──────────────────────────────────────────┘
   ↓
3a. Si EFFET DE BASE → l'effet a lieu, Cendre payée, on continue
3b. Si AMPLIFICATION → roule d20
    ├── Réussite : effet majeur + bonus
    └── Échec    : juste effet de base
    (Cendre payée UNE SEULE FOIS)
```

🟢 _Règle d'or : l'éveil ne rate **jamais** totalement. Le joueur paye, le joueur reçoit au minimum l'effet de base._

🟢 _Le risque (et la récompense) est dans l'amplification — pas dans le déclenchement._

---

## 6. La bascule narrative invisible (les 3 actes)

L'IA structure chaque run en **3 actes** — mais le joueur ne les voit **jamais**. Pas de "Chapitre 1/3", pas de barre de progression.

| Acte (interne)       | Ressenti joueur                         | Tempo IA                              |
| -------------------- | --------------------------------------- | ------------------------------------- |
| **🌅 Installation**  | Tu découvres, tu rencontres, tu choisis | Calme, descriptif, options multiples  |
| **⚔️ Complications** | Le monde te résiste, les enjeux montent | Tendu, pivots fréquents, choix lourds |
| **🌙 Climax**        | Tout converge, il faut décider          | Urgence, peu de choix mais énormes    |

### Comment l'IA bascule

L'IA bascule d'acte selon :

- **Le rythme** (~30% du run en Installation, ~50% en Complications, ~20% en Climax)
- **Les actions du joueur** (s'il fonce vers un boss, le climax arrive plus tôt)
- **Les conditions de survie** (si la Cendre monte vers 80, l'IA pousse vers le climax)
- **Les quêtes en cours** (une quête majeure résolue peut déclencher le climax)

🟢 _Le joueur ressent le crescendo sans le voir. C'est exactement le but d'un bon récit : tu sais qu'il se passe quelque chose, pas comment ça marche._

🔴 _Anti-règle absolue : ne JAMAIS afficher "Acte 2" ou "Chapitre 3" dans l'UI. Casse l'immersion RP._

---

## 7. La fin du run

Trois façons de finir un run :

### 🏆 Fin choisie — Retour à L'Aveugle

Le joueur peut, à tout moment, **rentrer à l'auberge**. À l'arrivée, L'Aveugle pose **la question** :

> _« Ton aventure se termine-t-elle ici, voyageur ? »_

→ **Choix** :

- **Oui** → fin du run, **Chronique générée** (voir `17-RUN-CHRONICLE.md`)
- **Non** → le joueur peut continuer, repartir, finir une quête

Le joueur **décide** quand son histoire est finie. Pas le système.

### 💀 Fin par la mort

À 0 PV → inconscience → l'IA décide (captivité, secours, mort). Si mort effective → run terminé automatiquement, Chronique générée, héritage transmis (voir `11-INVENTORY-ECONOMY.md` §5).

### 🌀 Fin par la Calamine

Si la Cendre atteint 100 → transformation en Calciné → le perso devient un monstre du bestiaire. Run terminé, Chronique générée avec **fin spéciale** ("Tu es devenu ce que tu chassais"). Pas d'héritage transmis (l'artefact est corrompu).

### Contrat moteur — `endReason`

Chaque fin de run porte un `endReason` distinct, transmis à la Chronique (`17-RUN-CHRONICLE`, `chronicle.service.ts`) pour adapter le récit :

| `endReason` | Déclencheur                                         | Héritage                             |
| ----------- | --------------------------------------------------- | ------------------------------------ |
| `inn`       | Fin choisie à l'auberge (L'Aveugle)                 | transmis                             |
| `death`     | Mort effective à 0 PV (l'IA tranche l'inconscience) | transmis                             |
| `abandon`   | Abandon du perso (inactivité ou clic explicite)     | transmis                             |
| `calcined`  | Calamine atteint 100 → transformation en Calciné    | **non transmis** (artefact corrompu) |

🟢 _`calcined` est la seule fin sans héritage. La Chronique reçoit ce `endReason` et bascule sur la fin spéciale « Tu es devenu ce que tu chassais »._

---

## 8. Risques & garde-fous

| Risque                                      | Mitigation                                                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Analysis paralysis** (trop de choix)      | 3-4 choix max, mode A par défaut, ✍️ optionnel                                                                           |
| **Saisie libre incomprise par l'IA**        | Si confusion, l'IA répond _"Tu peux préciser ?"_ avec 2-3 reformulations proposées                                       |
| **Boucle infinie** (joueur tourne en rond)  | Si 10+ tours sans tension, l'IA **force un pivot** (un PNJ intervient, une menace arrive, une rumeur change le contexte) |
| **Joueur frustré par un échec critique**    | Échec = complication fertile, jamais dead-end (cf. 08-DICE §2)                                                           |
| **Le joueur ne sait pas qu'il peut écrire** | L'icône ✍️ est toujours visible. Un tooltip s'affiche au 1ᵉʳ tour ("Tu peux aussi écrire ton action")                    |
| **Choix générés génériques**                | Prompt IA : "Toujours 1 option propre à la vocation du joueur"                                                           |
| **Rythme de run incohérent**                | L'IA suit le minutage interne des 3 actes (§6)                                                                           |

---

## 9. Synthèse

```
TOUR DE JEU
───────────────────────────────────────
  IA narre la scène
       ↓
  IA propose 3-4 choix + ✍️ "Autre action"
       ↓
  Joueur : clic ou saisie libre
       ↓
  IA interprète intention
       ↓
  Pivot ?  ─── oui ──→  DÉ transparent (BG3)
       │                     ↓
       └──── non ──→ narration pure
                            ↓
              IA narre la conséquence (fertile)
                            ↓
                       (loop ↑)


STRUCTURE DU RUN (invisible)
───────────────────────────────────────
  🌅 Installation (~30%)
       ↓ (bascule IA)
  ⚔️ Complications (~50%)
       ↓ (bascule IA)
  🌙 Climax (~20%)
       ↓
  FIN
  ├── 🏆 Joueur dit "j'arrête" chez L'Aveugle
  ├── 💀 Mort
  └── 🌀 Calamine = 100
       ↓
  📖 CHRONIQUE générée (17-RUN-CHRONICLE)
       ↓
  Héritage transmis (artefact + écho)
       ↓
  Retour à l'auberge (07-CHARACTER-CREATION raccourci)
```

🟢 _Une boucle simple. Une histoire à chaque run. Le joueur acteur, jamais spectateur._

---

## 10. Ce qui fait revenir le joueur (les 3 crochets de rétention)

La structure du run est invisible — la **rétention** se joue ailleurs. Trois crochets, à muscler en priorité :

### 🪝 Crochet 1 — La Chronique

À la fin du run, l'IA génère un **récit illustré** (3-5 paragraphes, style livre) de ce qu'a vécu le joueur. Personne d'autre n'aura la même. Le joueur peut la **partager**. Voir `17-RUN-CHRONICLE.md`.

### 🪝 Crochet 2 — Les Souvenirs nommés

Quand le joueur fait un acte mémorable (Nat 20 légendaire, décision morale dure, PNJ marquant), il gagne un **Souvenir nommé** : _"La nuit où tu as épargné l'Inquisiteur Vane"_. Ces Souvenirs s'affichent dans son hub permanent (chez L'Aveugle), et **L'Aveugle les évoque** au run suivant. Voir `11-INVENTORY-ECONOMY.md` §3 et `14-META-WORLD.md`.

### 🪝 Crochet 3 — Le monde change

Entre les runs, le **méta-monde** évolue selon les actions du joueur. Tué l'Inquisiteur Vane ? Au run 2, le Culte des Cendres est affaibli dans les villes que tu visites. Sauvé un PNJ ? Il réapparaît. Voir `14-META-WORLD.md`.

🟢 _La structure du run est libre, mais la **mémoire** qu'il laisse est forte. C'est pour ça qu'on revient._

---

_Le **prologue** (la première application de cette boucle) est détaillé dans `07-CHARACTER-CREATION.md`._
_Les **dés** qui arbitrent les pivots sont détaillés dans `08-DICE-RESOLUTION.md`._
_La **Chronique** générée en fin de run est détaillée dans `17-RUN-CHRONICLE.md`._
_Les **prompts IA** qui pilotent la boucle sont détaillés dans `15-GAME-MASTER.md`._
