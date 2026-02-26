import type { Block } from 'payload'

import { adminText, tr } from '../../i18n'

/**
 * MVP rich text block.
 *
 * Keeping this as a `textarea` avoids coupling to any particular rich text editor setup.
 * TODO (future): migrate to Payload `richText` field once editor configuration is decided.
 */
export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: adminText.blocks.richText.singular,
    plural: adminText.blocks.richText.plural,
  },
  fields: [
    {
      name: 'content',
      label: tr('Content', 'محتوا'),
      type: 'textarea',
      admin: {
        description: tr('Temporary. TODO: replace with a rich text editor field.', 'موقت. TODO: در آینده با فیلد Rich Text جایگزین شود.'),
      },
    },
  ],
}

