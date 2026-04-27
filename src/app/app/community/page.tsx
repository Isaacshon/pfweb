"use client"

import React, { useState } from 'react'
import Image from 'next/image'

const trendingVerses = [
  { rank: 1, verse: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want.", count: 124 },
  { rank: 2, verse: "Philippians 4:13", text: "I can do all things through Christ who strengthens me.", count: 98 },
  { rank: 3, verse: "Romans 8:28", text: "And we know that in all things God works for the good...", count: 85 },
]

const recentMeditations = [
  { 
    id: 1, 
    user: "Test Account", 
    avatar: "/images/pf-character.png",
    verse: "John 3:16", 
    content: "Today I felt the immense love of God through this verse. It's a reminder that we are never alone.",
    date: "2h ago"
  },
  { 
    id: 2, 
    user: "Test Account", 
    avatar: "/images/pf-character.png",
    verse: "Matthew 5:14", 
    content: "Being the light of the world is a call to action. How can I shine today?",
    date: "5h ago"
  },
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <header className="px-6 pt-16 pb-8">
        <h1 className="text-4xl font-black font-plus-jakarta tracking-tight mb-2">Community</h1>
        <p className="text-slate-400 font-medium">Connect through the Word</p>
      </header>

      {/* Search Bar */}
      <div className="px-6 mb-10">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search meditations or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 font-medium focus:ring-2 focus:ring-brand-purple/20 transition-all"
          />
          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
        </div>
      </div>

      {/* Trending Section */}
      <section className="px-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black font-plus-jakarta">Trending Verses</h2>
          <select className="bg-transparent font-bold text-brand-purple text-sm focus:outline-none">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="flex flex-col gap-4">
          {trendingVerses.map((v) => (
            <div key={v.rank} className="bg-white border border-slate-100 p-5 rounded-[32px] flex items-center gap-5 shadow-sm active:scale-[0.98] transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 flex items-center justify-center font-black text-brand-yellow text-lg">
                {v.rank}
              </div>
              <div className="flex-1">
                <p className="font-black text-sm mb-1">{v.verse}</p>
                <p className="text-xs text-slate-400 line-clamp-1">{v.text}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-brand-purple text-xs">{v.count}</p>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Shared</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Meditations */}
      <section className="px-6">
        <h2 className="text-xl font-black font-plus-jakarta mb-6">Recent Meditations</h2>
        <div className="flex flex-col gap-8">
          {recentMeditations.map((m) => (
            <div key={m.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-purple/10">
                  <Image src={m.avatar} alt={m.user} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-black text-sm">{m.user}</p>
                  <p className="text-[10px] text-brand-purple font-bold uppercase tracking-widest">{m.verse}</p>
                </div>
                <span className="ml-auto text-[10px] font-bold text-slate-300 uppercase">{m.date}</span>
              </div>
              <p className="text-[15px] leading-relaxed text-slate-600 font-medium bg-slate-50 p-6 rounded-[32px] rounded-tl-none">
                "{m.content}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
