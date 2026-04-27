"use client"

import React, { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'

interface ScanOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function ScanOverlay({ isOpen, onClose }: ScanOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    let stream: MediaStream | null = null

    async function setupCamera() {
      if (isOpen) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (err) {
          console.error("Camera error:", err)
        }
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'

  return (
    <div className={`fixed inset-0 z-[100] ${isDarkMode ? 'bg-black' : 'bg-white'} overflow-hidden animate-in slide-in-from-bottom duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] font-pretendard`}>
      {/* Liquid Background Element (Top Left) */}
      <div className={`absolute -top-20 -left-20 w-80 h-80 rounded-full blur-[100px] opacity-20 ${accentBg}`}></div>
      
      {/* Camera Feed Container */}
      <div className={`absolute inset-0 z-0 ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Fallback pattern / gradient */}
        <div className={`absolute inset-0 opacity-20 ${isDarkMode ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-yellow/20 to-transparent' : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-purple/10 to-transparent'}`}></div>
        {/* Camera Overlay Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? 'from-black/60 via-transparent to-black/80' : 'from-white/60 via-transparent to-white/80'}`}></div>
      </div>


      {/* Reference Style Layout */}
      <div className="relative z-10 w-full h-full flex flex-col p-8 pt-24">
        {/* Dynamic Liquid Wave (Reference Inspired) */}
        <div className={`absolute top-0 right-0 w-[60%] h-full pointer-events-none transition-all duration-1000 ${isDarkMode ? 'bg-brand-yellow/10' : 'bg-brand-purple/10'}`} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 40% 60%, 20% 0)' }}></div>

        {/* Big Bold Title (Stacked like reference) */}
        <div className="mb-12 relative">
          <p className={`text-[12px] font-black uppercase tracking-[0.4em] mb-2 opacity-40 ${isDarkMode ? 'text-white' : 'text-black'}`}>Capture the Light</p>
          <h2 className={`text-7xl font-black leading-[0.85] tracking-tighter ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
            SCAN<br/>
            <span className={accentColor}>CODE</span>
          </h2>
          {/* Decorative Dot */}
          <div className={`mt-6 w-2 h-2 rounded-full ${accentBg}`}></div>
        </div>

        {/* Minimalist Instructions */}
        <div className="max-w-[180px] space-y-4">
          <p className={`text-sm font-medium leading-relaxed opacity-60 ${isDarkMode ? 'text-white' : 'text-zinc-600'}`}>
            PassionFruits의 빛나는 커뮤니티로 연결되는 가장 빠른 방법입니다.
          </p>
          <div className={`w-12 h-[2px] ${accentBg} opacity-20`}></div>
        </div>

        {/* Central Scan Area (Refined guide) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-64 h-64 group">
            {/* Liquid Corners */}
            <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${isDarkMode ? 'border-brand-yellow' : 'border-brand-purple'} rounded-tl-2xl opacity-40`}></div>
            <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${isDarkMode ? 'border-brand-yellow' : 'border-brand-purple'} rounded-tr-2xl opacity-40`}></div>
            <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${isDarkMode ? 'border-brand-yellow' : 'border-brand-purple'} rounded-bl-2xl opacity-40`}></div>
            <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${isDarkMode ? 'border-brand-yellow' : 'border-brand-purple'} rounded-br-2xl opacity-40`}></div>
            
            {/* Animated Scan Line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${accentBg} blur-sm opacity-50 animate-scan-move`}></div>
            
            {/* Center Focus Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-1 h-1 rounded-full ${accentBg} opacity-20`}></div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto flex justify-between items-end">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest opacity-30 ${isDarkMode ? 'text-white' : 'text-black'}`}>v1.0.4 - PassionFruits</span>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border`}
          >
            <span className={`material-icons text-2xl ${isDarkMode ? 'text-white' : 'text-zinc-400'}`}>close</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan-move {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-move {
          animation: scan-move 3s infinite ease-in-out;
        }
        .font-pretendard {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
        }
      `}</style>
    </div>
  )
}
