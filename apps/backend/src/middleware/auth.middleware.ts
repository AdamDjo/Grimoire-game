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

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    const body: ApiResponse<never> = { success: false, error: 'Missing bearer token' }
    res.status(401).json(body)
    return
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const { payload } = await jwtVerify(token, jwks)
    const userId = payload.sub!
    const isAnonymous = payload.is_anonymous === true
    const email = typeof payload.email === 'string' ? payload.email : `${userId}@anonymous.grimoire`

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email },
    })

    req.auth = { userId, isAnonymous }
    next()
  } catch {
    const body: ApiResponse<never> = { success: false, error: 'Invalid or expired token' }
    res.status(401).json(body)
  }
}
