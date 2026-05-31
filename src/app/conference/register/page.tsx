'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage, type Language } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { BrandHeading } from '@/components/BrandHeading'
import {
  ADULT_AGE_CONFIRMATION,
  GUARDIAN_CONSENT_AGE_CONFIRMATION,
  normalizeConferenceRegistrationPayload,
  requiresGuardianConsent,
  type ConferenceRegistrationPayload,
} from '@/lib/conferenceRegistration'
import { QRCodeSVG } from 'qrcode.react'

type PaymentInstructions = {
  method: string
  checkoutUrl?: string
  squarePaymentLinkId?: string
  squareOrderId?: string
  fallbackMethod?: string
  fallbackRecipientEmail?: string
  recipientEmail?: string
  amountCad: number
  discountCad?: number
  memo: string
}

type RegistrationField = keyof ConferenceRegistrationPayload
type FieldErrors = Partial<Record<RegistrationField, string>>

const requiredRegistrationFields: RegistrationField[] = [
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
  'mediaConsent',
  'guidelinesConsent',
  'accuracyConfirm',
]

const validationLabels: Record<Language, Record<RegistrationField, string>> = {
  en: {
    firstName: 'first name',
    lastName: 'last name',
    preferredName: 'preferred name',
    age: 'age',
    gender: 'gender',
    phone: 'phone number',
    email: 'email',
    churchName: 'church name',
    pastorName: 'pastor / leader name',
    attendingWithGroup: 'group attendance',
    groupName: 'group / church name',
    emergencyFirstName: 'emergency contact first name',
    emergencyLastName: 'emergency contact last name',
    emergencyRelation: 'emergency contact relation',
    emergencyPhone: 'emergency contact phone number',
    interest: 'conference interest',
    overcome: 'area to overcome',
    attendedBefore: 'previous attendance',
    mediaConsent: 'media consent',
    guidelinesConsent: 'conference guidelines consent',
    ageConfirmation: 'age confirmation',
    guardianName: 'parent/guardian full name',
    guardianRelation: 'parent/guardian relation',
    guardianPhone: 'parent/guardian phone number',
    guardianEmail: 'parent/guardian email',
    guardianConsent: 'parent/guardian consent confirmation',
    accuracyConfirm: 'information accuracy confirmation',
    groupRegistrationCode: 'group registration code',
  },
  ko: {
    firstName: '이름',
    lastName: '성',
    preferredName: '선호 이름',
    age: '나이',
    gender: '성별',
    phone: '전화번호',
    email: '이메일',
    churchName: '교회 이름',
    pastorName: '담임/리더 이름',
    attendingWithGroup: '그룹 참석 여부',
    groupName: '그룹/교회 이름',
    emergencyFirstName: '비상 연락처 이름',
    emergencyLastName: '비상 연락처 성',
    emergencyRelation: '비상 연락처 관계',
    emergencyPhone: '비상 연락처 전화번호',
    interest: '컨퍼런스 관심 이유',
    overcome: '극복하고 싶은 영역',
    attendedBefore: '이전 참석 여부',
    mediaConsent: '미디어 사용 동의',
    guidelinesConsent: '컨퍼런스 가이드라인 동의',
    ageConfirmation: '나이 확인',
    guardianName: '부모/보호자 이름',
    guardianRelation: '부모/보호자 관계',
    guardianPhone: '부모/보호자 전화번호',
    guardianEmail: '부모/보호자 이메일',
    guardianConsent: '부모/보호자 동의 확인',
    accuracyConfirm: '정보 정확성 확인',
    groupRegistrationCode: '그룹 등록 코드',
  },
  zh: {
    firstName: '名',
    lastName: '姓',
    preferredName: '常用名',
    age: '年龄',
    gender: '性别',
    phone: '电话号码',
    email: '电子邮箱',
    churchName: '教会名称',
    pastorName: '牧师/带领者姓名',
    attendingWithGroup: '是否随团参加',
    groupName: '团体/教会名称',
    emergencyFirstName: '紧急联系人名字',
    emergencyLastName: '紧急联系人姓氏',
    emergencyRelation: '紧急联系人关系',
    emergencyPhone: '紧急联系人电话',
    interest: '参加原因',
    overcome: '想要突破的领域',
    attendedBefore: '是否曾参加',
    mediaConsent: '媒体使用同意',
    guidelinesConsent: '大会守则同意',
    ageConfirmation: '年龄确认',
    guardianName: '家长/监护人姓名',
    guardianRelation: '家长/监护人关系',
    guardianPhone: '家长/监护人电话',
    guardianEmail: '家长/监护人邮箱',
    guardianConsent: '家长/监护人同意确认',
    accuracyConfirm: '信息准确确认',
    groupRegistrationCode: '团体注册码',
  },
  es: {
    firstName: 'nombre',
    lastName: 'apellido',
    preferredName: 'nombre preferido',
    age: 'edad',
    gender: 'genero',
    phone: 'telefono',
    email: 'correo electronico',
    churchName: 'nombre de la iglesia',
    pastorName: 'pastor / lider',
    attendingWithGroup: 'asistencia con grupo',
    groupName: 'grupo / iglesia',
    emergencyFirstName: 'nombre del contacto de emergencia',
    emergencyLastName: 'apellido del contacto de emergencia',
    emergencyRelation: 'relacion del contacto de emergencia',
    emergencyPhone: 'telefono del contacto de emergencia',
    interest: 'interes en la conferencia',
    overcome: 'area que quieres superar',
    attendedBefore: 'asistencia previa',
    mediaConsent: 'consentimiento de medios',
    guidelinesConsent: 'consentimiento de reglas',
    ageConfirmation: 'confirmacion de edad',
    guardianName: 'nombre completo del padre/tutor',
    guardianRelation: 'relacion del padre/tutor',
    guardianPhone: 'telefono del padre/tutor',
    guardianEmail: 'correo del padre/tutor',
    guardianConsent: 'confirmacion de padre/tutor',
    accuracyConfirm: 'confirmacion de informacion correcta',
    groupRegistrationCode: 'codigo de registro grupal',
  },
}

