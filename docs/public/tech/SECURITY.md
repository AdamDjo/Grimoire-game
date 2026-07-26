---
type: tech-security
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-26
---

# Sécurité (#162)

## Audit de dépendances npm

`pnpm audit` est exécuté en CI (`.github/workflows/ci.yml`) sur chaque push/PR vers `main`/`develop`.
Depuis #162, `pnpm audit --audit-level=high` **bloque le pipeline** si une vulnérabilité `high` ou
`critical` est détectée (plus de `continue-on-error`).

### Résolution #162 (2026-07-26)

Point de départ : 92 vulnérabilités (2 critical, 41 high). Résolues via :

- Montée de version directe : Next.js 16.1.6 → 16.2.11, Vitest 2 → 3 (majeur, accepté car projet
  encore en dev, pas de prod déployée).
- `pnpm.overrides` (racine `package.json`) pour forcer les dépendances transitives vulnérables vers
  leur version patchée, avec sélecteur scopé au parent quand un package a plusieurs majeurs actifs
  dans l'arbre (ex. `express@4>path-to-regexp` pour ne pas forcer accidentellement la v8 de
  path-to-regexp partout).

État final : **0 critical, 0 high, 0 low, 1 moderate accepté** (voir ci-dessous).

### Risque accepté : `uuid@8.3.2` (moderate)

- **Alerte** : [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) — dépassement
  de buffer possible dans `uuid` v3/v5/v6 quand un buffer est fourni explicitement.
- **Chemin** : `apps/frontend > cypress@13.17.0 > @cypress/request@3.0.10 > uuid@8.3.2`.
- **Exposition** : nulle en production. `uuid` n'est utilisé qu'en interne par Cypress, un outil de
  test e2e qui ne tourne jamais dans le bundle applicatif livré (dev/CI uniquement). Le code du
  projet n'invoque jamais `uuid` avec un buffer fourni par l'utilisateur.
- **Pourquoi non corrigé** : le correctif nécessite `uuid >=11.1.1`, un saut majeur (v8 → v11) sur
  une dépendance transitive de Cypress non actualisable indépendamment sans risquer de casser
  `@cypress/request`. Effort disproportionné pour un risque moderate sans exposition runtime.
  Aucun override forcé n'a été tenté (contrairement aux autres correctifs #162) précisément pour
  cette raison.
- **Échéance** : réévalué à la prochaine montée de version majeure de Cypress, ou si `uuid` publie
  un backport patché sur la ligne 8.x.

## Row Level Security (RLS) — Supabase/Postgres

### État (2026-07-26)

RLS **activé sur les 9 tables** du schéma `public`, avec une policy `deny_all_anon_authenticated`
(`USING (false) WITH CHECK (false)` pour les rôles `anon` et `authenticated`) sur chacune. Migration :
`apps/backend/prisma/migrations/20260726120000_enable_rls_deny_all/migration.sql`.

Avant cette migration, 5 tables (`MemoryChunk`, `Souvenir`, `Chronicle`, `SceneImage`,
`_prisma_migrations`) n'avaient pas RLS activé du tout et étaient donc entièrement lisibles/
inscriptibles par quiconque possède la clé publique `anon` (exposée côté client). Les 4 autres
(`User`, `Character`, `GameSession`, `SceneLog`) avaient déjà RLS activé sans policy — donc déjà
fail-closed en pratique, la migration y ajoute une policy explicite pour la lisibilité/traçabilité
plutôt que de compter sur l'absence de policy.

### Pourquoi "deny all" et pas des policies par `userId`

Autorisation V1 basée sur filtrage `userId` explicite côté Express (voir [[AUTH]]). Le backend accède
à Postgres via le rôle `postgres` (Prisma, pooler Supavisor) et via la clé `service_role`
(`apps/backend/src/lib/supabase-storage.ts`, Storage uniquement) — les deux **bypassent RLS par
nature** chez Supabase (`BYPASSRLS`). RLS ne protège donc que contre un accès direct au SDK client
Supabase (`anon`/`authenticated`), qui n'existe pas dans l'architecture actuelle : le frontend passe
systématiquement par l'API Express, jamais directement par Supabase pour ces tables. Écrire des
policies fines (`auth.uid() = "userId"`) dupliquerait une logique déjà appliquée côté Express sans
bénéfice réel tant qu'aucun accès client direct n'existe — à réévaluer si ce pattern change (ex.
lecture realtime directe depuis le frontend).

