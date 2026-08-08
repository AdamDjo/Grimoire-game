/**
 * Player narration locale. This is a normalized, validated BCP-47 language tag
 * (e.g. "en", "fr", "es-ES", "it-IT", "de"). It drives ONLY the language the
 * Game Master narrates in — never a UI concern and never a game rule.
 *
 * The value is always produced by {@link normalizeLocale}, so it can be safely
 * interpolated into an AI prompt: raw, unchecked strings never reach this type.
 * The union `"en" | "fr"` is preserved as a literal hint for the UI languages,
 * but any normalized BCP-47 tag is a valid `Locale` at runtime.
 */
export type Locale = "en" | "fr" | (string & {});

/** Global fallback narration language. English is always available. */
export const DEFAULT_LOCALE: Locale = "en";

/**
 * Matches a conservative BCP-47 subset: a 2–3 letter primary language subtag,
 * optionally followed by a 2-letter region or 4-letter script subtag.
 * Deliberately narrow — anything richer (variants, extensions, private-use) is
 * rejected so a locale can never smuggle free text into a prompt.
 */
const BCP47_SAFE = /^[a-z]{2,3}(?:-(?:[a-z]{2}|[a-z]{4}))?$/;

/** Upper bound on a raw locale string before we even try to parse it. */
const MAX_LOCALE_LENGTH = 12;

/**
 * Normalizes and validates a single candidate locale string.
 *
 * Returns a canonical BCP-47 tag (lowercase language, uppercase region,
 * title-case script) when the input is a safe, well-formed tag, or `undefined`
 * otherwise. The caller is responsible for falling back to
 * {@link DEFAULT_LOCALE}. This is the ONLY sanctioned way to turn an untrusted
 * string into a `Locale`.
 */
export function normalizeLocale(input: unknown): Locale | undefined {
  if (typeof input !== "string") return undefined;

  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_LOCALE_LENGTH) {
    return undefined;
  }

  const lower = trimmed.toLowerCase();
  if (!BCP47_SAFE.test(lower)) return undefined;

  const [language, subtag] = lower.split("-");
  if (!subtag) return language;

  // 4-letter subtag = script (title case), 2-letter = region (upper case).
  const canonicalSubtag =
    subtag.length === 4
      ? subtag.charAt(0).toUpperCase() + subtag.slice(1)
      : subtag.toUpperCase();

  return `${language}-${canonicalSubtag}`;
}

/**
 * Resolves the first usable locale from an ordered list of candidates, applying
 * the release precedence: explicit choice → session/account → browser → English.
 * Callers pass candidates most-specific-first; the first one that normalizes
 * wins, and English is returned when none do.
 */
export function resolveLocale(...candidates: unknown[]): Locale {
  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate);
    if (normalized) return normalized;
  }
  return DEFAULT_LOCALE;
}

/**
 * Returns the English display name of a locale's language (e.g. "es-ES" →
 * "Spanish"), for injection into an AI prompt.
 *
 * The name comes exclusively from `Intl.DisplayNames` (ICU data), never from the
 * raw tag, so an untrusted locale can never leak arbitrary text into a prompt.
 * The input is re-normalized defensively and any unknown or unsupported tag
 * falls back to English. Names are requested in English on purpose: the prompt
 * instruction ("Write in <Language>") must itself stay in the pivot language.
 */
export function localeDisplayName(locale: unknown): string {
  const normalized = normalizeLocale(locale) ?? DEFAULT_LOCALE;

  try {
    const display = new Intl.DisplayNames(["en"], { type: "language" });
    return display.of(normalized) ?? "English";
  } catch {
    return "English";
  }
}
