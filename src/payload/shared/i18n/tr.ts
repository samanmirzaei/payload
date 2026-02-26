export type AdminLanguageCode = 'en' | 'fa'

export type TranslatedString = Record<AdminLanguageCode, string>

export const tr = (en: string, fa: string): TranslatedString => ({ en, fa })

