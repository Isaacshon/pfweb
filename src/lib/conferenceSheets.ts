import { conferenceRegistrationHeaders, type ConferenceRegistrationSheetRecord } from '@/lib/conferenceRegistration'

export type ConferenceSheetsResult = {
  ok?: boolean
  code?: string
  message?: string
  discountCad?: number
  finalAmountCad?: number
  appendedRow?: number
}

export type ConferencePaymentLinkUpdate = {
  registrationId: string
  paymentStatus: string
  paymentMethod: string
  finalAmountCad: number
  squareCheckoutUrl: string
  squarePaymentLinkId: string
  squareOrderId: string
}

export type ConferenceSquarePaymentUpdate = {
  squareOrderId: string
  squarePaymentId: string
  squareReceiptUrl: string
  paymentStatus: string
  paidAt: string
}

export function getConferenceSheetsConfig() {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET
  const missing = [
    !webhookUrl ? 'GOOGLE_SHEETS_WEBHOOK_URL' : '',
    !webhookSecret ? 'GOOGLE_SHEETS_WEBHOOK_SECRET' : '',
  ].filter(Boolean)

  return {
    configured: missing.length === 0,
    missing,
    webhookUrl: webhookUrl || '',
    webhookSecret: webhookSecret || '',
  }
}

export async function appendConferenceRegistrationToSheet(
  record: ConferenceRegistrationSheetRecord,
  row: unknown[]
) {
  return postConferenceSheetsWebhook({
    action: 'appendRegistration',
    headers: conferenceRegistrationHeaders,
    row,
    record,
  })
}

export async function updateConferencePaymentLink(update: ConferencePaymentLinkUpdate) {
  return postConferenceSheetsWebhook({
    action: 'updatePaymentLink',
    headers: conferenceRegistrationHeaders,
    update,
  })
}

export async function updateConferenceSquarePayment(update: ConferenceSquarePaymentUpdate) {
  return postConferenceSheetsWebhook({
    action: 'markSquarePayment',
    headers: conferenceRegistrationHeaders,
    update,
  })
}

async function postConferenceSheetsWebhook(payload: Record<string, unknown>): Promise<ConferenceSheetsResult> {
  const config = getConferenceSheetsConfig()

  if (!config.configured) {
    return {
      ok: false,
      code: 'google_sheets_not_configured',
      message: 'Google Sheets webhook is not configured yet.',
    }
  }

  let response: Response
  try {
    response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: config.webhookSecret,
        ...payload,
      }),
    })
  } catch {
    return {
      ok: false,
      code: 'google_sheets_webhook_unreachable',
      message: 'Could not reach the Google Sheets webhook.',
    }
  }

  let result: ConferenceSheetsResult | null = null
  try {
    result = await response.json() as ConferenceSheetsResult
  } catch {
    result = null
  }

  if (!response.ok) {
    return {
      ok: false,
      code: result?.code || 'google_sheets_webhook_failed',
      message: result?.message || 'Google Sheets webhook returned an error.',
    }
  }

  return result || { ok: true }
}
