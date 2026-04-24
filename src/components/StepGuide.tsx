'use client'

import React from 'react'

const steps = [
  { icon: 'waving_hand', title: 'Welcome', desc: 'New Here?' },
  { icon: 'info', title: 'About', desc: 'Our Movement' },
  { icon: 'lightbulb', title: 'Vision', desc: 'Our Dream' },
  { icon: 'add_task', title: 'Join Us', desc: 'Get Involved' },
]

export const StepGuide = () => {
  return (
    <div className="bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-brand-purple font-bold text-sm tracking-widest uppercase mb-2 block">New Here?</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">New to PassionFruits?</h2>
        </div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -translate-y-1/2 hidden md:block z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:border-brand-purple group-hover:bg-brand-purple/5 transition-all duration-300">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-brand-purple text-3xl">
                  {step.icon}
                </span>
              </div>
              <h4 className="font-black text-slate-800 mb-1">{step.title}</h4>
              <p className="text-xs text-slate-400 font-medium">{step.desc || step.subLabel}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-10 py-3 border-2 border-brand-purple text-brand-purple rounded-full font-bold hover:bg-brand-purple hover:text-white transition-all">
            More Information
          </button>
        </div>
      </div>
    </div>
  )
}
