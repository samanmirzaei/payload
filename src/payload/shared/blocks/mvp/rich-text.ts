import type { Block } from 'payload'

import { adminText, tr } from '../../i18n'

/**
 * MVP rich text block.
 *
 * Uses Payload Rich Text (Lexical).
 *
 * Backward compatibility:
 * - Older data stored `content` as a plain string (textarea).
 * - Field hooks below transform strings into a minimal Lexical JSON so the editor can display it.
 */
export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: adminText.blocks.richText.singular,
    plural: adminText.blocks.richText.plural,
  },
  fields: [
    {
      name: 'content',
      label: tr('Content', 'محتوا'),
      type: 'richText',
      admin: {
        description: tr(
          'Rich text content. Legacy plain-text values are automatically upgraded when you edit/save.',
          'محتوای متن غنی. مقادیر قدیمیِ متن ساده به‌صورت خودکار هنگام ویرایش/ذخیره ارتقا داده می‌شوند.',
        ),
      },
      hooks: {
        afterRead: [({ value }) => (typeof value === 'string' ? stringToLexical(value) : value)],
        beforeValidate: [({ value }) => (typeof value === 'string' ? stringToLexical(value) : value)],
        beforeChange: [({ value }) => (typeof value === 'string' ? stringToLexical(value) : value)],
      },
    },
  ],
}

function stringToLexical(text: string) {
  const cleaned = text.trim()

  // Minimal Lexical serialized editor state compatible with Payload's Lexical adapter.
  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: 'rtl', // editor will normalize based on document dir; this is a safe default
      children: cleaned
        ? [
            {
              type: 'paragraph',
              version: 1,
              format: '',
              indent: 0,
              direction: null,
              textFormat: 0,
              textStyle: '',
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: cleaned,
                  format: 0,
                  style: '',
                  mode: 'normal',
                  detail: 0,
                },
              ],
            },
          ]
        : [
            {
              type: 'paragraph',
              version: 1,
              format: '',
              indent: 0,
              direction: null,
              textFormat: 0,
              textStyle: '',
              children: [],
            },
          ],
    },
  }
}
