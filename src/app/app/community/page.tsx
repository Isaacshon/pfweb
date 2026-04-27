"use client"

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'

const reactionTypes = [
  { label: 'Like', icon: 'thumb_up', color: 'text-blue-500' },
  { label: 'Praying', icon: 'auto_awesome', color: 'text-brand-yellow' },
  { label: 'Comforting', icon: 'volunteer_activism', color: 'text-brand-purple' },
  { label: 'Insight', icon: 'lightbulb', color: 'text-orange-400' },
  { label: 'Check', icon: 'check_circle', color: 'text-emerald-500' },
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
    reactions: { Like: 1, Praying: 45, Comforting: 8, Insight: 2, Check: 3 }
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
    reactions: { Like: 12, Praying: 52, Comforting: 8, Insight: 0, Check: 1 }
  },
]

export default function CommunityPage() {
  const { isDarkMode } = useTheme()
  const [view, setView] = useState<'selection' | 'feed'>('selection')
  const [activeTab, setActiveTab] = useState<'meditation' | 'prayer'>('meditation')
  const [posts, setPosts] = useState(initialPosts)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [userReactions, setUserReactions] = useState<Record<number, string | null>>({})
  const [notification, setNotification] = useState<string | null>(null)

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'

  const filteredPosts = posts.filter(p => p.type === activeTab)

  const showNotify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const toggleReaction = (postId: number, reactionLabel: string) => {
    setUserReactions(prev => {
      const currentReaction = prev[postId]
      const newReaction = currentReaction === reactionLabel ? null : reactionLabel
      
      setPosts(pList => pList.map(p => {
        if (p.id === postId) {
          const updatedReactions = { ...p.reactions }
          if (currentReaction) (updatedReactions as any)[currentReaction] -= 1
          if (newReaction) {
            (updatedReactions as any)[newReaction] += 1
            if (p.type === 'prayer') {
              showNotify("한 명이 당신을 위해 함께 기도합니다.")
            }
          }
          return { ...p, reactions: updatedReactions }
        }
        return p
      }))
      return { ...prev, [postId]: newReaction }
    })
  }

  if (view === 'selection') {
    return (
      <div className="fixed inset-0 z-[50] flex flex-col overflow-hidden animate-in fade-in duration-700 bg-black font-pretendard">
        <div className="flex-1 flex overflow-hidden pb-24"> 
          
          {/* Left: Meditation */}
          <button 
            onClick={() => { setActiveTab('meditation'); setView('feed'); }}
            className="flex-1 relative group transition-all duration-1000 hover:flex-[1.1] flex items-center justify-center overflow-hidden px-4"
            style={{ backgroundColor: 'rgba(109, 64, 217, 0.85)' }}
          >
            <div className="absolute top-20 left-10 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-40 left-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-white/10 rotate-12"></div>
            <h2 className="text-2xl md:text-5xl font-extralight tracking-[0.1em] md:tracking-[0.25em] text-white transition-all duration-1000 group-hover:scale-105 group-hover:tracking-[0.2em] break-all leading-relaxed">
              MEDITATION
            </h2>
          </button>

          {/* Right: Prayer */}
          <button 
            onClick={() => { setActiveTab('prayer'); setView('feed'); }}
            className="flex-1 relative group transition-all duration-1000 hover:flex-[1.1] flex items-center justify-center overflow-hidden px-4"
            style={{ backgroundColor: 'rgba(252, 211, 77, 0.85)' }}
          >
            <div className="absolute top-32 right-12 w-12 h-12 border-2 border-white/30 rotate-45 animate-pulse"></div>
            <div className="absolute bottom-24 right-20 w-8 h-8 rounded-full bg-white/10"></div>
            <h2 className="text-2xl md:text-5xl font-extralight tracking-[0.1em] md:tracking-[0.25em] text-white transition-all duration-1000 group-hover:scale-105 group-hover:tracking-[0.2em] break-all leading-relaxed">
              PRAYER
            </h2>
          </button>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-[60]">
            <div className="relative flex items-center justify-center">
              <div className="w-[2px] h-48 md:h-64 bg-white/40 backdrop-blur-md rounded-full shadow-2xl"></div>
              <div className="absolute top-12 md:top-16 w-24 md:w-32 h-[2px] bg-white/40 backdrop-blur-md rounded-full shadow-2xl"></div>
              <div className="absolute top-12 md:top-16 w-3 h-3 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse"></div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          .font-pretendard { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; }
        `}</style>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-40 transition-colors duration-500 font-pretendard relative`}>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500">
          <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border px-6 py-3 rounded-full shadow-2xl flex items-center gap-3`}>
            <span className={`material-icons text-lg ${accentColor}`}>auto_awesome</span>
            <p className="text-sm font-bold tracking-tight">{notification}</p>
          </div>
        </div>
      )}

      <header className="px-6 pt-16 pb-4 flex items-center justify-between sticky top-0 z-40 bg-inherit/80 backdrop-blur-md border-b border-zinc-500/10">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('selection')} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10 active:scale-90 transition-transform">
            <span className="material-icons text-xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-black tracking-tight">
            {activeTab === 'meditation' ? 'Meditation' : 'Prayer'}
          </h1>
        </div>
      </header>

      <section className="flex flex-col">
        {filteredPosts.map((p) => {
          const isExpanded = expandedId === p.id
          const userActiveReaction = userReactions[p.id]

          return (
            <div key={p.id} className="flex flex-col border-b border-zinc-500/5">
              {/* Post Header */}
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
                    <p className={`font-bold text-sm tracking-tight ${p.isAnonymous ? 'text-zinc-500 italic font-medium' : ''}`}>
                      {p.isAnonymous ? 'Anonymous Member' : p.user}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{p.date}</p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
                className={`px-6 py-8 cursor-pointer group relative overflow-hidden transition-all duration-500 ${isExpanded ? 'bg-zinc-500/5' : 'hover:bg-zinc-500/5'}`}
              >
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl font-black tracking-tight leading-tight">
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

              {/* Post Actions & Reactions Summary */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Reaction Summary (Mini icons) */}
                  <div className="flex items-center -space-x-1">
                    {reactionTypes.map((rt, i) => (
                      (p.reactions as any)[rt.label] > 0 && (
                        <div key={i} className={`w-5 h-5 rounded-full border-2 ${isDarkMode ? 'border-black' : 'border-white'} flex items-center justify-center bg-zinc-500/10`}>
                          <span className={`material-icons text-[10px] ${rt.color}`}>{rt.icon}</span>
                        </div>
                      )
                    ))}
                    <span className="ml-2 text-[10px] font-bold opacity-40">
                      {Object.values(p.reactions).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>

                  {/* Comment & Share Icons */}
                  <button className="material-icons text-[22px] text-zinc-400">chat_bubble_outline</button>
                  <button className="material-icons text-[22px] text-zinc-400">send</button>
                </div>

                {/* Reaction Picker Trigger */}
                <button 
                  onClick={() => setExpandedId(p.id)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}
                >
                  React
                </button>
              </div>

              {/* Expanded View: Content, Full Reactions, Comments */}
              <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 pb-12' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 space-y-10">
                  <div className="h-px w-full bg-zinc-500/10"></div>
                  
                  {/* Full Content */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                      {p.type === 'meditation' ? 'Shared Meditation' : 'Prayer Request'}
                    </p>
                    <p className="text-[18px] leading-relaxed font-medium tracking-tight opacity-90">
                      {p.content}
                    </p>
                  </div>

                  {/* Reaction Picker Panel */}
                  <div className="flex flex-wrap gap-2">
                    {reactionTypes.map((rt) => (
                      <button 
                        key={rt.label}
                        onClick={() => toggleReaction(p.id, rt.label)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all active:scale-95 ${
                          userActiveReaction === rt.label 
                            ? `${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'} ring-1 ring-inset ring-brand-purple/20` 
                            : 'hover:bg-zinc-500/5'
                        }`}
                      >
                        <span className={`material-icons text-xl ${rt.color}`}>{rt.icon}</span>
                        <div className="flex flex-col items-start -space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{rt.label}</span>
                          <span className="text-xs font-bold">{(p.reactions as any)[rt.label]}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Comment Section Placeholder */}
                  <div className="space-y-6 pt-6 border-t border-zinc-500/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Comments</p>
                    <div className="flex items-center gap-4">
                      <div className={`flex-1 h-12 rounded-2xl ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'} border border-zinc-500/10 flex items-center px-4`}>
                        <p className="text-xs text-zinc-500">Leave a heart-warming comment...</p>
                      </div>
                      <button className={`w-12 h-12 rounded-2xl ${accentBg} flex items-center justify-center text-white`}>
                        <span className="material-icons">send</span>
                      </button>
                    </div>
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
