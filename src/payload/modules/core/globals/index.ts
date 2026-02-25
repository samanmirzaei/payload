import type { GlobalConfig } from 'payload'

import { SiteSettings } from './site-settings'
import { Header } from './header'
import { Footer } from './footer'
import { SeoDefaults } from './seo-defaults'

export const globals: GlobalConfig[] = [SiteSettings, SeoDefaults, Header, Footer]

