import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'پابرگ',
  admin: {
    group: 'تنظیمات',
    description: 'محتوای پابرگ سایت (ناوبری، یادداشت‌ها، موارد حقوقی) که در فرانت‌اندها استفاده می‌شود.',
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'copyrightText',
      label: 'متن کپی‌رایت',
      type: 'text',
      admin: {
        description: 'اختیاری. مثال: © 2026 نام شرکت. همه حقوق محفوظ است.',
      },
    },
    {
      name: 'footerNavigationItems',
      label: 'آیتم‌های ناوبری پابرگ',
      type: 'array',
      admin: {
        description: 'ناوبری ثانویه/پابرگ که در فرانت‌اند استفاده می‌شود.',
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
            description: 'می‌تواند نسبی باشد (مثل /privacy) یا URL کامل.',
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
    {
      name: 'footerNote',
      label: 'یادداشت پابرگ',
      type: 'textarea',
      admin: {
        description: 'اختیاری. یادداشت طولانی‌تر (مثل توضیحات حقوقی، آدرس، ساعت کاری).',
      },
    },
  ],
}
