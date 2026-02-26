import path from 'node:path'

import type { CollectionConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'
import { adminText, tr } from '../../../shared/i18n'

/**
 * Media upload collection (images/files).
 *
 * Note: Storage stays on Payload defaults for now.
 * TODO (future): configure cloud storage and/or image processing as needed per project.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: adminText.collections.media.singular,
    plural: adminText.collections.media.plural,
  },
  admin: {
    group: adminText.groups.media,
    useAsTitle: 'alt',
    description: tr(
      'Uploaded files and images used across content.',
      'فایل‌ها و تصاویر بارگذاری‌شده که در بخش‌های مختلف محتوا استفاده می‌شوند.',
    ),
  },
  access: {
    read: publicRead,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'uploads'),
  },
  fields: [
    {
      name: 'alt',
      label: tr('Alt Text', 'متن جایگزین (Alt)'),
      type: 'text',
      required: true,
      admin: {
        description: tr(
          'Required for accessibility and SEO. Describe what the image shows.',
          'برای دسترس‌پذیری و سئو ضروری است. محتوای تصویر را توصیف کنید.',
        ),
      },
    },
    {
      name: 'caption',
      label: tr('Caption', 'زیرنویس'),
      type: 'textarea',
      admin: {
        description: tr(
          'Optional. Can be displayed alongside the media in some layouts.',
          'اختیاری. در برخی چیدمان‌ها کنار تصویر نمایش داده می‌شود.',
        ),
      },
    },
    {
      name: 'source',
      label: tr('Source', 'منبع'),
      type: 'text',
      admin: {
        description: tr(
          'Optional. Where this asset came from (website, publication, etc.).',
          'اختیاری. منبع تهیهٔ این فایل (وب‌سایت، نشریه و ...).',
        ),
      },
    },
    {
      name: 'credit',
      label: tr('Credit', 'اعتبار/کِرِدیت'),
      type: 'text',
      admin: {
        description: tr(
          'Optional. Photographer/creator name for legal/editorial needs.',
          'اختیاری. نام عکاس/سازنده برای نیازهای حقوقی یا تحریریه.',
        ),
      },
    },
  ],
}

