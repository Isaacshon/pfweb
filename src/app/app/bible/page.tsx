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

  const handlePointerDown = (num: number) => {
    isLongPressing.current = false
    longPressTimer.current = setTimeout(() => {
      isLongPressing.current = true
      setActiveMenuVerse(num)
      if (window.navigator.vibrate) window.navigator.vibrate(50)
    }, 600)
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
  }

  const openNoteModal = (num: number) => {
    setActiveMenuVerse(null)
    setCurrentNote(notes[num] || '')
    setIsNoteModalOpen(true)
  }

  const saveNote = () => {
    if (activeMenuVerse !== null || isNoteModalOpen) {
      const verseNum = activeMenuVerse || Object.keys(notes).find(k => notes[Number(k)] === currentNote) // Simplified for demo
      // In a real scenario, we'd pass the verseNum to openNoteModal
    }
  }

  return (
    <div className="pt-20 px-6 flex flex-col gap-8 pb-32 font-pretendard">
      <AppTopBar title="Bible Reader" />

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
                className="relative group"
                onPointerDown={() => handlePointerDown(v.num)}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <div className="flex items-start gap-4">
                  <span className="font-bold text-[12px] uppercase tracking-widest text-brand-purple mt-1.5 shrink-0 w-4 text-center">
                    {v.num}
                  </span>
                  <div className="relative inline">
                    {highlights[v.num] && (
                      <div 
                        className="absolute inset-0 -mx-1 -my-0.5 rounded-sm opacity-40 z-0" 
                        style={{ backgroundColor: highlights[v.num] }}
                      />
                    )}
                    <p className="text-[18px] font-medium text-brand-dark leading-relaxed relative z-10">
                      {v.text}
                    </p>
                    {notes[v.num] && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-xl border-l-2 border-brand-purple">
                        <p className="text-xs text-slate-500 italic">"{notes[v.num]}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Context Menu */}
                {activeMenuVerse === v.num && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-900 p-2 rounded-2xl shadow-2xl z-[100] animate-in zoom-in-95 duration-200">
                    <button onClick={() => toggleHighlight(v.num, '#9a78b4')} className="w-8 h-8 rounded-full bg-[#9a78b4] border-2 border-white/20"></button>
                    <button onClick={() => toggleHighlight(v.num, '#fffbbd')} className="w-8 h-8 rounded-full bg-[#fffbbd] border-2 border-white/20"></button>
                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                    <button onClick={() => openNoteModal(v.num)} className="flex items-center gap-2 px-3 py-1.5 text-white text-xs font-bold">
                      <span className="material-icons text-sm">edit_note</span>
                      Memo
                    </button>
                    <button onClick={() => setActiveMenuVerse(null)} className="material-icons text-white/40 text-sm ml-1">close</button>
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

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
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
                const verseNum = Object.keys(highlights).find(k => activeMenuVerse === Number(k)) || activeMenuVerse
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
      </div>
    </div>
  )
}
