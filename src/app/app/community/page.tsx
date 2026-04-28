"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { CommentsSheet } from '@/components/CommentsSheet'
import { CommunityTutorial } from '@/components/CommunityTutorial'

const bibleVersions = [
  { name: 'KRV', full: '개역개정', code: 'nkrv', lang: 'ko', flag: '🇰🇷', local: true },
  { name: 'KLB', full: '현대인의 성경', code: 'klb', lang: 'ko', flag: '🇰🇷', local: true },
  { name: 'CUV', full: '和合本', code: 'cn', lang: 'zh', flag: '🇨🇳', local: true },
  { name: 'RVR', full: 'Reina-Valera', code: 'es', lang: 'es', flag: '🇪🇸', local: true },
  { name: 'ESV', full: 'English Standard Version', code: 'ESV', lang: 'en', flag: '🇺🇸', local: false },
  { name: 'NIV', full: 'New International Version', code: 'NIV', lang: 'en', flag: '🇺🇸', local: false },
  { name: 'KJV', full: 'King James Version', code: 'KJV', lang: 'en', flag: '🇬🇧', local: false },
]

const bibleBooks = [
  { id: 1, name: "창세기", eng: "Genesis", zh: "创世记", es: "Génesis" },
  { id: 2, name: "출애굽기", eng: "Exodus", zh: "出埃及记", es: "Éxodo" },
  { id: 3, name: "레위기", eng: "Leviticus", zh: "利未记", es: "Levítico" },
  { id: 4, name: "민수기", eng: "Numbers", zh: "民数记", es: "Números" },
  { id: 5, name: "신명기", eng: "Deuteronomy", zh: "申命记", es: "Deuteronomio" },
  { id: 6, name: "여호수아", eng: "Joshua", zh: "约书亚记", es: "Josué" },
  { id: 7, name: "사사기", eng: "Judges", zh: "士师记", es: "Jueces" },
  { id: 8, name: "룻기", eng: "Ruth", zh: "路得记", es: "Rut" },
  { id: 9, name: "사무엘상", eng: "1 Samuel", zh: "撒母耳记上", es: "1 Samuel" },
  { id: 10, name: "사무엘하", eng: "2 Samuel", zh: "撒母耳记下", es: "2 Samuel" },
  { id: 11, name: "열왕기상", eng: "1 Kings", zh: "列王纪上", es: "1 Reyes" },
  { id: 12, name: "열왕기하", eng: "2 Kings", zh: "列王纪下", es: "2 Reyes" },
  { id: 13, name: "역대상", eng: "1 Chronicles", zh: "历代志上", es: "1 Crónicas" },
  { id: 14, name: "역대하", eng: "2 Chronicles", zh: "历代志下", es: "2 Crónicas" },
  { id: 15, name: "에스라", eng: "Ezra", zh: "以斯拉记", es: "Esdras" },
  { id: 16, name: "느헤미야", eng: "Nehemiah", zh: "느헤미야", es: "Nehemías" },
  { id: 17, name: "에스더", eng: "Esther", zh: "以斯帖记", es: "Ester" },
  { id: 18, name: "욥기", eng: "Job", zh: "约伯记", es: "Job" },
  { id: 19, name: "시편", eng: "Psalms", zh: "诗篇", es: "Salmos" },
  { id: 20, name: "잠언", eng: "Proverbs", zh: "箴言", es: "Proverbios" },
  { id: 21, name: "전도서", eng: "Ecclesiastes", zh: "传道书", es: "Eclesiastés" },
  { id: 22, name: "아가", eng: "Song of Solomon", zh: "雅歌", es: "Cantar de los Cantares" },
  { id: 23, name: "이사야", eng: "Isaiah", zh: "以赛亚书", es: "Isaías" },
  { id: 24, name: "예레미야", eng: "Jeremiah", zh: "耶利米书", es: "Jeremías" },
  { id: 25, name: "예레미야 애가", eng: "Lamentations", zh: "耶利米哀歌", es: "Lamentaciones" },
  { id: 26, name: "에스겔", eng: "Ezekiel", zh: "以西结书", es: "Ezequiel" },
  { id: 27, name: "다니엘", eng: "Daniel", zh: "但以理书", es: "Daniel" },
  { id: 28, name: "호세아", eng: "Hosea", zh: "何西阿书", es: "Oseas" },
  { id: 29, name: "요엘", eng: "Joel", zh: "约珥书", es: "Joel" },
  { id: 30, name: "아모스", eng: "Amos", zh: "阿摩司书", es: "Amós" },
  { id: 31, name: "오바댜", eng: "Obadiah", zh: "俄巴底亚书", es: "Abdías" },
  { id: 32, name: "요나", eng: "Jonah", zh: "约拿书", es: "Jonás" },
  { id: 33, name: "미가", eng: "Micah", zh: "弥迦书", es: "Miqueas" },
  { id: 34, name: "나훔", eng: "Nahum", zh: "那鸿书", es: "Nahúm" },
  { id: 35, name: "하박국", eng: "Habakkuk", zh: "哈巴谷书", es: "Habacuc" },
  { id: 36, name: "스바냐", eng: "Zephaniah", zh: "西番雅书", es: "Sofonías" },
  { id: 37, name: "학개", eng: "Haggai", zh: "哈该书", es: "Hageo" },
  { id: 38, name: "스가랴", eng: "Zechariah", zh: "撒迦利亚书", es: "Zacarías" },
  { id: 39, name: "말라기", eng: "Malachi", zh: "玛拉基书", es: "Malaquías" },
  { id: 40, name: "마태복음", eng: "Matthew", zh: "马太福音", es: "Mateo" },
  { id: 41, name: "마가복음", eng: "Mark", zh: "马可福音", es: "Marcos" },
  { id: 42, name: "누가복음", eng: "Luke", zh: "路加福音", es: "Lucas" },
  { id: 43, name: "요한복음", eng: "John", zh: "约翰福音", es: "Juan" },
  { id: 44, name: "사도행전", eng: "Acts", zh: "使徒行传", es: "Hechos" },
  { id: 45, name: "로마서", eng: "Romans", zh: "罗马书", es: "Romanos" },
  { id: 46, name: "고린도전서", eng: "1 Corinthians", zh: "哥林多前书", es: "1 Corintios" },
  { id: 47, name: "고린도후서", eng: "2 Corinthians", zh: "哥林多后书", es: "2 Corintios" },
  { id: 48, name: "갈라디아서", eng: "Galatians", zh: "加라太书", es: "Gálatas" },
  { id: 49, name: "에베소서", eng: "Ephesians", zh: "以弗所书", es: "Efesios" },
  { id: 50, name: "빌립보서", eng: "Philippians", zh: "腓立比书", es: "Filipenses" },
  { id: 51, name: "골로새서", eng: "Colossians", zh: "歌罗西书", es: "Colosenses" },
  { id: 52, name: "데살로니가전서", eng: "1 Thessalonians", zh: "帖撒罗尼迦前书", es: "1 Tesalonicenses" },
  { id: 53, name: "데살로니가후서", eng: "2 Thessalonians", zh: "帖撒罗尼迦后书", es: "2 Tesalonicenses" },
  { id: 54, name: "디모데전서", eng: "1 Timothy", zh: "提摩太前书", es: "1 Timoteo" },
  { id: 55, name: "디모데후서", eng: "2 Timothy", zh: "提摩太后书", es: "2 Timoteo" },
  { id: 56, name: "디도서", eng: "Titus", zh: "提多书", es: "Tito" },
  { id: 57, name: "빌레몬서", eng: "Philemon", zh: "腓利门书", es: "Filemón" },
  { id: 58, name: "히브리서", eng: "Hebrews", zh: "希伯来书", es: "Hebreos" },
  { id: 59, name: "야고보서", eng: "James", zh: "雅各书", es: "Santiago" },
  { id: 60, name: "베드로전서", eng: "1 Peter", zh: "彼得前书", es: "1 Pedro" },
  { id: 61, name: "베드로후서", eng: "2 Peter", zh: "彼得后书", es: "2 Pedro" },
  { id: 62, name: "요한일서", eng: "1 John", zh: "约翰一书", es: "1 Juan" },
  { id: 63, name: "요한이서", eng: "2 John", zh: "约翰二书", es: "2 Juan" },
  { id: 64, name: "요한삼서", eng: "3 John", zh: "约翰三书", es: "3 Juan" },
  { id: 65, name: "유다서", eng: "Jude", zh: "犹大书", es: "Judas" },
  { id: 66, name: "요한계시록", eng: "Revelation", zh: "启示录", es: "Apocalipsis" }
]

