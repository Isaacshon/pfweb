"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScanOverlay } from './ScanOverlay'

const navItems = [
  { label: 'Home', icon: 'home', path: '/app' },
  { label: 'Service', icon: 'volunteer_activism', path: '/app/service' },
  { label: 'Scan', icon: 'pf_logo', path: '/app/scan', isElevated: true },
  { label: 'Community', icon: 'groups', path: '/app/community' },
  { label: 'My', icon: 'person', path: '/app/profile' },
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

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 h-24 px-4 pb-6 flex justify-around items-center max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-t-[40px] z-50 border-t border-zinc-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] md:max-w-none md:rounded-none">
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
                className="relative -top-6 cursor-pointer"
              >
                <div 
                  className="bg-brand-purple text-white rounded-full w-16 h-16 flex items-center justify-center shadow-[0_15px_30px_rgba(109,40,217,0.3)] border-[6px] border-white transition-all duration-300 active:scale-90"
                  style={{
                    transform: isSwiping && touchStart && currentY 
                      ? `translateY(${Math.max(-40, currentY - touchStart)}px)` 
                      : 'translateY(0)'
                  }}
                >
                  <span className="font-space-grotesk font-black text-[22px] tracking-tighter">PF</span>
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-brand-purple/40 uppercase tracking-[0.2em] text-center w-full">Scan</span>
              </div>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 duration-200 min-w-[60px] ${
                isActive ? 'text-brand-purple' : 'text-slate-300'
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
