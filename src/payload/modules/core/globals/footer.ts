import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    description: 'Site-wide footer content (navigation, notes, legal).',
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'copyrightText',
      label: 'Copyright Text',
      type: 'text',
      admin: {
        description: 'Optional. Example: © 2026 Company Name. All rights reserved.',
      },
    },
    {
      name: 'footerNavigationItems',
      label: 'Footer Navigation Items',
      type: 'array',
      admin: {
        description: 'Secondary/footer navigation used by frontends.',
      },
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          label: 'Href',
          type: 'text',
          required: true,
          admin: {
            description: 'Relative (e.g. /privacy) or absolute URL.',
          },
        },
        {
          name: 'openInNewTab',
          label: 'Open In New Tab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'footerNote',
      label: 'Footer Note',
      type: 'textarea',
      admin: {
        description: 'Optional longer note (e.g. disclaimers, address, hours).',
      },
    },
  ],
}
