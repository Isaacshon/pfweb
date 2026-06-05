'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const VISITOR_ID_KEY = 'pf_visitor_id'
const VISIT_SENT_DATE_KEY = 'pf_visit_sent_date'

function getTorontoDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const year = parts.find((part) => part.type === 'year')?.value || '1970'
  const month = parts.find((part) => part.type === 'month')?.value || '01'
  const day = parts.find((part) => part.type === 'day')?.value || '01'

  return `${year}-${month}-${day}`
}

function getOrCreateVisitorId() {
  const existing = window.localStorage.getItem(VISITOR_ID_KEY)
  if (existing) return existing

  const nextId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  window.localStorage.setItem(VISITOR_ID_KEY, nextId)
  return nextId
}

export function VisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/app')) return

    try {
      const today = getTorontoDateKey()
      const sentDate = window.localStorage.getItem(VISIT_SENT_DATE_KEY)
      if (sentDate === today) return

      const visitorId = getOrCreateVisitorId()
      void fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, path: pathname }),
        keepalive: true,
      }).then((response) => {
        if (response.ok) {
          window.localStorage.setItem(VISIT_SENT_DATE_KEY, today)
        }
      })
    } catch {
      // Analytics should never block the public site experience.
    }
  }, [pathname])

  return null
}
