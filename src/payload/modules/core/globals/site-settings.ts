import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'

/**
 * Site-wide settings used across any frontend (corporate or ecommerce).
 * Keep this strictly business-agnostic and broadly reusable.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description: 'General site identity and contact details used across frontends.',
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'siteName',
      label: 'Site Name',
      type: 'text',
      required: true,
      admin: {
        description: 'Displayed in various places (e.g. header, footer, metadata defaults).',
      },
    },
    {
      name: 'siteUrl',
      label: 'Site URL',
      type: 'text',
      admin: {
        description:
          'Canonical base URL (e.g. https://example.com). TODO: add URL validation in a later step.',
      },
    },
    {
      name: 'defaultLanguage',
      label: 'Default Language',
      type: 'text',
      admin: {
        description: 'BCP 47 language tag recommended (e.g. en, en-US).',
      },
    },
    {
      name: 'contactEmail',
      label: 'Contact Email',
      type: 'email',
      admin: {
        description: 'Optional. Used for site-wide contact links or transactional email defaults.',
      },
    },
    {
      name: 'contactPhone',
      label: 'Contact Phone',
      type: 'text',
      admin: {
        description: 'Optional. Store as display-friendly text (frontends can normalize if needed).',
      },
    },
    {
      name: 'socialLinks',
      label: 'Social Links',
      type: 'array',
      admin: {
        description: 'Used for site-wide social icons/links.',
      },
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
          admin: {
            description: 'Example: LinkedIn, X, Instagram, GitHub.',
          },
        },
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
}
