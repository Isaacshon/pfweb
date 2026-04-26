"use client"

import React, { useState } from 'react'
import { AppTopBar } from '@/components/AppTopBar'
import { BentoCard } from '@/components/BentoCard'

const categories = ['All Events', 'Worship', 'Community', 'Youth']

const events = [
  {
    id: 1,
    date: { month: 'OCT', day: '15' },
    category: 'WORSHIP',
    title: 'Sunday Morning Service',
    time: '10:00 AM - 11:30 AM',
    location: 'Main Sanctuary',
    color: 'bg-brand-purple/10 text-brand-purple'
  },
  {
    id: 2,
    date: { month: 'OCT', day: '18' },
    category: 'COMMUNITY',
    title: 'Midweek Bible Study',
    time: '7:00 PM - 8:30 PM',
    location: 'Fellowship Hall',
    color: 'bg-brand-yellow text-brand-dark'
  },
  {
    id: 3,
    date: { month: 'OCT', day: '21' },
    category: 'YOUTH',
    title: 'Youth Group Bonfire',
    time: '6:30 PM - 9:00 PM',
    location: 'West Campus Field',
    color: 'bg-slate-100 text-slate-500'
  }
]

export default function SchedulePage() {
  const [activeCategory, setActiveCategory] = useState('All Events')

  return (
    <div className="pt-20 px-6 flex flex-col gap-8 pb-32">
      <AppTopBar title="Schedule" />

      {/* Header & Filters */}
      <section className="flex flex-col gap-6">
        <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] tracking-tight text-brand-dark leading-tight">
          Schedule
        </h1>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all active:scale-95 ${
                activeCategory === cat 
                  ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Event List */}
      <section className="flex flex-col gap-4">
        {events.map((event) => (
          <BentoCard key={event.id} className="flex gap-5 items-start">
            <div className={`w-[64px] h-[72px] shrink-0 rounded-2xl flex flex-col justify-center items-center ${
              event.id === 1 ? 'bg-[#ebddff] text-[#250059]' : 'bg-[#e6eeff] text-brand-dark'
            }`}>
              <span className="font-bold text-[10px] opacity-70 mb-1">{event.date.month}</span>
              <span className="font-extrabold text-[22px] leading-none">{event.date.day}</span>
            </div>
            
            <div className="flex flex-col flex-1">
              <div className={`inline-flex items-center px-2 py-1 rounded-lg font-black text-[10px] w-fit mb-2 uppercase tracking-widest ${
                event.category === 'WORSHIP' ? 'bg-[#d9e3f6] text-[#4a4455]' : 
                event.category === 'COMMUNITY' ? 'bg-brand-yellow text-brand-dark' : 
                'bg-[#e3e1ed] text-[#46464f]'
              }`}>
                {event.category}
              </div>
              <h3 className="font-bold text-[18px] text-brand-dark mb-2 leading-tight">{event.title}</h3>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <span className="material-symbols-outlined text-[18px] opacity-70">schedule</span>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <span className="material-symbols-outlined text-[18px] opacity-70">location_on</span>
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </BentoCard>
        ))}
      </section>
    </div>
  )
}
