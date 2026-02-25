import type { PayloadModule } from '../types'

import { collections } from './collections'
import { globals } from './globals'
import { blocks } from './blocks'

export const CoreModule = {
  name: 'core',
  collections,
  globals,
  blocks,
} satisfies PayloadModule
