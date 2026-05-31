export const CONFERENCE_REGISTRATION_FEE_CAD = 100
export const ETRANSFER_PAYMENT_METHOD = 'Interac e-Transfer'
export const SQUARE_PAYMENT_METHOD = 'Square Checkout'
export const ADULT_AGE_CONFIRMATION = 'Yes, I am older than 18'
export const GUARDIAN_CONSENT_AGE_CONFIRMATION = 'I am 18 and will submit a parent/guardian consent form'

export const conferenceRegistrationHeaders = [
  'Participant Name',
  'Contact Summary',
  'Church / Group Summary',
  'Emergency Contact Summary',
  'Consent Summary',
  'Submitted At',
  'Registration ID',
  'Payment Status',
  'Payment Method',
  'Payment Memo',
  'Base Fee CAD',
  'Discount CAD',
  'Final Amount CAD',
  'Square Checkout URL',
  'Square Payment Link ID',
  'Square Order ID',
  'Square Payment ID',
  'Square Receipt URL',
  'Paid At',
  'Group Registration Code',
  'First Name',
  'Last Name',
  'Preferred Name',
  'Age',
  'Gender',
  'Phone Number',
  'Email',
  'Church Name',
  'Pastor / Leader Name',
  'Attending With Group',
  'Group / Church Name',
  'Emergency First Name',
  'Emergency Last Name',
  'Emergency Relation',
  'Emergency Phone',
  'Conference Interest',
  'Area To Overcome',
  'Attended Before',
  'Media Consent',
  'Guidelines Consent',
  'Age Confirmation',
  'Guardian Name',
  'Guardian Relation',
  'Guardian Phone',
  'Guardian Email',
  'Guardian Consent',
  'Accuracy Confirmation',
] as const

export type ConferenceRegistrationPayload = {
  firstName: string
  lastName: string
  preferredName?: string
  age: string
  gender: string
  phone: string
  email: string
  churchName: string
  pastorName?: string
  attendingWithGroup: string
  groupName?: string
  emergencyFirstName: string
  emergencyLastName: string
  emergencyRelation: string
  emergencyPhone: string
  interest: string
  overcome: string
  attendedBefore: string
  mediaConsent?: string
  guidelinesConsent?: string
  ageConfirmation: string
  guardianName?: string
  guardianRelation?: string
  guardianPhone?: string
  guardianEmail?: string
  guardianConsent?: string
  accuracyConfirm?: string
  groupRegistrationCode?: string
}

export type ConferenceRegistrationSheetRecord = ConferenceRegistrationPayload & {
  submittedAt: string
  registrationId: string
  paymentStatus: string
  paymentMethod: string
  paymentMemo: string
  baseFeeCad: number
  discountCad: number
  finalAmountCad: number
  squareCheckoutUrl: string
  squarePaymentLinkId: string
  squareOrderId: string
  squarePaymentId: string
  squareReceiptUrl: string
  paidAt: string
}

const requiredFields: Array<keyof ConferenceRegistrationPayload> = [
  'firstName',
  'lastName',
  'age',
  'gender',
  'phone',
  'email',
  'churchName',
  'attendingWithGroup',
  'emergencyFirstName',
  'emergencyLastName',
  'emergencyRelation',
  'emergencyPhone',
  'interest',
  'overcome',
  'attendedBefore',
  'ageConfirmation',
]

const cleanString = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export function normalizeConferenceRegistrationPayload(input: unknown): ConferenceRegistrationPayload {
  const source = typeof input === 'object' && input !== null ? input as Record<string, unknown> : {}

  return {
    firstName: cleanString(source.firstName),
    lastName: cleanString(source.lastName),
    preferredName: cleanString(source.preferredName),
    age: cleanString(source.age),
    gender: cleanString(source.gender),
    phone: cleanString(source.phone),
    email: cleanString(source.email),
    churchName: cleanString(source.churchName),
    pastorName: cleanString(source.pastorName),
    attendingWithGroup: cleanString(source.attendingWithGroup),
    groupName: cleanString(source.groupName),
    emergencyFirstName: cleanString(source.emergencyFirstName),
    emergencyLastName: cleanString(source.emergencyLastName),
    emergencyRelation: cleanString(source.emergencyRelation),
    emergencyPhone: cleanString(source.emergencyPhone),
    interest: cleanString(source.interest),
    overcome: cleanString(source.overcome),
    attendedBefore: cleanString(source.attendedBefore),
    mediaConsent: cleanString(source.mediaConsent),
    guidelinesConsent: cleanString(source.guidelinesConsent),
    ageConfirmation: cleanString(source.ageConfirmation),
    guardianName: cleanString(source.guardianName),
    guardianRelation: cleanString(source.guardianRelation),
    guardianPhone: cleanString(source.guardianPhone),
    guardianEmail: cleanString(source.guardianEmail),
    guardianConsent: cleanString(source.guardianConsent),
    accuracyConfirm: cleanString(source.accuracyConfirm),
    groupRegistrationCode: cleanString(source.groupRegistrationCode).toUpperCase(),
  }
}

