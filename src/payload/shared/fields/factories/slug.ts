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
    label = 'Slug',
    required = true,
    unique = true,
    adminDescription = 'URL-safe identifier. TODO: auto-generate from title via hook.',
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
