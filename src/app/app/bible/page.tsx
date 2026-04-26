"use client"

import React, { useState } from 'react'
import { AppTopBar } from '@/components/AppTopBar'
import { BentoCard } from '@/components/BentoCard'

const bibleVersions = ['개역개정', '새번역', '쉬운성경', 'ESV', 'NIV', 'KJV']

const verses = [
  { num: 1, text: '태초에 말씀이 계시니라 이 말씀이 하나님과 함께 계셨으니 이 말씀은 곧 하나님이시니라' },
  { num: 2, text: '그가 태초에 하나님과 함께 계셨고' },
  { num: 3, text: '만물이 그로 말미암아 지은 바 되었으니 지은 것이 하나도 그가 없이는 된 것이 없느니라' },
  { num: 4, text: '그 안에 생명이 있었으니 이 생명은 사람들의 빛이라' },
  { num: 5, text: '빛이 어둠에 비치되 어둠이 깨닫지 못하더라' },
]

export default function BiblePage() {
  const [version, setVersion] = useState('개역개정')

  return (
    <div className="pt-20 px-6 flex flex-col gap-8 pb-32">
      <AppTopBar title="Bible" />

      {/* Selector Section */}
      <div className="flex justify-between items-center bg-white p-4 rounded-[24px] shadow-[0_10px_30px_rgba(109,40,217,0.04)]">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#f8f9ff] rounded-full hover:bg-[#e6eeff] transition-colors">
          <span className="font-bold text-[18px] text-brand-dark">John 1</span>
          <span className="material-symbols-outlined text-slate-400">expand_more</span>
        </button>
        
        <div className="relative">
          <select 
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="appearance-none bg-brand-purple text-white font-bold text-sm px-5 py-2.5 pr-10 rounded-full focus:outline-none shadow-lg shadow-brand-purple/20 cursor-pointer"
          >
            {bibleVersions.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none text-sm">arrow_drop_down</span>
        </div>
      </div>

      {/* Reader Area */}
      <div className="relative">
        <BentoCard className="min-h-[500px] flex flex-col relative overflow-visible">
          {/* Playful Integration Icon */}
          <div className="absolute -top-6 -right-4 w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center shadow-lg transform rotate-12 animate-pulse" style={{ animationDuration: '3s' }}>
            <span className="material-symbols-outlined text-3xl text-brand-dark" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
            {verses.map((v) => (
              <div key={v.num} className="flex items-start gap-4 group">
                <span className="font-bold text-[12px] uppercase tracking-widest text-brand-purple mt-1.5 shrink-0 w-4 text-center">
                  {v.num}
                </span>
                <p className="text-[18px] font-medium text-brand-dark leading-relaxed">
                  {v.text}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Indicators */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-50">
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-purple transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <div className="w-6 h-2 rounded-full bg-brand-purple"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-purple transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </BentoCard>
      </div>

      {/* Quick Action Card */}
      <BentoCard className="flex items-center justify-between bg-[#dee9fc]/50 border border-white/50" padding={false}>
        <div className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-brand-dark" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark_add</span>
          </div>
          <div>
            <h3 className="font-black text-brand-dark text-sm uppercase tracking-tight">Save Progress</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">JOHN 1</p>
          </div>
        </div>
        <button className="mr-4 px-6 py-2.5 bg-brand-purple text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-purple/20 hover:scale-105 active:scale-95 transition-all">
          Save
        </button>
      </BentoCard>
    </div>
  )
}
