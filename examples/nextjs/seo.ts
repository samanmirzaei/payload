/**
 * SEO mapping guidance (Next.js Metadata API-friendly).
 *
 * This returns a plain object so it can be copied into a Next.js project without requiring
 * `next` as a dependency in this repo.
 */

type SeoRobots = {
  noIndex?: boolean
  noFollow?: boolean
}

type SeoOpenGraph = {
  title?: string
  description?: string
  imageUrl?: string
}

type SeoTwitter = {
  title?: string
  description?: string
  card?: 'summary' | 'summary_large_image' | string
  imageUrl?: string
}

export type DocSeo = {
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
  openGraph?: SeoOpenGraph
  twitter?: SeoTwitter
}

export type SeoDefaultsGlobal = {
  defaultTitle?: string
  titleTemplate?: string
  defaultMetaDescription?: string
  defaultOgImageUrl?: string
  robots?: SeoRobots
}

const applyTitleTemplate = (title: string | undefined, template: string | undefined): string | undefined => {
  if (!title) return undefined
  if (!template) return title
  return template.includes('%s') ? template.replace('%s', title) : `${title} ${template}`
}

/**
 * Computes effective SEO fields with fallbacks:
 * - doc SEO wins
 * - then global defaults
 */
export const resolveSeo = (docSeo: DocSeo | undefined, defaults: SeoDefaultsGlobal | undefined) => {
  const metaTitle = docSeo?.metaTitle ?? defaults?.defaultTitle
  const metaDescription = docSeo?.metaDescription ?? defaults?.defaultMetaDescription
  const canonicalUrl = docSeo?.canonicalUrl

  const noIndex = docSeo?.noIndex ?? defaults?.robots?.noIndex ?? false
  const noFollow = docSeo?.noFollow ?? defaults?.robots?.noFollow ?? false

  const ogTitle = docSeo?.openGraph?.title ?? metaTitle
  const ogDescription = docSeo?.openGraph?.description ?? metaDescription
  const ogImageUrl = docSeo?.openGraph?.imageUrl ?? defaults?.defaultOgImageUrl

  const twitterTitle = docSeo?.twitter?.title ?? metaTitle
  const twitterDescription = docSeo?.twitter?.description ?? metaDescription
  const twitterImageUrl = docSeo?.twitter?.imageUrl ?? ogImageUrl

  return {
    metaTitle,
    metaDescription,
    canonicalUrl,
    noIndex,
    noFollow,
    openGraph: { title: ogTitle, description: ogDescription, imageUrl: ogImageUrl },
    twitter: {
      title: twitterTitle,
      description: twitterDescription,
      card: docSeo?.twitter?.card ?? 'summary_large_image',
      imageUrl: twitterImageUrl,
    },
  }
}

/**
 * Creates a Next.js-like metadata object (subset).
 * Copy into `generateMetadata()` and adjust to your needs.
 */
export const toNextMetadata = (
  resolved: ReturnType<typeof resolveSeo>,
  defaults?: SeoDefaultsGlobal,
): Record<string, unknown> => {
  const title = applyTitleTemplate(resolved.metaTitle, defaults?.titleTemplate)

  return {
    title,
    description: resolved.metaDescription,
    alternates: resolved.canonicalUrl ? { canonical: resolved.canonicalUrl } : undefined,
    robots: {
      index: !resolved.noIndex,
      follow: !resolved.noFollow,
    },
    openGraph: {
      title: resolved.openGraph.title,
      description: resolved.openGraph.description,
      images: resolved.openGraph.imageUrl ? [{ url: resolved.openGraph.imageUrl }] : undefined,
    },
    twitter: {
      card: resolved.twitter.card,
      title: resolved.twitter.title,
      description: resolved.twitter.description,
      images: resolved.twitter.imageUrl ? [resolved.twitter.imageUrl] : undefined,
    },
  }
}

