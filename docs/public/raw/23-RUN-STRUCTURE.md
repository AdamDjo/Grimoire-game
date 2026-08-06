# 23 — Structure du Run

> _Descendre est facile. C'est remonter qui tue._

---

## 0. Principe

Ce fichier définit **la forme d'un run** : ce que le joueur part faire, jusqu'où il descend, et
comment il rentre. Il est né du grilling de conception du **2026-08-06**, qui a identifié la cause
du symptôme _« je teste une fois, puis je n'ai plus envie de jouer »_ :

> **Le jeu avait un excellent moteur de narration et zéro moteur de jeu.**
> La survie, les dés, les conditions et l'inventaire existaient — mais **rien ne les mettait sous
> pression**, parce que le run n'avait ni objectif, ni structure, ni fin désirable.

Un run n'est pas une promenade conversationnelle. C'est un **aller-retour sous contrainte** :

```
AUBERGE (préparation)  →  DESCENTE (paliers)  →  DEMI-TOUR  →  RETOUR  →  AUBERGE
```

Tout ce qui suit sert une seule tension : **prendre encore un palier, ou rentrer avec ce qu'on a ?**

---

## 1. Le contrat

Le joueur ne part pas « à l'aventure ». Il **accepte un contrat** à l'auberge, qui fixe :

| Le contrat définit         | Effet                                                     |
| -------------------------- | --------------------------------------------------------- |
| 🎯 **La destination**      | Quel type de lieu (voir les 4 archétypes, `03-BESTIARY`)  |
| 📏 **La profondeur visée** | Nombre de paliers — détermine risque et récompense        |
| ⏱️ **La durée cible**      | ~45 min (3 paliers) → 2h30 maximum (7 paliers)            |
| 🪙 **La récompense**       | Ce que le commanditaire paye au retour, **si** on revient |

### Barème de durée

| Paliers | Durée cible  | Profil                                     |
| ------- | ------------ | ------------------------------------------ |
| 3       | ~45 min      | Court, tendu, idéal pour une session brève |
| 5       | ~1h30        | Standard                                   |
| 7       | **2h30 max** | Long, réservé aux joueurs préparés         |

> **⏱️ Le plafond de 2h30 est dur.** Aucun contrat ne peut le dépasser (`01-PILLARS §2`).
> Le joueur choisit sa durée : c'est **lui** qui décide de l'engagement qu'il prend ce soir-là.

🟢 _Le contrat résout d'un coup trois problèmes : le run a un objectif, la durée est prévisible, et
le joueur sait pourquoi il part._

---

## 2. Les paliers

Un run descend par **paliers successifs**. Chaque palier est plus dangereux et plus riche que le
précédent — c'est la courbe qui crée la tentation.

```
        AUBERGE
           │
     ┌─────▼─────┐
     │ PALIER 1  │  créatures faibles · loot commun
     ├───────────┤
     │ PALIER 2  │
     ├───────────┤
     │ PALIER 3  │  ← profondeur minimale d'un contrat
     ├───────────┤
     │    ...    │  danger ↗   loot ↗   coût du retour ↗
     ├───────────┤
     │ PALIER 7  │  ← profondeur maximale · boss · artefacts
     └───────────┘
```

### Salles à choix

Chaque palier se traverse par des **salles**. À chaque salle franchie, le joueur choisit sa suite
parmi 2-3 salles, décrites par des **indices partiels** :

```
        ┌──────────────────────────────┐
        │  Devant toi, trois passages. │
        └──────────────────────────────┘
                       │
     ┌─────────────────┼─────────────────┐
     ▼                 ▼                 ▼
 « Ça sent le     « Un courant     « Des marques
   sang froid »     d'air sec »      griffées »
  [risque élevé]   [neutre]        [inconnu]
```

**Règle de l'indice** : l'indice renseigne sur la **nature** du danger, jamais sur son **ampleur**.
Le joueur choisit en connaissance de cause sans que le jeu lui donne la solution.

