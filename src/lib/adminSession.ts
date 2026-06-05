import { createHmac, timingSafeEqual } from 'crypto'

export const ADMIN_SESSION_COOKIE = 'pf_admin_session'
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12

function getAdminPasscode() {
  return process.env.SITE_ADMIN_PASSCODE || 'Pfadmin1!'
}

function getSessionSecret() {
  return process.env.SITE_ADMIN_SESSION_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || getAdminPasscode()
}

function signSessionPayload(payload: string) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('hex')
}

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer)
}

export function verifyAdminPasscode(passcode: string) {
  return safeCompare(passcode.trim(), getAdminPasscode())
}

export function createAdminSessionToken() {
  const issuedAt = Date.now().toString()
  return `${issuedAt}.${signSessionPayload(issuedAt)}`
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return false

  const [issuedAt, signature] = token.split('.')
  if (!issuedAt || !signature) return false

  const issuedAtMs = Number(issuedAt)
  if (!Number.isFinite(issuedAtMs)) return false

  const ageMs = Date.now() - issuedAtMs
  if (ageMs < 0 || ageMs > ADMIN_SESSION_MAX_AGE_SECONDS * 1000) return false

  return safeCompare(signature, signSessionPayload(issuedAt))
}
