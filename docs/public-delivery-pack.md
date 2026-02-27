# Public Delivery Pack (read-only endpoints)

These endpoints are **read-only** helpers for connecting Next.js (or any frontend) to this Payload backend.

They are implemented as Next.js Route Handlers under `src/app/(payload)/api/public/*`.

## Public read mode

Set `PUBLIC_READ_MODE`:
- `published`: public endpoints only return docs where `status='published'` (Pages/Posts/Products)
- `all`: public endpoints return all docs (useful in development)

Default behavior:
- `development`: `all`
- `production`: `published`

## Endpoints

### Page by slug
- `GET /api/public/pages/:slug`

Example:
```bash
curl http://localhost:3000/api/public/pages/home
```

### Posts list
- `GET /api/public/posts?page=1&limit=10&category=news&q=welcome`
  - `category` can be a category `slug` or `id`

Example:
```bash
curl "http://localhost:3000/api/public/posts?page=1&limit=10"
curl "http://localhost:3000/api/public/posts?category=news"
curl "http://localhost:3000/api/public/posts?q=welcome"
```

### Post by slug
- `GET /api/public/posts/:slug`

Example:
```bash
curl http://localhost:3000/api/public/posts/welcome
```

### Products list (only if commerce enabled)
- `GET /api/public/products?page=1&limit=12&category=apparel&q=tee`
  - `category` can be a product category `slug` or `id`

Example:
```bash
curl "http://localhost:3000/api/public/products?page=1&limit=12"
curl "http://localhost:3000/api/public/products?category=apparel"
curl "http://localhost:3000/api/public/products?q=tee"
```

### Product by slug (only if commerce enabled)
- `GET /api/public/products/:slug`

Example:
```bash
curl http://localhost:3000/api/public/products/basic-tee
```

## Response shape (high-level)

Each endpoint returns:
- `doc` (core fields)
- `seo` (resolved SEO: doc SEO merged with `seo-defaults` global)
- `layout` blocks are included in `doc.layout` where applicable

Note: product `variants[].stock` is intentionally omitted from public responses.

