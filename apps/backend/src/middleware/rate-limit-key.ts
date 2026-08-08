import type { Request } from 'express'

/**
 * Rate-limit key: the authenticated user when available, the client IP
 * otherwise.
 *
 * Keying on `userId` is what makes the quota meaningful — players sharing a NAT
 * (campus, mobile carrier, office) no longer drain each other's budget, and an
 * attacker can't reset their own quota by rotating IPs. The IP fallback only
 * covers requests that reach a limiter before `requireAuth` has run, which
 * mirrors express-rate-limit v7's own default key.
 *
 * Note for a future v8 upgrade: v8 adds `ipKeyGenerator` to fold IPv6 addresses
 * into their /64 subnet and *requires* custom key generators handling IPs to use
 * it. Wrap the fallback branch with it at that point.
 */
export function userOrIpKey(req: Request): string {
  const userId = req.auth?.userId
  return userId !== undefined ? `user:${userId}` : `ip:${req.ip ?? 'unknown'}`
}
