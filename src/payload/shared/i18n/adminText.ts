import { tr } from './tr'

export const adminText = {
  groups: {
    content: tr('Content', 'محتوا'),
    store: tr('Store', 'فروشگاه'),
    media: tr('Media', 'رسانه‌ها'),
    users: tr('Users', 'کاربران'),
    settings: tr('Settings', 'تنظیمات'),
  },

  collections: {
    pages: {
      singular: tr('Page', 'صفحه'),
      plural: tr('Pages', 'صفحه‌ها'),
    },
    posts: {
      singular: tr('Post', 'نوشته'),
      plural: tr('Posts', 'نوشته‌ها'),
    },
    categories: {
      singular: tr('Category', 'دسته‌بندی'),
      plural: tr('Categories', 'دسته‌بندی‌ها'),
    },
    media: {
      singular: tr('Media', 'رسانه'),
      plural: tr('Media', 'رسانه‌ها'),
    },
    users: {
      singular: tr('User', 'کاربر'),
      plural: tr('Users', 'کاربران'),
    },
    products: {
      singular: tr('Product', 'محصول'),
      plural: tr('Products', 'محصولات'),
    },
    productCategories: {
      singular: tr('Product Category', 'دسته‌بندی محصول'),
      plural: tr('Product Categories', 'دسته‌بندی‌های محصول'),
    },
    orders: {
      singular: tr('Order', 'سفارش'),
      plural: tr('Orders', 'سفارش‌ها'),
    },
  },

  globals: {
    siteSettings: tr('Site Settings', 'تنظیمات سایت'),
    seoDefaults: tr('SEO Defaults', 'پیش‌فرض‌های سئو'),
    header: tr('Header', 'سربرگ'),
    footer: tr('Footer', 'پابرگ'),
  },

  fields: {
    title: tr('Title', 'عنوان'),
    slug: tr('Slug', 'نامک (Slug)'),
    description: tr('Description', 'توضیحات'),
    layout: tr('Layout', 'چیدمان'),
    contentLayout: tr('Content / Layout', 'محتوا / چیدمان'),
    seo: tr('SEO', 'سئو'),
    status: tr('Status', 'وضعیت'),
    publishedAt: tr('Published At', 'تاریخ انتشار'),
  },

  blocks: {
    hero: {
      singular: tr('Hero', 'بنر اصلی'),
      plural: tr('Heroes', 'بنرهای اصلی'),
    },
    richText: {
      singular: tr('Rich Text', 'متن'),
      plural: tr('Rich Text Blocks', 'بلوک‌های متن'),
    },
    faq: {
      singular: tr('FAQ', 'سوالات متداول'),
      plural: tr('FAQs', 'بلوک‌های سوالات متداول'),
    },
    cta: {
      singular: tr('CTA', 'فراخوان به اقدام (CTA)'),
      plural: tr('CTAs', 'بلوک‌های CTA'),
    },
    gallery: {
      singular: tr('Gallery', 'گالری'),
      plural: tr('Galleries', 'گالری‌ها'),
    },
  },
} as const
