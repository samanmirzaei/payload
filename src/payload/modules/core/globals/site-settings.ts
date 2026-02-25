import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'

/**
 * Site-wide settings used across any frontend (corporate or ecommerce).
 * Keep this strictly business-agnostic and broadly reusable.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'تنظیمات سایت',
  admin: {
    group: 'تنظیمات',
    description: 'اطلاعات کلی هویت سایت و راه‌های ارتباطی که در فرانت‌اندها استفاده می‌شود.',
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'siteName',
      label: 'نام سایت',
      type: 'text',
      required: true,
      admin: {
        description: 'در بخش‌های مختلف نمایش داده می‌شود (مثل سربرگ، پابرگ و پیش‌فرض‌های متادیتا).',
      },
    },
    {
      name: 'siteUrl',
      label: 'نشانی سایت (URL)',
      type: 'text',
      admin: {
        description:
          'نشانی پایه/کانونیکال (مثلاً https://example.com). TODO: اعتبارسنجی URL در مرحله‌ای بعد اضافه شود.',
      },
    },
    {
      name: 'defaultLanguage',
      label: 'زبان پیش‌فرض',
      type: 'text',
      admin: {
        description: 'بهتر است از برچسب زبان BCP 47 استفاده شود (مثل fa، fa-IR، en-US).',
      },
    },
    {
      name: 'contactEmail',
      label: 'ایمیل تماس',
      type: 'email',
      admin: {
        description: 'اختیاری. برای لینک‌های تماس یا پیش‌فرض‌های ایمیل در سطح سایت استفاده می‌شود.',
      },
    },
    {
      name: 'contactPhone',
      label: 'تلفن تماس',
      type: 'text',
      admin: {
        description:
          'اختیاری. به‌صورت متن قابل‌نمایش ذخیره کنید (در صورت نیاز، فرانت‌اند می‌تواند نرمال‌سازی انجام دهد).',
      },
    },
    {
      name: 'socialLinks',
      label: 'لینک‌های شبکه‌های اجتماعی',
      type: 'array',
      admin: {
        description: 'برای نمایش آیکون/لینک شبکه‌های اجتماعی در سطح سایت استفاده می‌شود.',
      },
      fields: [
        {
          name: 'label',
          label: 'عنوان',
          type: 'text',
          required: true,
          admin: {
            description: 'مثال: LinkedIn، X، Instagram، GitHub.',
          },
        },
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
}
