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
  { 
    id: 3, 
    type: 'meditation',
    user: "page_church", 
    avatar: "/images/PF app logo iphone.png",
    isAnonymous: false,
    verse: "Matthew 5:14", 
    title: "Light in the Darkness",
    content: "Being the light of the world is a call to action. How can I shine today? I realized that even a small light can change the atmosphere of a whole room. Our influence is greater than we think. (for test.)",
    date: "3 days ago",
    reactions: { Like: 24, Sympathy: 15, Comfort: 32, Sadness: 1, Surprise: 10 }
  },
]

export default function CommunityPage() {
  const { isDarkMode } = useTheme()
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

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-40 transition-colors duration-500`}>
      {/* Social Header */}
      <header className="px-6 pt-16 pb-2 flex flex-col gap-6 sticky top-0 z-40 bg-inherit/80 backdrop-blur-md border-b border-zinc-500/10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black font-plus-jakarta tracking-tight">Community</h1>
          <div className="flex items-center gap-4">
            <button className="material-icons text-zinc-500">search</button>
            <button className="material-icons text-zinc-500">notifications_none</button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-8 px-2 relative">
          <button 
            onClick={() => setActiveTab('meditation')}
            className={`pb-4 text-sm font-black transition-all relative ${activeTab === 'meditation' ? textColor : 'text-zinc-500'}`}
          >
            묵상 (Meditation)
            {activeTab === 'meditation' && <span className={`absolute bottom-0 left-0 right-0 h-1 rounded-full ${accentBg} animate-in fade-in slide-in-from-left-2`}></span>}
          </button>
          <button 
            onClick={() => setActiveTab('prayer')}
            className={`pb-4 text-sm font-black transition-all relative ${activeTab === 'prayer' ? textColor : 'text-zinc-500'}`}
          >
            기도 (Prayer)
            {activeTab === 'prayer' && <span className={`absolute bottom-0 left-0 right-0 h-1 rounded-full ${accentBg} animate-in fade-in slide-in-from-right-2`}></span>}
          </button>
        </div>
      </header>

      {/* Social Feed Layer */}
      <section className="flex flex-col">
        {filteredPosts.map((p) => {
          const isExpanded = expandedId === p.id
          const userActiveReaction = userReactions[p.id]

          return (
            <div key={p.id} className="flex flex-col border-b border-zinc-500/5 transition-all">
              {/* Post Header */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {p.isAnonymous ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                      <span className="material-icons text-[18px] text-zinc-500">visibility_off</span>
                    </div>
                  ) : (
                    <div className={`p-0.5 rounded-full bg-gradient-to-tr from-brand-yellow to-brand-purple`}>
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
                <button className="material-icons text-zinc-400">more_vert</button>
              </div>

              {/* Minimal Post Summary Card */}
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

              {/* Interaction Bar (Summary View) */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <button className="flex items-center gap-1.5 transition-all active:scale-90">
                    <span className="material-icons text-2xl">favorite_border</span>
                    <span className="text-xs font-bold">{Object.values(p.reactions).reduce((a, b) => a + b, 0)}</span>
                  </button>
                  <button className="material-icons text-2xl">chat_bubble_outline</button>
                  <button className="material-icons text-2xl">repeat</button>
                </div>
                <button className="material-icons text-2xl">bookmark_border</button>
              </div>

              {/* Expanded Content Layer */}
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

                  <div className={`p-8 rounded-[40px] ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-100'} border space-y-4`}>
                    <span className="material-icons text-zinc-300">format_quote</span>
                    <p className={`text-[16px] italic font-medium leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                      {p.content.split('. ')[0]}.
                    </p>
                    <p className={`text-[12px] font-black uppercase tracking-widest ${accentColor}`}>{p.verse}</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Reactions</p>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                      {reactionTypes.map((rt) => {
                        const isActive = userActiveReaction === rt.label
                        return (
                          <button 
                            key={rt.label}
                            onClick={() => toggleReaction(p.id, rt.label)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all active:scale-90 border-2 ${
                              isActive 
                                ? `${isDarkMode ? 'bg-zinc-800 border-brand-yellow/30' : 'bg-white border-brand-purple/20 shadow-sm'}` 
                                : `${isDarkMode ? 'bg-zinc-900 border-transparent opacity-60' : 'bg-slate-50 border-transparent opacity-60'}`
                            }`}
                          >
                            <span className={`material-icons text-[20px] ${isActive ? rt.color : 'text-zinc-500'}`}>{rt.icon}</span>
                            <span className={`text-[12px] font-black ${isActive ? textColor : 'text-zinc-500'}`}>
                              {(p.reactions as any)[rt.label]}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {filteredPosts.length === 0 && (
          <div className="py-40 flex flex-col items-center gap-4 opacity-20">
            <span className="material-icons text-6xl">blur_on</span>
            <p className="font-black text-xs uppercase tracking-widest">No posts yet</p>
          </div>
        )}
      </section>

      {/* Floating Add Post Button (with Category Choice) */}
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
