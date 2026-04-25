'use client'

import Link from 'next/link'
import React, { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Open mailto as a simple contact action
    const subject = encodeURIComponent(`Message from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.open(`mailto:passionfruits.ministry@gmail.com?subject=${subject}&body=${body}`)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-[100] flex justify-between items-center px-6 md:px-16 py-6 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <Link href="/"><img src="/logo.png" alt="PassionFruits" className="h-20 md:h-28 w-auto -my-4 drop-shadow-md" /></Link>
        <nav className="hidden lg:flex gap-12 text-slate-600 font-black text-[11px] uppercase tracking-[0.25em]">
          <Link href="/" className="hover:text-brand-purple transition-all">Home</Link>
          <Link href="/conference" className="hover:text-brand-purple transition-all">Conference</Link>
          <Link href="/events" className="hover:text-brand-purple transition-all">Events</Link>
          <Link href="/about" className="hover:text-brand-purple transition-all">About</Link>
        </nav>
        <span className="px-10 py-3 bg-brand-dark text-white rounded-full font-black text-xs uppercase tracking-widest">Contact</span>
      </header>

      {/* Hero */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-brand-purple font-black text-sm tracking-widest uppercase mb-4 block">Get in Touch</span>
          <h1 className="text-6xl md:text-8xl font-black text-brand-dark uppercase tracking-tighter">Contact Us</h1>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-slate-50 rounded-3xl p-10 md:p-14 border border-slate-100">
            {submitted ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-brand-purple text-6xl mb-6 block">check_circle</span>
                <h3 className="font-black text-3xl text-brand-dark mb-4">Message Sent!</h3>
                <p className="text-slate-500 font-medium">Thank you for reaching out. We'll get back to you soon.</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 px-10 py-3 bg-brand-purple text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="font-black text-sm text-brand-dark uppercase tracking-widest mb-2 block">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-brand-dark focus:outline-none focus:border-brand-purple transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="font-black text-sm text-brand-dark uppercase tracking-widest mb-2 block">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-brand-dark focus:outline-none focus:border-brand-purple transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="font-black text-sm text-brand-dark uppercase tracking-widest mb-2 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-brand-dark focus:outline-none focus:border-brand-purple transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-brand-purple text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-purple-deep transition-all shadow-lg">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-4xl font-black text-brand-dark mb-6">We'd Love to<br/>Hear From You</h2>
              <p className="text-slate-500 font-medium leading-relaxed text-lg">
                Have questions about PassionFruits, our events, or how to get involved? Reach out and we'll connect with you.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-[#fffbbd] flex items-center justify-center text-brand-dark">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <div>
                  <h4 className="font-black text-brand-dark">Email</h4>
                  <a href="mailto:passionfruits.ministry@gmail.com" className="text-brand-purple font-bold text-sm hover:underline">passionfruits.ministry@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-[#9a78b4] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-2xl">photo_camera</span>
                </div>
                <div>
                  <h4 className="font-black text-brand-dark">Instagram</h4>
                  <a href="https://www.instagram.com/passionfruits_ministry/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold text-sm hover:underline">@passionfruits_ministry</a>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-brand-dark flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <h4 className="font-black text-brand-dark">Location</h4>
                  <p className="text-slate-500 font-bold text-sm">Toronto, Ontario, Canada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
