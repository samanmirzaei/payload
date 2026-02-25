import { CommerceModule } from './module'

/**
 * Optional module list for ecommerce projects.
 *
 * Integration point:
 * - Enable by adding to the registry list in `src/payload/payload.config.ts`:
 *   `createModuleRegistry([...coreModules, ...commerceModules])`
 */
export const commerceModules = [CommerceModule] as const

export { CommerceModule }

