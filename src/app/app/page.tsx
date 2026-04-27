"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'

const bibleVersions = [
  { name: '개역개정', code: 'nkrv', lang: 'ko', flag: '🇰🇷', local: true },
  { name: '현대인', code: 'klb', lang: 'ko', flag: '🇰🇷', local: true },
  { name: '중국어', code: 'cn', lang: 'zh', flag: '🇨🇳', local: true },
  { name: '스페인어', code: 'es', lang: 'es', flag: '🇪🇸', local: true },
  { name: 'ESV', code: 'ESV', lang: 'en', flag: '🇺🇸', local: false },
  { name: 'NIV', code: 'NIV', lang: 'en', flag: '🇺🇸', local: false },
  { name: 'KJV', code: 'KJV', lang: 'en', flag: '🇬🇧', local: false },
]

const KOREAN_ABBRS = ["창", "출", "레", "민", "신", "수", "삿", "룻", "삼상", "삼하", "왕상", "왕하", "대상", "대하", "스", "느", "에", "욥", "시", "잠", "전", "아", "사", "렘", "애", "겔", "단", "호", "욜", "암", "옵", "욘", "미", "나", "합", "습", "학", "슥", "말", "마", "막", "눅", "요", "행", "롬", "고전", "고후", "갈", "엡", "빌", "골", "살전", "살후", "딤전", "딤후", "딛", "몬", "히", "약", "벧전", "벧후", "요일", "요이", "요삼", "유", "계"];

const bibleBooks = [
  { id: 1, name: "창세기", eng: "Genesis" }, { id: 2, name: "출애굽기", eng: "Exodus" }, { id: 3, name: "레위기", eng: "Leviticus" }, { id: 4, name: "민수기", eng: "Numbers" }, { id: 5, name: "신명기", eng: "Deuteronomy" },
  { id: 6, name: "여호수아", eng: "Joshua" }, { id: 7, name: "사사기", eng: "Judges" }, { id: 8, name: "룻기", eng: "Ruth" }, { id: 9, name: "사무엘상", eng: "1 Samuel" }, { id: 10, name: "사무엘하", eng: "2 Samuel" },
  { id: 11, name: "열왕기상", eng: "1 Kings" }, { id: 12, name: "열왕기하", eng: "2 Kings" }, { id: 13, name: "역대상", eng: "1 Chronicles" }, { id: 14, name: "역대하", eng: "2 Chronicles" }, { id: 15, name: "에스라", eng: "Ezra" },
  { id: 16, name: "느헤미야", eng: "Nehemiah" }, { id: 17, name: "에스더", eng: "Esther" }, { id: 18, name: "욥기", eng: "Job" }, { id: 19, name: "시편", eng: "Psalms" }, { id: 20, name: "잠언", eng: "Proverbs" },
  { id: 21, name: "전도서", eng: "Ecclesiastes" }, { id: 22, name: "아가", eng: "Song of Solomon" }, { id: 23, name: "이사야", eng: "Isaiah" }, { id: 24, name: "예레미야", eng: "Jeremiah" }, { id: 25, name: "예레미야 애가", eng: "Lamentations" },
  { id: 26, name: "에스겔", eng: "Ezekiel" }, { id: 27, name: "다니엘", eng: "Daniel" }, { id: 28, name: "호세아", eng: "Hosea" }, { id: 29, name: "요엘", eng: "Joel" }, { id: 30, name: "아모스", eng: "Amos" },
  { id: 31, name: "오바댜", eng: "Obadiah" }, { id: 32, name: "요나", eng: "Jonah" }, { id: 33, name: "미가", eng: "Micah" }, { id: 34, name: "나훔", eng: "Nahum" }, { id: 35, name: "하박국", eng: "Habakkuk" },
  { id: 36, name: "스바냐", eng: "Zephaniah" }, { id: 37, name: "학개", eng: "Haggai" }, { id: 38, name: "스가랴", eng: "Zechariah" }, { id: 39, name: "말라기", eng: "Malachi" }, { id: 40, name: "마태복음", eng: "Matthew" },
  { id: 41, name: "마가복음", eng: "Mark" }, { id: 42, name: "누가복음", eng: "Luke" }, { id: 43, name: "요한복음", eng: "John" }, { id: 44, name: "사도행전", eng: "Acts" }, { id: 45, name: "로마서", eng: "Romans" },
  { id: 46, name: "고린도전서", eng: "1 Corinthians" }, { id: 47, name: "고린도후서", eng: "2 Corinthians" }, { id: 48, name: "갈라디아서", eng: "Galatians" }, { id: 49, name: "에베소서", eng: "Ephesians" }, { id: 50, name: "빌립보서", eng: "Philippians" },
  { id: 51, name: "골로새서", eng: "Colossians" }, { id: 52, name: "데살로니가전서", eng: "1 Thessalonians" }, { id: 53, name: "데살로니가후서", eng: "2 Thessalonians" }, { id: 54, name: "디모데전서", eng: "1 Timothy" }, { id: 55, name: "디모데후서", eng: "2 Timothy" },
  { id: 56, name: "디도서", eng: "Titus" }, { id: 57, name: "빌레몬서", eng: "Philemon" }, { id: 58, name: "히브리서", eng: "Hebrews" }, { id: 59, name: "야고보서", eng: "James" }, { id: 60, name: "베드로전서", eng: "1 Peter" },
  { id: 61, name: "베드로후서", eng: "2 Peter" }, { id: 62, name: "요한일서", eng: "1 John" }, { id: 63, name: "요한이서", eng: "2 John" }, { id: 64, name: "요한삼서", eng: "3 John" }, { id: 65, name: "유다서", eng: "Jude" }, { id: 66, name: "요한계시록", eng: "Revelation" }
]

