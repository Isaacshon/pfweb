"use client"

import React from 'react'
import Image from 'next/image'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Profile Header */}
      <section className="px-6 pt-20 pb-12 flex flex-col items-center text-center">
        <div className="relative w-32 h-32 rounded-[48px] overflow-hidden border-4 border-slate-50 shadow-xl mb-6">
          <Image 
            src="/images/pf-character.png" 
            alt="Test Account" 
            fill 
            className="object-cover scale-110"
          />
        </div>
        <h1 className="text-3xl font-black font-plus-jakarta tracking-tight mb-2">Test Account</h1>
        <p className="text-brand-purple font-bold text-sm uppercase tracking-widest">PassionFruits Member</p>
      </section>

      {/* Stats Grid */}
      <section className="px-6 grid grid-cols-2 gap-4 mb-12">
        <div className="bg-slate-50 p-6 rounded-[40px] flex flex-col gap-1">
          <span className="material-icons text-brand-purple mb-2">auto_stories</span>
          <p className="text-2xl font-black font-space-grotesk">12</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meditations</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-[40px] flex flex-col gap-1">
          <span className="material-icons text-brand-yellow mb-2">event_available</span>
          <p className="text-2xl font-black font-space-grotesk">85%</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
        </div>
      </section>

      {/* Activity Calendar Placeholder */}
      <section className="px-6 mb-12">
        <h2 className="text-xl font-black font-plus-jakarta mb-6">Weekly Activity</h2>
        <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-black text-slate-300 uppercase">{day}</span>
                <div className={`w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-brand-purple' : 'bg-slate-100'}`}></div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 font-medium">You attended 4 services and shared 3 meditations this week!</p>
        </div>
      </section>

      {/* Settings List */}
      <section className="px-6 flex flex-col gap-2">
        <button className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] group active:scale-[0.98] transition-all">
          <div className="flex items-center gap-4">
            <span className="material-icons text-slate-400 group-hover:text-brand-purple transition-colors">person_outline</span>
            <span className="font-black text-sm">Account Settings</span>
          </div>
          <span className="material-icons text-slate-200">chevron_right</span>
        </button>
        <button className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] group active:scale-[0.98] transition-all">
          <div className="flex items-center gap-4">
            <span className="material-icons text-slate-400 group-hover:text-brand-purple transition-colors">notifications_none</span>
            <span className="font-black text-sm">Notification Prefs</span>
          </div>
          <span className="material-icons text-slate-200">chevron_right</span>
        </button>
      </section>
    </div>
  )
}
