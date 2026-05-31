'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { BrandHeading } from '@/components/BrandHeading'
import { supabase } from '@/lib/supabase'

const beliefs = (t: (key: string) => string) => [
  { icon: 'menu_book', title: t('about.beliefBibleTitle'), desc: t('about.beliefBibleDesc') },
  { icon: 'diversity_3', title: t('about.beliefGodTitle'), desc: t('about.beliefGodDesc') },
  { icon: 'church', title: t('about.beliefJesusTitle'), desc: t('about.beliefJesusDesc') },
  { icon: 'local_fire_department', title: t('about.beliefSpiritTitle'), desc: t('about.beliefSpiritDesc') },
  { icon: 'card_giftcard', title: t('about.beliefSalvationTitle'), desc: t('about.beliefSalvationDesc') },
  { icon: 'healing', title: t('about.beliefMankindTitle'), desc: t('about.beliefMankindDesc') },
]

const ministries = (t: (key: string) => string) => [
  { icon: 'music_note', title: t('about.ministry1Title'), desc: t('about.ministry1Desc') },
  { icon: 'public', title: t('about.ministry2Title'), desc: t('about.ministry2Desc') },
  { icon: 'theater_comedy', title: t('about.ministry3Title'), desc: t('about.ministry3Desc') },
]

