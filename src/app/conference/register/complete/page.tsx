'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function CompletionContent() {
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('registrationId') || ''

  return (
    <main className="min-h-screen bg-[#fbfaf3] px-5 py-12 text-brand-dark md:px-6 md:py-20">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center">
          <img src="/logo.png" alt="PassionFruits" className="h-12 w-auto" />
        </Link>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-7 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <span className="material-icons text-4xl text-emerald-600">check_circle</span>
          </div>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.24em] text-brand-purple">PassionFruits Conference 2026</p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-5xl">Registration Complete</h1>
          <p className="mt-5 text-base font-semibold leading-7 text-slate-600">Your registration has been received successfully. We look forward to seeing you at the conference.</p>

          {registrationId && (
            <div className="mt-7 rounded-2xl bg-slate-50 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Registration ID</p>
              <p className="mt-2 text-lg font-black text-brand-purple">{registrationId}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/conference/register" className="rounded-full bg-brand-dark px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white">Registration Form</Link>
            <Link href="/" className="rounded-full border-2 border-slate-200 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-dark">Home</Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default function ConferenceRegistrationCompletePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#fbfaf3]" />}>
      <CompletionContent />
    </Suspense>
  )
}
