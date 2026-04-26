'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activePage, setActivePage] = useState('home')
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  // --- Real State (Functional) ---
  const [posts, setPosts] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [siteSettings, setSiteSettings] = useState({
    adminName: 'PF Leader'
  })

  // Original Values for Reset/Initial
  const defaultPageContent = {
    home: {
      heroTitle: 'PASSION FRUITS',
      heroSubtitle: 'Leading a youth culture that is as trendy as it is transformative. Join the movement of changemakers.',
      confLatestUpdate: 'Latest Update',
      confMainTitle: 'Conference & Events'
    },
    about: {
      massiveTitle: 'We are Creators, not just followers.',
      massiveDesc: 'We break away from rigid traditions to create a space where young people’s creative talents and raw passion become a bridge for the Gospel. We lead a youth culture that is as trendy as it is transformative.',
      creativeCall: 'The Creative Call',
      creativeQuote: '"Art and culture are the most powerful languages we have to communicate the love of Jesus to the next generation."'
    },
    conference: {
      heroDate: 'August 20-22, 2026',
      heroTitle: 'Passion Fruits',
      heroSubtitle: 'JUDGES: Conquest to Conquer',
      verse: '"But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession, that you may declare the praises of him who called you out of darkness into his wonderful light." — 1 Peter 2:9'
    },
    contact: {
      heroTitle: 'Contact',
      infoTitle: "Let's Build the Kingdom Together",
      infoDesc: "Whether you're looking to partner, volunteer, or just say hello, we'd love to hear from you."
    }
  }

  const [pageContent, setPageContent] = useState(defaultPageContent)
  const [mapAddress, setMapAddress] = useState('Toronto, Ontario, Canada')
  const [heroVideoUrl, setHeroVideoUrl] = useState('/hero-video.mp4')

  // --- Form States ---
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    setIsLoaded(true)
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    // Load Gallery from Supabase
    const { data: galleryData, error: galleryError } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (galleryData) setGallery(galleryData)

    // Load from LocalStorage (Temporarily keeping others in LS)
    // Load Site Settings from Supabase
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
    
    if (settingsData) {
      const content = settingsData.find(s => s.key === 'page_content')?.value
      const address = settingsData.find(s => s.key === 'map_address')?.value
      const video = settingsData.find(s => s.key === 'hero_video')?.value
      const settings = settingsData.find(s => s.key === 'admin_settings')?.value

      if (content) setPageContent(content)
      if (address) setMapAddress(address)
      if (video) setHeroVideoUrl(video)
      if (settings) setSiteSettings(settings)
    }

    // Fallback to LocalStorage for backward compatibility
    const savedPosts = localStorage.getItem('pf_posts')
    if (savedPosts) setPosts(JSON.parse(savedPosts))
  }

  // --- Actions ---
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      await Promise.all([
        supabase.from('site_settings').upsert({ key: 'page_content', value: pageContent }),
        supabase.from('site_settings').upsert({ key: 'map_address', value: mapAddress }),
        supabase.from('site_settings').upsert({ key: 'hero_video', value: heroVideoUrl }),
        supabase.from('site_settings').upsert({ key: 'admin_settings', value: siteSettings })
      ])
      alert('All changes saved to Supabase and published!')
    } catch (error: any) {
      alert('Error saving: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleResetDefaults = async () => {
    if (window.confirm('Are you sure you want to reset all content to original values?')) {
      setPageContent(defaultPageContent)
      setMapAddress('Toronto, Ontario, Canada')
      setHeroVideoUrl('/hero-video.mp4')
      alert('Reset locally. Please Save to apply.')
    }
  }

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.title || !newPost.content) return
    const post = {
      id: Date.now(),
      ...newPost,
      date: new Date().toISOString().split('T')[0],
      author: siteSettings.adminName
    }
    const updated = [post, ...posts]
    setPosts(updated)
    localStorage.setItem('pf_posts', JSON.stringify(updated))
    setNewPost({ title: '', content: '' })
  }

  const handleDeletePost = (id: number) => {
    const updated = posts.filter(p => p.id !== id)
    setPosts(updated)
    localStorage.setItem('pf_posts', JSON.stringify(updated))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      // 3. Save to Database
      const { data: insertedData, error: dbError } = await supabase
        .from('gallery')
        .insert([{ url: publicUrl, title: file.name }])
        .select()

      if (dbError) throw dbError
      
      if (insertedData) {
        setGallery([insertedData[0], ...gallery])
      }
      alert('Image uploaded successfully!')
    } catch (error: any) {
      alert('Error uploading image: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async (id: string, url: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return

    try {
      // 1. Delete from Database
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // 2. Delete from Storage (Optional but recommended)
      const fileName = url.split('/').pop()
      if (fileName) {
        await supabase.storage.from('gallery').remove([fileName])
      }

      setGallery(gallery.filter(item => item.id !== id))
    } catch (error: any) {
      alert('Error deleting image: ' + error.message)
    }
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'content', label: 'Site Content', icon: 'description' },
    { id: 'posts', label: 'Board Posts', icon: 'forum' },
    { id: 'gallery', label: 'Gallery Admin', icon: 'image' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]

  const pages = [
    { id: 'home', label: 'Home Page' },
    { id: 'about', label: 'About Page' },
    { id: 'conference', label: 'Conference' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className={`
        w-72 bg-brand-dark text-white p-8 flex flex-col fixed h-full z-20
        transition-all duration-700
        ${isLoaded ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="mb-12 flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl">shield_person</span>
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none">PF Admin</h1>
            <p className="text-[10px] text-white/40 font-black tracking-widest uppercase mt-1">Control Center</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                ${activeTab === item.id ? 'bg-brand-purple text-white shadow-lg' : 'text-white/50 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => router.push('/contact')}
          className="mt-auto flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-colors font-black text-xs uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Exit Admin
        </button>
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1 ml-72 p-12 transition-all duration-[800ms] delay-300
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}>
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tighter">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">
              Welcome back, {siteSettings.adminName}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-3 right-3 w-2 h-2 bg-brand-purple rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#fffbbd] flex items-center justify-center text-brand-dark">
                <span className="material-symbols-outlined text-sm">person_pin</span>
              </div>
              <span className="font-black text-[10px] uppercase tracking-widest text-brand-dark">{siteSettings.adminName}</span>
            </div>
          </div>
        </header>

        {/* Site Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Page Selector */}
            <div className="flex gap-4 p-2 bg-slate-200/50 rounded-2xl w-fit">
              {pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => setActivePage(page.id)}
                  className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activePage === page.id ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-500 hover:text-brand-dark'}`}
                >
                  {page.label}
                </button>
              ))}
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <form onSubmit={handleSaveContent} className="space-y-10">
                {activePage === 'home' && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title</label>
                        <input 
                          type="text"
                          value={pageContent.home.heroTitle}
                          onChange={(e) => setPageContent({...pageContent, home: {...pageContent.home, heroTitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Map Address (Google Maps)</label>
                        <input 
                          type="text"
                          value={mapAddress}
                          onChange={(e) => setMapAddress(e.target.value)}
                          placeholder="e.g. Toronto, Ontario, Canada"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Subtitle</label>
                        <textarea 
                          value={pageContent.home.heroSubtitle}
                          onChange={(e) => setPageContent({...pageContent, home: {...pageContent.home, heroSubtitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold h-32"
                        />
                      </div>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="font-black text-brand-dark uppercase text-sm">Hero Background Video</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Currently: {heroVideoUrl.split('/').pop()}</p>
                        </div>
                        <label className="px-6 py-3 bg-brand-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform">
                          Change Video
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="video/*" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setIsUploading(true)
                              try {
                                const { data, error } = await supabase.storage.from('gallery').upload(`videos/${Date.now()}-${file.name}`, file)
                                if (error) throw error
                                const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(data.path)
                                setHeroVideoUrl(publicUrl)
                              } catch (err: any) { alert(err.message) }
                              finally { setIsUploading(false) }
                            }}
                          />
                        </label>
                      </div>
                      <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group">
                        <video src={heroVideoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">play_circle</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conf Section Subtitle</label>
                        <input 
                          type="text"
                          value={pageContent.home.confLatestUpdate}
                          onChange={(e) => setPageContent({...pageContent, home: {...pageContent.home, confLatestUpdate: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conf Section Title</label>
                        <input 
                          type="text"
                          value={pageContent.home.confMainTitle}
                          onChange={(e) => setPageContent({...pageContent, home: {...pageContent.home, confMainTitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activePage === 'about' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Massive Title</label>
                      <input 
                        type="text"
                        value={pageContent.about.massiveTitle}
                        onChange={(e) => setPageContent({...pageContent, about: {...pageContent.about, massiveTitle: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Massive Description</label>
                      <textarea 
                        value={pageContent.about.massiveDesc}
                        onChange={(e) => setPageContent({...pageContent, about: {...pageContent.about, massiveDesc: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold h-32"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Creative Call Label</label>
                        <input 
                          type="text"
                          value={pageContent.about.creativeCall}
                          onChange={(e) => setPageContent({...pageContent, about: {...pageContent.about, creativeCall: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Creative Quote</label>
                        <input 
                          type="text"
                          value={pageContent.about.creativeQuote}
                          onChange={(e) => setPageContent({...pageContent, about: {...pageContent.about, creativeQuote: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activePage === 'conference' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Date</label>
                        <input 
                          type="text"
                          value={pageContent.conference.heroDate}
                          onChange={(e) => setPageContent({...pageContent, conference: {...pageContent.conference, heroDate: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title</label>
                        <input 
                          type="text"
                          value={pageContent.conference.heroTitle}
                          onChange={(e) => setPageContent({...pageContent, conference: {...pageContent.conference, heroTitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Subtitle</label>
                      <input 
                        type="text"
                        value={pageContent.conference.heroSubtitle}
                        onChange={(e) => setPageContent({...pageContent, conference: {...pageContent.conference, heroSubtitle: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bible Verse</label>
                      <textarea 
                        value={pageContent.conference.verse}
                        onChange={(e) => setPageContent({...pageContent, conference: {...pageContent.conference, verse: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold h-24"
                      />
                    </div>
                  </div>
                )}

                {activePage === 'contact' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title</label>
                      <input 
                        type="text"
                        value={pageContent.contact.heroTitle}
                        onChange={(e) => setPageContent({...pageContent, contact: {...pageContent.contact, heroTitle: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Info Header Title</label>
                      <input 
                        type="text"
                        value={pageContent.contact.infoTitle}
                        onChange={(e) => setPageContent({...pageContent, contact: {...pageContent.contact, infoTitle: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Info Description</label>
                      <textarea 
                        value={pageContent.contact.infoDesc}
                        onChange={(e) => setPageContent({...pageContent, contact: {...pageContent.contact, infoDesc: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold h-32"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <button type="submit" className="flex-1 py-5 bg-brand-purple text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.01] active:scale-95 transition-all">
                    Save Changes & Publish to Site
                  </button>
                  <button 
                    type="button"
                    onClick={handleResetDefaults}
                    className="px-10 py-5 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Board Posts</h4>
                <p className="text-3xl font-black text-brand-dark">{posts.length}</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Gallery Images</h4>
                <p className="text-3xl font-black text-brand-dark">{gallery.length}</p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight mb-8">Quick Post</h3>
              <form onSubmit={handleAddPost} className="space-y-4">
                <input 
                  type="text" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Post Title" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple transition-all font-bold"
                />
                <textarea 
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Content" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple transition-all font-bold h-32"
                />
                <button type="submit" className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest">
                  Create Post
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Board Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">Active Posts</h3>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{posts.length} Total</span>
              </div>
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div>
                      <h4 className="font-black text-brand-dark uppercase text-sm">{post.title}</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">{post.date} • {post.author}</p>
                    </div>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Admin Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">Gallery Management</h3>
                  <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Upload your moments to the cloud</p>
                </div>
                {isUploading && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-brand-purple/10 rounded-xl">
                    <div className="w-4 h-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                    <span className="text-brand-purple font-black text-[10px] uppercase tracking-widest">Uploading to Storage...</span>
                  </div>
                )}
              </div>
              
              <label className={`
                relative flex flex-col items-center justify-center w-full h-64 border-4 border-dashed rounded-[2.5rem] cursor-pointer transition-all duration-500
                ${isUploading ? 'border-slate-100 bg-slate-50 pointer-events-none' : 'border-slate-100 hover:border-brand-purple hover:bg-brand-purple/5 bg-slate-50/50'}
              `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className={`
                    w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-6 transition-transform duration-500
                    ${isUploading ? 'scale-90 opacity-50' : 'group-hover:scale-110 group-hover:rotate-3'}
                  `}>
                    <span className="material-symbols-outlined text-4xl text-brand-purple">add_photo_alternate</span>
                  </div>
                  <p className="text-sm font-black text-brand-dark uppercase tracking-[0.2em] mb-2">Drop images here or click</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support: JPG, PNG, WEBP (Max 5MB)</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={isUploading} />
                
                {isUploading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-[2.5rem] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-xs font-black text-brand-purple uppercase tracking-widest">Processing...</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {gallery.map((item) => (
                <div key={item.id} className="group relative aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                    <p className="text-white font-black text-[10px] uppercase tracking-widest mb-4 truncate">{item.title || 'Untitled'}</p>
                    <button 
                      onClick={() => handleDeleteImage(item.id, item.url)}
                      className="w-full py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500 hover:border-red-500 transition-all duration-300 font-black text-[10px] uppercase tracking-widest"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Remove Image
                    </button>
                  </div>
                </div>
              ))}
              
              {gallery.length === 0 && !isUploading && (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">image_not_supported</span>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No images in gallery yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight mb-8">Admin Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div>
                  <h4 className="font-black text-brand-dark uppercase text-sm">Admin Display Name</h4>
                  <p className="text-xs text-slate-400 font-bold mt-1">Currently: {siteSettings.adminName}</p>
                </div>
                <input 
                  type="text"
                  value={siteSettings.adminName}
                  onChange={(e) => setSiteSettings({...siteSettings, adminName: e.target.value})}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-purple font-bold text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
