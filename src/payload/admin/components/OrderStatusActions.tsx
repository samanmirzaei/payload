'use client'

import React, { useCallback, useMemo, useState } from 'react'

import { toast, useConfig, useTranslation } from '@payloadcms/ui'

type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'fulfilled'

type Props = {
  // Provided by Payload server props when rendered as a view action
  collectionSlug?: string
  doc?: {
    id?: unknown
    status?: unknown
    orderNumber?: unknown
  }
}

function getServerURL(configServerURL?: string): string {
  if (configServerURL) return configServerURL
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export default function OrderStatusActions(props: Props) {
  const { config } = useConfig()
  const { i18n } = useTranslation()

  const lang = i18n?.language === 'fa' ? 'fa' : 'en'

  if (props.collectionSlug !== 'orders') return null

  const orderID = typeof props.doc?.id === 'string' || typeof props.doc?.id === 'number' ? String(props.doc.id) : null
  const status = (props.doc?.status as OrderStatus | undefined) ?? undefined
  const orderNumber = typeof props.doc?.orderNumber === 'string' ? props.doc.orderNumber : undefined

  const serverURL = getServerURL(config?.serverURL)

  const labels = useMemo(() => {
    const title = orderNumber ? `#${orderNumber}` : ''
    return {
      markPaid: lang === 'fa' ? 'تغییر به پرداخت‌شده' : 'Mark Paid',
      markFulfilled: lang === 'fa' ? 'تغییر به انجام‌شده' : 'Mark Fulfilled',
      markCancelled: lang === 'fa' ? 'تغییر به لغو‌شده' : 'Mark Cancelled',
      confirmPaid:
        lang === 'fa'
          ? `وضعیت سفارش ${title} به «پرداخت‌شده» تغییر کند؟ (موجودی کم می‌شود)`
          : `Mark order ${title} as paid? (will decrement stock)`,
      confirmFulfilled:
        lang === 'fa' ? `وضعیت سفارش ${title} به «انجام‌شده» تغییر کند؟` : `Mark order ${title} as fulfilled?`,
      confirmCancelled:
        lang === 'fa' ? `وضعیت سفارش ${title} به «لغو‌شده» تغییر کند؟` : `Mark order ${title} as cancelled?`,
      updated: lang === 'fa' ? 'وضعیت سفارش به‌روزرسانی شد.' : 'Order status updated.',
      missing: lang === 'fa' ? 'شناسه سفارش پیدا نشد.' : 'Order id is missing.',
      failed: lang === 'fa' ? 'به‌روزرسانی وضعیت ناموفق بود.' : 'Failed to update status.',
    }
  }, [lang, orderNumber])

  const [isLoading, setIsLoading] = useState(false)

  const patchStatus = useCallback(
    async (nextStatus: OrderStatus) => {
      if (!orderID) {
        toast.error(labels.missing)
        return
      }

      setIsLoading(true)
      try {
        const res = await fetch(`${serverURL}/api/orders/${orderID}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ status: nextStatus }),
        })

        if (!res.ok) {
          const json = await res.json().catch(() => null)
          const message = (json as any)?.errors?.[0]?.message || (json as any)?.message || labels.failed
          toast.error(String(message))
          return
        }

        toast.success(labels.updated)
        // Reload to reflect updated status and appended history.
        window.location.reload()
      } catch {
        toast.error(labels.failed)
      } finally {
        setIsLoading(false)
      }
    },
    [labels.failed, labels.missing, labels.updated, orderID, serverURL],
  )

  const markPaid = useCallback(() => {
    if (window.confirm(labels.confirmPaid)) void patchStatus('paid')
  }, [labels.confirmPaid, patchStatus])

  const markFulfilled = useCallback(() => {
    if (window.confirm(labels.confirmFulfilled)) void patchStatus('fulfilled')
  }, [labels.confirmFulfilled, patchStatus])

  const markCancelled = useCallback(() => {
    if (window.confirm(labels.confirmCancelled)) void patchStatus('cancelled')
  }, [labels.confirmCancelled, patchStatus])

  const disabledPaid = isLoading || status === 'paid'
  const disabledFulfilled = isLoading || status === 'fulfilled'
  const disabledCancelled = isLoading || status === 'cancelled'

  return (
    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <button type="button" className="admin-actions__btn" disabled={disabledPaid} onClick={markPaid}>
        {labels.markPaid}
      </button>
      <button type="button" className="admin-actions__btn" disabled={disabledFulfilled} onClick={markFulfilled}>
        {labels.markFulfilled}
      </button>
      <button type="button" className="admin-actions__btn" disabled={disabledCancelled} onClick={markCancelled}>
        {labels.markCancelled}
      </button>
    </div>
  )
}

