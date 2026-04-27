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
  // Core Data State
  const [version, setVersion] = useState(bibleVersions[0])
  const [book, setBook] = useState(bibleBooks[42])
  const [chapter, setChapter] = useState(1)
  const [verses, setVerses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [maxChapters, setMaxChapters] = useState(21)

  // Reading Settings State
  const [fontSize, setFontSize] = useState(20)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchChapter = useCallback(async (vCode: string, bId: number, cNum: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`https://bolls.life/get-chapter/${vCode}/${bId}/${cNum}/`)
      const data = await res.json()
      if (Array.isArray(data)) setVerses(data)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchBookInfo = useCallback(async (vCode: string, bId: number) => {
    try {
      const res = await fetch(`https://bolls.life/get-books/${vCode}/`)
      const data = await res.json()
      const currentBook = data.find((b: any) => b.bookid === bId)
      if (currentBook) setMaxChapters(currentBook.chapters)
    } catch (err) {
      console.error('Book info error:', err)
    }
  }, [])

  useEffect(() => { fetchBookInfo(version.code, book.id) }, [version.code, book.id, fetchBookInfo])
  useEffect(() => { 
    fetchChapter(version.code, book.id, chapter)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [version.code, book.id, chapter, fetchChapter])

  return (
    <div className={`min-h-screen flex flex-col pt-0 pb-32 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-brand-dark'}`}>
      
      {/* Enhanced Sticky Header */}
      <div className={`sticky top-0 z-50 px-6 py-4 flex flex-col gap-4 border-b transition-all ${isDarkMode ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white/95 border-slate-50'} backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          {/* Menu / Settings Trigger */}
          <button 
            onClick={() => { setShowSettings(!showSettings); setIsSearching(false); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showSettings ? 'bg-brand-purple text-white' : 'hover:bg-slate-50'}`}
          >
            <span className="material-symbols-outlined text-[24px]">settings</span>
          </button>

          {/* Book & Chapter Selectors */}
          <div className="flex-1 flex items-center gap-2 overflow-hidden">
            <select 
              value={book.id}
              onChange={(e) => {
                const selected = bibleBooks.find(b => b.id === Number(e.target.value))
                if (selected) { setBook(selected); setChapter(1); }
              }}
              className="bg-transparent font-plus-jakarta font-black text-lg focus:outline-none cursor-pointer max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {bibleBooks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>

            <select 
              value={chapter}
              onChange={(e) => setChapter(Number(e.target.value))}
              className="bg-transparent font-plus-jakarta font-black text-lg text-brand-purple focus:outline-none cursor-pointer"
            >
              {Array.from({ length: maxChapters }, (_, i) => i + 1).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Version Selector */}
          <select 
            value={version.code}
            onChange={(e) => {
              const selected = bibleVersions.find(v => v.code === e.target.value)
              if (selected) setVersion(selected)
            }}
            className={`text-[10px] font-black px-2 py-1 rounded-md focus:outline-none cursor-pointer uppercase tracking-widest ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-50 text-slate-400'}`}
          >
            {bibleVersions.map(v => <option key={v.code} value={v.code}>{v.code}</option>)}
          </select>

          {/* Search Trigger */}
          <button 
            onClick={() => { setIsSearching(!isSearching); setShowSettings(false); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSearching ? 'bg-brand-purple text-white' : 'hover:bg-slate-50'}`}
          >
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>
        </div>

        {/* Expandable Settings Panel */}
        {showSettings && (
          <div className={`p-4 rounded-2xl flex flex-col gap-5 animate-in slide-in-from-top-2 duration-200 ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Reading Mode</span>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${isDarkMode ? 'bg-brand-purple text-white' : 'bg-white text-brand-dark shadow-sm'}`}
              >
                <span className="material-symbols-outlined text-sm">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
                {isDarkMode ? 'Dark' : 'Light'}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Font Size</span>
              <div className="flex items-center gap-4">
                <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">-</button>
                <span className="font-bold text-sm min-w-[30px] text-center">{fontSize}</span>
                <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">+</button>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Search Panel */}
        {isSearching && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <input 
              type="text"
              placeholder="Search scripture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all ${isDarkMode ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-slate-50 text-brand-dark border-slate-100'}`}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="px-8 mt-10 flex flex-col gap-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className={`w-8 h-8 border-4 border-t-brand-purple rounded-full animate-spin ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}></div>
          </div>
        ) : (
          verses.map((v: any) => {
            const isMatch = searchQuery && v.text.toLowerCase().includes(searchQuery.toLowerCase())
            return (
              <div key={v.verse} className={`flex items-start gap-5 group transition-opacity ${searchQuery && !isMatch ? 'opacity-30' : 'opacity-100'}`}>
                <span className={`font-space-grotesk font-black text-[12px] mt-2 shrink-0 w-6 text-center transition-colors ${isDarkMode ? 'text-zinc-700 group-hover:text-zinc-500' : 'text-brand-purple/20 group-hover:text-brand-purple/40'}`}>
                  {v.verse}
                </span>
                <p 
                  style={{ fontSize: `${fontSize}px` }}
                  className={`font-medium leading-[1.8] tracking-tight transition-all ${isMatch ? 'bg-brand-yellow/30 text-brand-dark rounded px-1' : ''}`}
                >
                  {v.text}
                </p>
              </div>
            )
          })
        )}
        
        {!isLoading && verses.length > 0 && (
          <div className={`flex justify-between items-center mt-12 pt-8 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-50'}`}>
            <button 
              disabled={chapter === 1}
              onClick={() => setChapter(c => Math.max(1, c - 1))}
              className="flex items-center gap-2 text-slate-400 hover:text-brand-purple disabled:opacity-20 transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
              <span className="font-bold text-[11px] uppercase tracking-widest">Prev</span>
            </button>
            <button 
              disabled={chapter === maxChapters}
              onClick={() => setChapter(c => Math.min(maxChapters, c + 1))}
              className="flex items-center gap-2 text-slate-400 hover:text-brand-purple disabled:opacity-20 transition-colors"
            >
              <span className="font-bold text-[11px] uppercase tracking-widest">Next</span>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}

        <div className="h-32" />
      </main>
    </div>
  )
}
