import type { Block } from 'payload'

import { adminText, tr } from '../../i18n'

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: {
    singular: adminText.blocks.gallery.singular,
    plural: adminText.blocks.gallery.plural,
  },
  fields: [
    {
      name: 'title',
      label: adminText.fields.title,
      type: 'text',
      admin: {
        description: tr('Optional heading for this gallery section.', 'عنوان اختیاری برای این بخش گالری.'),
      },
    },
    {
      name: 'images',
      label: tr('Images', 'تصاویر'),
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: tr('Select one or more images from Media.', 'یک یا چند تصویر را از «رسانه‌ها» انتخاب کنید.'),
      },
    },
  ],
}

