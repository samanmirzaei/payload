import type { Field } from 'payload'

import { adminText, tr } from '../../i18n'

export type SlugFieldOptions = {
  name?: string
  label?: string | Record<string, string>
  required?: boolean
  unique?: boolean
  adminDescription?: string | Record<string, string>
}

/**
 * Integration point:
 * - For Next.js frontends, use this slug as part of the route segment.
 * - TODO (future): add a `beforeValidate` hook to auto-generate slugs from a title.
 */
export const slugField = (options: SlugFieldOptions = {}): Field => {
  const {
    name = 'slug',
    label = adminText.fields.slug,
    required = true,
    unique = true,
    adminDescription = tr(
      'URL-safe identifier. (TODO: auto-generate from title via hook)',
      'شناسهٔ مناسب برای URL. (TODO: تولید خودکار از روی عنوان با hook)',
    ),
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
