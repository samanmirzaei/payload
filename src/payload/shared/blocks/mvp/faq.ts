import type { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'سوالات متداول',
    plural: 'بلوک‌های سوالات متداول',
  },
  fields: [
    {
      name: 'title',
      label: 'عنوان',
      type: 'text',
      admin: {
        description: 'عنوان اختیاری برای این بخش سوالات متداول.',
      },
    },
    {
      name: 'items',
      label: 'موارد',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'question',
          label: 'سوال',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          label: 'پاسخ',
          type: 'textarea',
          required: true,
          admin: {
            description: 'نسخه MVP. TODO: در صورت نیاز به Rich Text ارتقا داده شود.',
          },
        },
      ],
    },
  ],
}
