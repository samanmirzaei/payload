import type { CollectionConfig } from 'payload'

import { Users } from './users'
import { Media } from './media'
import { Categories } from './categories'
import { Pages } from './pages'
import { Posts } from './posts'

// Ordering here influences sidebar ordering within admin groups.
export const collections: CollectionConfig[] = [Pages, Posts, Categories, Media, Users]
