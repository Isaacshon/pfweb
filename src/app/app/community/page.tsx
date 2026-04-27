"use client"

import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

const reactionTypes = [
  { label: 'Like', icon: 'thumb_up', color: 'text-blue-500' },
  { label: 'Sympathy', icon: 'favorite', color: 'text-red-500' },
  { label: 'Comfort', icon: 'volunteer_activism', color: 'text-brand-purple' },
  { label: 'Sadness', icon: 'sentiment_very_dissatisfied', color: 'text-zinc-400' },
  { label: 'Surprise', icon: 'auto_awesome', color: 'text-brand-yellow' },
]

const initialPosts = [
  { 
    id: 1, 
    type: 'meditation',
    user: "blessedpub", 
    avatar: "/images/PF app logo iphone.png",
    isAnonymous: false,
    verse: "Psalms 37:4", 
    title: "Aligning Desires with Purpose",
    content: "Your heart is a very important element. Psalm 37:4 says, 'Delight yourself in the Lord, and he will give you the desires of your heart.' God wants to align your passion with His purpose. (for test.)",
    date: "42 min ago",
    reactions: { Like: 1, Sympathy: 45, Comfort: 8, Sadness: 0, Surprise: 3 }
  },
  { 
    id: 2, 
    type: 'prayer',
    user: "Anonymous", 
    avatar: "", 
    isAnonymous: true,
    verse: "Matthew 11:28", 
    title: "Prayer for Restoration",
    content: "Dear Lord, I feel overwhelmed by the burdens of this week. I come to You seeking the rest You promised. Please restore my soul and give me the strength to face tomorrow with a peaceful heart. (for test.)",
    date: "1h ago",
    reactions: { Like: 12, Sympathy: 8, Comfort: 52, Sadness: 3, Surprise: 1 }
  },
]

