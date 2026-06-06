'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { BrandHeading } from '@/components/BrandHeading'
import { QRCodeSVG } from 'qrcode.react'

const APP_INSTALL_URL = 'https://www.passionfruits.ca/app/download?install=1'

function CompletionContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('registrationId') || ''
  const status = searchParams.get('status') || ''

  const isPaid = !status || status === 'checkout_link_created' || status === 'paid'
  const isWaived = status === 'waived'

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-dark px-5 py-16 text-white md:px-6 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,251,189,0.22),transparent_35%),linear-gradient(135deg,rgba(154,120,180,0.35),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Link href="/conference" className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-yellow transition hover:text-white">
            <span className="material-icons text-sm">arrow_back</span>
            Back to Conference
          </Link>
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.45em] text-brand-yellow md:text-xs">
            August 13-15, 2026
          </p>
          <BrandHeading
            tag="h1"
            text="Registration Complete"
            className="max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-5xl md:text-7xl"
          />
        </div>
      </section>

      {/* Completion Card */}
      <section className="px-5 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Success Icon + Message */}
          <div className="rounded-[2rem] border-2 border-emerald-200 bg-emerald-50 p-8 text-center shadow-[0_18px_50px_rgba(16,185,129,0.12)] md:p-12">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 shadow-lg shadow-emerald-200/50 animate-[bounceIn_0.6s_ease-out]">
              <span className="material-icons text-5xl text-emerald-600">check_circle</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-dark md:text-3xl">
              {isPaid || isWaived ? 'Registration Complete!' : 'Registration Received!'}
            </h2>
            <p className="mt-4 text-base font-bold leading-relaxed text-slate-600 md:text-lg">
              {isPaid
                ? 'Your payment has been processed and your registration is confirmed.'
                : isWaived
                  ? 'Your registration fee has been waived. You are all set!'
                  : 'Your registration has been received. Please complete payment to confirm your spot.'}
            </p>
            <p className="mt-4 text-base font-bold leading-relaxed text-slate-600 md:text-lg">
              결제가 완료되었으며 등록이 확인되었습니다.
            </p>

            {registrationId && (
              <div className="mt-6 inline-block rounded-2xl bg-white px-6 py-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Registration ID</p>
                <p className="mt-2 text-xl font-black tracking-wide text-brand-purple">{registrationId}</p>
              </div>
            )}
          </div>

          {/* Conference Details */}
          <div className="rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-purple">Conference Details</p>
            <h3 className="mt-4 text-xl font-black text-brand-dark md:text-2xl">PassionFruits Conference 2026</h3>
            <p className="mt-2 text-lg font-black text-brand-purple">Judges: Conquest to Conquer</p>
            <div className="mt-6 space-y-4">
              {[
                ['calendar_today', 'August 13-15, 2026'],
                ['groups', 'All ages welcome'],
                ['auto_stories', '"But you are a chosen people, a royal priesthood..." - 1 Peter 2:9'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                  <span className="material-icons mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-purple/10 text-lg text-brand-purple">{icon}</span>
                  <span className="leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Next */}
          <div className="rounded-[2rem] border-2 border-brand-purple/20 bg-brand-purple/5 p-6 md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-purple">What&apos;s Next</p>
            <div className="mt-5 space-y-4">
              {[
                ['email', 'Check your email for a confirmation receipt from Square'],
                ['notifications', 'Follow @passionfruits_ministry on Instagram for updates'],
                ['phone_iphone', 'Download the PassionFruits app for event details'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-3 text-sm font-black text-brand-dark">
                  <span className="material-icons flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg text-brand-purple shadow-sm">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download App Section */}
          <div className="rounded-[2rem] border-2 border-slate-200 bg-slate-50 p-6 md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-purple">Download the App</p>
            <div className="mt-5 flex flex-col md:flex-row items-center gap-6">
              <div className="rounded-2xl bg-white p-4 shadow-sm shrink-0">
                <QRCodeSVG value={APP_INSTALL_URL} size={120} level="H" includeMargin={false} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-base font-black text-brand-dark">
                  앱을 통해 간편하게 소식을 확인하세요!
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  Stay updated, connect with the community, and check event schedules easily on the PassionFruits App.
                </p>
                <a
                  href={APP_INSTALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-purple px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  <span className="material-icons text-sm">download</span>
                  Install App
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
            <Link
              href="/conference"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-dark px-8 py-5 text-sm font-black uppercase tracking-[0.22em] text-white shadow-xl transition hover:scale-[1.01] active:scale-95 sm:w-auto"
            >
              Conference Page
              <span className="material-icons text-lg">arrow_forward</span>
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border-2 border-slate-200 bg-white px-8 py-5 text-sm font-black uppercase tracking-[0.22em] text-brand-dark shadow-sm transition hover:border-brand-purple hover:scale-[1.01] active:scale-95 sm:w-auto"
            >
              Home
              <span className="material-icons text-lg">home</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default function ConferenceRegistrationCompletePage() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  React.useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

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
        <Suspense fallback={
          <section className="flex min-h-[60vh] items-center justify-center px-5 py-20">
            <div className="text-center">
              <span className="material-icons animate-spin text-4xl text-brand-purple">sync</span>
              <p className="mt-4 text-sm font-black uppercase tracking-widest text-slate-400">Loading...</p>
            </div>
          </section>
        }>
          <CompletionContent />
        </Suspense>
      </main>

      {/* Mobile Menu */}
      <div
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 z-[2147483647] flex h-[100dvh] flex-col overflow-hidden bg-white transition-opacity duration-200 ease-out lg:hidden ${isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-6">
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