const validationMessages: Record<Language, {
  title: string
  summary: string
  required: (field: string) => string
  email: string
  age: string
  guardianConsent: string
}> = {
  en: {
    title: 'Check Required Fields',
    summary: 'Please review the highlighted fields before submitting.',
    required: (field) => `Please complete ${field}.`,
    email: 'Please enter a valid email address.',
    age: 'Age must be between 18 and 25.',
    guardianConsent: 'Please complete the parent/guardian consent form.',
  },
  ko: {
    title: '필수 항목 확인',
    summary: '제출하기 전에 표시된 항목을 확인해 주세요.',
    required: (field) => `${field} 항목을 작성해 주세요.`,
    email: '올바른 이메일 주소를 입력해 주세요.',
    age: '나이는 18세부터 25세 사이여야 합니다.',
    guardianConsent: '부모/보호자 동의서를 작성하고 확인해 주세요.',
  },
  zh: {
    title: '请确认必填项目',
    summary: '提交前请确认标记的项目。',
    required: (field) => `请填写${field}。`,
    email: '请输入有效的电子邮箱。',
    age: '年龄必须在18到25岁之间。',
    guardianConsent: '请填写并确认家长/监护人同意书。',
  },
  es: {
    title: 'Revisa los campos requeridos',
    summary: 'Revisa los campos marcados antes de enviar.',
    required: (field) => `Completa ${field}.`,
    email: 'Ingresa un correo electronico valido.',
    age: 'La edad debe estar entre 18 y 25.',
    guardianConsent: 'Completa el formulario de consentimiento de padre/tutor.',
  },
}

const inputClass = 'w-full rounded-2xl border-2 border-slate-300 bg-white px-5 py-4 text-base font-bold text-brand-dark outline-none transition placeholder:text-slate-300 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10'
const textareaClass = `${inputClass} min-h-28 resize-y leading-relaxed`
const labelClass = 'text-[11px] font-black uppercase tracking-[0.22em] text-slate-600'

