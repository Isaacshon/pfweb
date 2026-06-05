import { cookies } from 'next/headers'
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  verifyAdminPasscode,
  verifyAdminSessionToken,
} from '@/lib/adminSession'

export const runtime = 'nodejs'

export async function GET() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value
  return Response.json({ ok: verifyAdminSessionToken(token) })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 })
  }

  const passcode = typeof body === 'object' && body && 'passcode' in body
    ? String((body as { passcode?: unknown }).passcode || '')
    : ''

  if (!verifyAdminPasscode(passcode)) {
    return Response.json({ ok: false, message: 'Invalid admin passcode.' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: '/',
  })

  return Response.json({ ok: true })
}
