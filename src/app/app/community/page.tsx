"use client"

import React, { useState } from 'react'
import { AppTopBar } from '@/components/AppTopBar'
import { BentoCard } from '@/components/BentoCard'

const rankingData = [
  { id: 1, name: 'Sarah', points: '12,050', rank: 1, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0yt_4A8CmKh6aFPxJHFY7TT_U3nQ1un7k0wgqoOJINtj7WUL6uAiYtp0p9Bmpp6Uqg456usCzJwCnu4noYFGi-24llYmb7anWE8BB4Nm_HiuKdKmd7vda1IZZbr0Ub3lgqP9V8mBq9lT_d__-urMKkt9h19TRwDKEomk4UQDXu9gileTtZd-yzfJLqrO1hp1hJ4w_3jKRon1obxmPEOsc_L-DQd2W5pc1X4mglvNKeVvU6GvDPjq0UbQd5FBobBZJoVJ7iQhc-UM' },
  { id: 2, name: 'David', points: '8,420', rank: 2, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeuGKYHquK0laNNoBfTY4vyIhBuEJ5YYKyrxoJtUpUcLAjLP3kPUegA1fA_qHdfg-QqcccxrVclUkwL1HPwiw3WA1j63NL3dDi8JGKswhuZj2I43VazEqdSVPYS5E1D0gTRdWmonhHuJRhrP0nW-TYp6v34VTqdRfokDQ2-h9vT8cPYrg8ok2UCoI6ZXRrOTfl3uUuUySeitAHhxZ_jnlu-OZ2kUVi6q4sk_wi-eHga66NVpPnyDxLw51LkrkYuzyOAA2BliwQyQY' },
  { id: 3, name: 'Michael', points: '7,900', rank: 3, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb3XMijvvgmopXINRRUaIe83aNEX9ZX-xeYtfnHzm38TPGMzZeR2xoqoPGQJmLqn9TXqFy51-YEWF4lQnVGvoGhLVAHwYdWgG4zKj5xxKkWk0icapMAiye9T-2NMV44ZJupYDZjhDMz5Hhs-az2PWpAi8kRrn5405rkIbGBobdgtp7rTiFDsekc-Jd54ULH20B0JSJDYgbUnIMQYAqB5ig59exG8CHZmNFBiGO5oFfkRfmYwrcanTYQMeqj0y60LYCddIoYx4mk5c' },
]

const feedItems = [
  {
    id: 1,
    author: 'Grace Lee',
    date: 'Oct 24',
    category: 'Morning Devotion',
    verse: '"Be still, and know that I am God..."',
    reference: 'Psalm 46:10',
    content: 'Finding quiet moments today before the rush begins. Reminded that peace isn\'t the absence of chaos, but His presence within it.',
    likes: 24,
    comments: 5,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBMTb8pUv1Rr1LduuF0Pnfoiwpmwc1hFm3YDj6LNrrZgIaXycMU_d7MouA86MbueQPp9ERmD3cwVf4XXOCDkBkdbI9VMRNzQUbmhA146OEFcG1FLq4kgsQF-5WGymtiGqHiROX1Hh3KhZBvAkzRGUY7z2MUjVa-Amv9x7UdMpoI0hkO9c3NXSStiDA6MsHp8cKuMl3swaWKMxKP_cAgyqaDir__PWzgZW4HIdI9bEzvTi0J1gQHvm3FWQ13keOpB2c_KIo1HZBxIA'
  },
  {
    id: 2,
    author: 'David Kim',
    date: 'Oct 23',
    category: 'Evening Reflection',
    verse: '"The Lord is my shepherd; I lack nothing."',
    reference: 'Psalm 23:1',
    content: 'Reflecting on provision today. Sometimes what we think we need isn\'t what we actually need.',
    likes: 42,
    comments: 12,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX8I8RwMI6OsNqBYCnqHCOg8eGrhTpT6c7JJOLjEGQXEiZc4GgEnNLGZds6CBlGyoV-2SMRkVZcAn4OB-z0NBv5Hkzqzebz-gdjCgzgixQ1cZvKFE4NS7mF-USyIeXKBvBpcLcS4Xa-8jDL5sR6pAU5bW3-cdLYcVtj3-JClsZ3wGsjLcrSI46fnC81P6-pgSzDEF_4BY-zpt2XjVe8v8oEoFOrAPVDVpLxqQNvgRk5Nfmm57W0z5KjkBYZfv4mB4iuQBFGdXeTtk'
  }
]

export default function CommunityPage() {
  const [filter, setFilter] = useState('Weekly')

  return (
    <div className="pt-20 px-6 flex flex-col gap-8 pb-32">
      <AppTopBar title="Amen" />
      
      {/* Meditation Ranking Section */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] leading-tight text-brand-dark">
            Meditation<br/>Ranking
          </h2>
          <div className="flex gap-2 bg-[#e6eeff] rounded-full p-1">
            {['Weekly', 'Monthly'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full font-bold text-[12px] uppercase tracking-wider transition-all ${
                  filter === f ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Bento Grid */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          {/* Rank 2 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col items-center gap-3 shadow-[0_10px_30px_rgba(109,40,217,0.04)] mt-4 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#e6eeff] rounded-full flex items-center justify-center font-bold text-[10px] text-brand-purple">2</div>
            <img src={rankingData[1].avatar} className="w-12 h-12 rounded-full object-cover ring-2 ring-[#d9e3f6]" alt="Rank 2" />
            <div className="text-center">
              <p className="font-bold text-sm text-brand-dark leading-none">{rankingData[1].name}</p>
              <p className="font-bold text-[10px] text-slate-400 mt-1">{rankingData[1].points} PT</p>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="bg-brand-purple rounded-[24px] p-4 flex flex-col items-center gap-3 shadow-[0_12px_24px_rgba(109,40,217,0.2)] relative z-10 -mt-2 border border-white/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark shadow-md">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>kid_star</span>
            </div>
            <img src={rankingData[0].avatar} className="w-16 h-16 rounded-full object-cover ring-4 ring-white/20" alt="Rank 1" />
            <div className="text-center text-white">
              <p className="font-bold text-base leading-none">{rankingData[0].name}</p>
              <p className="font-bold text-[10px] text-purple-200 mt-1">{rankingData[0].points} PT</p>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col items-center gap-3 shadow-[0_10px_30px_rgba(109,40,217,0.04)] mt-4 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#e6eeff] rounded-full flex items-center justify-center font-bold text-[10px] text-slate-500">3</div>
            <img src={rankingData[2].avatar} className="w-12 h-12 rounded-full object-cover ring-2 ring-[#d9e3f6]" alt="Rank 3" />
            <div className="text-center">
              <p className="font-bold text-sm text-brand-dark leading-none">{rankingData[2].name}</p>
              <p className="font-bold text-[10px] text-slate-400 mt-1">{rankingData[2].points} PT</p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Meditation Feed */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-[22px] text-brand-dark mt-4">Daily Meditation</h2>
        {feedItems.map((post) => (
          <BentoCard key={post.id} className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img src={post.avatar} className="w-10 h-10 rounded-full object-cover" alt={post.author} />
                <div>
                  <p className="font-bold text-[16px] text-brand-dark leading-none">{post.author}</p>
                  <p className="text-[14px] text-slate-400 mt-1">{post.date} • {post.category}</p>
                </div>
              </div>
              <button className="text-slate-300 hover:text-brand-purple">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            
            <div className="bg-[#f8f9ff] rounded-xl p-4 border-l-4 border-brand-purple/30">
              <p className="text-[18px] font-medium text-brand-dark italic leading-relaxed">{post.verse}</p>
              <p className="font-bold text-[12px] uppercase tracking-widest text-slate-400 mt-2">{post.reference}</p>
            </div>
            
            <p className="text-[16px] text-slate-600 leading-relaxed">{post.content}</p>
            
            <div className="flex gap-6 pt-2 border-t border-slate-50">
              <button className="flex items-center gap-2 text-slate-400 hover:text-brand-purple transition-colors">
                <span className="material-symbols-outlined text-xl">favorite</span>
                <span className="text-sm font-black">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-brand-purple transition-colors">
                <span className="material-symbols-outlined text-xl">chat_bubble</span>
                <span className="text-sm font-black">{post.comments}</span>
              </button>
            </div>
          </BentoCard>
        ))}
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-28 right-6 z-40">
        <button className="bg-brand-purple text-white rounded-full w-14 h-14 shadow-xl shadow-brand-purple/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group">
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform duration-300">edit_square</span>
        </button>
      </div>
    </div>
  )
}
