import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'
import { adminText, tr } from '../../../shared/i18n'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: adminText.globals.footer,
  admin: {
    group: adminText.groups.settings,
    description: tr('Site-wide footer content (navigation, notes, legal).', 'محتوای پابرگ سایت (ناوبری، یادداشت‌ها، موارد حقوقی).'),
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'copyrightText',
      label: tr('Copyright Text', 'متن کپی‌رایت'),
      type: 'text',
      admin: {
        description: tr('Optional. Example: © 2026 Company Name. All rights reserved.', 'اختیاری. مثال: © 2026 نام شرکت. همه حقوق محفوظ است.'),
      },
    },
    {
      name: 'footerNavigationItems',
      label: tr('Footer Navigation Items', 'آیتم‌های ناوبری پابرگ'),
      type: 'array',
      admin: {
        description: tr('Secondary/footer navigation used by frontends.', 'ناوبری ثانویه/پابرگ که در فرانت‌اند استفاده می‌شود.'),
      },
      fields: [
        {
          name: 'label',
          label: tr('Label', 'عنوان'),
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          label: tr('Href', 'لینک (Href)'),
          type: 'text',
          required: true,
          admin: {
            description: tr('Relative (e.g. /privacy) or absolute URL.', 'می‌تواند نسبی باشد (مثل /privacy) یا URL کامل.'),
          },
        },
        {
          name: 'openInNewTab',
          label: tr('Open In New Tab', 'باز شدن در تب جدید'),
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'footerNote',
      label: tr('Footer Note', 'یادداشت پابرگ'),
      type: 'textarea',
      admin: {
        description: tr('Optional longer note (e.g. disclaimers, address, hours).', 'اختیاری. یادداشت طولانی‌تر (مثل توضیحات حقوقی، آدرس، ساعت کاری).'),
      },
    },
  ],
}