export default function AppPage() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [version, setVersion] = useState(bibleVersions[0]) 
  const [book, setBook] = useState(bibleBooks[42]) 
  const [chapter, setChapter] = useState(1)
  const [verses, setVerses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [maxChapters, setMaxChapters] = useState(21)
  const [localBibles, setLocalBibles] = useState<Record<string, any>>({})

  // Study Features
  const [highlights, setHighlights] = useState<Record<string, any>>({})
  const [notes, setNotes] = useState<Record<string, any>>({})
  const [activeMenuVerse, setActiveMenuVerse] = useState<number | null>(null)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [currentNote, setCurrentNote] = useState('')
  const [selectedColor, setSelectedColor] = useState('#fffbbd')
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyTab, setHistoryTab] = useState<'time' | 'book'>('time')

  // Appearance
  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(1.85)
  const [verseGap, setVerseGap] = useState(30)
  const [openUI, setOpenUI] = useState<string | null>(null)
  const [pickerTab, setPickerTab] = useState<'book' | 'chapter' | 'version'>('book')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [bookSearch, setBookSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  const [isLoaded, setIsLoaded] = useState(false)
  const longPressTimer = useRef<any>(null)
  const isLongPressing = useRef(false)

  useEffect(() => {
    const savedVersion = localStorage.getItem('pf_bible_version')
    const savedBook = localStorage.getItem('pf_bible_book')
    const savedChapter = localStorage.getItem('pf_bible_chapter')
    const savedFontSize = localStorage.getItem('pf_bible_fontsize')
    const savedLineHeight = localStorage.getItem('pf_bible_lineheight')
    const savedVerseGap = localStorage.getItem('pf_bible_versegap')
    const savedHighlights = localStorage.getItem('pf_bible_highlights')
    const savedNotes = localStorage.getItem('pf_bible_notes')

    if (savedVersion) {
      const v = bibleVersions.find(v => v.code === savedVersion)
      if (v) setVersion(v)
    }
    if (savedBook) {
      const b = bibleBooks.find(b => b.id === parseInt(savedBook))
      if (b) setBook(b)
    }
    if (savedChapter) setChapter(parseInt(savedChapter))
    if (savedFontSize) setFontSize(parseInt(savedFontSize))
    if (savedLineHeight) setLineHeight(parseFloat(savedLineHeight))
    if (savedVerseGap) setVerseGap(parseInt(savedVerseGap))
    if (savedHighlights) {
      const h = JSON.parse(savedHighlights)
      // Migration for legacy string format
      Object.keys(h).forEach(k => {
        if (typeof h[k] === 'string') h[k] = { color: h[k], time: Date.now() }
      })
      setHighlights(h)
    }
    if (savedNotes) {
      const n = JSON.parse(savedNotes)
      // Migration for legacy string format
      Object.keys(n).forEach(k => {
        if (typeof n[k] === 'string') n[k] = { text: n[k], time: Date.now() }
      })
      setNotes(n)
    }
    
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('pf_bible_version', version.code)
    localStorage.setItem('pf_bible_book', book.id.toString())
    localStorage.setItem('pf_bible_chapter', chapter.toString())
    localStorage.setItem('pf_bible_fontsize', fontSize.toString())
    localStorage.setItem('pf_bible_lineheight', lineHeight.toString())
    localStorage.setItem('pf_bible_versegap', verseGap.toString())
    localStorage.setItem('pf_bible_highlights', JSON.stringify(highlights))
    localStorage.setItem('pf_bible_notes', JSON.stringify(notes))
  }, [version.code, book.id, chapter, fontSize, lineHeight, verseGap, highlights, notes, isLoaded])

  const cleanText = (text: string) => {
    return text.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim()
  }

  const fetchChapter = useCallback(async (vCode: string, bId: number, cNum: number, isLocal: boolean) => {
    setIsLoading(true)
    try {
      if (isLocal) {
        let bibleData = localBibles[vCode]
        if (!bibleData) {
          const res = await fetch(`/bible/bible_${vCode}.json`)
          bibleData = await res.json()
          setLocalBibles(prev => ({ ...prev, [vCode]: bibleData }))
        }

        const abbr = KOREAN_ABBRS[bId - 1]
        const result: any[] = []
        for (let i = 1; i <= 200; i++) {
          const key = `${abbr}${cNum}:${i}`
          if (bibleData[key]) {
            result.push({ verse: i, text: bibleData[key] })
          } else if (i > 1) {
            break
          }
        }
        setVerses(result)
      } else {
        const res = await fetch(`https://bolls.life/get-chapter/${vCode}/${bId}/${cNum}/`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setVerses(data.map(v => ({ ...v, text: cleanText(v.text) })))
        }
      }
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }, [localBibles])

  const fetchBookInfo = useCallback(async (vCode: string, bId: number, isLocal: boolean) => {
    try {
      if (isLocal) {
        let bibleData = localBibles[vCode]
        if (!bibleData) {
          const res = await fetch(`/bible/bible_${vCode}.json`)
          bibleData = await res.json()
          setLocalBibles(prev => ({ ...prev, [vCode]: bibleData }))
        }
        
        const abbr = KOREAN_ABBRS[bId - 1]
        let maxC = 0
        const keys = Object.keys(bibleData)
        keys.forEach(k => {
          if (k.startsWith(abbr)) {
            const match = k.match(/:/)
            if (match) {
              const cPart = k.substring(abbr.length, match.index)
              const c = parseInt(cPart)
              if (c > maxC) maxC = c
            }
          }
        })
        return maxC
      } else {
        const res = await fetch(`https://bolls.life/get-books/${vCode}/`)
        const data = await res.json()
        const currentBook = data.find((b: any) => b.bookid === bId)
        if (currentBook) return currentBook.chapters
      }
    } catch (err) { console.error(err) }
    return 0
  }, [localBibles])


  const performGlobalSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) return
    try {
      if (version.local) {
        let bibleData = localBibles[version.code]
        if (!bibleData) {
          const res = await fetch(`/bible/bible_${version.code}.json`)
          bibleData = await res.json()
          setLocalBibles(prev => ({ ...prev, [version.code]: bibleData }))
        }
        
        const results: any[] = []
        const keys = Object.keys(bibleData)
        for (const key of keys) {
          const text = bibleData[key]
          if (text.includes(query)) {
            const match = key.match(/^([^\d]+)(\d+):(\d+)$/)
            if (match) {
              const [_, abbr, c, v] = match
              const bIndex = KOREAN_ABBRS.indexOf(abbr)
              if (bIndex !== -1) {
                results.push({
                  book: bIndex + 1,
                  chapter: parseInt(c),
                  verse: parseInt(v),
                  text: text
                })
              }
            }
          }
          if (results.length >= 50) break
        }
        setSearchResults(results)
      } else {
        const res = await fetch(`https://bolls.life/search/${version.code}/?search=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (Array.isArray(data)) setSearchResults(data.map(v => ({ ...v, text: cleanText(v.text) })))
      }
    } catch (err) { console.error(err) }
  }, [version, localBibles])


  const goToNextChapter = useCallback(async () => {
    if (chapter < maxChapters) {
      setChapter(c => c + 1)
    } else {
      const currentIdx = bibleBooks.findIndex(b => b.id === book.id)
      if (currentIdx < bibleBooks.length - 1) {
        setBook(bibleBooks[currentIdx + 1])
        setChapter(1)
      }
    }
  }, [chapter, maxChapters, book.id])

  const goToPrevChapter = useCallback(async () => {
    if (chapter > 1) {
      setChapter(c => c - 1)
    } else {
      const currentIdx = bibleBooks.findIndex(b => b.id === book.id)
      if (currentIdx > 0) {
        const prevBook = bibleBooks[currentIdx - 1]
        const prevMax = await fetchBookInfo(version.code, prevBook.id, version.local || false)
        setBook(prevBook)
        setChapter(prevMax || 1)
      }
    }
  }, [chapter, book.id, version.code, fetchBookInfo])

  useEffect(() => { 
    async function initBook() {
      const m = await fetchBookInfo(version.code, book.id, version.local || false)
      setMaxChapters(m)
    }
    initBook()
  }, [version.code, book.id, fetchBookInfo, version.local])

  useEffect(() => { 
    fetchChapter(version.code, book.id, chapter, version.local || false)
    const content = document.getElementById('bible-content')
    if (content) content.scrollTo({ top: 0, behavior: 'smooth' })
  }, [version.code, book.id, chapter, fetchChapter, version.local])


  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  
  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.targetTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    if (Math.abs(diff) > 100) { 
      if (diff > 0) goToNextChapter()
      else goToPrevChapter()
    }
    setTouchStartX(null)
  }

  // Pointer Interaction (Long Press)
  const handlePointerDown = (num: number, e: React.PointerEvent) => {
    isLongPressing.current = false
    longPressTimer.current = setTimeout(() => {
      isLongPressing.current = true
      setActiveMenuVerse(num)
      setIsPaletteOpen(false)
      if (window.navigator.vibrate) window.navigator.vibrate(50)
    }, 500)
  }

  const handlePointerUp = () => {
    clearTimeout(longPressTimer.current)
  }

  // Remove highlight logic
  const removeHighlight = (verseNum: number) => {
    const key = `${book.id}_${chapter}_${verseNum}`
    setHighlights(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    setActiveMenuVerse(null)
  }

  const toggleHighlight = (num: number, color: string, verseText?: string) => {
    const key = `${book.id}_${chapter}_${num}`
    setHighlights(prev => {
      const next = { ...prev }
      if (next[key]?.color === color) {
        delete next[key]
      } else {
        next[key] = { color, time: Date.now(), verseText: verseText || next[key]?.verseText }
      }
      return next
    })
    setActiveMenuVerse(null)
    setIsPaletteOpen(false)
  }

  const saveNote = (verseText?: string) => {
    if (!activeMenuVerse && !isNoteModalOpen) return
    const vNum = activeMenuVerse || (window as any)._noteVerse
    const key = `${book.id}_${chapter}_${vNum}`
    setNotes(prev => ({
      ...prev,
      [key]: { 
        text: currentNote, 
        time: Date.now(), 
        verseText: verseText || prev[key]?.verseText || (window as any)._noteVerseText 
      }
    }))
    setIsNoteModalOpen(false)
  }

  const openNoteModal = (num: number, verseText: string) => {
    const key = `${book.id}_${chapter}_${num}`
    setActiveMenuVerse(null)
    setIsPaletteOpen(false)
    setCurrentNote(notes[key]?.text || '')
    setIsNoteModalOpen(true)
    ;(window as any)._noteVerse = num
    ;(window as any)._noteVerseText = verseText
  }

  const isEn = version.lang === 'en'

  const filteredBooks = useMemo(() => {
    return bibleBooks.filter(b => b.name.includes(bookSearch) || b.eng.toLowerCase().includes(bookSearch.toLowerCase()))
  }, [bookSearch])

  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'
  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-zinc-100' : 'text-zinc-900'

  const hasHistory = Object.keys(highlights).some(k => highlights[k] && highlights[k] !== '') || Object.keys(notes).length > 0
  const historyItems = Object.keys(highlights).filter(k => highlights[k] && highlights[k] !== '').concat(Object.keys(notes)).filter((v, i, a) => a.indexOf(v) === i)

  return (
    <div className={`h-full flex flex-col transition-colors duration-500 ${bgColor} ${textColor}`}>
      <header className={`shrink-0 h-20 px-6 flex items-center justify-between z-40 border-b ${isDarkMode ? 'bg-[#050505]/80 border-zinc-900' : 'bg-white/80 border-slate-50'} backdrop-blur-sm`}>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpenUI(openUI === 'settings' ? null : 'settings')} className={`w-10 h-10 flex items-center justify-center transition-all ${openUI === 'settings' ? accentColor : 'text-slate-300'}`}>
            <span className="material-icons">tune</span>
          </button>
        </div>

        <button onClick={() => { setOpenUI('picker'); setPickerTab('book'); }} className="flex items-center gap-2 active:scale-95 transition-all">
          <span className="font-plus-jakarta font-black text-[16px] tracking-tight">
            {isEn ? book.eng : book.name}
          </span>
          <span className={`w-1 h-1 rounded-full ${accentBg}`}></span>
          <span className={`font-plus-jakarta font-black text-[16px] tracking-tight ${accentColor}`}>{chapter}{isEn ? ' Ch' : '장'}</span>
          <span className={`font-plus-jakarta font-black text-[10px] opacity-30 ml-1 uppercase`}>{version.name}</span>
          <span className={`material-icons ${isDarkMode ? 'text-brand-yellow/20' : 'text-brand-purple/20'} text-lg`}>expand_more</span>
        </button>


        <button onClick={() => setOpenUI(openUI === 'search' ? null : 'search')} className={`w-10 h-10 flex items-center justify-center transition-all ${openUI === 'search' ? accentColor : 'text-slate-300'}`}>
          <span className="material-icons">search</span>
        </button>
      </header>

      <div id="bible-content" className="flex-1 overflow-y-auto px-10 pt-10 pb-40 no-scrollbar outline-none select-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {isLoading ? (
          <div className="flex items-center justify-center py-40"><div className={`w-2 h-2 rounded-full ${accentBg} animate-ping`}></div></div>
        ) : (
          <div className="flex flex-col" style={{ gap: `${verseGap}px` }}>
            {verses.map((v: any) => {
              const key = `${book.id}_${chapter}_${v.verse}`
              const highlightColor = highlights[key]
              const noteText = notes[key]
              
              return (
                  <div 
                    id={`verse-${v.verse}`}
                    key={v.verse} 
                    className={`flex flex-col gap-2 group relative transition-all ${activeMenuVerse === v.verse ? 'z-[500] opacity-100' : 'z-0 active:opacity-70'}`}
                    onPointerDown={(e) => handlePointerDown(v.verse, e)}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => {
                      if (highlightColor && !isLongPressing.current) {
                        setActiveMenuVerse(v.verse);
                      }
                    }}
                  >
                  <span className={`font-space-grotesk font-black text-[10px] tracking-widest ${isDarkMode ? 'text-brand-yellow/50' : 'text-brand-purple/30'}`}>{v.verse}</span>
                  <div className="relative inline">
                    {highlightColor && (
                      <div 
                        className="absolute inset-x-[-4px] inset-y-0 opacity-30 z-0 rounded-sm" 
                        style={{ backgroundColor: highlightColor.color }}
                      />
                    )}
                    <p style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }} className="font-medium tracking-tight relative z-10">{v.text}</p>
                    {noteText && (
                      <div className={`mt-3 p-4 rounded-2xl border-l-4 ${isDarkMode ? 'bg-zinc-900 border-brand-yellow' : 'bg-slate-50 border-brand-purple'} relative z-10 shadow-sm animate-in slide-in-from-left-2 duration-300`}>
                        <p className="text-xs font-bold italic opacity-60">"{noteText.text}"</p>
                      </div>
                    )}
                  </div>

                  {/* Context Menu (Floating Menu) - Exact Match to Reference */}
                  {activeMenuVerse === v.verse && (
                    <div className={`absolute ${v.verse <= 2 ? 'top-full mt-4' : '-top-24'} left-1/2 -translate-x-1/2 bg-white rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.25)] z-[300] animate-in zoom-in-95 duration-200 border border-slate-100/50 overflow-visible`}>
                      {highlightColor ? (
                        /* Case 1: Already Highlighted (Edit Menu) */
                        <div className="flex items-center gap-6 px-6 py-2.5 min-w-max">
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeHighlight(v.verse); }}
                            className="text-slate-800 font-black text-[13px] active:scale-90 transition-transform"
                          >
                            Delete
                          </button>
                          
                          <div className="relative flex items-center justify-center min-w-[44px]">
                            {isPaletteOpen ? (
                              <div className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); toggleHighlight(v.verse, '#fffbbd', v.text); }}
                                  className="w-8 h-8 rounded-full border-2 border-white shadow-md active:scale-90 transition-transform bg-[#fffbbd]"
                                />
                                <button 
                                  onClick={(e) => { e.stopPropagation(); toggleHighlight(v.verse, '#9a78b4', v.text); }}
                                  className="w-8 h-8 rounded-full border-2 border-white shadow-md active:scale-90 transition-transform bg-[#9a78b4]"
                                />
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setIsPaletteOpen(false); }}
                                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center active:scale-90 transition-transform"
                                >
                                  <span className="material-icons text-slate-400 text-sm">close</span>
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setIsPaletteOpen(true); }}
                                className="relative flex items-center justify-center active:scale-95 transition-transform"
                              >
                                <div 
                                  className="w-8 h-8 rounded-full border-[2px] border-white shadow-lg shrink-0"
                                  style={{ backgroundColor: highlightColor.color }}
                                ></div>
                                <div 
                                  className="absolute w-[44px] h-[44px] rounded-full border-2 opacity-30 animate-pulse"
                                  style={{ borderColor: highlightColor.color }}
                                ></div>
                              </button>
                            )}
                          </div>

                          <button 
                            onClick={(e) => { e.stopPropagation(); openNoteModal(v.verse, v.text); }}
                            className="text-slate-800 font-black text-[13px] active:scale-90 transition-transform"
                          >
                            Note
                          </button>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenuVerse(null); }}
                            className="text-slate-800 font-black text-[13px] active:scale-90 transition-transform"
                          >
                            Share
                          </button>
                        </div>
                      ) : (
                        /* Case 2: New Highlight (Original Menu) */
                        <div className="flex items-center gap-2 px-3 py-2 min-w-max">
                          {/* Close Button - Far Left */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenuVerse(null); }}
                            className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center shrink-0 active:scale-90 transition-transform shadow-md"
                          >
                            <span className="material-icons text-white text-[16px]">close</span>
                          </button>

                          {/* Direct Color Choices */}
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedColor('#fffbbd'); toggleHighlight(v.verse, '#fffbbd', v.text); }} 
                              className={`w-8 h-8 rounded-full bg-[#fffbbd] border-2 border-white shadow-sm active:scale-125 transition-transform ${selectedColor === '#fffbbd' ? 'ring-2 ring-brand-yellow/50 ring-offset-2' : ''}`}
                            ></button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedColor('#9a78b4'); toggleHighlight(v.verse, '#9a78b4', v.text); }} 
                              className={`w-8 h-8 rounded-full bg-[#9a78b4] border-2 border-white shadow-sm active:scale-125 transition-transform ${selectedColor === '#9a78b4' ? 'ring-2 ring-brand-purple/50 ring-offset-2' : ''}`}
                            ></button>
                          </div>

                          <div className="w-px h-5 bg-slate-100 mx-0.5"></div>

                          {/* Actions */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); openNoteModal(v.verse, v.text); }} 
                            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-brand-purple active:scale-90 transition-all"
                          >
                            <span className="material-icons text-[22px]">sticky_note_2</span>
                          </button>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation();
                              navigator.clipboard.writeText(v.text); 
                              setActiveMenuVerse(null); 
                            }} 
                            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-brand-purple active:scale-90 transition-all"
                          >
                            <span className="material-icons text-[22px]">content_copy</span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenuVerse(null); }} 
                            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-brand-purple active:scale-90 transition-all"
                          >
                            <span className="material-icons text-[22px]">share</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        {!isLoading && verses.length > 0 && (
          <div className="flex justify-between items-center mt-20 opacity-20 hover:opacity-100 transition-opacity">
            <button onClick={goToPrevChapter} className={`text-slate-400 hover:${accentColor} transition-all`}><span className="material-icons text-4xl">chevron_left</span></button>
            <button onClick={goToNextChapter} className={`text-slate-400 hover:${accentColor} transition-all`}><span className="material-icons text-4xl">chevron_right</span></button>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {openUI === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/5" onClick={() => setOpenUI(null)}>
          <div className={`absolute bottom-28 left-6 right-6 p-8 rounded-[40px] shadow-2xl border transition-all animate-in slide-in-from-bottom-4 duration-500 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-50'}`} onClick={e => e.stopPropagation()}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button onClick={() => { setOpenUI(null); setIsHistoryOpen(true); setHistoryTab('time'); }} className={`h-14 rounded-2xl border flex items-center justify-center gap-2 font-black text-[13px] tracking-tight transition-all active:scale-95 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-100'}`}>
                  <span className="material-icons text-lg">history_edu</span>
                  HIGHLIGHTS
                </button>
                <button onClick={() => { setOpenUI(null); setIsHistoryOpen(true); setHistoryTab('time'); }} className={`h-14 rounded-2xl border flex items-center justify-center gap-2 font-black text-[13px] tracking-tight transition-all active:scale-95 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-100'}`}>
                  <span className="material-icons text-lg">sticky_note_2</span>
                  NOTES
                </button>
              </div>

              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">Night Mode</span><button onClick={toggleTheme} className={`w-12 h-6 rounded-full relative transition-all ${isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div></button></div>
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">Text Size</span><div className="flex items-center gap-6"><button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className={`${accentColor} font-black`}>-</button><span className="font-space-grotesk font-black text-sm">{fontSize}</span><button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className={`${accentColor} font-black`}>+</button></div></div>
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">Line Height</span><div className="flex items-center gap-6"><button onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))} className={`${accentColor} font-black`}>-</button><span className="font-space-grotesk font-black text-sm">{lineHeight.toFixed(1)}</span><button onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))} className={`${accentColor} font-black`}>+</button></div></div>
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">Verse Spacing</span><div className="flex items-center gap-6"><button onClick={() => setVerseGap(Math.max(0, verseGap - 5))} className={`${accentColor} font-black`}>-</button><span className="font-space-grotesk font-black text-sm">{verseGap}</span><button onClick={() => setVerseGap(Math.min(100, verseGap + 5))} className={`${accentColor} font-black`}>+</button></div></div>
            </div>
          </div>
        </div>
      )}

      {/* Search Panel */}
      {openUI === 'search' && (
        <div className={`fixed inset-0 z-50 flex flex-col transition-all ${bgColor} ${textColor}`}>
          <div className="px-8 pt-16 pb-8 flex flex-col gap-8">
            <button onClick={() => setOpenUI(null)} className="self-start text-zinc-600 hover:text-white transition-colors"><span className="material-icons text-3xl">arrow_back</span></button>
            <input type="text" placeholder="Search words..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); performGlobalSearch(e.target.value); }} className={`w-full py-2 text-2xl font-black placeholder:opacity-10 bg-transparent focus:outline-none`} autoFocus />
          </div>
          <div className="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar">
            <div className="flex flex-col gap-10">
              {searchResults.map((res: any, idx) => (
                <button key={idx} onClick={() => { const b = bibleBooks.find(b => b.id === res.book); if (b) { setBook(b); setChapter(res.chapter); setOpenUI(null); } }} className="text-left group active:opacity-50">
                  <p className={`font-black text-[9px] ${accentColor} uppercase tracking-[0.3em] mb-3`}>{isEn ? bibleBooks.find(b => b.id === res.book)?.eng : bibleBooks.find(b => b.id === res.book)?.name} {res.chapter}:{res.verse}</p>
                  <p className="text-[16px] font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{res.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Picker Panel */}
      {openUI === 'picker' && (
        <div className={`fixed inset-0 z-[100] transition-all duration-300 flex flex-col animate-in fade-in ${bgColor} ${textColor}`}>
          <div className="px-6 pt-16 pb-6 flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <button onClick={() => setOpenUI(null)} className="active:scale-90 transition-transform"><span className="material-icons text-3xl">arrow_back</span></button>
              <h2 className="text-[20px] font-bold">참조 구절</h2>
            </div>
            <div className={`flex gap-4 border-b ${isDarkMode ? 'border-zinc-800' : 'border-slate-50'}`}>
              {['book', 'chapter', 'version'].map((tab) => (
                <button key={tab} onClick={() => setPickerTab(tab as any)} className={`pb-3 text-sm font-bold tracking-tight transition-all border-b-2 uppercase ${pickerTab === tab ? `border-current ${accentColor}` : 'text-zinc-500 border-transparent'}`}>{tab}</button>
              ))}
            </div>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-400 transition-colors">search</span>
              <input type="text" placeholder="검색" value={bookSearch} onChange={(e) => setBookSearch(e.target.value)} className={`w-full ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'} border-none rounded-full py-4 pl-12 pr-6 text-base font-medium placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-all`} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
            {pickerTab === 'book' && (
              <div className="flex flex-col">
                {filteredBooks.map((b) => (
                  <button key={b.id} onClick={() => { setBook(b); setPickerTab('chapter'); setBookSearch(''); }} className="flex items-center justify-between py-5 group active:opacity-50 transition-all">
                    <span className={`text-[17px] font-medium tracking-tight ${book.id === b.id ? accentColor + ' font-bold' : 'text-zinc-500'}`}>{isEn ? b.eng : b.name}</span>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-800' : 'text-slate-100'}`}>{isEn ? b.name : b.eng}</span>
                  </button>
                ))}
              </div>
            )}
            {pickerTab === 'chapter' && (
              <div className="flex flex-col gap-10">
                <h3 className="text-xl font-bold">{isEn ? book.eng : book.name}</h3>
                <div className="grid grid-cols-5 gap-3">
                  <button className={`${isDarkMode ? 'bg-zinc-900 text-zinc-600' : 'bg-slate-50 text-slate-300'} aspect-square rounded-lg flex items-center justify-center font-bold text-[14px]`}>Intro</button>
                  {Array.from({ length: maxChapters }, (_, i) => i + 1).map(c => (
                    <button key={c} onClick={() => { setChapter(c); setOpenUI(null); }} className={`aspect-square rounded-lg flex items-center justify-center font-bold text-[17px] transition-all ${chapter === c ? (isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white') : (isDarkMode ? 'bg-zinc-900 text-zinc-500' : 'bg-slate-50 text-slate-400')}`}>{c}</button>
                  ))}
                </div>
              </div>
            )}
            {pickerTab === 'version' && (
              <div className="flex flex-col gap-2">
                {bibleVersions.map((v) => (
                  <button key={v.code} onClick={() => { setVersion(v); setPickerTab('book'); }} className={`flex items-center justify-between py-6 px-6 rounded-2xl transition-all ${version.code === v.code ? (isDarkMode ? 'bg-zinc-900 text-brand-yellow border border-brand-yellow/20' : 'bg-slate-50 text-brand-purple border border-brand-purple/20') : 'text-zinc-500 hover:opacity-70'}`}>
                    <span className="text-lg font-bold tracking-tight">{v.name} ({v.flag})</span>
                    {version.code === v.code && <span className="material-icons text-inherit">check_circle</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Side-Sheet */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)}></div>
          <div className={`relative w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-500 ${isDarkMode ? 'bg-[#151515]' : 'bg-[#fcfcfc]'}`}>
            <div className={`shrink-0 h-20 px-8 flex items-center justify-between border-b ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
              <button onClick={() => setIsHistoryOpen(false)} className="material-icons text-slate-400">close</button>
              <h2 className="font-plus-jakarta font-black text-lg tracking-tight">Study History</h2>
              <div className="w-6"></div>
            </div>

            <div className={`flex h-14 border-b ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
              <button 
                onClick={() => setHistoryTab('time')}
                className={`flex-1 font-bold text-[13px] transition-all relative ${historyTab === 'time' ? accentColor : 'text-slate-400'}`}
              >
                By Time
                {historyTab === 'time' && <div className={`absolute bottom-0 left-0 right-0 h-1 ${accentBg}`}></div>}
              </button>
              <button 
                onClick={() => setHistoryTab('book')}
                className={`flex-1 font-bold text-[13px] transition-all relative ${historyTab === 'book' ? accentColor : 'text-slate-400'}`}
              >
                By Book
                {historyTab === 'book' && <div className={`absolute bottom-0 left-0 right-0 h-1 ${accentBg}`}></div>}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
              {(() => {
                const hItems = [
                  ...Object.entries(highlights).map(([key, val]) => ({ key, type: 'highlight', ...val })),
                  ...Object.entries(notes).map(([key, val]) => ({ key, type: 'note', ...val }))
                ].filter((item, index, self) => 
                  index === self.findIndex((t) => t.key === item.key)
                );

                if (historyTab === 'time') {
                  hItems.sort((a, b) => (b.time || 0) - (a.time || 0));
                } else {
                  hItems.sort((a, b) => {
                    const [aB, aC, aV] = a.key.split('_').map(Number);
                    const [bB, bC, bV] = b.key.split('_').map(Number);
                    if (aB !== bB) return aB - bB;
                    if (aC !== bC) return aC - bC;
                    return aV - bV;
                  });
                }

                if (hItems.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4">
                      <span className="material-icons text-6xl">history_edu</span>
                      <p className="font-bold">No history yet</p>
                    </div>
                  );
                }

                return hItems.map((item) => {
                  const [bId, cNum, vNum] = item.key.split('_').map(Number);
                  const b = bibleBooks.find(x => x.id === bId);
                  const date = new Date(item.time || Date.now());
                  const dateStr = date.toLocaleString('ko-KR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', weekday: 'short'
                  });

                  return (
                    <div 
                      key={item.key} 
                      onClick={() => {
                        if (b) setBook(b);
                        setChapter(cNum);
                        setIsHistoryOpen(false);
                        setTimeout(() => {
                          const el = document.getElementById(`verse-${vNum}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 500);
                      }}
                      className={`p-6 border-b transition-colors cursor-pointer ${isDarkMode ? 'border-zinc-800 hover:bg-zinc-900/50' : 'border-slate-50 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-black text-[13px] ${accentColor}`}>
                          {isEn ? b?.eng : b?.name} {cNum}:{vNum}
                        </span>
                        <span className="text-[11px] opacity-40 font-medium tracking-tight">{dateStr}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-4">
                          {item.color && (
                            <div className="w-1.5 h-full shrink-0 rounded-full" style={{ backgroundColor: item.color }}></div>
                          )}
                          <p className={`text-sm font-medium leading-relaxed opacity-80 line-clamp-3 ${isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`}>
                            {item.verseText || 'Verse content not available'}
                          </p>
                        </div>
                        {item.type === 'note' && (
                          <div className={`mt-2 p-3 rounded-xl border-l-2 ${isDarkMode ? 'bg-zinc-900 border-brand-yellow' : 'bg-slate-50 border-brand-purple'}`}>
                            <p className="text-[12px] font-bold italic opacity-60">"{item.text}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsNoteModalOpen(false)}></div>
          <div className={`relative w-full max-w-lg rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-[#151515]' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-plus-jakarta font-black text-xl tracking-tight">Verse Note</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="material-icons text-slate-400">close</button>
            </div>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="What did God speak to you today?"
              className={`w-full h-48 p-6 rounded-2xl border-2 focus:ring-4 outline-none transition-all font-medium leading-relaxed resize-none ${isDarkMode ? 'bg-zinc-900 border-zinc-800 focus:border-brand-yellow focus:ring-brand-yellow/10' : 'bg-slate-50 border-slate-100 focus:border-brand-purple focus:ring-brand-purple/5'}`}
              autoFocus
            />
            <button 
              onClick={() => saveNote()}
              className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all ${isDarkMode ? 'bg-brand-yellow text-black shadow-brand-yellow/20' : 'bg-brand-purple text-white shadow-brand-purple/20'}`}
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