function TextField({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  min,
  max,
  error,
}: {
  label: string
  name: RegistrationField
  type?: string
  required?: boolean
  placeholder?: string
  min?: number
  max?: number
  error?: string
}) {
  const errorId = `${name}-error`

  return (
    <div className="space-y-2">
      <label htmlFor={name} className={labelClass}>{label}{required ? ' *' : ''}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClass} ${error ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-100' : ''}`}
      />
      {error && (
        <p id={errorId} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black leading-relaxed text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function TextAreaField({
  label,
  name,
  required = false,
  placeholder,
  error,
}: {
  label: string
  name: RegistrationField
  required?: boolean
  placeholder?: string
  error?: string
}) {
  const errorId = `${name}-error`

  return (
    <div className="space-y-2">
      <label htmlFor={name} className={labelClass}>{label}{required ? ' *' : ''}</label>
      <textarea
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${textareaClass} ${error ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-100' : ''}`}
      />
      {error && (
        <p id={errorId} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black leading-relaxed text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function RadioGroup({
  label,
  name,
  options,
  required = false,
  error,
}: {
  label: string
  name: RegistrationField
  options: string[]
  required?: boolean
  error?: string
}) {
  const errorId = `${name}-error`

  return (
    <fieldset className="space-y-3" aria-describedby={error ? errorId : undefined}>
      <legend className={labelClass}>{label}{required ? ' *' : ''}</legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-sm font-black text-brand-dark transition hover:border-brand-purple ${error ? 'border-red-300' : 'border-slate-300'}`}>
            <input
              type="radio"
              name={name}
              value={option}
              required={required}
              className="h-4 w-4 accent-brand-purple"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black leading-relaxed text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function CheckboxField({
  name,
  children,
  required = false,
  error,
}: {
  name: RegistrationField
  children: React.ReactNode
  required?: boolean
  error?: string
}) {
  const errorId = `${name}-error`

  return (
    <div className="space-y-2">
      <label className={`flex cursor-pointer gap-4 rounded-2xl border-2 bg-white p-5 text-sm font-bold leading-relaxed text-slate-700 transition hover:border-brand-purple ${error ? 'border-red-300 bg-red-50/40' : 'border-slate-300'}`}>
        <input
          type="checkbox"
          name={name}
          value="Agreed"
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-brand-purple"
        />
        <span>{children}</span>
      </label>
      {error && (
        <p id={errorId} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black leading-relaxed text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function FormSection({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-xs font-black text-white">
          {number}
        </span>
        <h2 className="text-xl font-black uppercase tracking-tight text-brand-dark md:text-2xl">{title}</h2>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

function buildRegistrationFieldErrors(payload: ConferenceRegistrationPayload, language: Language): FieldErrors {
  const copy = validationMessages[language]
  const labels = validationLabels[language]
  const errors: FieldErrors = {}

  requiredRegistrationFields.forEach((field) => {
    if (!payload[field]) {
      errors[field] = copy.required(labels[field])
    }
  })

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = copy.email
  }

  const ageNumber = Number(payload.age)
  if (payload.age && (!Number.isFinite(ageNumber) || ageNumber < 18 || ageNumber > 25)) {
    errors.age = copy.age
  }

  if (requiresGuardianConsent(payload)) {
    if (!payload.guardianName) errors.guardianName = copy.required(labels.guardianName)
    if (!payload.guardianRelation) errors.guardianRelation = copy.required(labels.guardianRelation)
    if (!payload.guardianPhone) errors.guardianPhone = copy.required(labels.guardianPhone)
    if (!payload.guardianEmail) errors.guardianEmail = copy.required(labels.guardianEmail)
  }

  if (requiresGuardianConsent(payload) && !payload.guardianConsent) {
    errors.guardianConsent = copy.guardianConsent
  }

  return errors
}

function focusFirstInvalidField(form: HTMLFormElement, errors: FieldErrors) {
  const firstInvalidName = Object.keys(errors)[0]
  if (!firstInvalidName) return

  const field = form.elements.namedItem(firstInvalidName)
  let target: Element | null = null

  if (field instanceof Element) {
    target = field
  } else if (field && 'length' in field && field.length > 0) {
    target = field.item(0)
  }

  if (target instanceof HTMLElement) {
    target.focus()
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

export default function ConferenceRegistrationPage() {
  const { t, language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState<'idle' | 'success' | 'error'>('idle')
  const [paymentInstructions, setPaymentInstructions] = useState<PaymentInstructions | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [showGuardianConsentForm, setShowGuardianConsentForm] = useState(false)
  const validationCopy = validationMessages[language]

  const clearFieldError = (name: string) => {
    if (!name) return
    setFieldErrors((current) => {
      if (!(name in current)) return current
      const next = { ...current }
      delete next[name as RegistrationField]
      return next
    })
  }

  const handleFormChange = (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      if (target instanceof HTMLInputElement && target.name === 'ageConfirmation') {
        const needsGuardianConsent = target.value === GUARDIAN_CONSENT_AGE_CONFIRMATION
        setShowGuardianConsentForm(needsGuardianConsent)

        if (!needsGuardianConsent) {
          setFieldErrors((current) => {
            const next = { ...current }
            delete next.guardianName
            delete next.guardianRelation
            delete next.guardianPhone
            delete next.guardianEmail
            delete next.guardianConsent
            return next
          })
        }
      }

      clearFieldError(target.name)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = normalizeConferenceRegistrationPayload(Object.fromEntries(formData))
    setShowGuardianConsentForm(requiresGuardianConsent(payload))

    const nextErrors = buildRegistrationFieldErrors(payload, language)
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setStatusType('error')
      setStatusMessage(validationCopy.summary)
      requestAnimationFrame(() => focusFirstInvalidField(form, nextErrors))
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)
    setStatusMessage('')
    setStatusType('idle')

    try {
      const response = await fetch('/api/conference/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        if (Array.isArray(result.missingFields)) {
          const serverErrors = result.missingFields.reduce((errors: FieldErrors, field: string) => {
            if (field in validationLabels[language]) {
              errors[field as RegistrationField] = validationCopy.required(validationLabels[language][field as RegistrationField])
            }
            return errors
          }, {} as FieldErrors)
          setFieldErrors(serverErrors)
          requestAnimationFrame(() => focusFirstInvalidField(form, serverErrors))
        }
        throw new Error(result.message || 'Registration could not be submitted.')
      }

      setSubmitted(true)
      setPaymentInstructions(result.paymentInstructions || null)
      setStatusType('success')
      setStatusMessage(result.code === 'square_checkout_unavailable'
        ? `Registration received. Square Checkout is unavailable, so use the e-Transfer backup. ID: ${result.registrationId}`
        : `Registration received. Complete payment with the checkout link below. ID: ${result.registrationId}`)
    } catch (error) {
      setStatusType('error')
      setStatusMessage(error instanceof Error ? error.message : 'Registration could not be submitted.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-brand-dark selection:bg-brand-purple selection:text-white">
      <header className="sticky top-0 z-[100] grid grid-cols-[auto_1fr_auto] items-center border-b border-slate-100 bg-white px-6 py-6 shadow-sm md:px-16 md:bg-white/95 md:backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link href="/">
            <img src="/logo.png" alt="PassionFruits" className="h-14 w-auto drop-shadow-md md:-mt-6 md:-mb-4 md:h-28" />
          </Link>
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
        </div>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 justify-center gap-12 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.25em] text-slate-600 lg:flex">
          <Link href="/" className="transition-all hover:text-brand-purple">{t('nav.home')}</Link>
          <Link href="/conference" className="border-b-2 border-brand-purple pb-1 text-brand-purple">{t('nav.conference')}</Link>
          <Link href="/events" className="transition-all hover:text-brand-purple">{t('nav.events')}</Link>
          <Link href="/about" className="transition-all hover:text-brand-purple">{t('nav.about')}</Link>
          <Link href="/contact" className="transition-all hover:text-brand-purple">{t('nav.contact')}</Link>
        </nav>

        <div className="col-start-3 flex items-center justify-self-end gap-4">
          <Link href="/contact" className="hidden rounded-full bg-brand-purple px-10 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all hover:scale-105 sm:block">
            {t('nav.join')}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="z-[110] flex h-12 w-12 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Open menu"
          >
            <span className={`h-0.5 w-6 bg-brand-dark transition-all ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-brand-dark transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-brand-dark transition-all ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-brand-dark px-5 py-16 text-white md:px-6 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,251,189,0.22),transparent_35%),linear-gradient(135deg,rgba(154,120,180,0.35),transparent_55%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <Link href="/conference" className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-yellow transition hover:text-white">
                <span className="material-icons text-sm">arrow_back</span>
                Back to Conference
              </Link>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.45em] text-brand-yellow md:text-xs">
                August 13-15, 2026
              </p>
              <BrandHeading
                tag="h1"
                text="Conference Registration"
                className="max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-5xl md:text-7xl"
              />
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-sm md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-yellow">PassionFruits Conference 2026</p>
              <h2 className="mt-4 text-2xl font-black leading-tight md:text-3xl">Judges: Conquest to Conquer</h2>
              <p className="mt-5 text-sm font-bold leading-relaxed text-white/75">
                A gathering for young adults ages 18-25 to encounter God, build meaningful community, and grow in purpose.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-12 md:px-6 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <aside className="space-y-6 lg:sticky lg:top-32">
              <div className="rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-purple">Welcome</p>
                <p className="mt-5 text-base font-bold leading-relaxed text-slate-600">
                  We are excited to have you join PassionFruits Conference 2026. Please complete the form carefully.
                </p>
                <div className="mt-6 rounded-2xl bg-brand-yellow/60 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-dark">Base Registration Fee</p>
                  <p className="mt-2 text-3xl font-black text-brand-dark">100 CAD</p>
                  <p className="mt-2 text-xs font-bold leading-relaxed text-brand-dark/70">
                    If you are registering as a church, please contact us through our email.
                    <br />
                    Contact Info: passionfruitsministry@gmail.com
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border-2 border-brand-purple/20 bg-brand-purple/5 p-6 md:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-purple">Before You Submit</p>
                <div className="mt-5 space-y-4">
                  {[
                    ['badge', 'Use your correct name and contact information'],
                    ['contact_emergency', 'Have your emergency contact ready'],
                    ['payments', 'Pay securely after submitting'],
                  ].map(([icon, text]) => (
                    <div key={text} className="flex items-center gap-3 text-sm font-black text-brand-dark">
                      <span className="material-icons flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg text-brand-purple shadow-sm">{icon}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border-2 border-slate-200 bg-slate-50 p-6 md:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-purple">Stay Connected</p>
                <div className="mt-5 space-y-3 text-sm font-black text-brand-dark">
                  <a href="https://www.instagram.com/passionfruits_ministry/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition hover:text-brand-purple">
                    <span className="material-icons text-lg">camera_alt</span>
                    @passionfruits_ministry
                  </a>
                  <a href="https://www.passionfruits.ca" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition hover:text-brand-purple">
                    <span className="material-icons text-lg">language</span>
                    www.passionfruits.ca
                  </a>
                </div>
              </div>
            </aside>

            <form noValidate onSubmit={handleSubmit} onChange={handleFormChange} className="space-y-8">
              {Object.keys(fieldErrors).length > 0 && (
                <div role="alert" className="rounded-[2rem] border-2 border-red-200 bg-red-50 p-5 text-red-700 shadow-sm md:p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-icons mt-0.5 text-xl">error</span>
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.18em]">{validationCopy.title}</p>
                      <p className="mt-2 text-sm font-bold leading-relaxed">{validationCopy.summary}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-purple">Theme Verse</p>
                <blockquote className="mt-4 text-base font-bold leading-relaxed text-slate-600 md:text-lg">
                  "But you are a chosen people, a royal priesthood, a holy nation, God's special possession, that you may declare the praises of him who called you out of darkness into his wonderful light." - 1 Peter 2:9
                </blockquote>
              </div>

              <FormSection number="1" title="Personal Information">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextField label="First Name" name="firstName" error={fieldErrors.firstName} required />
                  <TextField label="Last Name" name="lastName" error={fieldErrors.lastName} required />
                  <TextField label="Preferred Name" name="preferredName" />
                  <TextField label="Age" name="age" type="number" min={18} max={25} error={fieldErrors.age} required />
                </div>
                <RadioGroup label="Gender" name="gender" options={['Male', 'Female']} error={fieldErrors.gender} required />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextField label="Phone Number" name="phone" type="tel" error={fieldErrors.phone} required />
                  <TextField label="Email" name="email" type="email" error={fieldErrors.email} required />
                </div>
              </FormSection>

              <FormSection number="2" title="Church / Community Information">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextField label="Church Name" name="churchName" error={fieldErrors.churchName} required />
                  <TextField label="Pastor / Leader Name" name="pastorName" placeholder="Optional" />
                </div>
                <RadioGroup label="Are you attending with a group?" name="attendingWithGroup" options={['Yes', 'No']} error={fieldErrors.attendingWithGroup} required />
                <TextField label="If yes, group / church name" name="groupName" />
              </FormSection>

              <FormSection number="3" title="Emergency Contact Info.">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextField label="First Name" name="emergencyFirstName" error={fieldErrors.emergencyFirstName} required />
                  <TextField label="Last Name" name="emergencyLastName" error={fieldErrors.emergencyLastName} required />
                  <TextField label="Relation" name="emergencyRelation" error={fieldErrors.emergencyRelation} required />
                  <TextField label="Phone Number" name="emergencyPhone" type="tel" error={fieldErrors.emergencyPhone} required />
                </div>
              </FormSection>

              <FormSection number="4" title="Spiritual & Community Questions">
                <TextAreaField label="Q1. What made you interested in this conference?" name="interest" error={fieldErrors.interest} required />
                <TextAreaField label="Q2. What are the area that you want to overcome with?" name="overcome" error={fieldErrors.overcome} required />
                <RadioGroup label="Have you attended PassionFruits Conference before?" name="attendedBefore" options={['Yes', 'No']} error={fieldErrors.attendedBefore} required />
              </FormSection>

              <FormSection number="5" title="Media & Consent">
                <CheckboxField name="mediaConsent" error={fieldErrors.mediaConsent} required>
                  I understand that all photographs and videos taken during the conference may be used for social media and other promotional purposes without prior notices.
                </CheckboxField>
                <CheckboxField name="guidelinesConsent" error={fieldErrors.guidelinesConsent} required>
                  I agree to follow conference guidelines and respect fellow attendees and staff.
                </CheckboxField>
                <RadioGroup label="Are you older than 18?" name="ageConfirmation" options={[ADULT_AGE_CONFIRMATION, GUARDIAN_CONSENT_AGE_CONFIRMATION]} error={fieldErrors.ageConfirmation} required />
                {showGuardianConsentForm && (
                  <div className="rounded-[1.5rem] border-2 border-brand-purple/20 bg-brand-purple/5 p-5 md:p-6">
                    <div className="mb-5 flex items-start gap-3">
                      <span className="material-icons flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-purple text-lg text-white">assignment</span>
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-purple">Parent/Guardian Consent Form</p>
                        <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
                          Since you are 18, please complete this section now with your parent/guardian information.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <TextField label="Parent/Guardian Full Name" name="guardianName" error={fieldErrors.guardianName} required />
                      <TextField label="Relation" name="guardianRelation" error={fieldErrors.guardianRelation} required />
                      <TextField label="Parent/Guardian Phone" name="guardianPhone" type="tel" error={fieldErrors.guardianPhone} required />
                      <TextField label="Parent/Guardian Email" name="guardianEmail" type="email" error={fieldErrors.guardianEmail} required />
                    </div>
                    <div className="mt-5">
                      <CheckboxField name="guardianConsent" error={fieldErrors.guardianConsent} required>
                        I confirm that my parent/guardian has reviewed this registration and gives consent for me to attend PassionFruits Conference 2026.
                      </CheckboxField>
                    </div>
                  </div>
                )}
                <CheckboxField name="accuracyConfirm" error={fieldErrors.accuracyConfirm} required>
                  I confirm that all information provided is accurate.
                </CheckboxField>
              </FormSection>

              <FormSection number="6" title="Payment Information">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-2xl bg-brand-dark p-6 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-yellow">Base Fee</p>
                    <p className="mt-3 text-4xl font-black">100 CAD</p>
                    <p className="mt-3 text-xs font-bold leading-relaxed text-white/60">After submitting, you can pay securely with Apple Pay, Google Pay, or card.</p>
                  </div>
                  <div className="space-y-2">
                    <TextField label="Group Registration Code" name="groupRegistrationCode" placeholder="Optional" />
                    <p className="text-xs font-bold leading-relaxed text-slate-500">
                      If you have group registration code, please enter your code.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-brand-purple/20 bg-brand-purple/5 p-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-purple">After You Submit</p>
                    <p className="mt-3 text-sm font-bold leading-relaxed text-slate-600">
                      You will receive a secure checkout link for the final amount. Keep your payment receipt for your records.
                    </p>
                  </div>
                </div>
              </FormSection>

              {paymentInstructions && (
                <div className="rounded-[2rem] border-2 border-emerald-200 bg-emerald-50 p-6 md:p-8">
                  <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-700">
                        {paymentInstructions.checkoutUrl ? 'Square Checkout' : 'E-Transfer Backup'}
                      </p>
                      <h3 className="mt-3 text-2xl font-black text-brand-dark">
                        {paymentInstructions.amountCad > 0 ? `Pay ${paymentInstructions.amountCad} CAD` : 'Payment waived'}
                      </h3>
                      <div className="mt-5 grid gap-3 text-sm font-bold text-slate-700">
                        {paymentInstructions.checkoutUrl ? (
                          <>
                            <p><span className="font-black text-brand-dark">Method:</span> Apple Pay, Google Pay, or card through Square</p>
                            <p><span className="font-black text-brand-dark">Order:</span> {paymentInstructions.squareOrderId}</p>
                          </>
                        ) : (
                          <p><span className="font-black text-brand-dark">Recipient:</span> {paymentInstructions.recipientEmail}</p>
                        )}
                        {typeof paymentInstructions.discountCad === 'number' && paymentInstructions.discountCad > 0 && (
                          <p><span className="font-black text-brand-dark">Group discount:</span> -{paymentInstructions.discountCad} CAD</p>
                        )}
                        <p><span className="font-black text-brand-dark">Memo:</span> {paymentInstructions.memo}</p>
                        <p><span className="font-black text-brand-dark">Status:</span> Pending payment confirmation</p>
                      </div>
                      {paymentInstructions.checkoutUrl && (
                        <a
                          href={paymentInstructions.checkoutUrl}
                          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-dark px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg transition hover:scale-[1.01] active:scale-95 sm:w-auto"
                        >
                          Pay with Square
                          <span className="material-icons text-lg">open_in_new</span>
                        </a>
                      )}
                      {paymentInstructions.checkoutUrl && paymentInstructions.fallbackRecipientEmail && (
                        <p className="mt-4 text-xs font-bold leading-relaxed text-emerald-800/70">
                          If checkout does not work, send e-Transfer to {paymentInstructions.fallbackRecipientEmail} and use the same memo.
                        </p>
                      )}
                    </div>
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <QRCodeSVG
                        value={paymentInstructions.checkoutUrl || [
                          'Interac e-Transfer',
                          'PassionFruits Conference 2026',
                          `Recipient: ${paymentInstructions.recipientEmail}`,
                          `Amount CAD: ${paymentInstructions.amountCad}`,
                          `Memo: ${paymentInstructions.memo}`,
                        ].join('\n')}
                        size={148}
                        level="M"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="sticky bottom-4 z-30 rounded-[2rem] border-2 border-brand-purple/30 bg-white/95 p-5 shadow-2xl shadow-brand-purple/10 backdrop-blur md:static md:p-8">
                <p className="text-lg font-black text-brand-dark">We cannot wait to worship, grow, and encounter God together with you at PassionFruits Conference 2026.</p>
                <p className="mt-3 text-sm font-bold text-slate-500">After submitting, continue to the secure checkout link to complete your registration.</p>
                <button type="submit" disabled={isSubmitting} className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-dark px-8 py-5 text-sm font-black uppercase tracking-[0.22em] text-white shadow-xl transition hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto">
                  {isSubmitting ? 'Creating Checkout...' : 'Submit and Create Checkout'}
                  <span className="material-icons text-lg">{isSubmitting ? 'sync' : 'send'}</span>
                </button>
                {statusMessage && (
                  <p className={`mt-5 rounded-2xl px-4 py-3 text-sm font-black ${statusType === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                    {statusMessage}
                  </p>
                )}
                {submitted && statusType === 'success' && (
                  <p className="mt-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Payment pending until checkout is complete
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      <div className={`fixed inset-0 z-[99999] flex flex-col bg-white transition-all duration-500 ease-in-out ${isMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'}`}>
        <div className="flex items-center justify-between border-b border-slate-100 p-8">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <img src="/logo.png" alt="PassionFruits" className="h-10 w-auto" />
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 shadow-sm"
            aria-label="Close menu"
          >
            <span className="material-icons text-3xl text-brand-dark">close</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto p-12">
          <div className="mb-8 scale-110">
            <LanguageSelector />
          </div>
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.home')}
          </Link>
          <Link href="/conference" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-purple">
            {t('nav.conference')}
          </Link>
          <Link href="/events" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.events')}
          </Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.about')}
          </Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.contact')}
          </Link>
        </div>
      </div>
    </div>
  )
}
