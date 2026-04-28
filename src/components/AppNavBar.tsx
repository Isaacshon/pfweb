"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScanOverlay } from './ScanOverlay'
import { useTheme } from '@/context/ThemeContext'
import { supabase } from '@/lib/supabase'

export function AppNavBar() {
  const pathname = usePathname()
  const { isDarkMode, mounted } = useTheme()
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const [navItems, setNavItems] = useState([
    { label: 'Home', icon: 'home', path: '/app' },
    { label: 'Service', icon: 'volunteer_activism', path: '/app/service' },
    { label: 'Community', icon: 'groups', path: '/app/community' },
    { label: 'My', icon: 'person', path: '/app/profile' },
  ])

  useEffect(() => {
    // 1. Initial Load from LocalStorage (Instant UI)
    const savedUser = localStorage.getItem('pf_current_user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      const baseItems = [
        { label: 'Home', icon: 'home', path: '/app' },
        { label: 'Service', icon: 'volunteer_activism', path: '/app/service' },
        { label: 'Community', icon: 'groups', path: '/app/community' },
        { label: 'My', icon: 'person', path: '/app/profile' },
      ]
      if (user.role === 'leader' || user.role === 'worship_team') {
        const worshipItem = { label: 'Worship', icon: 'music_note', path: '/app/worship' }
        baseItems.splice(2, 0, worshipItem)
      }
      setNavItems(baseItems)
    }

    // 2. Background Sync with Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        const user = profile ? { ...session.user, ...profile } : session.user
        setCurrentUser(user)
        localStorage.setItem('pf_current_user', JSON.stringify(user))

        const updatedItems = [
          { label: 'Home', icon: 'home', path: '/app' },
          { label: 'Service', icon: 'volunteer_activism', path: '/app/service' },
          { label: 'Community', icon: 'groups', path: '/app/community' },
          { label: 'My', icon: 'person', path: '/app/profile' },
        ]

        if (user.role === 'leader' || user.role === 'worship_team') {
          const worshipItem = { label: 'Worship', icon: 'music_note', path: '/app/worship' }
          updatedItems.splice(2, 0, worshipItem)
        }
        setNavItems(updatedItems)
      } else {
        setCurrentUser(null)
        localStorage.removeItem('pf_current_user')
        setNavItems([
          { label: 'Home', icon: 'home', path: '/app' },
          { label: 'Service', icon: 'volunteer_activism', path: '/app/service' },
          { label: 'Community', icon: 'groups', path: '/app/community' },
          { label: 'My', icon: 'person', path: '/app/profile' },
        ])
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])
  const [isScanOpen, setIsScanOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [hasVibrated, setHasVibrated] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  const TRIGGER_THRESHOLD = 80 
  const MAX_PULL = 180 

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

  // Robust Haptic Helper
  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern)
    }
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
    setHasVibrated(false)
    triggerHaptic(10) // Light touch start feedback
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const currentY = e.targetTouches[0].clientY
    const diff = touchStart - currentY
    
    if (diff > 0) {
      const dampenedDiff = Math.min(diff, MAX_PULL)
      setPullDistance(dampenedDiff)

      if (dampenedDiff >= TRIGGER_THRESHOLD && !hasVibrated) {
        triggerHaptic([40, 20, 40]) // Strong "Click" feedback
        setHasVibrated(true)
      }
    }
  }

  const handleTouchEnd = () => {
    if (pullDistance >= TRIGGER_THRESHOLD) {
      setIsScanOpen(true)
      if (showTutorial) closeTutorial()
      triggerHaptic(50) // Confirm click
    }
    setTouchStart(null)
    setPullDistance(0)
    setHasVibrated(false)
  }

  useEffect(() => {
    if (!isScanOpen) return

    window.history.pushState({ pf_view: 'scanner' }, '')

    const handlePopState = (e: PopStateEvent) => {
      setIsScanOpen(false)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isScanOpen])

  const handleCloseScanner = () => {
    if (window.history.state?.pf_view === 'scanner') {
      window.history.back()
    }
    setIsScanOpen(false)
  }

  if (!mounted) return null

  const activeColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const activeBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'
  const bgColor = isDarkMode ? '#050505' : '#ffffff'
  const borderColor = isDarkMode ? '#18181b' : '#f8fafc'

  // Refined Liquid Path
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
        className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center pointer-events-none select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full max-w-md pointer-events-auto">
          {/* Samsung Pay Card Peek */}
          <div 
            className={`absolute left-4 right-4 h-[240px] rounded-t-[40px] transition-all duration-75 pointer-events-none z-[55] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] flex flex-col items-center pt-8 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-100'} border-t border-x`}
            style={{ 
              bottom: `${-240 + pullDistance}px`,
              opacity: pullDistance > 0 ? 1 : 0,
              transform: `scale(${0.92 + (pullDistance / MAX_PULL) * 0.08})`,
            }}
          >
            <div className={`w-12 h-1.5 rounded-full mb-8 opacity-10 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
            <span className={`material-icons text-4xl mb-4 ${activeColor} opacity-50 animate-pulse`}>qr_code_scanner</span>
            <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-30">Scan Community</p>
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

          <nav className="relative flex justify-around items-center h-20 px-4 pb-4 z-[70]">
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

          {/* Liquid Indicator Dot - Perfect Centering with Fixed Width */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-100 ${activeBg} shadow-xl z-[80] pointer-events-none`}
            style={{ 
              bottom: `${52 + pullDistance * 0.8}px`,
              height: '6px',
              width: `${16 + pullDistance * 0.2}px`,
              opacity: mounted ? Math.max(0.6, pullDistance / TRIGGER_THRESHOLD) : 0,
              boxShadow: `0 0 ${25 + pullDistance * 0.5}px ${isDarkMode ? 'rgba(255,251,189,0.6)' : 'rgba(154,120,180,0.6)'}`
            }}
          ></div>
        </div>
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

      <ScanOverlay isOpen={isScanOpen} onClose={handleCloseScanner} />

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
