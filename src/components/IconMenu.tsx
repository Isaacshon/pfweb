'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export const IconMenu = () => {
  const { t } = useLanguage()

  const menuItems = [
    { icon: 'event', label: t('menu.conf'), subLabel: t('menu.confSub'), href: '/conference' },
    { icon: 'campaign', label: t('menu.events'), subLabel: t('menu.eventsSub'), href: '/events' },
    { icon: 'groups', label: t('menu.about'), subLabel: t('menu.aboutSub'), href: '/about' },
    { icon: 'visibility', label: t('menu.vision'), subLabel: t('menu.visionSub'), href: '/about' },
    { icon: 'mail', label: t('menu.contact'), subLabel: t('menu.contactSub'), href: '/contact' },
    { icon: 'favorite', label: t('menu.support'), subLabel: t('menu.supportSub'), href: '/contact' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 py-20 px-4 max-w-7xl mx-auto">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex flex-col items-center group transition-all"
        >
          <div className="w-20 h-20 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md group-hover:border-brand-purple transition-all">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-brand-purple text-3xl">
              {item.icon}
            </span>
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight text-center">{item.label}</span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider text-center">{item.subLabel}</span>
        </Link>
      ))}
    </div>
  )
}
