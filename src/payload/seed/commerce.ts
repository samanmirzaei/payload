import type { Payload } from 'payload'

import { upsertByField } from './utils'

const hasCollection = (payload: Payload, slug: string): boolean => {
  return Boolean((payload as any)?.collections?.[slug])
}

export const seedCommerce = async (payload: Payload): Promise<void> => {
  // Optional module detection: if collections are not registered, skip gracefully.
  if (!hasCollection(payload, 'products') || !hasCollection(payload, 'product-categories')) {
    return
  }

  const apparel = await upsertByField<{ id: string }>(payload, {
    collection: 'product-categories',
    field: 'slug',
    value: 'apparel',
    data: {
      title: 'Apparel',
      slug: 'apparel',
      description: 'Generic category for clothing and wearable goods.',
    },
  })

  const accessories = await upsertByField<{ id: string }>(payload, {
    collection: 'product-categories',
    field: 'slug',
    value: 'accessories',
    data: {
      title: 'Accessories',
      slug: 'accessories',
      description: 'Generic category for add-ons and accessories.',
    },
  })

  await upsertByField(payload, {
    collection: 'products',
    field: 'slug',
    value: 'basic-tee',
    data: {
      title: 'Basic Tee',
      slug: 'basic-tee',
      sku: 'TEE-001',
      shortDescription: 'A simple example product used for development seeding.',
      basePrice: 25,
      salePrice: 19,
      productCategories: [apparel.id],
      attributes: [
        { name: 'Material', value: 'Cotton' },
        { name: 'Fit', value: 'Regular' },
      ],
      variants: [
        { sku: 'TEE-001-S', price: 19, stock: 25, attributesSummary: 'Size: S' },
        { sku: 'TEE-001-M', price: 19, stock: 10, attributesSummary: 'Size: M' },
      ],
      faq: [{ question: 'Is this machine-washable?', answer: 'This is seed data—configure real product FAQs per project.' }],
      layout: [
        { blockType: 'hero', headline: 'Basic Tee', subheadline: 'Seeded product layout using shared blocks.' },
        { blockType: 'richText', content: 'This product is seeded for development. Replace with real merchandising copy.' },
      ],
      seo: {
        metaTitle: 'Basic Tee',
        metaDescription: 'Seeded example product.',
        canonicalUrl: 'https://example.com/products/basic-tee',
        noIndex: false,
        noFollow: false,
        openGraph: { title: 'Basic Tee', description: 'Seeded example product.', imageUrl: '' },
        twitter: { title: 'Basic Tee', description: 'Seeded example product.', card: 'summary_large_image', imageUrl: '' },
      },
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  await upsertByField(payload, {
    collection: 'products',
    field: 'slug',
    value: 'everyday-cap',
    data: {
      title: 'Everyday Cap',
      slug: 'everyday-cap',
      sku: 'CAP-001',
      shortDescription: 'A second seeded product to validate categories, variants, and layout blocks.',
      basePrice: 18,
      productCategories: [accessories.id],
      attributes: [{ name: 'Style', value: 'Adjustable' }],
      variants: [{ sku: 'CAP-001', price: 18, stock: 40, attributesSummary: 'One size' }],
      layout: [
        { blockType: 'cta', title: 'Made for daily use', description: 'Seeded CTA block inside a product layout.', buttonLabel: 'Learn More', buttonHref: '/about' },
      ],
      seo: {
        metaTitle: 'Everyday Cap',
        metaDescription: 'Seeded example product.',
        canonicalUrl: 'https://example.com/products/everyday-cap',
        noIndex: false,
        noFollow: false,
        openGraph: { title: 'Everyday Cap', description: 'Seeded example product.', imageUrl: '' },
        twitter: { title: 'Everyday Cap', description: 'Seeded example product.', card: 'summary_large_image', imageUrl: '' },
      },
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  await upsertByField(payload, {
    collection: 'products',
    field: 'slug',
    value: 'starter-bundle',
    data: {
      title: 'Starter Bundle',
      slug: 'starter-bundle',
      sku: 'BUNDLE-001',
      shortDescription: 'A third seeded product to validate list views and editor UX.',
      basePrice: 49,
      productCategories: [apparel.id, accessories.id],
      variants: [{ sku: 'BUNDLE-001', price: 49, stock: 5, attributesSummary: 'Bundle' }],
      layout: [
        {
          blockType: 'faq',
          title: 'Bundle FAQ',
          items: [
            { question: 'What’s included?', answer: 'This is seed data—define real bundle contents per project.' },
            { question: 'Can I customize it?', answer: 'In a future step, add product options/variants modeling as needed.' },
          ],
        },
      ],
      seo: {
        metaTitle: 'Starter Bundle',
        metaDescription: 'Seeded example product bundle.',
        canonicalUrl: 'https://example.com/products/starter-bundle',
        noIndex: false,
        noFollow: false,
        openGraph: { title: 'Starter Bundle', description: 'Seeded example product bundle.', imageUrl: '' },
        twitter: { title: 'Starter Bundle', description: 'Seeded example product bundle.', card: 'summary_large_image', imageUrl: '' },
      },
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })
}

