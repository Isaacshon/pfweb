'use client'

import React from 'react'

const steps = [
  { icon: 'auto_awesome', title: 'Worship', desc: 'Encounter Jesus' },
  { icon: 'palette', title: 'Creativity', desc: 'The Gospel Arts' },
  { icon: 'public', title: 'Missions', desc: 'Global Impact' },
  { icon: 'star', title: 'Influence', desc: 'Kingdom Culture' },
]

export const StepGuide = ({ 
  items = steps, 
  title = 'PassionFruits Journey', 
  subtitle = 'Our Path' 
}: { 
  items?: any[], 
  title?: string, 
  subtitle?: string 
}) => {
  return (
    <div className="bg-white py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 break-keep">
          <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-4 block">{subtitle}</span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark uppercase tracking-tighter">{title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {items.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                {/* Decorative Circle */}
                <div className="absolute inset-0 bg-slate-50 border border-slate-100 rounded-full group-hover:border-brand-purple group-hover:bg-brand-purple/5 transition-all duration-500 group-hover:scale-110" />
                {step.iconUrl ? (
                  <img src={step.iconUrl} className="relative z-10 w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500" alt={step.title} />
                ) : (
                  <span className="material-icons relative z-10 text-brand-purple/30 group-hover:text-brand-purple text-6xl transition-all duration-500 transform group-hover:rotate-12">
                    {step.icon}
                  </span>
                )}
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-dark text-white rounded-full flex items-center justify-center text-xs font-black border-4 border-white shadow-md">
                  {index + 1}
                </div>
              </div>
              <h4 className="text-xl font-black text-brand-dark mb-1 uppercase tracking-tight group-hover:text-brand-purple transition-colors">{step.title}</h4>
              <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
