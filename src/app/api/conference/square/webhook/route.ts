import { updateConferenceSquarePayment } from '@/lib/conferenceSheets'
import { verifySquareWebhookSignature } from '@/lib/squareCheckout'
import { sendRegistrationEmail } from '@/lib/email'

export const runtime = 'nodejs'

type SquareWebhookEvent = {
  type?: string
  data?: {
    object?: {
      payment?: {
        id?: string
        order_id?: string
        status?: string
        receipt_url?: string
        updated_at?: string
        created_at?: string
        buyer_email_address?: string
        note?: string
        amount_money?: {
          amount?: number
          currency?: string
        }
        billing_address?: {
          first_name?: string
          last_name?: string
        }
      }
    }
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get('x-square-hmacsha256-signature')
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL

  if (!signatureKey || !notificationUrl) {
    return Response.json(
      {
        ok: false,
        code: 'square_webhook_not_configured',
        message: 'Square webhook signature verification is not configured.',
      },
      { status: 503 }
    )
  }

  const isVerified = verifySquareWebhookSignature({
    rawBody,
    signatureHeader,
    signatureKey,
    notificationUrl,
  })

  if (!isVerified) {
    return Response.json({ ok: false, message: 'Invalid Square webhook signature.' }, { status: 403 })
  }

  let event: SquareWebhookEvent
  try {
    event = JSON.parse(rawBody) as SquareWebhookEvent
  } catch {
    return Response.json({ ok: false, message: 'Invalid Square webhook body.' }, { status: 400 })
  }

  const payment = event.data?.object?.payment
  if (!payment?.order_id || !payment.id) {
    return Response.json({ ok: true, ignored: true })
  }

  const paymentStatus = mapSquarePaymentStatus(payment.status)
  const result = await updateConferenceSquarePayment({
    squareOrderId: payment.order_id,
    squarePaymentId: payment.id,
    squareReceiptUrl: payment.receipt_url || '',
    paymentStatus,
    paidAt: paymentStatus === 'paid'
      ? payment.updated_at || payment.created_at || new Date().toISOString()
      : '',
  })

  if (result.ok === false) {
    return Response.json(
      {
        ok: false,
        code: result.code || 'google_sheets_payment_update_failed',
        message: result.message || 'Could not update payment status in Google Sheets.',
      },
      { status: 502 }
    )
  }

  // Send registration confirmation email on successful payment
  if (paymentStatus === 'paid' && payment.buyer_email_address && result.paymentEmailShouldSend !== false) {
    // Extract registrationId (e.g., PF-XXXX) from the payment note
    const noteText = payment.note || ''
    const match = noteText.match(/PF-[A-Z0-9]+/i)
    const registrationId = match ? match[0].toUpperCase() : 'PF-CONFIRMED'

    // Formulate attendee name
    const buyerName = payment.billing_address
      ? [payment.billing_address.first_name, payment.billing_address.last_name].filter(Boolean).join(' ')
      : 'Participant'

    // Get amount in CAD (convert from cents)
    const amountCad = typeof payment.amount_money?.amount === 'number'
      ? payment.amount_money.amount / 100
      : 100

    sendRegistrationEmail({
      email: payment.buyer_email_address,
      name: buyerName,
      registrationId,
      amountCad,
      idempotencyKey: `square-paid-${payment.id}`,
    }).catch((err) => console.error('Failed to send payment confirmation email:', err))
  }

  return Response.json({ ok: true })
}

function mapSquarePaymentStatus(status: string | undefined) {
  switch (status) {
    case 'COMPLETED':
      return 'paid'
    case 'APPROVED':
      return 'approved'
    case 'CANCELED':
      return 'canceled'
    case 'FAILED':
      return 'failed'
    default:
      return status ? `square_${status.toLowerCase()}` : 'square_payment_updated'
  }
}
