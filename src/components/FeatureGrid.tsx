'use client'

import React from 'react'
import Link from 'next/link'

export const FeatureGrid = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Big Feature */}
      <div className="lg:col-span-8 group relative h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] bg-brand-dark shadow-2xl">
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[2s]"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12">
          <span className="text-[#fffbbd] font-black text-xs tracking-widest uppercase mb-4 block">Major Event</span>
          <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Kingdom Influence:<br/><span className="text-[#9a78b4]">Conf 2026</span>
          </h3>
          <Link href="/conference" className="inline-block px-10 py-4 bg-white text-brand-dark rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
            Join the Movement
          </Link>
        </div>
      </div>

      {/* Small Grid */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <Link href="/about" className="flex-1 group relative overflow-hidden rounded-3xl bg-brand-purple p-8 flex flex-col justify-center shadow-lg text-white hover:scale-[1.02] transition-all">
          <h4 className="text-brand-yellow font-black text-2xl mb-2">Our Mission</h4>
          <p className="text-sm font-bold opacity-80 leading-relaxed">
            Spreading the love of Jesus Christ through the creative language of culture.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </Link>
        
        <Link href="/about" className="flex-1 group relative overflow-hidden rounded-3xl bg-brand-dark p-8 flex flex-col justify-center shadow-lg text-white hover:scale-[1.02] transition-all">
          <h4 className="text-brand-yellow font-black text-2xl mb-2">Join Movement</h4>
          <p className="text-sm font-bold opacity-70 leading-relaxed">
            Leading a youth culture that is as trendy as it is transformative.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            About Us <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
