import {
  buildConferenceRegistrationSheetRow,
  createConferenceRegistrationRecord,
  ETRANSFER_PAYMENT_METHOD,
  normalizeConferenceRegistrationPayload,
  SQUARE_PAYMENT_METHOD,
  validateConferenceRegistration,
} from '@/lib/conferenceRegistration'
import {
  appendConferenceRegistrationToSheet,
  getConferenceSheetsConfig,
  updateConferencePaymentLink,
} from '@/lib/conferenceSheets'
import { createSquarePaymentLink, getSquareCheckoutConfig } from '@/lib/squareCheckout'

const groupCodeErrorCodes = new Set([
  'group_registration_code_not_found',
  'group_registration_code_inactive',
  'group_registration_code_exhausted',
])

export async function POST(request: Request) {
  const sheetsConfig = getConferenceSheetsConfig()
  const squareConfig = getSquareCheckoutConfig()
  const eTransferEmail = process.env.ETRANSFER_RECIPIENT_EMAIL || 'passionfruits.ministry@gmail.com'

  if (!sheetsConfig.configured) {
    return Response.json(
      {
        ok: false,
        code: 'google_sheets_not_configured',
        message: 'Google Sheets webhook is not configured yet.',
      },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 })
  }

  const payload = normalizeConferenceRegistrationPayload(body)
  const validation = validateConferenceRegistration(payload)

  if (!validation.isValid) {
    return Response.json(
      {
        ok: false,
        code: 'missing_required_fields',
        message: 'Please complete all required fields.',
        missingFields: validation.missingFields,
      },
      { status: 400 }
    )
  }

  const record = createConferenceRegistrationRecord(payload, {
    paymentMethod: squareConfig.configured ? SQUARE_PAYMENT_METHOD : ETRANSFER_PAYMENT_METHOD,
  })
  const row = buildConferenceRegistrationSheetRow(record)

  const sheetsResult = await appendConferenceRegistrationToSheet(record, row)

  if (sheetsResult?.ok === false) {
    const status = sheetsResult?.code && groupCodeErrorCodes.has(sheetsResult.code) ? 400 : 502

    return Response.json(
      {
        ok: false,
        code: sheetsResult?.code || 'google_sheets_append_failed',
        message: sheetsResult?.message || 'Could not append this registration to Google Sheets.',
      },
      { status }
    )
  }

  const finalAmountCad = typeof sheetsResult?.finalAmountCad === 'number'
    ? sheetsResult.finalAmountCad
    : record.finalAmountCad
  const discountCad = typeof sheetsResult?.discountCad === 'number'
    ? sheetsResult.discountCad
    : record.discountCad

  if (squareConfig.configured && finalAmountCad > 0) {
    try {
      const squarePaymentLink = await createSquarePaymentLink({
        registrationId: record.registrationId,
        amountCad: finalAmountCad,
        payload,
      })

      const updateResult = await updateConferencePaymentLink({
        registrationId: record.registrationId,
        paymentStatus: 'checkout_link_created',
        paymentMethod: SQUARE_PAYMENT_METHOD,
        finalAmountCad,
        squareCheckoutUrl: squarePaymentLink.url,
        squarePaymentLinkId: squarePaymentLink.id,
        squareOrderId: squarePaymentLink.orderId,
      })

      return Response.json({
        ok: true,
        registrationId: record.registrationId,
        paymentStatus: updateResult?.ok === false ? 'pending' : 'checkout_link_created',
        finalAmountCad,
        discountCad,
        paymentInstructions: {
          method: SQUARE_PAYMENT_METHOD,
          checkoutUrl: squarePaymentLink.url,
          squarePaymentLinkId: squarePaymentLink.id,
          squareOrderId: squarePaymentLink.orderId,
          fallbackMethod: ETRANSFER_PAYMENT_METHOD,
          fallbackRecipientEmail: eTransferEmail,
          amountCad: finalAmountCad,
          discountCad,
          memo: record.paymentMemo,
        },
      })
    } catch (error) {
      await updateConferencePaymentLink({
        registrationId: record.registrationId,
        paymentStatus: 'pending_e_transfer',
        paymentMethod: ETRANSFER_PAYMENT_METHOD,
        finalAmountCad,
        squareCheckoutUrl: '',
        squarePaymentLinkId: '',
        squareOrderId: '',
      })

      return Response.json({
        ok: true,
        code: 'square_checkout_unavailable',
        registrationId: record.registrationId,
        paymentStatus: 'pending_e_transfer',
        finalAmountCad,
        discountCad,
        message: error instanceof Error ? error.message : 'Square Checkout could not create a payment link.',
        paymentInstructions: {
          method: ETRANSFER_PAYMENT_METHOD,
          recipientEmail: eTransferEmail,
          amountCad: finalAmountCad,
          discountCad,
          memo: record.paymentMemo,
        },
      })
    }
  }

  if (squareConfig.configured && finalAmountCad <= 0) {
    await updateConferencePaymentLink({
      registrationId: record.registrationId,
      paymentStatus: 'waived',
      paymentMethod: SQUARE_PAYMENT_METHOD,
      finalAmountCad,
      squareCheckoutUrl: '',
      squarePaymentLinkId: '',
      squareOrderId: '',
    })
  }

  return Response.json({
    ok: true,
    registrationId: record.registrationId,
    paymentStatus: finalAmountCad <= 0 ? 'waived' : record.paymentStatus,
    finalAmountCad,
    discountCad,
    paymentInstructions: {
      method: finalAmountCad <= 0 ? 'Waived' : ETRANSFER_PAYMENT_METHOD,
      recipientEmail: eTransferEmail,
      amountCad: finalAmountCad,
      discountCad,
      memo: record.paymentMemo,
    },
  })
}
