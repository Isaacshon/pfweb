"use client"

import React, { useState } from 'react'
import Image from 'next/image'

const reactionTypes = [
  { label: 'Like', icon: 'thumb_up', color: 'text-blue-500' },
  { label: 'Sympathy', icon: 'favorite', color: 'text-red-500' },
  { label: 'Comfort', icon: 'volunteer_activism', color: 'text-brand-purple' },
  { label: 'Sadness', icon: 'sentiment_very_dissatisfied', color: 'text-zinc-400' },
  { label: 'Surprise', icon: 'auto_awesome', color: 'text-brand-yellow' },
]

const recentMeditations = [
  { 
    id: 1, 
    user: "Test Account (for test.)", 
    avatar: "/images/IMG_6847.PNG",
    verse: "John 3:16 (for test.)", 
    content: "Today I felt the immense love of God through this verse. It's a reminder that we are never alone. (for test.)",
    date: "2h ago",
    reactions: { Like: 12, Sympathy: 45, Comfort: 8, Sadness: 0, Surprise: 3 }
  },
  { 
    id: 2, 
    user: "Test Account (for test.)", 
    avatar: "/images/IMG_6847.PNG",
    verse: "Matthew 5:14 (for test.)", 
    content: "Being the light of the world is a call to action. How can I shine today? (for test.)",
    date: "5h ago",
    reactions: { Like: 24, Sympathy: 15, Comfort: 32, Sadness: 1, Surprise: 10 }
  },
]

const trendingVerses = [
  { rank: 1, verse: "Psalm 23:1 (for test.)", count: 124 },
  { rank: 2, verse: "Philippians 4:13 (for test.)", count: 98 },
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <header className="px-6 pt-16 pb-8">
        <h1 className="text-4xl font-black font-plus-jakarta tracking-tight mb-2">Community</h1>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Connect & Share (for test.)</p>
      </header>

      {/* Main Feature: Meditations with Reactions */}
      <section className="px-6 mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black font-plus-jakarta tracking-tight">Recent Meditations</h2>
          <button className="text-brand-purple font-black text-xs uppercase tracking-widest">Post (for test.)</button>
        </div>
        
        <div className="flex flex-col gap-12">
          {recentMeditations.map((m) => (
            <div key={m.id} className="flex flex-col gap-5 border-b border-slate-50 pb-12 last:border-none">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-purple/10">
                  <img src={m.avatar} alt={m.user} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-base">{m.user}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-brand-purple font-black uppercase tracking-widest">{m.verse}</p>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">{m.date}</span>
                  </div>
                </div>
              </div>

              <p className="text-[17px] leading-relaxed text-zinc-700 font-medium bg-slate-50 p-8 rounded-[40px] rounded-tl-none">
                "{m.content}"
              </p>

              {/* Reaction Buttons matching user request */}
              <div className="flex flex-wrap gap-2 px-2">
                {reactionTypes.map((rt) => (
                  <button 
                    key={rt.label}
                    className="flex items-center gap-2 bg-white border border-slate-100 px-4 py-2.5 rounded-full hover:border-brand-purple/30 transition-all active:scale-95 group"
                  >
                    <span className={`material-icons text-lg ${rt.color} group-hover:scale-125 transition-transform`}>{rt.icon}</span>
                    <span className="text-xs font-black text-slate-400">
                      {(m.reactions as any)[rt.label]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sub Feature: Rankings */}
      <section className="px-6 pt-10 border-t border-slate-100">
        <h2 className="text-xl font-black font-plus-jakarta mb-6 opacity-30">Trending Verses (Sub)</h2>
        <div className="flex flex-col gap-4">
          {trendingVerses.map((v) => (
            <div key={v.rank} className="bg-slate-50/50 p-5 rounded-[32px] flex items-center gap-5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-brand-yellow/10 flex items-center justify-center font-black text-brand-yellow text-sm">
                {v.rank}
              </div>
              <div className="flex-1">
                <p className="font-black text-xs mb-1">{v.verse}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Shared {v.count} times</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
