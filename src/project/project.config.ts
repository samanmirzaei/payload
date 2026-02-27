export type ProjectLanguage = 'fa' | 'en'

export type ProjectConfig = {
  projectName: string
  defaultLanguage: ProjectLanguage

  /**
   * Optional modules.
   * Each deployment can toggle these and still remain a single, independent Payload instance.
   */
  enableCommerce: boolean
  enableOrders: boolean

  /**
   * Public URL rules used by admin helpers (preview/copy URL) and future frontends.
   * These do not create frontend routes; they only describe intended paths.
   */
  publicUrlPaths: {
    pageHomeSlug: string
    blogBasePath: string
    productsBasePath: string
  }

  adminBranding: {
    /**
     * Shown in the browser tab title (Payload admin `meta.titleSuffix`).
     */
    titleSuffix: string

    /**
     * Placeholder for future logo usage. Payload admin favicon/ogImage can be wired later.
     */
    logoPath?: string
  }
}

/**
 * Single source of truth for a single, independent deployment.
 *
 * Clone this repo per site and adjust values here (or run `npm run init:project`).
 */
export const projectConfig: ProjectConfig = {
  projectName: 'Payload Project',
  defaultLanguage: 'fa',

  enableCommerce: true,
  enableOrders: true,

  publicUrlPaths: {
    pageHomeSlug: 'home',
    blogBasePath: '/blog',
    productsBasePath: '/products',
  },

  adminBranding: {
    titleSuffix: 'Payload Project',
    // logoPath: '/path/to/logo.svg',
  },
} as const