const KOREAN_ABBRS = ["창", "출", "레", "민", "신", "수", "삿", "룻", "삼상", "삼하", "왕상", "왕하", "대상", "대하", "스", "느", "에", "욥", "시", "잠", "전", "아", "사", "렘", "애", "겔", "단", "호", "욜", "암", "옵", "욘", "미", "나", "합", "습", "학", "슥", "말", "마", "막", "눅", "요", "행", "롬", "고전", "고후", "갈", "엡", "빌", "골", "살전", "살후", "딤전", "딤후", "딛", "몬", "히", "약", "벧전", "벧후", "요일", "요이", "요삼", "유", "계"];

const reactionTypes = [
  { label: 'Like', icon: 'thumb_up', color: 'text-blue-500' },
  { label: 'Praying', icon: 'auto_awesome', color: 'text-brand-yellow' },
  { label: 'Comforting', icon: 'volunteer_activism', color: 'text-brand-purple' },
  { label: 'Insight', icon: 'lightbulb', color: 'text-orange-400' },
  { label: 'Check', icon: 'check_circle', color: 'text-emerald-500' },
]

const initialPosts: any[] = []

export default function CommunityPage() {
  const { isDarkMode } = useTheme()
  const [view, setView] = useState<'selection' | 'feed'>('selection')
  const [activeTab, setActiveTab] = useState<'meditation' | 'prayer'>('meditation')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [notification, setNotification] = useState<string | null>(null)
  
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [pickerPostId, setPickerPostId] = useState<number | null>(null)
  const [lastBackPress, setLastBackPress] = useState(0)
  
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [selectedVerseRef, setSelectedVerseRef] = useState('')
  const [selectedVerseContent, setSelectedVerseContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftContent, setDraftContent] = useState('')
  const [parsedVerses, setParsedVerses] = useState<any[]>([])

  // Scripture Picker States
  const [isScripturePickerOpen, setIsScripturePickerOpen] = useState(false)
  const [pStep, setPStep] = useState<'book' | 'chapter' | 'verse'>('book')
  const [pBook, setPBook] = useState<any>(bibleBooks[0])
  const [pChapter, setPChapter] = useState(1)
  const [pVerses, setPVerses] = useState<any[]>([])
  const [pVersion, setPVersion] = useState(bibleVersions[0])
  const [isFetchingVerses, setIsFetchingVerses] = useState(false)
  const [pBookSearch, setPBookSearch] = useState('')

  const getPName = (b: any, lang: string) => {
    if (lang === 'zh') return b.zh || b.name;
    if (lang === 'es') return b.es || b.name;
    if (lang === 'en') return b.eng || b.name;
    return b.name;
  }

  const fetchScripture = async (ver: any, bk: any, ch: number) => {
    setIsFetchingVerses(true)
    try {
      if (ver.local) {
        const res = await fetch(`/bible/bible_${ver.code}.json`)
        const data = await res.json()
        const abbr = KOREAN_ABBRS[bk.id - 1]
        const prefix = `${abbr}${ch}:`
        const filtered = Object.keys(data)
          .filter(k => k.startsWith(prefix))
          .map(k => ({ verse: k.split(':')[1], text: data[k], included: false }))
        setPVerses(filtered)
      } else {
        const res = await fetch(`https://bolls.life/get-text/${ver.code}/${bk.id}/${ch}/`)
        const data = await res.json()
        setPVerses(data.map((v: any) => ({ verse: v.verse, text: v.text, included: false })))
      }
      setPStep('verse')
    } catch (err) { 
      console.error(err)
      showNotify("Error fetching scripture")
    }
    setIsFetchingVerses(false)
  }

  const currentUserName = "Isaac Shon"

  // Load from DB & State Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('pf_current_user')
    if (savedUser) setCurrentUser(JSON.parse(savedUser))

    const savedPosts = localStorage.getItem('pf_db_posts_v3')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      setPosts(initialPosts)
    }

    const savedView = localStorage.getItem('pf_comm_view')
    const savedTab = localStorage.getItem('pf_comm_tab')
    if (savedView === 'feed' && savedTab) {
      setView('feed')
      setActiveTab(savedTab as any)
    }

    const tutorialSeen = localStorage.getItem('pf_comm_tutorial_seen')
    if (!tutorialSeen) {
      setIsTutorialOpen(true)
    }

    if ("Notification" in window) {
      Notification.requestPermission()
    }

    const pendingPost = localStorage.getItem('pf_pending_post')
    if (pendingPost) {
      const { verse, content, type } = JSON.parse(pendingPost)
      setSelectedVerseRef(verse)
      setSelectedVerseContent(content)
      if (type) setActiveTab(type)
      setIsWriteModalOpen(true)
    } else {
      const savedWriteState = localStorage.getItem('pf_comm_write_state')
      if (savedWriteState) {
        const s = JSON.parse(savedWriteState)
        setDraftTitle(s.title || '')
        setDraftContent(s.content || '')
        setIsAnonymous(s.anonymous || false)
        setSelectedVerseRef(s.verseRef || '')
        setSelectedVerseContent(s.verseContent || '')
        setIsWriteModalOpen(s.isOpen || false)
      }
    }

    setIsLoaded(true)
  }, [])

  // Save to DB & Persistence
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('pf_db_posts_v3', JSON.stringify(posts))
    localStorage.setItem('pf_comm_view', view)
    localStorage.setItem('pf_comm_tab', activeTab)
    
    localStorage.setItem('pf_comm_write_state', JSON.stringify({
      isOpen: isWriteModalOpen,
      title: draftTitle,
      content: draftContent,
      anonymous: isAnonymous,
      verseRef: selectedVerseRef,
      verseContent: selectedVerseContent,
      tab: activeTab
    }))
  }, [posts, view, activeTab, isLoaded, isWriteModalOpen, draftTitle, draftContent, isAnonymous, selectedVerseRef, selectedVerseContent])

  // Parse verses for interactive selection
  useEffect(() => {
    if (selectedVerseContent) {
      const lines = selectedVerseContent.split('\n').filter(l => l.trim())
      const parsed = lines.map(l => {
        const match = l.match(/^(\d+)\.\s(.*)/)
        if (match) return { verse: match[1], text: match[2], included: true }
        return { verse: '?', text: l, included: true }
      })
      setParsedVerses(parsed)
    } else {
      setParsedVerses([])
    }
  }, [selectedVerseContent])

  const showNotify = useCallback((msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 2500)
  }, [])

  const triggerPush = (title: string, body: string) => {
    try {
      if ("serviceWorker" in navigator && Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body,
            icon: "/images/PF app logo iphone.png",
            badge: "/images/PF app logo iphone.png",
            vibrate: [200, 100, 200]
          } as any)
        })
      } else if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body, icon: "/images/PF app logo iphone.png" })
      }
    } catch (err) {
      console.error("Push error:", err)
    }
  }

  // Navigation & Native Back Button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isWriteModalOpen) {
        setIsWriteModalOpen(false)
        window.history.pushState(null, '', window.location.pathname)
        return
      }
      if (isCommentsOpen) {
        setIsCommentsOpen(false)
        return
      }
      if (view === 'feed') {
        setView('selection')
        window.history.pushState(null, '', window.location.pathname)
        return
      }
      window.location.href = '/app'
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isCommentsOpen, isWriteModalOpen, view])

  const deletePost = (postId: number) => {
    if (confirm("Delete this post permanently?")) {
      const next = posts.filter(p => p.id !== postId)
      setPosts(next)
      localStorage.setItem('pf_db_posts_v3', JSON.stringify(next))
      showNotify("Post deleted.")
    }
  }

  const handleBack = () => {
    if (isWriteModalOpen) {
      setIsWriteModalOpen(false)
      return
    }
    if (isCommentsOpen) {
      setIsCommentsOpen(false)
      return
    }
    if (view === 'feed') {
      setView('selection')
      return
    }
    window.location.href = '/app'
  }

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
          if (p.type === 'prayer' && p.user === currentUserName) {
            showNotify("Someone is praying for you.")
            triggerPush("PassionFruits", "Someone is praying for you.")
          }
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
            userLiked: false,
            replies: []
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

  const addNewPost = () => {
    if (!draftTitle.trim()) return
    
    const includedVerses = parsedVerses.filter(v => v.included).map(v => `${v.verse}. ${v.text}`).join('\n')
    
    const newPost = {
      id: Date.now(),
      type: activeTab,
      user: isAnonymous ? "Anonymous" : currentUserName,
      avatar: isAnonymous ? "" : "/images/PF app logo iphone.png",
      isAnonymous: isAnonymous,
      verse: selectedVerseRef || "General Reflection",
      title: draftTitle,
      content: includedVerses ? `[Scripture]\n${includedVerses}\n\n[${activeTab === 'meditation' ? 'Reflection' : 'Prayer Request'}]\n${draftContent}` : draftContent,
      date: "Just now",
      reactions: { Like: 0, Praying: 0, Comforting: 0, Insight: 0, Check: 0 },
      userReaction: null,
      comments: []
    }
    setPosts([newPost, ...posts])
    
    setIsWriteModalOpen(false)
    setDraftTitle('')
    setDraftContent('')
    setSelectedVerseRef('')
    setSelectedVerseContent('')
    setIsAnonymous(false)
    setParsedVerses([])
    localStorage.removeItem('pf_pending_post')
    localStorage.removeItem('pf_comm_write_state')
    
    showNotify("Post published successfully!")
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
    window.history.pushState({ pf_view: 'comments' }, '')
  }

  const handleManualCloseComments = () => {
    if (window.history.state?.pf_view === 'comments') {
      window.history.back()
    } else {
      setIsCommentsOpen(false)
    }
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
        <div className="flex-1 flex overflow-hidden pb-24 relative"> 
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 z-20" />
          <div className="absolute left-[30%] right-[30%] top-[28%] h-px bg-white/40 z-20 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          <button onClick={() => navigateToFeed('meditation')} className="flex-1 relative group transition-all duration-1000 hover:flex-[1.1] flex flex-col items-center justify-center overflow-hidden px-4" style={{ backgroundColor: 'rgba(154, 120, 180, 0.85)' }}>
            <div className="w-16 h-16 border border-white/20 rounded-2xl flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-6" style={{ animationDuration: '4s' }}>
              <span className="material-icons text-white/40 text-3xl">auto_stories</span>
            </div>
            <h2 className="text-xl md:text-3xl font-extralight tracking-[0.2em] md:tracking-[0.4em] text-white/90">MEDITATION</h2>
          </button>
          <button onClick={() => navigateToFeed('prayer')} className="flex-1 relative group transition-all duration-1000 hover:flex-[1.1] flex flex-col items-center justify-center overflow-hidden px-4" style={{ backgroundColor: 'rgba(255, 251, 189, 0.85)' }}>
            <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center rotate-12 animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-6" style={{ animationDuration: '4.5s' }}>
              <span className="material-icons text-white/40 text-3xl">volunteer_activism</span>
            </div>
            <h2 className="text-xl md:text-3xl font-extralight tracking-[0.2em] md:tracking-[0.4em] text-white/90">PRAYER</h2>
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
          <button onClick={handleBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10"><span className="material-icons text-xl">arrow_back</span></button>
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
                      type="button"
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

                  {currentUser?.role === 'leader' && (
                    <button onClick={() => deletePost(p.id)} className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-red-500 active:scale-90 transition-transform">
                      <span className="material-icons text-[20px]">delete_outline</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={() => sharePost(p)} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10 text-zinc-400 active:scale-90 transition-transform">
                    <span className="material-icons text-xl">send</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <button onClick={() => setIsWriteModalOpen(true)} className={`fixed bottom-28 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 z-40 ${accentBg} text-white`}><span className="material-icons text-3xl">add</span></button>

      {isCommentsOpen && activePost && (
        <CommentsSheet 
          isOpen={isCommentsOpen}
          onClose={handleManualCloseComments}
          comments={activePost.comments}
          onAddComment={(text) => addComment(activePost.id, text)}
          onToggleLike={(commentId) => toggleCommentLike(activePost.id, commentId)}
          authorName={activePost.user}
        />
      )}

      {isTutorialOpen && <CommunityTutorial onClose={closeTutorial} />}

      {isWriteModalOpen && (
        <div className={`fixed inset-0 z-[120] animate-in fade-in zoom-in duration-300 flex flex-col ${isDarkMode ? 'bg-[#050505]' : 'bg-white'}`}>
          <header className="px-6 pt-16 pb-6 flex items-center justify-between border-b border-zinc-500/10">
            <button onClick={() => { setIsWriteModalOpen(false); localStorage.removeItem('pf_pending_post'); localStorage.removeItem('pf_comm_write_state'); setDraftTitle(''); setDraftContent(''); setSelectedVerseRef(''); setSelectedVerseContent(''); }} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10"><span className="material-icons text-xl">close</span></button>
            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">New {activeTab}</h2>
            <button 
              onClick={addNewPost} 
              className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest ${accentBg} text-white shadow-lg active:scale-90 transition-all`}
            >
              Post
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 no-scrollbar">
            <input 
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              type="text" 
              placeholder="TITLE" 
              className="w-full text-4xl font-black bg-transparent outline-none placeholder:opacity-10 uppercase tracking-tighter" 
              autoFocus
            />

            {selectedVerseRef ? (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${accentBg}`}></span>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${accentColor}`}>{selectedVerseRef}</span>
                  </div>
                  <div className="flex gap-2">
                    {parsedVerses.map((v, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          const next = [...parsedVerses]
                          next[i].included = !next[i].included
                          setParsedVerses(next)
                        }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all border ${v.included ? accentBg + ' text-white border-transparent shadow-lg shadow-current/20' : 'bg-transparent text-zinc-500 border-zinc-500/20'}`}
                      >
                        {v.verse}
                      </button>
                    ))}
                    <button onClick={() => { setSelectedVerseRef(''); setSelectedVerseContent(''); }} className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-500/10 text-zinc-400"><span className="material-icons text-sm">close</span></button>
                  </div>
                </div>
                <div className={`p-8 rounded-[32px] ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'} border border-zinc-500/5 relative overflow-hidden`}>
                  <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-10"></div>
                  <p className="text-[16px] leading-relaxed opacity-80 italic font-medium">
                    {parsedVerses.filter(v => v.included).map(v => `[${v.verse}] ${v.text}`).join(' ')}
                  </p>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { setIsScripturePickerOpen(true); setPStep('book'); }}
                className={`w-full py-10 rounded-[32px] border-2 border-dashed ${isDarkMode ? 'border-zinc-800 hover:border-brand-yellow/30' : 'border-slate-100 hover:border-brand-purple/30'} flex flex-col items-center justify-center gap-4 transition-all group`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'} group-hover:scale-110 transition-transform`}>
                  <span className={`material-icons ${accentColor}`}>auto_stories</span>
                </div>
                <p className="text-sm font-bold opacity-30 uppercase tracking-widest">Add Scripture</p>
              </button>
            )}

            {/* Scripture Picker Inside Write Modal */}
            {isScripturePickerOpen && (
              <div className={`fixed inset-0 z-[200] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500 ${bgColor}`}>
                <header className="px-6 pt-16 pb-6 flex items-center justify-between border-b border-zinc-500/10">
                  <button onClick={() => setIsScripturePickerOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10"><span className="material-icons text-xl">close</span></button>
                  <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Select Scripture</h2>
                  <div className="w-10"></div>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
                  {pStep === 'book' && (
                    <div className="space-y-6">
                      <div className="relative">
                        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">search</span>
                        <input type="text" placeholder="Search Book..." value={pBookSearch} onChange={(e)=>setPBookSearch(e.target.value)} className={`w-full py-4 pl-12 pr-6 rounded-2xl ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'} outline-none font-bold`} />
                      </div>
                      <div className="flex flex-col">
                        {bibleBooks.filter(b => b.name.includes(pBookSearch) || b.eng.toLowerCase().includes(pBookSearch.toLowerCase())).map(b => (
                          <button key={b.id} onClick={() => { setPBook(b); setPStep('chapter'); }} className="flex items-center justify-between py-5 border-b border-zinc-500/5 active:opacity-50">
                            <span className="text-lg font-bold">{getPName(b, pVersion.lang)}</span>
                            <span className="material-icons text-zinc-300">chevron_right</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {pStep === 'chapter' && (
                    <div className="space-y-10">
                      <div className="flex items-center gap-4">
                        <button onClick={()=>setPStep('book')} className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}><span className="material-icons text-sm">arrow_back</span></button>
                        <h3 className="text-2xl font-black uppercase tracking-tight">{getPName(pBook, pVersion.lang)}</h3>
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {Array.from({ length: 50 }, (_, i) => i + 1).map(c => (
                          <button key={c} onClick={() => { setPChapter(c); fetchScripture(pVersion, pBook, c); }} className={`aspect-square rounded-xl flex items-center justify-center font-bold text-lg ${pChapter === c ? accentBg + ' text-white' : (isDarkMode ? 'bg-zinc-900' : 'bg-slate-50')}`}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {pStep === 'verse' && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button onClick={()=>setPStep('chapter')} className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}><span className="material-icons text-sm">arrow_back</span></button>
                          <h3 className="text-2xl font-black uppercase tracking-tight">{getPName(pBook, pVersion.lang)} {pChapter}</h3>
                        </div>
                        <button 
                          onClick={() => {
                            const selected = pVerses.filter(v => v.included);
                            if (selected.length > 0) {
                              const ref = `${getPName(pBook, pVersion.lang)} ${pChapter}:${selected.map(s=>s.verse).join(',')}`;
                              const content = selected.map(s => `${s.verse}. ${s.text}`).join('\n');
                              setSelectedVerseRef(ref);
                              setSelectedVerseContent(content);
                              setIsScripturePickerOpen(false);
                            }
                          }}
                          className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest ${accentBg} text-white shadow-lg`}
                        >
                          Add
                        </button>
                      </div>
                      
                      {isFetchingVerses ? (
                        <div className="flex items-center justify-center py-20 animate-pulse"><div className={`w-2 h-2 rounded-full ${accentBg}`}></div></div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {pVerses.map((v, i) => (
                            <button 
                              key={i} 
                              onClick={() => {
                                const next = [...pVerses];
                                next[i].included = !next[i].included;
                                setPVerses(next);
                              }}
                              className={`p-6 rounded-[24px] text-left transition-all border ${v.included ? accentBg + ' text-white border-transparent' : (isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-100')}`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${v.included ? 'text-white/60' : 'opacity-30'}`}>{v.verse}</span>
                                {v.included && <span className="material-icons text-xs">check_circle</span>}
                              </div>
                              <p className={`text-[15px] font-medium leading-relaxed ${v.included ? 'text-white' : 'opacity-80'}`}>{v.text}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-zinc-500/5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Your Heart</p>
                <button 
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all border ${isAnonymous ? (isDarkMode ? 'bg-zinc-800 border-zinc-700 text-brand-yellow' : 'bg-slate-100 border-slate-200 text-brand-purple') : 'bg-transparent border-zinc-200 text-zinc-400'}`}
                >
                  <span className="material-icons text-sm">{isAnonymous ? 'visibility_off' : 'visibility'}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{isAnonymous ? 'Anonymous' : 'Public'}</span>
                </button>
              </div>
              <textarea 
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="Write your heart here..." 
                className="w-full h-[50vh] bg-transparent outline-none resize-none placeholder:opacity-10 text-xl font-medium leading-relaxed" 
              />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .font-pretendard { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; } `}</style>
    </div>
  )
}
