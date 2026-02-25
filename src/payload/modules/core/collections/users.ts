import type { CollectionConfig } from 'payload'

import { adminOnly, adminOrSelf, allowFirstUserOr } from '../../../shared/access'

/**
 * Minimal Users collection required for Payload Admin authentication.
 * Keep this business-agnostic; module-specific roles/permissions can be layered later.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: adminOrSelf,
    create: allowFirstUserOr(adminOnly),
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        description:
          'MVP roles. TODO: extend roles and add fine-grained policies per project (clients, teams, etc.).',
      },
    },
  ],
}
