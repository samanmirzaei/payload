import type { CollectionConfig } from 'payload'

import { Orders } from './orders'
import { ProductCategories } from './product-categories'
import { Products } from './products'

// Ordering here influences sidebar ordering within admin groups.
export const collections: CollectionConfig[] = [Products, ProductCategories, Orders]
