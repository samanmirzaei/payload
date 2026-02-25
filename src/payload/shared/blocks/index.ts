import type { Block } from 'payload'

import { HeroBlock } from './mvp/hero'
import { RichTextBlock } from './mvp/rich-text'
import { FAQBlock } from './mvp/faq'
import { CTABlock } from './mvp/cta'
import { GalleryBlock } from './mvp/gallery'

/**
 * Shared blocks used across modules live here.
 * Module-specific blocks belong under that module's `blocks/`.
 */
export { HeroBlock, RichTextBlock, FAQBlock, CTABlock, GalleryBlock }

/**
 * Reusable registry for "layout" fields on Pages/Posts now, and Products later.
 */
export const layoutBlocks: Block[] = [HeroBlock, RichTextBlock, FAQBlock, CTABlock, GalleryBlock]

