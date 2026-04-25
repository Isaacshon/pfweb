'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'

export default function Contact() {
  const { t } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-brand-purple selection:text-white">
      {/* ========== NAVBAR ========== */}
      <header
        className={`
          sticky top-0 z-[100] flex justify-between items-center px-6 md:px-16 py-6
          bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm
          transition-all duration-[800ms] ease-out
          ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        <div className="flex items-center gap-6">
          <Link href="/">
            <img src="/logo.png" alt="PassionFruits" className="h-20 md:h-28 w-auto -mt-16 -mb-4 drop-shadow-md cursor-pointer" />
          </Link>
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
        </div>
        <nav className="hidden lg:flex gap-12 text-slate-600 font-black text-[11px] uppercase tracking-[0.25em]">
          <Link href="/" className="hover:text-brand-purple transition-all">{t('nav.home')}</Link>
          <Link href="/conference" className="hover:text-brand-purple transition-all">{t('nav.conference')}</Link>
          <Link href="/events" className="hover:text-brand-purple transition-all">{t('nav.events')}</Link>
          <Link href="/about" className="hover:text-brand-purple transition-all">{t('nav.about')}</Link>
          <Link href="/contact" className="text-brand-purple border-b-2 border-brand-purple pb-1">{t('nav.contact')}</Link>
        </nav>
        <Link href="/contact" className="px-10 py-3 bg-brand-purple text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md">
          {t('nav.join')}
        </Link>
      </header>

      {/* ========== HERO SECTION (Big Logo) ========== */}
      <section className="relative pt-4 pb-12 md:pt-6 md:pb-16 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-purple via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className={`
            mb-8 -mt-24 transition-all duration-1000 delay-300
            ${isLoaded ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-12'}
          `}>
            <img src="/logo.png" alt="PassionFruits Logo" className="w-48 md:w-72 h-auto drop-shadow-2xl" />
          </div>
          
          <h1 className={`
            text-5xl md:text-7xl font-black text-brand-dark mb-4 tracking-tighter uppercase leading-none
            transition-all duration-700 delay-500
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
          `}>
            {t('contactPage.title')}
          </h1>
          <p className={`
            text-slate-500 text-lg md:text-xl font-bold max-w-2xl leading-relaxed
            transition-all duration-700 delay-700
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            {t('contactPage.subtitle')}
          </p>
        </div>
      </section>

      {/* ========== CONTACT INFO CARDS ========== */}
      <section className="py-12 px-6 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address Card */}
          <div className={`
            bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 hover:border-brand-purple transition-all duration-500 group
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
          `} style={{ transitionDelay: '800ms' }}>
            <div className="w-16 h-16 rounded-2xl bg-[#fffbbd] flex items-center justify-center text-brand-dark mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">location_on</span>
            </div>
            <h3 className="text-2xl font-black text-brand-dark mb-4 uppercase tracking-tight">{t('contactPage.addressTitle')}</h3>
            <p className="text-slate-500 font-bold leading-relaxed">{t('contactPage.address')}</p>
            <a 
              href="https://maps.app.goo.gl/Q2jQfBiAjr63uNnB7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 text-brand-purple font-black text-xs uppercase tracking-widest border-b-2 border-brand-purple pb-1 hover:gap-4 transition-all"
            >
              Open in Maps <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          {/* Email Card */}
          <div className={`
            bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 hover:border-brand-purple transition-all duration-500 group
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
          `} style={{ transitionDelay: '900ms' }}>
            <div className="w-16 h-16 rounded-2xl bg-[#9a78b4] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">mail</span>
            </div>
            <h3 className="text-2xl font-black text-brand-dark mb-4 uppercase tracking-tight">{t('contactPage.emailTitle')}</h3>
            <p className="text-slate-500 font-bold leading-relaxed">{t('contactPage.email')}</p>
            <a 
              href="mailto:passionfruits.ministry@gmail.com"
              className="inline-flex items-center gap-2 mt-8 text-brand-purple font-black text-xs uppercase tracking-widest border-b-2 border-brand-purple pb-1 hover:gap-4 transition-all"
            >
              Send Email <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          {/* Social Card */}
          <div className={`
            bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 hover:border-brand-purple transition-all duration-500 group
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
          `} style={{ transitionDelay: '1000ms' }}>
            <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">photo_camera</span>
            </div>
            <h3 className="text-2xl font-black text-brand-dark mb-4 uppercase tracking-tight">{t('contactPage.instaTitle')}</h3>
            <p className="text-slate-500 font-bold leading-relaxed">{t('contactPage.instaHandle')}</p>
            <a 
              href="https://www.instagram.com/passionfruits_ministry/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 text-brand-purple font-black text-xs uppercase tracking-widest border-b-2 border-brand-purple pb-1 hover:gap-4 transition-all"
            >
              Follow Us <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========== MAP & FORM SECTION ========== */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Map Container - Interactive Design */}
          <div className={`
            relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white group
            h-[600px] transition-all duration-1000 delay-[1200ms]
            ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.9972305370884!2d-79.3172554!3d43.812242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d38e2d46e8b7%3A0xc00f08e0996841f3!2s1057%20McNicoll%20Ave%2C%20Scarborough%2C%20ON%20M1W%202L8!5e0!3m2!1sen!2sca!4v1714055903932!5m2!1sen!2sca"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.2] contrast-[1.1] brightness-[0.95] group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700"
            ></iframe>
            
            <div className="absolute top-8 left-8 bg-brand-dark/90 backdrop-blur-md text-white p-6 rounded-[2rem] max-w-[240px] shadow-2xl pointer-events-none group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500">
              <span className="text-[#fffbbd] font-black text-[10px] tracking-[0.3em] uppercase block mb-2">Our Hub</span>
              <h4 className="text-xl font-black uppercase leading-tight">PassionFruits Toronto</h4>
              <p className="text-white/60 text-xs font-bold mt-2 leading-relaxed">Flipping the world upside down through creativity.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`
            flex flex-col transition-all duration-1000 delay-[1400ms]
            ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}
          `}>
            <span className="text-brand-purple font-black text-sm tracking-[0.3em] uppercase mb-4 block">{t('menu.contactSub')}</span>
            <h2 className="text-5xl md:text-6xl font-black text-brand-dark mb-12 tracking-tighter uppercase leading-none">
              Let's build<br/>something <span className="text-brand-purple">iconic.</span>
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder={t('contactPage.namePlaceholder')}
                  className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:border-brand-purple focus:outline-none font-bold transition-all"
                />
                <input 
                  type="email" 
                  placeholder={t('contactPage.emailPlaceholder')}
                  className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:border-brand-purple focus:outline-none font-bold transition-all"
                />
              </div>
              <textarea 
                rows={5}
                placeholder={t('contactPage.messagePlaceholder')}
                className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:border-brand-purple focus:outline-none font-bold transition-all resize-none"
              ></textarea>
              <button 
                type="submit"
                className="w-full py-8 bg-brand-dark text-white rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-brand-purple transition-all transform active:scale-95 shadow-xl shadow-brand-dark/10"
              >
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
    </div>
  )
}
