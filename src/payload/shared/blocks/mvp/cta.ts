import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'فراخوان به اقدام (CTA)',
    plural: 'بلوک‌های CTA',
  },
  fields: [
    {
      name: 'title',
      label: 'عنوان',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'توضیحات',
      type: 'textarea',
    },
    {
      name: 'buttonLabel',
      label: 'متن دکمه',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonHref',
      label: 'لینک دکمه',
      type: 'text',
      required: true,
      admin: {
        description: 'می‌تواند نسبی باشد (مثل /contact) یا URL کامل.',
      },
    },
  ],
}
