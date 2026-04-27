"use client"

import React from 'react'

interface AppTopBarProps {
  title?: string
  showAvatar?: boolean
  showNotifications?: boolean
}

export function AppTopBar({ 
  title = "PassionFruits", 
  showAvatar = true, 
  showNotifications = true 
}: AppTopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/80 backdrop-blur-md">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {showAvatar && (
            <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCWtmK3Odz3fLCQYWmyFCitM0birngut17INNI3qYKaRdlCj8OY6uLoEzuSHifjvrQ12DRLK7m26qex2SyDTmY21_oOtLd5E6x-KCl1-sdlMXeEIHHg7xm6dg7YMVrCh2NB_QBANpECqr3qquk-Or2NILF7x9Td7bgsBpGhrspCaHOZW0sEEqfwtcOZvwQYkGJP5ZRaTWqXLcypi260XepvbskbSzixS3EUtMiJ0DTu_jyGiNzcwki8yQ8DRF9ouJ_kECVy92IJxQ" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span className="font-plus-jakarta-sans font-bold text-lg text-brand-purple">
            {title}
          </span>
        </div>
        
        {showNotifications && (
          <button className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-brand-purple transition-colors active:scale-95">
            <span className="material-icons text-[24px]">notifications</span>
          </button>
        )}
      </div>
    </header>
  )
}
