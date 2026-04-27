"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'

const bibleVersions = [
  { name: '개역한글', code: 'KRV' },
  { name: '개역개정', code: 'NKP' },
  { name: 'ESV', code: 'ESV' },
  { name: 'NIV', code: 'NIV' },
  { name: 'KJV', code: 'KJV' },
]

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
  const [version, setVersion] = useState(bibleVersions[0])
  const [book, setBook] = useState(bibleBooks[42])
  const [chapter, setChapter] = useState(1)
  const [verses, setVerses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [maxChapters, setMaxChapters] = useState(21)

  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(1.85)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [openUI, setOpenUI] = useState<string | null>(null) // 'picker', 'settings', 'search'
  const [pickerTab, setPickerTab] = useState<'book' | 'chapter'>('book')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [bookSearch, setBookSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isGlobalSearching, setIsGlobalSearching] = useState(false)

  // Clean HTML Tags Engine
  const cleanText = (text: string) => {
    return text.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim()
  }

  const fetchChapter = useCallback(async (vCode: string, bId: number, cNum: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`https://bolls.life/get-chapter/${vCode}/${bId}/${cNum}/`)
      const data = await res.json()
      if (Array.isArray(data)) {
        const cleaned = data.map(v => ({ ...v, text: cleanText(v.text) }))
        setVerses(cleaned)
      }
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }, [])

  const fetchBookInfo = useCallback(async (vCode: string, bId: number) => {
    try {
      const res = await fetch(`https://bolls.life/get-books/${vCode}/`)
      const data = await res.json()
      const currentBook = data.find((b: any) => b.bookid === bId)
      if (currentBook) setMaxChapters(currentBook.chapters)
    } catch (err) { console.error(err) }
  }, [])

  const performGlobalSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) return
    setIsGlobalSearching(true)
    try {
      const res = await fetch(`https://bolls.life/search/${version.code}/?search=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setSearchResults(data.map(v => ({ ...v, text: cleanText(v.text) })))
      }
    } catch (err) { console.error(err) }
    finally { setIsGlobalSearching(false) }
  }, [version.code])

  useEffect(() => { fetchBookInfo(version.code, book.id) }, [version.code, book.id, fetchBookInfo])
  useEffect(() => { 
    fetchChapter(version.code, book.id, chapter)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [version.code, book.id, chapter, fetchChapter])

  const filteredBooks = useMemo(() => {
    return bibleBooks.filter(b => b.name.includes(bookSearch) || b.eng.toLowerCase().includes(bookSearch.toLowerCase()))
  }, [bookSearch])

  return (
    <div className={`min-h-screen flex flex-col pt-0 pb-32 transition-all duration-700 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-brand-dark'}`}>
      
      {/* Sticky Header */}
      <div className={`sticky top-0 z-50 px-6 py-5 flex flex-col gap-4 border-b transition-all ${isDarkMode ? 'bg-zinc-950/80 border-zinc-900' : 'bg-white/80 border-slate-50'} backdrop-blur-xl`}>
        <div className="flex items-center justify-between gap-1">
          <button 
            onClick={() => setOpenUI(openUI === 'settings' ? null : 'settings')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${openUI === 'settings' ? 'bg-brand-purple text-white rotate-90' : 'text-slate-400 hover:bg-slate-100/50'}`}
          >
            <span className="material-symbols-outlined text-[20px] font-light">tune</span>
          </button>

          <button 
            onClick={() => { setOpenUI('picker'); setPickerTab('book'); }}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100/50 dark:bg-zinc-900/50 p-2 rounded-full px-4 active:scale-95 transition-transform"
          >
            <span className="font-plus-jakarta font-black text-[15px] text-brand-purple">{book.name}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div>
            <span className="font-plus-jakarta font-black text-[15px] text-brand-dark dark:text-white">{chapter}장</span>
            <span className="material-symbols-outlined text-sm opacity-30">expand_more</span>
          </button>

          <select 
            value={version.code}
            onChange={(e) => {
              const selected = bibleVersions.find(v => v.code === e.target.value)
              if (selected) setVersion(selected)
            }}
            className={`text-[10px] font-black px-3 py-2 rounded-lg focus:outline-none cursor-pointer uppercase tracking-widest ${isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-50 text-slate-400'}`}
          >
            {bibleVersions.map(v => <option key={v.code} value={v.code}>{v.name}</option>)}
          </select>

          <button 
            onClick={() => setOpenUI(openUI === 'search' ? null : 'search')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${openUI === 'search' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:bg-slate-100/50'}`}
          >
            <span className="material-symbols-outlined text-[20px] font-light">search</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {openUI === 'settings' && (
        <div className={`fixed inset-0 z-[60] flex items-end justify-center px-4 pb-12 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300`} onClick={() => setOpenUI(null)}>
          <div className={`w-full max-w-md p-8 rounded-[40px] flex flex-col gap-8 shadow-2xl ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-black uppercase tracking-widest opacity-40">Display Mode</span>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`px-6 py-2 rounded-full font-black text-xs transition-all ${isDarkMode ? 'bg-brand-purple text-white' : 'bg-slate-100 text-brand-dark'}`}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-black uppercase tracking-widest opacity-40">Text Size</span>
              <div className="flex items-center gap-6">
                <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-brand-purple font-black">-</button>
                <span className="font-space-grotesk font-black text-xl">{fontSize}</span>
                <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-brand-purple font-black">+</button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-black uppercase tracking-widest opacity-40">Line Spacing</span>
              <div className="flex items-center gap-6">
                <button onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-brand-purple font-black">-</button>
                <span className="font-space-grotesk font-black text-xl">{lineHeight.toFixed(1)}</span>
                <button onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-brand-purple font-black">+</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Panel */}
      {openUI === 'search' && (
        <div className={`fixed inset-0 z-[60] flex flex-col transition-all ${isDarkMode ? 'bg-zinc-950' : 'bg-white'}`}>
          <div className="px-6 py-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setOpenUI(null)} className="w-10 h-10 flex items-center justify-center"><span className="material-symbols-outlined">arrow_back</span></button>
              <h2 className="font-plus-jakarta font-black text-2xl tracking-tighter">Global Search</h2>
            </div>
            <div className="relative">
              <input 
                type="text"
                placeholder="Type to search word..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); performGlobalSearch(e.target.value); }}
                className={`w-full py-4 px-12 rounded-2xl font-bold text-sm focus:outline-none focus:ring-4 transition-all ${isDarkMode ? 'bg-zinc-900 focus:ring-brand-purple/10' : 'bg-slate-100 focus:ring-brand-purple/10'}`}
                autoFocus
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-30">search</span>
              {isGlobalSearching && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin"></div>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-12">
            <div className="flex flex-col gap-3">
              {searchResults.map((res: any, idx) => (
                <button key={idx} onClick={() => { 
                  const b = bibleBooks.find(b => b.id === res.book); 
                  if (b) { setBook(b); setChapter(res.chapter); setOpenUI(null); setSearchQuery(''); setSearchResults([]); }
                }} className={`text-left p-6 rounded-3xl transition-all active:scale-[0.98] ${isDarkMode ? 'bg-zinc-900/50 hover:bg-zinc-900' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <p className="font-black text-[10px] text-brand-purple uppercase tracking-[0.2em] mb-2">{bibleBooks.find(b => b.id === res.book)?.name} {res.chapter}:{res.verse}</p>
                  <p className="text-[15px] font-medium leading-relaxed opacity-80">{res.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Book & Chapter Picker Overlay (Inspired by Screenshots) */}
      {openUI === 'picker' && (
        <div className={`fixed inset-0 z-[70] flex flex-col transition-all ${isDarkMode ? 'bg-zinc-950' : 'bg-white'} animate-in slide-in-from-bottom duration-500`}>
          <div className="px-6 pt-12 pb-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setOpenUI(null)} className="w-10 h-10 flex items-center justify-center text-brand-dark dark:text-white"><span className="material-symbols-outlined text-3xl">arrow_back</span></button>
                <h2 className="font-plus-jakarta font-black text-2xl tracking-tighter">참조 구절</h2>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined opacity-60">translate</span>
                <span className="material-symbols-outlined opacity-60">history</span>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text"
                placeholder="검색"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className={`w-full py-4 px-12 rounded-2xl font-bold text-sm focus:outline-none transition-all ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-100'}`}
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-30">search</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
            {pickerTab === 'book' ? (
              <div className="flex flex-col gap-1">
                {filteredBooks.map((b) => (
                  <button key={b.id} onClick={() => { setBook(b); setPickerTab('chapter'); }} className="flex justify-between items-center py-6 px-4 rounded-2xl active:bg-slate-50 dark:active:bg-zinc-900 transition-colors group">
                    <div className="flex flex-col text-left">
                      <span className="font-plus-jakarta font-black text-[18px] group-active:text-brand-purple">{b.eng}</span>
                      <span className="text-[12px] font-bold text-slate-400 group-active:text-brand-purple/60">{b.name}</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">volume_up</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <h3 className="font-plus-jakarta font-black text-2xl text-brand-purple">{book.eng}</h3>
                  <span className="text-slate-400 font-bold">{book.name}</span>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  <button onClick={() => setPickerTab('book')} className="aspect-square rounded-2xl bg-brand-purple text-white font-black text-sm flex items-center justify-center active:scale-90 transition-transform">Intro</button>
                  {Array.from({ length: maxChapters }, (_, i) => i + 1).map(c => (
                    <button key={c} onClick={() => { setChapter(c); setOpenUI(null); }} className={`aspect-square rounded-2xl font-black text-sm flex items-center justify-center active:scale-90 transition-transform ${chapter === c ? 'bg-brand-yellow text-brand-dark shadow-lg shadow-brand-yellow/30' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Scripture View */}
      <main className="px-8 mt-12 flex flex-col gap-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className={`w-10 h-10 border-[3px] border-t-brand-purple rounded-full animate-spin ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}></div>
          </div>
        ) : (
          verses.map((v: any) => (
            <div key={v.verse} className="flex items-start gap-6 group">
              <span className={`font-space-grotesk font-black text-[11px] mt-2.5 shrink-0 w-6 text-center transition-colors ${isDarkMode ? 'text-zinc-800' : 'text-slate-200'}`}>
                {v.verse}
              </span>
              <p 
                style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
                className="font-medium tracking-tight"
              >
                {v.text}
              </p>
            </div>
          ))
        )}
        
        {!isLoading && verses.length > 0 && (
          <div className="flex justify-between items-center mt-20 pt-10 border-t border-slate-100 dark:border-zinc-900">
            <button onClick={() => setChapter(c => Math.max(1, c - 1))} className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-300 hover:text-brand-purple disabled:opacity-20 active:scale-75 transition-all" disabled={chapter === 1}>
              <span className="material-symbols-outlined text-3xl">chevron_left</span>
            </button>
            <div className="flex flex-col items-center">
              <span className="font-black text-[10px] text-slate-300 uppercase tracking-widest">{book.name}</span>
              <span className="font-space-grotesk font-black text-xl text-brand-purple">{chapter}장</span>
            </div>
            <button onClick={() => setChapter(c => Math.min(maxChapters, c + 1))} className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-300 hover:text-brand-purple disabled:opacity-20 active:scale-75 transition-all" disabled={chapter === maxChapters}>
              <span className="material-symbols-outlined text-3xl">chevron_right</span>
            </button>
          </div>
        )}
        <div className="h-40" />
      </main>
    </div>
  )
}
