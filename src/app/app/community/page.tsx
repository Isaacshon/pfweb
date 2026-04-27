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

const initialMeditations = [
  { 
    id: 1, 
    user: "Test Account (for test.)", 
    avatar: "/images/PF app logo iphone.png",
    verse: "John 3:16 (for test.)", 
    title: "The Infinite Love (for test.)",
    content: "Today I felt the immense love of God through this verse. It's a reminder that we are never alone. God's love is wider than the ocean. (for test.)",
    date: "2h ago",
    reactions: { Like: 12, Sympathy: 45, Comfort: 8, Sadness: 0, Surprise: 3 }
  },
  { 
    id: 2, 
    user: "Test Account (for test.)", 
    avatar: "/images/PF app logo iphone.png",
    verse: "Matthew 5:14 (for test.)", 
    title: "Light in the Darkness (for test.)",
    content: "Being the light of the world is a call to action. How can I shine today? I realized that even a small light can change the atmosphere of a whole room. (for test.)",
    date: "5h ago",
    reactions: { Like: 24, Sympathy: 15, Comfort: 32, Sadness: 1, Surprise: 10 }
  },
]

export default function CommunityPage() {
  const { isDarkMode } = useTheme()
  const [meditations, setMeditations] = useState(initialMeditations)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [userReactions, setUserReactions] = useState<Record<number, string | null>>({})

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'

  const toggleReaction = (postId: number, reactionLabel: string) => {
    setUserReactions(prev => {
      const currentReaction = prev[postId]
      const newReaction = currentReaction === reactionLabel ? null : reactionLabel
      
      // Update counts (Mock logic for local state)
      setMeditations(mList => mList.map(m => {
        if (m.id === postId) {
          const updatedReactions = { ...m.reactions }
          if (currentReaction) {
            (updatedReactions as any)[currentReaction] -= 1
          }
          if (newReaction) {
            (updatedReactions as any)[newReaction] += 1
          }
          return { ...m, reactions: updatedReactions }
        }
        return m
      }))
      
      return { ...prev, [postId]: newReaction }
    })
  }

  const handleShare = (post: any) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Sharing: " + post.content);
    }
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-32 transition-colors duration-500`}>
      <header className="px-8 pt-20 pb-12 flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-5xl font-black font-plus-jakarta tracking-tighter">Feed</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] ml-1">Community</p>
        </div>
        <button className={`w-12 h-12 rounded-full flex items-center justify-center ${accentBg} ${isDarkMode ? 'text-black' : 'text-white'} shadow-xl active:scale-90 transition-transform`}>
          <span className="material-icons">add</span>
        </button>
      </header>

      <section className="px-8 flex flex-col gap-8">
        {meditations.map((m) => {
          const isExpanded = expandedId === m.id
          const userActiveReaction = userReactions[m.id]

          return (
            <div key={m.id} className={`${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-100'} border rounded-[40px] overflow-hidden transition-all duration-500`}>
              {/* Summary View */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : m.id)}
                className="p-8 cursor-pointer active:opacity-70 transition-opacity"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.user} className="w-10 h-10 rounded-2xl border border-white/10" />
                    <div className="space-y-0.5">
                      <p className="font-black text-[13px] tracking-tight opacity-80">{m.user}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{m.date}</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleShare(m); }} className="text-slate-300 hover:text-brand-purple"><span className="material-icons text-xl">ios_share</span></button>
                </div>
                
                <h3 className="text-2xl font-black font-plus-jakarta tracking-tighter mb-2 leading-tight">
                  {m.title}
                </h3>
                <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${accentColor}`}>
                  {m.verse}
                </p>
              </div>

              {/* Expanded Content (Accordion) */}
              <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 space-y-8">
                  {/* Section 1: Reflection Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-1 h-1 rounded-full ${accentBg}`}></span>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Reflection</p>
                    </div>
                    <p className="text-[17px] leading-relaxed font-medium opacity-90 tracking-tight">
                      {m.content}
                    </p>
                  </div>

                  {/* Section 2: Full Verse (Visualized) */}
                  <div className={`${isDarkMode ? 'bg-black/40' : 'bg-white'} p-6 rounded-[32px] border ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'} space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[14px] text-slate-400">auto_stories</span>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Scripture</p>
                    </div>
                    <p className={`text-[15px] italic font-medium leading-snug ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                      "{m.content.split('. ')[0]}..." 
                      <span className={`block mt-2 font-bold not-italic text-[12px] ${accentColor}`}>- {m.verse}</span>
                    </p>
                  </div>

                  {/* Reactions Section */}
                  <div className="pt-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {reactionTypes.map((rt) => {
                      const isActive = userActiveReaction === rt.label
                      return (
                        <button 
                          key={rt.label}
                          onClick={() => toggleReaction(m.id, rt.label)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all active:scale-90 border ${
                            isActive 
                              ? `${isDarkMode ? 'bg-zinc-800 border-zinc-600' : 'bg-white border-slate-200 shadow-sm'}` 
                              : `${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-transparent opacity-60'}`
                          }`}
                        >
                          <span className={`material-icons text-[18px] ${isActive ? rt.color : 'text-zinc-500'}`}>{rt.icon}</span>
                          <span className={`text-[12px] font-black ${isActive ? textColor : 'text-zinc-500'}`}>
                            {(m.reactions as any)[rt.label]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
