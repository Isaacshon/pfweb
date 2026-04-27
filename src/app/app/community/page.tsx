"use client"

import React, { useState, useEffect, useRef } from 'react'
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
    user: "Isaac Shon", 
    avatar: "/images/PF app logo iphone.png",
    isAnonymous: false,
    verse: "Psalms 37:4", 
    title: "Aligning Desires with Purpose",
    content: "Your heart is a very important element. Psalm 37:4 says, 'Delight yourself in the Lord, and he will give you the desires of your heart.' God wants to align your passion with His purpose.",
    date: "42 min ago",
    reactions: { Like: 5, Praying: 12, Comforting: 8, Insight: 2, Check: 3 },
    comments: [
      { id: 101, user: "Blessed Member", text: "Truly inspiring meditation. Thank you for sharing!", date: "10 min ago" }
    ]
  },
  { 
    id: 2, 
    type: 'prayer',
    user: "Anonymous", 
    avatar: "", 
    isAnonymous: true,
    verse: "Matthew 11:28", 
    title: "Prayer for Restoration",
    content: "Dear Lord, I feel overwhelmed by the burdens of this week. I come to You seeking the rest You promised. Please restore my soul and give me the strength to face tomorrow with a peaceful heart.",
    date: "1h ago",
    reactions: { Like: 12, Praying: 52, Comforting: 8, Insight: 0, Check: 1 },
    comments: []
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
  
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [pickerPostId, setPickerPostId] = useState<number | null>(null)
  const [lastBackPress, setLastBackPress] = useState(0)
  
  const currentUserName = "Isaac Shon"

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'

  const filteredPosts = posts.filter(p => p.type === activeTab)

  const showNotify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 2500)
  }

  // --- Navigation & Back Button Handling ---
  useEffect(() => {
    // 1. Initial State
    if (view === 'selection') {
      window.history.replaceState({ pf_view: 'selection' }, '')
    }

    const handlePopState = (e: PopStateEvent) => {
      if (view === 'feed') {
        // If we are in feed and back is pressed, go to selection
        setView('selection')
      } else if (view === 'selection') {
        // If we are in selection and back is pressed, handle double-back exit
        const now = Date.now()
        if (now - lastBackPress < 2000) {
          showNotify("Exiting PassionFruits...")
          // In most mobile browsers, we can't force close, but we can try
          setTimeout(() => {
            if (window.confirm("Do you want to exit the app?")) {
              window.close()
            }
          }, 500)
        } else {
          setLastBackPress(now)
          showNotify("Press back once more to exit")
          // Push state again to prevent actually leaving the page on first back
          window.history.pushState({ pf_view: 'selection' }, '')
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [view, lastBackPress])

  const navigateToFeed = (tab: 'meditation' | 'prayer') => {
    setActiveTab(tab)
    setView('feed')
    window.history.pushState({ pf_view: 'feed' }, '')
  }

  const handleReaction = (postId: number, reactionLabel: string) => {
    setUserReactions(prev => {
      const current = prev[postId]
      const next = current === reactionLabel ? null : reactionLabel
      setPosts(list => list.map(p => {
        if (p.id === postId) {
          const updated = { ...p.reactions }
          if (current) (updated as any)[current] -= 1
          if (next) {
            (updated as any)[next] += 1
            if (p.type === 'prayer') showNotify("한 명이 당신을 위해 함께 기도합니다.")
          }
          return { ...p, reactions: updated }
        }
        return p
      }))
      return { ...prev, [postId]: next }
    })
    setPickerPostId(null)
  }

  const addComment = (postId: number, text: string) => {
    if (!text.trim()) return
    setPosts(list => list.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: Date.now(), user: currentUserName, text, date: "Just now" }]
        }
      }
      return p
    }))
  }

  const sharePost = (post: any) => {
    const text = `[PassionFruits] ${post.title}\n${post.content}`
    if (navigator.share) {
      navigator.share({ title: post.title, text: text, url: window.location.href })
    } else {
      navigator.clipboard.writeText(text)
      showNotify("Link copied!")
    }
  }

  const longPressTimer = useRef<any>(null)
  const startLongPress = (postId: number) => {
    longPressTimer.current = setTimeout(() => {
      setPickerPostId(postId)
      if (window.navigator.vibrate) window.navigator.vibrate(50)
    }, 500)
  }
  const endLongPress = (postId: number) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      if (pickerPostId !== postId) handleReaction(postId, 'Like')
    }
  }

  if (view === 'selection') {
    return (
      <div className="fixed inset-0 z-[50] flex flex-col overflow-hidden animate-in fade-in duration-700 bg-black font-pretendard">
        <div className="flex-1 flex overflow-hidden pb-24"> 
          <button 
            onClick={() => navigateToFeed('meditation')}
            className="flex-1 relative group transition-all duration-1000 hover:flex-[1.1] flex items-center justify-center overflow-hidden px-4"
            style={{ backgroundColor: 'rgba(109, 64, 217, 0.85)' }}
          >
            <div className="absolute top-20 left-10 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse"></div>
            <h2 className="text-2xl md:text-5xl font-extralight tracking-[0.1em] md:tracking-[0.25em] text-white">MEDITATION</h2>
          </button>
          <button 
            onClick={() => navigateToFeed('prayer')}
            className="flex-1 relative group transition-all duration-1000 hover:flex-[1.1] flex items-center justify-center overflow-hidden px-4"
            style={{ backgroundColor: 'rgba(252, 211, 77, 0.85)' }}
          >
            <div className="absolute top-32 right-12 w-12 h-12 border-2 border-white/30 rotate-45 animate-pulse"></div>
            <h2 className="text-2xl md:text-5xl font-extralight tracking-[0.1em] md:tracking-[0.25em] text-white">PRAYER</h2>
          </button>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[60]">
            <div className="relative flex items-center justify-center">
              <div className="w-[2px] h-48 bg-white/40 backdrop-blur-md rounded-full shadow-2xl"></div>
              <div className="absolute top-12 w-24 h-[2px] bg-white/40 backdrop-blur-md rounded-full"></div>
            </div>
          </div>
        </div>
        {notification && (
          <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-white text-xs font-bold shadow-2xl">{notification}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-40 transition-colors duration-500 font-pretendard relative no-scrollbar overflow-x-hidden`}>
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
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10"><span className="material-icons text-xl">arrow_back</span></button>
          <h1 className="text-xl font-black tracking-tight">{activeTab.toUpperCase()}</h1>
        </div>
      </header>

      <section className="flex flex-col">
        {filteredPosts.map((p) => {
          const isExpanded = expandedId === p.id
          const userActiveReaction = userReactions[p.id]
          const isPickerOpen = pickerPostId === p.id

          return (
            <div key={p.id} className="flex flex-col border-b border-zinc-500/5">
              <div className="px-6 py-4 flex items-center gap-3">
                {p.isAnonymous ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-100'}`}><span className="material-icons text-[18px] text-zinc-500">visibility_off</span></div>
                ) : (
                  <img src={p.avatar} className="w-8 h-8 rounded-full border border-zinc-500/10" alt="" />
                )}
                <div>
                  <p className="font-bold text-sm">{p.isAnonymous ? 'Anonymous' : p.user}</p>
                  <p className="text-[10px] text-zinc-500 uppercase font-black">{p.date}</p>
                </div>
              </div>

              <div onClick={() => setExpandedId(isExpanded ? null : p.id)} className="px-6 py-6 cursor-pointer">
                <h3 className="text-2xl font-black tracking-tighter leading-tight mb-2">{p.title}</h3>
                <p className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>{p.verse}</p>
              </div>

              <div className="px-6 py-4 flex items-center justify-between relative">
                <div className="flex items-center gap-6">
                  {Object.values(p.reactions).reduce((a, b) => a + b, 0) > 0 && (
                    <div className="flex items-center mr-4">
                      <div className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-black' : 'border-white'} ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'} flex items-center justify-center mr-2 shadow-sm`}>
                        <span className="material-icons text-[12px] text-blue-500">thumb_up</span>
                      </div>
                      <span className="text-[12px] font-black opacity-30">{Object.values(p.reactions).reduce((a, b) => a + b, 0)}</span>
                    </div>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); setExpandedId(p.id); }} className="material-icons text-[22px] text-zinc-400">chat_bubble_outline</button>
                  {p.type !== 'prayer' && <button onClick={(e) => { e.stopPropagation(); sharePost(p); }} className="material-icons text-[22px] text-zinc-400">send</button>}
                </div>

                <div className="relative">
                  <button 
                    onMouseDown={() => startLongPress(p.id)}
                    onMouseUp={() => endLongPress(p.id)}
                    onTouchStart={() => startLongPress(p.id)}
                    onTouchEnd={() => endLongPress(p.id)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${userActiveReaction ? accentBg + ' text-white' : (isDarkMode ? 'bg-zinc-900' : 'bg-slate-50')}`}
                  >
                    {userActiveReaction || 'REACT'}
                  </button>
                  {isPickerOpen && (
                    <div className={`absolute bottom-full right-0 mb-4 flex items-center gap-2 p-2 rounded-[24px] shadow-2xl border animate-in slide-in-from-bottom-2 duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-50'}`}>
                      {reactionTypes.map((rt) => (
                        <button key={rt.label} onClick={() => handleReaction(p.id, rt.label)} className="w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all hover:scale-125 hover:bg-zinc-500/10"><span className={`material-icons ${rt.color}`}>{rt.icon}</span></button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-700 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 py-10 space-y-8 bg-zinc-500/5">
                  <p className="text-[18px] leading-relaxed font-medium tracking-tight opacity-90">{p.content}</p>
                  <div className="space-y-6 pt-10 border-t border-zinc-500/10">
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-30">Real Name Comments</p>
                    <div className="flex flex-col gap-6">
                      {p.comments.map(c => (
                        <div key={c.id} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2"><span className="text-xs font-black">{c.user}</span><span className="text-[9px] opacity-30">{c.date}</span></div>
                          <p className="text-sm opacity-80">{c.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                      <input type="text" placeholder={`Comment as ${currentUserName}...`} onKeyDown={(e) => { if (e.key === 'Enter') { addComment(p.id, (e.target as any).value); (e.target as any).value = ''; } }} className={`flex-1 h-14 px-6 rounded-2xl text-sm font-medium outline-none ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900 border'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <button onClick={() => setIsWriteModalOpen(true)} className={`fixed bottom-28 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 z-40 ${accentBg} text-white`}><span className="material-icons text-3xl">add</span></button>

      {isWriteModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end animate-in fade-in duration-300">
          <div className={`w-full max-w-md mx-auto p-8 rounded-t-[48px] animate-in slide-in-from-bottom-10 duration-500 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-10"><h2 className="text-xl font-black">Write Post</h2><button onClick={() => setIsWriteModalOpen(false)} className="material-icons opacity-40">close</button></div>
            <input type="text" placeholder="Title" className="w-full text-2xl font-black mb-6 bg-transparent outline-none placeholder:opacity-10" />
            <textarea placeholder="Share your thoughts..." className="w-full h-40 bg-transparent outline-none resize-none mb-10 placeholder:opacity-10" />
            <button onClick={() => { setIsWriteModalOpen(false); showNotify("Post published!"); }} className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest text-xs ${accentBg} text-white shadow-xl`}>Post Now</button>
          </div>
        </div>
      )}
      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .font-pretendard { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; } `}</style>
    </div>
  )
}
