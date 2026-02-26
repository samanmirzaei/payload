import type { CollectionConfig } from 'payload'

import { ProductCategories } from './product-categories'
import { Products } from './products'

// Ordering here influences sidebar ordering within admin groups.
export const collections: CollectionConfig[] = [Products, ProductCategories]