🟢 _Emprunté à Slay the Spire : le choix de salle est le geste de jeu le plus fréquent. C'est là que
se joue la rejouabilité, bien plus que dans la variété des ennemis._

### Types de salles

| Type               | Contenu                                                      |
| ------------------ | ------------------------------------------------------------ |
| ⚔️ **Combat**      | Rencontre hostile (`10-COMBAT`)                              |
| 🔍 **Exploration** | Énigme, fouille, découverte de lore                          |
| 🎭 **Rencontre**   | PNJ, dilemme moral, marchand isolé, compagnon recrutable     |
| 🔥 **Répit**       | Repos court, soin, réparation de fortune — rare et précieux  |
| 💰 **Trésor**      | Loot, parfois gardé, parfois piégé                           |
| 💀 **Boss**        | Fin de palier profond — verrouille l'accès au palier suivant |

---

## 3. Le demi-tour — le cœur du jeu

À la fin de chaque palier, le jeu pose **la seule question qui compte** :

```
┌────────────────────────────────────────────────────┐
│  Tu as atteint le palier 4.                        │
│                                                     │
│  🎒 Sac : 9/12 · 💧 Eau : 2 rations                │
│  ⏱️ Retour estimé : ~25 min · 3 paliers à remonter │
│                                                     │
│  [ DESCENDRE ENCORE ]      [ FAIRE DEMI-TOUR ]     │
└────────────────────────────────────────────────────┘
```

Le joueur voit **toujours** son estimation de retour avant de décider. C'est l'application directe
du principe 11 (`01-PILLARS §9`) : _la mort doit être imputable à une décision vue venir._

---

## 4. Le retour

> **Le retour n'est pas une cinématique. C'est la deuxième moitié du jeu.**

C'est la décision de design la plus structurante de ce document. Dans la plupart des jeux, une fois
l'objectif atteint, on appuie sur « rentrer ». Ici, **rentrer est un trajet**.

### Ses trois propriétés

| Propriété              | Détail                                                                 |
| ---------------------- | ---------------------------------------------------------------------- |
| 🧭 **Trajet distinct** | Ce n'est pas la descente rejouée à l'envers — le chemin a changé       |
| ⚡ **Plus court**      | Le retour est nettement plus rapide que la descente : on ne rejoue pas |
| 🎒 **Préparable**      | Ce qu'on a gardé dans le sac à l'aller décide de la survie au retour   |

### Pourquoi plus court

Un retour aussi long que la descente serait **du remplissage** : le joueur a déjà vu ces lieux, la
tension retomberait et le run dépasserait 2h30. Le retour est court **et plus dense** : moins de
salles, mais aucune n'est gratuite.

### Ce qui rend le retour dangereux

- Le sac est **lourd** du butin : moins de place pour l'eau et les soins
- Les jauges de survie sont **déjà entamées** (`06-SURVIVAL`)
- L'équipement s'est **usé** en profondeur (`11-INVENTORY-ECONOMY`)
- La Calamine accumulée par les artefacts **ne redescend pas** toute seule

### La règle absolue du retour

> **Le retour peut tuer, mais jamais par surprise.**

Concrètement, le moteur doit garantir :

1. Une **estimation de retour** visible avant chaque décision de descendre
2. Un **avertissement au franchissement de seuil** : quand une ressource passe sous le nécessaire
   pour rentrer, le jeu le dit — clairement, en langage de personnage, pas en pop-up système
3. Aucun **pic de dégâts non annoncé** au retour : la mort au retour vient de l'épuisement du
   joueur, résultat de ses arbitrages, jamais d'une embuscade arbitraire

🔴 _Anti-règle : jamais de « gotcha » au retour. Si le joueur meurt à trois salles de la sortie, il
doit pouvoir nommer la décision qui l'a tué._

---

## 5. Les fins de run

