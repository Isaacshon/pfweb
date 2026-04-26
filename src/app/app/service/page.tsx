"use client"

import React, { useState } from 'react'
import { AppTopBar } from '@/components/AppTopBar'
import { BentoCard } from '@/components/BentoCard'
import useEmblaCarousel from 'embla-carousel-react'

const serviceCategories = ['Sunday Worship', 'Wednesday Service', 'Special Events']

const services = [
  {
    id: 1,
    category: 'Sunday Worship',
    title: '1st Service (Korean)',
    time: '09:00 AM',
    location: 'Main Sanctuary',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    category: 'Sunday Worship',
    title: '2nd Service (Bilingual)',
    time: '11:00 AM',
    location: 'Main Sanctuary',
    image: 'https://images.unsplash.com/photo-1544427928-c49cdfebf139?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    category: 'Wednesday Service',
    title: 'Midweek Revival',
    time: '07:30 PM',
    location: 'Fellowship Hall',
    image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=800'
  }
]

export default function ServicePage() {
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' })
  const [activeTab, setActiveTab] = useState('Sunday Worship')

  return (
    <div className="pt-20 px-6 flex flex-col gap-8 pb-32">
      <AppTopBar title="Service" />

      {/* Hero Intro */}
      <section className="flex flex-col gap-2">
        <h1 className="font-plus-jakarta font-black text-4xl text-brand-dark tracking-tighter">Worship</h1>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Connect with God today</p>
      </section>

      {/* Horizontal Category Tabs */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
        {serviceCategories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-3 rounded-full font-black text-[12px] uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === cat 
                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                : 'bg-white text-slate-400 border border-slate-100'
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
            <div key={service.id} className="embla__slide flex-[0_0_85%] min-w-0">
              <BentoCard className="relative overflow-hidden group h-[400px]" padding={false}>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-2">
                  <span className="bg-brand-yellow text-brand-dark px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest w-fit">
                    {service.time}
                  </span>
                  <h3 className="text-white font-plus-jakarta font-black text-2xl leading-tight">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{service.location}</span>
                  </div>
                  
                  <button className="mt-4 w-full bg-white text-brand-dark py-3 rounded-full font-black text-[12px] uppercase tracking-widest active:scale-95 transition-transform">
                    Join Online
                  </button>
                </div>
              </BentoCard>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-[18px] text-brand-dark">More Ways to Worship</h2>
        <div className="grid grid-cols-2 gap-4">
          <BentoCard className="flex flex-col items-center justify-center gap-3 bg-[#dee9fc]">
            <span className="material-symbols-outlined text-brand-purple text-3xl">play_circle</span>
            <span className="font-black text-[10px] uppercase tracking-widest text-brand-purple">Sermons</span>
          </BentoCard>
          <BentoCard className="flex flex-col items-center justify-center gap-3 bg-[#ebddff]">
            <span className="material-symbols-outlined text-brand-purple text-3xl">favorite</span>
            <span className="font-black text-[10px] uppercase tracking-widest text-brand-purple">Giving</span>
          </BentoCard>
        </div>
      </section>
    </div>
  )
}
