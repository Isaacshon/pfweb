"use client"

import React, { useState, useRef, useEffect } from 'react'
import { AppTopBar } from '@/components/AppTopBar'
import { BentoCard } from '@/components/BentoCard'

const bibleVersions = [
  { name: '개역개정', lang: '🇰🇷' },
  { name: '현대인', lang: '🇰🇷' },
  { name: '중국어', lang: '🇨🇳' },
  { name: '스페인어', lang: '🇪🇸' },
  { name: 'ESV', lang: '🇺🇸' },
  { name: 'NIV', lang: '🇺🇸' },
  { name: 'KJV', lang: '🇬🇧' }
]

const initialVerses = [
  { num: 1, text: '태초에 말씀이 계시니라 이 말씀이 하나님과 함께 계셨으니 이 말씀은 곧 하나님이시니라' },
  { num: 2, text: '그가 태초에 하나님과 함께 계셨고' },
  { num: 3, text: '만물이 그로 말미암아 지은 바 되었으니 지은 것이 하나도 그가 없이는 된 것이 없느니라' },
  { num: 4, text: '그 안에 생명이 있었으니 이 생명은 사람들의 빛이라' },
  { num: 5, text: '빛이 어둠에 비치되 어둠이 깨닫지 못하더라' },
]

export default function BiblePage() {
  const [version, setVersion] = useState('개역개정')
  const [highlights, setHighlights] = useState<Record<number, string>>({})
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [activeMenuVerse, setActiveMenuVerse] = useState<number | null>(null)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [currentNote, setCurrentNote] = useState('')
  const [selectedColor, setSelectedColor] = useState('#fffbbd')
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Long Press Logic
  const longPressTimer = useRef<any>(null)
  const isLongPressing = useRef(false)

  useEffect(() => {
    const savedHighlights = localStorage.getItem('pf_bible_highlights')
    const savedNotes = localStorage.getItem('pf_bible_notes')
    if (savedHighlights) setHighlights(JSON.parse(savedHighlights))
    if (savedNotes) setNotes(JSON.parse(savedNotes))
  }, [])

  useEffect(() => {
    localStorage.setItem('pf_bible_highlights', JSON.stringify(highlights))
    localStorage.setItem('pf_bible_notes', JSON.stringify(notes))
  }, [highlights, notes])

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

  const toggleHighlight = (num: number, color: string) => {
    setHighlights(prev => ({
      ...prev,
      [num]: prev[num] === color ? '' : color
    }))
    setActiveMenuVerse(null)
    setIsPaletteOpen(false)
  }

  const openNoteModal = (num: number) => {
    setActiveMenuVerse(null)
    setIsPaletteOpen(false)
    setCurrentNote(notes[num] || '')
    setIsNoteModalOpen(true)
  }

  const hasHistory = Object.keys(highlights).length > 0 || Object.keys(notes).length > 0
  const historyItems = initialVerses.filter(v => (highlights[v.num] && highlights[v.num] !== '') || notes[v.num])

  return (
    <div className="pt-20 px-6 flex flex-col gap-8 pb-32 font-pretendard select-none">
      <header className="flex items-center justify-between">
        <AppTopBar title="Bible Reader" />
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${hasHistory ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'bg-slate-100 text-slate-400'}`}
        >
          <span className="material-icons text-xl">history_edu</span>
        </button>
      </header>

      {/* Selector Section */}
      <div className="flex justify-between items-center bg-white p-4 rounded-[24px] shadow-[0_10px_30px_rgba(109,40,217,0.04)]">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#f8f9ff] rounded-full hover:bg-[#e6eeff] transition-colors">
          <span className="font-bold text-[18px] text-brand-dark uppercase tracking-tighter">John Chapter 1</span>
          <span className="material-icons text-slate-400">expand_more</span>
        </button>
        
        <div className="relative">
          <select 
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="appearance-none bg-brand-purple text-white font-bold text-xs px-5 py-2.5 pr-10 rounded-full focus:outline-none shadow-lg shadow-brand-purple/20 cursor-pointer"
          >
            {bibleVersions.map(v => <option key={v.name} value={v.name}>{v.name}({v.lang})</option>)}
          </select>
          <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none text-[10px]">arrow_drop_down</span>
        </div>
      </div>

      {/* Reader Area */}
      <div className="relative">
        <BentoCard className="min-h-[500px] flex flex-col relative overflow-visible">
          <div className="absolute -top-6 -right-4 w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center shadow-lg transform rotate-12 animate-pulse z-10" style={{ animationDuration: '3s' }}>
            <span className="material-icons text-3xl text-brand-dark" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          </div>

          <div className="mb-6">
            <span className="text-[10px] font-black text-brand-purple uppercase tracking-[0.3em] opacity-40">References</span>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar pb-20">
            {initialVerses.map((v) => (
              <div 
                key={v.num} 
                className="relative group touch-none"
                onPointerDown={(e) => handlePointerDown(v.num, e)}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="flex items-start gap-4">
                  <span className="font-bold text-[12px] uppercase tracking-widest text-brand-purple mt-1.5 shrink-0 w-4 text-center">
                    {v.num}
                  </span>
                  <div className="relative inline">
                    {highlights[v.num] && (
                      <div 
                        className="absolute inset-x-[-4px] inset-y-0 opacity-40 z-0" 
                        style={{ backgroundColor: highlights[v.num] }}
                      />
                    )}
                    <p className="text-[18px] font-medium text-brand-dark leading-relaxed relative z-10 select-none">
                      {v.text}
                    </p>
                    {notes[v.num] && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-xl border-l-2 border-brand-purple relative z-10">
                        <p className="text-xs text-slate-500 italic">"{notes[v.num]}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Context Menu - Expandable Palette */}
                {activeMenuVerse === v.num && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.12)] z-[100] animate-in zoom-in-95 duration-200 border border-slate-50 overflow-hidden">
                    {!isPaletteOpen ? (
                      <div className="flex items-center gap-5 px-5 py-2.5">
                        <button 
                          onClick={() => toggleHighlight(v.num, selectedColor)} 
                          className="text-sm font-bold text-slate-800 active:scale-95 transition-transform"
                        >
                          형광펜
                        </button>
                        
                        <button 
                          onClick={() => setIsPaletteOpen(true)}
                          className="w-6 h-6 rounded-full border-2 border-white ring-2 ring-offset-1 transition-all active:scale-90"
                          style={{ backgroundColor: selectedColor, ringColor: selectedColor }}
                        ></button>

                        <button 
                          onClick={() => openNoteModal(v.num)} 
                          className="text-sm font-bold text-slate-800 active:scale-95 transition-transform"
                        >
                          메모
                        </button>

                        <div className="flex items-center text-slate-300">
                          <span className="material-icons text-lg">more_vert</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-6 px-6 py-2.5 animate-in slide-in-from-right-4 duration-300">
                        <button 
                          onClick={() => { setSelectedColor('#fffbbd'); setIsPaletteOpen(false); }} 
                          className={`w-7 h-7 rounded-full bg-[#fffbbd] border-2 border-white shadow-sm active:scale-125 transition-transform ${selectedColor === '#fffbbd' ? 'ring-2 ring-[#fffbbd] ring-offset-1' : ''}`}
                        ></button>
                        <button 
                          onClick={() => { setSelectedColor('#9a78b4'); setIsPaletteOpen(false); }} 
                          className={`w-7 h-7 rounded-full bg-[#9a78b4] border-2 border-white shadow-sm active:scale-125 transition-transform ${selectedColor === '#9a78b4' ? 'ring-2 ring-[#9a78b4] ring-offset-1' : ''}`}
                        ></button>
                        <div className="w-px h-4 bg-slate-100 mx-1"></div>
                        <button 
                          onClick={() => setIsPaletteOpen(false)} 
                          className="material-icons text-slate-400 text-lg active:scale-90 transition-transform"
                        >
                          close
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-50">
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-purple transition-colors">
              <span className="material-icons">chevron_left</span>
            </button>
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <div className="w-6 h-2 rounded-full bg-brand-purple"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-purple transition-colors">
              <span className="material-icons">chevron_right</span>
            </button>
          </div>
        </BentoCard>
      </div>

      {/* Activity History Sheet */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white rounded-t-[40px] max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500 shadow-2xl">
            <div className="p-8 flex items-center justify-between border-b border-slate-50">
              <div>
                <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Study History</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{historyItems.length} Saved Activities</p>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><span className="material-icons text-slate-300">close</span></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar pb-20">
              {historyItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <span className="material-icons text-6xl mb-4">history_edu</span>
                  <p className="font-bold">No history yet</p>
                </div>
              ) : (
                historyItems.map(v => (
                  <div key={v.num} onClick={() => setIsHistoryOpen(false)} className="p-5 rounded-[32px] bg-slate-50/50 border border-slate-100 flex flex-col gap-3 active:scale-[0.98] transition-transform">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-brand-purple uppercase tracking-[0.2em]">Verse {v.num}</span>
                      {highlights[v.num] && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: highlights[v.num] }}></div>}
                    </div>
                    <p className="text-sm font-medium text-brand-dark line-clamp-2 opacity-60 italic">"{v.text}"</p>
                    {notes[v.num] && (
                      <div className="mt-1 p-4 bg-white rounded-2xl shadow-sm border-l-4 border-brand-purple">
                        <p className="text-sm font-bold text-brand-dark leading-relaxed">{notes[v.num]}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-brand-dark uppercase tracking-tight">Verse Note</h2>
              <button onClick={() => setIsNoteModalOpen(false)} className="material-icons text-slate-300">close</button>
            </div>
            <textarea 
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="What did God speak to you today?"
              className="w-full h-40 bg-slate-50 rounded-3xl p-5 outline-none text-brand-dark font-medium placeholder:opacity-30 resize-none mb-6"
            />
            <button 
              onClick={() => {
                const verseNum = activeMenuVerse
                if (verseNum !== null) {
                  setNotes(prev => ({ ...prev, [verseNum]: currentNote }))
                  setIsNoteModalOpen(false)
                }
              }}
              className="w-full py-5 bg-brand-purple text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-purple/20 active:scale-95 transition-all"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Card */}
      <BentoCard className="flex items-center justify-between bg-[#dee9fc]/50 border border-white/50" padding={false}>
        <div className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center shadow-sm">
            <span className="material-icons text-brand-dark" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark_add</span>
          </div>
          <div>
            <h3 className="font-black text-brand-dark text-sm uppercase tracking-tight">Save Progress</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">JOHN CHAPTER 1</p>
          </div>
        </div>
        <button className="mr-4 px-6 py-2.5 bg-brand-purple text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-purple/20 hover:scale-105 active:scale-95 transition-all">
          Save
        </button>
      </BentoCard>
    </div>
  )
}
