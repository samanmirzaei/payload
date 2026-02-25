import type { CollectionConfig } from 'payload'

import { publishFields, seoFields, slugField } from '../../../shared/fields'
import { layoutBlocks } from '../../../shared/blocks'
import { adminOrEditor, publicRead } from '../../../shared/access'
import { ensurePublishedAt, generateSlugHook } from '../../../shared/hooks'

/**
 * Generic posts collection (blog/news).
 *
 * TODO (future): expand available blocks as needed (keep them shared/generic).
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    description: 'Reusable posts for announcements, blogs, and editorial content.',
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
      name: 'excerpt',
      label: 'Excerpt',
      type: 'textarea',
      admin: {
        description: 'Optional short summary for cards, feeds, and previews.',
      },
    },
    {
      name: 'featuredImage',
      label: 'Featured Image',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description:
          'Optional. Used for previews and social sharing. TODO (future): align SEO helpers to media relations if desired.',
      },
    },
    {
      name: 'layout',
      label: 'Content / Layout',
      type: 'blocks',
      blocks: layoutBlocks,
      admin: {
        description: 'Post content composed from reusable blocks.',
      },
    },
    {
      name: 'categories',
      label: 'Categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        description: 'Optional taxonomy for grouping/filtering.',
      },
    },
    seoFields(),
    ...publishFields(),
  ],
}
