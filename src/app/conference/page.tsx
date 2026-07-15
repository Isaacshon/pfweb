'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { BrandHeading } from '@/components/BrandHeading'
import { CONFERENCE_MAX_AGE } from '@/lib/conferenceRegistration'
import { getSiteSettingValue, useLiveSiteSettings } from '@/lib/liveSiteSettings'

const lightFocus = 'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/25 focus-visible:ring-offset-2'
const darkFocus = 'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark'

export default function ConferencePage() {
  const { t, language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [content, setContent] = useState<any>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusFirstItem = window.setTimeout(() => {
      const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])')
      firstFocusable?.focus()
    }, 0)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        mobileMenuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusFirstItem)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      menuButtonRef.current?.focus()
    }
  }, [isMenuOpen])

  useLiveSiteSettings((settingsData) => {
    const pageContent = getSiteSettingValue(settingsData, 'page_content')
    if (pageContent && pageContent.conference) setContent(pageContent.conference)
  })

  const localizedContent = language === 'en' ? content : null
  const heroDate = localizedContent?.heroDate || t('conference.heroDate')
  const heroTitle = localizedContent?.heroTitle || t('conference.heroTitle')
  const heroSubtitle = localizedContent?.heroSubtitle || t('conference.heroSubtitle')
  const verse = localizedContent?.verse || t('conference.verse')
  const registerLabel = t('conference.registerNow')
  const speakerList = localizedContent?.speakers || [
    { name: t('conference.guestSpeaker1'), role: t('conference.toBeAnnounced') },
    { name: t('conference.guestSpeaker2'), role: t('conference.toBeAnnounced') },
    { name: t('conference.guestSpeaker3'), role: t('conference.toBeAnnounced') },
    { name: t('conference.guestSpeaker4'), role: t('conference.toBeAnnounced') },
  ]

  const passRows = [
    ['Date', heroDate],
    ['Location', 'Toronto, Ontario'],
    ['Audience', `Ages ${CONFERENCE_MAX_AGE} and under`],
  ]

  const registrationDetails = [
    ['Fee', '100 CAD'],
    ['Eligibility', `Ages ${CONFERENCE_MAX_AGE} and under`],
    ['Included', 'Conference T-shirt, snacks'],
    ['Not included', 'Meals, travel, accommodation'],
    ['Group registration', 'Email passionfruitsministry@gmail.com before submitting individual forms.'],
  ]

  const paymentSteps = [
    'Submit the registration form',
    'Complete payment through Square',
    'Check your email for confirmation',
  ]

  const speakerTracks = [
    ['Main sessions', 'Conference speakers will be announced soon.'],
    ['Seminars', 'Workshop and activity leaders are being finalized.'],
    ['Worship', 'Worship and ministry guests will be shared through updates.'],
  ]

  const schedule = [
    {
      day: t('conference.day1'), date: t('conference.date1'),
      note: 'Opening night',
      events: [
        { time: '5:00 PM', desc: 'Registration' },
        { time: '6:00 PM', desc: 'Recreation' },
        { time: '7:00 PM', desc: 'Worship' },
        { time: '8:00 PM', desc: 'Altar Call' },
        { time: '9:00 PM', desc: 'Overflow' },
        { time: '10:00 PM', desc: 'Connection' },
        { time: '11:00 PM', desc: 'Dismissal' },
      ],
    },
    {
      day: t('conference.day2'), date: t('conference.date2'),
      note: 'Full program day',
      events: [
        { time: '9:30 AM', desc: 'Coffee Time' },
        { time: '10:00 AM', desc: 'Morning Worship (Praise, Prayer, Message)' },
        { time: '1:00 PM', desc: 'Seminar & Activities' },
        { time: '7:00 PM', desc: 'Worship' },
        { time: '9:00 PM', desc: 'Altar Call' },
        { time: '10:00 PM', desc: 'Overflow' },
        { time: '11:00 PM', desc: 'Reflection & Dismissal' },
      ],
    },
    {
      day: t('conference.day3'), date: t('conference.date3'),
      note: 'Community and closing',
      events: [
        { time: '1:00 PM', desc: 'Church Ministry Fair' },
        { time: '6:00 PM', desc: 'Open Worship' },
        { time: '9:00 PM', desc: 'Clean Up' },
      ],
    },
  ]

  const renderRegistrationRail = (compact = false) => (
    <aside className={`${compact ? 'lg:hidden' : 'hidden lg:block'} min-w-0 self-start lg:sticky lg:top-28`}>
      <div className="w-full max-w-full overflow-hidden rounded-[2rem] border border-[#e4ddcf] bg-white shadow-[0_24px_80px_rgba(18,28,42,0.08)]">
        <div className="bg-brand-dark p-6 text-white">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-yellow">Registration details</p>
          <p className="mt-5 font-mono text-5xl font-black leading-none text-white">100 CAD</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/70">Includes conference T-shirt and snacks. Meals are not included.</p>
        </div>

        <div className="divide-y divide-slate-100">
          {registrationDetails.slice(1).map(([label, value]) => (
            <div key={label} className="grid grid-cols-1 gap-2 px-5 py-5 sm:grid-cols-[7.25rem_minmax(0,1fr)] sm:gap-4 sm:px-6">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="min-w-0 break-words text-sm font-bold leading-6 text-brand-dark [overflow-wrap:anywhere]">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#fbfaf3] p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Payment flow</p>
          <ol className="mt-4 space-y-3">
            {paymentSteps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm font-bold leading-6 text-[#39465a]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-purple text-[10px] font-black text-white">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <Link href="/conference/register" className={`mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-dark px-6 py-4 text-center text-sm font-black uppercase tracking-[0.08em] text-white transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] sm:tracking-[0.16em] ${lightFocus}`}>
            {registerLabel}
          </Link>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf3] text-brand-dark selection:bg-brand-purple selection:text-white">
      <header className="sticky top-0 z-[100] grid h-16 grid-cols-[auto_1fr_auto] items-center border-b border-slate-200/70 bg-[#fbfaf3]/90 px-5 backdrop-blur-xl md:h-20 md:px-10">
        <div className="flex items-center gap-5">
          <Link href="/" className={lightFocus}>
            <img src="/logo.png" alt="PassionFruits" className="h-11 w-auto drop-shadow-sm md:h-14" />
          </Link>
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
        </div>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 justify-center gap-8 whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500 lg:flex">
          <Link href="/" className={`transition-colors hover:text-brand-dark ${lightFocus}`}>{t('nav.home')}</Link>
          <Link href="/conference" className={`border-b-2 border-brand-purple pb-1 text-brand-dark ${lightFocus}`}>{t('nav.conference')}</Link>
          <Link href="/events" className={`transition-colors hover:text-brand-dark ${lightFocus}`}>{t('nav.events')}</Link>
          <Link href="/about" className={`transition-colors hover:text-brand-dark ${lightFocus}`}>{t('nav.about')}</Link>
          <Link href="/contact" className={`transition-colors hover:text-brand-dark ${lightFocus}`}>{t('nav.contact')}</Link>
        </nav>

        <div className="col-start-3 flex items-center justify-self-end gap-4">
          <Link href="/conference/register" className={`hidden rounded-full bg-brand-dark px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:block ${lightFocus}`}>
            {registerLabel}
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-controls="conference-mobile-menu"
            aria-expanded={isMenuOpen}
            className={`z-[110] flex h-12 w-12 flex-col items-center justify-center gap-1.5 lg:hidden ${lightFocus}`}
          >
            <span className={`h-0.5 w-6 bg-brand-dark transition-all ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-brand-dark transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-brand-dark transition-all ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-brand-dark px-5 py-14 text-white md:px-6 md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#121c2a_0%,#172235_48%,#0f1724_100%)]" />
        <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.7)_0_1px,transparent_1px_78px)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-dark to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:min-h-[590px] lg:grid-cols-[minmax(0,1.12fr)_390px] lg:items-center">
          <div>
            <span className="mb-5 inline-flex border-l-4 border-brand-yellow pl-4 text-[11px] font-black uppercase tracking-[0.28em] text-brand-yellow">
              {heroDate}
            </span>
            <BrandHeading
              tag="h1"
              lines={[heroTitle, t('conference.titleSuffix')]}
              className={`
                mb-6 text-[clamp(2.2rem,11vw,3rem)] font-black uppercase tracking-tight [overflow-wrap:anywhere] sm:text-[clamp(2.65rem,10vw,4.6rem)] md:text-[clamp(3.5rem,7vw,6.25rem)] md:tracking-[-0.055em]
                ${(language === 'ko' || language === 'zh') ? 'break-keep leading-[1.06] md:leading-[1]' : 'break-words leading-[0.95] md:leading-[0.9]'}
              `}
            />
            <p className="max-w-2xl text-lg font-black leading-relaxed text-white md:text-2xl">
              {heroSubtitle}
            </p>
            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-white/68 md:text-base">
              {verse}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/conference/register" className={`inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-brand-yellow px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-brand-dark shadow-[0_14px_0_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto sm:px-8 sm:tracking-[0.18em] ${darkFocus}`}>
                {registerLabel}
                <span className="material-icons text-xl" aria-hidden="true">arrow_forward</span>
              </Link>
              <a href="#schedule" className={`inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/20 px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition-colors duration-300 hover:bg-white/10 active:scale-[0.98] sm:w-auto sm:px-8 sm:tracking-[0.18em] ${darkFocus}`}>
                View Schedule
              </a>
            </div>
          </div>

          <aside className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.085] shadow-[0_36px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <div className="border-b border-white/10 p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-yellow">Conference pass</p>
              <div className="mt-7 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-5xl font-black leading-none text-white">100</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-white/55">CAD fee</p>
                </div>
                <span className="rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-dark">
                  {CONFERENCE_MAX_AGE} & under
                </span>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {passRows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-4 px-6 py-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{label}</p>
                  <p className="text-sm font-black leading-6 text-white">{value}</p>
                </div>
              ))}
              <div className="px-6 py-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Includes</p>
                <p className="mt-2 text-sm font-black leading-6 text-white">Conference T-shirt and snacks</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-white/62">Meals are not included.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#e8dfcc] bg-[#fbfaf3] px-5 py-12 md:px-6 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#6f587e]">Theme</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-brand-dark md:text-6xl">
              Judges: Conquest to Conquer
            </h2>
            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-[#39465a]">
              A gathering to encounter God, build meaningful community, and grow in purpose.
            </p>
          </div>

          <div className="divide-y divide-[#e8dfcc] border-y border-[#e8dfcc]">
            <div className="py-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Church or group</p>
              <p className="mt-2 break-words text-sm font-semibold leading-7 text-[#39465a] [overflow-wrap:anywhere]">
                Registering a church or group? Email passionfruitsministry@gmail.com before submitting individual forms.
              </p>
            </div>
            <div className="py-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Payment</p>
              <p className="mt-2 text-sm font-semibold leading-7 text-[#39465a]">
                Submit the form first, then complete payment through Square and check your email for confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" className="bg-[#fbfaf3] px-5 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0">
            <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="mb-4 block text-xs font-extrabold uppercase tracking-[0.22em] text-[#6f587e]">{t('conference.timeline')}</span>
                <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-brand-dark md:text-6xl">
                  {t('conference.scheduleTitle')}
                </h2>
              </div>
              <p className="max-w-md text-sm font-medium leading-7 text-[#39465a]">
                Schedule is subject to minor changes. Meals are not provided, and attendees are responsible for meals between sessions.
              </p>
            </div>

            {renderRegistrationRail(true)}

            <div className="mt-8 divide-y divide-[#e0d8ca] border-y border-[#e0d8ca] lg:mt-0">
              {schedule.map((day) => (
                <article key={day.date} className="grid gap-6 py-8 lg:grid-cols-[12.5rem_1fr]">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#6f587e]">{day.day}</p>
                    <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.035em] text-brand-dark">{day.date}</h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{day.note}</p>
                  </div>
                  <ul className="divide-y divide-slate-200/80">
                    {day.events.map((event) => (
                      <li key={`${day.date}-${event.time}-${event.desc}`} className="group grid grid-cols-[4.75rem_1fr] gap-4 py-4 md:grid-cols-[5.75rem_1fr]">
                        <p className="font-mono text-xs font-black tabular-nums text-[#6f587e] md:text-sm">{event.time}</p>
                        <p className="text-base font-extrabold leading-snug text-brand-dark transition-colors duration-200 group-hover:text-[#6f587e]">{event.desc}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </main>

          {renderRegistrationRail()}
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="mb-4 block text-xs font-extrabold uppercase tracking-[0.22em] text-[#6f587e]">{t('conference.lineup')}</span>
            <h2 className="max-w-xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-brand-dark md:text-6xl">
              Lineup coming soon
            </h2>
            <p className="mt-6 max-w-md text-base font-medium leading-8 text-[#39465a]">
              Speakers, seminar leaders, and worship guests will be announced as the conference approaches.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {speakerTracks.map(([label, description], index) => (
              <article key={label} className="rounded-[1.5rem] border border-[#e8dfcc] bg-[#fbfaf3] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-[0_20px_50px_rgba(18,28,42,0.08)]">
                <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#6f587e]">Track 0{index + 1}</p>
                <h3 className="mt-8 text-2xl font-black leading-tight tracking-[-0.035em] text-brand-dark">{label}</h3>
                <p className="mt-4 text-sm font-medium leading-7 text-[#39465a]">{description}</p>
              </article>
            ))}
          </div>

          {speakerList.some((speaker: any) => speaker.name && speaker.role !== t('conference.toBeAnnounced')) && (
            <div className="lg:col-start-2">
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {speakerList.map((speaker: any, index: number) => (
                  <article key={`${speaker.name}-${index}`} className="border-t border-slate-200 py-5">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#6f587e]">Speaker 0{index + 1}</p>
                    <h3 className="mt-3 break-words text-2xl font-black leading-tight tracking-[-0.03em] text-brand-dark">{speaker.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-slate-600">{speaker.role}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-brand-dark px-5 py-16 text-white md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <span className="mb-4 block text-xs font-extrabold uppercase tracking-[0.22em] text-brand-yellow">{t('conference.voices')}</span>
            <h2 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-white md:text-6xl">
              {t('conference.attendeesTitle')}
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-2 md:[&>article:nth-child(2)]:translate-y-10">
            <article className="border-l-4 border-brand-yellow py-2 pl-6">
              <p className="text-lg font-semibold leading-9 text-white/82 md:text-xl">
                "He has not called us to become slaves to our problems. He called us a Judge of this generation. Jesus has already overcome everything for us and has given victory in our lives. And I want people to realize that through our conference conquest to conquer."
              </p>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-brand-yellow">Yehyun Han</p>
            </article>
            <article className="border-l-4 border-brand-purple py-2 pl-6">
              <p className="text-lg font-semibold leading-9 text-white/82 md:text-xl">
                "I believe that at the conference we will truly be joyful because of what Jesus has done. And as we do that, this joy will overflow so much that people who don't know Jesus yet will become curious and, in the end, come to know this incredible joy for themselves. I believe as we gather and just praise God with joy, this joy will spread across the land of Toronto, conquer the city with Joy of knowing Jesus."
              </p>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-brand-yellow">Kwanglim Kim</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-brand-yellow px-5 py-16 text-brand-dark md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] md:text-6xl">
              Register for PassionFruits Conference 2026
            </h2>
            <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-brand-dark/72">
              Fee: 100 CAD. Registration is limited to ages {CONFERENCE_MAX_AGE} and under. Includes a conference T-shirt and snacks. Meals are not included.
            </p>
          </div>
          <Link href="/conference/register" className={`inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-3 rounded-full bg-brand-dark px-8 py-5 text-center text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_0_rgba(18,28,42,0.14)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] sm:tracking-[0.16em] md:w-auto md:max-w-none md:px-12 ${lightFocus}`}>
            {registerLabel}
            <span className="material-icons text-xl" aria-hidden="true">arrow_forward</span>
          </Link>
        </div>
      </section>

      {isMenuOpen && (
        <div
          id="conference-mobile-menu"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex h-[100dvh] flex-col overflow-hidden bg-[#fbfaf3] lg:hidden"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[#e8dfcc] p-5">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className={lightFocus}>
              <img src="/logo.png" alt="PassionFruits" className="h-10 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ${lightFocus}`}
            >
              <span className="material-icons text-3xl text-brand-dark" aria-hidden="true">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mb-8">
              <LanguageSelector />
            </div>
            <nav className="flex flex-col gap-5">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className={`text-3xl font-black uppercase tracking-[-0.04em] text-brand-dark hover:text-[#6f587e] sm:text-4xl ${lightFocus}`}>
                {t('nav.home')}
              </Link>
              <Link href="/conference" onClick={() => setIsMenuOpen(false)} className={`text-3xl font-black uppercase tracking-[-0.04em] text-[#6f587e] sm:text-4xl ${lightFocus}`}>
                {t('nav.conference')}
              </Link>
              <Link href="/events" onClick={() => setIsMenuOpen(false)} className={`text-3xl font-black uppercase tracking-[-0.04em] text-brand-dark hover:text-[#6f587e] sm:text-4xl ${lightFocus}`}>
                {t('nav.events')}
              </Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className={`text-3xl font-black uppercase tracking-[-0.04em] text-brand-dark hover:text-[#6f587e] sm:text-4xl ${lightFocus}`}>
                {t('nav.about')}
              </Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className={`text-3xl font-black uppercase tracking-[-0.04em] text-brand-dark hover:text-[#6f587e] sm:text-4xl ${lightFocus}`}>
                {t('nav.contact')}
              </Link>
            </nav>

            <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
              <Link href="/conference/register" onClick={() => setIsMenuOpen(false)} className={`w-full rounded-2xl bg-brand-dark py-5 text-center text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg sm:tracking-widest ${lightFocus}`}>
                {registerLabel}
              </Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className={`w-full rounded-2xl bg-white py-5 text-center text-sm font-black uppercase tracking-[0.08em] text-brand-dark sm:tracking-widest ${lightFocus}`}>
                {t('nav.contact')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
