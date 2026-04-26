'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'

export default function ConferencePage() {
  const { t } = useLanguage()
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
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-[100] flex justify-between items-center px-6 md:px-16 py-6 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/"><img src="/logo.png" alt="PassionFruits" className="h-20 md:h-28 w-auto -mt-6 -mb-4 drop-shadow-md cursor-pointer" /></Link>
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
        </div>
        <nav className="hidden lg:flex gap-12 text-slate-600 font-black text-[11px] uppercase tracking-[0.25em]">
          <Link href="/" className="hover:text-brand-purple transition-all">{t('nav.home')}</Link>
          <Link href="/conference" className="text-brand-purple border-b-2 border-brand-purple pb-1">{t('nav.conference')}</Link>
          <Link href="/events" className="hover:text-brand-purple transition-all">{t('nav.events')}</Link>
          <Link href="/about" className="hover:text-brand-purple transition-all">{t('nav.about')}</Link>
          <Link href="/contact" className="hover:text-brand-purple transition-all">{t('nav.contact')}</Link>
        </nav>
        <Link href="/contact" className="px-10 py-3 bg-brand-purple text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md">{t('nav.join')}</Link>
      </header>

      {/* Hero */}
      <section className="relative bg-brand-dark text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9a78b4]/30 to-brand-dark" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="text-[#fffbbd] text-xs font-black tracking-[0.5em] uppercase mb-6 block">August 20-22, 2026</span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
            <span className="text-[#9a78b4]">P</span>assion<span className="text-[#fffbbd]">F</span>ruits<br/>Conference 2026
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-bold max-w-3xl mx-auto mb-6 leading-relaxed">
            JUDGES: Conquest to Conquer
          </p>
          <p className="text-sm text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            "But you are a chosen people, a royal priesthood, a holy nation, God's special possession, that you may declare the praises of him who called you out of darkness into his wonderful light." — 1 Peter 2:9
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdlEsG6d901eyZ-IxnVTqaxuNV4qz1RkuDxhPEW6Jn-Ybl2cg/viewform?usp=header" target="_blank" rel="noopener noreferrer" className="px-16 py-6 bg-[#fffbbd] text-brand-dark rounded-full font-black text-lg uppercase hover:scale-105 transition-transform">
              Register Now (Free)
            </a>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-4 block text-center">Lineup</span>
          <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter text-center mb-16">Visionary Speakers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {speakers.map((s, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-8 text-center border border-slate-100 hover:border-brand-purple transition-colors">
                <div className="w-24 h-24 bg-brand-purple/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-brand-purple text-4xl">person</span>
                </div>
                <h3 className="font-black text-xl text-brand-dark mb-2">{s.name}</h3>
                <p className="text-slate-400 font-bold text-sm">{s.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-4 block text-center">Timeline</span>
          <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter text-center mb-16">Conference Schedule</h2>
          <div className="space-y-12">
            {schedule.map((day, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <span className="px-6 py-2 bg-brand-purple text-white rounded-full font-black text-sm uppercase">{day.day}</span>
                  <span className="text-slate-400 font-bold text-sm">{day.date}</span>
                </div>
                <div className="space-y-6">
                  {day.events.map((e, j) => (
                    <div key={j} className="flex items-start gap-6 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-3 h-3 bg-[#fffbbd] rounded-full mt-2 border-2 border-brand-dark shrink-0" />
                      <div>
                        <h4 className="font-black text-xl text-brand-dark">{e.time}</h4>
                        <p className="text-slate-500 font-medium">{e.desc}</p>
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
    </div>
  )
}
