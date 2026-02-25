import type { Field } from 'payload'

export type SeoFieldOptions = {
  /**
   * Customize the group name to avoid collisions.
   */
  name?: string
  label?: string
  /**
   * If true, places the SEO group in the admin sidebar.
   * Defaults to true for editor usability.
   */
  sidebar?: boolean
}

/**
 * SEO-first: generic, reusable meta fields that can be composed into any collection/global.
 * Avoids business assumptions (no hardcoded site name, brand tone, etc.).
 */
export const seoFields = (options: SeoFieldOptions = {}): Field => {
  const groupName = options.name ?? 'seo'
  const sidebar = options.sidebar ?? true

  return {
    name: groupName,
    label: options.label ?? 'سئو',
    type: 'group',
    admin: sidebar ? { position: 'sidebar' } : undefined,
    fields: [
      {
        name: 'metaTitle',
        label: 'عنوان متا',
        type: 'text',
        admin: {
          description: 'پیشنهاد: حداکثر ۶۰ کاراکتر. برای عنوان صفحه و نتایج جستجو استفاده می‌شود.',
        },
      },
      {
        name: 'metaDescription',
        label: 'توضیحات متا',
        type: 'textarea',
        admin: {
          description: 'پیشنهاد: حداکثر ۱۶۰ کاراکتر. برای خلاصهٔ نتایج جستجو استفاده می‌شود.',
        },
      },
      {
        name: 'canonicalUrl',
        label: 'نشانی Canonical',
        type: 'text',
        admin: {
          description: 'در صورت تنظیم، ترجیحاً URL کامل وارد شود (مثلاً https://example.com/path).',
        },
      },
      {
        name: 'noIndex',
        label: 'عدم ایندکس (noindex)',
        type: 'checkbox',
        defaultValue: false,
        admin: {
          description: 'اگر فعال باشد، فرانت‌اند باید meta robots با مقدار noindex رندر کند.',
        },
      },
      {
        name: 'noFollow',
        label: 'عدم دنبال‌کردن (nofollow)',
        type: 'checkbox',
        defaultValue: false,
        admin: {
          description: 'اگر فعال باشد، فرانت‌اند باید meta robots با مقدار nofollow رندر کند.',
        },
      },
      {
        name: 'openGraph',
        label: 'اوپن‌گراف (Open Graph)',
        type: 'group',
        fields: [
          {
            name: 'title',
            label: 'عنوان',
            type: 'text',
            admin: {
              description: 'اگر خالی باشد، فرانت‌اند می‌تواند از عنوان متا استفاده کند.',
            },
          },
          {
            name: 'description',
            label: 'توضیحات',
            type: 'textarea',
            admin: {
              description: 'اگر خالی باشد، فرانت‌اند می‌تواند از توضیحات متا استفاده کند.',
            },
          },
          /**
           * TODO (later): switch to a relationship to a shared `media` upload collection.
           * Keeping this as a URL avoids coupling Step 1 to any storage implementation.
           */
          {
            name: 'imageUrl',
            label: 'نشانی تصویر',
            type: 'text',
            admin: {
              description:
                'موقت: رشتهٔ URL. (TODO: بعداً به رابطه با Media تبدیل شود.)',
            },
          },
        ],
      },
      {
        name: 'twitter',
        label: 'توییتر (X)',
        type: 'group',
        fields: [
          {
            name: 'title',
            label: 'عنوان',
            type: 'text',
            admin: {
              description: 'اگر خالی باشد، فرانت‌اند می‌تواند از عنوان متا استفاده کند.',
            },
          },
          {
            name: 'description',
            label: 'توضیحات',
            type: 'textarea',
            admin: {
              description: 'اگر خالی باشد، فرانت‌اند می‌تواند از توضیحات متا استفاده کند.',
            },
          },
          {
            name: 'card',
            label: 'نوع کارت',
            type: 'select',
            defaultValue: 'summary_large_image',
            options: [
              { label: 'خلاصه', value: 'summary' },
              { label: 'خلاصه با تصویر بزرگ', value: 'summary_large_image' },
            ],
          },
          /**
           * TODO (later): switch to a relationship to a shared `media` upload collection.
           */
          {
            name: 'imageUrl',
            label: 'نشانی تصویر',
            type: 'text',
            admin: {
              description:
                'موقت: رشتهٔ URL. (TODO: بعداً به رابطه با Media تبدیل شود.)',
            },
          },
        ],
      },
    ],
  }
}
