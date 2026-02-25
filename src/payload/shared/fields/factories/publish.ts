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
      label: 'وضعیت',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'پیش‌نویس', value: 'draft' },
        { label: 'منتشر شده', value: 'published' },
      ],
      admin: {
        ...admin,
        description: 'وضعیت انتشار (MVP). در مراحل بعد می‌توان drafts/versioning را یکپارچه کرد.',
      },
    },
  ]

  if (includePublishedAt) {
    fields.push({
      name: publishedAtName,
      label: 'تاریخ انتشار',
      type: 'date',
      admin: {
        ...admin,
        condition: (_data, siblingData) => siblingData?.[statusName] === 'published',
        description:
          'اختیاری. در صورت تنظیم، فرانت‌اند می‌تواند برای مرتب‌سازی/فید از آن استفاده کند (در غیر این صورت از createdAt).',
      },
    })
  }

  return fields
}
