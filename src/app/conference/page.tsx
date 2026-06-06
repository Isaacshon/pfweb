'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { BrandHeading } from '@/components/BrandHeading'
import { getSiteSettingValue, useLiveSiteSettings } from '@/lib/liveSiteSettings'

export default function ConferencePage() {
  const { t, language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
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
  const speakers = [
    { name: t('conference.guestSpeaker1'), role: t('conference.toBeAnnounced') },
    { name: t('conference.guestSpeaker2'), role: t('conference.toBeAnnounced') },
    { name: t('conference.guestSpeaker3'), role: t('conference.toBeAnnounced') },
    { name: t('conference.guestSpeaker4'), role: t('conference.toBeAnnounced') },
  ]

  const highlights = [
    { icon: 'calendar_today', label: 'Date', value: heroDate },
    { icon: 'payments', label: 'Registration fee', value: '100 CAD' },
    { icon: 'groups', label: 'Audience', value: 'Young adults 18-25' },
    { icon: 'location_on', label: 'Location', value: 'Toronto, Ontario' },
  ]

  const includedItems = [
    { icon: 'checkroom', title: 'Conference T-shirt provided' },
    { icon: 'bakery_dining', title: 'Snacks provided' },
    { icon: 'restaurant', title: 'Meals not included' },
  ]

  const schedule = [
    {
      day: t('conference.day1'), date: t('conference.date1'),
      events: [
        { time: '5:00 PM', desc: 'Registration' },
        { time: '6:00 PM', desc: 'Recreation' },
        { time: '7:00 PM', desc: 'Worship' },
        { time: '8:00 PM', desc: 'Altar Call' },
        { time: '9:00 PM', desc: 'Overflow' },
        { time: '10:00 PM', desc: 'Connection' },
        { time: '11:00 PM', desc: 'Dismissal' },
      ]
    },
    {
      day: t('conference.day2'), date: t('conference.date2'),
      events: [
        { time: '9:30 AM', desc: 'Coffee Time' },
        { time: '10:00 AM', desc: 'Morning Worship (Praise, Prayer, Message)' },
        { time: '1:00 PM', desc: 'Seminar & Activities' },
        { time: '7:00 PM', desc: 'Worship' },
        { time: '9:00 PM', desc: 'Altar Call' },
        { time: '10:00 PM', desc: 'Overflow' },
        { time: '11:00 PM', desc: 'Reflection & Dismissal' },
      ]
    },
    {
      day: t('conference.day3'), date: t('conference.date3'),
      events: [
        { time: '1:00 PM', desc: 'Church Ministry Fair' },
        { time: '6:00 PM', desc: 'Open Worship' },
        { time: '9:00 PM', desc: 'Clean Up' },
      ]
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white selection:bg-brand-purple selection:text-white">
      <header className="sticky top-0 z-[100] grid h-20 grid-cols-[auto_1fr_auto] items-center border-b border-slate-100 bg-white/95 px-5 shadow-sm backdrop-blur-md md:h-24 md:px-12">
        <div className="flex items-center gap-6">
          <Link href="/">
            <img src="/logo.png" alt="PassionFruits" className="h-12 w-auto drop-shadow-sm md:h-16" />
          </Link>
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
        </div>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 justify-center gap-10 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 lg:flex">
          <Link href="/" className="transition-colors hover:text-brand-purple">{t('nav.home')}</Link>
          <Link href="/conference" className="border-b-2 border-brand-purple pb-1 text-brand-purple">{t('nav.conference')}</Link>
          <Link href="/events" className="transition-colors hover:text-brand-purple">{t('nav.events')}</Link>
          <Link href="/about" className="transition-colors hover:text-brand-purple">{t('nav.about')}</Link>
          <Link href="/contact" className="transition-colors hover:text-brand-purple">{t('nav.contact')}</Link>
        </nav>

        <div className="col-start-3 flex items-center justify-self-end gap-4">
          <Link href="/conference/register" className="hidden rounded-full bg-brand-purple px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md transition-transform hover:-translate-y-0.5 sm:block">
            {registerLabel}
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            className="z-[110] flex h-12 w-12 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span className={`h-0.5 w-6 bg-brand-dark transition-all ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-brand-dark transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-brand-dark transition-all ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      <section className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-brand-dark px-5 py-14 text-white md:min-h-[640px] md:px-6 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,251,189,0.18),transparent_28%),radial-gradient(circle_at_82%_0%,rgba(154,120,180,0.36),transparent_34%),linear-gradient(135deg,rgba(18,28,42,0.7),rgba(18,28,42,1))]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-dark to-transparent" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <span className="mb-5 block text-[10px] font-black uppercase tracking-[0.42em] text-brand-yellow md:text-xs">
              {heroDate}
            </span>
            <BrandHeading
              tag="h1"
              lines={[heroTitle, t('conference.titleSuffix')]}
              className={`
                mb-7 break-keep text-[clamp(3rem,8.5vw,7rem)] font-black uppercase tracking-[-0.045em]
                ${(language === 'ko' || language === 'zh') ? 'leading-[1.08] md:leading-[1]' : 'leading-[0.9]'}
              `}
            />
            <p className="max-w-2xl text-lg font-black leading-relaxed text-white md:text-2xl">
              {heroSubtitle}
            </p>
            <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-white/65 md:text-base">
              {verse}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/conference/register" className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-yellow px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-brand-dark shadow-[0_14px_0_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5 sm:w-auto">
                {registerLabel}
                <span className="material-icons text-xl" aria-hidden="true">arrow_forward</span>
              </Link>
              <a href="#schedule" className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10 sm:w-auto">
                View Schedule
              </a>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl md:p-7">
            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-4 text-brand-dark shadow-[0_14px_34px_rgba(0,0,0,0.12)]">
                  <span className="material-icons text-xl text-brand-purple" aria-hidden="true">{item.icon}</span>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  <p className="mt-1 text-sm font-black leading-snug text-brand-dark">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl bg-brand-yellow p-5 text-brand-dark">
              <p className="text-[10px] font-black uppercase tracking-[0.22em]">Before you register</p>
              <div className="mt-4 grid gap-3">
                {includedItems.map((item) => (
                  <div key={item.title} className="flex items-center gap-3 text-sm font-black">
                    <span className="material-icons text-lg" aria-hidden="true">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white px-5 py-10 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-brand-purple-light p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-purple">Theme</p>
            <p className="mt-3 text-2xl font-black leading-tight text-brand-dark">Judges: Conquest to Conquer</p>
          </div>
          <div className="rounded-[1.5rem] bg-brand-surface p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Group registration</p>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
              If you are registering as a church, contact us at passionfruitsministry@gmail.com.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-brand-dark p-6 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-yellow">Payment</p>
            <p className="mt-3 text-sm font-bold leading-7 text-white/75">
              Submit the form first. You will be redirected to Square to complete payment securely.
            </p>
          </div>
        </div>
      </section>

      <section id="schedule" className="bg-brand-surface px-5 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-brand-purple">{t('conference.timeline')}</span>
              <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.04em] text-brand-dark md:text-6xl">
                {t('conference.scheduleTitle')}
              </h2>
            </div>
            <p className="max-w-md text-sm font-bold leading-7 text-slate-500">
              Times are listed from the current conference schedule. Meal times are not shown here.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {schedule.map((day) => (
              <article key={day.date} className="rounded-[1.75rem] border border-brand-purple/10 bg-white/90 p-5 shadow-[0_24px_70px_rgba(18,28,42,0.07)] md:p-6">
                <div className="mb-6 flex flex-wrap items-start gap-3">
                  <span className="shrink-0 rounded-full bg-brand-purple px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">{day.day}</span>
                  <span className="min-w-0 pt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{day.date}</span>
                </div>
                <div className="space-y-1">
                  {day.events.map((event) => (
                    <div key={`${day.date}-${event.time}-${event.desc}`} className="grid grid-cols-[5.15rem_1fr] gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-brand-purple-light/60 md:grid-cols-[6rem_1fr]">
                      <p className="font-mono text-xs font-black tabular-nums text-brand-purple md:text-sm">{event.time}</p>
                      <p className="text-sm font-black leading-snug text-brand-dark md:text-base">{event.desc}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-brand-purple">{t('conference.lineup')}</span>
            <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.04em] text-brand-dark md:text-5xl">
              {t('conference.speakersTitle')}
            </h2>
            <p className="mt-5 max-w-md text-sm font-bold leading-7 text-slate-500">
              Speaker details will be announced as the conference approaches. Follow updates through Instagram and the PassionFruits app.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(localizedContent?.speakers || speakers).map((speaker: any, index: number) => (
              <article key={`${speaker.name}-${index}`} className="rounded-2xl border-2 border-brand-purple/10 bg-brand-purple-light/60 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-purple shadow-inner">
                    <span className="material-icons text-2xl" aria-hidden="true">person</span>
                  </div>
                  <div className="min-w-0">
                    <span className="mb-2 inline-flex rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-brand-dark">
                      TBA
                    </span>
                    <h3 className="truncate text-lg font-black text-brand-dark">{speaker.name}</h3>
                    <p className="text-sm font-bold text-slate-500">{speaker.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-brand-purple">{t('conference.voices')}</span>
            <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.04em] text-brand-dark md:text-5xl">
              {t('conference.attendeesTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-100 bg-brand-surface p-7 text-left md:p-8">
              <p className="text-[15px] font-semibold leading-8 text-slate-600 md:text-base">
                "He has not called us to become slaves to our problems. He called us a Judge of this generation. Jesus has already overcome everything for us and has given victory in our lives. And I want people to realize that through our conference conquest to conquer."
              </p>
              <p className="mt-6 text-sm font-black text-brand-purple">Yehyun Han</p>
            </article>
            <article className="rounded-2xl border border-slate-100 bg-brand-surface p-7 text-left md:p-8">
              <p className="text-[15px] font-semibold leading-8 text-slate-600 md:text-base">
                "I believe that at the conference we will truly be joyful because of what Jesus has done. And as we do that, this joy will overflow so much that people who don't know Jesus yet will become curious and, in the end, come to know this incredible joy for themselves. I believe as we gather and just praise God with joy, this joy will spread across the land of Toronto, conquer the city with Joy of knowing Jesus."
              </p>
              <p className="mt-6 text-sm font-black text-brand-purple">Kwanglim Kim</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-brand-purple px-5 py-16 text-white md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.04em] md:text-6xl">{t('conference.readyTitle')}</h2>
            <p className="mt-5 max-w-xl text-sm font-bold leading-7 text-white/75">
              Registration fee is 100 CAD. After submitting the form, complete payment through Square and check your email for confirmation.
            </p>
          </div>
          <Link href="/conference/register" className="inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-brand-yellow px-8 py-5 text-center text-base font-black uppercase tracking-[0.16em] text-brand-dark shadow-[0_12px_0_rgba(18,28,42,0.18)] transition-transform hover:-translate-y-0.5 md:w-auto md:max-w-none md:px-12">
            {registerLabel}
            <span className="material-icons text-xl" aria-hidden="true">arrow_forward</span>
          </Link>
        </div>
      </section>

      {isMenuOpen && (
      <div className="fixed inset-0 z-[1000] flex h-[100dvh] flex-col overflow-hidden bg-white lg:hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <img src="/logo.png" alt="PassionFruits" className="h-10 w-auto" />
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 shadow-sm"
          >
            <span className="material-icons text-3xl text-brand-dark" aria-hidden="true">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mb-8">
            <LanguageSelector />
          </div>
          <nav className="flex flex-col gap-5">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-[-0.04em] text-brand-dark hover:text-brand-purple sm:text-4xl">
              {t('nav.home')}
            </Link>
            <Link href="/conference" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-[-0.04em] text-brand-purple sm:text-4xl">
              {t('nav.conference')}
            </Link>
            <Link href="/events" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-[-0.04em] text-brand-dark hover:text-brand-purple sm:text-4xl">
              {t('nav.events')}
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-[-0.04em] text-brand-dark hover:text-brand-purple sm:text-4xl">
              {t('nav.about')}
            </Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-[-0.04em] text-brand-dark hover:text-brand-purple sm:text-4xl">
              {t('nav.contact')}
            </Link>
          </nav>

          <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
            <Link href="/conference/register" onClick={() => setIsMenuOpen(false)} className="w-full rounded-2xl bg-brand-purple py-5 text-center text-sm font-black uppercase tracking-widest text-white shadow-lg">
              {registerLabel}
            </Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="w-full rounded-2xl bg-slate-100 py-5 text-center text-sm font-black uppercase tracking-widest text-brand-dark">
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
