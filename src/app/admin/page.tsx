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
    adminName: 'PF Leader',
    faviconUrl: ''
  })

  // Original Values for Reset/Initial
  const defaultPageContent = {
    home: {
      heroTitle: 'PassionFruits Ministry',
      heroSubtitle: 'Retro Roots, Future Vision.',
      confLatestUpdate: 'Latest Update',
      journeyTitle: 'PASSIONFRUITS JOURNEY',
      journeySubtitle: 'OUR PATH',
      journeyItems: [
        { icon: 'flare', title: 'WORSHIP', desc: 'ENCOUNTER JESUS', iconUrl: '' },
        { icon: 'palette', title: 'CREATIVITY', desc: 'THE GOSPEL ARTS', iconUrl: '' },
        { icon: 'public', title: 'MISSIONS', desc: 'GLOBAL IMPACT', iconUrl: '' },
        { icon: 'star', title: 'INFLUENCE', desc: 'KINGDOM CULTURE', iconUrl: '' }
      ],
      menuItems: [
        { icon: 'event', label: 'Conference', subLabel: '2026 Conf', iconUrl: '' },
        { icon: 'campaign', label: 'Events', subLabel: 'Kingdom News', iconUrl: '' },
        { icon: 'groups', label: 'About', subLabel: 'Our Story', iconUrl: '' },
        { icon: 'visibility', label: 'Vision', subLabel: 'Our Vision', iconUrl: '' },
        { icon: 'mail', label: 'Contact', subLabel: 'Get in Touch', iconUrl: '' },
        { icon: 'favorite', label: 'Support', subLabel: 'Sponsorship', iconUrl: '' }
      ]
    },
    about: {
      heroTitle: 'About Us',
      quote: '"We are a generation called to bring the light of the Gospel into the heart of youth culture."',
      visionTitle: 'Our Vision',
      visionDesc: 'Flipping the world upside down through the creative language of youth culture. We believe in the power of authenticity, creativity, and unwavering faith.',
      beliefs: [
        { icon: 'menu_book', title: 'The Bible — Our Compass', desc: 'We believe the Holy Bible is the infallible Word of God.', iconUrl: '' },
        { icon: 'diversity_3', title: 'God — The Creator', desc: 'We believe in the one true, living God.', iconUrl: '' },
        { icon: 'church', title: 'Jesus Christ — Our Only Way', desc: 'Jesus is fully God and fully man.', iconUrl: '' },
        { icon: 'local_fire_department', title: 'Holy Spirit — Our Guide', desc: 'The Holy Spirit dwells within us.', iconUrl: '' },
        { icon: 'card_giftcard', title: 'Salvation — The Ultimate Gift', desc: 'Salvation is a free gift of grace.', iconUrl: '' },
        { icon: 'healing', title: 'Mankind — Restoration', desc: 'Every human being needs restoration through Jesus.', iconUrl: '' }
      ],
      ministries: [
        { icon: 'music_note', title: 'Worship & Unity', desc: 'Every Monday, our Worship Night serves as a spiritual engine.', iconUrl: '' },
        { icon: 'public', title: 'Global Missions', desc: 'Our mission teams actively serve in Europe and Latin America.', iconUrl: '' },
        { icon: 'theater_comedy', title: '"The Gospel" (Cultural Arts)', desc: 'Through our original musical production, we provide a platform for youth.', iconUrl: '' }
      ]
    },
    conference: {
      heroDate: 'August 20-22, 2026',
      heroTitle: 'JUDGES',
      heroSubtitle: 'Conquest to Conquer',
      verse: '"But you are a chosen people, a royal priesthood, a holy nation..." — 1 Peter 2:9',
      speakers: [
        { name: 'Guest Speaker 1', role: 'To be announced' },
        { name: 'Guest Speaker 2', role: 'To be announced' }
      ]
    },
    events: {
      heroTitle: 'Events & Updates',
      heroSubtitle: 'Latest happenings and important notices from our ministry hub.'
    },
    contact: {
      heroTitle: 'Contact',
      infoTitle: "Let's Build the Kingdom Together",
      infoDesc: "Whether you're looking to partner, volunteer, or just say hello, we'd love to hear from you.",
      addressTitle: "Toronto Office",
      addressDetail: "Toronto, Ontario, Canada",
      emailTitle: "General Inquiries",
      emailDetail: "passionfruits.ministry@gmail.com"
    }
  }

  const [pageContent, setPageContent] = useState<any>(defaultPageContent)
  const [mapAddress, setMapAddress] = useState('Toronto, Ontario, Canada')
  const [heroVideoUrl, setHeroVideoUrl] = useState('/hero-video.mp4')
  const [aboutImageUrl, setAboutImageUrl] = useState('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80')

  // --- Form States ---
  const [newPost, setNewPost] = useState({ title: '', content: '' })

  useEffect(() => {
    setIsLoaded(true)
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    const { data: galleryData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    if (galleryData) setGallery(galleryData)

    const { data: postsData } = await supabase.from('posts').select('*').order('date', { ascending: false })
    if (postsData) setPosts(postsData)

    const { data: settingsData } = await supabase.from('site_settings').select('*')
    if (settingsData) {
      const content = settingsData.find(s => s.key === 'page_content')?.value
      const address = settingsData.find(s => s.key === 'map_address')?.value
      const video = settingsData.find(s => s.key === 'hero_video')?.value
      const aboutImg = settingsData.find(s => s.key === 'about_image')?.value
      const settings = settingsData.find(s => s.key === 'admin_settings')?.value

      if (content) {
        setPageContent({
          ...defaultPageContent,
          ...content,
          home: { ...defaultPageContent.home, ...content.home },
          about: { ...defaultPageContent.about, ...content.about },
          conference: { ...defaultPageContent.conference, ...content.conference },
          events: { ...defaultPageContent.events, ...(content.events || {}) },
          contact: { ...defaultPageContent.contact, ...content.contact }
        })
      }
      if (address) setMapAddress(address)
      if (video) setHeroVideoUrl(video)
      if (aboutImg) setAboutImageUrl(aboutImg)
      if (settings) setSiteSettings(settings)
    }
  }

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      await Promise.all([
        supabase.from('site_settings').upsert({ key: 'page_content', value: pageContent }),
        supabase.from('site_settings').upsert({ key: 'map_address', value: mapAddress }),
        supabase.from('site_settings').upsert({ key: 'hero_video', value: heroVideoUrl }),
        supabase.from('site_settings').upsert({ key: 'about_image', value: aboutImageUrl }),
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

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.title || !newPost.content) return

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ 
          title: newPost.title, 
          content: newPost.content, 
          author: siteSettings.adminName || 'PF Leader', 
          date: new Date().toISOString().split('T')[0] 
        }])
        .select()
      
      if (error) throw error
      if (data) setPosts([data[0], ...posts])
      setNewPost({ title: '', content: '' })
    } catch (err: any) { alert(err.message) }
  }

  const handleDeletePost = async (id: any) => {
    if (window.confirm('Delete this post?')) {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) alert(error.message)
      else setPosts(posts.filter(p => p.id !== id))
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

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
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

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
    { id: 'events', label: 'Events Page' },
    { id: 'conference', label: 'Conference' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className={`
        w-72 bg-brand-dark text-white p-8 flex flex-col fixed h-full z-20
        transition-all duration-700
        ${isLoaded ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="mb-12 flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center">
            <span className="material-icons text-white text-2xl">shield_person</span>
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
              <span className="material-icons text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => router.push('/contact')}
          className="mt-auto flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-colors font-black text-xs uppercase tracking-widest"
        >
          <span className="material-icons text-xl">logout</span>
          Exit Admin
        </button>
      </aside>

      <main className={`
        flex-1 ml-72 p-12 transition-all duration-[800ms] delay-300
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}>
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
              <span className="material-icons">notifications</span>
              <span className="absolute top-3 right-3 w-2 h-2 bg-brand-purple rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#fffbbd] flex items-center justify-center text-brand-dark">
                <span className="material-icons text-sm">person_pin</span>
              </div>
              <span className="font-black text-[10px] uppercase tracking-widest text-brand-dark">{siteSettings.adminName}</span>
            </div>
          </div>
        </header>

        {activeTab === 'content' && (
          <div className="space-y-8">
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
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Subtitle</label>
                        <input 
                          type="text"
                          value={pageContent.home.heroSubtitle}
                          onChange={(e) => setPageContent({...pageContent, home: {...pageContent.home, heroSubtitle: e.target.value}})}
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
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="font-black text-brand-dark uppercase text-sm">Hero Background Video</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[300px]">URL: {heroVideoUrl}</p>
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
                    </div>

                    <div className="pt-10 border-t border-slate-100">
                      <h4 className="text-brand-purple font-black text-xs uppercase tracking-widest mb-8">Quick Menu Icons</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pageContent.home.menuItems?.map((item: any, idx: number) => (
                          <div key={idx} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
                            <div className="flex flex-col gap-4">
                              <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative group mx-auto">
                                {item.iconUrl ? (
                                  <img src={item.iconUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="material-icons text-2xl text-brand-purple">{item.icon}</span>
                                )}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                  <span className="material-icons text-white text-sm">upload</span>
                                  <input 
                                    type="file" className="hidden" accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (!file) return
                                      setIsUploading(true)
                                      try {
                                        const { data, error } = await supabase.storage.from('gallery').upload(`menu/${Date.now()}-${file.name}`, file)
                                        if (error) throw error
                                        const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(data.path)
                                        const items = [...pageContent.home.menuItems];
                                        items[idx].iconUrl = publicUrl;
                                        setPageContent({...pageContent, home: {...pageContent.home, menuItems: items}});
                                      } catch (err: any) { alert(err.message) }
                                      finally { setIsUploading(false) }
                                    }}
                                  />
                                </label>
                              </div>
                              <div className="space-y-2">
                                <input 
                                  type="text" value={item.label}
                                  onChange={(e) => {
                                    const items = [...pageContent.home.menuItems];
                                    items[idx].label = e.target.value;
                                    setPageContent({...pageContent, home: {...pageContent.home, menuItems: items}});
                                  }}
                                  className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand-purple font-black text-xs uppercase text-center"
                                />
                                <input 
                                  type="text" value={item.subLabel}
                                  onChange={(e) => {
                                    const items = [...pageContent.home.menuItems];
                                    items[idx].subLabel = e.target.value;
                                    setPageContent({...pageContent, home: {...pageContent.home, menuItems: items}});
                                  }}
                                  className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand-purple font-bold text-[9px] uppercase tracking-widest text-slate-400 text-center"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100">
                      <h4 className="text-brand-purple font-black text-xs uppercase tracking-widest mb-8">Journey Section Items</h4>
                      <div className="space-y-6">
                        {pageContent.home.journeyItems?.map((item: any, idx: number) => (
                          <div key={idx} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
                            <button 
                              type="button"
                              onClick={() => {
                                const items = [...pageContent.home.journeyItems];
                                items.splice(idx, 1);
                                setPageContent({...pageContent, home: {...pageContent.home, journeyItems: items}});
                              }}
                              className="absolute top-6 right-6 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <span className="material-icons text-sm">delete</span>
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Icon Image</label>
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm flex items-center justify-center">
                                    {item.iconUrl ? (
                                      <img src={item.iconUrl} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="material-icons text-slate-300">{item.icon}</span>
                                    )}
                                  </div>
                                  <label className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-300 transition-colors">
                                    Upload
                                    <input 
                                      type="file" className="hidden" accept="image/*"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        setIsUploading(true)
                                        try {
                                          const { data, error } = await supabase.storage.from('gallery').upload(`icons/${Date.now()}-${file.name}`, file)
                                          if (error) throw error
                                          const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(data.path)
                                          const items = [...pageContent.home.journeyItems];
                                          items[idx].iconUrl = publicUrl;
                                          setPageContent({...pageContent, home: {...pageContent.home, journeyItems: items}});
                                        } catch (err: any) { alert(err.message) }
                                        finally { setIsUploading(false) }
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Icon Name (Text)</label>
                                <input 
                                  type="text"
                                  value={item.icon}
                                  onChange={(e) => {
                                    const items = [...pageContent.home.journeyItems];
                                    items[idx].icon = e.target.value;
                                    setPageContent({...pageContent, home: {...pageContent.home, journeyItems: items}});
                                  }}
                                  className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand-purple font-bold text-xs"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                <input 
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => {
                                    const items = [...pageContent.home.journeyItems];
                                    items[idx].title = e.target.value;
                                    setPageContent({...pageContent, home: {...pageContent.home, journeyItems: items}});
                                  }}
                                  className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand-purple font-bold text-xs"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Desc</label>
                                <input 
                                  type="text"
                                  value={item.desc}
                                  onChange={(e) => {
                                    const items = [...pageContent.home.journeyItems];
                                    items[idx].desc = e.target.value;
                                    setPageContent({...pageContent, home: {...pageContent.home, journeyItems: items}});
                                  }}
                                  className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand-purple font-bold text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => {
                            const items = [...(pageContent.home.journeyItems || [])];
                            items.push({ icon: 'star', title: 'NEW ITEM', desc: 'DESCRIPTION' });
                            setPageContent({...pageContent, home: {...pageContent.home, journeyItems: items}});
                          }}
                          className="w-full py-5 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-brand-purple hover:text-brand-purple transition-all"
                        >
                          + Add Journey Item
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activePage === 'about' && (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title</label>
                        <input 
                          type="text"
                          value={pageContent.about.heroTitle}
                          onChange={(e) => setPageContent({...pageContent, about: {...pageContent.about, heroTitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vision Title</label>
                        <input 
                          type="text"
                          value={pageContent.about.visionTitle}
                          onChange={(e) => setPageContent({...pageContent, about: {...pageContent.about, visionTitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="font-black text-brand-dark uppercase text-sm">About Section Image</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Featured vision photo</p>
                        </div>
                        <label className="px-6 py-3 bg-brand-purple text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform">
                          Upload Photo
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setIsUploading(true)
                              try {
                                const { data, error } = await supabase.storage.from('gallery').upload(`about/${Date.now()}-${file.name}`, file)
                                if (error) throw error
                                const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(data.path)
                                setAboutImageUrl(publicUrl)
                              } catch (err: any) { alert(err.message) }
                              finally { setIsUploading(false) }
                            }}
                          />
                        </label>
                      </div>
                      <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-slate-200">
                        <img src={aboutImageUrl} alt="About preview" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vision Description</label>
                      <textarea 
                        value={pageContent.about.visionDesc}
                        onChange={(e) => setPageContent({...pageContent, about: {...pageContent.about, visionDesc: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold h-32"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quote</label>
                      <textarea 
                        value={pageContent.about.quote}
                        onChange={(e) => setPageContent({...pageContent, about: {...pageContent.about, quote: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold h-24 italic"
                      />
                    </div>

                    <div className="pt-10 border-t border-slate-100">
                      <h4 className="text-brand-purple font-black text-xs uppercase tracking-widest mb-8">Our Beliefs</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pageContent.about.beliefs?.map((item: any, idx: number) => (
                          <div key={idx} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
                            <button 
                              type="button"
                              onClick={() => {
                                const items = [...pageContent.about.beliefs];
                                items.splice(idx, 1);
                                setPageContent({...pageContent, about: {...pageContent.about, beliefs: items}});
                              }}
                              className="absolute top-6 right-6 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <span className="material-icons text-xs">delete</span>
                            </button>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm flex items-center justify-center">
                                  {item.iconUrl ? (
                                    <img src={item.iconUrl} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="material-icons text-slate-300">{item.icon}</span>
                                  )}
                                </div>
                                <label className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-300 transition-colors">
                                  Icon Image
                                  <input 
                                    type="file" className="hidden" accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (!file) return
                                      setIsUploading(true)
                                      try {
                                        const { data, error } = await supabase.storage.from('gallery').upload(`icons/${Date.now()}-${file.name}`, file)
                                        if (error) throw error
                                        const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(data.path)
                                        const items = [...pageContent.about.beliefs];
                                        items[idx].iconUrl = publicUrl;
                                        setPageContent({...pageContent, about: {...pageContent.about, beliefs: items}});
                                      } catch (err: any) { alert(err.message) }
                                      finally { setIsUploading(false) }
                                    }}
                                  />
                                </label>
                              </div>
                              <input 
                                type="text"
                                placeholder="Default Icon Name"
                                value={item.icon}
                                onChange={(e) => {
                                  const items = [...pageContent.about.beliefs];
                                  items[idx].icon = e.target.value;
                                  setPageContent({...pageContent, about: {...pageContent.about, beliefs: items}});
                                }}
                                className="w-full px-4 py-2 bg-white border border-slate-100 rounded-lg focus:outline-none focus:border-brand-purple font-bold text-[10px]"
                              />
                              <input 
                                type="text"
                                placeholder="Title"
                                value={item.title}
                                onChange={(e) => {
                                  const items = [...pageContent.about.beliefs];
                                  items[idx].title = e.target.value;
                                  setPageContent({...pageContent, about: {...pageContent.about, beliefs: items}});
                                }}
                                className="w-full px-4 py-2 bg-white border border-slate-100 rounded-lg focus:outline-none focus:border-brand-purple font-bold text-[10px]"
                              />
                              <textarea 
                                placeholder="Description"
                                value={item.desc}
                                onChange={(e) => {
                                  const items = [...pageContent.about.beliefs];
                                  items[idx].desc = e.target.value;
                                  setPageContent({...pageContent, about: {...pageContent.about, beliefs: items}});
                                }}
                                className="w-full px-4 py-2 bg-white border border-slate-100 rounded-lg focus:outline-none focus:border-brand-purple font-bold text-[10px] h-20"
                              />
                            </div>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => {
                            const items = [...(pageContent.about.beliefs || [])];
                            items.push({ icon: 'menu_book', title: 'New Belief', desc: 'Description' });
                            setPageContent({...pageContent, about: {...pageContent.about, beliefs: items}});
                          }}
                          className="h-full min-h-[200px] bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-brand-purple hover:text-brand-purple transition-all"
                        >
                          + Add Belief
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activePage === 'events' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title</label>
                        <input 
                          type="text"
                          value={pageContent.events.heroTitle}
                          onChange={(e) => setPageContent({...pageContent, events: {...pageContent.events, heroTitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Subtitle</label>
                        <input 
                          type="text"
                          value={pageContent.events.heroSubtitle}
                          onChange={(e) => setPageContent({...pageContent, events: {...pageContent.events, heroSubtitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activePage === 'conference' && (
                  <div className="space-y-12">
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

                    <div className="pt-10 border-t border-slate-100">
                      <h4 className="text-brand-purple font-black text-xs uppercase tracking-widest mb-8">Speakers</h4>
                      <div className="space-y-6">
                        {pageContent.conference.speakers?.map((item: any, idx: number) => (
                          <div key={idx} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
                            <button 
                              type="button"
                              onClick={() => {
                                const items = [...pageContent.conference.speakers];
                                items.splice(idx, 1);
                                setPageContent({...pageContent, conference: {...pageContent.conference, speakers: items}});
                              }}
                              className="absolute top-6 right-6 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <span className="material-icons text-sm">delete</span>
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Speaker Name</label>
                                <input 
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => {
                                    const items = [...pageContent.conference.speakers];
                                    items[idx].name = e.target.value;
                                    setPageContent({...pageContent, conference: {...pageContent.conference, speakers: items}});
                                  }}
                                  className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand-purple font-bold text-xs"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role/Subtitle</label>
                                <input 
                                  type="text"
                                  value={item.role}
                                  onChange={(e) => {
                                    const items = [...pageContent.conference.speakers];
                                    items[idx].role = e.target.value;
                                    setPageContent({...pageContent, conference: {...pageContent.conference, speakers: items}});
                                  }}
                                  className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand-purple font-bold text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => {
                            const items = [...(pageContent.conference.speakers || [])];
                            items.push({ name: 'New Speaker', role: 'To be announced' });
                            setPageContent({...pageContent, conference: {...pageContent.conference, speakers: items}});
                          }}
                          className="w-full py-5 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-brand-purple hover:text-brand-purple transition-all"
                        >
                          + Add Speaker
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activePage === 'contact' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Info Description</label>
                      <textarea 
                        value={pageContent.contact.infoDesc}
                        onChange={(e) => setPageContent({...pageContent, contact: {...pageContent.contact, infoDesc: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple font-bold h-32"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-brand-purple uppercase tracking-widest ml-1">Address Label</label>
                        <input 
                          type="text"
                          value={pageContent.contact.addressTitle}
                          onChange={(e) => setPageContent({...pageContent, contact: {...pageContent.contact, addressTitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-brand-purple uppercase tracking-widest ml-1">Address Details</label>
                        <input 
                          type="text"
                          value={pageContent.contact.addressDetail}
                          onChange={(e) => setPageContent({...pageContent, contact: {...pageContent.contact, addressDetail: e.target.value}})}
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-brand-purple uppercase tracking-widest ml-1">Email Label</label>
                        <input 
                          type="text"
                          value={pageContent.contact.emailTitle}
                          onChange={(e) => setPageContent({...pageContent, contact: {...pageContent.contact, emailTitle: e.target.value}})}
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-brand-purple uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                          type="text"
                          value={pageContent.contact.emailDetail}
                          onChange={(e) => setPageContent({...pageContent, contact: {...pageContent.contact, emailDetail: e.target.value}})}
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-purple font-bold"
                        />
                      </div>
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
                      <span className="material-icons text-sm">delete</span>
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
                    <span className="material-icons text-4xl text-brand-purple">add_photo_alternate</span>
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
                      <span className="material-icons text-sm">delete</span>
                      Remove Image
                    </button>
                  </div>
                </div>
              ))}
              
              {gallery.length === 0 && !isUploading && (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <span className="material-icons text-4xl text-slate-200 mb-4">image_not_supported</span>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No images in gallery yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-10">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight mb-8">Site Branding</h3>
              <div className="space-y-8">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="font-black text-brand-dark uppercase text-sm">Favicon (Tab Icon)</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Recommended: 64x64 PNG or ICO</p>
                    </div>
                    <label className="px-6 py-3 bg-brand-purple text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform">
                      Upload Icon
                      <input 
                        type="file" className="hidden" accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setIsUploading(true)
                          try {
                            const fileExt = file.name.split('.').pop()
                            const { data, error } = await supabase.storage.from('gallery').upload(`branding/favicon-${Date.now()}.${fileExt}`, file)
                            if (error) throw error
                            const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(data.path)
                            setSiteSettings({...siteSettings, faviconUrl: publicUrl})
                            alert('Icon uploaded! Please click "Save Branding Changes" to apply.')
                          } catch (err: any) { alert(err.message) }
                          finally { setIsUploading(false) }
                        }}
                      />
                    </label>
                  </div>
                  {siteSettings.faviconUrl && (
                    <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
                      <img src={siteSettings.faviconUrl} className="w-full h-full object-contain" alt="Favicon preview" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Display Name</label>
                    <input 
                      type="text" 
                      value={siteSettings.adminName}
                      onChange={(e) => setSiteSettings({...siteSettings, adminName: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-purple transition-all font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-12">
          <button 
            onClick={handleSaveContent}
            className="flex-grow py-6 bg-brand-purple text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-purple/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <span className="material-icons text-base">cloud_upload</span>
            SAVE CHANGES & PUBLISH TO SITE
          </button>
          <button 
            onClick={handleResetDefaults}
            className="px-10 py-6 bg-slate-100 text-slate-400 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            RESET
          </button>
        </div>
      </main>
    </div>
  )
}
