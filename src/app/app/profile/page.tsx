"use client"

import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'

export default function ProfilePage() {
  const { isDarkMode } = useTheme()
  const [period, setPeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly')
  const [isPraiseTeamMode, setIsPraiseTeamMode] = useState(false)

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white'

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-32 transition-colors duration-500`}>
      {/* Profile Header with Optimized Logo */}
      <section className="px-8 pt-20 pb-12 flex flex-col items-center text-center">
        <div className={`relative w-32 h-32 rounded-[56px] overflow-hidden border-4 ${isDarkMode ? 'border-zinc-900 shadow-brand-yellow/5' : 'border-slate-50 shadow-brand-purple/5'} shadow-2xl mb-8`}>
          <img 
            src="/images/PF app logo iphone.png" 
            alt="PassionFruits Account" 
            className="w-full h-full object-contain scale-110"
          />
        </div>
        <h1 className="text-4xl font-black font-plus-jakarta tracking-tighter mb-2">Test Account</h1>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'}`}></span>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">PassionFruits (for test.)</p>
        </div>
      </section>

      {/* Praise Team Mode Toggle */}
      <section className="px-8 mb-12">
        <button 
          onClick={() => setIsPraiseTeamMode(!isPraiseTeamMode)}
          className={`w-full py-5 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
            isPraiseTeamMode 
              ? `${accentBg} shadow-xl shadow-current/20 scale-[0.98]` 
              : `${isDarkMode ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-slate-50 text-slate-400 border-slate-100'} border`
          }`}
        >
          <span className="material-icons text-lg">{isPraiseTeamMode ? 'music_video' : 'queue_music'}</span>
          {isPraiseTeamMode ? 'Praise Team Mode Active' : 'Activate Praise Team Mode'}
        </button>
      </section>

      {/* Activity Analytics */}
      <section className="px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black font-plus-jakarta tracking-tight">Activity Analysis</h2>
          <div className="flex gap-2">
            {['Weekly', 'Monthly', 'Yearly'].map((p) => (
              <button 
                key={p}
                onClick={() => setPeriod(p as any)}
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${
                  period === p ? accentColor : 'text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-white'} border rounded-[48px] p-8`}>
          <div className="flex items-end justify-between h-32 gap-2 mb-6">
            {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div 
                  className={`w-full rounded-2xl transition-all duration-700 ${period === 'Weekly' ? (i === 3 ? accentBg : (isDarkMode ? 'bg-zinc-800' : 'bg-white')) : accentBg} opacity-80`}
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-6 border-t border-slate-100/10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Time (for test.)</p>
              <p className="text-xl font-black font-space-grotesk tracking-tight">24h 15m</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Growth (for test.)</p>
              <p className={`text-xl font-black font-space-grotesk tracking-tight ${isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'}`}>+12%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="px-8 grid grid-cols-2 gap-4 mb-8">
        <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border p-8 rounded-[48px] flex flex-col gap-1`}>
          <p className="text-3xl font-black font-space-grotesk tracking-tighter">12</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Shared<br/>Meditations</p>
        </div>
        <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border p-8 rounded-[48px] flex flex-col gap-1`}>
          <p className="text-3xl font-black font-space-grotesk tracking-tighter">85%</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Worship<br/>Attendance</p>
        </div>
      </section>

      {/* Share App Action */}
      <section className="px-8">
        <Link 
          href="/app/download"
          className={`w-full py-6 rounded-[32px] flex items-center justify-between px-8 transition-all active:scale-[0.98] ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-100'} border shadow-sm`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${accentBg}`}>
              <span className="material-icons text-xl">qr_code_2</span>
            </div>
            <p className="text-sm font-black tracking-tight">Share App with Friends</p>
          </div>
          <span className="material-icons text-zinc-400">chevron_right</span>
        </Link>
      </section>
    </div>
  )
}
