import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'

/**
 * Site-wide SEO defaults.
 * This is intentionally distinct from per-page SEO fields (e.g. `seoFields()`), because defaults
 * often include templates and organization/schema data.
 */
export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'پیش‌فرض‌های سئو',
  admin: {
    group: 'تنظیمات',
    description: 'مقادیر پیش‌فرض سئو که وقتی سئوی صفحه خالی است، توسط فرانت‌اندها اعمال می‌شود.',
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'defaultTitle',
      label: 'عنوان پیش‌فرض',
      type: 'text',
      admin: {
        description: 'وقتی یک صفحه عنوان متا ندارد استفاده می‌شود.',
      },
    },
    {
      name: 'titleTemplate',
      label: 'قالب عنوان',
      type: 'text',
      admin: {
        description: 'مثال: %s | Brand (جایی که %s با عنوان صفحه جایگزین می‌شود).',
      },
    },
    {
      name: 'defaultMetaDescription',
      label: 'توضیح متای پیش‌فرض',
      type: 'textarea',
      admin: {
        description: 'وقتی یک صفحه توضیح متا ندارد استفاده می‌شود.',
      },
    },
    /**
     * TODO (later): switch to a relationship to a shared `media` upload collection.
     * Keeping this as a URL avoids coupling to storage implementation in early steps.
     */
    {
      name: 'defaultOgImageUrl',
      label: 'نشانی تصویر پیش‌فرض OG',
      type: 'text',
      admin: {
        description: 'موقت: URL به‌صورت متن. TODO: در آینده با رابطه به Media جایگزین شود.',
      },
    },
    {
      name: 'robots',
      label: 'پیش‌فرض‌های Robots',
      type: 'group',
      fields: [
        {
          name: 'noIndex',
          label: 'noindex پیش‌فرض',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'اگر فعال باشد، پیش‌فرض فرانت‌اندها noindex است مگر اینکه در صفحه بازنویسی شود.',
          },
        },
        {
          name: 'noFollow',
          label: 'nofollow پیش‌فرض',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'اگر فعال باشد، پیش‌فرض فرانت‌اندها nofollow است مگر اینکه در صفحه بازنویسی شود.',
          },
        },
      ],
    },
    {
      name: 'organization',
      label: 'طرح‌واره سازمان (Schema.org)',
      type: 'group',
      admin: {
        description: 'فیلدهای پایه برای داده‌های ساختاریافته (Organization) که در فرانت‌اند استفاده می‌شود.',
      },
      fields: [
        {
          name: 'name',
          label: 'نام سازمان',
          type: 'text',
          admin: {
            description: 'اغلب با «تنظیمات سایت → نام سایت» یکسان است.',
          },
        },
        /**
         * TODO (later): switch to a relationship to a shared `media` upload collection.
         */
        {
          name: 'logoUrl',
          label: 'نشانی لوگو (URL)',
          type: 'text',
          admin: {
            description: 'موقت: URL به‌صورت متن. TODO: در آینده با رابطه به Media جایگزین شود.',
          },
        },
        {
          name: 'sameAsLinks',
          label: 'لینک‌های SameAs',
          type: 'array',
          admin: {
            description: 'URL پروفایل‌های اجتماعی (برای Organization.sameAs در schema.org).',
          },
          fields: [
            {
              name: 'url',
              label: 'نشانی (URL)',
              type: 'text',
              required: true,
              admin: {
                description: 'بهتر است URL کامل (Absolute) وارد شود.',
              },
            },
          ],
        },
      ],
    },
  ],
}
