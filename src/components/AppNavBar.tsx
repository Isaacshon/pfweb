"use client"

import React, { useState } from 'react'
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
  const [currentY, setCurrentY] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.targetTouches[0].clientY
    setCurrentY(touchEnd)
  }

  const handleTouchEnd = () => {
    if (touchStart !== null && currentY !== null) {
      const distance = touchStart - currentY
      if (distance > 50) setIsScanOpen(true)
    }
    setTouchStart(null)
    setCurrentY(null)
    setIsSwiping(false)
  }

  const activeColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const activeBorder = isDarkMode ? 'border-brand-yellow' : 'border-brand-purple'
  const bgColor = isDarkMode ? 'bg-[#050505]/95' : 'bg-white/95'
  const borderColor = isDarkMode ? 'border-zinc-900' : 'border-zinc-50'

  return (
    <>
      <nav className={`fixed bottom-0 left-0 right-0 h-20 px-2 pb-2 flex justify-around items-center max-w-md mx-auto ${bgColor} backdrop-blur-md rounded-t-[32px] z-50 border-t ${borderColor} shadow-[0_-10px_40px_rgba(0,0,0,0.03)] md:max-w-none md:rounded-none transition-colors duration-500`}>
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
                className="relative -top-6 cursor-pointer flex flex-col items-center"
              >
                <div 
                  className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} rounded-full w-14 h-14 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] border-[1px] overflow-hidden transition-all duration-300 active:scale-90 relative`}
                  style={{
                    transform: isSwiping && touchStart && currentY 
                      ? `translateY(${Math.max(-20, currentY - touchStart)}px)` 
                      : 'translateY(0)'
                  }}
                >
                  {/* Minimal Corner Guides instead of Logo */}
                  <div className="absolute inset-2">
                    <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${activeBorder} rounded-tl-sm opacity-60`}></div>
                    <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${activeBorder} rounded-tr-sm opacity-60`}></div>
                    <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${activeBorder} rounded-bl-sm opacity-60`}></div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${activeBorder} rounded-br-sm opacity-60`}></div>
                  </div>

                  {/* Minimal Arrow Indicator */}
                  <div className={`flex flex-col items-center gap-0.5 ${activeColor} animate-pulse`}>
                    <span className="material-icons text-[14px]">expand_less</span>
                    <span className="text-[7px] font-black uppercase tracking-[0.2em]">Scan</span>
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
                isActive ? activeColor : 'text-slate-400'
              }`}
            >
              <span className="material-icons text-[24px]">
                {item.icon}
              </span>
              <span className="font-plus-jakarta font-black text-[8px] uppercase tracking-widest">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <ScanOverlay isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />
    </>
  )
}
