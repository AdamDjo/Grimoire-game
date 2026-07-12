---
type: tech-auth
visibility: public
rag: true
source_of_truth: true
updated: 2026-07-12
---

# Authentification (#107)

Auth basée sur **Supabase Auth**. Tier anonyme par défaut, puis migration
transparente vers un compte. JWT vérifié localement côté backend (JWKS), aucun
appel réseau par requête.

## Décisions actées (#107)

1. **Techno** : Supabase Auth.
2. **Trigger signup** : soft-prompt proactif, non bloquant avant le cap anonyme.
3. **Connexion** : magic link email + OAuth Google + OAuth Discord.
4. **Vérif backend** : JWT Supabase vérifié en local via JWKS (`jose`), pas d'appel réseau par requête.
5. **Identité** : `User.id` (Prisma) = `auth.users.id` (Supabase), même UUID. L'id n'est jamais généré par Prisma.
6. **Migration anonyme → compte** : rattachement transparent (`linkIdentity`). Câblage complet différé (voir Dette).
7. **Autorisation V1** : filtrage `userId` explicite côté Express. RLS Postgres différé (dette explicite).

## Flux runtime

```
Frontend (SessionClient, au mount)
  getSession() → pas de session ? → signInAnonymously()  (cookie sb-* @supabase/ssr)
        │
        ▼
Proxy Next.js  app/api/[...path]/route.ts
  lit la session server-side → ajoute Authorization: Bearer <access_token>
        │
        ▼
Backend Express  requireAuth (middleware, monté sur /api/game)
  jwtVerify(token, JWKS) → sub = userId, is_anonymous
  prisma.user.upsert({ id: userId })  +  cap anonyme
```

- **Cookies, pas localStorage** : `@supabase/ssr` stocke la session dans des cookies
  `sb-<ref>-auth-token.0/.1` (chunkés), lisibles server-side par le proxy.
- **JWKS** : `createRemoteJWKSet` instancié une fois au chargement du module ; `jose`
  gère le cache des clés. Signing key Supabase = ECC P-256 (`ES256`).

## Cap anonyme

- Compteur **`User.anonymousRequestCount`** (Prisma), incrémenté dans `requireAuth`
  à chaque requête de jeu d'un utilisateur anonyme.
- Limite : **`ANONYMOUS_REQUEST_LIMIT = 30`** (`auth.middleware.ts`).
- Au-delà : `403 { success: false, error: 'Anonymous limit reached' }`. Le frontend
  bascule sur un blocage forcé (message + lien `/signup`, choix masqués).
- Le compteur UI Zustand (`session-store.ts`) est **cosmétique** (soft-prompt) ; la
  vérité du cap est en base, côté backend.

## Séparation des erreurs dans `requireAuth`

Deux `try/catch` distincts, volontairement séparés :

- **Vérif JWT** échoue → `401 Invalid or expired token`.
- **Travail DB** (upsert/update) échoue → `500 Internal server error`.

⚠️ Ne jamais fusionner ces catch : un `catch` fourre-tout déguiserait une panne DB
en erreur d'auth (c'est exactement le bug ci-dessous).

## Piège résolu — email anonyme vide

Un JWT Supabase **anonyme** porte `email: ""` (chaîne vide), **pas** un champ absent.
Le fallback naïf `typeof email === 'string' ? email : synthétique` stockait donc `""`.
Dès le **2ᵉ** utilisateur anonyme → collision sur la contrainte unique `User.email`
(Prisma **P2002**), masquée en `401 Invalid or expired token`.

**Fix** : fallback `${userId}@anonymous.grimoire` si l'email est absent **ou vide**.
Règle générale : pour tout champ d'un JWT anonyme, tester la **chaîne non vide**,
jamais seulement `typeof === 'string'`.

## Dette / à durcir

- **Cap contournable** : vider les cookies `sb-*` (ou navigation privée / autre
  navigateur) crée un nouvel `auth.users.id` anonyme → quota réinitialisé.
  **Choix V1 : dette assumée.** Le cap est de la friction pour pousser au signup,
  pas de la sécurité ; contourner reste plus pénible que créer un compte gratuit.
  Coût réel aujourd'hui ≈ nul (backend en `STUB FALLBACK`, IA non branchée).
  **À durcir** avec un rate-limit / cap par IP (backend) **quand l'IA payante
  remplacera le stub** — c'est là que l'abus aura un coût. Fingerprint device écarté
  (RGPD/consentement + dépendance tierce). Décision prise le 2026-07-12.
- **`linkIdentity`** anonyme → compte : hook posé, déclenchement automatique complet
  à finaliser une fois le flux magic link/OAuth pleinement vérifié.
- **RLS Postgres** : différé (décision #7). Autorisation V1 = filtrage `userId` Express.
- **OAuth** : Google vérifié live. Discord à re-tester de bout en bout.

## Prérequis dashboard Supabase

- **Allow anonymous sign-ins** activé (tier anonyme).
- **Allow manual linking** activé (`linkIdentity`).
- Providers OAuth Google + Discord configurés (redirect URIs).

## Sources liées

- Règles d'architecture : [[ARCHITECTURE_RULES]]
- Statut projet : [[../current-state/PROJECT_STATUS]]
