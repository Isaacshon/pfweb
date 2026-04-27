"use client"

import React from 'react'
import { useTheme } from '@/context/ThemeContext'

interface CommunityTutorialProps {
  onClose: () => void
}

export function CommunityTutorial({ onClose }: CommunityTutorialProps) {
  const { isDarkMode } = useTheme()

  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white'

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-500 font-pretendard">
      <div 
        className={`w-full max-w-sm p-10 rounded-[48px] ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border shadow-2xl space-y-8 animate-in zoom-in-95 duration-500`}
      >
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-zinc-500/10 mb-2">
            <span className={`material-icons text-5xl ${accentColor}`}>hub</span>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight leading-tight">Welcome to<br/>PF Community</h2>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">
              Share your meditations and prayers with brothers and sisters around the world.
            </p>
          </div>

          <div className="w-full space-y-4 pt-4">
            <div className="flex items-center gap-4 text-left">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-zinc-500/10 text-[14px] ${accentColor} font-black`}>1</div>
              <p className="text-[13px] font-bold opacity-80">Hold the Like button to see more stickers.</p>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-zinc-500/10 text-[14px] ${accentColor} font-black`}>2</div>
              <p className="text-[13px] font-bold opacity-80">Swipe up from the bottom bar to scan QR.</p>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-zinc-500/10 text-[14px] ${accentColor} font-black`}>3</div>
              <p className="text-[13px] font-bold opacity-80">Check out the new comment system below.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] ${accentBg} shadow-xl active:scale-95 transition-all mt-4`}
          >
            Start Sharing
          </button>
        </div>
      </div>
    </div>
  )
}
