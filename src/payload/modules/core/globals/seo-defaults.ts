import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'

/**
 * Site-wide SEO defaults.
 * This is intentionally distinct from per-page SEO fields (e.g. `seoFields()`), because defaults
 * often include templates and organization/schema data.
 */
export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO Defaults',
  admin: {
    description: 'Fallback SEO values applied by frontends when page-level SEO fields are empty.',
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'defaultTitle',
      label: 'Default Title',
      type: 'text',
      admin: {
        description: 'Used when a page does not provide a meta title.',
      },
    },
    {
      name: 'titleTemplate',
      label: 'Title Template',
      type: 'text',
      admin: {
        description: 'Example: %s | Brand (where %s is replaced with the page title).',
      },
    },
    {
      name: 'defaultMetaDescription',
      label: 'Default Meta Description',
      type: 'textarea',
      admin: {
        description: 'Used when a page does not provide a meta description.',
      },
    },
    /**
     * TODO (later): switch to a relationship to a shared `media` upload collection.
     * Keeping this as a URL avoids coupling to storage implementation in early steps.
     */
    {
      name: 'defaultOgImageUrl',
      label: 'Default OG Image URL',
      type: 'text',
      admin: {
        description:
          'Temporary: URL string. TODO: replace with media relationship once a Media module exists.',
      },
    },
    {
      name: 'robots',
      label: 'Robots Defaults',
      type: 'group',
      fields: [
        {
          name: 'noIndex',
          label: 'Default noindex',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'If enabled, frontends should default to noindex unless overridden per-page.',
          },
        },
        {
          name: 'noFollow',
          label: 'Default nofollow',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'If enabled, frontends should default to nofollow unless overridden per-page.',
          },
        },
      ],
    },
    {
      name: 'organization',
      label: 'Organization Schema',
      type: 'group',
      admin: {
        description: 'Basic Organization schema fields used by frontends for structured data.',
      },
      fields: [
        {
          name: 'name',
          label: 'Organization Name',
          type: 'text',
          admin: {
            description: 'Often matches Site Settings → Site Name.',
          },
        },
        /**
         * TODO (later): switch to a relationship to a shared `media` upload collection.
         */
        {
          name: 'logoUrl',
          label: 'Logo URL',
          type: 'text',
          admin: {
            description:
              'Temporary: URL string. TODO: replace with media relationship once a Media module exists.',
          },
        },
        {
          name: 'sameAsLinks',
          label: 'Same As Links',
          type: 'array',
          admin: {
            description: 'URLs for social profiles (used by schema.org Organization.sameAs).',
          },
          fields: [
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              required: true,
              admin: {
                description: 'Absolute URL recommended.',
              },
            },
          ],
        },
      ],
    },
  ],
}
