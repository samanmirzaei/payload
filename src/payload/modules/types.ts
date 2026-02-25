import type { Block, CollectionConfig, GlobalConfig } from 'payload'

/**
 * A module is an isolated bundle of Payload primitives + helpers.
 * Optional modules (commerce/blog/etc) can be composed into a project by registration.
 */
export type PayloadModule = {
  /**
   * Stable identifier used for debugging and deterministic composition.
   */
  name: string

  /**
   * Payload primitives contributed by this module.
   * Keep these arrays isolated to the module and re-export through a module entrypoint.
   */
  collections?: ReadonlyArray<CollectionConfig>
  globals?: ReadonlyArray<GlobalConfig>

  /**
   * Blocks are not a top-level Payload config primitive; they are composed into block fields.
   * Keeping blocks in the module makes them reusable across collections/globals.
   */
  blocks?: ReadonlyArray<Block>
}

export type ModuleRegistry = {
  modules: ReadonlyArray<PayloadModule>
  collections: ReadonlyArray<CollectionConfig>
  globals: ReadonlyArray<GlobalConfig>
  blocks: ReadonlyArray<Block>
}
