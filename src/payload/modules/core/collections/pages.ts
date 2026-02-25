import type { CollectionConfig } from 'payload'

import { publishFields, seoFields, slugField } from '../../../shared/fields'
import { layoutBlocks } from '../../../shared/blocks'
import { adminOrEditor, publicRead } from '../../../shared/access'
import { ensurePublishedAt, generateSlugHook } from '../../../shared/hooks'

/**
 * Generic pages collection.
 *
 * TODO (future): expand available blocks as needed (keep them shared/generic).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'صفحه',
    plural: 'صفحه‌ها',
  },
  admin: {
    group: 'محتوا',
    useAsTitle: 'title',
    description: 'صفحه‌های قابل استفادهٔ مجدد برای وب‌سایت‌های شرکتی، مارکتینگ و محتوا.',
  },
  access: {
    read: publicRead,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    beforeValidate: [generateSlugHook()],
    beforeChange: [ensurePublishedAt()],
  },
  fields: [
    {
      name: 'title',
      label: 'عنوان',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'layout',
      label: 'چیدمان',
      type: 'blocks',
      blocks: layoutBlocks,
      admin: {
        description: 'چیدمان صفحه با بلوک‌های قابل استفادهٔ مجدد ساخته می‌شود.',
      },
    },
    seoFields(),
    ...publishFields(),
  ],
}
