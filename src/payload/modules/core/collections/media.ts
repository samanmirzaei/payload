import type { CollectionConfig } from 'payload'

import path from 'node:path'

import { adminOrEditor, publicRead } from '../../../shared/access'

/**
 * Media upload collection (images/files).
 *
 * Note: Storage stays on Payload defaults for now.
 * TODO (future): configure cloud storage and/or image processing as needed per project.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  admin: {
    useAsTitle: 'alt',
    description: 'Uploaded assets used across content (images, files).',
  },
  access: {
    read: publicRead,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'uploads'),
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true,
      admin: {
        description: 'Required for accessibility and SEO. Describe the image content.',
      },
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'textarea',
      admin: {
        description: 'Optional. Displayed near the image in some layouts.',
      },
    },
    {
      name: 'source',
      label: 'Source',
      type: 'text',
      admin: {
        description: 'Optional. Where this asset came from (publication, website, etc.).',
      },
    },
    {
      name: 'credit',
      label: 'Credit',
      type: 'text',
      admin: {
        description: 'Optional. Photographer/creator credit for editorial/legal requirements.',
      },
    },
  ],
}
