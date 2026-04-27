"use client"

import React, { useState, useEffect, useCallback } from 'react'

const bibleVersions = [
  { name: '개역개정', code: 'KRV' },
  { name: '새번역', code: 'NKP' },
  { name: 'ESV', code: 'ESV' },
  { name: 'NIV', code: 'NIV' },
  { name: 'KJV', code: 'KJV' },
]

const bibleBooks = [
  { id: 1, name: "창세기" }, { id: 2, name: "출애굽기" }, { id: 3, name: "레위기" }, { id: 4, name: "민수기" }, { id: 5, name: "신명기" },
  { id: 6, name: "여호수아" }, { id: 7, name: "사사기" }, { id: 8, name: "룻기" }, { id: 9, name: "사무엘상" }, { id: 10, name: "사무엘하" },
  { id: 11, name: "열왕기상" }, { id: 12, name: "열왕기하" }, { id: 13, name: "역대상" }, { id: 14, name: "역대하" }, { id: 15, name: "에스라" },
  { id: 16, name: "느헤미야" }, { id: 17, name: "에스더" }, { id: 18, name: "욥기" }, { id: 19, name: "시편" }, { id: 20, name: "잠언" },
  { id: 21, name: "전도서" }, { id: 22, name: "아가" }, { id: 23, name: "이사야" }, { id: 24, name: "예레미야" }, { id: 25, name: "예레미야 애가" },
  { id: 26, name: "에스겔" }, { id: 27, name: "다니엘" }, { id: 28, name: "호세아" }, { id: 29, name: "요엘" }, { id: 30, name: "아모스" },
  { id: 31, name: "오바댜" }, { id: 32, name: "요나" }, { id: 33, name: "미가" }, { id: 34, name: "나훔" }, { id: 35, name: "하박국" },
  { id: 36, name: "스바냐" }, { id: 37, name: "학개" }, { id: 38, name: "스가랴" }, { id: 39, name: "말라기" }, { id: 40, name: "마태복음" },
  { id: 41, name: "마가복음" }, { id: 42, name: "누가복음" }, { id: 43, name: "요한복음" }, { id: 44, name: "사도행전" }, { id: 45, name: "로마서" },
  { id: 46, name: "고린도전서" }, { id: 47, name: "고린도후서" }, { id: 48, name: "갈라디아서" }, { id: 49, name: "에베소서" }, { id: 50, name: "빌립보서" },
  { id: 51, name: "골로새서" }, { id: 52, name: "데살로니가전서" }, { id: 53, name: "데살로니가후서" }, { id: 54, name: "디모데전서" }, { id: 55, name: "디모데후서" },
  { id: 56, name: "디도서" }, { id: 57, name: "빌레몬서" }, { id: 58, name: "히브리서" }, { id: 59, name: "야고보서" }, { id: 60, name: "베드로전서" },
  { id: 61, name: "베드로후서" }, { id: 62, name: "요한일서" }, { id: 63, name: "요한이서" }, { id: 64, name: "요한삼서" }, { id: 65, name: "유다서" }, { id: 66, name: "요한계시록" }
]

