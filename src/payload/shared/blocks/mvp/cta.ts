import type { Block } from 'payload'

import { adminText, tr } from '../../i18n'

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: adminText.blocks.cta.singular,
    plural: adminText.blocks.cta.plural,
  },
  fields: [
    {
      name: 'title',
      label: adminText.fields.title,
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: adminText.fields.description,
      type: 'textarea',
    },
    {
      name: 'buttonLabel',
      label: tr('Button Label', 'متن دکمه'),
      type: 'text',
      required: true,
    },
    {
      name: 'buttonHref',
      label: tr('Button Href', 'لینک دکمه'),
      type: 'text',
      required: true,
      admin: {
        description: tr('Relative (e.g. /contact) or absolute URL.', 'می‌تواند نسبی باشد (مثل /contact) یا URL کامل.'),
      },
    },
  ],
}