### Item non applicable : leaked password protection

Advisor Supabase `auth_leaked_password_protection` (WARN) : vérification des mots de passe contre
HaveIBeenPwned, désactivée. Non applicable au projet — l'auth actuelle est magic link + OAuth
Google/Discord uniquement, aucun flow email/mot de passe (voir [[AUTH]]). Sans objet tant qu'aucune
auth par mot de passe n'est introduite.

## Pentest applicatif (2026-07-26)

Test d'intrusion en boîte blanche sur le code et la configuration du projet uniquement. Les services
tiers (Supabase, Vercel, Pollinations.ai, OpenRouter) sont **hors périmètre** et n'ont pas été
attaqués, même via un compte détenu par l'équipe.

### Vérifié sans faille

- **IDOR** : toutes les routes dérivent `userId` de `req.auth!.userId` (jamais d'une entrée client)
  et scopent les requêtes Prisma dessus ; les services de session filtrent par
  `character: { userId }`, `spendSouvenirForLore` par `{ id, userId }`.
- **Élévation de privilège de jeu** : le client n'envoie ni stats ni niveau de risque ; `riskLevel`
  est relu depuis la scène persistée et un `choiceId` inconnu est rejeté (`INVALID_CHOICE`).
- **Injection de prompt** : entrées joueur encadrées par des délimiteurs explicites avec consigne de
  ne jamais les traiter comme des instructions ; sortie IA re-validée par Zod avant persistance.
- **XSS** : aucun `dangerouslySetInnerHTML`, `eval` ni `new Function` dans le frontend.
- **Fuite d'erreur** : handler global générique (500 « Internal server error »), aucune stack
  renvoyée au client. Logs applicatifs : identifiants uniquement, jamais de token ni de PII.
- **DoS par payload** : `express.json({ limit: '64kb' })`.
- **Secrets** : aucun `.env` suivi par git, seulement des `.example`.

### Corrections apportées dans ce lot

| #   | Correction                                                                                                                                                                                                                                                                                               | Fichier                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| M1  | Vérification JWT épinglée sur `issuer` (`<projet>/auth/v1`) et `audience` (`authenticated`), et rejet explicite d'un token sans claim `sub` exploitable — une signature valide ne suffit plus                                                                                                            | `apps/backend/src/middleware/auth.middleware.ts` |
| M2  | Quota anonyme rendu atomique : `updateMany` avec la garde `anonymousRequestCount: { lt: LIMIT }` dans le `WHERE`, ce qui supprime la course lecture-puis-écriture par laquelle des requêtes concurrentes pouvaient dépasser le plafond                                                                   | `apps/backend/src/middleware/auth.middleware.ts` |
| F1  | En-têtes de sécurité frontend (CSP, HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) — le fichier n'en définissait aucun                                                                                                                                                     | `apps/frontend/next.config.ts`                   |
| F2  | `app.set('trust proxy', 1)` : derrière le proxy de la plateforme, `req.ip` valait l'adresse du proxy et **tous** les joueurs partageaient un seul seau de rate limit. `1` fait confiance à exactement un saut — jamais `true`, qui laisserait un client forger `X-Forwarded-For` et contourner la limite | `apps/backend/src/index.ts`                      |
| F3  | `helmet` sur l'API avec une CSP « tout interdit » (API JSON, jamais de HTML servi)                                                                                                                                                                                                                       | `apps/backend/src/index.ts`                      |

### Quota partagé → clé de rate limit par utilisateur

Les limiteurs étaient montés **avant** `requireAuth`, donc `req.auth.userId` n'existait pas encore et
la clé retombait sur l'IP. Deux conséquences : des joueurs derrière un même NAT (campus, opérateur
mobile, entreprise) se vidaient mutuellement leur budget, et un attaquant remettait son quota à zéro
en changeant d'IP. Les limiteurs utilisent désormais `userOrIpKey`
(`apps/backend/src/middleware/rate-limit-key.ts`), qui clé sur `user:<id>` quand l'utilisateur est
authentifié et retombe sur `ip:<addr>` sinon — ce qui impose de les monter **après** `requireAuth`.

