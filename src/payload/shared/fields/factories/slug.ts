import type { Field } from 'payload'

export type SlugFieldOptions = {
  name?: string
  label?: string
  required?: boolean
  unique?: boolean
  adminDescription?: string
}

/**
 * Integration point:
 * - For Next.js frontends, use this slug as part of the route segment.
 * - TODO (future): add a `beforeValidate` hook to auto-generate slugs from a title.
 */
export const slugField = (options: SlugFieldOptions = {}): Field => {
  const {
    name = 'slug',
    label = 'نامک (Slug)',
    required = true,
    unique = true,
    adminDescription = 'شناسهٔ مناسب برای URL. (TODO: تولید خودکار از روی عنوان با hook)',
  } = options

  return {
    name,
    label,
    type: 'text',
    index: true,
    unique,
    required,
    admin: {
      description: adminDescription,
    },
  }
}
