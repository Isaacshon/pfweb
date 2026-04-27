"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScanOverlay } from './ScanOverlay'
import { useTheme } from '@/context/ThemeContext'

const navItems = [
  { label: 'Home', icon: 'home', path: '/app' },
  { label: 'Service', icon: 'volunteer_activism', path: '/app/service' },
  { label: 'Scan', icon: 'keyboard_arrow_up', path: '/app/scan', isElevated: true },
  { label: 'Community', icon: 'groups', path: '/app/community' },
  { label: 'My', icon: 'person', path: '/app/profile' },
]

export function AppNavBar() {
  const pathname = usePathname()
  const { isDarkMode } = useTheme()
  const [isScanOpen, setIsScanOpen] = useState(false)
  
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [hasVibrated, setHasVibrated] = useState(false)

  const TRIGGER_THRESHOLD = 90 
  const MAX_PULL = 120

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
    setHasVibrated(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const currentY = e.targetTouches[0].clientY
    const diff = touchStart - currentY
    
    if (diff > 0) {
      // Elastic resistance
      const dampenedDiff = Math.min(diff * 0.7, MAX_PULL)
      setPullDistance(dampenedDiff)

      // Intense Haptic at Threshold
      if (dampenedDiff >= TRIGGER_THRESHOLD && !hasVibrated) {
        if (window.navigator.vibrate) {
          // Strong triple pulse for "Heavy" feeling
          window.navigator.vibrate([50, 30, 50])
        }
        setHasVibrated(true)
      }
    }
  }

  const handleTouchEnd = () => {
    if (pullDistance >= TRIGGER_THRESHOLD) {
      setIsScanOpen(true)
    }
    setTouchStart(null)
    setPullDistance(0)
    setHasVibrated(false)
  }

  const activeColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const activeBorder = isDarkMode ? 'border-brand-yellow' : 'border-brand-purple'
  const bgColor = isDarkMode ? '#050505' : '#ffffff'
  const borderColor = isDarkMode ? '#18181b' : '#f8fafc'

  // SVG Path for "Gummy" stretch
  const curveY = 20 - pullDistance * 0.8
  const svgPath = `M 0 20 Q 200 ${curveY} 400 20 L 400 80 L 0 80 Z`

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none max-w-md mx-auto md:max-w-none">
        {/* The "Gummy" Base Layer */}
        <svg 
          viewBox="0 0 400 80" 
          className="absolute bottom-0 w-full h-[100px] pointer-events-none drop-shadow-2xl transition-colors duration-500"
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

        <nav className="relative flex justify-around items-center h-20 px-2 pb-2 pointer-events-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            
            if (item.isElevated) {
              return (
                <div 
                  key={item.label}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => setIsScanOpen(true)}
                  className="relative -top-8 flex flex-col items-center group"
                >
                  <div 
                    className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} rounded-full w-14 h-14 flex items-center justify-center border shadow-2xl transition-all duration-75 ease-out relative z-10`}
                    style={{
                      transform: `translateY(${-pullDistance}px) scale(${1 + pullDistance * 0.0015})`,
                      boxShadow: pullDistance >= TRIGGER_THRESHOLD 
                        ? `0 0 40px ${isDarkMode ? 'rgba(252,211,77,0.3)' : 'rgba(109,40,217,0.2)'}` 
                        : ''
                    }}
                  >
                    {/* Glowing Core */}
                    <div 
                      className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-300 ${isDarkMode ? 'bg-brand-yellow/30' : 'bg-brand-purple/20'}`}
                      style={{ opacity: pullDistance / TRIGGER_THRESHOLD }}
                    ></div>

                    <div className="absolute inset-2">
                      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${activeBorder} rounded-tl-sm opacity-40`}></div>
                      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${activeBorder} rounded-tr-sm opacity-40`}></div>
                      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${activeBorder} rounded-bl-sm opacity-40`}></div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${activeBorder} rounded-br-sm opacity-40`}></div>
                    </div>

                    <div className={`flex flex-col items-center gap-0 ${activeColor}`}>
                      <span className="material-icons text-[14px]">expand_less</span>
                      <span className="text-[7px] font-black uppercase tracking-[0.2em] -mt-1">Scan</span>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.path}
                className={`flex flex-col items-center gap-1 transition-all active:scale-90 duration-200 min-w-[50px] ${
                  isActive ? activeColor : 'text-zinc-500 opacity-60'
                }`}
              >
                <span className="material-icons text-[24px]">
                  {item.icon}
                </span>
                <span className="font-plus-jakarta font-black text-[8px] uppercase tracking-widest leading-none">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <ScanOverlay isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />
    </>
  )
}
