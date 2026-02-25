import type { CollectionBeforeChangeHook } from 'payload'

export type EnsurePublishedAtOptions = {
  statusField?: string
  publishedAtField?: string
}

/**
 * If status becomes `published` and `publishedAt` is empty, set it to now.
 * Generic and reusable with `publishFields()`.
 */
export const ensurePublishedAt = (
  options: EnsurePublishedAtOptions = {},
): CollectionBeforeChangeHook => {
  const statusField = options.statusField ?? 'status'
  const publishedAtField = options.publishedAtField ?? 'publishedAt'

  return ({ data, originalDoc }) => {
    if (!data) return data

    const nextStatus = data[statusField]
    const existingPublishedAt = data[publishedAtField] ?? originalDoc?.[publishedAtField]

    if (nextStatus === 'published' && !existingPublishedAt) {
      return {
        ...data,
        [publishedAtField]: new Date().toISOString(),
      }
    }

    return data
  }
}

