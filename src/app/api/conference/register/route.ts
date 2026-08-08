import {
  buildConferenceRegistrationSheetRow,
  CONFERENCE_MAX_AGE,
  createConferenceRegistrationRecord,
  normalizeConferenceRegistrationPayload,
  validateConferenceRegistration,
} from '@/lib/conferenceRegistration'
import {
  appendConferenceRegistrationToSheet,
  getConferenceSheetsConfig,
} from '@/lib/conferenceSheets'
import { sendRegistrationEmail } from '@/lib/email'

const groupCodeErrorCodes = new Set([
  'group_registration_code_not_found',
  'group_registration_code_inactive',
  'group_registration_code_exhausted',
])

export async function POST(request: Request) {
  const sheetsConfig = getConferenceSheetsConfig()

  if (!sheetsConfig.configured) {
    return Response.json(
      {
        ok: false,
        code: 'google_sheets_not_configured',
        message: 'Google Sheets webhook is not configured yet.',
      },
      { status: 503 },
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
    const hasInvalidAge = validation.invalidFields.includes('age')
    const hasInvalidAgeConfirmation = validation.invalidFields.includes('ageConfirmation')

    return Response.json(
      {
        ok: false,
        code: hasInvalidAge
          ? 'invalid_age'
          : hasInvalidAgeConfirmation
            ? 'invalid_age_confirmation'
            : 'missing_required_fields',
        message: hasInvalidAge
          ? `Conference registration is limited to participants aged ${CONFERENCE_MAX_AGE} and under.`
          : hasInvalidAgeConfirmation
            ? 'Please select the age status that matches the participant age.'
            : 'Please complete all required fields.',
        missingFields: validation.missingFields,
        invalidFields: validation.invalidFields,
      },
      { status: 400 },
    )
  }

  // Keep the existing sheet shape for compatibility, but new registrations are
  // registration-only and do not create or expose any payment flow.
  const record = createConferenceRegistrationRecord(payload, { paymentMethod: 'Registration only' })
  record.paymentStatus = 'registered'
  record.paymentMethod = 'Registration only'
  record.paymentMemo = ''
  record.baseFeeCad = 0
  record.discountCad = 0
  record.finalAmountCad = 0
  record.squareCheckoutUrl = ''
  record.squarePaymentLinkId = ''
  record.squareOrderId = ''
  record.squarePaymentId = ''
  record.squareReceiptUrl = ''
  record.paidAt = ''

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
      { status },
    )
  }

  const name = [payload.firstName, payload.lastName].filter(Boolean).join(' ') || 'Participant'
  sendRegistrationEmail({
    email: payload.email,
    name,
    registrationId: record.registrationId,
  }).catch((error) => console.error('Failed to send registration email:', error))

  return Response.json({
    ok: true,
    registrationId: record.registrationId,
  })
}
