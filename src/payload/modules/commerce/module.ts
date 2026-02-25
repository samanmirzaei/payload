import type { PayloadModule } from '../types'

import { collections } from './collections'
import { globals } from './globals'
import { blocks } from './blocks'

export const CommerceModule = {
  name: 'commerce',
  collections,
  globals,
  blocks,
} satisfies PayloadModule

