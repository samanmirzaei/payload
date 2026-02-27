import config from '@payload-config'
import { getPayload } from 'payload'

import { getPublishedOnlyWhere, getSeoDefaults, hasCollection, resolveSEO } from '../../../../../../payload/shared/delivery/public'

const stripStock = (variants: unknown): unknown => {
  if (!Array.isArray(variants)) return variants
  return variants.map((v) => {
    if (!v || typeof v !== 'object') return v
    const { stock: _stock, ...rest } = v as any
    return rest
  })
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await ctx.params

  const payload = await getPayload({ config })
  if (!hasCollection(payload, 'products')) {
    return Response.json({ error: 'Commerce is disabled' }, { status: 404 })
  }

  const publishedWhere = getPublishedOnlyWhere()
  const where = {
    ...(publishedWhere ?? {}),
    slug: { equals: slug },
  }

  const result = await payload.find({
    collection: 'products',
    where,
    depth: 3,
    limit: 1,
  })

  const doc = result.docs?.[0] as any
  if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })

  const defaults = await getSeoDefaults(payload)
  const seo = resolveSEO({ docTitle: doc.title, docSEO: doc.seo, defaults })

  return Response.json(
    {
      doc: {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        sku: doc.sku ?? null,
        shortDescription: doc.shortDescription ?? null,
        basePrice: doc.basePrice,
        salePrice: doc.salePrice ?? null,
        featuredImage: doc.featuredImage ?? null,
        gallery: doc.gallery ?? [],
        productCategories: doc.productCategories ?? [],
        attributes: doc.attributes ?? [],
        variants: stripStock(doc.variants ?? []),
        faq: doc.faq ?? [],
        layout: doc.layout ?? [],
      },
      seo,
    },
    { status: 200 },
  )
}

