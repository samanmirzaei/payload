import type { Block } from 'payload'

/**
 * MVP rich text block.
 *
 * Keeping this as a `textarea` avoids coupling to any particular rich text editor setup.
 * TODO (future): migrate to Payload `richText` field once editor configuration is decided.
 */
export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },
  fields: [
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      admin: {
        description: 'Temporary. TODO: replace with a rich text editor field.',
      },
    },
  ],
}

