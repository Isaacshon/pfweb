'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { notifySiteSettingsPublished } from '@/lib/liveSiteSettings'

type AdminNotice = {
  type: 'success' | 'error' | 'info'
  title: string
  detail?: string
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone = 'purple',
}: {
  icon: string
  label: string
  value: string | number
  detail: string
  tone?: 'purple' | 'dark' | 'yellow' | 'emerald' | 'blue'
}) {
  const toneClass = {
    purple: 'bg-[#efe9ff] text-[#6f56c9]',
    dark: 'bg-[#101828] text-white',
    yellow: 'bg-[#fff4bf] text-[#8a6900]',
    emerald: 'bg-[#dff8ea] text-[#138a4b]',
    blue: 'bg-[#e3f0ff] text-[#2563eb]',
  }[tone]

  return (
    <article className="rounded-[1.6rem] bg-white p-5 shadow-[0_20px_50px_rgba(81,92,122,0.10)] ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold text-slate-500">{label}</p>
          <p className="mt-3 font-mono text-3xl font-black leading-none text-[#111827]">{value}</p>
        </div>
        <span className={`material-icons flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${toneClass}`}>
          {icon}
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold leading-relaxed text-slate-500">{detail}</p>
    </article>
  )
}

function EmptyState({ icon, title, detail }: { icon: string; title: string; detail: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white/70 p-8 text-center">
      <span className="material-icons text-4xl text-slate-300">{icon}</span>
      <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-brand-dark">{title}</p>
      <p className="mt-2 text-xs font-bold leading-relaxed text-slate-500">{detail}</p>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string
  title: string
  detail?: string
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-extrabold text-[#7b61d1]">{eyebrow}</p>
        <h3 className="mt-2 text-2xl font-black text-[#111827]">{title}</h3>
      </div>
      {detail && <p className="max-w-md text-sm font-semibold leading-relaxed text-slate-500">{detail}</p>}
    </div>
  )
}

const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const focusRingClass = 'focus:outline-none focus:ring-4 focus:ring-brand-purple/15 focus:border-brand-purple'

function validateImageFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return 'Please upload a JPG, PNG, WEBP, or GIF image.'
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return 'Please keep image uploads under 5MB.'
  }

  return ''
}

function buildStoragePath(file: File, folder: string) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeBase = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'upload'
  const uniqueId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return `${folder}/${safeBase}-${uniqueId}.${extension}`
}

