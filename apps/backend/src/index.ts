import cors from 'cors'
import express, { type Express, type ErrorRequestHandler } from 'express'
import 'express-async-errors'
import rateLimit from 'express-rate-limit'

import { env } from './config/env'
import { requireAuth } from './middleware/auth.middleware'
import { aveugleRouter } from './routes/aveugle.routes'
import { characterRouter } from './routes/character.routes'
import { chronicleRouter } from './routes/chronicle.routes'
import { gameRouter } from './routes/game.routes'
import { souvenirRouter } from './routes/souvenir.routes'

const app: Express = express()
const PORT = env.port

// Minimal public security headers (no extra dependency needed).
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  next()
})

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
})

// Rate-limit the authenticated read endpoints against abuse (no AI cost here).
const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
})

// Routes
app.use('/api/game', gameLimiter, requireAuth, gameRouter)
app.use('/api/character', apiLimiter, requireAuth, characterRouter)
app.use('/api/souvenirs', apiLimiter, requireAuth, souvenirRouter)
app.use('/api/chronicles', apiLimiter, requireAuth, chronicleRouter)
// Aveugle's router also applies its own stricter per-route limiter on AI-backed endpoints.
app.use('/api/aveugle', apiLimiter, requireAuth, aveugleRouter)

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
