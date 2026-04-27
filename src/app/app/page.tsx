"use client"

import React, { useState } from 'react'

const bibleVersions = ['개역개정', '새번역', '쉬운성경', 'ESV', 'NIV', 'KJV']
const books = ['요한복음', '창세기', '마태복음']
const chapters = [1, 2, 3, 4, 5]

const verses = [
  { num: 1, text: '태초에 말씀이 계시니라 이 말씀이 하나님과 함께 계셨으니 이 말씀은 곧 하나님이시니라' },
  { num: 2, text: '그가 태초에 하나님과 함께 계셨고' },
  { num: 3, text: '만물이 그로 말미암아 지은 바 되었으니 지은 것이 하나도 그가 없이는 된 것이 없느니라' },
  { num: 4, text: '그 안에 생명이 있었으니 이 생명은 사람들의 빛이라' },
  { num: 5, text: '빛이 어둠에 비치되 어둠이 깨닫지 못하더라' },
]

export default function AppPage() {
  const [version, setVersion] = useState('개역개정')
  const [book, setBook] = useState('요한복음')
  const [chapter, setChapter] = useState(1)

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16 pb-32">
      {/* Ultra Minimal Selector Row */}
      <div className="px-6 flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar">
        <select 
          value={book}
          onChange={(e) => setBook(e.target.value)}
          className="bg-transparent font-plus-jakarta font-black text-2xl text-brand-dark focus:outline-none cursor-pointer"
        >
          {books.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select 
          value={chapter}
          onChange={(e) => setChapter(Number(e.target.value))}
          className="bg-transparent font-plus-jakarta font-black text-2xl text-brand-purple focus:outline-none cursor-pointer"
        >
          {chapters.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex-1" />

        <select 
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="bg-slate-50 text-slate-400 font-bold text-[11px] px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer uppercase tracking-widest"
        >
          {bibleVersions.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      {/* Scripture Body - Zero Decoration */}
      <main className="px-8 flex flex-col gap-8 overflow-y-auto no-scrollbar">
        {verses.map((v) => (
          <div key={v.num} className="flex items-start gap-5">
            <span className="font-space-grotesk font-black text-[12px] text-brand-purple/30 mt-2 shrink-0 w-6 text-center">
              {v.num}
            </span>
            <p className="text-[20px] font-medium text-brand-dark leading-[1.8] tracking-tight">
              {v.text}
            </p>
          </div>
        ))}
        {/* Extra Bottom Padding */}
        <div className="h-20" />
      </main>
    </div>
  )
}
