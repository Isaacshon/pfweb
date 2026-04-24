'use client'

import React, { useState, useEffect } from 'react'

export const ConferencePopup = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Check if user has opted out for the day
    const lastClosed = localStorage.getItem('conference_popup_closed')
    const today = new Date().toDateString()
    
    if (lastClosed !== today) {
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
    }, 300)
  }

  const handleDontShowToday = () => {
    const today = new Date().toDateString()
    localStorage.setItem('conference_popup_closed', today)
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full max-w-[400px] aspect-[3/4] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-500 transition-transform ${isClosing ? 'scale-95' : 'scale-100'}`}>
        
        {/* Full-bleed Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
            alt="Conference 2026"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        </div>

        {/* Close Button (Inside Card, Top-Right) */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-all border border-white/20"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Content (Center Aligned) */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
          <div className="mt-auto">
            <span className="inline-block px-4 py-1 bg-brand-yellow text-slate-900 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              Coming Soon
            </span>
            <h3 className="text-3xl font-black text-white mb-3 leading-tight uppercase tracking-tighter">
              PassionFruits<br/>Conference 2026
            </h3>
            <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-[280px] mx-auto">
              Leading a youth culture that is as trendy as it is transformative. Join the movement.
            </p>
            <button className="w-full py-4 bg-brand-yellow text-slate-900 rounded-2xl font-black text-sm uppercase shadow-[0_8px_25px_rgba(248,200,72,0.4)] hover:scale-[1.02] transition-transform active:scale-95 mb-4">
              Register Now
            </button>
            <button className="text-white/60 text-xs font-bold hover:text-white transition-colors underline underline-offset-4">
              View Event Details
            </button>
          </div>
        </div>
      </div>

      {/* "Do Not Show Again" Button (Below the Card, Centered) */}
      <button 
        onClick={handleDontShowToday}
        className="mt-6 relative z-10 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 hover:text-white transition-all animate-in slide-in-from-top-4 fade-in duration-700"
      >
        Do not show this again today
      </button>
    </div>
  )
}
