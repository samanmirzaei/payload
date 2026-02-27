import type { Payload } from 'payload'

import { seedCommerce } from './commerce'
import { findByField, upsertByField } from './utils'

const hasCollection = (payload: Payload, slug: string): boolean => {
  return Boolean((payload as any)?.collections?.[slug])
}

/**
 * Shop seed profile (commerce + optional orders).
 */
export const seedShop = async (payload: Payload): Promise<void> => {
  await seedCommerce(payload)

  // Orders are optional (can be disabled even when commerce is enabled).
  if (!hasCollection(payload, 'orders')) return

  const product = await findByField(payload, { collection: 'products', field: 'slug', value: 'basic-tee' })
  if (!product?.id) return

  await upsertByField(payload, {
    collection: 'orders',
    field: 'orderNumber',
    value: 'ORD-SEED-0001',
    data: {
      orderNumber: 'ORD-SEED-0001',
      status: 'pending',
      customer: {
        name: 'Seed Customer',
        phone: '+1 (555) 010-0100',
        email: 'seed@example.com',
      },
      items: [
        {
          product: product.id,
          variantSKU: 'TEE-001-M',
          quantity: 1,
          unitPrice: 19,
          titleSnapshot: 'Basic Tee',
          attributesSummary: 'Size: M',
        },
      ],
      notes: 'Seeded order for development. Mark as paid manually to test stock decrement.',
    },
  })
}

