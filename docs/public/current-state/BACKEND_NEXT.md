---
type: backend-actions
visibility: public
rag: true
source_of_truth: true
owner: backend
default_agent: claude
updated: 2026-08-07
---

# Backend Next

## Phase 0 — refonte roguelike (priorité absolue)

> **🎲 Décision du 2026-08-06.** Le déploiement est décalé (cf. `PROJECT_STATUS`). La priorité
> backend passe à la construction du **moteur de jeu** absent. Canon de référence :
> `docs/public/raw/23-RUN-STRUCTURE.md`.

1. [#214](https://github.com/AdamDjo/Grimoire-game/issues/214) — **boucle de run** : contrat,
   paliers, demi-tour, trajet de retour. Découpé en 4 lots :
   - ~~[#226](https://github.com/AdamDjo/Grimoire-game/issues/226)~~ — contrats shared + scindement
     de `SessionEndReason` : **livré**. Les 5 fins canoniques sont figées
     (`death | extracted | returned_empty | abandon | calcined`), `run.types.ts` publie contrat,
     paliers, salles, indices et estimation de retour. L'ancien `inn` est **remplacé**, pas renommé :
     il était produit par la fin volontaire à l'auberge, sans contrat à honorer → migré en `abandon`.
   - ~~[#227](https://github.com/AdamDjo/Grimoire-game/issues/227)~~ — `game-rules/dungeon.ts` et
     `game-rules/run.ts` : **livré**. Paliers plafonnés structurellement à 7, indices partiels qui
     ne trahissent jamais l'ampleur, retour distinct et strictement plus court, estimation de
     retour et détection de franchissement de seuil. Règles pures, sans Prisma. Reste à câbler :
     la formulation en langage de personnage de l'avertissement (§4.2) revient à #228.
   - ~~[#228](https://github.com/AdamDjo/Grimoire-game/issues/228)~~ — extension Prisma
     `GameSession`, mode de jeu porté par la session, câblage dans `resolveTurn` : **livré**. Le
     run est persistant (reprise à la profondeur atteinte), l'avertissement de seuil est injecté
     dans le prompt en langage de personnage (§4.2), et `extracted`/`returned_empty` sont
     désormais réellement produites au retour en surface.
   - [#229](https://github.com/AdamDjo/Grimoire-game/issues/229) — frontend (domaine Codex),
     débloqué par le merge de #226.
2. [#215](https://github.com/AdamDjo/Grimoire-game/issues/215) — **moteur de combat par tours** :
   initiative, CA, tours, actions catégorisées, conditions, fuite dirigée, table de vérité de la
   mort. La spec est complète dans `docs/public/raw/10-COMBAT.md` et `03-BESTIARY.md` — rien à
   concevoir, tout à implémenter. Le backend arbitre, l'IA narre. Découpé en 4 lots :
   - ~~[#233](https://github.com/AdamDjo/Grimoire-game/issues/233)~~ — contrats de combat et
     bestiaire typé : **livré**. `CreatureId` (18 créatures) et `CreatureVariant` (5 variantes) sont
     des unions fermées : l'invention par l'IA est structurellement irreprésentable.
     `CombatSnapshot` rejoint `RunSnapshot` dans `SceneResponse`. Aucune valeur chiffrée posée.
   - ~~[#234](https://github.com/AdamDjo/Grimoire-game/issues/234)~~ — `game-rules/bestiary.ts` :
     **livré**. Les 18 créatures en données, la répartition par palier (§6bis) et les 5 variantes
     bornées (§6ter). Le trou chiffré du canon est comblé : PV, CA et dégâts sont dérivés des deux
     seules ancres qu'il donne — `PV = 10 + SANG` (personnage de référence ≈ 11 PV) et CA 11 en
     cuir — plus les deux CA imprimées telles quelles (Calciné rampant 12, Veilleur 18) et l'échelle
     d'armes de `08-DICE-RESOLUTION §7`. Une créature se lit donc en tours-avant-de-mourir, seule
     échelle que le joueur ressent, et les tests verrouillent les trois paliers canon plutôt que la
     simple présence des entrées. `minDepth`/`maxDepth` rendent l'anti-règle « jamais de légendaire
     aux paliers 1-2 » structurelle. Deux créatures échappent au statut de sac à PV via
     `CreatureEngagement` : le Vent-Gris est un `hazard` à 0 PV (« on ne le combat pas — on le
     fuit »), le Mangeur de Souvenir un `drain` au plus faible dégât des rares.
   - [#235](https://github.com/AdamDjo/Grimoire-game/issues/235) — `game-rules/combat.ts` et câblage
     session : initiative unique, tours, 4 catégories d'action, rôle CENDRE, fuite dirigée, mort.
   - [#236](https://github.com/AdamDjo/Grimoire-game/issues/236) — frontend, mode combat dédié
     (domaine Codex), débloqué par le merge de #233.
3. [#216](https://github.com/AdamDjo/Grimoire-game/issues/216) — **auberge** : contrat, boutique,
   forge, usure 3 paliers, contrainte de sac.
4. [#217](https://github.com/AdamDjo/Grimoire-game/issues/217) — **artefacts activables** :
   implémenter `awaken_artefact` (déjà typé, jamais implémenté), coût en Calamine, résolution
   serveur.
5. [#220](https://github.com/AdamDjo/Grimoire-game/issues/220) — **compagnons** semi-autonomes.
6. [#221](https://github.com/AdamDjo/Grimoire-game/issues/221) — **exploits** et déblocages d'accès.

Transverse à #214 et #221 : la **méta-progression de connaissance** (`PlayerKnowledge`), qui persiste
bestiaire, routes, contrats et sujets. Jamais de puissance —
voir `docs/public/raw/14-META-WORLD.md` §1bis.

Ordre de dépendance :

`#214 → #215 → #216 → #217 → #220/#221`

## Phase 1 — pré-déploiement (gelée)

> ⏸️ Gelée jusqu'à ce que la Phase 0 rende le jeu satisfaisant (décision 19). Les items 13-14
> ci-dessous ne sont pas annulés, seulement reportés.

1. ~~#180~~ — figer les contrats shared Survie v2 : livré (PR #196).
2. ~~#181~~ — conditions et Désavantage : livré (PR #198).
3. ~~#182~~ — Calamine/fin Calciné : livré (PR #199).
4. ~~#183~~ — inventaire réel (acquisition, usage, équipement) : livré.
5. ~~#201~~ — survie punitive (paliers narratifs, négligence→Calamine, érosion PV, état mourant) : livré.
6. ~~#184~~ — repos court/feu (récupération canonique, `restRequested`) : livré (PR #204).
7. ~~#185~~ — crescendo de danger IA (`buildDangerCrescendoSection`) : livré.
8. ~~#101~~ — fiabiliser les modèles : livré (PR #191).
9. ~~#152~~ — résoudre le concept libre (`POST /api/character/resolve-vocation`) : livré.
10. ~~#207~~ — cache d'images de scène dynamique partagé : livré.
11. ~~#162~~ — vulnérabilités npm et RLS Supabase : livré (PR #209). Inclut le durcissement pentest
    (JWT `issuer`/`audience`, quota anonyme atomique, `trust proxy`, `helmet`, rate limit clé par
    utilisateur) et la fiabilisation de la chaîne de modèles gratuits (cooldown mémoire, gemma
    rétrogradé). Suivi à prévoir : montée `express-rate-limit` v7 → v8 pour envelopper le repli IP de
    `userOrIpKey` dans `ipKeyGenerator` (/64 IPv6), et re-mesure périodique de la disponibilité des
    modèles `:free` — le catalogue OpenRouter tourne.
12. ~~#186~~ — projection Survie v2 consommable par l'UI livrée : `SceneResponse` et
    `InventoryActionResponse` renvoient l'instantané de survie, les conditions actives, le fer
    persistant et la fin de run autoritaire sans recalcul de règles côté client.
13. ⏸️ #161 — déployer l'API, appliquer les migrations et vérifier le healthcheck.
14. ⏸️ #129 — supporter le golden path réel avec le frontend. **À re-scoper** : son golden path
    valide un parcours (landing → auberge → session) qui ne décrira plus le jeu après la refonte.

Ordre de dépendance une fois la Phase 0 terminée :

`#161 → #129`

## Post-déploiement

1. #114 — rappel sémantique pgvector.
2. #117 — World events scriptés.
3. #133 — échange Souvenir contre lore.

Chaque PR backend/shared/IA, qu'elle soit menée par Claude ou Codex, met à jour ce fichier et
`BACKEND_STATUS.md` selon l'état attendu après merge. Si elle change un bloqueur pré-déploiement,
elle met aussi à jour `RELEASE_READINESS.md`.