export default function AppPage() {
  // Core State
  const [version, setVersion] = useState(bibleVersions[0])
  const [book, setBook] = useState(bibleBooks[42])
  const [chapter, setChapter] = useState(1)
  const [verses, setVerses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [maxChapters, setMaxChapters] = useState(21)

  // UI State
  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(1.85)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [openPicker, setOpenPicker] = useState<string | null>(null)
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const fetchChapter = useCallback(async (vCode: string, bId: number, cNum: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`https://bolls.life/get-chapter/${vCode}/${bId}/${cNum}/`)
      const data = await res.json()
      if (Array.isArray(data)) setVerses(data)
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
    setIsSearching(true)
    try {
      const res = await fetch(`https://bolls.life/search/${version.code}/?search=${encodeURIComponent(query)}`)
      const data = await res.json()
      setSearchResults(Array.isArray(data) ? data : [])
    } catch (err) { console.error(err) }
    finally { setIsSearching(false) }
  }, [version.code])

  useEffect(() => { fetchBookInfo(version.code, book.id) }, [version.code, book.id, fetchBookInfo])
  useEffect(() => { 
    fetchChapter(version.code, book.id, chapter)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [version.code, book.id, chapter, fetchChapter])

  const handleResultClick = (res: any) => {
    const selectedBook = bibleBooks.find(b => b.id === res.book)
    if (selectedBook) {
      setBook(selectedBook)
      setChapter(res.chapter)
      setOpenPicker(null)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  return (
    <div className={`min-h-screen flex flex-col pt-0 pb-32 transition-all duration-700 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-brand-dark'}`}>
      
      {/* Brand Aligned Header */}
      <div className={`sticky top-0 z-50 px-6 py-5 flex flex-col gap-4 transition-all ${isDarkMode ? 'bg-zinc-950/80 border-zinc-900' : 'bg-white/80 border-slate-50'} backdrop-blur-xl border-b`}>
        <div className="flex items-center justify-between gap-1">
          <button 
            onClick={() => setOpenPicker(openPicker === 'settings' ? null : 'settings')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${openPicker === 'settings' ? 'bg-brand-purple text-white rotate-90' : 'text-slate-400 hover:bg-slate-100/50'}`}
          >
            <span className="material-symbols-outlined text-[20px] font-light">tune</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-100/50 dark:bg-zinc-900/50 p-1.5 rounded-full px-2.5">
            <button 
              onClick={() => setOpenPicker(openPicker === 'book' ? null : 'book')}
              className={`px-4 py-2 rounded-full text-sm font-black transition-all active:scale-95 shadow-sm ${openPicker === 'book' ? 'bg-brand-purple text-white shadow-brand-purple/20 ring-4 ring-brand-purple/10' : 'bg-brand-purple text-white'}`}
            >
              {book.name}
            </button>
            <button 
              onClick={() => setOpenPicker(openPicker === 'chapter' ? null : 'chapter')}
              className={`px-4 py-2 rounded-full text-sm font-black transition-all active:scale-95 shadow-sm ${openPicker === 'chapter' ? 'bg-brand-yellow text-brand-dark ring-4 ring-brand-yellow/10' : 'bg-brand-yellow text-brand-dark'}`}
            >
              {chapter}
            </button>
            <button 
              onClick={() => setOpenPicker(openPicker === 'version' ? null : 'version')}
              className={`px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${openPicker === 'version' ? 'bg-brand-dark text-white' : 'text-slate-400'}`}
            >
              {version.code}
            </button>
          </div>

          <button 
            onClick={() => setOpenPicker(openPicker === 'search' ? null : 'search')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${openPicker === 'search' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:bg-slate-100/50'}`}
          >
            <span className="material-symbols-outlined text-[20px] font-light">search</span>
          </button>
        </div>

        {/* Dynamic Selectors & Search Panels */}
        <div className="overflow-hidden transition-all duration-300">
          {openPicker === 'book' && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 animate-in fade-in slide-in-from-top-2">
              {bibleBooks.map(b => (
                <button key={b.id} onClick={() => { setBook(b); setChapter(1); setOpenPicker(null); }} className={`px-5 py-2.5 rounded-2xl whitespace-nowrap font-bold text-xs transition-all ${book.id === b.id ? 'bg-brand-purple text-white' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500'}`}>{b.name}</button>
              ))}
            </div>
          )}

          {openPicker === 'chapter' && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 animate-in fade-in slide-in-from-top-2">
              {Array.from({ length: maxChapters }, (_, i) => i + 1).map(c => (
                <button key={c} onClick={() => { setChapter(c); setOpenPicker(null); }} className={`w-11 h-11 rounded-2xl shrink-0 font-black text-sm transition-all ${chapter === c ? 'bg-brand-yellow text-brand-dark shadow-lg shadow-brand-yellow/20' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500'}`}>{c}</button>
              ))}
            </div>
          )}

          {openPicker === 'version' && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 animate-in fade-in slide-in-from-top-2">
              {bibleVersions.map(v => (
                <button key={v.code} onClick={() => { setVersion(v); setOpenPicker(null); }} className={`px-5 py-2.5 rounded-2xl whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all ${version.code === v.code ? 'bg-brand-purple text-white' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500'}`}>{v.name}</button>
              ))}
            </div>
          )}

          {openPicker === 'settings' && (
            <div className={`p-6 rounded-[32px] flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-500 ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Night Mode</span>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-14 h-8 rounded-full transition-all relative ${isDarkMode ? 'bg-brand-purple' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Text Size</span>
                  <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-1 rounded-full px-2">
                    <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-8 h-8 rounded-full text-brand-purple font-black">-</button>
                    <span className="font-space-grotesk font-black text-sm w-6 text-center">{fontSize}</span>
                    <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="w-8 h-8 rounded-full text-brand-purple font-black">+</button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Line Height</span>
                  <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-1 rounded-full px-2">
                    <button onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))} className="w-8 h-8 rounded-full text-brand-purple font-black">-</button>
                    <span className="font-space-grotesk font-black text-sm w-10 text-center">{lineHeight.toFixed(1)}</span>
                    <button onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))} className="w-8 h-8 rounded-full text-brand-purple font-black">+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {openPicker === 'search' && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Global Search in 66 Books..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); performGlobalSearch(e.target.value); }}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm focus:outline-none focus:ring-4 transition-all ${isDarkMode ? 'bg-zinc-900 text-white focus:ring-brand-purple/10' : 'bg-slate-50 text-brand-dark focus:ring-brand-purple/10'}`}
                  autoFocus
                />
                {isSearching && <div className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin"></div>}
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className={`max-h-[60vh] overflow-y-auto rounded-[32px] p-4 flex flex-col gap-2 shadow-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'}`}>
                  {searchResults.map((res: any, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleResultClick(res)}
                      className={`text-left p-4 rounded-2xl transition-all active:scale-[0.98] ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-[10px] text-brand-purple uppercase tracking-widest">
                          {bibleBooks.find(b => b.id === res.book)?.name} {res.chapter}:{res.verse}
                        </span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2 opacity-80">{res.text}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
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
