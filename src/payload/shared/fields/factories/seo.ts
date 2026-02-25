import type { Field } from 'payload'

export type SeoFieldOptions = {
  /**
   * Customize the group name to avoid collisions.
   */
  name?: string
  label?: string
}

/**
 * SEO-first: generic, reusable meta fields that can be composed into any collection/global.
 * Avoids business assumptions (no hardcoded site name, brand tone, etc.).
 */
export const seoFields = (options: SeoFieldOptions = {}): Field => {
  const groupName = options.name ?? 'seo'

  return {
    name: groupName,
    label: options.label ?? 'SEO',
    type: 'group',
    fields: [
      {
        name: 'metaTitle',
        type: 'text',
        admin: {
          description: 'Suggested: <= 60 characters. Used for the document title and search results.',
        },
      },
      {
        name: 'metaDescription',
        type: 'textarea',
        admin: {
          description: 'Suggested: <= 160 characters. Used for search snippets.',
        },
      },
      {
        name: 'canonicalUrl',
        type: 'text',
        admin: {
          description: 'Absolute URL preferred when set (e.g. https://example.com/path).',
        },
      },
      {
        name: 'noIndex',
        type: 'checkbox',
        defaultValue: false,
        admin: {
          description: 'If enabled, frontends should render: <meta name="robots" content="noindex" />',
        },
      },
      {
        name: 'noFollow',
        type: 'checkbox',
        defaultValue: false,
        admin: {
          description: 'If enabled, frontends should render: <meta name="robots" content="nofollow" />',
        },
      },
      {
        name: 'openGraph',
        label: 'Open Graph',
        type: 'group',
        fields: [
          {
            name: 'title',
            type: 'text',
            admin: {
              description: 'If blank, frontends can fallback to metaTitle.',
            },
          },
          {
            name: 'description',
            type: 'textarea',
            admin: {
              description: 'If blank, frontends can fallback to metaDescription.',
            },
          },
          /**
           * TODO (later): switch to a relationship to a shared `media` upload collection.
           * Keeping this as a URL avoids coupling Step 1 to any storage implementation.
           */
          {
            name: 'imageUrl',
            type: 'text',
            admin: {
              description:
                'Temporary: URL string. TODO: replace with media relationship once a Media module exists.',
            },
          },
        ],
      },
      {
        name: 'twitter',
        label: 'Twitter',
        type: 'group',
        fields: [
          {
            name: 'title',
            type: 'text',
            admin: {
              description: 'If blank, frontends can fallback to metaTitle.',
            },
          },
          {
            name: 'description',
            type: 'textarea',
            admin: {
              description: 'If blank, frontends can fallback to metaDescription.',
            },
          },
          {
            name: 'card',
            type: 'select',
            defaultValue: 'summary_large_image',
            options: ['summary', 'summary_large_image'],
          },
          /**
           * TODO (later): switch to a relationship to a shared `media` upload collection.
           */
          {
            name: 'imageUrl',
            type: 'text',
            admin: {
              description:
                'Temporary: URL string. TODO: replace with media relationship once a Media module exists.',
            },
          },
        ],
      },
    ],
  }
}
