import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Public Orders create endpoint (optional).
 *
 * Security:
 * - Requires header `X-ORDER-SECRET` to match `process.env.ORDER_SECRET`.
 * - Uses `overrideAccess: true` to bypass normal auth (the shared secret is the gate).
 *
 * Usage example:
 * - `curl -X POST -H "Content-Type: application/json" -H "X-ORDER-SECRET: $ORDER_SECRET" \`
 *   `-d '{"customer":{"name":"Test","phone":"000"},"items":[{"product":"<id>","quantity":1,"unitPrice":10,"titleSnapshot":"Test"}]}' \`
 *   `http://localhost:3000/api/public/orders`
 */
export async function POST(req: Request): Promise<Response> {
  const expected = process.env.ORDER_SECRET
  if (!expected) {
    return Response.json({ error: 'ORDER_SECRET is not configured.' }, { status: 500 })
  }

  const provided = req.headers.get('x-order-secret')
  if (!provided || provided !== expected) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const body = await req.json().catch(() => ({}))

  // Safe default: force pending status for public creates.
  const data = { ...(body ?? {}), status: 'pending' }

  const created = await payload.create({
    collection: 'orders',
    data,
    overrideAccess: true,
    depth: 0,
  })

  return Response.json(created, { status: 201 })
}

