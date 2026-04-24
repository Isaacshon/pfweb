'use client'

import React from 'react'

const menuItems = [
  { icon: 'event', label: '2026 Conf', subLabel: 'Conference' },
  { icon: 'campaign', label: 'Events', subLabel: 'Kingdom News' },
  { icon: 'groups', label: 'About Us', subLabel: 'Our Story' },
  { icon: 'visibility', label: 'Vision', subLabel: 'Our Vision' },
  { icon: 'mail', label: 'Contact', subLabel: 'Get in Touch' },
  { icon: 'favorite', label: 'Support', subLabel: 'Sponsorship' },
]

export const IconMenu = () => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 py-12 px-4 max-w-5xl mx-auto">
      {menuItems.map((item, index) => (
        <button
          key={index}
          className="flex flex-col items-center group transition-all hover:-translate-y-1"
        >
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:border-brand-yellow group-hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-brand-yellow text-3xl">
              {item.icon}
            </span>
          </div>
          <span className="text-sm font-bold text-slate-800">{item.label}</span>
          <span className="text-[10px] text-slate-400 font-medium">{item.subLabel}</span>
        </button>
      ))}
    </div>
  )
}
