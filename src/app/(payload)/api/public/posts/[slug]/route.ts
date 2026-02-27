import config from '@payload-config'
import { getPayload } from 'payload'

import { getPublishedOnlyWhere, getSeoDefaults, resolveSEO } from '../../../../../../payload/shared/delivery/public'

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await ctx.params

  const payload = await getPayload({ config })

  const publishedWhere = getPublishedOnlyWhere()
  const where = {
    ...(publishedWhere ?? {}),
    slug: { equals: slug },
  }

  const result = await payload.find({
    collection: 'posts',
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
        excerpt: doc.excerpt ?? null,
        featuredImage: doc.featuredImage ?? null,
        categories: doc.categories ?? [],
        layout: doc.layout ?? [],
      },
      seo,
    },
    { status: 200 },
  )
}

