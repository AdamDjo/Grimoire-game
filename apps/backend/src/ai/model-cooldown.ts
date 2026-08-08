/**
 * In-memory cooldown for OpenRouter models that answered with a transient
 * failure (429 rate-limit, 5xx).
 *
 * Why this exists: the fallback chain retries the *entire* prompt — system
 * prompt, N2 memory, N1 turns, Souvenirs — against the next model. When the
 * head of the chain is throttled upstream for hours (as `google/gemma-4-31b-it:free`
 * was in July 2026), every single turn paid one full wasted round-trip before
 * reaching a model that answers. Marking a model as cooling down skips it
 * outright for the next few minutes, so the wasted request is paid once per
 * cooldown window instead of once per turn.
 *
 * Deliberately process-local (a plain Map, no Redis): the data is disposable
 * hint state, a wrong guess only costs one extra attempt, and a fresh process
 * simply re-measures. Scaling to several instances just means each one learns
 * on its own — no correctness issue.
 */

/** How long a model stays skipped after a transient failure. */
export const MODEL_COOLDOWN_MS = 5 * 60_000

/** Model id → epoch ms at which it becomes eligible again. */
const cooldownUntil = new Map<string, number>()

/** True when `model` is currently in cooldown and should be skipped. */
export function isModelCoolingDown(model: string, now: number = Date.now()): boolean {
  const until = cooldownUntil.get(model)
  if (until === undefined) {
    return false
  }
  if (until <= now) {
    cooldownUntil.delete(model)
    return false
  }
  return true
}

/** Marks `model` as unavailable for `MODEL_COOLDOWN_MS`. */
export function markModelCoolingDown(model: string, now: number = Date.now()): void {
  cooldownUntil.set(model, now + MODEL_COOLDOWN_MS)
}

/** Clears `model`'s cooldown after a successful call. */
export function clearModelCooldown(model: string): void {
  cooldownUntil.delete(model)
}

/**
 * Orders `chain` so healthy models are tried before cooling-down ones, keeping
 * relative order within each group. Never *removes* a model: if every entry is
 * cooling down the chain still runs in its original order rather than falling
 * straight through to the stub — a stale cooldown must not deny service.
 */
export function prioritizeAvailableModels(
  chain: readonly string[],
  now: number = Date.now()
): string[] {
  const available = chain.filter((model) => !isModelCoolingDown(model, now))
  const cooling = chain.filter((model) => isModelCoolingDown(model, now))
  return [...available, ...cooling]
}

/** Test-only: wipes all cooldown state. */
export function resetModelCooldowns(): void {
  cooldownUntil.clear()
}
