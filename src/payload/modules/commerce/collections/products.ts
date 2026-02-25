import type { CollectionConfig } from 'payload'

import { layoutBlocks } from '../../../shared/blocks'
import { publishFields, seoFields, slugField } from '../../../shared/fields'
import { adminOrEditor, publicRead } from '../../../shared/access'
import { ensurePublishedAt, generateSlugHook } from '../../../shared/hooks'

/**
 * Products (MVP).
 *
 * TODO (future):
 * - Add inventory/order system (separate module) rather than baking assumptions into Products.
 * - Consider migrating SEO image URL placeholders to Media relationships if desired.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    description: 'Generic products collection for ecommerce projects.',
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
      label: 'Title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'sku',
      label: 'SKU',
      type: 'text',
      admin: {
        description: 'Optional internal identifier used by your commerce/inventory systems.',
      },
    },
    {
      name: 'shortDescription',
      label: 'Short Description',
      type: 'textarea',
      admin: {
        description: 'Optional. Used for product cards, listings, and previews.',
      },
    },
    {
      type: 'collapsible',
      label: 'Media',
      admin: {
        initCollapsed: false,
        description: 'Product images used for listings and detail pages.',
      },
      fields: [
        {
          name: 'featuredImage',
          label: 'Featured Image',
          type: 'relationship',
          relationTo: 'media',
          admin: {
            description: 'Optional. Primary image used for listings and social previews.',
          },
        },
        {
          name: 'gallery',
          label: 'Gallery',
          type: 'relationship',
          relationTo: 'media',
          hasMany: true,
          admin: {
            description: 'Optional additional product images.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Pricing',
      admin: {
        initCollapsed: false,
        description: 'MVP pricing fields (currency handling is integration-specific).',
      },
      fields: [
        {
          name: 'basePrice',
          label: 'Base Price',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            placeholder: '0',
          },
        },
        {
          name: 'salePrice',
          label: 'Sale Price',
          type: 'number',
          min: 0,
          validate: (
            value: number | null | undefined,
            { data }: { data?: { basePrice?: unknown } },
          ) => {
            if (value === null || typeof value === 'undefined') return true
            const base = data?.basePrice
            if (typeof base === 'number' && value > base) {
              return 'salePrice must be less than or equal to basePrice'
            }
            return true
          },
          admin: {
            description: 'Optional. Must be less than or equal to Base Price.',
            placeholder: '0',
          },
        },
      ],
    },
    {
      name: 'productCategories',
      label: 'Product Categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      admin: {
        description: 'Optional taxonomy for filtering and navigation.',
      },
    },
    {
      name: 'attributes',
      label: 'Attributes',
      type: 'array',
      admin: {
        description: 'Optional key/value attributes (e.g. Material: Cotton, Size: Large).',
      },
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          label: 'Value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Variants',
      admin: {
        initCollapsed: true,
        description:
          'MVP variants. Keep lightweight; advanced option matrices can be added later if needed.',
      },
      fields: [
        {
          name: 'variants',
          label: 'Variants',
          type: 'array',
          fields: [
            {
              name: 'sku',
              label: 'SKU',
              type: 'text',
              admin: {
                description: 'Optional variant SKU.',
              },
            },
            {
              name: 'price',
              label: 'Price',
              type: 'number',
              required: true,
              min: 0,
            },
            {
              name: 'stock',
              label: 'Stock',
              type: 'number',
              min: 0,
              admin: {
                description: 'Optional stock count. TODO: replace with inventory module later.',
              },
            },
            {
              name: 'attributesSummary',
              label: 'Attributes Summary',
              type: 'text',
              admin: {
                description: 'Optional. Example: "Size: M / Color: Black".',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'faq',
      label: 'FAQ',
      type: 'array',
      admin: {
        description: 'Optional product-specific questions.',
      },
      fields: [
        {
          name: 'question',
          label: 'Question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          label: 'Answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'layout',
      label: 'Layout',
      type: 'blocks',
      blocks: layoutBlocks,
      admin: {
        description: 'Product detail layout composed from reusable blocks.',
      },
    },
    seoFields(),
    ...publishFields(),
  ],
}
