import type { CollectionConfig } from 'payload'

import { adminOnly, adminOrSelf, allowFirstUserOr } from '../../../shared/access'
import { adminText, tr } from '../../../shared/i18n'

/**
 * Minimal Users collection required for Payload Admin authentication.
 * Keep this business-agnostic; module-specific roles/permissions can be layered later.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: adminText.collections.users.singular,
    plural: adminText.collections.users.plural,
  },
  auth: true,
  admin: {
    group: adminText.groups.users,
    useAsTitle: 'email',
    description: tr('Admin users and roles.', 'کاربران پنل مدیریت و نقش‌های دسترسی.'),
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
      label: tr('Name', 'نام'),
      type: 'text',
    },
    {
      name: 'role',
      label: tr('Role', 'نقش'),
      type: 'select',
      required: true,
      defaultValue: 'admin',
      saveToJWT: true,
      options: [
        { label: tr('Admin', 'مدیر'), value: 'admin' },
        { label: tr('Editor', 'ویرایشگر'), value: 'editor' },
      ],
      admin: {
        description: tr(
          'Roles (MVP). TODO: add more roles and stricter policies per project.',
          'نقش‌ها (MVP). TODO: در هر پروژه نقش‌های بیشتر و سیاست‌های دقیق‌تر اضافه شود.',
        ),
      },
    },
  ],
}

