"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { CommentsSheet } from '@/components/CommentsSheet'
import { CommunityTutorial } from '@/components/CommunityTutorial'

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
    userReaction: null,
    comments: [
      { id: 101, user: "Blessed Member", text: "Truly inspiring meditation. Thank you for sharing!", date: "10 min ago", isPinned: true }
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
    userReaction: 'Praying',
    comments: []
  },
]

export default function CommunityPage() {
  const { isDarkMode } = useTheme()
  const [view, setView] = useState<'selection' | 'feed'>('selection')
  const [activeTab, setActiveTab] = useState<'meditation' | 'prayer'>('meditation')
  const [posts, setPosts] = useState<any[]>([])
  const [notification, setNotification] = useState<string | null>(null)
  
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [pickerPostId, setPickerPostId] = useState<number | null>(null)
  const [lastBackPress, setLastBackPress] = useState(0)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<number | null>(null)

  const currentUserName = "Isaac Shon"

  // Load from DB & Request Notification Permission
  useEffect(() => {
    const savedPosts = localStorage.getItem('pf_db_posts_v2')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      setPosts(initialPosts)
    }

    const tutorialSeen = localStorage.getItem('pf_comm_tutorial_seen')
    if (!tutorialSeen) {
      setIsTutorialOpen(true)
    }

    if ("Notification" in window) {
      Notification.requestPermission()
    }

    setIsLoaded(true)
  }, [])

  // Save to DB
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('pf_db_posts_v2', JSON.stringify(posts))
  }, [posts, isLoaded])

  const showNotify = useCallback((msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 2500)
  }, [])

  const triggerPush = (title: string, body: string) => {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body, icon: "/images/PF app logo iphone.png" })
      }
    } catch (err) {
      console.error("Push error:", err)
    }
  }

  // Navigation & Native Back Button
  useEffect(() => {
    if (view === 'selection') {
      window.history.replaceState({ pf_view: 'selection' }, '')
    }

    const handlePopState = (e: PopStateEvent) => {
      if (view === 'feed') {
        setView('selection')
      } else if (view === 'selection') {
        const now = Date.now()
        if (now - lastBackPress < 2000) {
          showNotify("Exiting...")
          setTimeout(() => {
            if (window.confirm("앱을 종료하시겠습니까?")) {
              window.close()
            }
          }, 500)
        } else {
          setLastBackPress(now)
          showNotify("한 번 더 누르면 종료됩니다")
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

  const handleReaction = (postId: number, reactionLabel: string) => {
    setPosts(list => list.map(p => {
      if (p.id === postId) {
        const current = p.userReaction
        const next = current === reactionLabel ? null : reactionLabel
        
        const updatedReactions = { ...p.reactions }
        if (current) {
          updatedReactions[current] = Math.max(0, (updatedReactions[current] || 0) - 1)
        }
        if (next) {
          updatedReactions[next] = (updatedReactions[next] || 0) + 1
          showNotify("한 명이 당신을 위해 함께 기도합니다.")
          // Push simulation for author
          triggerPush("PassionFruits", "당신의 글에 누군가 함께 기도하고 있습니다.")
        }
        
        return { ...p, userReaction: next, reactions: updatedReactions }
      }
      return p
    }))
    setPickerPostId(null)
  }

  const addComment = (postId: number, text: string) => {
    if (!text.trim()) return
    setPosts(list => list.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { 
            id: Date.now(), 
            user: currentUserName, 
            text, 
            date: "Just now", 
            isAuthor: p.user === currentUserName,
            likes: 0,
            userLiked: false
          }]
        }
      }
      return p
    }))
    showNotify("댓글이 등록되었습니다.")
  }

  const toggleCommentLike = (postId: number, commentId: number) => {
    setPosts(list => list.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map((c: any) => {
            if (c.id === commentId) {
              const liked = !c.userLiked
              return { ...c, userLiked: liked, likes: (c.likes || 0) + (liked ? 1 : -1) }
            }
            return c
          })
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
      verse: "오늘의 묵상",
      title,
      content,
      date: "방금 전",
      reactions: { Like: 0, Praying: 0, Comforting: 0, Insight: 0, Check: 0 },
      userReaction: null,
      comments: []
    }
    setPosts([newPost, ...posts])
    setIsWriteModalOpen(false)
    showNotify("포스트가 게시되었습니다!")
  }

  // --- Long Press Logic ---
  const longPressTimer = useRef<any>(null)
  const isLongPressing = useRef(false)
  const pointerStartPos = useRef({ x: 0, y: 0 })

  const handlePointerDown = (postId: number, e: React.PointerEvent) => {
    isLongPressing.current = false
    pointerStartPos.current = { x: e.clientX, y: e.clientY }
    
    longPressTimer.current = setTimeout(() => {
      isLongPressing.current = true
      setPickerPostId(postId)
      if (window.navigator.vibrate) window.navigator.vibrate(50)
    }, 500)
  }

  const handlePointerUp = (postId: number, e: React.PointerEvent) => {
    clearTimeout(longPressTimer.current)
    const moveDist = Math.sqrt(Math.pow(e.clientX - pointerStartPos.current.x, 2) + Math.pow(e.clientY - pointerStartPos.current.y, 2))
    if (!isLongPressing.current && moveDist < 10) {
      handleReaction(postId, 'Like')
    }
  }

  const handlePointerCancel = () => {
    clearTimeout(longPressTimer.current)
  }

  const sharePost = (post: any) => {
    const text = `[PassionFruits] ${post.title}\n${post.content}`
    if (navigator.share) {
      navigator.share({ title: post.title, text: text, url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      showNotify("링크가 복사되었습니다!")
    }
  }

  const closeTutorial = () => {
    localStorage.setItem('pf_comm_tutorial_seen', 'true')
    setIsTutorialOpen(false)
  }

  const openComments = (postId: number) => {
    setActiveCommentsPostId(postId)
    setIsCommentsOpen(true)
  }

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'

  const filteredPosts = posts.filter(p => p.type === activeTab)
  const activePost = posts.find(p => p.id === activeCommentsPostId)

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
          const userActiveReaction = p.userReaction
          const isPickerOpen = pickerPostId === p.id
          const totalReactions = Object.values(p.reactions).reduce((a: any, b: any) => (a as number) + (b as number), 0) as number
          const isExpanded = expandedId === p.id
          return (
            <div key={p.id} className="flex flex-col border-b border-zinc-500/5">
              <div className="px-6 py-4 flex items-center gap-3">
                {p.isAnonymous ? ( <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-100'}`}><span className="material-icons text-[18px] text-zinc-500">visibility_off</span></div> ) : ( <img src={p.avatar} className="w-8 h-8 rounded-full border border-zinc-500/10 object-cover" alt="" /> )}
                <div><p className="font-bold text-sm">{p.isAnonymous ? 'Anonymous' : p.user}</p><p className="text-[10px] text-zinc-500 uppercase font-black">{p.date}</p></div>
              </div>

              <div onClick={() => setExpandedId(isExpanded ? null : p.id)} className="px-6 py-2 cursor-pointer select-none active:opacity-60 transition-opacity">
                <h3 className="text-2xl font-black tracking-tighter leading-tight mb-2">{p.title}</h3>
                {!isExpanded && <p className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>{p.verse}</p>}
              </div>

              <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="px-6 pb-6 pt-2 space-y-8 bg-zinc-500/5">
                  <div className="space-y-4">
                    <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${accentColor}`}>{p.verse}</p>
                    <p className="text-[17px] leading-relaxed font-medium tracking-tight opacity-90 whitespace-pre-wrap">{p.content}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between relative">
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <button 
                      onPointerDown={(e) => handlePointerDown(p.id, e)}
                      onPointerUp={(e) => handlePointerUp(p.id, e)}
                      onPointerCancel={handlePointerCancel}
                      onContextMenu={(e) => e.preventDefault()}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-all active:scale-95 ${userActiveReaction ? (isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white') : (isDarkMode ? 'bg-zinc-900 text-zinc-500' : 'bg-slate-100 text-slate-400')}`}
                    >
                      <span className="material-icons text-[22px]">
                        {userActiveReaction ? reactionTypes.find(r => r.label === userActiveReaction)?.icon : 'thumb_up_off_alt'}
                      </span>
                      {totalReactions > 0 && <span className="text-sm font-black tracking-tight">{totalReactions}</span>}
                    </button>
                    {isPickerOpen && (
                      <div className={`absolute bottom-full left-0 mb-4 flex items-center gap-3 p-3 px-4 rounded-[40px] shadow-2xl border animate-in slide-in-from-bottom-6 zoom-in duration-300 z-50 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-50'}`}>
                        {reactionTypes.map((rt) => (
                          <button 
                            key={rt.label} 
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleReaction(p.id, rt.label); }} 
                            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-150 active:scale-90"
                          >
                            <span className={`material-icons text-2xl ${rt.color}`}>{rt.icon}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button onClick={() => openComments(p.id)} className="flex items-center gap-2 text-zinc-400 active:scale-90 transition-transform">
                    <span className="material-icons text-[24px]">chat_bubble_outline</span>
                    {p.comments.length > 0 && <span className="text-xs font-bold">{p.comments.length}</span>}
                  </button>
                </div>

                <button onClick={() => sharePost(p)} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10 text-zinc-400 active:scale-90 transition-transform">
                  <span className="material-icons text-xl">send</span>
                </button>
              </div>
            </div>
          )
        })}
      </section>

      <button onClick={() => setIsWriteModalOpen(true)} className={`fixed bottom-28 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 z-40 ${accentBg} text-white`}><span className="material-icons text-3xl">add</span></button>

      {isCommentsOpen && activePost && (
        <CommentsSheet 
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          comments={activePost.comments}
          onAddComment={(text) => addComment(activePost.id, text)}
          onToggleLike={(commentId) => toggleCommentLike(activePost.id, commentId)}
          authorName={activePost.user}
        />
      )}

      {isTutorialOpen && <CommunityTutorial onClose={closeTutorial} />}

      {isWriteModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-end animate-in fade-in duration-300">
          <div className={`w-full max-w-md mx-auto p-8 rounded-t-[48px] animate-in slide-in-from-bottom-10 duration-500 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-10"><h2 className="text-xl font-black uppercase tracking-tight">New {activeTab === 'meditation' ? 'Meditation' : 'Prayer'}</h2><button onClick={() => setIsWriteModalOpen(false)} className="material-icons opacity-40">close</button></div>
            <input id="new-post-title" type="text" placeholder="TITLE" className="w-full text-2xl font-black mb-6 bg-transparent outline-none placeholder:opacity-10 uppercase tracking-tighter" />
            <textarea id="new-post-content" placeholder="Share your light..." className="w-full h-40 bg-transparent outline-none resize-none mb-10 placeholder:opacity-10 text-lg font-medium" />
            <button onClick={() => { const title = (document.getElementById('new-post-title') as HTMLInputElement).value; const content = (document.getElementById('new-post-content') as HTMLTextAreaElement).value; if (title && content) addNewPost(title, content, activeTab); }} className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest text-xs ${accentBg} text-white shadow-xl`}>Post Now</button>
          </div>
        </div>
      )}

      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .font-pretendard { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; } `}</style>
    </div>
  )
}
