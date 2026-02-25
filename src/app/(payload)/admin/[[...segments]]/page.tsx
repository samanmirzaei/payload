import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  const paramsPromise = params.then((p) => ({ segments: p.segments ?? [] }))

  return generatePageMetadata({
    config: Promise.resolve(config as any),
    params: paramsPromise as any,
    searchParams: searchParams as any,
  })
}

const Page = async ({ params, searchParams }: Args) => {
  const paramsPromise = params.then((p) => ({ segments: p.segments ?? [] }))

  return RootPage({
    config: Promise.resolve(config as any),
    importMap,
    params: paramsPromise,
    searchParams,
  })
}

export default Page
