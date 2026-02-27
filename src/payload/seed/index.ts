import type { Payload } from 'payload'

import { seedCore } from './core'
import { seedCorporate } from './corporate'
import { seedShop } from './shop'

export type SeedOptions = {
  /**
   * If false, skips seeding commerce even when collections are registered.
   */
  includeCommerce?: boolean

  /**
   * Optional seed profile selection.
   * - corporate: content-only
   * - shop: content + commerce (+ orders if enabled)
   */
  preset?: 'corporate' | 'shop'
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
  await seedCorporate(payload)

  const preset = options.preset ?? (process.env.PROJECT_PRESET === 'shop' ? 'shop' : 'corporate')
  const includeCommerce = options.includeCommerce ?? preset === 'shop'
  if (includeCommerce) await seedShop(payload)
}
