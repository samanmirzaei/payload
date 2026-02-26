import type { CollectionConfig } from 'payload'

import { adminOrEditor, authenticated } from '../../../shared/access'
import { adminText, tr } from '../../../shared/i18n'

type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'fulfilled'

const generateOrderNumber = (): string => {
  const now = new Date()
  const y = String(now.getUTCFullYear())
  const m = String(now.getUTCMonth() + 1).padStart(2, '0')
  const d = String(now.getUTCDate()).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ORD-${y}${m}${d}-${rand}`
}

const normalizeOrderData = async (args: {
  data: any
  req: any
}): Promise<any> => {
  const { data, req } = args
  if (!data) return data

  if (!data.orderNumber) {
    data.orderNumber = generateOrderNumber()
  }

  const items: any[] = Array.isArray(data.items) ? data.items : []

  // Fill item snapshots (title/unitPrice) when missing.
  for (const item of items) {
    if (!item) continue

    const productID = item.product
    const hasProduct = typeof productID === 'string' || typeof productID === 'number'

    if (hasProduct && (item.titleSnapshot == null || item.unitPrice == null)) {
      try {
        const product = await req?.payload?.findByID?.({
          collection: 'products',
          id: productID,
          depth: 0,
        })

        if (product) {
          if (!item.titleSnapshot && typeof product.title === 'string') {
            item.titleSnapshot = product.title
          }

          if (item.unitPrice == null) {
            const sale = typeof product.salePrice === 'number' ? product.salePrice : undefined
            const base = typeof product.basePrice === 'number' ? product.basePrice : undefined
            const price = typeof sale === 'number' ? sale : base
            if (typeof price === 'number') item.unitPrice = price
          }
        }
      } catch {
        // If lookup fails, leave snapshots as-is (validation may still fail if required).
      }
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const qty = typeof item?.quantity === 'number' ? item.quantity : Number(item?.quantity)
    const unit = typeof item?.unitPrice === 'number' ? item.unitPrice : Number(item?.unitPrice)
    if (!Number.isFinite(qty) || qty <= 0) return sum
    if (!Number.isFinite(unit) || unit < 0) return sum
    return sum + qty * unit
  }, 0)

  data.pricing = {
    ...(data.pricing ?? {}),
    subtotal,
    total: subtotal,
  }

  return data
}

/**
 * Orders (MVP).
 *
 * Notes:
 * - Create access is limited to authenticated users for now (safe default).
 *   TODO: if you need public order creation, add a dedicated endpoint with a shared secret header.
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: adminText.collections.orders.singular,
    plural: adminText.collections.orders.plural,
  },
  admin: {
    group: adminText.groups.store,
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'pricing.total', 'createdAt'],
    description: tr('Orders for ecommerce projects (MVP).', 'سفارش‌ها برای پروژه‌های فروشگاهی (MVP).'),
  },
  access: {
    read: adminOrEditor,
    create: authenticated,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    beforeValidate: [
      async (args) => {
        args.data = await normalizeOrderData({ data: args.data, req: args.req })
        return args.data
      },
    ],
    beforeChange: [
      async (args) => {
        args.data = await normalizeOrderData({ data: args.data, req: args.req })
        return args.data
      },
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      label: tr('Order Number', 'شماره سفارش'),
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: tr('Generated automatically if empty.', 'اگر خالی باشد به‌صورت خودکار تولید می‌شود.'),
      },
    },
    {
      name: 'status',
      label: adminText.fields.status,
      type: 'select',
      required: true,
      defaultValue: 'pending' satisfies OrderStatus,
      options: [
        { label: tr('Pending', 'در انتظار پرداخت'), value: 'pending' },
        { label: tr('Paid', 'پرداخت‌شده'), value: 'paid' },
        { label: tr('Cancelled', 'لغو شده'), value: 'cancelled' },
        { label: tr('Fulfilled', 'ارسال/تحویل‌شده'), value: 'fulfilled' },
      ],
    },
    {
      name: 'customer',
      label: tr('Customer', 'مشتری'),
      type: 'group',
      fields: [
        {
          name: 'name',
          label: tr('Name', 'نام'),
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          label: tr('Phone', 'تلفن'),
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          label: tr('Email', 'ایمیل'),
          type: 'email',
        },
      ],
    },
    {
      name: 'items',
      label: tr('Items', 'اقلام'),
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'product',
          label: tr('Product', 'محصول'),
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          label: tr('Quantity', 'تعداد'),
          type: 'number',
          required: true,
          min: 1,
          admin: {
            placeholder: tr('1', '۱'),
          },
        },
        {
          name: 'unitPrice',
          label: tr('Unit Price', 'قیمت واحد'),
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: tr('Snapshot price for this order item.', 'قیمت ثبت‌شده برای این آیتم در زمان سفارش.'),
            placeholder: tr('0', '۰'),
          },
        },
        {
          name: 'titleSnapshot',
          label: tr('Title Snapshot', 'عنوان ثبت‌شده'),
          type: 'text',
          required: true,
          admin: {
            description: tr('Snapshot title for this order item.', 'عنوان ثبت‌شده برای این آیتم در زمان سفارش.'),
          },
        },
      ],
    },
    {
      name: 'pricing',
      label: tr('Pricing', 'قیمت‌گذاری'),
      type: 'group',
      admin: {
        description: tr('Calculated automatically from items.', 'به‌صورت خودکار از روی اقلام محاسبه می‌شود.'),
      },
      fields: [
        {
          name: 'subtotal',
          label: tr('Subtotal', 'جمع جزء'),
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'total',
          label: tr('Total', 'جمع کل'),
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'notes',
      label: tr('Notes', 'یادداشت‌ها'),
      type: 'textarea',
    },
  ],
}

