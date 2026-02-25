import type { CollectionConfig } from 'payload'

import { layoutBlocks } from '../../../shared/blocks'
import { publishFields, seoFields, slugField } from '../../../shared/fields'
import { adminOrEditor, publicRead } from '../../../shared/access'
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
    singular: 'محصول',
    plural: 'محصولات',
  },
  admin: {
    group: 'فروشگاه',
    useAsTitle: 'title',
    description: 'محصولات عمومی برای پروژه‌های فروشگاهی.',
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
      name: 'sku',
      label: 'کد کالا (SKU)',
      type: 'text',
      admin: {
        description: 'اختیاری. شناسهٔ داخلی برای سیستم‌های فروش/انبارداری.',
      },
    },
    {
      name: 'shortDescription',
      label: 'توضیح کوتاه',
      type: 'textarea',
      admin: {
        description: 'اختیاری. برای کارت محصول، لیست‌ها و پیش‌نمایش‌ها.',
      },
    },
    {
      type: 'collapsible',
      label: 'رسانه',
      admin: {
        initCollapsed: false,
        description: 'تصاویر محصول برای لیست‌ها و صفحهٔ جزئیات.',
      },
      fields: [
        {
          name: 'featuredImage',
          label: 'تصویر شاخص',
          type: 'relationship',
          relationTo: 'media',
          admin: {
            description: 'اختیاری. تصویر اصلی برای لیست‌ها و پیش‌نمایش اجتماعی.',
          },
        },
        {
          name: 'gallery',
          label: 'گالری',
          type: 'relationship',
          relationTo: 'media',
          hasMany: true,
          admin: {
            description: 'اختیاری. تصاویر بیشتر برای محصول.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'قیمت‌گذاری',
      admin: {
        initCollapsed: false,
        description: 'فیلدهای قیمت (MVP). مدیریت واحد پول در سطح یکپارچه‌سازی/فرانت‌اند انجام می‌شود.',
      },
      fields: [
        {
          name: 'basePrice',
          label: 'قیمت پایه',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            placeholder: '0',
          },
        },
        {
          name: 'salePrice',
          label: 'قیمت فروش',
          type: 'number',
          min: 0,
          validate: (
            value: number | null | undefined,
            { data }: { data?: { basePrice?: unknown } },
          ) => {
            if (value === null || typeof value === 'undefined') return true
            const base = data?.basePrice
            if (typeof base === 'number' && value > base) {
              return 'salePrice must be less than or equal to basePrice'
            }
            return true
          },
          admin: {
            description: 'اختیاری. باید کمتر یا مساوی قیمت پایه باشد.',
            placeholder: '0',
          },
        },
      ],
    },
    {
      name: 'productCategories',
      label: 'دسته‌بندی‌های محصول',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      admin: {
        description: 'اختیاری. برای فیلتر کردن و ناوبری.',
      },
    },
    {
      name: 'attributes',
      label: 'ویژگی‌ها',
      type: 'array',
      admin: {
        description: 'اختیاری. ویژگی‌های کلید/مقدار (مثلاً جنس: پنبه، سایز: بزرگ).',
      },
      fields: [
        {
          name: 'name',
          label: 'نام',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          label: 'مقدار',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'تنوع‌ها',
      admin: {
        initCollapsed: true,
        description:
          'تنوع‌ها (MVP). ساده نگه دارید؛ در صورت نیاز، مدل‌های پیشرفته‌تر بعداً اضافه می‌شوند.',
      },
      fields: [
        {
          name: 'variants',
          label: 'تنوع‌ها',
          type: 'array',
          fields: [
            {
              name: 'sku',
              label: 'کد کالا (SKU)',
              type: 'text',
              admin: {
                description: 'اختیاری. کد کالا برای این تنوع.',
              },
            },
            {
              name: 'price',
              label: 'قیمت',
              type: 'number',
              required: true,
              min: 0,
            },
            {
              name: 'stock',
              label: 'موجودی',
              type: 'number',
              min: 0,
              admin: {
                description: 'اختیاری. TODO: در آینده با ماژول موجودی/انبار جایگزین شود.',
              },
            },
            {
              name: 'attributesSummary',
              label: 'خلاصه ویژگی‌ها',
              type: 'text',
              admin: {
                description: 'اختیاری. مثال: «سایز: M / رنگ: مشکی».',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'faq',
      label: 'پرسش‌های متداول',
      type: 'array',
      admin: {
        description: 'اختیاری. پرسش‌های مربوط به همین محصول.',
      },
      fields: [
        {
          name: 'question',
          label: 'پرسش',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          label: 'پاسخ',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'layout',
      label: 'چیدمان',
      type: 'blocks',
      blocks: layoutBlocks,
      admin: {
        description: 'چیدمان صفحهٔ محصول با بلوک‌های قابل استفادهٔ مجدد ساخته می‌شود.',
      },
    },
    seoFields(),
    ...publishFields(),
  ],
}
