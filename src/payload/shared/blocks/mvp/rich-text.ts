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
    singular: 'متن',
    plural: 'بلوک‌های متن',
  },
  fields: [
    {
      name: 'content',
      label: 'محتوا',
      type: 'textarea',
      admin: {
        description: 'موقت. TODO: در آینده با فیلد ویرایشگر متن غنی (Rich Text) جایگزین شود.',
      },
    },
  ],
}
