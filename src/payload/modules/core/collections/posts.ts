import type { CollectionConfig } from 'payload'

import { publishFields, seoFields, slugField } from '../../../shared/fields'
import { layoutBlocks } from '../../../shared/blocks'
import { adminOrEditor, publicRead } from '../../../shared/access'
import { ensurePublishedAt, generateSlugHook } from '../../../shared/hooks'

/**
 * Generic posts collection (blog/news).
 *
 * TODO (future): expand available blocks as needed (keep them shared/generic).
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'نوشته',
    plural: 'نوشته‌ها',
  },
  admin: {
    useAsTitle: 'title',
    description: 'نوشته‌های قابل استفادهٔ مجدد برای وبلاگ، خبر و محتوای تحریریه.',
  },
  access: {
    read: publicRead,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    beforeValidate: [generateSlugHook()],
    beforeChange: [ensurePublishedAt()],
  },
  fields: [
    {
      name: 'title',
      label: 'عنوان',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'excerpt',
      label: 'خلاصه',
      type: 'textarea',
      admin: {
        description: 'اختیاری. خلاصهٔ کوتاه برای کارت‌ها، فیدها و پیش‌نمایش‌ها.',
      },
    },
    {
      name: 'featuredImage',
      label: 'تصویر شاخص',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description:
          'اختیاری. برای پیش‌نمایش و اشتراک‌گذاری اجتماعی استفاده می‌شود. (TODO: در صورت نیاز با Media برای سئو هم‌راستا شود.)',
      },
    },
    {
      name: 'layout',
      label: 'محتوا / چیدمان',
      type: 'blocks',
      blocks: layoutBlocks,
      admin: {
        description: 'محتوای نوشته با بلوک‌های قابل استفادهٔ مجدد ساخته می‌شود.',
      },
    },
    {
      name: 'categories',
      label: 'دسته‌بندی‌ها',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        description: 'اختیاری. برای دسته‌بندی و فیلتر کردن.',
      },
    },
    seoFields(),
    ...publishFields(),
  ],
}
