'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { IconMenu } from '@/components/IconMenu'
import { FeatureGrid } from '@/components/FeatureGrid'
import { StepGuide } from '@/components/StepGuide'
import { GallerySlider } from '@/components/GallerySlider'
import { ScheduleTable } from '@/components/ScheduleTable'
import { ConferencePopup } from '@/components/ConferencePopup'

import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'

export default function Home() {
  const { t } = useLanguage()
  // phase 0 = fullscreen intro, phase 1 = shrinking, phase 2 = landed
  const [phase, setPhase] = useState(0)

  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800", alt: "Event 1" },
    { src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800", alt: "Event 2" },
    { src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800", alt: "Event 3" },
    { src: "https://images.unsplash.com/photo-1540575861501-7ad05823c95b?auto=format&fit=crop&q=80&w=800", alt: "Event 4" },
  ]

  useEffect(() => {
    const introPlayed = sessionStorage.getItem('introPlayed')
    if (introPlayed) {
      setPhase(2)
      return
    }

    // 2초 후 축소 시작
    const t1 = setTimeout(() => setPhase(1), 2000)
    // 축소 시작 직후 콘텐츠 등장 (0.8초 후)
    const t2 = setTimeout(() => {
      setPhase(2)
      sessionStorage.setItem('introPlayed', 'true')
    }, 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const landed = phase >= 2

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ConferencePopup trigger={landed} />

      {/* ========== INTRO OVERLAY ========== */}
      {phase < 2 && (
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
          sticky top-0 z-[100] flex justify-between items-center px-6 md:px-16 py-6
          bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm
          transition-all duration-[800ms] ease-out
          ${landed ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
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
          <Link href="/" className="text-brand-purple border-b-2 border-brand-purple pb-1">{t('nav.home')}</Link>
          <Link href="/conference" className="hover:text-brand-purple transition-all">{t('nav.conference')}</Link>
          <Link href="/events" className="hover:text-brand-purple transition-all">{t('nav.events')}</Link>
          <Link href="/about" className="hover:text-brand-purple transition-all">{t('nav.about')}</Link>
          <Link href="/contact" className="hover:text-brand-purple transition-all">{t('nav.contact')}</Link>
        </nav>
        <Link href="/contact" className="px-10 py-3 bg-brand-purple text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md">
          {t('nav.join')}
        </Link>
      </header>

      {/* ========== HERO SECTION ========== */}
      <section className="relative h-[95vh] min-h-[750px] flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay loop muted playsInline preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            <source src="/hero-video.mov" type="video/mp4" />
          </video>
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

          <h1 className={`
            text-7xl md:text-[11rem] font-black leading-[0.8] tracking-tighter mb-10 uppercase
            drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]
            transition-all duration-[800ms] delay-[100ms]
            ${landed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}>
            {t('hero.title').split(' ').map((word: string, i: number) => (
              <React.Fragment key={i}>
                <span className={i === 0 ? "text-[#9a78b4]" : "text-[#fffbbd]"}>{word[0]}</span>
                <span className="text-white">{word.slice(1)}</span>
                {i === 0 && <br/>}
              </React.Fragment>
            ))}
          </h1>

          <p className={`
            text-white text-xl md:text-2xl max-w-3xl font-bold leading-relaxed mb-16 drop-shadow-lg
            transition-all duration-[600ms] delay-[200ms]
            ${landed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            {t('hero.subtitle')}
          </p>

          <div className={`
            flex flex-col sm:flex-row gap-8
            transition-all duration-[600ms] delay-[300ms]
            ${landed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}>
            <Link href="/conference" className="px-16 py-6 bg-[#fffbbd] text-brand-dark rounded-full font-black text-lg uppercase shadow-[0_10px_30px_rgba(255,251,189,0.3)] hover:scale-105 transition-transform active:scale-95 text-center">
              {t('hero.getStarted')}
            </Link>
            <Link href="/about" className="px-16 py-6 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-full font-black text-lg uppercase hover:bg-white/20 transition-all text-center">
              {t('hero.vision')}
            </Link>
          </div>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <div className={`transition-all duration-[800ms] delay-[400ms] ${landed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
        <IconMenu />

        <section className="bg-slate-50 py-24 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-4 block">Latest Update</span>
            <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter">Conference & Events</h2>
          </div>
          <FeatureGrid />
        </section>

        <StepGuide />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-2 block">Moments</span>
                <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tighter">Passion in Action</h2>
              </div>
              <Link href="/events" className="text-brand-purple font-black text-xs uppercase tracking-widest border-b-2 border-brand-purple pb-1">Full Gallery</Link>
            </div>
            <GallerySlider images={galleryImages} />
          </div>
        </section>

        <ScheduleTable />

        <section className="bg-white py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="rounded-[3rem] overflow-hidden h-[550px] bg-slate-100 relative shadow-2xl border-4 border-white">
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black text-2xl uppercase tracking-tighter">
                [ Interactive Map ]
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-6">Contact</span>
              <h2 className="text-6xl font-black text-brand-dark mb-10 leading-none tracking-tighter">Visit Our<br/><span className="text-brand-purple">Creative Hub</span></h2>
              <div className="space-y-6">
                <Link href="/contact" className="flex items-center gap-8 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-purple transition-colors group">
                  <div className="w-16 h-16 rounded-2xl bg-[#fffbbd] flex items-center justify-center text-brand-dark shadow-sm">
                    <span className="material-symbols-outlined text-3xl">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-brand-dark uppercase">Toronto Office</h4>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Toronto, Ontario, Canada</p>
                  </div>
                </Link>
                <Link href="/contact" className="flex items-center gap-8 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-purple transition-colors group">
                  <div className="w-16 h-16 rounded-2xl bg-[#9a78b4] flex items-center justify-center text-white shadow-sm">
                    <span className="material-symbols-outlined text-3xl">mail</span>
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-brand-dark uppercase">General Inquiries</h4>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">passionfruits.ministry@gmail.com</p>
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
    </div>
  )
}