export function validateConferenceRegistration(payload: ConferenceRegistrationPayload) {
  const missingFields = requiredFields.filter((field) => !payload[field])

  if (!payload.mediaConsent) missingFields.push('mediaConsent')
  if (!payload.guidelinesConsent) missingFields.push('guidelinesConsent')
  if (!payload.accuracyConfirm) missingFields.push('accuracyConfirm')
  if (requiresGuardianConsent(payload)) {
    if (!payload.guardianName) missingFields.push('guardianName')
    if (!payload.guardianRelation) missingFields.push('guardianRelation')
    if (!payload.guardianPhone) missingFields.push('guardianPhone')
    if (!payload.guardianEmail) missingFields.push('guardianEmail')
  }

  if (requiresGuardianConsent(payload) && !payload.guardianConsent) {
    missingFields.push('guardianConsent')
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  }
}

export function requiresGuardianConsent(payload: Pick<ConferenceRegistrationPayload, 'ageConfirmation'>) {
  return payload.ageConfirmation === GUARDIAN_CONSENT_AGE_CONFIRMATION
}

export function createConferenceRegistrationRecord(
  payload: ConferenceRegistrationPayload,
  options: { paymentMethod?: string } = {}
): ConferenceRegistrationSheetRecord {
  const registrationId = `PF-${Date.now().toString(36).toUpperCase()}`

  return {
    ...payload,
    submittedAt: new Date().toISOString(),
    registrationId,
    paymentStatus: 'pending',
    paymentMethod: options.paymentMethod || SQUARE_PAYMENT_METHOD,
    paymentMemo: `PF2026-${registrationId}`,
    baseFeeCad: CONFERENCE_REGISTRATION_FEE_CAD,
    discountCad: 0,
    finalAmountCad: CONFERENCE_REGISTRATION_FEE_CAD,
    squareCheckoutUrl: '',
    squarePaymentLinkId: '',
    squareOrderId: '',
    squarePaymentId: '',
    squareReceiptUrl: '',
    paidAt: '',
  }
}

export function buildConferenceRegistrationSheetRow(record: ConferenceRegistrationSheetRecord) {
  const participantName = [record.firstName, record.lastName].filter(Boolean).join(' ')
  const displayName = record.preferredName ? `${participantName} (${record.preferredName})` : participantName
  const contactSummary = [record.email, record.phone].filter(Boolean).join(' / ')
  const churchSummary = [
    record.churchName,
    record.groupName ? `Group: ${record.groupName}` : '',
    record.pastorName ? `Leader: ${record.pastorName}` : '',
  ].filter(Boolean).join(' / ')
  const emergencySummary = [
    [record.emergencyFirstName, record.emergencyLastName].filter(Boolean).join(' '),
    record.emergencyRelation,
    record.emergencyPhone,
  ].filter(Boolean).join(' / ')
  const consentSummary = [
    record.mediaConsent ? 'Media' : '',
    record.guidelinesConsent ? 'Guidelines' : '',
    record.guardianConsent ? `Guardian${record.guardianName ? `: ${record.guardianName}` : ''}` : '',
    record.accuracyConfirm ? 'Accuracy' : '',
  ].filter(Boolean).join(' + ')

  return [
    displayName,
    contactSummary,
    churchSummary,
    emergencySummary,
    consentSummary,
    record.submittedAt,
    record.registrationId,
    record.paymentStatus,
    record.paymentMethod,
    record.paymentMemo,
    record.baseFeeCad,
    record.discountCad,
    record.finalAmountCad,
    record.squareCheckoutUrl,
    record.squarePaymentLinkId,
    record.squareOrderId,
    record.squarePaymentId,
    record.squareReceiptUrl,
    record.paidAt,
    record.groupRegistrationCode,
    record.firstName,
    record.lastName,
    record.preferredName,
    record.age,
    record.gender,
    record.phone,
    record.email,
    record.churchName,
    record.pastorName,
    record.attendingWithGroup,
    record.groupName,
    record.emergencyFirstName,
    record.emergencyLastName,
    record.emergencyRelation,
    record.emergencyPhone,
    record.interest,
    record.overcome,
    record.attendedBefore,
    record.mediaConsent || '',
    record.guidelinesConsent || '',
    record.ageConfirmation,
    record.guardianName || '',
    record.guardianRelation || '',
    record.guardianPhone || '',
    record.guardianEmail || '',
    record.guardianConsent || '',
    record.accuracyConfirm || '',
  ]
}
