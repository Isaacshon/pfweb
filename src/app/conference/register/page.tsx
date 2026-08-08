'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ADULT_AGE_CONFIRMATION,
  CONFERENCE_MAX_AGE,
  CONFERENCE_MIN_AGE,
  GUARDIAN_CONSENT_AGE_CONFIRMATION,
  normalizeConferenceRegistrationPayload,
} from '@/lib/conferenceRegistration'

const inputClass = 'w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-semibold text-brand-dark outline-none transition focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10'
const labelClass = 'mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-600'

export default function ConferenceRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')
  const [isError, setIsError] = useState(false)
  const [attendingWithGroup, setAttendingWithGroup] = useState('')
  const [ageConfirmation, setAgeConfirmation] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('')
    setIsError(false)

    try {
      const form = event.currentTarget
      const payload = normalizeConferenceRegistrationPayload(Object.fromEntries(new FormData(form)))
      const response = await fetch('/api/conference/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration could not be submitted.')
      }

      form.reset()
      setAttendingWithGroup('')
      setAgeConfirmation('')
      setStatus(`Registration submitted successfully. ID: ${result.registrationId}`)
    } catch (error) {
      setIsError(true)
      setStatus(error instanceof Error ? error.message : 'Registration could not be submitted.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfaf3] px-4 py-8 text-brand-dark sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center">
            <img src="/logo.png" alt="PassionFruits" className="h-12 w-auto" />
          </Link>
          <Link href="/conference" className="text-xs font-black uppercase tracking-[0.16em] text-brand-purple hover:opacity-70">
            Conference
          </Link>
        </div>

        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-purple">PassionFruits Conference 2026</p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">Registration Form</h1>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
            Please complete the form below. Registration is open to participants aged {CONFERENCE_MAX_AGE} and under.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-6 text-xl font-black">Personal Information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <label><span className={labelClass}>First Name *</span><input name="firstName" required className={inputClass} /></label>
              <label><span className={labelClass}>Last Name *</span><input name="lastName" required className={inputClass} /></label>
              <label><span className={labelClass}>Preferred Name</span><input name="preferredName" className={inputClass} /></label>
              <label><span className={labelClass}>Age *</span><input name="age" type="number" min={CONFERENCE_MIN_AGE} max={CONFERENCE_MAX_AGE} required className={inputClass} /></label>
              <label><span className={labelClass}>Phone Number *</span><input name="phone" type="tel" required className={inputClass} /></label>
              <label><span className={labelClass}>Email *</span><input name="email" type="email" required className={inputClass} /></label>
            </div>
            <fieldset className="mt-5">
              <legend className={labelClass}>Gender *</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Male', 'Female'].map((value) => <label key={value} className="rounded-2xl border-2 border-slate-200 p-4 font-bold"><input type="radio" name="gender" value={value} required className="mr-3 accent-brand-purple" />{value}</label>)}
              </div>
            </fieldset>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-6 text-xl font-black">Church / Community</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <label><span className={labelClass}>Church Name *</span><input name="churchName" required className={inputClass} /></label>
              <label><span className={labelClass}>Pastor / Leader Name</span><input name="pastorName" className={inputClass} /></label>
            </div>
            <fieldset className="mt-5">
              <legend className={labelClass}>Are you attending with a group? *</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Yes', 'No'].map((value) => <label key={value} className="rounded-2xl border-2 border-slate-200 p-4 font-bold"><input type="radio" name="attendingWithGroup" value={value} required onChange={() => setAttendingWithGroup(value)} className="mr-3 accent-brand-purple" />{value}</label>)}
              </div>
            </fieldset>
            {attendingWithGroup === 'Yes' && <div className="mt-5 grid gap-5"><label><span className={labelClass}>Group / Church Name *</span><input name="groupName" required className={inputClass} /></label><label><span className={labelClass}>Group Registration Code</span><input name="groupRegistrationCode" className={inputClass} /></label></div>}
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-6 text-xl font-black">Emergency Contact</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <label><span className={labelClass}>First Name *</span><input name="emergencyFirstName" required className={inputClass} /></label>
              <label><span className={labelClass}>Last Name *</span><input name="emergencyLastName" required className={inputClass} /></label>
              <label><span className={labelClass}>Relation *</span><input name="emergencyRelation" required className={inputClass} /></label>
              <label><span className={labelClass}>Phone Number *</span><input name="emergencyPhone" type="tel" required className={inputClass} /></label>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-6 text-xl font-black">Conference Questions</h2>
            <div className="space-y-5">
              <label><span className={labelClass}>What made you interested in this conference? *</span><textarea name="interest" required className={`${inputClass} min-h-28 resize-y`} /></label>
              <label><span className={labelClass}>What area do you want to overcome? *</span><textarea name="overcome" required className={`${inputClass} min-h-28 resize-y`} /></label>
            </div>
            <fieldset className="mt-5">
              <legend className={labelClass}>Have you attended PassionFruits Conference before? *</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Yes', 'No'].map((value) => <label key={value} className="rounded-2xl border-2 border-slate-200 p-4 font-bold"><input type="radio" name="attendedBefore" value={value} required className="mr-3 accent-brand-purple" />{value}</label>)}
              </div>
            </fieldset>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-6 text-xl font-black">Consent</h2>
            <div className="space-y-4">
              <label className="block rounded-2xl border-2 border-slate-200 p-4 text-sm font-semibold leading-6"><input type="checkbox" name="mediaConsent" value="Agreed" required className="mr-3 accent-brand-purple" />I understand that photographs and videos taken during the conference may be used for social media and promotional purposes.</label>
              <label className="block rounded-2xl border-2 border-slate-200 p-4 text-sm font-semibold leading-6"><input type="checkbox" name="guidelinesConsent" value="Agreed" required className="mr-3 accent-brand-purple" />I agree to follow conference guidelines and respect fellow attendees and staff.</label>
            </div>
            <fieldset className="mt-5">
              <legend className={labelClass}>Participant age / guardian status *</legend>
              <div className="space-y-3">
                {[ADULT_AGE_CONFIRMATION, GUARDIAN_CONSENT_AGE_CONFIRMATION].map((value) => <label key={value} className="block rounded-2xl border-2 border-slate-200 p-4 text-sm font-bold"><input type="radio" name="ageConfirmation" value={value} required onChange={() => setAgeConfirmation(value)} className="mr-3 accent-brand-purple" />{value}</label>)}
              </div>
            </fieldset>
            {ageConfirmation === GUARDIAN_CONSENT_AGE_CONFIRMATION && <div className="mt-5 grid gap-5 sm:grid-cols-2"><label><span className={labelClass}>Parent / Guardian Full Name *</span><input name="guardianName" required className={inputClass} /></label><label><span className={labelClass}>Relation *</span><input name="guardianRelation" required className={inputClass} /></label><label><span className={labelClass}>Parent / Guardian Phone *</span><input name="guardianPhone" type="tel" required className={inputClass} /></label><label><span className={labelClass}>Parent / Guardian Email *</span><input name="guardianEmail" type="email" required className={inputClass} /></label><label className="sm:col-span-2"><span className={labelClass}>Parent / Guardian Signature *</span><input name="guardianSignature" required className={inputClass} /></label><label className="sm:col-span-2 block rounded-2xl border-2 border-slate-200 p-4 text-sm font-semibold leading-6"><input type="checkbox" name="guardianConsent" value="Agreed" required className="mr-3 accent-brand-purple" />I confirm that my parent/guardian has reviewed this registration and gives consent for me to attend.</label></div>}
            <label className="mt-5 block rounded-2xl border-2 border-slate-200 p-4 text-sm font-semibold leading-6"><input type="checkbox" name="accuracyConfirm" value="Agreed" required className="mr-3 accent-brand-purple" />I confirm that all information provided is accurate.</label>
          </section>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center rounded-full bg-brand-dark px-8 py-5 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
            {status && <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{status}</p>}
          </div>
        </form>
      </div>
    </main>
  )
}
