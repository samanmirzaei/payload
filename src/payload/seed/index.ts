import type { Payload } from 'payload'

import { seedCore } from './core'
import { seedCommerce } from './commerce'

export type SeedOptions = {
  /**
   * If false, skips seeding commerce even when collections are registered.
   */
  includeCommerce?: boolean
}

/**
 * Development seed entrypoint.
 *
 * Safety:
 * - Call this only in development/staging environments.
 * - The recommended wiring is via `onInit` in `payload.config.ts` guarded by env vars.
 */
export const seedDev = async (payload: Payload, options: SeedOptions = {}): Promise<void> => {
  await seedCore(payload)

  const includeCommerce = options.includeCommerce ?? true
  if (includeCommerce) {
    await seedCommerce(payload)
  }
}

