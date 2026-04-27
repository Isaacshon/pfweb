"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  const [posts, setPosts] = useState<any[]>([])
  const [userReactions, setUserReactions] = useState<Record<number, string | null>>({})
  const [notification, setNotification] = useState<string | null>(null)
  
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [pickerPostId, setPickerPostId] = useState<number | null>(null)
  const [lastBackPress, setLastBackPress] = useState(0)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const currentUserName = "Isaac Shon"

  // --- "Database" Initialization (LocalStorage) ---
  useEffect(() => {
    const savedPosts = localStorage.getItem('pf_db_posts')
    const savedReactions = localStorage.getItem('pf_db_user_reactions')
    
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      setPosts(initialPosts)
    }
    
    if (savedReactions) {
      setUserReactions(JSON.parse(savedReactions))
    }
    setIsLoaded(true)
  }, [])

  // Sync DB
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('pf_db_posts', JSON.stringify(posts))
    localStorage.setItem('pf_db_user_reactions', JSON.stringify(userReactions))
  }, [posts, userReactions, isLoaded])

  const showNotify = useCallback((msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 2500)
  }, [])

  // --- Navigation & Back Button ---
  useEffect(() => {
    if (view === 'selection') window.history.replaceState({ pf_view: 'selection' }, '')
    const handlePopState = (e: PopStateEvent) => {
      if (view === 'feed') setView('selection')
      else if (view === 'selection') {
        const now = Date.now()
        if (now - lastBackPress < 2000) {
          showNotify("Exiting...")
          setTimeout(() => { if (window.confirm("Exit App?")) window.close() }, 500)
        } else {
          setLastBackPress(now)
          showNotify("Press back again to exit")
          window.history.pushState({ pf_view: 'selection' }, '')
        }
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [view, lastBackPress, showNotify])

  const navigateToFeed = (tab: 'meditation' | 'prayer') => {
    setActiveTab(tab)
    setView('feed')
    window.history.pushState({ pf_view: 'feed' }, '')
  }

  // --- Reaction Logic (Cancel, Switch, Count) ---
  const handleReaction = (postId: number, reactionLabel: string) => {
    setUserReactions(prev => {
      const current = prev[postId]
      const next = current === reactionLabel ? null : reactionLabel // Toggle off if same, or switch
      
      setPosts(list => list.map(p => {
        if (p.id === postId) {
          const updated = { ...p.reactions }
          // Decrement old
          if (current) (updated as any)[current] = Math.max(0, (updated as any)[current] - 1)
          // Increment new
          if (next) {
            (updated as any)[next] = ((updated as any)[next] || 0) + 1
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

  const addNewPost = (title: string, content: string, type: 'meditation' | 'prayer') => {
    const newPost = {
      id: Date.now(),
      type,
      user: currentUserName,
      avatar: "/images/PF app logo iphone.png",
      isAnonymous: false,
      verse: "Community Shared",
      title,
      content,
      date: "Just now",
      reactions: { Like: 0, Praying: 0, Comforting: 0, Insight: 0, Check: 0 },
      comments: []
    }
    setPosts([newPost, ...posts])
    setIsWriteModalOpen(false)
    showNotify("Post published!")
  }

  // --- Long Press for Picker ---
  const longPressTimer = useRef<any>(null)
  const startLongPress = (postId: number) => {
    longPressTimer.current = setTimeout(() => {
      setPickerPostId(postId)
      if (window.navigator.vibrate) window.navigator.vibrate(50)
    }, 450)
  }
  const endLongPress = (postId: number) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      if (pickerPostId !== postId) handleReaction(postId, 'Like')
    }
  }

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'

  const filteredPosts = posts.filter(p => p.type === activeTab)

  if (view === 'selection') {
    return (
      <div className="fixed inset-0 z-[50] flex flex-col overflow-hidden animate-in fade-in duration-700 bg-black font-pretendard">
        <div className="flex-1 flex overflow-hidden pb-24"> 
          <button onClick={() => navigateToFeed('meditation')} className="flex-1 relative group transition-all duration-1000 hover:flex-[1.1] flex items-center justify-center overflow-hidden px-4" style={{ backgroundColor: 'rgba(109, 64, 217, 0.85)' }}>
            <div className="absolute top-20 left-10 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse"></div>
            <h2 className="text-2xl md:text-5xl font-extralight tracking-[0.1em] md:tracking-[0.25em] text-white">MEDITATION</h2>
          </button>
          <button onClick={() => navigateToFeed('prayer')} className="flex-1 relative group transition-all duration-1000 hover:flex-[1.1] flex items-center justify-center overflow-hidden px-4" style={{ backgroundColor: 'rgba(252, 211, 77, 0.85)' }}>
            <div className="absolute top-32 right-12 w-12 h-12 border-2 border-white/30 rotate-45 animate-pulse"></div>
            <h2 className="text-2xl md:text-5xl font-extralight tracking-[0.1em] md:tracking-[0.25em] text-white">PRAYER</h2>
          </button>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[60]"><div className="relative flex items-center justify-center"><div className="w-[2px] h-48 bg-white/40 backdrop-blur-md rounded-full shadow-2xl"></div><div className="absolute top-12 w-24 h-[2px] bg-white/40 backdrop-blur-md rounded-full"></div></div></div>
        </div>
        {notification && <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500"><div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-white text-xs font-bold shadow-2xl">{notification}</div></div>}
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-40 transition-colors duration-500 font-pretendard relative no-scrollbar overflow-x-hidden`}>
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500">
          <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border px-6 py-3 rounded-full shadow-2xl flex items-center gap-3`}><span className={`material-icons text-lg ${accentColor}`}>auto_awesome</span><p className="text-sm font-bold tracking-tight">{notification}</p></div>
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
          const userActiveReaction = userReactions[p.id]
          const isPickerOpen = pickerPostId === p.id
          const totalReactions = Object.values(p.reactions).reduce((a: any, b: any) => a + b, 0)

          return (
            <div key={p.id} className="flex flex-col border-b border-zinc-500/5">
              <div className="px-6 py-4 flex items-center gap-3">
                {p.isAnonymous ? ( <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-100'}`}><span className="material-icons text-[18px] text-zinc-500">visibility_off</span></div> ) : ( <img src={p.avatar} className="w-8 h-8 rounded-full border border-zinc-500/10" alt="" /> )}
                <div><p className="font-bold text-sm">{p.isAnonymous ? 'Anonymous Member' : p.user}</p><p className="text-[10px] text-zinc-500 uppercase font-black">{p.date}</p></div>
              </div>

              <div className="px-6 py-6 cursor-pointer">
                <h3 className="text-2xl font-black tracking-tighter leading-tight mb-2">{p.title}</h3>
                <p className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>{p.verse}</p>
              </div>

              <div className="px-6 py-4 flex items-center justify-between relative">
                <div className="flex items-center gap-6">
                  {totalReactions > 0 && (
                    <div className="flex items-center mr-4">
                      <div className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-black' : 'border-white'} ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'} flex items-center justify-center mr-2 shadow-sm`}><span className="material-icons text-[12px] text-blue-500">thumb_up</span></div>
                      <span className="text-[12px] font-black opacity-30">{totalReactions}</span>
                    </div>
                  )}
                  <button className="material-icons text-[22px] text-zinc-400">chat_bubble_outline</button>
                  {p.type !== 'prayer' && <button className="material-icons text-[22px] text-zinc-400">send</button>}
                </div>

                <div className="relative">
                  <button 
                    onMouseDown={() => startLongPress(p.id)} onMouseUp={() => endLongPress(p.id)} onTouchStart={() => startLongPress(p.id)} onTouchEnd={() => endLongPress(p.id)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${userActiveReaction ? accentBg + ' text-white scale-105 shadow-lg' : (isDarkMode ? 'bg-zinc-900' : 'bg-slate-50')}`}
                  >
                    {userActiveReaction ? reactionTypes.find(r => r.label === userActiveReaction)?.label : 'REACT'}
                  </button>
                  {isPickerOpen && (
                    <div className={`absolute bottom-full right-0 mb-4 flex items-center gap-2 p-2 px-3 rounded-[32px] shadow-2xl border animate-in slide-in-from-bottom-4 duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-50'}`}>
                      {reactionTypes.map((rt) => (
                        <button key={rt.label} onClick={() => handleReaction(p.id, rt.label)} className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-150 active:scale-90"><span className={`material-icons text-2xl ${rt.color}`}>{rt.icon}</span></button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-8 space-y-10 border-t border-zinc-500/5">
                <p className="text-[17px] leading-relaxed font-medium tracking-tight opacity-90">{p.content}</p>
                <div className="space-y-6 pt-10 border-t border-zinc-500/10">
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-30">Real Name Comments</p>
                  <div className="flex flex-col gap-6">
                    {p.comments.map((c: any) => (
                      <div key={c.id} className="flex flex-col gap-1"><div className="flex items-center gap-2"><span className="text-xs font-black">{c.user}</span><span className="text-[9px] opacity-30">{c.date}</span></div><p className="text-sm opacity-80">{c.text}</p></div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <input type="text" placeholder={`Comment as ${currentUserName}...`} onKeyDown={(e) => { if (e.key === 'Enter') { addComment(p.id, (e.target as any).value); (e.target as any).value = ''; } }} className={`flex-1 h-14 px-6 rounded-2xl text-sm font-medium outline-none ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900 border'}`} />
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
            <div className="flex justify-between items-center mb-10"><h2 className="text-xl font-black uppercase tracking-tight">New {activeTab}</h2><button onClick={() => setIsWriteModalOpen(false)} className="material-icons opacity-40">close</button></div>
            <input id="new-post-title" type="text" placeholder="TITLE" className="w-full text-2xl font-black mb-6 bg-transparent outline-none placeholder:opacity-10 uppercase tracking-tighter" />
            <textarea id="new-post-content" placeholder="Share your radiant thoughts..." className="w-full h-40 bg-transparent outline-none resize-none mb-10 placeholder:opacity-10 text-lg font-medium" />
            <button onClick={() => { 
              const title = (document.getElementById('new-post-title') as HTMLInputElement).value;
              const content = (document.getElementById('new-post-content') as HTMLTextAreaElement).value;
              if (title && content) addNewPost(title, content, activeTab);
            }} className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest text-xs ${accentBg} text-white shadow-xl`}>Publish Now</button>
          </div>
        </div>
      )}
      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .font-pretendard { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; } `}</style>
    </div>
  )
}
