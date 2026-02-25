import type { GlobalConfig } from 'payload'

import { adminOrEditor, publicRead } from '../../../shared/access'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    description: 'Site-wide header content (navigation, announcements).',
  },
  access: {
    read: publicRead,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'announcementText',
      label: 'Announcement Text',
      type: 'text',
      admin: {
        description: 'Optional short announcement (frontends decide how/when to display).',
      },
    },
    {
      name: 'navigationItems',
      label: 'Navigation Items',
      type: 'array',
      admin: {
        description: 'Primary navigation used by frontends.',
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
            description: 'Relative (e.g. /about) or absolute URL.',
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
  ],
}
