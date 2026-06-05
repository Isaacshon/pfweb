import { createHmac } from 'crypto'

export type DailyVisitRecord = {
  date: string
  uniqueVisitors: number
  visits: number
  visitors: Record<string, {
    firstSeenAt: string
    lastSeenAt: string
    path: string
  }>
}

export function getTorontoDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const year = parts.find((part) => part.type === 'year')?.value || '1970'
  const month = parts.find((part) => part.type === 'month')?.value || '01'
  const day = parts.find((part) => part.type === 'day')?.value || '01'

  return `${year}-${month}-${day}`
}

export function getAnalyticsSettingKey(dateKey: string) {
  return `analytics_daily_${dateKey}`
}

export function hashVisitorId(visitorId: string) {
  const secret = process.env.SITE_ADMIN_SESSION_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || 'pf-analytics'

  return createHmac('sha256', secret)
    .update(visitorId)
    .digest('hex')
}

export function normalizeDailyVisitRecord(value: unknown, dateKey: string): DailyVisitRecord {
  if (!value || typeof value !== 'object') {
    return {
      date: dateKey,
      uniqueVisitors: 0,
      visits: 0,
      visitors: {},
    }
  }

  const record = value as Partial<DailyVisitRecord>
  const visitors = record.visitors && typeof record.visitors === 'object'
    ? record.visitors
    : {}

  return {
    date: typeof record.date === 'string' ? record.date : dateKey,
    uniqueVisitors: typeof record.uniqueVisitors === 'number'
      ? record.uniqueVisitors
      : Object.keys(visitors).length,
    visits: typeof record.visits === 'number' ? record.visits : 0,
    visitors,
  }
}
