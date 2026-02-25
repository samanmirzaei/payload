/**
 * Payload REST helper examples (Next.js-friendly).
 *
 * Primary style: REST requests to Payload.
 * Alternative: if a Next app is co-located with Payload, use Payload local API directly.
 */

export type PayloadRestClientOptions = {
  apiUrl: string
  /**
   * Optional. Useful if you later tighten public-read access.
   */
  token?: string
}

export type Paginated<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  page?: number
  totalPages?: number
}

const joinUrl = (base: string, path: string): string => {
  const trimmedBase = base.replace(/\/+$/, '')
  const trimmedPath = path.replace(/^\/+/, '')
  return `${trimmedBase}/${trimmedPath}`
}

const toQueryString = (params: Record<string, string | number | boolean | undefined>): string => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return ''
  const search = new URLSearchParams()
  for (const [k, v] of entries) search.set(k, String(v))
  return `?${search.toString()}`
}

const restFetch = async <T>(
  options: PayloadRestClientOptions,
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const url = joinUrl(options.apiUrl, path)
  const headers = new Headers(init?.headers)
  if (options.token) headers.set('Authorization', `users API-Key ${options.token}`)

  const res = await fetch(url, { ...init, headers })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Payload REST error ${res.status} for ${url}${text ? `: ${text}` : ''}`)
  }
  return (await res.json()) as T
}

export const createPayloadRestClient = (options: PayloadRestClientOptions) => {
  const getGlobal = async <T>(slug: string): Promise<T> => {
    return restFetch<T>(options, `/api/globals/${slug}`)
  }

  const findBySlug = async <T>(collection: string, slug: string): Promise<T | null> => {
    const qs =
      `?where[slug][equals]=${encodeURIComponent(slug)}` +
      `&limit=1&depth=1`
    const data = await restFetch<Paginated<T>>(options, `/api/${collection}${qs}`)
    return data.docs?.[0] ?? null
  }

  const list = async <T>(
    collection: string,
    args: { limit?: number; page?: number; where?: string } = {},
  ): Promise<Paginated<T>> => {
    // `where` is left as a string so callers can pass advanced Payload query params.
    const base = toQueryString({ limit: args.limit ?? 12, page: args.page ?? 1 })
    const suffix = args.where ? `${base}${base ? '&' : '?'}${args.where}` : base
    return restFetch<Paginated<T>>(options, `/api/${collection}${suffix}`)
  }

  /**
   * Core globals
   */
  const getSiteSettings = () => getGlobal('site-settings')
  const getSeoDefaults = () => getGlobal('seo-defaults')
  const getHeader = () => getGlobal('header')
  const getFooter = () => getGlobal('footer')

  /**
   * Core content
   */
  const getPageBySlug = (slug: string) => findBySlug('pages', slug)
  const getPostBySlug = (slug: string) => findBySlug('posts', slug)
  const getPostsList = (args?: { limit?: number; page?: number; publishedOnly?: boolean }) => {
    const where = args?.publishedOnly ? 'where[status][equals]=published' : undefined
    return list('posts', { limit: args?.limit, page: args?.page, where })
  }

  /**
   * Commerce (optional module)
   *
   * Strategy:
   * - attempt requests; if the module isn't enabled, Payload will typically return 404 for the collection endpoint
   * - callers can catch errors and treat commerce as "disabled"
   */
  const getProductBySlug = (slug: string) => findBySlug('products', slug)
  const getProductsList = (args?: { limit?: number; page?: number; publishedOnly?: boolean }) => {
    const where = args?.publishedOnly ? 'where[status][equals]=published' : undefined
    return list('products', { limit: args?.limit, page: args?.page, where })
  }

  return {
    // globals
    getSiteSettings,
    getSeoDefaults,
    getHeader,
    getFooter,
    // content
    getPageBySlug,
    getPostsList,
    getPostBySlug,
    // commerce (optional)
    getProductsList,
    getProductBySlug,
  }
}

/**
 * Suggested Next.js usage (server component / route handler):
 *
 * const client = createPayloadRestClient({ apiUrl: process.env.PAYLOAD_API_URL! })
 * const page = await client.getPageBySlug(slug === '/' ? 'home' : slug)
 */

