import type { CollectionConfig } from 'payload'

import { Users } from './users'
import { Media } from './media'
import { Categories } from './categories'
import { Pages } from './pages'
import { Posts } from './posts'

export const collections: CollectionConfig[] = [Users, Media, Categories, Pages, Posts]
