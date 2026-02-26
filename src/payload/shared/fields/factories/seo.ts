import type { Field } from 'payload'

import { adminText, tr } from '../../i18n'

export type SeoFieldOptions = {
  /**
   * Customize the group name to avoid collisions.
   */
  name?: string
  label?: string | Record<string, string>
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
    label: options.label ?? adminText.fields.seo,
    type: 'group',
    admin: sidebar ? { position: 'sidebar' } : undefined,
    fields: [
      {
        name: 'metaTitle',
        label: tr('Meta Title', 'عنوان متا'),
        type: 'text',
        admin: {
          description: tr(
            'Suggested: up to 60 characters. Used for page titles and search results.',
            'پیشنهاد: حداکثر ۶۰ کاراکتر. برای عنوان صفحه و نتایج جستجو استفاده می‌شود.',
          ),
        },
      },
      {
        name: 'metaDescription',
        label: tr('Meta Description', 'توضیحات متا'),
        type: 'textarea',
        admin: {
          description: tr(
            'Suggested: up to 155 characters. Used for search result snippets.',
            'پیشنهاد: حداکثر ۱۵۵ کاراکتر. برای خلاصهٔ نتایج جستجو استفاده می‌شود.',
          ),
        },
      },
      {
        name: 'canonicalUrl',
        label: tr('Canonical URL', 'نشانی Canonical'),
        type: 'text',
        admin: {
          description: tr(
            'If set, use an absolute URL (e.g. https://example.com/path).',
            'در صورت تنظیم، ترجیحاً URL کامل وارد شود (مثلاً https://example.com/path).',
          ),
        },
      },
      {
        name: 'noIndex',
        label: tr('No Index (noindex)', 'عدم ایندکس (noindex)'),
        type: 'checkbox',
        defaultValue: false,
        admin: {
          description: tr(
            'If enabled, frontends should render robots meta with noindex.',
            'اگر فعال باشد، فرانت‌اند باید meta robots با مقدار noindex رندر کند.',
          ),
        },
      },
      {
        name: 'noFollow',
        label: tr('No Follow (nofollow)', 'عدم دنبال‌کردن (nofollow)'),
        type: 'checkbox',
        defaultValue: false,
        admin: {
          description: tr(
            'If enabled, frontends should render robots meta with nofollow.',
            'اگر فعال باشد، فرانت‌اند باید meta robots با مقدار nofollow رندر کند.',
          ),
        },
      },
      {
        name: 'openGraph',
        label: tr('Open Graph', 'اوپن‌گراف (Open Graph)'),
        type: 'group',
        fields: [
          {
            name: 'title',
            label: adminText.fields.title,
            type: 'text',
            admin: {
              description: tr(
                'If empty, frontends can fall back to Meta Title.',
                'اگر خالی باشد، فرانت‌اند می‌تواند از عنوان متا استفاده کند.',
              ),
            },
          },
          {
            name: 'description',
            label: adminText.fields.description,
            type: 'textarea',
            admin: {
              description: tr(
                'If empty, frontends can fall back to Meta Description.',
                'اگر خالی باشد، فرانت‌اند می‌تواند از توضیحات متا استفاده کند.',
              ),
            },
          },
          /**
           * TODO (later): switch to a relationship to a shared `media` upload collection.
           * Keeping this as a URL avoids coupling early steps to any storage implementation.
           */
          {
            name: 'imageUrl',
            label: tr('Image URL', 'نشانی تصویر'),
            type: 'text',
            admin: {
              description: tr(
                'Temporary: URL string. (TODO: switch to Media relationship later.)',
                'موقت: رشتهٔ URL. (TODO: بعدها به رابطه با Media تبدیل شود.)',
              ),
            },
          },
        ],
      },
      {
        name: 'twitter',
        label: tr('Twitter (X)', 'توییتر (X)'),
        type: 'group',
        fields: [
          {
            name: 'title',
            label: adminText.fields.title,
            type: 'text',
            admin: {
              description: tr(
                'If empty, frontends can fall back to Meta Title.',
                'اگر خالی باشد، فرانت‌اند می‌تواند از عنوان متا استفاده کند.',
              ),
            },
          },
          {
            name: 'description',
            label: adminText.fields.description,
            type: 'textarea',
            admin: {
              description: tr(
                'If empty, frontends can fall back to Meta Description.',
                'اگر خالی باشد، فرانت‌اند می‌تواند از توضیحات متا استفاده کند.',
              ),
            },
          },
          {
            name: 'card',
            label: tr('Card Type', 'نوع کارت'),
            type: 'select',
            defaultValue: 'summary_large_image',
            options: [
              { label: tr('Summary', 'خلاصه'), value: 'summary' },
              { label: tr('Summary with large image', 'خلاصه با تصویر بزرگ'), value: 'summary_large_image' },
            ],
          },
          /**
           * TODO (later): switch to a relationship to a shared `media` upload collection.
           */
          {
            name: 'imageUrl',
            label: tr('Image URL', 'نشانی تصویر'),
            type: 'text',
            admin: {
              description: tr(
                'Temporary: URL string. (TODO: switch to Media relationship later.)',
                'موقت: رشتهٔ URL. (TODO: بعدها به رابطه با Media تبدیل شود.)',
              ),
            },
          },
        ],
      },
    ],
  }
}

