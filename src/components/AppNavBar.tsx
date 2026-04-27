"use client"

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScanOverlay } from './ScanOverlay'

const navItems = [
  { label: 'Home', icon: 'home', path: '/app' },
  { label: 'Service', icon: 'volunteer_activism', path: '/app/service' },
  { label: 'Scan', icon: 'pf_logo', path: '/app/scan', isElevated: true },
  { label: 'Community', icon: 'groups', path: '/app/community' },
  { label: 'My', icon: 'profile', path: '/app/profile' },
]

export function AppNavBar() {
  const pathname = usePathname()
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
    
    const distance = touchStart - touchEnd
    if (distance > 60) {
      // Trigger early if needed, or wait for release
    }
  }

  const handleTouchEnd = () => {
    if (touchStart !== null && currentY !== null) {
      const distance = touchStart - currentY
      if (distance > 80) { // Silk threshold
        setIsScanOpen(true)
      }
    }
    setTouchStart(null)
    setCurrentY(null)
    setIsSwiping(false)
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 h-20 px-4 pb-2 flex justify-around items-center max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-t-[32px] z-50 border-t border-zinc-100 shadow-[0_-10px_30px_rgba(109,40,217,0.04)] md:max-w-none md:rounded-none">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/app/profile' && pathname === '/app/profile')
          
          if (item.isElevated) {
            return (
              <div 
                key={item.label}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsScanOpen(true)}
                className="relative -top-7 cursor-pointer group"
              >
                {/* Visual Feedback during swipe */}
                <div 
                  className="bg-brand-purple text-white rounded-full w-16 h-16 flex items-center justify-center shadow-[0_12px_24px_rgba(109,40,217,0.3)] border-4 border-white transition-all duration-300 active:scale-90 group-hover:shadow-brand-purple/40"
                  style={{
                    transform: isSwiping && touchStart && currentY 
                      ? `translateY(${Math.max(-40, currentY - touchStart)}px) scale(${1 + Math.min(0.2, (touchStart - currentY) / 500)})` 
                      : 'translateY(0) scale(1)'
                  }}
                >
                  {/* PF Logo with Premium Styling */}
                  <div className="flex flex-col items-center leading-none">
                    <span className="font-space-grotesk font-black text-[22px] tracking-tighter">PF</span>
                  </div>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-brand-purple/40 uppercase tracking-widest text-center w-full">Scan</span>
              </div>
            )
          }

          const iconName = item.icon === 'profile' ? 'person' : item.icon

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex flex-col items-center gap-1 rounded-2xl transition-all active:scale-90 duration-200 p-2 min-w-[64px] ${
                isActive 
                  ? 'text-brand-purple' 
                  : 'text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined" 
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {iconName}
              </span>
              <span className="font-plus-jakarta-sans font-bold text-[10px]">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* The Silky Camera Overlay */}
      <ScanOverlay isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />
    </>
  )
}
