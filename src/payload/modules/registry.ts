import type { ModuleRegistry, PayloadModule } from './types'

type HasSlug = { slug: string }

export type CreateModuleRegistryOptions = {
  /**
   * Keeps ordering deterministic.
   * - `asProvided`: respects the caller's module ordering (recommended for per-project composition)
   * - `byName`: sorts modules alphabetically by `module.name`
   */
  order?: 'asProvided' | 'byName'
}

const ensureUniqueSlugs = (items: ReadonlyArray<HasSlug>, kind: 'collection' | 'global'): void => {
  const seen = new Map<string, number>()

  for (const item of items) {
    const count = (seen.get(item.slug) ?? 0) + 1
    seen.set(item.slug, count)
  }

  const duplicates = [...seen.entries()].filter(([, count]) => count > 1).map(([slug]) => slug)
  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate ${kind} slug(s) detected: ${duplicates.join(
        ', ',
      )}. Ensure module slugs are unique.`,
    )
  }
}

const ensureUniqueModuleNames = (modules: ReadonlyArray<Pick<PayloadModule, 'name'>>): void => {
  const seen = new Map<string, number>()

  for (const m of modules) {
    const count = (seen.get(m.name) ?? 0) + 1
    seen.set(m.name, count)
  }

  const duplicates = [...seen.entries()].filter(([, count]) => count > 1).map(([name]) => name)
  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate module name(s) detected: ${duplicates.join(', ')}. Module names must be unique.`,
    )
  }
}

/**
 * Merge modules into a single Payload config surface area.
 * This keeps modules isolated (they only export fragments) but composable (a project chooses the list).
 */
export const createModuleRegistry = (
  modules: ReadonlyArray<PayloadModule>,
  options: CreateModuleRegistryOptions = {},
): ModuleRegistry => {
  const order = options.order ?? 'asProvided'
  const ordered =
    order === 'byName' ? [...modules].sort((a, b) => a.name.localeCompare(b.name)) : [...modules]

  const collections = ordered.flatMap((m) => m.collections ?? [])
  const globals = ordered.flatMap((m) => m.globals ?? [])
  const blocks = ordered.flatMap((m) => m.blocks ?? [])

  ensureUniqueModuleNames(ordered)
  ensureUniqueSlugs(collections, 'collection')
  ensureUniqueSlugs(globals, 'global')

  return {
    modules: ordered,
    collections,
    globals,
    blocks,
  }
}
