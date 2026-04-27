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
    user: "blessedpub", 
    avatar: "/images/PF app logo iphone.png",
    verse: "Psalms 37:4 (for test.)", 
    title: "What is your heart's desire?",
    content: "Your heart is a very important element. Psalm 37:4 says, 'Delight yourself in the Lord, and he will give you the desires of your heart.' God wants to align your passion with His purpose. When you find that intersection, that's where true joy begins. (for test.)",
    date: "42 min ago",
    reactions: { Like: 1, Sympathy: 45, Comfort: 8, Sadness: 0, Surprise: 3 }
  },
  { 
    id: 2, 
    user: "page_church", 
    avatar: "/images/PF app logo iphone.png",
    verse: "Matthew 5:14 (for test.)", 
    title: "Light in the Darkness",
    content: "Being the light of the world is a call to action. How can I shine today? I realized that even a small light can change the atmosphere of a whole room. Our influence is greater than we think. (for test.)",
    date: "3 days ago",
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
      
      setMeditations(mList => mList.map(m => {
        if (m.id === postId) {
          const updatedReactions = { ...m.reactions }
          if (currentReaction) (updatedReactions as any)[currentReaction] -= 1
          if (newReaction) (updatedReactions as any)[newReaction] += 1
          return { ...m, reactions: updatedReactions }
        }
        return m
      }))
      
      return { ...prev, [postId]: newReaction }
    })
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-40 transition-colors duration-500`}>
      {/* Social Header */}
      <header className="px-6 pt-16 pb-6 flex items-center justify-between border-b border-zinc-500/10 backdrop-blur-md sticky top-0 z-40 bg-inherit/80">
        <h1 className="text-2xl font-black font-plus-jakarta tracking-tight">PassionFruits</h1>
        <div className="flex items-center gap-4">
          <button className="material-icons text-zinc-500">notifications_none</button>
          <button className="material-icons text-zinc-500">chat_bubble_outline</button>
        </div>
      </header>

      {/* Social Feed Layer */}
      <section className="flex flex-col">
        {meditations.map((m) => {
          const isExpanded = expandedId === m.id
          const userActiveReaction = userReactions[m.id]

          return (
            <div key={m.id} className="flex flex-col border-b border-zinc-500/5">
              {/* Post Header (Instagram Style) */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-0.5 rounded-full bg-gradient-to-tr from-brand-yellow to-brand-purple`}>
                    <img src={m.avatar} alt={m.user} className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-black' : 'border-white'}`} />
                  </div>
                  <div className="flex flex-col -space-y-1">
                    <p className="font-bold text-sm tracking-tight">{m.user}</p>
                    <p className="text-[10px] text-zinc-500">{m.date}</p>
                  </div>
                </div>
                <button className="material-icons text-zinc-400">more_vert</button>
              </div>

              {/* Minimal Post Summary Card */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : m.id)}
                className={`px-6 py-8 cursor-pointer group relative overflow-hidden transition-all duration-500 ${isExpanded ? 'bg-zinc-500/5' : 'hover:bg-zinc-500/5'}`}
              >
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl font-black font-plus-jakarta tracking-tight leading-tight">
                    {m.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>
                      {m.verse}
                    </span>
                  </div>
                </div>
                
                {/* Visual Accent */}
                <div className={`absolute right-0 top-0 bottom-0 w-1 ${isExpanded ? accentBg : 'bg-transparent'} transition-all`}></div>
              </div>

              {/* Interaction Bar (Summary View) */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <button className={`flex items-center gap-1.5 transition-all active:scale-90`}>
                    <span className="material-icons text-2xl">favorite_border</span>
                    <span className="text-xs font-bold">{Object.values(m.reactions).reduce((a, b) => a + b, 0)}</span>
                  </button>
                  <button className="material-icons text-2xl">chat_bubble_outline</button>
                  <button className="material-icons text-2xl">repeat</button>
                </div>
                <button className="material-icons text-2xl">bookmark_border</button>
              </div>

              {/* Expanded Content Layer (Personal Detail) */}
              <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[1200px] opacity-100 pb-12' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 space-y-10">
                  <div className="h-px w-full bg-zinc-500/10"></div>
                  
                  {/* Reflection Text */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Personal Reflection</p>
                    <p className="text-[18px] leading-relaxed font-medium tracking-tight opacity-90">
                      {m.content}
                    </p>
                  </div>

                  {/* Scripture Visual */}
                  <div className={`p-8 rounded-[40px] ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-100'} border space-y-4`}>
                    <span className="material-icons text-zinc-300">format_quote</span>
                    <p className={`text-[16px] italic font-medium leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                      {m.content.split('. ')[0]}.
                    </p>
                    <p className={`text-[12px] font-black uppercase tracking-widest ${accentColor}`}>{m.verse}</p>
                  </div>

                  {/* Emotional Stickers (Instagram style selector) */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Reactions</p>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                      {reactionTypes.map((rt) => {
                        const isActive = userActiveReaction === rt.label
                        return (
                          <button 
                            key={rt.label}
                            onClick={() => toggleReaction(m.id, rt.label)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all active:scale-90 border-2 ${
                              isActive 
                                ? `${isDarkMode ? 'bg-zinc-800 border-brand-yellow/30' : 'bg-white border-brand-purple/20 shadow-sm'}` 
                                : `${isDarkMode ? 'bg-zinc-900 border-transparent opacity-60' : 'bg-slate-50 border-transparent opacity-60'}`
                            }`}
                          >
                            <span className={`material-icons text-[20px] ${isActive ? rt.color : 'text-zinc-500'}`}>{rt.icon}</span>
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
            </div>
          )
        })}
      </section>

      {/* Floating Add Post Button (Extra Premium) */}
      <button className={`fixed bottom-28 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 z-40 ${accentBg} ${isDarkMode ? 'text-black' : 'text-white'}`}>
        <span className="material-icons">edit</span>
      </button>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
