import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'
import { adminText, tr } from '../../../shared/i18n'

/**
 * Site-wide SEO defaults.
 * This is intentionally distinct from per-page SEO fields (e.g. `seoFields()`), because defaults
 * often include templates and organization/schema data.
 */
export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: adminText.globals.seoDefaults,
  admin: {
    group: adminText.groups.settings,
    description: tr(
      'Fallback SEO values applied by frontends when page-level SEO fields are empty.',
      'مقادیر پیش‌فرض سئو که وقتی سئوی صفحه خالی است، توسط فرانت‌اندها اعمال می‌شود.',
    ),
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'defaultTitle',
      label: tr('Default Title', 'عنوان پیش‌فرض'),
      type: 'text',
      admin: {
        description: tr(
          'Used when a page does not provide a meta title.',
          'وقتی یک صفحه عنوان متا ندارد استفاده می‌شود.',
        ),
      },
    },
    {
      name: 'titleTemplate',
      label: tr('Title Template', 'قالب عنوان'),
      type: 'text',
      admin: {
        description: tr(
          'Example: %s | Brand (where %s is replaced with the page title).',
          'مثال: %s | Brand (جایی که %s با عنوان صفحه جایگزین می‌شود).',
        ),
        placeholder: tr('%s | Brand', '%s | Brand'),
      },
    },
    {
      name: 'defaultMetaDescription',
      label: tr('Default Meta Description', 'توضیح متای پیش‌فرض'),
      type: 'textarea',
      admin: {
        description: tr(
          'Used when a page does not provide a meta description.',
          'وقتی یک صفحه توضیح متا ندارد استفاده می‌شود.',
        ),
      },
    },
    /**
     * TODO (later): switch to a relationship to a shared `media` upload collection.
     * Keeping this as a URL avoids coupling to storage implementation in early steps.
     */
    {
      name: 'defaultOgImageUrl',
      label: tr('Default OG Image URL', 'نشانی تصویر پیش‌فرض OG'),
      type: 'text',
      admin: {
        description: tr(
          'Temporary: URL string. TODO: replace with Media relationship later.',
          'موقت: URL به‌صورت متن. TODO: در آینده با رابطه به Media جایگزین شود.',
        ),
      },
    },
    {
      name: 'robots',
      label: tr('Robots Defaults', 'پیش‌فرض‌های Robots'),
      type: 'group',
      fields: [
        {
          name: 'noIndex',
          label: tr('Default noindex', 'noindex پیش‌فرض'),
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: tr(
              'If enabled, frontends should default to noindex unless overridden per-page.',
              'اگر فعال باشد، پیش‌فرض فرانت‌اندها noindex است مگر اینکه در صفحه بازنویسی شود.',
            ),
          },
        },
        {
          name: 'noFollow',
          label: tr('Default nofollow', 'nofollow پیش‌فرض'),
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: tr(
              'If enabled, frontends should default to nofollow unless overridden per-page.',
              'اگر فعال باشد، پیش‌فرض فرانت‌اندها nofollow است مگر اینکه در صفحه بازنویسی شود.',
            ),
          },
        },
      ],
    },
    {
      name: 'organization',
      label: tr('Organization Schema', 'طرح‌واره سازمان (Schema.org)'),
      type: 'group',
      admin: {
        description: tr(
          'Basic Organization schema fields used by frontends for structured data.',
          'فیلدهای پایه برای داده‌های ساختاریافته (Organization) که در فرانت‌اند استفاده می‌شود.',
        ),
      },
      fields: [
        {
          name: 'name',
          label: tr('Organization Name', 'نام سازمان'),
          type: 'text',
          admin: {
            description: tr(
              'Often matches Site Settings → Site Name.',
              'اغلب با «تنظیمات سایت → نام سایت» یکسان است.',
            ),
          },
        },
        /**
         * TODO (later): switch to a relationship to a shared `media` upload collection.
         */
        {
          name: 'logoUrl',
          label: tr('Logo URL', 'نشانی لوگو (URL)'),
          type: 'text',
          admin: {
            description: tr(
              'Temporary: URL string. TODO: replace with Media relationship later.',
              'موقت: URL به‌صورت متن. TODO: در آینده با رابطه به Media جایگزین شود.',
            ),
          },
        },
        {
          name: 'sameAsLinks',
          label: tr('Same As Links', 'لینک‌های SameAs'),
          type: 'array',
          admin: {
            description: tr(
              'URLs for social profiles (used by schema.org Organization.sameAs).',
              'URL پروفایل‌های اجتماعی (برای Organization.sameAs در schema.org).',
            ),
          },
          fields: [
            {
              name: 'url',
              label: tr('URL', 'نشانی (URL)'),
              type: 'text',
              required: true,
              admin: {
                description: tr('Absolute URL recommended.', 'بهتر است URL کامل (Absolute) وارد شود.'),
                placeholder: tr('https://...', 'https://...'),
              },
            },
          ],
        },
      ],
    },
  ],
}

