"use client"

import React, { useState } from 'react'
import { BentoCard } from '@/components/BentoCard'
import useEmblaCarousel from 'embla-carousel-react'
import { useTheme } from '@/context/ThemeContext'

const serviceCategories = ['Sunday Worship', 'Wednesday Service', 'Special Events']

const services = [
  {
    id: 1,
    category: 'Sunday Worship',
    title: '1st Service (for test.)',
    time: '09:00 AM',
    location: 'Main Sanctuary',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    category: 'Sunday Worship',
    title: '2nd Service (for test.)',
    time: '11:00 AM',
    location: 'Main Sanctuary',
    image: 'https://images.unsplash.com/photo-1544427928-c49cdfebf139?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    category: 'Wednesday Service',
    title: 'Midweek Revival (for test.)',
    time: '07:30 PM',
    location: 'Fellowship Hall',
    image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=800'
  }
]

export default function ServicePage() {
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' })
  const [activeTab, setActiveTab] = useState('Sunday Worship')
  const [showJubo, setShowJubo] = useState(false)
  const { isDarkMode } = useTheme()

  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#050505]' : 'bg-white'} pt-16 px-6 flex flex-col gap-8 pb-32 transition-colors duration-500`}>
      {/* Header removed as requested for more open feel */}

      {/* Hero Intro */}
      <section className="flex flex-col gap-2">
        <h1 className={`font-plus-jakarta font-black text-5xl tracking-tighter ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Worship</h1>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Connect with God (for test.)</p>
      </section>

      {/* Horizontal Category Tabs */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
        {serviceCategories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === cat 
                ? `${accentBg} text-white shadow-lg` 
                : `${isDarkMode ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-white text-slate-400 border-slate-100'} border`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Slide Menu (Embla Carousel) */}
      <div className="embla overflow-hidden -mx-6 px-6" ref={emblaRef}>
        <div className="embla__container flex gap-4">
          {services.filter(s => s.category === activeTab).map((service) => (
            <div key={service.id} className="embla__slide flex-[0_0_88%] min-w-0">
              <BentoCard className={`relative overflow-hidden group h-[450px] rounded-[48px] ${isDarkMode ? 'border-zinc-800' : 'border-slate-50'}`} padding={false}>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-[#050505] via-transparent to-transparent' : 'bg-gradient-to-t from-black/60 via-transparent to-transparent'}`} />
                
                <div className="absolute bottom-0 left-0 right-0 p-10 flex flex-col gap-3">
                  <span className={`${accentBg} text-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest w-fit`}>
                    {service.time}
                  </span>
                  <h3 className="text-white font-plus-jakarta font-black text-3xl leading-tight">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/70 text-sm font-bold">
                    <span className="material-icons text-base">location_on</span>
                    <span>{service.location} (for test.)</span>
                  </div>
                  
                  <button 
                    onClick={() => setShowJubo(true)}
                    className="mt-6 w-full bg-white text-black py-4 rounded-full font-black text-[12px] uppercase tracking-widest active:scale-95 transition-all shadow-xl"
                  >
                    Join & View Bulletin (for test.)
                  </button>
                </div>
              </BentoCard>
            </div>
          ))}
        </div>
      </div>

      {/* Jubo (Bulletin) Overlay */}
      {showJubo && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl animate-in fade-in duration-500 flex flex-col">
          <div className="px-8 pt-16 pb-8 flex justify-between items-center">
            <h2 className="text-white text-2xl font-black font-plus-jakarta tracking-tight">Today's Bulletin</h2>
            <button onClick={() => setShowJubo(false)} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
              <span className="material-icons">close</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar">
            <div className={`w-full aspect-[1/1.4] ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} rounded-[40px] p-10 flex flex-col gap-10 shadow-2xl`}>
              <div className="text-center space-y-2">
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${accentColor}`}>PassionFruits Church</p>
                <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>Worship Order</h3>
                <p className="text-slate-400 text-xs font-bold uppercase">April 27, 2026 (for test.)</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { part: "Opening Prayer", desc: "Elder John Doe" },
                  { part: "Praise & Worship", desc: "PF Praise Team" },
                  { part: "Scripture Reading", desc: "John 3:16" },
                  { part: "Sermon", desc: "The Power of Love" },
                  { part: "Benediction", desc: "Pastor Kim" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-end border-b border-dotted border-slate-200 pb-2">
                    <span className={`text-sm font-black ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{item.part}</span>
                    <span className={`text-[10px] font-bold uppercase ${accentColor}`}>{item.desc}</span>
                  </div>
                ))}
              </div>

              <div className={`mt-auto p-6 rounded-3xl ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-50'}`}>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Announcements</p>
                <p className={`text-[11px] font-medium leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Join us for our community gathering this Friday at 7 PM. (for test.)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
