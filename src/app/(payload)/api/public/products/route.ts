import config from '@payload-config'
import { getPayload } from 'payload'

import { getPublishedOnlyWhere, getSeoDefaults, hasCollection, resolveSEO } from '../../../../../payload/shared/delivery/public'

const toInt = (value: string | null, fallback: number): number => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

const stripStock = (variants: unknown): unknown => {
  if (!Array.isArray(variants)) return variants
  return variants.map((v) => {
    if (!v || typeof v !== 'object') return v
    const { stock: _stock, ...rest } = v as any
    return rest
  })
}

export async function GET(req: Request): Promise<Response> {
  const payload = await getPayload({ config })
  if (!hasCollection(payload, 'products')) {
    return Response.json({ error: 'Commerce is disabled' }, { status: 404 })
  }

  const url = new URL(req.url)
  const page = toInt(url.searchParams.get('page'), 1)
  const limit = Math.min(toInt(url.searchParams.get('limit'), 12), 50)

  const category = url.searchParams.get('category')?.trim()
  const q = url.searchParams.get('q')?.trim()

  const publishedWhere = getPublishedOnlyWhere()
  const where: any = { ...(publishedWhere ?? {}) }

  if (q) {
    where.or = [
      { title: { like: q } },
      { sku: { like: q } },
      { slug: { like: q } },
    ]
  }

  if (category) {
    // Allow category to be either an id or a slug.
    const bySlug = await payload.find({
      collection: 'product-categories',
      where: { slug: { equals: category } },
      depth: 0,
      limit: 1,
    })
    const categoryID = (bySlug.docs?.[0] as any)?.id ?? category
    where.and = [...(where.and ?? []), { productCategories: { contains: categoryID } }]
  }

  const result = await payload.find({
    collection: 'products',
    where,
    depth: 2,
    page,
    limit,
    sort: '-createdAt',
  })

  const defaults = await getSeoDefaults(payload)

  const docs = (result.docs as any[]).map((doc) => ({
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
    seo: resolveSEO({ docTitle: doc.title, docSEO: doc.seo, defaults }),
  }))

  return Response.json(
    {
      docs,
      page: result.page,
      limit: result.limit,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
    },
    { status: 200 },
  )
}

