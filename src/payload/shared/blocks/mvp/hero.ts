import type { Block } from 'payload'

/**
 * MVP hero block.
 *
 * Note: This block relates to `media` for background images. This starter's core module
 * includes a `media` upload collection, so keeping this relationship improves editor UX.
 */
export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'بنر اصلی',
    plural: 'بنرهای اصلی',
  },
  fields: [
    {
      name: 'headline',
      label: 'تیتر',
      type: 'text',
      required: true,
    },
    {
      name: 'subheadline',
      label: 'زیرتیتر',
      type: 'textarea',
    },
    {
      name: 'primaryButton',
      label: 'دکمه اصلی',
      type: 'group',
      admin: {
        description: 'اختیاری. اگر پر شود، فرانت‌اند باید یک دکمه CTA اصلی نمایش دهد.',
      },
      fields: [
        {
          name: 'label',
          label: 'متن دکمه',
          type: 'text',
        },
        {
          name: 'href',
          label: 'لینک (Href)',
          type: 'text',
          admin: {
            description: 'می‌تواند نسبی باشد (مثل /contact) یا URL کامل.',
          },
        },
      ],
    },
    {
      name: 'secondaryButton',
      label: 'دکمه دوم',
      type: 'group',
      admin: {
        description: 'اختیاری. اگر پر شود، فرانت‌اند باید یک دکمه CTA ثانویه نمایش دهد.',
      },
      fields: [
        {
          name: 'label',
          label: 'متن دکمه',
          type: 'text',
        },
        {
          name: 'href',
          label: 'لینک (Href)',
          type: 'text',
          admin: {
            description: 'می‌تواند نسبی باشد (مثل /learn-more) یا URL کامل.',
          },
        },
      ],
    },
    {
      name: 'backgroundImage',
      label: 'تصویر پس‌زمینه',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: 'اختیاری. تصویر پس‌زمینه/کاور برای این بنر.',
      },
    },
  ],
}
