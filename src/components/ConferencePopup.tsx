'use client'

import React, { useState, useEffect } from 'react'

export const ConferencePopup = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-8 left-8 z-[100] max-w-sm w-full animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-brand-purple rounded-3xl p-6 shadow-2xl border-4 border-brand-yellow relative overflow-hidden group">
        {/* Background Decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-yellow/10 rounded-full blur-2xl group-hover:bg-brand-yellow/20 transition-all"></div>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-brand-yellow transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-brand-yellow text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
            Big Event
          </span>
          <h3 className="text-xl font-black text-white mb-2 leading-tight">
            PassionFruits<br/>Conference 2026
          </h3>
          <p className="text-white/70 text-xs mb-6 leading-relaxed">
            Kingdom Influence: Leading a youth culture that is as trendy as it is transformative. Join the movement.
          </p>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-brand-yellow text-slate-900 rounded-xl font-bold text-xs uppercase hover:scale-[1.02] transition-transform">
              Register Now
            </button>
            <button className="px-4 py-3 bg-white/10 text-white rounded-xl font-bold text-xs uppercase hover:bg-white/20 transition-all">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
