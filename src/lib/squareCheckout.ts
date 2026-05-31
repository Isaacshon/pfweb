import { createHmac, randomUUID, timingSafeEqual } from 'crypto'
import type { ConferenceRegistrationPayload } from '@/lib/conferenceRegistration'

export type SquarePaymentLink = {
  id: string
  orderId: string
  url: string
  longUrl: string
}

type SquarePaymentLinkResponse = {
  errors?: Array<{ detail?: string; code?: string }>
  payment_link?: {
    id?: string
    order_id?: string
    url?: string
    long_url?: string
  }
}

export class SquareCheckoutError extends Error {
  code = 'square_checkout_failed'
}

export function getSquareCheckoutConfig() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN
  const locationId = process.env.SQUARE_LOCATION_ID
  const environment = process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
  const apiVersion = process.env.SQUARE_API_VERSION || '2026-05-20'
  const missing = [
    !accessToken ? 'SQUARE_ACCESS_TOKEN' : '',
    !locationId ? 'SQUARE_LOCATION_ID' : '',
  ].filter(Boolean)

  return {
    configured: missing.length === 0,
    missing,
    accessToken: accessToken || '',
    locationId: locationId || '',
    environment,
    apiVersion,
    apiBaseUrl: environment === 'production'
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com',
  }
}

export async function createSquarePaymentLink({
  registrationId,
  amountCad,
  payload,
}: {
  registrationId: string
  amountCad: number
  payload: ConferenceRegistrationPayload
}): Promise<SquarePaymentLink> {
  const config = getSquareCheckoutConfig()
  if (!config.configured) {
    throw new SquareCheckoutError(`Square Checkout is not configured: ${config.missing.join(', ')}`)
  }

  const amountInCents = Math.round(amountCad * 100)
  if (!Number.isInteger(amountInCents) || amountInCents < 1) {
    throw new SquareCheckoutError('Square Checkout requires a positive payment amount.')
  }

  const response = await fetch(`${config.apiBaseUrl}/v2/online-checkout/payment-links`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
      'Square-Version': config.apiVersion,
    },
    body: JSON.stringify({
      idempotency_key: `conference-${registrationId}-${randomUUID()}`,
      description: `PassionFruits Conference 2026 registration ${registrationId}`,
      payment_note: `PassionFruits Conference 2026 registration ${registrationId}`,
      quick_pay: {
        name: `PassionFruits Conference 2026 - ${registrationId}`,
        price_money: {
          amount: amountInCents,
          currency: 'CAD',
        },
        location_id: config.locationId,
      },
      pre_populated_data: {
        buyer_email: payload.email,
      },
      checkout_options: {
        allow_tipping: false,
        ask_for_shipping_address: false,
        merchant_support_email: process.env.SQUARE_MERCHANT_SUPPORT_EMAIL || undefined,
      },
    }),
  })

  let result: SquarePaymentLinkResponse | null = null
  try {
    result = await response.json() as SquarePaymentLinkResponse
  } catch {
    result = null
  }

  if (!response.ok || result?.errors?.length) {
    const message = result?.errors?.map((error) => error.detail || error.code).filter(Boolean).join(', ')
    throw new SquareCheckoutError(message || 'Square Checkout could not create a payment link.')
  }

  const link = result?.payment_link
  if (!link?.id || !link.order_id || !link.url) {
    throw new SquareCheckoutError('Square Checkout response did not include a usable payment link.')
  }

  return {
    id: link.id,
    orderId: link.order_id,
    url: link.url,
    longUrl: link.long_url || link.url,
  }
}

export function verifySquareWebhookSignature({
  rawBody,
  signatureHeader,
  signatureKey,
  notificationUrl,
}: {
  rawBody: string
  signatureHeader: string | null
  signatureKey: string
  notificationUrl: string
}) {
  if (!signatureHeader || !signatureKey || !notificationUrl) return false

  const expectedSignature = createHmac('sha256', signatureKey)
    .update(notificationUrl + rawBody)
    .digest('base64')
  const expectedBuffer = Buffer.from(expectedSignature)
  const providedBuffer = Buffer.from(signatureHeader)

  if (expectedBuffer.length !== providedBuffer.length) return false
  return timingSafeEqual(expectedBuffer, providedBuffer)
}
