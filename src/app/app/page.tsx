"use client"

import React from 'react'
import { AppTopBar } from '@/components/AppTopBar'
import { BentoCard } from '@/components/BentoCard'
import Link from 'next/link'

export default function AppPage() {
  return (
    <div className="pt-20 px-6 flex flex-col gap-8 pb-32">
      <AppTopBar />

      {/* Hero Welcome */}
      <section className="flex flex-col gap-2">
        <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] tracking-tight text-brand-dark leading-tight">
          Welcome,<br/>Sarah!
        </h1>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Sunday, October 24</p>
      </section>

      {/* Today's Focus Card */}
      <section>
        <Link href="/app/bible">
          <BentoCard className="bg-brand-purple text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            </div>
            <div className="relative z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-bold text-[10px] uppercase tracking-widest mb-4">Today's Focus</span>
              <p className="text-[20px] font-medium italic leading-relaxed mb-6">
                "Be still, and know that I am God..."
              </p>
              <div className="flex items-center gap-2">
                <span className="font-black text-[12px] uppercase tracking-widest">Psalm 46:10</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </BentoCard>
        </Link>
      </section>

      {/* Quick Stats / Bento Grid */}
      <section className="grid grid-cols-2 gap-4">
        <Link href="/app/schedule">
          <BentoCard className="h-full flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-[#e6eeff] flex items-center justify-center text-brand-purple mb-4">
              <span className="material-symbols-outlined">calendar_today</span>
            </div>
            <div>
              <p className="font-black text-2xl text-brand-dark">3 Events</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Happening This Week</p>
            </div>
          </BentoCard>
        </Link>
        
        <Link href="/app/community">
          <BentoCard className="h-full flex flex-col justify-between bg-brand-yellow">
            <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-brand-dark mb-4">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>kid_star</span>
            </div>
            <div>
              <p className="font-black text-2xl text-brand-dark">#1 Rank</p>
              <p className="text-[10px] font-black text-brand-dark/50 uppercase tracking-widest mt-1">In Meditation Feed</p>
            </div>
          </BentoCard>
        </Link>
      </section>

      {/* Upcoming Highlight */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-bold text-[22px] text-brand-dark">Upcoming</h2>
          <Link href="/app/schedule" className="text-brand-purple font-black text-[10px] uppercase tracking-widest">View All</Link>
        </div>
        
        <BentoCard className="flex gap-5 items-center">
          <div className="w-[64px] h-[64px] shrink-0 rounded-2xl flex flex-col justify-center items-center bg-[#ebddff] text-[#250059]">
            <span className="font-bold text-[10px] opacity-70 mb-1">OCT</span>
            <span className="font-extrabold text-[22px] leading-none">24</span>
          </div>
          <div>
            <h3 className="font-bold text-[16px] text-brand-dark">Evening Fellowship</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">6:30 PM • West Hall</p>
          </div>
        </BentoCard>
      </section>
    </div>
  )
}
