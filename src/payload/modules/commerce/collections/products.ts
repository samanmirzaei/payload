import type { CollectionConfig } from 'payload'

import { layoutBlocks } from '../../../shared/blocks'
import { adminOrEditor, publicRead } from '../../../shared/access'
import { publishFields, seoFields, slugField } from '../../../shared/fields'
import { adminText, tr } from '../../../shared/i18n'
import { ensurePublishedAt, generateSlugHook } from '../../../shared/hooks'

/**
 * Products (MVP).
 *
 * TODO (future):
 * - Add inventory/order system (separate module) rather than baking assumptions into Products.
 * - Consider migrating SEO image URL placeholders to Media relationships if desired.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: adminText.collections.products.singular,
    plural: adminText.collections.products.plural,
  },
  admin: {
    group: adminText.groups.store,
    useAsTitle: 'title',
    description: tr('Generic products collection for ecommerce projects.', 'محصولات عمومی برای پروژه‌های فروشگاهی.'),
    components: {
      views: {
        edit: {
          default: {
            actions: ['./src/payload/admin/components/DocURLActions'],
          },
        },
      },
    },
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
      name: 'sku',
      label: tr('SKU', 'کد کالا (SKU)'),
      type: 'text',
      admin: {
        description: tr(
          'Optional internal identifier used by your commerce/inventory systems.',
          'اختیاری. شناسهٔ داخلی برای سیستم‌های فروش/انبارداری.',
        ),
      },
    },
    {
      name: 'shortDescription',
      label: tr('Short Description', 'توضیح کوتاه'),
      type: 'textarea',
      admin: {
        description: tr(
          'Optional. Used for product cards, listings, and previews.',
          'اختیاری. برای کارت محصول، لیست‌ها و پیش‌نمایش‌ها.',
        ),
      },
    },
    {
      type: 'collapsible',
      label: tr('Media', 'رسانه'),
      admin: {
        initCollapsed: false,
        description: tr(
          'Product images used for listings and detail pages.',
          'تصاویر محصول برای لیست‌ها و صفحهٔ جزئیات.',
        ),
      },
      fields: [
        {
          name: 'featuredImage',
          label: tr('Featured Image', 'تصویر شاخص'),
          type: 'relationship',
          relationTo: 'media',
          admin: {
            description: tr(
              'Optional. Primary image used for listings and social previews.',
              'اختیاری. تصویر اصلی برای لیست‌ها و پیش‌نمایش اجتماعی.',
            ),
          },
        },
        {
          name: 'gallery',
          label: tr('Gallery', 'گالری'),
          type: 'relationship',
          relationTo: 'media',
          hasMany: true,
          admin: {
            description: tr('Optional. Additional product images.', 'اختیاری. تصاویر بیشتر برای محصول.'),
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: tr('Pricing', 'قیمت‌گذاری'),
      admin: {
        initCollapsed: false,
        description: tr(
          'Pricing fields (MVP). Currency handling is done by the frontend/integration.',
          'فیلدهای قیمت (MVP). مدیریت واحد پول در سطح یکپارچه‌سازی/فرانت‌اند انجام می‌شود.',
        ),
      },
      fields: [
        {
          name: 'basePrice',
          label: tr('Base Price', 'قیمت پایه'),
          type: 'number',
          required: true,
          min: 0,
          admin: {
            placeholder: tr('0', '۰'),
          },
        },
        {
          name: 'salePrice',
          label: tr('Sale Price', 'قیمت فروش'),
          type: 'number',
          min: 0,
          validate: (
            value: number | null | undefined,
            { data, req }: { data?: { basePrice?: unknown }; req?: { i18n?: { language?: string } } },
          ) => {
            if (value === null || typeof value === 'undefined') return true
            const base = data?.basePrice
            if (typeof base === 'number' && value > base) {
              const lang = req?.i18n?.language
              return lang === 'fa'
                ? 'قیمت فروش باید کمتر یا مساوی قیمت پایه باشد'
                : 'salePrice must be less than or equal to basePrice'
            }
            return true
          },
          admin: {
            description: tr(
              'Optional. Must be less than or equal to Base Price.',
              'اختیاری. باید کمتر یا مساوی قیمت پایه باشد.',
            ),
            placeholder: tr('0', '۰'),
          },
        },
      ],
    },
    {
      name: 'productCategories',
      label: adminText.collections.productCategories.plural,
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      admin: {
        description: tr('Optional. Useful for filtering and navigation.', 'اختیاری. برای فیلترکردن و ناوبری.'),
      },
    },
    {
      name: 'attributes',
      label: tr('Attributes', 'ویژگی‌ها'),
      type: 'array',
      admin: {
        description: tr(
          'Optional. Key/value attributes (e.g. Material: Cotton, Size: Large).',
          'اختیاری. ویژگی‌های کلید/مقدار (مثلاً جنس: پنبه، سایز: بزرگ).',
        ),
      },
      fields: [
        {
          name: 'name',
          label: tr('Name', 'نام'),
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          label: tr('Value', 'مقدار'),
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: tr('Variants', 'تنوع‌ها'),
      admin: {
        initCollapsed: true,
        description: tr(
          'Variants (MVP). Keep it simple; extend later as needed.',
          'تنوع‌ها (MVP). ساده نگه دارید؛ در صورت نیاز بعداً توسعه دهید.',
        ),
      },
      fields: [
        {
          name: 'variants',
          label: tr('Variants', 'تنوع‌ها'),
          type: 'array',
          fields: [
            {
              name: 'sku',
              label: tr('SKU', 'کد کالا (SKU)'),
              type: 'text',
              admin: {
                description: tr('Optional SKU for this variant.', 'اختیاری. کد کالا برای این تنوع.'),
              },
            },
            {
              name: 'price',
              label: tr('Price', 'قیمت'),
              type: 'number',
              required: true,
              min: 0,
            },
            {
              name: 'stock',
              label: tr('Stock', 'موجودی'),
              type: 'number',
              min: 0,
              validate: (
                value: number | null | undefined,
                { req }: { req?: { i18n?: { language?: string } } },
              ) => {
                if (value === null || typeof value === 'undefined') return true
                if (typeof value === 'number' && value < 0) {
                  const lang = req?.i18n?.language
                  return lang === 'fa' ? 'موجودی نمی‌تواند منفی باشد' : 'stock cannot be negative'
                }
                return true
              },
              admin: {
                description: tr(
                  'Optional. TODO: replace with an inventory module later.',
                  'اختیاری. TODO: در آینده با ماژول موجودی/انبار جایگزین شود.',
                ),
              },
            },
            {
              name: 'attributesSummary',
              label: tr('Attributes Summary', 'خلاصه ویژگی‌ها'),
              type: 'text',
              admin: {
                description: tr('Optional summary (e.g. “Size: M / Color: Black”).', 'اختیاری. مثال: «سایز: M / رنگ: مشکی».'),
              },
            },
          ],
        },
      ],
    },
    {
      name: 'faq',
      label: tr('FAQ', 'پرسش‌های متداول'),
      type: 'array',
      admin: {
        description: tr('Optional. Product-specific questions and answers.', 'اختیاری. پرسش‌های مرتبط با همین محصول.'),
      },
      fields: [
        {
          name: 'question',
          label: tr('Question', 'پرسش'),
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          label: tr('Answer', 'پاسخ'),
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'layout',
      label: adminText.fields.layout,
      type: 'blocks',
      blocks: layoutBlocks,
      admin: {
        description: tr(
          'Build the product page layout using reusable blocks.',
          'چیدمان صفحهٔ محصول را با بلوک‌های قابل استفادهٔ مجدد بسازید.',
        ),
      },
    },
    seoFields(),
    ...publishFields(),
  ],
}