export default function AboutPage() {
  const { t, language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [content, setContent] = useState<any>(null)
  const [aboutImage, setAboutImage] = useState('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80')

  useEffect(() => {
    setIsLoaded(true)
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*')
    if (data) {
      const pageContent = data.find(s => s.key === 'page_content')?.value
      const aboutImg = data.find(s => s.key === 'about_image')?.value
      if (pageContent && pageContent.about) setContent(pageContent.about)
      if (aboutImg) setAboutImage(aboutImg)
    }
  }

  const localizedContent = language === 'en' ? content : null
  const massiveTitle = localizedContent?.massiveTitle || t('about.massiveTitle')
  const massiveDesc = localizedContent?.massiveDesc || t('about.massiveDesc')
  const creativeCall = localizedContent?.creativeCall || t('about.creativeCall')
  const creativeQuote = localizedContent?.creativeQuote || t('about.creativeQuote')

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-brand-purple selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-[100] relative grid grid-cols-[auto_1fr_auto] items-center px-6 md:px-16 py-6 bg-white md:bg-white/95 md:backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/"><img src="/logo.png" alt="PassionFruits" className="h-14 md:h-28 w-auto mt-0 md:-mt-6 -mb-4 drop-shadow-md cursor-pointer" /></Link>
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex justify-center gap-12 whitespace-nowrap text-slate-600 font-black text-[11px] uppercase tracking-[0.25em]">
          <Link href="/" className="hover:text-brand-purple transition-all">{t('nav.home')}</Link>
          <Link href="/conference" className="hover:text-brand-purple transition-all">{t('nav.conference')}</Link>
          <Link href="/events" className="hover:text-brand-purple transition-all">{t('nav.events')}</Link>
          <Link href="/about" className="text-brand-purple border-b-2 border-brand-purple pb-1">{t('nav.about')}</Link>
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
      <section className="relative bg-brand-dark text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9a78b4]/30 to-brand-dark" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="text-[#fffbbd] text-xs font-black tracking-[0.5em] uppercase mb-6 block">{t('about.since')}</span>
          <BrandHeading tag="h1" text={`"${t('hero.influence')}"`} className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none" />
          <p className="text-lg text-white/70 font-bold max-w-3xl mx-auto leading-relaxed italic break-keep">
            {t('about.heroDesc')}
          </p>
        </div>
      </section>

      {/* Massive Brand Identity Section */}
      <section className="pt-4 pb-16 md:pb-32 px-5 md:px-6 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-brand-purple/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center lg:text-left">
            <div className={`
              relative w-full max-w-[800px] h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl mb-12 md:mb-20 mt-12 md:-mt-40
              transition-all duration-1000 delay-500
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
            `}>
              <img 
                src={aboutImage} 
                alt="PassionFruits Vision"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-slate-100 relative group text-left">
                <div className="absolute -top-6 -left-4 md:-left-6 w-16 md:w-20 h-16 md:h-20 bg-brand-purple rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                  <span className="material-icons text-3xl md:text-4xl">auto_awesome</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-brand-dark uppercase tracking-tighter mb-6 md:mb-8 leading-tight break-keep">
                  {massiveTitle.split(',').map((part: string, i: number) => {
                    const trimmed = part.trim()
                    if (!trimmed) return null
                    return (
                      <span key={i} className="block">
                        {i === 0 && massiveTitle.includes(',') ? `${trimmed},` : trimmed}
                      </span>
                    )
                  })}
                </h2>
                <p className="text-slate-500 font-bold text-base md:text-lg leading-relaxed break-keep">
                  {massiveDesc}
                </p>
              </div>

              <div className="pt-8 lg:pt-16 text-left">
                <div className="space-y-12">
                  <div>
                    <h4 className="text-brand-purple font-black text-xs uppercase tracking-[0.3em] mb-4">{creativeCall}</h4>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed italic break-keep">
                      {creativeQuote}
                    </p>
                  </div>
                  <div className="h-px bg-slate-200 w-24" />
                  <div>
                    <h4 className="text-brand-purple font-black text-xs uppercase tracking-[0.3em] mb-4">{t('about.commitment')}</h4>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed break-keep">
                      {t('about.commitmentDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 px-5 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <span className="text-brand-purple font-black text-xs md:text-sm tracking-widest uppercase mb-4 block text-center">{t('about.missionLabel')}</span>
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark uppercase tracking-tighter text-center mb-12 md:mb-16">{t('about.missionTitle')}</h2>
          <div className="text-base md:text-lg text-slate-600 font-medium leading-relaxed space-y-6 max-w-3xl mx-auto text-center md:text-left">
            <p>{t('about.missionP1')}</p>
            <p>{t('about.missionP2')}</p>
          </div>
        </div>
      </section>

      {/* Ministries */}
      <section className="py-16 md:py-24 px-5 md:px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <span className="text-brand-purple font-black text-xs md:text-sm tracking-widest uppercase mb-4 block text-center">{t('about.ministriesLabel')}</span>
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark uppercase tracking-tighter text-center mb-12 md:mb-16">{t('about.ministriesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {(localizedContent?.ministries || ministries(t)).map((m: any, i: number) => (
              <div key={i} className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 md:w-16 h-14 md:h-16 bg-[#fffbbd] rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                  {m.iconUrl ? (
                    <img src={m.iconUrl} className="w-full h-full object-cover" alt={m.title} />
                  ) : (
                    <span className="material-icons text-brand-dark text-2xl md:text-3xl">{m.icon}</span>
                  )}
                </div>
                <h3 className="font-black text-xl text-brand-dark mb-3">{m.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="py-16 md:py-24 px-5 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <span className="text-brand-purple font-black text-xs md:text-sm tracking-widest uppercase mb-4 block text-center">{t('about.foundation')}</span>
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark uppercase tracking-tighter text-center mb-12 md:mb-16">{t('about.beliefsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(localizedContent?.beliefs || beliefs(t)).map((b: any, i: number) => (
              <div key={i} className="p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-purple transition-colors">
                {b.iconUrl ? (
                  <img src={b.iconUrl} className="w-10 h-10 object-contain mb-4" alt={b.title} />
                ) : (
                  <span className="material-icons text-brand-purple text-2xl md:text-3xl mb-4 block">{b.icon}</span>
                )}
                <h3 className="font-black text-lg text-brand-dark mb-3">{b.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-5 md:px-6 bg-brand-dark text-white text-center">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">{t('about.ctaTitle')}</h2>
        <p className="text-white/60 font-bold mb-10 md:mb-12 max-w-xl mx-auto text-sm md:text-base">{t('about.ctaDesc')}</p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
          <Link href="/conference" className="px-10 md:px-16 py-4 md:py-6 bg-[#fffbbd] text-brand-dark rounded-full font-black text-base md:text-lg uppercase hover:scale-105 transition-transform text-center">{t('about.conference2026')}</Link>
          <a href="https://www.instagram.com/passionfruits_ministry/" target="_blank" rel="noopener noreferrer" className="px-10 md:px-16 py-4 md:py-6 bg-white/10 border border-white/20 text-white rounded-full font-black text-base md:text-lg uppercase hover:bg-white/20 transition-all text-center">{t('about.followUs')}</a>
        </div>
      </section>

      {/* Mobile Menu Overlay */}
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
            <span className="material-icons text-brand-dark text-3xl">close</span>
          </button>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center gap-8 p-12 overflow-y-auto">
          <div className="mb-8 scale-110">
            <LanguageSelector />
          </div>
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.home')}
          </Link>
          <Link href="/conference" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.conference')}
          </Link>
          <Link href="/events" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.events')}
          </Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-purple">
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
              {t('common.ourVision')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
