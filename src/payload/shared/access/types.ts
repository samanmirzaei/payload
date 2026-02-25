/**
 * Keep auth/access typing lightweight and decoupled from generated Payload types.
 * Modules can progressively tighten this once `payload-types.ts` is generated and stable.
 */
export type UserRole = 'admin' | 'editor'

export type UserWithRole = {
  id?: string
  role?: UserRole | string
}

