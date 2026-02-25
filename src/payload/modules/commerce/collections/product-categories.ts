import type { CollectionConfig } from 'payload'

import { slugField } from '../../../shared/fields'
import { adminOrEditor, publicRead } from '../../../shared/access'
import { generateSlugHook } from '../../../shared/hooks'

/**
 * Product categories (generic taxonomy).
 * Keep this reusable across any ecommerce business type.
 */
export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: {
    singular: 'دسته‌بندی محصول',
    plural: 'دسته‌بندی‌های محصول',
  },
  admin: {
    useAsTitle: 'title',
    description: 'دسته‌بندی‌های محصولات.',
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
    slugField({
      adminDescription:
        'شناسهٔ مناسب برای URL. (TODO: تولید خودکار از روی عنوان با hook)',
    }),
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textarea',
    },
  ],
}