export default function CommunityPage() {
  const { isDarkMode } = useTheme()
  const [view, setView] = useState<'selection' | 'feed'>('selection')
  const [activeTab, setActiveTab] = useState<'meditation' | 'prayer'>('meditation')
  const [posts, setPosts] = useState(initialPosts)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [userReactions, setUserReactions] = useState<Record<number, string | null>>({})

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'

  const filteredPosts = posts.filter(p => p.type === activeTab)

  const toggleReaction = (postId: number, reactionLabel: string) => {
    setUserReactions(prev => {
      const currentReaction = prev[postId]
      const newReaction = currentReaction === reactionLabel ? null : reactionLabel
      setPosts(pList => pList.map(p => {
        if (p.id === postId) {
          const updatedReactions = { ...p.reactions }
          if (currentReaction) (updatedReactions as any)[currentReaction] -= 1
          if (newReaction) (updatedReactions as any)[newReaction] += 1
          return { ...p, reactions: updatedReactions }
        }
        return p
      }))
      return { ...prev, [postId]: newReaction }
    })
  }

  if (view === 'selection') {
    return (
      <div className="fixed inset-0 z-[50] flex flex-col overflow-hidden animate-in fade-in duration-500">
        <div className="flex-1 flex overflow-hidden pb-24"> {/* pb-24 to avoid NavBar area */}
          {/* Left: Meditation */}
          <button 
            onClick={() => { setActiveTab('meditation'); setView('feed'); }}
            className="flex-1 bg-brand-purple relative group transition-all duration-700 hover:flex-[1.4] flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <h2 className="text-7xl font-black font-plus-jakarta tracking-tighter text-white transition-all duration-700 group-hover:scale-110" 
                style={{ 
                  textShadow: `
                    -2px -2px 0 #fcd34d,  
                     2px -2px 0 #fcd34d,
                    -2px  2px 0 #fcd34d,
                     2px  2px 0 #fcd34d,
                     0px 0px 20px rgba(252,211,77,0.4)
                  `
                }}>
              묵상
            </h2>
            <span className="absolute bottom-20 text-[11px] text-white/60 font-black uppercase tracking-[0.6em] animate-pulse">Meditation</span>
          </button>

          {/* Right: Prayer */}
          <button 
            onClick={() => { setActiveTab('prayer'); setView('feed'); }}
            className="flex-1 bg-brand-yellow relative group transition-all duration-700 hover:flex-[1.4] flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
            <h2 className="text-7xl font-black font-plus-jakarta tracking-tighter text-white transition-all duration-700 group-hover:scale-110"
                style={{ 
                  textShadow: `
                    -2px -2px 0 #6d28d9,  
                     2px -2px 0 #6d28d9,
                    -2px  2px 0 #6d28d9,
                     2px  2px 0 #6d28d9,
                     0px 0px 20px rgba(109,40,217,0.3)
                  `
                }}>
              기도
            </h2>
            <span className="absolute bottom-20 text-black/30 font-black uppercase tracking-[0.6em] animate-pulse">Prayer</span>
          </button>
        </div>

        {/* Floating Category Label Overlay */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-[60]">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
            <span className="material-icons text-white text-xl">groups</span>
          </div>
          <p className="text-[10px] text-white font-black uppercase tracking-[0.4em] opacity-60">COMMUNITY</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-40 transition-colors duration-500`}>
      <header className="px-6 pt-16 pb-4 flex items-center justify-between sticky top-0 z-40 bg-inherit/80 backdrop-blur-md border-b border-zinc-500/10">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('selection')} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10 active:scale-90 transition-transform">
            <span className="material-icons text-xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-black font-plus-jakarta tracking-tight">
            {activeTab === 'meditation' ? 'Meditation Feed' : 'Prayer Feed'}
          </h1>
        </div>
      </header>

      <section className="flex flex-col">
        {filteredPosts.map((p) => {
          const isExpanded = expandedId === p.id
          const userActiveReaction = userReactions[p.id]

          return (
            <div key={p.id} className="flex flex-col border-b border-zinc-500/5">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {p.isAnonymous ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                      <span className="material-icons text-[18px] text-zinc-500">visibility_off</span>
                    </div>
                  ) : (
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-brand-yellow to-brand-purple">
                      <img src={p.avatar} alt={p.user} className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-black' : 'border-white'}`} />
                    </div>
                  )}
                  <div className="flex flex-col -space-y-1">
                    <p className={`font-bold text-sm tracking-tight ${p.isAnonymous ? 'text-zinc-500 italic' : ''}`}>
                      {p.isAnonymous ? '익명의 공동체원' : p.user}
                    </p>
                    <p className="text-[10px] text-zinc-500">{p.date}</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
                className={`px-6 py-8 cursor-pointer group relative overflow-hidden transition-all duration-500 ${isExpanded ? 'bg-zinc-500/5' : 'hover:bg-zinc-500/5'}`}
              >
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl font-black font-plus-jakarta tracking-tight leading-tight">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>
                      {p.verse}
                    </span>
                  </div>
                </div>
                <div className={`absolute right-0 top-0 bottom-0 w-1 ${isExpanded ? accentBg : 'bg-transparent'} transition-all`}></div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <button className="flex items-center gap-1.5 transition-all active:scale-90">
                    <span className="material-icons text-2xl">favorite_border</span>
                    <span className="text-xs font-bold">{Object.values(p.reactions).reduce((a, b) => a + b, 0)}</span>
                  </button>
                  <button className="material-icons text-2xl">chat_bubble_outline</button>
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[1200px] opacity-100 pb-12' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 space-y-10">
                  <div className="h-px w-full bg-zinc-500/10"></div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                      {p.type === 'meditation' ? 'Shared Meditation' : 'Prayer Request'}
                    </p>
                    <p className="text-[18px] leading-relaxed font-medium tracking-tight opacity-90">
                      {p.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <button className={`fixed bottom-28 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 z-40 ${accentBg} ${isDarkMode ? 'text-black' : 'text-white'}`}>
        <span className="material-icons">add</span>
      </button>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
