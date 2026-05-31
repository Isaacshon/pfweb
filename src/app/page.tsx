'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { IconMenu } from '@/components/IconMenu'
import { FeatureGrid } from '@/components/FeatureGrid'
import { StepGuide } from '@/components/StepGuide'
import { GallerySlider } from '@/components/GallerySlider'
import { ScheduleTable } from '@/components/ScheduleTable'
import { ConferencePopup } from '@/components/ConferencePopup'
import { BrandHeading } from '@/components/BrandHeading'

import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { supabase } from '@/lib/supabase'

const INTRO_PLAYED_KEY = 'pf_intro_played'

const getLocalStorageItem = (key: string) => {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const setLocalStorageItem = (key: string, value: string) => {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, value)
  } catch {
    // Some browser privacy settings block Web Storage; the intro should still finish.
  }
}

export default function Home() {
  const { t, language } = useLanguage()
  // phase null = checking storage, 0 = fullscreen intro, 1 = shrinking, 2 = landed
  const [phase, setPhase] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mapAddress, setMapAddress] = useState('Toronto, Ontario, Canada')
  const [heroVideoUrl, setHeroVideoUrl] = useState('/hero-video.mp4')
  const [pageContent, setPageContent] = useState<any>(null)

  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800", alt: "Event 1" },
    { src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800", alt: "Event 2" },
    { src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800", alt: "Event 3" },
    { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", alt: "Event 4" },
  ]

  const [gallery, setGallery] = useState<any[]>(galleryImages)

  const fetchGallery = async () => {
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8)
    
    if (data && data.length > 0) {
      // Map Supabase fields to Slider fields
      const mapped = data.map((item: any) => ({
        src: item.url,
        alt: item.title || 'Gallery Image'
      }))
      setGallery(mapped)
    }
  }

  useEffect(() => {
    const fetchSiteSettings = async () => {
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')
      
      if (settingsData) {
        const content = settingsData.find(s => s.key === 'page_content')?.value
        const address = settingsData.find(s => s.key === 'map_address')?.value
        const video = settingsData.find(s => s.key === 'hero_video')?.value

        if (content && content.home) {
          setPageContent(content)
        }
        if (address) setMapAddress(address)
        if (video) setHeroVideoUrl(video)
      }
    }

    fetchSiteSettings()
    fetchGallery()
  }, [])

  useEffect(() => {
    if (getLocalStorageItem(INTRO_PLAYED_KEY) === 'true') {
      setPhase(2)
      return
    }

    // 2초 후 축소 시작
    setPhase(0)
    const t1 = setTimeout(() => setPhase(1), 2000)
    // 축소 시작 직후 콘텐츠 등장 (0.8초 후)
    const t2 = setTimeout(() => {
      setPhase(2)
      setLocalStorageItem(INTRO_PLAYED_KEY, 'true')
    }, 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const landed = phase === 2
  const homeContent = language === 'en' ? pageContent?.home : null
  const heroTitleText = homeContent?.heroTitle || t('hero.title')
  const heroSubtitleText = homeContent?.heroSubtitle || t('hero.subtitle')
  const confLatestUpdateText = homeContent?.confLatestUpdate || t('home.latestUpdate')
  const confMainTitleText = homeContent?.confMainTitle || t('home.conferenceEvents')

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ConferencePopup trigger={landed} />

      {/* ========== INTRO OVERLAY ========== */}
      {phase !== null && phase < 2 && (
        <div
          className={`
            fixed inset-0 z-[2000] overflow-hidden pointer-events-none
            transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            ${phase === 0
              ? 'opacity-100 scale-100 rounded-none'
              : 'opacity-0 scale-[0.8] rounded-[5rem]'
            }
          `}
        >
          <video
            autoPlay loop muted playsInline preload="auto"
            className="absolute inset-0 w-full h-full object-cover scale-105"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            <source src="/hero-video.mov" type="video/mp4" />
          </video>
          <div className="absolute inset-0 vignette-overlay" />
        </div>
      )}

      {/* ========== NAVBAR ========== */}
      <header
        className={`
          sticky top-0 z-[100] relative grid grid-cols-[auto_1fr_auto] items-center px-6 md:px-16 py-6
          bg-white md:bg-white/95 md:backdrop-blur-md border-b border-slate-100 shadow-sm
          transition-all duration-[800ms] ease-out
          ${landed ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
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
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex justify-center gap-12 whitespace-nowrap text-slate-600 font-black text-[11px] uppercase tracking-[0.25em]">
          <Link href="/" className="text-brand-purple border-b-2 border-brand-purple pb-1">{t('nav.home')}</Link>
          <Link href="/conference" className="hover:text-brand-purple transition-all">{t('nav.conference')}</Link>
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

      {/* ========== HERO SECTION ========== */}
      <section className="relative h-[95vh] min-h-[750px] flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            src={heroVideoUrl}
            autoPlay loop muted playsInline preload="auto"
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 vignette-overlay opacity-60" />
        </div>

        <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4">
          <div className={`
            mb-8 flex items-center gap-3 bg-white/5 border border-white/20 px-6 py-2 rounded-full backdrop-blur-sm
            transition-all duration-[600ms] delay-[0ms]
            ${landed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            <span className="text-white/80 text-[10px] font-black tracking-[0.5em] uppercase">{t('hero.influence')}</span>
          </div>

          <BrandHeading
            tag="h1"
            text={heroTitleText}
            stackWords
            className={`
            text-4xl sm:text-6xl md:text-[10rem] lg:text-[11rem] font-black tracking-tighter mb-6 md:mb-10 uppercase text-white
            drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]
            transition-all duration-[800ms] delay-[100ms]
            text-center
            ${(language === 'ko' || language === 'zh') ? 'leading-[1.2] md:leading-[1.1]' : 'leading-[0.9] md:leading-[0.8]'}
            ${landed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}
          />

          <p className={`
            text-white text-base md:text-2xl max-w-2xl mx-auto font-bold leading-relaxed mb-10 md:mb-16 drop-shadow-lg px-4
            transition-all duration-[600ms] delay-[200ms] break-keep
            ${landed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            {heroSubtitleText}
          </p>

          <div className={`
            flex flex-col sm:flex-row gap-4 md:gap-8 w-full sm:w-auto px-5 sm:px-0 justify-center
            transition-all duration-[600ms] delay-[300ms]
            ${landed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}>
            <Link href="/conference" className="w-full sm:w-auto px-10 md:px-16 py-4 md:py-6 bg-brand-yellow text-brand-dark rounded-full font-black text-base md:text-lg uppercase shadow-[0_10px_30px_rgba(255,251,189,0.3)] hover:scale-105 transition-transform active:scale-95 text-center">
              {t('hero.getStarted')}
            </Link>
            <Link href="/about" className="w-full sm:w-auto px-10 md:px-16 py-4 md:py-6 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-full font-black text-base md:text-lg uppercase hover:bg-white/20 transition-all text-center">
              {t('hero.vision')}
            </Link>
          </div>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <div className={`transition-all duration-[800ms] delay-[400ms] ${landed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
        <IconMenu items={pageContent?.home?.menuItems} />

        <section className="bg-slate-50 py-16 md:py-24 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-16 text-center break-keep">
            <span className="text-brand-purple font-black text-xs md:text-sm tracking-widest uppercase mb-4 block">{confLatestUpdateText}</span>
            <h2 className="text-3xl md:text-5xl font-black text-brand-dark uppercase tracking-tighter">{confMainTitleText}</h2>
          </div>
          <FeatureGrid />
        </section>

        <StepGuide 
          items={pageContent?.home?.journeyItems} 
          title={pageContent?.home?.journeyTitle} 
          subtitle={pageContent?.home?.journeySubtitle} 
        />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 break-keep gap-6 text-center sm:text-left">
              <div>
                <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-2 block">{t('home.moments')}</span>
                <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tighter">{t('home.passionInAction')}</h2>
              </div>
              <Link href="/events" className="flex items-center justify-center gap-2 text-brand-purple font-black text-xs uppercase tracking-widest border-b-2 border-brand-purple pb-1 group">
                {t('home.fullGallery')}
                <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <GallerySlider images={gallery} />
          </div>
        </section>

        <ScheduleTable />

        <section className="bg-white py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="rounded-[3rem] overflow-hidden h-[550px] bg-slate-100 relative shadow-2xl border-4 border-white group">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0, filter: 'grayscale(1) contrast(1.2) invert(0.9)' }} 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
                className="transition-all duration-700 group-hover:grayscale-0 group-hover:invert-0"
              ></iframe>
            </div>
            <div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
              <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-6">{t('home.contact')}</span>
              <h2 className="text-6xl font-black text-brand-dark mb-10 leading-none tracking-tighter">
                {t('home.visitLine1')}<br /><span className="text-brand-purple">{t('home.visitLine2')}</span>
              </h2>
              <div className="space-y-6 w-full max-w-xl">
                <Link href="/contact" className="flex items-center gap-8 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-purple transition-colors group text-left">
                  <div className="w-16 h-16 rounded-2xl bg-[#fffbbd] flex items-center justify-center text-brand-dark shadow-sm">
                    <span className="material-icons text-3xl">place</span>
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-brand-dark uppercase">{t('home.torontoOffice')}</h4>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">{t('home.officeAddress')}</p>
                  </div>
                </Link>
                <Link href="/contact" className="flex items-center gap-8 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-purple transition-colors group text-left">
                  <div className="w-16 h-16 rounded-2xl bg-[#9a78b4] flex items-center justify-center text-white shadow-sm">
                    <span className="material-icons text-3xl">mail</span>
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-brand-dark uppercase">{t('home.generalInquiries')}</h4>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">{t('contactPage.email')}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-slate-50 text-brand-dark py-24 px-8 border-t border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="col-span-1 md:col-span-2">
              <Link href="/"><img src="/logo.png" alt="PassionFruits Logo" className="h-20 w-auto mb-10 cursor-pointer" /></Link>
              <p className="text-slate-400 max-w-sm leading-relaxed text-lg font-bold">
                {t('common.footerDescription')}
              </p>
            </div>
            <div>
              <h4 className="font-black mb-10 text-brand-purple uppercase tracking-[0.2em] text-xs">{t('common.explore')}</h4>
              <ul className="space-y-6 text-slate-600 text-xs font-black uppercase tracking-widest">
                <li><Link href="/conference" className="hover:text-brand-purple transition-colors">{t('common.conference2026')}</Link></li>
                <li><Link href="/events" className="hover:text-brand-purple transition-colors">{t('common.eventsNews')}</Link></li>
                <li><Link href="/about" className="hover:text-brand-purple transition-colors">{t('common.ourImpact')}</Link></li>
                <li><Link href="/contact" className="hover:text-brand-purple transition-colors">{t('nav.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-10 text-brand-purple uppercase tracking-[0.2em] text-xs">{t('common.follow')}</h4>
              <div className="flex gap-6">
                <a href="https://www.instagram.com/passionfruits_ministry/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center hover:text-brand-purple border border-slate-200 shadow-sm transition-all">
                  <span className="material-icons text-2xl">camera_alt</span>
                </a>
                <a href="#" className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center hover:text-brand-purple border border-slate-200 shadow-sm transition-all">
                    <span className="material-icons text-2xl">play_circle</span>
                </a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-slate-100 text-center text-slate-300 text-[10px] font-black tracking-[0.6em] uppercase">
            {t('common.copyright')}
          </div>
        </footer>
      </div>

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
            <span className="material-icons text-brand-dark text-3xl">close</span>
          </button>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center gap-8 p-12 overflow-y-auto">
          <div className="mb-8 scale-110">
            <LanguageSelector />
          </div>
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-purple">
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
