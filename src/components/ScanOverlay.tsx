"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import jsQR from 'jsqr'

interface ScanOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function ScanOverlay({ isOpen, onClose }: ScanOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDarkMode } = useTheme()
  const [scannedResult, setScannedResult] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
    let animationFrame: number

    async function setupCamera() {
      if (isOpen) {
        setScannedResult(null)
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
          tick()
        } catch (err) {
          console.error("Camera error:", err)
        }
      }
    }

    function tick() {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (ctx) {
          canvas.height = videoRef.current.videoHeight
          canvas.width = videoRef.current.videoWidth
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          })

          if (code && code.data) {
            console.log("Found QR code", code.data)
            setScannedResult(code.data)
            
            // Haptic Feedback
            if (window.navigator.vibrate) window.navigator.vibrate(100)
            
            // Auto-open if it's a URL
            if (code.data.startsWith('http')) {
              setTimeout(() => {
                window.location.href = code.data
              }, 1000)
            }
            return // Stop scanning after success
          }
        }
      }
      animationFrame = requestAnimationFrame(tick)
    }

    setupCamera()

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop())
      cancelAnimationFrame(animationFrame)
    }
  }, [isOpen])

  if (!isOpen) return null

  const accentColor = isDarkMode ? 'border-brand-yellow' : 'border-brand-purple'
  const accentText = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'

  return (
    <div className="fixed inset-0 z-[100] bg-black animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] font-pretendard">
      {/* Hidden Canvas for Decoding */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className={`w-full h-full object-cover transition-opacity duration-500 ${scannedResult ? 'opacity-30' : 'opacity-70'}`}
      />
      
      {/* Dark Scrim */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      {/* Close Button */}
      {!scannedResult && (
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
          className="absolute top-16 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer z-50"
        >
          <span className="material-icons">close</span>
        </button>
      )}

      {/* QR Scanning UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-10">
        <div className="relative w-72 h-72">
          {/* Sharp Corners */}
          <div className={`absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 ${accentColor} rounded-tl-3xl shadow-2xl`}></div>
          <div className={`absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 ${accentColor} rounded-tr-3xl shadow-2xl`}></div>
          <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 ${accentColor} rounded-bl-3xl shadow-2xl`}></div>
          <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 ${accentColor} rounded-br-3xl shadow-2xl`}></div>
          
          {/* Animated Scan Line (Only if not scanned) */}
          {!scannedResult && (
            <div className={`absolute top-0 left-4 right-4 h-[2px] ${isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'} blur-[2px] animate-scan-move opacity-80`}></div>
          )}

          {/* Success Icon */}
          {scannedResult && (
            <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-500">
              <span className={`material-icons text-8xl ${accentText}`}>check_circle</span>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          {scannedResult ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <h3 className="text-white text-2xl font-black tracking-tight uppercase">Successfully Scanned</h3>
              <p className="text-white/60 text-sm font-medium break-all px-4">{scannedResult}</p>
              <div className="flex items-center justify-center gap-2 pt-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Opening Link...</span>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-white text-2xl font-black tracking-tight mb-4 uppercase">QR Scanner</h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[200px] mx-auto">
                Place the QR code within the frame to connect immediately
              </p>
            </>
          )}
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
