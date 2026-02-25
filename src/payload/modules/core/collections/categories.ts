import type { CollectionConfig } from 'payload'

import { slugField } from '../../../shared/fields'
import { adminOrEditor, publicRead } from '../../../shared/access'
import { generateSlugHook } from '../../../shared/hooks'

/**
 * Generic categories (reusable for blog posts now, and later potentially products/taxonomy).
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'دسته‌بندی',
    plural: 'دسته‌بندی‌ها',
  },
  admin: {
    group: 'محتوا',
    useAsTitle: 'title',
    description: 'طبقه‌بندی عمومی و قابل استفادهٔ مجدد.',
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
      label: 'عنوان',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textarea',
    },
  ],
}
