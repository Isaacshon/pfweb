'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { supabase } from '@/lib/supabase'

export default function ConferencePage() {
  const { t, language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*')
    if (data) {
      const pageContent = data.find(s => s.key === 'page_content')?.value
      if (pageContent && pageContent.conference) setContent(pageContent.conference)
    }
  }

  const heroDate = content?.heroDate || 'August 20-22, 2026'
  const heroTitle = content?.heroTitle || t('hero.title')
  const heroSubtitle = content?.heroSubtitle || 'JUDGES: Conquest to Conquer'
  const verse = content?.verse || t('conference.verse')
  const speakers = [
    { name: 'Guest Speaker 1', role: 'To be announced' },
    { name: 'Guest Speaker 2', role: 'To be announced' },
    { name: 'Guest Speaker 3', role: 'To be announced' },
    { name: 'Guest Speaker 4', role: 'To be announced' },
  ]

  const schedule = [
    {
      day: 'Day 1', date: 'August 20, 2026',
      events: [
        { time: 'Registration', desc: 'Check in' },
        { time: 'Recreation', desc: 'Have fun' },
        { time: 'Worship & Prayer', desc: 'Intimate time of worship' },
      ]
    },
    {
      day: 'Day 2', date: 'August 21, 2026',
      events: [
        { time: 'Morning Worship', desc: 'Start your day by worship' },
        { time: 'Breakout Session', desc: 'Seminars and creative initiatives' },
        { time: 'Worship Night', desc: 'Powerful worship night' },
      ]
    },
    {
      day: 'Day 3', date: 'August 22, 2026',
      events: [
        { time: 'Church Connection', desc: 'Connect with new partnerships' },
        { time: 'Closing Ceremony', desc: 'Commissioning and send-off' },
      ]
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-brand-purple selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-[100] flex justify-between items-center px-6 md:px-16 py-6 bg-white md:bg-white/95 md:backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/"><img src="/logo.png" alt="PassionFruits" className="h-14 md:h-28 w-auto mt-0 md:-mt-6 -mb-4 drop-shadow-md cursor-pointer" /></Link>
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-12 text-slate-600 font-black text-[11px] uppercase tracking-[0.25em]">
          <Link href="/" className="hover:text-brand-purple transition-all">{t('nav.home')}</Link>
          <Link href="/conference" className="text-brand-purple border-b-2 border-brand-purple pb-1">{t('nav.conference')}</Link>
          <Link href="/events" className="hover:text-brand-purple transition-all">{t('nav.events')}</Link>
          <Link href="/about" className="hover:text-brand-purple transition-all">{t('nav.about')}</Link>
          <Link href="/contact" className="hover:text-brand-purple transition-all">{t('nav.contact')}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/contact" className="hidden sm:block px-10 py-3 bg-brand-purple text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md">
            {t('nav.join')}
          </Link>
          
          {/* Hamburger Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 z-[110]"
          >
            <span className={`w-6 h-0.5 bg-brand-dark transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-brand-dark transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-brand-dark transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

      </header>

      {/* Hero */}
      <section className="relative bg-brand-dark text-white py-20 md:py-32 px-5 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9a78b4]/30 to-brand-dark" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="text-[#fffbbd] text-[10px] md:text-xs font-black tracking-[0.4em] md:tracking-[0.5em] uppercase mb-4 md:mb-6 block break-keep">{heroDate}</span>
          <h1 className={`
            text-3xl sm:text-4xl md:text-8xl font-black uppercase tracking-tighter mb-6 md:mb-8 break-keep
            ${(language === 'ko' || language === 'zh') ? 'leading-[1.3] md:leading-[1.2]' : 'leading-[1.1] md:leading-none'}
          `}>
            {(() => {
              const title = heroTitle;
              const parts = title.split(' ');
              const word1 = parts[0] || '';
              const word2 = parts.slice(1).join(' ') || '';
              return (
                <>
                  <span className="text-brand-purple">{word1[0]}</span>
                  {word1.slice(1)}
                  <br className="md:hidden" />
                  <span className="text-brand-yellow">{word2[0]}</span>
                  {word2.slice(1)}
                  <br />
                  Conference 2026
                </>
              );
            })()}
          </h1>
          <p className="text-base md:text-xl text-white/80 font-bold max-w-3xl mx-auto mb-4 md:mb-6 leading-relaxed break-keep">
            {heroSubtitle}
          </p>
          <p className="text-xs md:text-sm text-white/60 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed px-4 break-keep">
            {verse}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full sm:w-auto px-4 sm:px-0">
            <a href={content?.registrationLink || "#"} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-10 md:px-16 py-4 md:py-6 bg-[#fffbbd] text-brand-dark rounded-full font-black text-base md:text-lg uppercase hover:scale-105 transition-transform text-center">
              Register Now (Free)
            </a>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className="py-16 md:py-24 px-5 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <span className="text-brand-purple font-black text-xs md:text-sm tracking-widest uppercase mb-4 block text-center">Lineup</span>
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark uppercase tracking-tighter text-center mb-12 md:mb-16">Visionary Speakers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {(content?.speakers || speakers).map((s: any, i: number) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-6 md:p-8 text-center border border-slate-100 hover:border-brand-purple transition-colors">
                <div className="w-20 md:w-24 h-20 md:h-24 bg-brand-purple/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-brand-purple text-3xl md:text-4xl">person</span>
                </div>
                <h3 className="font-black text-xl text-brand-dark mb-2">{s.name}</h3>
                <p className="text-slate-400 font-bold text-sm">{s.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 md:py-24 px-5 md:px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <span className="text-brand-purple font-black text-xs md:text-sm tracking-widest uppercase mb-4 block text-center">Timeline</span>
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark uppercase tracking-tighter text-center mb-12 md:mb-16">Conference Schedule</h2>
          <div className="space-y-6 md:space-y-12">
            {schedule.map((day, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 md:p-12 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <span className="px-4 md:px-6 py-2 bg-brand-purple text-white rounded-full font-black text-xs md:text-sm uppercase">{day.day}</span>
                  <span className="text-slate-400 font-bold text-xs md:text-sm">{day.date}</span>
                </div>
                <div className="space-y-4 md:space-y-6">
                  {day.events.map((e, j) => (
                    <div key={j} className="flex items-start gap-4 md:gap-6 pb-4 md:pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-2.5 h-2.5 bg-[#fffbbd] rounded-full mt-1.5 md:mt-2 border-2 border-brand-dark shrink-0" />
                      <div>
                        <h4 className="font-black text-lg md:text-xl text-brand-dark">{e.time}</h4>
                        <p className="text-slate-500 font-medium text-sm md:text-base">{e.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-4 block">Voices</span>
          <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter mb-16">What Attendees Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100">
              <p className="text-lg text-slate-600 font-medium leading-relaxed mb-6">"PassionFruits is always passionate for Christ. It is a life changing experience…"</p>
              <span className="text-brand-purple font-black text-sm">— Conference Attendee</span>
            </div>
            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100">
              <p className="text-lg text-slate-600 font-medium leading-relaxed mb-6">"At PassionFruits, creativity and passion are not restrained but released as authentic expressions of worship and faith."</p>
              <span className="text-brand-purple font-black text-sm">— Conference Attendee</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-brand-dark text-white text-center">
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-6">Ready to Join?</h2>
        <p className="text-white/60 font-bold mb-12 max-w-xl mx-auto">Secure your spot at the PassionFruits Conference 2026. Registration is complimentary.</p>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdlEsG6d901eyZ-IxnVTqaxuNV4qz1RkuDxhPEW6Jn-Ybl2cg/viewform?usp=header" target="_blank" rel="noopener noreferrer" className="px-16 py-6 bg-[#fffbbd] text-brand-dark rounded-full font-black text-lg uppercase hover:scale-105 transition-transform inline-block">
          Register Now
        </a>
      </section>

      {/* Mobile Menu Overlay - Moved outside header for proper visibility */}
      <div className={`
        fixed inset-0 bg-white z-[99999] flex flex-col transition-all duration-500 ease-in-out
        ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}>
        <div className="flex justify-between items-center p-8 border-b border-slate-100">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <img src="/logo.png" alt="PassionFruits" className="h-10 w-auto" />
          </Link>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl shadow-sm"
          >
            <span className="material-symbols-outlined text-brand-dark text-3xl">close</span>
          </button>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center gap-8 p-12 overflow-y-auto">
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
          
          <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
            <Link href="/conference" onClick={() => setIsMenuOpen(false)} className="w-full py-5 bg-brand-purple text-white rounded-2xl font-black text-sm uppercase tracking-widest text-center shadow-lg">
              {t('nav.join')}
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="w-full py-5 bg-slate-100 text-brand-dark rounded-2xl font-black text-sm uppercase tracking-widest text-center">
              Our Vision
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
