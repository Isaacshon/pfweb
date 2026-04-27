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

  const accentColor = isDarkMode ? 'border-brand-yellow' : 'border-brand-purple'
  const glowColor = isDarkMode ? 'shadow-[0_0_30px_rgba(252,211,77,0.4)]' : 'shadow-[0_0_30px_rgba(109,40,217,0.4)]'

  return (
    <div className="fixed inset-0 z-[100] bg-black animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
      {/* Camera Feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover opacity-70"
      />
      
      {/* Dark Scrim */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      {/* Close Button */}
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
        className="absolute top-16 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"
      >
        <span className="material-icons">close</span>
      </button>

      {/* QR Scanning UI - Focused and Sharp */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-10">
        <div className="relative w-72 h-72">
          {/* Sharp Corners */}
          <div className={`absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 ${accentColor} rounded-tl-3xl ${glowColor}`}></div>
          <div className={`absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 ${accentColor} rounded-tr-3xl ${glowColor}`}></div>
          <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 ${accentColor} rounded-bl-3xl ${glowColor}`}></div>
          <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 ${accentColor} rounded-br-3xl ${glowColor}`}></div>
          
          {/* Animated Scan Line */}
          <div className={`absolute top-0 left-4 right-4 h-[2px] ${isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'} blur-[2px] animate-scan-move opacity-80`}></div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-white text-2xl font-black font-plus-jakarta tracking-tight mb-4 uppercase">QR Scanner</h3>
          <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[200px] mx-auto">
            Place the QR code within the frame to connect immediately
          </p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'} animate-pulse`}></div>
          <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Ready to Scan</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan-move {
          0% { top: 0; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-move {
          animation: scan-move 2.5s infinite linear;
        }
      `}</style>
    </div>
  )
}
