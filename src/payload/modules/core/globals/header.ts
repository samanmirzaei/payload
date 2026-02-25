import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'سربرگ',
  admin: {
    description: 'محتوای سربرگ سایت (ناوبری، اعلان‌ها) که در فرانت‌اندها استفاده می‌شود.',
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'announcementText',
      label: 'متن اعلان',
      type: 'text',
      admin: {
        description: 'اختیاری. متن کوتاه اعلان (نمایش/زمان‌بندی در اختیار فرانت‌اند است).',
      },
    },
    {
      name: 'navigationItems',
      label: 'آیتم‌های ناوبری',
      type: 'array',
      admin: {
        description: 'ناوبری اصلی که در فرانت‌اند استفاده می‌شود.',
      },
      fields: [
        {
          name: 'label',
          label: 'عنوان',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          label: 'لینک (Href)',
          type: 'text',
          required: true,
          admin: {
            description: 'می‌تواند نسبی باشد (مثل /about) یا URL کامل.',
          },
        },
        {
          name: 'openInNewTab',
          label: 'باز شدن در تب جدید',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}
