"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useTheme } from '@/context/ThemeContext'

const bibleVersions = [
  { name: '개역한글', code: 'KRV', lang: 'ko' },
  { name: '개역개정', code: 'NKP', lang: 'ko' },
  { name: 'ESV', code: 'ESV', lang: 'en' },
  { name: 'NIV', code: 'NIV', lang: 'en' },
  { name: 'KJV', code: 'KJV', lang: 'en' },
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
  const { isDarkMode, toggleTheme } = useTheme()
  const [version, setVersion] = useState(bibleVersions[3]) // NIV Default
  const [book, setBook] = useState(bibleBooks[42]) // John Default
  const [chapter, setChapter] = useState(1)
  const [verses, setVerses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [maxChapters, setMaxChapters] = useState(21)

  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(1.85)
  const [verseGap, setVerseGap] = useState(30)
  const [openUI, setOpenUI] = useState<string | null>(null)
  const [pickerTab, setPickerTab] = useState<'book' | 'chapter' | 'version'>('book')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [bookSearch, setBookSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  // --- Persistence Logic ---
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedVersion = localStorage.getItem('pf_bible_version')
    const savedBook = localStorage.getItem('pf_bible_book')
    const savedChapter = localStorage.getItem('pf_bible_chapter')
    const savedFontSize = localStorage.getItem('pf_bible_fontsize')
    const savedLineHeight = localStorage.getItem('pf_bible_lineheight')
    const savedVerseGap = localStorage.getItem('pf_bible_versegap')

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
  }, [version.code, book.id, chapter, fontSize, lineHeight, verseGap, isLoaded])
  // -------------------------

  const isEn = version.lang === 'en'

  const cleanText = (text: string) => {
    return text.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim()
  }

  const fetchChapter = useCallback(async (vCode: string, bId: number, cNum: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`https://bolls.life/get-chapter/${vCode}/${bId}/${cNum}/`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setVerses(data.map(v => ({ ...v, text: cleanText(v.text) })))
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
    try {
      const res = await fetch(`https://bolls.life/search/${version.code}/?search=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (Array.isArray(data)) setSearchResults(data.map(v => ({ ...v, text: cleanText(v.text) })))
    } catch (err) { console.error(err) }
  }, [version.code])

  useEffect(() => { fetchBookInfo(version.code, book.id) }, [version.code, book.id, fetchBookInfo])
  useEffect(() => { 
    fetchChapter(version.code, book.id, chapter)
    const content = document.getElementById('bible-content')
    if (content) content.scrollTo({ top: 0, behavior: 'smooth' })
  }, [version.code, book.id, chapter, fetchChapter])

  const filteredBooks = useMemo(() => {
    return bibleBooks.filter(b => b.name.includes(bookSearch) || b.eng.toLowerCase().includes(bookSearch.toLowerCase()))
  }, [bookSearch])

  // Dynamic Theme Logic
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'
  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-zinc-100' : 'text-zinc-900'

  return (
    <div className={`h-full flex flex-col transition-colors duration-500 ${bgColor} ${textColor}`}>
      
      {/* Header with Dynamic Book Naming */}
      <header className={`shrink-0 h-20 px-6 flex items-center justify-between z-40 border-b ${isDarkMode ? 'bg-[#050505]/80 border-zinc-900' : 'bg-white/80 border-slate-50'} backdrop-blur-sm`}>
        <button onClick={() => setOpenUI(openUI === 'settings' ? null : 'settings')} className={`w-10 h-10 flex items-center justify-center transition-all ${openUI === 'settings' ? accentColor : 'text-slate-300'}`}>
          <span className="material-icons">tune</span>
        </button>

        <button onClick={() => { setOpenUI('picker'); setPickerTab('book'); }} className="flex items-center gap-2 active:scale-95 transition-all">
          <span className="font-plus-jakarta font-black text-[16px] tracking-tight">
            {isEn ? book.eng : book.name}
          </span>
          <span className={`w-1 h-1 rounded-full ${accentBg}`}></span>
          <span className={`font-plus-jakarta font-black text-[16px] tracking-tight ${accentColor}`}>{chapter}장</span>
          <span className={`material-icons ${isDarkMode ? 'text-brand-yellow/20' : 'text-brand-purple/20'} text-lg`}>expand_more</span>
        </button>

        <button onClick={() => setOpenUI(openUI === 'search' ? null : 'search')} className={`w-10 h-10 flex items-center justify-center transition-all ${openUI === 'search' ? accentColor : 'text-slate-300'}`}>
          <span className="material-icons">search</span>
        </button>
      </header>

      {/* Bible Text Container */}
      <div id="bible-content" className="flex-1 overflow-y-auto px-10 pt-10 pb-32 no-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <div className={`w-2 h-2 rounded-full ${accentBg} animate-ping`}></div>
          </div>
        ) : (
          <div className="flex flex-col" style={{ gap: `${verseGap}px` }}>
            {verses.map((v: any) => (
              <div key={v.verse} className="flex flex-col gap-2 group">
                <span className={`font-space-grotesk font-black text-[10px] tracking-widest ${isDarkMode ? 'text-brand-yellow/50' : 'text-brand-purple/30'}`}>
                  {v.verse}
                </span>
                <p style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }} className="font-medium tracking-tight">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && verses.length > 0 && (
          <div className="flex justify-between items-center mt-20">
            <button onClick={() => setChapter(c => Math.max(1, c - 1))} className={`text-slate-200 hover:${accentColor} transition-all`} disabled={chapter === 1}><span className="material-icons text-4xl">chevron_left</span></button>
            <button onClick={() => setChapter(c => Math.min(maxChapters, c + 1))} className={`text-slate-200 hover:${accentColor} transition-all`} disabled={chapter === maxChapters}><span className="material-icons text-4xl">chevron_right</span></button>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {openUI === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/5" onClick={() => setOpenUI(null)}>
          <div className={`absolute bottom-28 left-6 right-6 p-8 rounded-[40px] shadow-2xl border transition-all animate-in slide-in-from-bottom-4 duration-500 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-50'}`} onClick={e => e.stopPropagation()}>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">Night Mode</span><button onClick={toggleTheme} className={`w-12 h-6 rounded-full relative transition-all ${isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div></button></div>
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">Text Size</span><div className="flex items-center gap-6"><button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className={`${accentColor} font-black`}>-</button><span className="font-space-grotesk font-black text-sm">{fontSize}</span><button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className={`${accentColor} font-black`}>+</button></div></div>
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">Line Height</span><div className="flex items-center gap-6"><button onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))} className={`${accentColor} font-black`}>-</button><span className="font-space-grotesk font-black text-sm">{lineHeight.toFixed(1)}</span><button onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))} className={`${accentColor} font-black`}>+</button></div></div>
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest opacity-30">Verse Spacing</span><div className="flex items-center gap-6"><button onClick={() => setVerseGap(Math.max(0, verseGap - 5))} className={`${accentColor} font-black`}>-</button><span className="font-space-grotesk font-black text-sm">{verseGap}</span><button onClick={() => setVerseGap(Math.min(100, verseGap + 5))} className={`${accentColor} font-black`}>+</button></div></div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Overlay */}
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
                  <p className={`font-black text-[9px] ${accentColor} uppercase tracking-[0.3em] mb-3`}>
                    {isEn ? bibleBooks.find(b => b.id === res.book)?.eng : bibleBooks.find(b => b.id === res.book)?.name} {res.chapter}:{res.verse}
                  </p>
                  <p className="text-[16px] font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{res.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REFERENCE PICKER UI (Linguistic Sync) */}
      {openUI === 'picker' && (
        <div className={`fixed inset-0 z-[100] transition-all duration-300 flex flex-col animate-in fade-in ${bgColor} ${textColor}`}>
          <div className="px-6 pt-16 pb-6 flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <button onClick={() => setOpenUI(null)} className="active:scale-90 transition-transform"><span className="material-icons text-3xl">arrow_back</span></button>
              <h2 className="text-[20px] font-bold">참조 구절</h2>
              <div className="ml-auto flex items-center gap-6 text-zinc-600">
                <span className="material-icons text-2xl">translate</span>
                <span className="material-icons text-2xl">history</span>
              </div>
            </div>

            <div className={`flex gap-4 border-b ${isDarkMode ? 'border-zinc-800' : 'border-slate-50'}`}>
              {['book', 'chapter', 'version'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setPickerTab(tab as any)} 
                  className={`pb-3 text-sm font-bold tracking-tight transition-all border-b-2 uppercase ${pickerTab === tab ? `border-current ${accentColor}` : 'text-zinc-500 border-transparent'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative group">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-400 transition-colors">search</span>
              <input 
                type="text"
                placeholder="검색"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className={`w-full ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'} border-none rounded-full py-4 pl-12 pr-6 text-base font-medium placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-all`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
            {pickerTab === 'book' && (
              <div className="flex flex-col">
                {filteredBooks.map((b) => (
                  <button 
                    key={b.id} 
                    onClick={() => { setBook(b); setPickerTab('chapter'); setBookSearch(''); }}
                    className="flex items-center justify-between py-5 group active:opacity-50 transition-all"
                  >
                    <span className={`text-[17px] font-medium tracking-tight ${book.id === b.id ? accentColor + ' font-bold' : 'text-zinc-500'}`}>
                      {isEn ? b.eng : b.name}
                    </span>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-800' : 'text-slate-100'}`}>
                      {isEn ? b.name : b.eng}
                    </span>
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
                    <button 
                      key={c} 
                      onClick={() => { setChapter(c); setOpenUI(null); }}
                      className={`aspect-square rounded-lg flex items-center justify-center font-bold text-[17px] transition-all ${chapter === c ? (isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white') : (isDarkMode ? 'bg-zinc-900 text-zinc-500' : 'bg-slate-50 text-slate-400')}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {pickerTab === 'version' && (
              <div className="flex flex-col gap-2">
                {bibleVersions.map((v) => (
                  <button 
                    key={v.code} 
                    onClick={() => { setVersion(v); setPickerTab('book'); }}
                    className={`flex items-center justify-between py-6 px-6 rounded-2xl transition-all ${version.code === v.code ? (isDarkMode ? 'bg-zinc-900 text-brand-yellow border border-brand-yellow/20' : 'bg-slate-50 text-brand-purple border border-brand-purple/20') : 'text-zinc-500 hover:opacity-70'}`}
                  >
                    <span className="text-lg font-bold tracking-tight">{v.name}</span>
                    {version.code === v.code && <span className="material-icons text-inherit">check_circle</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
