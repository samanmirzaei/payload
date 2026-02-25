import path from 'node:path'

import { buildConfig } from 'payload'
import sharp from 'sharp'
import { postgresAdapter } from '@payloadcms/db-postgres'

import { createModuleRegistry } from './modules/registry'
import { coreModules } from './modules/core'
import { commerceModules } from './modules/commerce'
import { seedDev } from './seed'

/**
 * Integration points:
 * - Add/Remove modules in `coreModules` (and later optional module lists).
 * - Frontends (e.g. multiple Next.js apps) should treat this server as the source of truth
 *   and connect via REST/GraphQL, or use Payload's local API where appropriate.
 */
const secret =
  process.env.PAYLOAD_SECRET ?? (process.env.NODE_ENV === 'development' ? 'dev-secret-change-me' : undefined)

/**
 * Note on env strictness:
 * - Next.js build can evaluate route modules that import this config.
 * - To keep `next build` workable in environments where runtime env vars are injected later,
 *   we avoid throwing at import-time and instead rely on deployment/runtime configuration.
 */
const resolvedSecret = secret ?? 'missing-payload-secret'
const databaseUrl = process.env.DATABASE_URL ?? 'postgres://payload:payload@localhost:5432/payload'

const registry = createModuleRegistry([...coreModules, ...commerceModules])

export default buildConfig({
  secret: resolvedSecret,
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  onInit: async (payload) => {
    /**
     * Dev-only seed entrypoint.
     *
     * Run by setting:
     * - `NODE_ENV=development`
     * - `PAYLOAD_RUN_SEED=true`
     *
     * Optional:
     * - `PAYLOAD_SEED_COMMERCE=false` to skip commerce seeding even if the module is enabled.
     */
    const shouldSeed = process.env.NODE_ENV === 'development' && process.env.PAYLOAD_RUN_SEED === 'true'
    if (!shouldSeed) return

    const includeCommerce = process.env.PAYLOAD_SEED_COMMERCE !== 'false'
    await seedDev(payload, { includeCommerce })
  },

  admin: {
    user: 'users',
  },

  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
    },
  }),

  sharp,

  collections: [...registry.collections],
  globals: [...registry.globals],

  /**
   * Generates `payload-types.ts` for strongly-typed access in modules and later frontends.
   */
  typescript: {
    outputFile: path.resolve(process.cwd(), 'src/payload/payload-types.ts'),
  },

  /**
   * DB adapter wiring is intentionally left to a later step, so this starter can support
   * either MongoDB or Postgres without locking in early.
   *
   * Example (later):
   * - `db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } })`
   * - `db: mongooseAdapter({ url: process.env.DATABASE_URL })`
   */
})
