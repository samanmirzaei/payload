import type { CollectionConfig } from 'payload'

import { slugField } from '../../../shared/fields'
import { adminOrEditor, publicRead } from '../../../shared/access'

/**
 * Generic categories (reusable for blog posts now, and later potentially products/taxonomy).
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    description: 'Reusable category taxonomy.',
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
    slugField(),
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
  ],
}
