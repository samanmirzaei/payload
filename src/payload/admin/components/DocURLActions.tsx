'use client'

import React, { useCallback, useMemo } from 'react'

import { useConfig, useTranslation, toast } from '@payloadcms/ui'

import { getPublicPathForDoc, joinURL } from '../utils/publicUrls'

type Props = {
  // Provided by Payload server props when rendered as a view action
  collectionSlug?: string
  doc?: {
    slug?: unknown
  }
}

export default function DocURLActions(props: Props) {
  const { config } = useConfig()
  const { i18n } = useTranslation()

  const lang = i18n?.language === 'fa' ? 'fa' : 'en'

  const serverURL = config?.serverURL
  const publicPath = getPublicPathForDoc({
    collectionSlug: props.collectionSlug,
    doc: props.doc as any,
  })

  const publicURL = useMemo(() => {
    if (!serverURL || !publicPath) return null
    return joinURL(serverURL, publicPath)
  }, [publicPath, serverURL])

  const labels = useMemo(() => {
    const missingBaseURL =
      lang === 'fa'
        ? 'برای استفاده از پیش‌نمایش، متغیر PAYLOAD_PUBLIC_SERVER_URL را تنظیم کنید.'
        : 'Set PAYLOAD_PUBLIC_SERVER_URL to enable public URL actions.'

    return {
      missingBaseURL,
      open: lang === 'fa' ? 'باز کردن لینک' : 'Open URL',
      copy: lang === 'fa' ? 'کپی لینک' : 'Copy URL',
      copied: lang === 'fa' ? 'لینک کپی شد' : 'URL copied',
      cannotBuild: lang === 'fa' ? 'نامک (slug) برای این سند تنظیم نشده است.' : 'This document has no slug set.',
    }
  }, [lang])

  const openURL = useCallback(() => {
    if (!serverURL) {
      toast.error(labels.missingBaseURL)
      return
    }
    if (!publicURL) {
      toast.error(labels.cannotBuild)
      return
    }
    window.open(publicURL, '_blank', 'noopener,noreferrer')
  }, [labels, publicURL, serverURL])

  const copyURL = useCallback(async () => {
    if (!serverURL) {
      toast.error(labels.missingBaseURL)
      return
    }
    if (!publicURL) {
      toast.error(labels.cannotBuild)
      return
    }

    try {
      await navigator.clipboard.writeText(publicURL)
      toast.success(labels.copied)
    } catch {
      // Fallback for older browsers / restricted clipboard environments
      const textarea = document.createElement('textarea')
      textarea.value = publicURL
      textarea.setAttribute('readonly', 'true')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      toast.success(labels.copied)
    }
  }, [labels, publicURL, serverURL])

  // If we're not in one of the supported collections, render nothing.
  if (!['pages', 'posts', 'products'].includes(props.collectionSlug ?? '')) return null

  const disabled = !serverURL || !publicURL

  return (
    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <button
        type="button"
        className="admin-actions__btn"
        title={disabled ? labels.missingBaseURL : labels.open}
        onClick={openURL}
      >
        {labels.open}
      </button>
      <button
        type="button"
        className="admin-actions__btn"
        title={disabled ? labels.missingBaseURL : labels.copy}
        onClick={() => void copyURL()}
      >
        {labels.copy}
      </button>
      {!serverURL ? (
        <span style={{ fontSize: 12, opacity: 0.8 }}>{labels.missingBaseURL}</span>
      ) : null}
    </div>
  )
}

