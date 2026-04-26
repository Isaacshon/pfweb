"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', icon: 'home', path: '/app' },
  { label: 'Events', icon: 'calendar_month', path: '/app/schedule' },
  { label: 'Scan', icon: 'qr_code_scanner', path: '/app/scan', isElevated: true },
  { label: 'Community', icon: 'groups', path: '/app/community' },
  { label: 'My', icon: 'person', path: '/app/profile' },
]

export function AppNavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 px-4 pb-2 flex justify-around items-center max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-t-[32px] z-50 border-t border-zinc-100 shadow-[0_-10px_30px_rgba(109,40,217,0.04)] md:max-w-none md:rounded-none">
      {navItems.map((item) => {
        const isActive = pathname === item.path
        
        if (item.isElevated) {
          return (
            <Link 
              key={item.label}
              href={item.path}
              className="relative -top-6 bg-secondary-container text-on-secondary-container rounded-full w-14 h-14 flex items-center justify-center shadow-[0_8px_16px_rgba(253,212,4,0.3)] border-4 border-white active:scale-90 transition-transform duration-200 z-50"
            >
              <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
              <span className="absolute -bottom-7 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.label}</span>
            </Link>
          )
        }

        return (
          <Link
            key={item.label}
            href={item.path}
            className={`flex flex-col items-center gap-1 rounded-2xl transition-all active:scale-90 duration-200 p-2 min-w-[64px] ${
              isActive 
                ? 'text-brand-purple' 
                : 'text-zinc-400 hover:bg-zinc-50'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'fill-icon' : ''}`} 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            <span className="font-plus-jakarta-sans font-semibold text-[10px]">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

const secondaryContainerStyle = `
  .bg-secondary-container { background-color: #fdd404; }
  .text-on-secondary-container { color: #6f5c00; }
  .fill-icon { font-variation-settings: 'FILL' 1; }
`
