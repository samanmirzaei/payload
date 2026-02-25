import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: {
    singular: 'گالری',
    plural: 'گالری‌ها',
  },
  fields: [
    {
      name: 'title',
      label: 'عنوان',
      type: 'text',
      admin: {
        description: 'عنوان اختیاری برای این بخش گالری.',
      },
    },
    {
      name: 'images',
      label: 'تصاویر',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'یک یا چند تصویر را از «رسانه‌ها» انتخاب کنید.',
      },
    },
  ],
}
