import type { Payload } from 'payload'

type FindByFieldArgs = {
  collection: string
  field: string
  value: string
}

export const findByField = async (
  payload: Payload,
  args: FindByFieldArgs,
): Promise<{ id: string } | null> => {
  const result = await payload.find({
    collection: args.collection as any,
    where: {
      [args.field]: {
        equals: args.value,
      },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const doc = result.docs?.[0] as { id?: string } | undefined
  return doc?.id ? { id: doc.id } : null
}

type UpsertByFieldArgs = {
  collection: string
  field: string
  value: string
  data: Record<string, unknown>
}

export const upsertByField = async <TDoc extends { id: string }>(
  payload: Payload,
  args: UpsertByFieldArgs,
): Promise<TDoc> => {
  const existing = await findByField(payload, args)

  if (existing?.id) {
    return (await payload.update({
      collection: args.collection as any,
      id: existing.id,
      data: args.data as any,
      depth: 0,
      overrideAccess: true,
    })) as TDoc
  }

  return (await payload.create({
    collection: args.collection as any,
    data: args.data as any,
    depth: 0,
    overrideAccess: true,
  })) as TDoc
}

