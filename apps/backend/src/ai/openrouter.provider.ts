import { env } from '../config/env'

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterResult {
  success: boolean
  /** Raw assistant text content (expected to be JSON). */
  content?: string
  error?: string
  /**
   * HTTP status of a failed request, when the failure came from the API rather
   * than the network. Lets callers distinguish transient failures worth
   * retrying on another model (429, 5xx) from definitive ones (401, 400).
   * Absent on success and on network/timeout errors.
   */
  status?: number
}

export interface OpenRouterCallOptions {
  /** Overrides `env.openRouter.model` for this call (e.g. N2 compression). */
  model?: string
  /** Aborts the request if it exceeds this duration. */
  timeoutMs?: number
}

/**
 * Calls OpenRouter's chat completions endpoint.
 * The API key stays server-side and is never logged or returned.
 */
export async function callOpenRouter(
  messages: OpenRouterMessage[],
  options?: OpenRouterCallOptions
): Promise<OpenRouterResult> {
  const { apiKey, model: defaultModel, baseUrl } = env.openRouter
  const model = options?.model ?? defaultModel

  if (!apiKey) {
    return { success: false, error: 'OpenRouter API key not configured' }
  }

  const controller = options?.timeoutMs ? new AbortController() : undefined
  const timeout = controller ? setTimeout(() => controller.abort(), options?.timeoutMs) : undefined

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Optional attribution headers recommended by OpenRouter.
        'HTTP-Referer': env.frontendUrl,
        'X-Title': 'Grimoire - Of Ash and Salt',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
      signal: controller?.signal,
    })

    if (!response.ok) {
      // Never surface the request headers (they carry the key) — status only.
      return {
        success: false,
        error: `OpenRouter request failed (${response.status})`,
        status: response.status,
      }
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return { success: false, error: 'OpenRouter returned an empty response' }
    }

    return { success: true, content }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, error: 'OpenRouter request timed out' }
    }
    // Log the message only (never the request headers, which carry the key).
    const message = err instanceof Error ? err.message : 'unknown error'
    return { success: false, error: `OpenRouter request errored: ${message}` }
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}
