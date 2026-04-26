"use client"

import React, { useState } from 'react'
import { AppTopBar } from '@/components/AppTopBar'
import { BentoCard } from '@/components/BentoCard'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentWeek = [
  { day: 'Sun', date: 24, attended: true, posted: true },
  { day: 'Mon', date: 25, attended: false, posted: true },
  { day: 'Tue', date: 26, attended: false, posted: false },
  { day: 'Wed', date: 27, attended: true, posted: false },
  { day: 'Thu', date: 28, attended: false, posted: false },
  { day: 'Fri', date: 29, attended: false, posted: true },
  { day: 'Sat', date: 30, attended: false, posted: false },
]

export default function ProfilePage() {
  const [selectedDay, setSelectedDay] = useState(24)

  return (
    <div className="pt-20 px-6 flex flex-col gap-8 pb-32">
      <AppTopBar showAvatar={false} title="My Page" />

      {/* Mini Profile */}
      <section className="flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGBk-s3e5-CkM-06tGpRCTClqyVW52WKD-29XTaNv577WmrlZQCAPTlKPY-QWTxgOGwpj3G8fJRwKuh2YRsjF7DUb92l3e3COMG71DiOU05QMLnPOxn261jmv20mBmoeIo3pUAoON0REhmO5oBdMFCuRKR-C0H9iYk8UCNdEZ3IuC2-_hHwuI_HZKG2crAHYtSXJs-5QdXIIZPYjrf0WjfGxYLz8mxrPqNgfA2ydvOCr0UiW_avBayLYNLn4QJkrntrexXuTQbNuM" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-brand-purple text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-[14px]">settings</span>
          </button>
        </div>
        <div>
          <h1 className="font-plus-jakarta font-black text-2xl text-brand-dark leading-tight">Sarah Jenkins</h1>
          <p className="text-brand-purple font-black text-[10px] uppercase tracking-widest mt-1">Faith Journey Day 412</p>
        </div>
      </section>

      {/* Spiritual Calendar */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-bold text-[18px] text-brand-dark">Activity Calendar</h2>
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">October 2026</span>
        </div>
        
        <BentoCard className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            {currentWeek.map((d) => (
              <button 
                key={d.date}
                onClick={() => setSelectedDay(d.date)}
                className="flex flex-col items-center gap-2 group"
              >
                <span className="font-bold text-[10px] text-slate-400 uppercase tracking-tight">{d.day}</span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  selectedDay === d.date ? 'bg-brand-purple text-white shadow-lg' : 'bg-slate-50 text-brand-dark hover:bg-slate-100'
                }`}>
                  <span className="font-black text-sm">{d.date}</span>
                </div>
                {/* Activity Dots */}
                <div className="flex gap-1">
                  {d.attended && <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div>}
                  {d.posted && <div className="w-1.5 h-1.5 rounded-full bg-brand-purple"></div>}
                </div>
              </button>
            ))}
          </div>

          {/* Activity Legend & Detail */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Services</span>
              </div>
              <p className="font-bold text-brand-dark">2 Attended</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-purple"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meditations</span>
              </div>
              <p className="font-bold text-brand-dark">3 Posted</p>
            </div>
          </div>
        </BentoCard>
      </section>

      {/* Achievement / Stats */}
      <BentoCard className="bg-brand-dark text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-[60px]" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
        </div>
        <div>
          <p className="font-black text-[10px] text-brand-purple uppercase tracking-widest mb-1">Weekly Goal</p>
          <h3 className="font-bold text-[18px]">7 Day Streak!</h3>
          <div className="w-32 h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
            <div className="w-[85%] h-full bg-brand-yellow"></div>
          </div>
        </div>
        <button className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-colors">
          <span className="material-symbols-outlined text-white">chevron_right</span>
        </button>
      </BentoCard>

      {/* Quick Menu */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-[18px] text-brand-dark px-1">Settings</h2>
        <div className="flex flex-col gap-3">
          {['Profile Settings', 'Notification Preferences', 'Giving History'].map((item) => (
            <BentoCard key={item} className="flex items-center justify-between group hover:bg-slate-50 transition-colors" padding={false}>
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f8f9ff] flex items-center justify-center text-slate-400 group-hover:text-brand-purple transition-colors">
                  <span className="material-symbols-outlined">
                    {item.includes('Profile') ? 'person' : item.includes('Notification') ? 'notifications' : 'payments'}
                  </span>
                </div>
                <span className="font-bold text-[15px] text-brand-dark">{item}</span>
              </div>
              <span className="material-symbols-outlined text-slate-200 mr-4">chevron_right</span>
            </BentoCard>
          ))}
        </div>
      </section>
    </div>
  )
}
