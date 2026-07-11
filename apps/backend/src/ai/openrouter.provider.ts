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
}

/**
 * Calls OpenRouter's chat completions endpoint.
 * The API key stays server-side and is never logged or returned.
 */
export async function callOpenRouter(messages: OpenRouterMessage[]): Promise<OpenRouterResult> {
  const { apiKey, model, baseUrl } = env.openRouter

  if (!apiKey) {
    return { success: false, error: 'OpenRouter API key not configured' }
  }

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
    })

    if (!response.ok) {
      // Never surface the request headers (they carry the key) — status only.
      return { success: false, error: `OpenRouter request failed (${response.status})` }
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
    // Log the message only (never the request headers, which carry the key).
    const message = err instanceof Error ? err.message : 'unknown error'
    return { success: false, error: `OpenRouter request errored: ${message}` }
  }
}
