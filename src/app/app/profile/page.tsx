"use client"

import React from 'react'
import { AppTopBar } from '@/components/AppTopBar'
import { BentoCard } from '@/components/BentoCard'

const stats = [
  { label: 'Services Attended', value: '42', icon: 'church', color: 'bg-[#ebddff] text-brand-purple' },
  { label: 'Events Joined', value: '18', icon: 'diversity_3', color: 'bg-brand-yellow text-brand-dark' },
]

const savedVerses = [
  { text: '"For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope."', ref: 'Jeremiah 29:11', active: true },
  { text: '"I can do all things through him who strengthens me."', ref: 'Philippians 4:13', active: false },
]

const settingsItems = [
  { label: 'Personal Information', icon: 'account_circle' },
  { label: 'Giving History', icon: 'payments' },
  { label: 'Privacy & Security', icon: 'lock' },
]

export default function ProfilePage() {
  return (
    <div className="pt-20 px-6 flex flex-col gap-8 pb-32">
      <AppTopBar showAvatar={false} />

      {/* Profile Header */}
      <section className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white shadow-xl">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGBk-s3e5-CkM-06tGpRCTClqyVW52WKD-29XTaNv577WmrlZQCAPTlKPY-QWTxgOGwpj3G8fJRwKuh2YRsjF7DUb92l3e3COMG71DiOU05QMLnPOxn261jmv20mBmoeIo3pUAoON0REhmO5oBdMFCuRKR-C0H9iYk8UCNdEZ3IuC2-_hHwuI_HZKG2crAHYtSXJs-5QdXIIZPYjrf0WjfGxYLz8mxrPqNgfA2ydvOCr0UiW_avBayLYNLn4QJkrntrexXuTQbNuM" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-purple text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
        <h1 className="font-bold text-[28px] text-brand-dark leading-tight">Sarah Jenkins</h1>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">Community Leader & Volunteer</p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <BentoCard key={s.label} className="flex flex-col items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.color}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            </div>
            <div>
              <p className="font-black text-3xl text-brand-dark leading-none">{s.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          </BentoCard>
        ))}
      </section>

      {/* Saved Verses */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-[22px] text-brand-dark">Saved Verses</h2>
        <div className="space-y-4">
          {savedVerses.map((v, i) => (
            <BentoCard key={i} className="relative overflow-hidden group hover:bg-slate-50 transition-colors">
              <div className={`absolute top-0 left-0 w-1 h-full ${v.active ? 'bg-brand-purple' : 'bg-slate-100'}`}></div>
              <p className="text-[18px] font-medium text-brand-dark italic leading-relaxed mb-4">
                {v.text}
              </p>
              <div className="flex items-center justify-between">
                <span className={`font-black text-[10px] uppercase tracking-widest ${v.active ? 'text-brand-purple' : 'text-slate-400'}`}>
                  {v.ref}
                </span>
                <span className="material-symbols-outlined text-slate-300">bookmark_added</span>
              </div>
            </BentoCard>
          ))}
        </div>
      </section>

      {/* Settings List */}
      <BentoCard className="flex flex-col overflow-hidden" padding={false}>
        {settingsItems.map((item, i) => (
          <React.Fragment key={item.label}>
            <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <span className="font-bold text-[16px] text-brand-dark">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </button>
            {i < settingsItems.length - 1 && <div className="h-[1px] w-full bg-slate-50 ml-16"></div>}
          </React.Fragment>
        ))}
      </BentoCard>
    </div>
  )
}
