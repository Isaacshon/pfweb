"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { ScanOverlay } from './ScanOverlay'
import { useTheme } from '@/context/ThemeContext'

const navItems = [
  { label: 'Home', icon: 'home', path: '/app' },
  { label: 'Service', icon: 'volunteer_activism', path: '/app/service' },
  { label: 'Scan', icon: 'pf_logo', path: '/app/scan', isElevated: true },
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
      if (distance > 80) setIsScanOpen(true)
    }
    setTouchStart(null)
    setCurrentY(null)
    setIsSwiping(false)
  }

  // Dynamic Theme Colors
  const activeColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const bgColor = isDarkMode ? 'bg-[#050505]/95' : 'bg-white/95'
  const borderColor = isDarkMode ? 'border-zinc-900' : 'border-zinc-50'

  return (
    <>
      <nav className={`fixed bottom-0 left-0 right-0 h-24 px-4 pb-6 flex justify-around items-center max-w-md mx-auto ${bgColor} backdrop-blur-md rounded-t-[40px] z-50 border-t ${borderColor} shadow-[0_-10px_40px_rgba(0,0,0,0.03)] md:max-w-none md:rounded-none transition-colors duration-500`}>
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
                className="relative -top-8 cursor-pointer"
              >
                <div 
                  className={`${isDarkMode ? 'bg-zinc-900 border-zinc-950' : 'bg-white border-white'} rounded-full w-20 h-20 flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.1)] border-[4px] overflow-hidden transition-all duration-300 active:scale-90`}
                  style={{
                    transform: isSwiping && touchStart && currentY 
                      ? `translateY(${Math.max(-40, currentY - touchStart)}px)` 
                      : 'translateY(0)'
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image 
                      src="/images/pf-character.png" 
                      alt="PF Character" 
                      fill 
                      className="object-cover scale-125"
                    />
                  </div>
                </div>
                <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.2em] text-center w-full ${activeColor}`}>Scan</span>
              </div>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 duration-200 min-w-[60px] ${
                isActive ? activeColor : 'text-slate-400'
              }`}
            >
              <span className="material-icons text-[26px]">
                {item.icon}
              </span>
              <span className="font-plus-jakarta font-black text-[9px] uppercase tracking-widest">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <ScanOverlay isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />
    </>
  )
}
