import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/adminSession'
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

const allowedSettingKeys = new Set([
  'page_content',
  'map_address',
  'hero_video',
  'about_image',
  'admin_settings',
])

type SiteSettingPayload = {
  key: string
  value: unknown
}

const defaultMenuHrefs = [
  '/conference',
  '/events',
  '/about',
  '/about',
  '/contact',
  '/contact',
]

function normalizePageContent(value: unknown) {
  if (!value || typeof value !== 'object') return value

  const pageContent = value as { home?: unknown }
  if (!pageContent.home || typeof pageContent.home !== 'object') return value

  const home = pageContent.home as { menuItems?: unknown }
  if (!Array.isArray(home.menuItems)) return value

  return {
    ...pageContent,
    home: {
      ...home,
      menuItems: home.menuItems.map((item, index) => {
        if (!item || typeof item !== 'object') return item

        const href = (item as { href?: unknown }).href
        return {
          ...item,
          href: typeof href === 'string' && href.trim()
            ? href
            : defaultMenuHrefs[index] || '/',
        }
      }),
    },
  }
}

function normalizeSettings(body: unknown): SiteSettingPayload[] {
  if (!body || typeof body !== 'object' || !('settings' in body)) {
    throw new Error('Missing settings payload.')
  }

  const settings = (body as { settings?: unknown }).settings
  if (!Array.isArray(settings)) {
    throw new Error('Settings payload must be an array.')
  }

  return settings.map((item) => {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid setting item.')
    }

    const key = String((item as { key?: unknown }).key || '')
    if (!allowedSettingKeys.has(key)) {
      throw new Error(`Setting key is not allowed: ${key || 'empty'}`)
    }

    return {
      key,
      value: key === 'page_content'
        ? normalizePageContent((item as { value?: unknown }).value ?? null)
        : (item as { value?: unknown }).value ?? null,
    }
  })
}

export async function POST(request: Request) {
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

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 })
  }

  let settings: SiteSettingPayload[]
  try {
    settings = normalizeSettings(body)
  } catch (error) {
    return Response.json(
      { ok: false, message: error instanceof Error ? error.message : 'Invalid settings payload.' },
      { status: 400 }
    )
  }

  const { error } = await client
    .from('site_settings')
    .upsert(settings, { onConflict: 'key' })

  if (error) {
    return Response.json({ ok: false, message: error.message }, { status: 502 })
  }

  return Response.json({ ok: true })
}
