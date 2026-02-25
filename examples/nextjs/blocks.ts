/**
 * Block rendering guidance (no UI components here).
 *
 * Payload blocks come through as `layout[]` items with:
 * - `blockType` (string)
 * - plus block-specific fields
 *
 * Frontend pattern:
 * - define a renderer registry keyed by `blockType`
 * - for unknown blocks, fail soft (skip + log) so editors can work while frontends catch up
 */

export type LayoutBlock = {
  blockType: string
  [key: string]: unknown
}

export type BlockRenderer<TBlock extends LayoutBlock = LayoutBlock> = (block: TBlock) => unknown

export type BlockRendererRegistry = Record<string, BlockRenderer>

export const renderLayout = (layout: LayoutBlock[] | undefined | null, registry: BlockRendererRegistry) => {
  if (!layout || layout.length === 0) return []

  return layout
    .map((block) => {
      const renderer = registry[block.blockType]
      if (!renderer) {
        // Recommended: report to logging/observability and skip rendering.
        return null
      }
      return renderer(block)
    })
    .filter(Boolean)
}

/**
 * Example registry (pseudo-code; replace return values with your React components):
 *
 * export const registry: BlockRendererRegistry = {
 *   hero: (b) => <Hero {...b} />,
 *   richText: (b) => <RichText {...b} />,
 *   faq: (b) => <FAQ {...b} />,
 *   cta: (b) => <CTA {...b} />,
 *   gallery: (b) => <Gallery {...b} />,
 * }
 */

