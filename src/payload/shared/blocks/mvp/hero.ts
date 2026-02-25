import type { Block } from 'payload'

/**
 * MVP hero block.
 *
 * Note: This block relates to `media` for background images. This starter's core module
 * includes a `media` upload collection, so keeping this relationship improves editor UX.
 */
export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'headline',
      label: 'Headline',
      type: 'text',
      required: true,
    },
    {
      name: 'subheadline',
      label: 'Subheadline',
      type: 'textarea',
    },
    {
      name: 'primaryButton',
      label: 'Primary Button',
      type: 'group',
      admin: {
        description: 'Optional. If provided, frontends should render a primary CTA button.',
      },
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
        },
        {
          name: 'href',
          label: 'Href',
          type: 'text',
          admin: {
            description: 'Relative (e.g. /contact) or absolute URL.',
          },
        },
      ],
    },
    {
      name: 'secondaryButton',
      label: 'Secondary Button',
      type: 'group',
      admin: {
        description: 'Optional. If provided, frontends should render a secondary CTA button.',
      },
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
        },
        {
          name: 'href',
          label: 'Href',
          type: 'text',
          admin: {
            description: 'Relative (e.g. /learn-more) or absolute URL.',
          },
        },
      ],
    },
    {
      name: 'backgroundImage',
      label: 'Background Image',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: 'Optional. Background/cover image for the hero.',
      },
    },
  ],
}