function extractGalleryStoragePath(url: string) {
  const marker = '/gallery/'
  const path = url.includes(marker) ? url.split(marker).pop() : url.split('/').pop()
  return path ? decodeURIComponent(path.split('?')[0]) : ''
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activePage, setActivePage] = useState('home')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [lastSyncedAt, setLastSyncedAt] = useState('')
  const [notice, setNotice] = useState<AdminNotice | null>(null)
  const router = useRouter()

  // --- Real State (Functional) ---
  const [posts, setPosts] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [todayAttendance, setTodayAttendance] = useState<any[]>([])
  const [todayVisitors, setTodayVisitors] = useState(0)
  const [visitorDate, setVisitorDate] = useState('')
  const [worshipSets, setWorshipSets] = useState<any[]>([])
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
        { icon: 'event', label: 'Conference', subLabel: '2026 Conf', href: '/conference', iconUrl: '' },
        { icon: 'campaign', label: 'Events', subLabel: 'Kingdom News', href: '/events', iconUrl: '' },
        { icon: 'groups', label: 'About', subLabel: 'Our Story', href: '/about', iconUrl: '' },
        { icon: 'visibility', label: 'Vision', subLabel: 'Our Vision', href: '/about', iconUrl: '' },
        { icon: 'mail', label: 'Contact', subLabel: 'Get in Touch', href: '/contact', iconUrl: '' },
        { icon: 'favorite', label: 'Support', subLabel: 'Sponsorship', href: '/contact', iconUrl: '' }
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
      heroDate: 'August 13-15, 2026',
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
  const [postSearch, setPostSearch] = useState('')

  const showNotice = (nextNotice: AdminNotice) => {
    setNotice(nextNotice)
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      if (!response.ok) return

      const result = await response.json()
      if (result?.ok) {
        setTodayVisitors(Number(result.todayVisitors || 0))
        setVisitorDate(String(result.date || ''))
      }
    } catch {
      // Analytics is secondary; do not block the admin dashboard.
    }
  }

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/session', { method: 'DELETE' })
    } finally {
      router.push('/')
    }
  }

  useEffect(() => {
    setIsLoaded(true)
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setIsFetching(true)
    try {
      const [
        { data: galleryData, error: galleryError },
        { data: postsData, error: postsError },
        { data: settingsData, error: settingsError },
      ] = await Promise.all([
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('posts').select('*').order('date', { ascending: false }),
        supabase.from('site_settings').select('*'),
      ])

      if (galleryError) throw galleryError
      if (postsError) throw postsError
      if (settingsError) throw settingsError

      if (galleryData) setGallery(galleryData)
      if (postsData) setPosts(postsData)

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

      const today = new Date().toLocaleDateString('en-CA')
      const [
        { data: profilesData },
        { data: attendanceData },
        { data: worshipData },
      ] = await Promise.all([
        supabase.from('profiles').select('id, nickname, username, role').limit(200),
        supabase.from('attendance').select('user_id, service_date').eq('service_date', today),
        supabase.from('worship_sets').select('id, title, date, songs, team_members').order('date', { ascending: false }).limit(5),
      ])

      if (profilesData) setProfiles(profilesData)
      if (attendanceData) setTodayAttendance(attendanceData)
      if (worshipData) setWorshipSets(worshipData)
      await fetchAnalytics()
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    } catch (error: any) {
      showNotice({
        type: 'error',
        title: 'Sync failed',
        detail: error?.message || 'Could not load Supabase content.',
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleSaveContent = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault()
    setIsUploading(true)
    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'page_content', value: pageContent },
            { key: 'map_address', value: mapAddress },
            { key: 'hero_video', value: heroVideoUrl },
            { key: 'about_image', value: aboutImageUrl },
            { key: 'admin_settings', value: siteSettings },
          ],
        }),
      })

      const result = await response.json().catch(() => null)
      if (!response.ok || result?.ok === false) {
        throw new Error(result?.message || 'Could not save changes.')
      }

      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      notifySiteSettingsPublished()
      showNotice({
        type: 'success',
        title: 'Published',
        detail: 'Site content and branding settings were saved to Supabase.',
      })
    } catch (error: any) {
      showNotice({
        type: 'error',
        title: 'Publish failed',
        detail: error?.message || 'Could not save changes.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleResetDefaults = async () => {
    if (window.confirm('Are you sure you want to reset all content to original values?')) {
      setPageContent(defaultPageContent)
      setMapAddress('Toronto, Ontario, Canada')
      setHeroVideoUrl('/hero-video.mp4')
      showNotice({
        type: 'info',
        title: 'Reset staged',
        detail: 'Default content is loaded locally. Publish to apply it to the live site.',
      })
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
          date: new Date().toLocaleDateString('en-CA'),
          type: 'notice',
        }])
        .select()
      
      if (error) throw error
      if (data) setPosts([data[0], ...posts])
      setNewPost({ title: '', content: '' })
      showNotice({
        type: 'success',
        title: 'Post created',
        detail: newPost.title,
      })
    } catch (err: any) {
      showNotice({
        type: 'error',
        title: 'Post failed',
        detail: err?.message || 'Could not create post.',
      })
    }
  }

  const handleDeletePost = async (id: any) => {
    if (window.confirm('Delete this post?')) {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) {
        showNotice({ type: 'error', title: 'Delete failed', detail: error.message })
      } else {
        setPosts(posts.filter(p => p.id !== id))
        showNotice({ type: 'success', title: 'Post deleted', detail: 'The board post was removed.' })
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      showNotice({
        type: 'error',
        title: 'Upload blocked',
        detail: validationError,
      })
      e.target.value = ''
      return
    }

    setIsUploading(true)
    try {
      const filePath = buildStoragePath(file, 'gallery')

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
      showNotice({
        type: 'success',
        title: 'Image uploaded',
        detail: file.name,
      })
    } catch (error: any) {
      showNotice({
        type: 'error',
        title: 'Upload failed',
        detail: error?.message || 'Could not upload image.',
      })
    } finally {
      setIsUploading(false)
      e.target.value = ''
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

      const storagePath = extractGalleryStoragePath(url)
      if (storagePath) {
        const { error: storageError } = await supabase.storage.from('gallery').remove([storagePath])
        if (storageError) {
          showNotice({
            type: 'info',
            title: 'Image removed from database',
            detail: `Storage cleanup warning: ${storageError.message}`,
          })
          setGallery(gallery.filter(item => item.id !== id))
          return
        }
      }

      setGallery(gallery.filter(item => item.id !== id))
      showNotice({
        type: 'success',
        title: 'Image removed',
        detail: 'The gallery item was removed from Supabase.',
      })
    } catch (error: any) {
      showNotice({
        type: 'error',
        title: 'Delete failed',
        detail: error?.message || 'Could not delete image.',
      })
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

  const currentTab = menuItems.find(item => item.id === activeTab)
  const recentPosts = posts.slice(0, 4)
  const recentGallery = gallery.slice(0, 6)
  const filteredPosts = posts.filter(post => {
    const query = postSearch.trim().toLowerCase()
    if (!query) return true
    return [post.title, post.content, post.author, post.date]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(query))
  })
  const completedChecks = [
    posts.length > 0,
    gallery.length > 0,
    Boolean(heroVideoUrl),
    Boolean(siteSettings.faviconUrl),
    !isFetching,
  ].filter(Boolean).length
  const healthScore = Math.round((completedChecks / 5) * 100)
  const leaderCount = profiles.filter(profile => profile.role === 'leader').length
  const worshipTeamCount = profiles.filter(profile => profile.role === 'worship_team').length
  const nextWorshipSet = worshipSets
    .slice()
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0]
  const nextSetSongs = Array.isArray(nextWorshipSet?.songs) ? nextWorshipSet.songs : []
  const nextSetTeam = Array.isArray(nextWorshipSet?.team_members) ? nextWorshipSet.team_members : []
  const missingSheets = nextSetSongs.filter((song: any) => !song?.sheetUrl).length
  const activePageMeta = pages.find(page => page.id === activePage)
  const contentStatus = pages.map(page => {
    const value = pageContent[page.id]
    const filledFields = value && typeof value === 'object'
      ? Object.values(value).filter(Boolean).length
      : 0

    return {
      ...page,
      status: filledFields > 0 ? 'Ready' : 'Needs content',
      count: filledFields,
    }
  })
  const actionItems = [
    {
      title: 'Review home hero',
      detail: pageContent.home?.heroTitle || 'Home title missing',
      icon: 'home',
      onClick: () => {
        setActiveTab('content')
        setActivePage('home')
      },
    },
    {
      title: 'Update conference',
      detail: pageContent.conference?.heroDate || 'Conference date missing',
      icon: 'event',
      onClick: () => {
        setActiveTab('content')
        setActivePage('conference')
      },
    },
    {
      title: 'Manage gallery',
      detail: `${gallery.length} images online`,
      icon: 'photo_library',
      onClick: () => setActiveTab('gallery'),
    },
    {
      title: 'Brand settings',
      detail: siteSettings.faviconUrl ? 'Favicon uploaded' : 'Favicon missing',
      icon: 'tune',
      onClick: () => setActiveTab('settings'),
    },
  ]
  const readyPageCount = contentStatus.filter(page => page.status === 'Ready').length
  const dashboardBars = [32, 48, 38, 62, healthScore, 58, 72, Math.max(44, Math.min(96, healthScore + 18))]
  const noticeClass = notice?.type === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : notice?.type === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-brand-purple/20 bg-brand-purple/10 text-brand-dark'

  return (
    <div className="min-h-screen bg-[#e9eef7] font-sans text-[#111827] lg:grid lg:grid-cols-[236px_1fr] lg:p-5">
      <aside className={`
        z-30 bg-white text-[#111827] shadow-[0_26px_80px_rgba(81,92,122,0.14)] lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:rounded-[2rem]
        transition-all duration-700
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="flex items-center justify-between gap-4 px-5 py-5 lg:flex-col lg:items-stretch lg:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f56c9] shadow-lg shadow-[#6f56c9]/30">
              <span className="material-icons text-2xl text-white">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="text-xl font-black uppercase leading-none">PF Admin</h1>
              <p className="mt-1 text-[11px] font-extrabold text-slate-400">Operations</p>
            </div>
          </div>

          <button
            onClick={() => fetchInitialData()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f1f4f9] px-4 py-3 text-[11px] font-black text-[#111827] transition hover:bg-[#e7ebf4] lg:mt-6"
          >
            <span className={`material-icons text-sm ${isFetching ? 'animate-spin' : ''}`}>sync</span>
            Sync
          </button>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-5 pb-5 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:px-7 lg:pb-7 [&::-webkit-scrollbar]:hidden">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                flex min-w-max items-center gap-3 rounded-2xl px-5 py-4 text-[11px] font-black transition-all
                ${activeTab === item.id ? 'bg-[#6f56c9] text-white shadow-lg shadow-[#6f56c9]/30' : 'text-slate-500 hover:bg-[#f1f4f9] hover:text-[#111827]'}
              `}
            >
              <span className="material-icons text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden px-7 pb-7 lg:block">
          <div className="rounded-[1.5rem] bg-[#f6f7fb] p-5 ring-1 ring-slate-200/70">
            <p className="text-[11px] font-black text-[#8a6900]">Live status</p>
            <p className="mt-3 text-3xl font-black leading-none">{healthScore}%</p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">
              {lastSyncedAt ? `Synced ${lastSyncedAt}` : 'Waiting for first sync'}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-[#6f56c9]" style={{ width: `${healthScore}%` }} />
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#111827] px-5 py-4 text-[11px] font-black text-white transition hover:bg-[#252f44]"
          >
            <span className="material-icons text-base">open_in_new</span>
            View site
          </button>

          <button
            onClick={handleAdminLogout}
            className="mt-3 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#f1f4f9] px-5 py-4 text-[11px] font-black text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="material-icons text-base">logout</span>
            Log out
          </button>
        </div>
      </aside>

      <main className={`
        mx-auto min-w-0 w-full max-w-[1500px] px-5 py-6 transition-all duration-[800ms] delay-300 sm:px-7 lg:px-8 lg:py-0 xl:px-10
        ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}>
        <header className="mb-7 rounded-[2rem] bg-white/90 p-5 shadow-[0_26px_80px_rgba(81,92,122,0.12)] backdrop-blur md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-[#7b61d1]">Control center</p>
              <h2 className="mt-2 text-3xl font-black text-[#111827] md:text-5xl">
                {currentTab?.label}
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-slate-500">
                Welcome back, {siteSettings.adminName}. Manage public content, media, posts, and branding from one workspace.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center">
              <Link
                href="/conference/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#fff7bf] px-4 py-3 text-[11px] font-black text-[#111827] transition hover:scale-[1.01] active:scale-95"
              >
                <span className="material-icons text-base">how_to_reg</span>
                Register
              </Link>
              <button
                onClick={() => setActiveTab('content')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 text-[11px] font-black text-white transition hover:scale-[1.01] active:scale-95"
              >
                <span className="material-icons text-base">edit_note</span>
                Edit site
              </button>
              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f1f4f9] px-4 py-3 text-[11px] font-black text-slate-600 transition hover:bg-red-50 hover:text-red-600 active:scale-95"
              >
                <span className="material-icons text-base">logout</span>
                Exit
              </button>
            </div>
          </div>

          {notice && (
            <div className={`mt-5 flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 ${noticeClass}`}>
              <div className="flex gap-3">
                <span className="material-icons text-lg">
                  {notice.type === 'success' ? 'check_circle' : notice.type === 'error' ? 'error' : 'info'}
                </span>
                <div>
                  <p className="text-sm font-black">{notice.title}</p>
                  {notice.detail && <p className="mt-1 text-xs font-bold leading-relaxed opacity-80">{notice.detail}</p>}
                </div>
              </div>
              <button
                onClick={() => setNotice(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/60"
                aria-label="Dismiss notice"
              >
                <span className="material-icons text-sm">close</span>
              </button>
            </div>
          )}
        </header>

        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:p-7">
              <SectionHeader
                eyebrow="Site content"
                title={`Editing ${activePageMeta?.label || 'Page'}`}
                detail="Choose a page, update the fields, then publish when the preview content looks right."
              />
              <div className="mt-6 flex gap-3 overflow-x-auto rounded-2xl bg-slate-100 p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {pages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page.id)}
                    className={`min-w-max rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activePage === page.id ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-500 hover:text-brand-dark'}`}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:p-8">
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
                              } catch (err: any) { showNotice({ type: 'error', title: 'Video upload failed', detail: err?.message || 'Could not upload video.' }) }
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
                                  <img src={item.iconUrl} alt={`${item.label} icon`} className="w-full h-full object-cover" />
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
                                      } catch (err: any) { showNotice({ type: 'error', title: 'Icon upload failed', detail: err?.message || 'Could not upload icon.' }) }
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
                                      <img src={item.iconUrl} alt={`${item.title} icon`} className="w-full h-full object-cover" />
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
                                        } catch (err: any) { showNotice({ type: 'error', title: 'Icon upload failed', detail: err?.message || 'Could not upload icon.' }) }
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
                              } catch (err: any) { showNotice({ type: 'error', title: 'Photo upload failed', detail: err?.message || 'Could not upload photo.' }) }
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
                                    <img src={item.iconUrl} alt={`${item.title} icon`} className="w-full h-full object-cover" />
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
                                      } catch (err: any) { showNotice({ type: 'error', title: 'Icon upload failed', detail: err?.message || 'Could not upload icon.' }) }
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
          <div className="space-y-6">
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_370px]">
              <div className="space-y-6">
                <div className="rounded-[2.2rem] bg-white p-4 shadow-[0_28px_90px_rgba(81,92,122,0.14)] ring-1 ring-white/80">
                  <div className="rounded-[1.8rem] bg-gradient-to-br from-[#6f56c9] via-[#8b69df] to-[#f374a6] p-6 text-white md:p-7">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-white/65">Overview</p>
                        <h3 className="mt-2 text-3xl font-black">Publishing health</h3>
                      </div>
                      <span className="w-fit rounded-2xl bg-white/15 px-4 py-2 text-xs font-black text-white ring-1 ring-white/20">
                        {lastSyncedAt ? `Synced ${lastSyncedAt}` : 'Sync pending'}
                      </span>
                    </div>

                    <div className="mt-8 h-44 rounded-[1.5rem] bg-white/10 p-4 ring-1 ring-white/15">
                      <div className="flex h-full items-end gap-3">
                        {dashboardBars.map((height, index) => (
                          <div key={`${height}-${index}`} className="flex flex-1 flex-col justify-end gap-2">
                            <div
                              className={`rounded-t-2xl ${index === 4 ? 'bg-[#fff7bf]' : 'bg-white/45'}`}
                              style={{ height: `${height}%` }}
                            />
                            <span className="h-1 rounded-full bg-white/20" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.35rem] bg-white/15 p-4 ring-1 ring-white/15">
                        <p className="text-xs font-semibold text-white/65">Pages ready</p>
                        <p className="mt-2 font-mono text-2xl font-black">{readyPageCount}/{contentStatus.length}</p>
                      </div>
                      <div className="rounded-[1.35rem] bg-white/15 p-4 ring-1 ring-white/15">
                        <p className="text-xs font-semibold text-white/65">Posts</p>
                        <p className="mt-2 font-mono text-2xl font-black">{posts.length}</p>
                      </div>
                      <div className="rounded-[1.35rem] bg-white/15 p-4 ring-1 ring-white/15">
                        <p className="text-xs font-semibold text-white/65">Gallery</p>
                        <p className="mt-2 font-mono text-2xl font-black">{gallery.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <MetricCard icon="article" label="Board posts" value={posts.length} detail="Public updates available on Events." tone="purple" />
                    <MetricCard icon="photo_library" label="Gallery" value={gallery.length} detail="Images stored in Supabase Storage." tone="dark" />
                    <MetricCard icon="groups" label="People" value={profiles.length || '-'} detail={`${leaderCount} leaders / ${worshipTeamCount} worship team`} tone="yellow" />
                    <MetricCard icon="fact_check" label="Today" value={todayAttendance.length || 0} detail="Attendance scans collected today." tone="emerald" />
                    <MetricCard icon="visibility" label="Visitors" value={todayVisitors} detail={`Unique site visitors${visitorDate ? ` on ${visitorDate}` : ' today'}.`} tone="blue" />
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(81,92,122,0.11)] ring-1 ring-slate-200/70 md:p-7">
                  <SectionHeader
                    eyebrow="Page readiness"
                    title="Content status"
                    detail="Use this as the publish checklist before pushing visible copy changes."
                  />
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {contentStatus.map(page => (
                      <button
                        key={page.id}
                        onClick={() => {
                          setActiveTab('content')
                          setActivePage(page.id)
                        }}
                        className="flex items-center justify-between gap-4 rounded-2xl bg-[#f6f7fb] px-4 py-3 text-left ring-1 ring-slate-200/70 transition hover:bg-white hover:ring-[#7b61d1]/40"
                      >
                        <span>
                          <span className="block text-sm font-black text-[#111827]">{page.label}</span>
                          <span className="mt-1 block text-[11px] font-semibold text-slate-400">{page.count} fields tracked</span>
                        </span>
                        <span className={`rounded-xl px-3 py-2 text-[10px] font-black ${page.status === 'Ready' ? 'bg-[#dff8ea] text-[#138a4b]' : 'bg-red-100 text-red-600'}`}>
                          {page.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(81,92,122,0.11)] ring-1 ring-slate-200/70">
                  <SectionHeader eyebrow="Quick post" title="Publish update" />
                  <form onSubmit={handleAddPost} className="mt-5 space-y-4">
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Post title"
                      className={`w-full rounded-2xl border border-slate-200 bg-[#f6f7fb] px-5 py-4 text-sm font-semibold text-[#111827] transition focus:bg-white ${focusRingClass}`}
                    />
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Write the update"
                      className={`h-32 w-full resize-none rounded-2xl border border-slate-200 bg-[#f6f7fb] px-5 py-4 text-sm font-semibold leading-relaxed text-[#111827] transition focus:bg-white ${focusRingClass}`}
                    />
                    <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-6 py-4 text-[11px] font-black text-white transition hover:translate-y-[-1px] active:scale-95">
                      <span className="material-icons text-base">send</span>
                      Create post
                    </button>
                  </form>
                </div>

                <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(81,92,122,0.11)] ring-1 ring-slate-200/70">
                  <SectionHeader eyebrow="Worship set" title={nextWorshipSet?.title || 'No set scheduled'} />
                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-[#f6f7fb] p-4">
                      <p className="font-mono text-2xl font-black">{nextSetSongs.length}</p>
                      <p className="mt-1 text-[10px] font-bold text-slate-400">Songs</p>
                    </div>
                    <div className="rounded-2xl bg-[#f6f7fb] p-4">
                      <p className="font-mono text-2xl font-black">{nextSetTeam.length}</p>
                      <p className="mt-1 text-[10px] font-bold text-slate-400">Team</p>
                    </div>
                    <div className="rounded-2xl bg-[#f6f7fb] p-4">
                      <p className="font-mono text-2xl font-black">{missingSheets}</p>
                      <p className="mt-1 text-[10px] font-bold text-slate-400">Sheets</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(81,92,122,0.11)] ring-1 ring-slate-200/70">
                  <SectionHeader eyebrow="Fast actions" title="Jump to work" />
                  <div className="mt-5 grid gap-3">
                    {actionItems.map(item => (
                      <button
                        key={item.title}
                        onClick={item.onClick}
                        className="flex items-center gap-4 rounded-2xl bg-[#f6f7fb] p-4 text-left transition hover:bg-[#efe9ff]"
                      >
                        <span className="material-icons flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f56c9] shadow-sm">{item.icon}</span>
                        <span>
                          <span className="block text-sm font-black text-[#111827]">{item.title}</span>
                          <span className="mt-1 block text-xs font-semibold text-slate-500">{item.detail}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(81,92,122,0.11)] ring-1 ring-slate-200/70">
                <SectionHeader eyebrow="Recent posts" title="Latest board updates" />
                <div className="mt-5 space-y-3">
                  {recentPosts.length > 0 ? recentPosts.map(post => (
                    <div key={post.id} className="rounded-2xl bg-[#f6f7fb] p-4">
                      <p className="text-sm font-black text-brand-dark">{post.title}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{post.date} / {post.author || 'PF Leader'}</p>
                    </div>
                  )) : (
                    <EmptyState icon="forum" title="No posts yet" detail="Create the first board update from the quick post panel." />
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(81,92,122,0.11)] ring-1 ring-slate-200/70">
                <SectionHeader eyebrow="Recent gallery" title="Latest media" />
                {recentGallery.length > 0 ? (
                  <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 xl:grid-cols-3">
                    {recentGallery.map(item => (
                      <div key={item.id} className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
                        <img src={item.url} alt={item.title || 'Gallery image'} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5">
                    <EmptyState icon="image_not_supported" title="Gallery empty" detail="Upload ministry photos from the Gallery tab." />
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Board Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeader
                  eyebrow="Board posts"
                  title="Public updates"
                  detail={`${filteredPosts.length} shown / ${posts.length} total`}
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <span className="material-icons pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400">search</span>
                    <input
                      type="search"
                      value={postSearch}
                      onChange={(e) => setPostSearch(e.target.value)}
                      placeholder="Search posts"
                      className={`w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-brand-dark transition sm:w-72 ${focusRingClass}`}
                    />
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-dark px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:scale-[1.01] active:scale-95"
                  >
                    <span className="material-icons text-base">add</span>
                    Quick post
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              {filteredPosts.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filteredPosts.map(post => (
                    <article key={post.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="truncate text-sm font-black uppercase tracking-wide text-brand-dark">{post.title}</h4>
                          {post.type && (
                            <span className="rounded-full bg-brand-purple/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-brand-purple">
                              {post.type}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm font-bold leading-relaxed text-slate-500">{post.content}</p>
                        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                          {post.date || 'No date'} / {post.author || post.user || 'PF Leader'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <span className="material-icons text-sm">delete</span>
                        Delete
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="p-6">
                  <EmptyState icon="search_off" title="No matching posts" detail="Clear the search or create a new update from the dashboard." />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gallery Admin Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeader
                  eyebrow="Gallery admin"
                  title="Media library"
                  detail={`${gallery.length} images available for public pages and ministry moments.`}
                />
                {isUploading && (
                  <div className="inline-flex items-center gap-3 rounded-2xl bg-brand-purple/10 px-4 py-3">
                    <div className="h-4 w-4 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple">Uploading...</span>
                  </div>
                )}
              </div>
              
              <label className={`
                relative mt-6 flex min-h-56 w-full cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed transition-all duration-300
                ${isUploading ? 'pointer-events-none border-slate-200 bg-slate-50' : 'border-slate-200 bg-slate-50 hover:border-brand-purple hover:bg-brand-purple/5'}
              `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <span className="material-icons text-3xl text-brand-purple">add_photo_alternate</span>
                  </div>
                  <p className="mb-2 text-center text-sm font-black uppercase tracking-[0.2em] text-brand-dark">Drop images here or click</p>
                  <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">JPG, PNG, WEBP, GIF / max 5MB</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={isUploading} />
                
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-[2rem] bg-white/70 backdrop-blur-[2px]">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
                      <p className="text-xs font-black text-brand-purple uppercase tracking-widest">Processing...</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gallery.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img src={item.url} alt={item.title || 'Gallery image'} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <p className="min-w-0 truncate text-[10px] font-black uppercase tracking-widest text-slate-500">{item.title || 'Untitled'}</p>
                    <button
                      onClick={() => handleDeleteImage(item.id, item.url)}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                      aria-label={`Remove ${item.title || 'gallery image'}`}
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </article>
              ))}
              
              {gallery.length === 0 && !isUploading && (
                <div className="col-span-full">
                  <EmptyState icon="image_not_supported" title="No images yet" detail="Upload ministry photos to start the public gallery library." />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:p-7">
              <SectionHeader
                eyebrow="Settings"
                title="Brand and admin identity"
                detail="These values are saved with the rest of the site settings when you publish."
              />

              <div className="mt-7 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wide text-brand-dark">Favicon</h4>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">64x64 PNG/ICO recommended</p>
                    </div>
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      {siteSettings.faviconUrl ? (
                        <img src={siteSettings.faviconUrl} className="h-full w-full object-contain" alt="Favicon preview" />
                      ) : (
                        <span className="material-icons text-2xl text-slate-300">image</span>
                      )}
                    </div>
                  </div>

                  <label className="mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-purple px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:scale-[1.01] active:scale-95">
                    <span className="material-icons text-base">upload</span>
                    Upload icon
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        const validationError = validateImageFile(file)
                        if (validationError) {
                          showNotice({ type: 'error', title: 'Icon upload blocked', detail: validationError })
                          e.target.value = ''
                          return
                        }

                        setIsUploading(true)
                        try {
                          const { data, error } = await supabase.storage.from('gallery').upload(buildStoragePath(file, 'branding'), file)
                          if (error) throw error
                          const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(data.path)
                          setSiteSettings({...siteSettings, faviconUrl: publicUrl})
                          showNotice({ type: 'success', title: 'Icon uploaded', detail: 'Publish settings to apply the favicon.' })
                        } catch (err: any) {
                          showNotice({ type: 'error', title: 'Icon upload failed', detail: err?.message || 'Could not upload favicon.' })
                        } finally {
                          setIsUploading(false)
                          e.target.value = ''
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin display name</label>
                  <input
                    type="text"
                    value={siteSettings.adminName}
                    onChange={(e) => setSiteSettings({...siteSettings, adminName: e.target.value})}
                    className={`mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-brand-dark transition ${focusRingClass}`}
                  />
                  <p className="mt-3 text-xs font-bold leading-relaxed text-slate-500">
                    Used as the author name for admin board posts and the greeting in this workspace.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                <button
                  onClick={handleSaveContent}
                  disabled={isUploading}
                  className="inline-flex flex-1 items-center justify-center gap-3 rounded-2xl bg-brand-purple px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-brand-purple/20 transition hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-icons text-base">cloud_upload</span>
                  Publish settings
                </button>
                <button
                  onClick={handleResetDefaults}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                >
                  Reset defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
