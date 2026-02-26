import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'
import { adminText, tr } from '../../../shared/i18n'

export const Header: GlobalConfig = {
  slug: 'header',
  label: adminText.globals.header,
  admin: {
    group: adminText.groups.settings,
    description: tr('Site-wide header content (navigation, announcements).', 'محتوای سربرگ سایت (ناوبری، اعلان‌ها).'),
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'announcementText',
      label: tr('Announcement Text', 'متن اعلان'),
      type: 'text',
      admin: {
        description: tr(
          'Optional short announcement (frontends decide how/when to display).',
          'اختیاری. متن کوتاه اعلان (نمایش/زمان‌بندی در اختیار فرانت‌اند است).',
        ),
      },
    },
    {
      name: 'navigationItems',
      label: tr('Navigation Items', 'آیتم‌های ناوبری'),
      type: 'array',
      admin: {
        description: tr('Primary navigation used by frontends.', 'ناوبری اصلی که در فرانت‌اند استفاده می‌شود.'),
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
            description: tr('Relative (e.g. /about) or absolute URL.', 'می‌تواند نسبی باشد (مثل /about) یا URL کامل.'),
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
  ],
}

