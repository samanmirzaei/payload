import type { Block } from 'payload'

import { adminText, tr } from '../../i18n'

/**
 * MVP hero block.
 *
 * Note: This block relates to `media` for background images. This starter's core module
 * includes a `media` upload collection, so keeping this relationship improves editor UX.
 */
export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: adminText.blocks.hero.singular,
    plural: adminText.blocks.hero.plural,
  },
  fields: [
    {
      name: 'headline',
      label: tr('Headline', 'تیتر'),
      type: 'text',
      required: true,
    },
    {
      name: 'subheadline',
      label: tr('Subheadline', 'زیرتیتر'),
      type: 'textarea',
    },
    {
      name: 'primaryButton',
      label: tr('Primary Button', 'دکمه اصلی'),
      type: 'group',
      admin: {
        description: tr(
          'Optional. If provided, frontends should render a primary CTA button.',
          'اختیاری. اگر پر شود، فرانت‌اند باید یک دکمه CTA اصلی نمایش دهد.',
        ),
      },
      fields: [
        {
          name: 'label',
          label: tr('Label', 'متن دکمه'),
          type: 'text',
        },
        {
          name: 'href',
          label: tr('Href', 'لینک (Href)'),
          type: 'text',
          admin: {
            description: tr('Relative (e.g. /contact) or absolute URL.', 'می‌تواند نسبی باشد (مثل /contact) یا URL کامل.'),
          },
        },
      ],
    },
    {
      name: 'secondaryButton',
      label: tr('Secondary Button', 'دکمه دوم'),
      type: 'group',
      admin: {
        description: tr(
          'Optional. If provided, frontends should render a secondary CTA button.',
          'اختیاری. اگر پر شود، فرانت‌اند باید یک دکمه CTA ثانویه نمایش دهد.',
        ),
      },
      fields: [
        {
          name: 'label',
          label: tr('Label', 'متن دکمه'),
          type: 'text',
        },
        {
          name: 'href',
          label: tr('Href', 'لینک (Href)'),
          type: 'text',
          admin: {
            description: tr(
              'Relative (e.g. /learn-more) or absolute URL.',
              'می‌تواند نسبی باشد (مثل /learn-more) یا URL کامل.',
            ),
          },
        },
      ],
    },
    {
      name: 'backgroundImage',
      label: tr('Background Image', 'تصویر پس‌زمینه'),
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: tr('Optional. Background/cover image for the hero.', 'اختیاری. تصویر پس‌زمینه/کاور برای این بنر.'),
      },
    },
  ],
}

