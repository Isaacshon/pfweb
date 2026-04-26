"use client"

import React, { useState, useCallback } from 'react'
import { BentoCard } from '@/components/BentoCard'
import useEmblaCarousel from 'embla-carousel-react'

const bibleVersions = ['개역개정', '새번역', '쉬운성경', 'ESV', 'NIV', 'KJV']

const chapterData = [
  {
    id: 1,
    book: '요한복음',
    chapter: 1,
    verses: [
      { num: 1, text: '태초에 말씀이 계시니라 이 말씀이 하나님과 함께 계셨으니 이 말씀은 곧 하나님이시니라' },
      { num: 2, text: '그가 태초에 하나님과 함께 계셨고' },
      { num: 3, text: '만물이 그로 말미암아 지은 바 되었으니 지은 것이 하나도 그가 없이는 된 것이 없느니라' },
      { num: 4, text: '그 안에 생명이 있었으니 이 생명은 사람들의 빛이라' },
      { num: 5, text: '빛이 어둠에 비치되 어둠이 깨닫지 못하더라' },
    ]
  },
  {
    id: 2,
    book: '요한복음',
    chapter: 2,
    verses: [
      { num: 1, text: '사흘째 되던 날 갈릴리 가나에 혼례가 있어 예수의 어머니도 거기 계시고' },
      { num: 2, text: '예수와 그 제자들도 혼례에 청함을 받았더니' },
      { num: 3, text: '포도주가 떨어진지라 예수의 어머니가 예수에게 이르되 저들에게 포도주가 없다 하니' },
      { num: 4, text: '예수께서 이르시되 여자여 나와 무슨 상관이 있나이까 내 때가 아직 이르지 아니하였나이다' },
    ]
  },
  {
    id: 3,
    book: '요한복음',
    chapter: 3,
    verses: [
      { num: 1, text: '그런데 바리새인 중에 니고데모라 하는 사람이 있으니 유대인의 지도자라' },
      { num: 2, text: '그가 밤에 예수께 와서 이르되 랍비여 우리가 당신은 하나님께로부터 오신 선생인 줄 아나이다' },
    ]
  }
]

export default function AppPage() {
  const [version, setVersion] = useState('개역개정')
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [currentIndex, setCurrentIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="flex flex-col h-screen bg-brand-surface overflow-hidden">
      {/* Immersive Bible Header */}
      <header className="px-6 pt-12 pb-4 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="font-bold text-[10px] uppercase tracking-[0.3em] text-brand-purple mb-1">Holy Bible</span>
          <h1 className="font-plus-jakarta font-black text-3xl text-brand-dark tracking-tighter">
            {chapterData[currentIndex].book} {chapterData[currentIndex].chapter}
          </h1>
        </div>
        
        <div className="relative">
          <select 
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="appearance-none bg-white border border-slate-100 text-brand-purple font-black text-[11px] px-4 py-2 pr-10 rounded-full focus:outline-none shadow-sm cursor-pointer"
          >
            {bibleVersions.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-brand-purple pointer-events-none text-sm">expand_more</span>
        </div>
      </header>

      {/* Fullscreen Reading View */}
      <div className="flex-1 embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {chapterData.map((chap) => (
            <div key={chap.id} className="embla__slide flex-[0_0_100%] min-w-0 h-full px-4">
              <BentoCard className="h-full rounded-t-[40px] shadow-[0_-20px_40px_rgba(109,40,217,0.03)] border-t border-white" padding={false}>
                <div className="p-8 h-full overflow-y-auto no-scrollbar space-y-8">
                  {chap.verses.map((v) => (
                    <div key={v.num} className="flex items-start gap-5">
                      <span className="font-space-grotesk font-black text-[11px] text-brand-purple/40 mt-2 shrink-0 w-5 text-center">
                        {v.num}
                      </span>
                      <p className="text-[20px] font-medium text-brand-dark leading-[1.7] tracking-tight">
                        {v.text}
                      </p>
                    </div>
                  ))}
                  {/* Bottom Padding for scroll */}
                  <div className="h-32" />
                </div>
              </BentoCard>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center items-center gap-2.5 z-10">
        {chapterData.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              currentIndex === i ? 'w-10 bg-brand-purple shadow-lg shadow-brand-purple/20' : 'w-2 bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
