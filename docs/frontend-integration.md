# Frontend integration (Next.js-friendly examples)

This repo is a **Payload backend starter**. It intentionally does **not** ship a frontend app.
Use the examples below to connect one (or many) Next.js frontends to this backend.

## Environment variables (frontend)

- `PAYLOAD_API_URL` (required)
  - Example: `http://localhost:3000`
  - Used by these examples as the base for REST requests.
- Optional (future): `PAYLOAD_API_TOKEN`
  - If you later tighten public read access, pass a token via `Authorization: users API-Key <token>` or another strategy.

## REST as the primary integration style

These examples use Payload’s REST API because it works cleanly across:
- multiple Next.js apps
- server components / route handlers
- purchased templates

Alternative (brief): a Next.js app co-located with Payload can use the **local API** via `payload.find(...)` etc.

## Slug-based routing conventions

- Pages: `pages` collection
  - Suggested routes:
    - `/` maps to `slug = "home"`
    - `/:slug` maps to `slug = "<slug>"`
- Posts: `posts` collection
  - Suggested route: `/blog/:slug`
- Products (optional commerce module): `products` collection
  - Suggested route: `/products/:slug`

## Block rendering guidance (layout[])

`pages.layout`, `posts.layout`, and `products.layout` are **Payload blocks**.
Each item has a `blockType` plus block-specific fields.

Recommended pattern:
- maintain a registry of renderers keyed by `blockType`
- safely handle unknown blocks (log + skip; or render a fallback)

See: `examples/nextjs/blocks.ts`

## SEO mapping guidance (Next.js Metadata API)

Collections use `seoFields()`:
- `seo.metaTitle`, `seo.metaDescription`, `seo.canonicalUrl`
- `seo.noIndex`, `seo.noFollow`
- `seo.openGraph.*`, `seo.twitter.*`

Globals include SEO defaults:
- `seo-defaults.defaultTitle`, `seo-defaults.titleTemplate`, `seo-defaults.defaultMetaDescription`
- `seo-defaults.defaultOgImageUrl`
- `seo-defaults.robots.*`

Suggested fallback order:
1) page/post/product `seo.*`
2) `seo-defaults.*`
3) `site-settings.siteName` (final fallback for titles if desired)

See: `examples/nextjs/seo.ts`

## Access assumptions (MVP)

The starter defaults to:
- public read for content + globals
- admin/editor write for staff

Future tightening path:
- when you enable drafts/versioning and “published-only” public access, frontends should query:
  - `where[status][equals]=published`

## Commerce optionality

Commerce is an optional module. A frontend should:
- treat product routes and queries as optional
- handle missing endpoints gracefully (e.g. 404 for `/api/products`)

See: `examples/nextjs/payload-rest.ts`

