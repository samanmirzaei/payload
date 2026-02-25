'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { rtlLanguages } from '@payloadcms/translations'
import { useConfig, useTranslation } from '@payloadcms/ui'

type AdminLanguage = 'en' | 'fa'
type AdminTheme = 'dark' | 'light'

const languageStorageKey = 'payload-admin-language'
const themeStorageKey = 'payload-admin-theme'

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const cookies = document.cookie.split(';').map((c) => c.trim())
  const match = cookies.find((c) => c.startsWith(`${name}=`))
  if (!match) return undefined
  return decodeURIComponent(match.slice(name.length + 1))
}

function setCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`
}

function applyDocumentLanguage(language: AdminLanguage): void {
  if (typeof document === 'undefined') return

  const isRTL = (rtlLanguages as unknown as string[]).includes(language)
  document.documentElement.setAttribute('lang', language)
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
}

function applyTheme(theme: AdminTheme): void {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
}

export default function AdminActions() {
  const { config } = useConfig()
  const { i18n } = useTranslation()

  const cookiePrefix = config?.cookiePrefix || 'payload'
  const lngCookieName = `${cookiePrefix}-lng`
  const themeCookieName = `${cookiePrefix}-theme`

  const [language, setLanguage] = useState<AdminLanguage>('fa')
  const [theme, setTheme] = useState<AdminTheme>('light')

  const labels = useMemo(() => {
    const isFA = language === 'fa'
    return {
      english: 'English',
      persian: 'فارسی',
      themeDark: isFA ? 'تیره' : 'Dark',
      themeLight: isFA ? 'روشن' : 'Light',
    }
  }, [language])

  useEffect(() => {
    // Preference order: localStorage -> cookie -> current i18n language -> default (fa)
    const storedLang = (localStorage.getItem(languageStorageKey) as AdminLanguage | null) ?? undefined
    const cookieLang = (getCookie(lngCookieName) as AdminLanguage | undefined) ?? undefined
    const i18nLang = (i18n?.language as AdminLanguage | undefined) ?? undefined

    const resolvedLang: AdminLanguage = storedLang === 'en' || storedLang === 'fa'
      ? storedLang
      : cookieLang === 'en' || cookieLang === 'fa'
        ? cookieLang
        : i18nLang === 'en' || i18nLang === 'fa'
          ? i18nLang
          : 'fa'

    setLanguage(resolvedLang)
    applyDocumentLanguage(resolvedLang)

    const storedTheme = (localStorage.getItem(themeStorageKey) as AdminTheme | null) ?? undefined
    const cookieTheme = (getCookie(themeCookieName) as AdminTheme | undefined) ?? undefined
    const domTheme = (document.documentElement.getAttribute('data-theme') as AdminTheme | null) ?? undefined

    const resolvedTheme: AdminTheme = storedTheme === 'dark' || storedTheme === 'light'
      ? storedTheme
      : cookieTheme === 'dark' || cookieTheme === 'light'
        ? cookieTheme
        : domTheme === 'dark' || domTheme === 'light'
          ? domTheme
          : 'light'

    setTheme(resolvedTheme)
    applyTheme(resolvedTheme)
  }, [i18n?.language, lngCookieName, themeCookieName])

  const setLanguageAndPersist = useCallback(
    async (nextLanguage: AdminLanguage) => {
      setLanguage(nextLanguage)
      localStorage.setItem(languageStorageKey, nextLanguage)
      setCookie(lngCookieName, nextLanguage)
      applyDocumentLanguage(nextLanguage)

      // Keep Payload's internal i18n in sync. Reload ensures server-rendered admin layout uses the new language/dir.
      await i18n?.changeLanguage?.(nextLanguage)
      window.location.reload()
    },
    [i18n, lngCookieName],
  )

  const toggleTheme = useCallback(() => {
    const nextTheme: AdminTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem(themeStorageKey, nextTheme)
    setCookie(themeCookieName, nextTheme)
    applyTheme(nextTheme)
  }, [theme, themeCookieName])

  return (
    <div className="admin-actions" aria-label="Admin UI actions">
      <div className="admin-actions__lang" role="group" aria-label="Language">
        <button
          type="button"
          className={`admin-actions__btn ${language === 'fa' ? 'is-active' : ''}`}
          onClick={() => void setLanguageAndPersist('fa')}
        >
          {labels.persian}
        </button>
        <span className="admin-actions__sep">/</span>
        <button
          type="button"
          className={`admin-actions__btn ${language === 'en' ? 'is-active' : ''}`}
          onClick={() => void setLanguageAndPersist('en')}
        >
          {labels.english}
        </button>
      </div>

      <button type="button" className="admin-actions__btn admin-actions__theme" onClick={toggleTheme}>
        {theme === 'dark' ? labels.themeLight : labels.themeDark}
      </button>
    </div>
  )
}

