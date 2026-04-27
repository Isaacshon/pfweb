"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScanOverlay } from './ScanOverlay'
import { useTheme } from '@/context/ThemeContext'

const navItems = [
  { label: 'Home', icon: 'home', path: '/app' },
  { label: 'Service', icon: 'volunteer_activism', path: '/app/service' },
  { label: 'Community', icon: 'groups', path: '/app/community' },
  { label: 'My', icon: 'person', path: '/app/profile' },
]

export function AppNavBar() {
  const pathname = usePathname()
  const { isDarkMode, mounted } = useTheme()
  const [isScanOpen, setIsScanOpen] = useState(false)
  
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [hasVibrated, setHasVibrated] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  const TRIGGER_THRESHOLD = 80 // Intentional pull for Samsung Pay feel
  const MAX_PULL = 180 // Deeper pull for more physical feel

  useEffect(() => {
    const tutorialSeen = localStorage.getItem('pf_tutorial_scan_seen')
    if (!tutorialSeen) {
      setShowTutorial(true)
    }
  }, [])

  const closeTutorial = () => {
    localStorage.setItem('pf_tutorial_scan_seen', 'true')
    setShowTutorial(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
    setHasVibrated(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const currentY = e.targetTouches[0].clientY
    const diff = touchStart - currentY
    
    if (diff > 0) {
      // 1:1 feel like pulling a card
      const dampenedDiff = Math.min(diff, MAX_PULL)
      setPullDistance(dampenedDiff)

      if (dampenedDiff >= TRIGGER_THRESHOLD && !hasVibrated) {
        if (window.navigator.vibrate) {
          window.navigator.vibrate([30, 20, 30]) // Sharp physical click
        }
        setHasVibrated(true)
      }
    }
  }

  const handleTouchEnd = () => {
    if (pullDistance >= TRIGGER_THRESHOLD) {
      setIsScanOpen(true)
      if (showTutorial) closeTutorial()
    }
    setTouchStart(null)
    setPullDistance(0)
    setHasVibrated(false)
  }

  if (!mounted) return null

  const activeColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const activeBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'
  const bgColor = isDarkMode ? '#050505' : '#ffffff'
  const borderColor = isDarkMode ? '#18181b' : '#f8fafc'

  // Samsung Pay like liquid path - very subtle and deep
  const peakY = 15 - (pullDistance * 0.25)
  const dynamicCp1X = 140 + (pullDistance * 0.3)
  const dynamicCp2X = 260 - (pullDistance * 0.3)
  
  const svgPath = `
    M 0 15 
    L ${dynamicCp1X - 60} 15
    C ${dynamicCp1X - 20} 15, ${dynamicCp1X} ${peakY}, 200 ${peakY}
    C ${dynamicCp2X} ${peakY}, ${dynamicCp2X + 20} 15, ${dynamicCp2X + 60} 15
    L 400 15 L 400 120 L 0 120 Z
  `

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 z-[60] max-w-md mx-auto md:max-w-none select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Samsung Pay Card Peek (Shows during pull) */}
        <div 
          className={`absolute left-4 right-4 h-[200px] rounded-t-[32px] transition-all duration-75 pointer-events-none z-[55] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center pt-6 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-100'} border-t border-x`}
          style={{ 
            bottom: `${-200 + pullDistance}px`,
            opacity: pullDistance > 0 ? 1 : 0,
            transform: `scale(${0.9 + (pullDistance / MAX_PULL) * 0.1})`,
          }}
        >
          <div className={`w-12 h-1 rounded-full mb-6 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}></div>
          <span className={`material-icons text-3xl mb-2 ${activeColor} opacity-40 animate-pulse`}>qr_code_scanner</span>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Scanner</p>
        </div>

        <svg 
          viewBox="0 0 400 120" 
          className="absolute bottom-0 w-full h-[140px] pointer-events-none drop-shadow-2xl transition-colors duration-500 z-[60]"
          preserveAspectRatio="none"
        >
          <path 
            d={svgPath} 
            fill={bgColor} 
            stroke={borderColor}
            strokeWidth="0.5"
            className="transition-all duration-75 ease-out"
          />
        </svg>

        <nav className="relative flex justify-around items-center h-20 px-4 pb-4 pointer-events-auto z-[70]">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.label}
                href={item.path}
                className={`flex flex-col items-center gap-1 transition-all active:scale-90 duration-200 min-w-[60px] relative ${
                  isActive ? activeColor : 'text-zinc-500 opacity-60'
                }`}
                style={{ 
                  transform: `translateY(${isActive ? -pullDistance * 0.05 : 0}px)`,
                }}
              >
                <span className="material-icons text-[24px]">
                  {item.icon}
                </span>
                <span className="font-plus-jakarta font-black text-[8px] uppercase tracking-widest leading-none">{item.label}</span>
                {isActive && (
                  <span className={`absolute -bottom-1 w-1 h-1 rounded-full ${activeBg}`}></span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Liquid Indicator Dot - Now purely a visual handle for swiping */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 w-4 h-1.5 rounded-full transition-all duration-300 ${activeBg} shadow-lg z-[80]`}
          style={{ 
            bottom: `${52 + pullDistance * 0.8}px`,
            opacity: mounted ? Math.max(0.6, pullDistance / TRIGGER_THRESHOLD) : 0,
            transform: `translateX(-50%) scale(${1 + pullDistance * 0.02})`,
            width: `${16 + pullDistance * 0.1}px`,
            boxShadow: `0 0 ${25 + pullDistance * 0.5}px ${isDarkMode ? 'rgba(252,211,77,0.6)' : 'rgba(109,40,217,0.6)'}`
          }}
        ></div>
      </div>

      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-8 pb-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={closeTutorial}>
          <div className={`p-10 rounded-[48px] ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border shadow-2xl w-full max-w-sm space-y-8 animate-in slide-in-from-bottom-10 duration-700`} onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center gap-6">
              <div className="relative w-24 h-32 flex items-center justify-center">
                <div className={`absolute bottom-0 w-full h-8 rounded-2xl ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-100'}`}></div>
                <div className="absolute bottom-4 animate-bounce-slow">
                  <span className={`material-icons text-5xl ${activeColor}`}>touch_app</span>
                </div>
                <div className={`absolute top-0 w-1 h-12 rounded-full ${activeBg} animate-pulse`}></div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black font-plus-jakarta tracking-tight">Pull Up like a Card</h2>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                  삼성페이처럼 하단 바를 위로 밀어 올리면<br/>스캔 카드가 나타납니다.
                </p>
              </div>
              <button 
                onClick={closeTutorial}
                className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-widest ${activeBg} text-white shadow-xl active:scale-95 transition-all`}
              >
                확인했습니다!
              </button>
            </div>
          </div>
        </div>
      )}

      <ScanOverlay isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s infinite ease-in-out; }
      `}</style>
    </>
  )
}
