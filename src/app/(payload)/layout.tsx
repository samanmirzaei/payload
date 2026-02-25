import type { ReactNode } from 'react'

import { importMap } from './admin/importMap.js'
import { RootLayout as PayloadRootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'

import './custom.scss'

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <PayloadRootLayout
      config={Promise.resolve(config as any)}
      importMap={importMap}
      serverFunction={handleServerFunctions as any}
    >
      {children}
    </PayloadRootLayout>
  )
}
