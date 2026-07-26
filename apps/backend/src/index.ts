import cors from 'cors'
import express, { type Express, type ErrorRequestHandler } from 'express'
import 'express-async-errors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

import { env } from './config/env'
import { requireAuth } from './middleware/auth.middleware'
import { userOrIpKey } from './middleware/rate-limit-key'
import { aveugleRouter } from './routes/aveugle.routes'
import { characterRouter } from './routes/character.routes'
import { chronicleRouter } from './routes/chronicle.routes'
import { gameRouter } from './routes/game.routes'
import { souvenirRouter } from './routes/souvenir.routes'

const app: Express = express()
const PORT = env.port

// The API runs behind a platform proxy (Vercel/Render) in every deployed
// environment. Without this, `req.ip` resolves to the proxy's address and every
// player collapses into a single rate-limit bucket. `1` trusts exactly one hop
// (the platform's own proxy) — never `true`, which would let a client forge
// `X-Forwarded-For` and rotate its way around the limiter.
app.set('trust proxy', 1)

// Security headers. Helmet covers the three previously hand-rolled headers plus
// HSTS, cross-origin isolation and friends. CSP is configured explicitly: this
// is a JSON API that never serves HTML, so everything is denied by default.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'none'"],
        formAction: ["'none'"],
      },
    },
    referrerPolicy: { policy: 'no-referrer' },
    crossOriginResourcePolicy: { policy: 'same-site' },
  })
)

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
)
app.use(express.json({ limit: '64kb' }))

// Rate-limit the AI-backed game endpoints to protect the OpenRouter budget.
const gameLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKey,
})

// Rate-limit the authenticated read endpoints against abuse (no AI cost here).
const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKey,
})

// Routes. `requireAuth` runs *before* the limiter so `req.auth.userId` exists as
// a rate-limit key; unauthenticated traffic is rejected by the 401 it never gets
// past, which is cheaper than the limiter anyway.
app.use('/api/game', requireAuth, gameLimiter, gameRouter)
app.use('/api/character', requireAuth, apiLimiter, characterRouter)
app.use('/api/souvenirs', requireAuth, apiLimiter, souvenirRouter)
app.use('/api/chronicles', requireAuth, apiLimiter, chronicleRouter)
// Aveugle's router also applies its own stricter per-route limiter on AI-backed endpoints.
app.use('/api/aveugle', requireAuth, apiLimiter, aveugleRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Global error handler — catches sync throws and async rejections
// (express-async-errors routes async handler rejections here via next(err)).
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ success: false, error: 'Internal server error' })
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.info(`Backend running on http://localhost:${PORT}`)
})

export { app }
