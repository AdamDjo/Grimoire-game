import dotenv from 'dotenv'

dotenv.config()

/**
 * Centralized, typed access to environment variables.
 * Secrets (API keys) are read here and never logged.
 */
const supabaseUrl = process.env.SUPABASE_URL ?? ''

export const env = {
  port: process.env.PORT ?? '3001',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  supabaseUrl,
  supabaseJwksUrl: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY ?? '',
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY ?? '',
    /** Free multilingual model by default; override with OPENROUTER_MODEL. */
    model: process.env.OPENROUTER_MODEL ?? 'nvidia/nemotron-3-super-120b-a12b:free',
    /** Lightweight model used for N2 scene compression; override with OPENROUTER_COMPRESSION_MODEL. */
    compressionModel:
      process.env.OPENROUTER_COMPRESSION_MODEL ?? 'mistralai/mistral-small-24b-instruct:free',
    baseUrl: 'https://openrouter.ai/api/v1',
  },
} as const

/** Hardcoded fallback model for N2 compression if the primary model call fails. */
export const COMPRESSION_FALLBACK_MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free'

/**
 * Ordered fallback chain the Game Master tries before giving up on the AI (#101).
 * OpenRouter `:free` endpoints are frequently rate-limited (HTTP 429) and the
 * `:free` catalog rotates, so a single model is fragile. Each model is tried in
 * order until one returns a valid scene; only when all fail do we serve the stub.
 *
 * The chain is all-free by default (no cost, commercial-use OK on OpenRouter's
 * free tier). Set `OPENROUTER_GM_MODELS` (comma-separated) to override — e.g. to
 * append a cheap paid model such as `qwen/qwen3.5-flash-02-23` as a last resort
 * before the stub once the account holds credit, so a busy game never degrades
 * to a static scene. Free tiers cap at 20 req/min account-wide, so under real
 * load a paid tail is what keeps the AI answering.
 *
 * Editors are deliberately varied (Nvidia → Google → OpenAI → OpenRouter's meta
 * router) because free rate limits are per-provider: the odds of all four being
 * throttled at once are low.
 *
 * Order reflects measured availability (2026-07-26), not just catalog presence:
 * `google/gemma-4-31b-it:free` was permanently 429 upstream while every other
 * entry answered, so it is no longer first — a dead head-of-chain cost one
 * wasted full-prompt round-trip on every single turn. Re-measure before
 * reordering; the free catalog rotates.
 */
export const GAME_MASTER_MODEL_CHAIN: readonly string[] = (
  process.env.OPENROUTER_GM_MODELS ??
  [
    'nvidia/nemotron-3-super-120b-a12b:free',
    'google/gemma-4-26b-a4b-it:free',
    'openai/gpt-oss-20b:free',
    'nvidia/nemotron-3-nano-30b-a3b:free',
    'openrouter/free',
  ].join(',')
)
  .split(',')
  .map((m) => m.trim())
  .filter((m) => m.length > 0)

/** True when an OpenRouter key is configured. Never exposes the key itself. */
export const hasOpenRouterKey = (): boolean => env.openRouter.apiKey.length > 0
