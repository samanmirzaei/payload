import type { CollectionConfig } from 'payload'

import { layoutBlocks } from '../../../shared/blocks'
import { adminOrEditor, publicRead } from '../../../shared/access'
import { publishFields, seoFields, slugField } from '../../../shared/fields'
import { adminText, tr } from '../../../shared/i18n'
import { ensurePublishedAt, generateSlugHook } from '../../../shared/hooks'

/**
 * Generic posts collection (blog/news).
 *
 * TODO (future): expand available blocks as needed (keep them shared/generic).
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: adminText.collections.posts.singular,
    plural: adminText.collections.posts.plural,
  },
  admin: {
    group: adminText.groups.content,
    useAsTitle: 'title',
    description: tr(
      'Reusable posts for blogs, news, and editorial content.',
      'نوشته‌های قابل استفادهٔ مجدد برای وبلاگ، خبر و محتوای تحریریه.',
    ),
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
      label: adminText.fields.title,
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'excerpt',
      label: tr('Excerpt', 'خلاصه'),
      type: 'textarea',
      admin: {
        description: tr(
          'Optional. Used for cards, listings, and previews.',
          'اختیاری. خلاصهٔ کوتاه برای کارت‌ها، فیدها و پیش‌نمایش‌ها.',
        ),
      },
    },
    {
      name: 'featuredImage',
      label: tr('Featured Image', 'تصویر شاخص'),
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: tr(
          'Optional. Used for previews and social sharing.',
          'اختیاری. برای پیش‌نمایش و اشتراک‌گذاری اجتماعی استفاده می‌شود.',
        ),
      },
    },
    {
      name: 'layout',
      label: adminText.fields.contentLayout,
      type: 'blocks',
      blocks: layoutBlocks,
      admin: {
        description: tr(
          'Build the post content using reusable blocks.',
          'محتوای نوشته را با بلوک‌های قابل استفادهٔ مجدد بسازید.',
        ),
      },
    },
    {
      name: 'categories',
      label: adminText.collections.categories.plural,
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        description: tr('Optional. Useful for taxonomy and filtering.', 'اختیاری. برای دسته‌بندی و فیلترکردن.'),
      },
    },
    seoFields(),
    ...publishFields(),
  ],
}