La fin d'un run n'est plus binaire. `SessionEndReason` distingue :

| Fin                  | Déclencheur                                          | Récompense                                             |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| 🏆 **Retour réussi** | Le joueur rentre **avec** le butin du contrat        | Butin + paiement du contrat + connaissance + Chronique |
| 🥀 **Retour à vide** | Le joueur rentre vivant mais sans remplir le contrat | Ce qu'il a ramassé + connaissance + Chronique          |
| 💀 **Mort**          | 0 PV, l'IA tranche l'inconscience (`10-COMBAT §8`)   | Chronique + héritage transmis                          |
| 🌀 **Calciné**       | Calamine à 100                                       | Chronique spéciale, **pas d'héritage**                 |
| 🚪 **Abandon**       | Le joueur quitte volontairement                      | Chronique minimale                                     |

> ⚠️ **Correction de contrat** : l'ancien `endReason: "inn"` confondait « rentré victorieux » et
> « rentré bredouille ». Ces deux fins ne racontent pas la même histoire et ne payent pas pareil.
> Elles doivent être distinguées dans `session.types.ts`.

### Ce que rapporte un run

Trois choses, dans cet ordre d'importance :

1. 🪙 **Le butin** — finance le run suivant (équipement, réparations, contrats plus ambitieux)
2. 🧠 **La connaissance** — bestiaire, faiblesses, sujets débloqués chez L'Aveugle, accès
3. 📖 **La Chronique** — le récit de ce qui vient de se passer (`17-RUN-CHRONICLE`)
4. 🏅 **Les exploits** éventuellement obtenus (badges, voir §7)

**Jamais de puissance permanente** (`01-PILLARS §2`, pilier 5).

---

## 6. Les modes de jeu

Un run traverse quatre **modes**, chacun avec sa propre interface (`09-ACTION-LOOP`, principe 12) :

| Mode               | Ce que l'écran doit faire ressentir                                     |
| ------------------ | ----------------------------------------------------------------------- |
| 🏠 **Auberge**     | Calme, tabulaire. On compare, on arbitre. Aucun danger                  |
| 🧭 **Exploration** | Le texte respire. On lit, on choisit, l'image porte l'ambiance          |
| ⚔️ **Combat**      | Ça se resserre. Tour par tour, état des ennemis, tension                |
| 🏃 **Retour**      | Compte à rebours implicite. Les ressources fondent, la pression se voit |

🟢 _Le passage d'un mode à l'autre est une **transition franche**. C'est l'alternance qui crée le
dynamisme — pas la vitesse d'affichage du texte._

---

## 7. Les exploits (badges)

Objectifs optionnels détectés en fin de run. Exemples :

- Collecter 3 artefacts dans un seul run
- Terminer un run sans boire une seule potion
- Vaincre L'Haragon

> **⚖️ Un exploit débloque de l'accès ou de la connaissance, jamais de la puissance.**
> Un contrat inédit, une destination, un compagnon recrutable, un sujet chez L'Aveugle, une entrée
> de bestiaire — jamais des PV, des dégâts ou un bonus d'attribut.

🟢 _Fonction réelle : les exploits **enseignent le jeu par l'expérimentation**. « Finir un run sans
potion » apprend la gestion de ressources bien mieux qu'un tutoriel._

Les exploits sont détectés **côté backend** à partir de l'historique réel du run, jamais déclarés
par l'IA.

---

## 8. Les compagnons

Le joueur peut emmener **1 à 2 compagnons**, jamais plus.

| Propriété              | Détail                                                                        |
| ---------------------- | ----------------------------------------------------------------------------- |
| 🤝 **Semi-autonomes**  | Ils agissent seuls en combat — aucun micro-management                         |
| ❤️ **Loyauté**         | Ils réagissent aux décisions du joueur (fuir, sacrifier, abandonner du butin) |
| 💀 **Mort permanente** | Un compagnon mort ne revient pas                                              |
| 🎒 **Coûteux**         | Ils consomment vivres et eau, et prennent de la place                         |

