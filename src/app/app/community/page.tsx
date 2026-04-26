"use client"

import React, { useState } from 'react'
import { AppTopBar } from '@/components/AppTopBar'
import { BentoCard } from '@/components/BentoCard'

const trendingVerses = [
  { ref: 'Psalm 46:10', count: 124, text: '"Be still, and know that I am God..."', color: 'bg-brand-purple' },
  { ref: 'John 3:16', count: 98, text: '"For God so loved the world..."', color: 'bg-brand-yellow' },
  { ref: 'Philippians 4:13', count: 75, text: '"I can do all things through him..."', color: 'bg-brand-purple-light' },
]

const feedItems = [
  {
    id: 1,
    author: 'Grace Lee',
    date: 'Oct 24',
    verse: 'Psalm 46:10',
    content: 'Finding quiet moments today before the rush begins. Reminded that peace isn\'t the absence of chaos.',
    likes: 24,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBMTb8pUv1Rr1LduuF0Pnfoiwpmwc1hFm3YDj6LNrrZgIaXycMU_d7MouA86MbueQPp9ERmD3cwVf4XXOCDkBkdbI9VMRNzQUbmhA146OEFcG1FLq4kgsQF-5WGymtiGqHiROX1Hh3KhZBvAkzRGUY7z2MUjVa-Amv9x7UdMpoI0hkO9c3NXSStiDA6MsHp8cKuMl3swaWKMxKP_cAgyqaDir__PWzgZW4HIdI9bEzvTi0J1gQHvm3FWQ13keOpB2c_KIo1HZBxIA'
  },
  {
    id: 2,
    author: 'David Kim',
    date: 'Oct 23',
    verse: 'Psalm 23:1',
    content: 'Reflecting on provision today. Sometimes what we think we need isn\'t what we actually need.',
    likes: 42,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX8I8RwMI6OsNqBYCnqHCOg8eGrhTpT6c7JJOLjEGQXEiZc4GgEnNLGZds6CBlGyoV-2SMRkVZcAn4OB-z0NBv5Hkzqzebz-gdjCgzgixQ1cZvKFE4NS7mF-USyIeXKBvBpcLcS4Xa-8jDL5sR6pAU5bW3-cdLYcVtj3-JClsZ3wGsjLcrSI46fnC81P6-pgSzDEF_4BY-zpt2XjVe8v8oEoFOrAPVDVpLxqQNvgRk5Nfmm57W0z5KjkBYZfv4mB4iuQBFGdXeTtk'
  }
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [trendFilter, setTrendFilter] = useState('Weekly')

  return (
    <div className="pt-20 px-6 flex flex-col gap-8 pb-32">
      <AppTopBar title="Community" />

      {/* Search Header */}
      <section className="flex flex-col gap-4">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search users or verses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-full py-4 px-12 font-bold text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all shadow-sm"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-purple">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </section>

      {/* Trending Verses Section */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end px-1">
          <h2 className="font-plus-jakarta font-black text-2xl text-brand-dark tracking-tighter">Trending</h2>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-full">
            {['Weekly', 'Monthly', 'Yearly'].map(f => (
              <button 
                key={f}
                onClick={() => setTrendFilter(f)}
                className={`px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${
                  trendFilter === f ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
          {trendingVerses.map((trend) => (
            <div key={trend.ref} className="flex-[0_0_280px] min-w-0">
              <BentoCard className={`${trend.color} text-white h-[180px] flex flex-col justify-between relative overflow-hidden`}>
                <div className="absolute -top-4 -right-4 opacity-10">
                  <span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                </div>
                <div className="relative z-10">
                  <p className="font-medium italic text-[15px] leading-relaxed line-clamp-3 mb-2">{trend.text}</p>
                  <p className="font-black text-[10px] uppercase tracking-[0.2em]">{trend.ref}</p>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <span className="bg-white/20 px-2 py-1 rounded-md font-black text-[10px]">{trend.count} Posts</span>
                </div>
              </BentoCard>
            </div>
          ))}
        </div>
      </section>

      {/* Social Feed */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-[18px] text-brand-dark px-1">Recent Reflections</h2>
        {feedItems.map((post) => (
          <BentoCard key={post.id} className="flex flex-col gap-4 group hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img src={post.avatar} className="w-10 h-10 rounded-full object-cover" alt={post.author} />
                <div>
                  <p className="font-bold text-[15px] text-brand-dark leading-none">{post.author}</p>
                  <p className="text-[12px] text-slate-400 mt-1">{post.date} • {post.verse}</p>
                </div>
              </div>
              <button className="text-slate-200 hover:text-brand-purple transition-colors">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </button>
            </div>
            <p className="text-[15px] text-slate-600 leading-relaxed line-clamp-3">{post.content}</p>
            <div className="flex items-center gap-4 pt-2 border-t border-slate-100/50">
              <button className="flex items-center gap-2 text-slate-300 hover:text-brand-purple transition-colors">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                <span className="font-black text-[12px]">{post.likes}</span>
              </button>
            </div>
          </BentoCard>
        ))}
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-28 right-6 z-40">
        <button className="bg-brand-purple text-white rounded-full w-14 h-14 shadow-xl shadow-brand-purple/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">edit_square</span>
        </button>
      </div>
    </div>
  )
}
