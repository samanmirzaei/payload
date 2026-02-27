import type { Access } from 'payload'

import type { UserRole, UserWithRole } from './types'

const getUser = (args: Parameters<Access>[0]): UserWithRole | undefined => {
  // Payload attaches the authenticated user to `req.user`
  return (args.req.user as UserWithRole | undefined) ?? undefined
}

type PublicReadMode = 'all' | 'published'

const getPublicReadMode = (): PublicReadMode => {
  const env = process.env.PUBLIC_READ_MODE
  if (env === 'all' || env === 'published') return env

  // Default: permissive in dev, safe in production.
  return process.env.NODE_ENV === 'production' ? 'published' : 'all'
}

const collectionsWithStatus: ReadonlySet<string> = new Set(['pages', 'posts', 'products'])

export const publicRead: Access = (args) => {
  // Authenticated users can read everything (admin UI + integrations).
  const user = getUser(args)
  if (user) return true

  // Globals don't support "where" access filters; keep them readable (MVP).
  if ((args as any)?.global) return true

  const mode = getPublicReadMode()
  if (mode === 'all') return true

  const collectionSlug = (args as any)?.collection?.slug as string | undefined
  if (!collectionSlug || !collectionsWithStatus.has(collectionSlug)) return true

  // Public reads are restricted to published content only.
  return {
    status: {
      equals: 'published',
    },
  }
}

export const authenticated: Access = (args) => Boolean(getUser(args))

export const hasRole =
  (roles: ReadonlyArray<UserRole>): Access =>
  (args) => {
    const user = getUser(args)
    if (!user) return false
    return roles.includes(user.role as UserRole)
  }

export const adminOnly = hasRole(['admin'])

export const adminOrEditor: Access = (args) => {
  const user = getUser(args)
  if (!user) return false

  const isDev = process.env.NODE_ENV === 'development'
  const debug = isDev && process.env.PAYLOAD_DEBUG_ACCESS === 'true'

  if (debug) {
    // Dev-only: helps diagnose cases where auth cookies/JWT aren't being applied as expected.
    // Avoid logging sensitive data beyond what's needed to debug access.
    // eslint-disable-next-line no-console
    console.log('[access adminOrEditor]', {
      id: user.id,
      role: user.role,
      path: (args.req as any)?.path,
      method: (args.req as any)?.method,
      collection: (args as any)?.collection?.slug,
      global: (args as any)?.global?.slug,
    })
  }

  // Dev-only fallback: allow any authenticated user to write content while debugging auth wiring.
  // Production remains role-based.
  if (isDev) return true

  /**
   * Bootstrap / compatibility fallback:
   * If a user is authenticated but `role` is missing on `req.user`, allow access for non-user-management operations.
   * This commonly happens when the role is newly introduced and older JWTs don't include it yet.
   *
   * Safe-by-default note: `users` collection writes remain protected by `adminOnly` on that collection.
   */
  if (!user.role) return true

  return user.role === 'admin' || user.role === 'editor'
}

/**
 * Useful for restricting user reads to admins + the currently-authenticated user.
 */
export const adminOrSelf: Access = (args) => {
  const user = getUser(args)
  if (!user?.id) return false
  if (user.role === 'admin') return true

  // Return a where clause that limits reads to the current user's document.
  return {
    id: {
      equals: user.id,
    },
  }
}

/**
 * Bootstrap helper: allow creating the first user even when user creation is locked down.
 * After the first user exists, this falls back to the provided `fallback` policy.
 */
export const allowFirstUserOr =
  (fallback: Access): Access =>
  async (args) => {
    // If payload isn't available for some reason, be safe.
    if (!args.req?.payload) return false

    const existing = await args.req.payload.find({
      collection: 'users',
      limit: 1,
      depth: 0,
    })

    const hasAnyUsers = (existing?.totalDocs ?? 0) > 0
    if (!hasAnyUsers) return true

    return fallback(args)
  }
