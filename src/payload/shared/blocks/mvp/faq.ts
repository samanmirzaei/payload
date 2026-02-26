import type { Block } from 'payload'

import { adminText, tr } from '../../i18n'

export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: adminText.blocks.faq.singular,
    plural: adminText.blocks.faq.plural,
  },
  fields: [
    {
      name: 'title',
      label: adminText.fields.title,
      type: 'text',
      admin: {
        description: tr('Optional heading for this FAQ section.', 'عنوان اختیاری برای این بخش سوالات متداول.'),
      },
    },
    {
      name: 'items',
      label: tr('Items', 'موارد'),
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'question',
          label: tr('Question', 'سوال'),
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          label: tr('Answer', 'پاسخ'),
          type: 'textarea',
          required: true,
          admin: {
            description: tr('MVP answer field. TODO: upgrade to rich text if needed.', 'نسخه MVP. TODO: در صورت نیاز به Rich Text ارتقا داده شود.'),
          },
        },
      ],
    },
  ],
}

