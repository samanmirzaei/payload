import config from '@payload-config'
import { getPayload } from 'payload'

import { getPublishedOnlyWhere, getSeoDefaults, resolveSEO } from '../../../../../payload/shared/delivery/public'

const toInt = (value: string | null, fallback: number): number => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

export async function GET(req: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const url = new URL(req.url)

  const page = toInt(url.searchParams.get('page'), 1)
  const limit = Math.min(toInt(url.searchParams.get('limit'), 10), 50)

  const category = url.searchParams.get('category')?.trim()
  const q = url.searchParams.get('q')?.trim()

  const publishedWhere = getPublishedOnlyWhere()
  const where: any = { ...(publishedWhere ?? {}) }

  if (q) {
    where.or = [
      { title: { like: q } },
      { excerpt: { like: q } },
      { slug: { like: q } },
    ]
  }

  if (category) {
    // Allow category to be either an id or a slug.
    const bySlug = await payload.find({
      collection: 'categories',
      where: { slug: { equals: category } },
      depth: 0,
      limit: 1,
    })
    const categoryID = (bySlug.docs?.[0] as any)?.id ?? category

    where.and = [...(where.and ?? []), { categories: { contains: categoryID } }]
  }

  const result = await payload.find({
    collection: 'posts',
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
    excerpt: doc.excerpt ?? null,
    categories: doc.categories ?? [],
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

