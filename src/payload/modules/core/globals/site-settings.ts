import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'
import { adminText, tr } from '../../../shared/i18n'

/**
 * Site-wide settings used across any frontend (corporate or ecommerce).
 * Keep this strictly business-agnostic and broadly reusable.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: adminText.globals.siteSettings,
  admin: {
    group: adminText.groups.settings,
    description: tr(
      'General site identity and contact details used across frontends.',
      'اطلاعات کلی هویت سایت و راه‌های ارتباطی که در فرانت‌اندها استفاده می‌شود.',
    ),
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'siteName',
      label: tr('Site Name', 'نام سایت'),
      type: 'text',
      required: true,
      admin: {
        description: tr(
          'Displayed in various places (e.g. header, footer, metadata defaults).',
          'در بخش‌های مختلف نمایش داده می‌شود (مثل سربرگ، پابرگ و پیش‌فرض‌های متادیتا).',
        ),
      },
    },
    {
      name: 'siteUrl',
      label: tr('Site URL', 'نشانی سایت (URL)'),
      type: 'text',
      admin: {
        description: tr(
          'Canonical base URL (e.g. https://example.com). TODO: add URL validation later.',
          'نشانی پایه/کانونیکال (مثلاً https://example.com). TODO: اعتبارسنجی URL در مرحله‌ای بعد اضافه شود.',
        ),
        placeholder: tr('https://example.com', 'https://example.com'),
      },
    },
    {
      name: 'defaultLanguage',
      label: tr('Default Language', 'زبان پیش‌فرض'),
      type: 'text',
      admin: {
        description: tr(
          'BCP 47 language tag recommended (e.g. fa, fa-IR, en-US).',
          'بهتر است از برچسب زبان BCP 47 استفاده شود (مثل fa، fa-IR، en-US).',
        ),
        placeholder: tr('fa', 'fa'),
      },
    },
    {
      name: 'contactEmail',
      label: tr('Contact Email', 'ایمیل تماس'),
      type: 'email',
      admin: {
        description: tr(
          'Optional. Used for site-wide contact links or email defaults.',
          'اختیاری. برای لینک‌های تماس یا پیش‌فرض‌های ایمیل در سطح سایت استفاده می‌شود.',
        ),
      },
    },
    {
      name: 'contactPhone',
      label: tr('Contact Phone', 'تلفن تماس'),
      type: 'text',
      admin: {
        description: tr(
          'Optional. Store as display-friendly text (frontends can normalize if needed).',
          'اختیاری. به‌صورت متن قابل‌نمایش ذخیره کنید (در صورت نیاز، فرانت‌اند می‌تواند نرمال‌سازی انجام دهد).',
        ),
      },
    },
    {
      name: 'socialLinks',
      label: tr('Social Links', 'لینک‌های شبکه‌های اجتماعی'),
      type: 'array',
      admin: {
        description: tr('Used for site-wide social icons/links.', 'برای نمایش لینک شبکه‌های اجتماعی در سطح سایت.'),
      },
      fields: [
        {
          name: 'label',
          label: tr('Label', 'عنوان'),
          type: 'text',
          required: true,
          admin: {
            description: tr('Example: LinkedIn, X, Instagram, GitHub.', 'مثال: LinkedIn، X، Instagram، GitHub.'),
          },
        },
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
}
