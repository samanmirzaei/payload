import type { CollectionConfig } from 'payload'

import path from 'node:path'

import { adminOrEditor, publicRead } from '../../../shared/access'

/**
 * Media upload collection (images/files).
 *
 * Note: Storage stays on Payload defaults for now.
 * TODO (future): configure cloud storage and/or image processing as needed per project.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'رسانه',
    plural: 'رسانه‌ها',
  },
  admin: {
    useAsTitle: 'alt',
    description: 'فایل‌ها و تصاویر بارگذاری‌شده که در بخش‌های مختلف محتوا استفاده می‌شوند.',
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
      label: 'متن جایگزین (Alt)',
      type: 'text',
      required: true,
      admin: {
        description: 'برای دسترس‌پذیری و سئو ضروری است. محتوای تصویر را توصیف کنید.',
      },
    },
    {
      name: 'caption',
      label: 'زیرنویس',
      type: 'textarea',
      admin: {
        description: 'اختیاری. در برخی چیدمان‌ها کنار تصویر نمایش داده می‌شود.',
      },
    },
    {
      name: 'source',
      label: 'منبع',
      type: 'text',
      admin: {
        description: 'اختیاری. منبع تهیهٔ این فایل (وب‌سایت، نشریه و ...).',
      },
    },
    {
      name: 'credit',
      label: 'اعتبار/کِرِدیت',
      type: 'text',
      admin: {
        description: 'اختیاری. نام عکاس/سازنده برای نیازهای حقوقی یا تحریریه.',
      },
    },
  ],
}
