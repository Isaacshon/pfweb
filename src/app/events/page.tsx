'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { supabase } from '@/lib/supabase'

const events = [
  { title: 'PF Youth Camp 2025', date: 'Mar 8, 2025', category: 'Worship', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600' },
  { title: '2 Years Anniversary', date: 'Jan 7, 2025', category: 'Worship', image: 'https://images.unsplash.com/photo-1540575861501-7ad05823c95b?auto=format&fit=crop&q=80&w=600' },
  { title: 'Vancouver Evangelism Night', date: 'Nov 30, 2024', category: 'Mission', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=600' },
  { title: '2024 Retreat — Harvest', date: 'Sep 1, 2024', category: 'Retreat', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=600' },
  { title: 'Worship & Prayer Night — Fresh Wind', date: 'Jun 8, 2024', category: 'Worship', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600' },
  { title: 'Italy Mission: Milano', date: 'Jun 8, 2024', category: 'Mission', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600' },
  { title: 'February Worship & Prayer Night', date: 'Jun 8, 2024', category: 'Worship', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600' },
  { title: 'End of Year Celebration', date: 'Dec 23, 2023', category: 'Event', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600' },
]

export default function EventsPage() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [boardPosts, setBoardPosts] = useState<any[]>([])
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // 1. Fetch Posts
    const { data: postsData } = await supabase.from('posts').select('*').order('date', { ascending: false })
    if (postsData) setBoardPosts(postsData)

    // 2. Fetch Page Settings
    const { data: settingsData } = await supabase.from('site_settings').select('*')
    if (settingsData) {
      const pageContent = settingsData.find(s => s.key === 'page_content')?.value
      if (pageContent && pageContent.events) setContent(pageContent.events)
    }
  }

  const heroTitle = content?.heroTitle || 'Events & Updates'
  const heroSubtitle = content?.heroSubtitle || 'Latest happenings and important notices from our ministry hub.'

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
          <Link href="/conference" className="hover:text-brand-purple transition-all">{t('nav.conference')}</Link>
          <Link href="/events" className="text-brand-purple border-b-2 border-brand-purple pb-1">{t('nav.events')}</Link>
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
      <section className="bg-brand-dark text-white py-20 md:py-32 px-5 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9a78b4]/20 to-brand-dark" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="text-[#fffbbd] text-xs font-black tracking-[0.5em] uppercase mb-6 block">Kingdom News</span>
          <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">{heroTitle}</h1>
          <p className="text-base md:text-xl text-white/70 font-bold max-w-2xl mx-auto">{heroSubtitle}</p>
        </div>
      </section>

      {/* Notice Board Section */}
      {boardPosts.length > 0 && (
        <section className="py-16 md:py-24 px-5 md:px-6 bg-slate-50 border-b border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <span className="w-12 h-12 bg-brand-purple rounded-2xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined">campaign</span>
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-brand-dark uppercase tracking-tighter">Notice Board</h2>
            </div>
            <div className="space-y-4">
              {boardPosts.map((post, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">{post.title}</h3>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{post.date}</span>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed">{post.content}</p>
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2">
                    <div className="w-6 h-6 bg-brand-purple/10 rounded-lg flex items-center justify-center text-brand-purple">
                      <span className="material-symbols-outlined text-xs">person</span>
                    </div>
                    <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest">{post.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Grid */}
      <section className="py-16 md:py-32 px-5 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event, i) => (
            <div key={i} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-[10px] font-black uppercase tracking-widest">{event.category}</span>
                  <span className="text-slate-400 text-[10px] md:text-xs font-bold">{event.date}</span>
                </div>
                <h3 className="font-black text-lg md:text-xl text-brand-dark group-hover:text-brand-purple transition-colors">{event.title}</h3>
              </div>
            </div>
          ))}
        </div>
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
          <Link href="/conference" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-dark hover:text-brand-purple">
            {t('nav.conference')}
          </Link>
          <Link href="/events" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-brand-purple">
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
