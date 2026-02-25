import type { ReactNode } from 'react'
import type { ServerFunctionClient } from 'payload'

import { importMap } from './admin/importMap.js'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'

import './custom.scss'

const serverFunction: ServerFunctionClient = async (args) => {
  'use server'

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  } as any)
}

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <RootLayout
      config={config as any}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
