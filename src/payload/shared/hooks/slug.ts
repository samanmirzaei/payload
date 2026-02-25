import type { CollectionBeforeValidateHook } from 'payload'

export type GenerateSlugHookOptions = {
  /**
   * Field to generate the slug from.
   * Defaults to `title`.
   */
  sourceField?: string
  /**
   * Slug field name to write into.
   * Defaults to `slug`.
   */
  slugField?: string
}

/**
 * Minimal, unicode-safe slugifier:
 * - lowercases
 * - trims
 * - replaces whitespace / underscores with `-`
 * - removes non-letter/number characters (keeps Persian/Arabic letters)
 * - collapses repeated dashes
 *
 * TODO (future): add advanced transliteration (e.g. mapping Persian/Arabic variants, emoji removal rules, etc.).
 */
export const slugify = (input: string): string => {
  return input
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/gu, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/gu, '-')
    .replace(/^-|-$/gu, '')
}

/**
 * Generates a slug from a source field (default: `title`) only when the slug is empty.
 * Keeps an existing slug if the editor typed one.
 */
export const generateSlugHook = (
  options: GenerateSlugHookOptions = {},
): CollectionBeforeValidateHook => {
  const sourceField = options.sourceField ?? 'title'
  const slugField = options.slugField ?? 'slug'

  return ({ data, originalDoc }) => {
    if (!data) return data

    const existing = data[slugField]
    if (typeof existing === 'string' && existing.trim().length > 0) {
      return data
    }

    const sourceValue =
      (typeof data[sourceField] === 'string' ? (data[sourceField] as string) : undefined) ??
      (typeof originalDoc?.[sourceField] === 'string' ? (originalDoc?.[sourceField] as string) : undefined)

    if (!sourceValue?.trim()) return data

    const next = slugify(sourceValue)
    if (!next) return data

    return {
      ...data,
      [slugField]: next,
    }
  }
}

