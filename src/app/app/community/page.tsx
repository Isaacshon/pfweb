"use client"

import React from 'react'
import { useTheme } from '@/context/ThemeContext'

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
    avatar: "/images/PF app logo.png",
    verse: "John 3:16 (for test.)", 
    content: "Today I felt the immense love of God through this verse. It's a reminder that we are never alone. (for test.)",
    date: "2h ago",
    reactions: { Like: 12, Sympathy: 45, Comfort: 8, Sadness: 0, Surprise: 3 }
  },
  { 
    id: 2, 
    user: "Test Account (for test.)", 
    avatar: "/images/PF app logo.png",
    verse: "Matthew 5:14 (for test.)", 
    content: "Being the light of the world is a call to action. How can I shine today? (for test.)",
    date: "5h ago",
    reactions: { Like: 24, Sympathy: 15, Comfort: 32, Sadness: 1, Surprise: 10 }
  },
]

export default function CommunityPage() {
  const { isDarkMode } = useTheme()

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'

  const handleShare = (post: any) => {
    if (navigator.share) {
      navigator.share({
        title: post.verse,
        text: post.content,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Sharing (for test.): " + post.content);
    }
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-32 transition-colors duration-500`}>
      {/* Immersive Header */}
      <header className="px-8 pt-20 pb-12 flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-5xl font-black font-plus-jakarta tracking-tighter">Posts</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] ml-1">PassionFruits</p>
        </div>
        <button className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white'} shadow-xl active:scale-90 transition-transform`}>
          <span className="material-icons">add</span>
        </button>
      </header>

      {/* Distilled Post Feed with New Avatars */}
      <section className="px-8 flex flex-col gap-16">
        {recentMeditations.map((m) => (
          <div key={m.id} className="flex flex-col gap-6 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-slate-100">
                  <img src={m.avatar} alt={m.user} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-black text-sm">{m.user}</p>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${accentColor}`}>{m.verse}</p>
                </div>
              </div>
              <button 
                onClick={() => handleShare(m)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-brand-purple transition-colors"
              >
                <span className="material-icons text-xl">ios_share</span>
              </button>
            </div>

            <p className={`text-[18px] leading-snug font-medium tracking-tight ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {m.content}
            </p>

            <div className="flex items-center justify-between bg-slate-50/10 p-1 rounded-full border border-slate-50/5">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                {reactionTypes.map((rt) => (
                  <button 
                    key={rt.label}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all active:scale-90 whitespace-nowrap ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-white'} border`}
                  >
                    <span className={`material-icons text-base ${rt.color}`}>{rt.icon}</span>
                    <span className={`text-[10px] font-black ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                      {(m.reactions as any)[rt.label]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-100/10 to-transparent"></div>
          </div>
        ))}
      </section>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
