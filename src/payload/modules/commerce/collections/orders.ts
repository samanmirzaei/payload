import type { CollectionConfig } from 'payload'

import { adminOrEditor, authenticated } from '../../../shared/access'
import { adminText, tr } from '../../../shared/i18n'

type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'fulfilled'

const getRelationshipID = (value: unknown): string | number | undefined => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as any).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return undefined
}

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
  originalDoc?: any
  req: any
}): Promise<any> => {
  const { data, originalDoc, req } = args
  if (!data) return data

  if (!data.orderNumber) {
    data.orderNumber = generateOrderNumber()
  }

  const items: any[] = Array.isArray(data.items) ? data.items : []

  // Denormalized customer fields for easier filtering/searching in admin.
  if (data.customer && typeof data.customer === 'object') {
    if (typeof data.customer.phone === 'string') data.customerPhone = data.customer.phone
    if (typeof data.customer.email === 'string') data.customerEmail = data.customer.email
  }

  // Fill item snapshots (title/unitPrice) when missing.
  for (const item of items) {
    if (!item) continue

    const productID = getRelationshipID(item.product)
    if (productID && (item.titleSnapshot == null || item.unitPrice == null || item.attributesSummary == null)) {
      try {
        const product = await req?.payload?.findByID?.({
          collection: 'products',
          id: productID,
          depth: 0,
          overrideAccess: true,
        })

        if (product) {
          if (!item.titleSnapshot && typeof product.title === 'string') {
            item.titleSnapshot = product.title
          }

          if (item.unitPrice == null) {
            const variantSKU = typeof item.variantSKU === 'string' ? item.variantSKU.trim() : ''
            const variants = Array.isArray(product.variants) ? product.variants : []
            const variant = variantSKU ? variants.find((v: any) => typeof v?.sku === 'string' && v.sku === variantSKU) : null

            const variantPrice = typeof variant?.price === 'number' ? variant.price : undefined
            const sale = typeof product.salePrice === 'number' ? product.salePrice : undefined
            const base = typeof product.basePrice === 'number' ? product.basePrice : undefined
            const price = typeof variantPrice === 'number' ? variantPrice : typeof sale === 'number' ? sale : base
            if (typeof price === 'number') item.unitPrice = price
          }

          if (!item.attributesSummary) {
            const variantSKU = typeof item.variantSKU === 'string' ? item.variantSKU.trim() : ''
            const variants = Array.isArray(product.variants) ? product.variants : []
            const variant = variantSKU ? variants.find((v: any) => typeof v?.sku === 'string' && v.sku === variantSKU) : null
            if (variant && typeof variant.attributesSummary === 'string') {
              item.attributesSummary = variant.attributesSummary
            }
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

const decrementStockOnPaid = async (args: {
  data: any
  originalDoc?: any
  req: any
}): Promise<void> => {
  const { data, originalDoc, req } = args
  const nextStatus: OrderStatus | undefined = data?.status
  const prevStatus: OrderStatus | undefined = originalDoc?.status

  const isTransitionToPaid = nextStatus === 'paid' && prevStatus !== 'paid'
  if (!isTransitionToPaid) return

  const lang = req?.i18n?.language
  const items: any[] = Array.isArray(data?.items) ? data.items : []

  // Aggregate decrements per product + variant SKU.
  const decrements = new Map<string, Map<string, number>>() // productID -> (variantSKU -> qty); variantSKU may be '' for non-variant products

  for (const item of items) {
    const productID = getRelationshipID(item?.product)
    const quantity = typeof item?.quantity === 'number' ? item.quantity : Number(item?.quantity)
    const variantSKU = typeof item?.variantSKU === 'string' ? item.variantSKU.trim() : ''

    if (!productID) continue
    if (!Number.isFinite(quantity) || quantity <= 0) continue

    const productKey = String(productID)
    const current = decrements.get(productKey) ?? new Map<string, number>()
    current.set(variantSKU, (current.get(variantSKU) ?? 0) + quantity)
    decrements.set(productKey, current)
  }

  for (const [productKey, variantMap] of decrements.entries()) {
    const product = await req?.payload?.findByID?.({
      collection: 'products',
      id: productKey,
      depth: 0,
      overrideAccess: true,
    })

    if (!product) continue

    const variants: any[] = Array.isArray(product.variants) ? product.variants : []
    if (!variants.length) continue

    // If product has variants, paid orders must specify a variant SKU for each item of that product.
    if (variantMap.has('')) {
      throw new Error(
        lang === 'fa'
          ? 'برای ثبت سفارشِ پرداخت‌شده، انتخاب «SKU تنوع» برای آیتم‌های محصولات دارای تنوع الزامی است.'
          : 'variantSKU is required for items of products that have variants when marking an order as paid.',
      )
    }

    // Apply each decrement with validation.
    for (const [variantSKU, qtyToDecrement] of variantMap.entries()) {
      const idx = variants.findIndex((v) => typeof v?.sku === 'string' && v.sku === variantSKU)
      if (idx < 0) {
        throw new Error(
          lang === 'fa'
            ? `تنوع با SKU «${variantSKU}» برای این محصول پیدا نشد.`
            : `Variant with SKU "${variantSKU}" was not found for this product.`,
        )
      }

      const currentStock = variants[idx]?.stock
      if (typeof currentStock !== 'number') {
        // Stock not tracked for this variant; skip.
        continue
      }

      if (currentStock < qtyToDecrement) {
        throw new Error(
          lang === 'fa'
            ? `موجودی برای SKU «${variantSKU}» کافی نیست (موجودی: ${currentStock}، نیاز: ${qtyToDecrement}).`
            : `Insufficient stock for SKU "${variantSKU}" (stock: ${currentStock}, required: ${qtyToDecrement}).`,
        )
      }

      variants[idx] = { ...variants[idx], stock: currentStock - qtyToDecrement }
    }

    await req?.payload?.update?.({
      collection: 'products',
      id: productKey,
      data: { variants },
      depth: 0,
      overrideAccess: true,
    })
  }

  // TODO: consider "restock on cancel/refund" in the future.
}

const appendStatusHistory = (args: { data: any; originalDoc?: any; req: any }): void => {
  const { data, originalDoc, req } = args
  const nextStatus: OrderStatus | undefined = data?.status
  const prevStatus: OrderStatus | undefined = originalDoc?.status

  if (!nextStatus || !prevStatus || nextStatus === prevStatus) return

  const existing = Array.isArray(originalDoc?.statusHistory) ? originalDoc.statusHistory : []
  const entry = {
    from: prevStatus,
    to: nextStatus,
    at: new Date().toISOString(),
    by: req?.user?.id ?? undefined,
  }

  data.statusHistory = [...existing, entry]
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
  defaultSort: '-createdAt',
  admin: {
    group: adminText.groups.store,
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'pricing.total', 'customer.phone', 'createdAt'],
    description: tr('Orders for ecommerce projects (MVP).', 'سفارش‌ها برای پروژه‌های فروشگاهی (MVP).'),
    components: {
      views: {
        edit: {
          default: {
            actions: ['./src/payload/admin/components/OrderStatusActions'],
          },
        },
      },
    },
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
        args.data = await normalizeOrderData({ data: args.data, originalDoc: (args as any).originalDoc, req: args.req })
        return args.data
      },
    ],
    beforeChange: [
      async (args) => {
        args.data = await normalizeOrderData({ data: args.data, originalDoc: (args as any).originalDoc, req: args.req })
        await decrementStockOnPaid({ data: args.data, originalDoc: (args as any).originalDoc, req: args.req })
        appendStatusHistory({ data: args.data, originalDoc: (args as any).originalDoc, req: args.req })
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
      name: 'customerPhone',
      label: tr('Customer Phone (index)', 'تلفن مشتری (فیلتر)'),
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        disableListColumn: true,
        description: tr('Auto-filled from Customer → Phone. Useful for filtering.', 'به‌صورت خودکار از «مشتری → تلفن» پر می‌شود. برای فیلتر مفید است.'),
      },
    },
    {
      name: 'customerEmail',
      label: tr('Customer Email (index)', 'ایمیل مشتری (فیلتر)'),
      type: 'email',
      index: true,
      admin: {
        readOnly: true,
        disableListColumn: true,
        description: tr('Auto-filled from Customer → Email. Useful for filtering.', 'به‌صورت خودکار از «مشتری → ایمیل» پر می‌شود. برای فیلتر مفید است.'),
      },
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
          name: 'variantSKU',
          label: tr('Variant SKU', 'SKU تنوع'),
          type: 'text',
          admin: {
            description: tr(
              'Optional while pending. Required to decrement stock when marking the order as paid.',
              'در وضعیت «در انتظار پرداخت» اختیاری است. برای کم‌کردن موجودی هنگام «پرداخت‌شده» شدن سفارش الزامی است.',
            ),
            placeholder: tr('e.g. SKU-RED-M', 'مثلاً SKU-RED-M'),
          },
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
        {
          name: 'attributesSummary',
          label: tr('Attributes Summary', 'خلاصه ویژگی‌ها'),
          type: 'text',
          admin: {
            description: tr(
              'Optional snapshot of variant attributes (e.g. “Size: M / Color: Black”).',
              'اختیاری. خلاصه ثبت‌شده از ویژگی‌های تنوع (مثلاً «سایز: M / رنگ: مشکی»).',
            ),
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
      name: 'statusHistory',
      label: tr('Status History', 'تاریخچه وضعیت'),
      type: 'array',
      admin: {
        readOnly: true,
        description: tr('Recorded automatically when status changes.', 'به‌صورت خودکار هنگام تغییر وضعیت ثبت می‌شود.'),
      },
      fields: [
        {
          name: 'from',
          label: tr('From', 'از'),
          type: 'select',
          options: [
            { label: tr('Pending', 'در انتظار پرداخت'), value: 'pending' },
            { label: tr('Paid', 'پرداخت‌شده'), value: 'paid' },
            { label: tr('Cancelled', 'لغو شده'), value: 'cancelled' },
            { label: tr('Fulfilled', 'انجام‌شده'), value: 'fulfilled' },
          ],
        },
        {
          name: 'to',
          label: tr('To', 'به'),
          type: 'select',
          options: [
            { label: tr('Pending', 'در انتظار پرداخت'), value: 'pending' },
            { label: tr('Paid', 'پرداخت‌شده'), value: 'paid' },
            { label: tr('Cancelled', 'لغو شده'), value: 'cancelled' },
            { label: tr('Fulfilled', 'انجام‌شده'), value: 'fulfilled' },
          ],
        },
        {
          name: 'at',
          label: tr('At', 'زمان'),
          type: 'date',
        },
        {
          name: 'by',
          label: tr('By', 'توسط'),
          type: 'relationship',
          relationTo: 'users',
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
