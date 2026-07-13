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
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY ?? '',
    /** Free multilingual model by default; override with OPENROUTER_MODEL. */
    model: process.env.OPENROUTER_MODEL ?? 'meta-llama/llama-3.3-70b-instruct:free',
    /** Lightweight model used for N2 scene compression; override with OPENROUTER_COMPRESSION_MODEL. */
    compressionModel:
      process.env.OPENROUTER_COMPRESSION_MODEL ?? 'mistralai/mistral-small-24b-instruct:free',
    baseUrl: 'https://openrouter.ai/api/v1',
  },
} as const

/** Hardcoded fallback model for N2 compression if the primary model call fails. */
export const COMPRESSION_FALLBACK_MODEL = 'meta-llama/llama-3.3-70b-instruct:free'

/** True when an OpenRouter key is configured. Never exposes the key itself. */
export const hasOpenRouterKey = (): boolean => env.openRouter.apiKey.length > 0
