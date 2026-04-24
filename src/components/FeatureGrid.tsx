'use client'

import React from 'react'

export const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4 py-16">
      {/* Big Feature 1 */}
      <div className="lg:col-span-8 group relative overflow-hidden rounded-3xl aspect-video bg-slate-200">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200" 
          alt="Conference 2026"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
          <span className="text-brand-yellow font-bold text-sm mb-2">PASSIONFRUITS 2026</span>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
            Kingdom Influence:<br/>Transforming Youth Culture
          </h3>
          <button className="w-fit px-6 py-2 bg-brand-yellow text-slate-900 rounded-full font-bold text-sm">
            Learn More
          </button>
        </div>
      </div>

      {/* Small Grid 1 */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="flex-1 group relative overflow-hidden rounded-3xl bg-brand-purple p-8 flex flex-col justify-center">
          <h4 className="text-brand-yellow font-black text-2xl mb-2">Our Mission</h4>
          <p className="text-white/80 text-sm leading-relaxed">
            Spreading the love of Jesus Christ through the creative language of culture.
          </p>
        </div>
        <div className="flex-1 group relative overflow-hidden rounded-3xl bg-slate-900 p-8 flex flex-col justify-center">
          <h4 className="text-brand-yellow font-black text-2xl mb-2">Join Movement</h4>
          <p className="text-white/80 text-sm">
            Break away from rigid traditions. Join the changemakers.
          </p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="lg:col-span-4 group relative overflow-hidden rounded-3xl aspect-square bg-slate-200">
        <img 
          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" 
          alt="Events"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
          <h4 className="text-white font-bold text-xl">Latest Events</h4>
        </div>
      </div>
      
      <div className="lg:col-span-8 group relative overflow-hidden rounded-3xl aspect-[21/9] bg-slate-200">
        <img 
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200" 
          alt="Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/80 to-transparent p-12 flex flex-col justify-center">
          <h3 className="text-3xl font-black text-white mb-4">Leading Culture with Truth</h3>
          <p className="text-white/80 max-w-md hidden md:block">
            We don’t just follow the culture; we lead it with the truth and love of Jesus.
          </p>
        </div>
      </div>
    </div>
  )
}
