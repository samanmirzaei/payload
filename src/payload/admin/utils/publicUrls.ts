import type { Data } from 'payload'

import { projectConfig } from '../../../project/project.config'

export type PublicURLTarget = 'pages' | 'posts' | 'products'

export type PublicURLRules = {
  pageBasePath: string
  postBasePath: string
  productBasePath: string
  homeSlug: string
}

/**
 * Central place to configure public URL rules used by admin preview/copy buttons.
 * This does NOT require any frontend to exist yet.
 */
export const publicURLRules: PublicURLRules = {
  pageBasePath: '/',
  postBasePath: projectConfig.publicUrlPaths.blogBasePath,
  productBasePath: projectConfig.publicUrlPaths.productsBasePath,
  homeSlug: projectConfig.publicUrlPaths.pageHomeSlug,
}

export function getPublicPathForDoc(args: {
  collectionSlug?: string
  doc?: Data
  rules?: Partial<PublicURLRules>
}): string | null {
  const { collectionSlug, doc } = args
  const rules: PublicURLRules = { ...publicURLRules, ...(args.rules ?? {}) }

  const slug = typeof doc?.slug === 'string' ? doc.slug : undefined
  if (!slug) return null

  if (collectionSlug === 'pages') {
    return slug === rules.homeSlug ? rules.pageBasePath : `${rules.pageBasePath}${slug}`
  }

  if (collectionSlug === 'posts') {
    return `${rules.postBasePath}/${slug}`
  }

  if (collectionSlug === 'products') {
    return `${rules.productBasePath}/${slug}`
  }

  return null
}

export function joinURL(base: string, path: string): string {
  const cleanedBase = base.replace(/\/+$/, '')
  const cleanedPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanedBase}${cleanedPath}`
}
