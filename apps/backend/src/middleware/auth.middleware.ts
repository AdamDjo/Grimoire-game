import { createRemoteJWKSet, jwtVerify } from 'jose'

import { env } from '../config/env.js'
import { prisma } from '../lib/prisma.js'

import type { ApiResponse } from '@grimoire/shared'
import type { NextFunction, Request, Response } from 'express'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: {
        userId: string
        isAnonymous: boolean
      }
    }
  }
}

const jwks = createRemoteJWKSet(new URL(env.supabaseJwksUrl))

// Supabase signs access tokens with `iss = <project>/auth/v1` and `aud = 'authenticated'`.
// Pinning both means a signature check alone is no longer sufficient: a token
// minted for another audience (or another issuer sharing a key) is rejected
// outright rather than trusted on signature validity alone.
const JWT_ISSUER = `${env.supabaseUrl}/auth/v1`
const JWT_AUDIENCE = 'authenticated'

// Cap de requêtes de jeu par utilisateur anonyme. Compteur keyé sur User.id
// (= auth.users.id Supabase). DETTE ASSUMÉE V1 : vider les cookies sb-* crée un
// nouvel id anonyme et réinitialise le quota — cap = friction pour pousser au
// signup, pas un mur. À durcir (IP-cap / rate-limit coût) quand l'IA payante
// remplacera le stub. Voir docs/public/tech/AUTH.md.
const ANONYMOUS_REQUEST_LIMIT = 30

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    const body: ApiResponse<never> = { success: false, error: 'Missing bearer token' }
    res.status(401).json(body)
    return
  }

  const token = authHeader.slice('Bearer '.length)

  // Verify the token first so JWT failures map to 401 — kept separate from the
  // DB work below so a database error can't masquerade as an auth failure.
  let userId: string
  let isAnonymous: boolean
  let email: string
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })
    // A signed token without `sub` is not usable as an identity — reject it
    // instead of letting `undefined` reach the User row as a primary key.
    if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
      throw new Error('missing subject claim')
    }
    userId = payload.sub
    isAnonymous = payload.is_anonymous === true
    // Anonymous Supabase users carry an empty-string email; fall back to a
    // per-user synthetic address so the User.email unique constraint holds.
    email =
      typeof payload.email === 'string' && payload.email.length > 0
        ? payload.email
        : `${userId}@anonymous.grimoire`
  } catch {
    const body: ApiResponse<never> = { success: false, error: 'Invalid or expired token' }
    res.status(401).json(body)
    return
  }

  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email },
    })

    if (isAnonymous) {
      // Single atomic check-and-increment: the `lt` guard lives in the WHERE so
      // concurrent requests can't all read the same pre-increment count and
      // collectively overshoot the cap. `count === 0` means no row matched, i.e.
      // the limit was already reached.
      const { count } = await prisma.user.updateMany({
        where: { id: userId, anonymousRequestCount: { lt: ANONYMOUS_REQUEST_LIMIT } },
        data: { anonymousRequestCount: { increment: 1 } },
      })

      if (count === 0) {
        const body: ApiResponse<never> = { success: false, error: 'Anonymous limit reached' }
        res.status(403).json(body)
        return
      }
    }

    req.auth = { userId, isAnonymous }
    next()
  } catch {
    const body: ApiResponse<never> = { success: false, error: 'Internal server error' }
    res.status(500).json(body)
  }
}
