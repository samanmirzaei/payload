import type { CollectionConfig } from 'payload'

import { adminOnly, adminOrSelf, allowFirstUserOr } from '../../../shared/access'

/**
 * Minimal Users collection required for Payload Admin authentication.
 * Keep this business-agnostic; module-specific roles/permissions can be layered later.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'کاربر',
    plural: 'کاربران',
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    description: 'کاربران پنل مدیریت و نقش‌های دسترسی.',
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
      label: 'نام',
      type: 'text',
    },
    {
      name: 'role',
      label: 'نقش',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      saveToJWT: true,
      options: [
        { label: 'مدیر', value: 'admin' },
        { label: 'ویرایشگر', value: 'editor' },
      ],
      admin: {
        description:
          'نقش‌ها (MVP). TODO: در هر پروژه نقش‌های بیشتر و سیاست‌های دقیق‌تر اضافه شود.',
      },
    },
  ],
}