Mais déplacer les limiteurs après l'authentification laisse `requireAuth` lui-même exposé : il
vérifie un JWT contre un JWKS distant et fait un upsert Prisma, donc un attaquant non authentifié
pourrait le marteler sans jamais rencontrer de limite. Chaque route est donc limitée **deux fois** :

1. `preAuthLimiter` (120 req/min, clé IP) **avant** `requireAuth` — plafond volontairement large,
   il sert à couper le flood non authentifié, pas à mesurer le jeu légitime ;
2. `gameLimiter` / `apiLimiter` (30 et 60 req/min, clé utilisateur) **après** `requireAuth`.

Aucun des deux ne suffit seul : un quota par IP seule est partagé par tout un NAT, un quota par
utilisateur seul laisse la vérification JWT sans protection. C'est aussi ce que signalait CodeQL
(`js/missing-rate-limiting`) sur la première version de ce correctif, qui n'avait que le second
étage.

> Note montée `express-rate-limit` v8 : la v8 ajoute `ipKeyGenerator` (repli IPv6 sur le /64) et
> l'**impose** aux générateurs de clés personnalisés manipulant des IP. La version installée est la
> 7.5.1, où `req.ip` est utilisé tel quel. À envelopper lors de la montée.

## Modèles IA gratuits — disponibilité et coût des appels inutiles

`GAME_MASTER_MODEL_CHAIN` (`apps/backend/src/config/env.ts`) est une chaîne de repli : si un modèle
échoue de façon _réessayable_ (429, 5xx), le tour est relancé **en entier** sur le suivant — prompt
système, mémoire N2, tours N1 et Souvenirs compris. Un modèle en tête de chaîne durablement
indisponible coûte donc un aller-retour complet gaspillé **à chaque tour**.

`google/gemma-4-31b-it:free` était dans ce cas : mesuré en 429 « temporarily rate-limited upstream »
de façon permanente le 2026-07-26, alors qu'il était simultanément tête de chaîne **et** modèle de
repli de compression. Il a été rétrogradé, et la chaîne a été réordonnée selon la disponibilité
_mesurée_ — la présence au catalogue OpenRouter ne vaut pas disponibilité (sur 15 modèles `:free`
listés, `inclusionai/ling-3.0-flash:free` répondait 400). Les éditeurs restent volontairement variés
(Nvidia, Google, OpenAI, routeur méta OpenRouter) car les limites gratuites sont par fournisseur.

**Refaire la mesure avant tout réordonnancement : le catalogue gratuit tourne.**

### Cooldown mémoire (`apps/backend/src/ai/model-cooldown.ts`)

Réordonner la chaîne une fois ne suffit pas : le modèle suivant peut être throttlé à son tour. Un
modèle qui répond 429/5xx est donc marqué en cooldown pendant `MODEL_COOLDOWN_MS` (5 min) et passe en
fin de chaîne ; un succès efface son cooldown. Le gaspillage est ainsi payé une fois par fenêtre de
cooldown au lieu d'une fois par tour.

Deux choix explicites :

- `prioritizeAvailableModels` **réordonne, ne retire jamais**. Si toute la chaîne est en cooldown,
  elle est renvoyée dans son ordre d'origine : un cooldown périmé ne doit pas provoquer un déni de
  service en tombant directement sur le stub.
- L'état vit dans une `Map` locale au processus, sans Redis. C'est une simple _indication_ jetable :
  la perdre au redémarrage ne coûte qu'un aller-retour, la partager entre instances ne vaut pas la
  dépendance.
