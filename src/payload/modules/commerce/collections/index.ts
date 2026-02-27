import type { CollectionConfig } from 'payload'

import { Orders } from './orders'
import { ProductCategories } from './product-categories'
import { Products } from './products'
import { projectConfig } from '../../../../project/project.config'

// Ordering here influences sidebar ordering within admin groups.
export const collections: CollectionConfig[] = [
  Products,
  ProductCategories,
  ...(projectConfig.enableOrders ? [Orders] : []),
]
