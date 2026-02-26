import type { CollectionConfig } from 'payload'

import { layoutBlocks } from '../../../shared/blocks'
import { adminOrEditor, publicRead } from '../../../shared/access'
import { publishFields, seoFields, slugField } from '../../../shared/fields'
import { adminText, tr } from '../../../shared/i18n'
import { ensurePublishedAt, generateSlugHook } from '../../../shared/hooks'

/**
 * Generic pages collection.
 *
 * TODO (future): expand available blocks as needed (keep them shared/generic).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: adminText.collections.pages.singular,
    plural: adminText.collections.pages.plural,
  },
  admin: {
    group: adminText.groups.content,
    useAsTitle: 'title',
    description: tr(
      'Reusable pages for corporate, marketing, and content websites.',
      'صفحه‌های قابل استفادهٔ مجدد برای وب‌سایت‌های شرکتی، مارکتینگ و محتوا.',
    ),
    components: {
      views: {
        edit: {
          default: {
            actions: ['./src/payload/admin/components/DocURLActions'],
          },
        },
      },
    },
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
      label: adminText.fields.title,
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'layout',
      label: adminText.fields.layout,
      type: 'blocks',
      blocks: layoutBlocks,
      admin: {
        description: tr(
          'Build the page layout using reusable blocks.',
          'چیدمان صفحه را با بلوک‌های قابل استفادهٔ مجدد بسازید.',
        ),
      },
    },
    seoFields(),
    ...publishFields(),
  ],
}
