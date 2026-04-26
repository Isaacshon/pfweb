'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { supabase } from '@/lib/supabase'

export default function Contact() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [messageContent, setMessageContent] = useState('')
  const [content, setContent] = useState<any>(null)
  
  useEffect(() => {
    setIsLoaded(true)
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*')
    if (data) {
      const pageContent = data.find(s => s.key === 'page_content')?.value
      if (pageContent && pageContent.contact) setContent(pageContent.contact)
    }
  }

  const heroTitle = content?.heroTitle || t('nav.contact')
  const infoTitle = content?.infoTitle || "Let's Build the Kingdom Together"
  const infoDesc = content?.infoDesc || "Whether you're looking to partner, volunteer, or just say hello, we'd love to hear from you."
  const emailDetail = content?.emailDetail || 'passionfruits_ministry@naver.com'
  const addressDetail = content?.addressDetail || 'Toronto, Ontario, Canada'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageContent.trim() === 'Pfadmin1!') {
      router.push('/admin')
    } else {
      alert('Thank you for your message!')
    }
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-brand-purple selection:text-white">
      {/* ========== NAVBAR ========== */}
      <header
        className={`
          sticky top-0 z-[100] flex justify-between items-center px-6 md:px-16 py-6
          bg-white md:bg-white/95 md:backdrop-blur-md border-b border-slate-100 shadow-sm
          transition-all duration-[800ms] ease-out
          ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        <div className="flex items-center gap-6">
          <Link href="/">
            <img src="/logo.png" alt="PassionFruits" className="h-14 md:h-28 w-auto mt-0 md:-mt-6 -mb-4 drop-shadow-md cursor-pointer" />
          </Link>
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-12 text-slate-600 font-black text-[11px] uppercase tracking-[0.25em]">
          <Link href="/" className="hover:text-brand-purple transition-all">{t('nav.home')}</Link>
          <Link href="/conference" className="hover:text-brand-purple transition-all">{t('nav.conference')}</Link>
          <Link href="/events" className="hover:text-brand-purple transition-all">{t('nav.events')}</Link>
          <Link href="/about" className="hover:text-brand-purple transition-all">{t('nav.about')}</Link>
          <Link href="/contact" className="text-brand-purple border-b-2 border-brand-purple pb-1">{t('nav.contact')}</Link>
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

      {/* ========== HERO SECTION (Big Logo) ========== */}
      <section className="relative h-[40vh] md:h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-brand-dark px-5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent z-10" />
        </div>

        <div className="relative z-20 text-center flex flex-col items-center">
          <div className={`
            mb-6 md:mb-10 transform transition-all duration-1000
            ${isLoaded ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'}
          `}>
            <img 
              src="/logo.png" 
              alt="PassionFruits" 
              className="h-32 md:h-64 w-auto drop-shadow-[0_20px_50px_rgba(154,120,180,0.4)]"
            />
          </div>
          
          <h1 className={`
            text-3xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase leading-none
            transition-all duration-700 delay-500
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
          `}>
            {heroTitle}
          </h1>
        </div>
      </section>

      {/* ========== MAP & FORM SECTION ========== */}
      <section className="py-16 md:py-32 px-5 md:px-6 bg-white relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
          
          {/* Contact Info */}
          <div className={`
            space-y-10 md:space-y-16 transition-all duration-700 delay-700
            ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}
          `}>
            <div>
              <span className="text-brand-purple font-black text-xs md:text-sm tracking-widest uppercase mb-4 block">Get In Touch</span>
              <h2 className="text-4xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter mb-8 leading-tight">
                {infoTitle}
              </h2>
              <p className="text-slate-500 font-bold text-base md:text-lg leading-relaxed max-w-md">
                {infoDesc}
              </p>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-purple transition-all shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors">mail</span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{content?.emailTitle || 'Email Us'}</h4>
                  <p className="text-lg md:text-xl font-black text-brand-dark">{emailDetail}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-purple transition-all shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors">share</span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Follow Us</h4>
                  <p className="text-lg md:text-xl font-black text-brand-dark">@passionfruits_ministry</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`
            bg-slate-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-xl transition-all duration-700 delay-900
            ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}
          `}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                  <input 
                    type="text" 
                    placeholder={t('contactPage.namePlaceholder')}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple transition-all text-base font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder={t('contactPage.emailPlaceholder')}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple transition-all text-base font-bold" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  rows={5} 
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder={t('contactPage.messagePlaceholder')}
                  className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple transition-all text-base font-bold resize-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-brand-dark text-white rounded-full font-black text-sm uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                {t('contactPage.sendBtn')}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-slate-50 text-brand-dark py-24 px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <Link href="/"><img src="/logo.png" alt="PassionFruits Logo" className="h-20 w-auto mb-10 cursor-pointer" /></Link>
            <p className="text-slate-400 max-w-sm leading-relaxed text-lg font-bold">
              Flipping the world upside down through the creative language of youth culture.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-10 text-brand-purple uppercase tracking-[0.2em] text-xs">Explore</h4>
            <ul className="space-y-6 text-slate-600 text-xs font-black uppercase tracking-widest">
              <li><Link href="/conference" className="hover:text-brand-purple transition-colors">2026 Conference</Link></li>
              <li><Link href="/events" className="hover:text-brand-purple transition-colors">Events & News</Link></li>
              <li><Link href="/about" className="hover:text-brand-purple transition-colors">Our Impact</Link></li>
              <li><Link href="/contact" className="hover:text-brand-purple transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-10 text-brand-purple uppercase tracking-[0.2em] text-xs">Follow</h4>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/passionfruits_ministry/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center hover:text-brand-purple border border-slate-200 shadow-sm transition-all">
                <span className="material-symbols-outlined text-2xl">photo_camera</span>
              </a>
              <a href="#" className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center hover:text-brand-purple border border-slate-200 shadow-sm transition-all">
                <span className="material-symbols-outlined text-2xl">play_circle</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-slate-100 text-center text-slate-300 text-[10px] font-black tracking-[0.6em] uppercase">
          © 2026 PassionFruits Ministry. Retro Roots, Future Vision.
        </div>
      </footer>

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
          <Link href="/conference" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.conference')}
          </Link>
          <Link href="/events" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.events')}
          </Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.about')}
          </Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-purple">
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
