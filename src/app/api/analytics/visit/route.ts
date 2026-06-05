import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'
import {
  getAnalyticsSettingKey,
  getTorontoDateKey,
  hashVisitorId,
  normalizeDailyVisitRecord,
} from '@/lib/siteAnalytics'

export const runtime = 'nodejs'

function cleanPath(path: unknown) {
  if (typeof path !== 'string') return '/'
  const trimmed = path.trim()
  if (!trimmed || !trimmed.startsWith('/')) return '/'
  return trimmed.slice(0, 180)
}

export async function POST(request: Request) {
  const { client, error: configError } = getSupabaseAdminClient()
  if (!client) {
    return Response.json({ ok: false, message: configError }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 })
  }

  const visitorId = typeof body === 'object' && body && 'visitorId' in body
    ? String((body as { visitorId?: unknown }).visitorId || '').trim()
    : ''

  if (visitorId.length < 16 || visitorId.length > 128) {
    return Response.json({ ok: false, message: 'Invalid visitor id.' }, { status: 400 })
  }

  const dateKey = getTorontoDateKey()
  const analyticsKey = getAnalyticsSettingKey(dateKey)
  const visitorHash = hashVisitorId(visitorId)
  const path = cleanPath(typeof body === 'object' && body ? (body as { path?: unknown }).path : undefined)
  const now = new Date().toISOString()

  const { data, error: readError } = await client
    .from('site_settings')
    .select('value')
    .eq('key', analyticsKey)
    .maybeSingle()

  if (readError) {
    return Response.json({ ok: false, message: readError.message }, { status: 502 })
  }

  const record = normalizeDailyVisitRecord(data?.value, dateKey)
  const existingVisitor = record.visitors[visitorHash]
  const nextRecord = {
    ...record,
    uniqueVisitors: existingVisitor ? record.uniqueVisitors : record.uniqueVisitors + 1,
    visits: record.visits + 1,
    visitors: {
      ...record.visitors,
      [visitorHash]: {
        firstSeenAt: existingVisitor?.firstSeenAt || now,
        lastSeenAt: now,
        path,
      },
    },
  }

  const { error: writeError } = await client
    .from('site_settings')
    .upsert([{ key: analyticsKey, value: nextRecord }], { onConflict: 'key' })

  if (writeError) {
    return Response.json({ ok: false, message: writeError.message }, { status: 502 })
  }

  return Response.json({
    ok: true,
    counted: !existingVisitor,
    todayVisitors: nextRecord.uniqueVisitors,
    date: dateKey,
  })
}
