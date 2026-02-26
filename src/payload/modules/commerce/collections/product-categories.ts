import type { CollectionConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'
import { slugField } from '../../../shared/fields'
import { adminText, tr } from '../../../shared/i18n'
import { generateSlugHook } from '../../../shared/hooks'

/**
 * Product categories (generic taxonomy).
 * Keep this reusable across any ecommerce business type.
 */
export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: {
    singular: adminText.collections.productCategories.singular,
    plural: adminText.collections.productCategories.plural,
  },
  admin: {
    group: adminText.groups.store,
    useAsTitle: 'title',
    description: tr('Product taxonomy for organizing products.', 'دسته‌بندی‌های محصولات.'),
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
    slugField({
      adminDescription: tr(
        'URL-safe identifier for this product category. (TODO: auto-generate from title via hook)',
        'شناسهٔ مناسب برای URL. (TODO: تولید خودکار از روی عنوان با hook)',
      ),
    }),
    {
      name: 'description',
      label: adminText.fields.description,
      type: 'textarea',
    },
  ],
}