_Pourquoi si peu_ : un groupe de quatre transforme le jeu en gestion tactique et dilue la survie —
le joueur cesse d'être vulnérable. Le charisme d'un compagnon ne vient pas du nombre, il vient du
fait qu'on **peut le perdre par sa faute**.

> **Garde-fou** : un compagnon ne doit jamais rendre le run plus facile **en net**. Il apporte une
> capacité que le joueur n'a pas, mais il consomme des ressources et il peut mourir.

Le rôle **Commandement** de CENDRE (`10-COMBAT §5`) trouve ici son emploi réel.

---

## 9. Risques & garde-fous

| Risque                                          | Mitigation                                                                                |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Le joueur descend toujours au maximum**       | La courbe de danger doit rendre le palier suivant réellement menaçant ; le sac se remplit |
| **Le joueur rentre toujours au premier palier** | Le paiement du contrat n'est dû qu'à l'objectif atteint — rentrer trop tôt coûte          |
| **Le retour devient du remplissage**            | Retour nettement plus court que la descente, chemin distinct, aucune salle gratuite       |
| **Mort au retour ressentie comme injuste**      | Estimation visible + avertissements de seuil + aucun pic non annoncé (§4)                 |
| **Run qui dépasse 2h30**                        | Plafond dur au niveau du contrat ; le moteur ne peut pas générer plus de 7 paliers        |
| **Paliers répétitifs**                          | Salles à choix + variantes contrôlées du bestiaire (`03-BESTIARY`)                        |
| **Méta-progression qui rend le jeu facile**     | Règle absolue : connaissance et accès uniquement (`01-PILLARS §2`)                        |
| **Compagnon qui trivialise la survie**          | Coût en ressources + mort permanente + pas de micro-gestion (§8)                          |

---

## 10. Synthèse

```
                    🏠 AUBERGE
                        │
          ┌─────────────▼─────────────┐
          │  Contrat  : destination,  │
          │             profondeur,   │
          │             durée         │
          │  Sac      : trop petit    │
          │  Forge    : réparer ?     │
          │  Compagnon: qui emmener ? │
          └─────────────┬─────────────┘
                        ▼
              ⛏️  DESCENTE (paliers)
                        │
        ┌───────────────▼───────────────┐
        │  Salle à choix (indice partiel)│
        │  Combat · Explo · Rencontre    │
        │  Répit · Trésor · Boss         │
        └───────────────┬───────────────┘
                        ▼
            ┌───────────────────────┐
            │  DESCENDRE ENCORE ?   │ ◄── le cœur du jeu
            │  (estimation visible) │
            └───────┬───────────┬───┘
               oui  │           │  non
                    ▲           ▼
              (remonte)   🏃 RETOUR
                          (distinct, court,
                           préparable)
                                │
                    ┌───────────▼───────────┐
                    │  🏆 Réussi            │
                    │  🥀 À vide            │
                    │  💀 Mort              │
                    │  🌀 Calciné           │
                    └───────────┬───────────┘
                                ▼
                    Butin · Connaissance
                    Chronique · Exploits
                                │
                                ▼
                          🏠 AUBERGE
```

---

_Le **combat** qui remplit les salles est détaillé dans `10-COMBAT.md`._
_Les **créatures** et les archétypes de lieu sont détaillés dans `03-BESTIARY.md`._
_Le **sac**, l'**usure** et les **artefacts** sont détaillés dans `11-INVENTORY-ECONOMY.md`._
_Les **jauges de survie** qui rendent le retour dangereux sont détaillées dans `06-SURVIVAL.md`._
_La **méta-progression** est cadrée par `01-PILLARS.md §2` (pilier 5) et `14-META-WORLD.md`._
_La **Chronique** de fin de run est détaillée dans `17-RUN-CHRONICLE.md`._
