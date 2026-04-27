"use client"

import React, { useEffect, useRef } from 'react'

interface ScanOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function ScanOverlay({ isOpen, onClose }: ScanOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Start camera
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (err) {
          console.error('Camera access denied:', err)
        }
      }
      startCamera()
    } else {
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [isOpen])

  return (
    <div 
      className={`fixed inset-0 z-[100] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] bg-black overflow-hidden ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Silky Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex flex-col">
          <span className="text-brand-yellow font-black text-[10px] uppercase tracking-[0.3em]">Scanner</span>
          <h2 className="text-white font-plus-jakarta font-black text-2xl tracking-tighter">PassionFruits</h2>
        </div>
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-75 transition-all"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      {/* Camera Viewport */}
      <div className="w-full h-full relative">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          className="w-full h-full object-cover grayscale contrast-125"
        />
        
        {/* Scanning Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-brand-purple/50 rounded-[40px] relative">
            <div className="absolute inset-0 border-2 border-brand-yellow rounded-[40px] animate-pulse"></div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-yellow shadow-[0_0_15px_rgba(253,212,4,0.8)] animate-scan-line"></div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4 animate-bounce">
        <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">Scanning for life...</p>
      </div>

      <style jsx>{`
        @keyframes scan-line {
          0% { transform: translateY(-120px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(120px); opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </div>
  )
}
