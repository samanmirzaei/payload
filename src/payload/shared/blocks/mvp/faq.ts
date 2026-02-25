import type { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      admin: {
        description: 'Optional heading for this FAQ section.',
      },
    },
    {
      name: 'items',
      label: 'Items',
      type: 'array',
      minRows: 1,
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
          admin: {
            description: 'MVP answer field. TODO: upgrade to rich text if needed.',
          },
        },
      ],
    },
  ],
}

