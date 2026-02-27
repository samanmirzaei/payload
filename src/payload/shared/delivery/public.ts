import type { Payload, Where } from 'payload'

type PublicReadMode = 'all' | 'published'

export const getPublicReadMode = (): PublicReadMode => {
  const env = process.env.PUBLIC_READ_MODE
  if (env === 'all' || env === 'published') return env
  return process.env.NODE_ENV === 'production' ? 'published' : 'all'
}

export const getPublishedOnlyWhere = (): Where | null => {
  return getPublicReadMode() === 'published'
    ? {
        status: {
          equals: 'published',
        },
      }
    : null
}

export const hasCollection = (payload: Payload, slug: string): boolean => {
  return Boolean((payload as any)?.collections?.[slug])
}

export type SeoDefaultsShape = {
  defaultTitle?: string | null
  titleTemplate?: string | null
  defaultMetaDescription?: string | null
  defaultOgImageUrl?: string | null
  robots?: {
    noIndex?: boolean | null
    noFollow?: boolean | null
  } | null
}

export const getSeoDefaults = async (payload: Payload): Promise<SeoDefaultsShape> => {
  const defaults = await payload.findGlobal({
    slug: 'seo-defaults',
    depth: 0,
    overrideAccess: true,
  })
  return (defaults ?? {}) as SeoDefaultsShape
}

type DocSEO = {
  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
  noIndex?: boolean | null
  noFollow?: boolean | null
  openGraph?: {
    title?: string | null
    description?: string | null
    imageUrl?: string | null
  } | null
  twitter?: {
    title?: string | null
    description?: string | null
    card?: string | null
    imageUrl?: string | null
  } | null
}

export type ResolvedSEO = {
  title: string
  description: string
  canonicalUrl: string | null
  robots: { index: boolean; follow: boolean }
  openGraph: { title: string; description: string; imageUrl: string | null }
  twitter: { title: string; description: string; card: string; imageUrl: string | null }
}

const applyTitleTemplate = (args: { title: string; template?: string | null }): string => {
  const { title, template } = args
  if (!template) return title
  return template.includes('%s') ? template.replace('%s', title) : title
}

export const resolveSEO = (args: {
  docTitle?: string | null
  docSEO?: DocSEO | null
  defaults?: SeoDefaultsShape
}): ResolvedSEO => {
  const defaults = args.defaults ?? {}
  const docSEO = args.docSEO ?? {}

  const baseTitle = (docSEO.metaTitle || args.docTitle || defaults.defaultTitle || '').toString()
  const title = applyTitleTemplate({ title: baseTitle, template: defaults.titleTemplate })

  const description = (docSEO.metaDescription || defaults.defaultMetaDescription || '').toString()
  const canonicalUrl = docSEO.canonicalUrl ? String(docSEO.canonicalUrl) : null

  const noIndex = typeof docSEO.noIndex === 'boolean' ? docSEO.noIndex : Boolean(defaults.robots?.noIndex)
  const noFollow = typeof docSEO.noFollow === 'boolean' ? docSEO.noFollow : Boolean(defaults.robots?.noFollow)

  const ogTitle = (docSEO.openGraph?.title || baseTitle || defaults.defaultTitle || '').toString()
  const ogDescription = (docSEO.openGraph?.description || description || '').toString()
  const ogImageUrl =
    (docSEO.openGraph?.imageUrl && String(docSEO.openGraph.imageUrl)) ||
    (defaults.defaultOgImageUrl && String(defaults.defaultOgImageUrl)) ||
    null

  const twTitle = (docSEO.twitter?.title || ogTitle || baseTitle).toString()
  const twDescription = (docSEO.twitter?.description || ogDescription || description).toString()
  const twCard = (docSEO.twitter?.card || 'summary_large_image').toString()
  const twImageUrl =
    (docSEO.twitter?.imageUrl && String(docSEO.twitter.imageUrl)) ||
    ogImageUrl ||
    (defaults.defaultOgImageUrl && String(defaults.defaultOgImageUrl)) ||
    null

  return {
    title,
    description,
    canonicalUrl,
    robots: {
      index: !noIndex,
      follow: !noFollow,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      imageUrl: ogImageUrl,
    },
    twitter: {
      title: twTitle,
      description: twDescription,
      card: twCard,
      imageUrl: twImageUrl,
    },
  }
}

