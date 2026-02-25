import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'CTA',
    plural: 'CTAs',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      name: 'buttonLabel',
      label: 'Button Label',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonHref',
      label: 'Button Href',
      type: 'text',
      required: true,
      admin: {
        description: 'Relative (e.g. /contact) or absolute URL.',
      },
    },
  ],
}

