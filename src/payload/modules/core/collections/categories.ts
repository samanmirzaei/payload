import type { CollectionConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'
import { slugField } from '../../../shared/fields'
import { adminText, tr } from '../../../shared/i18n'
import { generateSlugHook } from '../../../shared/hooks'

/**
 * Generic categories (reusable taxonomy).
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: adminText.collections.categories.singular,
    plural: adminText.collections.categories.plural,
  },
  admin: {
    group: adminText.groups.content,
    useAsTitle: 'title',
    description: tr('Reusable taxonomy for organizing content.', 'طبقه‌بندی عمومی و قابل استفادهٔ مجدد.'),
  },
  access: {
    read: publicRead,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    beforeValidate: [generateSlugHook()],
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
      name: 'description',
      label: adminText.fields.description,
      type: 'textarea',
    },
  ],
}

