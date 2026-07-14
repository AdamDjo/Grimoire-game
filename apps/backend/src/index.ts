import cors from 'cors'
import express, { type Express } from 'express'
import rateLimit from 'express-rate-limit'

import { env } from './config/env'
import { requireAuth } from './middleware/auth.middleware'
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

// Routes
app.use('/api/game', gameLimiter, requireAuth, gameRouter)
app.use('/api/souvenirs', requireAuth, souvenirRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.info(`Backend running on http://localhost:${PORT}`)
})

export { app }
