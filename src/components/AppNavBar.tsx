"use client"

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', icon: 'home', path: '/app' },
  { label: 'Service', icon: 'volunteer_activism', path: '/app/service' },
  { label: 'Scan', icon: 'qr_code_scanner', path: '/app/scan', isElevated: true },
  { label: 'Community', icon: 'groups', path: '/app/community' },
  { label: 'My', icon: 'profile', path: '/app/profile' },
]

export function AppNavBar() {
  const pathname = usePathname()
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const scanButtonRef = useRef<HTMLAnchorElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.targetTouches[0].clientY
    const distance = touchStart - touchEnd
    
    // Detect swipe up (upwards motion is negative Y difference, but we subtract touchEnd from touchStart)
    if (distance > 50) { // 50px threshold for swipe up
      setIsSwiping(true)
    }
  }

  const handleTouchEnd = () => {
    if (isSwiping) {
      // Trigger Camera / Scan Action
      alert('Camera Opening (Swipe Up Detected!)')
      // In a real implementation: window.location.href = '/app/scan' or open camera modal
      setIsSwiping(false)
    }
    setTouchStart(null)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 px-4 pb-2 flex justify-around items-center max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-t-[32px] z-50 border-t border-zinc-100 shadow-[0_-10px_30px_rgba(109,40,217,0.04)] md:max-w-none md:rounded-none">
      {navItems.map((item) => {
        const isActive = pathname === item.path || (item.path === '/app/profile' && pathname === '/app/profile')
        
        if (item.isElevated) {
          return (
            <Link 
              key={item.label}
              href={item.path}
              ref={scanButtonRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative -top-6 bg-brand-yellow text-brand-dark rounded-full w-14 h-14 flex items-center justify-center shadow-[0_8px_16px_rgba(253,212,4,0.3)] border-4 border-white active:scale-90 transition-all z-50 ${isSwiping ? '-translate-y-4 shadow-2xl' : ''}`}
            >
              <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
              <span className="absolute -bottom-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
            </Link>
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
                : 'text-slate-400 hover:bg-slate-50'
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
  )
}
