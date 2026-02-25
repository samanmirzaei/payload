import type { Field } from 'payload'

export type PublishStatus = 'draft' | 'published'

export type PublishFieldsOptions = {
  /**
   * Field names are configurable to avoid collisions in edge cases.
   */
  statusName?: string
  publishedAtName?: string

  /**
   * Include a `publishedAt` date field (optional MVP requirement).
   */
  includePublishedAt?: boolean

  /**
   * Control sidebar placement for editorial ergonomics.
   */
  sidebar?: boolean
}

/**
 * Generic publishing fields (MVP).
 *
 * TODO (future): If you enable Payload drafts/versions, consider mapping these fields to:
 * - `drafts` feature state
 * - version publish workflows
 */
export const publishFields = (options: PublishFieldsOptions = {}): Field[] => {
  const {
    statusName = 'status',
    publishedAtName = 'publishedAt',
    includePublishedAt = true,
    sidebar = true,
  } = options

  const admin = sidebar ? { position: 'sidebar' as const } : undefined

  const fields: Field[] = [
    {
      name: statusName,
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        ...admin,
        description: 'MVP publishing state. Later steps can integrate Payload drafts/versioning.',
      },
    },
  ]

  if (includePublishedAt) {
    fields.push({
      name: publishedAtName,
      type: 'date',
      admin: {
        ...admin,
        condition: (_data, siblingData) => siblingData?.[statusName] === 'published',
        description:
          'Optional. Frontends can prefer this for sorting/feeds when set (otherwise fallback to createdAt).',
      },
    })
  }

  return fields
}
