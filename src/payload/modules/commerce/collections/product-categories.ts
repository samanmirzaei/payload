import type { CollectionConfig } from 'payload'

import { slugField } from '../../../shared/fields'
import { adminOrEditor, publicRead } from '../../../shared/access'

/**
 * Product categories (generic taxonomy).
 * Keep this reusable across any ecommerce business type.
 */
export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  admin: {
    useAsTitle: 'title',
    description: 'Category taxonomy for products.',
  },
  access: {
    read: publicRead,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    slugField({
      adminDescription:
        'URL-safe identifier for this product category. TODO: auto-generate from title via hook.',
    }),
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
  ],
}
