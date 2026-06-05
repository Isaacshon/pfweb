import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/adminSession'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'
import {
  getAnalyticsSettingKey,
  getTorontoDateKey,
  normalizeDailyVisitRecord,
} from '@/lib/siteAnalytics'

export const runtime = 'nodejs'

export async function GET() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value
  if (!verifyAdminSessionToken(token)) {
    return Response.json(
      { ok: false, message: 'Admin session expired. Re-enter the admin passcode from the Contact page.' },
      { status: 401 }
    )
  }

  const { client, error: configError } = getSupabaseAdminClient()
  if (!client) {
    return Response.json({ ok: false, message: configError }, { status: 503 })
  }

  const dateKey = getTorontoDateKey()
  const analyticsKey = getAnalyticsSettingKey(dateKey)
  const { data, error } = await client
    .from('site_settings')
    .select('value')
    .eq('key', analyticsKey)
    .maybeSingle()

  if (error) {
    return Response.json({ ok: false, message: error.message }, { status: 502 })
  }

  const record = normalizeDailyVisitRecord(data?.value, dateKey)
  return Response.json({
    ok: true,
    date: dateKey,
    todayVisitors: record.uniqueVisitors,
    totalVisitEvents: record.visits,
  })
}
