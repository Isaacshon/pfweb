'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'

const beliefs = (t: any) => [
  { icon: 'menu_book', title: 'The Bible — Our Compass', desc: 'We believe the Holy Bible is the infallible Word of God — our final authority and the ultimate guidebook for faith and life.' },
  { icon: 'diversity_3', title: 'God — The Creator', desc: 'We believe in the one true, living God existing eternally in three persons: Father, Son, and Holy Spirit. He is the Architect of all things.' },
  { icon: 'church', title: 'Jesus Christ — Our Only Way', desc: 'Jesus is fully God and fully man. He died for our sins, rose again, and ascended to Heaven as Lord. He is the only bridge between us and God.' },
  { icon: 'local_fire_department', title: 'Holy Spirit — Our Guide', desc: 'The Holy Spirit dwells within us, transforming our lives. He coaches, comforts, and empowers us to live out our mission.' },
  { icon: 'card_giftcard', title: 'Salvation — The Ultimate Gift', desc: "Salvation isn't earned by good works — it's a free gift of grace. Through faith in Jesus' finished work on the cross, we are saved." },
  { icon: 'healing', title: 'Mankind — Restoration', desc: 'We were created in God\'s image, but sin separated us from Him. Every human being needs to find true identity and restoration through Jesus Christ.' },
]

const ministries = (t: any) => [
  { icon: 'music_note', title: 'Worship & Unity', desc: 'Every Monday, our Worship Night serves as a spiritual engine for praise and fellowship. Our annual Conference is a 3-day immersion into Kingdom culture.' },
  { icon: 'public', title: 'Global Missions', desc: 'Our mission teams actively serve in Europe (France, Italy, North Macedonia) and Latin America (Dominican Republic, Haiti), planting seeds of hope.' },
  { icon: 'theater_comedy', title: '"The Gospel" (Cultural Arts)', desc: 'Through our original musical production, we provide a platform for youth to encounter God through the arts, using the stage to communicate Truth.' },
]

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-[100] flex justify-between items-center px-6 md:px-16 py-6 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/"><img src="/logo.png" alt="PassionFruits" className="h-20 md:h-28 w-auto -my-4 drop-shadow-md cursor-pointer" /></Link>
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
        </div>
        <nav className="hidden lg:flex gap-12 text-slate-600 font-black text-[11px] uppercase tracking-[0.25em]">
          <Link href="/" className="hover:text-brand-purple transition-all">{t('nav.home')}</Link>
          <Link href="/conference" className="hover:text-brand-purple transition-all">{t('nav.conference')}</Link>
          <Link href="/events" className="hover:text-brand-purple transition-all">{t('nav.events')}</Link>
          <Link href="/about" className="text-brand-purple border-b-2 border-brand-purple pb-1">{t('nav.about')}</Link>
        </nav>
        <Link href="/contact" className="px-10 py-3 bg-brand-purple text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md">{t('nav.contact')}</Link>
      </header>

      {/* Hero */}
      <section className="relative bg-brand-dark text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9a78b4]/30 to-brand-dark" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="text-[#fffbbd] text-xs font-black tracking-[0.5em] uppercase mb-6 block">Since 2023</span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">"{t('hero.influence')}"</h1>
          <p className="text-lg text-white/70 font-bold max-w-3xl mx-auto leading-relaxed italic">
            PassionFruits is a vibrant youth cultural mission movement dedicated to spreading the love of Jesus Christ through the creative language of culture.
          </p>
        </div>
      </section>

      {/* Massive Brand Identity Section */}
      <section className="py-32 px-6 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center lg:text-left">
            <div className="mb-20 transform hover:scale-105 transition-transform duration-700">
              <img 
                src="/logo.png" 
                alt="PassionFruits Massive Logo" 
                className="w-full max-w-[600px] h-auto drop-shadow-[0_35px_60px_rgba(0,0,0,0.15)] animate-in zoom-in-95 fade-in duration-1000"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100 relative group text-left">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-brand-purple rounded-3xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-4xl">auto_awesome</span>
                </div>
                <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tighter mb-8 leading-tight">
                  {t('about.massiveTitle').split(',').map((part: string, i: number) => (
                    <span key={i} className={i === 0 ? "block" : "text-brand-purple block"}>{part}{i === 0 && ','}</span>
                  ))}
                </h2>
                <p className="text-slate-500 font-bold text-lg leading-relaxed">
                  {t('about.massiveDesc')}
                </p>
              </div>

              <div className="pt-8 lg:pt-16 text-left">
                <div className="space-y-12">
                  <div>
                    <h4 className="text-brand-purple font-black text-xs uppercase tracking-[0.3em] mb-4">{t('about.creativeCall')}</h4>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed italic">
                      {t('about.creativeQuote')}
                    </p>
                  </div>
                  <div className="h-px bg-slate-200 w-24" />
                  <div>
                    <h4 className="text-brand-purple font-black text-xs uppercase tracking-[0.3em] mb-4">{t('about.commitment')}</h4>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed">
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
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-4 block text-center">Our Heart</span>
          <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter text-center mb-16">{t('about.missionTitle')}</h2>
          <div className="text-lg text-slate-600 font-medium leading-relaxed space-y-6 max-w-3xl mx-auto text-center md:text-left">
            <p>We break away from rigid traditions to create a space where young people's creative talents and raw passion become a bridge for the Gospel. Our vision is to saturate every ministry with Christ's heart, leading a youth culture that is as trendy as it is transformative.</p>
            <p>From supporting the marginalized to launching cultural projects that heal society, we are a community of young changemakers. We don't just follow the culture; we lead it with the truth and love of Jesus, boldly aiming to flip the world upside down.</p>
          </div>
        </div>
      </section>

      {/* Ministries */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-4 block text-center">What We Do</span>
          <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter text-center mb-16">Our Ministries</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ministries(t).map((m, i) => (
              <div key={i} className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#fffbbd] rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-brand-dark text-3xl">{m.icon}</span>
                </div>
                <h3 className="font-black text-xl text-brand-dark mb-3">{m.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-4 block text-center">{t('about.foundation')}</span>
          <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter text-center mb-16">{t('about.beliefsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beliefs(t).map((b, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-purple transition-colors">
                <span className="material-symbols-outlined text-brand-purple text-3xl mb-4 block">{b.icon}</span>
                <h3 className="font-black text-lg text-brand-dark mb-3">{b.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-brand-dark text-white text-center">
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-6">Join the Movement</h2>
        <p className="text-white/60 font-bold mb-12 max-w-xl mx-auto">Be part of a community of young changemakers flipping the world upside down.</p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/conference" className="px-16 py-6 bg-[#fffbbd] text-brand-dark rounded-full font-black text-lg uppercase hover:scale-105 transition-transform">Conference 2026</Link>
          <a href="https://www.instagram.com/passionfruits_ministry/" target="_blank" rel="noopener noreferrer" className="px-16 py-6 bg-white/10 border border-white/20 text-white rounded-full font-black text-lg uppercase hover:bg-white/20 transition-all">Follow Us</a>
        </div>
      </section>
    </div>
  )
}
