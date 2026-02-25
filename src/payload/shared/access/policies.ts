import type { Access } from 'payload'

import type { UserRole, UserWithRole } from './types'

const getUser = (args: Parameters<Access>[0]): UserWithRole | undefined => {
  // Payload attaches the authenticated user to `req.user`
  return (args.req.user as UserWithRole | undefined) ?? undefined
}

export const publicRead: Access = () => true

export const authenticated: Access = (args) => Boolean(getUser(args))

export const hasRole =
  (roles: ReadonlyArray<UserRole>): Access =>
  (args) => {
    const user = getUser(args)
    if (!user) return false
    return roles.includes(user.role as UserRole)
  }

export const adminOnly = hasRole(['admin'])

export const adminOrEditor = hasRole(['admin', 'editor'])

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

