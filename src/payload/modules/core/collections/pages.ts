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
  admin: {
    useAsTitle: 'title',
    description: 'Reusable pages for corporate sites, marketing, and storefront content.',
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
      name: 'layout',
      label: 'Layout',
      type: 'blocks',
      blocks: layoutBlocks,
      admin: {
        description: 'Page layout composed from reusable blocks.',
      },
    },
    seoFields(),
    ...publishFields(),
  ],
}
